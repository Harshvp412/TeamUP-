import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { loginStudent } from "../../redux/student/studentActions";

import { Form, Layout, Input, Button, Row, Col, Card, Typography, Image } from "antd";
import openNotification from "../../utils/openAntdNotification";
import "./Login.css";
import { useHistory } from "react-router-dom";
import ForgotLoginModal from "./ForgotPasswordModal/ForgotPasswordModal";

import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
const { Header, Content } = Layout;

const Login = (props) => {
    const [forgotPasswordModalVisbility, setForgotPasswordModalVisbility] = useState(false);
    const screen = useBreakpoint();
    const dispatch = useDispatch();
    const history = useHistory();
    const loginData = useSelector((state) => state.loginData);

    const onFinish = async (values) => {
        let dataToPost = { ...values };

        dispatch(loginStudent(dataToPost, handleSuccess, handleError));
        function handleError(errorMsg) {
            openNotification("error", "Error occured in logging in.", errorMsg);
        }
        function handleSuccess() {
            history.push("/student-dashboard");
        }
    };

    return (
        <>
            <Header style={{ textAlign: "center" }}>
                <Row>
                    <Col span={1}>{screen.md && <Image src="https://ecell.iitm.ac.in/team_up-static/media/e-cell_logo_white.png" alt="E-Cell Logo" />}</Col>
                    <Col flex="auto">
                        <Typography.Title level={2} style={{ color: "#fefefe", margin: 0, lineHeight: "200%" }}>
                            TeamUp <span style={{ fontWeight: "lighter" }}> E-Cell IITM</span>
                        </Typography.Title>
                    </Col>
                    <Col span={1}></Col>
                </Row>
            </Header>
            <Content className="container">
                <ForgotLoginModal
                    visible={forgotPasswordModalVisbility}
                    setVisible={setForgotPasswordModalVisbility}
                    userType="student"
                />
                <Card bordered={true} hoverable={!screen.xs} title="TeamUp Student Login" className="loginCard">
                    <Form size="large" layout="vertical" name="Login" onFinish={onFinish}>
                        <Form.Item
                            label="E-Mail"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your E-Mail!",
                                },
                            ]}>
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your password!",
                                },
                            ]}
                            extra={
                                <Button
                                    onClick={() => setForgotPasswordModalVisbility(true)}
                                    type="link"
                                    style={{ paddingLeft: "0" }}
                                    size="small">
                                    Forgot Password?
                                </Button>
                            }>
                            <Input.Password />
                        </Form.Item>

                        <Row justify="space-between" align="bottom">
                            <Col span={16}>
                                <Typography.Title level={5}>
                                    New here? <Typography.Link href="/student-register">Register</Typography.Link>
                                </Typography.Title>
                            </Col>
                            <Col span={8} style={{ textAlign: "right" }}>
                                <Form.Item style={{ marginBottom: "0px" }}>
                                    <Button type="primary" size="large" htmlType="submit" loading={loginData.loggingIn}>
                                        Log In
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Content>
        </>
    );
};

export default Login;
