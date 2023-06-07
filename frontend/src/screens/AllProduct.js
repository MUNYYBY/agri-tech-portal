import React, { useEffect, useState } from "react";
import { Row, Col, Form, Container, Pagination } from "react-bootstrap";
import { listProducts } from "../actions/productActions";
import { listCategory } from "../actions/categoryActions";
import Product from "../components/Product";
import Loader from "../components/Loader";

import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
function AllProduct({ match }) {
  const keyword = match.params.keyword;

  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const categorylist = useSelector((state) => state.categoryList);
  const [active, setActive] = useState(0);
  const { products, loading } = productList;
  const [allProducts, setAllProduct] = useState([]);
  const [lengths, setLengths] = useState(1);
  const [catId, setCatId] = useState(["all"]);
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0)
    dispatch(listProducts(keyword, ""));
    dispatch(listCategory("", ""));
  }, [dispatch, keyword]);
  useEffect(() => {
    let p = products;
    if (catId.includes("all")) {
      setAllProduct(products);
    } else {
      p = products?.filter((s) => s.category?._id === catId);
      setAllProduct(p);
    }

    setLengths(p?.length);
  }, [catId, productList]);

  useEffect(() => {
    if (location?.state?.message) {
      setCatId(location?.state.message);
      console.log(location.state.message);
    }
  }, []);
  return (
    <Container fluid="md">
      {loading ? <Loader /> : ""}
      <Row className="mt-5">
        <Col lg={2} md={3} sm={4} xs={4}>
          <p style={{ fontWeight: "800" }}>Categories</p>
          <div style={{ fontWeight: "400", fontSize: "12px" }}>
            <span>
              <Form.Check
                onChange={(e) => {
                  setCatId("all");
                  setActive(0);
                }}
                type="checkbox"
                label="All"
                checked={catId === "all"}
              />
            </span>
          </div>
          {categorylist?.category?.map((v, k) => (
            <div style={{ fontWeight: "400", fontSize: "12px" }}>
              <span>
                <Form.Check
                  onChange={(e) => setCatId(v._id)}
                  type="checkbox"
                  label={v.name}
                  checked={v._id === catId}
                />
              </span>
            </div>
          ))}
        </Col>
        <Col lg={10} md={9} sm={8} xs={8}>
          <Row>
            {allProducts?.slice(active * 6, active * 6 + 6)?.map((product) => (
              <Col
                key={product._id}
                sm={12}
                md={6}
                lg={4}
                xl={4}
                className="pt-3 pb-3"
              >
                <Product product={product} />
              </Col>
            ))}
          </Row>

          <Pagination
            className="mt-5"
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {lengths > 0
              ? new Array(Math.ceil(lengths / 6)).fill(1).map((v, k) => (
                  <Pagination.Item
                    active={active === k}
                    onClick={() => setActive(k)}
                  >
                    {k + 1}
                  </Pagination.Item>
                ))
              : ""}
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
}
export default AllProduct;
