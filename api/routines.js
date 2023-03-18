const express = require("express");
const {
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  getRoutineById,
} = require("../db/routines");
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
  console.log("$$$$", req.body);
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

// POST /api/routines/:routineId/activities

module.exports = routinesRouter;
