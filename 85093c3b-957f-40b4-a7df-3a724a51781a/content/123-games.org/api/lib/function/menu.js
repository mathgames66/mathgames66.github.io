var gameId;
var menuHtml;
var hostStr;
var Menu = {
    init: function(idOfGame) {
        // var $ = jQuery.noConflict();

        // var height = jQuery(document).prop('scrollHeight');
        // var width = jQuery(document).prop('scrollWidth');
        // var height = jQuery(document).height();
        // var width = jQuery(document).width();
        // var body = document.body;
        

        // jQuery(function($) {
        jQuery(document).ready(function() {

            // var $ = jQuery.noConflict();
            jQuery('<script src="'+hostStr+'function\/sweetalert.min.js"><\/script>').appendTo('head');
            
            try{
                hostStr = host;
            }catch(e){
                hostStr = window.parent.host;
            }

            var height = jQuery(window).height();
            var width = jQuery(window).width();
            var body = document.body;
            // if(typeof window.parent !== 'undefined'){
            //     var height = window.parent.jQuery(window).height();
            //     var width = window.parent.jQuery(window).width();
            //     var body = window.parent.document.body;
            
            console.log(1);

            if (jQuery('#rankScr').length > 0) {
                jQuery('#rankScr').remove();
            }
            if (jQuery('#menuScr').length > 0) {
                jQuery('#menuScr').remove();
            }

            if (jQuery('#closeMenuSrc').length > 0) {
                jQuery('#closeMenuSrc').remove();
            }

            if (jQuery('#searchScr').length > 0) {
                jQuery('#searchScr').remove();
            }
            // jQuery('<script src="function/modernizr.js"></script>').appendTo('head');
            // jQuery('<script src="function/main.js"></script>').appendTo('head');

            // jQuery('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">').appendTo('head');
            // jQuery('<link rel="stylesheet" href="'+host+'function/css/style2.css">').appendTo('head');
            // jQuery('<script id="searchScr">')
            //     .attr('type', 'text/javascript')
            //     .text('function search(){var valueSearch = jQuery("#search").val(); window.location.href=\"https:\/\/123gamesfree.com/?s=valueSearch\";}')
            //     .append('</script>').appendTo('head');
            //jQuery('<script src="'+host+'function\/jquery-3.2.1.min.js"></script>').appendTo("head");
            //jQuery('<link rel="stylesheet" href="'+host+'function/css/style2.css">').appendTo('head');
            // jQuery("#menuFrame").contents().find("head").append('<script src="'+hostStr+'function\/jquery-3.2.1.min.js"></script>');
            jQuery("#menuFrame").contents().find("head").append('<link rel="stylesheet" href="'+hostStr+'function/css/style2.css">');
            // jQuery("#menuFrame").contents().find("head").append('<script src="'+host+'function\/scoreAjax.js"></script>');
            jQuery("#menuFrame").contents().find("head").append('<script src="'+hostStr+'function\/sweetalert.min.js"><\/script>');
            // jQuery("#menuFrame").contents().find("head").append('<script src="'+host+'function\/saveScore.js"><\/script>');
            // jQuery("#menuFrame").contents().find("head").append('<script src="'+host+'function\/menu.js"><\/script>');
            jQuery("#menuFrame").contents().find("head").append('<script>function runEnterSearch(e) {if (e.keyCode == 13) {var valueSearch = document.getElementById("search").value; if(typeof window.top !== "undefined"){ window.top.location.href="https:\/\/123gamesfree.com\/?s="+valueSearch;}else{window.location.href="https:\/\/123gamesfree.com\/?s="+valueSearch;}}}<\/script>');

            // var $head = jQuery("#menuFrame").contents().find("head"); 
            // var url = "Styles/styles.css";
            // $head.append(jQuery("<link/>", { rel: "stylesheet", href: url, type: "text/css" } ));

            jQuery("#menuFrame").contents().find("body").html('<div id="menu" style="float: right; background: lavender;"></div>');
            // jQuery('<div id="menu" style="float: right; background: lavender;"></div>').appendTo('body');
            // jQuery('#menu').load(''+host+'function/template/menu.html #mySidenav');
            jQuery("#menuFrame").contents().find('#menu').load(''+hostStr+'function/template/menu.html #mySidenav');
            jQuery.get(''+hostStr+'function/config', function(data) {

                var arr = data.split("\n");
                var logoLink, logoImg;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].startsWith("#logoLink")) {
                        logoLink = arr[i].split(";")[0].split("|")[1];
                        logoImg = arr[i].split(";")[1].split("|")[1];
                        break;
                    }
                }

                setTimeout(function() {
                    // var $ = jQuery.noConflict();
                    jQuery('<div id="rankMenu" style="top: 4%; left: 10px; position: fixed; z-index: 7777;"><img style="max-width: 50px; max-height: 50px;" src="'+hostStr+'function\/img\/icon_menu_main.png"\/><\/div>').appendTo('body');
                    // console.log(host+"function/template/menu.html");
                    // jQuery("#menu").load(""+host+"function/template/menu.html", function(data) {
                        jQuery("#menuFrame").contents().find("#menu").load(""+hostStr+"function/template/menu.html", function(data) {
                        // jQuery("#logoLink").attr("href", logoLink);
                        // jQuery("#logoImg").attr("src", host+logoImg);
                        // jQuery("#menuFrame").contents().find("#logoLink").attr("href", logoLink);
                        jQuery("#menuFrame").contents().find("#logoImg").attr("src", hostStr+logoImg);

                        // jQuery("#menuUl li img").each(function(n) {
                        jQuery("#menuFrame").contents().find("#menuUl li img").each(function(n) {
                            // console.log(hostStr+jQuery(this).attr("src"));
                            jQuery(this).attr("src", hostStr+'function/img/'+jQuery(this).attr("id")+'.png');
                        });
                        // console.log(1);
                        if(typeof idOfGame !== 'undefined'){
                            // jQuery("#rankingLi").css("display","");
                            jQuery("#menuFrame").contents().find("#rankingLi").css("display","");
                            gameId = idOfGame;
                            // console.log(idOfGame);
                            // jQuery("#rankLink").attr("gameId",gameId);
                            jQuery("#menuFrame").contents().find("#rankLink").attr("gameId",gameId);
                            jQuery("#menuFrame").contents().find("#rankLink").attr("onclick","javascript:(function(){window.parent.Score.rank("+gameId+"); window.parent.Menu.close(0);})()");
                            // gameId = jQuery(data).find("#rankLink").attr("gameId",idOfGame);
                            // jQuery("#menuFrame").contents().find("body").append('<script>var $ = window.parent.jQuery.noConflict(); $("#rankLink", document).on("click", function(e){console.log(11); parent.Score.rank(' + gameId + '); parent.Menu.close(0);}); <\/script>');
                            // jQuery('#menuFrame').ready(function(){
                            // jQuery("#menuFrame").contents().find("body").append('<script>$("#rankLink").click(function(e){Score.rank(' + gameId + '); Menu.close(0); e.preventDefault();}); <\/script>');
                            // });
                            // jQuery("#menuFrame").contents().find("body").append('<script id="rankScr">console.log(document.getElementById("rankLink")); document.getElementById("rankLink").addEventListener("click", function(e){e.preventDefault(); window.parent.Score.rank(' + gameId + '); window.parent.Menu.close(0);});<\/script>');

                            
                        }else{
                            // console.log(1);
                            // jQuery("#rankingLi").css("display","none");
                            jQuery("#menuFrame").contents().find("#rankingLi").css("display","none");
                        }
                        
                    });


                    jQuery('<script id="menuScr">')
                        .attr('type', 'text/javascript')
                        .text('jQuery(function($) {jQuery("#rankMenu").click(function(){jQuery("#menuFrame").contents().find("#mySidenav").css("width", "250px"); jQuery("#menuFrame").contents().find("#menu").fadeIn(1000); jQuery("#menuFrame").fadeIn(1500); jQuery("#rankMenu").fadeOut();});});')
                        .append('</script>').appendTo('body');

                    // jQuery('<script id="closeMenuSrc">')
                    //     .attr('type', 'text/javascript')
                    //     .text('jQuery(function($) {jQuery("#closeMenu").click(function(){alert(1)});});')
                    //     .append('</script>').appendTo('body');


                }, 500);
            }, 'text');



        });
        // });
    },
    show: function() {
        openNav();
    },
    close: function(type) {
        closeNav(type);
    }
}

