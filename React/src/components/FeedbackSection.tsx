

// import type React from "react"

// import { useState, useRef, useEffect } from "react"
// import {
//   Typography,
//   List,
//   TextField,
//   Box,
//   IconButton,
//   Tooltip,
//   Popover,
//   Avatar,
//   Paper,
//   Card,
//   CardContent,
//   Button,
//   Fade,
//   Snackbar,
//   Alert,
//   Divider,
//   alpha,
//   CircularProgress,
// } from "@mui/material"
// import {
//   ReplyIcon,
//   SmileIcon,
//   SendIcon,
//   XIcon,
//   ChevronDownIcon,
//   ChevronUpIcon,
//   UserIcon,
//   CalendarIcon,
// } from "lucide-react"
// import EmojiPicker, { type EmojiClickData } from "emoji-picker-react"
// import { useDispatch, useSelector } from "react-redux"
// import type { AppDispatch, RootState } from "../redux/Store"
// import { AddFeedback } from "../redux/FeedbacksSlice"
// import { getQuestions } from "../redux/QuestionsSlice"
// import { updateUser } from "../redux/UserSlice"
// import { motion, AnimatePresence } from "framer-motion"
// import { sendEmail } from "../services/Email"
// import axios from "axios"
// import { colors } from "./them"


// // New elegant color palette
// // const colors = {
// //   primary: "#E07A5F", // Terracotta
// //   secondary: "#3D405B", // Dark slate blue
// //   light: "#F4F1DE", // Cream
// //   accent: "#81B29A", // Sage green
// //   dark: "#2D3142", // Dark blue-gray
// // }

// export interface Feedback {
//   id?: number
//   content: string
//   questionId: number
//   userName: string
//   userEmail: string
//   parentFeedbackId?: number // ID of the original feedback (if this is a reply)
//   createAt?: Date
// }

// interface FeedbackSectionProps {
//   feedbacks: Feedback[]
//   questionId: number
//   questionUserName: string
//   questionUserEmail: string
//   questionTitle: string
//   questionUserId: number
// }

// const FeedbackSection = ({
//   feedbacks,
//   questionId,
//   questionUserName,
//   questionUserEmail,
//   questionTitle,
//   questionUserId,
// }: FeedbackSectionProps) => {
//   const [newFeedback, setNewFeedback] = useState("")
//   const [localFeedbacks, setLocalFeedbacks] = useState<Feedback[]>(feedbacks)
//   const [replyTo, setReplyTo] = useState<Feedback | null>(null)
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
//   const [showAllComments, setShowAllComments] = useState(false)
//   const [snackbarOpen, setSnackbarOpen] = useState(false)
//   const [snackbarMessage, setSnackbarMessage] = useState("")
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const feedbackEndRef = useRef<HTMLDivElement>(null)

//   const dispatch = useDispatch<AppDispatch>()
//   const user = useSelector((state: RootState) => state.User.user)
//   const apiUrl = import.meta.env.VITE_API_URL;

//   // Scroll to bottom when replying
//   useEffect(() => {
//     if (replyTo && feedbackEndRef.current) {
//       feedbackEndRef.current.scrollIntoView({ behavior: "smooth" })
//     }
//   }, [replyTo])

//   // Update local feedbacks when props change
//   useEffect(() => {
//     setLocalFeedbacks(feedbacks)
//   }, [feedbacks])

//   const handleSendFeedback = async (content: string) => {
//     if (!content.trim()) return

//     if (!user) {
//       setSnackbarMessage("Please sign in to add feedback")
//       setSnackbarOpen(true)
//       return
//     }

//     setIsSubmitting(true)

//     const newFeedbackObject: Feedback = {
//       content: replyTo
//         ? `Replying to: "${replyTo.content.substring(0, 30)}${replyTo.content.length > 30 ? "..." : ""}"
// ${content}`
//         : content,
//       questionId,
//       userName: user?.userName || "Anonymous",
//       userEmail: user?.email || "",
//       parentFeedbackId: replyTo?.id,
//     }

//     try {
//       const resultAction = await dispatch(AddFeedback(newFeedbackObject))
//       await dispatch(getQuestions())

//       if (AddFeedback.fulfilled.match(resultAction)) {
//         setLocalFeedbacks((prev) => [...prev, { ...newFeedbackObject, id: resultAction.payload.id }])

//         const response = await axios.get(`${apiUrl}User/send/${questionUserId}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         })

//         const questionUser = response.data

