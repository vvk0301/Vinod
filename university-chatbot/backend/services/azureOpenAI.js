const OpenAI = require('openai');
const { universityData } = require('../data/universityData');

class AzureOpenAIService {
  constructor() {
    this.client = null;
    this.deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-35-turbo';
    this.baseUrl = process.env.UNIVERSITY_BASE_URL || 'https://university.edu';
    this.initializeClient();
  }

  initializeClient() {
    try {
      const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
      const apiKey = process.env.AZURE_OPENAI_API_KEY;
      
      if (!endpoint || !apiKey) {
        console.warn('Azure OpenAI credentials not configured. Using fallback responses.');
        return;
      }

      this.client = new OpenAI({
        apiKey,
        baseURL: `${endpoint}/openai/deployments/${this.deploymentName}`,
        defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview' },
        defaultHeaders: {
          'api-key': apiKey,
        },
      });
      
      console.log('Azure OpenAI client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Azure OpenAI client:', error.message);
    }
  }

  createSystemPrompt() {
    return `You are a helpful university chatbot assistant. You have access to comprehensive information about the university including academic programs, admissions, tuition and fees, and campus life.

Your responses should be:
1. Accurate and based on the provided university data
2. Helpful and friendly in tone
3. Include relevant links when available
4. Be concise but informative

When answering questions:
- Always try to provide specific information from the university database
- Include relevant links using the format: [Link Text](URL)
- If you don't have specific information, acknowledge this and suggest who to contact
- For complex queries, break down the answer into clear sections

University data available includes:
- Academic Programs: Science/Biology courses, Arts & Sciences majors, Data Science programs
- Admissions: Requirements, deadlines, international student info, test-optional policies
- Tuition & Fees: In-state/out-of-state costs, scholarships, payment options
- Campus Life: Housing options, sports programs, mental health services

Base URL for links: ${this.baseUrl}`;
  }

  formatUniversityContext(query) {
    // Extract relevant context based on the query
    let context = "University Information:\n\n";
    
    const queryLower = query.toLowerCase();
    
    // Academic Programs context
    if (queryLower.includes('course') || queryLower.includes('program') || queryLower.includes('major') || 
        queryLower.includes('biology') || queryLower.includes('science') || queryLower.includes('data')) {
      context += "ACADEMIC PROGRAMS:\n";
      context += JSON.stringify(universityData.academicPrograms, null, 2) + "\n\n";
    }
    
    // Admissions context
    if (queryLower.includes('admission') || queryLower.includes('apply') || queryLower.includes('requirement') ||
        queryLower.includes('deadline') || queryLower.includes('international') || queryLower.includes('sat') || queryLower.includes('test')) {
      context += "ADMISSIONS:\n";
      context += JSON.stringify(universityData.admissions, null, 2) + "\n\n";
    }
    
    // Tuition context
    if (queryLower.includes('tuition') || queryLower.includes('fee') || queryLower.includes('cost') ||
        queryLower.includes('scholarship') || queryLower.includes('payment') || queryLower.includes('financial')) {
      context += "TUITION & FEES:\n";
      context += JSON.stringify(universityData.tuitionFees, null, 2) + "\n\n";
    }
    
    // Campus Life context
    if (queryLower.includes('housing') || queryLower.includes('campus') || queryLower.includes('sport') ||
        queryLower.includes('mental health') || queryLower.includes('counseling') || queryLower.includes('residence')) {
      context += "CAMPUS LIFE:\n";
      context += JSON.stringify(universityData.campusLife, null, 2) + "\n\n";
    }
    
    // If no specific context found, include all data
    if (context === "University Information:\n\n") {
      context += JSON.stringify(universityData, null, 2);
    }
    
    return context;
  }

