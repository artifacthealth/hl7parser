import Node = require("./node");
import NodeBase = require('./nodeBase');
import Delimiters = require("./delimiters");
import Field = require("./field");
import SubComponent = require("./subComponent");

class Segment extends NodeBase {

    private _segmentName: string;

    constructor(parent: NodeBase, text: string) {
        super(parent, text, Delimiters.Field);

        this._segmentName = text.slice(0, 3);
    }

    read(path: string[]): Node {

        var index = parseInt(path.shift());
        if(index < 1) return null;

        // TODO: MSH already parses the index == 2. Instead of doing this here, do it in "children" accessor to add in the index == 1
        // Special handling for MSH. In the MSH segment, field 1 is the field separator, field 2 is the encoding characters
        // then the rest of the fields start with 3.
        if(this.path[0] == "MSH") {
            if(index == 1) {
                return new SubComponent(this, "1", this.message.delimiters[Delimiters.Field]);
            }
            else {
                index--;
            }
        }

        // TODO: Handle MSH for writing

        var field = this.children[index];
        return field && path.length > 0 ? field.read(path) : field;
    }

    protected writeCore(path: string[], value: string): void {

        var index = parseInt(path.shift());
        if(index < 1) return;

        // Special handling for MSH. In the MSH segment, field 1 is the field separator, field 2 is the encoding characters
        // then the rest of the fields start with 3.
        if(this.path[0] == "MSH") {
            if (index == 1 || index == 2) {
                throw new Error("You cannot assign the field separator or encoding characters");
            }
            else {
                index--;
            }
        }

        this.writeAtIndex(path, value, index);
    }

    protected pathCore(): string[] {

        return [this._segmentName];
    }

    protected createChild(text: string, index: number): Node {

        return new Field(this, index.toString(), text);
    }
}

export = Segment;