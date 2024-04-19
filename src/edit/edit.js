const { BrowserWindow, ipcMain, screen, Notification } = require('electron')
const Store = require('./../store/store.js')
const path = require('path')

const store = new Store()

class Edit {
    constructor(updateItems) {
        const { width, height } = screen.getPrimaryDisplay().workAreaSize; // 获取主显示器的尺寸

        let editWindow = new BrowserWindow({
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
        editWindow.setPosition(x, 100);

        editWindow.loadURL('file://' + path.join(__dirname, 'edit.html'))

        editWindow.on('closed', () => {
            editWindow = null
        })

        editWindow.hide()

        this.editWindow = editWindow

        this.updateItems = updateItems

        this.bindEvent()

        // editWindow.webContents.openDevTools();
    }

    bindEvent() {
        ipcMain.on('hide', (event, arg) => {
            this.hide()
        });

        ipcMain.on('refresh-item', () => {
            this.updateItems()
        })

        ipcMain.on('save-item', (event, args) => {
            store.update(args)

            if (Notification.isSupported()) {
                const notification = new Notification({
                    title: 'QuickPaste',
                    body: '编辑成功'
                });
    
                notification.show();
            }
        })

        ipcMain.on('delete-item', (event, args) => {
            store.delete(args)

            if (Notification.isSupported()) {
                const notification = new Notification({
                    title: 'QuickPaste',
                    body: '删除成功'
                });
    
                notification.show();
            }
        })
    }

    show(storeItem) {
        this.editWindow.show()

        this.editWindow.webContents.send('window-show', storeItem);
    }

    hide() {
        this.editWindow.hide()
    }
}

module.exports = Edit