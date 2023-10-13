import { TOTAL_USERS, PER_PAGE } from "../constants";

export const userTableReducer = (state, action) => {
  switch (action.type) {
    case "INCREASE_USER_COUNT":
      return { ...state, userCount: state.userCount + PER_PAGE };
    case "SET_COLUMN_ORDER":
      return { ...state, columnOrder: action.value };
    case "SET_SORTED_BY":
      return {
        ...state,
        sortedBy: action.value,
        sortAscending: true,
        userCount: PER_PAGE,
      };
    case "TOGGLE_SORT_ASCENDING":
      return {
        ...state,
        sortAscending: !state.sortAscending,
        userCount: PER_PAGE,
      };
    case "START_FETCH_USERS":
      return { ...state, loading: true, error: null };
    case "FETCH_USERS_SUCCESS":
      return { ...state, loading: false, users: action.value, error: null };
    case "FETCH_USERS_ERROR":
      return { ...state, loading: false, error: action.value };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};
