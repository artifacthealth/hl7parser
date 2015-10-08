import Node = require("./node");
import NodeBase = require('./nodeBase');
import Segment = require("./segment");

class SegmentList extends NodeBase {

    private _segments: Segment[];

    constructor(parent: NodeBase, segments: Segment[]) {
        super(parent);
        this._segments = segments;
    }

    toString(): string {
        return this._segments[0].toString();
    }

    get name(): string {
        return this._segments[0].name;
    }

    read(path: string[]): Node {

        return this._segments[0].read(path);
    }

    protected writeCore(path: string[], value: string): void {

        this._segments[0].write(path, value);
    }

    protected pathCore(): string[] {

        return this._segments[0].path;
    }

    protected get children(): Node[] {

        return this._segments;
    }
}

export = SegmentList;