import React from "react";

type User = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

type OverviewUsersProps = {
  users: User[];
};

const OverviewUsers: React.FC<OverviewUsersProps> = ({ users = [] }) => {
  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.userId}>
            <td>
              {user.firstName} {user.lastName}
            </td>
            <td>{user.email}</td>
            <td>{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OverviewUsers;
