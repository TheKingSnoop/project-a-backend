import jwt from "jsonwebtoken";
//Authentication middleware
const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token, "token in middleware");
    console.log(process.env.JWT_SECRET, "jwt key in middleware");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedToken, "decoded token in middleware");
    req.userData = { id: decodedToken.id, name: decodedToken.name };
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed!" });
  }
};

export default checkAuth;
