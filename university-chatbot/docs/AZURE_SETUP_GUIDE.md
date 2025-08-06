# Azure OpenAI Setup Guide

This guide will walk you through setting up Azure OpenAI for the University Chatbot.

## Prerequisites

- Azure subscription (sign up at [azure.microsoft.com](https://azure.microsoft.com))
- Access to Azure OpenAI (may require approval)

## Step 1: Request Azure OpenAI Access

1. Visit [Azure OpenAI Access Request](https://aka.ms/oai/access)
2. Fill out the application form
3. Wait for approval (typically 1-2 business days)

## Step 2: Create Azure OpenAI Resource

1. **Sign in to Azure Portal**
   - Go to [portal.azure.com](https://portal.azure.com)
   - Sign in with your Azure account

2. **Create Resource**
   - Click "Create a resource"
   - Search for "Azure OpenAI"
   - Click "Create"

3. **Configure Resource**
   ```
   Subscription: Your Azure subscription
   Resource Group: Create new or use existing
   Region: East US, West Europe, or other supported region
   Name: university-chatbot-openai (or your preferred name)
   Pricing Tier: Standard S0
   ```

4. **Review and Create**
   - Review your settings
   - Click "Create"
   - Wait for deployment to complete

## Step 3: Deploy a Model

1. **Navigate to Your Resource**
   - Go to your Azure OpenAI resource
   - Click "Go to resource"

2. **Access Azure OpenAI Studio**
   - Click "Go to Azure OpenAI Studio"
   - Or visit [oai.azure.com](https://oai.azure.com)

3. **Create Model Deployment**
   - Go to "Deployments" tab
   - Click "Create new deployment"
   - Configure deployment:
     ```
     Model: gpt-35-turbo (recommended) or gpt-4
     Model version: Latest available
     Deployment name: university-chatbot
     Content filter: Default
     ```
   - Click "Create"

## Step 4: Get API Credentials

1. **Get Endpoint URL**
   - In Azure Portal, go to your OpenAI resource
   - Click "Keys and Endpoint"
   - Copy the "Endpoint" URL

2. **Get API Key**
   - Copy either "KEY 1" or "KEY 2"
   - Store securely (never commit to version control)

3. **Update Environment Variables**
   ```env
   AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
   AZURE_OPENAI_API_KEY=your_api_key_here
   AZURE_OPENAI_DEPLOYMENT_NAME=university-chatbot
   AZURE_OPENAI_API_VERSION=2024-02-15-preview
   ```

## Step 5: Test Your Setup

1. **Start the Backend Server**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Test API Connection**
   ```bash
   curl -X POST http://localhost:3001/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello", "sessionId": "test123"}'
   ```

3. **Check Logs**
   - Look for "Azure OpenAI client initialized successfully"
   - If you see warnings about fallback mode, check your credentials

## Pricing Information

### Azure OpenAI Pricing
- **GPT-3.5 Turbo**: ~$0.002 per 1K tokens
- **GPT-4**: ~$0.03 per 1K tokens
- **Estimated monthly cost**: $10-50 for moderate usage

### Cost Optimization Tips
1. Use GPT-3.5 Turbo for better cost efficiency
2. Implement token limits in your application
3. Cache frequent responses
4. Monitor usage in Azure Portal

## Security Best Practices

1. **Environment Variables**
   - Never commit API keys to version control
   - Use Azure Key Vault for production
   - Rotate keys regularly

2. **Network Security**
   - Configure virtual networks if needed
   - Use managed identities when possible
   - Enable monitoring and logging

3. **Access Control**
   - Use Azure RBAC for team access
   - Implement proper authentication in your app
   - Monitor API usage and costs

## Troubleshooting

### Common Issues

**Issue: "Access Denied" error**
- Ensure you have Azure OpenAI access approved
- Check your subscription has available quota
- Verify you're using the correct region

**Issue: "Model not found"**
- Ensure model deployment name matches your .env file
- Check deployment status in Azure OpenAI Studio
- Try recreating the deployment

**Issue: "Rate limit exceeded"**
- Check your pricing tier quota
- Implement exponential backoff in your code
- Monitor usage in Azure Portal

**Issue: "Invalid API key"**
- Verify the API key is correct
- Try regenerating keys in Azure Portal
- Check endpoint URL format

### Support Resources

- [Azure OpenAI Documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/openai/)
- [Azure Support](https://azure.microsoft.com/support/)
- [Community Forums](https://docs.microsoft.com/en-us/answers/topics/azure-openai.html)

## Alternative: Direct OpenAI Integration

If you prefer using OpenAI directly:

1. **Get OpenAI API Key**
   - Sign up at [platform.openai.com](https://platform.openai.com)
   - Create an API key

2. **Modify Backend Code**
   ```javascript
   // Replace Azure OpenAI client with OpenAI client
   import OpenAI from 'openai';
   
   const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY,
   });
   ```

3. **Update Environment Variables**
   ```env
   OPENAI_API_KEY=your_openai_api_key
   ```

This completes your Azure OpenAI setup! Your chatbot should now have intelligent AI-powered responses.