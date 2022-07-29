import axios from "axios";
import * as https from "https";
import { ActiveCall } from "./ActiveCall";
import { JSDOM } from "jsdom";

async function GetActiveCalls(): Promise<ActiveCall[]> {
  let request = await axios({
    method: "get",
    url: "https://apps.richmondgov.com/applications/activecalls/Home/ActiveCalls",
    responseType: "text",
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  });

  const dom = new JSDOM(request.data);

  const tableHeaders: string[] = [];

  dom.window.document.querySelectorAll("tr").forEach((node) => {
    if (!node.textContent.startsWith("\n")) {
      tableHeaders.push(node.textContent);
    }
  })!;

  const activeCalls: ActiveCall[] = [];
  const tableData = dom.window.document.querySelector("tbody")!;
  const tableRows = tableData.querySelectorAll("tr")!;

  tableRows.forEach((row: Node) => {
    const rowData = row.childNodes;
    const filteredRowData: string[] = [];

    rowData?.forEach((d: Node) => {
      if (!d.textContent.startsWith("\n")) {
        filteredRowData.push(d.textContent);
      }
    });
    // ActiveCalls are returned sorted by Time ASC
    // Since we want latest, we unshift instead of push
    activeCalls.unshift(mapRowDataToActiveCall(filteredRowData));
  });
  activeCalls.forEach(activeCall=>{
    console.log(`Active Call\n`)
    console.log(activeCall)
    console.log("\n")
  })
  return activeCalls;
}

/**
 * @param {string[]} activeCallProperties - sorted list representing the details of an
 * ActiveCall pulled from a HTML TableRow
 */
function mapRowDataToActiveCall(activeCallProperties: string[]): ActiveCall {
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
