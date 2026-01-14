const mongoose = require('mongoose');
const moment = require('moment');

const ProductModel = mongoose.model('Product');

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
        totalCategories: [
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
        newCategories: [
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
        categoriesWithProducts: [
          {
            $lookup: {
              from: ProductModel.collection.name,
              localField: '_id',
              foreignField: 'category',
              as: 'products',
            },
          },
          {
            $match: {
              'products.removed': false,
              'products.enabled': true,
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
  const totalCategories = result.totalCategories[0] ? result.totalCategories[0].count : 0;
  const totalNewCategories = result.newCategories[0] ? result.newCategories[0].count : 0;
  const categoriesWithProducts = result.categoriesWithProducts[0] ? result.categoriesWithProducts[0].count : 0;

  const totalCategoriesWithProductsPercentage = totalCategories > 0 ? (categoriesWithProducts / totalCategories) * 100 : 0;
  const totalNewCategoriesPercentage = totalCategories > 0 ? (totalNewCategories / totalCategories) * 100 : 0;

  return res.status(200).json({
    success: true,
    result: {
      new: Math.round(totalNewCategoriesPercentage),
      withProducts: Math.round(totalCategoriesWithProductsPercentage),
    },
    message: 'Successfully retrieved category summary',
  });
};

module.exports = summary;