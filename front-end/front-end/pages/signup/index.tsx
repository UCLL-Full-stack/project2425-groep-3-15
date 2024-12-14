// pages/signup/index.tsx
import Head from "next/head";
import Header from "@/components/common/Header";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SignupPageContent from "@/components/signup/SignupPageContent";

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const Signup: React.FC = () => {
  return (
    <>
      <Head>
        <title>Signup</title>
        <meta
          name="description"
          content="Create an account to start planning, executing, and monitoring your tasks and projects."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <Header />
      <SignupPageContent />
    </>
  );
};

export default Signup;
