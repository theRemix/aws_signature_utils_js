/*
  This class is used to generate signatures for
    Amazon Flexible Payment Service

  About Amazon FPS Signatures
    http://docs.aws.amazon.com/AmazonFPS/2010-08-28/FPSAggregatedGuide/APPNDX_GeneratingaSignature.html

  To use:
    AWSSignatureUtils.sign_parameters(aws_params)

  where aws_params has at least these params:

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

    and optional params from http://docs.aws.amazon.com/AmazonFPS/2010-08-28/FPSBasicGuide/GenericParameters.html

  see test.js for an example
    https://github.com/theRemix/aws_signature_utils_js/blob/master/test.js

*/
'use strict';

var crypto = require('crypto'),

AWSSignatureUtils = {

  AWS_SECRET_KEY_NAME : "aws_secret_key",
  SIGNATURE_KEYNAME : "Signature",
  SIGNATURE_METHOD_KEYNAME : "SignatureMethod",
  SIGNATURE_VERSION_KEYNAME : "SignatureVersion",
  HMAC_SHA256_ALGORITHM : "HmacSHA256",
  HMAC_SHA1_ALGORITHM : "HmacSHA1",

  // public
  
  sign_parameters : function(args){
    var signature_version = args.parameters[AWSSignatureUtils.SIGNATURE_VERSION_KEYNAME];
    var string_to_sign = "";
    var algorithm = 'sha1';
    if (signature_version == '1') {
      string_to_sign = AWSSignatureUtils.calculate_string_to_sign_v1(args);
    } else if (signature_version == '2') {
      algorithm = AWSSignatureUtils.get_algorithm(args.parameters[AWSSignatureUtils.SIGNATURE_METHOD_KEYNAME]);
      string_to_sign = AWSSignatureUtils.calculate_string_to_sign_v2(args);
    } else {
      throw "Invalid Signature Version specified";
    }
    
    return AWSSignatureUtils.compute_signature(string_to_sign, args[AWSSignatureUtils.AWS_SECRET_KEY_NAME], algorithm);
  },

  // Convert a string into URL encoded form.
  urlencode : function(plaintext){
    return encodeURIComponent(plaintext).replace(/~/g, "%7E"); // encodeURI(plaintext.replace(/~/g, "%7E"); //.replace(/\//g, "%2F"));
  },

  // private

  calculate_string_to_sign_v1 : function(args){
    var parameters = args.parameters;

    // exclude any existing Signature parameter from the canonical string
    if(parameters.hasOwnProperty(AWSSignatureUtils.SIGNATURE_KEYNAME)){
      delete parameters[AWSSignatureUtils.SIGNATURE_KEYNAME];
    }
    
    var sorted_pairs = [];
    Object.keys(parameters).sort().forEach(function (v, i) {
      sorted_pairs.push(v + '=' + parameters[v]);
    });

    return sorted_pairs.join("&");
  },

  calculate_string_to_sign_v2 : function(args){
    var parameters = args.parameters;

    // exclude any existing Signature parameter from the canonical string
    if(parameters.hasOwnProperty(AWSSignatureUtils.SIGNATURE_KEYNAME)){
      delete parameters[AWSSignatureUtils.SIGNATURE_KEYNAME];
    }

    var uri = '/';
    if(args.uri !== undefined && args.uri.length > 0){
      uri = args.uri;
    }
    uri = encodeURI(uri);

    var verb = args.verb;
    var host = args.host.toLowerCase();

    var canonical = verb + "\n" + host + "\n" + uri + "\n";
    
    var sorted_pairs = [];
    Object.keys(parameters).sort().forEach(function (v, i) {
      sorted_pairs.push(AWSSignatureUtils.urlencode(v) + '=' + AWSSignatureUtils.urlencode(parameters[v]));
    });

    return canonical + sorted_pairs.join("&");

  },

  get_algorithm : function(signature_method){
    if (signature_method == AWSSignatureUtils.HMAC_SHA256_ALGORITHM){
      return 'sha256';
    } else {
      return 'sha1';
    }
  },

  compute_signature : function(canonical, aws_secret_key, algorithm){
    algorithm = algorithm  || 'sha1';

    var hmac = crypto.createHmac(algorithm, aws_secret_key);
    hmac.update(canonical);

    return hmac.digest('base64');
  }

};

module.exports = AWSSignatureUtils;