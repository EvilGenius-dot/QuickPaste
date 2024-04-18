const fs = require('fs');
const STORE_FILE_PATH = `${__dirname}/store.json`

class Store {
    constructor() {
        try {
            const items = fs.readFileSync(STORE_FILE_PATH, { encoding: 'utf8' });

            if (items) {
                this.items = JSON.parse(items);
            } else {
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

        this.items = JSON.parse(defaultData)

        console.log('store创建完毕');
    }

    push(item) {
        item.id = this.createID()

        this.items.push(item)

        fs.writeFileSync(STORE_FILE_PATH, JSON.stringify(this.items), { encoding: 'utf8' });
    }

    get(id) {
        let items = this.items;
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

    createID() {
        const timestamp = Date.now().toString(36);
        const randomString = Math.random().toString(36).substr(2, 5);
        
        return timestamp + randomString;
    }
}

module.exports = Store