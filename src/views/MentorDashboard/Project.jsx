import React, { Fragment, useEffect } from "react";
import { Tabs, Card, Result, Button, Typography, List, Row, Col } from "antd";
import Title from "antd/lib/typography/Title";
import { useSelector, useDispatch } from "react-redux";
import { FileDoneOutlined, UserAddOutlined, RiseOutlined, TeamOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { getStudents } from "../../redux/mentor/mentorActions";
import { Link } from "react-router-dom";
import Statistics from "./Statistics";
import Application from "./Application";

const { Paragraph } = Typography;
const { TabPane } = Tabs;

const Project = (props) => {
    const dispatch = useDispatch();

    const { projectID } = props;

    const project = useSelector(
        (state) => state.mentor.data.projects.filter((project) => project.projectID === projectID)[0]
    );
    const mentor = useSelector((state) => state.mentor);

    useEffect(() => {
        dispatch(getStudents(project._id));
        //eslint-disable-next-line
    }, [dispatch]);

    return (
        <Fragment>
            <Title level={3} style={{ padding: 10, paddingTop: 20 }}>
                {" "}
                {project.name}
            </Title>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Project Overview" key="1">
                    <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: "more" }} style={{ fontSize: "1.5em" }}>
                        {project.description}
                    </Paragraph>
                    <Row jusify="center">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 12, offset: 6 }}
                            md={{ span: 8, offset: 0 }}
                            lg={{ span: 6, offset: 2 }}>
                            <Title level={4} style={{ padding: 10 }}>
                                <RiseOutlined /> Statistics
                            </Title>
                            <Statistics projectID={projectID} />
                        </Col>

                        <Col
                            style={{ paddingTop: 10 }}
                            xs={{ span: 24, offset: 0 }}
                            sm={{ span: 11, offset: 0 }}
                            md={{ span: 7, offset: 1 }}
                            lg={{ span: 7, offset: 1 }}>
                            <Title level={4} style={{ padding: 10 }}>
                                <TeamOutlined /> Job Profiles
                            </Title>

                            <List
                                style={{ backgroundColor: "white" }}
                                bordered
                                dataSource={project.jobProfiles}
                                renderItem={(profile) => <List.Item>{profile}</List.Item>}
                            />
                        </Col>

                        <Col
                            style={{ paddingTop: 10 }}
                            xs={{ span: 24, offset: 0 }}
                            sm={{ span: 11, offset: 2 }}
                            md={{ span: 7, offset: 1 }}
                            lg={{ span: 6, offset: 1 }}>
                            <Title level={4} style={{ padding: 10 }}>
                                <ThunderboltOutlined /> Skills Required
                            </Title>

                            <List
                                style={{ backgroundColor: "white" }}
                                bordered
                                dataSource={project.skillsRequired}
                                renderItem={(skill) => <List.Item>{skill}</List.Item>}
                            />
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tab="Applications" key="2">
                    <Row gutter={10}>
                        {mentor.data.projects.filter((project) => project.projectID === projectID)[0]
                            .appliedStudents !== undefined ? (
                            mentor.data.projects
                                .filter((project) => project.projectID === projectID)[0]
                                .appliedStudents.filter((student) => student.status === "none").length !== 0 ? (
                                mentor.data.projects
                                    .filter((project) => project.projectID === projectID)[0]
                                    .appliedStudents.filter((student) => student.status === "none")
                                    .map((student) => (
                                        <Col
                                            key={student._id}
                                            style={{ paddingTop: 10 }}
                                            xs={{ span: 24, offset: 0 }}
                                            sm={{ span: 24, offset: 0 }}
                                            md={{ span: 12, offset: 0 }}
                                            lg={{ span: 8, offset: 0 }}>
                                            <Application
                                                projectID={projectID}
                                                studentID={student.studentID}
                                                appType="Shortlist"
                                            />
                                        </Col>
                                    ))
                            ) : (
                                <Card style={{ backgroundColor: "white", width: 2400 }}>
                                    <Result
                                        icon={<FileDoneOutlined />}
                                        title="Great! All applicants have been either Shortlisted or Selected"
                                        subTitle="Check the Shortlists Tab or Selected Tab to proceed OR"
                                        extra={
                                            <Button type="primary">
                                                <Link to="/mentor-dashboard">Go to Home</Link>
                                            </Button>
                                        }
                                    />
                                </Card>
                            )
                        ) : (
                            <Card style={{ backgroundColor: "white", width: 2400 }}>
                                <Result
                                    icon={<FileDoneOutlined />}
                                    title="Great! All applicants have been either Shortlisted or Selected"
                                    subTitle="Check the Shortlists Tab or Selected Tab to proceed OR"
                                    extra={
                                        <Button type="primary">
                                            <Link to="/mentor-dashboard">Go to Home</Link>
                                        </Button>
                                    }
                                />
                            </Card>
                        )}
                    </Row>
                </TabPane>

                <TabPane tab="Shortlists" key="3">
                    <Row>
                        {mentor.data.projects.filter((project) => project.projectID === projectID)[0]
                            .appliedStudents !== undefined ? (
                            mentor.data.projects
                                .filter((project) => project.projectID === projectID)[0]
                                .appliedStudents.filter((student) => student.status === "shortlisted").length !== 0 ? (
                                mentor.data.projects
                                    .filter((project) => project.projectID === projectID)[0]
                                    .appliedStudents.filter((student) => student.status === "shortlisted")
                                    .map((student) => (
                                        <Col
                                            key={student._id}
                                            style={{ paddingTop: 10 }}
                                            xs={{ span: 24, offset: 0 }}
                                            sm={{ span: 24, offset: 0 }}
                                            md={{ span: 12, offset: 0 }}
                                            lg={{ span: 8, offset: 0 }}>
                                            <Application
                                                projectID={projectID}
                                                studentID={student.studentID}
                                                appType="Select"
                                            />
                                        </Col>
                                    ))
                            ) : (
                                <Card style={{ backgroundColor: "white", width: 2400 }}>
                                    <Result
                                        icon={<UserAddOutlined />}
                                        title="Yet to Shortlist applications."
                                        subTitle="Check the Applications Tab to proceed OR"
                                        extra={
                                            <Button type="primary">
                                                <Link to="/mentor-dashboard">Go to Home</Link>
                                            </Button>
                                        }
                                    />
                                </Card>
                            )
                        ) : (
                            <Card style={{ backgroundColor: "white", width: 2400 }}>
                                <Result
                                    icon={<UserAddOutlined />}
                                    title="Yet to Shortlist applications."
                                    subTitle="Check the Applications Tab to proceed OR"
                                    extra={
                                        <Button type="primary">
                                            <Link to="/mentor-dashboard">Go to Home</Link>
                                        </Button>
                                    }
                                />
                            </Card>
                        )}
                    </Row>
                </TabPane>

                <TabPane tab="Selections" key="4">
                    <Row>
                        {mentor.data.projects.filter((project) => project.projectID === projectID)[0]
                            .appliedStudents !== undefined ? (
                            mentor.data.projects
                                .filter((project) => project.projectID === projectID)[0]
                                .appliedStudents.filter((student) => student.status === "selected").length !== 0 ? (
                                mentor.data.projects
                                    .filter((project) => project.projectID === projectID)[0]
                                    .appliedStudents.filter((student) => student.status === "selected")
                                    .map((student) => (
                                        <Col
                                            key={student._id}
                                            style={{ paddingTop: 10 }}
                                            xs={{ span: 24, offset: 0 }}
                                            sm={{ span: 24, offset: 0 }}
                                            md={{ span: 12, offset: 0 }}
                                            lg={{ span: 8, offset: 0 }}>
                                            <Application
                                                projectID={projectID}
                                                studentID={student.studentID}
                                                appType="Selected"
                                            />
                                        </Col>
                                    ))
                            ) : (
                                <Card style={{ backgroundColor: "white", width: 2400 }}>
                                    <Result
                                        icon={<UserAddOutlined />}
                                        title="Yet to make any Selections."
                                        subTitle="Check the Shortlists Tab to proceed OR"
                                        extra={
                                            <Button type="primary">
                                                <Link to="/mentor-dashboard">Go to Home</Link>
                                            </Button>
                                        }
                                    />
                                </Card>
                            )
                        ) : (
                            <Card style={{ backgroundColor: "white", width: 2400 }}>
                                <Result
                                    icon={<UserAddOutlined />}
                                    title="Yet to make any Selections."
                                    subTitle="Check the Shortlists Tab to proceed OR"
                                    extra={
                                        <Button type="primary">
                                            <Link to="/mentor-dashboard">Go to Home</Link>
                                        </Button>
                                    }
                                />
                            </Card>
                        )}
                    </Row>
                </TabPane>
            </Tabs>
        </Fragment>
    );
};

export default Project;
