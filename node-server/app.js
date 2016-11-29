
// call the packages we need

var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var multer  = require('multer');
var fs = require('fs');
var mongoose   = require('mongoose');
//mongoose.Promise = require('bluebird');
//var morgan     = require('morgan');
//var tmp = multer({dest: 'tmp/'});


 //allow cross origin requests
app.use(function(req, res, next) {
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });


// configure app
//app.use(morgan('dev')); // log requests to the console
// configure body parser
//app.use(fileUpload());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var upload = multer({ dest: './uploads' });



 //multers disk storage settings
 var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          console.log("fikle");
            cb(null, './uploads/');
            console.log("uploads")
            console.log(storage);
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
    });
 var upload = multer({storage: storage}).single('file'); //multer setting


/*var upload = multer({ dest: './uploads' });
app.get('/public/templates/step-1.html', function(req, res){
  res.sendFile(__dirname + "/public/templates" + "step-1.html");
})*/

var port     = process.env.PORT || 8000; // set our port
mongoose.connect('mongodb://localhost:27017/ZenAnalytics'); // connect to our database
var User = require("./models/user");



// ROUTES FOR OUR API
//=============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Something is happening.');
  next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8000/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' }); 
});

/*  API for read file from local folder */

console.log("before reading");
router.route('/user/readfile')
.get(function(req, res){
  console.log("Going to read directory /uploads");
fs.readdir("./uploads/",function(err, files){
   if (err) {
      return console.error(err);
      res.json(err);
   }
   files.forEach( function (file){
      console.log( file );
      res.json(file);
   });
});
      
});

// create a user (accessed at POST http://localhost:8000/createuser)


router.route('/createuser')
  .post(function(req, res, next) {
    
    var createuser = new User();    // create a new instance of the user model
    createuser.username = req.body.username;  // set the users name (comes from the request)
    createuser.email = req.body.email;
    createuser.password = req.body.password;
    createuser.accessToken = req.body.accessToken;
    createuser.status = req.body.status;
    createuser.createdAt = req.body.createdAt;
    createuser.updatedAt = req.body.updatedAt;
    createuser.dataset = req.body.dataset;
    createuser.sampleFile = req.body.sampleFile;

   createuser.save(function(err, user) {

/*if(loggedInUser){
  loggedInUser.createSession(function(err, user){
    if(err){
      res.json({message: 'error loggin in user'});
      return next();


    }else if(user){
      user.password = '';
      res.json(user);
      console.log(user);
      return next();
    }
  });
}*/
 if (err)
        res.send(err);
        res.json(user);
        console.log(user);
        //res.send(user);

    }); 
  })


  // get all the user (accessed at GET http://localhost:8080/api/createuser)
  .get(function(req, res) {
    User.find(function(err, user) {
      if (err)
        res.send(err);

      res.json(user);
    });
  });



// on routes that end in /user/:id

router.route('/user/:id')

  // get the bear with that id
  .get(function(req, res) {
    User.findById(req.params.id, function(err, user) {
      if (err)
        res.send(err);
      res.json(user);
    });
  })

  // update the user with this id
  .put(function(req, res) {
    User.findById(req.params.id, function(err, user) {

      if (err)
        res.send(err);
       

       //var createuser = new User(); 

      createuser.username = req.body.username;
      createuser.email = req.body.email;
      createuser.password = req.body.password;
      createuser.accessToken = req.body.accessToken;
      createuser.status = req.body.status;
      createuser.createdAt = req.body.createdAt;
      createuser.updatedAt = req.body.updatedAt;

      createuser.save(function(err) {
        if (err)
          res.send(err);

        res.json({ message: 'user updated!' });
      });
    });
  })

  // delete the user with this id
  .delete(function(req, res) {
    var id = req.params.id;
    User.remove({_id: req.params.id}, function(err, user) {
      if (err)
        res.send(err);

      res.json({ message: 'Successfully deleted' });
      console.log(id);
    });
  });
  
//===============================================================================================


// API for login user

/*router.route('/user/login1')
.post(function(req, res){
  var username1 = req.body.username;
 var password1 = req.body.password;
 User.findOne({username1} && {password1}, function(){
  if(username == username1 && password == password1){
   res.json({message: 'user successfully login'});

  }else{
    res.json({message: 'user password is wrong'})
  }

 })
 
 
})*/

