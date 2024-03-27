import express from "express";
import * as ExperienceEntryController from "../controller/experienceEntryController";

const router = express.Router();

router.post("/", ExperienceEntryController.createEntry);

router.put("/:entryId", ExperienceEntryController.updateEntry);

router.delete("/:entryId", ExperienceEntryController.deleteEntryById);

export default router;