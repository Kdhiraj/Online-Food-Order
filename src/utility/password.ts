import jwt from "jsonwebtoken";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { JWT_SECRET } from "../config";
import { AuthPayload } from "../dto";

const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    return buf.toString("hex") === hashedPassword;
  }

  static async GenerateToken(payload: AuthPayload) {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not provided");
    }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
  }
}
