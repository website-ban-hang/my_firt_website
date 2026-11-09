export const storageCartreducer = (state, action) => {
    const { type, payload } = action
    switch (type) {
        case "SET_LISTSTORAGE":
            return {
                ...state,
                storageLoading: true,
                listStorage: payload
            }

        case "SET_QUANLITY":
            return {
                ...state,
                loadingquanlyti: false,
                listStorage: state.listStorage.map(data => data._id === payload._id ? payload : data)
            }
        case "SET_QUANLITY2":
            return {
                ...state,
                loadingquanlyti: payload,
            }
        case "DELETE_USER":
            return {
                ...state,
                listStorage:state.listStorage.filter(data=>data._id !== payload._id)
            }


        default:
            return state
    }
}