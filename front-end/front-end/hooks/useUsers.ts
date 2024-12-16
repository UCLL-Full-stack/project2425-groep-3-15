// hooks/useUsers.ts
import { useState, useEffect } from "react";
import UserService from "../services/UserService";

export default function useUsers(t: (key: string) => string) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await UserService.getAllUsers();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || t("error.fetchUsers"));
      } finally {
        setLoading(false);
      }
    };

    // Check the user role in sessionStorage
    const userRole = sessionStorage.getItem("userRole");
    if (userRole === "ADMIN") {
      setIsAdmin(true); // Allow access if the user is an admin
      fetchUsers();
    } else {
      setIsAdmin(false); // Deny access otherwise
      setLoading(false);
    }
  }, [t]);

  return { users, loading, error, isAdmin };
}
