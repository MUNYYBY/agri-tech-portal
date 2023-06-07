import React, { useContext } from "react";
import { Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  DropdownButton,
} from "react-bootstrap";
import SearchBox from "./SearchBox";
import { logout } from "../actions/userActions";

import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import LocaleContext from "../context/LocaleContext";

import { useLocation } from "react-router-dom";

const Header = (props) => {
  //** Tranalation */
  const { t } = useTranslation();

  const location = useLocation();

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  const { locale } = useContext(LocaleContext);

  function changeLocale(l) {
    if (locale !== l) {
      i18n.changeLanguage(l);
    }
  }

  return (
    <>
      {!location.pathname.includes("admin") ? (
        <header>
          <Navbar
            bg="dark"
            variant="dark"
            expand="lg"
            collapseOnSelect
            className="pl-5 pr-3"
          >
            <LinkContainer to="/">
              <Navbar.Brand>Agri-Tech Portal</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <div style={{ marginRight: "2rem" }}>
                  <Route
                    render={({ history }) => <SearchBox history={history} />}
                  />
                </div>
                <NavDropdown
                  title={t("language")}
                  id="basic-nav-dropdown"
                  onSelect={(e) => {
                    changeLocale(e);
                  }}
                >
                  <NavDropdown.Item eventKey={"en"}>English</NavDropdown.Item>
                  <NavDropdown.Item eventKey={"ur"}>اردو</NavDropdown.Item>
                </NavDropdown>
                <LinkContainer to="/cart" style={{ fontSize: "13px" }}>
                  <Nav.Link>
                    <i className="fas fa-shopping-cart"></i> {t("cart")}
                  </Nav.Link>
                </LinkContainer>
                {userInfo ? (
                  <NavDropdown
                    title={userInfo.name.replace(/\"/g, "")}
                    id="username"
                    style={{ fontSize: "13px" }}
                  >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>{t("profile")}</NavDropdown.Item>
                    </LinkContainer>
                    {!userInfo.isAdmin ? (
                      <LinkContainer to="/request">
                        <NavDropdown.Item>
                          {t("Become seller")}
                        </NavDropdown.Item>
                      </LinkContainer>
                    ) : (
                      ""
                    )}
                    {userInfo.isAdmin ? (
                      <>
                        {userInfo.superAdmin ? (
                          <LinkContainer to="/admin/userlist">
                            <NavDropdown.Item>{t("Users")}</NavDropdown.Item>
                          </LinkContainer>
                        ) : (
                          ""
                        )}

                        <LinkContainer to="/dashboard">
                          <NavDropdown.Item>{t("Dashboard")}</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/admin/productlist">
                          <NavDropdown.Item>{t("Products")}</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/admin/orderlist">
                          <NavDropdown.Item>{t("Orders")}</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/admin/categorylist">
                          <NavDropdown.Item>{t("Category")}</NavDropdown.Item>
                        </LinkContainer>
                      </>
                    ) : (
                      ""
                    )}
                    <NavDropdown.Item onClick={logoutHandler}>
                      {t("Logout")}
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <LinkContainer to="/login" style={{ fontSize: "13px" }}>
                    <Nav.Link>
                      <i className="fas fa-user"></i> {t("Sign in")}
                    </Nav.Link>
                  </LinkContainer>
                )}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </header>
      ) : (
        <div
          style={{
            height: "100vh",
            width: "15rem",
            position: "fixed",
            left: 0,
            top: 0,
            backgroundColor: "gray",
          }}
        >
          <LinkContainer to="/">
            <Navbar.Brand>Agri-Tech Admin Panel</Navbar.Brand>
          </LinkContainer>
          {userInfo.isAdmin ? (
            <>
              {userInfo.superAdmin ? (
                <LinkContainer to="/admin/userlist">
                  <NavDropdown.Item>{t("Users")}</NavDropdown.Item>
                </LinkContainer>
              ) : (
                ""
              )}

              <LinkContainer to="/dashboard">
                <NavDropdown.Item>{t("Dashboard")}</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/admin/productlist">
                <NavDropdown.Item>{t("Products")}</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/admin/orderlist">
                <NavDropdown.Item>{t("Orders")}</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/admin/categorylist">
                <NavDropdown.Item>{t("Category")}</NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Item onClick={logoutHandler}>
                {t("Logout")}
              </NavDropdown.Item>
            </>
          ) : (
            ""
          )}
        </div>
      )}
    </>
  );
};

export default Header;
