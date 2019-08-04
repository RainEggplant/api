import * as mongoose from "mongoose";
import Counter from "./counter";

export interface TeamModel extends mongoose.Document {
  id: number;
  contestId: number;
  name: string;
  description: string;
  leader: number;
  members: number[];
  inviteCode: string;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
}

const teamSchema = new mongoose.Schema<TeamModel>(
  {
    id: { type: Number, unique: true }, // use auto-increment id, instead of _id generated by database
    contestId: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    leader: { type: Number, required: true },
    members: { type: [Number], required: true },
    inviteCode: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: Number,
    updatedAt: { type: Date, default: Date.now },
    updatedBy: Number
  },
  {
    collection: "teams"
  }
);

teamSchema.pre<TeamModel>("save", function(next) {
  Counter.findByIdAndUpdate(
    "team",
    { $inc: { count: 1 } },
    { rawResult: true, new: true, upsert: true },
    (err, counter) => {
      if (err) {
        return next(err);
      }
      this.id = counter.count;
      next();
    }
  );
});

export default mongoose.model<TeamModel>("Team", teamSchema);
