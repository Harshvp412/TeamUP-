import React from "react";
import { Row, Col, Form, Modal, Input, Button, Tabs } from "antd";
import { KeyOutlined, SmileOutlined } from "@ant-design/icons";

import openAntdNotification from "../../../utils/openAntdNotification";

import { updateMentorPassword } from "../../../redux/mentor/mentorActions";
import { useDispatch, useSelector } from "react-redux";

const { TabPane } = Tabs;

const ChangePasswordModal = ({ visible, setVisible }) => {
    const dispatch = useDispatch();

    const isUpdating = useSelector((state) => state.mentor.updateInfoState.isUpdating);

    const onPasswordChange = (passwords) => {
        const handleSuccess = () => {
            openAntdNotification("success", "Password changed successfully");
        };
        const handleError = (errorMsg) => {
            openAntdNotification("error", "Error occured in changing password", errorMsg);
        };

        dispatch(updateMentorPassword(passwords, handleError, handleSuccess));
    };
    return (
        <Modal visible={visible} footer={null} destroyOnClose={true} closable={false} zIndex={1003}>
            <Tabs>
                <TabPane tab="CHANGE PASSWORD">
                    <Form layout="vertical" onFinish={onPasswordChange}>
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

export default ChangePasswordModal;
