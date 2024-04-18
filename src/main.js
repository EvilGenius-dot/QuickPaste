const { app, Menu, Tray, clipboard, BrowserWindow } = require('electron')
const path = require('path')
const Popup = require('./popup/popup.js')
const Store = require('./store/store.js')

let tray = null
let store = new Store()
let popup = null;

const updateItems = () => {
    if (!tray) {
        tray = new Tray(path.join(__dirname, 'icon.png'))
        tray.setToolTip('QuickMenu')
    }

    let storeItems = store.get()
    let items = []

    items.push(
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
        }
    )

    for (let i = 0; i < storeItems.length; i++) {
        let storeItem = storeItems[i];

        items.push(
            {
                type: 'normal',
                label: storeItem.label,
                click: () => {
                    clipboard.writeText(storeItem.clipboard);
                }
            }
        )
    }

    items.push(
        { type: 'separator' },
        { label: '退出', type: 'normal', click: () => app.quit() }
    )

    const contextMenu = Menu.buildFromTemplate(items)

    tray.setContextMenu(contextMenu)
}

app.on('ready', () => {
    if (app.dock) {
        app.dock.hide(); // 在MacOS上隐藏dock图标
    }

    popup = new Popup(updateItems);

    updateItems();
})