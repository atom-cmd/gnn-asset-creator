__dirname = __dirname.replace("app.asar","")
const electron = require("electron"),
    url = require("url"),
    path = require("path"),
    {app, BrowserWindow, Menu, ipcMain, dialog, shell} = electron,
    mainMenuTemplate = [
        {
            label:"File",
            submenu:[
                {
                    label: "Quit",
                    accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",

                    click() {
                        app.quit();
                    }
                }
            ]
        },
        {
            label:"Help",
            submenu:[
                {
                    label:"GNN YouTube Link",
                    accelerator: "F1",

                    click() {
                        createSubWindow("https://www.youtube.com/channel/UCLZVhyohKJzS_g-gzFKD-Sw")
                    }
                },
            ]
        }
    ];
process.env.NODE_ENV = "production"

let mainwindow,
    subWindow;

app.on("ready",function() {
    mainwindow = new BrowserWindow({
        height: 610,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainwindow.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        //hash:"#introduction",
        protocol: "file:",
        slashes: true
    }));

    mainwindow.on("closed",function() {
        app.quit()
    });

    mainwindow.once('focus', () => mainwindow.flashFrame(false))

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    Menu.setApplicationMenu(mainMenu)
})

function createSubWindow(link) {
    subwindow = new BrowserWindow({
        width: 700,
        height: 610,
        webPreferences: {
            nodeIntegration: false
        }
    });
    subwindow.loadURL(link);
}

if(process.platform == "darwin") {
    mainMenuTemplate.unshift({});
}

if(process.env.NODE_ENV != "production") {
    mainMenuTemplate.push({
        label:"Develop",
        submenu:[
            {
                label:"Toggle DevTools",
                accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: "reload"
            }
        ]
    });
}