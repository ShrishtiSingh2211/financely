import React from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import './App.css';
import Dashboard from './Pages/Dashboard';
import Signup from './Pages/Signup';


import { BrowserRouter as Router , Routes ,Route } from 'react-router-dom';


function App() {
  console.log("HELLO FIRST MEN >>>" ,{ToastContainer})   
  return (
    <div>
     <ToastContainer />
       <Router>    
          <Routes>
            <Route path='/' element = {<Signup />} />
            <Route path='/dashboard' element = {<Dashboard />} />
          </Routes>
        </Router>
   
    </div>
  );
}

export default App;
