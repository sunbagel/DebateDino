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

	var validate = validator.New()

	// define collections
	userCollection := client.Database(cfg.DBname).Collection("users")
	tournamentCollection := client.Database((cfg.DBname)).Collection("tournaments")
	formResponseCollection := client.Database(cfg.DBname).Collection("formResponses")

	// create handlers
	userHandler := handlers.NewRouteHandler(client, userCollection, validate)
	tournamentsHandler := handlers.NewRouteHandler(client, tournamentCollection, validate)
	formResponseHandler := handlers.NewRouteHandler(client, formResponseCollection, validate)

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
	router.POST("/api/tournaments/:id/registration", tournamentsHandler.RegisterUser)
	router.DELETE("/api/tournaments/:id", tournamentsHandler.DeleteTournament)
	router.PUT("/api/tournaments/:id", tournamentsHandler.UpdateTournament)
	router.GET("/api/tournaments/:id", tournamentsHandler.GetTournamentById)

	// forms
	router.GET("/api/tournaments/:id/responses", formResponseHandler.GetResponses)
	router.POST("/api/tournaments/:id/responses", formResponseHandler.SubmitFormResponse)

	router.Run("localhost:" + port)
}
