/// <reference path="../typings/mocha.d.ts"/>
/// <reference path="../typings/chai.d.ts"/>

import { assert } from "chai";
import Message from "../src/message";
import ValueNode from "../src/valueNode";
import Segment from "../src/segment";
import EmptyNode from "../src/emptyNode";
import * as MessageHelper from "./messageHelper";

describe('ValueNode', () => {
    describe('toString()', () => {

        it('should return the full (unparsed) field if the field contains components and a component is not specified in the path', () => {
            var message = MessageHelper.createAdtA04Message();
            assert.equal(message.get("IN1.4").toString(), "Blue Cross of CA^^^^^&176");
        });

        it('should resolve escape sequence if specified path does not contain any child nodes', () => {
            var message = MessageHelper.createSiuS12Message();
            assert.equal(message.get("PV1.3.1").toString(), "Ri~ver Oaks");
        });

        it('should not resolve escape sequence if specified path contains child nodes', () => {
            var message = MessageHelper.createSiuS12Message();
            assert.equal(message.get("PV1.3").toString(), "Ri\\R\\ver Oaks^something");
        });
    });

    describe('toDate', () => {

        it('should convert date in format YYYYMMDD to a Date', () => {
            assert.deepEqual(new Message("MSH|^~\\&|20121031").get("MSH.3").toDate(), new Date(2012, 9, 31, 0, 0, 0));
        });

        it('should convert date in format YYYYMMDDHHMM to a Date', () => {
            assert.deepEqual(new Message("MSH|^~\\&|201210312251").get("MSH.3").toDate(), new Date(2012, 9, 31, 22, 51, 0));
        });

        it('should convert date in format YYYYMMDDHHMMSS to a Date', () => {
            assert.deepEqual(new Message("MSH|^~\\&|20121031225113").get("MSH.3").toDate(), new Date(2012, 9, 31, 22, 51, 13));
        });
    });

    describe('toInteger', () => {

        it('should convert the value to a integer', () => {
            assert.equal(new Message("MSH|^~\\&|1.2").get("MSH.3").toInteger(), 1);
        });
    });

    describe('toFloat', () => {

        it('should convert the value to a float', () => {
            assert.equal(new Message("MSH|^~\\&|1.2").get("MSH.3").toFloat(), 1.2);
        });
    });
});