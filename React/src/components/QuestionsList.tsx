
// import { useState, useEffect } from "react"
// import {
//   Typography,
//   Container,
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Avatar,
//   Chip,
//   IconButton,
//   Button,
//   Divider,
//   Dialog,
//   DialogContent,
//   CircularProgress,
//   Tooltip,
//   Drawer,
//   Paper,
//   FormGroup,
//   FormControlLabel,
//   Checkbox,
//   alpha,
//   useMediaQuery,
//   useTheme,
//   TextField,
//   DialogActions,
//   ImageList,
//   ImageListItem,
// } from "@mui/material"
// import {
//   ThumbsUpIcon as ThumbUpIcon,
//   ThumbsUpIcon as ThumbUpOffIcon,
//   ShareIcon,
//   DownloadIcon,
//   ReplyIcon as CommentIcon,
//   CalendarIcon,
//   UserIcon,
//   ArrowLeftIcon,
//   ImageIcon as ImageIconLucide,
//   MusicIcon,
//   FilterIcon,
//   XIcon,
//   SearchIcon,
// } from "lucide-react"
// import { motion } from "framer-motion"
// import { useDispatch, useSelector } from "react-redux"
// import type { AppDispatch, RootState } from "../redux/Store"
// import { getQuestions, updateUseQuestion } from "../redux/QuestionsSlice"
// import ShowFile from "./ShowFile"
// import FeedbackSection from "./FeedbackSection"
// import { sendEmail } from "../services/Email"
// import jsPDF from "jspdf"
// import { colors } from "./them"

// // New elegant color palette
// // const colors = {
// //   primary: "#E07A5F", // Terracotta
// //   secondary: "#3D405B", // Dark slate blue
// //   light: "#F4F1DE", // Cream
// //   accent: "#81B29A", // Sage green
// //   dark: "#2D3142", // Dark blue-gray
// // }

// export interface Question {
//   id: number
//   title: string
//   content: string
//   images: Image[]
//   feedbacks: Feedback[]
//   userName: string
//   userEmail: string
//   createAt?: Date
//   usersUse?: number
//   userId: number
// }

// export interface Image {
//   id: number
//   imageUrl: string
//   questionId: number
//   name: string
// }

// export interface Feedback {
//   id: number
//   content: string
//   questionId: number
//   userId: number
//   userName: string
//   userEmail: string
//   createAt: Date
// }

// const QuestionsList = () => {
//   const [questions, setQuestions] = useState<Question[]>([])
//   const [loading, setLoading] = useState(true)
//   const [openFeedbackId, setOpenFeedbackId] = useState<number | null>(null)
//   const [/*snackbarOpen*/, setSnackbarOpen] = useState(false)
//   const [/*snackbarMessage*/, setSnackbarMessage] = useState("")
//   // const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null)
//   const [usedQuestions, setUsedQuestions] = useState<number[]>([])
//   const [sortOption, setSortOption] = useState<"recent" | "popular">("recent")
//   const [filterOpen, setFilterOpen] = useState(false)
//   const [shareDialogOpen, setShareDialogOpen] = useState(false)
//   const [shareEmail, setShareEmail] = useState("")
//   const [selectedQuestionForShare, setSelectedQuestionForShare] = useState<Question | null>(null)
//   const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
//   const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
//   const [searchQuery, setSearchQuery] = useState("")

//   // Filter options
//   const [showWithImages, setShowWithImages] = useState(false)
//   const [showWithSongs, setShowWithSongs] = useState(false)

//   const theme = useTheme()
//   // const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
//   const isTablet = useMediaQuery(theme.breakpoints.down("md"))
//   const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"))

//   const q = useSelector((state: RootState) => state.Questions.questions)
//   // const u = useSelector((state: RootState) => state.User.user)

//   const dispatch: AppDispatch = useDispatch()

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       await dispatch(getQuestions())
//       setLoading(false)
//     }
//     fetchQuestions()
//   }, [dispatch])

//   useEffect(() => {
//     setQuestions(q || [])
//   }, [q])

//   useEffect(() => {
//     // Load used questions from localStorage
//     const storedUsedQuestions = JSON.parse(localStorage.getItem("usedQuestions") || "[]")
//     setUsedQuestions(storedUsedQuestions)
//   }, [])

//   const toggleFeedbacks = (questionId: number) => {
//     setOpenFeedbackId((prev) => (prev === questionId ? null : questionId))
//   }

//   const handleCopyEmail = (email: string) => {
//     navigator.clipboard.writeText(email)
//     setSnackbarMessage(`Email copied: ${email}`)
//     setSnackbarOpen(true)
//   }

//   // const handleSnackbarClose = () => {
//   //   setSnackbarOpen(false)
//   // }

//   const handleUseQuestion = (questionId: number) => {
//     if (usedQuestions.includes(questionId)) {
//       console.log("This question is already marked as used.")
//       return
//     }

//     setQuestions((prevQuestions) =>
//       prevQuestions.map((q) => (q.id === questionId ? { ...q, usersUse: (q.usersUse || 0) + 1 } : q)),
//     )

//     const updatedUsedQuestions = [...usedQuestions, questionId]
//     setUsedQuestions(updatedUsedQuestions)
//     localStorage.setItem("usedQuestions", JSON.stringify(updatedUsedQuestions))

//     dispatch(updateUseQuestion(questionId))
//       .unwrap()
//       .then((response) => {
//         console.log("Update successful:", response)
//       })
//       .catch((error) => {
//         console.error("Update failed:", error)
//       })
//   }

//   const handleOpenShareDialog = (question: Question) => {
//     setSelectedQuestionForShare(question)
//     setShareDialogOpen(true)
//   }

//   const handleCloseShareDialog = () => {
//     setShareDialogOpen(false)
//     setShareEmail("")
//     setSelectedQuestionForShare(null)
//   }

//   const handleSendShareEmail = async () => {
//     if (!shareEmail || !selectedQuestionForShare) {
//       setSnackbarMessage("Please enter a valid email.")
//       setSnackbarOpen(true)
//       return
//     }

//     try {
//       const shareUrl = `${window.location.origin}/All`
//       await sendEmail({
//         to: shareEmail,
//         subject: "Check out this question on Feedback Platform!",
//         body: `
//           <div style="font-family: 'Inter', sans-serif; line-height: 1.6; color: #333;">
//             <h2>Hi there,</h2>
//             <p>Someone shared a question with you on <strong>Feedback Platform</strong>. Here are the details:</p>
//             <p><strong>Title:</strong> ${selectedQuestionForShare.title}</p>
//             <p>Click the link below to view the question:</p>
//             <a href="${shareUrl}" style="color: ${colors.primary}; text-decoration: none; font-weight: 500;">${shareUrl}</a>
//           </div>
//         `,
//       })

