import _ from 'lodash';
class BaseModel extends Object {
    /**
     * number
     * 当使用 initByList 方法初始化列表的时候，会默认赋值index
     */
    elementIndex = 0;

    /**
     * 序列华初始
     * @param {Array} list 
     * @param {Number} baseIndex 序列号下标的起始值
     */
    static initByList(list, baseIndex = 0) {
        let array = [];

        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            let item = new this({
                elementIndex: index + baseIndex,
                ...element
            });
            array.push(item);
        }
        
        return array;
    }

    constructor(props) {
        super(props);
        const p = props || {};
        this.initByJson(p);
    }

    thisClass() {
        const c = this.__proto__.constructor;
        return c;
    }

    /**
     * 舒适化数据
     * @param {Object} props 
     */
    initByJson(props) {
        if (props) {
            for (let key in props) {
                const element = props[key];
                if (element !== null && element !== undefined) {
                    if (this.objInArray(key, this.thisClass().toNumber())) {
                        this[key] = Number(element);
                    } else if (this.objInArray(key, this.thisClass().toObject())) {
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

    /**
     * 判断 item 是否在 数组中
     * @param String obj 
     * @param {Array} array 
     */
    objInArray(obj, array) {
        if (array) {
            return array.indexOf(obj) !== -1;
        }
        return false;
    }

    modelKeyMapFunc(props) {
        let keyMap = this.thisClass().keyMap();
        if (keyMap) {
            let allKey = Object.keys(keyMap);
            allKey.map((oldKey)=>{
                const newKey = keyMap[oldKey];
                if (props[newKey] != undefined && props[newKey] != null) {
                    this[oldKey] = props[newKey];
                }
            })
        }
    }

    formatMapFunc(key, oldValue) {
        let formatMap = this.thisClass().formatMap();
        if (formatMap[key]) {
            let newKey = `${key}_format`;
            let func = formatMap[key];
            let callBack = func(oldValue, this);
            if (callBack) {
                this[newKey] = callBack;
            }
        }
    }

    /**
     * 定义需要 默认转行为 float 类型的 原始数据 key 值列表
     */
    static toNumber() {
        return [];
    }

    /**
     * 定义需要 默认转行为 Array 类型的 原始数据 key 值列表
     */
    static toObject() {
        return [];
    }

    /**
     * 定义原始数据 和 数据模型 键值映射
     */
    static keyMap() {
        return {
            "newKey": 'oldKey'
        }
    }

    /**
     * 自定义模型属性初始化方法
     */
    static formatMap() {
        return {
            'key': (oldValue, self)=>{

            }
        }
    }

    /**
     * 自定义 数据模型 diff 比较方法 比较键值
     */
    static diffKeys() {
        return undefined;
    }

    /**
     * 比较两个对象是否相同(之不比价对应属性)
     * @param {Object} item 
     */
    isDiffWith(item) {
        if (item === undefined) {
            return true;
        }
        let keys = this.thisClass().diffKeys();
        if (keys) {
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
        } else {
            return JSON.stringify(this) === JSON.stringify(item);
        }
    }

    /**
     * 数据模型深拷贝
     */
    clone() {
        return _.cloneDeep(this);
    }
}

export default BaseModel;