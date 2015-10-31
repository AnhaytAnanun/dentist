 "use strict";	
$(document).ready(function(){

  $('.slider1').bxSlider({
    slideWidth: 200,
    minSlides: 2,
    maxSlides: 2,
    slideMargin: 2,
	auto:true,
	pager:false,
	nextText: '',
 	prevText: ''
  });
  
  $('.disast').bxSlider({
	mode: 'vertical',
    minSlides: 3,
    maxSlides: 3,
    slideMargin: 0,
	auto:true,
	pager:false,
	nextText: '',
 	prevText: ''
  });
   $('.sliding').bxSlider({
	/*mode: 'vertical',*/
    minSlides: 2,
    maxSlides: 2,
    slideMargin: 0,
	auto:true,
	pager:false,
	nextText: '',
 	prevText: ''
  });
   $('.happy').bxSlider({
    /* slideWidth: 200, */
    minSlides: 2,
    maxSlides: 2,
    slideMargin: 2,
	auto:true,
	pager:true,
	nextText: '',
 	prevText: ''
  });
});

$(document).ready(function () {
    $("#panel1").slideDown("slow");
    $("#flip1 h3").addClass('minus');
    $("#flip1 h3").css('background-image', 'url(images/icons/flip-ico.png)');

    $('h3[id^="head"]').click(function () {
        var CurrElemId = $(this).attr("id");
        var index = CurrElemId.substr(CurrElemId.length - 1);
        var totalnumber = $("li[id^='flip']").length;

        for (var i = 1; i <= totalnumber; i++) {
            var temp = "head" + i;
            if (CurrElemId == temp) {
                if ($("#panel" + i).is(":visible")) {
                    $("#flip" + i + " h3").removeClass('minus');
                    $("#flip" + i + " h3").css('background-image', 'url(images/icons/flip-ico+.png)');
                    $("#panel" + i).slideUp("slow");
                }
                else {
                    $("#flip" + i + " h3").addClass('minus');
                    $("#flip" + i + " h3").css('background-image', 'url(images/icons/flip-ico.png)');
                    $("#panel" + i).slideDown("slow");
                }
            }
            else {
                $("#flip" + i + " h3").removeClass('minus');
                $("#flip" + i + " h3").css('background-image', 'url(images/icons/flip-ico+.png)');
                $("#panel" + i).slideUp("slow");
                //if ($("#panel" + i).is(":visible")) {
                //    $("#panel" + i).slideUp("slow");
                //}
                //else {
                //    $("#panel" + i).slideDown("slow");
                //}
            }
        }
    });
});

/*checker */



/*$(document).ready(function () {

    $('div[id^="down"]').each(function (i, obj) {
        $(this).hide();
        $(this).css('background-color', '#F0F8FF');
        $(this).css('padding', '28px 15px');
    });

    $("#down1").slideDown("slow");
    $("#top1 h3").addClass('minus');
    $("#top1 h3").css('background-image', 'url(images/icons/flip-ico.png)');
	
    $('h3[id^="disc"]').click(function () {
        var CurrElemId = $(this).attr("id");
        var index = CurrElemId.substr(CurrElemId.length - 1);
        var totalnumber = $("li[id^='top']").length;

        for (var i = 1; i <= totalnumber; i++) {
            var temp = "disc" + i;
            if (CurrElemId == temp) {
                $("#top" + i).prependTo("#TopLevelList");
                if ($("#down" + i).is(":visible")) {
                    $("#top" + i + " h3").removeClass('minus');
                    $("#top" + i + " h3").css('background-image', 'url(images/icons/flip-ico+.png)');
                    $("#down" + i).slideUp("slow");
                }
                else {
                    $("#top" + i + " h3").addClass('minus');
                    $("#top" + i + " h3").css('background-image', 'url(images/icons/flip-ico.png)');
                    $("#down" + i).slideDown("slow");
                }
            }
            else {
                $("#top" + i + " h3").removeClass('minus');
                $("#top" + i + " h3").css('background-image', 'url(images/icons/flip-ico+.png)');
                $("#down" + i).slideUp("slow");
            }
        }
    });
});
*/

$(document).ready(function () {
	$('div[id^="down"]').each(function (i, obj) {
        $(this).hide();
        $(this).css('background-color', '#F0F8FF');
        $(this).css('padding', '28px 15px');
    });

    //$("#down1").slideDown("slow");
    //$("#top1 h3").addClass('minus');
    //$("#top1 h3").css('background-image', 'url(images/icons/flip-ico.png)');

    $('h3[id^="disc"]').click(function () {
        var CurrElemId = $(this).attr("id");
        var index = CurrElemId.substr(CurrElemId.length - 1);
        var totalnumber = $("li[id^='top']").length;

        for (var i = 1; i <= totalnumber; i++) {
            var temp = "disc" + i;
            if (CurrElemId == temp) {
                if ($("#down" + i).is(":visible")) {
                    $("#top" + i + " h3").removeClass('minus');
                    $("#top" + i + " h3").css('background-image', 'url(images/icons/flip-ico+.png)');
                    $("#down" + i).slideUp("slow");
                }
                else {
                    $("#top" + i + " h3").addClass('minus');
                    $("#top" + i + " h3").css('background-image', 'url(images/icons/flip-ico.png)');
                    $("#down" + i).slideDown("slow");
                }
            }
            else {
                $("#top" + i + " h3").removeClass('minus');
                $("#top" + i + " h3").css('background-image', 'url(images/icons/flip-ico+.png)');
                $("#down" + i).slideUp("slow");
                //if ($("#panel" + i).is(":visible")) {
                //    $("#panel" + i).slideUp("slow");
                //}
                //else {
                //    $("#panel" + i).slideDown("slow");
                //}
            }
        }
    });
});