//         if (questionUser.sendFeedback) {
//           await sendEmail({
//             to: questionUserEmail,
//             subject: "New Feedback on Your Question",
//             body: `
//               <div style="font-family: 'Inter', sans-serif; line-height: 1.8; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
//                 <div style="background-color: ${colors.primary}; color: white; padding: 24px; text-align: center;">
//                   <h1 style="margin: 0; font-size: 24px; font-weight: 600;">New Feedback Received!</h1>
//                 </div>
//                 <div style="padding: 24px;">
//                   <p>Hi <strong>${questionUserName}</strong>,</p>
//                   <p>Someone has left feedback on your question:</p>
//                   <div style="border: 1px solid #eee; padding: 16px; border-radius: 8px; background-color: #f9f9f9; margin-bottom: 20px;">
//                     <p style="margin: 0;"><strong>Question:</strong> ${questionTitle}</p>
//                     <blockquote style="margin: 16px 0; padding: 16px; border-left: 4px solid ${colors.primary}; background-color: #f5f5f5; font-style: italic;">
//                       ${content}
//                     </blockquote>
//                   </div>
//                   <p><strong>From:</strong> ${user?.userName || "Anonymous"}</p>
//                   <p><strong>Email:</strong> ${user?.email || "No email provided"}</p>
//                   <div style="text-align: center; margin: 32px 0;">
//                   </div>
//                   <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
//                   <p style="font-size: 0.9em; color: #777; text-align: center;">Thank you for using our platform!<br />The Feedback Platform Team</p>
//                 </div>
//               </div>
//             `,
//           })
//         }

//         // Update user points
//         if (user) {
//           const updatedUser = { ...user, points: (user.points || 0) + 1 }
//           await dispatch(updateUser(updatedUser))

//           setSnackbarMessage("Feedback added! You earned 1 point.")
//           setSnackbarOpen(true)
//         }
//       }
//     } catch (error) {
//       console.error("Error adding feedback:", error)
//       setSnackbarMessage("Failed to add feedback. Please try again.")
//       setSnackbarOpen(true)
//     } finally {
//       setNewFeedback("")
//       setReplyTo(null)
//       setIsSubmitting(false)
//     }
//   }

//   const handleKeyDown = async (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault()
//       await handleSendFeedback(newFeedback)
//     }
//   }

//   const handleReply = (feedback: Feedback) => {
//     setReplyTo(feedback)
//     setNewFeedback("")
//   }

//   const handleOpenEmojiPicker = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget)
//   }

//   const handleCloseEmojiPicker = () => {
//     setAnchorEl(null)
//   }

//   // Modified to send emoji directly
//   const handleEmojiClick = async (emojiData: EmojiClickData) => {
//     const emoji = emojiData.emoji
//     await handleSendFeedback(emoji)
//     handleCloseEmojiPicker()
//   }

//   const cancelReply = () => {
//     setReplyTo(null)
//   }

//   const handleCopyEmail = (email: string) => {
//     navigator.clipboard.writeText(email)
//     setSnackbarMessage(`Email copied: ${email}`)
//     setSnackbarOpen(true)
//   }

//   const toggleShowAllComments = () => {
//     setShowAllComments(!showAllComments)
//   }

//   // Filter main feedbacks (not replies)
//   const mainFeedbacks = localFeedbacks.filter((feedback) => !feedback.parentFeedbackId)

//   // Determine how many to show
//   const displayedFeedbacks = showAllComments ? mainFeedbacks : mainFeedbacks.slice(0, Math.min(3, mainFeedbacks.length))

//   return (
//     <Card
//       elevation={0}
//       sx={{
//         bgcolor: "white",
//         borderRadius: 3,
//         border: `1px solid ${alpha(colors.secondary, 0.1)}`,
//         overflow: "hidden",
//       }}
//     >
//       <CardContent sx={{ p: 0 }}>
//         <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(colors.secondary, 0.1)}` }}>
//           <Typography variant="h6" sx={{ fontWeight: 600, color: colors.secondary, mb: 1 }}>
//             Feedback & Comments
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Share your thoughts and insights on this question
//           </Typography>
//         </Box>

