import { model, Schema, models, Document } from "mongoose";

export interface IImage extends Document {
  title: string;
  transformationType: string;
  publicId: string;
  secureURL: string;
  width: number;
  height: number;
  config: object;
  transformationUrl: string;
  aspectRatio: string;
  color: string;
  propmt: string;
  author: {
    _id: string;
    firstname: string;
    lastname: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
const ImageSchema = new Schema({
  title: { type: String, required: true },
  transformationType: { type: String, required: true },
  publicId: { type: String, required: true },
  secureURL: { type: String, required: true },
  width: { type: Number },
  height: { type: Number },
  config: { type: Object },
  transformationUrl: { type: String },
  aspectRatio: { type: String },
  color: { type: String },
  propmt: { type: String },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: String, default: Date.now() },
});

const Image = models?.Image || model("Image", ImageSchema);

export default Image;
