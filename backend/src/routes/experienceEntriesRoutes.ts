import express from "express";
import * as ExperienceEntryController from "../controller/experienceEntryController";

const router = express.Router();

router.get("/", ExperienceEntryController.getAllEntries);

router.get("/:entryId", ExperienceEntryController.getEntryById);

export default router;