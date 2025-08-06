import React from 'react';
import Navbar from './components/Navbar';
import { Routes } from 'react-router-dom';
import EmailGenerator from './pages/Email-Generator';

const App = () => {

  return (
    <div className="px-4 ">
      <Navbar/>
      <EmailGenerator />
      {/* <Routes> */}
        {/* <Route path="/login" element={<Login/>} />
        <Route path="/create-account" element={<SignUp/>} />
        <Route path="/" element={<Home/>} /> */}
      {/* </Routes> */}
    </div>
  )
}

export default App
