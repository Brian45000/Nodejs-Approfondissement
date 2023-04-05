const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.model");
const articlesService = require("../api/articles/articles.service");
const User = require("../api/users/users.model");

describe("tester API articles", () => {
  let token;
  const ARTICLE_ID = "fake";
  const USER_ID = "fake2"
  const MOCK_DATA = [
    {
      _id: ARTICLE_ID,
      title: "title",
      content: "this is my content",
      user: USER_ID,
      state: "published",
    },
  ];
  const MOCK_DATA_CREATED = {
    title: "title 2",
    content: "this is my content 2",
    user: USER_ID,
    state: "draft",
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    // mongoose.Query.prototype.find = jest.fn().mockResolvedValue(MOCK_DATA);
    mockingoose(Article).toReturn(MOCK_DATA, "find");
    mockingoose(Article).toReturn(MOCK_DATA_CREATED, "save");
  });

  test("[Articles] Create Article", async () => {
    mockingoose(Article).toReturn(MOCK_DATA_CREATED, "save");
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
  });

  test("[Articles] Update Article", async () => {
    mockingoose(Article).toReturn(MOCK_DATA_CREATED, "save");
    const res = await request(app)
        .put("/api/articles/"+ ARTICLE_ID)
        .send(MOCK_DATA_CREATED)
        .set("x-access-token", token);
    expect(res.status).toBe(200);
  });

  test("[Articles] Delete Article", async () => {
    mockingoose(Article).toReturn({}, "save");
    const res = await request(app)
        .delete("/api/articles/"+ ARTICLE_ID)
        .set("x-access-token", token);
    expect(res.status).toBe(204);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
