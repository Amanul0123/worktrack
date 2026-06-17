const { z } = require('zod');

const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  mobile: z.string().max(20).optional(),
  countryCode: z.string().max(10).optional(),
  country: z.string().max(100).optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  city: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  onboardingDone: z.boolean().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(64),
});

const languageSchema = z.object({
  language: z.enum(['en', 'ar']),
});

module.exports = { updateProfileSchema, changePasswordSchema, languageSchema };
