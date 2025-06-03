

import { Box, Typography, Grid, Button, Container, Card, CardContent, Link } from "@mui/material"
import {
  Feedback as FeedbackIcon,
  People as PeopleIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Lightbulb as LightbulbIcon,
  EmojiObjects as EmojiObjectsIcon,
  CheckCircle as CheckCircleIcon,
  Forum as ForumIcon,
  Group as GroupIcon,
} from "@mui/icons-material"
import { motion } from "framer-motion"
import { colors } from "./them"
// import Link fro



export default function Home() {
  const features = [
    {
      icon: <FeedbackIcon sx={{ fontSize: 36, color: colors.primary }} />,
      title: "Constructive Feedback",
      description: "Get valuable insights from peers and experts to improve your work.",
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 36, color: colors.primary }} />,
      title: "Community Driven",
      description: "Join a supportive community that helps each other grow and succeed.",
    },
    {
      icon: <StarIcon sx={{ fontSize: 36, color: colors.primary }} />,
      title: "Improve & Grow",
      description: "Track your progress and see tangible improvements in your skills.",
    },
    {
      icon: <QuestionAnswerIcon sx={{ fontSize: 36, color: colors.primary }} />,
      title: "Ask Questions",
      description: "Get answers to your most pressing questions from knowledgeable peers.",
    },
    {
      icon: <LightbulbIcon sx={{ fontSize: 36, color: colors.primary }} />,
      title: "Share Knowledge",
      description: "Contribute your expertise and help others in the community.",
    },
    {
      icon: <EmojiObjectsIcon sx={{ fontSize: 36, color: colors.primary }} />,
      title: "Discover Ideas",
      description: "Find inspiration and new perspectives from diverse feedback.",
    },
  ]

  const stats = [
    { value: "10k+", label: "Active Users", icon: <GroupIcon sx={{ color: colors.primary }} /> },
    { value: "50k+", label: "Questions Answered", icon: <ForumIcon sx={{ color: colors.primary }} /> },
    { value: "98%", label: "Satisfaction Rate", icon: <CheckCircleIcon sx={{ color: colors.primary }} /> },
    { value: "24/6", label: "Community Support", icon: <PeopleIcon sx={{ color: colors.primary }} /> },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <Box sx={{ width: "100%", bgcolor: "#FFFFFF" }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "#FFFFFF",
          color: colors.secondary,
          py: { xs: 10, md: 16 },
          position: "relative",
          borderBottom: `1px solid ${colors.light}`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                    color: colors.secondary,
                    lineHeight: 1.2,
                  }}
                >
                  Elevate Your Work Through Feedback
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 4,
                    fontSize: "1.1rem",
                    color: colors.dark,
                    lineHeight: 1.6,
                    maxWidth: "90%",
                  }}
                >
                  Join our community of creators, developers, and professionals who share insights and help each other
                  grow.
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mt: 6 }}>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      component={Link}
                      href="/auth"
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        bgcolor: colors.primary,
                        color: "white",
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: "1rem",
                        fontWeight: 500,
                        boxShadow: "none",
                        "&:hover": {
                          bgcolor: colors.primary,
                          opacity: 0.9,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        },
                      }}
                    >
                      Get Started
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      component={Link}
                      href="/all"
                      variant="outlined"
                      size="large"
                      sx={{
                        borderColor: colors.primary,
                        color: colors.primary,
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: "1rem",
                        fontWeight: 500,
                        "&:hover": {
                          borderColor: colors.primary,
                          bgcolor: "rgba(224, 122, 95, 0.04)",
                        },
                      }}
                    >
                      Browse Questions
                    </Button>
                  </motion.div>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: 300, md: 400 },
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                    background: `linear-gradient(135deg, ${colors.light} 0%, ${colors.accent}20 100%)`,
                  }}
                >
                  {/* Decorative circles */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: "20%",
                      left: "15%",
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      bgcolor: colors.primary,
                      opacity: 0.1,
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: "60%",
                      right: "20%",
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      bgcolor: colors.accent,
                      opacity: 0.15,
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "20%",
                      left: "25%",
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: colors.secondary,
                      opacity: 0.1,
                    }}
                  />

                  {/* Central icon arrangement */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <FeedbackIcon sx={{ fontSize: 48, color: colors.primary, opacity: 0.8 }} />
                      <PeopleIcon sx={{ fontSize: 52, color: colors.secondary, opacity: 0.9 }} />
                    </Box>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <LightbulbIcon sx={{ fontSize: 44, color: colors.accent, opacity: 0.8 }} />
                      <StarIcon sx={{ fontSize: 40, color: colors.primary, opacity: 0.7 }} />
                      <QuestionAnswerIcon sx={{ fontSize: 46, color: colors.secondary, opacity: 0.8 }} />
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    p: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box sx={{ mb: 2 }}>{stat.icon}</Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: colors.primary,
                      mb: 1,
                      fontSize: { xs: "2rem", md: "2.5rem" },
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.secondary, fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: colors.light, py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                color: colors.secondary,
                mb: 2,
              }}
            >
              Why Choose Our Platform?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: colors.dark,
                maxWidth: "700px",
                mx: "auto",
                fontSize: "1.1rem",
              }}
            >
              Our feedback system is designed to help you grow through constructive feedback and community support.
            </Typography>
          </Box>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div variants={itemVariants}>
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        borderRadius: 2,
                        p: 3,
                        bgcolor: "white",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 0 }}>
                        <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                        <Typography
                          variant="h6"
                          component="h3"
                          gutterBottom
                          sx={{ fontWeight: 600, color: colors.secondary }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.dark }}>
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                color: colors.secondary,
                mb: 3,
              }}
            >
              Ready to Get Started?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: colors.dark,
                mb: 5,
                maxWidth: "700px",
                mx: "auto",
                fontSize: "1.1rem",
              }}
            >
              Join our community today and start giving and receiving valuable feedback to improve your skills.
            </Typography>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                component={Link}
                href="/auth"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: colors.primary,
                  color: "white",
                  px: 5,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: colors.primary,
                    opacity: 0.9,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  },
                }}
              >
                Join Now
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
    </Box>
  )
}

