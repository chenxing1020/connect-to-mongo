# connect-to-mongo
nodejs+express连接MongoDB

---
## **表单数据返回值undefined** 
查了一圈，都是在说要对req.body的返回值进行解析，原始的npm中使用的是body-parser中间件，后来发现express4.16.x之后都集成了express.json()和express.urlencoded(),再回到app.js中发现extended选项默认都是false，所以将其改成true即可。
```javascript
app.use(express.json());
app.use(express.urlencoded({ extended: false }));      //改为true
```
---
## **mongoose插入数据有"_v"字段**
_v字段用来记录版本号，如果不需要版本号，直接设置即可。
```javascript
var userschema=new Schema({
  ...
},{versionKey:false});
```
---
## **RESTful风格**

首先贴出百度百科对于RESTful的定义:
>REST（Representational State Transfer）描述了一个架构样式的网络系统，比如 web 应用程序。REST 指的是一组架构约束条件和原则。满足这些约束条件和原则的应用程序或设计就是 RESTful。  
Web 应用程序最重要的 REST 原则是，客户端和服务器之间的交互在请求之间是无状态的。从客户端到服务器的每个请求都必须包含理解请求所必需的信息。  
在服务器端，应用程序状态和功能可以分为各种资源。资源是一个有趣的概念实体，它向客户端公开。资源的例子有：应用程序对象、数据库记录、算法等等。每个资源都使用 URI (Universal Resource Identifier) 得到一个唯一的地址。所有资源都共享统一的接口，以便在客户端和服务器之间传输状态。使用的是标准的 HTTP 方法，比如 GET、PUT、POST 和 DELETE。 


在进行数据库CRUD操作 **(create,retrieve,update,delete)** 的时候，很自然的根据RESTful风格来说http的方法给出了 **get,post,put,delete** 。但是在实际操作中，由于前端的表单标签\<form>的method属性只有GET和POST两个属性，所以查阅资料发现，express框架在前端给出了"_method"字段来将post指向put：
```javascript
form(method='post',action='/tasks/'+task.id)
  input(name='_method',value='put',type='hidden')
```
但是在实际操作中，express4.16版本下在执行表单提交之后返回的是404响应。直接去掉put方法改用post方法后,成功执行了更新数据的操作。  

所以上网查了一下http这四个方法的区别，发现put和delete方法用的很少,get和post其实能够完成数据库增删改查的任务，但是实际上method的区别只是语义上的，本质上都是对url执行动作，为了满足restful的编码规范，所以设计了put和delete来满足规范。  

更具体的叙述见：<a href="https://blog.csdn.net/Ideality_hunter/article/details/80660434" target="_blank">CSDN博客：get、post、put、delete，为什么一般只用过get和post？</a>