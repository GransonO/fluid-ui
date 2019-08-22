const userdata  = JSON.parse(localStorage.getItem("jade-userdata"))
userdata == undefined ? window.open('./login.htm', '_self') : '';
// automatically call all functions when the window loads
function onWindowLoad(){
   
	// 2. get user profile data 
	$.ajax({
		type: 'GET',
		crossDomain: true,
		dataType: 'json',
		url: 'http://127.0.0.1:8000/profile/list/' + userdata.customer_phone,
		success: function(jsondata){
			updateUI(jsondata); // Update all UI for customers
		},
		error: function (request,status, error) {
            console.log("There was an error : ", error);
        }
	 });
}

onWindowLoad();

function updateUI(jsondata){
	$('span#profile_name').html(jsondata.customerName);
	const image = jsondata.profileimage === 'no image'?
		'https://res.cloudinary.com/dolwj4vkq/image/upload/v1565367393/jade/profiles/user.jpg': jsondata.profileimage
	$('img#round_profile').attr("src", image)
}
$('a#logout').on('click',function(){
	localStorage.removeItem('jade-userdata');
	window.open('./login.htm', '_self');
});