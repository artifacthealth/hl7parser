/// <reference path="../typings/node.d.ts"/>

import fs = require("fs");
import Message = require("../src/message");

export function createSiuS12Message(): Message {
    return createHl7Message("SIU_S12");
}

export function createAdtA04Message(): Message {
    return createHl7Message("ADT_A04");
}

export function createHl7Message (filename: string): Message {
    return new Message(getMessageText(filename));
}

export function getMessageText(filename: string): string {
    return prepareText(fs.readFileSync("build/tests/fixtures/" + filename + ".hl7", 'utf8'));
}

function prepareText(text: string): string {

    // check if there are any CR in the message. If not, convert an LF to CR.
    if(text.indexOf("\r") == -1) {
        text = text.replace(/\n/g, "\r");
    }

    return text.trim();
}


