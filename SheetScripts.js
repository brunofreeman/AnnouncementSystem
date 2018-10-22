var spreadsheet = SpreadsheetApp.getActiveSpreadsheet(); //the whole spreadsheet
var formResponseSheet = spreadsheet.getSheetByName("Form Responses"); //the form response sheet
var approvedAnnouncementsSheet = spreadsheet.getSheetByName("Approved Announcements"); //the approved announcements sheet
var futureApprovedAnnouncementsSheet = spreadsheet.getSheetByName("Future Approved Announcements"); //approve annoucement sheet for start dates in the future
var timestampColumnIndex = 1; //form response sheet column indices
var startDateColumnIndex = 2;
var endDateColumnIndex = 3;
var announcementColumnIndex = 4;
var announcementTitleColumnIndex = 5;
var imageUrlColumnIndex = 6;
var emailAddressColumnIndex = 7;
var approveColumnIndex = 8;
var startAnnouncementDataColumn = 2; //the start of the core announcement data (start date, end date, text)
var endAnnouncementDataColumn = 6; //the end of the core data
var firstDataRowIndex = 2; //the first non-title row index
var approvedStartDateColumnIndex = 1; //the column index of the approved annoucements end date column
var approvedEndDateColumnIndex = 2; //the column index of the approved annoucements end date column   
var today = new Date(); //gets the current date and time
var lunchTitle = "Today's Lunch";
var noAnnouncementsTitle = "No Announcements";
var titleColumn = 4;

function onNewDay() { //runs every day between midnight and 1am
  updateLunch(); //function call
  deleteExpiredAnnouncements(); //function call
  getFutureAnnoucements(); //function call
  getLetterDay();
  cleanUpAnnouncements();
}

function deleteExpiredAnnouncements() { //deletes all expires announcements on the approved sheet
  for (var rowIndex = approvedAnnouncementsSheet.getLastRow(); rowIndex >= firstDataRowIndex; rowIndex--) { //starts at the last row of approved announcements and works its way to the first
    var currentEndDateCell = approvedAnnouncementsSheet.getRange(rowIndex, approvedEndDateColumnIndex, 1, 1); //gets the cell with the end date for the current row
    var currentEndDateCellValue = currentEndDateCell.getValue(); //gets the above cell's value
    var currentEndDate = new Date(currentEndDateCellValue); //makes a new Date object with that value
    if (today.getFullYear() > currentEndDate.getFullYear() || 
       (today.getFullYear() === currentEndDate.getFullYear() && today.getMonth() > currentEndDate.getMonth()) || 
       (today.getFullYear() === currentEndDate.getFullYear() && today.getMonth() === currentEndDate.getMonth() && today.getDate() > currentEndDate.getDate())) { //if today's date is after the end date
         approvedAnnouncementsSheet.deleteRow(rowIndex); //delete the row with that end date (it will still be in the archive)
    }
  }
}

function getFutureAnnoucements() { //sends announcements from the future sheet to the normal approved sheet if their start date is today
  for (var rowIndex = futureApprovedAnnouncementsSheet.getLastRow(); rowIndex >= firstDataRowIndex; rowIndex--) { //starts at the last row of future approved announcements and works its way to the first
    var currentStartDateCell = futureApprovedAnnouncementsSheet.getRange(rowIndex, approvedStartDateColumnIndex, 1, 1); //gets the cell with the start date for the current row
    var currentStartDateCellValue = currentStartDateCell.getValue(); //gets the above cell's value
    var currentStartDate = new Date(currentStartDateCellValue); //makes a new Date object with that value
    if (today.getFullYear() > currentStartDate.getFullYear() || 
       (today.getFullYear() === currentStartDate.getFullYear() && today.getMonth() > currentStartDate.getMonth()) || 
       (today.getFullYear() === currentStartDate.getFullYear() && today.getMonth() === currentStartDate.getMonth() && today.getDate() >= currentStartDate.getDate())) { //if today's date is after the start date or is the start date
         var transferRow = futureApprovedAnnouncementsSheet.getRange(rowIndex, 1, 1, futureApprovedAnnouncementsSheet.getMaxColumns()); //gets the all of the announcement data
         var transferValues = transferRow.getValues()[0]; //gets the values of the above range
         approvedAnnouncementsSheet.appendRow(transferValues); //copies values to approved sheet
         futureApprovedAnnouncementsSheet.deleteRow(rowIndex); //delete the row with that end date (it will still be in the archive)
    }
  }
}