//       setSnackbarMessage("Email sent successfully!")
//       setSnackbarOpen(true)
//       handleCloseShareDialog()
//     } catch (error) {
//       console.error("Failed to send email:", error)
//       setSnackbarMessage("Failed to send email. Please try again.")
//       setSnackbarOpen(true)
//     }
//   }

//   const handleDownloadQuestion = async (questionId: number) => {
//     const question = questions.find((q) => q.id === questionId)
//     if (!question) return

//     const doc = new jsPDF()

//     // Question title
//     doc.setFontSize(16)
//     doc.text("Question Details", 10, 10)

//     // Question details
//     doc.setFontSize(12)
//     doc.text(`Title: ${question.title}`, 10, 20)
//     doc.text(`Content: ${question.content}`, 10, 30)
//     doc.text(`By: ${question.userName || "Unknown"}`, 10, 40)
//     doc.text(`Email: ${question.userEmail || "N/A"}`, 10, 50)

//     doc.save(`${question.title.replace(/\s+/g, "_")}_question.pdf`)
//   }

//   const handleOpenPreview = (question: Question) => {
//     setSelectedQuestion(question)
//     setPreviewDialogOpen(true)
//   }

//   const handleClosePreview = () => {
//     setPreviewDialogOpen(false)
//     setSelectedQuestion(null)
//   }

//   const toggleFilter = () => {
//     setFilterOpen(!filterOpen)
//   }

//   const resetFilters = () => {
//     setShowWithImages(false)
//     setShowWithSongs(false)
//     setSortOption("recent")
//     setSearchQuery("")
//   }

//   // Filter and sort questions
//   const filteredQuestions = (questions || [])
//     .filter((question) => {
//       // Search filter
//       if (searchQuery) {
//         const query = searchQuery.toLowerCase()
//         return (
//           question.title.toLowerCase().includes(query) ||
//           question.content.toLowerCase().includes(query) ||
//           question.userName.toLowerCase().includes(query)
//         )
//       }

//       // Media type filters
//       if (showWithImages && !showWithSongs) {
//         return question.images?.some((image) => /\.(jpg|jpeg|png|gif)$/i.test(image.name))
//       }

//       if (showWithSongs && !showWithImages) {
//         return question.images?.some((image) => /\.(mp3|wav|ogg)$/i.test(image.name))
//       }

//       if (showWithImages && showWithSongs) {
//         return question.images?.some((image) => /\.(jpg|jpeg|png|gif|mp3|wav|ogg)$/i.test(image.name))
//       }

//       return true
//     })
//     .sort((a, b) => {
//       if (sortOption === "popular") {
//         return (b.usersUse || 0) - (a.usersUse || 0)
//       } else {
//         // Recent sorting (default)
//         return new Date(b.createAt || "").getTime() - new Date(a.createAt || "").getTime()
//       }
//     })

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
//         <CircularProgress size={60} thickness={4} sx={{ color: colors.primary }} />
//       </Box>
//     )
//   }

//   return (
//     <Container maxWidth="xl">
//       <Box sx={{ mb: 5 }}>
//         <Typography
//           variant="h4"
//           component="h1"
//           sx={{
//             fontWeight: 700,
//             color: colors.secondary,
//             mb: 2,
//           }}
//         >
//           Community Questions
//         </Typography>
//         <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700 }}>
//           Explore questions from our community, filter by your preferences, and contribute your insights.
//         </Typography>
//       </Box>

//       {/* Search and Filter Bar */}
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: { xs: "column", sm: "row" },
//           justifyContent: "space-between",
//           alignItems: { xs: "stretch", sm: "center" },
//           gap: 2,
//           mb: 4,
//           p: 3,
//           borderRadius: 2,
//           bgcolor: alpha(colors.light, 0.5),
//           border: `1px solid ${alpha(colors.secondary, 0.1)}`,
//         }}
//       >
//         <Box sx={{ position: "relative", flexGrow: 1 }}>
//           <SearchIcon
//             size={18}
//             style={{
//               position: "absolute",
//               left: 12,
//               top: "50%",
//               transform: "translateY(-50%)",
//               color: alpha(colors.secondary, 0.6),
//             }}
//           />
//           <TextField
//             placeholder="Search questions..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             variant="outlined"
//             fullWidth
//             size="small"
//             sx={{
//               "& .MuiOutlinedInput-root": {
//                 pl: 4,
//                 borderRadius: 2,
//                 bgcolor: "white",
//                 "& fieldset": {
//                   borderColor: alpha(colors.secondary, 0.2),
//                 },
//                 "&:hover fieldset": {
//                   borderColor: alpha(colors.secondary, 0.3),
//                 },
//                 "&.Mui-focused fieldset": {
//                   borderColor: colors.primary,
//                 },
//               },
//             }}
//           />
//         </Box>

//         <Box sx={{ display: "flex", gap: 2 }}>
//           <Button
//             variant={sortOption === "recent" ? "contained" : "outlined"}
//             onClick={() => setSortOption("recent")}
//             sx={{
//               borderRadius: 2,
//               px: 3,
//               bgcolor: sortOption === "recent" ? colors.primary : "transparent",
//               borderColor: sortOption === "recent" ? colors.primary : alpha(colors.secondary, 0.3),
//               color: sortOption === "recent" ? "white" : colors.secondary,
//               "&:hover": {
//                 bgcolor: sortOption === "recent" ? alpha(colors.primary, 0.9) : alpha(colors.secondary, 0.05),
//                 borderColor: sortOption === "recent" ? colors.primary : colors.secondary,
//               },
//               textTransform: "none",
//               fontWeight: 500,
//             }}
//           >
//             Recent
//           </Button>

//           <Button
//             variant={sortOption === "popular" ? "contained" : "outlined"}
//             onClick={() => setSortOption("popular")}
//             sx={{
//               borderRadius: 2,
//               px: 3,
//               bgcolor: sortOption === "popular" ? colors.primary : "transparent",
//               borderColor: sortOption === "popular" ? colors.primary : alpha(colors.secondary, 0.3),
//               color: sortOption === "popular" ? "white" : colors.secondary,
//               "&:hover": {
//                 bgcolor: sortOption === "popular" ? alpha(colors.primary, 0.9) : alpha(colors.secondary, 0.05),
//                 borderColor: sortOption === "popular" ? colors.primary : colors.secondary,
//               },
//               textTransform: "none",
//               fontWeight: 500,
//             }}
//           >
//             Popular
//           </Button>

