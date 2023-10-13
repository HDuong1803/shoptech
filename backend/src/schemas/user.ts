import mongoose, { Schema } from "mongoose";

export interface userAttributes {
  name?: string
  email?: string
  password: string
  role?: number
  phone?: string
  refresh_token?: string
}

const UserSchema = new Schema<userAttributes>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    refresh_token: { 
      type: String, 
      unique: true 
    },
  },
  {
    timestamps: true,
  }
);

export const UserDB = mongoose.model("user", UserSchema, undefined, {
  overwriteModels: true,
});