function updateLunch() { //parses the lunch from the school's website
  var today = new Date();
  var dayNum = today.getDate().toString(); //gets the day number (e.g. 23 for Nov. 23rd)
  var request = UrlFetchApp.fetch("http://www.slcs.org/students/9-12menu"); //makes a request for school lunch webpage
  var html = request.getContentText(); //gets the html text of the lunch webpage
  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; //a list of the months in order
  var monthName = monthNames[today.getMonth()]; //based on todays month [0-11], get the month name
  var nextMonthName = monthNames[(today.getMonth() + 1) % 12];
  if (html.indexOf(nextMonthName) === -1) {
    html = html.substring(html.indexOf(monthName));
  } else {  
    html = html.substring(html.indexOf(monthName), html.indexOf(nextMonthName));
  }  
  var startStr = "<p>" + dayNum + "<\/p>"; //forms the start of today's menu
  var endStr = "<br \/><\/p>"; //today's menu ends in this
  var startIndex = html.indexOf(startStr); //finds where the start is
  var endIndex = html.indexOf(endStr, startIndex) + endStr.length; //finds the end
  var menu = html.substring(startIndex + startStr.length, endIndex); //gets the menu from all of the webpage text
  if (startIndex === -1 || menu.indexOf("Superintendents<br />Conference Day") != -1 || menu.indexOf("NO SCHOOL") != -1 || menu.indexOf(" <br \/><br \/><br \/><br \/><br \/><br \/><br \/><br \/>") != -1) { //if the menu wasn't found or it's invalid
    menu = "No lunch today!"; //set to default string
  } else { //otherwise, trim off unnecessary tags
    menu = menu.substring(18, menu.length - 4); //trim
  }
  var todayString = dateToString(today); //today's date in the format mm/dd/yyyy
  var lunchImg = "images\\lunch-announcement-image.png"; //sets the image url
  var lunchData = [[todayString, todayString, menu, lunchTitle, lunchImg]]; //creates a array of the lunch data 
  approvedAnnouncementsSheet.insertRowBefore(firstDataRowIndex); //inserts a row after the header row
  var lunchRow = approvedAnnouncementsSheet.getRange(firstDataRowIndex, 1, 1, endAnnouncementDataColumn - startAnnouncementDataColumn + 1); //gets that row as a range
  lunchRow.setValues(lunchData); //sets the row to contain the lunch data
}

function deleteLunch() {
  if (approvedAnnouncementsSheet.getLastRow() <= 2) {
    addNoAnnouncements();
  }  
  for (var rowIndex = approvedAnnouncementsSheet.getLastRow(); rowIndex >= firstDataRowIndex; rowIndex--) {
    var title = approvedAnnouncementsSheet.getRange(rowIndex, titleColumn, 1, 1).getValue();
    if (title === lunchTitle) {
      approvedAnnouncementsSheet.deleteRow(rowIndex);
    }
  }
}
  
function onEdit() { //set as the trigger to an edit
  var sheet = spreadsheet.getActiveSheet(); //gets the active sheet
  var approveKeyword = "approve"; //the keyword used to approve an announcement     
  if (sheet.getName() === formResponseSheet.getName()) { //checks if it is the form response sheet
    var cell = sheet.getActiveCell(); //gets the active cell (the one just edited)
    if (cell.getRow() >= firstDataRowIndex && cell.getColumn() === approveColumnIndex && cell.getValue().toString() === approveKeyword) { //checks if it's in the approve column and the text in it is "approve"
      approveAnnouncement(cell.getRow()); //call approveAnnouncement() with the cell's row as the parameter
    }
  }
}

function approveAnnouncement(rowIndex) { //sends an announcement to the archive sheet and approved or future approve sheets
  var transferRow = formResponseSheet.getRange(rowIndex, 1, 1, approveColumnIndex - 1); //gets the all of the announcement data
  var transferValues = transferRow.getValues()[0]; //gets the values of the above range
  var transferValuesCore = transferValues.slice(startAnnouncementDataColumn - 1, endAnnouncementDataColumn); //gets the core values
  var announcementArchiveSheet = spreadsheet.getSheetByName("Announcement Archive"); //the announcement archive sheet
  announcementArchiveSheet.appendRow(transferValues); //copies all values to archive
  var startDateCell = formResponseSheet.getRange(rowIndex, startDateColumnIndex, 1, 1); //gets the cell with the start date
  var startDateCellValue = startDateCell.getValue(); //gets the above cell's value
  var startDate = new Date(startDateCellValue); //makes a new Date object with that value
  if (today.getFullYear() > startDate.getFullYear() || 
     (today.getFullYear() === startDate.getFullYear() && today.getMonth() > startDate.getMonth()) || 
     (today.getFullYear() === startDate.getFullYear() && today.getMonth() === startDate.getMonth() && today.getDate() >= startDate.getDate())) { //if today's date is after the start date or is the start date
		approvedAnnouncementsSheet.appendRow(transferValuesCore); //copies core values to approved sheet
	    for (var rowIndex2 = approvedAnnouncementsSheet.getLastRow(); rowIndex2 >= firstDataRowIndex; rowIndex2--) { //delete the no announcements announcement if it's there
	    	var title = approvedAnnouncementsSheet.getRange(rowIndex2, titleColumn, 1, 1).getValue();
	    	if (title === noAnnouncementsTitle) {
	      		approvedAnnouncementsSheet.deleteRow(rowIndex2);
	    	}
		}
  } else { //otherwise
    futureApprovedAnnouncementsSheet.appendRow(transferValuesCore); //copies core values to future approved sheet
  }
  formResponseSheet.deleteRow(rowIndex); //deletes the original form submission sheet entry
}

