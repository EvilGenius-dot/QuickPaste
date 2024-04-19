const fs = require('fs');
const path = require('path');
const electron = require('electron');

const USER_DATA_PATH = (electron.app || electron.remote.app).getPath('userData');
const STORE_FILE_PATH = path.join(USER_DATA_PATH, 'store.json');

class Store {
    constructor() {
        try {
            const items = fs.readFileSync(STORE_FILE_PATH, { encoding: 'utf8' });

            if (!items) {
                this.initFile()
            }
        } catch (error) {
            if (error.code === 'ENOENT') {
                this.initFile()
            } else {
                throw error;
            }
        }
    }

    initFile() {
        const defaultData = '[]';

        console.log('首次使用, 初始化...');

        fs.writeFileSync(STORE_FILE_PATH, defaultData, { encoding: 'utf8' });

        console.log('store创建完毕');
    }

    push(item) {
        let items = this.get();

        item.id = this.createID()

        items.push(item)

        fs.writeFileSync(STORE_FILE_PATH, JSON.stringify(items), { encoding: 'utf8' });
    }

    get(id) {
        let items = JSON.parse(fs.readFileSync(STORE_FILE_PATH, { encoding: 'utf8' }));
        let res;

        if (!id) {
            res = items
        } else {
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                if (item.id == id) {
                    res = item
                    break
                }
            }
        }

        return res
    }

    update(item) {
        let storeItems = this.get();
        
        for (let i = 0; i < storeItems.length; i++) {
            let storeItem = storeItems[i];

            if (storeItem.id == item.id) {
                storeItems[i] = item
            }
        }

        fs.writeFileSync(STORE_FILE_PATH, JSON.stringify(storeItems), { encoding: 'utf8' });
    }

    delete(item) {
        let storeItems = this.get();
        
        storeItems = storeItems.filter(storeItem => storeItem.id !== item.id);

        fs.writeFileSync(STORE_FILE_PATH, JSON.stringify(storeItems), { encoding: 'utf8' });
    }

    createID() {
        const timestamp = Date.now().toString(36);
        const randomString = Math.random().toString(36).substr(2, 5);
        
        return timestamp + randomString;
    }
}

module.exports = Store