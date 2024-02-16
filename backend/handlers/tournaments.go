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

// code is identical to users.go lol...
// but i don't want to generalize route functionality, since it has the possibility of varying quite a bit.
func (handler *RouteHandler) GetTournaments(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	var tournaments []bson.M

	cursor, err := handler.collection.Find(ctx, bson.M{})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	if err = cursor.All(ctx, &tournaments); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	defer cancel()
	c.JSON(http.StatusOK, tournaments)
}
