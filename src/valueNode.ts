import Node = require("./node");
import NodeBase = require('./nodeBase');
import Delimiters = require("./delimiters");

class ValueNode extends NodeBase {

    protected key: string;

    constructor(parent: NodeBase, key: string, text: string, delimiter: Delimiters = null) {
        super(parent, text, delimiter);

        this.key = key;
    }

    toString(): string {

        var children = this.children;
        return children.length > 1 ? this.toRaw() : children[0].toString();
    }

    toDate(): Date {

        var text = this.toString();

        if(text.length == 8) {
            return new Date(parseInt(text.slice(0, 4)), parseInt(text.slice(4, 6)) - 1, parseInt(text.slice(6, 8)), 0, 0, 0);
        }
        else if(text.length >= 14) {
            return new Date(parseInt(text.slice(0, 4)), parseInt(text.slice(4, 6)) - 1, parseInt(text.slice(6, 8)), parseInt(text.slice(8, 10)), parseInt(text.slice(10, 12)), parseInt(text.slice(12, 14)));
        }

        return null;
    }

    toInteger(): number {

        return parseInt(this.toString());
    }

    toFloat(): number {

        return parseFloat(this.toString());
    }

    toBoolean(): boolean {

        switch(this.toString()) {
            case "Y":
                return true;
            case "N":
                return false;
        }

        return null;
    }

    protected pathCore(): string[] {

        return this.parent.path.concat([this.key]);
    }
}

export = ValueNode;