import initSqlJs from 'sql.js';

// Fetch and execute a query on the SQLite database file
async function selectAccounts(buffer) {
  try {
    const SQL = await initSqlJs({
      locateFile: () => `/sql-wasm.wasm`
    });

    const db = new SQL.Database(new Uint8Array(buffer));
    const selectQuery = "SELECT * FROM Accounts";
    const result = db.exec(selectQuery);

    // Parse the result into rows
    const rows = result[0] ? result[0].values : [];
    const jsonData = [];

    // Loop through each row
    for (const row of rows) {
    // Create an object to store row data
    const rowData = {};
    for (let i = 0; i < row.length; i++) {
        
        const columnName = result[0].columns[i];
        rowData[columnName] = row[i];
    }
    // Push the row data object to the JSON array
    jsonData.push(rowData);
    }
    db.close();
    return jsonData;
  } catch (error) {
    console.error("Error selecting accounts:", error);
    throw error;
  }
}


export default selectAccounts;
