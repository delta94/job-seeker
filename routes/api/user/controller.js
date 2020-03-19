const bcrypt = require('bcryptjs');
const _ = require("lodash");
const { User } = require("../../../models/User");
const jwt = require('jsonwebtoken');
const { promisify } = require("util");
const config = require("../../../config");

const jwtSign = promisify(jwt.sign);
module.exports.register = (req, res, next) => {
    const { email, password, fullname, userType } = req.body
    const newUser = new User({
        email, password, fullname, userType
    })
    newUser.save()
        .then(user => res.status(200).json(user))
        .catch(err => res.status(400).json(err))
}
module.exports.login = (req, res, next) => {
    // 1. so sanh
    // 2. cap token
    const { email, password } = req.body;
    // find, findOne, findById
    let user;
    User.findOne({ email })
        .then(_user => {
            user = _user;
            if (!user) return Promise.reject({ message: "Email not exist" })

            return bcrypt.compare(password, user.password)
        })
        .then(isMatched => {
            if (!isMatched) return Promise.reject({ message: "Wrong password" })

            const payload = _.pick(user, ["_id", "email", "fullName", "userType"])
            return jwtSign(
                payload,
                config.secretKey,
                { expiresIn: '1h' }
            )
        })
        .then(token => res.status(200).json({
            message: "success",
            token
        }))
        .catch(err => res.status(500).json(err))
}