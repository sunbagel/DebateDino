package models

import (
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Symbol type (name in mongodb)
type TournamentLevel string

const (
	Open         TournamentLevel = "open"
	Beginner     TournamentLevel = "beginner"
	Intermediate TournamentLevel = "intermediate"
	Advanced     TournamentLevel = "advanced"
)

func ValidateTournamentType(fl validator.FieldLevel) bool {
	value := TournamentLevel(fl.Field().String())
	switch value {
	case Open, Beginner, Intermediate, Advanced:
		return true
	}
	return false
}

type Fees struct {
	DebaterFee                  float64 `bson:"debaterFee" json:"debaterFee" validate:"required,min=0"`
	JudgeFee                    float64 `bson:"judgeFee" json:"judgeFee" validate:"required,min=0"`
	PenaltyPerMissingJudge      float64 `bson:"penaltyPerMissingJudge" json:"penaltyPerMissingJudge" validate:"required,min=0"`
	MinimumJudgesPerInstitution int     `bson:"minimumJudgesPerInstitution" json:"minimumJudgesPerInstitution" validate:"required,min=0"`
}

// Used in CreateTournament. No ID provided
type BaseTournament struct {
	Host            primitive.ObjectID   `bson:"host" json:"host" validate:"required"`
	Name            string               `bson:"name" json:"name" validate:"required,min=2"`
	Description     string               `bson:"description" json:"description" validate:"required,min=10"`
	Location        string               `bson:"location" json:"location" validate:"required"`
	StartDate       string               `bson:"startDate" json:"startDate" validate:"required"` // could add datetime validation
	EndDate         string               `bson:"endDate" json:"endDate" validate:"required"`
	AdditionalInfo  string               `bson:"additionalInfo" json:"additionalInfo" validate:"required"`
	TournamentLevel TournamentLevel      `bson:"tournamentLevel" json:"tournamentLevel" validate:"required,tournamentlevel"`
	Image           string               `bson:"image" json:"image" validate:"required"` // url validation
	DebatersPerTeam int                  `bson:"debatersPerTeam" json:"debatersPerTeam" validate:"required,min=1"`
	MaxTeams        int                  `bson:"maxTeams" json:"maxTeams" validate:"required,min=2"` // could be optional?
	CurrentTeams    int                  `bson:"currentTeams" json:"currentTeams" validate:"min=0"`  // current # of registered teams
	MaxTeamSlots    int                  `bson:"maxTeamSlots" json:"maxTeamSlots" validate:"required"`
	Fees            Fees                 `bson:"fees" json:"fees" validate:"required,dive"`
	Debaters        []primitive.ObjectID `bson:"debaters" json:"debaters" validate:"required,dive"`
	Judges          []primitive.ObjectID `bson:"judges" json:"judges" validate:"required,dive"`        // dive checks for nested fields in map/array(slices)
	Form            *Form                `bson:"form" json:"form" validate:"required"`                 // no empty forms. recursively check subfields.
	RefundPolicy    string               `bson:"refundPolicy" json:"refundPolicy" validate:"required"` // could use oneof tag
}

// contains all fields, including ID
type Tournament struct {
	ID             primitive.ObjectID `bson:"_id" json:"_id"`
	BaseTournament `bson:",inline"`   // embeds reset of fields
}
