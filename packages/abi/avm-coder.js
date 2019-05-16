"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var bytes_1 = require("@ethersproject/bytes");
var bignumber_1 = require("@ethersproject/bignumber");
var errors = __importStar(require("@ethersproject/errors"));
var properties_1 = require("@ethersproject/properties");
var strings_1 = require("@ethersproject/strings");
var address_1 = require("@ethersproject-aion/address");
exports.TagNull = 0x32;
var Writer = /** @class */ (function () {
    function Writer() {
        this._data = bytes_1.arrayify([]);
    }
    Object.defineProperty(Writer.prototype, "data", {
        get: function () { return bytes_1.hexlify(this._data); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Writer.prototype, "length", {
        get: function () { return this._data.length; },
        enumerable: true,
        configurable: true
    });
    Writer.prototype.writeByte = function (value) {
        return this.writeBytes([value]);
    };
    Writer.prototype.writeBytes = function (bytes) {
        this._data = bytes_1.concat([this._data, bytes]);
        return bytes_1.arrayify(bytes).length;
    };
    Writer.prototype.writeLength = function (length) {
        if (length > 0xffff) {
            throw new Error("length out of bounds");
        }
        return this.writeBytes([(length >> 16), (length & 0xff)]);
    };
    return Writer;
}());
exports.Writer = Writer;
var Reader = /** @class */ (function () {
    function Reader(data) {
        properties_1.defineReadOnly(this, "_data", bytes_1.arrayify(data));
        this._offset = 0;
    }
    Object.defineProperty(Reader.prototype, "consumed", {
        get: function () { return this._offset; },
        enumerable: true,
        configurable: true
    });
    Reader.prototype.peekBytes = function (count) {
        var value = this._data.slice(this._offset, this._offset + count);
        if (value.length !== count) {
            throw new Error("out-of-bounds");
        }
        return value;
    };
    Reader.prototype.peekByte = function () {
        return this.peekBytes(1)[0];
    };
    Reader.prototype.readBytes = function (count) {
        var value = this.peekBytes(count);
        this._offset += count;
        return value;
    };
    Reader.prototype.readByte = function () {
        return this.readBytes(1)[0];
    };
    Reader.prototype.readLength = function () {
        var bytes = this.readBytes(2);
        return (bytes[0] << 8) | bytes[1];
    };
    return Reader;
}());
exports.Reader = Reader;
var Coder = /** @class */ (function () {
    function Coder(type, tag, localName) {
        this.type = type;
        this.tag = tag;
        this.localName = localName;
    }
    Coder.prototype._throwError = function (message, value) {
        return errors.throwError(message, errors.INVALID_ARGUMENT, {
            argument: this.localName,
            coder: this,
            value: value
        });
    };
    return Coder;
}());
exports.Coder = Coder;
var PrimitiveCoder = /** @class */ (function (_super) {
    __extends(PrimitiveCoder, _super);
    function PrimitiveCoder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PrimitiveCoder.prototype.decode = function (reader) {
        var tag = reader.readByte();
        if (tag !== this.tag) {
            this._throwError("invalid tag", tag);
        }
        return this.decodeValue(reader);
    };
    PrimitiveCoder.prototype.encode = function (writer, value) {
        if (value == null) {
            this._throwError("cannot be null", value);
        }
        writer.writeByte(this.tag);
        this.encodeValue(writer, value);
    };
    return PrimitiveCoder;
}(Coder));
exports.PrimitiveCoder = PrimitiveCoder;
var NumberCoder = /** @class */ (function (_super) {
    __extends(NumberCoder, _super);
    function NumberCoder(type, byteCount, tag, localName) {
        var _this = _super.call(this, type, tag, localName) || this;
        _this.byteCount = byteCount;
        return _this;
    }
    NumberCoder.prototype.decodeValue = function (reader) {
        var value = bignumber_1.BigNumber.from(reader.readBytes(this.byteCount)).fromTwos(this.byteCount * 8);
        if (this.byteCount <= 6) {
            return value.toNumber();
        }
        return value;
    };
    NumberCoder.prototype.encodeValue = function (writer, value) {
        var bytes = bytes_1.zeroPad(bytes_1.arrayify(bignumber_1.BigNumber.from(value).toTwos(this.byteCount * 8)), this.byteCount);
        writer.writeBytes(bytes);
    };
    return NumberCoder;
}(PrimitiveCoder));
exports.NumberCoder = NumberCoder;
var BooleanCoder = /** @class */ (function (_super) {
    __extends(BooleanCoder, _super);
    function BooleanCoder(localName) {
        return _super.call(this, "boolean", 1, 0x02, localName) || this;
    }
    BooleanCoder.prototype.decodeValue = function (reader) {
        return !!_super.prototype.decodeValue.call(this, reader);
    };
    BooleanCoder.prototype.encodeValue = function (writer, value) {
        _super.prototype.encodeValue.call(this, writer, (!value) ? 0x00 : 0x01);
    };
    return BooleanCoder;
}(NumberCoder));
exports.BooleanCoder = BooleanCoder;
var CharCoder = /** @class */ (function (_super) {
    __extends(CharCoder, _super);
    function CharCoder(localName) {
        return _super.call(this, "char", 2, 0x03, localName) || this;
    }
    CharCoder.prototype.decodeValue = function (reader) {
        return String.fromCharCode(_super.prototype.decodeValue.call(this, reader));
    };
    CharCoder.prototype.encodeValue = function (writer, value) {
        if (value.length !== 1) {
            throw new Error("char must be 1 char long");
        }
        _super.prototype.encodeValue.call(this, writer, value.charCodeAt(0));
    };
    return CharCoder;
}(NumberCoder));
exports.CharCoder = CharCoder;
var FloatCoder = /** @class */ (function (_super) {
    __extends(FloatCoder, _super);
    function FloatCoder(type, byteCount, tag, localName) {
        var _this = _super.call(this, type, tag, localName) || this;
        _this.byteCount = byteCount;
        return _this;
    }
    FloatCoder.prototype.decodeValue = function (reader) {
        var view = new DataView(reader.readBytes(this.byteCount).buffer);
        if (this.byteCount === 4) {
            return view.getFloat32(0);
        }
        return view.getFloat64(0);
    };
    FloatCoder.prototype.encodeValue = function (writer, value) {
        var buffer = new ArrayBuffer(this.byteCount);
        var view = new DataView(buffer);
        if (this.byteCount === 4) {
            view.setFloat32(0, value);
        }
        else {
            view.setFloat64(0, value);
        }
        writer.writeBytes(new Uint8Array(buffer, 0, this.byteCount));
    };
    return FloatCoder;
}(PrimitiveCoder));
exports.FloatCoder = FloatCoder;
var NullableCoder = /** @class */ (function (_super) {
    __extends(NullableCoder, _super);
    function NullableCoder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NullableCoder.prototype.decodeNull = function (reader) {
        if (reader.readByte() !== exports.TagNull) {
            throw new Error("not null");
        }
        if (reader.readByte() !== this.tag) {
            throw new Error("wrong null type");
        }
        return null;
    };
    NullableCoder.prototype.encodeNull = function (writer) {
        writer.writeBytes([exports.TagNull, this.tag]);
    };
    /*
    decodeValue(reader: Reader): any {
        return this.decodeValue(reader);
    }

    encodeValue(writer: Writer, value: any): void {
        this.encodeValue(writer, value);
    }
    */
    NullableCoder.prototype.decode = function (reader) {
        if (reader.peekByte() === exports.TagNull) {
            return this.decodeNull(reader);
        }
        else {
            if (reader.readByte() !== this.tag) {
                throw new Error("tag mismatch");
            }
            return this.decodeValue(reader);
        }
    };
    NullableCoder.prototype.encode = function (writer, value) {
        if (value == null) {
            this.encodeNull(writer);
        }
        else {
            writer.writeByte(this.tag);
            this.encodeValue(writer, value);
        }
    };
    return NullableCoder;
}(Coder));
exports.NullableCoder = NullableCoder;
var PrimitiveArrayCoder = /** @class */ (function (_super) {
    __extends(PrimitiveArrayCoder, _super);
    function PrimitiveArrayCoder(coder) {
        var _this = this;
        if (coder.tag >= 0x10) {
            throw new Error("primitive coder requires tag < 0x10");
        }
        _this = _super.call(this, coder.type + "[]", (coder.tag | 0x10), coder.localName) || this;
        properties_1.defineReadOnly(_this, "coder", coder);
        return _this;
    }
    PrimitiveArrayCoder.prototype.decodeValue = function (reader) {
        var count = reader.readLength();
        var result = [];
        for (var i = 0; i < count; i++) {
            result.push(this.coder.decodeValue(reader));
        }
        return result;
    };
    PrimitiveArrayCoder.prototype.encodeValue = function (writer, value) {
        var _this = this;
        writer.writeLength(value.length);
        value.forEach(function (value) {
            _this.coder.encodeValue(writer, value);
        });
    };
    return PrimitiveArrayCoder;
}(NullableCoder));
exports.PrimitiveArrayCoder = PrimitiveArrayCoder;
var StringCoder = /** @class */ (function (_super) {
    __extends(StringCoder, _super);
    function StringCoder(localName) {
        return _super.call(this, "String", 0x21, localName) || this;
    }
    StringCoder.prototype.decodeValue = function (reader) {
        var length = reader.readLength();
        return strings_1.toUtf8String(reader.readBytes(length));
    };
    StringCoder.prototype.encodeValue = function (writer, value) {
        var bytes = strings_1.toUtf8Bytes(value);
        writer.writeLength(bytes.length);
        writer.writeBytes(bytes);
    };
    return StringCoder;
}(NullableCoder));
exports.StringCoder = StringCoder;
var AddressCoder = /** @class */ (function (_super) {
    __extends(AddressCoder, _super);
    function AddressCoder(localName) {
        return _super.call(this, "address", 0x22, localName) || this;
    }
    AddressCoder.prototype.decodeValue = function (reader) {
        return address_1.getAddress(bytes_1.hexlify(reader.readBytes(32)));
    };
    AddressCoder.prototype.encodeValue = function (writer, value) {
        writer.writeBytes(address_1.getAddress(value));
    };
    return AddressCoder;
}(NullableCoder));
exports.AddressCoder = AddressCoder;
var ArrayCoder = /** @class */ (function (_super) {
    __extends(ArrayCoder, _super);
    function ArrayCoder(coder, localName) {
        var _this = _super.call(this, coder.type + "[]", 0x31, localName) || this;
        _this.coder = coder;
        return _this;
    }
    ArrayCoder.prototype.decodeNull = function (reader) {
        _super.prototype.decodeNull.call(this, reader);
        var tag = reader.readByte();
        if (tag !== this.coder.tag) {
            throw new Error("wrong child tag");
        }
        return null;
    };
    ArrayCoder.prototype.encodeNull = function (writer) {
        _super.prototype.encodeNull.call(this, writer);
        writer.writeByte(this.coder.tag);
    };
    ArrayCoder.prototype.decodeValue = function (reader) {
        var tag = reader.readByte();
        if (tag !== this.coder.tag) {
            throw new Error("wrong child tag");
        }
        var length = reader.readLength();
        var result = [];
        for (var i = 0; i < length; i++) {
            result.push(this.coder.decode(reader));
        }
        return result;
    };
    ArrayCoder.prototype.encodeValue = function (writer, value) {
        var _this = this;
        writer.writeByte(this.coder.tag);
        writer.writeLength(value.length);
        value.forEach(function (value) {
            _this.coder.encode(writer, value);
        });
    };
    return ArrayCoder;
}(NullableCoder));
exports.ArrayCoder = ArrayCoder;
//const stringCoder = new StringCoder("_");
var AvmCoder = /** @class */ (function () {
    function AvmCoder() {
        var _newTarget = this.constructor;
        errors.checkNew(_newTarget, AvmCoder);
    }
    AvmCoder.prototype._getCoder = function (param) {
        if (typeof (param) !== "string") {
            param = param.type;
        }
        // @TODO: nomalize the param; remove spaces, etc
        var comps = param.trim().split(" ").map(function (comp) { return comp.trim(); });
        param = comps[0];
        var localName = comps[1] || null;
        if (param.substring(param.length - 2) === "[]") {
            var subcoder = this._getCoder(param.substring(0, param.length - 2));
            if (subcoder.tag <= 0x10) {
                return new PrimitiveArrayCoder(subcoder);
            }
            return new ArrayCoder(subcoder, localName);
        }
        switch (param) {
            case "byte":
                return new NumberCoder("byte", 1, 0x01, localName);
            case "short":
                return new NumberCoder("short", 2, 0x04, localName);
            case "int":
                return new NumberCoder("byte", 4, 0x05, localName);
            case "long":
                return new NumberCoder("long", 8, 0x06, localName);
            case "boolean":
                return new BooleanCoder(localName);
            case "char":
                return new CharCoder(localName);
            case "String":
                return new StringCoder(localName);
            case "Address":
                return new AddressCoder(localName);
            case "float":
                return new FloatCoder("float", 4, 0x07, localName);
            case "double":
                return new FloatCoder("double", 8, 0x08, localName);
        }
        throw new Error("unknown - " + param);
    };
    AvmCoder.prototype._getReader = function (data) {
        return new Reader(data);
    };
    AvmCoder.prototype._getWriter = function () {
        return new Writer();
    };
    AvmCoder.prototype.encode = function (types, values) {
        var _this = this;
        if (types.length !== values.length) {
            errors.throwError("types/values length mismatch", errors.INVALID_ARGUMENT, {
                count: { types: types.length, values: values.length },
                value: { types: types, values: values }
            });
        }
        var coders = types.map(function (type) { return _this._getCoder(type); });
        var writer = this._getWriter();
        coders.forEach(function (coder, index) {
            coder.encode(writer, values[index]);
        });
        //console.log(coders);
        return writer.data;
    };
    // @TODO: Move this to AVMContract
    /*
    encodeCall(method: string, types: Array<string>, values: Array<any>): string {
        let sigWriter = this._getWriter();
        stringCoder.encode(sigWriter, method);
        return hexlify(concat([
            sigWriter.data,
            this.encode(types, values)
        ]));
    }
    */
    AvmCoder.prototype.decode = function (types, data) {
        var _this = this;
        var reader = this._getReader(bytes_1.arrayify(data));
        var coders = types.map(function (type) { return _this._getCoder(type); });
        var result = [];
        coders.forEach(function (coder) {
            result.push(coder.decode(reader));
        });
        return result;
    };
    return AvmCoder;
}());
exports.AvmCoder = AvmCoder;
exports.defaultAvmCoder = new AvmCoder();
