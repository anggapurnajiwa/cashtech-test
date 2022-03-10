const Merchant = require('../models/merchant.js')
const Boom = require('@hapi/boom')
const { ethers } = require("ethers");
const dayjs = require('dayjs')

const validateSignature = (public_key, message, signature) => {
    const messageUtf8Bytes = ethers.utils.toUtf8Bytes(message)
    const arrayifyMessage = ethers.utils.arrayify(messageUtf8Bytes);
    const recoveredAddress = ethers.utils.verifyMessage(arrayifyMessage, signature);
    console.log(`Pub Key ; ${public_key}`)
    console.log(`Recovered Address : ${recoveredAddress}`)

    const publicKeyLowerCase = public_key.toLowerCase()
    const recoveredAddressLowerCase = recoveredAddress.toLowerCase()

    if (publicKeyLowerCase === recoveredAddressLowerCase) {
        return true;
    } else {
        return false;
    }
}

const middlewareValidateSignature = async function (req) {       
    // Get body params
    const public_key = req.payload.pub_key
    const message = req.payload.message
    const signature = req.payload.signature

    // Check signature validity 
    const isValidateSignature = validateSignature(public_key, message, signature)

    if(isValidateSignature) {
        const publicKeyLowerCase = public_key.toLowerCase()
        const merchant = await Merchant.findOne({ publicKey: publicKeyLowerCase })               
        if (merchant) {
            // Get last signature that stored on database
            const lastSignatureTimestamp = dayjs(merchant.lastSignatureTimestamp)          
            // Get timestamp on message  
            const signatureTime = message.split("|")[1]
            if(typeof signatureTime !== 'undefined') {
                // Format timestamp on signature's message
                const signatureTimeFormatted = dayjs(signatureTime)    
                console.log('TImestamp')
                console.log(lastSignatureTimestamp)     
                console.log(signatureTimeFormatted)       
                if(lastSignatureTimestamp.isBefore(signatureTimeFormatted)){
                    console.log('Yes is Befoe')
                    // Update last signature timsetamp
                    const findAndUpdate = await Merchant.findOneAndUpdate({
                        publicKey: publicKeyLowerCase
                    }, {
                        lastSignatureTimestamp: signatureTimeFormatted
                    });
                    if (findAndUpdate) { 
                        return true
                    } else {
                        throw Boom.badRequest(`Cannot save latest signature timestamp`);
                    }
                } else {
                    throw Boom.badRequest(`Invalid timestamp on Signature`);
                }
            } else {
                throw Boom.badRequest(`Invalid Message on Signature`);
            }        
        }     
    } else {
        throw Boom.badRequest(`Invalid Signature`);
    }
    

    return false;                                            
} 

module.exports =  { validateSignature, middlewareValidateSignature  }
