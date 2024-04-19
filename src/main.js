const { app, Menu, Tray, clipboard, Notification } = require('electron')
const path = require('path')
const Popup = require('./popup/popup.js')
const Edit = require('./edit/edit.js')
const Store = require('./store/store.js')

let store = new Store()
let tray = null
let popup = null;
let edit = null;

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
                popup.show()
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

                    if (Notification.isSupported()) { 
                        const notification = new Notification({
                            title: 'QuickPaste',
                            body: '已设置开机启动。'
                        });
                    
                        notification.show();
                    }
                } else {
                    app.setLoginItemSettings({
                        openAtLogin: false,
                        openAsHidden: false,
                    });

                    if (Notification.isSupported()) { 
                        const notification = new Notification({
                            title: 'QuickPaste',
                            body: '已关闭开机启动。'
                        });
                    
                        notification.show();
                    }
                }
            }
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
                click: (a, b, c) => {
                    if (c.shiftKey) {
                        edit.show(storeItem)
                    } else {
                        clipboard.writeText(storeItem.clipboard);
                    }
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
    edit = new Edit(updateItems)

    updateItems();

    if (Notification.isSupported()) {
        const notification = new Notification({
            title: 'QuickPaste',
            body: 'QuickPaste已启动, 请前往任务栏托盘中寻找。'
        });
    
        notification.show();
    }
})