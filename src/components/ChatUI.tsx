import React, { useState, useRef, useEffect, useCallback } from "react";
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
  Button,
  Stack,
  Chip,
  Alert,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  InsertEmoticon as InsertEmoticonIcon,
  Close as CloseIcon,
  Image as ImageIcon,
  Movie as MovieIcon,
  PictureAsPdf as PictureAsPdfIcon,
} from "@mui/icons-material";
import { io, Socket } from "socket.io-client";

type MessageType = "text" | "resource";

interface ResourceMessage {
  resourceId: string;
  title: string;
  type: "image" | "video" | "pdf";
  storageUrl: string;
  description?: string;
  uploadedAt?: string;
}

interface Message {
  id: string;
  sender: "bot" | "user" | "member";
  senderName: string;
  text?: string;
  time: string;
  avatar: string;
  userId?: string;
  createdAt?: string;
  messageType: MessageType;
  resource?: ResourceMessage;
}

interface ChatUIProps {
  groupId?: string;
}

interface SocketMessage {
  chatId: string;
  userId: string;
  userName?: string;
  text?: string;
  sentAt: string;
  groupId: string;
  messageType?: MessageType;
  resource?: ResourceMessage;
}

const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 2048 * 2048;
const ACCEPTED_FILE_TYPES = "image/*,video/*,application/pdf";

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

