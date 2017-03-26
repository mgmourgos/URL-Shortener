//dependencies
const express = require('express'),
      pug = require('pug'),
      dotenv = require('dotenv').config(),
      mongoose = require('mongoose'),
      path = require('path'),
      bodyParser = require('body-parser')

const app = express()
mongoose.Promise = Promise;

//express configs
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))
// handles JSON bodies
app.use(bodyParser.json());
// handles URL encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));


//controllers
const shortenerController = require('./controllers/shortener.js')

//mongoose config
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('error', () => {
	console.error('MongoDB Connection Error. Please make sure that MongoDB is running.')
	process.exit(1)
})

app.get('/', function (req, res) {
res.redirect('/shorten')
  //res.send('ey wurld')
})

//routers
app.get('/setCount', shortenerController.setCount)
app.get('/shorten', shortenerController.index)
app.post('/shorten', shortenerController.shortenURL)
app.get('/s/:code', shortenerController.getUrl)

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port ' + (process.env.PORT || 3000))
})

module.exports = app
