import React, { useState, useEffect, useRef, useContext } from "react";

import { usePreference } from "../context/PreferenceContext";
import { useAuth } from "../context/AuthContext";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const PAGE_SIZE = 10;

const UserTable = ({ users }) => {
  const tableRef = useRef(null);
  const [displayedUsersCount, setDisplayedUsersCount] = useState(PAGE_SIZE);

  const { columnOrder: order, saveOrder, loadOrder } = usePreference();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = async (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop === clientHeight) {
        await sleep(1000);
        loadMore();
      }
    };
    tableRef.current.addEventListener("scroll", handleScroll);
    return () => {
      if (tableRef.current) {
        tableRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const loadMore = () => {
    if (displayedUsersCount < users.length) {
      setDisplayedUsersCount((prevCount) => prevCount + PAGE_SIZE);
    }
  };

  const columns = [
    { id: "id", label: "ID" },
    { id: "first_name", label: "First Name" },
    { id: "last_name", label: "Last Name" },
    { id: "email", label: "Email Address" },
    { id: "city", label: "City" },
    { id: "registered_date", label: "Registered Date" },
    { id: "is_private", label: "Is Private" },
  ];

  const [columnOrder, setColumnOrder] = useState(order);
  const [sortedBy, setSortedBy] = useState("id");
  const [sortAscending, setSortAscending] = useState(true);

  const handleSort = (column) => {
    if (sortedBy === column) {
      setSortAscending(!sortAscending);
    } else {
      setSortedBy(column);
      setSortAscending(true);
    }
    setDisplayedUsersCount(PAGE_SIZE);
    tableRef.current.scrollTo(0, 0);
  };

  const compareValues = (a, b) => {
    if (a > b) return sortAscending ? 1 : -1;
    if (a < b) return sortAscending ? -1 : 1;
    return 0;
  };

  const sortedUsers = [...users]
    .sort((a, b) => compareValues(a[sortedBy], b[sortedBy]))
    .slice(0, displayedUsersCount);

  const onDragStart = (e, id) => {
    e.target.classList.add("dragging");
    e.dataTransfer.setData("columnId", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragEnd = (e) => {
    e.target.classList.remove("dragging");
  };

  const onDrop = (e, id) => {
    e.preventDefault();

    const draggedId = e.dataTransfer.getData("columnId");
    const newOrder = [...columnOrder];

    const draggedIndex = newOrder.indexOf(draggedId);
    const dropIndex = newOrder.indexOf(id);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, draggedId);

    setColumnOrder(newOrder);
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const formatData = (column, value) => {
    switch (column) {
      case "registered_date":
        return value.toISOString().slice(0, 10);
      case "is_private":
        return value ? "Yes" : "No";
      default:
        return value;
    }
  };

  const handleLoadOrder = () => {
    setColumnOrder(loadOrder());
  };

  const handleSaveOrder = () => {
    saveOrder(columnOrder);
  };

  return (
    <div className="text-align-right">
      {isAuthenticated && (
        <div className="text-align-right">
          <button className="m-2" onClick={() => handleSaveOrder()}>
            Save Order
          </button>
          <button className="m-3" onClick={() => handleLoadOrder()}>
            Load Order
          </button>
        </div>
      )}

      <div className="table-container" ref={tableRef}>
        <table className="table user-table">
          <thead>
            <tr>
              {columnOrder.map((column) => (
                <th
                  key={column}
                  onClick={() => handleSort(column)}
                  className={isAuthenticated ? "draggable" : ""}
                  draggable={isAuthenticated}
                  onDragStart={
                    isAuthenticated ? (e) => onDragStart(e, column) : null
                  }
                  onDrop={isAuthenticated ? (e) => onDrop(e, column) : null}
                  onDragOver={isAuthenticated ? allowDrop : null}
                  onDragEnd={isAuthenticated ? onDragEnd : null}
                >
                  {columns.find((c) => c.id === column).label}{" "}
                  {sortedBy === column && (sortAscending ? "▲" : "▼")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user.id}>
                {columnOrder.map((column) => (
                  <td key={column}>{formatData(column, user[column])}</td>
                ))}
              </tr>
            ))}
            {/* Show loading indicator if there are more users to load */}
            {displayedUsersCount < users.length && (
              <tr>
                <td
                  colSpan={columnOrder.length}
                  style={{ textAlign: "center" }}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/d/de/Ajax-loader.gif"
                    alt="Loading..."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
