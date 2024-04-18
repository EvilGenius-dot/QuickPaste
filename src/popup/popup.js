const { BrowserWindow, ipcMain, screen } = require('electron')
const path = require('path')

class Popup {
    constructor() {
        const { width, height } = screen.getPrimaryDisplay().workAreaSize; // 获取主显示器的尺寸

        let popupWindow = new BrowserWindow({
            width: 450,
            height: 190,
            resizable: false,
            frame: false,
            alwaysOnTop: true,
            webPreferences: {
                contentSecurityPolicy: false,
                nodeIntegration: true,
                contextIsolation: false
            }
        })

        const x = Math.round((width - 400) / 2); // 计算屏幕中央的 x 坐标
        popupWindow.setPosition(x, 100);
        
        popupWindow.loadURL('file://' + path.join(__dirname, 'popup.html'))
        
        popupWindow.on('closed', () => {
            popupWindow = null
        })

        ipcMain.on('hide', (event, arg) => {
            this.hide()
        });
        
        // popupWindow.hide()

        this.popupWindow = popupWindow

        // popupWindow.webContents.openDevTools();
    }

    show() {
        this.popupWindow.show()
    }

    hide() {
        this.popupWindow.hide()
    }
}

module.exports = Popup