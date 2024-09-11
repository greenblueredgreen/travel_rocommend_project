import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MBTITest from "./MBTITest";
import Signup from "./Signup";
import Login from "./Login";
import Main from "./Main";


const App = () => {

  const [hello, setHello] = useState('')

   useEffect(() => {
       axios.get('/api/hello')
       .then(response => setHello(response.data))
       .catch(error => console.log(error))
   }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MBTITest />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Main />} />
      </Routes>
       <div>
           백엔드에서 가져온 데이터입니다 : {hello}
       </div>
    </Router>
    
  );
};

export default App;
