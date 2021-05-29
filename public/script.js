document.addEventListener("DOMContentLoaded", function () {

    reloadText = document.getElementById('lines').value;
    arrayText = reloadText.split('\n');
    var lineNr = arrayText.length;
    //console.log(lineNr);
    if (lineNr === 1) {
        document.getElementById('lines').innerHTML = "1";
    }

    var s1 = document.getElementById('inputCode');
    var s2 = document.getElementById('lines');
    var s3 = document.getElementById('highlighting')
    function select_scroll(e) {

        s2.scrollTop = s1.scrollTop;
        s3.scrollTop = s1.scrollTop;
        s3.scrollLeft = s1.scrollLeft ;
    }
    s1.addEventListener('scroll', select_scroll, false);

    document.getElementById('inputCode').addEventListener('paste', function (e) {
        setTimeout(function () {
            let codeText = document.getElementById('inputCode').value;
            let codeLines = codeText.split('\n');
            //console.log(codeLines);
            while (lineNr < codeLines.length) {
                lineNr += 1;
                document.getElementById('lines').innerHTML += "\n" + lineNr.toString();
            }


        }, 0);
    });

    document.getElementById('inputCode').addEventListener('cut', function (e) {
        setTimeout(function () {
            let codeText = document.getElementById('inputCode').value;
            let codeLines = codeText.split('\n');
            let lines = document.getElementById('lines').value;
            //console.log(codeLines);
            while (lineNr  > codeLines.length) {

                if (lineNr > 99) {
                    document.getElementById('lines').innerHTML = lines.substring(0, (lines.length - 4));
                }
                else if (lineNr > 9) {
                    document.getElementById('lines').innerHTML = lines.substring(0, (lines.length - 3));
                } else {
                    document.getElementById('lines').innerHTML = lines.substring(0, (lines.length - 2));
                }
                lineNr-=1;
            }
            lineNr = codeLines.length;
        }, 0);
        //console.log(lineNr);
    });

    document.getElementById('inputCode').addEventListener('keydown', function (e) {
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
        if (e.key == "Enter") {
            //console.log("newLine");
            lineNr += 1;
            document.getElementById('lines').innerHTML += "\n" + lineNr.toString();

        }
        if (e.key == "Backspace") {

            if (lineNr > 1) {
                let codeLines = document.getElementById('inputCode').value
                var linesVect = codeLines.split('\n');
                let linesText = document.getElementById('lines').value;

                if (linesVect.length < lineNr) {

                    //console.log(linesText.substring(0, (linesText.length - 2)));
                    if (lineNr > 99) {
                        document.getElementById('lines').innerHTML = linesText.substring(0, (linesText.length - 4));
                    }
                    else if (lineNr > 9) {
                        document.getElementById('lines').innerHTML = linesText.substring(0, (linesText.length - 3));
                    } else {
                        document.getElementById('lines').innerHTML = linesText.substring(0, (linesText.length - 2));
                    }
                    lineNr -= 1;
                }
            }
        }
    });
}, false);

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

}

function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       document.getElementById("demo").innerHTML = this.responseText;
      }
    };
    xhttp.open("GET", "ajax_info.txt", true);
    xhttp.send();
}

function update(text) {
    let result_element = document.querySelector("#highlighting-content");
    // Update code
    result_element.innerHTML = text.replace(new RegExp("&", "g"), "&").replace(new RegExp("<", "g"), "&lt;"); /* Global RegExp */
    // Syntax Highlight
    Prism.highlightElement(result_element);
  }