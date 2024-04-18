const { app, Menu, Tray, clipboard, BrowserWindow } = require('electron')
const path = require('path')
const Popup = require('./popup/popup.js')
const Store = require('./store/store.js')

let tray = null

app.on('ready', () => {
    if (app.dock) {
        app.dock.hide(); // 在MacOS上隐藏dock图标
    }

    tray = new Tray(path.join(__dirname, 'icon.png'))

    const store = new Store()
    const popup = new Popup()

    const contextMenu = Menu.buildFromTemplate([
        { 
            label: '添加选项', 
            type: 'normal', 
            click: (menuItem, browserWindow, event) => {
                if (event.shiftKey) {

                } else {
                    popup.show()
                }
            }
        },
        { label: '设置', type: 'normal' },
        { type: 'separator' },
        { 
            label: '按住 [SHIFT + 鼠标左键] 单击某一项进行编辑', 
            type: 'normal',
            enabled: false
        },
        { 
            label: 'Item1Item1Item1', 
            type: 'normal', 
            click: () => {
                clipboard.writeText('Example text');
            }
        },
        { type: 'separator' },
        { label: '退出', type: 'normal', click: () => app.quit() }
    ])

    tray.setToolTip('QuickMenu')
    tray.setContextMenu(contextMenu)
})