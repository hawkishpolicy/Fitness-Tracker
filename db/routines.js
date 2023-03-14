const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");
const { addActivityToRoutine } = require("./routine_activities");

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
async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM  routines
      JOIN users ON routines."creatorId"=users.id
      `);
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.log("Error during getAllRoutines!");
    throw error;
  }
}

// this function returns an array of all of the public routines with their activities attached. Use the helper function attachActivitiesToRoutines() from "db/activities" to help with this.

async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    WHERE routines."isPublic"=true
    `);
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.log("Error during getAllPublicRoutines!!!");
    throw error;
  }
}

// this function should return a single routine (object) from the database that matches the id that is passed in as an argument.
async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
 SELECT *
 FROM routines
 WHERE routines.id=$1
`,
      [id]
    );
    return routine;
  } catch (error) {
    console.log("Error getting Routine by Id!!");
    throw error;
  }
}

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
async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(
      `
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    WHERE users.username=$1
    `,
      [username]
    );
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.error("Error during getAllRoutinesByUser!!");
    throw error;
  }
}

// this function should return an array of all public routines, with their activities attached, where the creatorName matches the name that is passed in as part of the argument. Use the helper function attachActivitiesToRoutines() from "db/activities" to help with this.
async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(
      `
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    WHERE users.username=$1 AND routines."isPublic"=true
    `,
      [username]
    );
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.error("Error during getPublicRoutesByUser!!");
    throw error;
  }
}

// this function should return an array of all routines, with their activities attached, contain the activity id that is passed in as part of the argument. Use the helper function attachActivitiesToRoutines() from "db/activities" to help with this.
async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: routines } = await client.query(
      `
     SELECT routines.*, users.username AS "creatorName"
     FROM routines
     JOIN routine_activities ON routine_activities."routineId"=routines.id
     JOIN users ON routines."creatorId"=users.id
     WHERE routine_activities."activityId"=$1 AND routines."isPublic"=true
    `,
      [id]
    );
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.error("Error during getPublicRoutinesByActivity!!!!");
    throw error;
  }
}

// The id should not be changed
// You should be able to update the name, or the goal, or the isPublic status, or any combination of these three.
// return the updated routine
async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [routines],
    } = await client.query(
      `
      UPDATE routines
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return routines;
  } catch (error) {
    console.error("Error during updateRoutine");
    throw error;
  }
}

// this should remove a routine from the database based upon the id that is passed in as an argument
// Make sure to delete all the routine_activities whose routine is the one being deleted.
// you do not need to return anything
async function destroyRoutine(id) {
  try {
    await client.query(
      `
      DELETE
      FROM routine_activities
      WHERE routine_activities."routineId"=$1;
    `,
      [id]
    );

    await client.query(
      `
      DELETE
      FROM routines
      WHERE routines.id=$1
    `,
      [id]
    );
  } catch (error) {
    console.error("Error during destroyRoutine");
    throw error;
  }
}

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
