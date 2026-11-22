const express = require('express');
const path = require('path');

module.exports = function(app) {
  // Serve static files from public/resources
  app.use('/resources', express.static(path.join(__dirname, '../public/resources')));
};
