[![Build Status](https://travis-ci.org/artifacthealth/hl7parser.svg?branch=master)](https://travis-ci.org/artifacthealth/hl7parser)

# HL7Parser

HL7Parser is a CommonJS module for working with [HL7 2.x](https://en.wikipedia.org/wiki/Health_Level_7) messages.


## Table of contents

* [`Installation`](#installation)
* [`Examples`](#Examples)
* [`Documentation`](#Documentation)


<a name="installation" />
## Installation

HL7Parser can be installed using [npm](https://www.npmjs.com/):

```
$ npm install hl7parser --save
```


## Examples

Parse an HL7 message.
```
var hl7parser = require("hl7parser");

var message = hl7parser.create("MSH|^~\&|||||20121031232617||ADT^A04|20381|P|2.3||||NE\rEVN|A04|20121031162617||01\rPID|1|16194|16194||Jones^Bob");
console.log(message.get("PID.5.2")); // prints "Bob"
```

See the [tests](https://github.com/artifacthealth/hl7parser/blob/master/tests/message.tests.ts) for more examples.


## Documentation

<a name="hl7parser" />
## "hl7parser" Module
--------------------
* [`create`](#create)
* [`Message`](#Message)
* [`Node`](#Node)


<a name="create" />
### create(text)
Creates a new HL7 message. If the message text is not specified, an empty HL7 message is created.

__Parameters__
* text `string`  - Optional. The text to parse.

__Returns:__ `Message`



<a name="Message" />
### Message Interface extends [`Node`](#Node)
--------------------
An HL7 message.
* [`addSegment`](#addSegment)
* [`length`](#length)
* [`get`](#get)
* [`set`](#set)
* [`exists`](#exists)
* [`forEach`](#forEach)
* [`toString`](#toString)
* [`toArray`](#toArray)

<a name="addSegment" />
#### addSegment(path)
Adds a segment to the Message and returns the segment Node.

__Parameters__
* path `string`  - The name of the segment to add (e.g. "PID").

__Returns:__ `Node`


<a name="length" />
#### length
The number of segments in the Message.

__Type:__ `number`


<a name="get" />
#### get(path)
Gets a child Node with the given path.

__Parameters__
* path `string | number`  - The path of the child Node to retrieve. The path can be a number or string. If the path is a
number, then child Node at the specified index is returned.

__Returns:__ `Node`


<a name="set" />
#### set(path, value)
Sets a child Node at the given path.

__Parameters__
* path `string`  - The path of the child Node to set.
* value `any`  - The value to set at the given path.

__Returns:__ `void`


<a name="exists" />
#### exists(path)
Checks if a child Node exists at the given path.

__Parameters__
* path `string | number`  - That path to check.

__Returns:__ `boolean`


<a name="forEach" />
#### forEach(callback)
Iterates through all segments, calling the callback for each segment. Similar to Array.forEach.

__Parameters__
* callback - The function to call for each child Node.

__Returns:__ `void`


<a name="toString" />
#### toString()
Returns the string representation of the Message.

__Returns:__ `string`


<a name="toArray" />
#### toArray()
Returns all segments as an array.

__Returns:__ `Node[]`


<a name="Node" />
### Node Interface
--------------------
A Node in an HL7 message. Can represent a message, segment list, segment, field, field repetition, component, or sub-component.
* [`name`](#name)
* [`length`](#length)
* [`get`](#get)
* [`set`](#set)
* [`exists`](#exists)
* [`forEach`](#forEach)
* [`toString`](#toString)
* [`toRaw`](#toRaw)
* [`toArray`](#toArray)
* [`isEmpty`](#isEmpty)
* [`toDate`](#toDate)
* [`toInteger`](#toInteger)
* [`toFloat`](#toFloat)
* [`toBoolean`](#toBoolean)

<a name="name" />
#### name
The name of the Node.

__Type:__ `string`


<a name="length" />
#### length
The number of child Nodes in the Node.

__Type:__ `number`


<a name="get" />
#### get(path)
Gets a child Node with the given path.

__Parameters__
* path `string | number`  - The path of the child Node to retrieve. The path can be a number or string. If the path is a
number, then child Node at the specified index is returned.

__Returns:__ `Node`


<a name="set" />
#### set(path, value)
Sets a child Node at the given path.

__Parameters__
* path `string`  - The path of the child Node to set.
* value `any`  - The value to set at the given path.

__Returns:__ `void`


<a name="exists" />
#### exists(path)
Checks if a child Node exists at the given path.

__Parameters__
* path `string | number`  - That path to check.

__Returns:__ `boolean`


<a name="forEach" />
#### forEach(callback)
Iterates through all child Nodes, calling the callback for each Node. Similar to Array.forEach.

__Parameters__
* callback - The function to call for each child Node.

__Returns:__ `void`


<a name="toString" />
#### toString()
Returns a string representation of the Node. If the Node has child Nodes then the raw representation of the
Node is returned; otherwise, the value of the Node is returned with escape sequences resolved.

__Returns:__ `string`


<a name="toRaw" />
#### toRaw()
Returns the raw string representation of the Node, including delimiters and escape sequences.

__Returns:__ `string`


<a name="toArray" />
#### toArray()
Returns all child Nodes as an array.

__Returns:__ `Node[]`


<a name="isEmpty" />
#### isEmpty()
Returns true if the Node is empty; otherwise, returns false.

__Returns:__ `boolean`


<a name="toDate" />
#### toDate()
Returns the value of the Node as a date. If the length of the string is exactly 8, the value is parsed using
the format YYYYMMDD. If the length of the string is >= 14, the value is parsed using the format YYYYMMDDHHMMSS.

__Returns:__ `Date`


<a name="toInteger" />
#### toInteger()
Returns the value of the Node as an integer.

__Returns:__ `number`


<a name="toFloat" />
#### toFloat()
Returns the value of the Node as a floating point number.

__Returns:__ `number`


<a name="toBoolean" />
#### toBoolean()
Returns the value of the Node as a boolean. A value of "Y" is returned as true. A value of "N" is returned
as false. All other values return null.

__Returns:__ `boolean`

