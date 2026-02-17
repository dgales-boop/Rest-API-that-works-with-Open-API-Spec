import jwt from "jsonwebtoken";
import config from "../src/Config/index";

/**
 * Generate a JWT token for testing.
 * Usage: npm run generate-token
 */
const token = jwt.sign(
  {
    sub: "test-user",
    username: "testuser",
    role: "admin",
  },
  config.jwtSecret,
  { expiresIn: "24h" }, // Valid for 24 hours
);

console.log("\n=== JWT Token Generated ===\n");
console.log(token);
console.log("\n=== How to use ===");
console.log("1. Copy the token above");
console.log("2. In Swagger UI, click the 'Authorize' button");
console.log("3. Paste the token (without 'Bearer' prefix)");
console.log("4. Click 'Authorize' and close the dialog");
console.log("5. Try any endpoint\n");
console.log(
  "Token expires in 24 hours. Run this script again to get a new token.\n",
);
