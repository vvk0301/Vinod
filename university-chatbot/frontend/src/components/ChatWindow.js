import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Send, MessageCircle, ArrowLeft, Loader } from 'lucide-react';
import ButtonGrid from './ButtonGrid';
import './ChatWindow.css';

const ChatWindow = ({ sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [currentButtonLevel, setCurrentButtonLevel] = useState('main');
  const [buttonHierarchy, setButtonHierarchy] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize with welcome message and load button hierarchy
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      // Load button hierarchy
      const response = await axios.get('/api/buttons');
      setButtonHierarchy(response.data);
      
      // Add welcome message
      const welcomeMessage = {
        id: Date.now(),
        type: 'bot',
        content: `👋 **Welcome to University Assistant!**

I'm here to help you find information about our university. You can:

• **Click the topic buttons below** to explore specific areas
• **Type your questions** directly in the chat

What would you like to know about today?`,
        timestamp: new Date().toISOString()
      };
      
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      // Fallback welcome message
      const fallbackMessage = {
        id: Date.now(),
        type: 'bot',
        content: '👋 Welcome to University Assistant! How can I help you today?',
        timestamp: new Date().toISOString()
      };
      setMessages([fallbackMessage]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleButtonClick = async (buttonId) => {
    setLoading(true);
    
    try {
      // Add user message for button click
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: `Clicked: ${getButtonLabel(buttonId)}`,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Handle navigation buttons
      if (buttonId === 'ask-question') {
        setShowButtons(false);
        const botResponse = {
          id: Date.now() + 1,
          type: 'bot',
          content: '💬 **Ask me anything!**\n\nType your question below and I\'ll help you find the information you need about our university.',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, botResponse]);
        setLoading(false);
        return;
      }
      
      // Check if this button has subcategories
      if (buttonHierarchy?.subCategories?.[buttonId]) {
        setCurrentButtonLevel(buttonId);
        const botResponse = {
          id: Date.now() + 1,
          type: 'bot',
          content: `Here are the available options for **${getButtonLabel(buttonId)}**:`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, botResponse]);
        setLoading(false);
        return;
      }
      
      // Send button click to backend
      const response = await axios.post('/api/button-click', {
        buttonId,
        sessionId
      });
      
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.response,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botResponse]);
      
    } catch (error) {
      console.error('Error handling button click:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: '❌ Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;
    
    const messageText = inputMessage.trim();
    setInputMessage('');
    setLoading(true);
    
    try {
      // Add user message
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: messageText,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Send to backend
      const response = await axios.post('/api/chat', {
        message: messageText,
        sessionId
      });
      
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.response,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botResponse]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: '❌ Sorry, I encountered an error processing your message. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToMain = () => {
    setCurrentButtonLevel('main');
    setShowButtons(true);
  };

  const getButtonLabel = (buttonId) => {
    if (!buttonHierarchy) return buttonId;
    
    const mainButton = buttonHierarchy.main.find(btn => btn.id === buttonId);
    if (mainButton) return mainButton.label;
    
    for (const category in buttonHierarchy.subCategories) {
      const subButton = buttonHierarchy.subCategories[category].find(btn => btn.id === buttonId);
      if (subButton) return subButton.label;
    }
    
    return buttonId;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCurrentButtons = () => {
    if (!buttonHierarchy) return [];
    
    if (currentButtonLevel === 'main') {
      return buttonHierarchy.main;
    }
    
    return buttonHierarchy.subCategories[currentButtonLevel] || [];
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-content">
          <MessageCircle className="chat-icon" />
          <h2>University Assistant</h2>
          <div className="status-indicator online"></div>
        </div>
      </div>
      
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-content">
              <ReactMarkdown
                components={{
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  )
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
            <div className="message-time">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="message bot">
            <div className="message-content loading">
              <Loader className="spinner" />
              <span>Thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {showButtons && buttonHierarchy && (
        <div className="button-section">
          {currentButtonLevel !== 'main' && (
            <div className="button-navigation">
              <button 
                className="back-button"
                onClick={handleBackToMain}
              >
                <ArrowLeft size={16} />
                Back to Main Topics
              </button>
            </div>
          )}
          
          <ButtonGrid
            buttons={getCurrentButtons()}
            onButtonClick={handleButtonClick}
            loading={loading}
          />
        </div>
      )}
      
      <div className="chat-input-section">
        {!showButtons && (
          <button 
            className="show-buttons-btn"
            onClick={() => setShowButtons(true)}
          >
            Show Topic Buttons
          </button>
        )}
        
        <div className="chat-input">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question here... (Press Enter to send)"
            className="message-input"
            rows="2"
            disabled={loading}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || loading}
            className="send-button"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;