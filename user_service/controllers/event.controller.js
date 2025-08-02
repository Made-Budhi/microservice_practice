const axios = require('axios');

exports.event = async (req, res) => {
    try {
        const events = req.body

        await axios.post("http://localhost:4005/events");

        console.log("User Created", events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}