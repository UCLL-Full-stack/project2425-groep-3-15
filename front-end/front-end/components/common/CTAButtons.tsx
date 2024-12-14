// components/common/CTAButtons.tsx
import React from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";

type CTAButtonsProps = {
  userRole: string | null;
};

const CTAButtons: React.FC<CTAButtonsProps> = ({ userRole }) => {
  const { t } = useTranslation("common");

  return (
    <div className="flex space-x-4">
      {/* 'Get Started' Button */}
      <Link
        href="/projects"
        className="px-6 py-3 text-white bg-blue-600 rounded-md shadow-md text-lg font-medium hover:bg-blue-700"
      >
        {t("app.cta.getStarted")}
      </Link>

      {/* 'View Users' Button */}
      {userRole === "ADMIN" && (
        <Link
          href="/users"
          className="px-6 py-3 text-blue-600 bg-white rounded-md shadow-md border border-blue-600 text-lg font-medium hover:bg-blue-50"
        >
          {t("app.cta.viewUsers")}
        </Link>
      )}
    </div>
  );
};

export default CTAButtons;
