// components/users/SignupPageContent.tsx
import React from "react";
import UserSignupForm from "@/components/signup/UserSignupForm";
import { useTranslation } from "next-i18next";

const SignupPageContent: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <main className="flex flex-col items-center px-8 py-16 min-h-screen bg-gray-50 rounded-lg justify-start mt-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">
        {t("signup.title")}
      </h1>
      <UserSignupForm />
    </main>
  );
};

export default SignupPageContent;
