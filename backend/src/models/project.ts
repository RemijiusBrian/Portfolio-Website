import { InferSchemaType, Schema, model } from "mongoose";

const ProjectSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    sourceCodeUrl: { type: String, required: false },
    deployedUrl: { type: String, required: false }
}, { timestamps: true });

type Project = InferSchemaType<typeof ProjectSchema>;

export default model<Project>("Project", ProjectSchema);