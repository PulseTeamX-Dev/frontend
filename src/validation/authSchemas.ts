import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Пошта є обов'язковою")
    .email("Невірний формат пошти"),
  password: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, { message: "Пароль є обов'язковим" })
    .refine((val) => val.length >= 6, {
      message: "Мінімум 6 символів (без врахування пробілів)",
    }),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Будь ласка, введіть електронну пошту.")
    .email("Невірний формат пошти"),
});

export const inviteSchema = z
  .object({
    password: z
      .string()
      .transform((val) => val.trim())
      .refine((val) => val.length > 0, { message: "Пароль є обов'язковим" })
      .refine((val) => val.length >= 6, {
        message: "Пароль має містити мінімум 6 символів.",
      }),
    confirmPassword: z.string(),
    isAgreed: z.boolean().refine((val) => val === true, {
      message: "Необхідно погодитися з умовами користування.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Паролі не співпадають!",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type InviteFormData = z.infer<typeof inviteSchema>;
