const electron = require("electron");
const { ipcMain } = require('electron')
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");
const AWS = require('aws-sdk')


const s3 = new AWS.S3
const sts = new AWS.STS
const iam = new AWS.IAM

let mainWindow;

// May need to change this to my repo
// require("update-electron-app")({
//   repo: "kitze/react-electron-example",
//   updateInterval: "1 hour"
// });

function createWindow() {
  mainWindow = new BrowserWindow({ width: 900, height: 680, webPreferences: { nodeIntegration: true }});
  isDev?mainWindow.webContents.openDevTools():null
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
}


app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.reply('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', async (event, arg) => {
  console.log(arg, "test") // prints "ping"
  try{
    var params = {};
    // AWS.config.getCredentials(function(err) {
    //   if (err) console.log(err.stack); // credentials not loaded
    //   else event.returnValue = AWS.config.credentials;
    // })
    const creds = AWS.Credentials
    event.returnValue = creds
   
  }catch (e){
    console.log(e)
  }
  
  
  // event.returnValue = 'pong'
})