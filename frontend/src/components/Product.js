import React from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import Rating from "./Rating";
import { useTranslation } from "react-i18next";

const Product = ({ product }) => {
  const { t } = useTranslation();
  return (
    <>
      <Card>
        <Card.Img
          variant="top"
          src={product.image}
          style={{ height: "150px" }}
          className="border-bottom"
        />
        <Card.Body>
          <Card.Title
            style={{
              textTransform: "capitalize",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {product.name}
            <p style={{ fontWeight: "800" }}>{product.price}Rs</p>
          </Card.Title>
          <Card.Text>
            <div style={{ height: "9vh", marginTop: "-20px" }}>
              <p>
                {t("Description")}:{product.description.substring(0, 20)} ...
              </p>
            </div>
            <Rating
              value={product.rating}
              text={`${product.numReviews} ${t("Ratings")}`}
            />
          </Card.Text>
          <Link
            to={`/product/${product._id}`}
            style={{ textDecoration: "none" }}
          >
            <div
              className="btn btn-block  btn-outline-dark mt-4"
              style={{
                padding: "8.5px",
                border: "2px solid white",
                color: "#fff",
              }}
            >
              {t("View details")}
            </div>
          </Link>
        </Card.Body>
      </Card>
    </>
  );
};

export default Product;
