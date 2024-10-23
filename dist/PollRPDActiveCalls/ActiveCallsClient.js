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
exports.fetchActiveCalls = void 0;
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
/**
 * @description Fetches and maps ActiveCalls from the RPD Active Call scanner
 * @returns {ActiveCall}
 */
function fetchActiveCalls() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // Call out to RPD for HTML Table Data of Active Calls
        console.log('fetching...');
        const response = yield fetch("https://apps.richmondgov.com/applications/activecalls/Home/ActiveCalls", { headers: [["content-type", "text/html; charset=utf-8"]] });
        // Parse the response into something usable
        const doc = new DOMParser().parseFromString(yield response.text(), "text/html");
        const tableHeaders = [];
        (_a = doc === null || doc === void 0 ? void 0 : doc.querySelector("tr")) === null || _a === void 0 ? void 0 : _a.childNodes.forEach((node) => {
            if (!node.textContent.startsWith("\n")) {
                tableHeaders.push(node.textContent);
            }
        });
        const activeCalls = [];
        const tableData = doc === null || doc === void 0 ? void 0 : doc.querySelector("tbody");
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
        return activeCalls;
    });
}
exports.fetchActiveCalls = fetchActiveCalls;
//# sourceMappingURL=ActiveCallsClient.js.map