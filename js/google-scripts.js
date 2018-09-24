//client secret = dL5r3yMMjmeHxKNPHAjHbu9f
var CLIENT_ID = '835795750372-1hej792ghu2omccu5061a2nsrtrjuhh2.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBt5O0GLMXaSYKphWXikYa9CQ2HcdiKhjw';
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

function handleClientLoad() {
	gapi.load('client:auth2', initClient);
}

function initClient() {
	gapi.client.init({
		apiKey: API_KEY,
		clientId: CLIENT_ID,
		discoveryDocs: DISCOVERY_DOCS,
		scope: SCOPES
	}).then(function() {
		pullSheetData();
	});
}

function pullSheetData() {
	pullLetterDay();
	pullAnnouncements();
}

var letterDayCell = 'Calendar!A1'

function pullLetterDay() {
	gapi.client.sheets.spreadsheets.values.get({
		spreadsheetId: '1ovki_EYdu7FC2OZKbxBvnwiKHkePdcamvjXzuXIw4NA',
		range: letterDayCell,
	}).then(function(response) {
		var data = response.result.values;
		$('#letter-day-section').html('<span>' + data[0][0] + '</span>');
		resizeElements();
	});
}

var announcementDataRange = 'Approved Announcements!C:E'
var announcementColumn = 0;
var titleColumn = 1;
var imageURLColumn = 2;

function pullAnnouncements() {
	gapi.client.sheets.spreadsheets.values.get({
		spreadsheetId: '1ovki_EYdu7FC2OZKbxBvnwiKHkePdcamvjXzuXIw4NA',
		range: announcementDataRange,
	}).then(function(response) {
		var data = response.result.values;
		for (var i = 1; i < data.length; i++) {
			var element = '';
			if (i == 1) {
				element = '<div class="item announcement-item active">';
			} else {
				element = '<div class="item announcement-item">';
			}
			if (!data[i][imageURLColumn]) {
				data[i][imageURLColumn] = 'images\\default-announcement-image.png';
			}
			element += '<div class="announcement-item-text"><div class="announcement-item-part announcement-item-title"><span>' + data[i][titleColumn] + '</span></div>';
			element += '<div class="announcement-item-part announcement-item-body"><span>' + data[i][announcementColumn] + '</span></div></div>';
			element += '<div class="announcement-item-part announcement-item-img-div"><img class="announcement-item-img" src="' + data[i][imageURLColumn] + '"></div>';
			element += '</div>';
			$('#annoucement-carousel-item-container').append(element);
		}
		resizeElements();
	});
}

function refreshAnnouncements() {
	$('#annoucement-carousel-item-container').empty();
	pullAnnouncements();
}

setInterval(refreshAnnouncements, 1800000);

var now = new Date();
var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
var millisecondsToTommorow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 1, 30, 0, 0) - now;

function refreshLetterDay() {
	pullLetterDay();
	now = new Date();
	tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	millisecondsToTommorow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 1, 0, 0, 0) - now;
	setTimeout(refreshLetterDay, millisecondsToTommorow);
}

setTimeout(refreshLetterDay, millisecondsToTommorow);