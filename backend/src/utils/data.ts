import xlsx from "xlsx";
import fs from "fs";
import path from "path";

const sheetsDir = path.join(process.cwd(), "sheets");
const dataFilePath = path.join(sheetsDir, "data.xlsx");

/**
 * Ensure the "sheets" directory and "data.xlsx" exist.
 * If data.xlsx doesn't exist, create a minimal workbook.
 */
if (!fs.existsSync(sheetsDir)) {
  fs.mkdirSync(sheetsDir, { recursive: true });
  console.log("Created sheets directory:", sheetsDir);
}

if (!fs.existsSync(dataFilePath)) {
  // Create a minimal workbook with a "users" sheet as a fallback
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.aoa_to_sheet([
    ["", "Company 1", "Company 2", "Company 3"],           // Row 0 => company headers
    ["Summary Row", "Dash Summ", "Compare Summ"],          // Row 1 => summary
    ["Time Period", 2022, 2023, 2024],                     // Row 2 => stats
    ["Annualized Return", "15%", "13%", "9%"],             // Row 3 => stats
    ["Drawdown", "5%", "8%", "2%"],                        // Row 4 => stats
    ["DATA BY ME", "???", "???", "???"],                   // Row 5 => stats
    [],                                                    // Row 6 => blank
    ["Performance"],                                       // Row 7 => "Performance" marker
    ["Jan", 100, 110, 120],                                // Row 8 => perf data
    ["Feb", 200, 210, 220],                                // Row 9 => perf data
  ]);
  xlsx.utils.book_append_sheet(wb, ws, "users");
  xlsx.writeFile(wb, dataFilePath);
  console.log("Created data.xlsx with minimal content.");
}

/**
 *  Create or update a user's sheet. We'll just store an example 2D array here.
 *  If you want a more advanced approach, you can generate the rows from any source.
 */
export async function createUserData(email) {
  // Re-read the workbook so we're always up-to-date
  const workbook = xlsx.readFile(dataFilePath);

  // Example rows for this user:
  // Row 0 => company labels
  // Row 1 => summary row (for dashboardSummary, comparisonSummary, etc.)
  // Row 2.. => stats rows (until we reach "Performance")
  // Then "Performance" row, followed by chart data
  const rows = [
    ["", "Company 1", "Company 2", "Company 3"],  // row[0]
    ["Summary Row", "Dash Summ", "Compare Summ"], // row[1] => summary
    ["Time Period", 2022, 2023, 2024],            // row[2] => stats
    ["Annualized Return", "15%", "13%", "9%"],    // row[3]
    ["Drawdown", "5%", "8%", "2%"],               // row[4]
    ["DATA BY ME", "Hello", "SomeVal", 999],      // row[5] => more stats
    [],                                           // row[6] => blank
    ["Performance"],                              // row[7] => marker
    ["Jan", 100, 110, 120],                       // row[8] => chart data
    ["Feb", 200, 210, 220],                       // row[9] => chart data
    // ... add more as you wish
  ];

  // Convert these rows to a worksheet
  const worksheet = xlsx.utils.aoa_to_sheet(rows);

  // Remove any existing sheet with the same user name
  const existingSheetIndex = workbook.SheetNames.indexOf(email);
  if (existingSheetIndex !== -1) {
    workbook.SheetNames.splice(existingSheetIndex, 1);
    delete workbook.Sheets[email];
  }

  // Add the new sheet for this user
  xlsx.utils.book_append_sheet(workbook, worksheet, email);
  xlsx.writeFile(workbook, dataFilePath);

  console.log(`Sheet "${email}" created/updated successfully.`);
}

/**
 *  Dynamically read the user sheet:
 *    - row[0]: company labels
 *    - row[1]: summary row (2 columns => dashSumm, compareSumm)
 *    - row[2.. until 'Performance']: "compareStats"
 *    - after "Performance" row => performance data
 */
