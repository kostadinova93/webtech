let Cookies= {};
Cookies.setCookie=function(cname, cvalue, exdays=999) {
    if(cvalue==null) cvalue="";
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

Cookies.getCookie=function(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            var ret=c.substring(name.length, c.length)
            return ret.length>0 ? ret : null;
        }
    }
    return null;
}

Cookies.rememberSeenIds=function(id) {
    var seenIds=[];
    if(Cookies.getCookie("seenIds")!=null) seenIds=JSON.parse(Cookies.getCookie("seenIds"));
    if(seenIds.includes(id)==false) seenIds.push(id);
    Cookies.setCookie("seenIds", JSON.stringify(seenIds));
}

Cookies.getSeenIds=function(id) {
    if(Cookies.getCookie("seenIds")!=null) return JSON.parse(Cookies.getCookie("seenIds"));
    return null;
}
Cookies.clearSeenIds=function() {
    Cookies.setCookie("seenIds","");
}
Cookies.getPermissionSuffix = function() {
    return "&username="+this.getCookie("username")+"&userpassword="+this.getCookie("password");
}

Cookies.isLoggedIn=function() {
    return this.getCookie("username")!="" && this.getCookie("username")!=null;
}
export default Cookies;