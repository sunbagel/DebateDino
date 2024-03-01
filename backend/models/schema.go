package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Symbol type (name in mongodb)

type Tournament struct {
	// ID           primitive.ObjectID   `json:"_id"`
	Host         primitive.ObjectID   `json:"host" validate:"required"`
	Name         string               `json:"name" validate:"required,min=2"`
	Description  string               `json:"description" validate:"required,min=10"`
	Location     string               `json:"location" validate:"required"`
	Date         string               `json:"date" validate:"required"`  // could add datetime validation
	Image        string               `json:"image" validate:"required"` // url validation
	Debaters     []primitive.ObjectID `json:"debaters" validate:"dive,required"`
	Judges       []primitive.ObjectID `json:"judges" validate:"dive,required"`    // dive checks for nested fields in map/array(slices)
	Form         *Form                `json:"form" validate:"required,omitempty"` // no empty forms. recursively check subfields.
	RefundPolicy string               `json:"refundPolicy" validate:"required"`   // could use oneof tag
}

type User struct {
	// ID            primitive.ObjectID   `json:"_id"`
	Name        string               `json:"name"`
	Password    string               `json:"password"`
	Email       string               `json:"email"`
	Institution string               `json:"institution"`
	Agreement   string               `json:"agreement"`
	Debating    []primitive.ObjectID `json:"debating"`
	Judging     []primitive.ObjectID `json:"judging"`
	Hosting     []primitive.ObjectID `json:"hosting"`
}

type Question struct {
	ID         primitive.ObjectID `json:"_id" validate:"required"`
	Type       string             `json:"type" validate:"required,oneof=textarea input number"`
	Text       string             `json:"text" validate:"required"`
	IsRequired bool               `json:"isRequired"`
}

type Form struct {
	// ID        primitive.ObjectID `json:"_id"`
	Questions []Question `json:"questions" validate:"required,dive"`
}

type QuestionResponse struct {
	// ID       primitive.ObjectID `json:"_id"`
	Question primitive.ObjectID `json:"questionId" validate:"required"` // should this be a reference to the question, or just contain the question's text?
	Answer   string             `json:"answer" validate:"required"`
}

type FormResponse struct {
	// ID            primitive.ObjectID `json:"_id"`
	TournamentID primitive.ObjectID `json:"tournamentId" validate:"required"` // reference to the Form's structure
	Participant  primitive.ObjectID `json:"userId" validate:"required"`       // submittant's id
	Responses    []QuestionResponse `json:"responses" validate:"required"`    // responses to questions
	// (should be validated in frontend and backend)
}
