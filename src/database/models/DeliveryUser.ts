import mongoose, { Schema, Document } from "mongoose";
import { Password } from "../../utility";

interface DeliveryUserDoc extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  pincode: string;
  verified: boolean;
  otp: number;
  otp_expiry: Date;
  lat: number;
  lng: number;
  isAvailable: boolean;
}

const DeliveryUserSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: String, required: true },
    pincode: { type: String },
    verified: { type: Boolean, default: false },
    otp: { type: Number },
    otp_expiry: { type: Date },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: false },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

DeliveryUserSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

const DeliveryUser = mongoose.model<DeliveryUserDoc>(
  "DeliveryUser",
  DeliveryUserSchema
);

export { DeliveryUser, DeliveryUserDoc };
