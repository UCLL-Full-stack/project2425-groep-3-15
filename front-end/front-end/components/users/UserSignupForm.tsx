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

    if (!validate()) {
      return;
    }

    setStatusMessages([
      { message: t("signup.successMessage"), type: "success" },
    ]);
    sessionStorage.setItem("signedUpUser", email);

    setTimeout(() => {
      router.push("/");
    }, 2000);
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
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          {emailError && <p className="text-red-800">{emailError}</p>}
        </div>

        <label
          htmlFor="passwordInput"
          className="block mb-2 text-black font-medium"
        >
          {t("signup.password")}
        </label>
        <div className="block mb-2 text-sm font-medium">
          <input
            id="passwordInput"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          {passwordError && <p className="text-red-800">{passwordError}</p>}
        </div>

        <label
          htmlFor="confirmPasswordInput"
          className="block mb-2 text-black font-medium"
        >
          {t("signup.confirmPassword")}
        </label>
        <div className="block mb-2 text-sm font-medium">
          <input
            id="confirmPasswordInput"
            type="password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
            }}
            className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          {confirmPasswordError && (
            <p className="text-red-800">{confirmPasswordError}</p>
          )}
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm">
            {t("signup.alreadyAccount")}{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              {t("signup.loginLink")}
            </a>
          </p>
        </div>

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
