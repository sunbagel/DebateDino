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

// Create Tournament
// POST   /api/tournaments/
func (handler *RouteHandler) CreateTournament(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
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
	// tournament.ID = primitive.NewObjectID()

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

// Search Tournament
// GET    /api/tournaments/

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

// Delete Tournament
// DELETE   /api/tournaments/:id
func (handler *RouteHandler) DeleteTournament(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// the id is passed through the url
	id := c.Param("id")

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
// PUT    /api/tournaments/:id
func (handler *RouteHandler) UpdateTournament(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	tournamentId := c.Param("id")
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
func (handler *RouteHandler) RegisterUser(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

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
	tournamentIDString := c.Param("id")
	userIDString := body.UserID

	// set userGroup
	var userGroup string
	if body.Role == "Debater" {
		userGroup = "debaters"
	} else if body.Role == "Judge" {
		userGroup = "judges"
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid role"})
	}

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

	// update userGroup field (debaters or judges)
	filter := bson.M{"_id": tID}
	updateBody := bson.M{userGroup: uID}
	result, err := handler.collection.UpdateOne(ctx, filter, bson.M{"$addToSet": updateBody})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not register user to tournament"})
		return
	}

	if result.ModifiedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tournament not found"})
		return
	}

	message := fmt.Sprintf(
		"User %s registered to tournament %s successfully",
		userIDString,
		tournamentIDString,
	)
	c.JSON(http.StatusOK, gin.H{"message": message})

}
