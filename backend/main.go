package main

import (
	"net/http"
	"os"
	"server/config"
	"server/db"
	"server/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(cors.Default())

	cfg := config.Config{
		DBname: "debatedino",
	}
	client := db.DBinstance()
	authClient := db.InitFirebaseAuth()

	var validate = validator.New()

	// define collections
	userCollection := client.Database(cfg.DBname).Collection("users")
	tournamentCollection := client.Database((cfg.DBname)).Collection("tournaments")
	registrationCollection := client.Database(cfg.DBname).Collection("registrations")

	// create handlers
	userHandler := handlers.NewRouteHandler(client, authClient, userCollection, validate)
	tournamentsHandler := handlers.NewRouteHandler(client, authClient, tournamentCollection, validate)
	registrationHandler := handlers.NewRouteHandler(client, authClient, registrationCollection, validate)

	// Test
	router.GET("/api/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "hello world",
		})
	})
	// Users
	// might want to add filtering options, ex. /users?name=John&institution=XYZ, can access the gin.Context with c.Query("name")
	router.GET("/api/users", userHandler.GetUsers)
	// get by id
	router.GET("/api/users/:id", userHandler.GetUserById)
	router.GET("/api/users/:id/tournaments", userHandler.GetUserTournaments)
	router.POST("/api/users", userHandler.CreateUser)
	router.PUT("/api/users/:id", userHandler.UpdateUser)
	router.DELETE("/api/users/:id", userHandler.DeleteUser)

	// Tournaments
	router.GET("/api/tournaments", tournamentsHandler.SearchTournament)
	router.POST("/api/tournaments", tournamentsHandler.CreateTournament)
	// to be refactored (for judge sign up)
	// router.POST("/api/tournaments/:id/registration", tournamentsHandler.RegisterUser)
	router.DELETE("/api/tournaments/:tId", tournamentsHandler.DeleteTournament)
	router.PUT("/api/tournaments/:tId", tournamentsHandler.UpdateTournament)

	// forms
	router.GET("/api/tournaments/:tId/registrations", registrationHandler.GetRegistrations)
	router.POST("/api/tournaments/:tId/registrations", registrationHandler.SubmitRegistration)
	router.DELETE(("/api/tournaments/:tId/registrations/:uId"), registrationHandler.UnregisterUser)

	router.Run("localhost:" + port)
}
