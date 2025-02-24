const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc'); // Replace with your actual Stripe Secret Key

const app = express();

// Enable CORS for frontend communication
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Allow requests from your frontend
    methods: ['GET', 'POST'],
    credentials: true,
}));

app.use(express.json()); // Use express built-in JSON parser

// Endpoint to handle payment
app.post('/charge', async (req, res) => {
    const { stripeToken, amount } = req.body;

    try {
        // Create a charge using the token
        const charge = await stripe.charges.create({
            amount, // Amount in cents
            currency: 'usd',
            source: stripeToken,
            description: 'Example charge',
        });

        // Retrieve payment method details from the charge
        const paymentMethod = await stripe.paymentMethods.retrieve(charge.payment_method);

        // Send a success response with card details
        res.json({
            success: true,
            message: 'Payment successful!',
            card_details: {
                brand: paymentMethod.card.brand,
                last4: paymentMethod.card.last4,
                exp_month: paymentMethod.card.exp_month,
                exp_year: paymentMethod.card.exp_year,
                country: paymentMethod.card.country,
            },
            charge_id: charge.id,
        });

    } catch (error) {
        // Send an error response
        res.status(500).json({ success: false, message: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
