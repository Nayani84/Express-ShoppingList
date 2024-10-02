process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let test1 = { name: 'popsicle', price: 1.45 };

beforeEach(function () {
  items.push(test1);
});


afterEach(function () {
  // make sure this *mutates*, not redefines, `items`
  items.length = 0;
});



describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ items: [test1] })
  });
});


describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${test1.name}`);
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ item: test1 })
  });

  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).get(`/items/sleep`);
    expect(res.statusCode).toBe(404)
  });
});


describe("POST /items", () => {
  test("Creating a item", async () => {
    const res = await request(app).post("/items").send({ name: "chocolate", price: 1 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ item: { name: "chocolate", price: 1 } });
  });

  test("Responds with 400 if name is missing", async () => {
    const res = await request(app).post("/items").send({});
    expect(res.statusCode).toBe(400);
  });
});


describe("/PATCH /items/:name", () => {
  test("Updating a item's name", async () => {
    const res = await request(app).patch(`/items/${test1.name}`).send({ name: "Milk chocalate" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: { name: "Milk chocalate" } });
  });

  test("Responds with 404 for invalid name", async () => {
    const res = await request(app).patch(`/items/eat`).send({ name: "Milk chocalate" });
    expect(res.statusCode).toBe(404);
  });
});


describe("/DELETE /item/:name", () => {
  test("Deleting a item", async () => {
    const res = await request(app).delete(`/items/${test1.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Deleted' })
  });
  
  test("Responds with 404 for deleting invalid item", async () => {
    const res = await request(app).delete(`/items/elephant`);
    expect(res.statusCode).toBe(404);
  });
});
