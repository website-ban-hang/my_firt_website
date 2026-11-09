import React from 'react'
import { Alert } from 'react-bootstrap'

const AlertMessage = ({info}) => {
    return info ===null?null:(<Alert className='AlertMesage' variant={info.type}>{info.message}</Alert>)
}

export default AlertMessage
