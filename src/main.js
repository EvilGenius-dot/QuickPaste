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
        tray.setToolTip('QuickPaste')
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
        {
            label: '开机启动',
            type: 'checkbox',
            checked: true,
            click: (menuItem) => {
                if (menuItem.checked) {
                    app.setLoginItemSettings({
                        openAtLogin: true,
                        openAsHidden: true,
                        path: app.getPath('exe')
                    });
                } else {
                    app.setLoginItemSettings({
                        openAtLogin: false,
                        openAsHidden: false,
                    });
                }
            }
        },
        {
            label: '设置顺序',
            type: 'normal'
        },
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

    if (!tray.hasClickHandler) {
        tray.on('click', () => {
            tray.popUpContextMenu(contextMenu);
        });

        tray.hasClickHandler = true;
    }
}

app.on('ready', () => {
    app.setLoginItemSettings({
        openAtLogin: true, // 应用将在登录时自动启动
        openAsHidden: true, // 可选，应用将在后台启动，不会打扰用户（macOS）
        path: app.getPath('exe') // 指定启动程序的路径（通常是应用的可执行文件）
    });

    if (app.dock) {
        app.dock.hide(); // 在MacOS上隐藏dock图标
    }

    popup = new Popup(updateItems);

    updateItems();
})