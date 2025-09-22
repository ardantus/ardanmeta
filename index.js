const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Environment variables
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'your_verify_token';
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const WEBHOOK_VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || VERIFY_TOKEN;

// Webhook verification endpoint (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('Webhook verification request:', { mode, token });

  if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
    console.log('Webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.log('Webhook verification failed');
    res.status(403).send('Forbidden');
  }
});

// Webhook endpoint for receiving messages (POST)
app.post('/webhook', (req, res) => {
  console.log('Incoming webhook:', JSON.stringify(req.body, null, 2));

  const body = req.body;

  // Check if the webhook request contains a WhatsApp status update
  if (body.object && body.object === 'whatsapp_business_account') {
    if (body.entry && body.entry.length > 0) {
      body.entry.forEach(entry => {
        const webhookBody = entry.changes[0].value;
        
        console.log('Webhook body:', JSON.stringify(webhookBody, null, 2));

        // Check if the webhook contains a message
        if (webhookBody.messages && webhookBody.messages.length > 0) {
          const message = webhookBody.messages[0];
          const from = message.from; // Phone number that sent the message
          const msgBody = message.text ? message.text.body : '';
          
          console.log(`Message from ${from}: ${msgBody}`);
          
          // Process the message and send a response
          handleIncomingMessage(from, msgBody, webhookBody);
        }

        // Check if the webhook contains a status update
        if (webhookBody.statuses && webhookBody.statuses.length > 0) {
          const status = webhookBody.statuses[0];
          console.log('Message status update:', status);
        }
      });
    }

    res.status(200).send('EVENT_RECEIVED');
  } else {
    console.log('Not a WhatsApp webhook event');
    res.status(404).send('Not a WhatsApp webhook event');
  }
});

// Function to handle incoming messages
async function handleIncomingMessage(from, messageBody, webhookBody) {
  try {
    // Simple echo response - you can customize this logic
    const responseMessage = `Echo: ${messageBody}`;
    
    // Send response back to the user
    await sendMessage(from, responseMessage);
    
    console.log(`Response sent to ${from}: ${responseMessage}`);
  } catch (error) {
    console.error('Error handling incoming message:', error);
  }
}

// Function to send messages via WhatsApp Cloud API
async function sendMessage(to, message) {
  if (!ACCESS_TOKEN) {
    console.error('ACCESS_TOKEN not provided');
    return;
  }

  const phone_number_id = process.env.PHONE_NUMBER_ID;
  
  if (!phone_number_id) {
    console.error('PHONE_NUMBER_ID not provided');
    return;
  }

  const url = `https://graph.facebook.com/v17.0/${phone_number_id}/messages`;
  
  const data = {
    messaging_product: 'whatsapp',
    to: to,
    text: { body: message }
  };

  const config = {
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await axios.post(url, data, config);
    console.log('Message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'WhatsApp Meta Cloud API Webhook'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'WhatsApp Meta Cloud API Webhook Server',
    status: 'running',
    endpoints: {
      webhook_verification: 'GET /webhook',
      webhook_handler: 'POST /webhook',
      health_check: 'GET /health'
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 WhatsApp Webhook Server is running on port ${PORT}`);
  console.log(`📱 Webhook URL: /webhook`);
  console.log(`🔍 Health check: /health`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;