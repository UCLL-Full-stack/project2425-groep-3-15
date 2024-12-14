import React from "react";
import { useTranslation } from "next-i18next";
import UserLoginForm from "./UserLoginForm";
const LoginPageContent: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <main className="flex flex-col items-center px-8 py-8 min-h-screen bg-gray-50 rounded-lg justify-start mt-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">
        {t("login.title")}
      </h1>
      <UserLoginForm />
    </main>
  );
};

export default LoginPageContent;
