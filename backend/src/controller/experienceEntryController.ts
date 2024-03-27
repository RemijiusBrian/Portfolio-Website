import { RequestHandler } from "express";
import { PaginationParams } from "../util/paginationParams";
import ExperienceModel from "../models/experienceEntry";
import apiResponse from "../util/apiResponse";
import mongoose from "mongoose";
import createHttpError from "http-errors";

export const getAllEntries: RequestHandler<unknown, unknown, unknown, PaginationParams> = async (req, res, next) => {
    try {
        const page = req.query.page ?? 0;
        const pageSize = req.query.pageSize ?? 10;

        const projects = await ExperienceModel.find().skip(page * pageSize).limit(pageSize).exec();

        res.status(200).json(
            apiResponse({
                message: "Experience entries retrieved.",
                data: {
                    "page": page,
                    "pageSize": pageSize,
                    "entries": projects
                }
            })
        );
    } catch (error) {
        next(error);
    }
};

interface EntryIdParam {
    entryId: string
}

export const getEntryById: RequestHandler<EntryIdParam, unknown, unknown, unknown> = async (req, res, next) => {
    try {
        const entryId = req.params.entryId;
        if (!mongoose.isValidObjectId(entryId)) throw createHttpError(400, "Invalid entry ID");

        const entry = await ExperienceModel.findById(entryId).exec();
        if (!entry) throw createHttpError(404, "Entry not found");

        res.status(200).json(apiResponse({ message: "Entry Retrieved", data: entry }));
    } catch (error) {
        next(error);
    }
};

interface AddEntryBody {
    position?: string,
    org?: string,
    startDate?: string,
    endDate?: string,
    isPresent?: boolean
}

export const createEntry: RequestHandler<unknown, unknown, AddEntryBody, unknown> = async (req, res, next) => {
    try {
        const position = req.body.position;
        if (!position) throw createHttpError(400, "Position cannot be empty!");
        const orgName = req.body.org;
        if (!orgName) throw createHttpError(400, "Organization cannot be empty!");
        const startDate = new Date(req.body.startDate ?? "");
        if (!startDate) throw createHttpError(400, "Start date cannot be empty!");
        const isPresent = req.body.isPresent === true;
        const endDate = new Date(req.body.endDate ?? "");
        if (!isPresent && !endDate) throw createHttpError(400, "Invalid end date!");

        const newEntry = await ExperienceModel.create({
            position: position,
            orgName: orgName,
            startDate: startDate,
            endDate: isPresent ? null : endDate
        });

        res.status(200).json(apiResponse({ message: "Entry added successfully.", data: newEntry }));
    } catch (error) {
        next(error);
    }
};

interface UpdateEntryBody {
    position?: string,
    org?: string,
    startDate?: string,
    endDate?: string,
    isPresent?: boolean
}

export const updateEntry: RequestHandler<EntryIdParam, unknown, UpdateEntryBody, unknown> = async (req, res, next) => {
    const entryId = req.params.entryId;
    try {
        if (!mongoose.isValidObjectId(entryId)) throw createHttpError(400, "Invalid project ID");

        const position = req.body.position;
        if (!position) throw createHttpError(400, "Position cannot be empty!");
        const orgName = req.body.org;
        if (!orgName) throw createHttpError(400, "Organization cannot be empty!");
        const startDate = new Date(req.body.startDate ?? "");
        if (!startDate) throw createHttpError(400, "Start date cannot be empty!");
        const isPresent = req.body.isPresent === true;
        const endDate = new Date(req.body.endDate ?? "");
        if (!isPresent && !endDate) throw createHttpError(400, "Invalid end date!");

        const entry = await ExperienceModel.findById(entryId).exec();
        if (!entry) throw createHttpError(404, "Project not found");

        entry.position = position;
        entry.orgName = orgName;
        entry.startDate = startDate;
        entry.endDate = isPresent ? null : endDate;

        const updatedEntry = entry.save();

        res.status(200).json(apiResponse({ message: "Entry updated successfully.", data: updatedEntry }));
    } catch (error) {
        next(error);
    }
};

export const deleteEntryById: RequestHandler<EntryIdParam, unknown, unknown, unknown> = async (req, res, next) => {
    const entryId = req.params.entryId;
    // const authenticatedUserId = req.session.userId;

    try {
        // assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(entryId)) throw createHttpError(400, "Invalid Project ID");

        await ExperienceModel.findByIdAndDelete(entryId)

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};