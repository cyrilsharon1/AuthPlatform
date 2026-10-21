import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema, resetSchema } from "./authValidation";
describe("authentication validation", () => {
  it("rejects invalid login email and empty password", () => {
    expect(loginSchema.safeParse({ email: "bad", password: "" }).success).toBe(
      false,
    );
  });
  it("requires strong matching registration passwords and accepted terms", () => {
    const values = {
      fullName: "Ava Cole",
      email: "ava@example.com",
      phone: "+2348000000000",
      password: "Savory123",
      confirmPassword: "Savory123",
    };
    expect(registerSchema.safeParse({ ...values, terms: true }).success).toBe(
      true,
    );
    expect(registerSchema.safeParse({ ...values, terms: false }).success).toBe(
      false,
    );
    expect(
      registerSchema.safeParse({
        ...values,
        confirmPassword: "Different8",
        terms: true,
      }).success,
    ).toBe(false);
  });
  it("rejects mismatched reset passwords", () => {
    expect(
      resetSchema.safeParse({
        password: "Delicious8",
        confirmPassword: "Different8",
      }).success,
    ).toBe(false);
  });
});
