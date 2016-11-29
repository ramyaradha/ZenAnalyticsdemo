/*var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username : { type: String, required: true, unique: true },
	password : { type: String, required: true},
	pristine: { type: Boolean, default : false },
	dataset: { type : String },
	features : [String]
});

var user = mongoose.model('User',userSchema);
module.exports = user;*/



var mongoose = require('mongoose');
var validator = require('validator');
var path = require('path');
var common = require('../helper/common');
var statustypes = ["Active","Inactive"];
//var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
	username   : { type: String, required: true},
	email      : {type:String, required:true, unique: true},
	password   : {type: String, required: true},
	accessToken: {type: String},
	status     : {type: String, enum: statustypes},
	createdAt  : {type: Date, default: Date.now},
	updatedAt  : {type: Date},
	pristine   : {type: Boolean, default: false},
	dataset    : {type : String },
	sampleFile : {type: String},
	features   : [String]
	
}, {collection:'user'});

userSchema.path('username').validate(function(value){
  return value && (value.length >= 3 && value.length <= 12);
}, 'name should between 3 and 63 character long');

userSchema.path('email').validate(function(value){
return validator.isEmail(value);
}, 'Invalid email');


/*function start(cb) {
  cb = cb || function(err){
    if(err){
      throw err;
    }
  }
}*/

/*userSchema.methods.save = function(cb){
	this.updatedAt = new Date();
	this.accessToken = common.rand();
	this.save(cb);
};

userSchema.methods.createSession = function (cb) {
  this.updatedAt = new Date();
  this.accessToken = common.rand();
  this.save(cb);
};*/

var User = mongoose.model('user',userSchema);
module.exports = User;