function fnv32a(str) {
    var hval = 2166136261;
    for (var i = 0; i < str.length; ++i) {
        hval ^= str.charCodeAt(i);
        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }
    return hval >>> 0;
}

function i2ipv4(i) {
    var octet1 = (i >> 24) & 255;
    var octet2 = (i >> 16) & 255;
    var octet3 = (i >> 8) & 255;
    var octet4 = i & 255;
    return octet1 + "." + octet2 + "." + octet3 + "." + octet4;
}

function maskRemoteAddress(req) {
    return i2ipv4(fnv32a(req.remoteAddress));
}

export default {maskRemoteAddress};