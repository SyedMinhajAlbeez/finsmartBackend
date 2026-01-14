// const mongoose = require('mongoose');
// const UserFBR = mongoose.model('FBRUser');
// const Admin = mongoose.model('Admin');
// const Joi = require('joi');

// const read = async (req, res) => {
//   try {
//     const { user_id } = req.query;

//     if (user_id) {
//       const schema = Joi.string().hex().length(24).required();
//       const { error } = schema.validate(user_id);
//       if (error) {
//         return res.status(400).json({
//           success: false,
//           result: null,
//           message: 'Invalid user_id format',
//           errorMessage: error.message,
//         });
//       }
//     }

//     const query = { removed: false };
//     if (user_id) query.user_id = user_id;

//     const userFBRs = await UserFBR.find(query).populate('user_id', 'name email');
//     if (!userFBRs || userFBRs.length === 0) {
//       return res.status(404).json({
//         success: false,
//         result: null,
//         message: 'No UserFBR records found',
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       result: userFBRs,
//       message: 'Successfully retrieved UserFBR records',
//     });
//   } catch (error) {
//     throw new Error(`Error reading UserFBR records: ${error.message}`);
//   }
// };

// const update = async (req, res) => {
//   try {
//     const { user_id, sandbox_token, production_token } = req.body;

//     const schema = Joi.object({
//       user_id: Joi.string().hex().length(24).required(),
//       sandbox_token: Joi.string().trim().allow(null).optional(),
//       production_token: Joi.string().trim().allow(null).optional(),
//     }).or('sandbox_token', 'production_token');

//     const { error } = schema.validate({ user_id, sandbox_token, production_token });
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         result: null,
//         message: 'Invalid input',
//         errorMessage: error.message,
//       });
//     }

//     // Check if user exists
//     const user = await Admin.findOne({ _id: user_id, removed: false });
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         result: null,
//         message: 'No user found with provided user_id',
//       });
//     }

//     // Update or create UserFBR record
//     const updateData = {};
//     if (sandbox_token !== undefined) updateData.sandbox_token = sandbox_token;
//     if (production_token !== undefined) updateData.production_token = production_token;

//     const userFBR = await UserFBR.findOneAndUpdate(
//       { user_id, removed: false },
//       { $set: updateData },
//       { new: true, upsert: true, setDefaultsOnInsert: true }
//     ).populate('user_id', 'name email');

//     return res.status(200).json({
//       success: true,
//       result: userFBR,
//       message: 'Successfully updated UserFBR record',
//     });
//   } catch (error) {
//     throw new Error(`Error updating UserFBR record: ${error.message}`);
//   }
// };

// module.exports = { read, update };