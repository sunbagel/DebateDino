package handlers

import (
	"context"
	"fmt"
	"net/http"
	"server/models"
	"strings"
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
	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// extract jwt token
	authHeader := c.GetHeader("Authorization")
	splitToken := strings.Split(authHeader, "Bearer ")
	if len(splitToken) != 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Authorization header format must be \"Bearer <token>\""})
		return
	}
	// get token
	fbIdToken := splitToken[1]
	fmt.Println(fbIdToken)
	decodedToken, err := handler.authClient.VerifyIDToken(ctx, fbIdToken)

	// if token is correct format, not expired, and properly signed (doesn't check for revocation)
	// only check for revocation for important security (it is an expensive operation)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "error validating firebase token"})
		fmt.Println(err)
		return
	}

	firebaseUID := decodedToken.UID
	fmt.Println(firebaseUID)

	// Check if a user with this Firebase UID already exists
	existingUser := handler.collection.FindOne(ctx, bson.M{"firebaseUID": firebaseUID})
	if existingUser.Err() != mongo.ErrNoDocuments {
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
		return
	}

	// bind user
	var user models.User
	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	// verify email in body against Firebase email
	email, ok := decodedToken.Claims["email"].(string)

	fmt.Println(email)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error retrieving email"})
		return
	}
	if user.Email != email {
		c.JSON(http.StatusBadRequest, gin.H{"error": "emails do not match"})
		return
	}

	user.FbID = firebaseUID

	// validate user object
	validationErr := handler.validate.Struct(user)
	if validationErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
		fmt.Println(validationErr)
		return
	}

	// get collection from the handler
	result, insertErr := handler.collection.InsertOne(ctx, user)
	if insertErr != nil {
		msg := fmt.Sprint("User was not created")
		c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
		fmt.Println(insertErr)
		return
	}

	c.JSON(http.StatusOK, result)
}

func (handler *RouteHandler) GetUsers(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
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

	defer cursor.Close(ctx)

	// pass all users from cursor to users
	if err = cursor.All(ctx, &users); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	// return users
	c.JSON(http.StatusOK, users)
}

// GET BY FIREBASE UID
func (handler *RouteHandler) GetUserById(c *gin.Context) {

	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// passed in api call /users/:id
	userID := c.Param("id")

	var user models.User
	// find user
	if err := handler.collection.FindOne(ctx, bson.M{"fbId": userID}).Decode(&user); err != nil {

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

	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
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

func (handler *RouteHandler) DeleteUser(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	userID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(userID)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
		return
	}

	// we use collection.FindOneAndDelete() if we also want to return data about item deleted. otherwise use .DeleteOne()
	var deletedUser bson.M
	deleteErr := handler.collection.FindOneAndDelete(ctx, bson.M{"_id": objID}).Decode(&deletedUser)
	if deleteErr != nil {
		if deleteErr == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("User with id %s not found", userID)})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": deleteErr.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully", "deletedUser": deletedUser})

}

func (handler *RouteHandler) GetUserTournaments(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// role is optional
	role := c.Query("role")
	// get user id
	userID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(userID)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
		return
	}

	// get user data
	var user models.User
	if err := handler.collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User not found"})
		return
	}

	// extract tournament ids
	// filter by role (if present)
	var tournamentIDs []primitive.ObjectID

	switch role {
	case "Host":
		tournamentIDs = user.Hosting

	case "Debater":
		tournamentIDs = user.Debating

	case "Judge":
		tournamentIDs = user.Judging

	default:
		tournamentIDs = append(user.Hosting, user.Debating...)
		tournamentIDs = append(tournamentIDs, user.Judging...)

	}

	var tournaments []bson.D
	filter := bson.M{"_id": bson.M{"$in": tournamentIDs}}

	// find all tournaments from tournamentIDs
	cursor, err := handler.collection.Find(ctx, filter)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tournaments"})
		return
	}

	defer cursor.Close(ctx)
	if err = cursor.All(ctx, &tournaments); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode tournaments"})
		return
	}

	c.JSON(http.StatusOK, tournaments)
}
