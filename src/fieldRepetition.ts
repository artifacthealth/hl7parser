import Node = require('./node');
import Delimiters = require("./delimiters");
import ValueNode = require("./valueNode");
import Component = require("./component");
import NodeBase = require('./nodeBase');

class FieldRepetition extends ValueNode {

    constructor(parent: NodeBase, key: string, text: string) {
        super(parent, key, text, Delimiters.Component);
    }

    read(path: string[]): Node {

        var component = this.children[parseInt(path.shift())-1];
        return component && path.length > 0 ? component.read(path) : component;
    }

    protected writeCore(path: string[], value: string): Node {

        return this.writeAtIndex(path, value, parseInt(path.shift())-1);
    }

    protected pathCore(): string[] {

        return this.parent.path;
    }

    protected createChild(text: string, index: number): Node {

        return new Component(this, (index + 1).toString(), text);
    }
}

export = FieldRepetition;