router.route('/user/login')
.post(function(req, res){

 //var user = req.body.user;
//var password1 = req.body.user.password;
 //var username1 = req.body.user.username;
  
   /*if(typeof req.body.username== 'undefined' || req.body.username == ''){
      res.send(400,{user:'username is missing'});
  }
  if(typeof req.body.password == 'undefined' || req.body.password == ''){
    res.send(400,{user:'password is missing'});
    return next();
  }*/
  User.findOne({'username': req.body.username} || {'password': req.body.password}, function(err, user){
    
    
var failure = {
  status : false
}


    if (err){
      
      res.json({message: 'error looking user'});

    
    }else if(!user){
      res.json({message: 'no user exist'});

    }else if(user){
      if(req.body.password !== user.password){
        console.log("password unvalidate");
        res.json({message: 'password is wrong'});
      }
      else{
      console.log("successfully login");
      console.log(user);
        res.json({user});
      //res.json({message: 'user successfully login'});
           }
    }

/*if (err){
      res.json({message: 'error looking in user'});
      return next;
    }else{


    res.json({message: 'user successfully login'});
    console.log(user);
    console.log("successfully login");
}*/
  
  });
});
//==============================================================================================



/** API for upload the files */

    router.route('/user/upload1')
  .post(function(req, res) {
        upload(req,res,function(err, file){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});
             res.json(file);
        });
    });

//==============================================================





/*router.route('/get-file-path')
.get(function(req, res, next){
  //if(user == "") user = 'SBI';
  User.findOne({username: req.params.username},function(err, user){
        if(err) {
          console.log(err);
          res.json({});
        }
        var data = {
          filepath : user.dataset
        }
        res.json(data);
      console.log("The file path retrieved" + data.filepath);
  });
});*/



  // upload file form user

  router.route('/user/upload')
  .post(function(req, res, next){
    console.log(req.files.file.name);
    console.log(req.files.file.path);
    console.log(req.files.file.type)
    var file = __dirname + "/uploads" + req.files.file.name;
    fs.readFile(req.files.file.path, function(err, data){
      fs.writeFile(file, data, function(err){
        if(err){
          console.log(err);

        }else{
          response = {
            message:'File uploaded successfully',
            filename: req.files.file.name
          };
        }
        console.log(response);
        res.end(JSON.stringify(response));
      });
    });

  });





/*var Converter = require("csvtojson").Converter;
var converter = new Converter({});
converter.fromFile("./dataset/ZEXCddRRfi.csv",function(err,result){
 
 //if(err)
  //res.send(err);
  console.log("csv to json converted");
console.log(result);
console.log(converter);
//res.json({message: 'csv to json converted'});
});

router.route('/user/upload')
  .get(function (req, res) {
    var filePath = "/samplefile/sathya.pdf";

    fs.readFile(__dirname + filePath , function (err,data){
        res.contentType("application/pdf");
        console.log(sathya.pdf);
        //res.send(data);
        //res.send(filePath);
        //console.log(filePath);
        //res.json({ message: 'successfully updated'});
        res.pipe(sathya.pdf);
    });
})

router.route('/user/upload1')
.post(function(req, res){
   var sampleFile;
 
    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }
 
    sampleFile = req.files.sampleFile;
    sampleFile.mv('./samplefile/sathya.pdf', function(err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.send('File uploaded!');
        }
    });
  });


//Uplaod file

router.route('/user/uplaod')
.post(function(req,res){
   var sampleFile;
  if(!req.files){
    res.send('no files were uploaded');
    return;
  }
  sampleFile = req.files.sampleFile;
  creaeuser.save(function(err, user){
            
          sampleFile.mv('samplefile/sathya.doc', function(err){
            if(err){
              res.status(500).send(err);
              else{
                res.send('file uploaded')
              }
            }
          });
        
          });      

   
var uploading = multer({
  dest: __dirname + '../samplefile/',
})

router.post('/upload', uploading, function(req, res) {

})

module.exports = router*/



// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

















































/*var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var api = require('./routes/api');


var app = express();

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//enforcing https protocol
function forceHTTPS(req, res, next) {
    if ((req.header('x-forwarded-proto') != 'https') && (app.get('env') != "development")) {
        //FYI this should work for local development as well
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}

//app.use(forceHTTPS);
//app.use('/', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;*/
