"use strict";

var watson = {
    url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/v1/analyze?version=2017-02-27&text=',//Broward%20sheriff%20investigating%20claims%20that%20multiple%20deputies%20failed%20to%20enter%20Parkland%20school%20when%20they%20should%20have&features=sentiment,keywords',
    auth: {
        'user': '3da0d8c3-8b65-45ce-896a-a3cd30dd1750',
        'pass': 'SsNBdyXZ6HDG'
    }
};

var saved_topics = [];
 $(window).scroll(function () {
    if ($(document).height() <= $(window).scrollTop() + $(window).height()) {
        moreArticles()
    }
 });



//toggle side navigation
$("#openSide").click(function(){
        $("#Sidenav").css("width","250px");
});

$(".closebtn").click(function(){
        $("#Sidenav").css("width","0px");
});

//add topics to saved_topic list
$(".btn").click(function(){
	//display topics
	var topic= $("#searchBar").val();
	console.log(topic);
	if (!saved_topics.includes(topic)) {
		saved_topics.push(topic);
	}
	console.log(saved_topics.length);
});
//toggle search bar
$("#openSearch").click(function() {
    if ($("#searchBar").css("display") == "none") {
        $("#searchBar").css("display", "block");
    } else {
        //search for topic here
        clear();
        $("h3 > b").html("search results: "+ $("#searchBar").val());
        $('.btn.btn-info.btn-md').show();
        var url = getUrl();
        fillSite(url);
    }
});

//if user pressed enter search
$('#searchBar').bind('keypress', function(e) {
    if (e.keyCode==13) {
        clear();
        $("#Sidenav").css("width","0px");
        $("h3 > b").html("search results: "+ $("#searchBar").val());
        $('.btn.btn-info.btn-md').show();
        var url = getUrl();
        fillSite(url);
    }
});

//Replace page with content
$('#saved_button').click(function() {
    //saved topics
    clear();
    $("#Sidenav").css("width","0px");
    $("h3 > b").html("saved topics");
	for (let i = 0;i<saved_topics.length;i++) {
		$("#listTopics").append('<a href="#" class="list-group-item">' + saved_topics[i] +'</a>');
	}
});

$('#login_button').click(function() {
    //login page
    clear();
    $("#Sidenav").css("width","0px");
    $("h3 > b").html("login");
});

$('#logout_button').click(function() {
    //logout page
    clear();
});

$("#search_button").click(function() {
        clear();
        $("#Sidenav").css("width","0px");
        $("h3 > b").html("top headlines");
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
    $('.btn.btn-info.btn-md').hide();
    fillSite('https://newsapi.org/v2/top-headlines?country=us&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77');
});

//highlight thumbnail border when mouse enters
$(document).on("mouseover",".thumbnail", function(){
	$(this).css("background-color", "#184496");

})


$(document).on("mouseleave",".thumbnail", function(){
	$(this).css("background-color", "transparent");
	
})



function getUrl() {
    var topic = $("#searchBar").val();
    var sort = $("#sort-by").val();
    var lang = $("#language").val();
    var limit = $("#limit").val();
    if (limit == "") {
        limit = 20;
    }
    console.log(limit)
    return "https://newsapi.org/v2/everything?language=" + lang + "&sortBy=" + sort + "&pageSize=" + limit + "&q=" + topic + "&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77";
}

function clear() {
    $("h3 > b").html("");
    $("#listTopics").html("");
    $('.btn.btn-info.btn-md').hide();
    document.getElementsByClassName("articles")[0].innerHTML = "";
}

//fill page with articles
function fillSite(url) {
    $.ajax({
        type:'GET',
        url:url,
        success:function(data) {
            $.each(data.articles, function(i, item) {
                appendArticle(i, item);
            })
        }
    });
}

