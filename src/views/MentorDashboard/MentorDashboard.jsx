import React from "react";
import { Layout } from "antd";
import Structure from "./DashboardStructure";

const { Content } = Layout;

const MentorDashboard = () => {
    return (
        <Layout>
            <Content>
                <Structure />
            </Content>
        </Layout>
    );
};

export default MentorDashboard;
