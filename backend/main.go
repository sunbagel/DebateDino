package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"server/config"
	"server/db"
	"server/handlers"
	"time"

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

	corsConfig := cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		// AllowAllOrigins: false,
		MaxAge: 12 * time.Hour, // Preflight requests can be cached for 12 hours
	}
	router.Use(cors.New(corsConfig))

	cfg := config.Config{
		DBname: "debatedino",
	}
	client := db.DBinstance()
	firebaseApp := db.InitFirebaseApp()
	authClient, err := firebaseApp.Auth(context.Background())

	if err != nil {
		log.Fatalf("error getting Auth client: %v\n", err)
	}

	var validate = validator.New()

	// define collections
	userCollection := client.Database(cfg.DBname).Collection("users")
	tournamentCollection := client.Database((cfg.DBname)).Collection("tournaments")
	registrationCollection := client.Database(cfg.DBname).Collection("registrations")

	// create handlers
	userHandler := handlers.NewRouteHandler(client, authClient, userCollection, validate)
	tournamentsHandler := handlers.NewRouteHandler(client, authClient, tournamentCollection, validate)
	registrationHandler := handlers.NewRouteHandler(client, authClient, registrationCollection, validate)
	paymentHandler := handlers.NewRouteHandler(client, authClient, tournamentCollection, validate)

	// Test
	router.GET("/api/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "hello world",
		})
	})

	apiGroup := router.Group("/api")
	publicRoutes := apiGroup.Group("/public")
	// can give better name. just didn't want to refactor all endpoint calls
	protectedRoutes := apiGroup.Group("/")
	protectedRoutes.Use(db.VerifyTokenMiddleware(authClient))

	// Users
	// might want to add filtering options, ex. /users?name=John&institution=XYZ, can access the gin.Context with c.Query("name")
	publicRoutes.GET("/users", userHandler.GetUsers)
	publicRoutes.POST("/users", userHandler.CreateUser)
	// get by id
	protectedRoutes.GET("/users/:id", userHandler.GetUserById)
	protectedRoutes.GET("/users/:id/tournaments", userHandler.GetUserTournaments)
	protectedRoutes.PUT("/users/:id", userHandler.UpdateUser)
	protectedRoutes.DELETE("/users/:id", userHandler.DeleteUser)

	// Tournaments
	publicRoutes.GET("/tournaments", tournamentsHandler.SearchTournament)
	protectedRoutes.POST("/tournaments", tournamentsHandler.CreateTournament)
	// to be refactored (for judge sign up)
	// protectedRoutes.POST("/tournaments/:id/registration", tournamentsHandler.RegisterUser)
	protectedRoutes.DELETE("/tournaments/:tId", tournamentsHandler.DeleteTournament)
	protectedRoutes.PUT("/tournaments/:tId", tournamentsHandler.UpdateTournament)
	protectedRoutes.GET("/tournaments/:tId", tournamentsHandler.GetTournamentById)

	// forms
	protectedRoutes.GET("/tournaments/:tId/registrations", registrationHandler.GetRegistrations)
	protectedRoutes.POST("/tournaments/:tId/registrations", registrationHandler.SubmitRegistration)
	protectedRoutes.DELETE(("/tournaments/:tId/registrations/:uId"), registrationHandler.UnregisterUser)

	// stripe configuration
	protectedRoutes.POST("/payment-intent", paymentHandler.CreatePaymentIntent)

	router.Run("localhost:" + port)
}
