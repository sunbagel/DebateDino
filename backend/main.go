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
	// tournamentCollection := client.Database(cfg.DBname).Collection("tournaments")

	// create handlers
	userHandler := handlers.NewRouteHandler(userCollection, validate)
	tournamentsHandler := handlers.NewRouteHandler(tournamentCollection, validate)

	// Test
	router.GET("/api/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "hello world",
		})
	})
	// Users
	router.POST("/api/user", userHandler.CreateUser)
	// might want to add filtering options, ex. /users?name=John&institution=XYZ, can access the gin.Context with c.Query("name")
	router.GET("/api/user", userHandler.GetUsers)
	// get by id
	router.GET("/api/user/:id", userHandler.GetUserById)
	router.PUT("/api/user/:id", userHandler.UpdateUser)

	// Tournaments
	router.GET("/api/tournaments", tournamentsHandler.SearchTournament)
	router.POST("/api/tournaments", tournamentsHandler.CreateTournament)
	router.DELETE("/api/tournaments/:id", tournamentsHandler.DeleteTournament)
	router.PUT("/api/tournaments/:id", tournamentsHandler.UpdateTournament)

	router.Run("localhost:" + port)
}
