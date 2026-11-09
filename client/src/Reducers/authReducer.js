export const authReducer = (state, action) => {
  const payload = action.payload || {};
  switch (action.type) {
    case "SET_AUTH":
      return {
        ...state,
        authloading: false,
        isAuathenticated: Boolean(payload.isAuathenticated),
        user: payload.user ?? null,
        checkuseradm: payload.checkuseradm ?? false,
        storeLoading: false,
      };
    case "AUTH_CHECK_FAILED":
      return {
        ...state,
        authloading: false,
      };
    default:
      return state;
  }
};
