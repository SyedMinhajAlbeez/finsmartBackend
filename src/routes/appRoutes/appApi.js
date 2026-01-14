const express = require('express');
const { catchErrors } = require('@/handlers/errorHandlers');
const { restrictToLoggedInUser } = require('@/middlewares/authmiddleware'); // Adjust path as needed
const router = express.Router();

const appControllers = require('@/controllers/appControllers');
const { routesList } = require('@/models/utils');

const routerApp = (entity, controller) => {
  // Apply restrictToLoggedInUser middleware to all routes
  router.route(`/${entity}/create`).post(restrictToLoggedInUser, catchErrors(controller['create']));
  router.route(`/${entity}/read/:id`).get(restrictToLoggedInUser, catchErrors(controller['read']));
  router.route(`/${entity}/update/:id`).patch(restrictToLoggedInUser, catchErrors(controller['update']));
  router.route(`/${entity}/delete/:id`).delete(restrictToLoggedInUser, catchErrors(controller['delete']));
  router.route(`/${entity}/search`).get(restrictToLoggedInUser, catchErrors(controller['search']));
  router.route(`/${entity}/list`).get(restrictToLoggedInUser, catchErrors(controller['list']));
  router.route(`/${entity}/listAll`).get(restrictToLoggedInUser, catchErrors(controller['listAll']));
  router.route(`/${entity}/filter`).get(restrictToLoggedInUser, catchErrors(controller['filter']));
  router.route(`/${entity}/summary`).get(restrictToLoggedInUser, catchErrors(controller['summary']));

  if (entity === 'invoice' || entity === 'quote' || entity === 'payment') {
    router.route(`/${entity}/mail`).post(restrictToLoggedInUser, catchErrors(controller['mail']));
  }

  if (entity === 'quote') {
    router.route(`/${entity}/convert/:id`).get(restrictToLoggedInUser, catchErrors(controller['convert']));
  }
};

routesList.forEach(({ entity, controllerName }) => {
  const controller = appControllers[controllerName];
  routerApp(entity, controller);
});

module.exports = router;