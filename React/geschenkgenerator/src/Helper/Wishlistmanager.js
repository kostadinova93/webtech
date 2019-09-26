import Cookies from "./Cookies";
import $ from 'jquery'
import 'jquery-ui-dist/jquery-ui'

let Wishlistmanager= {};
Wishlistmanager.addWish=function(id) {
    var wishJson=this.getWishes();
    if(wishJson==null) wishJson=[];
    if(wishJson.find(x=>x==id)!=null)  return;

    wishJson.push(id)
    Cookies.setCookie("wishlist", JSON.stringify(wishJson), 999);
    this.updateHeaderCounter();

}

Wishlistmanager.getWishes=function() {
    var cookie=Cookies.getCookie("wishlist");
    if(cookie!=null && cookie.length>1) {
        return JSON.parse(cookie);  
    }
    return null;
}

Wishlistmanager.getWishesCount=function() {
    if(this.getWishes()==null) return 0 
    else return this.getWishes().length;
}


Wishlistmanager.removeWish=function(id) {
    var wishJson=this.getWishes();
    if(wishJson==null) return;
    wishJson=wishJson.filter(x=>x!=id);
    Cookies.setCookie("wishlist", JSON.stringify(wishJson), 999);
    this.updateHeaderCounter();
}


Wishlistmanager.updateHeaderCounter=function() {
    var valBefore=$("#wishlist_counter").text();
    $("#wishlist_counter").text(this.getWishesCount());
    if(valBefore!=this.getWishesCount() && this.getWishesCount()<5) {  
       $("#wishlist_counter").parent().effect( "shake", { direction: "up", times: 4, distance: 10}, 1000 );
    }
}

export default Wishlistmanager;