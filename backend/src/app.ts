import express, { NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan";
import apiResponse from "./util/apiResponse";
import session from "express-session";
import MongoStore from "connect-mongo";
import env from "./util/validateEnv";
import adminRouter from "./routes/adminRoutes";
import projectsRouter from "./routes/projectsRoutes";
import projectsAdminRouter from "./routes/projectAdminRoutes";
import experienceEntryRouter from "./routes/experienceEntriesRoutes";
import experienceEntryAdminRouter from "./routes/experienceEntriesAdminRoutes";
import { requireAuth } from "./middleware/auth";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.DB_CONNECTION_STRING
    }),
}));

app.use("/api/admin", adminRouter);

app.use("/api/projects", projectsRouter);

app.use("/api/admin/projects", requireAuth, projectsAdminRouter);

app.use("/api/experience", experienceEntryRouter);

app.use("/api/admin/experience", requireAuth, experienceEntryAdminRouter);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occurred!";
    let statusCode = 500;
    switch (true) {
        case isHttpError(error):
            statusCode = error.status;
            errorMessage = error.message;
            break;
    }

    res.status(statusCode).json(apiResponse({ success: false, message: errorMessage }));
});

export default app;