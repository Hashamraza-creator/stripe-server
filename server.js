require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Enable CORS for frontend connection
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST'],
    credentials: true,
}));

app.use(bodyParser.json());

// Payment Endpoint
app.post('/charge', async (req, res) => {
    const { amount, paymentMethodId } = req.body;

    try {
        // Create a PaymentIntent with automatic payment methods (no redirects)
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never', // Prevents redirect-based payments
            },
        });

        // Retrieve the payment method details
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);

        // Send success response with card details
        res.json({
            success: true,
            message: 'Payment successful!',
            card_details: {
                brand: paymentMethod.card.brand,
                last4: paymentMethod.card.last4,
                exp_month: paymentMethod.card.exp_month,
                exp_year: paymentMethod.card.exp_year,
            },
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
