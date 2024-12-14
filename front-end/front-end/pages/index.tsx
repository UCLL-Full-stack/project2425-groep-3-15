// pages/index.tsx
import Head from "next/head";
import Header from "@/components/common/Header";
import Logo from "@/components/common/Logo";
import WelcomeText from "@/components/common/WelcomeText";
import CTAButtons from "@/components/common/CTAButtons";
import useUserRole from "@/hooks/useUserRole";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default function Home() {
  const { t } = useTranslation("common");
  const userRole = useUserRole();

  return (
    <>
      <Head>
        <title>{t("app.title")}</title>
        <meta
          name="description"
          content="A tool to help teams plan, execute, and monitor their projects and tasks in real-time."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <Header />
      <main className="flex flex-col items-center px-8 py-16 min-h-screen bg-gray-50 rounded-lg justify-start mt-8">
        <Logo />
        <WelcomeText />
        <CTAButtons userRole={userRole} />
      </main>
    </>
  );
}
