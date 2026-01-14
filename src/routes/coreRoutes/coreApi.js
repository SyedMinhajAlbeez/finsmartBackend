const express = require('express');
const { catchErrors } = require('@/handlers/errorHandlers');
const { restrictToLoggedInUser } = require('@/middlewares/authmiddleware'); // Adjust path as needed
const router = express.Router();

const adminController = require('@/controllers/coreControllers/adminController');
const settingController = require('@/controllers/coreControllers/settingController');
const userFBRController = require('@/controllers/coreControllers/fbrController');
const { singleStorageUpload } = require('@/middlewares/uploadMiddleware');

//_______________________________ Admin Management _______________________________
router.route('/admin/list').get(restrictToLoggedInUser, catchErrors(adminController.list));
router.route('/admin/create').post(restrictToLoggedInUser, catchErrors(adminController.create));
router.route('/admin/read/:id').get(restrictToLoggedInUser, catchErrors(adminController.read));
router.route('/admin/password-update/:id').patch(restrictToLoggedInUser, catchErrors(adminController.updatePassword));

//_______________________________ Admin Profile _______________________________
router.route('/admin/profile/password').patch(restrictToLoggedInUser, catchErrors(adminController.updateProfilePassword));
router
  .route('/admin/profile/update')
  .patch(
    restrictToLoggedInUser,
    singleStorageUpload({ entity: 'admin', fieldName: 'photo', fileType: 'image' }),
    catchErrors(adminController.updateProfile)
  );
router
  .route('/admin/update/:id')
  .patch(
    restrictToLoggedInUser,
    catchErrors(adminController.updateProfile)
  );

//____________________________________________ API for FBR APIs _________________
router.route('/user-fbr/hscode').get(restrictToLoggedInUser, catchErrors(userFBRController.fetchapis));
router.route('/user-fbr/uombyhscode').get(restrictToLoggedInUser, catchErrors(userFBRController.fetchHsCodeByUom));
router.route('/user-fbr/saletype').get(restrictToLoggedInUser, catchErrors(userFBRController.fetchsaletype));
router.route('/user-fbr/saletypeByRate').get(restrictToLoggedInUser, catchErrors(userFBRController.fetchsaleTypeByRate));
router.route('/user-fbr/sroScheduleByRate').get(restrictToLoggedInUser, catchErrors(userFBRController.fetchSroScheduleByRate));
router.route('/user-fbr/sroitem').get(restrictToLoggedInUser, catchErrors(userFBRController.fetchsroitem));
router.route('/user-fbr/provinces').get(restrictToLoggedInUser, catchErrors(userFBRController.fetchprovinces));
router.route('/user-fbr/regType').get(restrictToLoggedInUser, catchErrors(userFBRController.fetchregtype));
router.route('/user-fbr/digital_invoice').post(restrictToLoggedInUser, catchErrors(userFBRController.postdigitalinvoice));
router.route('/user-fbr/read').get(restrictToLoggedInUser, catchErrors(userFBRController.read));
router.route('/user-fbr/update').patch(restrictToLoggedInUser, catchErrors(userFBRController.update));
router.route('/lastInvoiceNumber').patch(restrictToLoggedInUser, catchErrors(userFBRController.lastinvoice));
router.route('/validatefbrdata').patch(restrictToLoggedInUser, catchErrors(userFBRController.validatefbrdata));


//____________________________________________ Settings _________________________
router.route('/setting/create').post(restrictToLoggedInUser, catchErrors(settingController.create));
router.route('/setting/read/:id').get(restrictToLoggedInUser, catchErrors(settingController.read));
router.route('/setting/update/:id').patch(restrictToLoggedInUser, catchErrors(settingController.update));
router.route('/setting/search').get(restrictToLoggedInUser, catchErrors(settingController.search));
router.route('/setting/list').get(restrictToLoggedInUser, catchErrors(settingController.list));
router.route('/setting/listAll').get(restrictToLoggedInUser, catchErrors(settingController.listAll));
router.route('/setting/filter').get(restrictToLoggedInUser, catchErrors(settingController.filter));
router
.route('/setting/readBySettingKey/:settingKey')
  .get(restrictToLoggedInUser, catchErrors(settingController.readBySettingKey));
router
  .route('/setting/listBySettingKey')
  .get(restrictToLoggedInUser, catchErrors(settingController.listBySettingKey));
router
  .route('/setting/updateBySettingKey/:settingKey?')
  .patch(restrictToLoggedInUser, catchErrors(settingController.updateBySettingKey));
router
  .route('/setting/upload/:settingKey?')
  .patch(
    restrictToLoggedInUser,
    singleStorageUpload({ entity: 'setting', fieldName: 'settingValue', fileType: 'image' }),
    catchErrors(settingController.updateBySettingKey)
  );
router
  .route('/setting/updateManySetting')
  .patch(restrictToLoggedInUser, catchErrors(settingController.updateManySetting));

module.exports = router;