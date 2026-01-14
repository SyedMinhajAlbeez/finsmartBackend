const mongoose = require('mongoose');
const moment = require('moment');

const ScenarioModel = mongoose.model('Scenario');
const CredsModel = mongoose.model('Creds');

const summary = async (Model, req, res) => {
  let defaultType = 'month';
  const { type } = req.query;

  if (type && ['week', 'month', 'year'].includes(type)) {
    defaultType = type;
  } else if (type) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Invalid type',
    });
  }

  const currentDate = moment();
  let startDate = currentDate.clone().startOf(defaultType);
  let endDate = currentDate.clone().endOf(defaultType);

  const pipeline = [
    {
      $facet: {
        totalAdmins: [
          {
            $match: {
              removed: false,
              enabled: true,
            },
          },
          {
            $count: 'count',
          },
        ],
        newAdmins: [
          {
            $match: {
              removed: false,
              created: { $gte: startDate.toDate(), $lte: endDate.toDate() },
              enabled: true,
            },
          },
          {
            $count: 'count',
          },
        ],
        adminsWithScenario: [
          {
            $lookup: {
              from: ScenarioModel.collection.name,
              localField: 'scenarioIds',
              foreignField: '_id',
              as: 'scenarios',
            },
          },
          {
            $match: {
              'scenarios.removed': false,
              'scenarios.enabled': true,
            },
          },
          {
            $group: {
              _id: '$_id',
            },
          },
          {
            $count: 'count',
          },
        ],
        adminsWithCreds: [
          {
            $lookup: {
              from: CredsModel.collection.name,
              localField: 'Creds',
              foreignField: '_id',
              as: 'creds',
            },
          },
          {
            $match: {
              'creds.removed': false,
            },
          },
          {
            $group: {
              _id: '$_id',
            },
          },
          {
            $count: 'count',
          },
        ],
        adminsByRole: [
          {
            $match: {
              removed: false,
              enabled: true,
            },
          },
          {
            $group: {
              _id: '$role',
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
  ];

  const aggregationResult = await Model.aggregate(pipeline);

  const result = aggregationResult[0];
  const totalAdmins = result.totalAdmins[0] ? result.totalAdmins[0].count : 0;
  const totalNewAdmins = result.newAdmins[0] ? result.newAdmins[0].count : 0;
  const adminsWithScenario = result.adminsWithScenario[0] ? result.adminsWithScenario[0].count : 0;
  const adminsWithCreds = result.adminsWithCreds[0] ? result.adminsWithCreds[0].count : 0;
  const adminsByRole = result.adminsByRole || [];

  const totalNewAdminsPercentage = totalAdmins > 0 ? (totalNewAdmins / totalAdmins) * 100 : 0;
  const totalAdminsWithScenarioPercentage = totalAdmins > 0 ? (adminsWithScenario / totalAdmins) * 100 : 0;
  const totalAdminsWithCredsPercentage = totalAdmins > 0 ? (adminsWithCreds / totalAdmins) * 100 : 0;

  return res.status(200).json({
    success: true,
    result: {
      total: totalAdmins,
      new: Math.round(totalNewAdminsPercentage),
      withScenario: Math.round(totalAdminsWithScenarioPercentage),
      withCreds: Math.round(totalAdminsWithCredsPercentage),
      byRole: adminsByRole,
    },
    message: 'Successfully retrieved admin summary',
  });
};

module.exports = summary;