const router = require('express').Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const Users = require('./users-model.js');


router.post('/register', (req, res) => {
  // implement registration
  let user = req.body;
  

  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add({ username: user.username, password: user.password})
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  // implement login
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user)
        res.status(200).json({ message: 'You are logged in', token });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json(error);
    });
});

function generateToken(user) {
  const payload = {
    username: user.username
  }
  const secret = 'keep it secret, keep it safe'
  const options = {
    expiresIn: '1d'
  }
  return jwt.sign(payload, secret, options)
}

module.exports = router;
