package handlers

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"server/models"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// validate array of questions
func initializeQuestions(questions []models.Question) error {

	if questions == nil {
		return errors.New("the form is missing questions")
	}
	for i := range questions {
		questions[i].ID = primitive.NewObjectID()

		// check if options are given correctly
		err := validateQuestion(questions[i])
		if err != nil {
			return err
		}
	}

	return nil
}

// validate question
func validateQuestion(q models.Question) error {
	if q.Type == "select" && (q.Options == nil || len(q.Options) == 0) {
		return errors.New("select type questions must have options")
	}

	return nil
}

// Create Tournament
// POST   /api/tournaments/
func (handler *RouteHandler) CreateTournament(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	userCollection := handler.client.Database("debatedino").Collection("users")

	var tournament models.CreateTournament

	// bind input json to tournament variable
	if err := c.BindJSON(&tournament); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	if tournament.Form == nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Missing form data", "message": "A complete Form object is required for submitting a tournament."})
		return
	}

	// utilize goroutines here?

	// intialize general questions
	if err := initializeQuestions(tournament.Form.Questions); err != nil {
		message := "Failed to initialize general questions"
		if err.Error() == "select type questions must have options" {
			c.JSON(http.StatusUnprocessableEntity, gin.H{"message": message, "error": err.Error()})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{"message": message, "error": err.Error()})
		return
	}

	// intialize team questions
	if err := initializeQuestions(tournament.Form.TeamQuestions); err != nil {
		message := "Failed to initialize team questions"
		if err.Error() == "select type questions must have options" {
			c.JSON(http.StatusUnprocessableEntity, gin.H{"message": message, "error": err.Error()})
			return
		}
		fmt.Println(tournament.Form.TeamQuestions)

		c.JSON(http.StatusBadRequest, gin.H{"message": message, "error": err.Error()})
		return
	}

	// intialize member questions
	if err := initializeQuestions(tournament.Form.MemberQuestions); err != nil {
		message := "Failed to initialize member questions"
		if err.Error() == "select type questions must have options" {
			c.JSON(http.StatusUnprocessableEntity, gin.H{"message": message, "error": err.Error()})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{"message": message, "error": err.Error()})
		return
	}

	// validate tournament variable
	if validationErr := handler.validate.Struct(tournament); validationErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
		log.Fatalf("Tournament Creation - Failed to Validate Tournament Data:%v\n", validationErr)
		return
	}

	// -----START TRANSACTION-----
	session, err := handler.client.StartSession()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start session"})
		return
	}
	defer session.EndSession(ctx)

	var insertedID string
	err = mongo.WithSession(ctx, session, func(sessCtx mongo.SessionContext) error {

		if err := session.StartTransaction(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return err
		}

		// get collection from the handler
		result, insertErr := handler.collection.InsertOne(ctx, tournament)
		if insertErr != nil {
			msg := fmt.Sprintf("Tournament was not created")
			log.Fatalf("Tournament Creation - Insertion Into Collection Failed:%v\n", insertErr)
			session.AbortTransaction(sessCtx)
			return errors.New(msg)
		}

		// get object id from result + convert to a string
		objectId, ok := result.InsertedID.(primitive.ObjectID)
		if !ok {
			return errors.New("expected an ObjectID from tournament insertion, but received something else")
		}
		insertedID = objectId.Hex()

		// update user's hosting field
		hostId := tournament.Host
		userUpdateBody := bson.M{"hosting": result.InsertedID}
		userRes, err := userCollection.UpdateOne(sessCtx, bson.M{"_id": hostId}, bson.M{"$addToSet": userUpdateBody})

		if err != nil {
			session.AbortTransaction(sessCtx)
			return err
		}

		if userRes.ModifiedCount == 0 {
			session.AbortTransaction(sessCtx)
			return errors.New("user not found")
		}

		if err := session.CommitTransaction(sessCtx); err != nil {
			return err
		}

		return nil
	})
	// ----END TRANSACTION----
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		log.Fatalf("Transaction Failed%v\n", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"InsertedID": insertedID})
}

// Search Tournament
// GET    /api/public/tournaments/

// search tournament from request body
// can be duplicates
func (handler *RouteHandler) SearchTournament(c *gin.Context) {

	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	searchCriteria := bson.M{}

	// get query
	queryParams := c.Request.URL.Query()

	// put key/value pairs into searchCriteria
	// **does not filter for invalid keys**
	for key, values := range queryParams {
		if len(values) > 0 {
			searchCriteria[key] = values[0]
		}
	}

	// find based on criteria
	cursor, err := handler.collection.Find(ctx, searchCriteria)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	defer cursor.Close(ctx)

	// populate tournaments with cursor
	var tournaments []models.Tournament

	if err := cursor.All(ctx, &tournaments); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	c.JSON(http.StatusOK, tournaments)
}

