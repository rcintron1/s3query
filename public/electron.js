const electron = require("electron");
const { ipcMain } = require('electron')
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const awstools = require("../src/modules/awstools")
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
  console.log("argument received", arg)
  globalData[arg] = await awstools.s3ListObjects(arg)
  console.log(globalData)
  globalData[arg+"reduced"]=awstools.s3BucketReduce(globalData[arg])
  event.returnValue = globalData[arg+"reduced"]
})
count = 1

// setInterval(()=>{
//   count += 1
//   console.log("sending message to renderer")
//   mainWindow.webContents.send('info',`Testing message ${count}`)
// }, 10000)