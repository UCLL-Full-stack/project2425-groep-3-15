import { StatusMessage } from "@types";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "next-i18next";

const UserSignupForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [statusMessages, setStatusMessages] = useState<
    { message: string; type: string }[]
  >([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  //password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // State to toggle visibility

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible);

  const { t } = useTranslation("common");

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setStatusMessages([]);
  };

  const validate = (): boolean => {
    let result = true;

    if (!email || email.trim() === "") {
      setEmailError(t("signup.emailRequired"));
      result = false;
    }

    if (!password || password.trim() === "") {
      setPasswordError(t("signup.passwordRequired"));
      result = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError(t("signup.passwordMismatch"));
      result = false;
    }

    return result;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    clearErrors();

    if (!validate()) return;

    try {
      const response = await fetch("http://localhost:3000/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          role: "USER", // Default role
        }),
      });

      if (response.ok) {
        setStatusMessages([
          { message: t("signup.successMessage"), type: "success" },
        ]);

        // Clear form fields after success
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        // Redirect to login page after success
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const errorData = await response.json();
        setStatusMessages([
          {
            message: errorData.errors?.[0]?.msg || t("signup.errorMessage"),
            type: "error",
          },
        ]);
      }
    } catch (error) {
      setStatusMessages([{ message: t("signup.errorMessage"), type: "error" }]);
    }
  };

  return (
    <>
      {statusMessages && (
        <div className="row">
          <ul className="list-none mb-3 mx-auto ">
            {statusMessages.map(({ message, type }, index) => (
              <li
                key={index}
                className={classNames({
                  "text-red-800": type === "error",
                  "text-green-800": type === "success",
                  "text-base": true,
                })}
              >
                {message}
              </li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 mb-4">
          {/* First Name */}
          <div className="flex-1">
            <label
              htmlFor="firstNameInput"
              className="block text-black mb-2 font-medium"
            >
              {t("signup.firstName")}
            </label>
            <input
              id="firstNameInput"
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="John" // Placeholder text
              className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>

          {/* Last Name */}
          <div className="flex-1">
            <label
              htmlFor="lastNameInput"
              className="block text-black mb-2 font-medium"
            >
              {t("signup.lastName")}
            </label>
            <input
              id="lastNameInput"
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Doe" // Placeholder text
              className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
        </div>

        {/* Email */}
        <label
          htmlFor="emailInput"
          className="block text-black mb-2 font-medium"
        >
          {t("signup.email")}
        </label>
        <div className="block mb-2 text-sm font-medium">
          <input
            id="emailInput"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="example@email.com" // Placeholder text
            className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          {emailError && <p className="text-red-800">{emailError}</p>}
        </div>

        {/* Password */}
        <label
          htmlFor="passwordInput"
          className="block mb-2 text-black font-medium"
        >
          Password
        </label>
        <div className="relative mb-4">
          <input
            id="passwordInput"
            type={passwordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10"
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
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.13.378-.306.736-.518 1.072m-2.472 2.607A8.994 8.994 0 0112 19c-4.477 0-8.268-2.943-9.542-7a8.956 8.956 0 01.878-1.885M15 12a3 3 0 11-6 0 3 3 0 016 0z"
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

        {/* Confirm Password */}
        <label
          htmlFor="confirmPasswordInput"
          className="block mb-2 text-black font-medium"
        >
          Confirm Password
        </label>
        <div className="relative mb-4">
          <input
            id="confirmPasswordInput"
            type={confirmPasswordVisible ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10"
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
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.13.378-.306.736-.518 1.072m-2.472 2.607A8.994 8.994 0 0112 19c-4.477 0-8.268-2.943-9.542-7a8.956 8.956 0 01.878-1.885M15 12a3 3 0 11-6 0 3 3 0 016 0z"
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

        {/* Already have an account */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            {t("signup.alreadyAccount")}{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              {t("signup.loginLink")}
            </a>
          </p>
        </div>

        {/* Submit Button */}
        <button
          className="text-black bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          type="submit"
        >
          {t("signup.button")}
        </button>
      </form>
    </>
  );
};

export default UserSignupForm;