//           <Button
//             variant="outlined"
//             onClick={toggleFilter}
//             startIcon={<FilterIcon size={18} />}
//             sx={{
//               borderRadius: 2,
//               borderColor: alpha(colors.secondary, 0.3),
//               color: colors.secondary,
//               "&:hover": {
//                 bgcolor: alpha(colors.secondary, 0.05),
//                 borderColor: colors.secondary,
//               },
//               textTransform: "none",
//               fontWeight: 500,
//             }}
//           >
//             Filter
//           </Button>
//         </Box>
//       </Box>

//       {/* Filter Drawer */}
//       <Drawer
//         anchor="right"
//         open={filterOpen}
//         onClose={toggleFilter}
//         PaperProps={{
//           sx: {
//             width: { xs: "100%", sm: 350 },
//             p: 3,
//           },
//         }}
//       >
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//           <Typography variant="h6" sx={{ fontWeight: 600, color: colors.secondary }}>
//             Filter Questions
//           </Typography>
//           <IconButton onClick={toggleFilter}>
//             <XIcon size={20} />
//           </IconButton>
//         </Box>

//         <Divider sx={{ mb: 3 }} />

//         <Typography variant="subtitle2" sx={{ mb: 2, color: colors.secondary, fontWeight: 600 }}>
//           Media Type
//         </Typography>

//         <FormGroup sx={{ mb: 4 }}>
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={showWithImages}
//                 onChange={(e) => setShowWithImages(e.target.checked)}
//                 sx={{
//                   color: colors.primary,
//                   "&.Mui-checked": {
//                     color: colors.primary,
//                   },
//                 }}
//               />
//             }
//             label={
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 <ImageIconLucide size={18} />
//                 <Typography>With Images</Typography>
//               </Box>
//             }
//           />

//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={showWithSongs}
//                 onChange={(e) => setShowWithSongs(e.target.checked)}
//                 sx={{
//                   color: colors.primary,
//                   "&.Mui-checked": {
//                     color: colors.primary,
//                   },
//                 }}
//               />
//             }
//             label={
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 <MusicIcon size={18} />
//                 <Typography>With Songs</Typography>
//               </Box>
//             }
//           />
//         </FormGroup>

//         <Box sx={{ display: "flex", gap: 2, mt: "auto" }}>
//           <Button
//             variant="outlined"
//             fullWidth
//             onClick={resetFilters}
//             sx={{
//               borderRadius: 2,
//               py: 1.2,
//               borderColor: alpha(colors.secondary, 0.3),
//               color: colors.secondary,
//               "&:hover": {
//                 bgcolor: alpha(colors.secondary, 0.05),
//                 borderColor: colors.secondary,
//               },
//               textTransform: "none",
//               fontWeight: 500,
//             }}
//           >
//             Reset
//           </Button>

//           <Button
//             variant="contained"
//             fullWidth
//             onClick={toggleFilter}
//             sx={{
//               borderRadius: 2,
//               py: 1.2,
//               bgcolor: colors.primary,
//               "&:hover": {
//                 bgcolor: alpha(colors.primary, 0.9),
//               },
//               textTransform: "none",
//               fontWeight: 500,
//             }}
//           >
//             Apply
//           </Button>
//         </Box>
//       </Drawer>

//       {/* Questions Grid */}
//       <Grid container spacing={3}>
//         {filteredQuestions.length > 0 ? (
//           filteredQuestions.map((question) => (
//             <Grid item xs={12} md={6} lg={4} key={question.id}>
//               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
//                 <Card
//                   elevation={0}
//                   sx={{
//                     height: "100%",
//                     display: "flex",
//                     flexDirection: "column",
//                     borderRadius: 3,
//                     border: `1px solid ${alpha(colors.secondary, 0.1)}`,
//                     transition: "transform 0.2s, box-shadow 0.2s",
//                     "&:hover": {
//                       transform: "translateY(-4px)",
//                       boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
//                     },
//                     overflow: "hidden",
//                   }}
//                 >
//                   <CardContent sx={{ p: 3, flexGrow: 1 }}>
//                     <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                       <Avatar sx={{ bgcolor: colors.primary, mr: 1.5 }}>
//                         {question.userName?.charAt(0).toUpperCase() || <UserIcon size={18} />}
//                       </Avatar>
//                       <Box>
//                         <Tooltip
//                           title={question.userEmail ? `Click to copy: ${question.userEmail}` : "No email available"}
//                           arrow
//                           placement="top"
//                         >
//                           <Typography
//                             variant="subtitle1"
//                             sx={{
//                               fontWeight: 600,
//                               cursor: question.userEmail ? "pointer" : "default",
//                               color: colors.secondary,
//                             }}
//                             onClick={() => question.userEmail && handleCopyEmail(question.userEmail)}
//                           >
//                             {question.userName || "Unknown"}
//                           </Typography>
//                         </Tooltip>
//                         {question.createAt && (
//                           <Typography
//                             variant="caption"
//                             color="text.secondary"
//                             sx={{ display: "flex", alignItems: "center" }}
//                           >
//                             <CalendarIcon size={12} style={{ marginRight: 4 }} />
//                             {new Date(question.createAt).toLocaleDateString()}
//                           </Typography>
//                         )}
//                       </Box>
//                     </Box>

//                     <Typography
//                       variant="h6"
//                       gutterBottom
//                       sx={{
//                         fontWeight: 600,
//                         color: colors.secondary,
//                         display: "-webkit-box",
//                         WebkitLineClamp: 2,
//                         WebkitBoxOrient: "vertical",
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                       }}
//                     >
//                       {question.title}
//                     </Typography>

//                     <Typography
//                       variant="body2"
//                       color="text.secondary"
//                       sx={{
//                         mb: 2,
//                         display: "-webkit-box",
//                         WebkitLineClamp: 3,
//                         WebkitBoxOrient: "vertical",
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                         minHeight: "4.5em",
//                       }}
//                     >
//                       {question.content}
//                     </Typography>

//                     {/* Media preview */}
//                     {question.images.length > 0 && (
//                       <Box sx={{ mb: 2 }}>
//                         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
//                           <Typography variant="subtitle2" sx={{ fontWeight: 500, color: colors.secondary }}>
//                             Attachments ({question.images.length})
//                           </Typography>

//                           {question.images.length > 1 && (
//                             <Button
//                               size="small"
//                               onClick={() => handleOpenPreview(question)}
//                               sx={{
//                                 color: colors.primary,
//                                 textTransform: "none",
//                                 fontWeight: 500,
//                                 fontSize: "0.8rem",
//                               }}
//                             >
//                               View All
//                             </Button>
//                           )}
//                         </Box>

