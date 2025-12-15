import Appointment from "../models/appointment.models.js";

const isYMD = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || ""));

export const getReports = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!isYMD(from) || !isYMD(to)) {
      return res
        .status(400)
        .json({ message: ["from y to son requeridos (YYYY-MM-DD)"] });
    }

    const start = new Date(`${from}T00:00:00.000Z`);
    const end = new Date(`${to}T23:59:59.999Z`);

    const pipeline = [
      {
        $addFields: {
          dateObj: {
            $cond: [
              { $eq: [{ $type: "$date" }, "date"] },
              "$date",
              {
                $dateFromString: {
                  dateString: "$date", 
                  onError: null,
                  onNull: null,
                },
              },
            ],
          },
        },
      },

      {
        $match: {
          dateObj: { $ne: null, $gte: start, $lte: end },
        },
      },

      {
        $lookup: {
          from: "doctors",
          localField: "doctor",
          foreignField: "_id",
          as: "doctorDoc",
        },
      },
      { $unwind: { path: "$doctorDoc", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "users",
          localField: "doctorDoc.user",
          foreignField: "_id",
          as: "doctorUser",
        },
      },
      { $unwind: { path: "$doctorUser", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "specialties",
          localField: "specialty",
          foreignField: "_id",
          as: "specialtyDoc",
        },
      },
      { $unwind: { path: "$specialtyDoc", preserveNullAndEmptyArrays: true } },

      {
        $facet: {
          byStatus: [
            { $group: { _id: "$status", total: { $sum: 1 } } },
            { $sort: { total: -1 } },
          ],

          byDay: [
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateObj" } },
                total: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],

          byDoctor: [
            {
              $group: {
                _id: "$doctor",
                name: { $first: "$doctorUser.username" },
                total: { $sum: 1 },
              },
            },
            { $sort: { total: -1 } },
          ],

          bySpecialty: [
            {
              $group: {
                _id: "$specialty",
                name: { $first: "$specialtyDoc.name" },
                total: { $sum: 1 },
              },
            },
            { $sort: { total: -1 } },
          ],
        },
      },
    ];

    const [out] = await Appointment.aggregate(pipeline);

    return res.json({
      range: { from, to },
      byStatus: out?.byStatus || [],
      byDay: out?.byDay || [],
      byDoctor: (out?.byDoctor || []).map((x) => ({
        _id: x._id,
        name: x.name || "Doctor",
        total: x.total,
      })),
      bySpecialty: (out?.bySpecialty || []).map((x) => ({
        _id: x._id,
        name: x.name || "Sin especialidad",
        total: x.total,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: [error.message] });
  }
};
