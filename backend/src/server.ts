import app from "./app.js";
import connectDB from "./config/db.js";

// Uncaught Exception များ ဖမ်းယူခြင်း
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () =>
      console.log(`🚀 TS Express Server running on port ${PORT}`),
    );

    // Unhandled Promise Rejections များ ဖမ်းယူခြင်း
    process.on("unhandledRejection", (err: any) => {
      console.error("UNHANDLED REJECTION! 💥 Shutting down...");
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
    process.exit(1);
  });
