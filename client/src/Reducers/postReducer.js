export const postReducer = (state,action)=>{
    const {type,payload}=action
    switch (type) {
            case "DELETE_USER":
            return{
                ...state,
                users:state.users.filter(data=>data._id !== payload._id)
            }
            case "GET_USERADM": 
                return{
                    ...state,
                    users:payload,
                    postloading:false
                }
                case "GET_INFORMATION_AMIN":
                    return{
                        ...state,
                        information:payload
                    }
                    case "FIND_POST":
                    return{
                        ...state,
                        edituser:payload
                    }
                    case "UPLOAD_LISTMEMBER":
                        return{
                            ...state,
                            users:state.users.map(data=>data._id===payload._id?payload:data)
                        }
    
        default:
            return state
    }
    }