import { z } from "zod";

export const monthSchema = z.number().int().min(1).max(12);
