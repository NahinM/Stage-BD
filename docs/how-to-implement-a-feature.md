### Overall
The folder Structure should follow mvc architecture.
In mvc we have -
- Model (manage all the codes for database)
- Controller (manage all the codes for connecting view and Model)
- View (manage all the codes for frontend app)

#### To start a feature 
- For model a separate folder must be created & the folder name must be the name of the feature
- For controller a separate folder must be created & the folder name must be the name of the feature
- For view there is a separate folder Structure as it will be a single page frontend app.

```
StageBD/
├── client/               # The "VIEW" layer
│   ├── src/
│   │   ├── assets/       # Images, global styles
│   │   ├── components/   # Reusable UI components (Buttons, Cards)
│   │   ├── pages/        # Page-level components (Home, Dashboard)
│   │   ├── services/     # API call functions (e.g., fetching from Express)
│   │   ├── types/        # Frontend TypeScript interfaces
│   │   ├── App.tsx       # Main React component
│   │   └── main.tsx      # React DOM entry point
│   ├── package.json
│   └── vite.config.ts
│
└── server/               # The "MODEL" & "CONTROLLER" layers
    ├── src/
    │   ├── config/       # Database connection, environment setups
    │   ├── controllers/  # Handle incoming HTTP requests and responses
    │   ├── middlewares/  # Custom Express middlewares (Auth, Error handling)
    │   ├── models/       # Database interactions / SQL queries
    │   ├── routes/       # Map URL endpoints to Controllers
    │   └── index.ts      # Express application entry point
    ├── .env              # Environment variables (DB credentials)
    ├── package.json
    └── tsconfig.json
```
### client (view unit)
Here every feature is implemented under a single folder. no need to jump around the project to find the codes for this specific feature

| Path                        | What to do                                           |
| --------------------------- | ---------------------------------------------------- |
| pages/feat_0/               | working folder                                       |
| pages/feat_0/api.ts         | all backend api calls goes here                      |
| pages/feat_0/tsx_file.tsx   | the page we need to implement                        |
| pages/feat_0/component1.tsx | if any extra component needed for this specific page |

### server (model unit + controller unit)
Here to get a more maintainable codebase a separate import file is created which will be imported as a whole.

Example:
let's implement a feature called "feat_0"
first create folders:

| Path                           | What to do                         |
| ------------------------------ | ---------------------------------- |
| server/src/controllers/feat_0/ | all the controller codes goes here |
| server/src/models/feat_0/      | all the database codes goes here   |
| routes/                        | add the path to use the controller |
