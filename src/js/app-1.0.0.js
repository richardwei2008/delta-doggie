$(document).ready(function(){
    var canvas, stage;
    var images;
    var loader;
    var width, height;
    var scaleX, scaleY;

    var pauseBar = null;
    var ceilingY = null;
    var currentLevel = 1;
    function init() {
        canvas = document.getElementById("enterStage");
        resize();
        console.log(canvas.width);
        console.log(canvas.height);
        stage = new createjs.Stage(canvas);
        createjs.Touch.enable(stage);

        images = images||{};
        loader = new createjs.LoadQueue(true, "");
        loader.on("fileload", handleFileLoad, this);
        loader.on("complete", handleComplete, this);
        var manifest = [
            {src:"fonts/DS-DIGI.TTF", id:"DIGI"},
            {src:"images/home.png", id:"homebg"},
            {src:"images/enter.png", id:"enterbtn"},
            {src:"images/arrow.png", id:"arrowbtn"},
            {src:"images/instruction.png", id:"instructionbg"},
            {src:"images/preview1.png", id:"preview1"},
            {src:"images/preview2.png", id:"preview2"},
            {src:"images/gameLevel1.png", id:"gameLevel1"},
            {src:"images/gameLevel2.png", id:"gameLevel2"},
            {src:"images/gameLevel3.png", id:"gameLevel3"},
            {src:"images/gameResultLevel1.png", id:"gameResultLevel1"},
            {src:"images/gameResultLevel2.png", id:"gameResultLevel2"},
            {src:"images/gameResultLevel3.png", id:"gameResultLevel3"},
            {src:"images/failure.png", id:"gameFailure"},
            {src:"images/submit.png", id:"gameSuccess"}
        ];
        loader.loadManifest(manifest);
    }

    function resize() {
        height = window.innerHeight;
        width = window.innerWidth;

        canvas.width = width;
        canvas.height = height;
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
        homeBgImg.scaleX = scaleX;
        homeBgImg.scaleY = scaleY;
        stage.addChild(homeBgImg);

        var enterBtnPath = loader.getResult("enterbtn");
        var enterBtnImage = new createjs.Bitmap(enterBtnPath);
        enterBtnImage.scaleX = scaleX;
        enterBtnImage.scaleY = scaleY;
        enterBtnImage.x = (width - enterBtnImage.image.width * enterBtnImage.scaleX * 1.5) / 2 ;
        enterBtnImage.y = (height - enterBtnImage.image.height * enterBtnImage.scaleY) * 0.85;
        stage.addChild(enterBtnImage);

        var arrowBtnPath = loader.getResult("arrowbtn");
        var arrowBtnImage = new createjs.Bitmap(arrowBtnPath);
        arrowBtnImage.scaleX = scaleX;
        arrowBtnImage.scaleY = scaleY;
        arrowBtnImage.x = (width + arrowBtnImage.image.width * arrowBtnImage.scaleX * 1.5)/2;
        arrowBtnImage.y = (height - arrowBtnImage.image.height * arrowBtnImage.scaleY) * 0.85;
        stage.addChild(arrowBtnImage);

        enterBtnImage.on("click", function() {
            console.log("enterBtn clicked");
            instructionScene();
        });

        arrowBtnImage.on("click", function() {
            console.log("arrowBtn clicked");
//                    instructionScene();
            instructionScene();
        });

        homeBgImg.on("click", function() {
            console.log("arrowBtn clicked");
//                    instructionScene();
            gameLevelScene(currentLevel);
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
            gameLevel1Scene();
        });
        preview2BgImg.scaleX = scaleX;
        preview2BgImg.scaleY = scaleY;
        stage.addChild(preview2BgImg);

        stage.update();
    }

    function gameLevelScene(currentLevel) {
        stage.removeAllChildren();
        var levelColor = "#3BAEED";
        var currentLevelBackgroundId = "gameLevel1";
        var barHeight = 25;
        if (currentLevel === 2) {
            levelColor = "#F281C0";
            currentLevelBackgroundId = "gameLevel2";
            barHeight = 25;
        } else if (currentLevel === 3) {
            levelColor = "#F92036";
            currentLevelBackgroundId = "gameLevel3";
            barHeight = 20;
        }

        var gameBgPath = loader.getResult(currentLevelBackgroundId);
        var gameBgImg = new createjs.Bitmap(gameBgPath);
        gameBgImg.on("click", function() {
//                    gameFailureScene();
        });
        gameBgImg.scaleX = scaleX;
        gameBgImg.scaleY = scaleY;
        stage.addChild(gameBgImg);

        var x = parseInt(width * 0.1);
        var y = parseInt(height * 0.96);
        var w = parseInt(width * 0.25);

//                pauseBar = new createjs.Rectangle(x, 0, w, 15);
        pauseBar = new createjs.Shape();
        pauseBar.setBounds(x, 0, w, 15);
        pauseBar.graphics.beginFill("orange").drawRoundRect(x, 0, w, barHeight, 10);
        pauseBar.y = y;
        pauseBar.removeAllEventListeners("click");
        pauseBar.on("click", function() {
            console.log("pauseBar clicked");
//                    instructionScene();
            togglePause();
            createjs.Ticker.removeAllEventListeners("tick");

            pauseBar.graphics.beginFill(levelColor);

            var number = parseInt(52 - 37 * (1 - (height * 0.92 - (pauseBar.y - height * 0.02)) / (height * 0.92)));
            console.log("Y " + pauseBar.y);
            console.log("Temperature " + number);

            var temperature = new createjs.Text(number+"", "20px DIGI", levelColor);
            temperature.x = width * 0.64;
            temperature.y = height * 0.08;
            stage.addChild(temperature);
            stage.update();
            wait(gameSceneResult, number, currentLevel);
        });

        stage.addChild(pauseBar);
        createjs.Ticker.setPaused(false);
        createjs.Ticker.removeAllEventListeners("tick");
        createjs.Ticker.on("tick", function(e) {
            var speed = 3;
            var levelThreshold = getLevel1();
            if (currentLevel === 2) {
                speed = 5;
                levelThreshold = getLevel2();
            }
            if (currentLevel === 3) {
                speed = 5;
                levelThreshold = getLevel3();
            }
            tick(e, speed, levelThreshold);
        });
//                var temperature = new createjs.Text("20", "20px Helvetica", "#3BAEED");
//                temperature.x = width * 0.64;
//                temperature.y = height * 0.08;
//                stage.addChild(temperature);


        stage.update();

    }

    function getCeilingY() {
        if (ceilingY) {
            return ceilingY;
        }
        return function() {
            ceilingY = parseInt(height * 0.01);
            return ceilingY;
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

    function tick(event, speed, levelThreshold) {

        if (!createjs.Ticker.getPaused()) {
            pauseBar.y -= speed;
            if (pauseBar.y < getCeilingY()) {
                pauseBar.y = getCeilingY();
            }
            if (pauseBar.y < levelThreshold) {
                console.log("Exceed " + pauseBar.y);
                createjs.Ticker.removeAllEventListeners("tick");
                gameFailureScene();
                return;
            }
//                    switch (currentLevel) {
//                        case 1:
//                            if (pauseBar.y < getLevel1()) {
//                                console.log("Exceed " + pauseBar.y);
//                                createjs.Ticker.removeAllEventListeners("tick");
//                                gameFailureScene();
//                                return;
//                            }
//                            break;
//                        case 2:
//                            if (pauseBar.y < getLevel2()) {
//                                console.log("Exceed " + pauseBar.y);
//                                createjs.Ticker.removeAllEventListeners("tick");
//                                gameFailureScene();
//                                return;
//                            }
//                            break;
//                        case 3:
//                            if (pauseBar.y < getLevel3()) {
//                                console.log("Exceed " + pauseBar.y);
//                                createjs.Ticker.removeAllEventListeners("tick");
//                                gameFailureScene();
//                                return;
//                            }
//                            break;
//                        default :
//                            break;
//                    }
        }
//                output.text = "getPaused()    = "+createjs.Ticker.getPaused()+"\n"+
//                        "getTime(true)  = "+createjs.Ticker.getTime(true)+"\n"+
//                        "getTime(false) = "+createjs.Ticker.getTime(false);
        console.log("update event");
        stage.update(event); // important!!


    }

    function togglePause() {
        var paused = !createjs.Ticker.getPaused();
        createjs.Ticker.setPaused(paused);
//                document.getElementById("pauseBtn").value = paused ? "unpause" : "pause";
    }


    var interval = null;
    function wait(fn, number, currentLevel) {
        var tempFunc = function(number, currentLevel) {
            interval = setInterval(function() {
                return function() {
                    fn(number, currentLevel);
                }(number, currentLevel);
            }, 1000);
        };
        return tempFunc(number, currentLevel);
    }

    function gameSceneResult(number, currentLevel) {
        clearInterval(interval);
        stage.removeAllChildren();
        var currentLevelResultBackgroundId ="gameResultLevel1";
        if (currentLevel === 2) {
            currentLevelResultBackgroundId = "gameResultLevel2"
        } else if (currentLevel === 3) {
            currentLevelResultBackgroundId = "gameResultLevel3"
        }
        var gameBgPath = loader.getResult(currentLevelResultBackgroundId);
        var gameBgImg = new createjs.Bitmap(gameBgPath);
        gameBgImg.on("click", function() {
            currentLevel += 1;
            if (currentLevel <= 3) {
                gameLevelScene(currentLevel);
            } else {
                gameSuccessScene();
            }
        });
        gameBgImg.scaleX = scaleX;
        gameBgImg.scaleY = scaleY;
        stage.addChild(gameBgImg);

        var temperature = new createjs.Text(number, "36px DIGI", "#000000");
        temperature.x = width * 0.465;
        temperature.y = height * 0.15;
        stage.addChild(temperature);

        stage.update();
    }

    function gameSuccessScene() {
        clearInterval(interval);
        stage.removeAllChildren();

        var gameSuccessBgPath = loader.getResult("gameSuccess");
        var gameSuccessBgImg = new createjs.Bitmap(gameSuccessBgPath);
        gameSuccessBgImg.on("click", function() {
            beginScene();
        });
        gameSuccessBgImg.scaleX = scaleX;
        gameSuccessBgImg.scaleY = scaleY;
        stage.addChild(gameSuccessBgImg);

        stage.update();
    }


    function gameFailureScene() {
        stage.removeAllChildren();

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

    init();
});
