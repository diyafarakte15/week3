const request = require("supertest");
const mongoose = require("mongoose");
const express = require("express");

const User = require("../../src/models/User");
const authRouter = require("../../src/routes/auth");

const app = express();
app.use(express.json());
app.use("/auth", authRouter);

beforeAll(() => {
  require("../../server"); // make sure your server starts before tests
});

describe("Auth API - Signup", () => {            
  const baseURL = "http://localhost:8000";

  const newUser = {
    name: "Test Name",
    username: "testsignupuser",
    email: "testsignup@example.com",
    password: "password123",
  };

  it("should create a new user successfully", async () => {
    const res = await request(baseURL)
      .post("/api/auth/signup")
      .send(newUser);

    console.log("Signup response:", res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("username", newUser.username);
    expect(res.body).toHaveProperty("email", newUser.email);

    expect(res.headers["set-cookie"]).toBeDefined();  // check if cookies are set
  });

  it("should fail when fields are missing", async () => {
    const res = await request(baseURL)
      .post("/api/auth/signup")
      .send({
        username: "incompleteuser",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "All fields are required");
  });

  it("should not allow duplicate signup", async () => {
    const res = await request(baseURL)
      .post("/api/auth/signup")
      .send(newUser);           // same email and username


    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("error", "User already exists");
  });
});
