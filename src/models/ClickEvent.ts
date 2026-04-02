import mongoose, { Schema, Document } from "mongoose"
import { IClickEvent } from "@/types"

export interface ClickEventDocument extends Omit<IClickEvent, "_id">, Document {}

const ClickEventSchema = new Schema<ClickEventDocument>(
  {
    linkId:    { type: String, required: true, index: true },
    clickedAt: { type: Date, default: Date.now },
    userAgent: { type: String },
  }
)

export const ClickEvent =
  mongoose.models.ClickEvent ||
  mongoose.model<ClickEventDocument>("ClickEvent", ClickEventSchema)