import React, { FC } from 'react';
import { User } from '@/types';

type Props = {
  users: User[];
  onAddUser: (userId: string) => void;
};

const UsersTable: FC<Props> = ({ users, onAddUser }) => {
  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th>User Id</th>
          <th>Name</th>
          <th>Email</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={index}>
            <td>{user.id}</td>
            <td>{`${user.firstName} ${user.lastName}`}</td>
            <td>{user.email}</td>
            <td>
              <button onClick={() => onAddUser(user.id)} className="btn btn-primary">
                Add User to Project
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTable;