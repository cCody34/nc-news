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
            expect(body).toHaveProperty("author", "icellusedkars");
            expect(body).toHaveProperty("title", "Sony Vaio; or, The Laptop");
            expect(body).toHaveProperty("article_id", 2);
            expect(body).toHaveProperty(
              "body",
              "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me."
            );
            expect(body).toHaveProperty("topic", "mitch");
            expect(body).toHaveProperty(
              "created_at",
              "2020-10-16T05:03:00.000Z"
            );
            expect(body).toHaveProperty("votes");
            expect(body).toHaveProperty(
              "article_img_url",
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            );
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
