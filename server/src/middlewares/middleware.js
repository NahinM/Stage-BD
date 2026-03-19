import {
    app,
    cors,
    express,
    sesstion,
    sessionSecret
} from "../config/config.js";

app.use(sesstion({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(cors());
app.use(express.json());