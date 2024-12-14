import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Language from "./language/Language";
import UserProfile from "./users/UserProfile";

export default function Header() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State to toggle the logout confirmation modal
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    setUserEmail(email);
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // Toggles the modal state
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsModalOpen(false);
    }
  };

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
  useEffect(() => {
    // Retrieve the user's role from sessionStorage
    const role = sessionStorage.getItem("userRole");
    setUserRole(role);

    const user = sessionStorage.getItem("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

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
                  } hover:text-blue-500 hover:underline text-xl font-bold`}
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
                  } hover:text-blue-500 hover:underline text-xl font-bold`}
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
                  } hover:text-blue-500 hover:underline text-xl font-bold`}
                >
                  {t("header.nav.useroverview")}
                </Link>
              </li>
              <li>
                <a
                  onClick={confirmLogout} // Show the confirmation popup
                  className="text-red-500 hover:underline cursor-pointer text-gray-700 hover:text-red-500 text-xl font-bold"
                >
                  {t("header.nav.logout")}
                </a>
              </li>
            </ul>
          </nav>
        )}

        {/* Language Selector and User Profile - Always Visible */}
        <div className="flex items-center gap-4">
          {loggedInUser && (
            <div className="relative">
              <img
                src="/profilevector.jpg"
                alt="User Profile"
                width={45}
                height={45}
                className="cursor-pointer rounded-full shadow-md"
                onClick={toggleModal} // Toggle modal on click
              />
              {isModalOpen && (
                <div
                  ref={modalRef}
                  className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 w-72 bg-white border border-gray-300 rounded-lg shadow-lg z-50"
                >
                  {" "}
                  {loggedInUser && (
                    <UserProfile
                      fullName={loggedInUser}
                      email={userEmail}
                      role={
                        userRole &&
                        userRole
                          .toLowerCase()
                          .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())
                      }
                    />
                  )}
                </div>
              )}
            </div>
          )}
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
