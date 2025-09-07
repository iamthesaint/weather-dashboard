import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
const PORT = process.env.PORT || 3001;
import routes from './routes/index.js';

// express.static() is a built-in express middleware function that serves static files

app.use(express.static('../client/dist'));

// express.json() and urlencoded() are 'middleware' in express - they parse requests and recognize the incoming object as a json object
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use() runs a function on every request that matches the path
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