export async function getUserData(email) {
  try {
    const workbook = xlsx.readFile(dataFilePath);
    const sheet = workbook.Sheets[email];
    if (!sheet) {
      return { message: `User sheet "${email}" not found` };
    }

    // Convert sheet to array-of-arrays
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    // Example rows, if we used createUserData above:
    // 0 => ['', 'Company 1', 'Company 2', 'Company 3']
    // 1 => ['Summary Row', 'Dash Summ', 'Compare Summ']
    // 2 => ['Time Period', 2022, 2023, 2024]
    // 3 => ['Annualized Return', '15%', '13%', '9%']
    // 4 => ['Drawdown', '5%', '8%', '2%']
    // 5 => ['DATA BY ME', 'Hello', 'SomeVal', 999]
    // 6 => []
    // 7 => ['Performance']
    // 8 => ['Jan', 100, 110, 120]
    // 9 => ['Feb', 200, 210, 220]
    // ...

    if (!rows.length) {
      return { message: `Sheet "${email}" is empty.` };
    }

    // 1) Parse "labels" from row[0], skipping the first column
    // e.g. ['', 'Company 1', 'Company 2', 'Company 3'] => ['Company 1', 'Company 2', 'Company 3']
    //@ts-ignore
    const columnHeaders = rows[0].slice(1);

    // 2) If there's a row[1], parse summary info from columns 1, 2, ...
    // e.g. row[1] => ['Summary Row', 'Dash Summ', 'Compare Summ']
    let dashboardSummary = "";
    let comparisonSummary = "";
    //@ts-ignore
    if (rows[1] && rows[1].length > 1) {
      dashboardSummary = rows[1][1] || "";
      comparisonSummary = rows[1][2] || "";
    }

    // 3) Build compareStats from row[2..] until we find a row that starts with "Performance"
    let statsRows = [];
    let performanceStartIndex = -1;

    for (let i = 2; i < rows.length; i++) {
      const row = rows[i];
      //@ts-ignore
      if (!row || !row.length) continue; // skip blank rows

      if (typeof row[0] === "string" && row[0].trim().toLowerCase() === "performance") {
        performanceStartIndex = i;
        break;
      }
      // else this row is part of compareStats
      // row[0] => label, row[1..] => the values for each company
      const label = row[0] || "";
      //@ts-ignore
      const values = row.slice(1);
      const statObj = { label };

      values.forEach((val, idx) => {
        statObj[`value${idx + 1}`] = val || 0; 
      });
      statsRows.push(statObj);
    }

    // 4) Performance data is from the row after "Performance" onward
    // If we never found "Performance", performanceStartIndex will be -1.
    const performanceData = [];
    const comparePerformanceData = [];

    if (performanceStartIndex !== -1) {
      for (let j = performanceStartIndex + 1; j < rows.length; j++) {
        const row = rows[j];
        //@ts-ignore
        if (!row || !row.length) continue;

        // row[0] => name/label, row[1..] => numeric values
        const label = row[0];
        //@ts-ignore
        const values = row.slice(1);

        // For "performance" array:
        // Suppose we only store { name, value } with the first value for example
        // Adjust as needed
        performanceData.push({
          name: label,
          value: values[0] || 0,
        });

        // For "comparePerformance", we store all columns
        const perfObj = { name: label };
        values.forEach((val, idx) => {
          perfObj[`value${idx + 1}`] = val || 0;
        });
        comparePerformanceData.push(perfObj);
      }
    }

    // Build the final JSON
    const jsonData = {
      labels: columnHeaders,          // e.g. ['Company 1', 'Company 2', 'Company 3']
      dashboardSummary,               // from row[1][1]
      comparisonSummary,              // from row[1][2]
      compareStats: statsRows,        // e.g. [ { label: 'Time Period', value1: 2022, ... }, ... ]
      performance: performanceData,   // e.g. [ { name: 'Jan', value: 100 }, { name: 'Feb', ... } ]
      comparePerformance: comparePerformanceData
    };

    return jsonData;
  } catch (error) {
    console.error("getUserData error:", error);
    return { message: "An unknown error occurred" };
  }
}