//         <Box sx={{ p: 3 }}>
//           {Array.isArray(localFeedbacks) && localFeedbacks.length > 0 ? (
//             <List sx={{ mb: 3, p: 0 }}>
//               <AnimatePresence>
//                 {displayedFeedbacks.map((feedback, index) => (
//                   <motion.div
//                     key={feedback.id || index}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, height: 0 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <Box sx={{ mb: 3 }}>
//                       <Paper
//                         elevation={0}
//                         sx={{
//                           p: 3,
//                           borderRadius: 2,
//                           bgcolor: alpha(colors.light, 0.5),
//                           border: `1px solid ${alpha(colors.secondary, 0.08)}`,
//                         }}
//                       >
//                         <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                           <Avatar
//                             sx={{
//                               width: 36,
//                               height: 36,
//                               bgcolor: colors.primary,
//                               mr: 1.5,
//                               fontSize: "0.875rem",
//                             }}
//                           >
//                             {feedback.userName?.charAt(0).toUpperCase() || <UserIcon size={16} />}
//                           </Avatar>
//                           <Box sx={{ flexGrow: 1 }}>
//                             <Tooltip
//                               title={feedback.userEmail ? `Click to copy: ${feedback.userEmail}` : "No email available"}
//                               arrow
//                               placement="top"
//                             >
//                               <Typography
//                                 variant="subtitle2"
//                                 sx={{
//                                   fontWeight: 600,
//                                   cursor: feedback.userEmail ? "pointer" : "default",
//                                   color: colors.secondary,
//                                 }}
//                                 onClick={() => feedback.userEmail && handleCopyEmail(feedback.userEmail)}
//                               >
//                                 {feedback.userName || "Anonymous"}
//                               </Typography>
//                             </Tooltip>
//                             {feedback.createAt && (
//                               <Typography
//                                 variant="caption"
//                                 color="text.secondary"
//                                 sx={{ display: "flex", alignItems: "center" }}
//                               >
//                                 <CalendarIcon size={12} style={{ marginRight: 4 }} />
//                                 {new Date(feedback.createAt).toLocaleDateString()}
//                               </Typography>
//                             )}
//                           </Box>
//                           <Tooltip title="Reply">
//                             <IconButton
//                               size="small"
//                               onClick={() => handleReply(feedback)}
//                               sx={{
//                                 color: colors.primary,
//                                 "&:hover": {
//                                   bgcolor: alpha(colors.primary, 0.05),
//                                 },
//                               }}
//                             >
//                               <ReplyIcon size={18} />
//                             </IconButton>
//                           </Tooltip>
//                         </Box>

//                         <Typography
//                           variant="body2"
//                           sx={{
//                             whiteSpace: "pre-wrap",
//                             color: colors.secondary,
//                             lineHeight: 1.6,
//                           }}
//                         >
//                           {feedback.content}
//                         </Typography>
//                       </Paper>

//                       {/* Display replies */}
//                       {localFeedbacks
//                         .filter((reply) => reply.parentFeedbackId === feedback.id)
//                         .map((reply, replyIndex) => (
//                           <Box
//                             key={replyIndex}
//                             sx={{
//                               ml: 5,
//                               mt: 2,
//                               position: "relative",
//                             }}
//                           >
//                             <Box
//                               sx={{
//                                 position: "absolute",
//                                 left: -16,
//                                 top: 0,
//                                 bottom: 0,
//                                 width: 2,
//                                 bgcolor: alpha(colors.primary, 0.2),
//                               }}
//                             />
//                             <Paper
//                               elevation={0}
//                               sx={{
//                                 p: 3,
//                                 borderRadius: 2,
//                                 bgcolor: "white",
//                                 border: `1px solid ${alpha(colors.secondary, 0.08)}`,
//                               }}
//                             >
//                               <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                                 <Avatar
//                                   sx={{
//                                     width: 32,
//                                     height: 32,
//                                     bgcolor: alpha(colors.primary, 0.8),
//                                     mr: 1.5,
//                                     fontSize: "0.75rem",
//                                   }}
//                                 >
//                                   {reply.userName?.charAt(0).toUpperCase() || <UserIcon size={14} />}
//                                 </Avatar>
//                                 <Box>
//                                   <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.secondary }}>
//                                     {reply.userName || "Anonymous"}
//                                   </Typography>
//                                   {reply.createAt && (
//                                     <Typography
//                                       variant="caption"
//                                       color="text.secondary"
//                                       sx={{ display: "flex", alignItems: "center" }}
//                                     >
//                                       <CalendarIcon size={12} style={{ marginRight: 4 }} />
//                                       {new Date(reply.createAt).toLocaleDateString()}
//                                     </Typography>
//                                   )}
//                                 </Box>
//                               </Box>
//                               <Typography
//                                 variant="body2"
//                                 sx={{
//                                   whiteSpace: "pre-wrap",
//                                   color: colors.secondary,
//                                   lineHeight: 1.6,
//                                 }}
//                               >
//                                 {reply.content}
//                               </Typography>
//                             </Paper>
//                           </Box>
//                         ))}
//                     </Box>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </List>
//           ) : (
//             <Box
//               sx={{
//                 py: 6,
//                 textAlign: "center",
//                 bgcolor: alpha(colors.light, 0.3),
//                 borderRadius: 2,
//                 mb: 3,
//               }}
//             >
//               <UserIcon size={32} style={{ color: alpha(colors.secondary, 0.3), marginBottom: 16 }} />
//               <Typography variant="body1" sx={{ fontWeight: 500, color: colors.secondary, mb: 1 }}>
//                 No comments yet
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Be the first to share your thoughts on this question
//               </Typography>
//             </Box>
//           )}

