import Node = require('./node');
import Delimiters = require("./delimiters");
import ValueNode = require("./valueNode");
import SubComponent = require("./subComponent");
import NodeBase = require('./nodeBase');

class Component extends ValueNode {

    constructor(parent: NodeBase, key: string, text: string) {
        super(parent, key, text, Delimiters.SubComponent);
    }

    read(path: string[]): Node {

        return this.children[parseInt(path.shift())-1];
    }

    protected writeCore(path: string[], value: string): void {

        this.writeAtIndex(path, value, parseInt(path.shift())-1);
    }

    protected createChild(text: string, index: number): Node {

        return new SubComponent(this, (index + 1).toString(), text);
    }
}

export = Component;