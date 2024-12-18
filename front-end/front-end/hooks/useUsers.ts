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
        console.log("Fetched users:", data);
        setUsers(data);
      } catch (err: any) {
        setError(err.message || t("error.fetchUsers"));
      } finally {
        setLoading(false);
      }
    };

    const userRole = sessionStorage.getItem("userRole");
    if (userRole === "ADMIN") {
      setIsAdmin(true);
      fetchUsers();
    } else {
      setIsAdmin(false);
      setLoading(false);
    }
  }, [t]);

  return { users, loading, error, isAdmin };
}
