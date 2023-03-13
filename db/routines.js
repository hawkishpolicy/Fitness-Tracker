const client = require("./client");

// *** addActivityToRoutine() from routine_activities.js needs to be completed before you can pass the tests in this file.

// Work on this file FOURTH

// create and returns the new routine
// ** this function needs to be completed first because other tests rely on it.
async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      INSERT INTO routines ("creatorId", "isPublic", name, goal)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (name) DO NOTHING
      RETURNING *;
    `,
      [creatorId, isPublic, name, goal]
    );

    return routine;
  } catch (error) {
    console.error("Error creating routine!");
    throw error;
  }
}

// this function returns an array of all of the routines with their activities attached. Use the helper function attachActivitiesToRoutines() from "db/activities" to help with this.
async function getAllRoutines() {}

// this function returns an array of all of the public routines with their activities attached. Use the helper function attachActivitiesToRoutines() from "db/activities" to help with this.

async function getAllPublicRoutines() {}

// this function should return a single routine (object) from the database that matches the id that is passed in as an argument.
async function getRoutineById(id) {}

// this function returns an array of all of the routines WITHOUT their activities attached.
async function getRoutinesWithoutActivities() {
  try {
    const { rows: routines } = await client.query(`
      SELECT *
      FROM routines;
    `);

    return routines;
  } catch (error) {
    console.error("Error during getRoutinesWithoutActivities");
    throw error;
  }
}

// this function should return an array of routines, with their activities attached, where the creatorName matches the name that is passed in as part of the argument. Use the helper function attachActivitiesToRoutines() from "db/activities" to help with this.
async function getAllRoutinesByUser({ username }) {}

// this function should return an array of all public routines, with their activities attached, where the creatorName matches the name that is passed in as part of the argument. Use the helper function attachActivitiesToRoutines() from "db/activities" to help with this.
async function getPublicRoutinesByUser({ username }) {}

// this function should return an array of all routines, with their activities attached, contain the activity id that is passed in as part of the argument. Use the helper function attachActivitiesToRoutines() from "db/activities" to help with this.
async function getPublicRoutinesByActivity({ id }) {}

// The id should not be changed
// You should be able to update the name, or the goal, or the isPublic status, or any combination of these three.
// return the updated routine
async function updateRoutine({ id, ...fields }) {}

// this should remove a routine from the database based upon the id that is passed in as an argument
// Make sure to delete all the routine_activities whose routine is the one being deleted.
// you do not need to return anything
async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
