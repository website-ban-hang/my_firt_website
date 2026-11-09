export const ListoderRedecer=(state,action)=>{
    const {type,payload:{listtheoder,loadingListoder},payload}=action

    switch (type) {
        case "SET_LISTTHEODER":
            return{
                listtheoder:listtheoder,
                loadingListoder:false
            }
    
        default:
            return state
}
}