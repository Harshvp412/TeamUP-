import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Drawer, Avatar, Divider, Col, Row, Card, Button, Descriptions, Popconfirm, message } from "antd";
import { CheckCircleOutlined, UserOutlined, SmileOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import { selectStudent } from "../../redux/mentor/mentorActions";
import { shortlistStudent } from "../../redux/mentor/mentorActions";
import openAntdNotification from "../../utils/openAntdNotification";

const Application = (props) => {
    const { projectID, studentID, appType } = props;

    const ConfirmPopup = (props) => {
        const { type, student, project } = props;

        function confirm(type) {
            switch (type) {
                case "Select": {
                    dispatch(selectStudent(student, project, handleSuccess));

                    function handleSuccess() {
                        openAntdNotification(
                            "success",
                            `Student selected successfully `,
                            <span>
                                Selected students are displayed in <strong>Selected</strong> tab!
                            </span>
                        );
                    }
                    break;
                }
                case "Shortlist": {
                    dispatch(shortlistStudent(student, project, handleSuccess));

                    function handleSuccess() {
                        openAntdNotification(
                            "success",
                            `Student Shortlisted successfully`,
                            <span>
                                Shortlisted students are displayed in <strong>Shortlisted</strong> tab!
                            </span>
                        );
                    }
                    break;
                }
                default:
                    return null;
            }
            console.log(type);
        }

        function cancel(type) {
            console.log(type);
            message.error(`Student was not ${type}ed`);
        }

        return (
            <Popconfirm
                title={
                    type === "Select"
                        ? "Are you sure you want to Select this student? This action can not be undone."
                        : type === "Shortlist"
                        ? "Are you sure you want to Shortlist this student?"
                        : "unknown"
                }
                onConfirm={() => confirm(type)}
                onCancel={() => cancel(type)}
                okText="Yes"
                cancelText="No">
                <Button
                    type="primary"
                    icon={type === "Shortlist" ? <SmileOutlined /> : <CheckCircleOutlined />}
                    disabled={type === "Selected"}
                    shape="round"
                    block={true}>
                    {type}
                </Button>
            </Popconfirm>
        );
    };

    const project = useSelector(
        (state) => state.mentor.data.projects.filter((project) => project.projectID === projectID)[0]
    );

    const student = useSelector(
        (state) =>
            state.mentor.data.projects
                .filter((project) => project.projectID === projectID)[0]
                .appliedStudents.filter((student) => student.studentID === studentID)[0]
    );

    const dispatch = useDispatch();
    const [state, setState] = useState({ visible: false });

    const showDrawer = () => {
        setState({
            visible: true,
        });
    };

    const onClose = () => {
        setState({
            visible: false,
        });
    };

    return (
        <>
            <Card hoverable={true} style={{ backgroundColor: "white" }}>
                <Row gutter={16}>
                    <Col span={16}>
                        {" "}
                        <Title level={3}>{student.roll}</Title>
                    </Col>
                    <Col span={8}>
                        <Button onClick={showDrawer} type="link">
                            View Profile
                        </Button>
                    </Col>
                </Row>

                <Row>
                    <Col span={8}>
                        <Avatar
                            size={64}
                            icon={<UserOutlined />}
                            style={{ backgroundColor: "#87d068" }}
                            src={student.avatarURL !== undefined ? student.avatarURL : null}
                        />
                    </Col>
                    <Col span={16}>
                        <p>{student.name}</p>
                        <p>Branch: {student.branch}</p>
                        <p>Year : {student.yearOfStudy} </p>
                    </Col>
                </Row>

                <ConfirmPopup type={appType} student={student} project={project} />
            </Card>

            <Drawer width={340} placement="right" closable={false} onClose={onClose} visible={state.visible}>
                <Avatar
                    size={300}
                    style={{ backgroundColor: "#87d068" }}
                    icon={<UserOutlined />}
                    src={student.avatarURL !== undefined ? student.avatarURL : null}
                />

                <Descriptions title="Student Profile">
                    <Descriptions.Item span={12} label="Name">
                        {student.name}
                    </Descriptions.Item>
                    <Descriptions.Item span={12} label="Roll Number">
                        {student.roll}
                    </Descriptions.Item>
                    <Descriptions.Item span={12} label="Branch">
                        {student.branch}
                    </Descriptions.Item>
                    <Descriptions.Item span={12} label="Year">
                        {student.yearOfStudy}
                    </Descriptions.Item>
                    <Descriptions.Item span={12} label="Contact no.">
                        +91 {student.phone}{" "}
                    </Descriptions.Item>
                    <Descriptions.Item span={12} label="Email">
                        {student.email}
                    </Descriptions.Item>
                </Descriptions>

                <Button type="primary" href={student.cvURL} target="_blank" shape="round" block={true}>
                    View CV
                </Button>

                <Divider />

                <ConfirmPopup type={appType} student={student} project={project} />
            </Drawer>
        </>
    );
};

export default Application;
