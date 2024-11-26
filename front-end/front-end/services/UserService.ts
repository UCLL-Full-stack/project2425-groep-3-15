const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getAllUsers = async () => {
  const response = await fetch(`${apiUrl}/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return await response.json();
};
const getProjectUsers = async (projectId: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/users`);
  return response.json();
};
const addUserToProject = async (projectId: string, userId: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });
  return response.json();
};

const UserService = {
  getAllUsers,
  addUserToProject,
  getProjectUsers,  
};

export default UserService;