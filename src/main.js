const { app, Menu, Tray } = require('electron')
const path = require('path')

let tray = null

app.on('ready', () => {
    if (app.dock) {
        app.dock.hide();
    }

    tray = new Tray(path.join(__dirname, 'icon.png')) // 确保有一个icon.png在项目根目录
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Item1', type: 'radio' },
        { label: 'Item2', type: 'radio' },
        { label: 'Quit', type: 'normal', click: () => app.quit() }
    ])

    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)
})