//add more articles to page
function moreArticles() {
    var topic = $("#searchBar").val();
    var sort = $("#sort-by").val();
    var lang = $("#language").val();
    var limit = $("#limit").val();
    var num_art = document.getElementsByClassName("articles")[0].children.length;
    if(limit == "") {
        limit = 20;
    }
    var page = num_art / parseInt(limit) + 1
    var url = "https://newsapi.org/v2/everything?language=" + lang + "&sortBy=" + sort + "&pageSize=" + limit + "&page=" + page + "&q=" + topic + "&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77";
    if(topic == "") {
        return
    }
    console.log(url)
    $.ajax({
        type:'GET',
        url:url,
        success:function(data) {
            $.each(data.articles, function(i, item) {
   
                console.log(i)
                appendArticle(i * page, item);
            })
        }
    });
}

function appendArticle(i, item) {
    // Create article


    var article = document.createElement("div");
    article.classList.add("article");  
    document.getElementsByClassName("articles")[0].appendChild(article);

    // Add image
    var contain = document.createElement("div");
    var img = document.createElement("img");
    img.src = item.urlToImage;
    img.style.width = "250px";
    img.style.height = "200px";
    article.appendChild(contain);
    contain.classList.add("thumbnail");

    
    //create anchor with link to news article, opens in new tab
    var a = document.createElement('a');
    a.href = item.url;
    a.target = "_blank";

    a.appendChild(img);
    contain.appendChild(a);

    $(".thumbnail img").css("width", "250px");
    $(".thumbnail img").css("height", "200px");
    // $(".thumbnail img").css("border-radius","2%");

    // Add title
    var title = document.createElement("p");
    var t = document.createTextNode(item.title);


    //SENTIMENT ANALYSIS
    //call the analyze function and pass a callback function which will update the DOM once score arrives
    analyzeSentiment(item.title, function(val){
    	var sentimentInfo = document.createElement("p");
    	
    	var s;
    	if(val < -0.2){
    		s = document.createTextNode("Negative sentiment ("+val+")");
    		sentimentInfo.classList.add("negative_sentiments");
    	}
    	else if(val > 0.2){
    		s = document.createTextNode("Positive sentiment ("+val+")");
    		sentimentInfo.classList.add("positive_sentiments");
    	}
    	else{
    		s = document.createTextNode("Neutral sentiment ("+val+")");
    		sentimentInfo.classList.add("neutral_sentiments");
    	}
    	sentimentInfo.appendChild(s);

    	//color the text based on sentiment
    	$(".positive_sentiments").css({color:"green",fontSize:"18px"});
    	$(".negative_sentiments").css({color:"red",fontSize:"18px"});
    	$(".neutral_sentiments").css({color:"black",fontSize:"18px"});
    	
    	article.appendChild(sentimentInfo);

    });


    title.appendChild(t);
    title.classList.add("title");   
    article.appendChild(title);

    // Add data
    var data = document.createElement("p");
    var author = item.author
    if(author == null) {
        author = "Unknown"
    }
    var t = document.createTextNode("Published: " + item.publishedAt + " By: " + author);
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

    //Send headline to analyze sentiment function
   


    // Show description
    $(".p" + i).hide();
    // title.addEventListener("click", function(e) {
    //     $(".p" + i).toggle();
    // }, false);
    title.onclick = function() {
        $(".p" + i).toggle();
    }
}

function analyzeSentiment(headline, callback){
 	var mykey = "AIzaSyBJ-qSBynfKnHAF7poPXbqgyS0yzdm30_c";
 	var score = 3;
    $.ajax({
        type        : "POST",
        url         : "https://language.googleapis.com/v1/documents:analyzeSentiment?key="+ mykey,
        contentType : "application/json",
        data        : '{"document":{"type":"PLAIN_TEXT","content":"'+headline+'"}}',
        success     : function(data_){
            
            score = data_.documentSentiment.score;
            
            callback(score);
            
        },
        error       : function(err){
            console.log(err);
        }
    });

}


