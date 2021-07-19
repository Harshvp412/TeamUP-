import React, { useEffect } from "react";
import { Grid, List, Card, Button, Typography, Row, Col, Tag, Modal } from "antd";
import {
    ThunderboltOutlined,
    CheckOutlined,
    TeamOutlined,
    UserOutlined,
    SolutionOutlined,
    SmileOutlined,
    FileDoneOutlined,
} from "@ant-design/icons";
import openAntdNotification from "../../utils/openAntdNotification";

import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../redux/projects/projectActions";
import { applyToProject } from "../../redux/student/studentActions";

const { useBreakpoint } = Grid;
const { Text } = Typography;

const Projects = ({ filter = "none" }) => {
    const screen = useBreakpoint();

    const projects = useSelector((state) => state.projects.data);
    const isFetching = useSelector((state) => state.projects.isFetching);

    const { appliedProjects, selectedProjects, cvUploaded } = useSelector((state) => state.student.data);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    const showConfirmation = (projectID, projectTitle) => {
        Modal.confirm({
            title: (
                <span>
                    Confirm your application <SmileOutlined />
                </span>
            ),
            icon: null,
            content: (
                <span>
                    Your CV will be made accessible to the project leader of this project: <strong>{projectTitle}</strong>.
                    <br />
                    <Text type="secondary">Note that once applied, you cannot revert your action.</Text>
                </span>
            ),
            onOk: async () => {
                dispatch(applyToProject(projectID, handleSuccess));
                function handleSuccess() {
                    openAntdNotification(
                        "success",
                        `Successfully applied to project: ${projectTitle}`,
                        <span>
                            Keep an eye on the <strong>Selected</strong> tab!
                        </span>
                    );
                }
            },
            centered: true,
        });
    };

    const showAlertToUploadCV = () => {
        Modal.info({
            title: "Please upload your CV",
            icon: <FileDoneOutlined />,
            content:
                "You need to upload your CV from the menu in order to apply. CVs will be used by project leaders to select you so make sure to make a good impression!",
            centered: true,
        });
    };

    const handleApply = (projectID, projectTitle) => {
        if (cvUploaded) {
            showConfirmation(projectID, projectTitle);
        } else {
            showAlertToUploadCV();
        }
    };

    const showPostDescriptionModal = (target, title, description) => {
        // Escape clicks from the "Apply" button
        if ((target.innerText === "Apply" && target.tagName === "SPAN") || target.tagName === "BUTTON") return;

        Modal.info({
            title,
            // Magic numbers: 200 and 500. Felt clever, might change later
            content: (
                <div style={{ maxHeight: !screen.md ? window.innerHeight - 200 : 500, overflowY: "auto" }}>
                    {description}
                </div>
            ),
            icon: null,
            width: !screen.md ? window.innerWidth : 768,
            zIndex: 1010,
            okText: "Close",
            centered: true,
            maskClosable: true,
        });
    };
    const EmptyList = ({ filter }) => (
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
            {filter === "applied" ? (
                <>
                    <SmileOutlined style={{ fontSize: "3rem" }} />
                    <br />
                    <Text type="secondary" strong>
                        You haven't applied for any projects.
                    </Text>
                    <br />
                    <Text type="secondary">
                        Apply now from the <strong>All</strong> tab.
                    </Text>
                </>
            ) : filter === "selected" ? (
                <>
                    <TeamOutlined style={{ fontSize: "3rem" }} />
                    <br />
                    <Text type="secondary" strong>
                        No selections yet.
                    </Text>
                    <br />
                    <Text type="secondary"> Please check back later!</Text>
                </>
            ) : (
                <>
                    <ThunderboltOutlined style={{ fontSize: "3rem" }} />
                    <br />
                    <Text type="secondary" strong>
                        Seems like you applied for all the projects!
                    </Text>
                    <br />
                    <Text type="secondary">
                        Keep an eye on the <strong>Selected</strong> tab
                    </Text>
                </>
            )}
        </div>
    );
    return (
        <List
            size="large"
            itemLayout="horizontal"
            locale={{ emptyText: <EmptyList filter={filter} /> }}
            loading={isFetching}
            dataSource={
                filter === "none"
                    ? projects.filter(
                          (project) => !appliedProjects.includes(project._id) && !selectedProjects.includes(project._id)
                      )
                    : filter === "applied"
                    ? projects.filter((project) => appliedProjects.includes(project._id))
                    : projects.filter((project) => selectedProjects.includes(project._id))
            }
            renderItem={(project) => (
                <List.Item style={{ paddingTop: "8px", paddingBottom: "8px", paddingLeft: "0px" }}>
                    <Card
                        title={project.title}
                        hoverable
                        onClick={(e) => showPostDescriptionModal(e.target, project.title, project.description)}
                        extra={
                            selectedProjects.includes(project._id) ? (
                                <Text type="success" strong>
                                    <CheckOutlined /> Selected
                                </Text>
                            ) : appliedProjects.includes(project._id) ? (
                                <Text strong style={{ color: "#1890ff" }}>
                                    <CheckOutlined /> Applied
                                </Text>
                            ) : (
                                <Button onClick={() => handleApply(project._id, project.title)}>Apply</Button>
                            )
                        }
                        style={{ width: "100%" }}>
                        <Row justify="center">
                            <Col xs={{ span: 24 }} md={{ span: 12 }} style={{ marginBottom: "1rem" }}>
                                <UserOutlined /> <Text strong>Project Leader</Text>
                                <br />
                                <Text>{project.mentorName}</Text>
                                <br />
                                <Text type="secondary">{project.mentorDesignation}</Text>
                            </Col>
                            <Col xs={{ span: 24 }} md={{ span: 12 }} style={{ marginBottom: "1rem" }}>
                                <TeamOutlined /> <Text strong>Required Members</Text>
                                <Text> : {project.teamMembersRequired} </Text>
                            </Col>
                            <Col xs={{ span: 24 }} md={{ span: 12 }} style={!screen.md && { marginBottom: "1rem" }}>
                                <SolutionOutlined /> <Typography.Text strong>Job Profiles</Typography.Text>
                                <br />
                                {project.jobProfiles.map((profile) => (
                                    <Tag style={{ margin: "0.2rem 0.2rem 0 0" }} key={profile}>
                                        {profile}
                                    </Tag>
                                ))}
                            </Col>
                            <Col xs={{ span: 24 }} md={{ span: 12 }} style={!screen.md && { marginBottom: "1rem" }}>
                                <ThunderboltOutlined /> <Typography.Text strong>Required Skills</Typography.Text>
                                <br />
                                {project.skillsRequired.map((skill) => (
                                    <Tag style={{ margin: "0.2rem 0 0 0.2rem", whiteSpace: "pre-wrap" }} key={skill}>
                                        {skill}
                                    </Tag>
                                ))}
                            </Col>
                            {!screen.md && <Text type="secondary">Tap to view details</Text>}
                        </Row>
                    </Card>
                </List.Item>
            )}
        />
    );
};

export default Projects;
