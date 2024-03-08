package handlers

import (
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/mongo"
)

// general handler
// define UserHandler to better encapsulate collection pointers.
// less exposed compared to a global collection variable

// if we need more fields in the future, we can use struct embedding to "extend" (like a subclass) the RouteHandler
type RouteHandler struct {
	client     *mongo.Client
	collection *mongo.Collection
	validate   *validator.Validate
}

// "constructor"
// returns an instance of RouteHandler struct
func NewRouteHandler(client *mongo.Client, collection *mongo.Collection, validate *validator.Validate) *RouteHandler {
	return &RouteHandler{client: client, collection: collection, validate: validate}
}
