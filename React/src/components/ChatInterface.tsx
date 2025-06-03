"use client"

import type React from "react"

import { useState } from "react"
import { Box, Paper, Typography, TextField, IconButton, Avatar, CircularProgress, alpha } from "@mui/material"
import { SendIcon, BotIcon, UserIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { colors } from "./them"

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
      text: "שלום! ספר לי מה אתה מחפש היום ואני אמצא עבורך את השאלות הרלוונטיות ביותר 🔍",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

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
      // שליחה לשרת Python
      const response = await fetch("http://localhost:8000/query-files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: inputValue,
          score_threshold: 0.3,
        }),
      })

      const questionIds = await response.json()

      // הוספת הודעת תשובה מהבוט
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text:
          questionIds.length > 0
            ? `מצאתי ${questionIds.length} שאלות רלוונטיות עבורך! הן מוצגות למטה 👇`
            : "לא מצאתי שאלות רלוונטיות לחיפוש שלך. נסה לנסח את השאלה בצורה אחרת 🤔",
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    onSearchResults(questionIds.map((id: string) => Number.parseInt(id, 10)))
    } catch (error) {
      console.error("Error querying files:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "מצטער, אירעה שגיאה בחיפוש. אנא נסה שוב מאוחר יותר 😔",
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

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 4,
        borderRadius: 3,
        border: `1px solid ${alpha(colors.secondary, 0.1)}`,
        overflow: "hidden",
        background: `linear-gradient(135deg, ${alpha(colors.light, 0.3)} 0%, ${alpha(colors.accent, 0.1)} 100%)`,
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: `1px solid ${alpha(colors.secondary, 0.1)}`,
          background: alpha(colors.primary, 0.05),
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: colors.primary, width: 40, height: 40 }}>
            <BotIcon size={20} />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: colors.secondary }}>
              מה אתה מחפש היום?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              תאר לי את מה שאתה מחפש ואמצא עבורך את השאלות הרלוונטיות
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Messages Area */}
      <Box
        sx={{
          maxHeight: 300,
          overflowY: "auto",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
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
                }}
              >
                {!message.isUser && (
                  <Avatar sx={{ bgcolor: colors.primary, width: 32, height: 32 }}>
                    <BotIcon size={16} />
                  </Avatar>
                )}

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    maxWidth: "70%",
                    borderRadius: 2,
                    bgcolor: message.isUser ? colors.primary : alpha(colors.secondary, 0.05),
                    color: message.isUser ? "white" : colors.secondary,
                    border: message.isUser ? "none" : `1px solid ${alpha(colors.secondary, 0.1)}`,
                  }}
                >
                  <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar sx={{ bgcolor: colors.primary, width: 32, height: 32 }}>
                  <BotIcon size={16} />
                </Avatar>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(colors.secondary, 0.05),
                    border: `1px solid ${alpha(colors.secondary, 0.1)}`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={16} thickness={4} sx={{ color: colors.primary }} />
                    <Typography variant="body2" color="text.secondary">
                      מחפש עבורך...
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          p: 3,
          borderTop: `1px solid ${alpha(colors.secondary, 0.1)}`,
          bgcolor: alpha(colors.light, 0.3),
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="תאר מה אתה מחפש..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "white",
                "& fieldset": {
                  borderColor: alpha(colors.secondary, 0.2),
                },
                "&:hover fieldset": {
                  borderColor: alpha(colors.secondary, 0.3),
                },
                "&.Mui-focused fieldset": {
                  borderColor: colors.primary,
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
              "&:hover": {
                bgcolor: alpha(colors.primary, 0.9),
              },
              "&:disabled": {
                bgcolor: alpha(colors.secondary, 0.2),
                color: alpha(colors.secondary, 0.4),
              },
            }}
          >
            {isLoading ? <CircularProgress size={20} sx={{ color: "white" }} /> : <SendIcon size={20} />}
          </IconButton>
        </Box>
      </Box>
    </Paper>
  )
}

export default ChatInterface
