import { useState, useEffect } from "react";

export default function useUserRole() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  return userRole;
}
