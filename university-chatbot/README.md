# University Website Chatbot – Hybrid Design

A modern, interactive chatbot for university websites that combines button-based navigation with natural language processing powered by Azure OpenAI.

![University Chatbot Demo](https://via.placeholder.com/800x400/667eea/white?text=University+Chatbot+Demo)

## 🌟 Features

- **Hybrid Interface**: Button-driven navigation + natural language chat
- **Azure OpenAI Integration**: Intelligent responses using GPT models
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Rich Content**: Markdown support, clickable links, and formatted responses
- **Real-time Conversation**: Maintains conversation history and context
- **Comprehensive Coverage**: Academics, admissions, tuition, and campus life

## 🏗️ Architecture

### Frontend (React)
- Modern React application with hooks
- Responsive design with CSS Grid and Flexbox
- Real-time chat interface with markdown rendering
- Interactive button hierarchy for guided navigation

### Backend (Node.js/Express)
- RESTful API for chat and button interactions
- Azure OpenAI service integration
- Comprehensive university data structure
- Session management and conversation history

### AI Integration
- Azure OpenAI GPT models for natural language understanding
- Intelligent fallback responses when AI is unavailable
- Context-aware responses based on university data

## 📋 Requirements

- Node.js 16.0.0 or higher
- npm or yarn package manager
- Azure OpenAI subscription (optional - fallback responses available)

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-repo/university-chatbot.git
cd university-chatbot

# Install all dependencies
npm run install:all
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your Azure OpenAI credentials:

```env
# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
AZURE_OPENAI_API_KEY=your_api_key_here
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-35-turbo
AZURE_OPENAI_API_VERSION=2024-02-15-preview

# Server Configuration
PORT=3001
NODE_ENV=development

# University Website Base URL
UNIVERSITY_BASE_URL=https://your-university.edu
```

### 3. Start Development Servers

```bash
# Start both frontend and backend simultaneously
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 🔧 Azure OpenAI Setup

### Step 1: Create Azure OpenAI Resource

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new "Azure OpenAI" resource
3. Choose your subscription, resource group, and region
4. Select pricing tier (Standard S0 recommended)

### Step 2: Deploy a Model

1. Navigate to your Azure OpenAI resource
2. Go to "Model deployments" 
3. Click "Create new deployment"
4. Select model: `gpt-35-turbo` or `gpt-4`
5. Name your deployment (e.g., "university-chatbot")

### Step 3: Get API Credentials

1. Go to "Keys and Endpoint" in your Azure OpenAI resource
2. Copy the endpoint URL and API key
3. Update your `.env` file with these values

### Alternative: OpenAI API Setup

If you prefer using OpenAI directly instead of Azure OpenAI:

1. Get an API key from [OpenAI Platform](https://platform.openai.com)
2. Update the backend service to use OpenAI instead of Azure OpenAI
3. Modify `backend/services/azureOpenAI.js` accordingly

## 📁 Project Structure

```
university-chatbot/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ChatWindow.js
│   │   │   ├── ButtonGrid.js
│   │   │   └── *.css
│   │   ├── App.js          # Main App component
│   │   └── index.js        # React entry point
│   └── package.json
├── backend/                 # Node.js/Express backend
│   ├── data/               # University data and configuration
│   │   └── universityData.js
│   ├── services/           # External service integrations
│   │   └── azureOpenAI.js
│   ├── server.js          # Express server
│   ├── .env.example       # Environment variables template
│   └── package.json
├── docs/                   # Documentation and guides
├── package.json           # Root package.json for scripts
└── README.md
```

## 🎯 User Interaction Flow

### 1. Initial Welcome
- Users see main topic buttons
- Welcome message explains available options

### 2. Button Navigation
- **Academic Programs** → Science & Biology, Arts & Sciences, Data Science
- **Admissions** → Application process, International students, Test requirements
- **Tuition & Fees** → Costs, Scholarships, Payment options
- **Campus Life** → Housing, Sports, Mental health support

### 3. Natural Language Chat
- Click "Ask a Question" to switch to free-text input
- AI processes queries and provides contextual responses
- Responses include relevant links to university pages

### 4. Hybrid Usage
- Users can switch between buttons and chat seamlessly
- Conversation history is maintained throughout the session

## 📊 API Endpoints

### Chat Endpoints
- `POST /api/chat` - Process natural language messages
- `POST /api/button-click` - Handle button interactions
- `GET /api/buttons` - Get button hierarchy configuration

### Session Management
- `GET /api/conversation/:sessionId` - Get conversation history
- `DELETE /api/conversation/:sessionId` - Clear conversation history

### Data Endpoints
- `GET /api/data/:category` - Get university data by category
- `GET /health` - Health check endpoint

## 🎨 Customization

### University Data
Edit `backend/data/universityData.js` to customize:
- Academic programs and courses
- Admissions requirements and deadlines  
- Tuition costs and scholarships
- Campus life information

### Button Hierarchy
Modify the `buttonHierarchy` object in `universityData.js` to change:
- Main topic buttons
- Subcategory options
- Button labels and icons

### Styling
- Update CSS files in `frontend/src/components/`
- Modify color scheme in CSS custom properties
- Adjust responsive breakpoints and layouts

### AI Prompts
Customize AI behavior in `backend/services/azureOpenAI.js`:
- System prompts for different conversation styles
- Response formatting and link generation
- Fallback response logic

## 🚀 Deployment

### Backend Deployment (Azure App Service)

1. Create an Azure App Service
2. Configure environment variables in App Service settings
3. Deploy using Azure CLI or GitHub Actions:

```bash
# Using Azure CLI
az webapp up --name your-chatbot-api --resource-group your-rg
```

### Frontend Deployment (Netlify/Vercel)

1. Build the production version:
```bash
cd frontend && npm run build
```

2. Deploy `build` folder to Netlify, Vercel, or Azure Static Web Apps

3. Update API endpoints to point to your deployed backend

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🔍 Sample Questions the Chatbot Handles

### Academic Programs
- "What courses are available for science?"
- "Do you offer any data science programs?"
- "List majors under the College of Arts and Sciences"

### Admissions
- "How do I apply for undergraduate programs?"
- "Is there a deadline for international students?"
- "Can I apply without SAT scores?"

### Tuition and Fees
- "What's the tuition for out-of-state students?"
- "Are there any scholarships for transfer students?"

### Campus Life
- "Where can I find mental health resources?"
- "Do you offer student housing for graduates?"
- "What sports are offered on campus?"

## 🛠️ Development

### Running Tests
```bash
# Frontend tests
cd frontend && npm test

# Backend tests (if implemented)
cd backend && npm test
```

### Linting
```bash
# Lint frontend code
cd frontend && npm run lint

# Lint backend code  
cd backend && npm run lint
```

### Adding New Features

1. **New University Data**: Add to `backend/data/universityData.js`
2. **New Button Categories**: Update button hierarchy and handler functions
3. **New UI Components**: Create in `frontend/src/components/`
4. **New API Endpoints**: Add to `backend/server.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and request features via GitHub Issues
- **Discussions**: Join community discussions in GitHub Discussions

## 🔗 Useful Links

- [Azure OpenAI Documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/openai/)
- [React Documentation](https://reactjs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/)

---

**Built with ❤️ for educational institutions seeking to enhance student engagement through AI-powered assistance.**