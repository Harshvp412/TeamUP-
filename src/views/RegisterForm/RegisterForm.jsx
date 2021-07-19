import React, { useState } from "react";
import { Form, Row, Col, Input, Select, Button, Typography, Layout, Image } from "antd";
import {
    MailOutlined,
    UserOutlined,
    NumberOutlined,
    CalendarOutlined,
    PhoneOutlined,
    KeyOutlined,
    BankOutlined,
    SmileOutlined,
} from "@ant-design/icons";
import layouts from "../../utils/antd-layouts";
import openNotification from "../../utils/openAntdNotification";
import VerificationModal from "./VerificationModal";
import "./RegisterForm.css";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import axios from "axios";

const { Content, Header } = Layout;
const { Option } = Select;

const RegisterForm = () => {
    const [form] = Form.useForm();
    const screen = useBreakpoint();
    const [isVerifyModalVisible, setVerificationModalVisibility] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            setFormValues(values);

            const { password, confirm, ...dataToPost } = values;
            try {
                const res = await axios.post(
                    `https://ecell.iitm.ac.in/data/team-up-portal/mail/verify-student`,
                    dataToPost,
                    { withCredentials: true }
                );
                if (res.data.success) {
                    setLoading(false);
                    setVerificationModalVisibility(true);
                }
            } catch (error) {
                setLoading(false);
                console.log(error);
                openNotification("error", error.response.data.msg || error.message);
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <Header style={{ textAlign: "center" }}>
                <Row>
                    <Col span={1}>
                        {screen.md && (
                            <Image
                                src="https://ecell.iitm.ac.in/team_up-static/media/e-cell_logo_white.png"
                                alt="E-Cell Logo"
                            />
                        )}
                    </Col>
                    <Col flex="auto">
                        <Typography.Title level={2} style={{ color: "#fefefe", margin: 0, lineHeight: "200%" }}>
                            TeamUp <span style={{ fontWeight: "lighter" }}> E-Cell IITM</span>
                        </Typography.Title>
                    </Col>
                    <Col span={1}></Col>
                </Row>
            </Header>
            <Content className="register-form-container">
                <Form
                    form={form}
                    name="register"
                    size="large"
                    layout="vertical"
                    validateTrigger="onSubmit"
                    onFinish={onFinish}>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                name="name"
                                label={
                                    <span>
                                        <UserOutlined /> Name
                                    </span>
                                }
                                rules={[{ required: true, message: "Please enter your name!" }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col {...layouts.halfInLarge}>
                            <Form.Item
                                name="roll"
                                label={
                                    <span>
                                        <NumberOutlined /> Roll no.
                                    </span>
                                }
                                rules={[{ required: true, message: "Please enter your Roll No." }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col {...layouts.halfInLarge}>
                            <Form.Item
                                name="branch"
                                label={
                                    <span>
                                        <BankOutlined /> Branch
                                    </span>
                                }
                                rules={[{ required: true, message: "Please enter your Branch." }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col {...layouts.halfInLarge}>
                            <Form.Item
                                name="phone"
                                validateFirst={true}
                                label={
                                    <span>
                                        <PhoneOutlined /> Phone number
                                    </span>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your phone number!",
                                    },
                                    {
                                        type: "string",
                                        message: "Please enter a valid phone number.",
                                    },
                                    {
                                        pattern: new RegExp(/^[0-9][s./0-9]*$/g),
                                        message: "Please enter a valid phone number.",
                                    },
                                    {
                                        max: 10,
                                        message: "Please enter a valid phone number.",
                                    },
                                    {
                                        min: 10,
                                        message: "Please enter a valid phone number.",
                                    },
                                ]}>
                                <Input prefix="+91" />
                            </Form.Item>
                        </Col>
                        <Col {...layouts.halfInLarge}>
                            <Form.Item
                                name="yearOfStudy"
                                label={
                                    <span>
                                        <CalendarOutlined /> Year of study
                                    </span>
                                }
                                rules={[{ required: true, message: "Please enter your current year of study." }]}>
                                <Select id="yearOfStudy">
                                    <Option key="1st year" value="1st year">
                                        1st year
                                    </Option>
                                    <Option key="2nd year" value="2nd year">
                                        2nd year
                                    </Option>
                                    <Option key="3rd year" value="3rd year">
                                        3rd year
                                    </Option>
                                    <Option key="4th year" value="4th year">
                                        4th year
                                    </Option>
                                    <Option key="5th year" value="5th year">
                                        5th year
                                    </Option>
                                    <Option key="PG/Ph.D" value="PG/Ph.D">
                                        PG/Ph.D
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                dependencies={["roll"]}
                                hasFeedback
                                validateTrigger="onChange"
                                name="email"
                                label={
                                    <span>
                                        <MailOutlined /> E-mail
                                    </span>
                                }
                                rules={[
                                    {
                                        type: "email",
                                        message: "The input is not valid E-mail!",
                                    },
                                    {
                                        required: true,
                                        message: "Please input your E-mail!",
                                    },

                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                            if (!value) return Promise.reject("");

                                            if (!value.endsWith("@smail.iitm.ac.in")) {
                                                return Promise.reject("Please use your SMail");
                                            } else if (
                                                getFieldValue("roll") &&
                                                value !== `${getFieldValue("roll").toLowerCase()}@smail.iitm.ac.in`
                                            ) {
                                                return Promise.reject(
                                                    "The SMail doesn't correspond with your Roll No. Please recheck."
                                                );
                                            } else {
                                                return Promise.resolve()
                                            }
                                        },
                                    }),
                                ]}>
                                <Input placeholder="Please use your SMail ID" />
                            </Form.Item>
                        </Col>
                        <Col {...layouts.halfInLarge}>
                            <Form.Item
                                name="password"
                                extra={
                                    <span>
                                        It can be anything. Just keep it more than 6 letters. <SmileOutlined />
                                    </span>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "Please create a password.",
                                    },
                                    {
                                        min: 6,
                                        message: "Please input at least 6 characters.",
                                    },
                                ]}
                                label={
                                    <span>
                                        <KeyOutlined /> Create Password
                                    </span>
                                }>
                                <Input.Password />
                            </Form.Item>
                        </Col>
                        <Col {...layouts.halfInLarge}>
                            <Form.Item
                                dependencies={["password"]}
                                name="confirm"
                                hasFeedback
                                validateTrigger="onChange"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please confirm your password.",
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                            if (!value || getFieldValue("password") === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject("");
                                        },
                                    }),
                                ]}
                                label={
                                    <span>
                                        <KeyOutlined /> Confirm Password
                                    </span>
                                }>
                                <Input.Password />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row align="bottom">
                        <Col span={16}>
                            <Typography.Title level={5} style={{ margin: "0px" }}>
                                Already have an account? <Typography.Link href="/login">Log In</Typography.Link>
                            </Typography.Title>
                        </Col>
                        <Col span={8} style={{ textAlign: "right" }}>
                            <Form.Item style={{ marginBottom: "0px" }}>
                                <Button type="primary" size="large" htmlType="submit" loading={loading}>
                                    Register
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <VerificationModal
                    setVisible={setVerificationModalVisibility}
                    visible={isVerifyModalVisible}
                    formValues={formValues}
                />
            </Content>
        </>
    );
};

export default RegisterForm;
