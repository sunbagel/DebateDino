package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Symbol type (name in mongodb)

type Tournament struct {
	// ID           primitive.ObjectID   `json:"_id"`
	Host            primitive.ObjectID   `json:"host" validate:"required"`
	Name            string               `json:"name" validate:"required,min=2"`
	Description     string               `json:"description" validate:"required,min=10"`
	Location        string               `json:"location" validate:"required"`
	Date            string               `json:"date" validate:"required"`  // could add datetime validation
	Image           string               `json:"image" validate:"required"` // url validation
	DebatersPerTeam int                  `json:"debatersPerTeam" validate:"required,min=1"`
	MaxTeams        int                  `json:"maxTeams" validate:"required,min=2"` // could be optional?
	MaxTeamSlots    int                  `json:"maxTeamSlots" validate:"required"`
	Debaters        []primitive.ObjectID `json:"debaters" validate:"required,dive"`
	Judges          []primitive.ObjectID `json:"judges" validate:"required,dive"`    // dive checks for nested fields in map/array(slices)
	Form            *Form                `json:"form" validate:"required,omitempty"` // no empty forms. recursively check subfields.
	RefundPolicy    string               `json:"refundPolicy" validate:"required"`   // could use oneof tag
}

type User struct {
	// ID            primitive.ObjectID   `json:"_id"`
	Name        string               `json:"name" validate:"required"`
	Password    string               `json:"password" validate:"required"`
	Email       string               `json:"email" validate:"required"`
	Institution string               `json:"institution" validate:"required"`
	Agreement   string               `json:"agreement" validate:"required"`
	Debating    []primitive.ObjectID `json:"debating" validate:"required,dive"`
	Judging     []primitive.ObjectID `json:"judging" validate:"required,dive"`
	Hosting     []primitive.ObjectID `json:"hosting" validate:"required,dive"`
}

// form structure structs

// question structure
type Question struct {
	ID         primitive.ObjectID `json:"_id" validate:"required"`
	Type       string             `json:"type" validate:"required,oneof=textarea input number select"`
	Text       string             `json:"text" validate:"required"`
	IsRequired bool               `json:"isRequired"`
	Options    []string           `json:"options,omitempty"`
}

// form structure
type Form struct {
	// ID        primitive.ObjectID `json:"_id"`
	// bson isn't really doing anything for us here.
	Questions       []Question `bson:"questions" json:"questions" validate:"required,dive"`
	TeamQuestions   []Question `bson:"teamQuestions" json:"teamQuestions" validate:"required,dive"`
	MemberQuestions []Question `bson:"memberQuestions" json:"memberQuestions" validate:"required,dive"`
}

// registration structs

// answer to question
type QuestionResponse struct {
	// ID       primitive.ObjectID `json:"_id"`
	Question primitive.ObjectID `json:"questionId" validate:"required"` // should this be a reference to the question, or just contain the question's text?
	Answer   string             `json:"answer" validate:"required"`
}

// data of member
type MemberData struct {
	// MemberID        primitive.ObjectID `json:"memberId"`
	MemberResponses []QuestionResponse `json:"memberResponses"`
}

// data of team
type TeamData struct {
	// TeamID        primitive.ObjectID `json:"teamId"`
	TeamResponses []QuestionResponse `json:"teamResponses"`
	Members       []MemberData       `json:"memberData"`
}

// registration data
type Registration struct {
	// ID            primitive.ObjectID `json:"_id"`
	TournamentID     primitive.ObjectID `json:"tournamentId" validate:"required"`     // reference to the Form's structure
	ParticipantID    primitive.ObjectID `json:"userId" validate:"required"`           // submittant's id
	GeneralResponses []QuestionResponse `json:"generalResponses" validate:"required"` // responses to questions
	Teams            []TeamData         `json:"teams" validate:"required,dive"`
}
