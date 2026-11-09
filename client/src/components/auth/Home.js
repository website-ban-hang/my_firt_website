
import React, { useContext, useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import img from "../../assets/game2.jpeg";

import { Authcontext } from "../../contexts/Authcontext";
import { storeContext } from "../../contexts/StoreContext";

const Home = () => {
  const push = useNavigate();

  const { logoutUser, checkuseradm, storeLoading } =
    useContext(Authcontext);

  const { listpost } = useContext(storeContext);

  const data = Array.isArray(listpost) ? listpost : [];

  // Phân trang
  const [currenPage, setcurrenPage] = useState(0);
  const postPerPage = 10;

  const totalpost = Math.ceil(data.length / postPerPage);

  const newlist = data.slice(
    currenPage * postPerPage,
    (currenPage + 1) * postPerPage
  );

  const path = "http://localhost:3400/";

  const PageNext = (number) => {
    setcurrenPage(number);
  };

  if (storeLoading) {
    return (
      <Spinner
        className="landing-inner"
        animation="border"
        variant="info"
      />
    );
  }

  return (
    <div className="containerHome mt-3">

      {checkuseradm === false && (
        <Button
          onClick={logoutUser}
          variant="danger"
          className="font-weight-bolder text-white"
        >
          <img
            src={img}
            alt="logoutIcon"
            width="32"
            height="20"
            className="mr-2 success"
          />
          <p>Logout</p>
        </Button>
      )}

      <Row sm={5}>
        {newlist.map((item, index) => (
          <Col
            className="mt-1"
            style={{ height: "22rem", width: "14rem" }}
            key={item._id || index}
          >
            <Card
              className="cart"
              style={{
                maxHeight: "18rem",
                minHeight: "18rem",
                maxWidth: "13rem",
              }}
            >
              <Card.Img
                style={{
                  maxHeight: "10rem",
                  minHeight: "10rem",
                  maxWidth: "8rem",
                  minWidth: "100%",
                }}
                variant="top"
                src={
                  item.img
                    ? path + item.img
                    : img
                }
              />

              <Card.Body>
                <Card.Title className="texttile">
                  {item.title || "Chưa có tên sản phẩm"}
                </Card.Title>

                <Card.Text
                  className="ellipsis"
                  style={{ minHeight: "1rem" }}
                >
                  {item.status || ""}
                </Card.Text>

                <Card.Text
                  style={{ maxHeight: "2rem" }}
                  className="ellipsis2"
                >
                  Giá:{" "}
                  {item.money == null
                    ? "Chưa cập nhật"
                    : Number(item.money).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                </Card.Text>
              </Card.Body>
            </Card>

            <Button
              style={{ marginBottom: "15px" }}
              variant="success"
            >
              Sản phẩm
            </Button>
          </Col>
        ))}
      </Row>

      <div className="page-item-div">
        {Array.from({ length: totalpost }, (_, index) => (
          <Link
            onClick={() => PageNext(index)}
            key={index}
            to="#"
            className="page-item"
            style={{
              fontWeight: currenPage === index ? "bold" : "normal",
            }}
          >
            {index + 1}
          </Link>
        ))}
      </div>

    </div>
  );
};

export default Home;
