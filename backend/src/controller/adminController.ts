import { RequestHandler } from "express";
import AdminModel from "../models/admin";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import apiResponse from "../util/apiResponse";

interface RegisterBody {
    username?: string,
    email?: string,
    password?: string
}

export const registerAdmin: RequestHandler<unknown, unknown, RegisterBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;

    try {
        if (!username || !email || !passwordRaw) throw createHttpError(400, "Parameters missing");

        const existingEmail = await AdminModel.findOne({ email: email }).exec();
        if (existingEmail) throw createHttpError(409, "Email already taken. Please choose a different one or login instead.");

        const passwordHash = await bcrypt.hash(passwordRaw, 10);

        const newAdmin = await AdminModel.create({
            username: username,
            email: email,
            password: passwordHash
        });

        req.session.adminId = newAdmin._id;

        res.status(201).json(apiResponse({ message: "Admin registered", data: newAdmin }));

    } catch (error) {
        next(error);
    }

};

interface LoginBody {
    email?: string,
    password?: string
}

export const loginAdmin: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        if (!email || !password) throw createHttpError(400, "Parameters missing");

        const admin = await AdminModel.findOne({ email: email }).select("+password").exec();

        if (!admin) throw createHttpError(401, "Invalid credentials");

        const passwordMatches = await bcrypt.compare(password, admin.password);

        if (!passwordMatches) throw createHttpError(401, "Invalid credentials");

        req.session.adminId = admin._id;

        res.status(200).json(apiResponse({ message: "Login successful", data: admin }));

    } catch (error) {
        next(error);
    }
};

export const logout: RequestHandler = async (req, res, next) => {
    req.session.destroy(err => {
        if (err) next(err);
        else res.sendStatus(200);
    });
};