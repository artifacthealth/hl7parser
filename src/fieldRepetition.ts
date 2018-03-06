import Node from './node';
import Delimiters from "./delimiters";
import ValueNode from "./valueNode";
import Component from "./component";
import NodeBase from './nodeBase';

export default class FieldRepetition extends ValueNode {

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