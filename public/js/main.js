"use strict";

google.charts.load('current', {'packages':['corechart']});
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

//toggle search bar
$("#openSearch").click(function() {
    if ($("#searchBar").css("display") == "none") {
        $("#searchBar").css("display", "block");
    } else {
        //search for topic here
        clear();
        $("h3 > b").html("Search Results: "+ $("#searchBar").val());
        $('.btn.btn-info.btn-md').show();
        var url = getUrl();
        fillSite(url);
    }
});

$('.btn.btn-info.btn-md').click(function() {
    var topic = $("#searchBar").val();
    console.log("save:" + topic);
    $("#search").submit();
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

//Replace page with list of topics
$('#saved_button').click(function() {
    //saved topics
    clear();
    $("#Sidenav").css("width","0px");
    $("h3 > b").html("Saved Topics:");
    $("#listTopics").show();
});

function inputDays() {
    document.getElementById("graph").innerHTML = "";
    var topic = $().text();
    console.log(topic);
    document.getElementById("inputDays").hidden = false;
    $('#inputDays').bind('keypress', function(e) {
        if (e.keyCode==13) {
                var days = $('#inputDays').val();
                if (days > 0) {
                    console.log(topic);
                    // var days=3;
                    // Set a callback to run when the Google Visualization API is loaded.
                    drawChart(topic, days);
            }
        }
    });
}

$('.loadSaved').click(function() {
    document.getElementById("graph").innerHTML = "";
    var topic = $(this).text();
    console.log(topic);
    document.getElementById("inputDays").hidden = false;
    $('#inputDays').bind('keypress', function(e) {
        if (e.keyCode==13) {
                var days = $('#inputDays').val();
                if (days > 0) {
                    console.log(topic);
                    // var days=3;
                    // Set a callback to run when the Google Visualization API is loaded.
                    drawChart(topic, days);
            }
        }
    });
});


function drawChart(topic, days) {
    console.log(topic);
    var rows = [];
    let d = new Date();
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'date');
    data.addColumn('number', 'SENTIMENT');
    for (let i=0;i<days;i++) {
        let lastdate = d;
        console.log("new date="+d.toISOString());
        var isolastdate = d.toISOString();
        d.setDate(d.getDate() - 1);
        console.log("old date=" + d.toISOString());
        var isodate = d.toISOString();
        let url = "https://newsapi.org/v2/everything?language=en" + "&from="+isodate+ "&to="+ lastdate
        + "&q=" + topic + "&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77";
        getRow(url,isodate,function(row) {
            data.addRow(row);
            console.log("add row");
        })
    }
    // Set chart options
    var options = {'title': topic + ": " + "sentiment analysis past " + days +" days",
                   'width':600,
                   'height':500};

    // Instantiate and draw our chart, passing in some options.
    console.log("before draw");
    var chart = new google.visualization.LineChart(document.getElementById('graph'));
    console.log("after draw");
    chart.draw(data, options);
  }

function getRow(url,isodate, callback) {
    $.ajax({
        type:'GET',
        url:url,
        async: false,
        success:function(data) {
            console.log(data);
            console.log(data.articles.length);
            var score = 0;
            for (let x=0;x<data.articles.length;x++) {
                // var analyzescore = 1;
                analyzeSentimentSync(data.articles[x].title, function(val){
                    if(val < 0) {
                        val = val * -1.0;
                        var temp = val + 1.0;
                        temp = temp/2.0;
                        var temp2 = 100 - temp*100;
                        score = score +temp2;
                    }
                    if(val > 0) {
                        val = val * 1.0;
                        var temp = val + 1.0;
                        temp = (temp/2.0)*100;
                        score = score +temp;
                    }
                    if (val == 0) {
                        score = score + 50
                    }
                    console.log(val);
                    // score = score +val;
                });
                // score = score +analyzescore;
            }
            var sentiment = score / data.articles.length;
            console.log(isodate);
            console.log(sentiment);
            var row = [isodate,sentiment];
            callback(row);
        },
        error       : function(err) {
            console.log(err);
        }
    });
}
$('#signup_button').click(function() {
    //signup page
    clear();
    $("#Sidenav").css("width","0px");
    $(".signupClass").show();
});


$('#login_button').click(function() {
    //login page
    clear();
    $("#Sidenav").css("width","0px");
    $(".loginClass").show();
});


$('#logout_button').click(function() {
    //logout page
    console.log("logging out");
  	$("/logout").submit();
   	clear();
        $("#Sidenav").css("width","0px");
        $("h3 > b").html("Top Headlines:");
        fillSite('https://newsapi.org/v2/top-headlines?country=us&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77');
});


$("#search_button").click(function() {
        clear();
        $("#Sidenav").css("width","0px");
        $("h3 > b").html("Top Headlines:");
        fillSite('https://newsapi.org/v2/top-headlines?country=us&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77');
});

function home() {
    clear();
    $("#Sidenav").css("width","0px");
    $("h3 > b").html("Top Headlines:");
    fillSite('https://newsapi.org/v2/top-headlines?country=us&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77');

}
function home2() {
    clear();
    $("#Sidenav").css("width","0px");
    $("h3 > b").html("Top Headlines:");
    fillSite('https://newsapi.org/v2/top-headlines?country=us&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77');

}


function getUsername() {
    return ": "+ document.getElementById('usernameText').value + "'s Dashboard";
}

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
    return "https://newsapi.org/v2/everything?language=" + lang + "&sortBy=" + sort + "&pageSize=" + limit + "&q=" + topic + "&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77";
}

