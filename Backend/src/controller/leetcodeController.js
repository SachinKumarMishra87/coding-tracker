import axios from "axios";

export const getLeetcodeStats = async (
    req,
    res
) => {

    try {

        const { username } = req.params;

        const response = await axios.get(
            `https://leetcode-api-faisalshohag.vercel.app/${username}`
        );

        const data = response.data;

        return res.status(200).json({

            success: true,

            stats: {

                totalSolved:
                    data.totalSolved,

                easySolved:
                    data.easySolved,

                mediumSolved:
                    data.mediumSolved,

                hardSolved:
                    data.hardSolved,

                ranking:
                    data.ranking,

            }

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch LeetCode stats"

        });

    }

};