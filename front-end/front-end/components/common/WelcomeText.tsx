import React from "react";
import { useTranslation } from "next-i18next";

const WelcomeText: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <>
      <h1 className="text-5xl font-extrabold text-blue-600 mb-4 text-center">
        {t("app.title")}
      </h1>
      <p className="text-center text-gray-700 text-lg max-w-xl mb-8">
        {t("app.description")}
      </p>
    </>
  );
};

export default WelcomeText;
