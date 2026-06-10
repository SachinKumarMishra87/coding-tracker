import mongoose from "mongoose";

const supportSchema = new mongoose.Schema(

  {

    user: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true

    },

    subject: {

      type: String,

      required: true,

      trim: true

    },

    category: {

      type: String,

      enum: [

        "Bug Report",

        "Feature Request",

        "Feedback",

        "Question Issue",

        "Account Issue",

        "Other"

      ],

      required: true

    },

    messages: [
      {
        sender: {
          type: String,
          enum: ["user", "admin"]
        },

        text: {
          type: String,
          required: true
        },

        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    waitingFor: {
      type: String,
      enum: ["admin", "user", null],
      default: "admin"
    },
    closedAt: {
      type: Date,
      default: null
    }
    ,
    status: {

      type: String,

      enum: [

        "Open",

        "In Progress",

        "Resolved",

        "Closed"

      ],

      default: "Open"

    }

  },

  {

    timestamps: true

  }

);

export default mongoose.model(
  "Support",
  supportSchema
);