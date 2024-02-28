package handlers

import (
	"context"
	"fmt"
	"net/http"
	"server/models"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// validate form response
// helper function
// takes a FormResponse.Responses array and checks each question against the given question id
func (handler *RouteHandler) ValidateQuestionResponses(ctx context.Context, form *models.Form, responses []models.QuestionResponse) error {
	// Function implementation
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

	// append tournment id to formResponse
	formResponse.TournamentID = objId
	fmt.Println("HELLO")
	// validate form response
	if validationErr := handler.validate.Struct(formResponse); validationErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
		fmt.Println(validationErr)
		return
	}

	// validate Questions
	// if err := handler.ValidateFormResponses(ctx,

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

	cursor, err := handler.collection.Find(ctx, bson.M{})

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
