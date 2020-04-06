const electron = require("electron");
const { ipcMain } = require('electron')
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const awstools = require("./awstools")
const path = require("path");
const isDev = require("electron-is-dev");

const globalData = {}

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

// ipcMain.on('asynchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.reply('asynchronous-reply', 'pong')
//   mainWindow.webContents.send('info',"Testing message")
// })

ipcMain.on('getS3Data', async (event, arg) => {
  const bucketName= arg.Name;
  console.log("getS3Data", arg, globalData[bucketName]?"true":"false")
  if(!globalData[bucketName]) {
    globalData[bucketName]={}
    globalData[bucketName].data = await awstools.s3ListObjects(bucketName)
  }
  globalData[bucketName].startDate = arg.startDate;
  globalData[bucketName].endDate = arg.endDate
  console.log("getS3Data", globalData)
  globalData[bucketName].extData=awstools.s3BucketReduce(globalData[bucketName],)
  console.log(globalData[bucketName].extData)
  event.returnValue = globalData[bucketName].extData
})
count = 1

// setInterval(()=>{
//   count += 1
//   console.log("sending message to renderer")
//   mainWindow.webContents.send('info',`Testing message ${count}`)
// }, 10000)