# WhatsApp Meta Cloud API Webhook

A robust Express.js webhook server for WhatsApp Meta Cloud API, designed for deployment on Render.com.

## Features

- ✅ Webhook verification for Meta's WhatsApp Cloud API
- ✅ Message receiving and processing
- ✅ Message sending capabilities
- ✅ Status update handling
- ✅ Health check endpoint
- ✅ Error handling and logging
- ✅ Environment-based configuration
- ✅ Ready for Render.com deployment

## Quick Start

### 1. Clone and Setup

```bash
git clone https://github.com/ardantus/ardanmeta.git
cd ardanmeta
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
PORT=3000
NODE_ENV=production
ACCESS_TOKEN=your_access_token_here
PHONE_NUMBER_ID=your_phone_number_id_here
VERIFY_TOKEN=your_custom_verify_token_here
```

### 3. Run Locally

```bash
npm start
```

The server will start on `http://localhost:3000`

## Meta for Developers Setup

### 1. Create a Meta App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app
3. Add the WhatsApp product

### 2. Get Required Credentials

- **ACCESS_TOKEN**: From WhatsApp > API Setup page
- **PHONE_NUMBER_ID**: From WhatsApp > API Setup page
- **VERIFY_TOKEN**: Create your own secure token

### 3. Configure Webhook

In your Meta app's WhatsApp configuration:

- **Webhook URL**: `https://your-app.onrender.com/webhook`
- **Verify Token**: Same as your `VERIFY_TOKEN` in `.env`
- **Webhook Fields**: Select `messages` and `message_status`

## Deployment on Render.com

### 1. Connect Repository

1. Create a [Render.com](https://render.com) account
2. Create a new Web Service
3. Connect your GitHub repository

### 2. Configure Environment Variables

In your Render service settings, add these environment variables:

```
ACCESS_TOKEN=your_access_token_here
PHONE_NUMBER_ID=your_phone_number_id_here
VERIFY_TOKEN=your_custom_verify_token_here
NODE_ENV=production
```

### 3. Deploy

Render will automatically deploy your app. The webhook URL will be:
`https://your-app-name.onrender.com/webhook`

## API Endpoints

### Webhook Endpoints

- `GET /webhook` - Webhook verification
- `POST /webhook` - Receive messages and status updates

### Utility Endpoints

- `GET /` - API information
- `GET /health` - Health check

## Message Handling

The webhook currently implements a simple echo functionality. Customize the `handleIncomingMessage` function in `index.js` to add your business logic:

```javascript
async function handleIncomingMessage(from, messageBody, webhookBody) {
  // Your custom logic here
  const responseMessage = `You said: ${messageBody}`;
  await sendMessage(from, responseMessage);
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 3000) | No |
| `ACCESS_TOKEN` | WhatsApp Cloud API access token | Yes |
| `PHONE_NUMBER_ID` | WhatsApp phone number ID | Yes |
| `VERIFY_TOKEN` | Webhook verification token | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## Security Considerations

- Always use HTTPS in production
- Keep your ACCESS_TOKEN secure
- Use a strong VERIFY_TOKEN
- Consider implementing webhook signature verification
- Monitor your webhook for unusual activity

## Troubleshooting

### Webhook Verification Fails

- Ensure `VERIFY_TOKEN` matches what you set in Meta's webhook configuration
- Check that your webhook URL is accessible from the internet

### Messages Not Being Received

- Verify webhook subscription includes `messages` field
- Check server logs for errors
- Ensure your phone number is registered for testing

### Cannot Send Messages

- Verify `ACCESS_TOKEN` and `PHONE_NUMBER_ID` are correct
- Ensure recipient phone number is in international format
- Check if your app is in development mode (limited to test numbers)

## Development

### Local Development

```bash
npm run dev
```

### Testing Webhook Locally

Use a service like ngrok to expose your local server:

```bash
# Install ngrok
npm install -g ngrok

# Expose port 3000
ngrok http 3000
```

Use the ngrok URL for webhook configuration during development.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Support

For issues and questions, please open an issue in this repository.
