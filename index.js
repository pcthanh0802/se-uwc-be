require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');

// middlewares
app.use(morgan('combined'));
app.use(helmet());
app.use(express.json());
app.use(cors({
    origin: true
}));

app.get('/', (req, res) => res.send("Welcome to se-uwc-be of group Children of Stone"));
app.use('/api/auth', routes.auth);
app.use('/api/map', routes.map);
app.use('/api/mcp', routes.mcp);
app.use('/api/vehicle', routes.vehicle);
app.use('/api/maintainLog', routes.log);
app.use('/api/task', routes.task);
app.use('/api/setting', routes.setting);
app.use('/api/message', routes.message);
app.use('/api/employee', routes.employee);

// start up the server
const port = process.env.PORT || 3125;
app.listen(port, () => {
    console.log(`Server is listening to port ${port}...`);
})