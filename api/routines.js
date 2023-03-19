const express = require("express");
const {
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  getRoutineById,
  destroyRoutine,
  getRoutineActivityById,
} = require("../db");
const routinesRouter = express.Router();

// GET /api/routines
routinesRouter.get("/", async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines();
    res.send(routines);
  } catch {
    console.error("error in routinesRouter.get(" / ")");
    throw error;
  }
});

// POST /api/routines
routinesRouter.post("/", async (req, res, next) => {
  const newRoutine = req.body;
  try {
    if (req.user) {
      newRoutine.creatorId = req.user.id;
      const routineToReturn = await createRoutine(newRoutine);
      res.send(routineToReturn);
    } else {
      next({ name, message });
    }
  } catch ({ name, message }) {
    res.status(406);
    next({
      name: "AlreadyExists",
      message: "Activity already exists!",
    });
  }
});

// PATCH /api/routines/:routineId
routinesRouter.patch("/:routineId", async (req, res, next) => {
  const { routineId: id } = req.params;
  const updatedRoutine = req.body;
  const comparedId = await getRoutineById(id);
  try {
    if (req.user && req.user.id == comparedId.creatorId) {
      const routineToReturn = await updateRoutine({ id, ...updatedRoutine });
      res.send(routineToReturn);
    } else {
      next({ name, message });
    }
  } catch ({ name, message }) {
    res.status(403);
    next({
      name: "Verbotten!!!",
      message: "Nein Nein Nein!!!!",
    });
  }
});

// DELETE /api/routines/:routineId
routinesRouter.delete("/:routineId", async (req, res, next) => {
  try {
    const { routineId: id } = req.params;
    const routineToDelete = await getRoutineById(id);
    if (req.user && req.user.id == routineToDelete.creatorId) {
      await destroyRoutine(id);
      res.send(routineToDelete);
    } else {
      next({ name, message });
    }
  } catch ({ name, message }) {
    res.status(403);
    next({
      name: "Forbidden",
      message: "You have to be the routine creator in order to delete it",
    });
  }
});

// POST /api/routines/:routineId/activities
routinesRouter.post("/:routineId/activities", async (req, res, next) => {
  try {
    const { routineId: id } = req.params;
    const routineActivityToAdd = req.body;
    const preventDupe = await getRoutineActivityById(id);
    console.log("rATA: ", routineActivityToAdd);
    console.log("PD: ", preventDupe);
    if (
      !(
        routineActivityToAdd.routineId === preventDupe.routineId &&
        routineActivityToAdd.activityId === preventDupe.activityId
      )
    ) {
      console.log("GRAHHHHHHHHHHH");
      res.send();
    } else {
      next({ name, message });
    }
  } catch ({ next, message }) {
    next({ name: "Forbidden", message: "Cannot create duplicate activity" });
  }
});

module.exports = routinesRouter;
