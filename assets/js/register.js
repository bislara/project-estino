const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('containerF');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

//mobile view
var x = document.getElementById("login");
var y = document.getElementById('register');
var z = document.getElementById('btn-color');

function register(){
	x.style.left = "-100%";
	y.style.left = "0%";
	z.style.left ="130px";
}
function login(){
	x.style.left = "0";
	y.style.left = "100%";
	z.style.left ="0";
}
	