  async generateResponse(userMessage, conversationHistory = []) {
    try {
      // If Azure OpenAI is not configured, use fallback logic
      if (!this.client) {
        return this.generateFallbackResponse(userMessage);
      }

      const context = this.formatUniversityContext(userMessage);
      
      const messages = [
        { role: 'system', content: this.createSystemPrompt() },
        { role: 'system', content: context },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];

      const response = await this.client.chat.completions.create({
        model: this.deploymentName, // This is ignored by Azure but required by the OpenAI SDK
        messages,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.95
      });

      const botResponse = response.choices[0]?.message?.content || 
        "I'm sorry, I couldn't generate a response at the moment.";

      return this.formatResponseWithLinks(botResponse);
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      return this.generateFallbackResponse(userMessage);
    }
  }

  generateFallbackResponse(userMessage) {
    const queryLower = userMessage.toLowerCase();
    
    // Science/Biology courses
    if (queryLower.includes('science') || queryLower.includes('biology') || queryLower.includes('course')) {
      const courses = universityData.academicPrograms.scienceBiology.courses;
      let response = "Here are our science and biology courses:\n\n";
      courses.forEach(course => {
        response += `• **${course.name}** (${course.code}): ${course.description}\n`;
        response += `  [More info](${this.baseUrl}${course.link})\n\n`;
      });
      return response;
    }
    
    // Data Science programs
    if (queryLower.includes('data science') || queryLower.includes('data')) {
      const programs = universityData.academicPrograms.dataScience.programs;
      let response = "We offer several data science programs:\n\n";
      programs.forEach(program => {
        response += `• **${program.name}** (${program.type}): ${program.description}\n`;
        response += `  [Learn more](${this.baseUrl}${program.link})\n\n`;
      });
      return response;
    }
    
    // Arts & Sciences majors
    if (queryLower.includes('arts') || queryLower.includes('sciences') || queryLower.includes('major')) {
      const majors = universityData.academicPrograms.artsSciences.majors;
      let response = "College of Arts & Sciences majors include:\n\n";
      majors.forEach(major => {
        response += `• **${major.name}**: ${major.description}\n`;
        response += `  [Department page](${this.baseUrl}${major.link})\n\n`;
      });
      return response;
    }
    
    // Admissions
    if (queryLower.includes('admission') || queryLower.includes('apply')) {
      const admissions = universityData.admissions.undergraduate;
      let response = "**Undergraduate Admissions Requirements:**\n\n";
      admissions.requirements.forEach(req => {
        response += `• ${req}\n`;
      });
      response += `\n**Deadlines:**\n`;
      response += `• Early Action: ${admissions.deadlines.earlyAction}\n`;
      response += `• Regular Decision: ${admissions.deadlines.regularDecision}\n`;
      response += `• Transfer: ${admissions.deadlines.transfer}\n\n`;
      response += `[Apply now](${this.baseUrl}${admissions.link})`;
      return response;
    }
    
    // International students
    if (queryLower.includes('international')) {
      const intl = universityData.admissions.international;
      let response = "**International Student Requirements:**\n\n";
      intl.requirements.forEach(req => {
        response += `• ${req}\n`;
      });
      response += `\n**Deadlines:**\n`;
      response += `• Fall semester: ${intl.deadlines.fall}\n`;
      response += `• Spring semester: ${intl.deadlines.spring}\n\n`;
      response += `[International admissions](${this.baseUrl}${intl.link})`;
      return response;
    }
    
    // SAT/Test scores
    if (queryLower.includes('sat') || queryLower.includes('test') || queryLower.includes('score')) {
      const testPolicy = universityData.admissions.testOptional;
      let response = `**Test Score Policy:**\n\n${testPolicy.policy}\n\n`;
      response += "**Alternatives to test scores:**\n";
      testPolicy.alternatives.forEach(alt => {
        response += `• ${alt}\n`;
      });
      response += `\n[Test-optional policy](${this.baseUrl}${testPolicy.link})`;
      return response;
    }
    
    // Tuition
    if (queryLower.includes('tuition') || queryLower.includes('cost') || queryLower.includes('fee')) {
      const tuition = universityData.tuitionFees.undergraduate;
      let response = "**Undergraduate Tuition & Fees:**\n\n";
      response += `**In-State Students:**\n`;
      response += `• Tuition: ${tuition.inState.tuition}\n`;
      response += `• Fees: ${tuition.inState.fees}\n`;
      response += `• Total: ${tuition.inState.total}\n\n`;
      response += `**Out-of-State Students:**\n`;
      response += `• Tuition: ${tuition.outOfState.tuition}\n`;
      response += `• Fees: ${tuition.outOfState.fees}\n`;
      response += `• Total: ${tuition.outOfState.total}\n\n`;
      response += `[Financial aid info](${this.baseUrl}${tuition.link})`;
      return response;
    }
    
    // Scholarships
    if (queryLower.includes('scholarship') || queryLower.includes('transfer')) {
      const scholarships = universityData.tuitionFees.scholarships.transfer;
      let response = "**Scholarships for Transfer Students:**\n\n";
      scholarships.forEach(scholarship => {
        response += `• **${scholarship.name}**: ${scholarship.amount}\n`;
        response += `  Requirements: ${scholarship.requirements.join(', ')}\n`;
        response += `  [Apply here](${this.baseUrl}${scholarship.link})\n\n`;
      });
      return response;
    }
    
    // Housing
    if (queryLower.includes('housing') || queryLower.includes('residence') || queryLower.includes('dorm')) {
      const housing = universityData.campusLife.housing;
      let response = "**Student Housing Options:**\n\n";
      response += `**Undergraduate Housing:**\n`;
      response += `${housing.undergraduate.required}\n`;
      response += `Options: ${housing.undergraduate.options.join(', ')}\n`;
      response += `[Undergraduate housing](${this.baseUrl}${housing.undergraduate.link})\n\n`;
      response += `**Graduate Housing:**\n`;
      response += `Options: ${housing.graduate.options.join(', ')}\n`;
      response += `[Graduate housing](${this.baseUrl}${housing.graduate.link})`;
      return response;
    }
    
    // Sports
    if (queryLower.includes('sport') || queryLower.includes('athletic')) {
      const sports = universityData.campusLife.sports;
      let response = "**Athletic Programs:**\n\n";
      response += `**Varsity Sports:** ${sports.varsity.join(', ')}\n\n`;
      response += `**Intramural Sports:** ${sports.intramural.join(', ')}\n\n`;
      response += `**Facilities:** ${sports.facilities.join(', ')}\n\n`;
      response += `[Athletics website](${this.baseUrl}${sports.link})`;
      return response;
    }
    
    // Mental Health
    if (queryLower.includes('mental health') || queryLower.includes('counseling') || queryLower.includes('therapy')) {
      const mental = universityData.campusLife.mentalHealth;
      let response = "**Mental Health Resources:**\n\n";
      response += "**Services Available:**\n";
      mental.services.forEach(service => {
        response += `• ${service}\n`;
      });
      response += `\n**Availability:** ${mental.availability}\n`;
      response += `**Location:** ${mental.location}\n`;
      response += `**Contact:** ${mental.contact}\n\n`;
      response += `[Counseling services](${this.baseUrl}${mental.link})`;
      return response;
    }
    
    // Default response
    return `I'd be happy to help you with information about our university! I can assist with:

• **Academic Programs** - Courses, majors, and degree programs
• **Admissions** - Requirements, deadlines, and application process  
• **Tuition & Fees** - Costs, scholarships, and payment options
• **Campus Life** - Housing, sports, and student services

Please ask me a specific question, or use the topic buttons to explore these areas!`;
  }

  formatResponseWithLinks(response) {
    // Convert relative links to absolute links
    return response.replace(/\[([^\]]+)\]\(\/([^)]+)\)/g, `[$1](${this.baseUrl}/$2)`);
  }
}

module.exports = AzureOpenAIService;