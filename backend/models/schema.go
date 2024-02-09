package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Symbol type (name in mongodb)

type Tournament struct {
	ID           primitive.ObjectID   `bson:"_id"`
	Host         primitive.ObjectID   `json:"host"`
	Name         string               `json:"name"`
	Description  string               `json:"description"`
	Location     string               `json:"location"`
	Date         string               `json:"date"`
	Image        string               `json:"image"`
	Debaters     []primitive.ObjectID `json:"participants"`
	Judges       []primitive.ObjectID `json:"judges"`
	RefundPolicy string               `json:"refundPolicy"`
}

type User struct {
	ID            primitive.ObjectID   `bson:"_id"`
	Password      string               `json:"password"`
	Email         string               `json:"email"`
	Institution   string               `json:"institution"`
	Agreement     string               `json:"agreement"`
	Participating []primitive.ObjectID `json:"participating"`
	Judging       []primitive.ObjectID `json:"judging"`
	Hosting       []primitive.ObjectID `json:"hosting"`
}

type Question struct {
	ID   primitive.ObjectID `bson:"_id"`
	Type string             `json:"type"`
	Text []string           `json:"text"`
}

type Form struct {
	ID        primitive.ObjectID `bson:"_id"`
	Questions []Question         `json:"questions"`
}
