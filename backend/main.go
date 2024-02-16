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
	// tournamentCollection := client.Database(cfg.DBname).Collection("tournaments")

	// create handlers
	userHandler := handlers.NewUserHandler(userCollection, validate)

	// Test
	router.GET("/api/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "hello world",
		})
	})
	// Users
	router.POST("/api/user", userHandler.CreateUser)
	router.GET("/api/user", userHandler.GetUsers)

	// Tournaments
	// router.GET("/api/tournaments", routes.GetTournaments)

	router.Run(":" + port)
}
