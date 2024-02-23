import mongoose, { Schema } from "mongoose";

export interface userAttributes {
  username?: string
  email?: string
  password: string
  role?: number
  phone?: string
  refresh_token?: string
  last_login_at: Date
}

const userSchema = new Schema<userAttributes>(
  {
    username: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      // required: true,
      unique: true,
    },
    password: {
      type: String,
      // required: true,
    },
    role: {
      type: Number,
      // required: true,
    },
    phone: {
      type: String,
      // required: true,
      // unique: true
    },
    refresh_token: {
      type: String,
    },
    last_login_at: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);

export const UserDB = mongoose.model("users", userSchema, undefined, {
  overwriteModels: true,
});
