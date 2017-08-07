console.log('Loaded!');
var element = document.getElementById('main.text');
element.innerHTML= "New Value";
var img = document.getElementById('madi');
//move the image.
img.onclick = function () {
    img.style.marginLeft = 100px;
};
