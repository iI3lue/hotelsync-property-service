import request from "supertest";
import express from "express";
import hotelsRouter from "../../src/routes/hotels.js";
import roomTypesRouter from "../../src/routes/room-types.js";
import cancellationPoliciesRouter from "../../src/routes/cancellation-policies.js";
import { errorHandler } from "../../src/middleware/error-handler.js";

// Mock Prisma
jest.mock("../../src/lib/prisma.js", () => ({
  __esModule: true,
  default: {
    hotel: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    roomType: {
      findMany: jest.fn(),
    },
    cancellationPolicy: {
      findFirst: jest.fn(),
    },
  },
}));

import prisma from "../../src/lib/prisma.js";
const mockPrisma = prisma as any;

const app = express();
app.use(express.json());

// Health check route (mirrors index.ts)
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "property-service",
  });
});

app.use("/v1/hotels", hotelsRouter);
app.use("/v1/room-types", roomTypesRouter);
app.use("/v1/cancellation-policies", cancellationPoliciesRouter);
app.use(errorHandler);

const VALID_UUID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

describe("Property Service API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /health", () => {
    it("should return health status", async () => {
      const res = await request(app).get("/health");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
    });
  });

  describe("POST /v1/hotels", () => {
    it("should create a hotel with valid data", async () => {
      const hotel = { hotel_id: VALID_UUID, name: "Test Hotel", city: "BA", country: "AR", timezone: "America/Argentina/Buenos_Aires" };
      mockPrisma.hotel.create.mockResolvedValue(hotel);

      const res = await request(app)
        .post("/v1/hotels")
        .send({ name: "Test Hotel", city: "BA", country: "AR", timezone: "America/Argentina/Buenos_Aires" });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe("Test Hotel");
    });

    it("should return 400 with missing fields", async () => {
      const res = await request(app).post("/v1/hotels").send({ name: "Test" });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /v1/hotels", () => {
    it("should return all hotels", async () => {
      mockPrisma.hotel.findMany.mockResolvedValue([
        { hotel_id: VALID_UUID, name: "Hotel A" },
      ]);

      const res = await request(app).get("/v1/hotels");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /v1/hotels/:id", () => {
    it("should return a hotel by id", async () => {
      mockPrisma.hotel.findUnique.mockResolvedValue({
        hotel_id: VALID_UUID,
        name: "Hotel A",
        roomTypes: [],
        cancellationPolicies: [],
      });

      const res = await request(app).get(`/v1/hotels/${VALID_UUID}`);
      expect(res.status).toBe(200);
    });

    it("should return 404 for non-existent hotel", async () => {
      mockPrisma.hotel.findUnique.mockResolvedValue(null);

      const res = await request(app).get(`/v1/hotels/${VALID_UUID}`);
      expect(res.status).toBe(404);
    });
  });
});
