// "use client"

// import { Box, Container, Typography, IconButton, Divider, useMediaQuery, useTheme, Grid } from "@mui/material"
// import { GitHub as GitHubIcon, Favorite as FavoriteIcon, Mail as MailIcon } from "@mui/icons-material"
// import React, { useState } from "react"
// import { motion } from "framer-motion"
// import { colors } from "./them"

// // Logo Component (same as before)
// const FeedbackLogo: React.FC<{ size?: number; showText?: boolean }> = ({ size = 40, showText = true }) => {
//   const canvasRef = React.useRef<HTMLCanvasElement>(null)
//   const [isHovered, setIsHovered] = useState(false)

//   React.useEffect(() => {
//     const canvas = canvasRef.current
//     if (!canvas) return

//     const ctx = canvas.getContext("2d")
//     if (!ctx) return

//     // Set canvas size with high DPI
//     const dpr = window.devicePixelRatio || 1
//     canvas.width = size * dpr
//     canvas.height = size * dpr
//     canvas.style.width = size + "px"
//     canvas.style.height = size + "px"
//     ctx.scale(dpr, dpr)

//     // Clear canvas
//     ctx.clearRect(0, 0, size, size)

//     // Enable anti-aliasing
//     ctx.imageSmoothingEnabled = true
//     ctx.imageSmoothingQuality = "high"

//     // Draw Speech Bubble Pro logo
//     const centerX = size / 2
//     const centerY = size / 2

//     // Speech bubble with gradient
//     const gradient = ctx.createLinearGradient(0, 0, size, size)
//     gradient.addColorStop(0, colors.primary)
//     gradient.addColorStop(0.5, colors.accent)
//     gradient.addColorStop(1, colors.secondary)

//     // Shadow
//     ctx.shadowColor = "rgba(61, 64, 91, 0.3)"
//     ctx.shadowBlur = size * 0.1
//     ctx.shadowOffsetY = size * 0.05

//     // Main bubble
//     const bubbleWidth = size * 0.6
//     const bubbleHeight = size * 0.4

//     ctx.beginPath()
//     roundRect(ctx, centerX - bubbleWidth / 2, centerY - bubbleHeight / 2, bubbleWidth, bubbleHeight, size * 0.06)
//     ctx.fillStyle = gradient
//     ctx.fill()

//     // Bubble tail
//     ctx.beginPath()
//     ctx.moveTo(centerX - size * 0.15, centerY + size * 0.15)
//     ctx.lineTo(centerX - size * 0.25, centerY + size * 0.28)
//     ctx.lineTo(centerX, centerY + size * 0.15)
//     ctx.closePath()
//     ctx.fill()

//     // Reset shadow
//     ctx.shadowColor = "transparent"
//     ctx.shadowBlur = 0
//     ctx.shadowOffsetY = 0

//     // Inner highlight
//     ctx.beginPath()
//     roundRect(ctx, centerX - size * 0.25, centerY - size * 0.2, size * 0.5, size * 0.15, size * 0.03)
//     ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
//     ctx.fill()

//     // Text
//     ctx.fillStyle = "#ffffff"
//     ctx.font = `bold ${size * 0.15}px Inter, sans-serif`
//     ctx.textAlign = "center"
//     ctx.textBaseline = "middle"
//     ctx.fillText("FB", centerX, centerY - size * 0.05)

//     function roundRect(
//       ctx: CanvasRenderingContext2D,
//       x: number,
//       y: number,
//       width: number,
//       height: number,
//       radius: number,
//     ) {
//       ctx.beginPath()
//       ctx.moveTo(x + radius, y)
//       ctx.lineTo(x + width - radius, y)
//       ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
//       ctx.lineTo(x + width, y + height - radius)
//       ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
//       ctx.lineTo(x + radius, y + height)
//       ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
//       ctx.lineTo(x, y + radius)
//       ctx.quadraticCurveTo(x, y, x + radius, y)
//       ctx.closePath()
//     }
//   }, [size, isHovered])

//   return (
//     <motion.div
//       onHoverStart={() => setIsHovered(true)}
//       onHoverEnd={() => setIsHovered(false)}
//       whileHover={{ scale: 1.05 }}
//       style={{ cursor: "pointer" }}
//     >
//       <Box sx={{ display: "flex", alignItems: "center", gap: showText ? 2 : 0 }}>
//         <canvas ref={canvasRef} style={{ borderRadius: "8px" }} />
//         {showText && (
//           <Typography
//             variant="h5"
//             component="div"
//             sx={{
//               fontWeight: 700,
//               color: "white",
//               textShadow: "0 2px 4px rgba(0,0,0,0.3)",
//             }}
//           >
//             Speech Bubble Pro
//           </Typography>
//         )}
//       </Box>
//     </motion.div>
//   )
// }

// export function AdaptedFooter() {
//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

