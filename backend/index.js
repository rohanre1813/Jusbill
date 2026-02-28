import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);

  // Ping self every 14 minutes to prevent Render free tier from sleeping
  const url = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
  setInterval(async () => {
    try {
      await fetch(`${url}/health`);
      console.log("Self-ping successful");
    } catch (err) {
      console.log("Self-ping failed:", err.message);
    }
  }, 14 * 60 * 1000);
});
