const express = require('express');
const natural = require('natural');
const classifier = new natural.BayesClassifier();
var cors = require('cors');
const fs = require('fs');
const app = express();

const port = 3000;
// classifier.addDocument('What is the capital of India?', 'Geography');
// classifier.addDocument('Who is the president of the United States?', 'Politics');
// classifier.addDocument('What is the boiling point of water?', 'Science');

fs.readFile('train.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const lines = data.split('\n');
    lines.forEach((line) => {
        const parts = line.split('", "');
        if(!parts || parts.length < 2) return;
        const sentence = parts[0].slice(1);
        classifier.addDocument(sentence, parts[1].slice(0,-1));
    });
    classifier.train();
    console.log("Classifier is Trained");
});

app.use(cors());

app.get('/gk', (req, res) => {
    const question = req.query.question;
    const answer = classifier.classify(question);
    res.send(answer);
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
