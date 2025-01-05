package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	// ID            primitive.ObjectID   `json:"_id"`
	Name        string               `bson:"name" json:"name" validate:"required"`
	Username    string               `bson:"username" json:"username" validate:"required"`
	Password    string               `bson:"password" json:"password" validate:"required"`
	Email       string               `bson:"email" json:"email" validate:"required"`
	PhoneNumber string               `bson:"phoneNumber" json:"phoneNumber" validate:"required"`
	Institution string               `bson:"institution" json:"institution" validate:"required"`
	Agreement   string               `bson:"agreement" json:"agreement" validate:"required"`
	Debating    []primitive.ObjectID `bson:"debating" json:"debating" validate:"required,dive"`
	Judging     []primitive.ObjectID `bson:"judging" json:"judging" validate:"required,dive"`
	Hosting     []primitive.ObjectID `bson:"hosting" json:"hosting" validate:"required,dive"`
}