//                         <Box
//                           sx={{
//                             height: 140,
//                             borderRadius: 2,
//                             overflow: "hidden",
//                             bgcolor: alpha(colors.light, 0.5),
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             cursor: "pointer",
//                           }}
//                           onClick={() => handleOpenPreview(question)}
//                         >
//                           {question.images[0] && <ShowFile fileName={question.images[0].name} />}
//                         </Box>
//                       </Box>
//                     )}

//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
//                       <Typography variant="body2" color="text.secondary">
//                         {`Used by ${question.usersUse || 0} people`}
//                       </Typography>
//                     </Box>

//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
//                       <IconButton
//                         onClick={() => handleUseQuestion(question.id)}
//                         sx={{
//                           color: usedQuestions.includes(question.id) ? colors.primary : alpha(colors.secondary, 0.6),
//                           p: 1,
//                         }}
//                       >
//                         {usedQuestions.includes(question.id) ? <ThumbUpIcon size={20} /> : <ThumbUpOffIcon size={20} />}
//                       </IconButton>
//                       <Typography variant="body2" color="text.secondary">
//                         {usedQuestions.includes(question.id) ? "You used this question" : "Mark as used"}
//                       </Typography>
//                     </Box>

//                     <Divider sx={{ my: 2 }} />

//                     <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                       <Chip
//                         icon={<CommentIcon size={16} />}
//                         label={`${question.feedbacks.length} ${question.feedbacks.length === 1 ? "comment" : "comments"}`}
//                         size="small"
//                         sx={{
//                           bgcolor: alpha(colors.primary, 0.1),
//                           color: colors.primary,
//                           border: "none",
//                           "& .MuiChip-icon": {
//                             color: colors.primary,
//                           },
//                         }}
//                       />

//                       <Box sx={{ display: "flex", gap: 1 }}>
//                         <IconButton
//                           size="small"
//                           onClick={() => handleOpenShareDialog(question)}
//                           sx={{ color: alpha(colors.secondary, 0.7) }}
//                         >
//                           <ShareIcon size={18} />
//                         </IconButton>
//                         <IconButton
//                           size="small"
//                           onClick={() => handleDownloadQuestion(question.id)}
//                           sx={{ color: alpha(colors.secondary, 0.7) }}
//                         >
//                           <DownloadIcon size={18} />
//                         </IconButton>
//                       </Box>
//                     </Box>
//                   </CardContent>

//                   <Box sx={{ p: 3, pt: 0 }}>
//                     <Button
//                       variant="contained"
//                       fullWidth
//                       onClick={() => toggleFeedbacks(question.id)}
//                       sx={{
//                         borderRadius: 2,
//                         py: 1.2,
//                         bgcolor: colors.primary,
//                         "&:hover": {
//                           bgcolor: alpha(colors.primary, 0.9),
//                         },
//                         textTransform: "none",
//                         fontWeight: 500,
//                       }}
//                     >
//                       {openFeedbackId === question.id ? "Hide Comments" : "View Comments"}
//                     </Button>
//                   </Box>
//                 </Card>
//               </motion.div>
//             </Grid>
//           ))
//         ) : (
//           <Grid item xs={12}>
//             <Paper
//               elevation={0}
//               sx={{
//                 p: 4,
//                 textAlign: "center",
//                 borderRadius: 3,
//                 border: `1px solid ${alpha(colors.secondary, 0.1)}`,
//               }}
//             >
//               <Box sx={{ mb: 2 }}>
//                 <SearchIcon size={40} style={{ color: alpha(colors.secondary, 0.3) }} />
//               </Box>
//               <Typography variant="h6" sx={{ color: colors.secondary, fontWeight: 600 }}>
//                 No questions found
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 400, mx: "auto" }}>
//                 {searchQuery
//                   ? "No questions match your search criteria. Try adjusting your filters or search terms."
//                   : "Be the first to ask a question and start the conversation!"}
//               </Typography>

//               {searchQuery && (
//                 <Button
//                   variant="outlined"
//                   onClick={resetFilters}
//                   sx={{
//                     mt: 3,
//                     borderRadius: 2,
//                     borderColor: colors.primary,
//                     color: colors.primary,
//                     "&:hover": {
//                       borderColor: colors.primary,
//                       bgcolor: alpha(colors.primary, 0.05),
//                     },
//                     textTransform: "none",
//                     fontWeight: 500,
//                   }}
//                 >
//                   Clear Filters
//                 </Button>
//               )}
//             </Paper>
//           </Grid>
//         )}
//       </Grid>

//       {/* Feedback Drawer */}
//       <Drawer
//         anchor={isLargeScreen ? "right" : "bottom"}
//         open={openFeedbackId !== null}
//         onClose={() => setOpenFeedbackId(null)}
//         sx={{
//           "& .MuiDrawer-paper": {
//             width: isLargeScreen ? "40%" : "100%",
//             height: isLargeScreen ? "100%" : "80%",
//             borderRadius: isLargeScreen ? 0 : "16px 16px 0 0",
//           },
//         }}
//       >
//         {openFeedbackId && (
//           <>
//             <Box
//               sx={{
//                 p: 3,
//                 display: "flex",
//                 alignItems: "center",
//                 borderBottom: `1px solid ${alpha(colors.secondary, 0.1)}`,
//               }}
//             >
//               <IconButton edge="start" onClick={() => setOpenFeedbackId(null)} sx={{ mr: 2, color: colors.secondary }}>
//                 <ArrowLeftIcon size={20} />
//               </IconButton>
//               <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600, color: colors.secondary }}>
//                 {questions.find((q) => q.id === openFeedbackId)?.title || "Comments & Feedback"}
//               </Typography>
//               <Chip
//                 label={`${questions.find((q) => q.id === openFeedbackId)?.feedbacks.length || 0} comments`}
//                 size="small"
//                 sx={{
//                   bgcolor: alpha(colors.primary, 0.1),
//                   color: colors.primary,
//                   border: "none",
//                 }}
//               />
//             </Box>

//             <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
//               {questions.find((q) => q.id === openFeedbackId) && (
//                 <Box sx={{ mb: 3 }}>
//                   <Typography variant="body1" sx={{ fontWeight: 500, color: colors.secondary }}>
//                     {questions.find((q) => q.id === openFeedbackId)?.content}
//                   </Typography>
//                   <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
//                     <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: colors.primary }}>
//                       {questions
//                         .find((q) => q.id === openFeedbackId)
//                         ?.userName?.charAt(0)
//                         .toUpperCase() || "?"}
//                     </Avatar>
//                     <Typography variant="body2" color="text.secondary">
//                       {questions.find((q) => q.id === openFeedbackId)?.userName || "Unknown"}
//                     </Typography>
//                   </Box>
//                 </Box>
//               )}

//               <Divider sx={{ my: 3 }} />

