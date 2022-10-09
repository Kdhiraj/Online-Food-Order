import mongoose, { Schema, Document, Model } from "mongoose";
import { Password } from "../../utility";
// import { OrderDoc } from './Order';

interface CustomerDoc extends Document {
  email: string;
  password: string;
  phone: string;
  otp: number;
  otp_expiry: Date;
  firstName?: string;
  lastName?: string;
  address?: string;
  verified?: boolean;
  lat?: number;
  lng?: number;
  cart?: [any];
  // orders?: [OrderDoc]
}

const CustomerSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    address: { type: String, default: "" },
    phone: { type: String, required: true },
    verified: { type: Boolean, default: false },
    otp: { type: Number },
    otp_expiry: { type: Date },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    // cart: [
    //     {
    //         food: { type: Schema.Types.ObjectId, ref: 'food', require: true},
    //         unit: { type: Number, require: true}
    //     }
    // ],
    // orders: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'order'
    // }]
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

CustomerSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});
const CustomerModel = mongoose.model<CustomerDoc>("customer", CustomerSchema);

export { CustomerModel, CustomerDoc };
