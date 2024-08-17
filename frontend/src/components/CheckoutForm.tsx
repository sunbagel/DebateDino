import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { Card, CardContent, CardHeader } from "@/shadcn-components/ui/card";

export default function CheckoutForm({submitForm}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);
    
    // find a better way to ensure both mongo updates and stripe payment both must succeed
    try {
        submitForm();
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            // Make sure to change this to your payment completion page
            return_url: `${window.location.origin}`,
          },
        });
    
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message);
        } else {
          setMessage("An unexpected error occured.");
        }
    } catch (err) {
        console.error(err);
    }
    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <Card>
        <CardHeader><h1 className="text-2xl font-bold">Payment Information</h1></CardHeader>
        <CardContent>
            <PaymentElement id="payment-element" />
        </CardContent>
      </Card>
      <button disabled={isProcessing || !stripe || !elements} id="submit" className='mt-4 w-full bg-lime-200 hover:bg-lime-400 py-2 px-4 rounded'>
        <span id="button-text">
          {isProcessing ? "Processing ... " : 'Pay $10.00'}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}