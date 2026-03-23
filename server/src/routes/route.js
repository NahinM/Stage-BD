import * as controller from "../controllers/controller.js";
import { app } from "../config/config.js";

import { getHashedPassword } from "../models/signin/signin.js";

app.get('/api/hello', controller.helloController.getHello);
app.post('/api/signin', controller.signInController.signIn);
app.post('/api/signup', controller.signUpController.signUp);


app.get('/api/test', async (req,res) => {
    const hash = await getHashedPassword("NahinM"); 
    res.json({hashed: hash});
})

