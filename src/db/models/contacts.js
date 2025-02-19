import Joi from 'joi';

export const contactSchema = Joi.object({
    name: Joi.string().min(3).max(20)
        .required()
        .messages({
            'string.base': 'Name must be a text.',
            'string.empty': 'Name cannot be empty.',
            'any.required': 'Name is required.'
        }),

    phoneNumber: Joi.string().min(3).max(20)
        .pattern(/^\+?[0-9]{10,15}$/)
        .required()
        .messages({
            'string.base': 'Phone number must be a text.',
            'string.empty': 'Phone number cannot be empty.',
            'string.pattern.base': 'Please enter a valid phone number. (e.g., +905XXXXXXXXX)',
            'any.required': 'Phone number is required.'
        }),

    email: Joi.string().min(3).max(20)
        .email()
        .required()
        .messages({
            'string.base': 'Email must be a text.',
            'string.empty': 'Email cannot be empty.',
            'string.email': 'Please enter a valid email address.',
            'any.required': 'Email is required.'
        }),

    isFavourite: Joi.boolean()
        .required()
        .messages({
            'boolean.base': 'Favourite field must be either true or false.',
            'any.required': 'Favourite field is required.'
        }),

    contactType: Joi.string().min(3).max(20)
        .valid('work', 'personal')
        .required()
        .messages({
            'string.base': 'Contact type must be a text.',
            'string.empty': 'Contact type cannot be empty.',
            'any.only': 'Contact type must be either "work" or "personal".',
            'any.required': 'Contact type is required.'
        }),
});

export const updateContactSchema =  Joi.object({
    name: Joi.string().min(3).max(20),
    phoneNumber:Joi.string().min(3).max(20),
    email:Joi.string().min(3).max(20),
    isFavourite:Joi.boolean(),
    contactType:Joi.string().min(3).max(20),
})