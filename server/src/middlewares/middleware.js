import { app, cors, express } from "../config/config.js";
app.use(cors());
app.use(express.json());