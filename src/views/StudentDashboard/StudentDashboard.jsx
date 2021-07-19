import React, { useState, useEffect, useLayoutEffect } from "react";
import ProjectContainer from "./ProjectContainer";
import "./StudentDashboard.css";
import StudentMenu from "./StudentMenu";
import { Button, Col, Layout, Row, Typography, Drawer, Divider, Image } from "antd";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import openNotification from "../../utils/openAntdNotification";
import { MenuOutlined, CloseOutlined, LogoutOutlined } from "@ant-design/icons";
import { logoutStudent } from "../../redux/student/studentActions";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

const { Content, Header } = Layout;
const { Title } = Typography;
const StudentDashboard = () => {
    const [headerHeight, setHeaderHeight] = useState(null);
    const screen = useBreakpoint();
    const history = useHistory();
    const dispatch = useDispatch();
    const [menuVisibile, setMenuVisibility] = useState(false);

    useLayoutEffect(() => {
     if (screen.md) {
         setMenuVisibility(true);
     } else {
         setMenuVisibility(false)
     }
    }, [screen.md])

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

    useEffect(() => {
        let height = document.getElementsByTagName("header")[0].clientHeight;
        setHeaderHeight(height);
    }, [headerHeight]);

    return (
        <>
            <Header
                style={{
                    background: "#fefefe",
                    zIndex: 1001,
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    boxShadow: "0px -1px 20px rgba(85, 85, 85, 0.2)",
                    padding:"0 2em 0 2em"
                }}>
                <Row align="middle" justify="space-around">
                    <Col xs={{ span: 3 }} md={{ span: 1 }}>
                        <Image src="https://ecell.iitm.ac.in/team_up-static/media/e-cell_logo_white.png" alt="E-Cell Logo" />
                    </Col>
                    <Col xs={{ span: 12 }} md={{ span: 16 }} style={{ textAlign: "center" }}>
                        <Title level={2} style={{ marginBottom: 0 }}>
                            TeamUp
                        </Title>
                    </Col>
                    <Col
                        md={{ span: 3 }}
                        xs={{ span: 7 }}
                        style={{
                            textAlign: "right",
                            alignItems: "center",
                            justifyContent: "space-between",
                            display: "flex",
                        }}>
                        <Button type="dashed" icon={<LogoutOutlined />} onClick={handleLogout}>
                            {screen.md && "LOG OUT"}
                        </Button>
                        <Divider type="vertical" />
                        <Button
                            type="dashed"
                            icon={
                                menuVisibile ? (
                                    <CloseOutlined style={{ fontSize: "1.5rem" }} />
                                ) : (
                                    <MenuOutlined style={{ fontSize: "1.5rem" }} />
                                )
                            }
                            onClick={() => setMenuVisibility((prevState) => !prevState)}
                        />
                    </Col>
                </Row>
            </Header>
            <Content id="student-dashboard-content" style={{ marginTop: headerHeight }}>
                <div id="projects-table-container">
                    <Typography.Title level={2}>Projects</Typography.Title>
                    <ProjectContainer />
                    <Drawer
                        closable={false}
                        maskClosable={true}
                        width={300}
                        visible={menuVisibile}
                        mask={!screen.md}
                        style={{ marginTop: headerHeight - 24 }}>
                        <StudentMenu />
                    </Drawer>
                </div>
            </Content>
        </>
    );
};

export default StudentDashboard;
