/**
 * Converts a number to a string padded n characters.
 * From http://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript.
 * @param n The number to convert to a string.
 * @param width The number of characters that should be in the resulting string.
 * @param z Optional. The character to use for padding. Defaults to '0'.
 */
export function pad(n: number, width: number, z: string = "0"): string {

    var s = n.toString();
    return s.length >= width ? s : new Array(width - s.length + 1).join(z) + s;
}

/**
 * Escape a string for use in a regular express.
 * From http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711.
 * @param value The string to escape
 */
export function escapeForRegExp(value: string): string {

    return value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export function decodeHexString(value: string): string {

    var result = new Array(value.length / 2);

    for(var i = 0; i < value.length; i += 2) {
        result[i/2] = String.fromCharCode(parseInt(value.slice(i, i + 2), 16));
    }

    return result.join("");
}

