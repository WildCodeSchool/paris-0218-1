const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const multer = require('multer')
const path = require('path')

const port = 3000
const secret = 'something wild'

const db = require('./db-fs.js')
//const db = require('./db-sql.js')

const app = express()

// MIDDLEWARES

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// multer set up
const uploadDir = path.join(__dirname, 'public/images')

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => { // accepts only images
    const ext = path.extname(file.originalname).toLowerCase()
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      req.fileValidationError = 'invalid file type'
      return cb(new Error('invalid file type'), false)
    }
    cb(null, true)
  },
  limits: { // limited at 5 Mo
    fileSize: 5000000
  }
}).single('avatar')

// images - authorize Access
app.use('/images', express.static(uploadDir)) // module to access images

// Headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Credentials', 'true') // important
  next()
})

// set up session
app.use(session({
  secret,
  resave: true,
  saveUninitialized: false,
  store: new FileStore({secret})
}))

// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, { user: req.session.user, cookie: req.headers.cookie })
  next()
})
// ROUTES

app.get('/', (req, res) => {
  const user = req.session.user || {}

  res.json(user)
})

const keepBests = users => users
  .sort((user1, user2) => user2.bestScore - user1.bestScore)
// .slice(0, 5)

app.get('/scores', (req, res) => {
  db.getUsers()
    .then(keepBests)
    .then(users => res.json(users))
    .catch(err => res.status(500).end(err.message))
})

app.get('/all-scores', (req, res) => {
  db.getUsers()
    .then(users => users.sort((user1, user2) => user2.bestScore - user1.bestScore))
    .then(users => res.json(users))
    .catch(err => res.status(500).end(err.message))
})

app.post('/addscore', (req, res, next) => {
  const { userId, score, nbSocks } = req.body

  db.addScore(userId, score, nbSocks)
    .then(() => res.json('OK'))
    .catch(next)
})

// Sign up : check the database to verify that the email get from client doesn't exist
// then write a new file in database/users to create the new user
app.post('/sign-up', async (req, res, next) => {
  const user = req.body // username, email, password, campus

  // error handling
  const users = await db.getUsers()

  const emails = users.map(user => user.email)
  const emailAlreadyExists = emails.some(email => email === user.email)
  if (emailAlreadyExists) {
    return res.json({ error: 'Email already exists' })
  }

  const usernames = users.map(user => user.username)
  const usernameAlreadyExists = usernames.some(username => username === user.username)
  if (usernameAlreadyExists) {
    return res.json({ error: 'Username already exists' })
  }

  user.firstName = ''
  user.lastName = ''
  user.avatar = 'default.jpg'
  user.bestScore = 0
  user.score = []

  db.addUser(user)
    .then(() => res.json('OK'))
    .catch(err => res.status(500).end(err.message))
})

// Sign in / sign out
app.post('/sign-in', async (req, res, next) => {
  const credentials = req.body

  const users = await db.getUsers()

  // does user exists ?
  const user = users.find(user => user.username === credentials.username || user.email === credentials.username)

  // Error handling
  if (!user) {
    return res.json({ error: 'User not found' })
  }
  if (user.password !== credentials.password) {
    return res.json({ error: 'Wrong password' })
  }

  // else, set the user into the session
  req.session.user = user

  res.json(user)
})

app.get('/sign-out', (req, res, next) => {
  req.session.user = {}

  res.json(req.session.user)
})

// PROFILE
// Get user profile
app.get('/profile', (req, res) => {
  const userId = req.session.user.id

  db.getUserById(userId)
    .then(user => res.json(user))
})

// Update profile - image uploads
// app.post('/update-profile', upload.single('avatar'), async (req, res, next) => {
app.post('/update-profile', async (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.log('there is an error', err)
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.json({error: 'file too big'})
      }
      if (req.fileValidationError) {
        return res.json({ error: 'Invalid type file' })
      }
    }

    const userId = req.session.user.id
    const personalInfo = req.body
    const newAvatar = req.file

    db.addPersonalInformations(userId, personalInfo, newAvatar)
      .then(() => res.json('ok'))
      .catch(next)
  })
})

// ERRORS
app.use((err, req, res, next) => {
  if (err) {
    res.json({ error: err.message })
    console.error(err)
  }

  next(err)
})

app.listen(port, err => console.log(err || `server listening on port ${port}`))
