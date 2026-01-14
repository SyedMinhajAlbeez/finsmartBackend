const mongoose = require('mongoose');
const moment = require('moment');

const CategoryModel = mongoose.model('Category');
const ScenarioModel = mongoose.model('Scenario');

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
        totalProducts: [
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
        newProducts: [
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
        productsWithCategory: [
          {
            $lookup: {
              from: CategoryModel.collection.name,
              localField: 'category',
              foreignField: '_id',
              as: 'category',
            },
          },
          {
            $match: {
              'category.removed': false,
              'category.enabled': true,
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
        productsWithScenario: [
          {
            $lookup: {
              from: ScenarioModel.collection.name,
              localField: 'scenarioId',
              foreignField: '_id',
              as: 'scenario',
            },
          },
          {
            $match: {
              'scenario.removed': false,
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
      },
    },
  ];

  const aggregationResult = await Model.aggregate(pipeline);

  const result = aggregationResult[0];
  const totalProducts = result.totalProducts[0] ? result.totalProducts[0].count : 0;
  const totalNewProducts = result.newProducts[0] ? result.newProducts[0].count : 0;
  const productsWithCategory = result.productsWithCategory[0] ? result.productsWithCategory[0].count : 0;
  const productsWithScenario = result.productsWithScenario[0] ? result.productsWithScenario[0].count : 0;

  const totalProductsWithCategoryPercentage = totalProducts > 0 ? (productsWithCategory / totalProducts) * 100 : 0;
  const totalNewProductsPercentage = totalProducts > 0 ? (totalNewProducts / totalProducts) * 100 : 0;
  const totalProductsWithScenarioPercentage = totalProducts > 0 ? (productsWithScenario / totalProducts) * 100 : 0;

  return res.status(200).json({
    success: true,
    result: {
      new: Math.round(totalNewProductsPercentage),
      withCategory: Math.round(totalProductsWithCategoryPercentage),
      withScenario: Math.round(totalProductsWithScenarioPercentage),
    },
    message: 'Successfully retrieved product summary',
  });
};

module.exports = summary;