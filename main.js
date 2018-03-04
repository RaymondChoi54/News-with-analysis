"use strict";

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


/*$(".articles").mouseenter(function () {
               //$this = $(this);
              $(this).css("background-color", "blue");
        }).mouseleave(function ()
        {
           // $this = $(this);
            $(this).css("background-color", "transparent");
        });
*/

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
    title.appendChild(t);
    title.classList.add("title");   
    article.appendChild(title);
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
