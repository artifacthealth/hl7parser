import MessageImpl from "./message";

/**
 * An HL7 message.
 */
export interface Message extends Node {

    /**
     * Adds a segment to the message.
     * @param path The name of the segment to add (e.g. "PID").
     */
    addSegment(path: string): Node;
}

/**
 * A node in an HL7 message. Can represent a message, segment, field, component, or sub-component.
 */
export interface Node {

    /**
     * The name of the node.
     */
    name: string;

    /**
     * The number of child nodes in the node.
     */
    length: number;

    /**
     * Gets a child node with the given path. Note that if the path does not exist an EmptyNode is returned. The Node at the path is not
     * created.
     * @param path The path of the child node to retrieve. The path can be a number or string. If the path is a
     * number, then child node at the specified index is returned.
     */
    get(path: string | number): Node;

    /**
     * Sets a child node at the given path. If the value is specified then the current Node is returned. If the value is not specified
     * then the Node at the given path is returned.
     * @param path The path of the child node to set.
     * @param value The value to set at the given path.
     */
    set(path: string | number, value?: any): void;

    /**
     * Checks if a child node exists at the given path.
     * @param path That path to check.
     */
    exists(path: string | number): boolean;

    /**
     * Iterates through all child nodes, calling the callback for each node. Similar to Array.forEach.
     * @param callback The function to call for each child node.
     */
    forEach(callback: (value: Node, index: number) => void): void;

    /**
     * Returns a string representation of the node. If the node has child nodes then the raw representation of the
     * node is returned; otherwise, the value of the node is returned with escape sequences resolved.
     */
    toString(): string;

    /**
     * Returns the raw string representation of the node, including delimiters and escape sequences.
     */
    toRaw(): string;

    /**
     * Returns all child nodes as an array.
     */
    toArray(): Node[];

    /**
     * Returns true if the node is empty; otherwise, returns false.
     */
    isEmpty(): boolean;

    /**
     * Returns the value of the node as a date. If the length of the string is exactly 8, the value is parsed using
     * the format YYYYMMDD. If the length of the string is >= 14, the value is parsed using the format YYYYMMDDHHMMSS.
     */
    toDate(): Date;

    /**
     * Returns the value of the node as an integer.
     */
    toInteger(): number;

    /**
     * Returns the value of the node as a floating point number.
     */
    toFloat(): number;

    /**
     * Returns the value of the node as a boolean. A value of "Y" is returned as true. A value of "N" is returned
     * as false. All other values return null.
     */
    toBoolean(): boolean;
}

/**
 * Creates a new HL7 message. If the message text is not specified, an empty HL7 message is created.
 * @param text Optional. The text to parse.
 */
export function create(text?: string): Message {

    return new MessageImpl(text);
}