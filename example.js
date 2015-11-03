var hl7parser = require("hl7parser");

var message = hl7parser.create("MSH|^~\&|||||20121031232617||ADT^A04|20381|P|2.3||||NE\rEVN|A04|20121031162617||01\rPID|1|16194|16194||Jones^Bob");
console.log(message.get("PID.5.2").toString());