const jwt = require("jsonwebtoken");
const express = require("express");
const router = new express.Router();

const User = require("../models/user");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post("/login", async function (req, res, next) {
  try {
    let { username, password } = req.body;
    if (await User.authenticate(username, password)) {
      const token = jwt.sign({ username }, SECRET_KEY);
      return res.json({ message: `Logged in!`, token });
    } else {
      throw new ExpressError(`Invalid credentials`, 400);
    }
  } catch (err) {
    return next(err);
  }
});

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post("/register", async function (req, res, next) {
  try {
    let { username } = await User.register(req.body);
    const token = jwt.sign({ username }, SECRET_KEY);
    User.updateLoginTimestamp(username);
    return res.json({ message: `Registered as ${username}`, token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
