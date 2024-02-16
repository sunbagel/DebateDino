package main

import (
	"net/http"
	"os"
	"server/config"
	"server/routes"
	"server/users"

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
		MongoDBURI: "your_mongodb_uri",
	}

	// Test
	router.GET("/api/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "hello world",
		})
	})

	// Users
	router.POST("/api/user", users.CreateUser)
	router.GET("/api/user", users.GetUsers)

	// Tournaments
	router.GET("/api/tournaments", routes.GetTournaments)

	router.Run(":" + port)
}
