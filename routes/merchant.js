const merchantController = require('../controllers/merchant.js')
const { middlewareValidateSignature } = require('../services/helpers')
const Joi = require('@hapi/joi');
const { ethers } = require("ethers");
const dayjs = require('dayjs')


module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: async (req) => {
            return "Hello CashTech";
        },       
    },
    {
        method: 'GET',
        path: '/merchant/simulate-signature',
        handler: async (req) => {
            //0xeF236f1b35B2105836540c23d055d1BFb6c5db52
            const signer = new ethers.Wallet('7ba3b39dde406b9dfb768ddaf2dc282db5fae50b817dba962c08c88d582ab767')

            const currentTime = dayjs()
            const message = `Hi I wanna login to MelXBike Games! | ${currentTime}`
            const messageUtf8Bytes = ethers.utils.toUtf8Bytes(message);
            const testBytes = ethers.utils.arrayify(messageUtf8Bytes);
            const signature = await signer.signMessage(testBytes);

            return {
                signerAddress : signer.address,
                message,
                signature
            }
        },
        options: {            
            tags: ['api'], 
        }
    },
    {
        method: 'POST',
        path: '/merchant/register',
        handler: merchantController.register,
        options: {    
            pre: [{ method: middlewareValidateSignature }],      
            tags: ['api'], 
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
            validate: {
                payload: Joi.object({                    
                    pub_key: Joi.required().custom((value, helper) => {
                        if (!ethers.utils.isAddress(value)) {
                            return helper.message("Not a valid address")            
                        } else {
                            return value
                        }            
                    }),
                    message: Joi.required(),                   
                    signature: Joi.required()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/merchant/update-merchant-status',
        handler: merchantController.updateMerchantStatus,
        options: {   
            pre: [{ method: middlewareValidateSignature }],     
            tags: ['api'],    
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
            validate: {
                payload: Joi.object({                    
                    pub_key: Joi.required().custom((value, helper) => {
                        if (!ethers.utils.isAddress(value)) {
                            return helper.message("Not a valid address")            
                        } else {
                            return value
                        }            
                    }),
                    message: Joi.required(),                   
                    signature: Joi.required(),
                    status: Joi.boolean().required()
                }),                                
            }
        }        
    },   
    {
        method: 'POST',
        path: '/merchant/get-merchant-status',
        handler: merchantController.getMerchantStatus,       
        options: {                                
            pre: [{ method: middlewareValidateSignature }],
            tags: ['api'], 
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
            validate: {
                payload: Joi.object({                    
                    pub_key: Joi.required().custom((value, helper) => {
                        if (!ethers.utils.isAddress(value)) {
                            return helper.message("Not a valid address")            
                        } else {
                            return value
                        }            
                    }),
                    message: Joi.required(),                   
                    signature: Joi.required()
                }),                
            },                
        }
    },
]
