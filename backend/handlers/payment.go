package handlers

import (
	"fmt"
	"net/http"
	"os"
	"server/models"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v78"
	"github.com/stripe/stripe-go/v78/paymentintent"
)

func (handler *RouteHandler) CreatePaymentIntent(c *gin.Context) {
	var payment models.Payment

	// bind input json to tournament variable
	if err := c.BindJSON(&payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	// initialize stripe client
	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")

	// create PaymentIntent with stripe
	stripeParams := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(int64(payment.Amount)),
		Currency: stripe.String(string(stripe.CurrencyCAD)),
		AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
			Enabled: stripe.Bool(true),
		},
	}
	intent, err := paymentintent.New(stripeParams)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Payment Intent", "message": err})
		return
	}

	// make sure to pass the client secret to the frontend for payment confirmation
	clientSecret := intent.ClientSecret

	c.JSON(http.StatusOK, gin.H{"client_secret": clientSecret})
}
