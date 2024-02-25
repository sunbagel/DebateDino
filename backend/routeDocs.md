# Documentation for Endpoints:


## Users and Tournaments:

### Registering Users:
```
POST /tournaments/:id/registration

Body: 
{
    "userID": "65db8527dc2cf06766de1572"
}
```

### Get:
Split into two endpoints
#### Get a User's Tournaments:
```
GET /users/:id/tournaments
```

Filter by hosting, participating, or judging:
```
GET /users/:id/tournaments?role=host
GET /users/:id/tournaments?role=participant
GET /users/:id/tournaments?role=judge
```

#### Get a Tournment's Users:

```
GET /tournaments/:id/users
```

Filter by host, participants, or judges
```
GET /tournaments/:id/users?=role=host
GET /tournaments/:id/users?=role=participant
GET /tournaments/:id/users?=role=judge
```

- Could use multiquery filter to filter 2/3 of the roles maybe (?)


