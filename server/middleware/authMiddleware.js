import jwt from "jsonwebtoken"

export const protect = (req, res, next) => {

  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({ message: "Not authorized" })
  }

  try {

    const decoded = jwt.verify(token, "eatbybitsecret")

    req.user = decoded.id

    next()

  } catch (error) {

    res.status(401).json({ message: "Invalid token" })

  }

}