const jwt = require("jsonwebtoken");


// Protect routes that require authentication
const isRegisteredUser = async (req, res, next) => {
  let token;

  // Check if the token is in the authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract token from the authorization header
      token = req.headers.authorization.split(" ")[1];
      console.log("Authorization header: ", req.headers.authorization);
console.log("Token extracted: ", token);


      // Decode the token and get the user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decoded:; ", decoded)

      // Attach user to request object
      req.userId = decoded.userId;

      next();  // Allow access to the next middleware or route handler
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { isRegisteredUser };
