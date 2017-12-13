var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//handle form submit
app.post("/", function (req, res) {
	const pet = req.body.pet
	const all = [[pet,"Big","Funny"],[pet, "Big", "Funny"],[pet, "Big", "Funny"]]
	getPets(pet, function(data){
		let all = []
		data.forEach( e => {all.push([e[0].species, e[0].size, e[0].mood])});
		res.render('index', {
			animals: all
		});
	});
});

function getPets(searchString, callback){
	let pets = []
	// open the database
	let db = new sqlite3.Database('./database/pet_store.db', sqlite3.OPEN_READWRITE, (err) => {
	  if (err) {
	    console.error(err.message);
	  }
	  console.log('Connected to the pet store database.');
	});
	let sql = "Select * from pets where species LIKE ?";
	db.serialize(() => {
	  db.all(sql,[searchString], (err, row) => {
	    if (err) {
	      console.error(err.message);
	    }
	    pets.push(row);
	    callback(pets)
	  });
	});
	 
	db.close((err) => {
	  if (err) {
	    console.error(err.message);
	  }
	  console.log('Close the database connection.');
	});
}

app.use('/', index);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
app.listen(3000, () => console.log('Example app listening on port 3000!'))

module.exports = app;
