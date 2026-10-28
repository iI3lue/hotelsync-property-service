import {
  requireHotelManager,
  verifyAccessToken,
} from "../../src/lib/auth.js";
import { AppError } from "../../src/middleware/error-handler.js";
import { signAccessToken } from "../helpers/tokens.js";

const HOTEL_ID = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";

function request(token?: string, hotelId = HOTEL_ID) {
  return {
    headers: token ? { authorization: `Bearer ${token}` } : {},
    params: { hotelId },
  } as any;
}

describe("property auth", () => {
  it("lets the hotel manager through", () => {
    const token = signAccessToken({ sub: "u1", email: "u1@example.com", role: "MANAGER", hotel_id: HOTEL_ID });
    const next = jest.fn();

    // requireAuth is a separate middleware; emulate its effect here
    const req = request(token);
    req.auth = verifyAccessToken(token);
    requireHotelManager(req, {} as any, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("lets SUPER_ADMIN into any hotel", () => {
    const token = signAccessToken({ sub: "u1", email: "u1@example.com", role: "SUPER_ADMIN", hotel_id: null });
    const req = request(token, "bbbbbbbb-cccc-4ddd-8eee-ffffffffffff");
    req.auth = verifyAccessToken(token);
    const next = jest.fn();

    requireHotelManager(req, {} as any, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("rejects a manager of another hotel", () => {
    const token = signAccessToken({ sub: "u1", email: "u1@example.com", role: "MANAGER", hotel_id: HOTEL_ID });
    const req = request(token, "bbbbbbbb-cccc-4ddd-8eee-ffffffffffff");
    req.auth = verifyAccessToken(token);
    const next = jest.fn();

    requireHotelManager(req, {} as any, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });

  it("rejects non-manager roles", () => {
    const token = signAccessToken({ sub: "u1", email: "u1@example.com", role: "GUEST", hotel_id: null });
    const req = request(token);
    req.auth = verifyAccessToken(token);
    const next = jest.fn();

    requireHotelManager(req, {} as any, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });
});