//           {mainFeedbacks.length > 3 && (
//             <Box sx={{ textAlign: "center", mb: 4 }}>
//               <Button
//                 variant="outlined"
//                 size="small"
//                 onClick={toggleShowAllComments}
//                 endIcon={showAllComments ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
//                 sx={{
//                   borderRadius: 2,
//                   py: 1,
//                   px: 3,
//                   borderColor: alpha(colors.secondary, 0.3),
//                   color: colors.secondary,
//                   "&:hover": {
//                     bgcolor: alpha(colors.secondary, 0.05),
//                     borderColor: colors.secondary,
//                   },
//                   textTransform: "none",
//                   fontWeight: 500,
//                 }}
//               >
//                 {showAllComments ? "Show Less" : `View ${mainFeedbacks.length - 3} More Comments`}
//               </Button>
//             </Box>
//           )}

//           <Divider sx={{ my: 3 }} />

//           <Box ref={feedbackEndRef}>
//             {replyTo && (
//               <Fade in={!!replyTo}>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     mb: 2,
//                     p: 2,
//                     borderRadius: 2,
//                     bgcolor: alpha(colors.light, 0.5),
//                     border: `1px solid ${alpha(colors.secondary, 0.08)}`,
//                   }}
//                 >
//                   <Typography variant="body2" sx={{ flex: 1, fontStyle: "italic", color: colors.secondary }}>
//                     Replying to: {replyTo.userName} - "{replyTo.content.substring(0, 40)}
//                     {replyTo.content.length > 40 ? "..." : ""}"
//                   </Typography>
//                   <IconButton size="small" onClick={cancelReply} sx={{ color: colors.secondary }}>
//                     <XIcon size={16} />
//                   </IconButton>
//                 </Box>
//               </Fade>
//             )}

//             <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: colors.secondary }}>
//               {replyTo ? "Write your reply" : "Add your comment"}
//             </Typography>

//             <Box sx={{ display: "flex", gap: 2 }}>
//               <TextField
//                 placeholder="Share your thoughts..."
//                 variant="outlined"
//                 fullWidth
//                 multiline
//                 rows={3}
//                 value={newFeedback}
//                 onChange={(e) => setNewFeedback(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: 2,
//                     bgcolor: "white",
//                     "&:hover .MuiOutlinedInput-notchedOutline": {
//                       borderColor: alpha(colors.primary, 0.5),
//                     },
//                     "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                       borderColor: colors.primary,
//                     },
//                   },
//                 }}
//               />

//               <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//                 <Tooltip title="Add emoji">
//                   <IconButton
//                     onClick={handleOpenEmojiPicker}
//                     sx={{
//                       bgcolor: alpha(colors.light, 0.7),
//                       color: colors.secondary,
//                       "&:hover": {
//                         bgcolor: alpha(colors.light, 1),
//                       },
//                       width: 40,
//                       height: 40,
//                     }}
//                   >
//                     <SmileIcon size={20} />
//                   </IconButton>
//                 </Tooltip>

//                 <Tooltip title="Send comment">
//                   <span>
//                     <IconButton
//                       onClick={() => handleSendFeedback(newFeedback)}
//                       disabled={!newFeedback.trim() || isSubmitting}
//                       sx={{
//                         bgcolor: colors.primary,
//                         color: "white",
//                         "&:hover": {
//                           bgcolor: alpha(colors.primary, 0.9),
//                         },
//                         "&.Mui-disabled": {
//                           bgcolor: alpha(colors.secondary, 0.1),
//                           color: alpha(colors.secondary, 0.3),
//                         },
//                         width: 40,
//                         height: 40,
//                       }}
//                     >
//                       {isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon size={20} />}
//                     </IconButton>
//                   </span>
//                 </Tooltip>
//               </Box>

