import Support from "../model/support.js";

export const createTicket = async (
  req,
  res
) => {

  try {

    const { subject, category, message } =
      req.body;

    if (
      !subject ||
      !category ||
      !message
    ) {

      return res.status(400).json({

        success: false,

        message:
          "All fields are required"

      });

    }

    const ticket =
      await Support.create({

        user: req.user.id,

        subject,

        category,

        messages: [

          {
            sender: "user",

            text: message
          }

        ],

        waitingFor: "admin"

      });

    return res.status(201).json({

      success: true,

      message:
        "Ticket created successfully",

      ticket

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        "Server Error"

    });

  }

};

export const getMyTickets = async (
  req,
  res
) => {

  try {

    const tickets =
      await Support.find({

        user: req.user.id

      })
        .sort({
          createdAt: -1
        });

    return res.status(200).json({

      success: true,

      tickets

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: "Server Error"

    });

  }

};

// Only for Admin - Get All Tickets, Update Ticket Status, Reply to Ticket
export const getAllTickets = async (
  req,
  res
) => {

  try {

    const tickets =
      await Support.find()

        .populate(
          "user",
          "username email"
        )

        .sort({
          createdAt: -1
        });

    return res.status(200).json({

      success: true,

      tickets

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: "Server Error"

    });

  }

};

export const getSingleTicket = async (
  req,
  res
) => {

  try {

    const ticket =
      await Support.findById(
        req.params.id
      )

        .populate(
          "user",
          "username email"
        );

    if (!ticket) {

      return res.status(404).json({

        success: false,

        message: "Ticket not found"

      });

    }
    if (
      req.user.role !== "admin" &&
      ticket.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    return res.status(200).json({

      success: true,

      ticket

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: "Server Error"

    });

  }

};

export const replyTicket = async (
  req,
  res
) => {

  try {

    const { message } = req.body;

    const ticket =
      await Support.findById(
        req.params.id
      );

    if (!ticket) {

      return res.status(404).json({

        success: false,

        message: "Ticket not found"

      });

    }
    if (ticket.status === "Closed") {

      return res.status(400).json({

        success: false,

        message: "Ticket is closed"

      });

    }

    if (ticket.waitingFor !== "admin") {

      return res.status(400).json({

        success: false,

        message: "Wait for user reply"

      });

    }

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply is required"
      });
    }

    ticket.messages.push({

      sender: "admin",

      text: message

    });

    ticket.waitingFor = "user";

    ticket.status = "In Progress";

    await ticket.save();

    return res.status(200).json({

      success: true,

      message: "Reply added"

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: "Server Error"

    });

  }

};

export const updateStatus = async (
  req,
  res
) => {

  try {

    const { status } =
      req.body;

    const ticket =
      await Support.findById(
        req.params.id
      );

    if (!ticket) {

      return res.status(404).json({

        success: false,

        message: "Ticket not found"

      });

    }

    ticket.status = status;

    if (status === "Closed") {

      ticket.closedAt = new Date();

      ticket.waitingFor = null;

    } else {

      ticket.closedAt = null;

    }

    await ticket.save();

    return res.status(200).json({

      success: true,

      message:
        "Status updated"

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: "Server Error"

    });

  }

};

export const userReplyTicket = async (
  req,
  res
) => {

  try {

    const { message } = req.body;

    const ticket =
      await Support.findById(
        req.params.id
      );

    if (!ticket) {

      return res.status(404).json({

        success: false,

        message: "Ticket not found"

      });

    }
    if (ticket.status === "Closed") {

      return res.status(400).json({

        success: false,

        message: "Ticket is closed"

      });
    }

    if (ticket.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (
      ticket.waitingFor !== "user"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Wait for admin reply"

      });

    }
    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    ticket.messages.push({

      sender: "user",

      text: message

    });

    ticket.waitingFor = "admin";

    await ticket.save();

    return res.status(200).json({

      success: true,

      message: "Reply sent"

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: "Server Error"

    });

  }

};