import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { register } from "../actions/userActions";
import axios from "axios";
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";

const RegisterScreen = ({ location, history }) => {
  const historyss = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    window.scrollTo(0, 0);
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  const submitHandler = async (e) => {
    console.log(password.toString().length, "length");
    e.preventDefault();
    if (name === "") {
      setMessage("Please Enter Name");
    } else if (email === "") {
      setMessage("Please Enter Email");
    } else if (password === "") {
      setMessage("Please Enter Password");
    } else if (password.toString().length < 4) {
      setMessage("Password should be greater than 4  character");
    } else if (password.toString().length > 15) {
      setMessage("Password should be less than 15 character");
    } else if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        await axios
          .post("/api/users", { name, email, password }, config)
          .then((data) => {
            setMessage("Register Succesfully Now Login Your Account");
          });
        historyss.push("/login").catch((error) => {
          setMessage(
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message
          );
        });
      } catch (error) {}
    }
  };

  return (
    <FormContainer>
      <h1>{t("Sign up")}</h1>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name">
          <Form.Label>{t("Name")}</Form.Label>
          <Form.Control
            type="name"
            placeholder={t("Enter Name")}
            value={name}
            onChange={(e) => {
              let value = e.target.value;
              value = value.replace(/[^A-Za-z]/gi, "");

              setName(value);
            }}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>{t("email address")}</Form.Label>
          <Form.Control
            type="email"
            placeholder={t("Enter email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>{t("Password")}</Form.Label>
          <Form.Control
            type="password"
            placeholder={t("Enter password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="confirmPassword">
          <Form.Label>{t("Confirm Password")}</Form.Label>
          <Form.Control
            type="password"
            placeholder={t("Confirm Password")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          {t("Register")}
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          {t("Have an Account")}?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            {t("Sign in")}
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
