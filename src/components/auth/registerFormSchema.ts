
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  town: z.string().min(1, { message: "Town is required" }),
  userType: z.enum(["customer", "rider"]),
  // Payment fields are optional by default, but we'll validate them conditionally based on userType
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
}).refine((data) => {
  // If user type is customer, payment info is required
  if (data.userType === 'customer') {
    return (
      !!data.cardNumber &&
      !!data.cardName &&
      !!data.expiryDate &&
      !!data.cvv &&
      /^\d{16}$/.test(data.cardNumber) &&
      /^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiryDate) &&
      /^\d{3,4}$/.test(data.cvv)
    );
  }
  // For riders, no payment info validation needed
  return true;
}, {
  message: "Payment information is required for customers",
  path: ["cardNumber"], // Show error on the card number field
});
