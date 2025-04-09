"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeData = writeData;
exports.updateRow = updateRow;
exports.getUsers = getUsers;
const xlsx_1 = __importDefault(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// const sheetsDir = path.join(path.dirname(process.cwd()), 'sheets');
// console.log("sheetsDir", sheetsDir);
// const usersFilePath = path.join(sheetsDir, 'users.xlsx');
const sheetsDir = path_1.default.join(process.cwd(), 'sheets');
console.log("sheetsDir", sheetsDir);
const usersFilePath = path_1.default.join(sheetsDir, 'users.xlsx');
if (!fs_1.default.existsSync(sheetsDir)) {
    fs_1.default.mkdirSync(sheetsDir, { recursive: true });
    console.log('Created sheets directory');
}
if (!fs_1.default.existsSync(usersFilePath)) {
    const headers = [
        { email: '', password: '' }
    ];
    const ws = xlsx_1.default.utils.json_to_sheet(headers);
    const wb = xlsx_1.default.utils.book_new();
    xlsx_1.default.utils.book_append_sheet(wb, ws, 'users');
    xlsx_1.default.writeFile(wb, usersFilePath);
    console.log('users.xlsx created with headers');
}
const workbook = xlsx_1.default.readFile(usersFilePath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//convert xlsx to json
let users = xlsx_1.default.utils.sheet_to_json(worksheet);
function writeData(newData) {
    const workbook = xlsx_1.default.readFile(usersFilePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx_1.default.utils.sheet_to_json(worksheet);
    const updatedData = [...data, newData];
    const updatedWorksheet = xlsx_1.default.utils.json_to_sheet(updatedData);
    workbook.Sheets[workbook.SheetNames[0]] = updatedWorksheet;
    xlsx_1.default.writeFile(workbook, usersFilePath);
    console.log('Data written to file successfully.');
}
function updateRow(key, keyValue, newData) {
    const workbook = xlsx_1.default.readFile(usersFilePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx_1.default.utils.sheet_to_json(worksheet);
    const rowIndex = data.findIndex((row) => row[key] === keyValue);
    if (rowIndex === -1) {
        console.log(`No row found with ${key} = ${keyValue}`);
        return;
    }
    data[rowIndex] = Object.assign(data[rowIndex], newData);
    const updatedWorksheet = xlsx_1.default.utils.json_to_sheet(data);
    workbook.Sheets[workbook.SheetNames[0]] = updatedWorksheet;
    xlsx_1.default.writeFile(workbook, usersFilePath);
    console.log(`Row with ${key} = ${keyValue} updated successfully.`);
}
function getUsers() {
    const workbook = xlsx_1.default.readFile(usersFilePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let users = xlsx_1.default.utils.sheet_to_json(worksheet);
    return users;
}
exports.default = users;
