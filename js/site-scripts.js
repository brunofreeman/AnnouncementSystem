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
		case 7:
			period = 'HR';
			break;
		case 8:
			if (minute >= 38) {
				period = 'P2';
			} else {
				period = 'P1';
			}
			break;
		case 9:
			if (minute >=  20) {
				period = 'P3';
			} else {
				period = 'P2';
			}
			break;
		case 10:
			if (minute >= 44) {
				period = 'P5';
			} else if (minute >= 2) {
				period = 'P4';
			} else {
				period = 'P3';
			}
			break;
		case 11:
			if (minute >= 26) {
				period = 'P6';
			} else {
				period = 'P5';
			}
			break;
		case 12:
			if (minute >= 50) {
				period = 'P8';
			} else if (minute >= 8) {
				period = 'P7';
			} else {
				period = 'P6';
			}
			break;
		case 13:
			if (minute >= 32) {
				period = 'P9';
			} else {
				period = 'P8';
			}
			break;
		case 14:
			if (minute >= 45) {
				period = 'AS';
			} else {
				period = 'AP';
			}
			break;
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
$('#announcements-card, #slideshow-card').carousel();
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
    }
});