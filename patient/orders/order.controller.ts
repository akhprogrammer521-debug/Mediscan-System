import { Request, Response } from "express";
import { created, ok } from "../../../common/utils/apiResponse";
import * as service from "./order.service";
import { auditLog } from "../../../common/services/auditLog.service";
import prisma from "../../../config/database";


export const createOrder = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const patient = await prisma.patient.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!patient) {
    throw new Error("المستخدم ليس مريضًا");
  }

  const order = await service.createOrder(patient.id, req.body);

  auditLog("PATIENT_CREATE_ORDER", {
    userId,
    patientId: patient.id,
    orderId: order.id,
  });

  return created(res, order);
};


export const getMyOrders = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const patient = await prisma.patient.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!patient) {
    throw new Error("المستخدم ليس مريضًا");
  }

  const orders = await service.getMyOrders(patient.id);
  return ok(res, orders);
};


export const deleteOrder = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const patient = await prisma.patient.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!patient) {
    throw new Error("المستخدم ليس مريضًا");
  }

  await service.cancelOrder(patient.id, Number(req.params.id));
  return ok(res, { deleted: true });
};
