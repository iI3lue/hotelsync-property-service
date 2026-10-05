import { createHmac, timingSafeEqual } from "node:crypto";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/error-handler.js";

export interface AuthClaims {
  sub: string;
  email: string;
  email_verified: boolean;
  role: string;
  hotel_id: string | null;
  scope: "global" | "hotel";
  iss: string;
  aud: string;
  iat: number;
  exp: number;
}

export const TOKEN_ISSUER = "hotelsync";
export const TOKEN_AUDIENCE = "hotelsync-api";

/**
 * Verificacion local de access tokens HS256 (misma firma que user-service).
 * Duplicado intencional por database-per-service: la implementacion canonica
 * vive en `services/user-service/src/lib/tokens.ts`; la proxima fase lo
 * propaga al resto de los servicios.
 */
function getSecret(): string {
  const secret = process.env.AUTH_JWT_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "test") {
    return "test-secret-for-unit-tests-only-32b!";
  }
  throw new Error("AUTH_JWT_SECRET must be set (min 32 chars)");
}

export function verifyAccessToken(token: string): AuthClaims {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new AppError(401, "Invalid token", "Unauthorized");
  }
  const [header, payload, signature] = parts;
  let decodedHeader: { alg?: string };
  try {
    decodedHeader = JSON.parse(
      Buffer.from(header, "base64url").toString("utf8")
    );
  } catch {
    throw new AppError(401, "Invalid token", "Unauthorized");
  }
  if (decodedHeader.alg !== "HS256") {
    throw new AppError(401, "Invalid token", "Unauthorized");
  }
  const expected = createHmac("sha256", getSecret())
    .update(`${header}.${payload}`)
    .digest();
  const actual = Buffer.from(signature, "base64url");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    throw new AppError(401, "Invalid token", "Unauthorized");
  }
  const claims = JSON.parse(
    Buffer.from(payload, "base64url").toString("utf8")
  ) as AuthClaims;
  if (
    !claims.sub ||
    !claims.exp ||
    claims.iss !== TOKEN_ISSUER ||
    claims.aud !== TOKEN_AUDIENCE ||
    Date.now() / 1000 > claims.exp
  ) {
    throw new AppError(401, "Token expired", "Unauthorized");
  }
  return claims;
}


export interface AuthRequest extends Request {
  auth?: AuthClaims;
}

export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new AppError(401, "Missing bearer token", "Unauthorized");
    }
    (req as AuthRequest).auth = verifyAccessToken(
      header.slice("Bearer ".length).trim()
    );
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Solo MANAGER del hotel del path o SUPER_ADMIN global.
 * Requiere `validate(hotelIdParamSchema, "params")` antes.
 */
export function requireHotelManager(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const auth = (req as AuthRequest).auth;
  if (!auth) {
    next(new AppError(401, "Missing bearer token", "Unauthorized"));
    return;
  }
  if (auth.role === "SUPER_ADMIN") {
    next();
    return;
  }
  if (auth.role !== "MANAGER" || auth.hotel_id !== req.params.hotelId) {
    next(new AppError(403, "Manager of this hotel required", "Forbidden"));
    return;
  }
  next();
}
