import * as z from 'zod';

export const userInfoSchema = z.object({
  family_name: z
    .string()
    .max(50, { message: 'Invalid family name' })
    .regex(/^[a-z]+$/, { message: 'Invalid family name' }),
  given_name: z
    .string()
    .max(50, { message: 'Invalid given name' })
    .regex(/^[a-z]+$/, { message: 'Invalid given name' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone_number: z
    .string()
    .length(10, { message: 'Phone number should be 10 digits' })
    .regex(/^[0-9]{10}$/, { message: 'Phone number should be 10 digits' }),
});
