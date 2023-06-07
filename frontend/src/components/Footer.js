import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { useLocation } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();
  const location = useLocation();
  return (
    <>
      {!location.pathname.includes("admin") ? (
        <footer
          style={{
            backgroundColor: "black",
            color: "white",
            borderTop: 1,
            borderColor: "white",
          }}
        >
          <hr className="mt-5" />
          <Container>
            <footer className="footer mt-5">
              <div className="container py-2 py-sm-5">
                <div className="row">
                  <div className="col-12 col-sm-6 col-lg-9">
                    <ul className="list-inline">
                      <li className="list-inline-item">
                        {t("Copyright AgriTech")}
                      </li>
                      <li className="list-inline-item">
                        {t("All rights reserved")}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </footer>
          </Container>
        </footer>
      ) : (
        ""
      )}
    </>
  );
};

export default Footer;
