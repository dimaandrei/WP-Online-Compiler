const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
const child_process = require('child_process');
const app = express();
var dir =  process.cwd();

const port = 1234;
const fs = require('fs');
const { Console } = require('console');
const { mainModule } = require('process');

var testPy;
var testC;
var testCPP;
var testJava;
var codeLanguage = 0;

fs.readFile('./SavedCode/test.py', 'utf8', (err, data) => {
	if (err) {
		console.error(err)
		return
	}
	testPy = data;
});
fs.readFile('./SavedCode/test.c', 'utf8', (err, data) => {
	if (err) {
		console.error(err)
		return
	}
	testC = data;
});
fs.readFile('./SavedCode/test.cpp', 'utf8', (err, data) => {
	if (err) {
		console.error(err)
		return
	}
	testCPP = data;
});
fs.readFile('./SavedCode/testJava.java', 'utf8', (err, data) => {
	if (err) {
		console.error(err)
		return
	}
	testJava = data;
});


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
	//res.sendFile("/home/ix_andrei/Documents/Facultate/AN3SEM2/OnlineCompilerPW/PW-Online-Compiler/public/images/favicon.ico");
	res.sendFile("/public/images/favicon.ico");
});


app.get('/home', (req, res) => {
	//res.locals.activ=0;
	codeLanguage=0;
	res.render('home', {
		title: "Home",
		activ: 0,
		inputCode: testPy,
		outputResult: null,
		lineNr: null,
		language: codeLanguage,
		downloadName:"main.py",
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
	if (extension != ".java") {
		fs.writeFile('./SavedCode/main' + extension, req.body.inputCode, function (err) {
			if (err)
				return console.log(err);
		});
	}
	else {
		fs.writeFile('./SavedCode/Main' + extension, req.body.inputCode, function (err) {
			if (err)
				return console.log(err);
		});
	}
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
				downloadName:null,
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
						downloadName:null,
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
					downloadName:null,
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
						downloadName:null,
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
					downloadName:null,
				});
			}
		});
	} else if (codeLanguage === 3) {
		const childJava = child_process.spawn('javac', ['./SavedCode/Main.java'])
		childJava.stdout.on('data', function (data) {
			//console.log(`stdout:${data}`);
			dataToSend = data.toString();
		});

		childJava.stderr.on('data', function (data) {
			//console.log(`stderr:${data}`);
			dataToSend += data.toString();
		});

		childJava.on('close', (code) => {
			//console.log(`child process close all stdio with code ${code}`);
			if (dataToSend === null) {
				const program = child_process.spawn('java', ['-classpath', './SavedCode/', 'Main'])
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
						downloadName:null,
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
					downloadName:null,
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
		inputCode: testPy,
		outputResult: null,
		lineNr: req.body.lines,
		language: 0,
		downloadName:"main.py",
	});
});

app.get('/c', (req, res) => {
	codeLanguage = 1;
	res.render('home', {
		title: "Home",
		activ: 0,
		inputCode: testC,
		outputResult: null,
		lineNr: req.body.lines,
		language: 1,
		downloadName:"main.c",
	});
});

app.get('/cplus', (req, res) => {
	codeLanguage = 2;
	res.render('home', {
		title: "Home",
		activ: 0,
		inputCode: testCPP,
		outputResult: null,
		lineNr: req.body.lines,
		language: 2,
		downloadName:"main.cpp",
	});
});

app.get('/java', (req, res) => {
	codeLanguage = 3;
	res.render('home', {
		title: "Home",
		activ: 0,
		inputCode: testJava,
		outputResult: null,
		lineNr: req.body.lines,
		language: 3,
		downloadName:"main.java",
	});
});

app.post('/ajaxxx', (req, res) => {
	//console.log(req.body)
	switch (req.body.extension) {
		case "py":
			codeLanguage = 0;
			break;
		case "c":
			codeLanguage = 1;
			break;
		case "cpp":
			codeLanguage = 2;
			break;
		case "java":
			codeLanguage = 3;
			break;
		default:
			codeLanguage = 0;
	}
	res.send(req.body.code);
	
});
app.get('/test', function(req, res) {
	switch (codeLanguage) {
		case 0:
			res.sendFile('SavedCode/main.py', {root: __dirname,downloadName:"main.py" });
			break;
		case 1:
			res.sendFile('SavedCode/main.c', {root: __dirname,downloadName:"main.c" });
			break;
		case 2:
			res.sendFile('SavedCode/main.cpp', {root: __dirname,downloadName:"main.cpp" });
			break;
		case 3:
			res.sendFile('SavedCode/Main.java', {root: __dirname,downloadName:"main.java" });
			break;
		default:
			res.sendFile('SavedCode/main.py', {root: __dirname,downloadName:"main.py" });
	}
});

app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:1234/home`));
