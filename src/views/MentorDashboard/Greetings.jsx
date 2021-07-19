import React from "react";
import { Typography, Row, Col, Card, Divider } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getStudents } from "../../redux/mentor/mentorActions";
import Statistics from "./Statistics";

const { Title } = Typography;

function Greetings() {
    const dispatch = useDispatch();
    const projects = useSelector((state) => state.mentor.data.projects);
    return (
        <div>
            <Row>
                <Col xs={{ offset: 2 }} sm={{ offset: 5 }} md={{ offset: 7 }} lg={{ offset: 8 }} xl={{ offset: 9 }}>
                    <Title style={{ textAlign: "center", paddingTop: 20, paddingLeft: 20 }} level={2}>
                        Welcome to your dashboard
                    </Title>
                </Col>
            </Row>

            <Divider />
            <Title level={2}>Your Projects</Title>

            <Row gutter={24}>
                {projects
                    ? projects.map((project) => (
                          <Col
                              xs={{ span: 24, offset: 0 }}
                              sm={{ span: 24, offset: 0 }}
                              md={{ span: 12, offset: 0 }}
                              lg={{ span: 8, offset: 0 }}>
                              <Card hoverable={true} style={{ backgroundColor: "#fffffffa" }}>
                                  <Row gutter={16}>
                                      <Col span={24}>
                                          <Title level={3}>{project.name}</Title>
                                      </Col>
                                      <Col span={24}>
                                          <Link
                                              to={`/mentor-dashboard/${project.projectID}`}
                                              onClick={() => dispatch(getStudents(project._id))}
                                              style={{ fontSize: "20px" }}>
                                              Go to project
                                          </Link>
                                      </Col>
                                  </Row>
                                  <Row>
                                      <Col span={24}>
                                          <Statistics projectID={project.projectID} />
                                      </Col>
                                  </Row>
                              </Card>
                          </Col>
                      ))
                    : null}
            </Row>
        </div>
    );
}

export default Greetings;
