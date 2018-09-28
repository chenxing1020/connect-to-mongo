var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//http方法重载
var methodOverride=require('method-override');
//启用会话
var Session=require('express-session');
var flash=require('connect-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/todo_development',{useNewUrlParser:true},function(err){
  if(!err){
    console.log('connected to MongoDB');
  }else{
    throw err;
  }
})
var Schema=mongoose.Schema;
var ObjectId=Schema.ObjectId;
var Task=new Schema({
  task:String
},{versionKey:false});
var Task=mongoose.model('Task',Task);

var app = express();

//http方法重载
app.use(methodOverride('_method'));

//启用会话
app.use(flash());
app.use(Session({secret:"zmgxovYAMB160inEocuu",resave:false,saveUninitialized:true}));
app.use(function(req,res,next){
  res.locals.warning=req.flash('warning');
  res.locals.info=req.flash('info');
  next();
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//显示任务-路由
app.get('/tasks',function(req,res){
  Task.find({},function(err,docs){
    res.render('tasks/index',{
      title:'Todos index view',
      docs:docs
    });
  });
});

//添加任务-路由
app.get('/tasks/new',function(req,res){
  res.render('tasks/new.jade',{
    title:'New Task'
  });
});
app.post('/tasks',function(req,res){
  var task=new Task(req.body.task);
  task.save(function(err){
    if(!err){
      req.flash('info','Task created!');  //闪出消息
      res.redirect('/tasks');
    }else{
      req.flash('warning',err);
      res.redirect('/tasks/new');
    }
  });
});

//修改任务-路由
app.get('/tasks/:id/edit',function(req,res){
  Task.findById(req.params.id,function(err,doc){
    res.render('tasks/edit',{
      title:'Edit Task View',
      task:doc
    });
  });
});
app.put('/tasks/:id',function(req,res){
  Task.findById(req.params.id,function(err,doc){
    doc.task=req.body.task.task;
    doc.save(function(err){
      if(!err){
        req.flash('info','edit succeed');
        res.redirect('/tasks');
      }else{
        console.log('修改任务失败！');
      }
    });
  });
});

//删除任务-路由
app.delete('/tasks/:id',function(req,res){
  Task.findById(req.params.id,function(err,doc){
    if (!doc) return next(new NotFound('Document not found'));
    doc.remove(function(){
      req.flash('info','delete completed');
      res.redirect('/tasks');
    });
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
