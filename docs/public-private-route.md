# Public Private Route

In client side-

- for public routes [ import api from "@/authentication/public-api" ]
- for private routes [ import _api from "@/authentication/private-api" ]

Note: notice the \_ here { api, \_api }, this underscore is used to indicate if the route is private or not.

In server side-

- for access token decode use the [ import { authorize } from "../../middlewares/authentication/auth.js"; ]
- usage [ const authResult = await authorize(req.headers); ]
- authorize(req.headers) returns the object -
  { id:string, username: string, roles: string[] } which should be used to validate user roles and database query.
