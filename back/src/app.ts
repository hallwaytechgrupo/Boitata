import express from "express";
import cors from "cors";
import biomasRouter from "./routes/bioma.routes";
import focoCalorRouter from "./routes/focoCalor.routes";
import areaQueimadaRouter from "./routes/areaQueimada.routes";
import riscoRouter from "./routes/risco.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/focos_calor", focoCalorRouter);
app.use("/biomas", biomasRouter);
app.use("/area_queimada", areaQueimadaRouter);
app.use("/risco", riscoRouter);

export default app;
