import Node = require("./node");

class EmptyNode implements Node {

    get name(): string {
        return null;
    }

    get length(): number {
        return 0;
    }

    get(path: string | number): Node {
        return this;
    }

    set(path: string | number, value?: any): Node {
        return this;
    }

    exists(path: string | number): boolean {
        return false;
    }

    forEach(callback: (value: Node, index: number) => void): void {

    }

    toString(): string {
        return null;
    }

    toRaw(): string {
        return null;
    }

    toArray(): Node[] {
        return [];
    }

    isEmpty(): boolean {
        return true;
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

    read(path: string[]): Node {
        return null;
    }

    write(path: string[], value: string): Node {
        return this;
    }

    get path(): string[] {
        throw new Error("Not implemented");
    }
}

export = EmptyNode;