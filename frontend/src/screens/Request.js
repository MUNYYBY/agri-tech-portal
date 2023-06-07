import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const RequestScreen = ({ history, match }) => {
  const [check, setCheck] = useState();
  const state = useSelector((state) => state.userLogin.userInfo.token);
  const requestHandler = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${state}`,
      },
    };
    axios.get("/api/request/me", config).then(async (res) => {
      if (res.data.length > 0) {
        setCheck(true);
      } else {
        setCheck(false);

        const confi = {
          headers: {
            Authorization: `Bearer ${state}`,
          },
        };
        axios.post("/api/request", {}, confi).then(
          async (res) =>
            await setTimeout(() => {
              setCheck(true);
            }, 50)
        );
      }
    });
  };
  useEffect(() => {
    console.log(check);
    const config = {
      headers: {
        Authorization: `Bearer ${state}`,
      },
    };
    axios.get("/api/request/me", config).then(async (res) => {
      if (res.data.length > 0) {
        await setCheck(true);
      } else {
        await setCheck(false);
      }
    });
  }, [check]);
  return (
    <div className="text-center">
      {check === false ? (
        <>
          <p className="display-5 p-5">
            Are You want To Become Seller Click Here{" "}
          </p>
          <Button onClick={requestHandler}>Request To Become a Seller</Button>
        </>
      ) : check === true ? (
        <>
          <p className="display-5 p-5">You Already Submit Your Request</p>
          <Button onClick={requestHandler} disabled={true}>
            Request To Become a Seller
          </Button>
        </>
      ) : (
        <p className="display-5 p-5">Wait</p>
      )}
    </div>
  );
};

export default RequestScreen;
