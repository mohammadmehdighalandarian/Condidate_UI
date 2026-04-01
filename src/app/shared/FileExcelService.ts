import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { WorkBook, WBProps, WBView } from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class FileExcelService {
  wbout = [];
  table = [];

  rtlView: WBView = { RTL: true };
  rtlProp: WBProps = { Views: [this.rtlView] };
  ws: any;

  fileObject: any;
  headers = [];

  constructor() {
    this.setExcelProperties('');
  }

  s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
  }

  extractHeader(ws) {
    const header = [];
    const columnCount = XLSX.utils.decode_range(ws['!ref']).e.c + 1;
    for (let i = 0; i < columnCount; ++i) {
      header[i] = ws[`${XLSX.utils.encode_col(i)}1`].v;
    }
    return header;
  }

  SaveToExcel(tableData, fileName: string = 'QuestionSheet') {
    this.setTableData(tableData, fileName);
    saveAs(
      new Blob([this.s2ab(this.wbout)], { type: 'application/octet-stream' }),
      fileName + '.xlsx'
    );
  }

  getTableData() {
    return this.table;
  }

  setTableData(tableData, fileName: string) {
    this.table = tableData;
    this.setExcelProperties(fileName);
  }

  setExcelProperties(fileName: string) {
    const ws_name = fileName.substr(0, 25);
    const wb: WorkBook = { SheetNames: [], Sheets: {}, Workbook: this.rtlProp };
    this.ws = XLSX.utils.json_to_sheet(this.getTableData());
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = this.ws;
    this.wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
  }

  convertExcelToJson(file) {
    let reader = new FileReader();
    let workbookkk;
    let XL_row_object;
    let json_object;
    var that = this;
    reader.readAsBinaryString(file);
    return new Promise((resolve, reject) => {
      reader.onload = function () {
        let data = reader.result;
        workbookkk = XLSX.read(data, { type: 'binary' });
        workbookkk.SheetNames.forEach(function (sheetName) {
          XL_row_object = XLSX.utils.sheet_to_json(workbookkk.Sheets[sheetName]);
          that.headers = that.extractHeader(workbookkk.Sheets[sheetName]);
          that.fileObject = XL_row_object;
          json_object = JSON.stringify(XL_row_object);
          resolve(XL_row_object);
        });
      };
    });
  }

  getTemplate(attributes, fileName) {
    this.setTemplateTableData(attributes, fileName);
    saveAs(
      new Blob([this.s2ab(this.wbout)], { type: 'application/octet-stream' }),
      fileName + '.xlsx'
    );
  }

  setTemplateTableData(attributes, fileName: string) {
    var templateData = this.createTemplateData(attributes);
    this.table = templateData;
    this.setTemplateExcelProperties(fileName);
  }

  createTemplateData(attributes) {
    var templateData = [];
    var objString = '{"';
    var i;
    for (i = 0; i < attributes.length - 1; i++) {
      objString = objString + attributes[i] + '":"","';
    }
    objString = objString + attributes[i] + '":""}';
    var json_object = JSON.parse(objString);
    for (i = 0; i < 10000; i++) {
      templateData.push(json_object);
    }
    return templateData;
  }

  setTemplateExcelProperties(fileName: string) {
    const ws_name = fileName.substr(0, 25);
    const wb: WorkBook = { SheetNames: [], Sheets: {}, Workbook: this.rtlProp };
    this.ws = XLSX.utils.json_to_sheet(this.getTableData());
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = this.ws;

    var fmt = '@';
    var range = {
      s: { c: 0, r: 0 },
      e: { c: Object.keys(this.table[0]).length - 1, r: this.table.length }
    };

    for (var R = range.s.r; R <= range.e.r; ++R) {
      for (var C = range.s.c; C <= range.e.c; ++C) {
        var cell_address = { c: C, r: R };
        var cellName = XLSX.utils.encode_cell(cell_address);
        wb.Sheets[ws_name][cellName].z = fmt;
      }
    }

    this.wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
  }

  convertExcelToJsonForPost(file) {
    let reader = new FileReader();
    let workbookkk;
    let XL_row_object;
    let json_object;
    var that = this;
    reader.readAsBinaryString(file);
    return new Promise((resolve, reject) => {
      reader.onload = function () {
        let data = reader.result;
        workbookkk = XLSX.read(data, { type: 'binary' });
        workbookkk.SheetNames.forEach(function (sheetName) {
          XL_row_object = XLSX.utils.sheet_to_json(workbookkk.Sheets[sheetName]);
          that.fileObject = XL_row_object;
          json_object = JSON.stringify(XL_row_object);
          resolve(XL_row_object);
        });
      };
    });
  }
}