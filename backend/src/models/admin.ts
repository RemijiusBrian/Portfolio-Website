import { InferSchemaType, Schema, model } from "mongoose";

const AdminScheme = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }
});

type Admin = InferSchemaType<typeof AdminScheme>;

export default model<Admin>("Admin", AdminScheme);