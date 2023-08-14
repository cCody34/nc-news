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
  describe("/api/healthCheck", () => {
    test("200: responds with a status of 200", () => {
      return request(app).get("/api/healthcheck").expect(200);
    });
    test("200: responds with a message on the body", () => {
      return request(app)
        .get("/api/healthcheck")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body).toHaveProperty("msg", "server is running");
        });
    });
  });
  describe("/api", () => {
    test("200: responds with a status of 200", () => {
      return request(app).get("/api").expect(200);
    });
    test("200: responds with a json object of endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(typeof body).toBe("object");
          const bodyArr = Object.entries(body);
          bodyArr.forEach((endpointArr) => {
            const key = endpointArr[0];
            const value = endpointArr[1];
            const keyIsReq = key.startsWith(
              "GET" || "POST" || "PUT" || "DELETE" || "PATCH"
            );
            expect(keyIsReq).toBe(true);
            expect(value).toHaveProperty("description", expect.any(String));
            expect(value).toHaveProperty("queries", expect.any(Array));
            expect(value).toHaveProperty(
              "requestBodyFormat",
              expect.any(String)
            );
            expect(value).toHaveProperty("exampleResponse", expect.any(Object));
          });
        });
    });
  });
  describe("/api/topics", () => {
    test("200: responds with a status of 200", () => {
      return request(app).get("/api/topics").expect(200);
    });
    test("200: responds with topics array on the response body", () => {
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
});
