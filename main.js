"use strict";

//Dictionary containing endpoint and authentication for Watson natural language API
var watson = {
    url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/v1/analyze?version=2017-02-27&text=',//Broward%20sheriff%20investigating%20claims%20that%20multiple%20deputies%20failed%20to%20enter%20Parkland%20school%20when%20they%20should%20have&features=sentiment,keywords',
    auth: {
        'user': '3da0d8c3-8b65-45ce-896a-a3cd30dd1750',
        'pass': 'SsNBdyXZ6HDG'
    }
};

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
        fillSite('https://newsapi.org/v2/everything?language=en&q=' + topic + '&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77');
    }
});

//if user pressed enter within search bar
$('#searchBar').bind('keypress', function(e) {

    if (e.keyCode==13) {
        clear();
        var topic = $("#searchBar").val();
        fillSite('https://newsapi.org/v2/everything?language=en&sortBy=popularity&q=' + topic + '&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77');
    }
});

//Replace page with content
$('#saved_button').click(function() {
    //saved topics
    clear();
});

$('#login_button').click(function() {
    //login page
    clear();
});

$('#logout_button').click(function() {
    //logout page
    clear();
});

$("#search_button").click(function() {
        clear();
        fillSite('https://newsapi.org/v2/top-headlines?country=us&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77');
});

$(window).bind("load", function() {
    fillSite('https://newsapi.org/v2/top-headlines?country=us&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77');
   // do something
});

//fill page with articles
function clear() {
    document.getElementsByClassName("articles")[0].innerHTML = "";
}

/*function analyzeSentiment(textString){
    var encodedText = encodeURI(textString);

    //remove any single quotes and commas
    encodedText = encodedText.replace(/'/g, "");
    encodedText = encodedText.replace(/,/g, "");

    //final url string
    var url_ = watson.url + encodedText + '&features=sentiment,keywords'

    var options = {
        url: url_,
        auth: {
            'user': '3da0d8c3-8b65-45ce-896a-a3cd30dd1750',
            'pass': 'SsNBdyXZ6HDG'
        }
    }
    request(options, function(error, response, body){
        if(!error && response.statusCode == 200){
            console.log(body);
        }
    })

}*/

function analyzeSentiment(textString){
    //encode the string by replacing spaces, etc. with ASCII codes
    var encodedText = encodeURI(textString);

    //remove any single quotes and commas
    encodedText = encodedText.replace(/'/g, "");
    encodedText = encodedText.replace(/,/g, "");

    //final url string
    var url_ = watson.url + encodedText + '&features=sentiment,keywords'

    //console.log(url_)
    $.ajax({
        type:'GET',
        url: url_,
        dataType: 'jsonp',
        crossDomain: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', makeBaseAuth(watson.auth.user, watson.auth.pass));
        },
        //username: watson.auth.user,
        //password: watson.auth.pass,
        success: function(data){
            console.log(data);
        }
    });


}

function makeBaseAuth(user, pswd){
    var token = user + ':' + pswd;
    var hash = "";
    if (btoa) {
       hash = btoa(token);
    }
    return "Basic " + hash;
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
                //img.classList.add("thumbs")
                img.src = item.urlToImage;
                //img.style.width = "80px";
                //img.style.height = "80px";
                article.appendChild(contain);
                contain.classList.add("thumbnail");
                contain.appendChild(img);

                // Add title
                var title = document.createElement("p");
                //analyzeSentiment(item.title);
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


