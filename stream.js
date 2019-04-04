'use strict';
const C = require("./core");
const P = require("./prelude");

exports.firstOrGet = C.curry(async (supply, iter) => {
    for await (const e of iter) {
        return e;
    }
    supply = await supply;
    if (supply instanceof Function) {
        return await supply();
    }
    return supply;
});

exports.emptyThen = C.curry(async function*(supply, iter) {
    for await (const e of iter) {
        yield e;
        yield* iter;
        return;
    }
    
    supply = await supply;
    if (supply instanceof Function) {
        yield* await supply();
    } else {
        yield* supply; 
    }
});

/**
 * make array
 * iterator to array
 */
const collect = async (iter) => {
    const res = [];
    for await (const e of iter) {
        res.push(e);
    }
    return res;
};
exports.collect = collect;

exports.collectMap = async (iter) => {
    return new Map(await collect(iter));
};

exports.collectSet = async (iter) => {
    return new Set(await collect(iter));
}

exports.sum = (iter) => P.foldl1(C.add, iter);

exports.count = async (iter) => {
    let c = 0;
    for await (const _ of iter) {
        c += 1;
    }
    return c;
};

exports.forEach = C.curry(async (f, iter) => {
    const wait = [];
    for await (const e of iter) {
        const r = f(e);
        if (r) {
            wait.push(r);
        }
    } 
    return Promise.all(wait);
});

const distinctBy = C.curry(async function*(f, iter) {
    const s = new Set();
    for await (const e of iter) {
        const d = await f(e);
        if (!s.has(d)) {
            s.add(d);
            yield e;
        }
    }
});
exports.distinctBy = distinctBy;
exports.distinct = C.curry((iter) => distinctBy(C.ioe, iter));

exports.some = C.curry(async (f, iter) => {
    for await (const e of iter) {
        if (await f(e)) {
            return true;
        }
    }
    return false;
});

exports.every = C.curry(async (f, iter) => {
    for await (const e of iter) {
        if (!(await f(e))) {
            return false;
        }
    }
    return true;
});

exports.maxBy = C.curry(async (f, iter) => {
    const g = C.seq(iter);
    const head = await g.next();
    if (head.done) {
        throw new Error("empty iter");
    }
    let m = head.value;
    let c = await f(m);
    for await (const e of g) {
        const k = await f(e);
        if (k > c) {
            m = e;
            c = k;
        }
    }
    return m;
});

exports.minBy = C.curry(async (f, iter) => {
    const g = C.seq(iter);
    const head = await g.next();
    if (head.done) {
        throw new Error("empty iter");
    }
    let m = head.value;
    let c = await f(m);

    for await (const e of g) {
        const k = await f(e);
        if (k < c) {
            m = e;
            c = k;
        }
    }
    return m;
});

exports.splitBy = C.curry(async function*(f, any) {
    yield* await f(any);
});

exports.sleep = (t) => new Promise(r => {
    setTimeout(()=> r(), t);
});