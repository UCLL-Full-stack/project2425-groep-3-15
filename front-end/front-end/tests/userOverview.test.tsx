import React from "react";
import { render, screen } from "@testing-library/react";
import OverviewUsers from "../components/users/OverviewUsers";
import { useTranslation } from "next-i18next";
import "@testing-library/jest-dom";

jest.mock("next-i18next", () => ({
  useTranslation: jest.fn(() => ({ t: (key: any) => key })),
}));

describe("OverviewUsers", () => {
  const users = [
    {
      userId: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      role: "Admin",
    },
    {
      userId: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      role: "User",
    },
  ];

  it("renders user details", () => {
    render(<OverviewUsers users={users} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("jane.smith@example.com")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
  });

  it("renders table headers", () => {
    render(<OverviewUsers users={users} />);

    expect(screen.getByText("users.name")).toBeInTheDocument();
    expect(screen.getByText("users.email")).toBeInTheDocument();
    expect(screen.getByText("users.role")).toBeInTheDocument();
  });

  it("renders empty state when no users are provided", () => {
    render(<OverviewUsers users={[]} />);

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(
      screen.queryByText("jane.smith@example.com")
    ).not.toBeInTheDocument();
  });
});
