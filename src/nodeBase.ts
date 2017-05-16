import Delimiters = require("./delimiters");
import Message = require("./message");
import Node = require("./node");
import EmptyNode = require("./emptyNode");
import Util = require("./util");

class NodeBase implements Node {

    protected parent: NodeBase;

    private _name: string;
    private _text: string;
    private _delimiter: Delimiters;
    private _delimiterText: string;
    private _children: Node[];
    private _message: Message;
    private _path: string[];
    private _dirty: boolean;

    constructor(parent: NodeBase, text: string = null, delimiter: Delimiters = undefined) {

        this.parent = parent;
        this._text = text;
        this._delimiter = delimiter;
        this._dirty = false;
    }

    static empty = new EmptyNode();

    get(path: string | number): Node {

        var ret: Node;

        if(typeof path === "number") {
            if(path >= 0 && path < this.children.length) {
                 ret = this.children[path];
            }
        }
        else if(typeof path === "string") {
            ret = this.read(this.preparePath(path));
        }

        return ret || NodeBase.empty;
    }

    set(path: string | number, value?: any): Node {

        // If there is only one argument we make sure the path exists and return it
        if (arguments.length == 1) {
            return this.ensure(path);
        }

        if (typeof path === "string") {

            if (Array.isArray(value)) {
                // If the value is an array, write each item in the array using the index of the item as an additional
                // step in the path.
                for (var i = 0, l = value.length; i < l; i++) {
                    this.set(path + "." + (i + 1), value[i]);
                }
            }
            else {
                this.write(this.preparePath(path), this.prepareValue(value));
            }

            return this;
        }
        else if (typeof path === "number") {

            if (Array.isArray(value)) {
                // If the value is an array, write each item in the array using the index of the item as an additional
                // step in the path.
                var child = this.ensure(path);
                for (var i = 0, l = value.length; i < l; i++) {
                    child.set(i, value[i]);
                }
                return this;
            }
            else {
                this.setChild(this.createChild(this.prepareValue(value), path), path);
            }

            return this;
        }

        throw new Error("Path must be a string or number.");
    }

    get name(): string {
        if(this._name !== undefined) return this._name;
        return this._name = this.path.join(".");
    }

    get length(): number {
        return this.children.length;
    }

    toString(): string {
        return this.toRaw();
    }

    toRaw(): string {
        if(!this._dirty) {
            return this._text;
        }
        this._dirty = false;
        return this._text = this.children.map(x => x.toRaw()).join(this.delimiter);
    }

    toArray(): Node[] {
        // return shallow clone of children
        return [].concat(this.children);
    }

    forEach(callback: (value: Node, index: number) => void): void {

        var children = this.children;
        for(var i = 0, l = children.length; i < l; i++) {
            callback(children[i], i);
        }
    }

    exists(path: string | number): boolean {

        var value = this.get(path);
        if(value == null) return false;

        return !value.isEmpty();
    }

    isEmpty(): boolean {
        return this.children.length == 0;
    }

    toDate(): Date {
        return null;
    }

    toInteger(): number {
        return null;
    }

    toFloat(): number {
        return null;
    }

    toBoolean(): boolean {
        return null;
    }

    protected ensure(path: string | number): Node {

        var ret = this.get(path);
        if (ret != NodeBase.empty) {
            return ret;
        }

        if(typeof path === "number") {
            return this.setChild(this.createChild("", path), path);
        }
        else if(typeof path === "string") {
            return this.write(this.preparePath(path), "");
        }
    }

    protected preparePath(path: string): string[] {
        var parts = path.split(".");
        if(parts[0] == "") {
            parts.shift();
            parts = this.path.concat(parts);
        }

        if(!this._isSubPath(parts)) {
            throw new Error("'" + parts.toString() + "' is not a sub-path of '" + this.path.toString() + "'");
        }

        return this._remainderOf(parts);
    }

    protected prepareValue(value: any): string {

        if(value == null) return "";

        if(typeof value === "string") {
            return this.message.escape(value);
        }

        if(typeof value === "number") {
            return value.toString();
        }

        if(typeof value === "boolean") {
            return value ? "Y" : "N";
        }

        if(value instanceof Date) {
            return this._formatDateTime(value);
        }

        return value.toString();
    }

    protected get message(): Message {

        if(this._message) return this._message;
        return this._message = this.parent ? this.parent.message : <Message>this;
    }

    read(path: string[]): Node {

        throw new Error("Not implemented");
    }

    write(path: string[], value: string): Node {
        this.setDirty();
        return this.writeCore(path, value == null ? "" : value);
    }

    protected writeCore(path: string[], value: string): Node {
        throw new Error("Not implemented.");
    }

    protected writeAtIndex(path: string[], value: string, index: number, emptyValue = ""): Node {

        var child: Node;

        if(path.length == 0) {
            child = this.createChild(value || emptyValue, index);
        }
        else {
            // check if we already have a child at that index
            if(index < this.children.length) {
                child = this.children[index];
            }
            else {
                // if not, create a new one
                child = this.createChild(emptyValue, index);
            }
        }

        this.setChild(child, index);

        if(path.length != 0) {
            return child.write(path, value);
        }

        return child;
    }

    get path(): string[] {

        if(this._path) return this._path;
        return this._path = this.pathCore();
    }

    protected pathCore(): string[] {

        throw new Error("Not implemented");
    }

    protected get delimiter(): string {

        if(this._delimiterText) return this._delimiterText;
        return this._delimiterText = this.message.delimiters[this._delimiter];
    }

    protected get children(): Node[] {

        if(!this._children) {
            var parts = this._text.split(this.delimiter);
            var children = new Array(parts.length);
            for (var i = 0, l = parts.length; i < l; i++) {
                children[i] = this.createChild(parts[i], i);
            }
            this._children = children;
        }

        return this._children;
    }

    protected addChild(text: string): Node {

        this.setDirty();
        var child = this.createChild(text, this.children.length);
        this.children.push(child);
        return child;
    }

    protected createChild(text: string, index: number): Node {

        throw new Error("Not implemented");
    }

    protected setChild(child: Node, index: number): Node {

        this.setDirty();

        var children = this.children;

        // if we already have a child at that index then replace it
        if(index < children.length) {
            children[index] = child;
            return child;
        }

        // otherwise, fill the @children array with empty children for any indexes between the end of the list
        // and the specified index.
        for(var i = children.length; i < index; i++) {
            children.push(this.createChild("", i));
        }

        children.push(child);
        return child;
    }

    protected setDirty(): void {

        if (!this._dirty) {
            this._dirty = true;
            if (this.parent) {
                this.parent.setDirty();
            }
        }
    }

    private _isSubPath(other: string[]): boolean {

        if(this.path.length > other.length) return false;

        var path = this.path;
        for(var i = 0, l = path.length; i < l; i++) {
            if(path[i] != other[i]) return false;
        }

        return true;
    }

    private _remainderOf(other: string[]): string[] {

        var path = this.path;
        return other.slice(path.length);
    }

    private _formatDateTime(date: Date): string {

        // check if there is a time component
        if(date.getHours() != 0 || date.getMinutes() != 0 || date.getSeconds() != 0 || date.getMilliseconds() != 0) {
            return this._formatDate(date) + Util.pad(date.getHours(), 2) + Util.pad(date.getMinutes(), 2) + Util.pad(date.getSeconds(), 2);
        }

        return this._formatDate(date);
    }

    private _formatDate(date: Date): string {

        return date.getFullYear().toString() + Util.pad(date.getMonth() + 1, 2) + Util.pad(date.getDate(), 2);
    }
}

export = NodeBase;