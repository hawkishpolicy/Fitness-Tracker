const express = require("express");
const {
  updateActivity,
  updateRoutineActivity,
  getRoutineById,
  destroyRoutineActivity,
  canEditRoutineActivity,
} = require("../db");
const routineActivitiesRouter = express.Router();

// PATCH /api/routine_activities/:routineActivityId

routineActivitiesRouter.patch("/:routineActivityId", async (req, res, next) => {
  const { routineActivityId: id } = req.params;
  const routActData = req.body;
  const updatedRoutineActivity = await updateRoutineActivity({
    id,
    ...routActData,
  });
  const updatedRoutineActivityId = await getRoutineById(
    updatedRoutineActivity.routineId
  );
  try {
    if (req.user.id !== updatedRoutineActivityId.creatorId) {
      res.status(401);
      next({
        name: "No Access",
        message: "Unauthorized Access Not Allowed",
      });
    } else {
      res.send(updatedRoutineActivity);
    }
  } catch ({ name, message }) {}
});

// DELETE /api/routine_activities/:routineActivityId

routineActivitiesRouter.delete(
  "/:routineActivityId",
  async (req, res, next) => {
    const { routineActivityId: id } = req.params;
    const canEdit = await canEditRoutineActivity(id, req.user.id);
    const deletedRoutineActivity = await destroyRoutineActivity(id);
    try {
      if (canEdit) {
        res.send(deletedRoutineActivity);
      } else {
        next({ name, message });
      }
    } catch ({ name, message }) {
      res.status(401);
      next({ name, message });
    }
  }
);

module.exports = routineActivitiesRouter;
