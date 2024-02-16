package routes

import (
	"server/routes"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/mongo"
)

var userCollection *mongo.Collection = routes.OpenCollection(routes.Client, "tournaments")

var validate = validator.New()

func GetTournaments(c *gin.Context) {

}
