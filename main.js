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
		clear();
		var url = getUrl();
        fillSite(url);
	}
});

//if user pressed enter search
$('#searchBar').bind('keypress', function(e) {
	if (e.keyCode==13) {
		clear();
		var url = getUrl();
        fillSite(url);
	}
});

//Replace page with content
$('#saved_button').click(function() {
	//saved topics
	clear();
	$("h3").html("saved topics");
});

$('#login_button').click(function() {
	//login page
	clear();
	$("h3").html("login");
});

$('#logout_button').click(function() {
	//logout page
	clear();
});

$("#search_button").click(function() {
        clear();
		$("h3").html("top headlines");
		fillSite('https://newsapi.org/v2/top-headlines?country=us&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77');
});

$("#advanced_search").click(function() {
    if ($('#search-options').is(':hidden')) {
         $('#search-options').slideDown();
    } else {
         $('#search-options').slideUp();
    }
});
$(window).bind("load", function() {
	$('#search-options').hide();
	fillSite('https://newsapi.org/v2/top-headlines?country=us&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77');
});
function getUrl() {
	var topic = $("#searchBar").val();
	var sort = $("#sort-by").val();
	var lang = $("#language").val();
	var limit = $("#limit").val();
	if (limit == "") {
		limit = 20;
	}
	return "https://newsapi.org/v2/everything?language="+ lang + "&sortBy=" + sort + "&pageSize=" + limit +"&q=" + topic + "&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77";
}

//fill page with articles
function clear() {
	$("h3").html("");
    document.getElementsByClassName("articles")[0].innerHTML = "";
}
function fillSite(url) {
    $.ajax({
        type:'GET',
        url:url,
        success:function(data) {
            $.each(data.articles, function(i, item) {
                // Create article
                var article = document.createElement("div");
                article.classList.add("article");  
                document.getElementsByClassName("articles")[0].appendChild(article);

                // Add image
                var contain = document.createElement("div");
                var img = document.createElement("img");
                img.src = item.urlToImage;
                img.style.width = "80px";
                img.style.height = "80px";
                article.appendChild(contain);
                contain.classList.add("thumbnail");
                contain.appendChild(img);

                // Add title
                var title = document.createElement("p");
                var t = document.createTextNode(item.title);
                title.appendChild(t);
                title.classList.add("title");   
                article.appendChild(title);

                // Add data
                var data = document.createElement("p");
                var t = document.createTextNode("Published: " + item.publishedAt + " By: " + item.author);
                data.appendChild(t);
                data.classList.add("data");   
                article.appendChild(data);

                // Add description
                var description = document.createElement("p");
                t = document.createTextNode(item.description);
                description.appendChild(t);  
                description.classList.add("description");  
                description.classList.add("p" + i);  
                article.appendChild(description);

                // Show description
                $(".p" + i).hide();
                // title.addEventListener("click", function(e) {
                //     $(".p" + i).toggle();
                // }, false);
                title.onclick = function() {
                    $(".p" + i).toggle();
                }
            })
        }
    });
}