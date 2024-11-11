const fetch = require('node-fetch')
const { Core } = require('@adobe/aio-sdk')
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs } = require('../utils')

async function main(params) {
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' });
  
  try {
    logger.info('------');
    logger.info(params);
    logger.info('------');
    const requiredParams = ['aemHost', 'sku', 'fragmentPath', 'modelPath'];
    const requiredHeaders = ['Authorization']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    if (errorMessage) {
      return errorResponse(400, errorMessage, logger)
    }

    const { aemHost, sku, fragmentPath, modelPath } = params;
    const token = getBearerToken(params)
    const apiEndpoint = `${aemHost}${fragmentPath}`;

    logger.info(sku);

    const elements = {
      "properties": {
        "cq:model": modelPath,
        "elements": {
          "productSku": {
            "value": sku
          }
        }
      }
    }

    const update = await fetch(apiEndpoint, {
      method: 'put',
      body: JSON.stringify(elements),
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const response = {
      statusCode: 200,
      body: update
    }

    // log the response status code
    logger.info(`${response.statusCode}: successful request`)
    return response
  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    return errorResponse(500, 'server error', logger)
  }
}

exports.main = main