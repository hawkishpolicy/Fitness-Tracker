const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = process.env;
const {
  getUserByUsernameWithPassword,
  createUser,
  getPublicRoutinesByUser,
  getAllRoutinesByUser,
} = require("../db");
const usersRouter = express.Router();

// POST /api/users/login
usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(401);
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUserByUsernameWithPassword(username);

    const isValid = await bcrypt.compare(password, user.password);

    if (user && isValid) {
      const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET);
      res.send({ message: "youre logged in!", token });
    } else {
      res.status(401);
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401);
    next(error);
  }
});

// POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const _user = await getUserByUsernameWithPassword(username);

    if (_user) {
      res.status(401);
      next({
        name: "username duplication error",
        message: "username already exists",
      });
    } else if (password.length < 8) {
      res.status(401);
      next({
        name: "password length error",
        message: "Password too short!",
      });
    } else {
      const user = await createUser({ username, password });

      if (!user) {
        next({
          name: "user does not exist",
          message: "refer to name",
        });
      } else {
        const token = jwt.sign(
          { id: user.id, username },
          process.env.JWT_SECRET,
          {
            expiresIn: "1w",
          }
        );

        res.send({
          message: "Thanks for signing up!",
          token,
          user,
        });
      }
    }
  } catch ({ name, message }) {
    console.log("catch was ran!");
    res.status(401);
    next({ name, message });
  }
});

// GET /api/users/me
usersRouter.get("/me", async (req, res, next) => {
  try {
    if (req.user) {
      res.send(req.user);
    } else {
      next({ name, message });
    }
  } catch ({ name, message }) {
    res.status(401);
    next({
      name: "UserDoesNotExist",
      message: "The user does not exist in the database",
    });
  }
});

// GET /api/users/:username/routines
usersRouter.get("/:username/routines", async (req, res, next) => {
  try {
    const { username } = req.params;

    if (req.user && req.user.username == username) {
      const routines = await getAllRoutinesByUser({ username });
      res.send(routines);
    } else {
      const routines = await getPublicRoutinesByUser({ username });
      res.send(routines);
    }
  } catch ({ name, message }) {
    next({
      name: "Invalid Username",
      message: "That user does not exist",
    });
  }
});

module.exports = usersRouter;
