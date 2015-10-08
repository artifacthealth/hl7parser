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

var message = hl7parser.create("MSH|^~\&|||||20121031232617||ADT^A04|20381|P|2.3||||NE\rEVN|A04|20121031162617||01\rPID|1|16194|16194||Klemetson^Andrea");
console.log(message.get("PID.5.2")); // prints "Andrea"
```


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
### Message Interface
--------------------
An HL7 message.
* [`addSegment`](#addSegment)
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

<a name="addSegment" />
#### addSegment(path)
Adds a segment to the message.

__Parameters__
* path `string`  - The name of the segment to add (e.g. "PID").

__Returns:__ `Node`


<a name="name" />
#### name
The name of the node.

__Type:__ `string`


<a name="length" />
#### length
The number of child nodes in the node.

__Type:__ `number`


<a name="get" />
#### get(path)
Gets a child node with the given path.

__Parameters__
* path `string | number`  - The path of the child node to retrieve. The path can be a number or string. If the path is a
number, then child node at the specified index is returned.

__Returns:__ `Node`


<a name="set" />
#### set(path, value)
Sets a child node at the given path.

__Parameters__
* path `string`  - The path of the child node to set.
* value `any`  - The value to set at the given path.

__Returns:__ `void`


<a name="exists" />
#### exists(path)
Checks if a child node exists at the given path.

__Parameters__
* path `string | number`  - That path to check.

__Returns:__ `boolean`


<a name="forEach" />
#### forEach(callback)
Iterates through all child nodes, calling the callback for each node. Similar to Array.forEach.

__Parameters__
* callback - The function to call for each child node.

__Returns:__ `void`


<a name="toString" />
#### toString()
Returns a string representation of the node. If the node has child nodes then the raw representation of the
node is returned; otherwise, the value of the node is returned with escape sequences resolved.

__Returns:__ `string`


<a name="toRaw" />
#### toRaw()
Returns the raw string representation of the node, including delimiters and escape sequences.

__Returns:__ `string`


<a name="toArray" />
#### toArray()
Returns all child nodes as an array.

__Returns:__ `Node[]`


<a name="isEmpty" />
#### isEmpty()
Returns true if the node is empty; otherwise, returns false.

__Returns:__ `boolean`


<a name="toDate" />
#### toDate()
Returns the value of the node as a date. If the length of the string is exactly 8, the value is parsed using
the format YYYYMMDD. If the length of the string is >= 14, the value is parsed using the format YYYYMMDDHHMMSS.

__Returns:__ `Date`


<a name="toInteger" />
#### toInteger()
Returns the value of the node as an integer.

__Returns:__ `number`


<a name="toFloat" />
#### toFloat()
Returns the value of the node as a floating point number.

__Returns:__ `number`


<a name="toBoolean" />
#### toBoolean()
Returns the value of the node as a boolean. A value of "Y" is returned as true. A value of "N" is returned
as false. All other values return null.

__Returns:__ `boolean`




<a name="Node" />
### Node Interface
--------------------
A node in an HL7 message. Can represent a message, segment, field, component, or sub-component.
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
The name of the node.

__Type:__ `string`


<a name="length" />
#### length
The number of child nodes in the node.

__Type:__ `number`


<a name="get" />
#### get(path)
Gets a child node with the given path.

__Parameters__
* path `string | number`  - The path of the child node to retrieve. The path can be a number or string. If the path is a
number, then child node at the specified index is returned.

__Returns:__ `Node`


<a name="set" />
#### set(path, value)
Sets a child node at the given path.

__Parameters__
* path `string`  - The path of the child node to set.
* value `any`  - The value to set at the given path.

__Returns:__ `void`


<a name="exists" />
#### exists(path)
Checks if a child node exists at the given path.

__Parameters__
* path `string | number`  - That path to check.

__Returns:__ `boolean`


<a name="forEach" />
#### forEach(callback)
Iterates through all child nodes, calling the callback for each node. Similar to Array.forEach.

__Parameters__
* callback - The function to call for each child node.

__Returns:__ `void`


<a name="toString" />
#### toString()
Returns a string representation of the node. If the node has child nodes then the raw representation of the
node is returned; otherwise, the value of the node is returned with escape sequences resolved.

__Returns:__ `string`


<a name="toRaw" />
#### toRaw()
Returns the raw string representation of the node, including delimiters and escape sequences.

__Returns:__ `string`


<a name="toArray" />
#### toArray()
Returns all child nodes as an array.

__Returns:__ `Node[]`


<a name="isEmpty" />
#### isEmpty()
Returns true if the node is empty; otherwise, returns false.

__Returns:__ `boolean`


<a name="toDate" />
#### toDate()
Returns the value of the node as a date. If the length of the string is exactly 8, the value is parsed using
the format YYYYMMDD. If the length of the string is >= 14, the value is parsed using the format YYYYMMDDHHMMSS.

__Returns:__ `Date`


<a name="toInteger" />
#### toInteger()
Returns the value of the node as an integer.

__Returns:__ `number`


<a name="toFloat" />
#### toFloat()
Returns the value of the node as a floating point number.

__Returns:__ `number`


<a name="toBoolean" />
#### toBoolean()
Returns the value of the node as a boolean. A value of "Y" is returned as true. A value of "N" is returned
as false. All other values return null.

__Returns:__ `boolean`

