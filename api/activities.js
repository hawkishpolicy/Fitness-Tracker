const express = require("express");
const {
  getAllActivities,
  getPublicRoutinesByActivity,
  createActivity,
  getActivityByName,
  getActivityById,
  updateActivity,
} = require("../db");
const activitiesRouter = express.Router();

// GET /api/activities
activitiesRouter.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch {
    console.error("error in activitiesRouter.get(" / ")");
    throw error;
  }
});

// GET /api/activities/:activityId/routines
activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  try {
    const { activityId: id } = req.params;
    let totalActivities = await getAllActivities();
    totalActivities = totalActivities.length;

    if (id <= totalActivities) {
      const activities = await getPublicRoutinesByActivity({ id });
      res.send(activities);
    } else {
      next({ name, message });
    }
  } catch ({ name, message }) {
    res.status(406);
    next({
      name: "OutOfBounds",
      message: "The id provided was larger than the total amount of activities",
    });
  }
});

// POST /api/activities
activitiesRouter.post("/", async (req, res, next) => {
  try {
    const activityToCreate = req.body;
    const activityExists = await getActivityByName(activityToCreate.name);

    if (!activityExists) {
      const activityToReturn = await createActivity(activityToCreate);
      res.send(activityToReturn);
    } else {
      next({ name, message });
    }
  } catch ({ name, message }) {
    res.status(406);
    next({
      name: "AlreadyExists",
      message: "Activity already exists! dumbass",
    });
  }
});

// PATCH /api/activities/:activityId
activitiesRouter.patch("/:activityId", async (req, res, next) => {
  try {
    const { activityId: id } = req.params;
    const activityToUpdate = req.body;
    const activityExists = await getActivityById(id);

    if (!activityExists) {
      next({ name, message });
    } else {
      const updatedActivity = await updateActivity({ id, ...activityToUpdate });
      if (updatedActivity) {
        res.send(updatedActivity);
      }
    }
  } catch ({ name, message }) {
    res.status(401);
    next({ name: "", message: "" });
  }
});

module.exports = activitiesRouter;
