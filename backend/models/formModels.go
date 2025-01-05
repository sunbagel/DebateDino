package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// form structure structs
// question structure
type Question struct {
	ID         primitive.ObjectID `json:"_id" validate:"required"`
	Type       string             `bson:"type" json:"type" validate:"required,oneof=textarea input number select"`
	Text       string             `bson:"text" json:"text" validate:"required"`
	IsRequired bool               `bson:"isRequired" json:"isRequired"`
	Options    []string           `bson:"options,omitempty" json:"options,omitempty"`
}

// form structure
type Form struct {
	// ID        primitive.ObjectID `json:"_id"`
	// bson isn't really doing anything for us here.
	Questions       []Question `bson:"questions" json:"questions" validate:"required,dive"`
	TeamQuestions   []Question `bson:"teamQuestions" json:"teamQuestions" validate:"required,dive"`
	MemberQuestions []Question `bson:"memberQuestions" json:"memberQuestions" validate:"required,dive"`
}
