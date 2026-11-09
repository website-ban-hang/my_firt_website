import React from 'react'
import { Link, useParams } from 'react-router-dom'
import dataa from"../data/data"

export const Mathang = () => {
    return (
       <div>
     {dataa.map(data=>(
          <Link key={data.title} to={`login/${data.title}`}>
              {data.title} <p>  </p>
          </Link>
     ))}

       </div>
    )
}
