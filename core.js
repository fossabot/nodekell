/**
 * currying function wrapper
 * ex)
 * var mySum = curry((a,b,c) => {return a+b+c;});
 *
 * var mySum1 = mySum(1) 
 * var mySum2 = mySum1(2)
 * var sum = mySum2(3) // <-- real call 
 * 
 */
const curry = fn => (...a) => {
    if (fn.length <= a.length) return fn(...a);
    else return (...b) => curry(fn)(...a, ...b);
};
exports.curry = curry;

/**
 * make generator
 * do not need to check if iter 
 * Symbol.asyncIterator or Symbol.iterator 
 */
exports.seq = async function* (iter) {
    for await (const e of iter) {
        yield e;
    }
};

/**
 * internal methods
 */
exports.ioe = e => e;
exports.add = (a, b) => a + b;
exports.sub = (a, b) => a - b;