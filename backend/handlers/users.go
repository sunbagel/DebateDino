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

// probably better to use username or email as an identifier
// or verify identity through auth (retrieve user's id from authentication)
func (handler *RouteHandler) UpdateUser(c *gin.Context) {

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	userID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(userID)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
		return
	}

	// map, key is string, values are interfaces (empty interface implies any type)
	// alternatively can define a struct
	// takes data from request body
	var updateData map[string]interface{}

	// BindJSON() takes HTTP request and marshals it into Go struct or map
	if err := c.BindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, updateErr := handler.collection.UpdateByID(ctx, objID, bson.M{"$set": updateData})
	if updateErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": updateErr.Error()})
		return
	}

	// if no User modified
	if result.ModifiedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully"})

}
