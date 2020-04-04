import React, { Component, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import AWS from 'aws-sdk'


const s3 = new AWS.S3
const sts = new AWS.STS

const {app} = window.require('electron').remote;
const footerStyle = {
  backgroundColor: "black",
  fontSize: "20px",
  color: "white",
  borderTop: "1px solid #E7E7E7",
  textAlign: "center",
  padding: "20px",
  position: "fixed",
  left: "0",
  bottom: "0",
  height: "60px",
  width: "100%"
};

const phantomStyle = {
  display: "block",
  padding: "20px",
  height: "60px",
  width: "100%"
};

function Footer({ children }) {
  return (
    <div>
      <div style={phantomStyle} />
      <div style={footerStyle}>{children}</div>
    </div>
  );
}
const getCreds = () => {
  
}

const Login = (props)=> {
  const [mfaKey, setMfaKey]= useState()
  const handleSubmit = async (event) => {
    event.preventDefault();
    // get temporary tokens

    setMfaKey('');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={mfaKey}
        onChange={event => setMfaKey(event.target.value )}
        placeholder="MultiFactor Key" 
        required 
      />
      <button>Authenticate with MFA</button>
    </form>
  );
}


const S3FileList = (props)=>{
  return <div><h1>list of files</h1></div>
}

const App = () => {
  const [awsCreds, setawsCreds] = useState()
  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Clarabridge</h2>
      </div>
      {awsCreds?null:<Login setcreds={setawsCreds}/>}
      <Footer>
      <p className="App-intro">
        Version: {app.getVersion()}
      </p>
      </Footer>
    </div>
  );
}

export default App;
