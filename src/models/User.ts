import mongoose, { Schema, Document } from "mongoose"
import { IUser } from "@/types"

export interface UserDocument extends Omit<IUser, "_id">, Document {}

const UserSchema = new Schema<UserDocument>(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    image:    { type: String },
    bio:      { type: String, default: "" },
  },
  { timestamps: true }
)

export const User =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema)