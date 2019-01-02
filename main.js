(function($, document, window) {
    var shrink_scale;
    var is_shrink = false;
    var shrink_scale_amount = 0;
    var seconds_old = 11;
    var active_image;

    const nye = new Date(2019, 0, 1, 0, 0, 0, 0);
    var current_time = {'time': ''};

    // Benny Canvas and Image Stuff
    const benny = new Image();
    benny.src = "benny.jpg";
    var benny_canvas = document.getElementById('benny');
    const benny_ctx = benny_canvas.getContext("2d");
    benny.onload = () => { window.requestAnimationFrame(mainLoopWithCtx(benny_ctx, benny_canvas, benny, drawImageRotated, 0.5)); }; // start when loaded

    // Benny Canvas and Image Stuff
    const happy = new Image();
    happy.src = "happy_2019.jpeg";
    var happy_canvas = document.getElementById('happy');
    const happy_ctx = happy_canvas.getContext("2d");
    happy.onload = () => { window.requestAnimationFrame(mainLoopWithCtx(happy_ctx, happy_canvas, happy, drawImageRotated, 0.8)); }; // start when loaded

    // Band Canvas and Image Stuff
    const band = new Image();
    band.src = "big-r-big-band.jpg";
    var band_canvas = document.getElementById('band');
    const band_ctx = band_canvas.getContext("2d");
    band.onload = () => { window.requestAnimationFrame(mainLoopWithCtx(band_ctx, band_canvas, band, drawImageRotated, 0.7)); }; // start when loaded

    // Clock Canvas
    var clock_canvas = document.getElementById('clock');
    const clock_ctx = clock_canvas.getContext("2d");
    window.requestAnimationFrame(mainLoopWithCtx(clock_ctx, clock_canvas, current_time, drawTextRotated, 4)); // start when loaded

    function drawImageRotated(img, x, y, scale, rot, ctx) {
        ctx.setTransform(scale, 0, 0, scale, x, y);
        ctx.rotate(rot);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    function drawTextRotated(obj, x, y, scale, rot, ctx) {
        var text_size = 90;
        if (is_shrink) {
            shrink_scale = shrink_scale - shrink_scale_amount;
            scale = shrink_scale;
        }
        ctx.setTransform(scale, 0, 0, scale, x, y);
        ctx.rotate(rot);
        // ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.font = "" + text_size + "px Share Tech Mono";
        ctx.fillStyle = "white";
        // ctx.textAlign = "center";
        ctx.fillText(obj.time, -ctx.measureText(obj.time).width / 2, text_size/2);
        // ctx.fillText(obj.time, ctx.canvas.width/2, ctx.canvas.height/2);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    function mainLoopWithCtx(ctx, canvas, obj, rotateFunc, scale) {
        function mainLoop(time) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            rotateFunc(obj, canvas.width / 2, canvas.height / 2, scale, time / 3000, ctx);
            requestAnimationFrame(mainLoop);
        }
        return mainLoop;
    }

    function clock() {// We create a new Date object and assign it to a variable called "time".
        var now = new Date();
        var is_past;
        // Access the "getHours" method on the Date object with the dot accessor.
        // hours = time.getHours(),
        // Access the "getMinutes" method with the dot accessor.
        // minutes = time.getMinutes(),
        // seconds = time.getSeconds();
        var ms_to_nye = nye - now;

        if (ms_to_nye < 0) {
            is_past = true;
        }

        ms_to_nye = Math.abs(ms_to_nye);

        var seconds = ms_to_nye/1000;
        var minutes = seconds/60;
        seconds = Math.floor((minutes - Math.floor(minutes))*60);
        minutes = Math.floor(minutes);
        if (ms_to_nye < 10000) {
            seconds = Math.ceil(ms_to_nye/1000);
            if (seconds < seconds_old) {
                shrink_scale = 7;
                seconds_old = seconds;
            }
            is_shrink = true;
            shrink_scale_amount = 0.05;
            if (ms_to_nye < 30 || is_past) {
                current_time.time = '';
            } else {
                current_time.time = seconds;
            }
        } else {
            current_time.time = harold(minutes) + ":" + harold(seconds);
        }


        function harold(standIn) {
            if (standIn < 10) {
                standIn = '0' + standIn;
            }
            return standIn;
        }
    }

    function fadeInBand() {
        console.log('band');
        var now = new Date();
        var ms_left = Math.abs(nye - now);
        active_image.fadeOut(2000);
        $('#band').fadeIn(2000);
        active_image = $('#band');
        if (ms_left < 35000) {
            console.log(ms_left);
            if (ms_left > 20000) {
                ms_left = ms_left - 20000;
                setTimeout(fadeInClock, ms_left);
            } else {
                fadeInClock();
            }
        } else {
            setTimeout(fadeInBenny, 20000);
        }
    }

    function fadeInBenny() {
        console.log('benny');
        var now;
        var ms_left;
        active_image.fadeOut(2000);
        $('#benny').fadeIn(2000);
        active_image = $('#benny');
        now = new Date();
        ms_left = Math.abs(nye - now);
        // Nee to account for fade in and out plus one second.
        if (ms_left < 35000) {
            console.log(ms_left);
            if (ms_left > 20000) {
                ms_left = ms_left - 20000;
                setTimeout(fadeInClock, ms_left);
            } else {
                fadeInClock();
            }
        } else {
            setTimeout(fadeInClock, 20000);
        }
    }

    function fadeInHappy() {
        console.log('happy');
        active_image.fadeOut(2000);
        $('#happy').fadeIn(2000);
        active_image = $('#happy');
    }

    function fadeInClock() {
        console.log('clock');
        var now = new Date();
        var ms_left = Math.abs(nye - now);
        active_image.fadeOut(2000);
        $('#clock').fadeIn(2000);
        active_image = $('#clock');
        if (ms_left < 35000) {
            console.log(ms_left);
            setTimeout(fadeInHappy, ms_left);
        } else {
            setTimeout(fadeInBand, 20000);
        }
    }

    function cue() {
        function checkTime() {
            var now = new Date();
            if (nye - now > 268000) {
                setTimeout(checkTime, 1);
            } else {
                fadeInBenny();
            }
        }
        active_image.fadeOut(2000);
        $('#clock').fadeIn(2000);
        active_image = $('#clock');
        setTimeout(checkTime, 1);
    }

    setInterval(clock, 0);
    active_image = $('#benny');
    cue();
    // fadeInBand();

})($, document, window);