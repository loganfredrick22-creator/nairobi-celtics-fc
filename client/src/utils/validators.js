import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().regex(/^\+254\d{9}$/, 'Phone must be +254XXXXXXXXX'),
  idNumber: z.string().min(1, 'ID number required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords must match', path: ['confirmPassword'] });

export const ticketBuyerSchema = z.object({
  fullName: z.string().min(1, 'Full name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().regex(/^\+254\d{9}$/, 'Phone must be +254XXXXXXXXX'),
  idNumber: z.string().min(1, 'ID number required'),
});

export const deliverySchema = z.object({
  fullName: z.string().min(1, 'Full name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().regex(/^\+254\d{9}$/, 'Phone must be +254XXXXXXXXX'),
  street: z.string().min(1, 'Street address required'),
  city: z.string().min(1, 'City required'),
  county: z.string().min(1, 'County required'),
});

export const contactSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Valid email required'),
  subject: z.string().min(1, 'Subject required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
