# ModelHelper使用 #

## 用途 ##
ModelHelper实现了js数据模型的快速初始化。js数据模型通过继承BaseModel，可以快速将json类型的原始数据赋值到数据模型的属性上，并可以对属性进行特殊处理。

## 安装 ##
`npm install --save modelhelper`

## 使用方法 ##

### 引入 ###
- 在数据模型中引入

	```import BaseModel from 'modelhelper'```

- 数据模型继承 **BaseModel**

	```
	export default class NewModel extends BaseModel {
	
	}
	```
	
	并在 **NewModel** 中的初始化方法中调用数据初始化方法`initByJson`
	
	```
	constructor(props) {
        super(props);

        this.initByJson(props);
    }
    ```
    
    
### 数据初始化配置 ###
原始json数据如下：

```
const data = {
  	stringNumber = '';
	stringNumber2 = '';
	stringJson = '';
	props1 = '';
	props1_1 = '';
}
```
##### toNumber ####
静态方法toNumber返回一个数组，数组中的内容为原始数据中需要转换为`Number`类型的键。

例如：

	static toNumber() {
        return ['stringNumber'];
    }
	
得到的**stringNumber**将是对应的数值。

##### toObject ####
静态方法toObject返回一个数组，数组中的内容为原始数据中需要转换为`Object`类型的键。

例如：

	static toObject() {
        return ['stringJson'];
    }
得到的**stringJson**将是对应的js对象。

	
##### keyMap ####
静态方法keyMap返回一个对象，实现对原始数据中的数据进行映射。

例如：

	static keyMap() {
        return {
            "props1_1": 'props1'
        }
    }
    
**props1**为原始数据的key，**props1_1**为映射后的key，在为**props1**赋值的同时还会赋值给**props1_1**。

#### formatMap ####
静态方法formatMap返回一个对象，实现了对原始数据的自定义处理。

例如：

	static formatMap() {
        return {
            'propsFormat': (oldValue, self)=>{
                self.propsFormatSucces = `格式化之后的：${oldValue}`;
            }
        }
    }
    
 - 返回对象中的key（`propsFormat`）：为原始数据的key
 - 返回对象中的value （`(oldValue, self)=>{}`）为数据处理方法，其中`oldValue`为原始数据中的值，`self`指向了当前数据模型

 所以属性`propsFormat`在被赋值的同时，还会为`propsFormatSucces`赋值，并且值为：`格式化之后的：old_propsFormat`
 
 
### 内部方法 ###
#### clone ####
可以使用clone生成数据模型的深拷贝对象