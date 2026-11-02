import request from "supertest";
import express from "express";
import cancellationPoliciesRouter from "../../src/routes/cancellation-policies.js";
import { errorHandler } from "../../src/middleware/error-handler.js";

jest.mock("../../src/lib/prisma.js", () => ({
  __esModule: true,
  default: {
    hotel: { findUnique: jest.fn() },
    cancellationPolicy: { create: jest.fn(), findFirst: jest.fn() },
  },
}));

import prisma from "../../src/lib/prisma.js";
import { signAccessToken } from "../helpers/tokens.js";
const mockPrisma = prisma as any;

const HOTEL_A = "a1b2c3d4-e5f6-4890-abcd-ef1234567890";
const HOTEL_B = "b1b2c3d4-e5f6-4890-abcd-ef1234567891";

const tokenFor = (role: string, hotel_id: string | null) =>
  signAccessToken({ sub: "u1", email: "u@hotelsync.local", role, hotel_id });

const app = express();
app.use(express.json());
app.use("/v1/cancellation-policies", cancellationPoliciesRouter);
app.use(errorHandler);

const body = { hotel_id: HOTEL_A, name: "Flexible", description: "Cancelación gratis hasta 48 h antes" };

describe("POST /v1/cancellation-policies (autorización)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.hotel.findUnique.mockResolvedValue({ hotel_id: HOTEL_A });
    mockPrisma.cancellationPolicy.create.mockResolvedValue({ policy_id: "p1", ...body });
  });

  it("rechaza sin token (401) y no toca la base", async () => {
    const res = await request(app).post("/v1/cancellation-policies").send(body);
    expect(res.status).toBe(401);
    expect(mockPrisma.cancellationPolicy.create).not.toHaveBeenCalled();
  });

  it("rechaza a un GUEST (403)", async () => {
    const res = await request(app)
      .post("/v1/cancellation-policies")
      .set("Authorization", `Bearer ${tokenFor("GUEST", null)}`)
      .send(body);
    expect(res.status).toBe(403);
    expect(mockPrisma.cancellationPolicy.create).not.toHaveBeenCalled();
  });

  it("rechaza a un MANAGER de otro hotel (403)", async () => {
    const res = await request(app)
      .post("/v1/cancellation-policies")
      .set("Authorization", `Bearer ${tokenFor("MANAGER", HOTEL_B)}`)
      .send(body);
    expect(res.status).toBe(403);
    expect(mockPrisma.cancellationPolicy.create).not.toHaveBeenCalled();
  });

  it("permite al MANAGER de ese hotel (201)", async () => {
    const res = await request(app)
      .post("/v1/cancellation-policies")
      .set("Authorization", `Bearer ${tokenFor("MANAGER", HOTEL_A)}`)
      .send(body);
    expect(res.status).toBe(201);
    expect(mockPrisma.cancellationPolicy.create).toHaveBeenCalledTimes(1);
  });

  it("permite a SUPER_ADMIN (201)", async () => {
    const res = await request(app)
      .post("/v1/cancellation-policies")
      .set("Authorization", `Bearer ${tokenFor("SUPER_ADMIN", null)}`)
      .send(body);
    expect(res.status).toBe(201);
  });
});
