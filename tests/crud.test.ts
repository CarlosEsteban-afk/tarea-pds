import request from "supertest";
import { createApp } from "../src/index";
import fc from "fast-check";

// Arbitraries
const nameArb = fc.string({ minLength: 1, maxLength: 50 }).filter(s => /\S/.test(s));
const emailArb = fc
  .tuple(fc.string({ minLength: 1, maxLength: 10 }), fc.domain())
  .map(([l, d]) => `${l.replace(/\W+/g, "x")}@${d}`)
  .filter(e => e.length <= 100);

function makeApp() {
  const app = createApp();
  return app;
}

describe("Property-based CRUD", () => {
  test("Create: returns 201 and echoes valid user", async () => {
    await fc.assert(
      fc.asyncProperty(nameArb, emailArb, async (name, email) => {
        const app = makeApp();
        const res = await request(app).post("/users").send({ name, email });
        expect(res.status).toBe(201);
        expect(res.body).toEqual(expect.objectContaining({ name, email }));
        expect(typeof res.body.id).toBe("string");
      }),
      { numRuns: 30 }
    );
  });

  test("Read: after creating N users, GET /users returns N items", async () => {
    await fc.assert(
      fc.asyncProperty(fc.array(fc.tuple(nameArb, emailArb), { minLength: 0, maxLength: 8 }), async (entries) => {
        const app = makeApp();
        for (const [name, email] of entries) {
          const res = await request(app).post("/users").send({ name, email });
          expect(res.status).toBe(201);
        }
        const list = await request(app).get("/users");
        expect(list.status).toBe(200);
        expect(list.body.length).toBe(entries.length);
      }),
      { numRuns: 25 }
    );
  });

  test("Update: modifying fields preserves id and applies schema", async () => {
    await fc.assert(
      fc.asyncProperty(nameArb, emailArb, nameArb, emailArb, async (name, email, newName, newEmail) => {
        const app = makeApp();
        const created = await request(app).post("/users").send({ name, email });
        const id = created.body.id;
        const updated = await request(app).put(`/users/${id}`).send({ name: newName, email: newEmail });
        expect(updated.status).toBe(200);
        expect(updated.body.id).toBe(id);
        expect(updated.body).toEqual(expect.objectContaining({ name: newName, email: newEmail }));
      }),
      { numRuns: 25 }
    );
  });

  test("Delete: after deletion, GET returns 404", async () => {
    await fc.assert(
      fc.asyncProperty(nameArb, emailArb, async (name, email) => {
        const app = makeApp();
        const created = await request(app).post("/users").send({ name, email });
        const id = created.body.id;
        const del = await request(app).delete(`/users/${id}`);
        expect(del.status).toBe(204);
        const got = await request(app).get(`/users/${id}`);
        expect(got.status).toBe(404);
      }),
      { numRuns: 25 }
    );
  });
});
