import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import config from "./app/config";
import cookieParser from "cookie-parser";
import { AppDataSource } from "./app/db/dataSource";
import router from "./app/routes";
import notFoundHandler from "./app/middlewares/notFoundHandler";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { logger } from "./app/utils/logger";


const app = express();


// middlewares
app.use(cookieParser());

app.use(
    bodyParser.urlencoded({ 
        limit: (config.MAX_REQUEST_SIZE as string | number) || '100kb', 
        extended: true 
    })
);

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

// app.listen(process.env.PORT, () => {
//     console.log(`Server is running on port ${config.port}`);
// });

AppDataSource.initialize()
  .then(async () => {
    app.listen(config.port, () => {
      logger.info(`Listening at port number ${config.port}`);
      logger.info(`Database connection established successfully at ${config.db_databse_development}`);
    }); 
  })
  .catch((error) => {
    logger.error("Database connection error", error);
  });


export default app;