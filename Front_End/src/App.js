import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MBTITest from "./MBTITest";
import Signup from "./Signup";
import Login from "./Login";
import Main from "./Main";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MBTITest />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </Router>
  );
};

export default App;
