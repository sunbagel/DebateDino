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
	"go.mongodb.org/mongo-driver/mongo"
)

// (h *RouteHandler) is a receiver
// indicates that we can call CreateUser on an instance of *RouteHandler
// (it's like "this" when defining a class function in C++)
func (handler *RouteHandler) CreateUser(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()
	var user models.User
	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	validationErr := handler.validate.Struct(user)
	if validationErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
		fmt.Println(validationErr)
		return
	}

	user.ID = primitive.NewObjectID()

	// get collection from the handler
	result, insertErr := handler.collection.InsertOne(ctx, user)
	if insertErr != nil {
		msg := fmt.Sprintf("User was not created")
		c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
		fmt.Println(insertErr)
		return
	}

	c.JSON(http.StatusOK, result)
}

func (handler *RouteHandler) GetUsers(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	var users []bson.M

	// get all users
	cursor, err := handler.collection.Find(ctx, bson.M{})

	// check err in getting users
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	// pass all users from cursor to users
	if err = cursor.All(ctx, &users); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	defer cancel()
	// return users
	c.JSON(http.StatusOK, users)
}

func (handler *RouteHandler) GetUser(c *gin.Context) {

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	// passed in api call /users/:id
	userID := c.Param("id")

	// Convert userID from string to ObjectID if your database uses MongoDB's ObjectID
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
		return
	}

	var user models.User
	// find user
	if err := handler.collection.FindOne(ctx, bson.M{"_id": objID}).Decode((&user)); err != nil {

		// handle errors
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching user"})
		return
	}

	// return user
	c.JSON(http.StatusOK, user)
}
