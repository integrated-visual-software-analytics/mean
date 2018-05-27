const express = require('express');
const passport = require('passport');
const httpError = require('http-errors');
const asyncHandler = require('express-async-handler')
const entityCtrl = require('../controllers/entity.controller');
const requireAdmin = require('../middleware/require-admin');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }))

router.route('/schema/:schemaId')
  .post(asyncHandler(insert));

router.route('/type/:type')
  .get(asyncHandler(list))

router.route('/:entityDataId')
  .get(asyncHandler(get))
  .put(asyncHandler(update))

async function insert(req, res) {
  let entityData = await entityCtrl.insert(req.user, req.params.schemaId, req.body);
  res.json(entityData);
}

async function get(req, res) {
  let entityData = await entityCtrl.get(req.params.entityDataId);
  if(!entityData) throw new httpError(404);
  res.json(entityData);
}

async function update(req, res) {
  let entityData = await entityCtrl.update(req.params.entityDataId, req.body);
  if(!entityData) throw new httpError(404);
  res.json(entityData);
}

async function list(req, res) {
    let entities = await entityCtrl.list(req.user._id, req.params.type);
    if(!entities) throw new httpError(404);
    res.json(entities);
  }