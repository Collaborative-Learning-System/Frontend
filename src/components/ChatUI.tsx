import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Divider,
  Popper,
  ClickAwayListener,
  Fade,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  InsertEmoticon as InsertEmoticonIcon,
} from "@mui/icons-material";
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  sender: "bot" | "user" | "member";
  senderName: string;
  text: string;
  time: string;
  avatar: string;
  userId?: string;
  createdAt?: string;
}

interface ChatUIProps {
  groupId?: string;
}

interface SocketMessage {
  chatId: string;
  userId: string;
  username?: string;
  text: string;
  sentAt: string;
  groupId: string;
}

const ChatUI: React.FC<ChatUIProps> = ({ groupId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState<HTMLElement | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Helper function to format message time
  const formatMessageTime = (sentAt: string): string => {
    try {
      const messageDate = new Date(sentAt);
      
      // Check if date is valid
      if (isNaN(messageDate.getTime())) {
        console.warn('Invalid date received:', sentAt);
        return new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error('Error parsing date:', error, 'Original value:', sentAt);
      return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  // Initialize Socket.IO connection
  useEffect(() => {
    const newSocket = io('http://localhost:3000/chat', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    setSocket(newSocket);

    // Connection success event
    newSocket.on('connection_success', (data) => {
      console.log('Connected as:', data.userId);
      setCurrentUserId(data.userId);
      setIsConnected(true);
    });

    // Handle errors
    newSocket.on('error', (err) => {
      console.error('Socket error:', err);
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Set up message listeners when we have currentUserId
  useEffect(() => {
    if (!socket || !currentUserId) return;

    // Listen for new messages
    const handleNewMessage = (message: SocketMessage) => {
      console.log('Received message:', message);
      console.log('sentAt value:', message.sentAt);
      
      const formattedMessage: Message = {
        id: message.chatId,
        sender: message.userId === currentUserId ? "user" : "member",
        senderName: message.userId === currentUserId ? "You" : (message.username || "Anonymous"),
        text: message.text,
        time: formatMessageTime(message.sentAt),
        avatar: message.userId === currentUserId ? "👤" : "👨‍💻",
        userId: message.userId,
        createdAt: message.sentAt,
      };

      setMessages(prev => {
        // Check if message already exists to prevent duplicates
        const messageExists = prev.some(msg => msg.id === message.chatId);
        if (messageExists) {
          console.log('Message already exists, skipping:', message.chatId);
          return prev;
        }
        
        // Add new message and sort all messages by timestamp
        const updatedMessages = [...prev, formattedMessage];
        return updatedMessages.sort((a, b) => {
          const dateA = new Date(a.createdAt || '').getTime();
          const dateB = new Date(b.createdAt || '').getTime();
          
          // Handle invalid dates by putting them at the end
          if (isNaN(dateA) && isNaN(dateB)) return 0;
          if (isNaN(dateA)) return 1;
          if (isNaN(dateB)) return -1;
          
          return dateA - dateB; // Sort in ascending order (oldest first)
        });
      });
    };

    // Listen for chat history
    const handleChatHistory = (data: { messages: SocketMessage[] }) => {
      console.log('Chat history received:', data.messages.length, 'messages');
      
      // Sort messages by sentAt timestamp to ensure correct order
      const sortedMessages = data.messages.sort((a, b) => {
        const dateA = new Date(a.sentAt).getTime();
        const dateB = new Date(b.sentAt).getTime();
        
        // Handle invalid dates by putting them at the end
        if (isNaN(dateA) && isNaN(dateB)) return 0;
        if (isNaN(dateA)) return 1;
        if (isNaN(dateB)) return -1;
        
        return dateA - dateB; // Sort in ascending order (oldest first)
      });
      
      console.log('Messages sorted by timestamp, oldest to newest');
      
      const formattedMessages: Message[] = sortedMessages.map((message: SocketMessage) => {
        return {
          id: message.chatId,
          sender: message.userId === currentUserId ? "user" : "member",
          senderName: message.userId === currentUserId ? "You" : (message.username || "Anonymous"),
          text: message.text,
          time: formatMessageTime(message.sentAt),
          avatar: message.userId === currentUserId ? "👤" : "👨‍💻",
          userId: message.userId,
          createdAt: message.sentAt,
        };
      });

      setMessages(formattedMessages);
    };

    socket.on('new_message', handleNewMessage);
    socket.on('chat_history', handleChatHistory);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('chat_history', handleChatHistory);
    };
  }, [socket, currentUserId]);

  // Join group when groupId changes
  useEffect(() => {
    if (socket && groupId && isConnected) {
      console.log('Joining group:', groupId);
      socket.emit('join_group', { groupId });
      
      // Load chat history for the group
      socket.emit('get_chat_history', { groupId, limit: 50, offset: 0 });
    }
  }, [socket, groupId, isConnected]);

  // Reset messages when groupId changes to maintain separate chats per group
  useEffect(() => {
    setMessages([]);
  }, [groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === "" || !socket || !groupId) return;

    // Send message via Socket.IO
    socket.emit('send_message', { 
      groupId, 
      text: input.trim() 
    });

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setInput((prev) => prev + emoji);
    setShowEmojiPicker(false);
    setEmojiAnchorEl(null);
  };

  const handleAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && socket && groupId) {
      // Send file message via Socket.IO
      socket.emit('send_message', { 
        groupId, 
        text: `📎 Shared file: ${file.name}` 
      });
    }
    if (e.target) e.target.value = "";
  };

  const handleEmojiButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setEmojiAnchorEl(emojiAnchorEl ? null : event.currentTarget);
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClickAway = () => {
    setShowEmojiPicker(false);
    setEmojiAnchorEl(null);
  };

  const commonEmojis = [
    "😊",
    "😄",
    "😍",
    "🤔",
    "👍",
    "👎",
    "❤",
    "🔥",
    "💯",
    "🎉",
    "📚",
    "✅",
    "❌",
    "⭐",
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: { xs: "70vh", sm: "500px" },
        minHeight: "400px",
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: 3,
      }}
    >
      {/* Connection Status */}
      {!isConnected && (
        <Box
          sx={{
            p: 1,
            bgcolor: "warning.light",
            color: "warning.contrastText",
            textAlign: "center",
          }}
        >
          <Typography variant="caption">
            Connecting to chat...
          </Typography>
        </Box>
      )}

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: { xs: 2, sm: 3 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              bgcolor: "rgba(0,0,0,0.05)",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "primary.light",
              borderRadius: "3px",
              "&:hover": {
                bgcolor: "primary.main",
              },
            },
          }}
        >
          {messages.map((msg, index) => (
            <Fade key={msg.id} in={true} timeout={300 * (index + 1)}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  alignItems: "flex-start",
                  maxWidth: { xs: "100%", sm: "85%" },
                  ml: msg.sender === "user" ? "auto" : 0,
                  mr: msg.sender === "user" ? 0 : "auto",
                  flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                }}
              >
                <Avatar
                  sx={{
                    width: { xs: 32, sm: 40 },
                    height: { xs: 32, sm: 40 },
                    bgcolor:
                      msg.sender === "bot"
                        ? "primary.light"
                        : msg.sender === "user"
                        ? "primary.main"
                        : "secondary.light",
                    fontSize: { xs: "1rem", sm: "1.2rem" },
                    flexShrink: 0,
                    border: "2px solid",
                    borderColor: "background.paper",
                    boxShadow: 2,
                  }}
                >
                  {msg.sender === "bot"
                    ? "🧑‍💻"
                    : msg.sender === "user"
                    ? "👤"
                    : msg.avatar}
                </Avatar>
                <Paper
                  elevation={msg.sender === "user" ? 4 : 2}
                  sx={{
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: 3,
                    bgcolor:
                      msg.sender === "user"
                        ? "primary.main"
                        : "background.default",
                    color: msg.sender === "user" ? "white" : "text.primary",
                    maxWidth: "100%",
                    wordBreak: "break-word",
                    position: "relative",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: msg.sender === "user" ? 6 : 4,
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 12,
                      ...(msg.sender === "user"
                        ? {
                            right: -8,
                            borderLeft: "8px solid",
                            borderLeftColor: "primary.main",
                          }
                        : {
                            left: -8,
                            borderRight: "8px solid",
                            borderRightColor: "background.default",
                          }),
                      borderTop: "8px solid transparent",
                      borderBottom: "8px solid transparent",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color:
                          msg.sender === "user"
                            ? "rgba(255,255,255,0.9)"
                            : "text.secondary",
                        fontSize: { xs: "0.65rem", sm: "0.75rem" },
                      }}
                    >
                      {msg.senderName}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          msg.sender === "user"
                            ? "rgba(255,255,255,0.7)"
                            : "text.secondary",
                        fontSize: { xs: "0.6rem", sm: "0.7rem" },
                      }}
                    >
                      {msg.time}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "0.875rem" },
                      lineHeight: 1.4,
                    }}
                  >
                    {msg.text}
                  </Typography>
                </Paper>
              </Box>
            </Fade>
          ))}

          <div ref={messagesEndRef} />
        </Box>
      </Box>

      {/* Input Area */}
      <Divider />
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          bgcolor: "grey.50",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: "none" }}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />

        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
          <IconButton
            onClick={handleAttachment}
            sx={{
              color: "text.secondary",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              "&:hover": {
                color: "primary.main",
                bgcolor: "primary.light",
                borderColor: "primary.main",
                transform: "translateY(-1px)",
                boxShadow: 2,
              },
              transition: "all 0.2s ease-in-out",
            }}
            size={isMobile ? "small" : "medium"}
          >
            <AttachFileIcon />
          </IconButton>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            size="small"
            multiline
            maxRows={isMobile ? 2 : 3}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "background.paper",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                transition: "all 0.2s ease-in-out",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
                "&.Mui-focused": {
                  transform: "translateY(-1px)",
                  boxShadow: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                    borderWidth: 2,
                  },
                },
              },
              "& .MuiInputBase-input": {
                py: 1.5,
              },
            }}
            InputProps={{
              endAdornment: (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <ClickAwayListener onClickAway={handleEmojiClickAway}>
                    <Box sx={{ position: "relative" }}>
                      <IconButton
                        size="small"
                        onClick={handleEmojiButtonClick}
                        sx={{
                          color: "text.secondary",
                          "&:hover": {
                            color: "primary.main",
                            bgcolor: "primary.light",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease-in-out",
                        }}
                      >
                        <InsertEmoticonIcon />
                      </IconButton>

                      <Popper
                        open={showEmojiPicker}
                        anchorEl={emojiAnchorEl}
                        placement="top-end"
                        transition
                        sx={{ zIndex: 1300 }}
                      >
                        {({ TransitionProps }) => (
                          <Fade {...TransitionProps} timeout={200}>
                            <Paper
                              elevation={8}
                              sx={{
                                p: 1.5,
                                borderRadius: 2,
                                maxWidth: { xs: 200, sm: 240 },
                                border: "1px solid",
                                borderColor: "divider",
                                bgcolor: "background.paper",
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ mb: 1, display: "block" }}
                              >
                                Choose an emoji
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                  maxWidth: "100%",
                                }}
                              >
                                {commonEmojis.map((emoji, index) => (
                                  <IconButton
                                    key={index}
                                    size="small"
                                    onClick={() => handleEmojiClick(emoji)}
                                    sx={{
                                      fontSize: { xs: "1rem", sm: "1.2rem" },
                                      minWidth: "auto",
                                      borderRadius: 2,
                                      "&:hover": {
                                        bgcolor: "primary.light",
                                        transform: "scale(1.2)",
                                      },
                                      transition: "all 0.1s ease-in-out",
                                    }}
                                  >
                                    {emoji}
                                  </IconButton>
                                ))}
                              </Box>
                            </Paper>
                          </Fade>
                        )}
                      </Popper>
                    </Box>
                  </ClickAwayListener>
                </Box>
              ),
            }}
          />

          <IconButton
            onClick={handleSend}
            disabled={!input.trim()}
            sx={{
              bgcolor: input.trim() ? "primary.main" : "grey.300",
              color: "white",
              boxShadow: input.trim() ? 3 : 0,
              border: "1px solid",
              borderColor: input.trim() ? "primary.main" : "grey.300",
              "&:hover": {
                bgcolor: input.trim() ? "primary.dark" : "grey.300",
                boxShadow: input.trim() ? 6 : 0,
                transform: input.trim()
                  ? "translateY(-2px) scale(1.05)"
                  : "none",
              },
              "&:disabled": {
                color: "grey.500",
              },
              transition: "all 0.2s ease-in-out",
            }}
            size={isMobile ? "small" : "medium"}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatUI;