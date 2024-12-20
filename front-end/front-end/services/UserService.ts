const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const login = async (email: string, password: string) => {
  const response = await fetch(`${apiUrl}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to login");
  }

  const data = await response.json();
  return data;
};

const getAllUsers = async () => {
  const response = await fetch(`${apiUrl}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return await response.json();
};

const getUserProjects = async (userId: number) => {
  const response = await fetch(`${apiUrl}/users/${userId}/projects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch projects for user");
  }

  return await response.json();
};

const updateProjectUsers = async (projectId: number, userIds: number[]) => {
  const response = await fetch(`${apiUrl}/projects/${projectId}/users`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userIds }),
  });

  if (!response.ok) {
    throw new Error("Failed to update project users");
  }

  return await response.json();
};

const UserService = {
  login,
  getAllUsers,
  async addUserToProject(projectId: number, userId: number) {
    return await fetch(`${apiUrl}/projects/${projectId}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
  },
  getUserProjects,
  updateProjectUsers,
};

export default UserService;
