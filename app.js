const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')

const app = express();

const port = 1234;
const fs = require('fs');
const { Console } = require('console');

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
	res.render('home', {
		title: "Home"
	})
});

app.get('/how', (req, res) => {
	res.render('how', {
		title: "How to"
	});
});

app.get('/about', (req, res) => {
	res.render('about',
		{
			title: "About"
		});
});

//res.send("formular: " + JSON.stringify(req.body));


app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:1234/home`));

