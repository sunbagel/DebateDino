# Getting Setup (FOR DEVS):

## Dependencies:
[Install Go version 1.22.0](https://go.dev/doc/install) and npm

### Backend:
- run `go mod tidy` to install all packages
- use .env file for backend provided by Alex
- copy serviceAccountKey.json to the path /backend/db/
- in the env file, modify FBCONFIG_PATH to match

`go run main.go` to run the backend server. if you make a change you have to close and restart the server.

### Frontend:
- run `npm install`
- use .env file for frontend provided by Alex
- `npm run dev` to run on localhost. changes are reflected automatically.
