import serverless from "serverless-http";
import { createApp } from "../backend/app";

const app = createApp();

export default serverless(app);
