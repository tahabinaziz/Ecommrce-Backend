/**
 * This function should be used to construct all responses.
 * @param {res} res res object from controller argument.
 * @param {int} statusCode HTTP status code.
 * @param {bool} success boolean representing success.
 * @param {string} message Message for the frontend.
 * @param {obj} data JSON object that will have the response payload.
 */
const sendResponse = function (res, success = true, message = "Ok", data = {}, statusCode = 200) {
    res.status(statusCode).json({
        success: success,
        message: message,
        data: data
    });
}

exports.sendResponse = sendResponse;

/**
 * This function takes a controller, and an object containing the schema of the parameters
 * that the controller expects. Things like the keys that should be present in the body and
 * those that should be sent as query parameters. This function returns a function that wraps the 
 * middleware and calls it only if the incoming request has valid body and query keys.
 * Example object:
 * {
 *  bodyKeys: {
 *      required: {
 *          foo: 'int',
 *          bar: 'string',
 *      },
 *      optional: {
 *          baz: 'boolean'
 *      }
 *  },
 *  queryKeys: {
 *      required: {
 *          foo: 'float',
 *          bar: 'string',
 *      },
 *      optional: {
 *          baz: 'boolean'
 *      }
 *  }
 * }
 * @param {Object} object A js object with two keys 'bodyKeys' and 'queryKeys', that are to be validated.
 * @param {function} originalController The controller that is to be wrapped. 
 */

exports.createControllerWithValidation =  function (validationObject, originalController) {
    /**
     * validation object has the schema:
     * {
     *  bodyKeys: {
     *      required: {
     *          requiredKey1: 'string',
     *          requiredKey2: 'int'
     *      },
     *      optional: {
     *          optionalKey1: 'float'
     *      }
     *  },
     *  queryKeys: {
     *      required: {},
     *      optional: {
     *          optionalKey1: 'boolean'
     *      }
     *  }
     * }
     */

    let ensureCorrectTypes = function(keysToValidateAgainst) {
        allowedTypes = ['int', 'float', 'string', 'boolean', 'object'];
        for(k in keysToValidateAgainst) {
            type = keysToValidateAgainst[k];
            if(allowedTypes.includes(type) == false) {
                throw `${type} is not an allowed type, it must be one of ${allowedTypes}`;
            }
        }
    }

    let bodyKeysToValidateAgainst = 'bodyKeys' in validationObject ? validationObject.bodyKeys: {};
    bodyKeysToValidateAgainst.required = 'required' in bodyKeysToValidateAgainst ? bodyKeysToValidateAgainst.required : {};
    bodyKeysToValidateAgainst.optional = 'optional' in bodyKeysToValidateAgainst ? bodyKeysToValidateAgainst.optional : {};
    ensureCorrectTypes(bodyKeysToValidateAgainst.required);
    ensureCorrectTypes(bodyKeysToValidateAgainst.optional);

    let queryKeysToValidateAgainst = 'queryKeys' in validationObject ? validationObject.queryKeys: {};
    queryKeysToValidateAgainst.required = 'required' in queryKeysToValidateAgainst ? queryKeysToValidateAgainst.required : {};
    queryKeysToValidateAgainst.optional = 'optional' in queryKeysToValidateAgainst ? queryKeysToValidateAgainst.optional : {};
    ensureCorrectTypes(queryKeysToValidateAgainst.required);
    ensureCorrectTypes(queryKeysToValidateAgainst.optional);

    
    /**
     * Validates req object against a reference object.
     * @param {Object} reqObject
     * @param {Object} keysToValidateAgainst
     * keysToValidateAgainst has the following schema:
     *  {
     *      required: {
     *          requiredKey1: 'string',
     *          requiredKey2: 'int'
     *      },
     *      optional: {
     *          optionalKey1: 'float'
     *      }
     *  },
     * NOTE: For 'int' and 'float' types this function will also try to convert to int or float.
     */
    let validateFields = function (reqObject, keysToValidateAgainst) {
        // DEBUG LOGS.
        //console.log(reqObject);
        //console.log("************");
        //console.log(keysToValidateAgainst);
        // 1) check if all requried keys are present in the request
        // and that the types match.
        for(k in keysToValidateAgainst.required) {
            // If the required key is not present
            // return false. Else, we check the type.
            if(!k in reqObject){
                // console.log(`Required key ${k} not found`);
                return false;
            } else {
                let typeOfKey = typeof(reqObject[k]);
                let typeThatsRequired = keysToValidateAgainst.required[k];

                // If the required type is int or float, try converting first.
                if(typeThatsRequired == 'int') {
                    reqObject[k] = parseInt(reqObject[k]);
                    typeOfKey = isNaN(reqObject[k]) ? 'nan' : typeof(reqObject[k]);
                }
                else if(typeThatsRequired == 'float') {
                    reqObject[k] = parseFloat(reqObject[k]);
                    typeOfKey = isNaN(reqObject[k]) ? 'nan' : typeof(reqObject[k]);
                }

                if( typeOfKey != typeThatsRequired ) {
                    // we assume number == int == float. So for this
                    // condition we will not return false.
                    if(typeOfKey == 'number' && ['int', 'float'].includes(typeThatsRequired))
                        continue;
                    // console.log(`Type of key ${k} is wrong: ${typeOfKey}`);
                    return false;
                }
            }
        }

        // 2) For all the optional keys present check if they have the correct type.
        for(k in keysToValidateAgainst.optional) {
            if(k in reqObject){
                let typeOfKey = typeof(reqObject[k]);
                let typeThatsRequired = keysToValidateAgainst.optional[k];

                // If the required type is int or float, try converting first.
                if(typeThatsRequired == 'int') {
                    reqObject[k] = parseInt(reqObject[k]);
                    typeOfKey = isNaN(reqObject[k]) ? 'nan' : typeof(reqObject[k]);
                }
                else if(typeThatsRequired == 'float') {
                    reqObject[k] = parseFloat(reqObject[k]);
                    typeOfKey = isNaN(reqObject[k]) ? 'nan' : typeof(reqObject[k]);
                }
                // console.log(`Comparing ${typeOfKey} ${typeThatsRequired}`);

                if( typeOfKey != typeThatsRequired ) {
                    // we assume number == int == float. So for this
                    // condition we will not return false.
                    if(typeOfKey == 'number' && ['int', 'float'].includes(typeThatsRequired))
                        continue;
                    // console.log(typeThatsRequired);
                    // console.log(`Type of key ${k} is wrong: ${typeOfKey}`);
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * This is the function that we return.
     * @param {*} req 
     * @param {*} res 
     */
    let functionToReturn = async function (req, res) {
        let bodyKeysValid = validateFields(req.body, bodyKeysToValidateAgainst);
        if(bodyKeysValid == false) {
            sendResponse(res, false, `Keys in the body require the following schema: ${JSON.stringify(bodyKeysToValidateAgainst)}`, {});
            return;
        }
        
        let queryKeysValid = validateFields(req.query, queryKeysToValidateAgainst);
        if(queryKeysValid == false) {
            sendResponse(res, false, `Keys for the url have the following schema: ${JSON.stringify(queryKeysToValidateAgainst)}`, {});
            return;
        }
        
        return await originalController(req, res);

    }

    return functionToReturn;
}
