const RandToken = require('rand-token');
const dayjs = require('dayjs')
const Merchant = require('../models/merchant.js')
const { validateSignature } = require('../services/helpers')

/**
 * @dev Register function used to Save Merchant Data to Database
 */
exports.register = async (req, h) => {  
    // Get Body Inputs
    const pub_key  = req.payload.pub_key 
    const message = req.payload.message
    const signature = req.payload.signature

    // Public Key to lower case
    const publicKeyLowerCase = pub_key.toLowerCase()

    // Check Signature Validity
    const isValidSignature = validateSignature(pub_key, message, signature)
    if (!isValidSignature) {
        return h.response({
            statusCode: 422,
            message: "Invalid Signature",
            data: null
        }).code(422)
    } 

    // Check data existance based on Public Key  
    const merchant = await Merchant.findOne({ publicKey: publicKeyLowerCase })        
    if (merchant) {
        return h.response({
            statusCode: 422,
            message: "Merchant already registered",
            data: null
        }).code(422)
    }        


    // Prepare Data for Create New Merchant & Save  
    const currentTime = dayjs();  
    const newMerchant = await new Merchant({
        publicKey: publicKeyLowerCase,
        message,
        signature,
        isActive: true,
        lastSignatureTimestamp: currentTime
    }).save()
    
    return h.response({
        statusCode: 200,
        message: "Merchant registration success",
        data: newMerchant
    }).code(200)
}


exports.getMerchantStatus = async (req, h) => {        
    const publicKeyLowerCase = req.payload.pub_key.toLowerCase()

    let response;
    const merchant = await Merchant.findOne({ publicKey: publicKeyLowerCase })        

    if (merchant) {
        response = {
            statusCode: 200,
            message: "Retrieved Merchant Status Successfully",
            data: {
                publicKey: merchant.publicKey,
                isActive: merchant.isActive
            }
        }
    } else {
        response = {
            statusCode: 200,
            message: "Merchant not registered",
            data: null
        }        
    }

    return h.response(response).code(response.statusCode)
}

exports.updateMerchantStatus = async (req, h) => {
    // Get Public Key from Params
    const publicKeyLowerCase = req.payload.pub_key.toLowerCase()

    const findAndUpdate = await Merchant.findOneAndUpdate({
        publicKey: publicKeyLowerCase
    }, {
        isActive: req.payload.status
    });
    
    if (findAndUpdate) {        
        return h.response({
            statusCode: 200,
            message: "Successfully Update Merchant Status",
            data: {
                publicKey: publicKeyLowerCase,
                isActive: req.payload.status
            }
        }).code(200)
    } else {
        return h.response({
            statusCode: 400,
            message: "Fail to Update Merchant Status",
            data: null
        }).code(400)
    }        
}
