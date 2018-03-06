import Node from './node';
import Delimiters from "./delimiters";
import ValueNode from "./valueNode";
import NodeBase from './nodeBase';

export default class SubComponent extends ValueNode {

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