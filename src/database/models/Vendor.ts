import mongoose, { Schema, Document } from "mongoose";
import { Password } from "../../utility";

interface VendorDoc extends Document {
  name: string;
  ownerName: string;
  foodTypes: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  serviceAvailable?: boolean;
  coverImages?: [string];
  rating?: number;
  foods?: any;
  lat?: number;
  lng?: number;
}

const VendorSchema = new Schema(
  {
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodTypes: { type: [String] },
    pincode: { type: String, required: true },
    address: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    serviceAvailable: { type: Boolean, default: false },
    coverImages: { type: [String] },
    rating: { type: Number },
    foods: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Food",
      },
    ],
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0},
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
VendorSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});
const VendorModel = mongoose.model<VendorDoc>("Vendor", VendorSchema);

export { VendorModel, VendorDoc };
