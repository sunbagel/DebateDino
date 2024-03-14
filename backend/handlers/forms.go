package handlers

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"server/models"
	"slices"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// validate form response
// helper function
// takes a registration.Responses array and checks each question against the given question id
func (handler *RouteHandler) ValidateQuestionResponses(ctx context.Context, tournamentId primitive.ObjectID, registration models.Registration) error {

	// query tourney collection for tournament form
	tournamentCollection := handler.client.Database("debatedino").Collection("tournaments")

	var tournament models.Tournament
	if err := tournamentCollection.FindOne(ctx, bson.M{"_id": tournamentId}).Decode(&tournament); err != nil {
		fmt.Printf("Couldn't find tournament %s", tournamentId)
		return err
	}

	// validate form structure data
	form := tournament.Form
	if err := handler.validate.Struct(form); err != nil {
		fmt.Println("Form invalid")
		fmt.Println(form)
		return err
	}

	// validate form responses
	if err := ValidateResponses(form.Questions, registration.GeneralResponses); err != nil {
		return err
	}

	maxTeamSlots := tournament.MaxTeamSlots
	fmt.Printf("%d, %d", len(registration.Teams), maxTeamSlots)
	// validate # teams registered
	// would be good to return 404/422 on these instead of 500
	if len(registration.Teams) > maxTeamSlots {
		msg := fmt.Sprintf("limit of %d teams per registration. currently registering %d teams.",
			maxTeamSlots, len(registration.Teams))

		return errors.New(msg)

	} else if len(registration.Teams) <= 0 {
		msg := fmt.Sprintf("invalid number of teams. currently registering %d teams.", len(registration.Teams))

		return errors.New(msg)
	}
	debatersPerTeam := tournament.DebatersPerTeam
	// validate team responses
	for i, team := range registration.Teams {

		// validate # members per team
		if len(team.Members) != debatersPerTeam {
			msg := fmt.Sprintf("each team requires %d member(s). team %d has %d member(s).", debatersPerTeam, i, len(team.Members))
			return errors.New(msg)
		}
		// validate general team responses
		if err := ValidateResponses(form.TeamQuestions, team.TeamResponses); err != nil {
			return err
		}

		// validate member responses for each team
		for _, member := range team.Members {

			if err := ValidateResponses(form.MemberQuestions, member.MemberResponses); err != nil {
				return err
			}

		}
	}

	return nil
}

func ValidateResponses(questions []models.Question, responses []models.QuestionResponse) error {
	// form questions
	questionMap := make(map[primitive.ObjectID]models.Question)
	for _, question := range questions {
		questionMap[question.ID] = question
	}

	answeredQuestions := make(map[primitive.ObjectID]bool)

	// check if a response doesn't match question
	for _, response := range responses {

		// check if the QuestionResponse exists in the form
		if _, exists := questionMap[response.Question]; !exists {
			// throw
			fmt.Println(response.Question)
			return errors.New("form response validation failed: response contains a question that is not part of the form")
		}

		// check if the QuestionResponse has a valid option
		if questionMap[response.Question].Type == "select" {

			if !slices.Contains(questionMap[response.Question].Options, response.Answer) {
				return errors.New("form response validation failed: invalid option found in response")
			}

		}

		answeredQuestions[response.Question] = true
	}

	// check if question is missing a response
	for _, question := range questions {
		// check if question is required and if question was responded to
		if question.IsRequired && !answeredQuestions[question.ID] {
			return errors.New("form response validation failed: answer to a response was not found")
		}
	}

	return nil
}

// Submit Form Response
// POST /tournaments/:id/responses
func (handler *RouteHandler) SubmitRegistration(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// define collections
	userCollection := handler.client.Database("debatedino").Collection("users")

	tournamentCollection := handler.client.Database("debatedino").Collection("tournaments")

	// the id is passed through the url
	tournamentIdString := c.Param("id")

	// Convert id (string) to mongoDB Objectid
	tID, err := primitive.ObjectIDFromHex(tournamentIdString)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	// enter requestbody into registration
	var registration models.Registration

	if err := c.BindJSON(&registration); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	// MAY NEED TO VALIDATE FOR DUPLICATE SUBMITS

	// append tournament id to registration
	registration.TournamentID = tID

	// validate form response
	if validationErr := handler.validate.Struct(registration); validationErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
		fmt.Println(validationErr)
		return
	}

	// validate Questions
	if err := handler.ValidateQuestionResponses(ctx, tID, registration); err != nil {

		// using errors.Is() to compare error types
		if errors.Is(err, mongo.ErrNoDocuments) {
			c.JSON(http.StatusNotFound, gin.H{"error": "tournament not found when validating"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var tourneyUpdateBody bson.M
	var userUpdateBody bson.M

	tourneyUpdateBody = bson.M{"debaters": registration.ParticipantID}
	userUpdateBody = bson.M{"debating": registration.TournamentID}

	// START SESSION
	session, err := handler.client.StartSession()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start session"})
		return
	}
	defer session.EndSession(ctx)

	// to return result of insertion
	var insertResult *mongo.InsertOneResult
	err = mongo.WithSession(ctx, session, func(sessCtx mongo.SessionContext) error {

		if err := session.StartTransaction(); err != nil {
			return err
		}

		// create new registration document
		var insertErr error
		insertResult, insertErr = handler.collection.InsertOne(sessCtx, registration)
		if insertErr != nil {
			session.AbortTransaction(sessCtx)
			return insertErr
		}

		// update tourney
		tourneyRes, err := tournamentCollection.UpdateOne(sessCtx, bson.M{"_id": registration.TournamentID}, bson.M{"$addToSet": tourneyUpdateBody})

		if err != nil {
			session.AbortTransaction(sessCtx)
			return err
		}

		if tourneyRes.ModifiedCount == 0 {
			session.AbortTransaction(sessCtx)
			return errors.New("tournament not updated")
		}

		// update user
		userRes, err := userCollection.UpdateOne(sessCtx, bson.M{"_id": registration.ParticipantID}, bson.M{"$addToSet": userUpdateBody})

		if err != nil {
			session.AbortTransaction(sessCtx)
			return err
		}

		if userRes.ModifiedCount == 0 {
			session.AbortTransaction(sessCtx)
			return errors.New("user not updated")
		}

		if err := session.CommitTransaction(sessCtx); err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		if err.Error() == "tournament not updated" || err.Error() == "user not updated" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}

		return
	}

	message := fmt.Sprintf(
		"User %s registered to tournament %s successfully",
		registration.ParticipantID.Hex(),
		registration.TournamentID.Hex(),
	)
	c.JSON(http.StatusOK, gin.H{"message": message, "inserted": insertResult})

}

// Get Form Responses
// GET /tournaments/:id/responses
func (handler *RouteHandler) GetResponses(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// the id is passed through the url
	tournamentId := c.Param("id")

	// Convert id (string) to mongoDB Objectid
	objId, err := primitive.ObjectIDFromHex(tournamentId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	cursor, err := handler.collection.Find(ctx, bson.M{"tournamentid": objId})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	defer cursor.Close(ctx)

	var responses []bson.M

	if err := cursor.All(ctx, &responses); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusOK, responses)

}
