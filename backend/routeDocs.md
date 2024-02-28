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

