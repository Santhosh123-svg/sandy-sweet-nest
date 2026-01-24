import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import sendEmail from "./utils/sendEmail.js";

const run = async () => {
  try {
    await sendEmail(
      "yourtestemail@gmail.com",
      "Test Email",
      "<h1>Test Email from Sandy’s Sweet Nest</h1>"
    );
    console.log("Email sent ✅");
  } catch (err) {
    console.log("EMAIL ERROR:", err);
  }
};

run();
