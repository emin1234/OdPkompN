var express = require('express');
var router = express.Router();

var users = [];
var currentUser = {};

/* POST login handler. */
router.post('/', function(req, res, next) {
	var userInput = req.body;

	function checkUserPass(currentValue) {
		return (currentValue.username == userInput.username &&
			currentValue.password == userInput.password);
	}

	if(users.find(checkUserPass)) {
		res.render('welcome', {
			username: userInput.username,
			password: userInput.password
		});
	} else {
		res.render('register', {
			message: 'Vec ste registrovani',
			username: userInput.username
		});
	}
});

module.exports = router;
