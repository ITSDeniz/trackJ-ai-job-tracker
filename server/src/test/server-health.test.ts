import { describe, it, expect, vi } from "vitest";
import { healthRouter } from "../delivery/http/routes/healthRouter.js";
import type { Request, Response } from "express";

describe("Health Router", () => {
  it("should return 200 OK with status ok", () => {
    const mockRequest = {} as Request;

    const mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;

    // Find the handler for GET /
    const route = healthRouter.stack.find((layer) => layer.route?.path === "/");
    expect(route).toBeDefined();

    const handler = route!.route!.stack[0]!.handle;
    handler(mockRequest, mockResponse, () => {});

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: {
        status: "ok",
      },
    });
  });
});
