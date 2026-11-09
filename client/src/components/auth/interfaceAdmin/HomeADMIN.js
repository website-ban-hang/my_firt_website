import React, { useContext, useEffect } from 'react'
import { Carousel  } from 'react-bootstrap'
import img from "../../../assets/game2.jpeg"
import img2 from "../../../assets/game3.jpeg"
import img3 from "../../../assets/game20.jpeg"
import { storeContext } from '../../../contexts/StoreContext'

const HomeADMIN = () => {

    return (
        <div>
               <Carousel variant="dark">
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={img3}
                            alt="First slide"
                        />
                        <Carousel.Caption>
                            <h5>First slide label</h5>
                            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={img}
                            alt="Second slide"
                        />
                        <Carousel.Caption>
                            <h5>Second slide label</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={img2}
                            alt="Third slide"
                        />
                        <Carousel.Caption>
                            <h5>Third slide label</h5>
                            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                        </Carousel.Caption>

                    </Carousel.Item>
                </Carousel>
        </div>
    )
}

export default HomeADMIN
