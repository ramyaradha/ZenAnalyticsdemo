var crypto = require('crypto');


function encrypt(text){
  var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq')
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

exports.encrypt = encrypt;

function decrypt(text){
  var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq')
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

exports.decrypt = decrypt;

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex').toString();
};
exports.md5 = md5;

exports.sam =function() {
  // body...
  var a = encrypt("hai");
  console.log("en" + a);
  console.log(decrypt(a));
}

function sha512(str) {
  return crypto.createHash('sha512').update(str).digest('hex').toString();
};
exports.sha512 = sha512;

function rand(length) {
  if ('undefined' === typeof length) {
    length = 512;
  }
  length = parseInt(length, 10);
  return sha512(crypto.randomBytes(length).toString());
};

exports.rand = rand;

function generateCode(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

exports.generateCode = generateCode;