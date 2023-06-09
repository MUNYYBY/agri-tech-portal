import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import {
  listProductDetails,
  createProductReview,
} from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";
import { orderType } from "../actions/orderTypeAction";
import { useTranslation } from "react-i18next";

const ProductScreen = ({ location, history, match }) => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    success: successProductReview,
    loading: loadingProductReview,
    error: errorProductReview,
  } = productReviewCreate;
  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    window.scrollTo(0, 0);
    if (successProductReview) {
      setRating(0);
      setComment("");
    }
    if (!product._id || product._id !== match.params.id) {
      dispatch(listProductDetails(match.params.id));
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
  }, [dispatch, match, successProductReview]);

  const addToCartHandler = () => {
    dispatch(orderType("Buy"));
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  };

  const RentHandler = () => {
    dispatch(orderType("Rent"));
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProductReview(match.params.id, {
        rating,
        comment,
      })
    );
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        {t("Go back")}
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={4}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col className="product-detail-ag" md={5}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} ${t("Reviews")}`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>{t("Price")}:</b> {product.price} Rs
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>{t("Description")}:</b> {product.description}
                </ListGroup.Item>
                <ListGroup.Item>
                  <a href="http://localhost:3001" target="_blank">
                    <div
                      class=" btn btn-block  "
                      style={{
                        color: "white",
                        background: "#23BE2E",
                        marginTop: "7px",
                      }}
                    >
                      <i className="fas fa-sms pr-3"></i>
                      {t("Message")}
                    </div>
                  </a>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col className="product-detail-ag-p" md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>{t("Price")}:</Col>
                      <Col>
                        <strong>{product.price} Rs</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>{t("Status")}:</Col>
                      <Col>
                        {product.countInStock > 0
                          ? t("In Stock")
                          : t("Out of stock")}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                    >
                      {t("Buy")}
                    </Button>
                    <Button
                      onClick={RentHandler}
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                    >
                      {t("Rent")}
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col className="reviews-ag" md={12}>
              <h2>{t("Reviews")}</h2>
              {product.reviews.length === 0 && (
                <Message>{t("No reviews")}</Message>
              )}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>{t("Write a Customer Review")}</h2>
                  {successProductReview && (
                    <Message variant="success">
                      {t("Review submitted successfully")}
                    </Message>
                  )}
                  {loadingProductReview && <Loader />}
                  {errorProductReview && (
                    <Message variant="danger">{errorProductReview}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>{t("Rating")}</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">
                            {t("Select")}
                            ...
                          </option>
                          <option value="1">1 - {t("Poor")}</option>
                          <option value="2">2 - {t("Fair")}</option>
                          <option value="3">3 - {t("Good")}</option>
                          <option value="4">4 - {t("Very good")}</option>
                          <option value="5">5 - {t("Excellent")}</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment">
                        <Form.Label>{t("Comment")}</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingProductReview}
                        type="submit"
                        variant="primary"
                      >
                        {t("Submit")}
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      <Link to="/login">Please sign in to write a review</Link>
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
