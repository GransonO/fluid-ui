let nav = true;
const cloudinary_url = 'https://api.cloudinary.com/v1_1/dolwj4vkq/image/upload';
const cloudinary_preset = 'jade_profile_preset';

//1. Get user phone number from storage
const userdata  = JSON.parse(localStorage.getItem("jade-userdata"))
userdata == undefined ? window.open('./login.htm', '_self') : '';
// automatically call all functions when the window loads
function onWindowLoad(){
   
	// 2. get user profile data 
	$.ajax({
		type: 'GET',
		crossDomain: true,
		dataType: 'json',
		url: 'https://fluid-backend.herokuapp.com/profile/list/' + userdata.customer_phone,
		success: function(jsondata){
			console.log(jsondata.data)
			updateUI(jsondata.data); // Update all UI for customers
			CustomerUI(jsondata.data); // Data to be displayed and editted
		},
		error: function (request,status, error) {
            console.log("There was an error : ", error);
        }
	 });
}

onWindowLoad();

function UiEdit(){
	// Remove the diable tag
	$('input#input-first-name').prop('disabled', nav);
	$('input#input-last-name').prop('disabled', nav);
	$('input#input-phone').prop('disabled', true);
	$('input#input-email').prop('disabled', nav);
	$('input#input-town').prop('disabled', nav);
	$('select#select-branch').prop('disabled', true);
	$('input#input-occupation').prop('disabled', nav);
	$('input#input-age').prop('disabled', nav);
	$('input#input-birth').prop('disabled', nav);
	$('input#input-idnumber').prop('disabled', nav);
	$('textarea#aboutMe').prop('disabled', nav);
	nav ? $('div#image_updater').css('display', 'none') : [$('div#image_updater').css('display', 'block')];
	nav = !nav;
}

function navStatus(){
	let btn_name = nav ? 'Edit' : 'Update';
	$('button#edit_btn').html(btn_name);
	UiEdit();
}

navStatus();

$('button#edit_btn').on('click',function(){
	nav ? updateUserdetails() : ''; // Calls the update function
	navStatus(); // Changes the status of the button
});

function updateUI(jsondata){
	$('span#profile_name').html(jsondata.customerName);
	$('h3#user_name').html(jsondata.customerName);
	$('h1#hello_user').html("Hello " + username(jsondata.customerName, 0));
	const image = jsondata.profileimage === 'no image'?
		'https://res.cloudinary.com/dolwj4vkq/image/upload/v1565367393/jade/profiles/user.jpg': jsondata.profileimage
	$('img#round_profile').attr("src", image)
	$('img#user_image').attr("src", image)
	$('span#tokens').html(jsondata.loyalty ? jsondata.loyalty.total_tokens : 0 );

	$('div#store').html(jsondata.customer_store.storeLocation);
	let tier_image;
	switch (jsondata.loyalty ? jsondata.loyalty.tier_group : 1) {
		case 1:
			tier_image = '../assets/img/awards/jade_bronze.png';
			$('div#tier_status').html("You are our Bronze Customer");
			$('p#motivation').html('Bonny - "And again I say, being among the top is great 🤷🏽‍♂️, but I cant stand someone before me 🙅🏽‍♂️, so I strive to be first 🏃🏽‍♂️"');
			break;
		case 2:
			tier_image = '../assets/img/awards/jade_silver.png';
			$('div#tier_status').html("You are our Silver Customer");
			$('p#motivation').html('Makena - "Second Place, I can stay here for a while... But Bonny is coming 🤦🏽‍♀️. I have to get the Gold‍  🏃🏽‍♀️"');
			break;
		case 3:
			tier_image = '../assets/img/awards/jade_gold.png';
			$('div#tier_status').html("You are our Gold Customer");
			$('p#motivation').html('Granson - "At the helm, this sure does taste nice 🤴🏽👸🏽. I wonder how it feels to be above me 🤔"');
			break;

		default:
			break;
	}
	$('img#tier_image').attr("src", tier_image)
}

function CustomerUI(jsondata){
	$('input#input-first-name').val(username(jsondata.customerName, 0));
	$('input#input-last-name').val(username(jsondata.customerName, 1));

	$('input#input-phone').val(jsondata.phone);
	$('input#input-email').val(jsondata.email);
	$('input#input-town').val(jsondata.location);
	$('select#select-branch').val(jsondata.customer_store.store_id);
	$('input#input-occupation').val(jsondata.occupation);
	$('input#input-age').val(jsondata.age);
	$('input#input-birth').val(jsondata.birthday ? jsondata.birthday.substr(0, 10) : '');
	$('input#input-idnumber').val(jsondata.idNumber);
	$('textarea#aboutMe').val(jsondata.aboutme);
}

function username(customerName, index){
	let theName = customerName.split(" ");
	return (theName.length < 2 && index === 1) ? "" : theName[index];
}

function updateUserdetails(){
	let firstname = $('input#input-first-name').val();
	let lastname = $('input#input-last-name').val();
	let phone = $('input#input-phone').val();
	let email = $('input#input-email').val();
	let location = $('input#input-town').val().trim();
	let branch = $('select#select-branch').val();
	let occupation= $('input#input-occupation').val().trim();
	let age = $('input#input-age').val().trim();
	let birthday = $('input#input-birth').val();
	let idNumber = $('input#input-idnumber').val().trim();
	let aboutme = $('textarea#aboutMe').val().trim();
	birthday = birthday.length == 0 ? null : birthday.trim() + "T00:00:00Z";
	console.log(birthday)

	let customerData = {
		customerName : (firstname.trim() + " " +lastname.trim()),
		phone,
		email,
		location,
		occupation,
		age,
		birthday,
		idNumber,
		aboutme,
		// customer_store: branch

	}
	
	$.ajax({
		type: 'PUT',
		crossDomain: true,
		dataType: 'json',
        data: customerData,
		url: 'https://fluid-backend.herokuapp.com/profile/update/' + userdata.customer_phone,
		success: function(updatedData){
			window.location.reload(true);
		},
		error: function (request,status, error) {
            console.log("There was an error : ", error);
            alert(error);
        }
	 });
}

$('a#logout').on('click',function(){
	localStorage.removeItem('jade-userdata');
	window.open('./login.htm', '_self');
});

$('input#file-upload').on('change', function(event){
	const file = event.target.files[0];
	const formData = new FormData();
	formData.append('file', file);
	formData.append('upload_preset', cloudinary_preset);

	$.ajax({
		type: 'POST',
		crossDomain: true,
		data: formData,
		processData: false,
		contentType: false,
		url: cloudinary_url,
		success: function(jsondata){
			console.log(jsondata)
			imageUpdate(jsondata)
		},
		error: function (request,status, error) {
            console.log("There was an upload error : ", error);
        }
	 });
})

function imageUpdate(imageData){
	$.ajax({
		type: 'POST',
		crossDomain: true,
		dataType: 'json',
        data: {
			profileimage: imageData.secure_url
		},
		url: 'https://fluid-backend.herokuapp.com/profile/image/' + userdata.customer_phone,
		success: function(updatedData){
			window.location.reload(true);
		},
		error: function (request,status, error) {
            console.log("There was an error : ", error);
            alert(error);
        }
	 });
}
