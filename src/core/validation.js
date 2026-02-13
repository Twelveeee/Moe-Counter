import { z } from "zod";

export const nameSchema = z.string().max(32);

export const counterQuerySchema = z.object({
  theme: z.string().default("moebooru"),
  padding: z.coerce.number().int().min(0).max(16).default(7),
  offset: z.coerce.number().min(-500).max(500).default(0),
  align: z.enum(["top", "center", "bottom"]).default("top"),
  scale: z.coerce.number().min(0.1).max(2).default(1),
  pixelated: z.enum(["0", "1"]).default("1"),
  darkmode: z.enum(["0", "1", "auto"]).default("auto"),
  num: z.coerce.number().int().min(0).max(1e15).default(0),
  prefix: z.coerce.number().int().min(-1).max(999999).default(-1),
});
