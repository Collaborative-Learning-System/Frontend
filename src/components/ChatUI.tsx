import React, { useState, useRef, useEffect } from 'react';
import '../App.css';
import './ChatUI.css';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';

interface Message {
  id: number;
  sender: 'bot' | 'user' | 'member';
  senderName: string;
  text: string;
  time: string;
  avatar: string;
}

const initialMessages: Message[] = [
  { 
    id: 1, 
    sender: 'bot', 
    senderName: 'StudyBot',
    text: 'Welcome to the group! 🎉 I\'m here to help with your studies. Feel free to ask questions!', 
    time: '09:00',
    avatar: '🤖'
  },
  { 
    id: 2, 
    sender: 'member', 
    senderName: 'Alex',
    text: 'Hi everyone! Excited to collaborate on this semester\'s projects.', 
    time: '09:01',
    avatar: '👨‍💻'
  },
  { 
    id: 3, 
    sender: 'user', 
    senderName: 'You',
    text: 'Hello! Looking forward to working together 😊', 
    time: '09:02',
    avatar: '👤'
  },
  { 
    id: 4, 
    sender: 'member', 
    senderName: 'Sarah',
    text: 'Does anyone have notes from the last lecture?', 
    time: '09:15',
    avatar: '👤'
  },
];

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === '') return;
    
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages((msgs) => [
      ...msgs,
      { 
        id: msgs.length + 1, 
        sender: 'user', 
        senderName: 'You',
        text: input, 
        time,
        avatar: '👤'
      },
    ]);
    setInput('');
    
    // Simulate bot response
    setIsTyping(true);
    setTimeout(() => {
      const botTime = new Date();
      setMessages((msgs) => [
        ...msgs,
        { 
          id: msgs.length + 1, 
          sender: 'bot', 
          senderName: 'StudyBot',
          text: generateBotResponse(input), 
          time: botTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: '🤖'
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userMessage: string): string => {
    const responses = [
      "That's a great question! Let me help you with that. 📚",
      "I understand what you're asking. Here's what I think... 💭",
      "Thanks for sharing! That's really helpful for the group. 👍",
      "Good point! Have you considered looking at the course materials? 📖",
      "Interesting perspective! What do others think about this? 🤔",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      setMessages((msgs) => [
        ...msgs,
        { 
          id: msgs.length + 1, 
          sender: 'user', 
          senderName: 'You',
          text: `📎 Shared file: ${file.name}`, 
          time,
          avatar: '👤'
        },
      ]);
    }
    // Reset file input
    if (e.target) e.target.value = '';
  };

  const commonEmojis = ['😊', '😄', '😍', '🤔', '👍', '👎', '❤️', '🔥', '💯', '🎉', '📚', '✅', '❌', '⭐'];

  return (
    <div className="chat-ui-container">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-info">
          <h3>Group Chat</h3>
        </div>
        <div className="chat-actions">
          <button className="action-btn" title="Search messages">
            <SearchIcon />
          </button>
          <button className="action-btn" title="More options">⋯</button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-container">
        <div className="messages-list">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                <div className="message-avatar">
                {msg.sender === 'bot' && <span style={{ fontSize: 32 }}>🧑‍💻</span>}
                {msg.sender !== 'bot' && <span style={{ fontSize: 32 }}>👤</span>}
                </div>
              <div className="message-content">
                <div className="message-header">
                  <span className="sender-name">{msg.senderName}</span>
                  <span className="message-time">{msg.time}</span>
                </div>
                <div className="message-text">{msg.text}</div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="typing-indicator">
              <div className="typing-avatar"><SmartToyIcon fontSize="large" /></div>
              <div className="typing-content">
                <div className="typing-text">
                  <span>StudyBot is typing</span>
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="chat-input-container">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        
        <div className="input-wrapper">
          <button 
            className="attach-btn" 
            onClick={handleAttachment}
            title="Attach file"
            style={{ minWidth: 0, padding: 4 }}
          >
            <AttachFileIcon />
          </button>
          
          <div className="input-container">
            <input
              className="message-input"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            
            <div className="input-actions">
              <div className="emoji-container">
                <button 
                  className="emoji-btn" 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  title="Add emoji"
                  style={{ minWidth: 0, padding: 4 }}
                >
                  <InsertEmoticonIcon />
                </button>
                
                {showEmojiPicker && (
                  <div className="emoji-picker">
                    <div className="emoji-grid">
                      {commonEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          className="emoji-option"
                          onClick={() => handleEmojiClick(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                className={`send-button ${input.trim() ? 'active' : ''}`}
                onClick={handleSend}
                disabled={!input.trim()}
                title="Send message"
                style={{ minWidth: 0, padding: 4 }}
              >
                <SendIcon className="send-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