function clear() {
    $("h3 > b").html("");
    $(".loginClass").hide();
    $(".signupClass").hide();   
    $("#listTopics").hide();  
    $('.btn.btn-info.btn-md').hide();
    $("#search-options").hide();
    document.getElementsByClassName("articles")[0].innerHTML = "";
    document.getElementById("articleContents").style.display = "none";
    document.getElementById("inputDays").hidden = true;
    document.getElementById("graph").innerHTML = "";
}

//fill page with articles
function fillSite(url) {
    document.getElementById("articleContents").style.display = "block";
    $.ajax({
        type:'GET',
        url:url,
        success:function(data) {
            $.each(data.articles, function(i, item) {
                appendArticle(item);
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
    $.ajax({
        type:'GET',
        url:url,
        success:function(data) {
            $.each(data.articles, function(i, item) {
                appendArticle(item);
            })
        }
    });
}

function appendArticle(item) {
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
    $(img).on('error', function(e) {
        img.src = "favicon.png";
    });

    // Add title
    var title = document.createElement("p");
    var t = document.createTextNode(item.title);
    title.appendChild(t);
    title.classList.add("title");   
    article.appendChild(title);


    var p1 = document.createElement("p");
    var p2 = document.createElement("p");
    p1.innerHTML = "50%";
    p2.innerHTML = "50%";

    var thumbs_div = document.createElement("div");
    thumbs_div.classList.add("td");

    var th_up = document.createElement("img");
    var th_down = document.createElement("img");


    th_up.src = "thumbs_up.png";
    th_down.src = "thumbs_down.png";
    th_up.style.height = "25px";
    th_up.style.width = "25px";
    th_down.style.height = "25px";
    th_down.style.width = "25px";

    thumbs_div.appendChild(th_up);
    thumbs_div.appendChild(p1);
    thumbs_div.appendChild(th_down);
    thumbs_div.appendChild(p2);
    //SENTIMENT ANALYSIS
    //call the analyze function and pass a callback function which will update the DOM once score arrives
    // analyzeSentiment(item.title, function(val) {
    //     if(val < 0) {
    //         val = val * -1.0;
    //         var temp = val + 1.0;
    //         temp = temp/2.0;
    //         p2.innerHTML = (temp*100).toFixed(0) + "%";
    //         var temp2 = 100 - temp*100;
    //         p1.innerHTML = temp2.toFixed(0) + "%";
    //     }
    //     if(val > 0) {
    //         val = val * 1.0;
    //         var temp = val + 1.0;
    //         temp = temp/2.0;
    //         p1.innerHTML = (temp*100).toFixed(0) + "%";
    //         var temp2 = 100 - temp*100;
    //         p2.innerHTML = temp2.toFixed(0) + "%";
    //     }
    //     if(val == 0) {
    //         p1.innerHTML = "50%";
    //         p2.innerHTML = "50%";
    //     }
    // });

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
    $(appendImg).on('error', function(e) {
        appendImg.src = "favicon.png";
    });
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
    var text = article.description
    if(text == null) {
        text = "No description available"
    }
    t = document.createTextNode(text);
    description.appendChild(t);  

    description.classList.add("description"); 
    moreInfo.appendChild(description);
}

function off() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("info").style.display = "none";
    document.getElementById("info").innerHTML = "";
}


function analyzeSentiment(headline, callback) {
    var mykey = "AIzaSyBJ-qSBynfKnHAF7poPXbqgyS0yzdm30_c";
    var score = 3;
    $.ajax({
        type        : "POST",
        url         : "https://language.googleapis.com/v1/documents:analyzeSentiment?key="+ mykey,
        contentType : "application/json",
        data        : '{"document":{"type":"PLAIN_TEXT","content":"'+headline+'"}}',
        success     : function(data_) {
            score = data_.documentSentiment.score;
            callback(score);
        },
        error       : function(err) {
            console.log(err);
        }
    });

}


function analyzeSentimentSync(headline, callback) {
    var mykey = "AIzaSyBJ-qSBynfKnHAF7poPXbqgyS0yzdm30_c";
    var score = 3;
    $.ajax({
        type        : "POST",
        url         : "https://language.googleapis.com/v1/documents:analyzeSentiment?key="+ mykey,
        contentType : "application/json",
        data        : '{"document":{"type":"PLAIN_TEXT","content":"'+headline+'"}}',
        async: false,
        success     : function(data_) {
            score = data_.documentSentiment.score;
            callback(score);
        },
        error       : function(err) {
            console.log(err);
        }
    });
}

//var mongoose = require('mongoose');
//var bcrypt = require('bcrypt');
//var express = require('express');
//var app = express();
//var bodyParser = require('body-parser');

//connect to MongoDB
// mongoose.connect('mongodb://user1:news-it123@ds117469.mlab.com:17469/news-it');
// var db = mongoose.connection;


// //handle mongo error
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//   // we're connected!
// });

// var Users = new mongoose.Schema({
// 	fullname: {
// 		type: String,
// 		required: true,
// 		trim: true
// 	},
// 	email: {
// 		type: String,		
// 		required: true,
// 		unique: true,
// 		trim: true
// 	},
// 	username: {
// 		type: String,
// 		required: true,
// 		trim: true
// 	},
// 	password: {
// 		type: String,
// 		required: true
// 	}
	
// });

/*
//hashing a password before saving it to the database
Users.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

*/

// var User = mongoose.model('User', Users);
// module.exports = User;
// var express = require('express');
// var router = express.Router();


// //POST route for updating data
// router.post('/', function (req, res, next) {
// /*
//   // confirm that user typed same password twice
//   if (req.body.password !== req.body.passwordConf) {
//     var err = new Error('Passwords do not match.');
//     err.status = 400;
//     return next(err);
//   }
// */
//   if (req.body.fullname &&
//   	req.body.email &&
//     req.body.username &&
//     req.body.password) {

//     var userData = {
//       fullname: req.body.fullname,
//       email: req.body.email,
//       username: req.body.username,
//       password: req.body.password,
//     }

//     //use schema.create to insert data into the db
//     User.create(userData, function (err, user) {
//       if (err) {
//         return next(err)
//       } else {
//         return res.redirect('/profile');
//       }
//     });

//   } else {
//     var err = new Error('All fields have to be filled out');
//     err.status = 400;
//     return next(err);
//   }

// });

// // POST route after registering
// router.post('/profile', function (req, res, next) {
//   return res.send('POST profile');
// });
// =======

// function analyzeSentiment(headline, callback) {
//     var mykey = "AIzaSyBJ-qSBynfKnHAF7poPXbqgyS0yzdm30_c";
//     var score = 3;
//     $.ajax({
//         type        : "POST",
//         url         : "https://language.googleapis.com/v1/documents:analyzeSentiment?key="+ mykey,
//         contentType : "application/json",
//         data        : '{"document":{"type":"PLAIN_TEXT","content":"'+headline+'"}}',
//         success     : function(data_) {
//             score = data_.documentSentiment.score;
//             callback(score);
//         },
//         error       : function(err) {
//             console.log(err);
//         }
//     });

// }
