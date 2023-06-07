import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Card, Button } from "react-bootstrap";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";
import { listProducts } from "../actions/productActions";
import { listCategory } from "../actions/categoryActions";
import { Container } from "react-bootstrap";
import { CATEGORY_DELETE_SUCCESS } from "../constants/categoryConstant";
import { useTranslation } from "react-i18next";

const HomeScreen = ({ match }) => {
  const [limit, setLimit] = useState(12);
  const keyword = match.params.keyword;

  const pageNumber = match.params.pageNumber || 1;

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const categorylist = useSelector((state) => state.categoryList);
  const { loading, error, products, page, pages } = productList;

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(listProducts(keyword, pageNumber));
    dispatch(listCategory("", ""));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <Meta />
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light">
          {t("Go back")}
          Go Back
        </Link>
      )}
      <Container>
        <h3 className="display-6" style={{ marginTop: "25px" }}>
          {t("Explore Popular Categories")}
        </h3>
        <Row style={{ marginTop: "25px", marginBottom: "25px" }}>
          {categorylist?.category?.map((v, k) => (
            <Col key={v._id} sm={4} md={3} lg={2} xl={2}>
              <Link
                to={{
                  pathname: "/allProduct",
                  state: { message: 0 },
                }}
              >
                <Card.Img
                  src={v.image}
                  variant="top"
                  style={{
                    height: "150px",
                  }}
                />

                <Card.Text
                  style={{
                    textAlign: "center",
                    marginTop: "20px",
                    fontSize: "15px",
                    fontWeight: "700",
                  }}
                >
                  {v.name}
                </Card.Text>
              </Link>
            </Col>
          ))}
        </Row>
        <h3 className="display-6 mt-5 mb-3">{t("Auction")}</h3>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Row>
              {products.slice(0, 4).map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>
            <Paginate
              pages={pages}
              page={page}
              keyword={keyword ? keyword : ""}
            />
          </>
        )}
        <h3 className="display-6 mt-5 mb-3">{t("Daily products")}</h3>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Row>
              {products.slice(4, 8).map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>
            <Paginate
              pages={pages}
              page={page}
              keyword={keyword ? keyword : ""}
            />
          </>
        )}
        <h3 className="display-6 mt-5 mb-3">{t("Latest products")}</h3>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Row>
              {products.slice(8, limit).map((product) => (
                <Col
                  key={product._id}
                  sm={12}
                  md={6}
                  lg={4}
                  xl={3}
                  className="mt-2 mb-2"
                >
                  <Product product={product} />
                </Col>
              ))}
              {limit === 12 ? (
                <Col sm={12}>
                  <Button
                    style={{ width: "100%" }}
                    className="mt-5"
                    onClick={() => setLimit(1000)}
                  >
                    {t("Show more")}
                  </Button>
                </Col>
              ) : (
                <Col sm={12}>
                  <Button
                    style={{ width: "100%" }}
                    className="mt-5"
                    onClick={() => setLimit(12)}
                  >
                    {t("Show less")}
                  </Button>
                </Col>
              )}
            </Row>
            <Paginate
              pages={pages}
              page={page}
              keyword={keyword ? keyword : ""}
            />
          </>
        )}
      </Container>
    </>
  );
};

export default HomeScreen;
