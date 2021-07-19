import React from "react";
import { Tabs } from "antd";
import { ProjectOutlined, CheckOutlined, StarOutlined } from "@ant-design/icons";
import Projects from "./Projects";
const { TabPane } = Tabs;

const ClickAdviser = () =>
    window.innerWidth > 768 ? (
        <span style={{ paddingRight: "24px" }}>
            Click/Tap on a project to view details.
        </span>
    ) : null;

const ProjectContainer = () => {
    return (
        <Tabs size="large" style={{ overflow: "visible" }} tabBarExtraContent={<ClickAdviser />}>
            <TabPane
                tab={
                    <span>
                        <ProjectOutlined />
                        All
                    </span>
                }
                key="1">
                <Projects />
            </TabPane>
            <TabPane
                tab={
                    <span>
                        <CheckOutlined />
                        Applied
                    </span>
                }
                key="2">
                <Projects filter="applied" />
            </TabPane>
            <TabPane
                tab={
                    <span>
                        <StarOutlined />
                        Selected
                    </span>
                }
                key="3">
                <Projects filter="selected" />
            </TabPane>
        </Tabs>
    );
};

export default ProjectContainer;
