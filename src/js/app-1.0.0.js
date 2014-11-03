$(document).ready(function(){
    var ROOT = "doggie";
    var canvas, stage;
    var images;
    var loader;
    var width, height;
    var scaleX, scaleY;

    var pauseBar = null;
    var upperBar = null;
    var lowerBar = null;
    var ceilingY = null;
    var floorY = null;
    var currentLevel = 1;
    var maximumLevel = 9;

    var levelLowerThreshold = null;
    var levelUpperThreshold = null;

    window.onload = function () {
        orientationchange();
        window.onorientationchange = function () {
            orientationchange();
        }
    };
    function orientationchange() {
        if (window.orientation == undefined) {
            return;
        }
        if (window.orientation == 0 || window.orientation == 180) {
            //竖屏
            document.getElementById("horizontal").style.display = 'none';
        } else {
            //横屏
            document.getElementById("horizontal").style.display = 'block';
        }
        resizeGame();
    }
    // update canvas size
    function resizeGame() {
        canvas = document.getElementById("enterStage");


        if (window.innerHeight == 568) {
            window.innerHeight = 504;
        }

        height = window.innerHeight;
        width = window.innerWidth;
//        if (canvas.width < window.innerWidth) {
            canvas.width = window.innerWidth;
//        }

//        if (canvas.height < window.innerHeight) {
            canvas.height = window.innerHeight;
//        }
//        alert("Window width x height " + window.innerWidth +" x "+ window.innerHeight);
//        alert("width x height " + canvas.width +" x "+ canvas.height);

    }

//    window.addEventListener('resize', resizeGame, false);

    function init() {
        canvas = document.getElementById("enterStage");
        resizeGame();

        console.log(canvas.width);
        console.log(canvas.height);

//        alert("width x height " + canvas.width +" x "+ canvas.height);
        stage = new createjs.Stage(canvas);
        createjs.Touch.enable(stage);

        images = images||{};
        loader = new createjs.LoadQueue(true, "");
        loader.on("fileload", handleFileLoad, this);
        loader.on("complete", handleComplete, this);
        var manifest = [
            {src:"fonts/DS-DIGI.TTF", id:"DIGI"},
            {src:"home.png", id:"homebg"},
            {src:"enter.png", id:"enterbtn"},
            {src:"arrow.png", id:"arrowbtn"},
            {src:"instruction.png", id:"instructionbg"},
            {src:"preview1.png", id:"preview1"},
            {src:"preview2.png", id:"preview2"},
            {src:"temperature.png", id:"temperatureId"},
            {src:"gameLevelBlue.png", id:"gameLevel1"},
            {src:"gameLevelPink.png", id:"gameLevel2"},
            {src:"gameLevelRed.png", id:"gameLevel3"},
            {src:"gameLevelHardBlue.png", id:"gameHardLevel1"},
            {src:"gameLevelHardPink.png", id:"gameHardLevel2"},
            {src:"gameLevelHardRed.png", id:"gameHardLevel3"},
            {src:"gameResultLevel1.png", id:"gameResultLevel1"},
            {src:"gameResultLevel2.png", id:"gameResultLevel2"},
            {src:"gameResultLevel3.png", id:"gameResultLevel3"},
            {src:"failure.png", id:"gameFailure"},
            {src:"submit.png", id:"gameSuccess"}
        ];
        loader.loadManifest(manifest);
    }

    function handleFileLoad(o) {
        //Alternatively you could store off the results as they get loaded.
        //In this case we only have one image getting loaded
        //if (o.type == "image") { images[o.id] = o.result; }
    }

    function handleComplete(event) {
        /*getResult returns an object containing the contents of the object that was initially requested using loadFile or loadManifest, including:
         src: The source of the file that was requested.
         type: The type of file that was loaded. If it was not specified, this is auto-detected by PreloadJS using the file extension.
         id: The id of the loaded object. If it was not specified, the ID will be the same as the "src" property.
         data: Any arbitrary data that was specified, otherwise it will be undefined.
         */
        beginScene();
        $(".loader").fadeOut("slow");
    }

    function beginScene() {

        stage.removeAllChildren();
        var init = new createjs.Text(20, "20px DIGI", "#3BAEED");
        stage.addChild(init);
        var homeBgPath = loader.getResult("homebg");
        var homeBgImg = new createjs.Bitmap(homeBgPath);
        console.log(homeBgImg.image.width);
        console.log(homeBgImg.image.height);
        scaleX = width/homeBgImg.image.width ;
        scaleY = height/homeBgImg.image.height ;
        console.log("ScaleX: " + scaleX);
        console.log("ScaleY: " + scaleY);

        homeBgImg.scaleX = scaleX;
        homeBgImg.scaleY = scaleY;
        stage.addChild(homeBgImg);
        homeBgImg.on("click", function() {
            console.log("arrowBtn clicked");
            instructionScene();
        });

        stage.update();
    }

    function instructionScene() {
        stage.removeAllChildren();

        var instructionBgPath = loader.getResult("instructionbg");
        var instructionBgImg = new createjs.Bitmap(instructionBgPath);
        instructionBgImg.on("click", function() {
            console.log("instruction clicked");
            gamePreview1Scene();
        });
        instructionBgImg.scaleX = scaleX;
        instructionBgImg.scaleY = scaleY;
        stage.addChild(instructionBgImg);

        stage.update();
    }

    function gamePreview1Scene() {
        stage.removeAllChildren();

        var preview1BgPath = loader.getResult("preview1");
        var preview1BgImg = new createjs.Bitmap(preview1BgPath);
        preview1BgImg.on("click", function() {
            gamePreview2Scene();
        });
        preview1BgImg.scaleX = scaleX;
        preview1BgImg.scaleY = scaleY;
        stage.addChild(preview1BgImg);

        stage.update();
    }

    function gamePreview2Scene() {
        stage.removeAllChildren();

        var preview2BgPath = loader.getResult("preview2");
        var preview2BgImg = new createjs.Bitmap(preview2BgPath);
        preview2BgImg.on("click", function() {
            gameLevelScene(0);
        });
        preview2BgImg.scaleX = scaleX;
        preview2BgImg.scaleY = scaleY;
        stage.addChild(preview2BgImg);

        stage.update();
    }

    function gameLevelScene(category) {
        console.log("Game Level Scene: " + category);
        stage.removeAllChildren();
        var currentLevelBackgroundId = "gameLevel1";
        var barHeight = 10;
        if (currentLevel > 6) {
            currentLevelBackgroundId = "gameHardLevel1";
            if (category === 1) {
                currentLevelBackgroundId = "gameHardLevel2";
            } else if (category === 2) {
                currentLevelBackgroundId = "gameHardLevel3";
            }
        } else {
            currentLevelBackgroundId = "gameLevel1";
            if (category === 1) {
                currentLevelBackgroundId = "gameLevel2";
            } else if (category === 2) {
                currentLevelBackgroundId = "gameLevel3";
            }
        }

        var gameBgPath = loader.getResult(currentLevelBackgroundId);
        var gameBgImg = new createjs.Bitmap(gameBgPath);
        gameBgImg.on("click", function() {
//                    gameFailureScene();
        });
        gameBgImg.scaleX = scaleX;
        gameBgImg.scaleY = scaleY;
        stage.addChild(gameBgImg);

        var temperaturePath = loader.getResult("temperatureId");
        var temperatureImg = new createjs.Bitmap(temperaturePath);
        temperatureImg.on("click", function() {
            console.log("Tap Game Level Scene: " + category);
            tap(category);
        });
        temperatureImg.x = parseInt(74/640 * width);
        temperatureImg.y = parseInt(34/1008 * height);
        temperatureImg.scaleX = scaleX;
        temperatureImg.scaleY = scaleY;
        stage.addChild(temperatureImg);

        var x = parseInt(width * 0.1);
        var y = parseInt(height * 0.96);
        var w = parseInt(width * 0.25);

        pauseBar = new createjs.Shape();
        pauseBar.up = true;
        pauseBar.setBounds(x, 0, w, 15);
        pauseBar.graphics.beginFill("orange").drawRoundRect(x, 0, w, barHeight, 10);
        pauseBar.y = y;
        pauseBar.removeAllEventListeners("click");
        stage.addChild(pauseBar);

        if (currentLevel > 6) {
            upperBar = new createjs.Shape();
            upperBar.up = true;
            upperBar.setBounds(x, 0, w, 15);
            upperBar.graphics.beginFill("#F92036").drawRoundRect(x, 0, w, barHeight, 6);
            upperBar.y = getLevel1();
            upperBar.removeAllEventListeners("click");
            stage.addChild(upperBar);

            lowerBar = new createjs.Shape();
            lowerBar.up = true;
            lowerBar.setBounds(x, 0, w, 15);
            lowerBar.graphics.beginFill("#3BAEED").drawRoundRect(x, 0, w, barHeight, 6);
            lowerBar.y = getLevel2();
            lowerBar.removeAllEventListeners("click");
            stage.addChild(lowerBar);
        }

        createjs.Ticker.setPaused(false);
        createjs.Ticker.removeAllEventListeners("tick");
        createjs.Ticker.on("tick", function(e) {

            levelLowerThreshold = getLevel1();
            levelUpperThreshold = height;
            if (category === 1) {
                levelLowerThreshold = getLevel2();
                levelUpperThreshold = getLevel1();
            }
            if (category === 2) {
                levelLowerThreshold = getLevel3();
                levelUpperThreshold = getLevel2();
            }
            var speed = 8;
            speed = parseInt(speed * 2 * scaleY);
            speed *=  currentLevel;
            tick(e, speed, levelLowerThreshold, levelUpperThreshold);
        });
//                var temperature = new createjs.Text("20", "20px Helvetica", "#3BAEED");
//                temperature.x = width * 0.64;
//                temperature.y = height * 0.08;
//                stage.addChild(temperature);
        stage.update();
    }

    function tap(category) {
        var levelColor = "#3BAEED";
        if (category === 1) {
            levelColor = "#F281C0";
        } else if (category === 2) {
            levelColor = "#F92036";
        }

        console.log("pauseBar clicked");
//                    instructionScene();
        togglePause();
        createjs.Ticker.removeAllEventListeners("tick");

        pauseBar.graphics.beginFill(levelColor);

        var number = parseInt(52 - 37 * (1 - (height * 0.92 - (pauseBar.y - height * 0.05)) / (height * 0.95)));
        console.log("Y " + pauseBar.y);
        console.log("Temperature " + number);

        var size = parseInt(20 * 2 * scaleX);
        var temperature = new createjs.Text(number+"", size + "px DIGI", levelColor);
        temperature.x = width * 0.645;
        temperature.y = height * 0.08;
        stage.addChild(temperature);
        stage.update();

        if (currentLevel > 6) {
            if (category === 0 && (pauseBar.y < lowerBar.y)) {
                console.log("Position" + pauseBar.y);
                console.log("Exceed Threshold" + upperBar.y + " : " + lowerBar.y);
                createjs.Ticker.removeAllEventListeners("tick");
                wait(gameFailureScene, number, category);
            } else if (category === 2 && (pauseBar.y > upperBar.y)) {
                console.log("Position" + pauseBar.y);
                console.log("Exceed Threshold" + upperBar.y + " : " + lowerBar.y);
                createjs.Ticker.removeAllEventListeners("tick");
                wait(gameFailureScene, number, category);
            } else if (category === 1 && (pauseBar.y < upperBar.y || pauseBar.y > lowerBar.y)) {
                console.log("Position" + pauseBar.y);
                console.log("Exceed Threshold" + upperBar.y + " : " + lowerBar.y);
                createjs.Ticker.removeAllEventListeners("tick");
                wait(gameFailureScene, number, category);
            } else {
                wait(gameSceneResult, number, category);
            }
        } else {
            if (pauseBar.y > levelUpperThreshold || pauseBar.y < levelLowerThreshold) {
                console.log("Position" + pauseBar.y);
                console.log("Exceed Threshold" + levelUpperThreshold + " : " + levelLowerThreshold);
                createjs.Ticker.removeAllEventListeners("tick");
                wait(gameFailureScene, number, category);
            } else {
                wait(gameSceneResult, number, category);
            }
        }
    }

    function getCeilingY() {
        if (ceilingY) {
            return ceilingY;
        }
        return function() {
            ceilingY = parseInt(height * 0.05);
            return ceilingY;
        }();
    }

    function getFloorY() {
        if (floorY) {
            return floorY;
        }
        return function() {
            floorY = parseInt(height * 0.95);
            return floorY;
        }();
    }



    var level1 = null;
    function getLevel1() {
        if (level1) {
            return level1;
        }
        return function() {
            level1 = parseInt(height * 0.65);
            return level1;
        }();
    }

    var level2 = null;
    function getLevel2() {
        if (level2) {
            return level2;
        }
        return function() {
            level2 = parseInt(height * 0.25);
            return level2;
        }();
    }

    var level3 = null;
    function getLevel3() {
        if (level3) {
            return level3;
        }
        return function() {
            level3 = parseInt(height * 0.02);
            return level3;
        }();
    }

//    var pauseBarUp = true;
//    var upperBarUp = true;
//    var lowerBarUp = true;
    function tick(event, speed, levelLowerThreshold, levelUpperThreshold) {
        if (!createjs.Ticker.getPaused()) {
            move(pauseBar, getCeilingY(), getFloorY(), speed);
            if (currentLevel > 6) {
                var speed2 =  10;
                speed2 = parseInt(speed2 * 2 * scaleY);
                move(upperBar, parseInt(getLevel2() - height * 0.15), parseInt(getLevel2() + height * 0.15), speed2);
                move(lowerBar, parseInt(getLevel1() - height * 0.15), parseInt(getLevel1() + height * 0.15), speed2);
            }
        }
        stage.update(event); // important!!
    }

    function move(pauseBar, ceiling, floor, speed) {
        return function() {
            if (pauseBar.up) {
                pauseBar.y = pauseBar.y - speed;
            } else {
                pauseBar.y = pauseBar.y + speed;
            }
            if (pauseBar.y < ceiling) {
                pauseBar.y = ceiling;
                pauseBar.up = false;
            }
            if (pauseBar.y > floor) {
                pauseBar.y = floor;
                pauseBar.up = true;
            }
        }(pauseBar, ceiling, floor, speed);
    }

    function togglePause() {
        var paused = !createjs.Ticker.getPaused();
        createjs.Ticker.setPaused(paused);
//                document.getElementById("pauseBtn").value = paused ? "unpause" : "pause";
    }


    var intervalId = null;
    function wait(fn, number, category) {
        var tempFunc = function(number, category) {
            intervalId = setTimeout(function() {
                return function() {
                    fn(number, category);
                }(number, category);
            }, 1000);
        };
        return tempFunc(number, category);
    }

    function gameSceneResult(number, category) {
        console.log("Result Category: " + category);
        clearTimeout(intervalId);
        stage.removeAllChildren();
        var categoryBackgroundId ="gameResultLevel1";
        if (category  === 1) {
            categoryBackgroundId = "gameResultLevel2"
        } else if (category === 2) {
            categoryBackgroundId = "gameResultLevel3"
        }
        console.log("Result Scene: " + categoryBackgroundId);
        var gameBgPath = loader.getResult(categoryBackgroundId);
        var gameBgImg = new createjs.Bitmap(gameBgPath);
        gameBgImg.on("click", function() {
            currentLevel += 1;
            console.log("Current Level: " + currentLevel);
            if (currentLevel <= 9) {
                var random = parseInt(Math.random() * 9);
                category = (parseInt(Math.random() * 9)) % 3;
                console.log("Current Random: " + random);
                console.log("Current Category: " + category);
                gameLevelScene(category);
            } else {
                gameSuccessScene();
            }
        });
        gameBgImg.scaleX = scaleX;
        gameBgImg.scaleY = scaleY;
        stage.addChild(gameBgImg);
        var size = parseInt(36 * 2 * scaleX);
        var temperature = new createjs.Text(number, size + "px DIGI", "#000000");
        temperature.x = width * 0.46;
        temperature.y = height * 0.15;
        stage.addChild(temperature);

        stage.update();
    }

    function gameSuccessScene() {
        return function() {
            clearTimeout(intervalId);
            stage.removeAllChildren();

//        var gameSuccessBgPath = loader.getResult("gameSuccess");
//        var gameSuccessBgImg = new createjs.Bitmap(gameSuccessBgPath);
//        gameSuccessBgImg.on("click", function() {
//            beginScene();
//        });
//        gameSuccessBgImg.scaleX = scaleX;
//        gameSuccessBgImg.scaleY = scaleY;
//        stage.addChild(gameSuccessBgImg);

//        stage.update();
            redirectToPageWithAccessTokenParam(accessToken, "submit.html");
        }();

    }


    function gameFailureScene() {
        currentLevel = 1;
        clearTimeout(intervalId);
        stage.removeAllChildren();
        if (pauseBar !== null) {
            pauseBar.removeAllEventListeners("click");
        }

        var gameFailureBgPath = loader.getResult("gameFailure");
        var gameFailureBgImg = new createjs.Bitmap(gameFailureBgPath);
        gameFailureBgImg.on("click", function() {
            beginScene();
        });
        gameFailureBgImg.scaleX = scaleX;
        gameFailureBgImg.scaleY = scaleY;
        stage.addChild(gameFailureBgImg);

        stage.update();
    }

    function requireToken() {
        var token = null;
        $.ajax({
            async: false,
            url: 'server/service/TokenService.php',
            type: "POST",
            data : JSON.stringify({method : 'POST', type : 'READ'}),
            dataType : "json",
            timeout: 3000,
            success: function (response) {
                if (!response.success) {
                    $("#errorMsg").html(response.message);
                    document.getElementById('messageMask').style.display='block';
                }
                if ($.isEmptyObject(response.accessToken)) {
                    $("#errorMsg").html("服务器繁忙，<br>请稍后再来！");
                    document.getElementById('messageMask').style.display='block';
                }
                token = response.accessToken;
            },
            error : function (xhr, textStatus, errorThrown) {
                $("#errorMsg").html("服务器繁忙，<br>请稍后再来！");
                document.getElementById('messageMask').style.display='block';
            }
        });
        return token;
    }
    function formatRedirectUri(relativeTargetUri) {
        return (function() {
            return 'http://' + window.location.hostname + '/' + ROOT + '/' + relativeTargetUri;
        }());
    }
    function formatRedirectUriWithAccessTokenParam (accessToken, relativeTargetUri) {
        return  (function() {
            return formatRedirectUri(relativeTargetUri) + '?'
                + '&accessToken=' + encodeURI(accessToken);
        }());
    }
    function redirectToPageWithAccessTokenParam (accessToken, relativeTargetUri) {
        return (function() {
            var redirectToUrl = formatRedirectUriWithAccessTokenParam(accessToken, relativeTargetUri);
            window.location.href = redirectToUrl
            window.event.returnValue = false;
            return false;
        }());
    }

    var accessToken = requireToken();
//    alert("Token: " + accessToken);
    init();
});
