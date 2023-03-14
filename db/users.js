const client = require("./client");
const bcrypt = require("bcrypt");

// Work on this file FIRST

// user functions

// create and returns the new user
// ** this function needs to be completed first because other tests rely on it.
async function createUser({ username, password }) {
  const SALT_COUNT = 10;

  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

  try {
    const {
      rows: [user],
    } = await client.query(
      `
     INSERT INTO users (username, password) 
     VALUES ($1, $2)
     ON CONFLICT (username) DO NOTHING
     RETURNING *; 
    `,
      [username, hashedPassword]
    );

    delete user.password;

    return user;
  } catch (error) {
    console.error("Error creating user!");
    throw error;
  }
}

// this function should return a single user (object) from the database that matches the userName that is passed in as an argument.
async function getUserByUsernameWithPassword(userName) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT * FROM users
      WHERE username=$1
    `,
      [userName]
    );
    if (user) {
      return user;
    }
  } catch (error) {
    console.error("Error getting user!");
    throw error;
  }
}

// this should be able to verify the password against the hashed password and if the passwords match then it should return a single user (object) from the database that matches the username that is passed in as part of the argument
async function getUser({ username, password }) {
  const user = await getUserByUsernameWithPassword(username);
  const hashedPassword = user.password;

  // isValid will be a boolean based on wether the password matches the hashed password
  const isValid = await bcrypt.compare(password, hashedPassword);
  if (isValid) {
    delete user.password;
    return user;
  }
}

// this function should return a single user (object) from the database that matches the id that is passed in as an argument.
async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
      SELECT * FROM users
      WHERE id=${userId}
    `);
    delete user.password;
    return user;
  } catch (error) {
    console.error("Error getting user!");
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsernameWithPassword,
};
