import React, {
  useState,
  useEffect,
  useReducer,
  useRef,
  useContext,
} from "react";

import UserTableControls from "./UserTableControls";
import UserTableHeader from "./UserTableHeader";
import UserTableBody from "./UserTableBody";
import UserTableLoader from "./UserTableLoader";

import { usePreference } from "../context/PreferenceContext";
import { useAuth } from "../context/AuthContext";

import { sleep } from "../utils";
import { TOTAL_USERS, PER_PAGE } from "../constants";

import { userTableReducer } from "../reducers/userTableReducer";

const UserTable = () => {
  const containerRef = useRef(null);

  const { columnOrder: order } = usePreference();
  const { isAuthenticated } = useAuth();

  const columns = [
    { id: "id", label: "ID" },
    { id: "full_name", label: "Full Name" },
    { id: "email", label: "Email Address" },
    { id: "city", label: "City" },
    { id: "registered_date", label: "Registered Date" },
    { id: "is_private", label: "Is Private" },
  ];

  const initialState = {
    userCount: PER_PAGE,
    columnOrder: order,
    sortedBy: "id",
    sortAscending: true,
    users: [],
    loading: false,
    error: null,
  };

  const [
    { userCount, columnOrder, sortedBy, sortAscending, users, loading, error },
    dispatch,
  ] = useReducer(userTableReducer, initialState);

  const handleSort = (column) => {
    if (sortedBy === column) {
      dispatch({ type: "TOGGLE_SORT_ASCENDING" });
    } else {
      dispatch({ type: "SET_SORTED_BY", value: column });
    }
    containerRef.current?.scrollTo(0, 0);
  };

  const fetchUsers = async () => {
    dispatch({ type: "START_FETCH_USERS" });

    await sleep(1000);

    const currentPage = Math.ceil(userCount / PER_PAGE);
    const url = `/data/users.json?sortedBy=${sortedBy}&sortOrder=${
      sortAscending ? "asc" : "desc"
    }&page=${currentPage}&pageSize=${PER_PAGE}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch users.");
      }
      const data = await response.json();
      dispatch({ type: "FETCH_USERS_SUCCESS", value: data });
    } catch (error) {
      dispatch({ type: "FETCH_USERS_ERROR", value: error.message });
    }
  };

  const compareValues = (a, b) => {
    if (a > b) return sortAscending ? 1 : -1;
    if (a < b) return sortAscending ? -1 : 1;
    return 0;
  };

  const sortedUsers = [...users]
    .map((user) => ({
      ...user,
      full_name: `${user.first_name} ${user.last_name}`,
      registered_date: new Date(user.registered_date),
    }))
    .sort((a, b) => compareValues(a[sortedBy], b[sortedBy]))
    .slice(0, userCount);

  const handleLoadMore = (currentCount) => {
    if (!loading && currentCount < TOTAL_USERS) {
      dispatch({ type: "INCREASE_USER_COUNT" });
    }
  };

  // On Mount
  useEffect(() => {
    fetchUsers();

    const handleScroll = async (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop === clientHeight) {
        await sleep(1000);
        handleLoadMore(userCount);
      }
    };

    containerRef.current?.addEventListener("scroll", handleScroll);

    return () =>
      containerRef.current?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {isAuthenticated && (
        <UserTableControls dispatch={dispatch} columnOrder={columnOrder} />
      )}

      <div
        ref={containerRef}
        className="table-container"
        style={{ overflowY: "auto", height: "400px" }}
      >
        <table className="table user-table">
          <UserTableHeader
            {...{
              dispatch,
              columns,
              columnOrder,
              isAuthenticated,
              sortedBy,
              sortAscending,
              handleSort,
            }}
          />

          {error && (
            <tbody>
              <tr className="text-danger fw-bold text-center">
                <td colSpan={columns.length}>Error: {error}</td>
              </tr>
            </tbody>
          )}

          {loading && (
            <tbody>
              <tr className="fw-bold text-center">
                <td colSpan={columns.length}>Loading...</td>
              </tr>
            </tbody>
          )}

          {!loading && !error && (
            <UserTableBody
              users={sortedUsers}
              columnOrder={columnOrder}
              totalUsers={TOTAL_USERS}
            />
          )}
        </table>
      </div>
    </>
  );
};

export default UserTable;
