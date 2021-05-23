const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
const child_process = require('child_process');
const app = express();

const port = 1234;
const fs = require('fs');
const { Console } = require('console');
var codeLanguage = 0;
// directorul 'views' va conține fișierele .ejs (html + js executat la server)
app.set('view engine', 'ejs');
// suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului este views/layout.ejs
app.use(expressLayouts);
// directorul 'public' va conține toate resursele accesibile direct de către client (e.g., fișiere css, javascript, imagini)
app.use(express.static('public'))
// corpul mesajului poate fi interpretat ca json; datele de la formular se găsesc în format json în req.body
app.use(bodyParser.json());
// utilizarea unui algoritm de deep parsing care suportă obiecte în obiecte
app.use(bodyParser.urlencoded({ extended: true }));

// la accesarea din browser adresei http://localhost:6789/ se va returna textul 'Hello World'
// proprietățile obiectului Request - req - https://expressjs.com/en/api.html#req
// proprietățile obiectului Response - res - https://expressjs.com/en/api.html#res
app.get('/favicon.ico', (req, res) => {
	res.sendFile("/home/ix_andrei/Documents/Facultate/AN3SEM2/OnlineCompilerPW/PW-Online-Compiler/public/images/favicon.ico");
});

app.get('/home', (req, res) => {
	//res.locals.activ=0;
	res.render('home', {
		title: "Home",
		activ: 0,
		inputCode: null,
		outputResult: null,
		lineNr: null,
		language: codeLanguage,
	})
});

app.get('/how', (req, res) => {
	res.render('how', {
		title: "How to",
		activ: 1
	});
});

app.get('/about', (req, res) => {
	res.render('about',
		{
			title: "About",
			activ: 2
		});
});

app.post('/run-input', (req, res) => {
	let extension = ".py";
	switch (codeLanguage) {
		case 0:
			extension = ".py";
			break;
		case 1:
			extension = ".c";
			break;
		case 2:
			extension = ".cpp";
			break;
		case 3:
			extension = ".java";
			break;
		default:
			extension = "py";
	}
	fs.writeFile('./SavedCode/main' + extension, req.body.inputCode, function (err) {
		if (err)
			return console.log(err);
	});
	var dataToSend = null;
	if (codeLanguage === 0) {
		const childPython = child_process.spawn('python', ['./SavedCode/main.py']);
		childPython.stdout.on('data', function (data) {
			//console.log(`stdout:${data}`);
			dataToSend = data.toString();
		});

		childPython.stderr.on('data', function (data) {
			//console.log(`stderr:${data}`);
			dataToSend += data.toString();
		});

		childPython.on('close', (code) => {
			//console.log(`child process close all stdio with code ${code}`);
			//console.log(dataToSend);
			res.render('home', {
				title: "Home",
				activ: 0,
				inputCode: req.body.inputCode,
				outputResult: dataToSend,
				lineNr: req.body.lines,
				language: codeLanguage,
			});
		});
	} else if (codeLanguage === 1) {

		const childC = child_process.spawn('gcc', ['./SavedCode/main.c', '-o', 'programC'])
		childC.stdout.on('data', function (data) {
			//console.log(`stdout:${data}`);
			dataToSend = data.toString();
		});

		childC.stderr.on('data', function (data) {
			//console.log(`stderr:${data}`);
			dataToSend += data.toString();
		});

		childC.on('close', (code) => {
			//console.log(`child process close all stdio with code ${code}`);
			if (dataToSend === null) {
				const program = child_process.spawn('./programC', [])
				program.stdout.on('data', function (data) {
					//console.log(`stdout:${data}`);
					dataToSend = data.toString();
				});

				program.stderr.on('data', function (data) {
					//console.log(`stderr:${data}`);
					dataToSend += data.toString();
				});
				program.on('close', (code) => {
					//console.log(dataToSend);
					res.render('home', {
						title: "Home",
						activ: 0,
						inputCode: req.body.inputCode,
						outputResult: dataToSend,
						lineNr: req.body.lines,
						language: codeLanguage,
					});
				});
			} else {
				res.render('home', {
					title: "Home",
					activ: 0,
					inputCode: req.body.inputCode,
					outputResult: dataToSend,
					lineNr: req.body.lines,
					language: codeLanguage,
				});
			}
		});
	} else if (codeLanguage === 2) {

		const childCPP = child_process.spawn('g++', ['./SavedCode/main.cpp', '-o', 'programCPP'])
		childCPP.stdout.on('data', function (data) {
			//console.log(`stdout:${data}`);
			dataToSend = data.toString();
		});

		childCPP.stderr.on('data', function (data) {
			//console.log(`stderr:${data}`);
			dataToSend += data.toString();
		});

		childCPP.on('close', (code) => {
			//console.log(`child process close all stdio with code ${code}`);
			if (dataToSend === null) {
				const program = child_process.spawn('./programCPP', [])
				program.stdout.on('data', function (data) {
					//console.log(`stdout:${data}`);
					dataToSend = data.toString();
				});

				program.stderr.on('data', function (data) {
					console.log(`stderr:${data}`);
					dataToSend += data.toString();
				});
				program.on('close', (code) => {
					//console.log(dataToSend);
					res.render('home', {
						title: "Home",
						activ: 0,
						inputCode: req.body.inputCode,
						outputResult: dataToSend,
						lineNr: req.body.lines,
						language: codeLanguage,
					});
				});
			} else {
				res.render('home', {
					title: "Home",
					activ: 0,
					inputCode: req.body.inputCode,
					outputResult: dataToSend,
					lineNr: req.body.lines,
					language: codeLanguage,
				});
			}
		});
	}

});

app.get('/python', (req, res) => {
	codeLanguage = 0;
	res.render('home', {
		title: "Home",
		activ: 0,
		inputCode: null,
		outputResult: null,
		lineNr: req.body.lines,
		language: 0,
	});
});

app.get('/c', (req, res) => {
	codeLanguage = 1;
	res.render('home', {
		title: "Home",
		activ: 0,
		inputCode: null,
		outputResult: null,
		lineNr: req.body.lines,
		language: 1,
	});
});

app.get('/cplus', (req, res) => {
	codeLanguage = 2;
	res.render('home', {
		title: "Home",
		activ: 0,
		inputCode: null,
		outputResult: null,
		lineNr: req.body.lines,
		language: 2,
	});
});

app.get('/java', (req, res) => {
	codeLanguage = 3;
	res.render('home', {
		title: "Home",
		activ: 0,
		inputCode: null,
		outputResult: null,
		lineNr: req.body.lines,
		language: 3,
	});
});

app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:1234/home`));
