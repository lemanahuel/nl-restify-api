const TasksController = require('./tasks.controller');
const middlewares = require('../../middlewares');

module.exports = server => {
  server.get('/tasks', TasksController.list);
  server.post('/tasks', middlewares.isValidDomain, TasksController.create);
  server.get('/tasks/:id', middlewares.isValidDomain, TasksController.read);
  server.put('/tasks/:id', middlewares.isValidDomain, TasksController.update);
  server.put('/tasks/:id/title', middlewares.isValidDomain, TasksController.updateTitle);
  server.put('/tasks/:id/completed', middlewares.isValidDomain, TasksController.updateCompleted);
  server.put('/tasks/:id/images', middlewares.isValidDomain, TasksController.updateImages);
  server.del('/tasks/:id', middlewares.isValidDomain, TasksController.delete);
};