//               <Popover
//                 open={Boolean(anchorEl)}
//                 anchorEl={anchorEl}
//                 onClose={handleCloseEmojiPicker}
//                 anchorOrigin={{
//                   vertical: "bottom",
//                   horizontal: "right",
//                 }}
//                 transformOrigin={{
//                   vertical: "top",
//                   horizontal: "right",
//                 }}
//                 sx={{
//                   "& .MuiPopover-paper": {
//                     borderRadius: 2,
//                     boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
//                   },
//                 }}
//               >
//                 <EmojiPicker onEmojiClick={handleEmojiClick} />
//               </Popover>
//             </Box>
//           </Box>
//         </Box>
//       </CardContent>

//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={4000}
//         onClose={() => setSnackbarOpen(false)}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert
//           onClose={() => setSnackbarOpen(false)}
//           severity="success"
//           sx={{
//             width: "100%",
//             borderRadius: 2,
//             "& .MuiAlert-icon": {
//               color: colors.primary,
//             },
//           }}
//         >
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </Card>
//   )
// }

// export default FeedbackSection
"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  Typography,
  List,
  TextField,
  Box,
  IconButton,
  Tooltip,
  Popover,
  Avatar,
  Button,
  Fade,
  Snackbar,
  Alert,
  alpha,
  CircularProgress,
  Chip,
} from "@mui/material"
import {
  ReplyIcon,
  SmileIcon,
  SendIcon,
  XIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UserIcon,
  HeartIcon,
  MessageCircleIcon,
  MoreHorizontalIcon,
} from "lucide-react"
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../redux/Store"
import { AddFeedback } from "../redux/FeedbacksSlice"
import { getQuestions } from "../redux/QuestionsSlice"
import { updateUser } from "../redux/UserSlice"
import { motion, AnimatePresence } from "framer-motion"
import { sendEmail } from "../services/Email"
import axios from "axios"
import { colors } from "./them"

export interface Feedback {
  id?: number
  content: string
  questionId: number
  userName: string
  userEmail: string
  parentFeedbackId?: number
  createAt?: Date
}

interface FeedbackSectionProps {
  feedbacks: Feedback[]
  questionId: number
  questionUserName: string
  questionUserEmail: string
  questionTitle: string
  questionUserId: number
}

