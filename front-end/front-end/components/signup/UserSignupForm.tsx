// components/users/UserSignupForm.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import StatusMessages from "../../components/common/StatusMessages";

const UserSignupForm: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation("common");

  // State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [statusMessages, setStatusMessages] = useState<
    { message: string; type: string }[]
  >([]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible((prev) => !prev);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" }); // Clear individual field errors
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t("signup.firstNameRequired");
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = t("signup.lastNameRequired");
    }
    if (!formData.email.trim()) {
      newErrors.email = t("signup.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("signup.invalidEmail");
    }
    if (!formData.password) {
      newErrors.password = t("signup.passwordRequired");
    } else if (formData.password.length < 8) {
      newErrors.password = t("signup.passwordTooShort");
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = t("signup.passwordMustContainNumber");
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = t("signup.passwordMustContainSymbol");
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("signup.passwordsMismatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:3000/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: "USER",
        }),
      });

      if (response.ok) {
        setStatusMessages([
          { message: t("signup.successMessage"), type: "success" },
        ]);
        setTimeout(() => router.push("/login"), 2000); // Redirect after success
      } else {
        const errorData = await response.json();
        if (errorData.error === "Error: User already exists") {
          setErrors({ email: t("signup.emailAlreadyInUse") });
        } else {
          setStatusMessages([
            { message: t("signup.errorMessage"), type: "error" },
          ]);
        }
      }
    } catch (error) {
      setStatusMessages([{ message: t("signup.errorMessage"), type: "error" }]);
    }
  };

  return (
    <>
      <StatusMessages messages={statusMessages} />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 border border-blue-300 rounded-lg shadow"
      >
        <div className="flex gap-4 mb-2">
          {/* First Name */}
          <div className="flex-1">
            <label
              htmlFor="firstName"
              className="block text-black mb-2 font-medium"
            >
              {t("signup.firstName")}
            </label>
            <input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className={`border ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              } text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="flex-1">
            <label
              htmlFor="lastName"
              className="block text-black mb-2 font-medium"
            >
              {t("signup.lastName")}
            </label>
            <input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className={`border ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              } text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <label htmlFor="email" className="block text-black mb-2 font-medium">
          {t("signup.email")}
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={`border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          placeholder="example@email.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2 mt-1">{errors.email}</p>
        )}

        {/* Password */}
        <label htmlFor="password" className="block text-black mb-2 font-medium">
          {t("signup.password")}
        </label>
        <div className="relative mb-4">
          <input
            id="password"
            type={passwordVisible ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            className={`border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500"
            aria-label="Toggle password visibility"
          >
            {passwordVisible ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.13.378-.306.736-.518 1.072m-2.472 2.607A8.994 8.994 0 0112 19c-4.477 0-8.268-2.943-9.542-7a8.956 8.956 0 01.878-1.885"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5c4.5 0 8.285 2.942 9.543 7a10.018 10.018 0 01-1.885 3.3m-2.603 1.899A10.073 10.073 0 0112 19.5c-4.5 0-8.286-2.943-9.543-7a10.073 10.073 0 011.884-3.3m2.604-1.9A10.018 10.018 0 0112 4.5zm0 0c.686 0 1.354.045 2.004.132M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3l18 18"
                />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}

        {/* Confirm Password */}
        <label
          htmlFor="confirmPassword"
          className="block text-black mb-2 font-medium"
        >
          {t("signup.confirmPassword")}
        </label>
        <div className="relative mb-4">
          <input
            id="confirmPassword"
            type={confirmPasswordVisible ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500"
            aria-label="Toggle confirm password visibility"
          >
            {confirmPasswordVisible ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.13.378-.306.736-.518 1.072m-2.472 2.607A8.994 8.994 0 0112 19c-4.477 0-8.268-2.943-9.542-7a8.956 8.956 0 01.878-1.885"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5c4.5 0 8.285 2.942 9.543 7a10.018 10.018 0 01-1.885 3.3m-2.603 1.899A10.073 10.073 0 0112 19.5c-4.5 0-8.286-2.943-9.543-7a10.073 10.073 0 011.884-3.3m2.604-1.9A10.018 10.018 0 0112 4.5zm0 0c.686 0 1.354.045 2.004.132M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3l18 18"
                />
              </svg>
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 mt-6 w-full"
        >
          {t("signup.button")}
        </button>
      </form>
    </>
  );
};

export default UserSignupForm;