//               <FeedbackSection
//                 feedbacks={questions.find((q) => q.id === openFeedbackId)?.feedbacks || []}
//                 questionId={openFeedbackId}
//                 questionUserName={questions.find((q) => q.id === openFeedbackId)?.userName || ""}
//                 questionUserEmail={questions.find((q) => q.id === openFeedbackId)?.userEmail || ""}
//                 questionTitle={questions.find((q) => q.id === openFeedbackId)?.title || ""}
//                 questionUserId={questions.find((q) => q.id === openFeedbackId)?.userId || 0}
//               />
//             </Box>
//           </>
//         )}
//       </Drawer>

//       {/* Share Dialog */}
//       <Dialog
//         open={shareDialogOpen}
//         onClose={handleCloseShareDialog}
//         PaperProps={{
//           sx: {
//             borderRadius: 3,
//             p: 1,
//           },
//         }}
//       >
//         <Box component="div" sx={{ p: 2 }}>
//           <Typography variant="h6" sx={{ color: colors.secondary, fontWeight: 600 }}>
//             Share Question
//           </Typography>
//         </Box>
//         <DialogContent>
//           <Typography variant="body2" sx={{ mb: 2 }}>
//             Enter the email address to share this question:
//           </Typography>
//           <TextField
//             fullWidth
//             label="Email Address"
//             value={shareEmail}
//             onChange={(e) => setShareEmail(e.target.value)}
//             margin="normal"
//             sx={{
//               "& .MuiOutlinedInput-root": {
//                 borderRadius: 2,
//                 "&:hover .MuiOutlinedInput-notchedOutline": {
//                   borderColor: alpha(colors.primary, 0.5),
//                 },
//                 "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                   borderColor: colors.primary,
//                 },
//               },
//               "& .MuiInputLabel-root.Mui-focused": {
//                 color: colors.primary,
//               },
//             }}
//           />
//         </DialogContent>
//         <DialogActions sx={{ p: 2, pt: 0 }}>
//           <Button
//             onClick={handleCloseShareDialog}
//             sx={{
//               color: colors.secondary,
//               textTransform: "none",
//               fontWeight: 500,
//             }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSendShareEmail}
//             variant="contained"
//             sx={{
//               bgcolor: colors.primary,
//               "&:hover": {
//                 bgcolor: alpha(colors.primary, 0.9),
//               },
//               textTransform: "none",
//               fontWeight: 500,
//               borderRadius: 2,
//             }}
//           >
//             Send
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Media Preview Dialog */}
//       <Dialog
//         open={previewDialogOpen}
//         onClose={handleClosePreview}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: 3,
//             overflow: "hidden",
//           },
//         }}
//       >
//         <Box
//           component="div"
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             borderBottom: `1px solid ${alpha(colors.secondary, 0.1)}`,
//             p: 3,
//           }}
//         >
//           <Typography component="div" sx={{ fontWeight: 600, color: colors.secondary }}>
//             All Attachments
//           </Typography>
//           <IconButton onClick={handleClosePreview}>
//             <XIcon size={20} />
//           </IconButton>
//         </Box>
//         <DialogContent sx={{ p: 3 }}>
//           {selectedQuestion && (
//             <ImageList cols={isTablet ? 2 : 3} gap={16}>
//               {selectedQuestion.images.map((image) => (
//                 <ImageListItem key={image.id}>
//                   <Box
//                     sx={{
//                       position: "relative",
//                       height: 200,
//                       borderRadius: 2,
//                       overflow: "hidden",
//                       bgcolor: alpha(colors.light, 0.5),
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <ShowFile fileName={image.name} />
//                   </Box>
//                 </ImageListItem>
//               ))}
//             </ImageList>
//           )}
//         </DialogContent>
//       </Dialog>
//     </Container>
//   )
// }

// export default QuestionsList


"use client"