const FeedbackSection = ({
  feedbacks,
  questionId,
  questionUserName,
  questionUserEmail,
  questionTitle,
  questionUserId,
}: FeedbackSectionProps) => {
  const [newFeedback, setNewFeedback] = useState("")
  const [localFeedbacks, setLocalFeedbacks] = useState<Feedback[]>(feedbacks)
  const [replyTo, setReplyTo] = useState<Feedback | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showAllComments, setShowAllComments] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set())
  const feedbackEndRef = useRef<HTMLDivElement>(null)

  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.User.user)
  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    if (replyTo && feedbackEndRef.current) {
      feedbackEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [replyTo])

  useEffect(() => {
    setLocalFeedbacks(feedbacks)
  }, [feedbacks])

  const handleSendFeedback = async (content: string) => {
    if (!content.trim()) return

    if (!user) {
      setSnackbarMessage("Please sign in to add feedback")
      setSnackbarOpen(true)
      return
    }

    setIsSubmitting(true)

    const newFeedbackObject: Feedback = {
      content: replyTo
        ? `Replying to: "${replyTo.content.substring(0, 30)}${replyTo.content.length > 30 ? "..." : ""}"
${content}`
        : content,
      questionId,
      userName: user?.userName || "Anonymous",
      userEmail: user?.email || "",
      parentFeedbackId: replyTo?.id,
    }

    try {
      const resultAction = await dispatch(AddFeedback(newFeedbackObject))
      await dispatch(getQuestions())

      if (AddFeedback.fulfilled.match(resultAction)) {
        setLocalFeedbacks((prev) => [...prev, { ...newFeedbackObject, id: resultAction.payload.id }])

        const response = await axios.get(`${apiUrl}User/send/${questionUserId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })

        const questionUser = response.data

        if (questionUser.sendFeedback) {
          await sendEmail({
            to: questionUserEmail,
            subject: "New Feedback on Your Question",
            body: `
              <div style="font-family: 'Inter', sans-serif; line-height: 1.8; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                <div style="background-color: ${colors.primary}; color: white; padding: 24px; text-align: center;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 600;">New Feedback Received!</h1>
                </div>
                <div style="padding: 24px;">
                  <p>Hi <strong>${questionUserName}</strong>,</p>
                  <p>Someone has left feedback on your question:</p>
                  <div style="border: 1px solid #eee; padding: 16px; border-radius: 8px; background-color: #f9f9f9; margin-bottom: 20px;">
                    <p style="margin: 0;"><strong>Question:</strong> ${questionTitle}</p>
                    <blockquote style="margin: 16px 0; padding: 16px; border-left: 4px solid ${colors.primary}; background-color: #f5f5f5; font-style: italic;">
                      ${content}
                    </blockquote>
                  </div>
                  <p><strong>From:</strong> ${user?.userName || "Anonymous"}</p>
                  <p><strong>Email:</strong> ${user?.email || "No email provided"}</p>
                  <div style="text-align: center; margin: 32px 0;">
                  </div>
                  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                  <p style="font-size: 0.9em; color: #777; text-align: center;">Thank you for using our platform!<br />The Feedback Platform Team</p>
                </div>
              </div>
            `,
          })
        }

        if (user) {
          const updatedUser = { ...user, points: (user.points || 0) + 1 }
          await dispatch(updateUser(updatedUser))
          setSnackbarMessage("Feedback added! You earned 1 point.")
          setSnackbarOpen(true)
        }
      }
    } catch (error) {
      console.error("Error adding feedback:", error)
      setSnackbarMessage("Failed to add feedback. Please try again.")
      setSnackbarOpen(true)
    } finally {
      setNewFeedback("")
      setReplyTo(null)
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      await handleSendFeedback(newFeedback)
    }
  }

  const handleReply = (feedback: Feedback) => {
    setReplyTo(feedback)
    setNewFeedback("")
  }

  const handleOpenEmojiPicker = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseEmojiPicker = () => {
    setAnchorEl(null)
  }

  const handleEmojiClick = async (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji
    await handleSendFeedback(emoji)
    handleCloseEmojiPicker()
  }

  const cancelReply = () => {
    setReplyTo(null)
  }

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    setSnackbarMessage(`Email copied: ${email}`)
    setSnackbarOpen(true)
  }

  const toggleShowAllComments = () => {
    setShowAllComments(!showAllComments)
  }

  const handleLikeComment = (feedbackId: number) => {
    setLikedComments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(feedbackId)) {
        newSet.delete(feedbackId)
      } else {
        newSet.add(feedbackId)
      }
      return newSet
    })
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  const mainFeedbacks = localFeedbacks.filter((feedback) => !feedback.parentFeedbackId)
  const displayedFeedbacks = showAllComments ? mainFeedbacks : mainFeedbacks.slice(0, Math.min(3, mainFeedbacks.length))

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", py: 0 }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: alpha("#ffffff", 0.95),
          borderBottom: "1px solid #e0e0e0",
          px: 3,
          py: 2,
          position: "sticky",
          top: 0,
          zIndex: 10,
          backdropFilter: "blur(10px)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <MessageCircleIcon size={24} color={colors.primary} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: colors.secondary, fontSize: "1.1rem" }}>
              Comments
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem" }}>
              {localFeedbacks.length} {localFeedbacks.length === 1 ? "comment" : "comments"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Comments List */}
      <Box sx={{ px: 0 }}>
        {Array.isArray(localFeedbacks) && localFeedbacks.length > 0 ? (
          <List sx={{ p: 0 }}>
            <AnimatePresence>
              {displayedFeedbacks.map((feedback, index) => (
                <motion.div
                  key={feedback.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Box
                    sx={{
                      bgcolor: "#ffffff",
                      borderBottom: "1px solid #f0f0f0",
                      "&:hover": {
                        bgcolor: alpha(colors.primary, 0.02),
                      },
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    {/* Main Comment */}
                    <Box sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        {/* Avatar */}
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: colors.primary,
                            fontSize: "1rem",
                            fontWeight: 600,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        >
                          {feedback.userName?.charAt(0).toUpperCase() || <UserIcon size={18} />}
                        </Avatar>

                        {/* Comment Content */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          {/* Header */}
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <Tooltip
                              title={feedback.userEmail ? `Click to copy: ${feedback.userEmail}` : "No email available"}
                              arrow
                              placement="top"
                            >
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 700,
                                  cursor: feedback.userEmail ? "pointer" : "default",
                                  color: colors.secondary,
                                  fontSize: "0.95rem",
                                  "&:hover": {
                                    color: colors.primary,
                                    textDecoration: "underline",
                                  },
                                  transition: "color 0.2s ease",
                                }}
                                onClick={() => feedback.userEmail && handleCopyEmail(feedback.userEmail)}
                              >
                                {feedback.userName || "Anonymous"}
                              </Typography>
                            </Tooltip>

                            {feedback.userName === questionUserName && (
                              <Chip
                                label="Author"
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: "0.7rem",
                                  bgcolor: colors.primary,
                                  color: "#ffffff",
                                  fontWeight: 600,
                                }}
                              />
                            )}

                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
                              {feedback.createAt ? getTimeAgo(new Date(feedback.createAt)) : "now"}
                            </Typography>
                          </Box>

                          {/* Comment Text */}
                          <Typography
                            variant="body2"
                            sx={{
                              whiteSpace: "pre-wrap",
                              color: colors.secondary,
                              lineHeight: 1.5,
                              fontSize: "0.95rem",
                              mb: 2,
                            }}
                          >
                            {feedback.content}
                          </Typography>

                          {/* Action Buttons */}
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Button
                              size="small"
                              startIcon={
                                <HeartIcon
                                  size={16}
                                  fill={likedComments.has(feedback.id || 0) ? colors.primary : "none"}
                                  color={likedComments.has(feedback.id || 0) ? colors.primary : "#666"}
                                />
                              }
                              onClick={() => handleLikeComment(feedback.id || 0)}
                              sx={{
                                color: likedComments.has(feedback.id || 0) ? colors.primary : "#666",
                                textTransform: "none",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                minWidth: "auto",
                                px: 1,
                                py: 0.5,
                                borderRadius: 2,
                                "&:hover": {
                                  bgcolor: alpha(colors.primary, 0.1),
                                  color: colors.primary,
                                },
                              }}
                            >
                              Like
                            </Button>

                            <Button
                              size="small"
                              startIcon={<ReplyIcon size={16} />}
                              onClick={() => handleReply(feedback)}
                              sx={{
                                color: "#666",
                                textTransform: "none",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                minWidth: "auto",
                                px: 1,
                                py: 0.5,
                                borderRadius: 2,
                                "&:hover": {
                                  bgcolor: alpha(colors.primary, 0.1),
                                  color: colors.primary,
                                },
                              }}
                            >
                              Reply
                            </Button>

                            <IconButton
                              size="small"
                              sx={{
                                color: "#666",
                                ml: "auto",
                                "&:hover": {
                                  bgcolor: alpha(colors.primary, 0.1),
                                  color: colors.primary,
                                },
                              }}
                            >
                              <MoreHorizontalIcon size={16} />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>

                      {/* Replies */}
                      {localFeedbacks
                        .filter((reply) => reply.parentFeedbackId === feedback.id)
                        .map((reply, replyIndex) => (
                          <Box
                            key={replyIndex}
                            sx={{
                              ml: 6,
                              mt: 3,
                              pl: 3,
                              borderLeft: `2px solid ${alpha(colors.primary, 0.2)}`,
                            }}
                          >
                            <Box sx={{ display: "flex", gap: 2 }}>
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: alpha(colors.primary, 0.8),
                                  fontSize: "0.8rem",
                                  fontWeight: 600,
                                }}
                              >
                                {reply.userName?.charAt(0).toUpperCase() || <UserIcon size={14} />}
                              </Avatar>

                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{ fontWeight: 700, color: colors.secondary, fontSize: "0.9rem" }}
                                  >
                                    {reply.userName || "Anonymous"}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                                    {reply.createAt ? getTimeAgo(new Date(reply.createAt)) : "now"}
                                  </Typography>
                                </Box>

                                <Typography
                                  variant="body2"
                                  sx={{
                                    whiteSpace: "pre-wrap",
                                    color: colors.secondary,
                                    lineHeight: 1.5,
                                    fontSize: "0.9rem",
                                    mb: 1,
                                  }}
                                >
                                  {reply.content}
                                </Typography>

                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Button
                                    size="small"
                                    startIcon={<HeartIcon size={14} />}
                                    sx={{
                                      color: "#666",
                                      textTransform: "none",
                                      fontSize: "0.75rem",
                                      fontWeight: 600,
                                      minWidth: "auto",
                                      px: 1,
                                      py: 0.5,
                                      borderRadius: 2,
                                      "&:hover": {
                                        bgcolor: alpha(colors.primary, 0.1),
                                        color: colors.primary,
                                      },
                                    }}
                                  >
                                    Like
                                  </Button>
                                  <Button
                                    size="small"
                                    startIcon={<ReplyIcon size={14} />}
                                    sx={{
                                      color: "#666",
                                      textTransform: "none",
                                      fontSize: "0.75rem",
                                      fontWeight: 600,
                                      minWidth: "auto",
                                      px: 1,
                                      py: 0.5,
                                      borderRadius: 2,
                                      "&:hover": {
                                        bgcolor: alpha(colors.primary, 0.1),
                                        color: colors.primary,
                                      },
                                    }}
                                  >
                                    Reply
                                  </Button>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>
          </List>
        ) : (
          <Box
            sx={{
              py: 8,
              textAlign: "center",
              bgcolor: "#ffffff",
              mx: 3,
              my: 2,
              borderRadius: 3,
              border: `1px solid ${alpha(colors.secondary, 0.1)}`,
            }}
          >
            <MessageCircleIcon size={48} style={{ color: alpha(colors.secondary, 0.3), marginBottom: 16 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: colors.secondary, mb: 1 }}>
              No comments yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Be the first to share your thoughts on this question
            </Typography>
          </Box>
        )}

        {mainFeedbacks.length > 3 && (
          <Box sx={{ textAlign: "center", py: 3, bgcolor: "#ffffff", borderBottom: "1px solid #f0f0f0" }}>
            <Button
              variant="text"
              onClick={toggleShowAllComments}
              endIcon={showAllComments ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
              sx={{
                color: colors.primary,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
                "&:hover": {
                  bgcolor: alpha(colors.primary, 0.1),
                },
              }}
            >
              {showAllComments ? "Show fewer comments" : `View ${mainFeedbacks.length - 3} more comments`}
            </Button>
          </Box>
        )}
      </Box>

      {/* Comment Input */}
      <Box
        sx={{
          bgcolor: "#ffffff",
          borderTop: "1px solid #e0e0e0",
          p: 3,
          position: "sticky",
          bottom: 0,
          zIndex: 10,
        }}
      >
        <Box ref={feedbackEndRef}>
          {replyTo && (
            <Fade in={!!replyTo}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(colors.primary, 0.05),
                  border: `1px solid ${alpha(colors.primary, 0.2)}`,
                }}
              >
                <Typography variant="body2" sx={{ flex: 1, color: colors.secondary, fontSize: "0.9rem" }}>
                  <strong>Replying to {replyTo.userName}:</strong> "{replyTo.content.substring(0, 50)}
                  {replyTo.content.length > 50 ? "..." : ""}"
                </Typography>
                <IconButton size="small" onClick={cancelReply} sx={{ color: colors.secondary }}>
                  <XIcon size={16} />
                </IconButton>
              </Box>
            </Fade>
          )}

          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: colors.primary,
                fontSize: "0.9rem",
                fontWeight: 600,
                mb: 1,
              }}
            >
              {user?.userName?.charAt(0).toUpperCase() || <UserIcon size={16} />}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <TextField
                placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
                variant="outlined"
                fullWidth
                multiline
                maxRows={4}
                value={newFeedback}
                onChange={(e) => setNewFeedback(e.target.value)}
                onKeyDown={handleKeyDown}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: alpha(colors.light, 0.3),
                    border: "none",
                    "& fieldset": {
                      border: "none",
                    },
                    "&:hover fieldset": {
                      border: "none",
                    },
                    "&.Mui-focused fieldset": {
                      border: `2px solid ${colors.primary}`,
                    },
                    fontSize: "0.95rem",
                  },
                  "& .MuiInputBase-input": {
                    py: 1.5,
                  },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
              <Tooltip title="Add emoji">
                <IconButton
                  onClick={handleOpenEmojiPicker}
                  sx={{
                    color: "#666",
                    "&:hover": {
                      bgcolor: alpha(colors.primary, 0.1),
                      color: colors.primary,
                    },
                  }}
                >
                  <SmileIcon size={20} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Post comment">
                <span>
                  <IconButton
                    onClick={() => handleSendFeedback(newFeedback)}
                    disabled={!newFeedback.trim() || isSubmitting}
                    sx={{
                      bgcolor: newFeedback.trim() ? colors.primary : alpha(colors.secondary, 0.1),
                      color: newFeedback.trim() ? "#ffffff" : alpha(colors.secondary, 0.4),
                      "&:hover": {
                        bgcolor: newFeedback.trim() ? alpha(colors.primary, 0.9) : alpha(colors.secondary, 0.15),
                      },
                      "&.Mui-disabled": {
                        bgcolor: alpha(colors.secondary, 0.1),
                        color: alpha(colors.secondary, 0.3),
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon size={20} />}
                  </IconButton>
                </span>
              </Tooltip>
            </Box>

            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleCloseEmojiPicker}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              sx={{
                "& .MuiPopover-paper": {
                  borderRadius: 3,
                  boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                  border: `1px solid ${alpha(colors.secondary, 0.1)}`,
                },
              }}
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </Popover>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{
            width: "100%",
            borderRadius: 3,
            "& .MuiAlert-icon": {
              color: colors.primary,
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default FeedbackSection
