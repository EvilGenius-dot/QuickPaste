const { BrowserWindow } = require('electron')
const path = require('path')

class Popup {
    constructor() {
        let popupWindow = new BrowserWindow({
            width: 730,
            height: 210,
            y: 1,
            resizable: false,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        })
        
        popupWindow.loadURL('file://' + path.join(__dirname, 'popup.html'))
        
        popupWindow.on('closed', () => {
            popupWindow = null
        })
        
        popupWindow.hide()

        this.popupWindow = popupWindow
    }

    show() {
        this.popupWindow.show()
    }

    hide() {
        this.popupWindow.hide()
    }
}

module.exports = Popup