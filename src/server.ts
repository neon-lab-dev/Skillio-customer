import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import config from "./app/config";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import notFoundHandler from "./app/middlewares/notFoundHandler";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { requestContextMiddleware } from "@neon-lab-dev/platform";

const app = express();


// middlewares
app.use(cookieParser());

app.use(
    bodyParser.urlencoded({ 
        limit: (config.MAX_REQUEST_SIZE as string | number) || '100kb', 
        extended: true 
    })
);

app.use(requestContextMiddleware);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
 next();
});


app.use(cors({ origin: ["http://localhost:5173" ,"http://127.0.0.1:5500"], credentials: true }));


app.use(express.json());


// api route
app.get("/", (req, res) => {
    res.send("Welcome to admin API");
  });

app.use("/api", router);

app.use(notFoundHandler);

app.use(globalErrorHandler)

export default app;