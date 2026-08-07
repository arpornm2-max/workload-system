/**
 * Teacher Workload System - Google Apps Script Backend
 * 
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Copy and paste this code into Code.gs
 * 4. Deploy as Web App (Execute as: Me, Who has access: Anyone)
 */

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

function doGet(e) {
  try {
    const data = {
      users: getSheetDataAsObjects('Users'),
      workloads: getSheetDataAsObjects('Workloads'),
      workloadItems: getSheetDataAsObjects('WorkloadItems')
    };
    return respondSuccess(data);
  } catch (error) {
    return respondError(error.toString());
  }
}

function getSheetDataAsObjects(sheetName) {
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return []; // Only headers or empty

  const headers = data[0];
  const objects = [];
  for (let i = 1; i < data.length; i++) {
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = data[i][j];
    }
    objects.push(obj);
  }
  return objects;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === 'saveWorkload') {
      return handleSaveWorkload(data.payload);
    } else if (action === 'certifyItem') {
      return handleCertifyItem(data.payload);
    } else if (action === 'approveWorkload') {
      return handleApproveWorkload(data.payload);
    }

    return respondError('Unknown action');
  } catch (error) {
    return respondError(error.toString());
  }
}

function getSheet(name) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID) || SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (name === 'Workloads') {
      sheet.appendRow(['ID', 'Teacher ID', 'Teacher Name', 'Teacher Surname', 'Teacher Position', 'Teacher Department', 'Total Hours', 'Status', 'Reporter Signature (Base64)', 'Created At']);
    } else if (name === 'WorkloadItems') {
      sheet.appendRow(['Item ID', 'Workload ID', 'Description', 'Group', 'Hours', 'Certifier ID', 'Certifier Position', 'Is Certified', 'Certifier Signature (Base64)', 'Certified At']);
    } else if (name === 'Users') {
      sheet.appendRow(['ID', 'Name', 'Surname', 'Position', 'Department', 'Role', 'Username', 'Password']);
    }
  }
  return sheet;
}

function handleSaveWorkload(payload) {
  const wlSheet = getSheet('Workloads');
  const itemsSheet = getSheet('WorkloadItems');
  
  const wlId = 'WL_' + new Date().getTime();
  
  // Save Workload
  wlSheet.appendRow([
    wlId,
    payload.teacherId,
    payload.teacherInfo.name,
    payload.teacherInfo.surname,
    payload.teacherInfo.position,
    payload.teacherInfo.department,
    payload.totalHours,
    'pending',
    payload.reporterSignature, // Base64 can be large, careful with cell limit (50,000 chars)
    new Date().toISOString()
  ]);

  // Save Items
  payload.items.forEach(item => {
    const itemId = 'ITEM_' + Math.random().toString(36).substring(7);
    itemsSheet.appendRow([
      itemId,
      wlId,
      item.description,
      item.group,
      item.hours,
      item.certifierId,
      item.certifierPosition,
      false,
      '',
      ''
    ]);
  });

  return respondSuccess({ id: wlId });
}

function handleCertifyItem(payload) {
  const itemsSheet = getSheet('WorkloadItems');
  const data = itemsSheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === payload.itemId && data[i][1] === payload.workloadId) {
      itemsSheet.getRange(i + 1, 5).setValue(payload.newHours);
      itemsSheet.getRange(i + 1, 8).setValue(true);
      itemsSheet.getRange(i + 1, 9).setValue(payload.signatureBase64);
      itemsSheet.getRange(i + 1, 10).setValue(new Date().toISOString());
      
      checkAndUpdateWorkloadStatus(payload.workloadId);
      return respondSuccess({ message: 'Item certified' });
    }
  }
  
  return respondError('Item not found');
}

function checkAndUpdateWorkloadStatus(workloadId) {
  const itemsSheet = getSheet('WorkloadItems');
  const data = itemsSheet.getDataRange().getValues();
  
  let allCertified = true;
  let newTotalHours = 0;
  let hasItems = false;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === workloadId) {
      hasItems = true;
      newTotalHours += Number(data[i][4]); // Hours
      if (data[i][7] !== true) { // Is Certified
        allCertified = false;
      }
    }
  }
  
  if (hasItems) {
    const wlSheet = getSheet('Workloads');
    const wlData = wlSheet.getDataRange().getValues();
    for (let i = 1; i < wlData.length; i++) {
      if (wlData[i][0] === workloadId) {
        wlSheet.getRange(i + 1, 7).setValue(newTotalHours);
        if (allCertified) {
          wlSheet.getRange(i + 1, 8).setValue('certified');
        } else {
          wlSheet.getRange(i + 1, 8).setValue('partial_certified');
        }
        break;
      }
    }
  }
}

function handleApproveWorkload(payload) {
  const wlSheet = getSheet('Workloads');
  const wlData = wlSheet.getDataRange().getValues();
  for (let i = 1; i < wlData.length; i++) {
    if (wlData[i][0] === payload.workloadId) {
      wlSheet.getRange(i + 1, 8).setValue('approved');
      return respondSuccess({ message: 'Workload approved' });
    }
  }
  return respondError('Workload not found');
}

function respondSuccess(data) {
  return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: data }))
    .setMimeType(ContentService.MimeType.JSON);
}

function respondError(message) {
  return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: message }))
    .setMimeType(ContentService.MimeType.JSON);
}