function openNav() {
    // var $ = jQuery.noConflict();
    // jQuery(function($) {
    
    // document.getElementById("mySidenav").style.width = "250px";
    // jQuery('#menu').fadeIn(1000);
    jQuery("#menuFrame").contents().find('#mySidenav').css("width", "250px");
    jQuery("#menuFrame").contents().find('#menu').fadeIn(1000);
    jQuery("#menuFrame").fadeIn(1500);
    // });
}

/* Set the width of the side navigation to 0 */
function closeNav(type) {
    // var $ = jQuery.noConflict();
    // jQuery(function($) {
    // document.getElementById("mySidenav").style.width = "0";

    // jQuery('#menu').fadeOut(1000);
    // if (type === 1) {
    //     jQuery("#rankMenu").fadeIn(2000);
    // }
    // });

    jQuery("#menuFrame").contents().find('#mySidenav').css("width", "0");
    jQuery("#menuFrame").contents().find('#menu').fadeOut();
    jQuery("#menuFrame").fadeOut(1500);

    if (type === 1) {
        jQuery("#rankMenu").fadeIn(2000);
    }
    if(typeof window.parent !== "undefined"){
        window.parent.focus();
    }else{
        window.focus();
    }
}

window.addEventListener("resize", function() {
    // var $ = jQuery.noConflict();
    // jQuery(function($) {
    var clientHeight = document.documentElement.clientHeight;
    var clientWidth = document.documentElement.clientWidth;
    jQuery('#menuFrame').css("width", clientWidth).css("height", clientHeight);
    // });
});


