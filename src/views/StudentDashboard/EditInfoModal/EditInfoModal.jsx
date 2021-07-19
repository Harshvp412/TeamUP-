import React, { useState } from "react";
import { Row, Col, Form, Modal, Input, Button, Select, Tabs, Tooltip } from "antd";
import {
    UserOutlined,
    NumberOutlined,
    CalendarOutlined,
    PhoneOutlined,
    BankOutlined,
    KeyOutlined,
    SmileOutlined,
} from "@ant-design/icons";
import layouts from "../../../utils/antd-layouts";
import openAntdNotification from "../../../utils/openAntdNotification";
import compareFields from "./compareFields";
import { updateStudentData, updateStudentPassword } from "../../../redux/student/studentActions";
import { useDispatch, useSelector } from "react-redux";

const { Option } = Select;
const { TabPane } = Tabs;

const EditInfoModal = ({ initialValues, visible, setVisible }) => {
    const dispatch = useDispatch();
    const [noChanges, setNoChanges] = useState(false);
    const isUpdating = useSelector((state) => state.student.updateInfoState.isUpdating);

    const onInfoFinish = async (newValues) => {
        const changes = compareFields(initialValues, newValues);
        if (!changes) {
            setNoChanges(true);

            setTimeout(() => {
                setNoChanges(false);
            }, 3000);
        } else {
            const handleSuccess = () => {
                openAntdNotification("success", "Information updated successfully");
            };

            const handleError = (errorMsg) => {
                openAntdNotification("error", "Error occured in updating info", errorMsg);
            };

            dispatch(updateStudentData(changes, handleError, handleSuccess));
            console.log(changes);
        }
    };

    const onPasswordChange = (passwords) => {
        const handleSuccess = () => {
            openAntdNotification("success", "Password changed successfully");
        };
        const handleError = (errorMsg) => {
            openAntdNotification("error", "Error occured in changing password", errorMsg);
        };

        dispatch(updateStudentPassword(passwords, handleError, handleSuccess));
    };
    return (
        <Modal visible={visible} footer={null} destroyOnClose={true} closable={false} zIndex={1003}>
            <Tabs>
                <TabPane tab="USER INFO" key="1">
                    <Form layout="vertical" initialValues={initialValues} onFinish={onInfoFinish}>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="name"
                                    label={
                                        <span>
                                            <UserOutlined /> Name
                                        </span>
                                    }>
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
                                    }>
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
                                    }>
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
                                    }>
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

                        <Row gutter={[12, 0]} justify="end">
                            <Col>
                                <Button onClick={() => setVisible(false)}>Discard</Button>
                            </Col>
                            <Col>
                                <Form.Item style={{ marginBottom: 0 }}>
                                    <Tooltip visible={noChanges} title="No changes to be made!" trigger="focus">
                                        <Button type="primary" htmlType="submit" loading={isUpdating}>
                                            Save Changes
                                        </Button>
                                    </Tooltip>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </TabPane>
                <TabPane tab="CHANGE PASSWORD">
                    <Form layout="vertical" onFinish={onPasswordChange}>
                        <Form.Item
                            name="newPassword"
                            extra={
                                <span>
                                    Keep it more than 6 letters. <SmileOutlined />
                                </span>
                            }
                            rules={[
                                {
                                    min: 6,
                                    message: "Please input at least 6 characters.",
                                },
                                {
                                    required: true,
                                    message: "Please input a new password if you want to change your current one.",
                                },
                            ]}
                            label={
                                <span>
                                    <KeyOutlined /> New Password
                                </span>
                            }>
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="currentPassword"
                            rules={[{ required: true, message: "Please input your current password." }]}
                            label={
                                <span>
                                    <KeyOutlined /> Current Password
                                </span>
                            }>
                            <Input.Password />
                        </Form.Item>
                        <Row gutter={[12, 0]} justify="end">
                            <Col>
                                <Button onClick={() => setVisible(false)}>Discard</Button>
                            </Col>
                            <Col>
                                <Form.Item style={{ marginBottom: 0 }}>
                                    <Button type="primary" htmlType="submit" loading={isUpdating}>
                                        Change Password
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </TabPane>
            </Tabs>
        </Modal>
    );
};

export default EditInfoModal;
