const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

function helloHandler(req, res) {
  res.send({ message: 'Hello, World!' });
}

app.get('/api/hello', helloHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});