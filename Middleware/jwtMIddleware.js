const jwt = require('jsonwebtoken')

const jwtMiddleWare = (req, res, next) => {
    console.log("Inside Middleware");
    const token = req.headers['authorization'].split(" ")[1]
    console.log(token);
    if (token != "") {
        try {
            const jwtResponse = jwt.verify(token, process.env.jwtPassword)
            console.log(jwtResponse);
            req.userId = jwtResponse.userId
        } catch (error) {
            res.status(401).json(error)
        }
    } else {
        res.status(404).json("Authorization failed...Token Missing")
    }
    next()
}

module.exports = jwtMiddleWare