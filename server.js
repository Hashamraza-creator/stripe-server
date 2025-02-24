const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc'); // Use your secret key

const app = express();
app.use(bodyParser.json());

// Endpoint to handle payment
app.post('/charge', async (req, res) => {
    const { stripeToken, amount } = req.body;

    try {
        // Create a charge using the token
        const charge = await stripe.charges.create({
            amount: amount, // Amount in cents
            currency: 'usd',
            source: stripeToken,
            description: 'Example charge',
        });

        // Send a success response
        res.json({ success: true, message: 'Payment successful!' });
    } catch (error) {
        // Send an error response
        res.status(500).json({ success: false, message: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));