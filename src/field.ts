import Node from './node';
import Delimiters from "./delimiters";
import ValueNode from "./valueNode";
import FieldRepetition from "./fieldRepetition";
import NodeBase from './nodeBase';

export default class Field extends ValueNode {

    constructor(parent: NodeBase, key: string, text: string) {
        super(parent, key, text, Delimiters.Repetition);
    }

    read(path: string[]): Node {

        if(this.children.length > 0) {
            return this.children[0].read(path);
        }

        return null;
    }

    protected writeCore(path: string[], value: string): Node {

        return this._ensureChild().write(path, value);
    }

    protected createChild(text: string, index: number): Node {

        return new FieldRepetition(this, this.key, text);
    }

    private _ensureChild(): Node {

        var child: Node;

        // create a repetition if we do not have one already
        if(this.children.length == 0) {
            child = this.createChild("", 0);
            this.setChild(child, 0);
        }
        else {
            child = this.children[0];
        }

        return child;
    }
}