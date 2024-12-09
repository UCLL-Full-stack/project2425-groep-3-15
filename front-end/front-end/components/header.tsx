import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import Language from "./language/Language";

export default function Header() {
  const { t } = useTranslation("common");

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

  return (
    <header className="w-full bg-white shadow-md py-4">
      <div className="container mx-auto flex items-center justify-between px-5">
        <div className="flex items-center space-x-4">
          <Image
            src="/PMT.png"
            alt="Project Management Tool Logo"
            width={50}
            height={50}
            unoptimized
          />
        </div>

        {loggedInUser && (
          <div className="text-gray-700 text-center">
            {t("header.welcome")}, {loggedInUser}!
          </div>
        )}

        <nav>
          <ul className="flex space-x-8 text-gray-700">
            <li>
              <Link href="/" className="hover:underline">
                {t("header.nav.home")}
              </Link>
            </li>
            <li>
              <Link href="/projects" className="hover:underline">
                {t("header.nav.projectOverview")}
              </Link>
            </li>
            <li>
              <Link href="/users" className="text-gray-700 hover:text-blue-500">
                User Overview
              </Link>
            </li>

            {loggedInUser ? (
              <li>
                <a
                  onClick={handleLogout}
                  className="hover:underline cursor-pointer"
                >
                  {t("header.nav.logout")}
                </a>
              </li>
            ) : (
              <li>
                <Link href="/login" className="hover:underline">
                  {t("header.nav.login")}
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <Language />
      </div>
    </header>
  );
}
