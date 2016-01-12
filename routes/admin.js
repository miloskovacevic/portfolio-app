var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'portfolio'
});

connection.connect();

router.get('/', function (req, res) {
    connection.query('SELECT * FROM projects', function (err, rows, fields) {
        if(err) throw err;

        res.render('dashboard', {
            "rows" : rows
        });
    });
});

router.get('/new', function(req, res){
    res.render('new');
});

router.post('/new', function(req, res){
    var title        = req.body.title;
    var description  = req.body.description;
    var service      = req.body.service;
    var client       = req.body.client;
    var projectdate  = req.body.projectdate;

    //check Image
    if(req.file.singleInputFileName){
        var projectImageOriginalName  = req.file.singleInputFileName.originalname;
        var projectImageName          = req.file.singleInputFileName.name;
        var projectImageMime          = req.file.singleInputFileName.mimetype;
        var projectImagePath          = req.file.singleInputFileName.path;
        var projectImageExt           = req.file.singleInputFileName.extension;
        var projectImageSize          = req.file.singleInputFileName.size;
    }else {
        var projectImageName = 'noimage.jpg';
    }

    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('service', 'Service field is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        res.render('new', {
            errors: errors,
            title: title,
            description: description,
            servicce: service,
            client: client,
            projectdate: projectdate
        });
    }else {
        var project = {
            title: title,
            description: description,
            service: service,
            client: client,
            date: projectdate,
            image: projectImageName
        };
        var query = connection.query('INSERT INTO projects SET ?', project, function (err, result) {
            // project inserted
            console.log('project inserted!');
        });

        req.flash('success', 'Project added');

        res.location('/admin');
        res.redirect('/admin');

    }
});


router.get('/edit/:id', function (req, res) {
    connection.query('SELECT * FROM projects WHERE id = ' + req.params.id, function (err, row, fields) {
        if(err) throw err;

        res.render('edit', {
            "row" : row[0]
        });
    });
});

router.post('/edit/:id', function(req, res){
    var title        = req.body.title;
    var description  = req.body.description;
    var service      = req.body.service;
    var client       = req.body.client;
    var projectdate  = req.body.projectdate;

    //check Image
    if(req.file.singleInputFileName){
        var projectImageOriginalName  = req.file.singleInputFileName.originalname;
        var projectImageName          = req.file.singleInputFileName.name;
        var projectImageMime          = req.file.singleInputFileName.mimetype;
        var projectImagePath          = req.file.singleInputFileName.path;
        var projectImageExt           = req.file.singleInputFileName.extension;
        var projectImageSize          = req.file.singleInputFileName.size;
    }else {
        var projectImageName = 'noimage.jpg';
    }

    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('service', 'Service field is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        res.render('new', {
            errors: errors,
            title: title,
            description: description,
            servicce: service,
            client: client,
            projectdate: projectdate
        });
    }else {
        var project = {
            title: title,
            description: description,
            service: service,
            client: client,
            date: projectdate,
            image: projectImageName
        };
        var query = connection.query('UPDATE projects SET ? WHERE id = ' + req.params.id, project, function (err, result) {
            // project inserted
            console.log('project inserted!');
        });

        req.flash('success', 'Project updated!');

        res.location('/admin');
        res.redirect('/admin');

    }
});

router.delete('/delete/:id', function (req, res) {
    connection.query('DELETE FROM projects WHERE id = ' + req.params.id, function (err, result) {
        if(err) throw err;
    });

    req.flash('success', 'Project deleted!!');

    res.location('/admin');
    res.redirect('/admin');
});


module.exports = router;