/** biome-ignore-all lint/suspicious/noExplicitAny: We know nothing about argument types of a callback function */
type Listener = (...args: any[]) => void;

export class EventEmitter {
    pool: {
        [name: string]: Listener[];
    } = {};

    on(name: string, listener: Listener) {
        if (!this.has(name)) {
            this.pool[name] = [];
        }

        this.pool[name].push(listener);

        return this;
    }

    once(name: string, listener: Listener) {
        if (!this.has(name)) {
            this.pool[name] = [];
        }

        const id = this.pool[name].length;

        this.pool[name].push((...params: any[]) => {
            listener(...params);
            this.pool[name].splice(id, 1);
        });

        return this;
    }

    off(name: string) {
        if (this.has(name)) {
            delete this.pool[name];
        }

        return this;
    }

    emit(name: string, ...params: any[]) {
        if (this.has(name)) {
            const listeners = this.pool[name];
            for (const listener of listeners) {
                listener(...params);
            }
        }

        return this;
    }

    has(name: string): boolean {
        return typeof this.pool[name] !== 'undefined';
    }
}
