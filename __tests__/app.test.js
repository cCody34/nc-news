const app = require("../app");
const request = require("supertest");

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
});
