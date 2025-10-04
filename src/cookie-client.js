// src/shims/cookie-client.js
export function parse() { return {}; }
export function serialize(name, val, opts) {
    // minimal serializer for client-only usage (you can extend)
    let s = `${encodeURIComponent(name)}=${encodeURIComponent(val)}`;
    if (opts?.maxAge) s += `; Max-Age=${opts.maxAge}`;
    return s;
}
