import { cleanEnv, port, str, url } from "envalid";

export default cleanEnv(process.env, {
    PORT: port(),
    DB_CONNECTION_STRING: url(),

    SESSION_SECRET: str()
});