// Delete Tournament
// DELETE   /api/tournaments/:tId
func (handler *RouteHandler) DeleteTournament(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// the id is passed through the url
	id := c.Param("tId")

	// Convert id (string) to mongoDB Objectid
	objId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	// tournament to be deleted
	tournament := bson.M{"_id": objId}

	_, err = handler.collection.DeleteOne(ctx, tournament)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete item"})
	}

	c.JSON(http.StatusOK, bson.M{"deletedId": id})
}

// Update Tournament
// PUT    /api/tournaments/:tId
func (handler *RouteHandler) UpdateTournament(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	tournamentId := c.Param("tId")
	objID, err := primitive.ObjectIDFromHex(tournamentId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Tournament ID format"})
		return
	}

	var updateData map[string]interface{}

	if err := c.BindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, updateErr := handler.collection.UpdateByID(ctx, objID, bson.M{"$set": updateData})
	if updateErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": updateErr.Error()})
		return
	}

	// if no Tournament modified
	if result.ModifiedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tournament not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Tournament updated successfully"})
}

// Register User to Tournament
// CURRENTLY NOT USED
func (handler *RouteHandler) RegisterUser(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// define collections
	// somehow need to bring in configs (cfg) from main
	userCollection := handler.client.Database("debatedino").Collection("users")

	// body struct for data validation
	type RegistrationBody struct {
		UserID string `json:"userID" validate:"required"`
		Role   string `json:"role" validate:"required,oneof=Debater Judge"`
	}

	// get body
	var body RegistrationBody
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// validate tournament variable
	validationErr := handler.validate.Struct(body)

	// check validation error
	if validationErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
		fmt.Println(validationErr)
		return
	}

	// get tournament id and user id strings
	tournamentIDString := c.Param("tId")
	userIDString := body.UserID

	// convert the type into ObjectIDs
	tID, err := primitive.ObjectIDFromHex(tournamentIDString)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tournament ID format"})
		return
	}

	uID, err := primitive.ObjectIDFromHex(userIDString)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
		return
	}

	// set updateBodies (the group to be updated)
	var tourneyUpdateBody bson.M
	var userUpdateBody bson.M

	if body.Role == "Debater" {
		tourneyUpdateBody = bson.M{"debaters": uID}
		userUpdateBody = bson.M{"debating": tID}
	} else if body.Role == "Judge" {
		tourneyUpdateBody = bson.M{"judges": uID}
		userUpdateBody = bson.M{"judging": tID}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid role"})
	}

	// START SESSION
	session, err := handler.client.StartSession()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start session"})
		return
	}
	defer session.EndSession(ctx)

	err = mongo.WithSession(ctx, session, func(sessCtx mongo.SessionContext) error {

		if err := session.StartTransaction(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return err
		}

		// update userGroup field (debaters or judges)
		// update tourney
		tourneyRes, err := handler.collection.UpdateOne(sessCtx, bson.M{"_id": tID}, bson.M{"$addToSet": tourneyUpdateBody})

		if err != nil {
			session.AbortTransaction(sessCtx)
			return err
		}

		if tourneyRes.ModifiedCount == 0 {
			session.AbortTransaction(sessCtx)
			return errors.New("tournament not found")
		}

		// update user
		userRes, err := userCollection.UpdateOne(sessCtx, bson.M{"_id": uID}, bson.M{"$addToSet": userUpdateBody})

		if err != nil {
			session.AbortTransaction(sessCtx)
			return err
		}

		if userRes.ModifiedCount == 0 {
			session.AbortTransaction(sessCtx)
			return errors.New("user not found")
		}

		if err := session.CommitTransaction(sessCtx); err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		if err.Error() == "tournament not found" || err.Error() == "user not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}

		return
	}

	message := fmt.Sprintf(
		"User %s registered to tournament %s successfully",
		userIDString,
		tournamentIDString,
	)
	c.JSON(http.StatusOK, gin.H{"message": message})

}

func (handler *RouteHandler) GetTournamentById(c *gin.Context) {

	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// passed in api call /tournaments/:id
	tournamentID := c.Param("tId")

	// Convert tournamentID from string to ObjectID if your database uses MongoDB's ObjectID
	objID, err := primitive.ObjectIDFromHex(tournamentID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Tournament ID format"})
		return
	}

	var tournament models.Tournament
	// find tournament
	if err := handler.collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&tournament); err != nil {

		// handle errors
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Tournament not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching Tournament"})
		return
	}

	// return user
	c.JSON(http.StatusOK, tournament)
}
