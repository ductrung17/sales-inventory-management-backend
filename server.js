require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const webRoutes = require('./routes/web');
const app = express();

connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use(webRoutes);

app.listen(5000, () => {
    console.log("")
})