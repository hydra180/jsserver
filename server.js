import express from "express";
const app = express();

app.use(express.text({ type: "*/*" }));

let latestMessage = null;
let messageTimestamp = null;

app.get("/", (req, res) => {
    res.status(200).type("text/plain").send(
        "Message server is running. Use POST /send to store a message and GET /get to retrieve it (message clears after retrieval)."
    );
});

app.post("/send", (req, res) => {
    latestMessage = req.body;
    messageTimestamp = Date.now();

    console.log("--- Message Received ---");
    console.log(latestMessage);
    console.log("------------------------");

    res.status(200).send("Message received and stored temporarily. Try GET /get now.");
});

app.get("/get", (req, res) => {
    // If there's a message, send it and then delete it
    if (latestMessage !== null) {
        const messageToSend = latestMessage;
        latestMessage = null;
        messageTimestamp = null;

        console.log("Message retrieved and cleared:", messageToSend);
        res.type("text/plain").send(messageToSend);
    } else {
        res.type("text/plain").send("");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
