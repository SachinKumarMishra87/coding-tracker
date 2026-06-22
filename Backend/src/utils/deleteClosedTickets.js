import support from "../model/support.js";

const deleteClosedTickets = async () => {

    const before24Hours = new Date(
        Date.now() - 72 * 60 * 60 * 1000
    );

    await support.deleteMany({

        status: "Closed",

        closedAt: {
            $lte: before24Hours
        }

    });

};

export default deleteClosedTickets;