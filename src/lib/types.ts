import { z } from 'zod';

export const AgriAssistFormSchema = z.object({
  nitrogen: z.coerce.number().min(0, "Value must be non-negative").max(200, "Value seems too high"),
  phosphorus: z.coerce.number().min(0, "Value must be non-negative").max(200, "Value seems too high"),
  potassium: z.coerce.number().min(0, "Value must be non-negative").max(200, "Value seems too high"),
  temperature: z.coerce.number().min(-50, "Value seems too low").max(100, "Value seems too high"),
  humidity: z.coerce.number().min(0, "Value must be non-negative").max(100, "Value must be 100 or less"),
  ph: z.coerce.number().min(0, "Value must be between 0 and 14").max(14, "Value must be between 0 and 14"),
  rainfall: z.coerce.number().min(0, "Value must be non-negative").max(1000, "Value seems too high"),
});

export type AgriAssistFormData = z.infer<typeof AgriAssistFormSchema>;

export interface CropData {
  crop: string;
  score: number;
}

export interface FertilizerData {
  fertilizer: string;
  dosage: string;
}
