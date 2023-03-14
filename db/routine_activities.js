const client = require("./client");

// Work on addActivityToRoutine THIRD, then work on routines.js

// adds an activity to the routine_activity table
// ** this function needs to be completed first because other tests rely on it.
async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
      INSERT INTO routine_activities ("routineId", "activityId", count, duration)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT ("routineId", "activityId") DO NOTHING
      RETURNING *;
    `,
      [routineId, activityId, count, duration]
    );

    return routine_activity;
  } catch (error) {
    console.error("Error during addActivityToRoutine!");
    throw error;
  }
}

// Work on the remainder of this file FIFTH

// this function should return a single routine_activity (object) from the database that matches the id that is passed in as an argument.
async function getRoutineActivityById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      SELECT * 
      FROM routine_activities
      WHERE routine_activities.id=$1
    `,
      [id]
    );

    return routine;
  } catch (error) {
    console.error("Error at getRoutineActivityById");
    throw error;
  }
}

// this function should return an array of routine_activity objects that are attached to the routine id that is passed in as part of the argument.
async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: routineActivities } = await client.query(
      `
      SELECT *
      FROM routine_activities
      WHERE routine_activities."routineId"=$1
    `,
      [id]
    );

    return routineActivities;
  } catch (error) {
    console.error("Error at getRoutineActivitiesByRoutine");
    throw error;
  }
}

// The id should not be changed
// You should be able to update the count, or the duration, or count & duration.
// return the updated routine_activity
async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [routineActivity],
    } = await client.query(
      `
      UPDATE routine_activities
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return routineActivity;
  } catch (error) {
    console.error("Error at updateRoutineActivity");
    throw error;
  }
}

// this should remove a routine_activity from the database based upon the id that is passed in as an argument
// you should return the routine_activity that was deleted
async function destroyRoutineActivity(id) {
  try {
    const {
      rows: [routineActivity],
    } = await client.query(
      `
      SELECT *
      FROM routine_activities
      WHERE routine_activities.id=$1
    `,
      [id]
    );

    await client.query(
      `
      DELETE
      FROM routine_activities
      WHERE routine_activities.id=$1
    `,
      [id]
    );

    return routineActivity;
  } catch (error) {
    console.error("Error at destroyRoutineActivity");
    throw error;
  }
}

// check if the userId that is passed in as an argument matches the id of the user who created the routine_activity (the id was also passed into the function as an argument).
// if the user created the routine_activity then return true, otherwise return false.
async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    const {
      rows: [canEdit],
    } = await client.query(
      `
      SELECT routine_activities.*
      FROM routine_activities
      JOIN routines ON routine_activities."routineId"=routines.id
      WHERE routine_activities.id=$1 AND routines."creatorId"=$2
  `,
      [routineActivityId, userId]
    );

    return canEdit;
  } catch (error) {
    console.error("Error at canEditRoutineActivitiy");
    throw error;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