//   return (
//     <Box
//       component="footer"
//       sx={{
//         width: "100%",
//         background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
//         color: "white",
//         py: 6,
//         px: 2,
//         mt: "auto",
//         boxSizing: "border-box",
//         position: "relative",
//         "&::before": {
//           content: '""',
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           height: "2px",
//           background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
//         },
//       }}
//     >
//       <Container maxWidth="xl">
//         <Grid container spacing={4} alignItems="center">
//           <Grid item xs={12} md={6}>
//             <Box sx={{ textAlign: isMobile ? "center" : "left" }}>
//               {/* Logo and Title */}
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: isMobile ? "center" : "flex-start",
//                   mb: 2,
//                 }}
//               >
//                 <FeedbackLogo size={50} showText={false} />
//                 <Typography
//                   variant="h5"
//                   sx={{
//                     fontWeight: 800,
//                     background: `linear-gradient(135deg, ${colors.accent} 0%, #ffffff 100%)`,
//                     backgroundClip: "text",
//                     WebkitBackgroundClip: "text",
//                     WebkitTextFillColor: "transparent",
//                     ml: 2,
//                   }}
//                 >
//                   Speech Bubble Pro
//                 </Typography>
//               </Box>

//               <Typography variant="body1" sx={{ opacity: 0.9, mb: 2, fontWeight: 500 }}>
//                 Advanced Feedback and Communication Platform
//               </Typography>

//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: isMobile ? "center" : "flex-start",
//                   gap: 1,
//                   flexWrap: "wrap",
//                 }}
//               >
//                 <Typography variant="body2" sx={{ opacity: 0.7 }}>
//                   Made with
//                 </Typography>
//                 <FavoriteIcon sx={{ fontSize: 16, color: "#ef4444", mx: 0.5 }} />
//                 <Typography variant="body2" sx={{ opacity: 0.7 }}>
//                   © {new Date().getFullYear()} All Rights Reserved
//                 </Typography>

//                 {/* GitHub Link */}
//                 <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
//                   <IconButton
//                     size="medium"
//                     aria-label="GitHub"
//                     component="a"
//                     href="https://github.com/yourusername/speech-bubble-pro"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     sx={{
//                       color: "rgba(255,255,255,0.8)",
//                       transition: "all 0.3s ease",
//                       "&:hover": {
//                         color: colors.accent,
//                         transform: "translateY(-3px)",
//                         backgroundColor: `rgba(${colors.accent.replace("#", "")}, 0.1)`,
//                       },
//                     }}
//                   >
//                     <GitHubIcon />
//                   </IconButton>
//                 </motion.div>

//                 {/* Email Link */}
//                 <motion.div whileHover={{ scale: 1.05 }}>
//                   <Box
//                     component="a"
//                     href="mailto:support@speechbubblepro.com?subject=Support%20Request&body=Hello,%20I%20would%20like%20to%20get%20support%20regarding..."
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 0.5,
//                       color: colors.accent,
//                       textDecoration: "none",
//                       marginLeft: 1,
//                       padding: "4px 8px",
//                       borderRadius: "4px",
//                       transition: "all 0.3s ease",
//                       "&:hover": {
//                         backgroundColor: "rgba(255,255,255,0.1)",
//                         transform: "translateY(-2px)",
//                       },
//                     }}
//                   >
//                     <MailIcon sx={{ fontSize: 16 }} />
//                     <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                       support@speechbubblepro.com
//                     </Typography>
//                   </Box>
//                 </motion.div>
//               </Box>
//             </Box>
//           </Grid>

//           <Grid item xs={12} md={6}>
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: isMobile ? "center" : "flex-end",
//                 gap: 3,
//               }}
//             >
//               {/* Additional content can go here */}
//               <Box
//                 sx={{
//                   display: "flex",
//                   gap: 4,
//                   flexWrap: "wrap",
//                   justifyContent: isMobile ? "center" : "flex-end",
//                 }}
//               >
//                 {/* You can add more links or content here */}
//               </Box>
//             </Box>
//           </Grid>
//         </Grid>

//         <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.2)" }} />

//         {/* Bottom gradient bar */}
//         <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.5 }}>
//           <Box
//             sx={{
//               width: "100%",
//               height: 6,
//               background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.accent} 50%, ${colors.secondary} 100%)`,
//               borderRadius: 3,
//               opacity: 0.9,
//             }}
//           />
//         </motion.div>
//       </Container>
//     </Box>
//   )
// }

// export default AdaptedFooter
"use client"

import { Box, Container, Typography, IconButton, useMediaQuery, useTheme, Grid } from "@mui/material"
import { GitHub as GitHubIcon } from "@mui/icons-material"
import React from "react"
import { colors } from "./them"

