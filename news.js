function check() {
    db = firebase.firestore()
    db.collection('app').doc("news").get().then(function(doc) {
        firebasedate = doc.data().news.toDate()
        currentdate = new Date()
        var diffMinutes = parseInt((currentdate - firebasedate) / (1000 * 60), 10); 
        console.log(diffMinutes);
        if (diffMinutes > 60) {
            $.getJSON("https://newsapi.org/v2/everything?q=coronavirus&language=en&sortby=relevancy&apiKey=c735f0bd7f8344ca8efbe074446b7e87", function(json) {
            NEWS = json
            buildNews(NEWS)
            db.collection("app").doc("news").update({
                newscache: NEWS,
                news: currentdate
            })
            });
        } else {
            // USE CACHED NEWS
            db.collection("app").doc("news").get().then(function(doc) {
                NEWS = doc.data().newscache
                buildNews(NEWS)
            })
        }
    })
}

function buildNews(NEWS) {
    for (let i = 0; i < 10; i++) {
        article = NEWS.articles[i];
        console.log(article)
        view = "window.open('" + article['url'] + "')"
        add = document.createElement('div')
        add.innerHTML = '<h4>' + article['title'] + '</h4> <p>' + article['content'] + '</p> <button onclick="' + view + '">More Info</button>'
        document.getElementById('news').appendChild(add)                    
        document.getElementById('news').appendChild(document.createElement("br"))
    }
}

/*
function viewArticle(num) {
    $('#newsmodal').modal('toggle')
    document.getElementById('newstitle').innerHTML = NEWS.articles[num].title
    document.getElementById('newscontent').innerHTML = NEWS.articles[num].content
    document.getElementById('newsdate').innerHTML = NEWS.articles[num].publishedAt
    document.getElementById('newsauthor').innerHTML = NEWS.articles[num].author
    document.getElementById('newsdescription').innerHTML = NEWS.articles[num].description
    document.getElementById('newsbanner').src = NEWS.articles[num].urlToImage
    document.getElementById('newsbutton').onclick = function() {
        window.open(NEWS.articles[num].url)
    }  
}
*/

function closenews() {
    $('#newsmodal').modal('toggle')
}
