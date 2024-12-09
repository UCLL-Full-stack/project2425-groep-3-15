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

  useEffect(() => {
    const user = sessionStorage.getItem("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
  };

  const isActive = (path: string) => router.pathname === path;

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

        {/* Navigation */}
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
                User Overview
              </Link>
            </li>
            {loggedInUser ? (
              <li>
                <a
                  onClick={handleLogout}
                  className="hover:underline cursor-pointer text-gray-700 hover:text-red-500"
                >
                  {t("header.nav.logout")}
                </a>
              </li>
            ) : (
              <li>
                <Link
                  href="/login"
                  className={`${
                    isActive("/login")
                      ? "text-blue-500 font-semibold"
                      : "text-gray-700"
                  } hover:text-blue-500 hover:underline`}
                >
                  {t("header.nav.login")}
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Language Selector */}
        <div className="flex items-center">
          <Language />
        </div>
      </div>
    </header>
  );
}
