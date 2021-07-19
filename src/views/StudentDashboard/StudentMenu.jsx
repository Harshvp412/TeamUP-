import React, { useState } from "react";
import { Upload, Button, Typography, Row, Col, Divider } from "antd";
import { UploadOutlined, FilePdfOutlined, LogoutOutlined, EditOutlined, CheckCircleTwoTone } from "@ant-design/icons";
import openNotification from "../../utils/openAntdNotification";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutStudent, upload } from "../../redux/student/studentActions";
import AvatarUploader from "./AvatarUploader";
import EditInfoModal from "./EditInfoModal/EditInfoModal";

const { Title, Text, Link } = Typography;

const StudentMenu = () => {
    const [fileList, updateFileList] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);

    const history = useHistory();

    const studentData = useSelector((state) => state.student.data);
    const cvState = useSelector((state) => state.student.uploadState.cvState);
    const avatarURL = useSelector((state) => state.student.data.avatarURL);

    const dispatch = useDispatch();

    const handleLogout = async () => {
        const handleSuccess = () => {
            localStorage.removeItem("studentData");
            history.push("/login");
        };
        const handleError = (errorMsg) => {
            openNotification("error", "Error in logging out", errorMsg);
        };
        dispatch(logoutStudent(handleSuccess, handleError));
    };

    const handleUpload = async () => {
        let file = fileList[0].originFileObj;
        console.log(file);

        const handleSuccess = () => {
            openNotification("success", "Successfully Updated CV");
            updateFileList([]);
        };
        const handleError = (errorMsg) => {
            openNotification("error", "Error in logging out", errorMsg);
        };
        await dispatch(upload("cv", file, handleSuccess, handleError));
    };
    const uploadProps = {
        fileList,
        accept: "application/pdf",
        beforeUpload: (file) => {
            if (file.type !== "application/pdf") {
                openNotification(
                    "error",
                    "Please select a PDF file of size less than 8MB.",
                    `${file.name} is not a PDF file`
                );
                return false;
            } else if (fileList.length === 1) {
                openNotification("info", "You file was replaced with the newer one.", "File replaced.");
            }
            const isLt8M = file.size / 1024 / 1024 > 8;
            if (isLt8M) {
                openNotification("error", "The PDF file must be within 8MB.", "Size error");
            }
            return isLt8M;
        },
        onChange: (info) => {
            updateFileList(
                info.fileList.filter(
                    (file, index) =>
                        index === info.fileList.length - 1 &&
                        file.type === "application/pdf" &&
                        file.size / 1024 / 1024 < 8
                )
            );
        },
        multiple: false,
    };
    return (
        <Row justify="center">
            <Col span={24} style={{ paddingTop: "1em", textAlign: "center" }}>
                {avatarURL ? (
                    <img src={avatarURL} alt={studentData.name} style={{ borderRadius: "100%", width: "80%" }} />
                ) : (
                    <AvatarUploader />
                )}
            </Col>
            <Col span={24} style={{ paddingTop: "1em", textAlign: "center" }}>
                <Title level={3} style={{ marginBottom: "0.25rem", width: "100%" }}>
                    {studentData.name}
                </Title>
            </Col>
            <Col span={24} style={{ textAlign: "center" }}>
                <Title level={5} type="secondary" style={{ marginTop: "0" }}>
                    {studentData.email}
                </Title>
            </Col>
            <Row justify="center">
                <Col span={12} style={{ marginBottom: "1rem" }}>
                    <Text strong>Roll No.</Text>
                    <br />
                    <Text>{studentData.roll}</Text>
                </Col>
                <Col span={12} style={{ marginBottom: "1rem", textAlign: "right" }}>
                    <Text strong>Year Of Study</Text>
                    <br />
                    <Text>{studentData.yearOfStudy}</Text>
                </Col>
                <Col span={12}>
                    <Text strong>Branch</Text>
                    <br />
                    <Text>{studentData.branch}</Text>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                    <Text strong>Contact no.</Text>
                    <br />
                    <Text>+91 {studentData.phone}</Text>
                </Col>
            </Row>
            <Divider />
            <>
                {studentData.cvUploaded ? (
                    <Row style={{ textAlign: "center" }}>
                        <Col span={24}>
                            <Text type="success" strong>
                                CV is uploaded.
                            </Text>
                            <CheckCircleTwoTone twoToneColor="#52c41a" />
                            <Link href={studentData.cvURL} target="_blank" style={{ marginLeft: "1em" }}>
                                View your CV
                            </Link>
                        </Col>
                        <Col span={24} style={{ paddingTop: "1em" }}>
                            <Upload {...uploadProps}>
                                <Button type="primary">Update CV</Button>
                            </Upload>
                            {fileList && fileList.length > 0 && (
                                <Button onClick={handleUpload} loading={cvState.isUploading}>
                                    <span>
                                        <UploadOutlined /> Upload the selected file
                                    </span>
                                </Button>
                            )}
                        </Col>
                    </Row>
                ) : (
                    <>
                        <Upload {...uploadProps}>
                            <Button>
                                <span>
                                    <FilePdfOutlined /> Select CV to upload
                                </span>
                            </Button>
                            <div style={{ textAlign: "center" }}>
                                <Typography.Text type="secondary">PDF file less than 8MB.</Typography.Text>
                            </div>
                        </Upload>
                        {fileList && fileList.length > 0 && (
                            <Button onClick={handleUpload} loading={cvState.isUploading}>
                                <span>
                                    <UploadOutlined /> Upload the selected file
                                </span>
                            </Button>
                        )}
                    </>
                )}
            </>
            <Divider />
            <Row justify="space-between" style={{ width: "100%" }}>
                <Col>
                    <Button icon={<EditOutlined />} onClick={() => setEditModalVisible(true)}>
                        EDIT INFO
                    </Button>
                </Col>
                <Col>
                    <Button danger icon={<LogoutOutlined />} type="primary" onClick={handleLogout}>
                        LOG OUT
                    </Button>
                </Col>
            </Row>
            <EditInfoModal visible={editModalVisible} setVisible={setEditModalVisible} initialValues={studentData} />
        </Row>
    );
};

export default StudentMenu;
