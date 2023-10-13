import React, { useEffect, useRef } from "react";

import UserTableLoader from "./UserTableLoader";

const UserTableBody = ({ users, columnOrder, totalUsers }) => {
  const formatData = (column, value) => {

    debugger;
    switch (column) {
      case "registered_date":
        return value.toISOString().slice(0, 10);
      case "is_private":
        return value ? "Yes" : "No";
      default:
        return value;
    }
  };

  return (
    <tbody>
      {users.map((user) => (
        <tr key={user.id}>
          {columnOrder.map((column) => (
            <td role="cell" key={column}>
              {formatData(column, user[column])}
            </td>
          ))}
        </tr>
      ))}
      {users.length < totalUsers && (
        <UserTableLoader colSpan={columnOrder.length} />
      )}
    </tbody>
  );
};

export default UserTableBody;
