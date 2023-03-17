const express = require("express");
const activitiesRouter = express.Router();

// GET /api/activities
activitiesRouter.get("/", async (req, res, next) => {});

// GET /api/activities/:activityId/routines
activitiesRouter.get("/:activityId/routines", async (req, res, next) => {});

// POST /api/activities
activitiesRouter.post("/", async (req, res, next) => {});

// PATCH /api/activities/:activityId
activitiesRouter.patch("/:activityId", async (req, res, next) => {});

module.exports = activitiesRouter;
