const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); // CORS 설정 추가

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const DataSchema = new mongoose.Schema({
    key: String,
    value: String,
});

const Data = mongoose.model('Data', DataSchema);

// 데이터 저장
app.post('/store', async (req, res) => {
    const { key, value } = req.body;
    await Data.findOneAndUpdate({ key }, { value }, { upsert: true });
    res.send({ status: 'success' });
});

// 데이터 조회
app.get('/retrieve', async (req, res) => {
    const { key } = req.query;
    const data = await Data.findOne({ key });
    res.send({ value: data ? data.value : 'No data found' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
