function LikePresent(name) {
    AddToWishlist(name);
    ShowNextPresent();
}
function DislikePresent(name) {
    ShowNextPresent();
}

function ShowNextPresent() {
    HideElement("geschenk");
}

function AddToWishlist(geschenkname) {
    ShowElement("wishlist");
    var entry = document.createElement("div");
    entry.classList.add("entry");
    entry.innerText=geschenkname;
    var wishlistbox = document.getElementById("wishlist");
    wishlistbox.appendChild(entry);
}