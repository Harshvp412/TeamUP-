import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CheckCircleOutlined, SmileOutlined } from "@ant-design/icons";
import { Statistic, Row, Col, Card } from "antd";
import Title from "antd/lib/typography/Title";

function Statistics(props) {
    const { projectID } = props;
    const mentor = useSelector((state) => state.mentor);
    const [statisticsState, setStatisticsState] = useState({});
    const statisticsChecker = () => {
        const selected =
            mentor.data.projects.filter((project) => project.projectID === projectID)[0].appliedStudents !== undefined
                ? mentor.data.projects
                      .filter((project) => project.projectID === projectID)[0]
                      .appliedStudents.filter((student) => student.status === "selected").length
                : mentor.data.projects.filter((project) => project.projectID === projectID)[0].selected.length;
        const shortlisted =
            mentor.data.projects.filter((project) => project.projectID === projectID)[0].appliedStudents !== undefined
                ? mentor.data.projects
                      .filter((project) => project.projectID === projectID)[0]
                      .appliedStudents.filter((student) => student.status === "shortlisted").length
                : mentor.data.projects.filter((project) => project.projectID === projectID)[0].shortlisted.length;

        return setStatisticsState({ selected, shortlisted });
    };
    useEffect(() => {
        statisticsChecker();
        //eslint-disable-next-line
    }, [mentor]);

    return (
        <div
            className="site-statistic-demo-card"
            style={{
                background: "#ececec",
                padding: "10px",
                textAlign: "center",
            }}>
            <Row gutter={8} justify="center">
                <Col span={12}>
                    <Card>
                        <Row justify="center">
                            <Statistic
                                title=""
                                value={statisticsState.shortlisted}
                                precision={0}
                                valueStyle={{ color: "#d38027", fontSize: "50px" }}
                                prefix={<SmileOutlined />}
                                // suffix="Shortlisted"
                                style={{ textAlign: "center", minHeight: "50px" }}
                            />
                        </Row>
                        <Row justify="center">
                            <Title level={5} style={{ color: "#d38027" }}>
                                Shortlisted
                            </Title>
                        </Row>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <Row justify="center">
                            <Statistic
                                title=""
                                value={statisticsState.selected}
                                precision={0}
                                valueStyle={{ color: "#3f8600", fontSize: "50px" }}
                                prefix={<CheckCircleOutlined />}
                                // suffix="Selected"
                                style={{ textAlign: "center", minHeight: "50px" }}
                            />
                        </Row>
                        <Row justify="center">
                            <Title level={5} style={{ color: "#3f8600" }}>
                                Selected
                            </Title>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Statistics;
