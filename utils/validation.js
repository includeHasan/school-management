const Joi = require('joi');
const schoolSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    address: Joi.string().min(3).max(255).required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required()
});
module.exports = schoolSchema;