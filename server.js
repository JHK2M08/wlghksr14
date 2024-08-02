const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); // CORS 설정 추가
app.use(express.static(path.join(__dirname, 'public'))); // 'public' 폴더에서 정적 파일 제공

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// MongoDB 스키마 및 모델 정의
const DataSchema = new mongoose.Schema({
    key: String,
    value: String,
});

const RecordSchema = new mongoose.Schema({
    dateTime: String,
    id: String,
    name: String,
});

const Data = mongoose.model('Data', DataSchema);
const Record = mongoose.model('Record', RecordSchema);

// 데이터 저장
app.post('/store', async (req, res) => {
    const { key, value } = req.body;
    try {
        await Data.findOneAndUpdate({ key }, { value }, { upsert: true });
        res.send({ status: 'success' });
    } catch (error) {
        res.status(500).send(error);
    }
});

// 데이터 조회
app.get('/retrieve', async (req, res) => {
    const { key } = req.query;
    try {
        const data = await Data.findOne({ key });
        res.send({ value: data ? data.value : 'No data found' });
    } catch (error) {
        res.status(500).send(error);
    }
});

// 출석 기록 추가
app.post('/records', async (req, res) => {
    try {
        const newRecord = new Record(req.body);
        await newRecord.save();
        res.status(201).send(newRecord);
    } catch (error) {
        res.status(400).send(error);
    }
});

// 모든 출석 기록 조회
app.get('/records', async (req, res) => {
    try {
        const records = await Record.find().sort({ id: 1 });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).send(error);
    }
});

// 모든 출석 기록 삭제
app.delete('/records', async (req, res) => {
    try {
        await Record.deleteMany({});
        res.status(200).send('All records deleted');
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
