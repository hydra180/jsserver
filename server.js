import express from "express";

const app = express();
app.use(express.text({ type: "*/*" }));

let latestMessage = null;
let messageTimestamp = null;
const EXPIRATION_MS = 20000; // 20 seconds

app.get("/", (req, res) => {
    res.status(200).type("text/plain").send(
        "Message Server is running.\n" +
        "• POST /send to store a message\n" +
        "• GET /get to retrieve it (auto-deletes after 20 seconds if unclaimed)"
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
    // Check if message exists
    if (latestMessage !== null) {
        // Check if expired
        if (Date.now() - messageTimestamp > EXPIRATION_MS) {
            console.log("Message expired after 20 seconds, deleting...");
            latestMessage = null;
            messageTimestamp = null;
            res.type("text/plain").send("");
            return;
        }

        // Send and clear the message
        const messageToSend = latestMessage;
        latestMessage = null;
        messageTimestamp = null;
        console.log("Message retrieved and cleared:", messageToSend);
        res.type("text/plain").send(messageToSend);
    } else {
        res.type("text/plain").send("");
    }
});

// Periodic cleanup in case /get is never called
setInterval(() => {
    if (latestMessage && Date.now() - messageTimestamp > EXPIRATION_MS) {
        console.log("Auto-deleting unclaimed message after 20 seconds...");
        latestMessage = null;
        messageTimestamp = null;
    }
}, 1000); // Check every second

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
