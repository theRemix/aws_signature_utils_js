AWS Signature Utils
======================

Generate Signature for AWS Amazon Flexible Payment System

Ported from the aws examples here:
  http://docs.aws.amazon.com/AmazonFPS/2010-08-28/FPSAdvancedGuide/APPNDX_CodeSamples.html

The AWSSignatureUtils class is used to generate signatures for
  Amazon Flexible Payment Service

About Amazon FPS Signatures
  http://docs.aws.amazon.com/AmazonFPS/2010-08-28/FPSAggregatedGuide/APPNDX_GeneratingaSignature.html

To use:
```
var AWSSignatureUtils = require('./aws_signature_utils');

var aws_params = {...}

AWSSignatureUtils.sign_parameters(aws_params)
```

where aws_params has at least these properties:

```
  var aws_params = {
    aws_endpoint : '',
    aws_secret_key : '',
    uri : '',
    verb : '',
    host : '',
    parameters : {
      signatureVersion : '',
      signatureMethod : '',
      accessKey : ''
    }
  };
```

  and optional params from http://docs.aws.amazon.com/AmazonFPS/2010-08-28/FPSBasicGuide/GenericParameters.html

see test.js for an example
  https://github.com/theRemix/aws_signature_utils_js/blob/master/test.js

## Run the test

```
node test
```

output

```
Params : {
  "aws_endpoint": "authorize.payments-sandbox.amazon.com",
  "aws_secret_key": "07KU2wnQ2fVt2+68HULd7mxNOCsAQ5kGeb8W6M1J",
  "uri": "/pba/paypipeline",
  "verb": "POST",
  "host": "authorize.payments-sandbox.amazon.com",
  "parameters": {
    "signatureVersion": "2",
    "signatureMethod": "HmacSHA256",
    "accessKey": "AKIAIFISVTBPH7PECMJQ",
    "amount": "USD 50.0",
    "description": "Test Product Description",
    "referenceId": "test-reference123",
    "immediateReturn": "0",
    "returnUrl": "http://localhost/purchase/thank_you",
    "abandonUrl": "http://localhost/purchase/cancel.html",
    "processImmediate": "1",
    "ipnUrl": "http://localhost/purchase/ipn",
    "cobrandingStyle": "logo"
  }
}
Generated Signature : NJMRrvO7N8KH4fpQJS927wRiGRX0kCsCx5lTjb9zW/o=
```