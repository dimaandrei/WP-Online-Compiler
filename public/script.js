var activeElemId = null;
function activateItem(elemId) {
    console.log(elemId);
    if (elemId != activeElemId) {
        document.getElementById(elemId).className = "active";
        if (null != activeElemId) {
            document.getElementById(activeElemId).className = "inactive";
        }
        activeElemId = elemId;

    }
}
function schimbaContinut(resursa,elemId, jsFisier, jsFct) {
    if (elemId != activeElemId) {
        document.getElementById(elemId).className = "active";
        if (null != activeElemId) {
            document.getElementById(activeElemId).className = "inactive";
        }
        activeElemId = elemId;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("continut").innerHTML = this.responseText;
            if (jsFisier) {
                var elementScript = document.createElement('script');
                elementScript.onload = function () {
                    console.log("Updateeeeeeeeeeee")
                    if (jsFct) {
                        window[jsFct]();
                    }
                };
                elementScript.src = jsFisier;
                document.head.appendChild(elementScript);
            } else {
                if (jsFct) {
                    window[jsFct]();
                }
            }
        }
    };
    xhttp.open("GET", resursa , true);
    xhttp.send();
}