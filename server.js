var express = require('express')
var ejs = require('ejs')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var mainRoutes = require('./routes/main')
// var helpers = require('node-view-helpers')
var url = require('url')
var qs = require('querystring')

var path = require('path');


var app = express()
mongoose.connect('mongodb://localhost:27017/article')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))


app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))

// app.use(helpers('pagination')) // make sure you declare this middleware after `connect-flash` and `express.session` middlewares and before `express.router`.

app.use(function (req, res, next) {
    res.locals.createPagination = function (pages, current) {
        var params = qs.parse(url.parse(req.url).query)
        var str = ''
        current = Number(current)
        pages = pages > 0 ? pages : 1
    
        var beforeAfter = 3
        
        if (current == 1) {
          str += '<li class="active"><a>1</a></li>'
        } else {
          params.page = 1
          var href = '?' + qs.stringify(params)
          str += '<li><a href="' + href + '">1</a></li>'
        }
    
    
        var i;
        if (current - beforeAfter > 1 + 1) {
          i = current - beforeAfter
          str += '<li class="disabled"><a>...</a></li>'
        } else {
          i = 2
        }
    
        for (; i <= (current + beforeAfter) && i < pages; i++) {
          if (i == current) {
            str = str + '<li class="active"><a>' + i + '</a></li>'
          } else {
            params.page = i
            var href = '?' + qs.stringify(params)
            str += '<li><a href="' + href + '">' + i + '</a></li>'
          }
          
        }
    
        if (pages > 1) {
          if (current + beforeAfter < pages - 1) {
            str = str + '<li class="disabled"><a>...</a></li>'
          }
    
          if (current == pages) {
            str += '<li class="active"><a>' + pages + '</a></li>'
          } else {
            params.page = pages
            var href = '?' + qs.stringify(params)
            str += '<li><a href="' + href + '">' + pages + '</a></li>'
          }
        }
    
        return str
    
    }

    next()
})
app.use(mainRoutes)

app.listen(3000, function () {
    console.log('Node.js listening on port ' + 3000)
})