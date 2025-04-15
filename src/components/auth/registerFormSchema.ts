
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  town: z.string().min(2, "Town must be at least 2 characters"),
  userType: z.enum(["customer", "rider", "vendor"]),
  
  // Fields for customers only
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  
  // Fields for vendors only
  storeName: z.string().optional(),
  storeCategory: z.string().optional(),
});
