import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import ProjectOverviewTable from "../components/projects/ProjectOverviewTable";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import '@testing-library/jest-dom';

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next-i18next", () => ({
  useTranslation: jest.fn(() => ({ t: (key: any) => key })),
}));

describe("ProjectOverviewTable", () => {
  const mockPush = jest.fn();
  const mockOnDeleteProject = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  const projects = [
    { projectId: "1", name: "Project 1" },
    { projectId: "2", name: "Project 2" },
  ];

  it("renders project names", () => {
    render(<ProjectOverviewTable projects={projects} onDeleteProject={mockOnDeleteProject} />);

    expect(screen.getByText("Project 1")).toBeInTheDocument();
    expect(screen.getByText("Project 2")).toBeInTheDocument();
  });



  it("navigates to project page on double click", () => {
    render(<ProjectOverviewTable projects={projects} onDeleteProject={mockOnDeleteProject} />);

    const rows = screen.getAllByRole("row").slice(1); // Ignore header row
    fireEvent.doubleClick(rows[0]);

    expect(mockPush).toHaveBeenCalledWith("/projects/1");
  });

  it("navigates to project page on select button click", () => {
    render(<ProjectOverviewTable projects={projects} onDeleteProject={mockOnDeleteProject} />);

    fireEvent.click(screen.getAllByText("project.select")[0]);
    expect(mockPush).toHaveBeenCalledWith("/projects/1");
  });

  it("retrieves user role from sessionStorage on mount", () => {
    jest.spyOn(Storage.prototype, "getItem").mockReturnValue("admin");

    render(
      <ProjectOverviewTable
        projects={projects}
        onDeleteProject={mockOnDeleteProject}
      />
    );

    expect(sessionStorage.getItem).toHaveBeenCalledWith("userRole");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
