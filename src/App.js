import React, { Component, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import AWS from 'aws-sdk'


const s3 = new AWS.S3
const sts = new AWS.STS

const {app} = window.require('electron').remote;

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
      <p className="App-intro">
        <b> Release 0.2.7 </b>
        Version: {app.getVersion()}
      </p>
    </div>
  );
}

export default App;
