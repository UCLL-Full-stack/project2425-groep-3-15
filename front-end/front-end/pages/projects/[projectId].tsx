// pages/projects/[projectId].tsx
import React from "react";
import Head from "next/head";
import Header from "@/components/common/Header";
import ProjectPageContent from "@/components/projects/ProjectPageContent";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const ProjectPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Project Overview</title>
        <link rel="icon" href="/logo.ico" />
      </Head>
      <Header />
      <ProjectPageContent />
    </>
  );
};

export default ProjectPage;
