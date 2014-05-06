/*
  Test the AWSSignatureUtils

*/
'use strict';

var AWSSignatureUtils = require('./aws_signature_utils');

console.log(

  AWSSignatureUtils.sign_parameters({
    aws_secret_key : '12345',
    uri : '',
    verb : '',
    host : '',
    parameters : {
      SignatureVersion : '2',
      SignatureMethod : 'HmacSHA256',
      transactionAmount : '5.00',
      returnURL : 'http%3A%2F%2Fgoogle.dev%2Fpayments%3FPaymentAmount%3D05.00%26Download%3DPrice%26ProductID%3D1183401134535',
      pipelineName : 'SingleUse',
      callerKey : 'D0fwd4k4VasCuf/S/BEHFvphWQGwy0yyT3wVjhxT',
      callerReference : 'Product54321',
      paymentReason : 'Digital Download Payment'
    }
  })

);