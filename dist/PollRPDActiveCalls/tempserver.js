"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const https = require("https");
const jsdom_1 = require("jsdom");
function GetActiveCalls() {
    return __awaiter(this, void 0, void 0, function* () {
        let request = yield (0, axios_1.default)({
            method: "get",
            url: "https://apps.richmondgov.com/applications/activecalls/Home/ActiveCalls",
            responseType: "text",
            httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        });
        const dom = new jsdom_1.JSDOM(request.data);
        const tableHeaders = [];
        dom.window.document.querySelectorAll("tr").forEach((node) => {
            if (!node.textContent.startsWith("\n")) {
                tableHeaders.push(node.textContent);
            }
        });
        const activeCalls = [];
        const tableData = dom.window.document.querySelector("tbody");
        const tableRows = tableData.querySelectorAll("tr");
        tableRows.forEach((row) => {
            const rowData = row.childNodes;
            const filteredRowData = [];
            rowData === null || rowData === void 0 ? void 0 : rowData.forEach((d) => {
                if (!d.textContent.startsWith("\n")) {
                    filteredRowData.push(d.textContent);
                }
            });
            // ActiveCalls are returned sorted by Time ASC
            // Since we want latest, we unshift instead of push
            activeCalls.unshift(mapRowDataToActiveCall(filteredRowData));
        });
        activeCalls.forEach(activeCall => {
            console.log(`Active Call\n`);
            console.log(activeCall);
            console.log("\n");
        });
        return activeCalls;
    });
}
/**
 * @param {string[]} activeCallProperties - sorted list representing the details of an
 * ActiveCall pulled from a HTML TableRow
 */
function mapRowDataToActiveCall(activeCallProperties) {
    return {
        TimeReceived: new Date(activeCallProperties[0]),
        Agency: activeCallProperties[1],
        DispatchArea: activeCallProperties[2],
        Unit: activeCallProperties[3],
        CallType: activeCallProperties[4],
        Location: activeCallProperties[5],
        Status: activeCallProperties[6],
    };
}
GetActiveCalls();
//# sourceMappingURL=tempserver.js.map