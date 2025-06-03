
// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   IconButton,
//   Avatar,
//   CircularProgress,
//   alpha,
//   Collapse,
//   Button,
// } from "@mui/material"
// import { SendIcon, BotIcon, UserIcon, MessageCircleIcon, XIcon } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"
// import { colors } from "./them"

// interface Message {
//   id: string
//   text: string
//   isUser: boolean
//   timestamp: Date
// }

// interface ChatInterfaceProps {
//   onSearchResults: (questionIds: number[]) => void
//   isLoading: boolean
// }

// const ChatInterface = ({ onSearchResults, isLoading }: ChatInterfaceProps) => {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: "welcome",
//       text: "שלום! ספר לי מה אתה מחפש היום ואני אמצא עבורך את השאלות הרלוונטיות ביותר 🔍",
//       isUser: false,
//       timestamp: new Date(),
//     },
//   ])
//   const [inputValue, setInputValue] = useState("")
//   const [isTyping, setIsTyping] = useState(false)
//   const [isChatOpen, setIsChatOpen] = useState(false)

//   const handleSendMessage = async () => {
//     if (!inputValue.trim() || isLoading) return

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       text: inputValue,
//       isUser: true,
//       timestamp: new Date(),
//     }

//     setMessages((prev) => [...prev, userMessage])
//     setInputValue("")
//     setIsTyping(true)

//     try {
//       // שליחה לשרת Python
//       const response = await fetch("http://localhost:8000/query-files", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           query: inputValue,
//           score_threshold: 0.3,
//         }),
//       })

//       const questionIds = await response.json()

//       // הוספת הודעת תשובה מהבוט
//       const botMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         text:
//           questionIds.length > 0
//             ? `מצאתי ${questionIds.length} שאלות רלוונטיות עבורך! הן מוצגות למטה 👇`
//             : "לא מצאתי שאלות רלוונטיות לחיפוש שלך. נסה לנסח את השאלה בצורה אחרת 🤔",
//         isUser: false,
//         timestamp: new Date(),
//       }

//       setMessages((prev) => [...prev, botMessage])
//     onSearchResults(questionIds.map((id: string) => Number.parseInt(id, 10)))
//     } catch (error) {
//       console.error("Error querying files:", error)
//       const errorMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         text: "מצטער, אירעה שגיאה בחיפוש. אנא נסה שוב מאוחר יותר 😔",
//         isUser: false,
//         timestamp: new Date(),
//       }
//       setMessages((prev) => [...prev, errorMessage])
//     } finally {
//       setIsTyping(false)
//     }
//   }

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault()
//       handleSendMessage()
//     }
//   }

//   const toggleChat = () => {
//     setIsChatOpen(!isChatOpen)
//   }

//   // Auto-scroll to bottom when new messages arrive
//   useEffect(() => {
//     const messagesContainer = document.getElementById("chat-messages-container")
//     if (messagesContainer) {
//       messagesContainer.scrollTop = messagesContainer.scrollHeight
//     }
//   }, [messages])

//   return (
//     <>
//       {/* Chat Toggle Button - Fixed at bottom right */}
//       <Box
//         sx={{
//           position: "fixed",
//           bottom: 24,
//           right: 24,
//           zIndex: 1000,
//           display: { xs: "block", md: "none" },
//         }}
//       >
//         <motion.div
//           initial={{ scale: 0.8, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.3 }}
//         >
//           <Button
//             variant="contained"
//             onClick={toggleChat}
//             startIcon={isChatOpen ? <XIcon size={20} /> : <MessageCircleIcon size={20} />}
//             sx={{
//               borderRadius: "50px",
//               px: 3,
//               py: 1.5,
//               bgcolor: colors.primary,
//               boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
//               "&:hover": {
//                 bgcolor: alpha(colors.primary, 0.9),
//               },
//               textTransform: "none",
//               fontWeight: 500,
//             }}
//           >
//             {isChatOpen ? "סגור צ'אט" : "פתח צ'אט"}
//           </Button>
//         </motion.div>
//       </Box>

//       {/* Desktop Chat Button */}
//       <Box sx={{ mb: 3, display: { xs: "none", md: "block" } }}>
//         <Button
//           variant={isChatOpen ? "contained" : "outlined"}
//           onClick={toggleChat}
//           startIcon={isChatOpen ? <XIcon size={20} /> : <MessageCircleIcon size={20} />}
//           sx={{
//             borderRadius: "50px",
//             px: 4,
//             py: 1.5,
//             bgcolor: isChatOpen ? colors.primary : "transparent",
//             borderColor: isChatOpen ? colors.primary : alpha(colors.secondary, 0.3),
//             color: isChatOpen ? "white" : colors.secondary,
//             "&:hover": {
//               bgcolor: isChatOpen ? alpha(colors.primary, 0.9) : alpha(colors.secondary, 0.05),
//               borderColor: isChatOpen ? colors.primary : colors.secondary,
//             },
//             textTransform: "none",
//             fontWeight: 500,
//           }}
//         >
//           {isChatOpen ? "סגור צ'אט" : "פתח צ'אט עוזר"}
//         </Button>
//       </Box>

