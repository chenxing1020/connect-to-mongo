# connect-to-mongo
nodejs连接MongoDB


### 表单数据返回值undefined 
查了一圈，都是在说要对req.body的返回值进行解析，原始的npm中使用的是body-parser中间件，后来发现express4.16.x之后都集成了express.json()和express.urlencoded(),再回到app.js中发现extended选项默认都是false，所以将其改成true即可。
```javascript
app.use(express.json());
app.use(express.urlencoded({ extended: false }));      //改为true
```