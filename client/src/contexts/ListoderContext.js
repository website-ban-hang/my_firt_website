import axios from "axios"
import { createContext, useEffect, useReducer } from "react"
import { PORT } from "../constants"
import { ListoderRedecer } from "../Reducers/ListoderRedecer"

export const  ListOderCOntext = createContext()

const ListoderContextProvider=({children})=>{
    const [ListoderState,dispath]=useReducer(ListoderRedecer,{
        loadingListoder:true,
        listtheoder:""
    })
    const {listtheoder,loadingListoder}=ListoderState

    const getlsitcartoder = async () => {
        try {
            const reponse = await axios.get(`${PORT}theoder/`)//admintheoder
            // setlisttheoder( reponse.data.response)
            dispath({type:"SET_LISTTHEODER",payload: {listtheoder:reponse.data.response,loadingListoder:false}})
        } catch (error) {
            return
        }
    }
    const getlsitcartoderadmin = async () => {
        try {
            const reponse = await axios.get(`${PORT}theoder/admintheoder`)//admintheoder
            // setlisttheoder( reponse.data.response)
            dispath({type:"SET_LISTTHEODER",payload: {listtheoder:reponse.data.response,loadingListoder:false}})
        } catch (error) {
            return
        }
    }
    const ListodeContextData={listtheoder,getlsitcartoder,loadingListoder,getlsitcartoderadmin}
    return(
    <ListOderCOntext.Provider value={ListodeContextData}>
        {children}
    </ListOderCOntext.Provider>
        )

}
export default ListoderContextProvider