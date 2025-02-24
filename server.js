const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc'); // Use your real secret key

const app = express();

// Enable CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Adjust to match your frontend
    methods: ['GET', 'POST'],
    credentials: true,
}));

app.use(express.json()); // Express JSON parser

// Stripe Payment Endpoint
app.post('/charge', async (req, res) => {
    const { paymentMethodId, amount } = req.body;

    try {
        // Step 1: Create a PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount, // Amount in cents
            currency: 'usd',
            payment_method: paymentMethodId, // Use correct payment method
            confirm: true, // Automatically confirm the payment
        });

        // Step 2: Retrieve Payment Details
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);

        // Step 3: Send success response with card details
        res.json({
            success: true,
            message: 'Payment successful!',
            paymentIntentId: paymentIntent.id,
            card_details: {
                brand: paymentMethod.card.brand,
                last4: paymentMethod.card.last4,
                exp_month: paymentMethod.card.exp_month,
                exp_year: paymentMethod.card.exp_year,
                country: paymentMethod.card.country,
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
