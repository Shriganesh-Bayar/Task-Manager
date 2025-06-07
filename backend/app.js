const express = require("express");
const app = express();
require("dotenv").config();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    credentials: true
}));

// routers
const UserRouter = require('./routes/UserRoutes');
const TaskRouter = require('./routes/TaskRoutes');

// endpoint handling
app.get('/', (req, res) => { 
    console.log("In the server...");
    res.json({ message: "In the server..." })
}); // checking the server is running

app.use('/user', UserRouter);
app.use('/task', TaskRouter);

// error handling
app.use((err, req, res, next) => {
    console.error(err.message);
    res.send({ status: 500, error: (err.message) ? err.message : "Something broke" });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running in port ${process.env.PORT}....`);
});