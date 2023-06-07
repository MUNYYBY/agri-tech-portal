import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listUsers, deleteUser } from "../actions/userActions";
import axios from "axios";

import { useLocation } from "react-router-dom";

const UserListScreen = ({ history }) => {
  const [show, setShow] = useState([]);
  const dispatch = useDispatch();
  const state = useSelector((state) => state.userLogin.userInfo.token);
  const location = useLocation();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, successDelete, userInfo]);
  const config = {
    headers: {
      Authorization: `Bearer ${state}`,
    },
  };
  const call = () => {
    axios.get("/api/request", config).then((res) => {
      if (res.data.length > 0) {
        if (users) {
          let arr = [];
          console.log(res.data);
          res.data.map((s) => {
            users.find((v) => (v._id === s.user ? arr.push(v) : ""));
          });
          setShow(arr);
        }
      } else {
        setShow([]);
      }
    });
  };
  useEffect(() => {
    call();
  }, [users]);

  const deleteHandler = (id) => {
    axios.delete(`/api/request/${id}`, config).then((res) => {
      call();
    });
  };

  return (
    <>
      <div
        style={
          location.pathname.includes("admin") ? { marginLeft: "10rem" } : {}
        }
      >
        <h1>Users</h1>
        {!userInfo.superAdmin ? (
          <Message variant="danger">You Have No Right </Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {show?.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <i
                        className="fas fa-check"
                        style={{ color: "green" }}
                      ></i>
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(user._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </>
  );
};

export default UserListScreen;
