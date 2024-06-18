'use server';

import * as z from 'zod';

import { ResetSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';
import { generatePasswordResetToken } from '@/lib/tokens';
import { sendResetEmail } from '@/lib/mail';

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid email!' };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: 'Email not found!' };
  }

  const resetPasswordToken = await generatePasswordResetToken(
    existingUser.email
  );

  await sendResetEmail(resetPasswordToken.email, resetPasswordToken.token);

  return { success: 'Reset email sent!' };
};
