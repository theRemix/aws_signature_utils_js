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

  /*
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
    });
  */
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
    return encodeURIComponent(plaintext.replace(/~/g, "%7E"));
  },



  // private

  calculate_string_to_sign_v1 : function(args){
    var parameters = args.parameters;

    // exclude any existing Signature parameter from the canonical string
    for (var p in parameters){
      if(p.indexOf(AWSSignatureUtils.SIGNATURE_KEYNAME) === 0){
        delete parameters[p];
      }
    }

    var sorted_pairs = [];
    Object.keys(parameters).sort().forEach(function (v, i) {
      sorted_pairs.push(v + '=' + parameters[v]);
    });

    return sorted_pairs.join("&");
  },

  calculate_string_to_sign_v2 : function(args){
    var parameters = args.parameters;

    var uri = '/';
    if(args.uri !== undefined && args.uri.length > 0){
      uri = args.uri;
    }
    uri = AWSSignatureUtils.urlencode(uri).replace(/\//g, "%2F");

    var verb = args.verb;
    var host = args.host.toLowerCase();


    // exclude any existing Signature parameter from the canonical string
    for (var p in parameters){
      if(p.indexOf(AWSSignatureUtils.SIGNATURE_KEYNAME) === 0){
        delete parameters[p];
      }
    }

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