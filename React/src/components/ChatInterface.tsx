
"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  CircularProgress,
  alpha,
  Zoom,
  Fade,
  Popper,
  ClickAwayListener,
  Badge,
} from "@mui/material"
import { SendIcon, BotIcon, UserIcon, XIcon, SparklesIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { colors } from "./them"
import axios from "axios"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface ChatInterfaceProps {
  onSearchResults: (questionIds: number[]) => void
  isLoading: boolean
}

const ChatInterface = ({ onSearchResults, isLoading }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! Tell me what you're looking for today and I'll find the most relevant questions for you 🔍",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [showBubble, setShowBubble] = useState(true)
  const [pulseAnimation, setPulseAnimation] = useState(true)

  const chatButtonRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
     
    
const response = await axios.post("http://localhost:8000/query-files", {
    query: inputValue,
    score_threshold: 0.3,
  }, {
    headers: {
      "Content-Type": "application/json",
    },
  });

      const questionIds = response.data

      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text:
          questionIds.length > 0
            ? `I found relevant questions for you! They're displayed below 👇`
            : "I couldn't find any relevant questions for your search. Try phrasing your question differently 🤔",
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      onSearchResults(questionIds.map((id:string) => Number.parseInt(id)))
    } catch (error) {
      console.error("Error querying files:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, there was an error with your search. Please try again later 😔",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
    setShowBubble(false)
    setPulseAnimation(false)

    // Focus the input field when opening chat
    if (!isChatOpen) {
      setTimeout(() => {
        chatInputRef.current?.focus()
      }, 300)
    }
  }

  const handleClickAway = () => {
    if (isChatOpen) {
      setIsChatOpen(false)
    }
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const messagesContainer = document.getElementById("chat-messages-container")
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  }, [messages])

  // Show speech bubble after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isChatOpen) {
        setShowBubble(true)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [isChatOpen])

  // Stop pulse animation after some time
  useEffect(() => {
    const timer = setTimeout(() => {
      setPulseAnimation(false)
    }, 8000) // Stop pulsing after 8 seconds

    return () => clearTimeout(timer)
  }, [])

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: "relative" }}>
        {/* Robot Avatar Button - Enhanced */}
        <Box
          ref={chatButtonRef}
          onClick={toggleChat}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 1000,
            cursor: "pointer",
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
          >
            <Box sx={{ position: "relative" }}>
              {/* Glow Effect Background */}
              <Box
                sx={{
                  position: "absolute",
                  top: -8,
                  left: -8,
                  right: -8,
                  bottom: -8,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${alpha(colors.primary, 0.3)} 0%, transparent 70%)`,
                  animation: pulseAnimation ? "pulse 2s infinite" : "none",
                  "@keyframes pulse": {
                    "0%": {
                      transform: "scale(1)",
                      opacity: 0.7,
                    },
                    "50%": {
                      transform: "scale(1.1)",
                      opacity: 0.4,
                    },
                    "100%": {
                      transform: "scale(1)",
                      opacity: 0.7,
                    },
                  },
                }}
              />

              {/* Main Avatar with Badge */}
              <Badge
                badgeContent={
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      bgcolor: "#4CAF50",
                      border: "2px solid white",
                      animation: "blink 2s infinite",
                      "@keyframes blink": {
                        "0%, 50%": { opacity: 1 },
                        "51%, 100%": { opacity: 0.3 },
                      },
                    }}
                  />
                }
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: colors.dark,
                    width: 80,
                    height: 80,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                    border: `3px solid white`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
                    },
                    "&:active": {
                      transform: "scale(0.95)",
                    },
                  }}
                >
                  <BotIcon size={40} />
                </Avatar>
              </Badge>

              {/* Floating Sparkles */}
              <Box
                sx={{
                  position: "absolute",
                  top: -5,
                  left: -5,
                  animation: "float 3s ease-in-out infinite",
                  "@keyframes float": {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-8px)" },
                  },
                }}
              >
                <SparklesIcon size={20} style={{ color: colors.accent, opacity: 0.8 }} />
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  bottom: -5,
                  right: -5,
                  animation: "float 3s ease-in-out infinite 1.5s",
                  "@keyframes float": {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-8px)" },
                  },
                }}
              >
                <SparklesIcon size={16} style={{ color: colors.primary, opacity: 0.6 }} />
              </Box>

              {/* Enhanced Speech Bubble */}
              <Zoom in={showBubble && !isChatOpen} timeout={400}>
                <Paper
                  elevation={8}
                  sx={{
                    position: "absolute",
                    bottom: "100%",
                    right: 0,
                    mb: 2,
                    p: 2,
                    borderRadius: 3,
                    maxWidth: 240,
                    bgcolor: "white",
                    border: `2px solid ${colors.dark}`,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                    animation: "bounce 2s ease-in-out infinite",
                    "@keyframes bounce": {
                      "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
                      "40%": { transform: "translateY(-5px)" },
                      "60%": { transform: "translateY(-3px)" },
                    },
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      bottom: -10,
                      right: 25,
                      border: "10px solid transparent",
                      borderTopColor: colors.primary,
                      borderBottom: 0,
                    },
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      bottom: -8,
                      right: 27,
                      border: "8px solid transparent",
                      borderTopColor: "white",
                      borderBottom: 0,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <SparklesIcon size={16} style={{ color: colors.primary }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: colors.primary }}>
                      AI Assistant
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: colors.secondary, lineHeight: 1.4 }}>
                    Need help finding questions? Ask me anything!
                  </Typography>
                </Paper>
              </Zoom>
            </Box>
          </motion.div>
        </Box>

        {/* Chat Interface */}
        <Popper
          open={isChatOpen}
          anchorEl={chatButtonRef.current}
          placement="top-end"
          transition
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 15],
              },
            },
          ]}
          sx={{ zIndex: 999 }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={300}>
              <Paper
                elevation={12}
                sx={{
                  width: { xs: "calc(100vw - 64px)", sm: 400 },
                  maxWidth: "100%",
                  height: 480,
                  borderRadius: 4,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                  border: `2px solid ${alpha(colors.primary, 0.2)}`,
                }}
              >
                {/* Chat Header - Enhanced */}
                <Box
                  sx={{
                    p: 3,
                    borderBottom: `1px solid ${alpha(colors.secondary, 0.1)}`,
                    background: `linear-gradient(135deg, ${alpha(colors.primary, 0.1)} 0%, ${alpha(colors.accent, 0.05)} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Badge
                      badgeContent={
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: "#4CAF50",
                            border: "2px solid white",
                          }}
                        />
                      }
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                    >
                      <Avatar sx={{ bgcolor: colors.primary, width: 44, height: 44 }}>
                        <BotIcon size={24} />
                      </Avatar>
                    </Badge>
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700, color: colors.secondary, lineHeight: 1.2 }}
                        >
                          AI Question Assistant
                        </Typography>
                        <SparklesIcon size={16} style={{ color: colors.primary }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: "#4CAF50", fontWeight: 500 }}>
                        ● Online & Ready to Help
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={toggleChat}
                    sx={{
                      color: alpha(colors.secondary, 0.7),
                      bgcolor: alpha(colors.secondary, 0.1),
                      "&:hover": {
                        bgcolor: alpha(colors.secondary, 0.2),
                      },
                    }}
                  >
                    <XIcon size={18} />
                  </IconButton>
                </Box>

                {/* Messages Area */}
                <Box
                  id="chat-messages-container"
                  sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    bgcolor: alpha(colors.light, 0.3),
                  }}
                >
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: message.isUser ? "flex-end" : "flex-start",
                            alignItems: "flex-start",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          {!message.isUser && (
                            <Avatar sx={{ bgcolor: colors.dark, width: 32, height: 32 }}>
                              <BotIcon size={16} />
                            </Avatar>
                          )}

                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              maxWidth: "75%",
                              borderRadius: 3,
                              bgcolor: message.isUser ? colors.primary : "white",
                              color: message.isUser ? "white" : colors.secondary,
                              border: message.isUser ? "none" : `1px solid ${alpha(colors.secondary, 0.1)}`,
                              boxShadow: message.isUser ? "none" : "0 4px 12px rgba(0,0,0,0.08)",
                            }}
                          >
                            <Typography variant="body2" sx={{ lineHeight: 1.5, fontWeight: 500 }}>
                              {message.text}
                            </Typography>
                          </Paper>

                          {message.isUser && (
                            <Avatar sx={{ bgcolor: colors.accent, width: 32, height: 32 }}>
                              <UserIcon size={16} />
                            </Avatar>
                          )}
                        </Box>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  <AnimatePresence>
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar sx={{ bgcolor: colors.primary, width: 32, height: 32 }}>
                            <BotIcon size={16} />
                          </Avatar>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              borderRadius: 3,
                              bgcolor: "white",
                              border: `1px solid ${alpha(colors.secondary, 0.1)}`,
                              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <CircularProgress size={16} thickness={4} sx={{ color: colors.primary }} />
                              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Searching for answers...
                              </Typography>
                            </Box>
                          </Paper>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>

                {/* Input Area - Enhanced */}
                <Box
                  sx={{
                    p: 3,
                    borderTop: `1px solid ${alpha(colors.secondary, 0.1)}`,
                    bgcolor: "white",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <TextField
                      inputRef={chatInputRef}
                      fullWidth
                      multiline
                      maxRows={3}
                      placeholder="What are you looking for today?"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                      variant="outlined"
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 4,
                          bgcolor: alpha(colors.light, 0.5),
                          "& fieldset": {
                            borderColor: alpha(colors.secondary, 0.2),
                          },
                          "&:hover fieldset": {
                            borderColor: alpha(colors.dark, 0.5),
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: colors.primary,
                            borderWidth: 2,
                          },
                        },
                      }}
                    />
                    <IconButton
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      sx={{
                        bgcolor: colors.primary,
                        color: "white",
                        width: 48,
                        height: 48,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        "&:hover": {
                          bgcolor: alpha(colors.primary, 0.9),
                          transform: "scale(1.05)",
                        },
                        "&:disabled": {
                          bgcolor: alpha(colors.secondary, 0.2),
                          color: alpha(colors.secondary, 0.4),
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      {isLoading ? <CircularProgress size={20} sx={{ color: "white" }} /> : <SendIcon size={20} />}
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  )
}

export default ChatInterface
