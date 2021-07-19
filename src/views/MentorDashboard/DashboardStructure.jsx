import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import {
    Layout,
    Avatar,
    Button,
    Descriptions,
    Typography,
    Menu,
    Popconfirm,
    Drawer,
    message,
    Row,
    Col,
    Divider,
} from "antd";
import {
    UserOutlined,
    LogoutOutlined,
    ProjectOutlined,
    EditOutlined,
    HomeOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import Project from "./Project";
import Greetings from "./Greetings";
import openNotification from "../../utils/openAntdNotification";
import { getAvatar, getStudents, logoutMentor } from "../../redux/mentor/mentorActions";
import ChangePasswordModal from "./ChangePasswordModal/ChangePasswordModal";
import AvatarUploader from "./AvatarUploader";

const { Title, Text } = Typography;
const { Header, Content } = Layout;
const { SubMenu } = Menu;

function Structure() {
    function cancel(e) {
        console.log(e);
        message.error("Click on No");
    }
    const history = useHistory();
    const dispatch = useDispatch();
    const mentor = useSelector((state) => state.mentor);

    const [visibleMenu, setVisibleMenu] = useState(false);

    const [editModalVisible, setEditModalVisible] = useState(false);

    const showMenuDrawer = () => {
        setVisibleMenu(true);
    };
    const onMenuClose = () => {
        setVisibleMenu(false);
    };

    const [visibleProfile, setVisibleProfile] = useState(false);
    const [visibleAvatarUpdater, setVisibleAvatarUpdater] = useState(false);

    const showProfileDrawer = () => {
        setVisibleProfile(true);
        setVisibleAvatarUpdater(false);
    };
    const onClose = () => {
        setVisibleProfile(false);
    };

    const handleLogout = async () => {
        const handleSuccess = () => {
            localStorage.removeItem("mentorData");
            history.push("/mentor-login");
        };
        const handleError = (errorMsg) => {
            openNotification("error", "Error in logging out", errorMsg);
        };
        dispatch(logoutMentor(handleSuccess, handleError));
    };

    useEffect(() => {
        dispatch(getAvatar());
        //eslint-disable-next-line
    }, [mentor.avatarState]);

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Drawer
                width={300}
                placement="left"
                closable={false}
                onClose={onMenuClose}
                visible={visibleMenu}
                drawerStyle={{ backgroundColor: "#00152a" }}>
                <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" inlineIndent="30">
                    <Menu.Item key="1" onClick={showProfileDrawer}>
                        <Avatar
                            style={{ backgroundColor: "#44b4ca" }}
                            icon={<UserOutlined />}
                            src={mentor.data.avatarURL !== undefined ? mentor.data.avatarURL : null}
                        />
                        <Text strong style={{ paddingLeft: "20px", color: "white" }}>
                            {mentor.data.name}
                        </Text>
                    </Menu.Item>
                    <Menu.Item key="2" title="My Profile" icon={<UserOutlined />} onClick={showProfileDrawer}>
                        My Profile
                    </Menu.Item>
                    <Menu.Item key="3" title="My Profile" icon={<HomeOutlined />} onClick={onMenuClose}>
                        <Link to="/mentor-dashboard">Home</Link>
                    </Menu.Item>

                    <SubMenu key="sub1" icon={<ProjectOutlined />} title="My Projects">
                        {mentor.data.projects ? (
                            mentor.data.projects.map((project) => (
                                <Menu.Item key={project._id} onClick={onMenuClose}>
                                    <Link
                                        to={`/mentor-dashboard/${project.projectID}`}
                                        onClick={() => dispatch(getStudents(project._id))}>
                                        {project.name}
                                    </Link>
                                </Menu.Item>
                            ))
                        ) : (
                            <Menu.Item>
                                <Link to="/mentor-dashboard"> No Projects</Link>
                            </Menu.Item>
                        )}
                    </SubMenu>

                    <Menu.Item key="4" title="Logout" icon={<LogoutOutlined />}>
                        <Popconfirm
                            title="Are you sure you want to log out?"
                            onConfirm={handleLogout}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No">
                            Logout
                        </Popconfirm>
                    </Menu.Item>
                </Menu>
            </Drawer>
            <Drawer
                width={340}
                title="My Profile"
                placement="right"
                closable={false}
                onClose={onClose}
                zIndex={2000}
                visible={visibleProfile}>
                <Descriptions title={mentor.data.name}>
                    <Col span={24} style={{ paddingTop: "1em", textAlign: "center" }}>
                        {mentor.data.avatarURL ? (
                            <img
                                src={mentor.data.avatarURL}
                                alt={mentor.data.name}
                                style={{ borderRadius: "100%", width: "80%" }}
                            />
                        ) : (
                            <div onClick={onClose}>
                                {" "}
                                <AvatarUploader />
                            </div>
                        )}
                    </Col>

                    <Descriptions.Item span={12} label="Email">
                        {mentor.data.email}
                    </Descriptions.Item>
                    <Descriptions.Item span={12} label="Designation">
                        {" "}
                        {mentor.data.designation}
                    </Descriptions.Item>
                </Descriptions>
                <Divider />
                <Button
                    icon={<EditOutlined />}
                    type="primary"
                    shape="round"
                    block={true}
                    onClick={() => setEditModalVisible(true)}>
                    Change Password
                </Button>

                {mentor.data.avatarURL ? (
                    <Col span={24} style={{ paddingTop: "1em", textAlign: "center" }}>
                        <Divider />
                        <Button
                            icon={<EditOutlined />}
                            type="primary"
                            shape="round"
                            block={true}
                            onClick={() => setVisibleAvatarUpdater(true)}>
                            Update Profile Picture
                        </Button>
                        {visibleAvatarUpdater ? (
                            <div onClick={onClose}>
                                <Divider />{" "}
                                <div>
                                    <AvatarUploader />
                                </div>
                            </div>
                        ) : null}
                    </Col>
                ) : null}
                <ChangePasswordModal
                    visible={editModalVisible}
                    setVisible={setEditModalVisible}
                    initialValues={mentor.data}
                />
            </Drawer>

            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 10, background: "#022036" }}>
                    <Row>
                        <Col
                            xs={{ span: 1, offset: 0 }}
                            sm={{ span: 2, offset: 0 }}
                            md={{ span: 2, offset: 0 }}
                            lg={{ span: 1, offset: 0 }}>
                            <MenuUnfoldOutlined
                                onClick={showMenuDrawer}
                                style={{ color: "whitesmoke", fontSize: 40 }}
                            />
                        </Col>
                        <Col
                            xs={{ span: 10, offset: 5 }}
                            sm={{ span: 8, offset: 8 }}
                            md={{ span: 8, offset: 8 }}
                            lg={{ span: 6, offset: 10 }}>
                            <Title style={{ color: "white" }}>TeamUp</Title>
                        </Col>
                        <Col
                            xs={{ span: 1, offset: 4 }}
                            sm={{ span: 1, offset: 3 }}
                            md={{ span: 1, offset: 3 }}
                            lg={{ span: 1, offset: 5 }}>
                            <Avatar
                                size={40}
                                style={{ cursor: "pointer", float: "right", backgroundColor: "#00152a" }}
                                icon={<UserOutlined />}
                                onClick={showProfileDrawer}
                                src={mentor.data.avatarURL !== undefined ? mentor.data.avatarURL : null}
                            />
                        </Col>
                        <Col
                            xs={{ span: 1, offset: 2 }}
                            sm={{ span: 1, offset: 1 }}
                            md={{ span: 1, offset: 1 }}
                            lg={{ span: 1, offset: 0 }}>
                            <Popconfirm
                                title="Are you sure you want to log out?"
                                onConfirm={handleLogout}
                                onCancel={cancel}
                                okText="Yes"
                                cancelText="No">
                                <Avatar
                                    size={40}
                                    style={{ cursor: "pointer", float: "right", backgroundColor: "#00152a" }}
                                    icon={<LogoutOutlined />}
                                />
                            </Popconfirm>
                        </Col>
                    </Row>
                </Header>

                <Content style={{ margin: "0 16px" }}>
                    {mentor.data.projects
                        ? mentor.data.projects.map((project) => (
                              <Route key={project._id} exact path={`/mentor-dashboard/${project.projectID}`}>
                                  <Project projectID={project.projectID} />
                              </Route>
                          ))
                        : null}
                    <Route exact path="/mentor-dashboard/">
                        <Greetings />
                    </Route>
                </Content>
            </Layout>
        </Layout>
    );
}

export default Structure;
