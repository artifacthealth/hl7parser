import Node = require('./node');
import Delimiters = require("./delimiters");
import ValueNode = require("./valueNode");
import NodeBase = require('./nodeBase');

class SubComponent extends ValueNode {

    constructor(parent: NodeBase, key: string, text: string) {
        super(parent, key, text);
    }

    toString(): string {
        return this.message.unescape(this.toRaw());
    }

    isEmpty(): boolean {
        return !this.toString();
    }
}

export = SubComponent;