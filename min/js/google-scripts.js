var CLIENT_ID="835795750372-1hej792ghu2omccu5061a2nsrtrjuhh2.apps.googleusercontent.com",API_KEY="AIzaSyBt5O0GLMXaSYKphWXikYa9CQ2HcdiKhjw",DISCOVERY_DOCS=["https://sheets.googleapis.com/$discovery/rest?version=v4"],SCOPES="https://www.googleapis.com/auth/spreadsheets.readonly";function handleClientLoad(){gapi.load("client:auth2",initClient)}function initClient(){gapi.client.init({apiKey:API_KEY,clientId:CLIENT_ID,discoveryDocs:DISCOVERY_DOCS,scope:SCOPES}).then(function(){pullSheetData()})}function pullSheetData(){pullLetterDay(),pullAnnouncements(),$("#announcements-card").carousel("cycle")}var letterDayCell="Calendar!A1";function pullLetterDay(){gapi.client.sheets.spreadsheets.values.get({spreadsheetId:"1ovki_EYdu7FC2OZKbxBvnwiKHkePdcamvjXzuXIw4NA",range:letterDayCell}).then(function(e){var n=e.result.values;$("#letter-day-section").html("<span>"+n[0][0]+"</span>"),resizeElements()})}var announcementDataRange="Approved Announcements!C:E",announcementColumn=0,titleColumn=1,imageURLColumn=2;function pullAnnouncements(){gapi.client.sheets.spreadsheets.values.get({spreadsheetId:"1ovki_EYdu7FC2OZKbxBvnwiKHkePdcamvjXzuXIw4NA",range:announcementDataRange}).then(function(e){for(var n=e.result.values,t=1;t<n.length;t++){var a="";a=1==t?'<div class="item announcement-item active">':'<div class="item announcement-item">',n[t][imageURLColumn]||(n[t][imageURLColumn]="images\\default-announcement-image.png"),a+='<div class="announcement-item-text"><div class="announcement-item-part announcement-item-title"><span>'+n[t][titleColumn]+"</span></div>",a+='<div class="announcement-item-part announcement-item-body"><span>'+n[t][announcementColumn]+"</span></div></div>",a+='<div class="announcement-item-part announcement-item-img-div"><img class="announcement-item-img" src="'+n[t][imageURLColumn]+'"></div>',a+="</div>",$("#annoucement-carousel-item-container").append(a)}resizeElements()})}function refreshAnnouncements(){$("#announcements-card").carousel("pause"),$("#annoucement-carousel-item-container").empty(),pullAnnouncements(),$("#announcements-card").carousel("cycle")}