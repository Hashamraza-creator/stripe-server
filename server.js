const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc'); // Use your secret key

const app = express();
app.use(bodyParser.json());

// Define the /charge route
app.post('/charge', async (req, res) => {
    const { stripeToken, amount } = req.body;

    try {
        console.log('Received request:', { stripeToken, amount }); // Log the request data

        // Create a charge using the token
        const charge = await stripe.charges.create({
            amount: amount, // Amount in cents
            currency: 'usd',
            source: stripeToken, // Ensure this is the correct token
            description: 'Example charge',
        });

        console.log('Charge successful:', charge); // Log the successful charge

        // Send a success response
        res.json({ success: true, message: 'Payment successful!' });
    } catch (error) {
        console.error('Error creating charge:', error); // Log the error
        res.status(500).json({ success: false, message: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));