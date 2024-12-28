package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"server/models"
	"time"

	"firebase.google.com/go/v4/auth"
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

	// get request data
	var user models.User
	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	// VALIDATION 1: Check if a user with this username or email already exists
	existingUser := handler.collection.FindOne(ctx, bson.M{"$or": []bson.M{
		{"username": user.Username},
		{"email": user.Email},
	}})

	if existingUser.Err() != mongo.ErrNoDocuments {
		// returns error 409
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists. Please pick a different username."})
		return
	}

	// FINAL VALIDATION: Validate user object against schema
	validationErr := handler.validate.Struct(user)
	if validationErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
		fmt.Println(validationErr)
		return
	}

	// -----START TRANSACTION-----
	session, err := handler.client.StartSession()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start session"})
		return
	}
	defer session.EndSession(ctx)

	var mongoStringId string
	err = mongo.WithSession(ctx, session, func(sessCtx mongo.SessionContext) error {
		if err := session.StartTransaction(); err != nil {
			return err
		}

		// Create user in Mongo
		result, insertErr := handler.collection.InsertOne(ctx, user)
		if insertErr != nil {
			msg := "User was not created"
			log.Fatalf("Error creating user: %v\n", insertErr)
			session.AbortTransaction(sessCtx)
			return errors.New(msg)
		}

		// get mongo generated id for the user
		mongoObjectId, ok := result.InsertedID.(primitive.ObjectID)
		if !ok {
			log.Println("InsertedID is not a primitive.ObjectID")
			session.AbortTransaction(sessCtx)
			return errors.New("failed to retrieve valid MongoDB ObjectID")
		}
		mongoStringId = mongoObjectId.Hex() // Convert ObjectID to string

		// Create user in Firebase
		params := (&auth.UserToCreate{}).
			UID(mongoStringId). // set id to the mongo id
			Email(user.Email).
			Password(user.Password).
			DisplayName(user.Username).
			EmailVerified(false)

		// create Firebase User
		// note that transaction only applies to MongoDB related processes - do not expect it to roll back Firebase
		// it's fine here because Firebase is the last process.
		_, err := handler.authClient.CreateUser(context.Background(), params)
		if err != nil {
			log.Fatalf("Error creating Firebase user: %v\n", err)
			session.AbortTransaction(sessCtx)
			return errors.New("failed to create user in Firebase")
		}

		// commit the transaction
		if err := session.CommitTransaction(sessCtx); err != nil {
			return err
		}

		return nil
	})

	// -----END TRANSACTION-----
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User created successfully",
		"userId":  mongoStringId,
	})
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

	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
		return
	}

	var user models.User
	// find user
	if err := handler.collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&user); err != nil {

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

	allowedKeys := []string{"name", "phoneNumber", "institution"}

	// BindJSON() takes HTTP request and marshals it into Go struct or map
	// Extra fields are ignored - only fields present in the schema are added
	if err := c.BindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// check updateData doesn't have invalid parameters
	for key := range updateData {
		var found bool = false
		for _, value := range allowedKeys {
			if key == value {
				found = true
			}
		}
		if !found {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid key found in update body"})
			return
		}
	}

	if len(updateData) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Update body is empty."})
		return
	}

	result, updateErr := handler.collection.UpdateOne(ctx, bson.M{"_id": objID}, bson.M{"$set": updateData})
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

	tournamentCollection := handler.client.Database("debatedino").Collection("tournaments")
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

	var tournaments []models.Tournament
	filter := bson.M{"_id": bson.M{"$in": tournamentIDs}}

	// find all tournaments from tournamentIDs
	cursor, err := tournamentCollection.Find(ctx, filter)

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

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type FirebaseSignInResponse struct {
	IdToken      string `json:"idToken"`
	RefreshToken string `json:"refreshToken"`
	ExpiresIn    string `json:"expiresIn"`
	// ... other fields you might want, e.g. localId, etc.
}

func (handler *RouteHandler) LoginUser(c *gin.Context) {
	fmt.Println("peepeee")

	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	fmt.Println("LALALAA:")

	var loginReq LoginRequest
	if err := c.ShouldBindJSON(&loginReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	payload, err := json.Marshal(map[string]string{
		"email":             loginReq.Email,
		"password":          loginReq.Password,
		"returnSecureToken": "true",
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal payload"})
		return
	}

	apiKey := "REPLACE_THIS_API_KEY" // REPLAAACE AAAAA
	firebaseURL := fmt.Sprintf("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=%s", apiKey)

	req, err := http.NewRequestWithContext(ctx, "POST", firebaseURL, bytes.NewBuffer(payload))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating Firebase request"})
		return
	}
	req.Header.Set("Content-Type", "application/json")

	client := http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error calling Firebase Auth API"})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	var fbResp FirebaseSignInResponse
	if err := json.NewDecoder(resp.Body).Decode(&fbResp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding Firebase response"})
		return
	}

	fmt.Println("Bearer Token:")

	c.JSON(http.StatusOK, gin.H{
		"message":      "Login successful",
		"token":        fbResp.IdToken,      // Bearer token
		"refreshToken": fbResp.RefreshToken, // optional
		"expiresIn":    fbResp.ExpiresIn,    // optional
	})

}
