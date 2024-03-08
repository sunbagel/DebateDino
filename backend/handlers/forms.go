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
)

// validate form response
// helper function
// takes a FormResponse.Responses array and checks each question against the given question id
func (handler *RouteHandler) ValidateQuestionResponses(ctx context.Context, tournamentId primitive.ObjectID, responses []models.QuestionResponse) error {
	// IS NOT CALLED CURRENTLY

	// need to query tournament id to get form object. handler doesn't support that yet.
	//  will probably have to refactor handler to support multi collections (pass in entire client)

	var form models.Form

	// form questions
	questionMap := make(map[primitive.ObjectID]models.Question)
	for _, question := range form.Questions {
		questionMap[question.ID] = question
	}

	answeredQuestions := make(map[primitive.ObjectID]bool)

	// check if a response doesn't match question
	for _, response := range responses {

		// check if the QuestionResponse exists in the form
		if _, exists := questionMap[response.Question]; !exists {
			// throw
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
	for _, question := range form.Questions {
		// check if question is required and if question was responded to
		if question.IsRequired && !answeredQuestions[question.ID] {
			return errors.New("form response validation failed: Answer to response was not found")
		}
	}

	return nil
}

// Submit Form Response
// POST /tournaments/:id/responses
func (handler *RouteHandler) SubmitFormResponse(c *gin.Context) {
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

	// enter requestbody into formResponse
	var formResponse models.FormResponse

	if err := c.BindJSON(&formResponse); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	// MAY NEED TO VALIDATE FOR DUPLICATE SUBMITS

	// append tournment id to formResponse
	formResponse.TournamentID = objId

	// validate form response
	if validationErr := handler.validate.Struct(formResponse); validationErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
		fmt.Println(validationErr)
		return
	}

	// validate Questions DOESN'T WORK RN
	// if err := handler.ValidateQuestionResponses(ctx, objId, formResponse.Responses); err != nil {

	// }

	// insert new response
	result, insertErr := handler.collection.InsertOne(ctx, formResponse)
	if insertErr != nil {
		msg := fmt.Sprintf("Response was not created")
		c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
		fmt.Println(insertErr)
		return
	}

	c.JSON(http.StatusOK, result)

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
