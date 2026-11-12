export const storageCartreducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_LISTSTORAGE":
      return {
        ...state,
        storageLoading: true,
        listStorage: Array.isArray(payload) ? payload : []
      };

    case "UPDATE_STORAGE_QUANTITY":
      return {
        ...state,
        listStorage: state.listStorage.map((item) =>
          item._id === payload.id
            ? { ...item, quantily: payload.quantily, toltalmoney: payload.toltalmoney }
            : item
        )
      };

    case "SET_QUANLITY":
      return {
        ...state,
        loadingquanlyti: false,
        listStorage: state.listStorage.map((item) =>
          item._id === payload?._id ? payload : item
        )
      };

    case "SET_QUANLITY2":
      return { ...state, loadingquanlyti: payload };

    case "DELETE_STORAGE":
    case "DELETE_USER":
      return {
        ...state,
        listStorage: state.listStorage.filter((item) => item._id !== payload?._id)
      };

    default:
      return state;
  }
};
