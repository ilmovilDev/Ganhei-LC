import { z } from "zod";

export const yearSchema = z.number().int().min(2026).max(3026);
