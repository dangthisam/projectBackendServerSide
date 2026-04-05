
const crypto = require("crypto");

const generateRandomString = (length) => {
const characters =
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

let result = "";

for (let i = 0; i < length; i++) {
result += characters.charAt(Math.floor(Math.random() * characters.length));
}

    return result;
}


const OUTLEN = 32; // bytes for SHA-256
function hmac(key, data) {
    return crypto.createHmac('sha256', key).update(data).digest();
}

class HmacDrbg {
    constructor(entropy, personalization) {
        this.key = Buffer.alloc(OUTLEN, 0x00);
        this.v = Buffer.alloc(OUTLEN, 0x01);
        this.reseedCounter = 1;

        const ent = entropy || crypto.randomBytes(OUTLEN);
        const pers = personalization ? Buffer.from(personalization) : Buffer.alloc(0);
        const seedMaterial = Buffer.concat([ent, pers]);

        this._update(seedMaterial);
    }

    _update(providedData) {
        const pd = providedData && providedData.length ? providedData : Buffer.alloc(0);

        this.key = hmac(this.key, Buffer.concat([this.v, Buffer.from([0x00]), pd]));
        this.v = hmac(this.key, this.v);

        if (pd.length > 0) {
            this.key = hmac(this.key, Buffer.concat([this.v, Buffer.from([0x01]), pd]));
            this.v = hmac(this.key, this.v);
        }
    }

    reseed(entropy) {
        const ent = entropy || crypto.randomBytes(OUTLEN);
        this._update(ent);
        this.reseedCounter = 1;
    }

    generate(numBytes) {
        if (numBytes <= 0) return Buffer.alloc(0);

        let temp = Buffer.alloc(0);
        while (temp.length < numBytes) {
            this.v = hmac(this.key, this.v);
            temp = Buffer.concat([temp, this.v]);
        }

        const returned = temp.slice(0, numBytes);

        // Per spec, update with no provided data after generation
        this._update(Buffer.alloc(0));
        this.reseedCounter++;

        return returned;
    }
}
// Create a module-level DRBG instance seeded with system entropy.
const _drbg = new HmacDrbg(crypto.randomBytes(OUTLEN));
// Helper to get unbiased decimal digits (0-9) using rejection sampling
const generateRandomNumber = (length) => {
    if (typeof length !== 'number' || length <= 0) return '';
    const digits = [];
    while (digits.length < length) {
        const chunkSize = Math.min(256, Math.ceil((length - digits.length) * 2));
        const bytes = _drbg.generate(chunkSize);
        for (let i = 0; i < bytes.length && digits.length < length; i++) {
            const b = bytes[i];
            if (b < 250) {
                digits.push((b % 10).toString());
            }
        }
    }

    return digits.join('');
}


module.exports = {
    generateRandomString,
    generateRandomNumber
};

