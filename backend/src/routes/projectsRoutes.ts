import express from "express";
import * as ProjectsController from "../controller/projectsController";

const router = express.Router();

router.get("/", ProjectsController.getProjects);

router.get("/:projectId", ProjectsController.getProjectById);

export default router;