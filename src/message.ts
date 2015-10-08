import Node = require("./node");
import NodeBase = require('./nodeBase');
import Delimiters = require("./delimiters");
import SegmentList = require("./segmentList");
import Segment = require("./segment");
import Util = require("./util");

class Message extends NodeBase {

    private _delimiters: string;
    private _matchUnescape: RegExp;
    private _matchEscape: RegExp;

    private static _defaultDelimiters = "\r|^~\\&";
    private static _defaultMatchUnescape = Message._makeMatchUnescape(Message._defaultDelimiters);
    private static _defaultMatchEscape = Message._makeMatchEscape(Message._defaultDelimiters);

    constructor(text: string = "MSH|^~\\&") {
        super(null, text, Delimiters.Segment);

        // make sure message starts with MSH segment
        if (text.slice(0, 3) != "MSH") {
            throw new Error("Message must being with the MSH segment.");
        }

        // read delimiters
        this._delimiters = "\r" + text.slice(3, 8);

        // if delimiters are the standard set, use the cached RegExp. if not, create RegExp for escape/unescape
        if(this._delimiters === Message._defaultDelimiters) {
            this._matchUnescape = Message._defaultMatchUnescape;
            this._matchEscape = Message._defaultMatchEscape;
        }
        else {
            this._matchUnescape = Message._makeMatchUnescape(this._delimiters);
            this._matchEscape = Message._makeMatchEscape(this._delimiters);
        }
    }

    private static _makeMatchUnescape(delimiters: string): RegExp {

        // setup regular expression for matching escape sequences, see http://www.hl7standards.com/blog/2006/11/02/hl7-escape-sequences/
        var matchEscape = Util.escapeForRegExp(delimiters[Delimiters.Escape]);
        return new RegExp([matchEscape,"[^", matchEscape, "]*", matchEscape].join(""), "g");
    }

    private static _makeMatchEscape(delimiters: string): RegExp {

        var sequences = [
            Util.escapeForRegExp(delimiters[Delimiters.Escape]),
            Util.escapeForRegExp(delimiters[Delimiters.Field]),
            Util.escapeForRegExp(delimiters[Delimiters.Repetition]),
            Util.escapeForRegExp(delimiters[Delimiters.Component]),
            Util.escapeForRegExp(delimiters[Delimiters.SubComponent]),
        ];

        return new RegExp(sequences.join("|"), "g");
    }

    get delimiters(): string {

        return this._delimiters;
    }

    unescape(text: string): string {
        if(text == null) return null;

        // Slightly faster for normal case of no escape sequences in text
        if(text.indexOf(this._delimiters[Delimiters.Escape]) == -1) return text;

        return text.replace(this._matchUnescape, (match: string) => {

            switch(match.slice(1, 2)) {
                case "C":
                    // ignore single-byte escape sequence
                    break;
                case "E":
                    return this._delimiters[Delimiters.Escape];
                case "F":
                    return this._delimiters[Delimiters.Field];
                case "H":
                    // ignore start highlight
                    break;
                case "M":
                    // ignore multi-byte escape sequence
                    break;
                case "N":
                    // ignore stop highlight
                    break;
                case "R":
                    return this._delimiters[Delimiters.Repetition];
                case "S":
                    return this._delimiters[Delimiters.Component];
                case "T":
                    return this._delimiters[Delimiters.SubComponent];
                case "X":
                    return Util.decodeHexString(match.slice(2, match.length - 1));
                case "Z":
                    // ignore locally defined escape sequence
                    break;
                default:
                   // pass through unknown escape sequences
                   return match;
            }

            return "";
        });
    }

    escape(text: string): string {
        if(text == null) return null;

        return text.replace(this._matchEscape, (match: string) => {

            var ch: string;

            switch(match) {
                case this._delimiters[Delimiters.Escape]:
                    ch = "E";
                    break;
                case this._delimiters[Delimiters.Field]:
                    ch = "F";
                    break;
                case this._delimiters[Delimiters.Repetition]:
                    ch = "R";
                    break;
                case this._delimiters[Delimiters.Component]:
                    ch = "S";
                    break;
                case this._delimiters[Delimiters.SubComponent]:
                    ch = "T";
                    break;
            }

            if(ch) {
                var escape = this._delimiters[Delimiters.Escape]
                return escape + ch + escape;
            }

            throw new Error("Escape sequence for '" + match + "' is not known.");
        });
    }

    addSegment(path: string): Segment {

        if(!path) {
            throw new Error("Missing segment path.");
        }

        var preparedPath = this.preparePath(path);
        if(preparedPath.length != 1) {
            throw new Error("Invalid segment path '" + path + "'.");
        }

        return <Segment>this.addChild(preparedPath[0]);
    }

    read(path: string[]): Node {

        var segmentName = path.shift();

        if(path.length == 0) {
            // only the segment name was in the path so return a SegmentList
            var segments = <Segment[]>this.children.filter(x => (<Segment>x).name == segmentName);
            if(segments.length > 0) {
                return new SegmentList(this, segments);
            }
        }
        else {
            var segment = this._getFirstSegment(segmentName);
            if(segment) {
                return segment.read(path);
            }
        }

        return null;
    }

    protected writeCore(path: string[], value: string): void {

        var segmentName = path.shift();
        var index = this._getFirstSegmentIndex(segmentName);
        if(index === undefined) {
            index = this.children.length;
        }
        this.writeAtIndex(path, value, index, segmentName);
    }

    protected createChild(text: string, index: number): Node {

        // make sure to remove any \n that might follow the \r
        return new Segment(this, text.trim());
    }

    protected pathCore(): string[] {

      // the message has an empty path
      return [];
    }

    private _getFirstSegment(name: string): Segment {

        var children = this.children;
        for (var i = 0, l = children.length; i < l; i++) {
            var segment = <Segment>children[i];
            if (segment.name == name) {
                return segment;
            }
        }
    }
    private _getFirstSegmentIndex(name: string): number {

        var children = this.children;
        for (var i = 0, l = children.length; i < l; i++) {
            var segment = <Segment>children[i];
            if (segment.name == name) {
                return i;
            }
        }
    }
}

export = Message;