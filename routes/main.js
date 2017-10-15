var router = require('express').Router()
var faker = require('faker')
var Product = require('../models/product')

router.get('/', function (req, res, next) {
  res.redirect('/products')
})

router.get('/add-product', function (req, res, next) {
  res.render('main/add-product')
})

router.post('/add-product', function (req, res, next) {
  var product = new Product()

  product.category = req.body.category_name
  product.name = req.body.product_name
  product.price = req.body.product_price
  product.cover = faker.image.image()

  product.save(function (err) {
    if (err) throw err
    res.redirect('/add-product')
  })
})

router.get('/clear', function (req, res, next) {
  Product.find({}).remove(function (err) {
    if (err) {
      console.log('err', err)
    } else {
      res.redirect('/products')
    }
  })
})

router.get('/faker', function (req, res, next) {
  for (var i = 0; i < 90; i++) {
    var product = new Product()

    product.category = faker.commerce.department()
    product.name = faker.commerce.productName()
    product.price = faker.commerce.price()
    product.cover = faker.image.image()

    product.save(function (err) {
      if (err) throw err
    })
  }
  res.redirect('/products')
})

router.get('/products', function (req, res, next) {
  var perPage = 9
  var page = req.query.page || 1
  
  
  var skip = perPage * (page - 1)

  Product.find({}).count().exec(function (err, count) {
    var pages = Math.ceil(count / perPage)
    pages = pages > 0 ? pages : 1
    
    Product
      .find({})
      .skip(skip)
      .limit(perPage)
      .exec(function (err, products) {
        Product.count().exec(function (err, count) {
          if (err) return next(err)
          res.render('main/products', {
            products: products,
            current: page,
            pages: pages
          })
        })
      })
  })



})


module.exports = router