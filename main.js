const electron = require('electron')
const url = require('url')
const path = require('path')

const {app, BrowserWindow, Menu, ipcMain } = electron

let mainWindow;
let addWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    mainWindow.on('closed', () => {
        app.quit()
    })

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    Menu.setApplicationMenu(mainMenu)
})

const createAddWindow = () => {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Item',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname,'addItem.html'),
        protocol: 'file:',
        slashes: true
    }))

    addWindow.on('close', () => {
        addWindow = null
    })
}

ipcMain.on('item:add',function(e, item){
    console.log(item)
    mainWindow.webContents.send('item:add', item)
    addWindow.close()
})

const mainMenuTemplate = [
    {
        label: 'file',
        submenu:[
            {
                label: 'Add Item',
                accelerator: process.platform == 'darwin' ? 'command+N' : 'ctrl+N',
                click(){
                    createAddWindow()
                }
            },
            {
                label: 'Clear Item',
                accelerator: process.platform == 'darwin' ? 'command+D' : 'ctrl+D',
                click(){
                    mainWindow.webContents.send('item:clear')
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'command+Q' : 'ctrl+Q',
                click(){
                    app.quit()
                }
            }
        ]
    }
]

if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({})
}

if(process.env.NODE_ENV != 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle Dev Tools',
                accelerator: process.platform == 'darwin' ? 'command+I' : 'ctrl+I',
                click(item, focusedwindow){
                    focusedwindow.toggleDevTools()
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}