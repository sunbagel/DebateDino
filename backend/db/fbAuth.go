package db

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"github.com/gin-gonic/gin"

	"google.golang.org/api/option"
)

func InitFirebaseAuth() *auth.Client {

	ctx := context.Background()

	// enter full path of serviceAccountKey.json
	fbConfigPath := os.Getenv("FBCONFIG_PATH")
	opt := option.WithCredentialsFile(fbConfigPath + "serviceAccountKey.json")
	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}

	authClient, err := app.Auth(ctx)
	if err != nil {
		log.Fatalf("error getting Auth client: %v\n", err)
	}

	return authClient

}

func VerifyTokenMiddleware(auth *auth.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		splitToken := strings.Split(authHeader, "Bearer ")
		fmt.Println(splitToken)
		if len(splitToken) != 2 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Authorization header format must be \"Bearer <token>\""})
			c.Abort()
			return
		}
		// get token
		fbIdToken := splitToken[1]
		// fmt.Println(fbIdToken)
		decodedToken, err := auth.VerifyIDToken(context.Background(), fbIdToken)

		// if token is correct format, not expired, and properly signed (doesn't check for revocation)
		// only check for revocation for important security (it is an expensive operation)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "error validating firebase token"})
			fmt.Println(err)
			c.Abort()
			return
		}

		// attach token to context
		c.Set("firebaseToken", decodedToken)
		c.Next()
	}
}
