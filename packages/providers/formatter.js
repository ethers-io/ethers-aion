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
Object.defineProperty(exports, "__esModule", { value: true });
var formatter_1 = require("@ethersproject/providers/formatter");
var address_1 = require("@ethersproject-aion/address");
var transactions_1 = require("@ethersproject-aion/transactions");
var Formatter = /** @class */ (function (_super) {
    __extends(Formatter, _super);
    function Formatter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Formatter.prototype.address = function (value) {
        return address_1.getAddress(value);
    };
    Formatter.prototype.transaction = function (value) {
        return transactions_1.parse(value);
    };
    return Formatter;
}(formatter_1.Formatter));
exports.Formatter = Formatter;
var defaultFormatter = null;
function getDefaultFormatter() {
    if (defaultFormatter == null) {
        defaultFormatter = new Formatter();
    }
    return defaultFormatter;
}
exports.getDefaultFormatter = getDefaultFormatter;
