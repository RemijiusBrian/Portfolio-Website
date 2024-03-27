import { RequestHandler } from "express";
import ProjectModel from "../models/project";
import apiResponse from "../util/apiResponse";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import { PaginationParams } from "../util/paginationParams";

export const getProjects: RequestHandler<unknown, unknown, unknown, PaginationParams> = async (req, res, next) => {
    try {
        const page = req.query.page ?? 0;
        const pageSize = req.query.pageSize ?? 10;

        const projects = await ProjectModel.find().skip(page * pageSize).limit(pageSize).exec();

        res.status(200).json(
            apiResponse({
                message: "Projects retrieved.",
                data: {
                    "page": page,
                    "pageSize": pageSize,
                    "projects": projects
                }
            })
        );
    } catch (error) {
        next(error);
    }
};

interface ProjectIdParam {
    projectId: string
}

export const getProjectById: RequestHandler<ProjectIdParam, unknown, unknown, unknown> = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        if (!mongoose.isValidObjectId(projectId)) throw createHttpError(400, "Invalid project ID");

        const project = await ProjectModel.findById(projectId).exec();
        if (!project) throw createHttpError(404, "Project not found");

        res.status(200).json(apiResponse({ message: "Project Retrieved", data: project }));
    } catch (error) {
        next(error);
    }
};

interface AddProjectBody {
    title?: string,
    description?: string,
    sourceUrl?: string,
    deployedUrl?: string
}

export const createProject: RequestHandler<unknown, unknown, AddProjectBody, unknown> = async (req, res, next) => {
    try {
        const title = req.body.title;
        if (!title) throw createHttpError(400, "Title cannot be empty!");

        const description = req.body.description;
        const sourceCodeUrl = req.body.sourceUrl;
        const deployedUrl = req.body.deployedUrl;

        const newProject = await ProjectModel.create({
            title: title,
            description: description,
            sourceCodeUrl: sourceCodeUrl,
            deployedUrl: deployedUrl
        });

        res.status(200).json(apiResponse({ message: "Project added successfully.", data: newProject }));
    } catch (error) {
        next(error);
    }
};

interface UpdateProjectBody {
    title?: string,
    description?: string,
    sourceUrl?: string,
    deployedUrl?: string
}

export const updateProject: RequestHandler<ProjectIdParam, unknown, UpdateProjectBody, unknown> = async (req, res, next) => {
    const projectId = req.params.projectId;
    try {
        if (!mongoose.isValidObjectId(projectId)) throw createHttpError(400, "Invalid project ID");

        const title = req.body.title;
        if (!title) throw createHttpError(400, "Title cannot be empty!");

        const description = req.body.description;
        const sourceCodeUrl = req.body.sourceUrl;
        const deployedUrl = req.body.deployedUrl;

        const project = await ProjectModel.findById(projectId).exec();
        if (!project) throw createHttpError(404, "Project not found");

        project.title = title;
        project.description = description;
        project.sourceCodeUrl = sourceCodeUrl;
        project.deployedUrl = deployedUrl;

        const updatedProject = project.save();

        res.status(200).json(apiResponse({ message: "Project updated successfully.", data: updateProject }));
    } catch (error) {
        next(error);
    }
};

export const deleteProjectById: RequestHandler<ProjectIdParam, unknown, unknown, unknown> = async (req, res, next) => {
    const projectId = req.params.projectId;
    // const authenticatedUserId = req.session.userId;

    try {
        // assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(projectId)) throw createHttpError(400, "Invalid Project ID");

        await ProjectModel.findByIdAndDelete(projectId)

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};