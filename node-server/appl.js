var mongo = require('mongodb');
var Grid = require('gridfs-stream');
 
// create or use an existing mongodb-native db instance 
var db = new mongo.Db('samplefile1', new mongo.Server('localhost',27017));
var gfs = Grid(db, mongo);
 
// streaming to gridfs 
var writestream = gfs.createWriteStream({
    filename: 'my_file.txt'
});
fs.createReadStream('/samplefile').pipe(writestream);
 
// streaming from gridfs 
var readstream = gfs.createReadStream({
  filename: 'my_file.txt'
});
 
//error handling, e.g. file does not exist 
readstream.on('error', function (err) {
  console.log('An error occurred!', err);
  throw err;
});
 
readstream.pipe(response);