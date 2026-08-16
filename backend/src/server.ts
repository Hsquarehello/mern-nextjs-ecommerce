import app from "./app.js";
import connectDB from "./config/db.js";

connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🚀 TS Express Server running on port ${PORT}`),
  );
});
