import express from "express";

const app = express();

app.use(express.text({ type: '*/*' }));

let latestMessage = null;
let messageTimestamp = null;

app.post("/send", (req, res) => {
    latestMessage = req.body;
    messageTimestamp = Date.now();

    console.log("--- Message Received ---");
    console.log(latestMessage);
    console.log("------------------------");

    res.status(200).send("Message received and stored temporarily.");
});

app.get("/get", (req, res) => {
    const TIMEOUT_MS = 1000;
    if (messageTimestamp && Date.now() - messageTimestamp > TIMEOUT_MS) {
        console.log(`Message timed out after ${TIMEOUT_MS}ms.`);
        latestMessage = null;
        messageTimestamp = null;
    }

    res.type('text/plain').send(latestMessage || "");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
