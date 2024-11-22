import { de } from './de';
import { en } from './en';

// export const lang = de;

export class Lang {
    private _lang: Record<string, any>;

    constructor(private readonly locale?: string) {
        this._lang = locale === 'de' ? de : en;
    }

    get lang(): Record<string, any> {
        return this._lang;
    }
}
