function isValidUSZip(evt) {
    var res = /^\d{5}$/.test(document.getElementsByName("zip")[0].value);

    if(!res) {
        document.getElementById("errorText").innerHTML = "Zip code is invalid";
        evt.preventDefault();
    }
    return res;
 }