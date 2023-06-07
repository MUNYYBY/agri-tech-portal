import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../actions/cartActions";
import moment from "moment";
import { useTranslation } from "react-i18next";

const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const orderType = useSelector((state) => state.orderType);

  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveShippingAddress({
        address,
        city,
        postalCode,
        country,
        startDate,
        endDate,
      })
    );
    history.push("/payment");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>{t("Shipping")}</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <Form.Label>{t("Address")}</Form.Label>
          <Form.Control
            type="text"
            placeholder={t("Enter Address")}
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="city">
          <Form.Label>{t("City")}</Form.Label>
          <Form.Control
            type="text"
            placeholder={t("Enter City")}
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="postalCode">
          <Form.Label>{t("Postal Code")}</Form.Label>
          <Form.Control
            type="text"
            placeholder={t("Enter Postal Code")}
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="country">
          <Form.Label>{t("Country")}</Form.Label>
          <Form.Control
            type="text"
            placeholder={t("Enter Country")}
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>
        {orderType.type === "Rent" && (
          <>
            <Form.Group controlId="startDate">
              <Form.Label>Rent From</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter start date of Rent"
                value={startDate}
                required
                onChange={(e) => setStartDate(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="startDate">
              <Form.Label>Rent To</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter end date of Rent"
                value={endDate}
                required
                onChange={(e) => setEndDate(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </>
        )}

        <Button type="submit" variant="primary">
          {t("Continue")}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
