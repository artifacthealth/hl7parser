/// <reference path="../typings/mocha.d.ts"/>
/// <reference path="../typings/chai.d.ts"/>

import { assert } from "chai";
import Message from "../src/message";
import Segment from "../src/segment";
import EmptyNode from "../src/emptyNode";
import * as MessageHelper from "./messageHelper";

describe('Message', () => {

    describe('set', () => {

        it("should accept a number as a value", () => {

            var message = new Message();
            message.set("PV1.1", 1);
            assert.equal(message.toString(), "MSH|^~\\&\rPV1|1");
        });

        it('should accept a Date without time as a value', () => {

            var message = new Message();
            message.set("PV1.1", new Date(2012, 9, 31));
            assert.equal(message.toString(), "MSH|^~\\&\rPV1|20121031");
        });

        it('should accept a Date with time as a value', () => {

            var message = new Message();
            message.set("PV1.1", new Date(2012, 9, 31, 22, 51, 13));
            assert.equal(message.toString(), "MSH|^~\\&\rPV1|20121031225113");
        });

        it('should accept a float as a value', () => {

            var message = new Message();
            message.set("PV1.1", 1.2);
            assert.equal(message.toString(), "MSH|^~\\&\rPV1|1.2");
        });

        it('should accept a boolean as a value', () => {

            var message = new Message();
            message.set("PV1.1", true);
            assert.equal(message.toString(), "MSH|^~\\&\rPV1|Y");
            message.set("PV1.1", false);
            assert.equal(message.toString(), "MSH|^~\\&\rPV1|N");
        });

        it('should set the specified field', () => {
            var message = new Message();
            message.set("PID.4", "1273462894723");
            assert.equal(message.toString(), "MSH|^~\\&\rPID||||1273462894723");
        });

        it('should be able to set more than one field on the same segment', () => {
            var message = new Message();
            message.set("PID.4", "1273462894723");
            message.set("PID.10", "TEST");
            assert.equal(message.toString(), "MSH|^~\\&\rPID||||1273462894723||||||TEST");
        });

        it('should set the specified component', () => {
            var message = new Message();
            message.set("PV1.7.2", "Jones");
            assert.equal(message.toString(), "MSH|^~\\&\rPV1|||||||^Jones");
        });

        it.skip('should set the correct component when given a known symbol', () => {
            var message = new Message();
            message.set(':message_type', "SIU");
            message.set(':message_event_type', "S12");
            assert.equal(message.toString(), "MSH|^~\\&||||||||SIU^S12");
        });

        it('should be able to set more that one component on the same field', () => {
            var message = new Message();
            message.set("PV1.7.2", "Jones");
            message.set("PV1.7.3", "John");
            assert.equal(message.toString(), "MSH|^~\\&\rPV1|||||||^Jones^John");
        });

        it('should be able to set repeating fields', () => {

            var message = new Message();
            message.set('PID.3').set(0).set('PID.3.1', 'abc');
            message.set('PID.3').set(0).set('PID.3.5', 'MRN');
            message.set('PID.3').set(1).set('PID.3.1', 123);
            message.set('PID.3').set(1).set('PID.3.5', 'ID');
            assert.equal(message.toString(), "MSH|^~\\&\rPID|||abc^^^^MRN~123^^^^ID");
        });

        it('can chain component setters', () => {
            var message = new Message();
            message.set("PV1.7").set(0).set("PV1.7.2", "Jones").set("PV1.7.3", "John");
            message.set("PV1.7").set(1).set("PV1.7.2", "Smith").set("PV1.7.3", "Bob");
            assert.equal(message.toString(), "MSH|^~\\&\rPV1|||||||^Jones^John~^Smith^Bob");
        });

        it('can chain component setters with numeric indexers', () => {
            var message = new Message();
            message.set("PV1.7").set(0).set(1, "Jones").set(2, "John");
            message.set("PV1.7").set(1).set(1, "Smith").set(2, "Bob");
            assert.equal(message.toString(), "MSH|^~\\&\rPV1|||||||^Jones^John~^Smith^Bob");
        });

        it('can set field component by number', () => {
            var message = new Message();
            message.set("PV1.7").set(0).set(1, "Jones").set(2, "John");
            assert.equal(message.toString(), "MSH|^~\\&\rPV1|||||||^Jones^John");
        });

        it('can set field component by number and array', () => {
            var message = new Message();
            message.set("PV1.7").set(0, ["", "Jones", "John"]).set(1, ["", "Smith", "Bob"]);
            assert.equal(message.toString(), "MSH|^~\\&\rPV1|||||||^Jones^John~^Smith^Bob");
        });

        it('throws error if chained path is not a sub-path of current node', () => {
            var message = new Message();

            assert.throw(() => {
                message.set("PV1.7").set(0, ["", "Jones", "John"]).set("PV1.7").set(1, ["", "Smith", "Bob"]);

            }, "'PV1,7' is not a sub-path of 'PV1,7'");
        });

        it('can set segment by name', () => {
            var message = new Message();
            message.set("PV1").set("PV1.7.2", "Jones").set("PV1.7.3", "John");
            assert.equal(message.toString(), "MSH|^~\\&\rPV1|||||||^Jones^John");
        });

        it('flags parent as dirty when child is directly modified', () => {

            var message = new Message();
            message.get(0).set("MSH.3", "Test");
            assert.equal(message.toString(), "MSH|^~\\&|Test");
        });

        it('can set a segment by number if it already exists', () => {

            var message = new Message();
            message.set(0).set("MSH.3", "Test");
            assert.equal(message.toString(), "MSH|^~\\&|Test");
        });

        it('cannot set a segment by index if it does not already exist', () => {

            var message = new Message();

            assert.throw(() => {
                message.set(1).set("PV1.7.3", "John");

            }, "Segment must have a name.");
        });

        it('should set the specified sub-component', () => {
            var message = new Message();
            message.set("PV1.7.9.3", "UPIN");
            assert.equal(message.toString(), "MSH|^~\\&\rPV1|||||||^^^^^^^^&&UPIN");
        });

        it('should be able to set more than one sub-component on the same component', () => {
            var message = new Message();
            message.set("PV1.7.9.3", "UPIN");
            message.set("PV1.7.9.1", "TEST");
            assert.equal(message.toString(), "MSH|^~\\&\rPV1|||||||^^^^^^^^TEST&&UPIN");
        });

        it('should property escape string values', () => {
            var message = new Message();
            message.set("PV1.1", "|^~\\&");
            assert.equal(message.toString(), "MSH|^~\\&\rPV1|\\F\\\\S\\\\R\\\\E\\\\T\\");
        });

        it('should parse array to assign multiple fields by index', () => {
            var message = new Message();

            message.set("PV1", [1, 2, 3]);
            assert.equal(message.toString(), "MSH|^~\\&\rPV1|1|2|3");
        });

        it('should parse array to assign multiple components by index', () => {
            var message = new Message();

            // example - shortcut to assign all components of the patient name
            message.set("PID.5", ["Jones", "Bob", "C", "Jr."]);
            assert.equal(message.toString(), "MSH|^~\\&\rPID|||||Jones^Bob^C^Jr.");
        });

        it('should parse nested arrays to assign fields and components', () => {
            var message = new Message();
            message.set("PV1", [1, 2, 3, [4, 5, 6]]);
            assert.equal(message.toString(), "MSH|^~\\&\rPV1|1|2|3|4^5^6");
        });

        it("treats null as empty value", () => {

            var message = new Message();
            message.set("PV1.1", null);
            message.set("PV1.2", "something");
            assert.equal(message.toString(), "MSH|^~\\&\rPV1||something");
        });

        it("treats undefined as empty value", () => {

            var message = new Message();
            message.set("PV1.1", undefined);
            message.set("PV1.2", "something");
            assert.equal(message.toString(), "MSH|^~\\&\rPV1||something");
        });
    });

    describe('addSegment', () => {

        it('should add a segment with the give name to the message', () => {

            var message = new Message();

            // try adding two segments and using the result to assign fields
            var segment = message.addSegment("IN1");
            segment.set("IN1.1", 1);

            segment = message.addSegment("IN1");
            segment.set("IN1.1", 2);

            // add a third segment and then index directly on message
            message.addSegment("IN1");
            message.get("IN1").get(2).set("IN1.1", 3);

            assert.equal(message.toString(), "MSH|^~\\&\rIN1|1\rIN1|2\rIN1|3");
        });
    });
    
    describe('get', () => {
        it('should return specified segment', () => {
            var message = MessageHelper.createSiuS12Message();
            assert.equal(message.get("PV1").name, "PV1");
        });

        it('should return specified field', () => {
            var message = MessageHelper.createSiuS12Message();
            var field = message.get("PID.4");
            assert.equal(field.toString(), "1273462894723");
        });

        it('should use \r as the segment separator', () => {
            var message = new Message("MSH|^~\\&|\rPID|1");
            assert.equal(message.get("PID.1").toString(), '1');
        });

        it.skip('should return specified field when given a known symbol', () => {
            var message = MessageHelper.createSiuS12Message();
            assert.equal(message.get(":message_event_type").toString(), "S12");
        });

        it('should resolve relative paths', () => {
            var message = MessageHelper.createSiuS12Message();
            assert.equal(message.get("PID.5").get(".2").toString(), "Meir");
        });

        it.skip('should raise error if specified symbol is not known', () => {
            assert.throw(() => { new Message("MSH|^~\\&|").get(":some_symbol") }, "Unknown symbol 'some_symbol'.");
        });

        it('should return specified component', () => {
            var message = MessageHelper.createSiuS12Message();
            assert.equal(message.get("PV1.7.2").toString(), "Jones");
        });

        it('should return specified sub-component', () => {
            var message = MessageHelper.createSiuS12Message();
            assert.equal(message.get("PV1.7.9.3").toString(), "UPIN");
        });

        it('should handle implied component if explicit component does not exists', () => {
            var message = MessageHelper.createSiuS12Message();
            assert.equal(message.get("PID.4.1").toString(), "1273462894723");
        });

        it('should handle implied sub-component if explicit sub-component does not exists', () => {
            var message = MessageHelper.createSiuS12Message();
            assert.equal(message.get("PID.4.1.1").toString(), "1273462894723");
        });

        it('should resolve path using first segment if more than one segment exists', () => {
            var message = MessageHelper.createAdtA04Message();
            assert.equal(message.get("IN1.4.1").toString(), "Blue Cross of CA");
        });

        it('should return a list of segments for the specified segment name', () => {
            var message = MessageHelper.createAdtA04Message();

            var count = 0;
            message.get("IN1").forEach((segment: Segment) => {
                assert.equal(segment.name, "IN1");
                count++;
            });

            assert.equal(count, 2);
        });

        it('should return a list of fields if field specified in the path is repeated', () => {
            var message = MessageHelper.createSiuS12Message();

            var count = 0;

            message.get("PV1.7").forEach((field) => {
                assert.equal(field.get("PV1.7.1").toString(), count == 0 ? "448" : "550");
                count++;
            });

            assert.equal(count, 2);
        });

        it('should use delimiters specified in message header even if non-standard', () => {
            var message = new Message("MSH:-+?*:field2:field3component1-field3component2:field4repeat1+field4repeat2:field5subcomponent1*field5subcomponent2:field6?R?");

            assert.equal(message.get("MSH.3").toString(), "field2");
            assert.equal(message.get("MSH.4.2").toString(), "field3component2");
            assert.equal(message.get("MSH.5").get(0).toString(), "field4repeat1");
            assert.equal(message.get("MSH.5").get(1).toString(), "field4repeat2");
            assert.equal(message.get("MSH.6.1").toString(), "field5subcomponent1*field5subcomponent2");
            assert.equal(message.get("MSH.6.1.2").toString(), "field5subcomponent2");
            assert.equal(message.get("MSH.7").toString(), "field6+");
        });

        it('should return field separator for MSH.1', () => {
            assert.equal(new Message("MSH|^~\\&|field3|").get("MSH.1").toString(), "|");
        });

        it('should return encoding characters for MSH.2', () => {
            assert.equal(new Message("MSH|^~\\&|field3|").get("MSH.2").toString(), "^~\\&");
        });

        it('should resolve escape sequence for repeat character', () => {
            assert.equal(new Message("MSH|^~\\&|\\R\\").get("MSH.3").toString(), "~");
        });

        it('should resolve escape sequence for escape character', () => {
            assert.equal(new Message("MSH|^~\\&|\\E\\").get("MSH.3").toString(), "\\");
        });

        it('should resolve escape sequence for field character', () => {
            assert.equal(new Message("MSH|^~\\&|\\F\\").get("MSH.3").toString(), "|");
        });

        it('should resolve escape sequence for component character', () => {
            assert.equal(new Message("MSH|^~\\&|\\S\\").get("MSH.3").toString(), "^");
        });

        it('should resolve escape sequence for sub-component character', () => {
            assert.equal(new Message("MSH|^~\\&|\\T\\").get("MSH.3").toString(), "&");
        });

        it('should remove start highlight escape sequence', () => {
            assert.equal(new Message("MSH|^~\\&|A\\H\\B").get("MSH.3").toString(), "AB");
        });

        it('should remove end highlight escape sequence', () => {
            assert.equal(new Message("MSH|^~\\&|A\\N\\B").get("MSH.3").toString(), "AB");
        });

        it('should return EmptyNode if path is not found', () => {
            var message = new Message("MSH|^~\\&|");
            assert.instanceOf(message.get("MSH.19"), EmptyNode);
            assert.instanceOf(message.get("PV1"), EmptyNode);
            assert.instanceOf(message.get("PV1").get(0), EmptyNode);
        });

        it('should return EmptyNode for out-of-range indexes', () => {
            var message = new Message("MSH|^~\\&|");
            assert.instanceOf(message.get(10), EmptyNode);
            assert.instanceOf(message.get("PV1").get(10), EmptyNode);
        });

        it('should resolve escape sequence for hex character sequence', () => {
            var field = new Message("MSH|^~\\&|\\X0D\\").get("MSH.3");
            assert.equal(field.toString(), "\r");
        });

        it('should pass through invalid escape sequences', () => {
            assert.equal(new Message("MSH|^~\\&|\\a\\").get("MSH.3").toString(), "\\a\\");
        });


        it('should build the MSH correctly', () => {
            // This uses the header from a sample message we received from Cedars
            var date = new Date(2015, 2, 31, 10, 56, 55);
            var message = new Message();
            message.set("MSH.3.1", "SendingApp");
            message.set("MSH.4.1", "SendingFacility");
            message.set("MSH.5.1", "ReceivingApp");
            message.set("MSH.6.1", "ReceivingFacility");
            message.set("MSH.7.1", date);
            message.set("MSH.9.1", "ORU");
            message.set("MSH.9.2", "R01");
            message.set("MSH.10.1", 'R01.11025');
            message.set("MSH.11.1", 'P');
            message.set("MSH.12.1", '2.4');
            assert.equal(message.toString(), "MSH|^~\\&|SendingApp|SendingFacility|ReceivingApp|ReceivingFacility|20150331105655||ORU^R01|R01.11025|P|2.4");
        });

        it('should read the values back in the correct order', () => {
            var date = new Date(1971, 0, 1);
            var message = new Message();
            message.set("MSH.3.1", "SendingApp");
            message.set("MSH.4.1", "SendingFacility");
            message.set("MSH.5.1", "ReceivingApp");
            message.set("MSH.6.1", "ReceivingFacility");
            message.set("MSH.7.1", date);
            message.set("MSH.9.1", "ORU");
            message.set("MSH.9.2", "R01");

            assert.equal(message.get("MSH.3.1").toString(), "SendingApp");
            assert.equal(message.get("MSH.4.1").toString(), "SendingFacility");
            assert.equal(message.get("MSH.5.1").toString(), "ReceivingApp");
            assert.equal(message.get("MSH.6.1").toString(), "ReceivingFacility");
            assert.equal(message.get("MSH.7.1").toString(), "19710101");
            assert.equal(message.get("MSH.9").toString(), "ORU^R01");
            assert.equal(message.get("MSH.9.1").toString(), 'ORU');
            assert.equal(message.get("MSH.9.2").toString(), "R01");
        });
    });

    describe('exists', () => {

        it('returns true if specified path exists', () => {

            var message = new Message("MSH|^~\\&|value\rPV1|");
            assert.isTrue(message.exists("MSH.3"));
            assert.isTrue(message.exists("PV1"));
        });

        it('returns false if specified path does not exists', () => {

            var message = new Message("MSH|^~\\&|value");
            assert.isFalse(message.exists("MSH.4"));
            assert.isFalse(message.exists("PV1"));
        });
    });

});