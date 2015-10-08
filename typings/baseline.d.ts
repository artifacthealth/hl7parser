interface Callback {
    (err?: Error): void;
}

declare var suite: {
    (title: string, block: () => void): void;
    skip(title: string, block: () => void): void;
}

declare var compare: {
    (title: string, block: () => void): void;
    skip(title: string, block: () => void): void;
}

declare var test: {
    (title: string, action?: (done?: Callback) => void): void;
    skip(title: string, action: (done?: Callback) => void): void;
}

declare function after(action: (done?: Callback) => void): void;
declare function before(action: (done?: Callback) => void): void;
declare function afterEach(action: (done?: Callback) => void): void;
declare function beforeEach(action: (done?: Callback) => void): void;
