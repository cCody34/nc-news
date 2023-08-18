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
    describe("GET request /api/articles", () => {
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
              expect(article).toHaveProperty(
                "comment_count",
                expect.any(Number)
              );
            });
          });
      });
      describe("/api/articles queries", () => {
        describe("/api/articles?topic", () => {
          test("200: articles takes a topic query, which filters articles by topic", () => {
            return request(app)
              .get("/api/articles?topic=cats")
              .expect(200)
              .then(({ body }) => {
                const { articles } = body;
                expect(articles).toHaveLength(1);
                articles.forEach((article) => {
                  expect(article.topic).toBe("cats");
                  expect(article).toHaveProperty("author", expect.any(String));
                  expect(article).toHaveProperty("title", expect.any(String));
                  expect(article).toHaveProperty(
                    "article_id",
                    expect.any(Number)
                  );
                  expect(article).toHaveProperty(
                    "created_at",
                    expect.any(String)
                  );
                  expect(article).toHaveProperty("votes", expect.any(Number));
                  expect(article).toHaveProperty(
                    "article_img_url",
                    expect.any(String)
                  );
                  expect(article).not.toHaveProperty("body");
                  expect(article).toHaveProperty(
                    "comment_count",
                    expect.any(Number)
                  );
                });
              });
          });
          test("200: responds with an empty array when passed an existing topic with no articles", () => {
            return request(app)
              .get("/api/articles?topic=paper")
              .expect(200)
              .then(({ body }) => {
                const { articles } = body;
                expect(articles).toEqual([]);
              });
          });
          test("404: responds with not found when passed a topic that doesn't exist", () => {
            return request(app)
              .get("/api/articles?topic=chicken")
              .expect(404)
              .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("not found");
              });
          });
        });
        describe("/api/articles?sort_by", () => {
          test("200: articles are returned in descending order of date by default", () => {
            return request(app)
              .get("/api/articles")
              .expect(200)
              .then(({ body }) => {
                const { articles } = body;
                expect(articles).toHaveLength(13);
                expect(articles).toBeSortedBy("created_at", {
                  descending: true,
                });
                articles.forEach((article) => {
                  expect(article).toHaveProperty("author", expect.any(String));
                  expect(article).toHaveProperty("title", expect.any(String));
                  expect(article).toHaveProperty(
                    "article_id",
                    expect.any(Number)
                  );
                  expect(article).toHaveProperty("topic", expect.any(String));
                  expect(article).toHaveProperty(
                    "created_at",
                    expect.any(String)
                  );
                  expect(article).toHaveProperty("votes", expect.any(Number));
                  expect(article).toHaveProperty(
                    "article_img_url",
                    expect.any(String)
                  );
                  expect(article).not.toHaveProperty("body");
                  expect(article).toHaveProperty(
                    "comment_count",
                    expect.any(Number)
                  );
                });
              });
          });
          test("200: articles takes a sort_by query, which can sort by any valid column", () => {
            return request(app)
              .get("/api/articles?sort_by=article_id")
              .expect(200)
              .then(({ body }) => {
                const { articles } = body;
                expect(articles).toHaveLength(13);
                expect(articles).toBeSortedBy("article_id", {
                  descending: true,
                });
                articles.forEach((article) => {
                  expect(article).toHaveProperty("author", expect.any(String));
                  expect(article).toHaveProperty("title", expect.any(String));
                  expect(article).toHaveProperty(
                    "article_id",
                    expect.any(Number)
                  );
                  expect(article).toHaveProperty("topic", expect.any(String));
                  expect(article).toHaveProperty(
                    "created_at",
                    expect.any(String)
                  );
                  expect(article).toHaveProperty("votes", expect.any(Number));
                  expect(article).toHaveProperty(
                    "article_img_url",
                    expect.any(String)
                  );
                  expect(article).not.toHaveProperty("body");
                  expect(article).toHaveProperty(
                    "comment_count",
                    expect.any(Number)
                  );
                });
              });
          });
          test("400: responds with bad request when passed an invalid sort_by query", () => {
            return request(app)
              .get("/api/articles?sort_by=hello")
              .expect(400)
              .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("bad request");
              });
          });
        });
        describe("/api/articles?order", () => {
          test("200: articles takes an order query, which can change the order the articles are sorted by", () => {
            return request(app)
              .get("/api/articles?order=asc")
              .expect(200)
              .then(({ body }) => {
                const { articles } = body;
                expect(articles).toHaveLength(13);
                expect(articles).toBeSortedBy("created_at", {
                  ascending: true,
                });
                articles.forEach((article) => {
                  expect(article).toHaveProperty("author", expect.any(String));
                  expect(article).toHaveProperty("title", expect.any(String));
                  expect(article).toHaveProperty(
                    "article_id",
                    expect.any(Number)
                  );
                  expect(article).toHaveProperty("topic", expect.any(String));
                  expect(article).toHaveProperty(
                    "created_at",
                    expect.any(String)
                  );
                  expect(article).toHaveProperty("votes", expect.any(Number));
                  expect(article).toHaveProperty(
                    "article_img_url",
                    expect.any(String)
                  );
                  expect(article).not.toHaveProperty("body");
                  expect(article).toHaveProperty(
                    "comment_count",
                    expect.any(Number)
                  );
                });
              });
          });
          test("400: responds with bad request when passed an invalid order query", () => {
            return request(app)
              .get("/api/articles?order=hello")
              .expect(400)
              .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("bad request");
              });
          });
        });
        test("200: articles takes topic, sort_by and order queries that work when all used together", () => {
          return request(app)
            .get("/api/articles?topic=mitch&sort_by=title&order=asc")
            .expect(200)
            .then(({ body }) => {
              const { articles } = body;
              expect(articles).toHaveLength(12);
              expect(articles).toBeSortedBy("title", { ascending: true });
              articles.forEach((article) => {
                expect(article.topic).toBe("mitch");
                expect(article).toHaveProperty("author", expect.any(String));
                expect(article).toHaveProperty("title", expect.any(String));
                expect(article).toHaveProperty(
                  "article_id",
                  expect.any(Number)
                );
                expect(article).toHaveProperty(
                  "created_at",
                  expect.any(String)
                );
                expect(article).toHaveProperty("votes", expect.any(Number));
                expect(article).toHaveProperty(
                  "article_img_url",
                  expect.any(String)
                );
                expect(article).not.toHaveProperty("body");
                expect(article).toHaveProperty(
                  "comment_count",
                  expect.any(Number)
                );
              });
            });
        });
        })
    });
    describe("POST request /api/articles", () => {
      test("201: responds with the newly added article", () => {
        return request(app)
          .post("/api/articles")
          .send({
            author: "butter_bridge",
            title: "Buttered Toast",
            body: "Put bread in the toaster then butter it.",
            topic: "cats",
            article_img_url:
              "https://spicedblog.com/wp-content/uploads/2019/01/Toast1.jpg",
          })
          .expect(201)
          .then(({ body }) => {
            expect(body).toHaveProperty("author", "butter_bridge");
            expect(body).toHaveProperty("title", "Buttered Toast");
            expect(body).toHaveProperty(
              "body",
              "Put bread in the toaster then butter it."
            );
            expect(body).toHaveProperty("topic", "cats");
            expect(body).toHaveProperty(
              "article_img_url",
              "https://spicedblog.com/wp-content/uploads/2019/01/Toast1.jpg"
            );
            expect(body).toHaveProperty("article_id", 14);
            expect(body).toHaveProperty("votes", 0);
            expect(body).toHaveProperty("created_at", expect.any(String));
            expect(body).toHaveProperty("comment_count", 0);
          });
      });
      test("201: ignores unnecessary properties in the request body", () => {
        return request(app)
          .post("/api/articles")
          .send({
            author: "butter_bridge",
            title: "Buttered Toast",
            body: "Put bread in the toaster then butter it.",
            topic: "cats",
            article_img_url:
              "https://spicedblog.com/wp-content/uploads/2019/01/Toast1.jpg",
            hello: "goodbye",
          })
          .expect(201)
          .then(({ body }) => {
            expect(body).not.toHaveProperty("hello");
            expect(body).toHaveProperty("author", "butter_bridge");
            expect(body).toHaveProperty("title", "Buttered Toast");
            expect(body).toHaveProperty(
              "body",
              "Put bread in the toaster then butter it."
            );
            expect(body).toHaveProperty("topic", "cats");
            expect(body).toHaveProperty(
              "article_img_url",
              "https://spicedblog.com/wp-content/uploads/2019/01/Toast1.jpg"
            );
            expect(body).toHaveProperty("article_id", 14);
            expect(body).toHaveProperty("votes", 0);
            expect(body).toHaveProperty("created_at", expect.any(String));
            expect(body).toHaveProperty("comment_count", 0);
          });
      });
      test("201: article_img_url will default if not provided", () => {
        return request(app)
          .post("/api/articles")
          .send({
            author: "butter_bridge",
            title: "Buttered Toast",
            body: "Put bread in the toaster then butter it.",
            topic: "cats",
          })
          .expect(201)
          .then(({ body }) => {
            expect(body).toHaveProperty(
              "article_img_url",
              "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
            );
            expect(body).toHaveProperty("author", "butter_bridge");
            expect(body).toHaveProperty("title", "Buttered Toast");
            expect(body).toHaveProperty(
              "body",
              "Put bread in the toaster then butter it."
            );
            expect(body).toHaveProperty("topic", "cats");
            expect(body).toHaveProperty("article_id", 14);
            expect(body).toHaveProperty("votes", 0);
            expect(body).toHaveProperty("created_at", expect.any(String));
            expect(body).toHaveProperty("comment_count", 0);
          });
      });
      test("400: responds with bad request when passed incorrect request body", () => {
        return request(app)
        .post("/api/articles")
        .send({
          hello: "butter_bridge",
          goodbye: "Buttered Toast",
          body: "Put bread in the toaster then butter it.",
          topic: "cats",
          article_img_url:
            "https://spicedblog.com/wp-content/uploads/2019/01/Toast1.jpg",
        })
        .expect(400)
        .then(({ body }) => {
          const {msg} = body;
          expect(msg).toBe("bad request")
        });
      })
      test("404: responds with not found when passed author that doesn't exist", () => {
        return request(app)
        .post("/api/articles")
        .send({
          author: "taylor_swift",
          title: "Buttered Toast",
          body: "Put bread in the toaster then butter it.",
          topic: "cats",
          article_img_url:
            "https://spicedblog.com/wp-content/uploads/2019/01/Toast1.jpg",
        })
        .expect(404)
        .then(({ body }) => {
          const {msg} = body;
          expect(msg).toBe("not found")
        });
      })
      test("404: responds with not found when passed topic that doesn't exist", () => {
        return request(app)
        .post("/api/articles")
        .send({
          author: "butter_bridge",
          title: "Buttered Toast",
          body: "Put bread in the toaster then butter it.",
          topic: "cooking",
          article_img_url:
            "https://spicedblog.com/wp-content/uploads/2019/01/Toast1.jpg",
        })
        .expect(404)
        .then(({ body }) => {
          const {msg} = body;
          expect(msg).toBe("not found")
        });
      })
    });
    describe("/api/articles/:article_id", () => {
      describe("GET /api/articles/:article_id", () => {
        test("200: responds with 200 status and an article object with the correct id", () => {
          return request(app)
            .get("/api/articles/2")
            .expect(200)
            .then((response) => {
              const { body } = response;
              expect(body).toHaveProperty("author", expect.any(String));
              expect(body).toHaveProperty("title", expect.any(String));
              expect(body).toHaveProperty("article_id", 2);
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
        test("200: responds with article object that includes comment count", () => {
          return request(app)
            .get("/api/articles/9")
            .then((response) => {
              const { body } = response;
              expect(body).toHaveProperty("comment_count", 2);
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
        test("200: responds with the updated article", () => {
          return request(app)
            .patch("/api/articles/2")
            .send({ inc_votes: 20 })
            .expect(200)
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
        test("200: decreases articles votes when inc_votes is negative", () => {
          return request(app)
            .patch("/api/articles/2")
            .send({ inc_votes: -20 })
            .expect(200)
            .then(({ body }) => {
              expect(body).toHaveProperty("article_id", 2);
              expect(body).toHaveProperty("title", expect.any(String));
              expect(body).toHaveProperty("topic", expect.any(String));
              expect(body).toHaveProperty("author", expect.any(String));
              expect(body).toHaveProperty("body", expect.any(String));
              expect(body).toHaveProperty("created_at", expect.any(String));
              expect(body).toHaveProperty("votes", -20);
              expect(body).toHaveProperty(
                "article_img_url",
                expect.any(String)
              );
            });
        });
        test("200: ignores unnecessary properties in request body", () => {
          return request(app)
            .patch("/api/articles/3")
            .send({ inc_votes: 20, hello: "goodbye" })
            .expect(200)
            .then(({ body }) => {
              expect(body).not.toHaveProperty("hello");
            });
        });
        test("400: responds with bad request when passed invalid article_id", () => {
          return request(app)
            .patch("/api/articles/hello")
            .send({ inc_votes: 20 })
            .expect(400)
            .then(({ body }) => {
              const { msg } = body;
              expect(msg).toBe("bad request");
            });
        });
        test("400: responds with bad request when sent malformed request body", () => {
          return request(app)
            .patch("/api/articles/3")
            .send({ hello: "goodbye" })
            .expect(400)
            .then(({ body }) => {
              const { msg } = body;
              expect(msg).toBe("bad request");
            });
        });
        test("400: responds with bad request when sent incorrect data type on the request body", () => {
          return request(app)
            .patch("/api/articles/3")
            .send({ inc_votes: "hello" })
            .expect(400)
            .then(({ body }) => {
              const { msg } = body;
              expect(msg).toBe("bad request");
            });
        });
        test("404: responds with not found when article does not exist", () => {
          return request(app)
            .patch("/api/articles/1000")
            .send({ inc_votes: 100 })
            .expect(404)
            .then(({ body }) => {
              const { msg } = body;
              expect(msg).toBe("not found");
            });
        });
      });
    });
    describe("/api/articles/:article_id/comments", () => {
      describe("GET /api/articles/:article_id/comments", () => {
        test("200: responds with 200 status and an array of comments for the given article_id", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              const { comments } = body;
              expect(comments).toHaveLength(11);
              comments.forEach((comment) => {
                expect(comment).toHaveProperty(
                  "comment_id",
                  expect.any(Number)
                );
                expect(comment).toHaveProperty("votes", expect.any(Number));
                expect(comment).toHaveProperty(
                  "created_at",
                  expect.any(String)
                );
                expect(comment).toHaveProperty("author", expect.any(String));
                expect(comment).toHaveProperty("body", expect.any(String));
                expect(comment).toHaveProperty(
                  "article_id",
                  expect.any(Number)
                );
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
      describe("POST /api/articles/:article_id/comments", () => {
        test("201: responds with newly added comment", () => {
          return request(app)
            .post("/api/articles/3/comments")
            .send({
              username: "butter_bridge",
              body: "This is a test comment.",
            })
            .expect(201)
            .then(({ body }) => {
              expect(body).toHaveProperty("comment_id", 19);
              expect(body).toHaveProperty("article_id", 3);
              expect(body).toHaveProperty("author", "butter_bridge");
              expect(body).toHaveProperty("votes", 0);
              expect(body).toHaveProperty("created_at", expect.any(String));
              expect(body).toHaveProperty("body", "This is a test comment.");
            });
        });
        test("201: ignores unnecessary properties in request body", () => {
          return request(app)
            .post("/api/articles/3/comments")
            .send({
              username: "butter_bridge",
              body: "This is a test comment.",
              hello: "goodbye",
            })
            .expect(201)
            .then(({ body }) => {
              expect(body).toHaveProperty("comment_id", 19);
              expect(body).toHaveProperty("article_id", 3);
              expect(body).toHaveProperty("author", "butter_bridge");
              expect(body).toHaveProperty("votes", 0);
              expect(body).toHaveProperty("created_at", expect.any(String));
              expect(body).toHaveProperty("body", "This is a test comment.");
              expect(body).not.toHaveProperty("hello");
            });
        });
        test("404: responds with not found if trying to post to an article that doesn't exist", () => {
          return request(app)
            .post("/api/articles/3000/comments")
            .send({
              username: "butter_bridge",
              body: "This is a test comment.",
            })
            .expect(404)
            .then(({ body }) => {
              const { msg } = body;
              expect(msg).toBe("not found");
            });
        });
        test("404: responds with not found when passed a username that doesn't exist", () => {
          return request(app)
            .post("/api/articles/2/comments")
            .send({
              username: "hello",
              body: "This is a test comment.",
            })
            .expect(404)
            .then(({ body }) => {
              const { msg } = body;
              expect(msg).toBe("not found");
            });
        });
        test("400: responds with bad request when passed invalid article_id", () => {
          return request(app)
            .post("/api/articles/hello/comments")
            .send({
              username: "butter_bridge",
              body: "This is a test comment.",
            })
            .expect(400)
            .then(({ body }) => {
              const { msg } = body;
              expect(msg).toBe("bad request");
            });
        });
        test("400: responds with bad request when passed incorrect request body", () => {
          return request(app)
            .post("/api/articles/3/comments")
            .send({
              hello: "butter_bridge",
              goodbye: "This is a test comment.",
            })
            .expect(400)
            .then(({ body }) => {
              const { msg } = body;
              expect(msg).toBe("bad request");
            });
        });
      });
    });
  });
  describe("/api/comments", () => {
    describe("/api/comments/:comment_id", () => {
      describe("DELETE requests /api/comments/:comment__id", () => {
        test("204: deletes comment and responds with no content on the response body", () => {
          return request(app)
            .delete("/api/comments/5")
            .expect(204)
            .then(({ body }) => {
              expect(body).toEqual({});
            });
        });
        test("404: responds with not found when comment does not exist", () => {
          return request(app)
            .delete("/api/comments/3000")
            .expect(404)
            .then(({ body }) => {
              const { msg } = body;
              expect(msg).toEqual("not found");
            });
        });
        test("400: responds with bad request when passed invalid comment_id", () => {
          return request(app)
            .delete("/api/comments/hello")
            .expect(400)
            .then(({ body }) => {
              const { msg } = body;
              expect(msg).toBe("bad request");
            });
        });
      });
      describe("PATCH requests /api/comments/:comment_id", () => {
        test("200: responds with the updated comment", () => {
          return request(app)
            .patch("/api/comments/4")
            .send({ inc_votes: 200 })
            .expect(200)
            .then(({ body }) => {
              expect(body).toHaveProperty(
                "body",
                " I carry a log — yes. Is it funny to you? It is not to me."
              );
              expect(body).toHaveProperty("votes", 100);
              expect(body).toHaveProperty("author", "icellusedkars");
              expect(body).toHaveProperty("article_id", 1);
              expect(body).toHaveProperty(
                "created_at",
                "2020-02-23T12:01:00.000Z"
              );
            });
        });
        test("200: decreases comment votes when inc_votes is negative", () => {
          return request(app)
            .patch("/api/comments/4")
            .send({ inc_votes: -200 })
            .expect(200)
            .then(({ body }) => {
              expect(body).toHaveProperty(
                "body",
                " I carry a log — yes. Is it funny to you? It is not to me."
              );
              expect(body).toHaveProperty("votes", -300);
              expect(body).toHaveProperty("author", "icellusedkars");
              expect(body).toHaveProperty("article_id", 1);
              expect(body).toHaveProperty(
                "created_at",
                "2020-02-23T12:01:00.000Z"
              );
            });
        });
        test("200: ignores unnecessary properties in the request body", () => {
          return request(app)
            .patch("/api/comments/4")
            .send({ inc_votes: 300, hello: "goodbye" })
            .expect(200)
            .then(({ body }) => {
              expect(body).not.toHaveProperty("hello");
            });
        });
        test("400: responds with bad request when passed an invalid comment_id", () => {
          return request(app)
            .patch("/api/comments/hello")
            .send({ inc_votes: 20 })
            .expect(400)
            .then(({ body }) => {
              const { msg } = body;
              expect(msg).toBe("bad request");
            });
        });
        test("400: responds with bad request when sent malformed request body", () => {
          return request(app)
            .patch("/api/comments/3")
            .send({ hello: "goodbye" })
            .expect(400)
            .then(({ body }) => {
              const { msg } = body;
              expect(msg).toBe("bad request");
            });
        });
        test("400: responds with bad request when sent incorrect data type of request body", () => {
          return request(app)
            .patch("/api/comments/3")
            .send({ inc_votes: "hello" })
            .expect(400)
            .then(({ body }) => {
              const { msg } = body;
              expect(msg).toBe("bad request");
            });
        });
        test("404: responds with not found when comment with that comment_id does not exist", () => {
          return request(app)
            .patch("/api/comments/1000")
            .send({ inc_votes: 100 })
            .expect(404)
            .then(({ body }) => {
              const { msg } = body;
              expect(msg).toBe("not found");
            });
        });
      });
    });
  });
  describe("/api/users", () => {
    describe("GET requests /api/users", () => {
      test("200: responds with a users array on the response body", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            const { users } = body;
            expect(users).toHaveLength(4);
            users.forEach((user) => {
              expect(user).toHaveProperty("username", expect.any(String));
              expect(user).toHaveProperty("name", expect.any(String));
              expect(user).toHaveProperty("avatar_url", expect.any(String));
            });
          });
      });
    });
    describe("/api/users/:username", () => {
      describe("GET requests /api/users/:username", () => {
        test("200: responds with the correct user object", () => {
          return request(app)
            .get("/api/users/icellusedkars")
            .expect(200)
            .then(({ body }) => {
              expect(body).toHaveProperty("username", "icellusedkars");
              expect(body).toHaveProperty("name", "sam");
              expect(body).toHaveProperty(
                "avatar_url",
                "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
              );
            });
        });
        test("404: responds with not found when user with that username does not exist", () => {
          return request(app)
            .get("/api/users/hello")
            .expect(404)
            .then(({ body }) => {
              const { msg } = body;
              expect(msg).toBe("not found");
            });
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
