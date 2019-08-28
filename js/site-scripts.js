function resizeElements() {
	$('#month-section').textfill({
		maxFontPixels: 200
	});
	$('#date-section').textfill({
		maxFontPixels: 200
	});
	$('#time-section').textfill({
		maxFontPixels: 200
	});
	$('#ampm-section').textfill({
		maxFontPixels: 200
	});
	$('#letter-day-section').textfill({
		maxFontPixels: 200
	});
	$('#period-section').textfill({
		maxFontPixels: 200
	});
	$('#cycle-section').textfill({
		maxFontPixels: 200
	});
	$('.announcement-item-title').textfill({
		maxFontPixels: 200
	});
	$('.announcement-item-body').textfill({
		maxFontPixels: 200
	});
}

function updateClock() {
	var now = new Date();
	var hour = now.getHours();
	var minute = now.getMinutes();
	var ampm = 'AM';
	var period = 'X';
	switch(hour) {
		case 0:
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
			period = 'BS';
			break;
		case 7:
			if (minute >= 40) {
				period = 'P1';
			} else {
				period = 'BS';
			}	
			break;
		case 8:
			if (minute >= 23) {
				period = 'P2';
			} else {
				period = 'P1';
			}
			break;
		case 9:
			if (minute >=  51) {
				period = 'P4';
			} else if (minute >= 7) {
				period = 'P3';
			} else {
				period = 'P2'
			}
			break;
		case 10:
			if (minute >= 59) {
				period = 'P5';
			} else if (minute >= 35) {
				period = 'ADV';
			} else {
				period = 'P4';
			}
			break;
		case 11:
			if (minute >= 43) {
				period = 'P6';
			} else {
				period = 'P5';
			}
			break;
		case 12:
			if (minute >= 27) {
				period = 'P7';
			} else {
				period = 'P6';
			}
			break;
		case 13:
			if (minute >= 55) {
				period = 'P9';
			} else if (minute >= 11) {
				period = 'P8';
			} else {
				period = 'P7';
			}
			break;
		case 14:
			if (minute >= 41) {
				period = 'AP';
			} else {
				period = 'P9';
			}
			break;
		case 15:
			if (minute >= 16) {
				period = 'AS';
			} else {
				period = 'AP';
			}
		default:
			period = 'AS';
	}
	if (hour == 0) {
		hour = 12;
	} else if (hour == 12) {
		ampm = 'PM'
	} else if (hour > 12) {
		hour -= 12;
		ampm = 'PM';
	}
	if (minute < 10) {
		minute = '0' + minute;
	}
	$('#time-section').html('<span>' + hour + ':' + minute + '</span>');
	$('#ampm-section').html('<span>' + ampm + '</span>')
	var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
	$('#month-section').html('<span>' + months[now.getMonth()] + '</span>');
	$('#date-section').html('<span>' + now.getDate() + '</span>');
	$('#period-section').html('<span>' + period + '</span>');
	resizeElements();
	setTimeout(updateClock, 5000);
}

window.addEventListener('resize', resizeElements);
updateClock();
$('#announcements-card').carousel();
$('#announcements-card').on('slid.bs.carousel', function() {
    resizeElements();
});

var dir = 'images\\slideshow-images\\';

$.ajax({
    url : dir,
    success: function(data) {
        $(data).find("a").attr("href", function (i, file) {
            if (file.match(/\.(jpe?g|png|gif)$/)) {
            	var element = '';
            	if (i == 0) {
            		element += '<div class="item active">';
            	} else {
            		element += '<div class="item">';
            	}
            	element += '<div class="slideshow-div"><img class="slideshow-img" src="' + dir + file + '"></div></div>';
                $("#media-carousel-item-container").append(element);
            } 
        });
    },
    complete: function(data) {
    	$('#slideshow-card').carousel();
    }
});