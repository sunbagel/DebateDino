# Documentation for Endpoints:


## Users and Tournaments:

### Registering Users:
Role is one of: "Debater", "Judge"
```
POST /tournaments/:id/registration

Body: 
{
    "userID": "65db8527dc2cf06766de1572"
    "role": "Debater"
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
GET /users/:id/tournaments?role=host
GET /users/:id/tournaments?role=debater
GET /users/:id/tournaments?role=judge
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

### Form Structure:

Creating form structure should be part of tournament creation process
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
        "type": "choice", // NOT A THING YET
        "text": "Which category are you interested in?",
        "options": ["Beginner", "Intermediate", "Advanced"]
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

Deleting form structure for a tournament (? though it should be mandatory) (NOT DONE)
`DELETE /tournaments/:id/form`

### Form Response:

Submitting Response:
```
POST /tournaments/:id/responses
{
  "tournamentId": "123abc",
  "userId": "456def",
  "responses": [
    {
      "questionId": "<questionObjectId>",
      "answer": "John Doe"
    },
    {
      "questionId": "<questionObjectId>",
      "answer": "Debate"
    },
    {
      "questionId": "<questionObjectId>",
      "answer": "john.doe@example.com"
    }
  ]
}

```

Getting Responses: (NOT DONE)
```
Get all responses:
GET /tournaments/:id/responses

Filter by user (? possible)
GET /tournaments/:id/responses/?user=BOBBY WOBBY CHO

Get specific response:
GET /tournaments/:id/responses/:responseID
```


Edit Response: (NOT DONE)
` PUT /tournaments/:id/responses/:responseID `

Delete Response: (NOT DONE)
` DELETE /tournaments/:id/responses/:responseID `




