/* 

DO NOT CHANGE THIS FILE

*/

require("dotenv").config();
const bcrypt = require("bcrypt");
const client = require("../../db/client");

const {
  createUser,
  getUserByUsernameWithPassword,
  getUser,
  getUserById,
} = require("../../db");

describe("DB Users", () => {
  describe("createUser({ username, password })", () => {
    it("Creates the user", async () => {
      const fakeUserData = {
        username: "Horace",
        password: "12345678",
      };

      const user = await createUser(fakeUserData);

      expect(user.username).toBe(fakeUserData.username);
    });

    it("Does NOT return the password", async () => {
      const fakeUserData = {
        username: "HoraceTheSecond",
        password: "12345678",
      };
      const user = await createUser(fakeUserData);
      expect(user.password).toBeFalsy();
    });

    it("EXTRA CREDIT: Does not store plaintext password in the database", async () => {
      const fakeUserData = {
        username: "Harry",
        password: "superSecretPassword",
      };
      const user = await createUser(fakeUserData);
      expect(user.password).not.toBe(fakeUserData.password);
    });

    it("EXTRA CREDIT: Hashes the password (salted 10 times) before storing it to the database", async () => {
      const fakeUserData = {
        username: "Nicky",
        password: "extraSuperSecretPassword",
      };
      const user = await createUser(fakeUserData);

      const {
        rows: [queriedUser],
      } = await client.query(
        `
        SELECT * from users
        WHERE id = $1
        `,
        [user.id]
      );

      const hashedVersion = await bcrypt.compare(
        fakeUserData.password,
        queriedUser.password
      );
      expect(hashedVersion).toBe(true);
    });
  });

  describe("getUserByUsernameWithPassword(username)", () => {
    it("returns the user object if the username exists in the database", async () => {
      const fakeUserData = {
        username: "Bob",
        password: "cvbnmjbgtr",
      };

      await createUser(fakeUserData);

      const user = await getUserByUsernameWithPassword(fakeUserData.username);

      expect(user).toBeTruthy();
      expect(user.username).toBe(fakeUserData.username);
    });

    it("Does not return the user object if the username is not present in the database", async () => {
      const fakeUserData = {
        username: "Pete",
        password: "ertycvbnmkjhgfds",
      };

      await createUser(fakeUserData);

      const user = await getUserByUsernameWithPassword("Mary");

      expect(user).toBeFalsy();
    });
  });

  describe("getUser({ username, password })", () => {
    it("returns the user when the password verifies", async () => {
      const fakeUserData = {
        username: "Nicole",
        password: "6ygfe6ijbgtr",
      };
      await createUser(fakeUserData);

      const user = await getUser(fakeUserData);

      expect(user).toBeTruthy();
      expect(user.username).toBe(fakeUserData.username);
    });

    it("Does not return the user if the password doesn't verify", async () => {
      const fakeUserData = {
        username: "Issac",
        password: "ertyuiokjhgfds",
      };

      await createUser(fakeUserData);

      const user = await getUser({
        username: "Issac",
        password: "Bad Password",
      });

      expect(user).toBeFalsy();
    });

    it("Does NOT return the password", async () => {
      const fakeUserData = {
        username: "Michael",
        password: "jhtdxcvbnm",
      };
      await createUser(fakeUserData);
      const user = await getUser(fakeUserData);
      expect(user.password).toBeFalsy();
    });
  });

  describe("getUserById(userId)", () => {
    it("returns the user object where xit matches the passed in user id", async () => {
      const fakeUserData = {
        username: "Sarah",
        password: "poiuytfvbnm",
      };
      const newUser = await createUser(fakeUserData);

      const user = await getUserById(newUser.id);
      expect(user).toBeTruthy();
      expect(user.id).toBe(newUser.id);
    });

    it("does not return the password", async () => {
      const fakeUserData = {
        username: "Jonathan",
        password: "wertyhjkkjh",
      };

      const newUser = await createUser(fakeUserData);

      const user = await getUserById(newUser.id);
      expect(user.password).toBeFalsy();
    });
  });
});
