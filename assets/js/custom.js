// Breakpoints.
breakpoints({
  xlarge:   [ '1281px',  '1680px' ],
  large:    [ '981px',   '1280px' ],
  medium:   [ '737px',   '980px'  ],
  small:    [ '481px',   '736px'  ],
  xsmall:   [ null,      '480px'  ]
});

function showHideElement(elementId) {
  var x = document.getElementById(elementId);
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

function mask(o,f){
    v_obj=o
    v_fun=f
    setTimeout("execMask()",1)
}

function execMask(){
    v_obj.value=v_fun(v_obj.value)
}

function mtel(v){
    v=v.replace(/\D/g,""); //Remove tudo o que não é dígito
    v=v.replace(/^(\d{2})(\d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    v=v.replace(/(\d)(\d{4})$/,"$1-$2"); //Coloca hífen entre o quarto e o quinto dígitos
    return v;
}

function id( el ){
	return document.getElementById( el );
}

// Below events are added to the page elements

window.onload = function(){
	id('phone').onkeyup = function(){
		mask( this, mtel );
	}
}

window.addEventListener('resize', function(event){
  var x = document.getElementById('navigation-bar');
  if (breakpoints.active('>=medium')) {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
});

document.querySelector('#responsive-menu-button').addEventListener('click', function (e) {
  showHideElement('navigation-bar');
});

document.querySelectorAll('#navigation-bar ul li').forEach(element => 
  element.addEventListener("click", () => {
    if (breakpoints.active('<=small')) showHideElement('navigation-bar');
  })
)