require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { universityData, buttonHierarchy } = require('./data/universityData');
const AzureOpenAIService = require('./services/azureOpenAI');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize services
const aiService = new AzureOpenAIService();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000']
}));
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Store conversation history (in production, use a database)
const conversations = new Map();

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get button hierarchy
app.get('/api/buttons', (req, res) => {
  try {
    res.json(buttonHierarchy);
  } catch (error) {
    console.error('Error fetching button hierarchy:', error);
    res.status(500).json({ error: 'Failed to fetch button hierarchy' });
  }
});

// Handle button clicks
app.post('/api/button-click', async (req, res) => {
  try {
    const { buttonId, sessionId } = req.body;
    
    if (!buttonId) {
      return res.status(400).json({ error: 'Button ID is required' });
    }

    let response = handleButtonClick(buttonId);
    
    // Store the interaction in conversation history
    if (sessionId) {
      if (!conversations.has(sessionId)) {
        conversations.set(sessionId, []);
      }
      conversations.get(sessionId).push(
        { role: 'user', content: `Clicked: ${buttonId}` },
        { role: 'assistant', content: response }
      );
    }

    res.json({ 
      response,
      buttonId,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error handling button click:', error);
    res.status(500).json({ error: 'Failed to process button click' });
  }
});

// Handle natural language queries
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get conversation history for this session
    const conversationHistory = sessionId ? conversations.get(sessionId) || [] : [];
    
    // Generate response using Azure OpenAI
    const response = await aiService.generateResponse(message, conversationHistory);
    
    // Store the conversation
    if (sessionId) {
      if (!conversations.has(sessionId)) {
        conversations.set(sessionId, []);
      }
      conversations.get(sessionId).push(
        { role: 'user', content: message },
        { role: 'assistant', content: response }
      );
      
      // Limit conversation history to last 10 exchanges
      const history = conversations.get(sessionId);
      if (history.length > 20) {
        conversations.set(sessionId, history.slice(-20));
      }
    }

    res.json({
      response,
      sessionId,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Get conversation history
app.get('/api/conversation/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const history = conversations.get(sessionId) || [];
    
    res.json({
      sessionId,
      history,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    res.status(500).json({ error: 'Failed to fetch conversation history' });
  }
});

// Clear conversation history
app.delete('/api/conversation/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    conversations.delete(sessionId);
    
    res.json({
      message: 'Conversation history cleared',
      sessionId,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error clearing conversation history:', error);
    res.status(500).json({ error: 'Failed to clear conversation history' });
  }
});

// Get university data for a specific category
app.get('/api/data/:category', (req, res) => {
  try {
    const { category } = req.params;
    
    let data;
    switch (category) {
      case 'academic-programs':
        data = universityData.academicPrograms;
        break;
      case 'admissions':
        data = universityData.admissions;
        break;
      case 'tuition-fees':
        data = universityData.tuitionFees;
        break;
      case 'campus-life':
        data = universityData.campusLife;
        break;
      default:
        return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(data);
    
  } catch (error) {
    console.error('Error fetching university data:', error);
    res.status(500).json({ error: 'Failed to fetch university data' });
  }
});

// Button click handler function
function handleButtonClick(buttonId) {
  const baseUrl = process.env.UNIVERSITY_BASE_URL || 'https://university.edu';
  
  switch (buttonId) {
    case 'science-biology':
      const courses = universityData.academicPrograms.scienceBiology.courses;
      let response = "**Science & Biology Courses:**\n\n";
      courses.forEach(course => {
        response += `• **${course.name}** (${course.code})\n`;
        response += `  ${course.description}\n`;
        response += `  [Course details](${baseUrl}${course.link})\n\n`;
      });
      return response;
      
    case 'arts-sciences':
      const majors = universityData.academicPrograms.artsSciences.majors;
      let artsResponse = "**College of Arts & Sciences Majors:**\n\n";
      majors.forEach(major => {
        artsResponse += `• **${major.name}** (${major.department} Department)\n`;
        artsResponse += `  ${major.description}\n`;
        artsResponse += `  [Department page](${baseUrl}${major.link})\n\n`;
      });
      return artsResponse;
      
    case 'data-science':
      const programs = universityData.academicPrograms.dataScience.programs;
      let dsResponse = "**Data Science Programs:**\n\n";
      programs.forEach(program => {
        dsResponse += `• **${program.name}** (${program.type})\n`;
        dsResponse += `  ${program.description}\n`;
        if (program.requirements) {
          dsResponse += `  Prerequisites: ${program.requirements.join(', ')}\n`;
        }
        if (program.duration) {
          dsResponse += `  Duration: ${program.duration}\n`;
        }
        dsResponse += `  [Program info](${baseUrl}${program.link})\n\n`;
      });
      return dsResponse;
      
    case 'all-majors':
      let allMajorsResponse = "**All Available Majors:**\n\n";
      allMajorsResponse += "**College of Arts & Sciences:**\n";
      universityData.academicPrograms.artsSciences.majors.forEach(major => {
        allMajorsResponse += `• ${major.name}\n`;
      });
      allMajorsResponse += "\n**Data Science Programs:**\n";
      universityData.academicPrograms.dataScience.programs.forEach(program => {
        allMajorsResponse += `• ${program.name}\n`;
      });
      allMajorsResponse += `\n[Complete academic catalog](${baseUrl}/academics)`;
      return allMajorsResponse;
      
    case 'how-to-apply':
      const admissions = universityData.admissions.undergraduate;
      let applyResponse = "**How to Apply for Undergraduate Programs:**\n\n";
      applyResponse += "**Requirements:**\n";
      admissions.requirements.forEach(req => {
        applyResponse += `• ${req}\n`;
      });
      applyResponse += "\n**Important Deadlines:**\n";
      applyResponse += `• Early Action: ${admissions.deadlines.earlyAction}\n`;
      applyResponse += `• Regular Decision: ${admissions.deadlines.regularDecision}\n`;
      applyResponse += `• Transfer Students: ${admissions.deadlines.transfer}\n\n`;
      applyResponse += `[Start your application](${baseUrl}${admissions.link})`;
      return applyResponse;
      
    case 'international':
      const intl = universityData.admissions.international;
      let intlResponse = "**International Student Admissions:**\n\n";
      intlResponse += "**Additional Requirements:**\n";
      intl.requirements.forEach(req => {
        intlResponse += `• ${req}\n`;
      });
      intlResponse += "\n**Application Deadlines:**\n";
      intlResponse += `• Fall Semester: ${intl.deadlines.fall}\n`;
      intlResponse += `• Spring Semester: ${intl.deadlines.spring}\n\n`;
      intlResponse += `[International admissions](${baseUrl}${intl.link})`;
      return intlResponse;
      
    case 'test-requirements':
      const testPolicy = universityData.admissions.testOptional;
      let testResponse = "**Test Score Requirements:**\n\n";
      testResponse += `${testPolicy.policy}\n\n`;
      testResponse += "**Alternative Assessment Options:**\n";
      testPolicy.alternatives.forEach(alt => {
        testResponse += `• ${alt}\n`;
      });
      testResponse += `\n[Test-optional policy details](${baseUrl}${testPolicy.link})`;
      return testResponse;
      
    case 'out-state-tuition':
      const tuition = universityData.tuitionFees.undergraduate;
      let tuitionResponse = "**Out-of-State Tuition & Fees:**\n\n";
      tuitionResponse += `• **Tuition:** ${tuition.outOfState.tuition}\n`;
      tuitionResponse += `• **Fees:** ${tuition.outOfState.fees}\n`;
      tuitionResponse += `• **Total Annual Cost:** ${tuition.outOfState.total}\n\n`;
      tuitionResponse += "**In-State Comparison:**\n";
      tuitionResponse += `• **Total Annual Cost:** ${tuition.inState.total}\n\n`;
      tuitionResponse += `[Financial aid options](${baseUrl}${tuition.link})`;
      return tuitionResponse;
      
    case 'transfer-scholarships':
      const scholarships = universityData.tuitionFees.scholarships.transfer;
      let scholarshipResponse = "**Transfer Student Scholarships:**\n\n";
      scholarships.forEach(scholarship => {
        scholarshipResponse += `• **${scholarship.name}**\n`;
        scholarshipResponse += `  Award Amount: ${scholarship.amount}\n`;
        scholarshipResponse += `  Requirements: ${scholarship.requirements.join(', ')}\n`;
        scholarshipResponse += `  [Apply now](${baseUrl}${scholarship.link})\n\n`;
      });
      return scholarshipResponse;
      
    case 'payment-options':
      const payment = universityData.tuitionFees.paymentOptions;
      let paymentResponse = "**Payment Options:**\n\n";
      paymentResponse += "**Payment Plans:**\n";
      payment.plans.forEach(plan => {
        paymentResponse += `• ${plan}\n`;
      });
      paymentResponse += "\n**Accepted Payment Methods:**\n";
      payment.methods.forEach(method => {
        paymentResponse += `• ${method}\n`;
      });
      paymentResponse += `\n[Payment information](${baseUrl}${payment.link})`;
      return paymentResponse;
      
    case 'student-housing':
      const housing = universityData.campusLife.housing;
      let housingResponse = "**Student Housing:**\n\n";
      housingResponse += "**Undergraduate Housing:**\n";
      housingResponse += `${housing.undergraduate.required}\n`;
      housingResponse += `Options: ${housing.undergraduate.options.join(', ')}\n`;
      housingResponse += `[Undergraduate housing](${baseUrl}${housing.undergraduate.link})\n\n`;
      housingResponse += "**Graduate Housing:**\n";
      housingResponse += `Options: ${housing.graduate.options.join(', ')}\n`;
      housingResponse += `[Graduate housing](${baseUrl}${housing.graduate.link})`;
      return housingResponse;
      
    case 'sports-programs':
      const sports = universityData.campusLife.sports;
      let sportsResponse = "**Athletic Programs:**\n\n";
      sportsResponse += `**Varsity Sports:** ${sports.varsity.join(', ')}\n\n`;
      sportsResponse += `**Intramural Sports:** ${sports.intramural.join(', ')}\n\n`;
      sportsResponse += `**Athletic Facilities:** ${sports.facilities.join(', ')}\n\n`;
      sportsResponse += `[Athletics website](${baseUrl}${sports.link})`;
      return sportsResponse;
      
    case 'mental-health':
      const mental = universityData.campusLife.mentalHealth;
      let mentalResponse = "**Mental Health Support:**\n\n";
      mentalResponse += "**Services Available:**\n";
      mental.services.forEach(service => {
        mentalResponse += `• ${service}\n`;
      });
      mentalResponse += `\n**Availability:** ${mental.availability}\n`;
      mentalResponse += `**Location:** ${mental.location}\n`;
      mentalResponse += `**Emergency Contact:** ${mental.contact}\n\n`;
      mentalResponse += `[Counseling services](${baseUrl}${mental.link})`;
      return mentalResponse;
      
    default:
      return "I'm not sure how to help with that specific request. Please try using one of the main topic buttons or ask me a question directly!";
  }
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 University Chatbot Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 API endpoints: http://localhost:${PORT}/api/`);
  
  if (!process.env.AZURE_OPENAI_ENDPOINT || !process.env.AZURE_OPENAI_API_KEY) {
    console.warn('⚠️  Azure OpenAI not configured. Using fallback responses.');
    console.warn('   Configure AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY in .env file');
  }
});

module.exports = app;