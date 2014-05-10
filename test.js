/*
  Test the AWSSignatureUtils
  Demonstrates how to generate a signature
    for Amazon Flexible Payments Service
  
*/
'use strict';

var AWSSignatureUtils = require('./aws_signature_utils');

var aws_config = {
  /*
    endpoint determines if sandbox || production
      
    sandbox endpoint : 
      authorize.payments-sandbox.amazon.com
    production endpoint :
      authorize.payments.amazon.com
    
    Use same access key and secret key for both sandbox or production
  */
  "endpoint" : "authorize.payments-sandbox.amazon.com",
  "access_key_id" : "AKIAIFISVTBPH7PECMJQ",
  "secret_access_key" : "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"
};

var aws_params = {
  aws_endpoint : aws_config.endpoint,
  aws_secret_key : aws_config.secret_access_key,
  uri : '/pba/paypipeline',
  verb : 'POST',
  host : aws_config.endpoint,
  parameters : {
    signatureVersion : '2',
    signatureMethod : 'HmacSHA256',
    accessKey : aws_config.access_key_id,

    amount : 'USD 50.0',
    description : 'Test Product Description',
    referenceId : 'test-reference123',
    immediateReturn : '0',
    returnUrl : 'http://localhost/purchase/thank_you',
    abandonUrl : 'http://localhost/purchase/cancel.html',
    processImmediate : '1',
    ipnUrl : 'http://localhost/purchase/ipn',
    cobrandingStyle : 'logo'
    
  }
};

process.stdout.write(
  'Params : ' + JSON.stringify(aws_params, null, 2) + '\n' +
  'Generated Signature : ' + AWSSignatureUtils.sign_parameters(aws_params)+'\n');