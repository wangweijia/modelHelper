import _ from 'lodash';
export default class BaseModel {
    static initByList(list) {
        let array = [];

        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            let item = new this({
                elementIndex: index,
                ...element
            });
            array.push(item);
        }
        
        return array;
    }

    // 初始化方法
    initByJson(props) {
        if (props) {
            for (let key in props) {
                const element = props[key];
                if (element !== null && element !== undefined) {
                    if (this.objInArray(key, this.toFloatArray())) {
                        this[key] = parseFloat(element);
                    } else if (this.objInArray(key, this.toJsonArray())) {
                        try {
                            this[key] = JSON.parse(element);
                        } catch(e) {
                            console.log(e);
                        }
                    } else {
                        this[key] = element;
                    }

                    this.formatMapFunc(key, element);
                }
            }

            this.modelKeyMapFunc(props);
        }
    }

    toFloatArray() {
        return [];
    }

    toJsonArray() {
        return [];
    }

    objInArray(obj, array) {
        if (array) {
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if (element === obj) {
                    return true;
                }
            }
            return false;
        }
        return false;
    }

    modelKeyMapFunc(props) {
        let keyMap = this.keyMap();
        if (keyMap) {
            let allKey = Object.keys(keyMap);
            allKey.map((oldKey)=>{
                newKey = keyMap[oldKey];
                if (props[newKey] != undefined && props[newKey] != null) {
                    this[oldKey] = props[newKey];
                }
            })
        }
    }

    formatMapFunc(key, oldValue) {
        let formatMap = this.formatMap();
        if (formatMap[key]) {
            let newKey = `${key}_format`;
            let func = formatMap[key];
            let callBack = func(oldValue, this);
            if (callBack) {
                this[newKey] = callBack;
            }
        }
    }

    // 新老键值映射
    keyMap() {
        return {
            "oldKey": 'newKey'
        }
    }

    // vlue格式化
    formatMap() {
        return {
            'key': (oldValue, self)=>{

            }
        }
    }

    // 比较两个对象是否相同
    isDiffWith(item) {
        if (item === undefined) {
            return true;
        }
        if (this.diffKeys) {
            let keys = this.diffKeys();
            for (let index = 0; index < keys.length; index++) {
                const key = keys[index];
                if (item[key] !== undefined && this[key] !== undefined) {
                    let a = item[key];
                    let b = this[key];
                    if (a !== b) {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }
        return false;
    }

    clone() {
        return _.cloneDeep(this);
    }
}