import { useState, useEffect } from "react"
import {
  Typography,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Button,
  Divider,
  Dialog,
  DialogContent,
  CircularProgress,
  Tooltip,
  Drawer,
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
  alpha,
  useMediaQuery,
  useTheme,
  TextField,
  DialogActions,
  ImageList,
  ImageListItem,
  Alert,
} from "@mui/material"
import {
  ThumbsUpIcon as ThumbUpIcon,
  ThumbsUpIcon as ThumbUpOffIcon,
  ShareIcon,
  DownloadIcon,
  ReplyIcon as CommentIcon,
  CalendarIcon,
  UserIcon,
  ArrowLeftIcon,
  ImageIcon as ImageIconLucide,
  MusicIcon,
  FilterIcon,
  XIcon,
  SearchIcon,
  RefreshCwIcon,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../redux/Store"
import { getQuestions, updateUseQuestion } from "../redux/QuestionsSlice"
import ShowFile from "./ShowFile"
import FeedbackSection from "./FeedbackSection"
import { sendEmail } from "../services/Email"
import jsPDF from "jspdf"
import { colors } from "./them"
import ChatInterface from "./ChatInterface"

// Keep all existing interfaces
export interface Question {
  id: number
  title: string
  content: string
  images: Image[]
  feedbacks: Feedback[]
  userName: string
  userEmail: string
  createAt?: Date
  usersUse?: number
  userId: number
}

export interface Image {
  id: number
  imageUrl: string
  questionId: number
  name: string
}

export interface Feedback {
  id: number
  content: string
  questionId: number
  userId: number
  userName: string
  userEmail: string
  createAt: Date
}

const QuestionsListEnhanced = () => {
  // Keep all existing state
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [openFeedbackId, setOpenFeedbackId] = useState<number | null>(null)
  const [/*snackbarOpen*/, setSnackbarOpen] = useState(false)
  const [/*snackbarMessage*/, setSnackbarMessage] = useState("")
  const [usedQuestions, setUsedQuestions] = useState<number[]>([])
  const [sortOption, setSortOption] = useState<"recent" | "popular">("recent")
  const [filterOpen, setFilterOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [shareEmail, setShareEmail] = useState("")
  const [selectedQuestionForShare, setSelectedQuestionForShare] = useState<Question | null>(null)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showWithImages, setShowWithImages] = useState(false)
  const [showWithSongs, setShowWithSongs] = useState(false)

  // New state for chat functionality
  const [chatFilteredQuestionIds, setChatFilteredQuestionIds] = useState<number[]>([])
  const [isChatFiltering, setIsChatFiltering] = useState(false)
  const [showAllQuestions, setShowAllQuestions] = useState(true)
  const [isChatLoading, setIsChatLoading] = useState(false)

  const theme = useTheme()
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"))

  const q = useSelector((state: RootState) => state.Questions.questions)
  const dispatch: AppDispatch = useDispatch()

  // Keep all existing useEffects
  useEffect(() => {
    const fetchQuestions = async () => {
      await dispatch(getQuestions())
      setLoading(false)
    }
    fetchQuestions()
  }, [dispatch])

  useEffect(() => {
    setQuestions(q || [])
  }, [q])

  useEffect(() => {
    const storedUsedQuestions = JSON.parse(localStorage.getItem("usedQuestions") || "[]")
    setUsedQuestions(storedUsedQuestions)
  }, [])

  // New function to handle chat search results
  const handleChatSearchResults = (questionIds: number[]) => {
    setChatFilteredQuestionIds(questionIds)
    setIsChatFiltering(true)
    setShowAllQuestions(false)
    setIsChatLoading(false)
  }

  const handleShowAllQuestions = () => {
    setShowAllQuestions(true)
    setIsChatFiltering(false)
    setChatFilteredQuestionIds([])
  }

  // Keep all existing functions (toggleFeedbacks, handleCopyEmail, etc.)
  const toggleFeedbacks = (questionId: number) => {
    setOpenFeedbackId((prev) => (prev === questionId ? null : questionId))
  }

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    setSnackbarMessage(`Email copied: ${email}`)
    setSnackbarOpen(true)
  }

  const handleUseQuestion = (questionId: number) => {
    if (usedQuestions.includes(questionId)) {
      console.log("This question is already marked as used.")
      return
    }

    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === questionId ? { ...q, usersUse: (q.usersUse || 0) + 1 } : q)),
    )

    const updatedUsedQuestions = [...usedQuestions, questionId]
    setUsedQuestions(updatedUsedQuestions)
    localStorage.setItem("usedQuestions", JSON.stringify(updatedUsedQuestions))

    dispatch(updateUseQuestion(questionId))
      .unwrap()
      .then((response) => {
        console.log("Update successful:", response)
      })
      .catch((error) => {
        console.error("Update failed:", error)
      })
  }

  const handleOpenShareDialog = (question: Question) => {
    setSelectedQuestionForShare(question)
    setShareDialogOpen(true)
  }

  const handleCloseShareDialog = () => {
    setShareDialogOpen(false)
    setShareEmail("")
    setSelectedQuestionForShare(null)
  }

  const handleSendShareEmail = async () => {
    if (!shareEmail || !selectedQuestionForShare) {
      setSnackbarMessage("Please enter a valid email.")
      setSnackbarOpen(true)
      return
    }

    try {
      const shareUrl = `${window.location.origin}/All`
      await sendEmail({
        to: shareEmail,
        subject: "Check out this question on Feedback Platform!",
        body: `
          <div style="font-family: 'Inter', sans-serif; line-height: 1.6; color: #333;">
            <h2>Hi there,</h2>
            <p>Someone shared a question with you on <strong>Feedback Platform</strong>. Here are the details:</p>
            <p><strong>Title:</strong> ${selectedQuestionForShare.title}</p>
            <p>Click the link below to view the question:</p>
            <a href="${shareUrl}" style="color: ${colors.primary}; text-decoration: none; font-weight: 500;">${shareUrl}</a>
          </div>
        `,
      })

      setSnackbarMessage("Email sent successfully!")
      setSnackbarOpen(true)
      handleCloseShareDialog()
    } catch (error) {
      console.error("Failed to send email:", error)
      setSnackbarMessage("Failed to send email. Please try again.")
      setSnackbarOpen(true)
    }
  }

  const handleDownloadQuestion = async (questionId: number) => {
    const question = questions.find((q) => q.id === questionId)
    if (!question) return

    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Question Details", 10, 10)
    doc.setFontSize(12)
    doc.text(`Title: ${question.title}`, 10, 20)
    doc.text(`Content: ${question.content}`, 10, 30)
    doc.text(`By: ${question.userName || "Unknown"}`, 10, 40)
    doc.text(`Email: ${question.userEmail || "N/A"}`, 10, 50)
    doc.save(`${question.title.replace(/\s+/g, "_")}_question.pdf`)
  }

  const handleOpenPreview = (question: Question) => {
    setSelectedQuestion(question)
    setPreviewDialogOpen(true)
  }

  const handleClosePreview = () => {
    setPreviewDialogOpen(false)
    setSelectedQuestion(null)
  }

  const toggleFilter = () => {
    setFilterOpen(!filterOpen)
  }

  const resetFilters = () => {
    setShowWithImages(false)
    setShowWithSongs(false)
    setSortOption("recent")
    setSearchQuery("")
    handleShowAllQuestions()
  }

  // Enhanced filtering logic that considers chat results
  const filteredQuestions = (questions || [])
    .filter((question) => {
      // If chat filtering is active, only show questions with matching IDs
      if (isChatFiltering && !showAllQuestions) {
        return chatFilteredQuestionIds.includes(question.id)
      }

      // Regular search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          question.title.toLowerCase().includes(query) ||
          question.content.toLowerCase().includes(query) ||
          question.userName.toLowerCase().includes(query)
        )
      }

      // Media type filters
      if (showWithImages && !showWithSongs) {
        return question.images?.some((image) => /\.(jpg|jpeg|png|gif)$/i.test(image.name))
      }

      if (showWithSongs && !showWithImages) {
        return question.images?.some((image) => /\.(mp3|wav|ogg)$/i.test(image.name))
      }

      if (showWithImages && showWithSongs) {
        return question.images?.some((image) => /\.(jpg|jpeg|png|gif|mp3|wav|ogg)$/i.test(image.name))
      }

      return true
    })
    .sort((a, b) => {
      if (sortOption === "popular") {
        return (b.usersUse || 0) - (a.usersUse || 0)
      } else {
        return new Date(b.createAt || "").getTime() - new Date(a.createAt || "").getTime()
      }
    })

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress size={60} thickness={4} sx={{ color: colors.primary }} />
      </Box>
    )
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: colors.secondary,
            mb: 2,
          }}
        >
          Community Questions
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700 }}>
          Explore questions from our community, filter by your preferences, and contribute your insights.
        </Typography>
      </Box>

      {/* Chat Interface */}
      <ChatInterface onSearchResults={handleChatSearchResults} isLoading={isChatLoading} />

      {/* Results Status */}
      <AnimatePresence>
        {isChatFiltering && !showAllQuestions && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Alert
              severity="info"
              sx={{
                mb: 3,
                borderRadius: 2,
                bgcolor: alpha(colors.primary, 0.1),
                border: `1px solid ${alpha(colors.primary, 0.2)}`,
                "& .MuiAlert-icon": {
                  color: colors.primary,
                },
              }}
              action={
                <Button
                  size="small"
                  onClick={handleShowAllQuestions}
                  startIcon={<RefreshCwIcon size={16} />}
                  sx={{
                    color: colors.primary,
                    textTransform: "none",
                    fontWeight: 500,
                  }}
                >
                  הצג הכל
                </Button>
              }
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                מציג {filteredQuestions.length} שאלות רלוונטיות לחיפוש שלך
              </Typography>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keep existing Search and Filter Bar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 4,
          p: 3,
          borderRadius: 2,
          bgcolor: alpha(colors.light, 0.5),
          border: `1px solid ${alpha(colors.secondary, 0.1)}`,
        }}
      >
        <Box sx={{ position: "relative", flexGrow: 1 }}>
          <SearchIcon
            size={18}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: alpha(colors.secondary, 0.6),
            }}
          />
          <TextField
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            fullWidth
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                pl: 4,
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
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant={sortOption === "recent" ? "contained" : "outlined"}
            onClick={() => setSortOption("recent")}
            sx={{
              borderRadius: 2,
              px: 3,
              bgcolor: sortOption === "recent" ? colors.primary : "transparent",
              borderColor: sortOption === "recent" ? colors.primary : alpha(colors.secondary, 0.3),
              color: sortOption === "recent" ? "white" : colors.secondary,
              "&:hover": {
                bgcolor: sortOption === "recent" ? alpha(colors.primary, 0.9) : alpha(colors.secondary, 0.05),
                borderColor: sortOption === "recent" ? colors.primary : colors.secondary,
              },
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Recent
          </Button>

          <Button
            variant={sortOption === "popular" ? "contained" : "outlined"}
            onClick={() => setSortOption("popular")}
            sx={{
              borderRadius: 2,
              px: 3,
              bgcolor: sortOption === "popular" ? colors.primary : "transparent",
              borderColor: sortOption === "popular" ? colors.primary : alpha(colors.secondary, 0.3),
              color: sortOption === "popular" ? "white" : colors.secondary,
              "&:hover": {
                bgcolor: sortOption === "popular" ? alpha(colors.primary, 0.9) : alpha(colors.secondary, 0.05),
                borderColor: sortOption === "popular" ? colors.primary : colors.secondary,
              },
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Popular
          </Button>

          <Button
            variant="outlined"
            onClick={toggleFilter}
            startIcon={<FilterIcon size={18} />}
            sx={{
              borderRadius: 2,
              borderColor: alpha(colors.secondary, 0.3),
              color: colors.secondary,
              "&:hover": {
                bgcolor: alpha(colors.secondary, 0.05),
                borderColor: colors.secondary,
              },
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Filter
          </Button>
        </Box>
      </Box>

      {/* Keep all existing Filter Drawer, Questions Grid, and Dialogs */}
      <Drawer
        anchor="right"
        open={filterOpen}
        onClose={toggleFilter}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 350 },
            p: 3,
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: colors.secondary }}>
            Filter Questions
          </Typography>
          <IconButton onClick={toggleFilter}>
            <XIcon size={20} />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="subtitle2" sx={{ mb: 2, color: colors.secondary, fontWeight: 600 }}>
          Media Type
        </Typography>

        <FormGroup sx={{ mb: 4 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={showWithImages}
                onChange={(e) => setShowWithImages(e.target.checked)}
                sx={{
                  color: colors.primary,
                  "&.Mui-checked": {
                    color: colors.primary,
                  },
                }}
              />
            }
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ImageIconLucide size={18} />
                <Typography>With Images</Typography>
              </Box>
            }
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={showWithSongs}
                onChange={(e) => setShowWithSongs(e.target.checked)}
                sx={{
                  color: colors.primary,
                  "&.Mui-checked": {
                    color: colors.primary,
                  },
                }}
              />
            }
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <MusicIcon size={18} />
                <Typography>With Songs</Typography>
              </Box>
            }
          />
        </FormGroup>

        <Box sx={{ display: "flex", gap: 2, mt: "auto" }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={resetFilters}
            sx={{
              borderRadius: 2,
              py: 1.2,
              borderColor: alpha(colors.secondary, 0.3),
              color: colors.secondary,
              "&:hover": {
                bgcolor: alpha(colors.secondary, 0.05),
                borderColor: colors.secondary,
              },
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Reset
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={toggleFilter}
            sx={{
              borderRadius: 2,
              py: 1.2,
              bgcolor: colors.primary,
              "&:hover": {
                bgcolor: alpha(colors.primary, 0.9),
              },
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Apply
          </Button>
        </Box>
      </Drawer>

      {/* Questions Grid - Keep existing implementation */}
      <Grid container spacing={3}>
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <Grid item xs={12} md={6} lg={4} key={question.id}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    border: `1px solid ${alpha(colors.secondary, 0.1)}`,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    },
                    overflow: "hidden",
                  }}
                >
                  <CardContent sx={{ p: 3, flexGrow: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar sx={{ bgcolor: colors.primary, mr: 1.5 }}>
                        {question.userName?.charAt(0).toUpperCase() || <UserIcon size={18} />}
                      </Avatar>
                      <Box>
                        <Tooltip
                          title={question.userEmail ? `Click to copy: ${question.userEmail}` : "No email available"}
                          arrow
                          placement="top"
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              cursor: question.userEmail ? "pointer" : "default",
                              color: colors.secondary,
                            }}
                            onClick={() => question.userEmail && handleCopyEmail(question.userEmail)}
                          >
                            {question.userName || "Unknown"}
                          </Typography>
                        </Tooltip>
                        {question.createAt && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <CalendarIcon size={12} style={{ marginRight: 4 }} />
                            {new Date(question.createAt).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        color: colors.secondary,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {question.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minHeight: "4.5em",
                      }}
                    >
                      {question.content}
                    </Typography>

                    {/* Media preview */}
                    {question.images.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500, color: colors.secondary }}>
                            Attachments ({question.images.length})
                          </Typography>

                          {question.images.length > 1 && (
                            <Button
                              size="small"
                              onClick={() => handleOpenPreview(question)}
                              sx={{
                                color: colors.primary,
                                textTransform: "none",
                                fontWeight: 500,
                                fontSize: "0.8rem",
                              }}
                            >
                              View All
                            </Button>
                          )}
                        </Box>

                        <Box
                          sx={{
                            height: 140,
                            borderRadius: 2,
                            overflow: "hidden",
                            bgcolor: alpha(colors.light, 0.5),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => handleOpenPreview(question)}
                        >
                          {question.images[0] && <ShowFile fileName={question.images[0].name} />}
                        </Box>
                      </Box>
                    )}

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {`Used by ${question.usersUse || 0} people`}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                      <IconButton
                        onClick={() => handleUseQuestion(question.id)}
                        sx={{
                          color: usedQuestions.includes(question.id) ? colors.primary : alpha(colors.secondary, 0.6),
                          p: 1,
                        }}
                      >
                        {usedQuestions.includes(question.id) ? <ThumbUpIcon size={20} /> : <ThumbUpOffIcon size={20} />}
                      </IconButton>
                      <Typography variant="body2" color="text.secondary">
                        {usedQuestions.includes(question.id) ? "You used this question" : "Mark as used"}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Chip
                        icon={<CommentIcon size={16} />}
                        label={`${question.feedbacks.length} ${question.feedbacks.length === 1 ? "comment" : "comments"}`}
                        size="small"
                        sx={{
                          bgcolor: alpha(colors.primary, 0.1),
                          color: colors.primary,
                          border: "none",
                          "& .MuiChip-icon": {
                            color: colors.primary,
                          },
                        }}
                      />

                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenShareDialog(question)}
                          sx={{ color: alpha(colors.secondary, 0.7) }}
                        >
                          <ShareIcon size={18} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDownloadQuestion(question.id)}
                          sx={{ color: alpha(colors.secondary, 0.7) }}
                        >
                          <DownloadIcon size={18} />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>

                  <Box sx={{ p: 3, pt: 0 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => toggleFeedbacks(question.id)}
                      sx={{
                        borderRadius: 2,
                        py: 1.2,
                        bgcolor: colors.primary,
                        "&:hover": {
                          bgcolor: alpha(colors.primary, 0.9),
                        },
                        textTransform: "none",
                        fontWeight: 500,
                      }}
                    >
                      {openFeedbackId === question.id ? "Hide Comments" : "View Comments"}
                    </Button>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 3,
                border: `1px solid ${alpha(colors.secondary, 0.1)}`,
              }}
            >
              <Box sx={{ mb: 2 }}>
                <SearchIcon size={40} style={{ color: alpha(colors.secondary, 0.3) }} />
              </Box>
              <Typography variant="h6" sx={{ color: colors.secondary, fontWeight: 600 }}>
                No questions found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 400, mx: "auto" }}>
                {isChatFiltering && !showAllQuestions
                  ? "לא נמצאו שאלות רלוונטיות לחיפוש שלך. נסה לנסח את השאלה בצורה אחרת."
                  : searchQuery
                    ? "No questions match your search criteria. Try adjusting your filters or search terms."
                    : "Be the first to ask a question and start the conversation!"}
              </Typography>

              {(searchQuery || (isChatFiltering && !showAllQuestions)) && (
                <Button
                  variant="outlined"
                  onClick={resetFilters}
                  sx={{
                    mt: 3,
                    borderRadius: 2,
                    borderColor: colors.primary,
                    color: colors.primary,
                    "&:hover": {
                      borderColor: colors.primary,
                      bgcolor: alpha(colors.primary, 0.05),
                    },
                    textTransform: "none",
                    fontWeight: 500,
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Keep all existing Drawers and Dialogs */}
      <Drawer
        anchor={isLargeScreen ? "right" : "bottom"}
        open={openFeedbackId !== null}
        onClose={() => setOpenFeedbackId(null)}
        sx={{
          "& .MuiDrawer-paper": {
            width: isLargeScreen ? "40%" : "100%",
            height: isLargeScreen ? "100%" : "80%",
            borderRadius: isLargeScreen ? 0 : "16px 16px 0 0",
          },
        }}
      >
        {openFeedbackId && (
          <>
            <Box
              sx={{
                p: 3,
                display: "flex",
                alignItems: "center",
                borderBottom: `1px solid ${alpha(colors.secondary, 0.1)}`,
              }}
            >
              <IconButton edge="start" onClick={() => setOpenFeedbackId(null)} sx={{ mr: 2, color: colors.secondary }}>
                <ArrowLeftIcon size={20} />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600, color: colors.secondary }}>
                {questions.find((q) => q.id === openFeedbackId)?.title || "Comments & Feedback"}
              </Typography>
              <Chip
                label={`${questions.find((q) => q.id === openFeedbackId)?.feedbacks.length || 0} comments`}
                size="small"
                sx={{
                  bgcolor: alpha(colors.primary, 0.1),
                  color: colors.primary,
                  border: "none",
                }}
              />
            </Box>

            <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
              {questions.find((q) => q.id === openFeedbackId) && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: colors.secondary }}>
                    {questions.find((q) => q.id === openFeedbackId)?.content}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: colors.primary }}>
                      {questions
                        .find((q) => q.id === openFeedbackId)
                        ?.userName?.charAt(0)
                        .toUpperCase() || "?"}
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                      {questions.find((q) => q.id === openFeedbackId)?.userName || "Unknown"}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              <FeedbackSection
                feedbacks={questions.find((q) => q.id === openFeedbackId)?.feedbacks || []}
                questionId={openFeedbackId}
                questionUserName={questions.find((q) => q.id === openFeedbackId)?.userName || ""}
                questionUserEmail={questions.find((q) => q.id === openFeedbackId)?.userEmail || ""}
                questionTitle={questions.find((q) => q.id === openFeedbackId)?.title || ""}
                questionUserId={questions.find((q) => q.id === openFeedbackId)?.userId || 0}
              />
            </Box>
          </>
        )}
      </Drawer>

      {/* Share Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={handleCloseShareDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <Box component="div" sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ color: colors.secondary, fontWeight: 600 }}>
            Share Question
          </Typography>
        </Box>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter the email address to share this question:
          </Typography>
          <TextField
            fullWidth
            label="Email Address"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: alpha(colors.primary, 0.5),
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.primary,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: colors.primary,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleCloseShareDialog}
            sx={{
              color: colors.secondary,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendShareEmail}
            variant="contained"
            sx={{
              bgcolor: colors.primary,
              "&:hover": {
                bgcolor: alpha(colors.primary, 0.9),
              },
              textTransform: "none",
              fontWeight: 500,
              borderRadius: 2,
            }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Media Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <Box
          component="div"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `1px solid ${alpha(colors.secondary, 0.1)}`,
            p: 3,
          }}
        >
          <Typography component="div" sx={{ fontWeight: 600, color: colors.secondary }}>
            All Attachments
          </Typography>
          <IconButton onClick={handleClosePreview}>
            <XIcon size={20} />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: 3 }}>
          {selectedQuestion && (
            <ImageList cols={isTablet ? 2 : 3} gap={16}>
              {selectedQuestion.images.map((image) => (
                <ImageListItem key={image.id}>
                  <Box
                    sx={{
                      position: "relative",
                      height: 200,
                      borderRadius: 2,
                      overflow: "hidden",
                      bgcolor: alpha(colors.light, 0.5),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ShowFile fileName={image.name} />
                  </Box>
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  )
}

export default QuestionsListEnhanced
