import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Layout } from "antd";

import { PrivateRoute, PublicRoute } from "./common/SpecialRoutes";

import "./App.css";
import StudentDashboard from "./views/StudentDashboard/StudentDashboard";
import MentorDashboard from "./views/MentorDashboard/MentorDashboard";
import Login from "./views/Login/Login";
import LoginMentor from "./views/Login/LoginMentor";
import RegisterForm from "./views/RegisterForm/RegisterForm";
import NotFound from "./views/NotFound";
import ECellFooter from "./common/ECellFooter";
import { Provider } from "react-redux";
import store from "./redux/store";
import storeMentor from "./redux/storeMentor";

const { Footer } = Layout;

function App() {
    const urlArr = ["/", "/mentor-dashboard", "/mentor-login", "/student-register", "/student-dashboard", "/login"];

    return (
        <Layout className="App">
            <Router>
                <Layout>
                    {/* <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                        <Link to="/login">Login</Link>
                        <Link to="/mentor-login">Mentor Login</Link>
                        <Link to="/student-register">Student Register</Link>
                        <Link to="/mentor-dashboard">Mentor Dashboard</Link>
                        <Link to="/student-dashboard">Student Dashboard</Link>
                    </div> */}

                    <Provider store={store}>
                        <Switch>
                            <PublicRoute exact path="/login" component={Login} />
                            <PublicRoute exact path="/student-register" component={RegisterForm} />
                            <PrivateRoute
                                exact
                                path="/student-dashboard"
                                component={StudentDashboard}
                                redirectTo="/login"
                            />
                        </Switch>
                    </Provider>

                    <Provider store={storeMentor}>
                        <Switch>
                            <PublicRoute exact path="/mentor-login" component={LoginMentor} />
                            <PrivateRoute
                                path="/mentor-dashboard"
                                component={MentorDashboard}
                                redirectTo="/mentor-login"
                            />
                        </Switch>
                    </Provider>

                    {/* This was needed because a top level Switch didn't work. */}
                    {!urlArr.find((url) => window.location.pathname.startsWith(url)) && (
                        <Route path={window.location.pathname} component={NotFound} />
                    )}
                </Layout>
            </Router>
            <Footer
                style={{
                    backgroundColor: "white",
                    boxShadow: "0px -1px 20px rgba(85, 85, 85, 0.2)",
                    padding: "20px",
                    marginTop: "1rem",
                    zIndex: 1002,
                }}>
                <ECellFooter
                    developers={[
                        {
                            name: "Abhijit",
                            whatsappNum: "+91 8895219514",
                            profileURL: "https://github.com/abhijit-hota",
                        },
                        { name: "Ashish", whatsappNum: "+91 9983321407", profileURL: "https://github.com/ashishshroti14" },
                    ]}
                />
            </Footer>
        </Layout>
    );
}

export default App;