function onFormSubmit() { //set as the trigger to a form submission
  var adminEmails = ["freemanbru@slcs.org", "campbelmax@slcs.org"]; //school emails of the announcement admins
  var spreadsheetUrl = "https://docs.google.com/spreadsheets/d/1ovki_EYdu7FC2OZKbxBvnwiKHkePdcamvjXzuXIw4NA/edit#gid=1183776242";
  var approveColumn = formResponseSheet.getRange(firstDataRowIndex, approveColumnIndex, formResponseSheet.getMaxRows() - firstDataRowIndex + 1, 1); //gets the approve column data range
  approveColumn.setBorder(false, true, false, false, null, null, "lime", SpreadsheetApp.BorderStyle.SOLID_THICK); //sets the left border of the approve column green
  var submissionRow = formResponseSheet.getMaxRows() - 1; //the newest announcement will sort to the bottom row, except the one placeholder row that doesn't have a timestap
  var subject = "New Announcement Submission: " + formResponseSheet.getRange(submissionRow, announcementTitleColumnIndex, 1, 1).getValue(); //the subject line of an email
  var startDate = dateToString(new Date(formResponseSheet.getRange(submissionRow, startDateColumnIndex, 1, 1).getValue())); //gets the start date as a string
  var endDate = dateToString(new Date(formResponseSheet.getRange(submissionRow, endDateColumnIndex, 1, 1).getValue())); //gets the end date as a string
  var message = "Submitted by: " + formResponseSheet.getRange(submissionRow, emailAddressColumnIndex, 1, 1).getValue() + 
                "\n\nAnnouncement: " + formResponseSheet.getRange(submissionRow, announcementColumnIndex, 1, 1).getValue() +   
                "\n\nTitle: " + formResponseSheet.getRange(submissionRow, announcementTitleColumnIndex, 1, 1).getValue() +
                "\n\nDates to run: " + startDate + "-" + endDate +
                "\n\nImage: " + formResponseSheet.getRange(submissionRow, imageUrlColumnIndex, 1, 1).getValue() +
                "\n\nApprove this announcement: " + spreadsheetUrl; //builds an email to be sent to the admins
  for (var i = 0; i < adminEmails.length; i++) { //loops through the admin emails
    MailApp.sendEmail(adminEmails[i], subject, message); //sends an email to the admin
  }
}

function cleanUpAnnouncements() {
  if (approvedAnnouncementsSheet.getLastRow() > 2) { //other announcements
    if (approvedAnnouncementsSheet.getRange(2, 3, 1, 1).getValue() === "No lunch today!") { //if there is no lunch and other announcements, delete lunch
      deleteLunch();
    } else { //if there is lunch and other announcements, delete lunch after 7th period
      var date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 50, 0, 0);
      ScriptApp.newTrigger("deleteLunch").timeBased().at(date).create();
    }
  } else { //only lunch
    if (approvedAnnouncementsSheet.getRange(2, 3, 1, 1).getValue() === "No lunch today!") { //if only announcement is lunch and there is no lunch, no announcements
      addNoAnnouncements();
      deleteLunch();
    } else { //if only announcement is lunch, delete after 7th and no announcements
      var date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 50, 0, 0);
      ScriptApp.newTrigger("deleteLunch").timeBased().at(date).create();
    }
  }
}

function addNoAnnouncements() {
  var todayString = dateToString(today); //today's date in the format mm/dd/yyyy
  var data = [[todayString, todayString, "There are currently no announcements!", noAnnouncementsTitle]];
  approvedAnnouncementsSheet.insertRowBefore(firstDataRowIndex); //inserts a row after the header row
  var row = approvedAnnouncementsSheet.getRange(firstDataRowIndex, 1, 1, endAnnouncementDataColumn - startAnnouncementDataColumn); //gets that row as a range
  row.setValues(data);
}  

function dateToString(date) { //takes in a Date object and returns a string in the form mm/dd/yyyy
  return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear(); //returns the string
}

function monthDayYearToString(month, day, year) { //takes in a month, day, and year and returns a string in the form mm/dd/yyyy
  return month + "/" + day + "/" + year; //returns the string
}

function getLetterDay() {
  var sheet = spreadsheet.getSheetByName("Calendar");
  var calendar = CalendarApp.getCalendarById("slcs.org_dcgjmbo5up71f43ebfrn2thmu8@group.calendar.google.com");
  var events = calendar.getEventsForDay(today);
  sheet.getRange("A1").setValue("-");
  if (events) {
    for (var i = 0; i < events.length; i++) {
      var event = events[i].getTitle().toUpperCase().trim();
      switch (event) {
        case "A DAY":
        case "B DAY":
        case "C DAY":
        case "D DAY":
        case "E DAY":
        case "F DAY":
          var title = events[i].getTitle();
            sheet.getRange("A1").setValue(event.substring(0, event.indexOf("DAY") - 1));
          
      }   
    }  
  }  
}