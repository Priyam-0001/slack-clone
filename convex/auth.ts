import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { DataModel } from "./_generated/dataModel";
import { z } from "zod";
import { ConvexError } from "convex/values";

const ParamsSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email(),
});

const CustomPassword = Password<DataModel>({
  validatePasswordRequirements: (password: string) => {
    if (
      password.length < 8 ||
      !/\d/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password)
    ) {
      throw new ConvexError("Invalid password. Must be at least 8 characters and include a number, a lowercase letter, and an uppercase letter.");
    }
  },

  profile(params) {
    const { error, data } = ParamsSchema.safeParse(params);
    if (error) {
      throw new ConvexError(error.format());
    }

    return {
      ...(data.name? {name: data.name} : {}),
      email: data.email
    }
  }
})

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    CustomPassword,
    GitHub({
      issuer: "https://github.com/login/oauth",
    }),
    Google
  ],
});
