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
    contain.appendChild(img);
    img.onclick = function() {
        on(item)
    }

    // Add title
    var title = document.createElement("p");
    var t = document.createTextNode(item.title);


    var p1 = document.createElement("p");
    var p2 = document.createElement("p");
    //var pos_percent = document.createTextNode("50%")
    //var neg_percent = document.createTextNode("50%")
    p1.innerHTML = "50%";
    p2.innerHTML = "50%";

    //p1.appendChild(pos_percent);
    //p2.appendChild(neg_percent);

    var thumbs_div = document.createElement("div");
    thumbs_div.classList.add("td");
    //$(".td").css('display','inline-block');
    //$(".td").css('float','left');

    var th_up = document.createElement("img");
    var th_down = document.createElement("img");


    th_up.src = "images/thumbs_up.png";
    th_down.src = "images/thumbs_down.png"

    thumbs_div.appendChild(th_up);
    thumbs_div.appendChild(p1);
    thumbs_div.appendChild(th_down);
    thumbs_div.appendChild(p2);

    //$(".td").css('float','left');

    /*$(".td").css('display','inline-block');
    //

    $(.td).append("<img src='images/thumbs_up.png'/>");
    $(thumbs_div).append("<p>50%</p>");

    $(thumbs_div).append("<img src='images/thumbs_down.png'/>");
    $(thumbs_div).append("<p>50%</p>");
*/
    
    //thumbs_div.classList.add("thumbs");
    //SENTIMENT ANALYSIS
    //call the analyze function and pass a callback function which will update the DOM once score arrives
    analyzeSentiment(item.title, function(val){
    	var sentimentInfo = document.createElement("p");
    	
    	var s;
    	if(val < -0.2){
    		s = document.createTextNode("Negative sentiment");
    		sentimentInfo.classList.add("negative_sentiments");
    	}
    	else if(val > 0.2){
    		s = document.createTextNode("Positive sentiment");
    		sentimentInfo.classList.add("positive_sentiments");
    	}
    	else{
    		s = document.createTextNode("Neutral sentiment");
    		sentimentInfo.classList.add("neutral_sentiments");
    	}
    	sentimentInfo.appendChild(s);

    	//color the text based on sentiment
    	$(".positive_sentiments").css({color:"green",fontSize:"18px"});
    	$(".negative_sentiments").css({color:"red",fontSize:"18px"});
    	$(".neutral_sentiments").css({color:"black",fontSize:"18px"});
    	
    	article.appendChild(sentimentInfo);

    	if(val < 0){
    		val = val * -1.0;
    		var temp = val + 1.0;
    		temp = temp/2.0;
    		p2.innerHTML = (temp*100).toFixed(0) + "%";
    		var temp2 = 100 - temp*100;
    		p1.innerHTML = temp2.toFixed(0) + "%";
    	}
    	
    	if(val > 0){
    		val = val * 1.0;
    		var temp = val + 1.0;
    		temp = temp/2.0;
    		p1.innerHTML = (temp*100).toFixed(0) + "%";
    		var temp2 = 100 - temp*100;
    		p2.innerHTML = temp2.toFixed(0) + "%";
    	}
    	if(val == 0){
    		p1.innerHTML = "50%";
    		p2.innerHTML = "50%";
    	}


    });

    /*var thumbs_up = document.createElement("img");
    var thumbs_down = document.createElement("img");
    thumbs_up.src = "images/thumbs_up.png";
    thumbs_down.src = "images/thumbs_down.png";
    thumbs_up.setAttribute('class','thumbs_img');
    thumbs_down.setAttribute('class','thumbs_img');*/




    title.appendChild(t);
    title.classList.add("title");   
    article.appendChild(title);

    article.appendChild(thumbs_div);

    $(".td img, .td p").css('display', 'inline-block')
}

function on(article) {
    var moreInfo = document.getElementById("info");
    document.getElementById("overlay").style.display = "block";
    moreInfo.style.display = "block";
    // Title
    var title = document.createElement("p");
    var t = document.createTextNode(article.title);
    title.appendChild(t);
    title.classList.add("overlayTitle");   
    moreInfo.appendChild(title);
    // Larger image
    var appendImg = document.createElement("img");
    appendImg.src = article.urlToImage;
    appendImg.classList.add("infoImg");
    var a = document.createElement('a');
    a.href = article.url;
    a.target = "_blank";
    a.appendChild(appendImg);
    moreInfo.appendChild(a)
    // Author and publish date
    var data = document.createElement("p");
    var author = article.author
    if(author == null) {
        author = "Unknown"
    }
    var t = document.createTextNode("Published: " + article.publishedAt + " By: " + author);
    data.appendChild(t);
    data.classList.add("data");   
    moreInfo.appendChild(data);
    // Description
    var description = document.createElement("p");
    t = document.createTextNode(article.description);
    description.appendChild(t);  

    description.classList.add("description"); 
    moreInfo.appendChild(description);
}

function off() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("info").style.display = "none";
    document.getElementById("info").innerHTML = "";

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


