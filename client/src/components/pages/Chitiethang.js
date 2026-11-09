import React from 'react'
import { useParams } from 'react-router-dom'
import data from '../data/data'

const Chitiethang = () => {
    const params = useParams()
    const dataa = data.find(mathang=>mathang.title===params.chitiet)
    return (
        <h1>
      {
      dataa ? ` ${dataa?.title}` : "KHông có mặt hàng"}
        </h1>
    )
}

export default Chitiethang
