import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import { deleteProduct, createProduct } from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
import { CATEGORY_CREATE_RESET } from "../constants/categoryConstant";
import {
  listCategory,
  deleteCategory,
  createCategory,
} from "../actions/categoryActions";

import { useLocation } from "react-router-dom";

const CategoryListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1;

  const location = useLocation();

  const dispatch = useDispatch();

  const categoryList = useSelector((state) => state.categoryList);
  const { loading, error, category, page, pages } = categoryList;

  const categoryDelete = useSelector((state) => state.categoryDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = categoryDelete;

  const categoryCreate = useSelector((state) => state.categoryCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    category: createdCategory,
  } = categoryCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch({ type: CATEGORY_CREATE_RESET });

    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    }

    if (successCreate) {
      history.push(`/admin/category/${createdCategory._id}/edit`);
    } else {
      dispatch(listCategory("", pageNumber));
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdCategory,
    pageNumber,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteCategory(id));
      setTimeout(() => dispatch(listCategory("", pageNumber)), 300);
    }
  };

  const createCategoryHandler = () => {
    dispatch(createCategory());
  };

  return (
    <>
      <div
        style={
          location.pathname.includes("admin") ? { marginLeft: "10rem" } : {}
        }
      >
        <Row className="align-items-center">
          <Col>
            <h1>Category</h1>
          </Col>
          <Col className="text-right">
            <Button className="my-3" onClick={createCategoryHandler}>
              <i className="fas fa-plus"></i> Create Category
            </Button>
          </Col>
        </Row>
        {errorDelete && <Message variant="danger">{errorDelete}</Message>}
        {errorCreate && <Message variant="danger">{errorCreate}</Message>}
        {loading ? (
          ""
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {category?.map((category) => (
                  <tr key={category._id}>
                    <td>{category._id}</td>
                    <td>{category.name}</td>

                    <td>
                      <LinkContainer
                        to={`/admin/category/${category._id}/edit`}
                      >
                        <Button variant="light" className="btn-sm">
                          <i className="fas fa-edit"></i>
                        </Button>
                      </LinkContainer>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(category._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Paginate pages={pages} page={page} isAdmin={true} />
          </>
        )}
      </div>
    </>
  );
};

export default CategoryListScreen;
