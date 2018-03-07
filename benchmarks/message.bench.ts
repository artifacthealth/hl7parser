/// <reference path="../typings/baseline.d.ts" />
import Message from "../src/message";
import {getMessageText} from "../tests/messageHelper";

suite("Message", () => {

    var messageText = getMessageText("ADT_A04");

    test("parse fields", () => {

        var message = new Message(messageText);

        var value = message.get("MSH.3.1").toString();
        if(!value) throw new Error("Expected value for MSH.3.1");

        var value = message.get("MSH.3.2").toString();
        if(!value) throw new Error("Expected value for MSH.3.2");

        var value = message.get("MSH.3.3").toString();
        if(!value) throw new Error("Expected value for MSH.3.3");

        var value = message.get("MSH.5.1").toString();
        if(!value) throw new Error("Expected value for MSH.5.1");

        var value = message.get("MSH.7.1").toString();
        if(!value) throw new Error("Expected value for MSH.7.1");

        var value = message.get("MSH.9").toString();
        if(!value) throw new Error("Expected value for MSH.9");

        var value = message.get("MSH.9.1").toString();
        if(!value) throw new Error("Expected value for MSH.9.1");

        var value = message.get("MSH.9.2").toString();
        if(!value) throw new Error("Expected value for MSH.9.2");

        var value = message.get("PID.5.1").toString();
        if(!value) throw new Error("Expected value for PID.5.1");

        var value = message.get("PID.5.2").toString();
        if(!value) throw new Error("Expected value for PID.5.2");

        var value = message.get("PID.11.1").toString();
        if(!value) throw new Error("Expected value for PID.11.1");

        var value = message.get("PID.11.3").toString();
        if(!value) throw new Error("Expected value for PID.11.3");

        var value = message.get("PID.11.4").toString();
        if(!value) throw new Error("Expected value for PID.11.4");

        var value = message.get("PID.11.5").toString();
        if(!value) throw new Error("Expected value for PID.11.5");

        var value = message.get("IN1.5.1").toString();
        if(!value) throw new Error("Expected value for IN1.5.1");

        var value = message.get("IN1.7.1").toString();
        if(!value) throw new Error("Expected value for IN1.7.1");

        var value = message.get("GT1.3.2").toString();
        if(!value) throw new Error("Expected value for GT1.3.2");


    });

    test("iterate segments", () => {

        var message = new Message(messageText);
        message.forEach((segment) => {
            if(segment == null) throw new Error("Expected segment.");
        });
    });

});
