//

import * as request from "supertest";
import server from "../../../src/server";

//

test("should return 200", async () => {
  const response = await request(server.callback()).get("/api/readiness");
  expect(response.body).toMatchInlineSnapshot(`Object {}`);
  expect(response.status).toBe(200);
});
