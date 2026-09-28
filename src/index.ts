import express from "express";
import { errorHandler } from "./middleware/error-handler.js";
import hotelsRouter from "./routes/hotels.js";
import roomTypesRouter from "./routes/room-types.js";
import cancellationPoliciesRouter from "./routes/cancellation-policies.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "property-service",
  });
});

// API routes
app.use("/v1/hotels", hotelsRouter);
app.use("/v1/room-types", roomTypesRouter);
app.use("/v1/cancellation-policies", cancellationPoliciesRouter);

// Error handler
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Property Service running on port ${PORT}`);
  });
}

export default app;
