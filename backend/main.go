package main

import (
	"net/http"
	"os"
	"server/config"
	"server/db"
	"server/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
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
	userCollection := client.Database(cfg.DBname).Collection("users")
	// tournamentCollection := client.Database(cfg.DBname).Collection("tournaments")

	// Test
	router.GET("/api/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "hello world",
		})
	})

	// create handlers
	userHandler := handlers.NewUserHandler(userCollection)

	// Users
	router.POST("/api/user", userHandler.CreateUser)
	router.GET("/api/user", userHandler.GetUsers)

	// Tournaments
	// router.GET("/api/tournaments", routes.GetTournaments)

	router.Run(":" + port)
}
