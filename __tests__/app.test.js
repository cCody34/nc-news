const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const connection = require("../db/connection");

afterAll(() => {
  return connection.end();
});

beforeEach(() => {
  return seed(data);
});

describe("app", () => {
  describe("/api", () => {
    test("200: responds with 200 status and a json object of endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          const { body } = response;
          const endpoints = require("../db/endpoints.json");
          expect(body).toEqual(endpoints);
        });
    });
  });
  describe("/api/topics", () => {
    test("200: responds with a 200 status and a topics array on the response body", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug", expect.any(String));
            expect(topic).toHaveProperty("description", expect.any(String));
          });
        });
    });
  });
  describe("/api/articles", () => {
    describe("/api/articles/:article_id", () => {
      test("200: responds with 200 status and an article object with the correct id", () => {
        return request(app)
          .get("/api/articles/2")
          .then((response) => {
            const { body } = response;
            expect(body).toHaveProperty("author", expect.any(String));
            expect(body).toHaveProperty("title", expect.any(String));
            expect(body).toHaveProperty("article_id", expect.any(Number));
            expect(body).toHaveProperty("body", expect.any(String));
            expect(body).toHaveProperty("topic", expect.any(String));
            expect(body).toHaveProperty("created_at", expect.any(String));
            expect(body).toHaveProperty("votes", expect.any(Number));
            expect(body).toHaveProperty("article_img_url", expect.any(String));
          });
      });
      test("400: responds with 400 status and a message when sent bad request", () => {
        return request(app)
          .get("/api/articles/hello")
          .expect(400)
          .then(({ body }) => {
            expect(body).toHaveProperty("msg", "bad request");
          });
      });
      test("404: responds with 404 status and a message when article_id does not exist", () => {
        return request(app)
          .get("/api/articles/10000")
          .expect(404)
          .then(({ body }) => {
            expect(body).toHaveProperty(
              "msg",
              "article with this article_id not found"
            );
          });
      });
    });
  });
});
