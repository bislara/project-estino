var url = location.href;
if (window.location.href.indexOf("?id=") >= 0) {
	var user_id = url.split("?")[1].split("=")[1];
	var check = sessionStorage.getItem("user_id");
	if (user_id != check) 
	{
			swal('Invalid Credentials. Please login again!', ': [', 'warning').then((value) => {
			window.location = './register_login.html';
			});
	}
	else
		console.log(user_id);
}
else
{
	swal('Please Login First to open profile page !', ': [', 'warning').then((value) => {
	window.location = './register_login.html';
	});
}
