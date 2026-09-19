import { z } from 'zod';

export const ADDRESS_LABELS = ['Home', 'Work', 'Other'] as const;

export const addressSchema = z.object({
  label: z.enum(ADDRESS_LABELS),
  line1: z.string().trim().min(3, 'Enter a street address'),
  line2: z.string().trim().min(2, 'Enter an area or landmark'),
  city: z.string().trim().min(2, 'Enter a city'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a 6-digit pincode'),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
