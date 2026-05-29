import { z } from "zod";

export const requiredString = (field: string) =>
  z.string().min(1, {
    message: `${field} is required`,
  });

export const positiveNumber = (field: string) =>
  z
    .number({
      message: `${field} must be a number`,
    })
    .positive({
      message: `${field} must be positive`,
    });

export const requiredDate = (field: string) =>
  z.date({
    message: `${field} is invalid`,
  });

export { z };
