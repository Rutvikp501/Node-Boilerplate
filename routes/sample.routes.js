import express from 'express';
const router = express.Router();

// Your actual routes here
router.get("/test", (req, res) => {
  res.send("This is a test route.");
});

// 404 handler for undefined routes (ONLY if using router alone)
router.use((req, res) => {
  res.status(404).render("404", { title: "Page not found" });
});

export default router;
