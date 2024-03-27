import { InferSchemaType, Schema, model } from "mongoose";

const ExperienceEntrySchema = new Schema({
    position: { type: String, required: true },
    orgName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false }
});

type ExperienceEntry = InferSchemaType<typeof ExperienceEntrySchema>;

export default model<ExperienceEntry>("ExperienceEntry", ExperienceEntrySchema);