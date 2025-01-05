package models

import "go.mongodb.org/mongo-driver/bson/primitive"

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
