const express = require("express");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true })); // extended: true để hỗ trợ parsing các object và mảng phức tạp
app.use(cookieParser());

routes(app);

mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1); // Thoát khỏi ứng dụng nếu không kết nối được MongoDB
    });

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});