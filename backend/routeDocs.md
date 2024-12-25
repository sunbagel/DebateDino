# Documentation for Endpoints:

## Authentication:
A JWT Token must be received from Firebase, and used as a bearer token in your requests.

### FOR POSTMAN REQUESTS:
- For now, sign in on frontend and copy paste the token into Postman
- An endpoint for testing may be implemented in the future (generates a token)

## Users:

```
GET /users/:id
```
IMPORTANT:
- Get users takes the Firebase Id instead of the MongoDB object id.
- We can switch back to object id if desired. I figured Firebase is easier since we always have access to the Firebase User.

## Tournaments:

```
POST /tournaments/
{
    "host" : "65d69c469d47c04d60421fdb",
    "name" : "Tournament Registration Test",
    "description" : "TESTING REGISTRATION",
    "location" : "kings",
    "date" : "2/26/2024",
    "debatersPerTeam": 2,
    "maxTeams": 20,
    "maxTeamSlots": 4,
    "image" : "image url placeholder?",
    "form": {
        "questions" : [
            {
                "type": "textarea",
                "text": "wassup?",
                "isRequired": true
            },

            {
                "type": "input",
                "text": "whats ur name"
            },

            {
                "type": "select",
                "text": "select a fruit",
                "options": ["blueberry", "peach", "watermelon"],
                "isRequired": true
            }
        ]
    },
    "debaters" : [],
    "judges" : [],
    "refundPolicy" : "NO REFUNDMOND"
}

```

## Users and Tournaments:

### Registering Users --CURRENTLY NOT IN USE--:
Role is one of: "Debater", "Judge"
**Edit: Debaters should be registered via form submission**

```
POST /tournaments/:id/registration

Body: 
{
    "userID": "65db8527dc2cf06766de1572"
    "role": "Judge"
}
```

### Get:
Split into two endpoints
#### Get a User's Tournaments:
```
GET /users/:id/tournaments
```

Filter by hosting, debating, or judging:
```
GET /users/:id/tournaments?roles=host
GET /users/:id/tournaments?roles=debater
GET /users/:id/tournaments?roles=judge

Multiple Role Select:
GET /users/:id/tournaments?roles=Host&roles=Judge"
```

#### Get a Tournment's Users:

```
GET /tournaments/:id/users
```

Filter by host, debater, or judges
```
GET /tournaments/:id/users?=role=host
GET /tournaments/:id/users?=role=debater
GET /tournaments/:id/users?=role=judge
```

- Could use multiquery filter to filter 2/3 of the roles maybe (?)

## Forms
- Forms are embedded into Tournament documents
- Registrations are in their own collection 

### Form Schema:

Creating form structure should be part of tournament creation process, when the host defines questions.
A form contains Questions, TeamQuestions, and MemberQuestions. Each Question can be of a different type (check schema.go)
```
POST /tournaments

Example JSON Body:
{
  "name": "Annual Debatemond Tournament",
  ...
  "form": {
    "questions": [
      {
        "type": "input",
        "text": "What is your name?"
        "isRequired": true
      },
      {
        "type": "select", 
        "text": "Which category are you interested in?",
        "options": ["Beginner", "Intermediate", "Advanced"]
        "isRequired": true
      },
      {
        "type": "select",
        "text": "select a fruit",
        "options": ["blueberry", "peach", "watermelon"]
        "isRequired": false
      }

    ]
  }
}


```

Editing form structure for a tournament (NOT DONE)
NEED TO CONSIDER "LOCKING THE FORM", ex. after tournament has been posted, form should not be edited any further.
To maintain data integrity for our form responses (depends how we implement ?)
`PUT /tournaments/:id/form`

Deleting form structure for a tournament (? though a tournament should always have a form) (NOT DONE)
`DELETE /tournaments/:id/form`

### Registration:

Submitting a Registration (when a debater/judge signs up for the tournament):
```
POST /tournaments/:id/registrations
{
  "userId": "65e2331c8ff69d41e5674747", // alex3
  "generalResponses": [
    {
      "questionId": "65ee474c89202005ee1e085e",
      "answer": "not much, up dog?"
    },
    {
      "questionId": "65ee474c89202005ee1e085f",
      "answer": "signing up team! (ALEX 3)"
    },
    {
      "questionId": "65ee474c89202005ee1e0860",
      "answer": "peach"
    }
  ],
  "teams": [
    // team gentlemen (1)
    {
        // general responses
        "teamResponses": [
            {
                "questionId": "65ee474c89202005ee1e0861",
                "answer": "team gentlemen"
            },
            {
                "questionId": "65ee474c89202005ee1e0862",
                "answer": "top hat"
            }

        ],
        //members
        "members": [
            // member 1
            {
                
                "memberResponses": [
                    {
                        "questionId": "65ee474c89202005ee1e0863",
                        "answer": "Bobby Wobby Cho"
                    },
                    {
                        "questionId": "65ee474c89202005ee1e0864",
                        "answer": "orange"
                    }
                ]
            },
            // member 2
            {
                
                "memberResponses": [
                    {
                        "questionId": "65ee474c89202005ee1e0863",
                        "answer": "Alex"
                    },
                    {
                        "questionId": "65ee474c89202005ee1e0864",
                        "answer": "blue"
                    }
                ]
            }
            

        ]
    },
    // team cool guys (2)
    {
        "teamResponses": [
             {
                "questionId": "65ee474c89202005ee1e0861",
                "answer": "team cool guys"
            },
            {
                "questionId": "65ee474c89202005ee1e0862",
                "answer": "bucket hat"
            }

        ],
        // members
        "members": [
            // member 3
            {
                
                "memberResponses": [
                    {
                        "questionId": "65ee474c89202005ee1e0863",
                        "answer": "Raymond"
                    },
                    {
                        "questionId": "65ee474c89202005ee1e0864",
                        "answer": "orange"
                    }
                ]
            },
            // member 4
            {
                
                "memberResponses": [
                    {
                        "questionId": "65ee474c89202005ee1e0863",
                        "answer": "Kevin"
                    },
                    {
                        "questionId": "65ee474c89202005ee1e0864",
                        "answer": "blue"
                    }
                ]
            }
        ]
    }
  ]
}

```

Getting Registrations: (NOT DONE)
```
Get all Registrations:
GET /tournaments/:id/registrations

Filter by user (INCOMPLETE)
GET /tournaments/:id/registrations/?user=BOBBY WOBBY CHO

Get specific Registration (INCOMPLETE)
GET /tournaments/:id/registrations/:registrationsId
```


Edit Registration: (INCOMPLETE)
` PUT /tournaments/:id/registrations/:userId `
- should be able to delete specific teams/modify specific members
- form data modification? maybe...

Delete Registration:
- removes user's registration from the tournament
` DELETE /tournaments/:id/registrations/:userId `




