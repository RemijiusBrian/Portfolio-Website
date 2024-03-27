import express from "express";
import * as ProjectsController from "../controller/projectsController";

const router = express.Router();

router.post("/", ProjectsController.createProject);

router.put("/:projectId", ProjectsController.updateProject);

router.delete("/:projectId", ProjectsController.deleteProjectById);

export default router;