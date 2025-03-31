const express = require("express");
const ytdl = require("ytdl-core");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/download", async (req, res) => {
    const url = req.query.url;
    const format = req.query.format;

    if (!ytdl.validateURL(url)) {
        return res.status(400).send("Invalid YouTube URL");
    }

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, "_");

    res.header("Content-Disposition", `attachment; filename="${title}.${format}"`);

    if (format === "mp4") {
        ytdl(url, { format: "mp4" }).pipe(res);
    } else if (format === "mp3") {
        ytdl(url, { filter: "audioonly", format: "mp3" }).pipe(res);
    } else {
        res.status(400).send("Invalid format");
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
