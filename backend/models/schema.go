package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Symbol type (name in mongodb)

type Tournament struct {
	// ID           primitive.ObjectID   `json:"_id"`
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
	// ID            primitive.ObjectID   `json:"_id"`
	Name          string               `json:"name"`
	Password      string               `json:"password"`
	Email         string               `json:"email"`
	Institution   string               `json:"institution"`
	Agreement     string               `json:"agreement"`
	Participating []primitive.ObjectID `json:"participating"`
	Judging       []primitive.ObjectID `json:"judging"`
	Hosting       []primitive.ObjectID `json:"hosting"`
}

type Question struct {
	// ID   primitive.ObjectID `json:"_id"`
	Type string   `json:"type"`
	Text []string `json:"text"`
}

type Form struct {
	// ID        primitive.ObjectID `json:"_id"`
	Questions []Question `json:"questions"`
}

type QuestionResponse struct {
	// ID       primitive.ObjectID `json:"_id"`
	Question primitive.ObjectID `json:"question"` // should this be a reference to the question, or just contain the question's text?
	Answer   string             `json:"answer"`
}

type FormResponse struct {
	// ID            primitive.ObjectID `json:"_id"`
	FormStructure primitive.ObjectID `json:"formId"`    // reference to the Form's structure
	Participant   primitive.ObjectID `json:"userId"`    // submittant's id
	Responses     []QuestionResponse `json:"responses"` // responses to questions (should be validated in frontend and backend)
}
