import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';

// const sheetsDir = path.join(path.dirname(process.cwd()), 'sheets');
// console.log("sheetsDir", sheetsDir);
// const usersFilePath = path.join(sheetsDir, 'users.xlsx');

const sheetsDir = path.join(process.cwd(), 'sheets');
console.log("sheetsDir", sheetsDir);
const usersFilePath = path.join(sheetsDir, 'users.xlsx');

if (!fs.existsSync(sheetsDir)) {
    fs.mkdirSync(sheetsDir, { recursive: true });
    console.log('Created sheets directory');
}

if (!fs.existsSync(usersFilePath)) {
    const headers = [
        { email: '', password: '' }
    ];

    const ws = xlsx.utils.json_to_sheet(headers);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'users');
    xlsx.writeFile(wb, usersFilePath);
    console.log('users.xlsx created with headers');
}

const workbook = xlsx.readFile(usersFilePath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];

//convert xlsx to json
let users = xlsx.utils.sheet_to_json(worksheet);


function writeData(newData) {
    const workbook = xlsx.readFile(usersFilePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const data = xlsx.utils.sheet_to_json(worksheet);

    const updatedData = [...data, newData];

    const updatedWorksheet = xlsx.utils.json_to_sheet(updatedData);

    workbook.Sheets[workbook.SheetNames[0]] = updatedWorksheet;

    xlsx.writeFile(workbook, usersFilePath);
    console.log('Data written to file successfully.');
}

function updateRow(key, keyValue, newData) {
    const workbook = xlsx.readFile(usersFilePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  
    const data = xlsx.utils.sheet_to_json(worksheet);
  
    const rowIndex = data.findIndex((row) => row[key] === keyValue);
  
    if (rowIndex === -1) {
      console.log(`No row found with ${key} = ${keyValue}`);
      return;
    }
  
    data[rowIndex] = Object.assign(data[rowIndex], newData);
  
    const updatedWorksheet = xlsx.utils.json_to_sheet(data);
  
    workbook.Sheets[workbook.SheetNames[0]] = updatedWorksheet;
  
    xlsx.writeFile(workbook, usersFilePath);
    console.log(`Row with ${key} = ${keyValue} updated successfully.`);
}

function getUsers() {
    const workbook = xlsx.readFile(usersFilePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    let users = xlsx.utils.sheet_to_json(worksheet);

    return users;
}

export default users;
export { writeData, updateRow, getUsers }