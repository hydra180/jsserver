import express from "express";

const app = express();

// Use express.text() to parse incoming request bodies as raw text (type: '*/*')
app.use(express.text({ type: '*/*' }));

let latestMessage = null;
let messageTimestamp = null;

// --- 1. Added GET / route to fix "Cannot GET /" error ---
app.get("/", (req, res) => {
    // This tells users the server is alive and what endpoints are available.
    res.status(200).type('text/plain').send(
        "Temporary Message Server is running. Use POST /send to store a message and GET /get to retrieve it (messages expire after 1 second)."
    );
});

// POST /send: Stores the incoming text body temporarily.
app.post("/send", (req, res) => {
    latestMessage = req.body;
    messageTimestamp = Date.now();

    // These logs will only appear in your Render deployment's log console.
    console.log("--- Message Received ---");
    console.log(latestMessage);
    console.log("------------------------");

    // The client always receives this confirmation.
    res.status(200).send("Message received and stored temporarily. Try GET /get now.");
});

// GET /get: Retrieves the latest message, or an empty string if it has expired.
app.get("/get", (req, res) => {
    const TIMEOUT_MS = 1000;
    
    // Check if the message has timed out (1 second)
    if (messageTimestamp && Date.now() - messageTimestamp > TIMEOUT_MS) {
        // Clear message if expired
        if (latestMessage !== null) {
             console.log(`Message timed out after ${TIMEOUT_MS}ms. Message cleared.`);
        }
        latestMessage = null;
        messageTimestamp = null;
    }

    // Send the latest message (will be "" if null/expired)
    res.type('text/plain').send(latestMessage || "");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



