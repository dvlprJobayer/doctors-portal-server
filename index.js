const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;

// Make App
const app = express();

// MiddleWare
app.use(cors());
app.use(express.json());

// Separate file router
const doctorRouter = require('./router/doctor');
app.use(doctorRouter);

// Listen App
app.listen(port, () => {
    console.log('Doctors Portal listening on port', port);
});