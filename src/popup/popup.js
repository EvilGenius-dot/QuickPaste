const { BrowserWindow, ipcMain, screen, Notification } = require('electron')
const Store = require('./../store/store.js')
const path = require('path')

const store = new Store()

class Popup {
    constructor(updateItems) {
        const { width, height } = screen.getPrimaryDisplay().workAreaSize; // 获取主显示器的尺寸

        let popupWindow = new BrowserWindow({
            width: 450,
            height: 190,
            resizable: false,
            frame: false,
            alwaysOnTop: true,
            webPreferences: {
                enableRemoteModule: true,
                contextIsolation: false,
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

        popupWindow.hide()

        this.popupWindow = popupWindow

        this.updateItems = updateItems

        this.bindEvent()

        // popupWindow.webContents.openDevTools();
    }

    bindEvent() {
        ipcMain.on('hide', (event, arg) => {
            this.hide()
        });

        ipcMain.on('refresh-item', () => {
            this.updateItems()
        })

        ipcMain.on('add-item', (event, args) => {
            store.push(args)

            if (Notification.isSupported()) {
                const notification = new Notification({
                    title: '添加成功',
                    body: '可在菜单中找到添加项'
                });
    
                notification.show();
            }
        })
    }

    show() {
        this.popupWindow.show()

        this.popupWindow.webContents.send('window-show');
    }

    hide() {
        this.popupWindow.hide()
    }
}

module.exports = Popup