export const StoreReducer = (state, action) => {
    const { type, payload } = action
    switch (type) {
        case "GET_LISTCART":
            return {
                ...state,
                listpost: payload,
                storeLoading: false
            }
        case "DELETE_CART":
            return {
                ...state,
                listpost: state.listpost.filter(data => data._id !== payload._id)
            }
        case "EDIT_CART":
            return {
                ...state,
                listpost: state.listpost.map(data => data._id === payload._id ? payload : data)
            }
        case "GET_DETAILCART":

            return {
                ...state,
                detail: payload.detail.filter(data => data._id === payload.id),
                detaillCarLoading: false
            }
            case "GET_DETAILCART2":
            return {
                ...state,
                detaillCarLoading: true
            }
        default:
            return state
    }
}