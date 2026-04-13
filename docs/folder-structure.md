## Folder structure of this project
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