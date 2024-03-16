package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Symbol type (name in mongodb)

type Tournament struct {
	// ID           primitive.ObjectID   `json:"_id"`
	Host            primitive.ObjectID   `bson:"host" json:"host" validate:"required"`
	Name            string               `bson:"name" json:"name" validate:"required,min=2"`
	Description     string               `bson:"description" json:"description" validate:"required,min=10"`
	Location        string               `bson:"location" json:"location" validate:"required"`
	Date            string               `bson:"date" json:"date" validate:"required"`   // could add datetime validation
	Image           string               `bson:"image" json:"image" validate:"required"` // url validation
	DebatersPerTeam int                  `bson:"debatersPerTeam" json:"debatersPerTeam" validate:"required,min=1"`
	MaxTeams        int                  `bson:"maxTeams" json:"maxTeams" validate:"required,min=2"`         // could be optional?
	CurrentTeams    int                  `bson:"currentTeams" json:"currentTeams" validate:"required,min=0"` // current # of registered teams
	MaxTeamSlots    int                  `bson:"maxTeamSlots" json:"maxTeamSlots" validate:"required"`
	Debaters        []primitive.ObjectID `bson:"debaters" json:"debaters" validate:"required,dive"`
	Judges          []primitive.ObjectID `bson:"judges" json:"judges" validate:"required,dive"`        // dive checks for nested fields in map/array(slices)
	Form            *Form                `bson:"form" json:"form" validate:"required,omitempty"`       // no empty forms. recursively check subfields.
	RefundPolicy    string               `bson:"refundPolicy" json:"refundPolicy" validate:"required"` // could use oneof tag
}

type User struct {
	// ID            primitive.ObjectID   `json:"_id"`
	Name        string               `bson:"name" json:"name" validate:"required"`
	Password    string               `bson:"password" json:"password" validate:"required"`
	Email       string               `bson:"email" json:"email" validate:"required"`
	Institution string               `bson:"institution" json:"institution" validate:"required"`
	Agreement   string               `bson:"agreement" json:"agreement" validate:"required"`
	Debating    []primitive.ObjectID `bson:"debating" json:"debating" validate:"required,dive"`
	Judging     []primitive.ObjectID `bson:"judging" json:"judging" validate:"required,dive"`
	Hosting     []primitive.ObjectID `bson:"hosting" json:"hosting" validate:"required,dive"`
}

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

// registration structs

// answer to question
type QuestionResponse struct {
	// ID       primitive.ObjectID `json:"_id"`
	Question primitive.ObjectID `bson:"questionId" json:"questionId" validate:"required"` // should this be a reference to the question, or just contain the question's text?
	Answer   string             `bson:"answer" json:"answer" validate:"required"`
}

// data of member
type MemberData struct {
	// ID        primitive.ObjectID `json:"_id"`
	MemberResponses []QuestionResponse `bson:"memberResponses" json:"memberResponses" validate:"required,dive"`
}

// data of team
type TeamData struct {
	// ID        primitive.ObjectID `json:"_id"`
	TeamResponses []QuestionResponse `bson:"teamResponses" json:"teamResponses" validate:"required,dive"`
	Members       []MemberData       `bson:"members" json:"members" validate:"required,dive"`
}

// registration data
type Registration struct {
	// ID            primitive.ObjectID `json:"_id"`
	TournamentID     primitive.ObjectID `bson:"tournamentId" json:"tournamentId" validate:"required"`         // reference to the Form's structure
	ParticipantID    primitive.ObjectID `bson:"userId" json:"userId" validate:"required"`                     // submittant's id
	GeneralResponses []QuestionResponse `bson:"generalResponses" json:"generalResponses" validate:"required"` // responses to questions
	Teams            []TeamData         `bson:"teams" json:"teams" validate:"required,dive"`
}
