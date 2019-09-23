/**
 * Typed EventEmitter. Create a new class for each type.
 * 
 * Inspired by https://basarat.gitbooks.io/typescript/docs/tips/typed-event.html.
 */

/**
 * Listen to events.
 */
export interface Listener<T> {
    (event: T): any;
}

/**
 * Added listeners can be disposed.
 */
export interface Disposable {
    dispose(): void;
}

/**
 * Super class for all typed events.
 */
export class TypedEvent<T> {
    private _listeners: Listener<T>[] = [];
    private _listenersOnce: Listener<T>[] = [];

    on = (listener: Listener<T>): Disposable => {
        this._listeners.push(listener);
        return {
            dispose: () => this.off(listener)
        };
    }

    once = (listener: Listener<T>): void => {
        this._listenersOnce.push(listener);
    }

    off = (listener: Listener<T>) => {
        var callbackIndex = this._listeners.indexOf(listener);
        if (callbackIndex > -1) this._listeners.splice(callbackIndex, 1);
    }

    emit = (event: T) => {
        // update general listeners
        this._listeners.forEach((listener) => listener(event));

        // remove once listeners
        if (this._listenersOnce.length > 0) {
            const toCall = this._listenersOnce;
            this._listenersOnce = [];
            toCall.forEach((listener) => listener(event));
        }
    }

    pipe = (te: TypedEvent<T>): Disposable => {
        return this.on((e) => te.emit(e));
    }

    removeAll() {
        this._listeners = [];
        this._listenersOnce = [];
    }

    /* Getter and Setter */

    /**
     * Returns total count of listeners.
     */
    get listenerCount(): number {
        return this._listeners.length + this._listenersOnce.length
    }

    
}