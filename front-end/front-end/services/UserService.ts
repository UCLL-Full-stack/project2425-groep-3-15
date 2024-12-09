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
  localStorage.setItem("token", data.token); // Store the token in local storage
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

const UserService = {
  login,
  getAllUsers,
  async addUserToProject(projectId: string, userId: string) {
    const token = localStorage.getItem("token");
    return await fetch(`${apiUrl}/projects/${projectId}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
      body: JSON.stringify({ userId }),
    });
  },
};

export default UserService;
