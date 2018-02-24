"use strict";

//toggle side navigation
$("#openSide").click(function(){
    	$("#Sidenav").css("width","250px");
});

$(".closebtn").click(function(){
    	$("#Sidenav").css("width","0px");
});

//toggle search bar
$("#openSearch").click(function() {
	if ($("#searchBar").css("display") == "none") {
    	$("#searchBar").css("display", "block");
	} else {
		//search for topic here
		var topic = $("#searchBar").val();
		$("#context").html(topic);
	}
});

//if user pressed enter search
$('#searchBar').bind('keypress', function(e) {
	if (e.keyCode==13) {
		var topic = $("#searchBar").val();
		$("#context").html(topic);
	}
});

//Replace page with content
$('#search_button').click(function() {
	//homepage
});

$('#saved_button').click(function() {
	//saved topics
	$("#context").html("saved topics");
});

$('#login_button').click(function() {
	//login page
	$("#context").html("login page");
});

$('#logout_button').click(function() {
	//logout page
	$("#context").html("logout page");

});