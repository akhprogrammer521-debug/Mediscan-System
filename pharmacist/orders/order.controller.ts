import { Request, Response } from "express";
import * as service from "./order.service";


export const getOrdersForPharmacist = async (
  req: Request,
  res: Response
) => {
  const userId = req.user!.userId;
  const orders = await service.getOrdersForPharmacist(userId);
  return res.json({ success: true, data: orders });
};

export const acceptOrder = async (req: Request, res: Response) => {
  const data = await service.acceptOrder(
    req.user!.userId,
    Number(req.params.id)
  );
  res.json({ success: true, data });
};

export const updateOrderStatus = async (
  req: Request,
  res: Response
) => {
  const userId = req.user!.userId;
  const order = await service.updateOrderStatus(
    userId,
    Number(req.params.id),
    req.body.status
  );
  return res.json({ success: true, data: order });
};
