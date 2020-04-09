import React, { Component, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'

import 'bootstrap/dist/css/bootstrap.min.css';

const electron = window.require('electron');
const fs = electron.remote.require('fs');
const {app} = electron.remote;
const ipcRenderer = electron.ipcRenderer

function Footer({ children }) {
  return (
    <div>
      <div className="phantomStyle" />
      <div className="footerStyle">{children}</div>
    </div>
  );
}
const StatusBar = (props) =>{
  return <h3>{props.messages}</h3>
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
  console.log("s3form",props)
  const [s3BucketName, sets3BucketName]= useState({Name:''})
  const updateState = (event)=>{
        props.setS3Bucket({...props.s3Bucket, Name:event.target.value})
  }
  const handleSubmit = async (event) => {
    // console.log(s3BucketName)
    event.preventDefault();
    
    try{
      const bucketData = ipcRenderer.sendSync('getS3Data',props.s3Bucket)
      console.log("S3Form-try", bucketData )
      props.setS3Bucket(prev=>{
        return {...prev, list:bucketData}
      })
  
    }catch(e){console.log(e)}

  };
  
  return (
    <Form onSubmit={handleSubmit} >
      {props.s3Bucket?
      <div>  
        <label for="bucketName">Bucket Name</label>
        <input
        id="bucketName"
        type="text" 
        value={props.s3Bucket.Name}
        // onChange={event => sets3BucketName( {Name: event.target.value })}
        onChange={updateState}
        placeholder="S3 Bucket Name" 
        required 
        />
        <div>
          <label for="startDate">Start Date</label>
            <DatePicker id="startDate"
              selected={props.s3Bucket.startDate}
              onChange={date => props.setS3Bucket(prevstate=>{
                return {...prevstate,startDate:date}
              })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
            />
        </div>
        <div>
            <label for="endDate">End Date</label>
            <DatePicker id="endDate"
            selected={props.s3Bucket.endDate}
            onChange={date => props.setS3Bucket(prevstate=>{
              return {...prevstate,endDate:date}
            })}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
            />
        </div>

        </div>:<br />}
      <Button variant="dark">Fetch S3 Data</Button>
    </Form>
  );
}

const S3TableList = (props)=>{
  console.log("S3TableList",props)
  const list = Object.entries(props.s3Bucket.list)
  
  return <div style={props.css}>
    <table>
      <tbody>
        {list.map((row,i)=><tr key={i}>
          <td >{row[0]}</td>
          <td>{row[1]}</td>
        </tr>)}
      </tbody>
    </table>
  </div>
}


const App = () => {
  const [s3Bucket, setS3Bucket] = useState({Name:''})
  const [messages, setMessages] = useState("No messages")
  const [endDate, setEndDate] = useState()
  ipcRenderer.on('info' , function(event , data){ 
    console.log(event)
    console.log(data)
    setMessages(data)
  });
  const css={
    display: "flex",
    width:"50%",
    float:"left",
    margin: "20px"
  }
  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>S3 Query Tool</h2>
        <StatusBar messages={messages}/>
      </div>
      <div className="container"></div>
      <S3Form s3Bucket={s3Bucket} setS3Bucket={setS3Bucket}/>
      {s3Bucket.list?<div style={css}>
        <S3TableList style={css} s3Bucket={s3Bucket} />
        {/* <div style={css}> */}
        <div>
          
          <div style={css}>{s3Bucket.startDate?<p>{s3Bucket.startDate.toString()}</p>:<p>noStartDate</p>}</div>
        </div>
        </div>:<p>No data</p>
      }
      <Footer>
      <p className="App-intro">
        Version: {app.getVersion()}
      </p>
      </Footer>
    </div>
  );
}

export default App;
