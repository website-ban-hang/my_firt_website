export const authReducer = (state,action)=>{
const {type,payload:{isAuathenticated,user,checkuseradm,listUserADMIN}}=action
switch (type) {
        case "SET_AUTH":
        return{
            ...state,
            authloading:false,
            isAuathenticated,
            user,
            checkuseradm,
            storeLoading:false
        }
    default:
        return state
}
}