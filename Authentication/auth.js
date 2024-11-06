const { expressjwt: jwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.secret;
  return jwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  });
}
async function isRevoked(req, payload, done) {
  // console.log(req.headers["authorization"]);
  req.user = payload.payload;
}

module.exports = authJwt;