//       {/* Chat Interface */}
//       <Collapse in={isChatOpen} timeout={300}>
//         <Paper
//           elevation={0}
//           sx={{
//             mb: 4,
//             borderRadius: 3,
//             border: `1px solid ${alpha(colors.secondary, 0.1)}`,
//             overflow: "hidden",
//             background: `linear-gradient(135deg, ${alpha(colors.light, 0.3)} 0%, ${alpha(colors.accent, 0.1)} 100%)`,
//           }}
//         >
//           {/* Chat Header */}
//           <Box
//             sx={{
//               p: 3,
//               borderBottom: `1px solid ${alpha(colors.secondary, 0.1)}`,
//               background: alpha(colors.primary, 0.05),
//             }}
//           >
//             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//               <Avatar sx={{ bgcolor: colors.primary, width: 40, height: 40 }}>
//                 <BotIcon size={20} />
//               </Avatar>
//               <Box>
//                 <Typography variant="h6" sx={{ fontWeight: 600, color: colors.secondary }}>
//                   מה אתה מחפש היום?
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   תאר לי את מה שאתה מחפש ואמצא עבורך את השאלות הרלוונטיות
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>

//           {/* Messages Area */}
//           <Box
//             id="chat-messages-container"
//             sx={{
//               maxHeight: 300,
//               overflowY: "auto",
//               p: 3,
//               display: "flex",
//               flexDirection: "column",
//               gap: 2,
//             }}
//           >
//             <AnimatePresence>
//               {messages.map((message) => (
//                 <motion.div
//                   key={message.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: message.isUser ? "flex-end" : "flex-start",
//                       alignItems: "flex-start",
//                       gap: 1,
//                     }}
//                   >
//                     {!message.isUser && (
//                       <Avatar sx={{ bgcolor: colors.primary, width: 32, height: 32 }}>
//                         <BotIcon size={16} />
//                       </Avatar>
//                     )}

//                     <Paper
//                       elevation={0}
//                       sx={{
//                         p: 2,
//                         maxWidth: "70%",
//                         borderRadius: 2,
//                         bgcolor: message.isUser ? colors.primary : alpha(colors.secondary, 0.05),
//                         color: message.isUser ? "white" : colors.secondary,
//                         border: message.isUser ? "none" : `1px solid ${alpha(colors.secondary, 0.1)}`,
//                       }}
//                     >
//                       <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
//                         {message.text}
//                       </Typography>
//                     </Paper>

//                     {message.isUser && (
//                       <Avatar sx={{ bgcolor: colors.accent, width: 32, height: 32 }}>
//                         <UserIcon size={16} />
//                       </Avatar>
//                     )}
//                   </Box>
//                 </motion.div>
//               ))}
//             </AnimatePresence>

//             {/* Typing Indicator */}
//             <AnimatePresence>
//               {isTyping && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                 >
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                     <Avatar sx={{ bgcolor: colors.primary, width: 32, height: 32 }}>
//                       <BotIcon size={16} />
//                     </Avatar>
//                     <Paper
//                       elevation={0}
//                       sx={{
//                         p: 2,
//                         borderRadius: 2,
//                         bgcolor: alpha(colors.secondary, 0.05),
//                         border: `1px solid ${alpha(colors.secondary, 0.1)}`,
//                       }}
//                     >
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                         <CircularProgress size={16} thickness={4} sx={{ color: colors.primary }} />
//                         <Typography variant="body2" color="text.secondary">
//                           מחפש עבורך...
//                         </Typography>
//                       </Box>
//                     </Paper>
//                   </Box>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </Box>

//           {/* Input Area */}
//           <Box
//             sx={{
//               p: 3,
//               borderTop: `1px solid ${alpha(colors.secondary, 0.1)}`,
//               bgcolor: alpha(colors.light, 0.3),
//             }}
//           >
//             <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
//               <TextField
//                 fullWidth
//                 multiline
//                 maxRows={3}
//                 placeholder="תאר מה אתה מחפש..."
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 disabled={isLoading}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: 2,
//                     bgcolor: "white",
//                     "& fieldset": {
//                       borderColor: alpha(colors.secondary, 0.2),
//                     },
//                     "&:hover fieldset": {
//                       borderColor: alpha(colors.secondary, 0.3),
//                     },
//                     "&.Mui-focused fieldset": {
//                       borderColor: colors.primary,
//                     },
//                   },
//                 }}
//               />
//               <IconButton
//                 onClick={handleSendMessage}
//                 disabled={!inputValue.trim() || isLoading}
//                 sx={{
//                   bgcolor: colors.primary,
//                   color: "white",
//                   width: 48,
//                   height: 48,
//                   "&:hover": {
//                     bgcolor: alpha(colors.primary, 0.9),
//                   },
//                   "&:disabled": {
//                     bgcolor: alpha(colors.secondary, 0.2),
//                     color: alpha(colors.secondary, 0.4),
//                   },
//                 }}
//               >
//                 {isLoading ? <CircularProgress size={20} sx={{ color: "white" }} /> : <SendIcon size={20} />}
//               </IconButton>
//             </Box>
//           </Box>
//         </Paper>
//       </Collapse>
//     </>
//   )
// }

