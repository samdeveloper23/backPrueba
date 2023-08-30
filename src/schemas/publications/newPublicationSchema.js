const joi = require('joi');

const joiErrorMessages = require('../joiErrorMessages');

const imgSchema = require('../imgSchema');

const newPublicationSchema = joi.object({
    title: joi.string().required().max(50).messages(joiErrorMessages),
    description: joi.string().required().max(100).messages(joiErrorMessages),
    photoName: imgSchema.unknown(true).optional().messages(joiErrorMessages),
});

module.exports = newPublicationSchema;
