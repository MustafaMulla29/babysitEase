const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connnectDB = require("./config/db");
const cors = require('cors')
const path = require("path")

// dotenv config
dotenv.config();

//mongodb connection
connnectDB();

//rest object
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:5173']
}))
app.use(morgan("dev"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Handle file upload
// app.use('/api/v1/upload', upload.single('image'), require("./routes/uploadRoutes"))
// routes
app.use('/api/v1/user', require('./routes/userRoutes'))
app.use('/api/v1/admin', require('./routes/adminRoutes'))
app.use('/api/v1/caregiver', require('./routes/caregiverRoutes'))

//port
const port = process.env.PORT || 8070;

//listen port
app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_MODE} mode on port ${process.env.PORT}`
  );
});
