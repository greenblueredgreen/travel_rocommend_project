import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MBTITest from "./MBTITest";
import Signup from "./Signup";
import Login from "./Login";
import Main from "./Main";
import WritingForm from './WritingForm';

const App = () => {
  const [hello, setHello] = useState('');

  useEffect(() => {
    axios.get('/api/hello')
      .then(response => setHello(response.data))
      .catch(error => console.log(error));
  }, []);

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<MBTITest />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/main" element={<Main />} />
          <Route path="/write" element={<WritingForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;