// Logo Component - פשוט יותר
const FeedbackLogo: React.FC<{ size?: number; showText?: boolean }> = ({ size = 40, showText = true }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size with high DPI
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = size + "px"
    canvas.style.height = size + "px"
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Enable anti-aliasing
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

    // Draw Speech Bubble Pro logo - פשוט יותר
    const centerX = size / 2
    const centerY = size / 2

    // Speech bubble with simple gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size)
    gradient.addColorStop(0, colors.primary)
    gradient.addColorStop(0.5, colors.accent)
    gradient.addColorStop(1, colors.secondary)

    // Simple shadow
    ctx.shadowColor = "rgba(61, 64, 91, 0.2)"
    ctx.shadowBlur = size * 0.08
    ctx.shadowOffsetY = size * 0.04

    // Main bubble
    const bubbleWidth = size * 0.6
    const bubbleHeight = size * 0.4

    ctx.beginPath()
    roundRect(ctx, centerX - bubbleWidth / 2, centerY - bubbleHeight / 2, bubbleWidth, bubbleHeight, size * 0.06)
    ctx.fillStyle = gradient
    ctx.fill()

    // Bubble tail
    ctx.beginPath()
    ctx.moveTo(centerX - size * 0.15, centerY + size * 0.15)
    ctx.lineTo(centerX - size * 0.25, centerY + size * 0.28)
    ctx.lineTo(centerX, centerY + size * 0.15)
    ctx.closePath()
    ctx.fill()

    // Reset shadow
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0
    ctx.shadowOffsetY = 0

    // Simple inner highlight
    ctx.beginPath()
    roundRect(ctx, centerX - size * 0.25, centerY - size * 0.2, size * 0.5, size * 0.15, size * 0.03)
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
    ctx.fill()

    // Text
    ctx.fillStyle = "#ffffff"
    ctx.font = `bold ${size * 0.15}px Inter, sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("FB", centerX, centerY - size * 0.05)

    function roundRect(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
      radius: number,
    ) {
      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + width - radius, y)
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
      ctx.lineTo(x + width, y + height - radius)
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
      ctx.lineTo(x + radius, y + height)
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.closePath()
    }
  }, [size])

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: showText ? 2 : 0 }}>
      <canvas ref={canvasRef} style={{ borderRadius: "8px" }} />
      {showText && (
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Speech Bubble Pro
        </Typography>
      )}
    </Box>
  )
}

export function SimpleFooter() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        background: "#f8f9fa", // רקע אפור בהיר מאוד - סימן היכר ברור
        color: "#374151",
        py: 4, // פחות padding
        px: 2,
        mt: 4, // רווח מהתוכן למעלה
        boxSizing: "border-box",
        position: "relative",
        // סימן היכר ברור - גבול עליון צבעוני
        borderTop: `3px solid`,
        borderImage: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.accent} 50%, ${colors.secondary} 100%) 1`,
        // צל עדין נוסף
        boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: isMobile ? "center" : "left" }}>
              {/* Logo and Title - פשוט יותר */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isMobile ? "center" : "flex-start",
                  mb: 2,
                }}
              >
                <FeedbackLogo size={40} showText={false} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    ml: 2,
                  }}
                >
                  Speech Bubble Pro
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ color: "#6b7280", mb: 2 }}>
                Advanced Feedback Platform
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: isMobile ? "center" : "flex-end",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              {/* Copyright */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                  © {new Date().getFullYear()}
                </Typography>
                {/* <FavoriteIcon sx={{ fontSize: 14, color: "#ef4444" }} /> */}
              </Box>

              {/* Links - פשוט יותר */}
              <IconButton
                size="small"
                aria-label="GitHub"
                component="a"
                href="https://github.com/Miriam4494/LiveFeedback"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#6b7280",
                  "&:hover": {
                    color: colors.primary,
                    backgroundColor: "#f3f4f6",
                  },
                }}
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
              <p>
                
                <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=noreply.livefeedback@gmail.com&su=Inquiry%20from%20live%20feedback%20website&body=Hello,%20I%20would%20like%20to%20ask%20about..."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: colors.secondary, marginLeft: '5px' }}
                >
                  support@livefeedback.co.il
                </a></p>
              {/* <Box
                component="a"
                href="mailto:miri64494@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: colors.primary,
                  textDecoration: "none",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                  "&:hover": {
                    backgroundColor: "#f3f4f6",
                  },
                }}
              >
                <MailIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2">Support</Typography>
              </Box> */}
            </Box>
          </Grid>
        </Grid>

        {/* הפס הצבעוני בתחתית - פשוט יותר */}
        <Box
          sx={{
            width: "100%",
            height: 3,
            background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.accent} 50%, ${colors.secondary} 100%)`,
            borderRadius: 1.5,
            mt: 3,
            opacity: 0.8,
          }}
        />
      </Container>
    </Box>
  )
}

export default SimpleFooter
