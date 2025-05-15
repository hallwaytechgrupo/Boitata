import express from "express";
import cors from "cors";
import biomasRouter from "./routes/bioma.routes";
import focoCalorRouter from "./routes/focoCalor.routes";
import areaQueimadaRouter from "./routes/areaQueimada.routes";
import riscoRouter from "./routes/risco.routes";
import areaRoutes from "./routes/area.routes";

const app = express(); // <-- Declare o app primeiro!

app.use(cors());
app.use(express.json());

app.use("/focos_calor", focoCalorRouter);
app.use("/biomas", biomasRouter);
app.use("/area_queimada", areaQueimadaRouter);
app.use("/risco", riscoRouter);
app.use("/area", areaRoutes);
app.use('/api/area', areaRoutes); // Se quiser esse prefixo também

export default app;