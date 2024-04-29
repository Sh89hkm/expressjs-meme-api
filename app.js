const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// NOTE: Please don't make any changes to this array
const memes = [
  {
    name: "Money meme",
    imgSource:
      "https://cdn.vox-cdn.com/thumbor/cV8X8BZ-aGs8pv3D-sCMr5fQZyI=/1400x1400/filters:format(png)/cdn.vox-cdn.com/uploads/chorus_asset/file/19933026/image.png",
    genre: ["comedy", "dark", "witty"],
    id: "0",
  },
  {
    name: "Coding meme",
    imgSource:
      "https://pics.esmemes.com/my-code-doesnt-work-i-have-no-idea-why-my-21449922.png",
    genre: ["dark", "witty"],
    id: "1",
  },
  {
    name: "Javascript meme",
    imgSource:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvryRQ8Ot0OUHU1FEVbV2UHiCI5CQ3Hbm8cw&usqp=CAU",
    genre: ["comedy", "dark", "witty"],
    id: "2",
  },
];

app.get("/memes", (req, res) => {
  // Return all memes in the response with status code 200
  res.status(200).json(memes);
});

// Define the endpoint to return a single meme by ID
app.get("/meme/:id", (req, res) => {
  // Extract the meme ID from the request parameters
  const memeId = req.params.id;
  // Find the meme with the corresponding ID
  const meme = memes.find(meme => meme.id === memeId);
  // If meme is not found, respond with status code 422 and error message
  if (!meme) {
    return res.status(422).json("meme not found");
  }
  // If meme is found, respond with status code 200 and the meme object
  res.status(200).json(meme);
});

// Define the endpoint to filter memes by genre
app.get("/memes/filter", (req, res) => {
  // Extract the genre query parameter value from the request query
  const genre = req.query.genre;
  // If genre parameter is not provided, respond with status code 400 and error message
  if (!genre) {
    return res.status(400).json("invalid query parameter");
  }
  // Filter memes based on the provided genre
  const filteredMemes = memes.filter(meme => meme.genre.includes(genre));
  // Respond with status code 200 and the filtered list of memes
  res.status(200).json(filteredMemes);
});

app.post("/memes", (req, res) => {
  const { name, imgSource, genre } = req.body;
  // Check if all required data points are present
  if (!name || !imgSource || !genre) {
    return res.status(400).json("cannot create meme due to missing details");
  }
  // Generate a new ID for the meme
  const newId = memes.length;
  const newMeme = { name, imgSource, genre, id: newId.toString() };
  // Push the new meme to the array of memes
  memes.push(newMeme);
  // Respond with status code 201 and the newly created meme object
  res.status(201).json(newMeme);
});

app.put("/meme/:id", (req, res) => {
  const memeId = req.params.id;
  const { name, imgSource, genre } = req.body;
  // Find the meme in the array of memes based on the provided ID
  const memeIndex = memes.findIndex(meme => meme.id === memeId);
  // If meme is not found, respond with status code 422 and error message
  if (memeIndex === -1) {
    return res.status(422).json("meme not found");
  }
  // Update the meme's properties with the new values provided in the request body
  if (name) memes[memeIndex].name = name;
  if (imgSource) memes[memeIndex].imgSource = imgSource;
  if (genre) memes[memeIndex].genre = genre;
  // Respond with status code 200 and the updated meme object
  res.status(200).json(memes[memeIndex]);
});

app.delete("/meme/:id", (req, res) => {
  const memeId = req.params.id;
  const memeIndex = memes.findIndex(meme => meme.id === memeId);
  if (memeIndex === -1) {
    return res.status(422).json("meme not found");
  }
  memes.splice(memeIndex, 1);
  res.status(200).json(memes);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}/`);
});

module.exports = app;
