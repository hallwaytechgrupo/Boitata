import express from "express";
import cors from "cors";
import biomasRouter from "./routes/bioma.routes";
import focoCalorRouter from "./routes/focoCalor.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/focos_calor", focoCalorRouter);
app.use("/biomas", biomasRouter);

export default app;