// export default ChatInterface
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
} from "@mui/material"
import { SendIcon, BotIcon, UserIcon, XIcon } from "lucide-react"
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
      text: "Hello! Tell me what you're looking for today and I'll find the most relevant questions for you 🔍",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [showBubble, setShowBubble] = useState(true)

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
      // Send to Python server
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

      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text:
          questionIds.length > 0
            ? `I found ${questionIds.length} relevant questions for you! They're displayed below 👇`
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

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: "relative" }}>
        {/* Robot Avatar Button */}
        <Box
          ref={chatButtonRef}
          onClick={toggleChat}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
            cursor: "pointer",
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ position: "relative" }}>
              <Avatar
                sx={{
                  bgcolor: colors.primary,
                  width: 60,
                  height: 60,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                  border: isChatOpen ? `2px solid ${colors.accent}` : "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <BotIcon size={30} />
              </Avatar>

              {/* Speech Bubble */}
              <Zoom in={showBubble && !isChatOpen} timeout={300}>
                <Paper
                  elevation={2}
                  sx={{
                    position: "absolute",
                    bottom: "100%",
                    right: 0,
                    mb: 1,
                    p: 1.5,
                    borderRadius: 2,
                    maxWidth: 200,
                    bgcolor: "white",
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      bottom: -8,
                      right: 20,
                      border: "8px solid transparent",
                      borderTopColor: "white",
                      borderBottom: 0,
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Need help finding questions? Ask me!
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
                offset: [0, 10],
              },
            },
          ]}
          sx={{ zIndex: 999 }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={300}>
              <Paper
                elevation={6}
                sx={{
                  width: { xs: "calc(100vw - 48px)", sm: 380 },
                  maxWidth: "100%",
                  height: 450,
                  borderRadius: 3,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                  border: `1px solid ${alpha(colors.secondary, 0.1)}`,
                }}
              >
                {/* Chat Header */}
                <Box
                  sx={{
                    p: 2,
                    borderBottom: `1px solid ${alpha(colors.secondary, 0.1)}`,
                    background: alpha(colors.primary, 0.05),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: colors.primary, width: 36, height: 36 }}>
                      <BotIcon size={20} />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: colors.secondary, lineHeight: 1.2 }}
                      >
                        Question Assistant
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Online
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton size="small" onClick={toggleChat} sx={{ color: alpha(colors.secondary, 0.7) }}>
                    <XIcon size={18} />
                  </IconButton>
                </Box>

                {/* Messages Area */}
                <Box
                  id="chat-messages-container"
                  sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    p: 2,
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
                            <Avatar sx={{ bgcolor: colors.primary, width: 28, height: 28 }}>
                              <BotIcon size={14} />
                            </Avatar>
                          )}

                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.5,
                              maxWidth: "75%",
                              borderRadius: 2,
                              bgcolor: message.isUser ? colors.primary : "white",
                              color: message.isUser ? "white" : colors.secondary,
                              border: message.isUser ? "none" : `1px solid ${alpha(colors.secondary, 0.1)}`,
                              boxShadow: message.isUser ? "none" : "0 2px 6px rgba(0,0,0,0.05)",
                            }}
                          >
                            <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                              {message.text}
                            </Typography>
                          </Paper>

                          {message.isUser && (
                            <Avatar sx={{ bgcolor: colors.accent, width: 28, height: 28 }}>
                              <UserIcon size={14} />
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
                          <Avatar sx={{ bgcolor: colors.primary, width: 28, height: 28 }}>
                            <BotIcon size={14} />
                          </Avatar>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: "white",
                              border: `1px solid ${alpha(colors.secondary, 0.1)}`,
                              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <CircularProgress size={14} thickness={4} sx={{ color: colors.primary }} />
                              <Typography variant="body2" color="text.secondary">
                                Searching...
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
                    p: 2,
                    borderTop: `1px solid ${alpha(colors.secondary, 0.1)}`,
                    bgcolor: "white",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
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
                          borderRadius: 3,
                          bgcolor: alpha(colors.light, 0.5),
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
                        width: 40,
                        height: 40,
                        "&:hover": {
                          bgcolor: alpha(colors.primary, 0.9),
                        },
                        "&:disabled": {
                          bgcolor: alpha(colors.secondary, 0.2),
                          color: alpha(colors.secondary, 0.4),
                        },
                      }}
                    >
                      {isLoading ? <CircularProgress size={18} sx={{ color: "white" }} /> : <SendIcon size={18} />}
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
