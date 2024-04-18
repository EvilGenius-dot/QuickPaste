const fs = require('fs');
const STORE_FILE_PATH = `${__dirname}/store.json`

class Store {
    constructor() {
        try {
            const items = fs.readFileSync(STORE_FILE_PATH, { encoding: 'utf8' });

            this.items = JSON.parse(items);
        } catch (error) {
            if (error.code === 'ENOENT') {
                const defaultData = '[]';

                console.log('首次使用, 初始化...');

                fs.writeFileSync(STORE_FILE_PATH, defaultData, { encoding: 'utf8' });

                this.items = JSON.parse(defaultData)

                console.log('store创建完毕');
            } else {
                throw error;
            }
        }
    }
}

module.exports = Store