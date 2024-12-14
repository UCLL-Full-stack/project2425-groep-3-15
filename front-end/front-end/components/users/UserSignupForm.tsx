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
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible);

  const { t } = useTranslation("common");

  const clearErrors = () => {
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setStatusMessages([]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    clearErrors();

    // Validate fields
    if (!firstName.trim()) {
      setFirstNameError(t("signup.firstNameRequired"));
    }
    if (!lastName.trim()) {
      setLastNameError(t("signup.lastNameRequired"));
    }
    if (!email.trim()) {
      setEmailError(t("signup.emailRequired"));
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(t("signup.invalidEmail"));
    }
    if (!password) {
      setPasswordError(t("signup.passwordRequired"));
    } else if (password.length < 8) {
      setPasswordError(t("signup.passwordTooShort"));
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError(t("signup.passwordsMismatch"));
    }

    // If there are any errors, return early
    if (
      firstNameError ||
      lastNameError ||
      emailError ||
      passwordError ||
      confirmPasswordError
    ) {
      return;
    }

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
        setShowSuccessMessage(true);

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
        if (errorData.error === "Error: User already exists") {
          setEmailError(t("signup.emailAlreadyInUse"));
        } else {
          setStatusMessages([
            {
              message: errorData.errors?.[0]?.msg || t("signup.errorMessage"),
              type: "error",
            },
          ]);
        }
      }
    } catch (error) {
      setStatusMessages([{ message: t("signup.errorMessage"), type: "error" }]);
    }
  };

  return (
    <>
      {statusMessages.length > 0 && (
        <div className="row">
          <ul className="list-none mb-3 mx-auto ">
            {statusMessages.map(({ message, type }, index) => (
              <li
                key={index}
                className={classNames({
                  "text-red-500": type === "error",
                  "text-green-500": type === "success",
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
              placeholder="John"
              className={`border ${
                firstNameError ? "border-red-500" : "border-gray-300"
              } text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            />
            {firstNameError && (
              <p className="text-red-500 text-sm mt-1">{firstNameError}</p>
            )}
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
              placeholder="Doe"
              className={`border ${
                lastNameError ? "border-red-500" : "border-gray-300"
              } text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            />
            {lastNameError && (
              <p className="text-red-500 text-sm mt-1">{lastNameError}</p>
            )}
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
            placeholder="example@email.com"
            className={`border ${
              emailError ? "border-red-500" : "border-gray-300"
            } text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
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
            className={`${
              passwordError || confirmPasswordError
                ? "border-red-500"
                : "border-gray-300"
            } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10`}
          />
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500"
            aria-label="Toggle password visibility"
          >
            {/* SVG icons for visibility */}
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
            className={`${
              confirmPasswordError ? "border-red-500" : "border-gray-300"
            } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10`}
          />
          {confirmPasswordError && (
            <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>
          )}
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500"
            aria-label="Toggle confirm password visibility"
          >
            {/* SVG icons for visibility */}
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
