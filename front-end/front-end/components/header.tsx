import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Language from "./language/Language";

export default function Header() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State to toggle the logout confirmation modal

  useEffect(() => {
    const user = sessionStorage.getItem("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  const handleLogout = async () => {
    // Call a logout API endpoint to clear the cookie
    await fetch("http://localhost:3000/users/logout", {
      method: "POST",
      credentials: "include", // Include credentials to ensure the cookie is cleared
    });

    // Clear any client-side storage
    sessionStorage.clear();

    // Redirect to login page
    router.push("/login");
  };

  const isActive = (path: string) => router.pathname === path;

  const confirmLogout = () => {
    setShowLogoutModal(true); // Show the logout confirmation modal
  };

  const cancelLogout = () => {
    setShowLogoutModal(false); // Close the modal without logging out
  };

  return (
    <header className="w-full bg-white shadow-md py-3">
      <div className="container mx-auto flex items-center justify-between px-5">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Image
            src="/PMT.png"
            alt="Project Management Tool Logo"
            width={50}
            height={50}
            unoptimized
          />
        </div>

        {/* Navigation - Only visible if logged in */}
        {loggedInUser && (
          <nav>
            <ul className="flex gap-6 items-center">
              <li>
                <Link
                  href="/"
                  className={`${
                    isActive("/")
                      ? "text-blue-500 font-semibold"
                      : "text-gray-700"
                  } hover:text-blue-500 hover:underline`}
                >
                  {t("header.nav.home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className={`${
                    isActive("/projects")
                      ? "text-blue-500 font-semibold"
                      : "text-gray-700"
                  } hover:text-blue-500 hover:underline`}
                >
                  {t("header.nav.projectOverview")}
                </Link>
              </li>
              <li>
                <Link
                  href="/users"
                  className={`${
                    isActive("/users")
                      ? "text-blue-500 font-semibold"
                      : "text-gray-700"
                  } hover:text-blue-500 hover:underline`}
                >
                  {t("header.nav.useroverview")}
                </Link>
              </li>
              <li>
                <a
                  onClick={confirmLogout} // Show the confirmation popup
                  className="hover:underline cursor-pointer text-gray-700 hover:text-red-500"
                >
                  {t("header.nav.logout")}
                </a>
              </li>
            </ul>
          </nav>
        )}

        {/* Language Selector - Always Visible */}
        <div className="flex items-center">
          <Language />
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-100">
            <p className="text-lg font-semibold mb-6 text-center">
              {t("header.logoutConfirmation")}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelLogout}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded"
              >
                {t("header.cancel")}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded"
              >
                {t("header.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
