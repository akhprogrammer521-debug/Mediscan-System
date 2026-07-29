import { Request, Response } from "express";
import * as service from "./pharmacist.service";
import { loginPharmacistService } from "../auth/pharmacist-auth.service";
import { BadRequestError, ForbiddenError } from "../../common/errors";
import { ok } from "../../common/utils/apiResponse";


export const loginPharmacist = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const data = await loginPharmacistService(username, password);

    return ok(res, data);
  } catch (err: any) {
    return res.status(401).json({
      success: false,
      error: err.message || "Unauthorized",
    });
  }
};


export const getMyProfile = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const user = await service.getMyProfile(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "Profile not found",
    });
  }

  return ok(res, {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
    },
    pharmacist: user.pharmacist ? { id: user.pharmacist.id } : null,
    pharmacy: user.pharmacist?.pharmacy ?? null,
  });
};

export const updateMyProfile = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const profile = await service.updateMyProfile(userId, req.body);

  return ok(res, {
    user: {
      id: profile.id,
      username: profile.username,
      email: profile.email,
      isActive: profile.isActive,
    },
    pharmacy: profile.pharmacist?.pharmacy ?? null,
  });
};


export const getMyStock = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const stock = await service.getMyStock(userId);

  return ok(res, stock);
};

export const addDrugToStock = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const item = await service.addDrugToStock(userId, req.body);

  return res.status(201).json({
    success: true,
    data: item,
  });
};

export const updateStockHandler = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const stockId = Number(req.params.stockId);
  const { quantity, price } = req.body;

  if (quantity == null || price == null) {
    throw new BadRequestError("quantity and price are required");
  }

  const updated = await service.updateStock(userId, stockId, {
    quantity,
    price,
  });

  if (!updated) {
    throw new ForbiddenError("Not allowed");
  }

  return ok(res, updated);
};

export const removeFromStock = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const stockId = Number(req.params.id);

  const deleted = await service.removeFromStock(userId, stockId);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: "Stock item not found",
    });
  }

  return ok(res, true);
};


export const getMyOrders = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const orders = await service.getMyOrders(userId);

  return ok(res, orders);
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const order = await service.updateOrderStatus(
    userId,
    Number(req.params.id),
    req.body.status
  );

  return ok(res, order);
};
