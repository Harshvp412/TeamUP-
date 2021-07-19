import React from "react";
import { Button, Input, Form, Modal, Row, Space, Typography } from "antd";
import { registerStudent } from "../../redux/student/studentActions";
import openNotification from "../../utils/openAntdNotification";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const VerificationModal = ({ visible, setVisible, formValues }) => {
    const dispatch = useDispatch();
    const registerData = useSelector((state) => state.registerData);
    const history = useHistory();

    const onFinish = async ({ verificationCode }) => {
        try {
            if (!document.cookie) return null;
            const verificationToken = document.cookie
                .split(";")
                .filter((str) => str.trim().startsWith("ECELL_VERIFICATION_TOKEN"))[0]
                .split("=")[1];

            if (verificationCode === verificationToken) {
                let dataToPost = { ...formValues };
                delete dataToPost.confirm;
                dispatch(registerStudent(dataToPost, handleSuccess, handleError));
                function handleError(errorMsg) {
                    openNotification("error", "Error occured in posting form data.", errorMsg);
                }
                function handleSuccess() {
                    history.push("/student-dashboard");
                }
            } else {
                openNotification("error", "The code you entered is incorrect.", "");
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Modal visible={visible} closable={false} footer={null} destroyOnClose={true}>
            <Form
                name="verificationModal"
                onFinish={onFinish}
                preserve={false}
                layout="vertical"
                validateTrigger="onSubmit">
                <Typography.Text strong>Check your Mail! We've sent you an verification code.</Typography.Text>
                <br />

                <Form.Item
                    label="Insert the verification code here"
                    name="verificationCode"
                    rules={[{ required: true, message: "Please input the required code." }]}>
                    <Input />
                </Form.Item>

                <Row justify="end">
                    <Space>
                        <Form.Item style={{ marginBottom: "0" }}>
                            <Button htmlType="submit" type="primary" loading={registerData.registering}>
                                Verify my E-Mail
                            </Button>
                        </Form.Item>
                        <Button onClick={() => setVisible(false)}>Discard</Button>
                    </Space>
                </Row>
            </Form>
        </Modal>
    );
};

export default VerificationModal;
