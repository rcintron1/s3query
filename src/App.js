import React, { Component, useState } from 'react';
import logo from './logo.svg';
import './App.css';

const AWS = require('aws-sdk')
const electron = window.require('electron');
const fs = electron.remote.require('fs');
const {app} = electron.remote;
const ipcRenderer = electron.ipcRenderer

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
const StatusBar = (props) =>{
  return <h2>{props.messages}</h2>
}
const getMainMSG = ()=>{
  //Sending status from main process
  ipcRenderer.on('info' , function(event , data){ 
    console.log(event)
    console.log(data)
    return data
  });

}

const getBucketData = (mfa) => {


}

const S3Form = (props)=> {
  const [s3BucketName, sets3BucketName]= useState({value:''})
  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      const bucketData = ipcRenderer.sendSync('getS3Data','cb-cloudflare-logs')
      console.log("S3Form", )
      props.setS3Data(Object.entries(bucketData))
  
    }catch(e){console.log(e)}
    // get temporary tokens

    // sets3BucketName({value:''});
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={s3BucketName.value}
        onChange={event => sets3BucketName( {value: event.target.value })}
        placeholder="S3 Bucket Name" 
        required 
      />
      <button>Fetch S3 Data</button>
    </form>
  );
}

// const S3TableList=(props)=>{

//   return(
//     <table>
//       {props.s3Data.map(row=><tr><td>{row}</td></tr>)}
//     </table>
//   )
// }

const S3TableList = (props)=>{
  console.log(props.s3Data)
  return <div>
    <table>
      {props.s3Data.map(row=><tr>
        <td>{row[0]}</td>
        <td>{row[1]}</td>
      </tr>)}
    </table>
  </div>
}

const App = () => {
  const [s3Bucket, setS3Bucket] = useState()
  const [messages, setMessages] = useState("No messages")
  ipcRenderer.on('info' , function(event , data){ 
    console.log(event)
    console.log(data)
    setMessages(data)
  });
  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>S3 Query Tool</h2>
        <StatusBar messages={messages}/>
      </div>
      <S3Form setS3Data={setS3Bucket}/>
      {s3Bucket?<S3TableList s3Data={s3Bucket} />:<p>No data</p>}
      <Footer>
      <p className="App-intro">
        Version: {app.getVersion()}
      </p>
      </Footer>
    </div>
  );
}

export default App;
