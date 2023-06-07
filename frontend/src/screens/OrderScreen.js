import React, { useState, useEffect } from "react";

//** Stripe imports */
import { Elements, CardElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

import { PayPalButton } from "react-paypal-button-v2";
import { Link } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";
import { useTranslation } from "react-i18next";

const stripePromise = loadStripe(
  "pk_test_51MB2yjHR3ue7I09L9gqQLboCeqSMyaWdrAPUU3WeLdYyrA8cIqJM7j65as3A80vQlPaXbWASDSVlQMwDqTmCVjb8005EpecL85"
);

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id;

  const [sdkReady, setSdkReady] = useState(false);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const orderDetails = useSelector((state) => state.orderDetails);
  const orderType = useSelector((state) => state.orderType);

  const { order, loading, error } = orderDetails;

  console.log("Details", order);

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading) {
    //   Calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!userInfo) {
      history.push("/login");
    }

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, orderId, successPay, successDeliver, order]);

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  //** Stripe */

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <h1>{t("Orders")}</h1>
          <Row>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>{t("Shipping")}</h2>
                  <p>
                    <strong>{t("Name")}: </strong> {order?.user?.name}
                  </p>
                  <p>
                    <strong>{t("Email address")}: </strong>{" "}
                    <a href={`mailto:${order?.user?.email}`}>
                      {order?.user?.email}
                    </a>
                  </p>
                  <p>
                    <strong>{t("Address")}:</strong>
                    {order?.shippingAddress?.address},{" "}
                    {order?.shippingAddress?.city}{" "}
                    {order?.shippingAddress?.postalCode},{" "}
                    {order?.shippingAddress?.country}
                  </p>
                  {order.isDelivered ? (
                    <Message variant="success">
                      {t("Delivered")} {order?.deliveredAt}
                    </Message>
                  ) : (
                    <Message variant="danger">{t("Not Delivered")}</Message>
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>{t("Payment Method")}</h2>
                  <p>
                    <strong>{t("Method")}: </strong>
                    {order.paymentMethod}
                  </p>
                  {order.isPaid ? (
                    <Message variant="success">Paid on {order?.paidAt}</Message>
                  ) : (
                    <Message variant="danger">Not Paid</Message>
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>{t("Items")}</h2>
                  {order?.orderItems?.length === 0 ? (
                    <Message>Order is empty</Message>
                  ) : (
                    <ListGroup variant="flush">
                      {order.orderItems.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <Row>
                            <Col md={1}>
                              <Image
                                src={item.image}
                                alt={item.name}
                                fluid
                                rounded
                              />
                            </Col>
                            <Col>
                              <Link to={`/product/${item.product}`}>
                                {item.name}
                              </Link>
                            </Col>
                            <Col md={4}>
                              {item.qty} x ${item.price} = $
                              {item.qty * item.price}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h2>{t("Order Summary")}</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>{t("Items")}</Col>
                      <Col>{order?.orderItems?.length}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>{t("Order Type")}</Col>
                      <Col>{order.orderType}</Col>
                    </Row>
                  </ListGroup.Item>
                  {orderType.type === "Rent" && (
                    <>
                      <ListGroup.Item>
                        <Row>
                          <Col>{t("Start Date")}</Col>
                          <Col>{order?.shippingAddress?.startDate}</Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col>{t("End Date")}</Col>
                          <Col>{order?.shippingAddress?.endDate}</Col>
                        </Row>
                      </ListGroup.Item>
                    </>
                  )}
                  <ListGroup.Item>
                    <Row>
                      <Col>{t("Shipping")}</Col>
                      <Col>{order?.shippingPrice} Rs</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>{t("Tax")}</Col>
                      <Col>{order?.taxPrice} Rs</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>{t("Total")}</Col>
                      <Col>{order?.totalPrice} Rs</Col>
                    </Row>
                  </ListGroup.Item>
                  {!order.isPaid && (
                    <ListGroup.Item>
                      <div style={{ width: "100%" }}>
                        <Elements stripe={stripePromise}>
                          <CheckoutForm onSuccess={successPaymentHandler} />
                        </Elements>
                      </div>
                      {loadingPay && <Loader />}
                      {/* {!sdkReady ? (
                        <Loader />
                      ) : (
                        <PayPalButton
                          amount={order?.totalPrice}
                          onSuccess={successPaymentHandler}
                        />
                      )} */}
                    </ListGroup.Item>
                  )}
                  {loadingDeliver && <Loader />}
                  {userInfo &&
                    userInfo.isAdmin &&
                    order.isPaid &&
                    !order.isDelivered && (
                      <ListGroup.Item>
                        <Button
                          type="button"
                          className="btn btn-block"
                          onClick={deliverHandler}
                        >
                          Mark As Delivered
                        </Button>
                      </ListGroup.Item>
                    )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
//** Stripe  */
function CheckoutForm({ onSuccess }) {
  const [isPaymentLoading, setPaymentLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  //** Fetch payment intent */
  const fetchPaymentIntentClientSecret = async () => {
    var config = {
      method: "get",
      url: `http://13.127.232.204:4001/api/v1/create-payment-intent`,
    };
    const response = await axios(config).then(function (response) {
      console.log(JSON.stringify(response.data));
      return response.data;
    });
    console.log(response);
    return response.clientSecret;
  };

  const payMoney = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setPaymentLoading(true);
    const clientSecret = await fetchPaymentIntentClientSecret();
    const paymentResult = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: "Muneeb ur rehman",
          email: "Muneeburryhman@gmail.com",
        },
      },
    });
    setPaymentLoading(false);
    if (paymentResult.error) {
      alert(paymentResult.error.message);
    } else {
      if (paymentResult.paymentIntent.status === "succeeded") {
        onSuccess({
          id: paymentResult.paymentIntent.id,
          status: paymentResult.paymentIntent.status,
          update_time: paymentResult.paymentIntent.created,
          payer: {
            email_address: "Muneeburryhman@gmail.com",
          },
        });
        alert("Success!");
      }
    }
  };

  return (
    <div
      style={{
        padding: "10px",
        width: "100%",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        <form
          style={{
            width: "100%",
            height: "10rem",
          }}
          onSubmit={payMoney}
        >
          <CardElement
            className="card"
            options={{
              style: {
                base: {
                  backgroundColor: "white",
                  width: "100%",
                  padding: "10px 10px 10px 10px",
                },
              },
            }}
          />
          <button className="pay-button" disabled={isPaymentLoading}>
            {isPaymentLoading ? "Loading..." : "Pay"}
          </button>
        </form>
      </div>
    </div>
  );
}
export default OrderScreen;
