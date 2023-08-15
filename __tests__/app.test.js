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
    test("200: responds with a 200 status and an articles array on the response body", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(13);
          articles.forEach((article) => {
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("article_id", expect.any(Number));
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty(
              "article_img_url",
              expect.any(String)
            );
            expect(article).not.toHaveProperty("body");
            expect(article).toHaveProperty("comment_count", expect.any(Number));
          });
        });
    });
    test("200: articles are returned in descending order of date", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    describe("/api/articles/:article_id", () => {
      describe("GET /api/articles/:article_id", () => {
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
              expect(body).toHaveProperty(
                "article_img_url",
                expect.any(String)
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
      describe("PATCH /api/articles/:article_id", () => {
        test("201: responds with the updated article", () => {
          return request(app)
            .patch("/api/articles/2")
            .send({ inc_votes: 20 })
            .expect(201)
            .then(({ body }) => {
              expect(body).toHaveProperty("article_id", 2);
              expect(body).toHaveProperty("title", expect.any(String));
              expect(body).toHaveProperty("topic", expect.any(String));
              expect(body).toHaveProperty("author", expect.any(String));
              expect(body).toHaveProperty("body", expect.any(String));
              expect(body).toHaveProperty("created_at", expect.any(String));
              expect(body).toHaveProperty("votes", 20);
              expect(body).toHaveProperty(
                "article_img_url",
                expect.any(String)
              );
            });
        });
      });
    });
    describe("/api/articles/:article_id/comments", () => {
      test("200: responds with 200 status and an array of comments for the given article_id", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;
            expect(comments).toHaveLength(11);
            comments.forEach((comment) => {
              expect(comment).toHaveProperty("comment_id", expect.any(Number));
              expect(comment).toHaveProperty("votes", expect.any(Number));
              expect(comment).toHaveProperty("created_at", expect.any(String));
              expect(comment).toHaveProperty("author", expect.any(String));
              expect(comment).toHaveProperty("body", expect.any(String));
              expect(comment).toHaveProperty("article_id", expect.any(Number));
            });
          });
      });
      test("200: comments are returned in descending order of date created", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;
            expect(comments).toBeSortedBy("created_at", { descending: true });
          });
      });
      test("200: responds with an empty array if the article exists but there are no comments", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;
            expect(comments).toEqual([]);
          });
      });
      test("400: responds with bad request when passed invalid article_id", () => {
        return request(app)
          .get("/api/articles/hello/comments")
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("bad request");
          });
      });
      test("404: responds with not found if the article does not exist", () => {
        return request(app)
          .get("/api/articles/1000/comments")
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("not found");
          });
      });
    });
  });
  describe("ALL /notapath", () => {
    test("404: should respond with a custom 404 message when the path is not found", () => {
      return request(app)
        .get("/api/hello")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("not found");
        });
    });
  });
});
