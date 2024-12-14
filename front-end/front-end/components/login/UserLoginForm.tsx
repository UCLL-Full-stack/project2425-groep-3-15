import classNames from "classnames";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "next-i18next";

const UserLoginForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // Toggle password visibility

  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [statusMessages, setStatusMessages] = useState<
    { message: string; type: string }[]
  >([]);
  const { t } = useTranslation("common");

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
    setStatusMessages([]);
  };

  const validate = (): boolean => {
    let result = true;

    if (!email && email.trim() === "") {
      setEmailError(t("login.emailRequired"));
      result = false;
    }

    if (!password || password.trim() === "") {
      setPasswordError(t("login.passwordRequired"));
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

    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Ensures cookies are sent with the request
      });

      if (response.ok) {
        const data = await response.json();
        setStatusMessages([
          { message: t("login.successMessage"), type: "success" },
        ]);

        // Store non-sensitive data locally (e.g., user details, not the token)
        sessionStorage.setItem("loggedInUser", data.fullname);
        sessionStorage.setItem("userRole", data.role);
        sessionStorage.setItem("email", email);

        setTimeout(() => router.push("/"), 2000);
      } else {
        const errorData = await response.json();
        setStatusMessages([
          {
            message: errorData.message || t("login.errorMessage"),
            type: "error",
          },
        ]);
      }
    } catch (error) {
      setStatusMessages([{ message: t("login.errorMessage"), type: "error" }]);
    }
  };

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  return (
    <>
      {statusMessages.length > 0 && (
        <div className="row">
          <ul className="list-none mb-3 mx-auto">
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
        <label
          htmlFor="emailInput"
          className="block text-black mb-2 font-medium"
        >
          {t("login.email")}
        </label>
        <div className="block mb-2 text-sm font-medium">
          <input
            id="emailInput"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          {emailError && <p className="text-red-500">{emailError}</p>}
        </div>

        <label
          htmlFor="passwordInput"
          className="block mb-2 text-black font-medium"
        >
          {t("login.password")}
        </label>
        <div className="relative block mb-2 text-sm font-medium">
          <input
            id="passwordInput"
            type={passwordVisible ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500"
            aria-label="Toggle password visibility"
          >
            {passwordVisible ? (
              // Eye icon for visible password
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
              // Crossed-out eye icon for hidden password
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
          {passwordError && <p className="text-red-500">{passwordError}</p>}
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm">
            {t("login.noAccount")}{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              {t("login.signupLink")}
            </a>
          </p>
        </div>

        <button
          className="text-black bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          type="submit"
        >
          {t("login.button")}
        </button>
      </form>
      <div className="border border-blue-500">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Email</th>
              <th scope="col">Password</th>
              <th scope="col">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>john.admin@example.com</td>
              <td>admin1234</td>
              <td>Admin</td>
            </tr>
            <tr>
              <td>alice.master@example.com</td>
              <td>master1234</td>
              <td>Master</td>
            </tr>
            <tr>
              <td>jane.user@example.com</td>
              <td>user1234</td>
              <td>User</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserLoginForm;
