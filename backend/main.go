package main

import (
	"net/http"
	"os"
	"server/routes"

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

	// Test
	router.GET("/api/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "hello world",
		})
	})

	// Users
	router.POST("/api/user", routes.CreateUser)
	router.GET("/api/user", routes.GetUsers)

	router.Run(":" + port)
}
