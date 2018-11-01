var express = require('express');
var router = express.Router();

var users = [];
var loggedin = [];

/* GET home page. */
router.get('/', function(req, res, next) {
    res.clearCookie("name");
    res.render('index', { title: 'Naslov' });
});


/* POST login */
router.post('/login', function(req, res, next) {
    var userInfo = req.body;

    function checkUser(currentValue) {
        return (currentValue.username === userInfo.username &&
            currentValue.password === userInfo.password);
    }

    // ako postoji, posalji cookie klijentu, dodaj cookie u listu logovanih i renderuj welcome
    if(users.find(checkUser)) {
        res.cookie('name', userInfo.username);
        loggedin.push(userInfo.username);

        res.render('welcome', { username: userInfo.username });
    } else {
        // ako ne, izbaci gresku
        res.render('login', { message: 'Pogresan username ili sifra' });
    }
});


/* POST register */
router.post('/register', function(req, res, next) {
    var userInfo = req.body;

    if(userInfo.username === "" || userInfo.password === "") {
        res.render('login', { message: "Greska: Prazan username ili password" });
        return;
    }

    function checkUser(currentValue) {
        return (currentValue.username === userInfo.username);
    }

    if(users.find(checkUser)) {
        res.render('register', {
            username: userInfo.username,
            message: 'Vec ste registrovani'
        });
    } else {
        users.push({
            username: userInfo.username,
            password: userInfo.password,
            todo: []
        });

        /*
         * ako se uspjesno registruje, vrati klijentu cookie, dodaj cookie
         * u listu logovanih, i prebaci klijenta na welcome
         */
        res.cookie('name', userInfo.username); // salje klijentu cookie
        loggedin.push(userInfo.username); // dodaj cookie u listu
                                // (ovdje je cookie isti ko username, da nije morali bi nekako
                                // mapirati username sa cookiem, npr "cookie:username")
        // prebaci klijenta na welcome
        res.render('welcome', { username: userInfo.username });
    }
});

/* GET todo */
router.get('/todo', function(req, res, next) {
    // provjeri cookie, i ako je logovan prikazi, ako nije prebaci ga na '/'

    var name = req.cookies.name;

    // kad promijenis cookie na neki broj, koristi mapu: Map()
    // users[kljuc] = vrijednost;
    // if(users[kljuc])
    function checkUser(currentValue) {
        return (currentValue.username === name);
    }

    // moramo koristiti checkCookie jer nije ista struktura listi 'users' i 'loggedin'
    function checkCookie(currentValue) {
        return (currentValue === name);
    }

    console.log(name);
    console.log(req.cookies.name);
    console.log(loggedin);
    console.log(loggedin.find(checkUser));

    // ako nije logovan, vrati ga na pocetak
    if(loggedin.find(checkCookie) === undefined) {
        res.redirect('/');
        return;
        // kad ne bi stavili return, on bi proso dole i pokuso renderovat response koji
        // je vec zavrsen (redirectan). to pravi error.
    }

    // ako je logovan, onda mu ispisi todo listu
    var toDoList = users.find(checkUser).todo;

    res.render('todo', {values: toDoList});
});



/* POST todo */
router.post('/todo', function(req, res, next) {

    var newTask = req.body.task;
    var name = req.cookies.name;

    function checkUser(currentValue) {
        return (currentValue.username === name);
    }

    function checkCookie(currentValue) {
        return (currentValue === name);
    }

    if(loggedin.find(checkCookie) === undefined) {
        res.redirect('/');
        return;
    }

    var toDoList = users.find(checkUser).todo;

    toDoList.push(newTask);
    res.redirect('/todo');
});


module.exports = router;