const formatMessageTime = (sentAt: string): string => {
  try {
    const messageDate = new Date(sentAt);
    if (Number.isNaN(messageDate.getTime())) {
      return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
};

const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const isSupportedMimeType = (mime: string): boolean => {
  if (!mime) return false;
  return (
    mime.startsWith("image/") ||
    mime.startsWith("video/") ||
    mime === "application/pdf"
  );
};

const guessMimeType = (file: File): string => {
  if (file.type) return file.type;
  const extension = file.name.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "svg":
      return "image/svg+xml";
    case "mp4":
      return "video/mp4";
    case "webm":
      return "video/webm";
    case "mov":
      return "video/quicktime";
    case "avi":
      return "video/x-msvideo";
    case "mkv":
      return "video/x-matroska";
    case "pdf":
      return "application/pdf";
    default:
      return "";
  }
};

const readFileAsBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("FileReader result was not a string"));
        return;
      }
      const commaIndex = result.indexOf(",");
      if (commaIndex === -1) {
        reject(new Error("Malformed data URL"));
        return;
      }
      resolve(result.slice(commaIndex + 1));
    };
    reader.onerror = (err) => reject(err ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

const getResourceChip = (type: ResourceMessage["type"]) => {
  switch (type) {
    case "image":
      return { icon: <ImageIcon fontSize="inherit" />, label: "Image" };
    case "video":
      return { icon: <MovieIcon fontSize="inherit" />, label: "Video" };
    case "pdf":
      return { icon: <PictureAsPdfIcon fontSize="inherit" />, label: "PDF" };
    default:
      return null;
  }
};

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
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(null);
  const [selectedFileMime, setSelectedFileMime] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetAttachment = useCallback(() => {
    if (selectedFilePreview) {
      URL.revokeObjectURL(selectedFilePreview);
    }
    setSelectedFile(null);
    setSelectedFilePreview(null);
    setSelectedFileMime(null);
  }, [selectedFilePreview]);

  useEffect(() => {
    return () => {
      if (selectedFilePreview) {
        URL.revokeObjectURL(selectedFilePreview);
      }
    };
  }, [selectedFilePreview]);

  useEffect(() => {
    const newSocket = io("http://localhost:3000/chat", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    setSocket(newSocket);

    newSocket.on("connection_success", (data) => {
      setCurrentUserId(data.userId);
      setIsConnected(true);
    });

    newSocket.on("error", (err) => {
      console.error("Socket error:", err);
      setUploadError(typeof err?.message === "string" ? err.message : "Socket error");
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !currentUserId) return;

    const handleNewMessage = (message: SocketMessage) => {
      const resolvedMessageType: MessageType =
        message.messageType ?? (message.resource ? "resource" : "text");

      const formattedMessage: Message = {
        id: message.chatId,
        sender:
          message.userId === currentUserId ? "user" : (message.userId ? "member" : "bot"),
        senderName: message.userId === currentUserId ? "You" : message.userName ?? "Anonymous",
        text: message.text,
        time: formatMessageTime(message.sentAt),
        avatar: message.userId === currentUserId ? "👤" : "👨‍💻",
        userId: message.userId,
        createdAt: message.sentAt,
        messageType: resolvedMessageType,
        resource: message.resource ? { ...message.resource } : undefined,
      };

      setMessages((prev) => {
        if (prev.some((msg) => msg.id === message.chatId)) {
          return prev;
        }
        const updated = [...prev, formattedMessage];
        return updated.sort((a, b) => {
          const dateA = new Date(a.createdAt ?? "").getTime();
          const dateB = new Date(b.createdAt ?? "").getTime();
          if (Number.isNaN(dateA) && Number.isNaN(dateB)) return 0;
          if (Number.isNaN(dateA)) return 1;
          if (Number.isNaN(dateB)) return -1;
          return dateA - dateB;
        });
      });
    };

    const handleChatHistory = (data: { messages: SocketMessage[] }) => {
      const sorted = [...data.messages].sort((a, b) => {
        const dateA = new Date(a.sentAt).getTime();
        const dateB = new Date(b.sentAt).getTime();
        if (Number.isNaN(dateA) && Number.isNaN(dateB)) return 0;
        if (Number.isNaN(dateA)) return 1;
        if (Number.isNaN(dateB)) return -1;
        return dateA - dateB;
      });

      const formattedMessages: Message[] = sorted.map((message) => {
        const resolvedMessageType: MessageType =
          message.messageType ?? (message.resource ? "resource" : "text");
        return {
          id: message.chatId,
          sender:
            message.userId === currentUserId ? "user" : (message.userId ? "member" : "bot"),
          senderName: message.userId === currentUserId ? "You" : message.userName ?? "Anonymous",
          text: message.text,
          time: formatMessageTime(message.sentAt),
          avatar: message.userId === currentUserId ? "👤" : "👨‍💻",
          userId: message.userId,
          createdAt: message.sentAt,
          messageType: resolvedMessageType,
          resource: message.resource ? { ...message.resource } : undefined,
        };
      });

      setMessages(formattedMessages);
    };

    socket.on("new_message", handleNewMessage);
    socket.on("chat_history", handleChatHistory);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("chat_history", handleChatHistory);
    };
  }, [socket, currentUserId]);

  useEffect(() => {
    setMessages([]);
  }, [groupId]);

  useEffect(() => {
    if (socket && groupId && isConnected) {
      socket.emit("join_group", { groupId });
      socket.emit("get_chat_history", { groupId, limit: 50, offset: 0 });
    }
  }, [socket, groupId, isConnected]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleEmojiClick = (emoji: string) => {
    setInput((prev) => prev + emoji);
    setShowEmojiPicker(false);
    setEmojiAnchorEl(null);
  };

  const handleEmojiButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setEmojiAnchorEl(emojiAnchorEl ? null : event.currentTarget);
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiClickAway = () => {
    setShowEmojiPicker(false);
    setEmojiAnchorEl(null);
  };

  const handleAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const mime = guessMimeType(file);

    if (!isSupportedMimeType(mime)) {
      setUploadError("Only images, video, or PDF files can be shared.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError(`Files up to ${MAX_FILE_SIZE_MB} MB are supported.`);
      return;
    }

    if (selectedFilePreview) {
      URL.revokeObjectURL(selectedFilePreview);
    }

    if (mime.startsWith("image/") || mime.startsWith("video/")) {
      setSelectedFilePreview(URL.createObjectURL(file));
    } else {
      setSelectedFilePreview(null);
    }

    setSelectedFile(file);
    setSelectedFileMime(mime);
    setUploadError(null);
  };

const sendMessage = async () => {
    if (!socket || !groupId || !isConnected || isSending) return;

    const trimmedText = input.trim();
    if (!selectedFile && !trimmedText) return;

    try {
      setIsSending(true);
      setUploadError(null);

      if (selectedFile) {
        // Send file message with resource
        const resolvedMime =
          selectedFileMime ?? guessMimeType(selectedFile) ?? selectedFile.type;
        if (!isSupportedMimeType(resolvedMime)) {
          throw new Error("Unsupported file type.");
        }

        const base64Data = await readFileAsBase64(selectedFile);
        
        // Determine resource type from MIME
        let resourceType: "image" | "video" | "pdf" = "image";
        if (resolvedMime.startsWith("video/")) {
          resourceType = "video";
        } else if (resolvedMime === "application/pdf") {
          resourceType = "pdf";
        }

        socket.emit("send_message", {
          groupId,
          text: trimmedText || undefined,
          messageType: "resource",
          attachment: {
            fileName: selectedFile.name,
            mimeType: resolvedMime,
            base64Data,
            fileSize: selectedFile.size,
          },
          resource: {
            title: selectedFile.name,
            type: resourceType,
            description: trimmedText || undefined,
          },
        });
      } else {
        // Send text-only message
        socket.emit("send_message", {
          groupId,
          text: trimmedText,
          messageType: "text",
        });
      }

      setInput("")
      resetAttachment();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "dfsdggs";
      setUploadError(message);
    } finally {
      setIsSending(false);
    }
  };

  const handleSend = () => {
    void sendMessage();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  const renderResourceContent = (resource: ResourceMessage, isOwnMessage: boolean) => {
    const chip = getResourceChip(resource.type);
    // const sharedOn = resource.uploadedAt
    //   ? new Date(resource.uploadedAt).toLocaleString()
    //   : "";

    return (
      <Stack spacing={1.2} sx={{ mt: resource.description || resource.title ? 1 : 0 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          {chip && (
            <Chip
              size="small"
              icon={chip.icon}
              label={chip.label}
              color={isOwnMessage ? "default" : "primary"}
              variant={isOwnMessage ? "filled" : "outlined"}
            />
          )}
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: isOwnMessage ? "rgba(255,255,255,0.9)" : "text.primary",
            }}
          >
            {resource.title}
          </Typography>
        </Stack>

        {resource.description && (
          <Typography
            variant="body2"
            sx={{ color: isOwnMessage ? "rgba(255,255,255,0.85)" : "text.primary" }}
          >
            {resource.description}
          </Typography>
        )}

        {resource.type === "image" && (
          <Box
            component="img"
            src={resource.storageUrl}
            alt={resource.title}
            sx={{
              width: "100%",
              maxHeight: 280,
              objectFit: "cover",
              borderRadius: 2,
              border: "1px solid",
              borderColor: isOwnMessage ? "rgba(255,255,255,0.4)" : "divider",
            }}
          />
        )}

        {resource.type === "video" && (
          <Box
            component="video"
            src={resource.storageUrl}
            controls
            sx={{
              width: "100%",
              maxHeight: 320,
              borderRadius: 2,
              border: "1px solid",
              borderColor: isOwnMessage ? "rgba(255,255,255,0.4)" : "divider",
            }}
          />
        )}

        {resource.type === "pdf" && (
          <Button
            variant={isOwnMessage ? "contained" : "outlined"}
            color="secondary"
            startIcon={<PictureAsPdfIcon />}
            component="a"
            href={resource.storageUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              alignSelf: isOwnMessage ? "flex-end" : "flex-start",
            }}
          >
            View PDF
          </Button>
        )}

        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="text"
            component="a"
            href={resource.storageUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: isOwnMessage ? "rgba(255,255,255,0.85)" : "primary.main",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Open in new tab
          </Button>
          <Button
            size="small"
            variant="text"
            component="a"
            href={resource.storageUrl}
            download
            rel="noopener noreferrer"
            sx={{
              color: isOwnMessage ? "rgba(255,255,255,0.85)" : "primary.main",
              textTransform: "none",
            }}
          >
            Download
          </Button>
        </Stack>

        {/* {sharedOn && (
          <Typography
            variant="caption"
            sx={{ color: isOwnMessage ? "rgba(255,255,255,0.6)" : "text.secondary" }}
          >
            Shared on {sharedOn}
          </Typography>
        )} */}
      </Stack>
    );
  };

  const sendDisabled =
    (!input.trim() && !selectedFile) || !socket || !groupId || !isConnected || isSending;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: { xs: "70vh", sm: "500px" },
        minHeight: "400px",
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: "background.paper",
        border: "0px solid",
        borderColor: "divider",
      }}
    >
      {!isConnected && (
        <Box
          sx={{
            p: 1,
            bgcolor: "warning.light",
            color: "warning.contrastText",
            textAlign: "center",
          }}
        >
          <Typography variant="caption">Connecting to chat...</Typography>
        </Box>
      )}

      <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: { xs: 2, sm: 3 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-track": {
              bgcolor: "rgba(0,0,0,0.05)",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "primary.light",
              borderRadius: "3px",
              "&:hover": { bgcolor: "primary.main" },
            },
          }}
        >
          {messages.map((msg, index) => {
            const isOwnMessage = msg.sender === "user";
            return (
              <Fade key={msg.id} in timeout={Math.min(300 * (index + 1), 600)}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    alignItems: "flex-start",
                    maxWidth: { xs: "100%", sm: "85%" },
                    ml: isOwnMessage ? "auto" : 0,
                    mr: isOwnMessage ? 0 : "auto",
                    flexDirection: isOwnMessage ? "row-reverse" : "row",
                  }}
                >
                  <Avatar
                    sx={{
                      width: { xs: 32, sm: 40 },
                      height: { xs: 32, sm: 40 },
                      bgcolor:
                        msg.sender === "bot"
                          ? "primary.light"
                          : isOwnMessage
                          ? "primary.main"
                          : "secondary.light",
                      fontSize: { xs: "1rem", sm: "1.2rem" },
                      flexShrink: 0,
                      border: "2px solid",
                      borderColor: "background.paper",
                    }}
                  >
                    {msg.sender === "bot" ? "🧑‍💻" : isOwnMessage ? "🧑‍🏫" : msg.avatar}
                  </Avatar>

                  <Paper
                    elevation={isOwnMessage ? 4 : 2}
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      borderRadius: 3,
                      bgcolor: isOwnMessage ? "primary.chatBackground" : "background.default",
                      color: isOwnMessage ? "white" : "text.primary",
                      maxWidth: "100%",
                      wordBreak: "break-word",
                      position: "relative",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": { transform: "translateY(-1px)" },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 12,
                        ...(isOwnMessage
                          ? { right: -8, borderLeft: "8px solid", borderLeftColor: "primary.main" }
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: isOwnMessage ? "rgba(255,255,255,0.9)" : "text.secondary",
                          fontSize: { xs: "0.65rem", sm: "0.75rem" },
                        }}
                      >
                        {msg.senderName}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: isOwnMessage ? "rgba(255,255,255,0.7)" : "text.secondary",
                          fontSize: { xs: "0.6rem", sm: "0.7rem" },
                        }}
                      >
                        {msg.time}
                      </Typography>
                    </Box>

                    {msg.messageType === "resource" && msg.resource && (
                      <Box>{renderResourceContent(msg.resource, isOwnMessage)}</Box>
                    )}

                    {msg.text && (
                      <Typography
                        variant="body2"
                        sx={{
                          mt: msg.messageType === "resource" && msg.resource ? 1 : 0,
                          fontSize: { xs: "0.8rem", sm: "0.875rem" },
                          lineHeight: 1.4,
                        }}
                      >
                        {msg.text}
                      </Typography>
                    )}
                  </Paper>
                </Box>
              </Fade>
            );
          })}
          <div ref={messagesEndRef} />
        </Box>
      </Box>

      <Divider />

      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          bgcolor: "grey.50",
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: "none" }}
          accept={ACCEPTED_FILE_TYPES}
        />

        <Stack spacing={1.5}>
          {uploadError && (
            <Alert severity="error" onClose={() => setUploadError(null)}>
              {uploadError}
            </Alert>
          )}

          {selectedFile && (
            <Paper
              variant="outlined"
              sx={{
                p: 1.5,
                borderRadius: 2,
                borderColor: "primary.light",
                bgcolor: "primary.light",
                color: "primary.dark",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                <Stack spacing={0.5}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {selectedFile.name}
                  </Typography>
                  <Typography variant="caption">{formatFileSize(selectedFile.size)}</Typography>
                  {selectedFileMime && (
                    <Chip
                      size="small"
                      label={
                        selectedFileMime.startsWith("image/")
                          ? "Image"
                          : selectedFileMime.startsWith("video/")
                          ? "Video"
                          : "PDF"
                      }
                    />
                  )}
                </Stack>

                <Tooltip title="Remove attachment">
                  <IconButton
                    onClick={resetAttachment}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.8)",
                      "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>

              {selectedFilePreview && (
                <Box
                  sx={{
                    mt: 1,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "rgba(0,0,0,0.1)",
                  }}
                >
                  {selectedFileMime?.startsWith("image/") ? (
                    <Box
                      component="img"
                      src={selectedFilePreview}
                      alt={selectedFile.name}
                      sx={{ maxWidth: "50%", maxHeight: 200, objectFit: "fill" }}
                    />
                  ) : (
                    <Box
                      component="video"
                      src={selectedFilePreview}
                      controls
                      sx={{ width: "100%", maxHeight: 260 }}
                    />
                  )}
                </Box>
              )}

              {selectedFileMime === "application/pdf" && (
                <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                  The PDF will be shared as a downloadable link.
                </Typography>
              )}
            </Paper>
          )}

          <Stack direction="row" alignItems="flex-end" spacing={1}>
            <Tooltip title="Attach image, video, or PDF">
              <span>
                <IconButton
                  onClick={handleAttachment}
                  disabled={!isConnected || isSending}
                  sx={{
                    color: "text.secondary",
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover": {
                      color: "primary.main",
                      bgcolor: "primary.light",
                      borderColor: "primary.main",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                  size={isMobile ? "small" : "medium"}
                >
                  <AttachFileIcon />
                </IconButton>
              </span>
            </Tooltip>

            <TextField
              fullWidth
              variant="outlined"
              placeholder={
                selectedFile
                  ? "Add an optional caption or description..."
                  : "Type your message..."
              }
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
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
                  "&.Mui-focused": {
                    transform: "translateY(-1px)",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                      borderWidth: 2,
                    },
                  },
                },
                "& .MuiInputBase-input": { py: 1.5 },
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
                                  {commonEmojis.map((emoji) => (
                                    <IconButton
                                      key={emoji}
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

            <Tooltip title={sendDisabled ? "Enter a message or attach a file" : "Send"}>
              <span>
                <IconButton
                  onClick={handleSend}
                  disabled={sendDisabled}
                  sx={{
                    bgcolor: !sendDisabled ? "primary.main" : "grey.300",
                    color: "white",
                    border: "1px solid",
                    borderColor: !sendDisabled ? "primary.main" : "grey.300",
                    "&:hover": {
                      bgcolor: !sendDisabled ? "primary.dark" : "grey.300",
                      transform: !sendDisabled ? "translateY(-2px) scale(1.05)" : "none",
                    },
                    "&:disabled": { color: "grey.500" },
                    transition: "all 0.2s ease-in-out",
                  }}
                  size={isMobile ? "small" : "medium"}
                >
                  {isSending ? <CircularProgress size={20} sx={{ color: "white" }} /> : <SendIcon />}
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default ChatUI;