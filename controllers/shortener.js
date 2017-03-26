const mongoose = require('mongoose')
//counter = require('../models/counter.js')
Url = require('../models/urls.js')
Counter = require('../models/counter.js')

//60 length alphabet
var alphabet = ["1","2","3","4","5","6","7","8","9",
                "a","b","c","d","e","f","g","h","i","j","k","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
                "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

base = 60;
encode = (num) => {
  var encoded = '';
  while (num){
    var remainder = num % base;
    num = Math.floor(num / base);
    encoded = alphabet[remainder] + encoded;
  }
  return encoded;
}

toBaseSixty = (baseTenNum) => {
  i = 0
  while(Math.pow(60, i) < baseTenNum) {
    i++
  }
  //uses places starting from position (i-1)
  baseSixtyNum = ""
  while(baseTenNum > 0) {
    if(i < 0) return baseSixtyNum

    rem = baseTenNum % Math.pow(60, i-1)//returns 40, for num == 100, i=2
    currentDigit = Math.floor(baseTenNum/Math.pow(60, i-1))//for num=100 and i=2 returns 1


    baseSixtyNum += alphabet[currentDigit]
    baseTenNum = rem
    i--
  }
  return baseSixtyNum
}


exports.index = (req, res) => {
  //res.redirect('/shorten')
  res.render('shorten')
  //res.send('shortener goto')
}


exports.shortenURL = (req, res) => {
  console.log(req.body.url)
  //create new url using url model

  Counter.findById({_id:'num_urls'}, (err, counter) => {

    cur = counter.num

    //convert cur from base 10 to base 60
    //create link using base 60 string
    //baseSixty = toBaseSixty(cur)
    baseSixty = encode(cur)
    //increment counter for next use
    counter.num = counter.num + 1

    let newUrl = new Url({
      _id:baseSixty,
      url:req.body.url,
      createdOn: new Date()
    })//new url

    //save new counter.num
    counter.save((err) => {
        if(err) throw err
          console.log('counter incremented')
    })//save counter

    //add newUrl to collection
    newUrl.save((err) => {
      if (err) throw err
        console.log('url saved')
    })//save newUrl

    res.send('shortened URL HERE: ' + cur + ' in base Sixty:' + baseSixty)

  })//counter.findById

}

exports.getUrl = (req, res) => {
  console.log('looking for ' + req.params.code)
  //res.send('forwarding to url for code: ' + req.params.code )

  Url.findById({_id:req.params.code}, (err, url_) => {
    if (err) {
      throw err
    } else if(url_){
      //res.send('forwarding to url for code: ' + req.params.code + ' url is: ' + url_.url)
      routeTo = url_.url
      routeTo = routeTo.replace(/^(http:\/\/)/, '')
      routeTo = routeTo.replace(/^www./, '')

      console.log('before replace:' + url_.url + ' after replace:' + routeTo)
      routeTo = 'http://www.' + routeTo
      console.log('routing to->' + routeTo)
      res.send(routeTo)
      //res.redirect(301, routeTo)
    } else {
      res.send('forwarding to url for code: ' + req.params.code + ' URL not found')
    }
  })

  console.log('getUrlDone')

}

//only works if the counters collection is empty
exports.setCount = (req, res) => {
  console.log('attempting to set count')
  //Counter.findByIdAndRemove({_id:'num_urls'})
  let counter = new Counter({
    _id: 'num_urls',
    num: 22222
  })

  counter.save((err) => {
    if (err) throw err

    console.log('counter saved')
    res.redirect('/shorten')
  })
}
