var lineNr = 0;

document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById('lines')) {
        reloadText = document.getElementById('lines').value;

        arrayText = reloadText.split('\n');
        lineNr = arrayText.length;
        //console.log(lineNr);
        if (lineNr === 1) {
            document.getElementById('lines').innerHTML = "1";
        }
    }
    if (document.getElementById('inputCode')) {
        update(document.getElementById('inputCode').value);
        setTimeout(lineNumbers, 0);
        var s1 = document.getElementById('inputCode');
        var s2 = document.getElementById('lines');
        var s3 = document.getElementById('highlighting')
        function select_scroll(e) {

            s2.scrollTop = s1.scrollTop;
            s3.scrollTop = s1.scrollTop;
            s3.scrollLeft = s1.scrollLeft;
        }
        s1.addEventListener('scroll', select_scroll, false);


        document.getElementById('inputCode').addEventListener('paste', function (e) {
            setTimeout(lineNumbers, 0);
        });
        document.getElementById('inputCode').addEventListener('keydown', function (e) {
            if ((e.ctrlKey && e.key === 'z') || (e.ctrlKey && e.key === 'Z')) {
                setTimeout(function () {
                    lineNumbers();
                }, 0);
            }
            if (e.ctrlKey && e.shiftKey && e.keyCode === 90) {
                setTimeout(function () {
                    lineNumbers();
                }, 0);
            }
        });

        document.getElementById('inputCode').addEventListener('redo', function (e) {
            setTimeout(function () {
                lineNumbers();
            }, 0);
        });

        document.getElementById('inputCode').addEventListener('cut', function (e) {

            setTimeout(function () {
                lineNumbers();
            }, 0);

        });

        document.getElementById('inputCode').addEventListener('keydown', function (e) {
            /*
            if (e.key == 'Tab') {
                e.preventDefault();
                var start = this.selectionStart;
                var end = this.selectionEnd;
    
                // set textarea value to: text before caret + tab + text after caret
                this.value = this.value.substring(0, start) +
                    "\t" + this.value.substring(end);
    
                // put caret at right position again
                this.selectionStart =
                    this.selectionEnd = start + 1;
            }
            */
            if (e.key == "Enter") {
                //console.log("newLine");
                //lineNr += 1;

                //document.getElementById('lines').innerHTML += "\n" + lineNr.toString();
                setTimeout(function () {
                    lineNumbers();
                }, 0);
            }
            if (e.key == "Backspace") {
                lineNumbers();
            }
        });

        document.getElementById('inputfile').addEventListener('change', loadDoc, false);
        /*
        document.getElementById('fileDownload').addEventListener('click', function () {
            var fileContent = document.getElementById("fileDownload");
            fileContent.setAttribute("href","data:text/.cpp;charset=utf-8," +document.getElementById('inputCode').value.toString());
        });
        document.getElementById('fileDownload').addEventListener('click', function () {
            var link= document.createElement("a");
            link.download="main.cpp";
            link.href = "data:text/cpp, "+document.getElementById('inputCode').value;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
        });*/
    }
}, false);


function lineNumbers() {
    let codeText = document.getElementById('inputCode').value;
    let codeLines = codeText.split('\n');
    let lines = document.getElementById('lines').value;
    //console.log(codeLines);
    if (lineNr < codeLines.length) {

        let codeText = document.getElementById('inputCode').value;
        let codeLines = codeText.split('\n');
        while (lineNr < codeLines.length) {
            lineNr += 1;
            document.getElementById('lines').innerHTML += "\n" + lineNr.toString();
        }

    }
    else if (lineNr > codeLines.length) {

        while (lineNr > codeLines.length) {

            lineNr -= 1;
            lines = document.getElementById('lines').value;
            if (lineNr > 98) {
                document.getElementById('lines').innerHTML = lines.substring(0, (lines.length - 4));
            }
            else if (lineNr > 8) {
                document.getElementById('lines').innerHTML = lines.substring(0, (lines.length - 3));
            } else {
                document.getElementById('lines').innerHTML = lines.substring(0, (lines.length - 2));
            }

        }
        lineNr = codeLines.length;
    }
}
/*
function get() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("console").innerHTML = this.responseText;
            console.log("dws");
        }
    };

    xhttp.open("POST", 'http://localhost:1234/run-input', true);
    xhttp.send();
}*/


function readFile(evt) {
    var files = evt.target.files;
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
        console.log(event.target.result);
    }
    reader.readAsText(file)
}

function loadDoc(evt) {
    var xhttp = new XMLHttpRequest();
    var files = evt.target.files;
    var file = files[0];
    var reader = new FileReader();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            document.getElementById("inputCode").innerHTML = this.responseText;
            update(document.getElementById('inputCode').value);
            lineNumbers();
        }
    };

    var extension = document.getElementById("inputfile").value.split('.')[1];
    //console.log(extension);
    reader.onload = function (event) {
        //console.log(event.target.result);
        xhttp.open("POST", "/upload-file", true);
        xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
        xhttp.send(JSON.stringify({ "extension": extension, "code": event.target.result }));
    }
    reader.readAsText(file)
}

function loadAbout() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("content-about").innerHTML =
        JSON.parse(this.responseText).contentAbout;
      }
    };
    xhttp.open("GET", "/site-details", true);
    xhttp.send();
}


function update(text) {
    console.log(text);
    let result_element = document.querySelector("#highlighting-content");
    // Update code
    //result_element.innerHTML = text.replace(new RegExp("&", "g"), "&").replace(new RegExp("<", "g"), "&lt;"); /* Global RegExp */
    result_element.innerHTML = text.replace(new RegExp("<", "g"), "&lt;").replace(new RegExp("\n", "g"), "<br>").replace(new RegExp(" ", "g"), "&nbsp;").replace(new RegExp("\t", "g"), "&nbsp;&nbsp;&nbsp;&nbsp;");

    // Syntax Highlight
    //Prism.highlightElement(result_element);

}

function check_tab(element, event) {
    let code = element.value;
    if (event.key == "Tab") {
        /* Tab key pressed */
        event.preventDefault(); // stop normal
        let before_tab = code.slice(0, element.selectionStart); // text before tab
        let after_tab = code.slice(element.selectionEnd, element.value.length); // text after tab
        let cursor_pos = element.selectionEnd + 4; // where cursor moves after tab - 2 for 2 spaces
        element.value = before_tab + "    " + after_tab; // add tab char - 2 spaces
        // move cursor
        element.selectionStart = cursor_pos;
        element.selectionEnd = cursor_pos;
    }
    update(document.getElementById('inputCode').value);
}

