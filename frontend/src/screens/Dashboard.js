import React, { useEffect, useState, PureComponent } from "react";
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listOrders } from "../actions/orderActions";
import { VictoryBar, VictoryChart, VictoryTheme } from "victory";

const Dashboard = ({ history }) => {
    const dispatch = useDispatch();
    const [amount, setAmount] = useState(0);
    const [totalOrder, setTotalOrder] = useState(0);
    const [totalPaidOrder, setTotalPaidOrder] = useState(0);
    const [totalUnPaidOrder, setTotalUnPaidOrder] = useState(0);
    const userId = useSelector((state) => state.userLogin.userInfo._id);
    const orderList = useSelector((state) => state.orderList);
    const { loading, error, orders } = orderList;
    const [renderOrder, setRenderOrder] = useState([]);
    const [data, setData] = useState([
        { quarter: 1, earnings: 13000 },
        { quarter: 2, earnings: 16500 },
        { quarter: 3, earnings: 14250 },
        { quarter: 4, earnings: 19000 },
    ]);
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        window.scrollTo(0, 0)
        if (userInfo && userInfo.isAdmin) {
            dispatch(listOrders());
        } else {
            history.push("/login");
        }
    }, [dispatch, history, userInfo]);
    useEffect(() => {
        let or = orders?.filter((or) => or.orderItems[0]?.owner === userId);
        let totalA = or?.reduce((b, order) => b + parseInt(order.totalPrice), 0);
        setAmount(totalA);

        var totalpaid = or?.filter((order) => order.isPaid).length;
        var totalunpaid = or?.filter((order) => !order.isPaid).length;
        var totalLength = or?.length;
        setTotalPaidOrder(totalpaid);
        setTotalUnPaidOrder(totalunpaid);
        setTotalOrder(totalLength);

        setRenderOrder(or);

        const groups = or?.reduce((groups, game) => {
            const date = game.createdAt.split("T")[0];
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(game);
            return groups;
        }, {});

        if (groups) {
            let last = Object.keys(groups).map((date) => {
                let sum = 0;
                groups[date].map((v, k) => {
                    sum = v.totalPrice + sum;
                });
                return { quarter: date, earnings: sum };
            });
            setTimeout(() => setData([...last]), 5);
        }
    }, [orders, userId]);
    return (
         <>
            <h1 className = "mt-2 mb-5" > Dashboard </h1> {
            loading ? ( <Loader />
            ) : error ? ( <Message variant = "danger" > { error } </Message>
            ) : ( <>
                <Row >
                <Col style = {
                    {
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                    }
                }
                xs = { 3 } >
                <h4 style = {
                    { fontSize: "14px" }
                } > Total Amount Of Order </h4>
                 <p style = {
                    { fontWeight: "400" }
                }
                className = "pt-1" > { isNaN(amount) ? 0 : amount }
                Rs </p> </Col>
                <Col style = {
                    {
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                    }
                }
                xs = { 3 } >
                <h4 style = {
                    { fontSize: "14px" }
                } > Total Order </h4>
                <p style = {
                    { fontWeight: "400" }
                }
                className = "pt-1" > { isNaN(totalOrder) ? 0 : totalOrder } </p> 
                </Col>

                <Col style = {
                    {
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                    }
                }
                xs = { 3 } >
                <h4 style = {
                    { fontSize: "14px" }
                } > Total Paid Order </h4> 
                <p style = {
                    { fontWeight: "400" }
                }
                className = "pt-1" > { isNaN(totalPaidOrder) ? 0 : totalPaidOrder } </p>
                 </Col>

                <Col style = {
                    {
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                    }
                }
                xs = { 3 } >
                <h4 style = {
                    { fontSize: "14px" }
                } > Total UnPaid Order </h4> 
                <p style = {
                    { fontWeight: "400" }
                }
                className = "pt-1" > { isNaN(totalUnPaidOrder) ? 0 : totalUnPaidOrder } </p>
                 </Col>
                <Col xs = { 12 } > {
                    data.length > 0 ? ( <VictoryChart width = { 950 }
                        height = { 400 } >
                        <VictoryBar alignment = "start"
                        data = { data }
                        // data accessor for x values
                        x = "quarter"
                        // data accessor for y values
                        y = "earnings" />
                        </VictoryChart>
                    ) : (
                        ""
                    )
                } </Col> </Row > </>
            )
        } 
        </>
);
};

export default Dashboard;