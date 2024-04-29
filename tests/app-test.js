const request = require("supertest");
const app = require("../app");
const expect = require("chai").expect;

describe("GET /memes", () => {
  const expectedOutput = [
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

  it("responds with the array of all memes", (done) => {
    request(app)
      .get("/memes")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an("array");
        expect(res.body).to.deep.equal(expectedOutput);
        done();
      });
  });
});

describe("GET /meme/:id", () => {
  it("responds with single matching meme", (done) => {
    const expectedOutput = {
      name: "Money meme",
      imgSource:
        "https://cdn.vox-cdn.com/thumbor/cV8X8BZ-aGs8pv3D-sCMr5fQZyI=/1400x1400/filters:format(png)/cdn.vox-cdn.com/uploads/chorus_asset/file/19933026/image.png",
      genre: ["comedy", "dark", "witty"],
      id: "0",
    };
    request(app)
      .get("/meme/0")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an("object");
        expect(res.body).to.deep.equal(expectedOutput);
        done();
      });
  });

  it("responds with error message when meme not found", (done) => {
    const expectedOutput = "meme not found";
    request(app)
      .get("/meme/100")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(422, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.equal(expectedOutput);
        done();
      });
  });
});

describe("GET /memes/filter", () => {
  it("responds with filtered memes by genre = comedy", (done) => {
    const genre = "comedy";
    const expectedOutput = [
      {
        name: "Money meme",
        imgSource:
          "https://cdn.vox-cdn.com/thumbor/cV8X8BZ-aGs8pv3D-sCMr5fQZyI=/1400x1400/filters:format(png)/cdn.vox-cdn.com/uploads/chorus_asset/file/19933026/image.png",
        genre: ["comedy", "dark", "witty"],
        id: "0",
      },
      {
        name: "Javascript meme",
        imgSource:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvryRQ8Ot0OUHU1FEVbV2UHiCI5CQ3Hbm8cw&usqp=CAU",
        genre: ["comedy", "dark", "witty"],
        id: "2",
      },
    ];
    request(app)
      .get("/memes/filter?genre=" + genre)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an("array");
        expect(res.body).to.deep.equal(expectedOutput);
        done();
      });
  });

  it("responds with empty array for non-matching genre", (done) => {
    const genre = "random";
    const expectedOutput = [];
    request(app)
      .get("/memes/filter?genre=" + genre)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an("array");
        expect(res.body).to.deep.equal(expectedOutput);
        done();
      });
  });

  it("responds with error message when invalid parameter is passed", (done) => {
    const genre = "";
    const expectedOutput = "invalid query parameter";
    request(app)
      .get("/memes/filter?genre=" + genre)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.equal(expectedOutput);
        done();
      });
  });

  it("responds with error message when query parameter is not passed", (done) => {
    const expectedOutput = "invalid query parameter";
    request(app)
      .get("/memes/filter")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.equal(expectedOutput);
        done();
      });
  });
});

describe("POST /memes", () => {
  it("responds with 201 Created for valid request body", (done) => {
    const meme = {
      name: "New meme",
      imgSource: "Lorem ipsum lorem ipsum",
      genre: ["blog", "lifestyle"],
    };
    const expectedOutput = {
      name: "New meme",
      imgSource: "Lorem ipsum lorem ipsum",
      genre: ["blog", "lifestyle"],
      id: "3",
    };

    request(app)
      .post("/memes")
      .set("Content-Type", "application/json")
      .expect("Content-Type", /json/)
      .send(meme)
      .expect(201, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an("object");
        expect(res.body).to.deep.equal(expectedOutput);
        done();
      });
  });

  it("responds with error message for invalid request body", (done) => {
    const meme = {
      imgSource: "Lorem ipsum lorem ipsum",
      genre: ["blog", "lifestyle"],
    };
    const expectedOutput = "cannot create meme due to missing details";

    request(app)
      .post("/memes")
      .set("Content-Type", "application/json")
      .expect("Content-Type", /json/)
      .send(meme)
      .expect(400, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.equal(expectedOutput);
        done();
      });
  });
});

describe("PUT /meme/:id", () => {
  const newMeme = {
    name: "New name",
    imgSource:
      "https://cdn.vox-cdn.com/thumbor/cV8X8BZ-aGs8pv3D-sCMr5fQZyI=/1400x1400/filters:format(png)/cdn.vox-cdn.com/uploads/chorus_asset/file/19933026/image.png",
    genre: ["comedy", "dark", "witty"],
  };
  it("responds with updated meme for valid ID and request body", (done) => {
    request(app)
      .put("/meme/0")
      .expect("Content-Type", /json/)
      .send(newMeme)
      .expect(200, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an("object");
        expect(res.body.name).to.be.a("string");
        expect(res.body.name).to.equal("New name");
        done();
      });
  });

  it("responds with error message when meme not found", (done) => {
    const expectedOutput = "meme not found";
    request(app)
      .put("/meme/100")
      .expect("Content-Type", /json/)
      .send(newMeme)
      .expect(422, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.equal(expectedOutput);
        done();
      });
  });
});

describe("DELETE /meme/:id", () => {
  it("deletes meme with matching ID", (done) => {
    const id = "2";

    request(app)
      .delete("/meme/" + id)
      .expect("Content-Type", /json/)
      .expect(200, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an("array");
        res.body.forEach((meme) => {
          expect(meme.id).to.not.equal(id);
        });
        done();
      });
  });

  it("responds with error message when meme not found", (done) => {
    const expectedOutput = "meme not found";
    request(app)
      .delete("/meme/100")
      .expect("Content-Type", /json/)
      .expect(422, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.equal(expectedOutput);
        done();
      });
  });
});
