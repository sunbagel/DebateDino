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

func (handler *RouteHandler) CreateTournament(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()
	var tournament models.Tournament

	// bind input json to tournament variable
	if err := c.BindJSON(&tournament); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	// validate tournament variable
	validationErr := handler.validate.Struct(tournament)

	// check validation error
	if validationErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
		fmt.Println(validationErr)
		return
	}

	// set ID field (?)
	tournament.ID = primitive.NewObjectID()

	// get collection from the handler
	result, insertErr := handler.collection.InsertOne(ctx, tournament)
	if insertErr != nil {
		msg := fmt.Sprintf("Tournament was not created")
		c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
		fmt.Println(insertErr)
		return
	}

	c.JSON(http.StatusOK, result)
}

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
	var tournaments []bson.M

	if err := cursor.All(ctx, &tournaments); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	// return tournaments
	c.JSON(http.StatusOK, tournaments)
}
