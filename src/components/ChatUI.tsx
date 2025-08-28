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
  CircularProgress,
  Fade,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  InsertEmoticon as InsertEmoticonIcon,
  SmartToy as SmartToyIcon,
  Image as ImageIcon,
} from "@mui/icons-material";

interface Message {
  id: number;
  sender: "bot" | "user" | "member";
  senderName: string;
  text: string;
  time: string;
  avatar: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "bot",
    senderName: "StudyBot",
    text: "Welcome to the group! 🎉 I'm here to help with your studies. Feel free to ask questions!",
    time: "09:00",
    avatar: "🤖",
  },
  {
    id: 2,
    sender: "member",
    senderName: "Alex",
    text: "Hi everyone! Excited to collaborate on this semester's projects.",
    time: "09:01",
    avatar: "👨‍💻",
  },
  {
    id: 3,
    sender: "user",
    senderName: "You",
    text: "Hello! Looking forward to working together 😊",
    time: "09:02",
    avatar: "👤",
  },
  {
    id: 4,
    sender: "member",
    senderName: "Sarah",
    text: "Does anyone have notes from the last lecture?",
    time: "09:15",
    avatar: "👤",
  },
];

const ChatUI: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState<HTMLElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === "") return;

    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((msgs) => [
      ...msgs,
      {
        id: msgs.length + 1,
        sender: "user",
        senderName: "You",
        text: input,
        time,
        avatar: "👤",
      },
    ]);
    setInput("");

    // Simulate bot response
    setIsTyping(true);
    setTimeout(() => {
      const botTime = new Date();
      setMessages((msgs) => [
        ...msgs,
        {
          id: msgs.length + 1,
          sender: "bot",
          senderName: "StudyBot",
          text: generateBotResponse(),
          time: botTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          avatar: "🤖",
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (): string => {
    const responses = [
      "That's a great question! Let me help you with that. 📚",
      "I understand what you're asking. Here's what I think... 💭",
      "Thanks for sharing! That's really helpful for the group. 👍",
      "Good point! Have you considered looking at the course materials? 📖",
      "Interesting perspective! What do others think about this? 🤔",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
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
    if (file) {
      const now = new Date();
      const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setMessages((msgs) => [
        ...msgs,
        {
          id: msgs.length + 1,
          sender: "user",
          senderName: "You",
          text: `📎 Shared file: ${file.name}`,
          time,
          avatar: "👤",
        },
      ]);
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

          {isTyping && (
            <Fade in={isTyping}>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                <Avatar
                  sx={{
                    width: { xs: 32, sm: 40 },
                    height: { xs: 32, sm: 40 },
                    bgcolor: "primary.light",
                    border: "2px solid",
                    borderColor: "background.paper",
                    boxShadow: 2,
                  }}
                >
                  <SmartToyIcon fontSize="small" />
                </Avatar>
                <Paper
                  elevation={2}
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: "background.default",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    }}
                  >
                    StudyBot is typing
                  </Typography>
                  <CircularProgress size={16} color="primary" />
                </Paper>
              </Box>
            </Fade>
          )}

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