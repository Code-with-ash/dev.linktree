import mongoose, { Schema, Document } from "mongoose"
import { ILink } from "@/types"

export interface LinkDocument extends Omit<ILink, "_id">, Document { }

const LinkSchema = new Schema<LinkDocument>(
    {
        userId: { type: String, required: true, index: true },
        title: { type: String, required: true },
        url: { type: String, required: true },
        icon: { type: String, default: "globe" },
        clicks: { type: Number, default: 0 },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
)

export const Link =
    mongoose.models.Link || mongoose.model<LinkDocument>("Link", LinkSchema)