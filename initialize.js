var zAppVersion = '2017-3-14';
//Modified from stewved/gameTemplate/initialize.s - part of my gameTemplate project.
//hopefully comprehensive HTML cancel fullscreen:
var killFS = (document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen)
//kick up fullscreen:
 getFS = (document.documentElement.requestFullscreen || document.documentElement.mozRequestFullScreen || document.documentElement.webkitRequestFullscreen || document.documentElement.msRequestFullscreen)
//mousewheel event, based on the all-encompassing mozDev version
 mouseWheelType = 'onwheel'in document.createElement('div') ? 'wheel' : document.onmousewheel ? 'mousewheel' : 'DOMMouseScroll'
/*
 * Keys to ignore... alt-tab is annoying, so don't bother with alt for example
 * 16 = shift
 * 17 = Ctrl
 * 18 = Alt (and 17 if altGr)
 * 91 = windows key
 * 116 = F5 - browser refresh
 * 122 = F11 - Full Screen Toggle
 * 123 = F12 - Dev tools.
*/
, keysIgnore = [0, 16, 17, 18, 91, 116, 122, 123]
/*
 * left,up,right,down,A,B,X,Y   you can add more should your game require it.
*/
, keysDefault = {100:0 ,101:1 ,97:2 ,98:3}
/*
 * the currently used keys are loaded on init
*/
, keysCurrent = null
//Input events vars to hold the event info:
, inputType = null
// touch|gamePad|mouse|keyboard - depending on game type you could add GPS or whatever else HTML supports...
//Mouse:
, mouseVars = []
//Gamepad:
, gamePadVars = []
, gamepadReMap = [2, 3, 0, 1]
//keyboard:
, keyVars = []
//For touch-enabled devices
, touchVars = []
//from webtop project -
, imgSocs = 'style="background:center/contain no-repeat url(\'images/'
//base64 code for an empty 1x1 png:
, imgDummy = ' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACAQMAAABIeJ9nAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjAAIAAAQAASDSLW8AAAAASUVORK5CYII="'
//vars to hold variables for the window
, gameWindow = null
//tooltip system adapted from Webtop project

//for tooltips
, vPup = null
, vPupc = null
, vPupD = null
, vPupDc = null
, vPupB = null

, tooltipVars = {opac:0, over:false, was:null, is:null, text:'', timer:null}
, measureTips = '<br><br>Try to keep the measuring tape as horizontal as you can.<br><br>repeat each set of measurements three times. eg. neck, waist, neck, waist, neck, waist for Males. (not neck, neck, neck, waist, waist, waist!)'
, toolTips = {
  'zDob': 'Designed for 16+<br><br>Enter your date of birth in YYYY-MM-DD (ISO-8601) format.<br>eg, 1987-01-23 for the 23rd of January 1987.'
, 'zNeck': 'Measure just under the Adam&apos; apple, taking care to not include the traps.' + measureTips
, 'zWaist': 'Measure directly over the navel for Males, and a little above the navel for Females.' + measureTips
, 'zHips': 'Measure the biggest rounding of the glutes (bum).' + measureTips
, 'zSitting': '<span style="font-weight:bold;color:hsl(240, 100%, 33%)">This is automatically calculated by taking all of other activities out of a full day.</span><br><br>This activity level includes:<ul><li>relaxing</li><li>Either sitting, reclining,</li><li>or standing still, quietly</li><li>reading</li><li>listening to music (Not dancing),</li><li>desk work.</li></ul>'
, 'zLight': 'This activity level includes:<ul><li>light housework</li><li>walking</li><li>slow swimming</li></ul>'
, 'zMedium': 'This activity level includes:<ul><li>hoovering</li><li>normal swimming</li><li>jogging</li></ul>'
, 'zHeavy': 'This is High-intensity activity like:<ul><li>lifting weights</li><li>sprinting</li><li>very hard work</li></ul>Add only the time doing the work.<br>eg. 30 minutes weight training may only be around 5 minutes of actual lifting. '
, 'zBFat': 'This uses the US Navy&apos;s calculation for body fat percentage, which is apparently within 3% accuracy when measurements are properly taken.' + measureTips
, 'zTBF': 'Specify what Body-Fat percentage you would like to be.<br><br>As a rough guide, healthy body fat ranges are:<br>Males between 12% and 22%,<br>Females between 21% and 31%'
/*, 'zBMI': 'An average adult&apos;s ideal BMI is in the 18.5 to 24.9 range.<br>If your BMI is less than 18.5, you likely weigh less than is ideal for your height,<br>but if your BMI is 25 or more, you may weigh more than is ideal for your height.<br><br><span style="color:hsl(30, 100%, 33%);">(Use this only as a guide)<span>'*/
, 'ziWeight': 'Calculated using your specified Target Body-Fat percentage, with your Lean Body Mass remaining the same.<br><br>(strength training can minimise muscle-loss during losing weight.)'
, 'ziWaist': 'An <span style="font-style:italic;font-weight:bold;">average</span> adult&apos;s ideal waist measurement is simply half their height :-)<br><br><span style="color:hsl(30, 100%, 33%);">(Use this only as a guide)<span>'
, 'zCals': 'Your daily maintenance calorie requirement.<br><br>' + 'Use this amount of calories to keep your current weight.<br><br>' + 'This should be a quite accurate amount, since you customised your activity-levels.'
, 'zTargCals': 'The NHS recommends the <br>National Institute for Health and Care Excellence (NICE)<br>guideline of 600 calories gain/deficit per day.<br><br>' + 'Everybody is different, and though this calculator should be more accurate than most available, your individual body-type, metabolism, etc. may differ from the average.<br><br>' + 'If your are losing more than 1kg a week, increase your target calorie intake by 200 calories, and if you are losing less than 0.5kg a week, decrease it by 200.<br>Simply reverse this if you are wanting to gain weight.'
, 'zToLose': 'Simply the difference between your current weight and your target weight.<br><br><span style="color:hsl(30, 100%, 33%);">(Use this only as a guide)<span>'
, 'zToGoal': 'Assuming an average of 0.7kg per week, this is how many weeks it would take to reach your target weight.<br><br><span style="color:hsl(30, 100%, 33%);">(Use this only as a guide)<span>'
}
, LS1 = '@#~'
, LS2 = '~#@'
, globVol = .33 //the volume of the beeps in the game.
, saveY = 0 //whether the user allows saving to HTML5 local storage
, zConvert = [0.39370078740157482544, 2.20462262184877566540, 60]
;

function Init() {
  //Add event listeners to the game element
  addEventListeners();
  //initialize the mouse event
  mouseClear();
  //initialize the scroll vars
  scrollClear();
  //window management vars
  gameWindow = {
    initWidth: 640
  , initHeight: 360
  , width: 0
  , height: 0
  , scale: 1
  };

  gameVars = {
    go: 0 //only process changes on an event
  , tWoz: 0 //Time on Last Frame
  };

  //check for saved data. If set, the user has chosen to either save or not save data.
  storageCheck();


  //for the moment, just use the default keyset:
  keysCurrent = keysDefault;

  //check if the user has modified the volume level:
  var dataToLoad = storageLoad('vol');
  if (dataToLoad) {
    globVol = parseFloat(dataToLoad);
  }
  //add the stuff to the page.
  initContent();

  //make links to the tooltip elements:
  vPup = document.getElementById('pup');
  vPupc = document.getElementById('pupc');
  vPupD = document.getElementById('pupD');
  vPupDc = document.getElementById('pupDc');
  vPupB = document.getElementById('pupB');
  //see if there is a stored load of data:
  cc_dataLoad();
  //add my settings system to the project.
  settingsButton();
  //now that everything is set up, make a recurring checker for button presses:
  gamePadsButtonEventCheck();
  resize();

  versionCheck();
  //calculate now:
  cc_calc();
}
function initContent() {
  var butLeft = 'style="width:15%"'
  , butRight = 'style="width:15%;"'
  ;

  document.body.innerHTML =
  '<div id="cont">'
  + '<div style="background:lightgreen;overflow:hidden;padding-top:4px;text-align:center;">'
    + '<button id="m" type="button" class="uButtonLeft uButtons uButtonGreen uB15" value="1">Male</button>'
    + '<button id="f" type="button" class="uButtons uButtonGrey uButtonRight uB15" value="0">Female</button>' //default

    + '<button id="kg" type="button" class="uButtonLeft uButtons uButtonGreen uB15" value="1">Kg</button>'
    + '<button id="lb" type="button" class="uButtons uButtonGrey uButtonRight uB15" value="0">lb</button>' //default

    + '<button id="cm" type="button" class="uButtonLeft uButtons uButtonGreen uB15" value="1">cm</button>'
    + '<button id="in" type="button" class="uButtons uButtonGrey uButtonRight uB15" value="0">inch</button>' //default
    //Height, Weight, and Date of Birth:
    + '<div style="clear:both;float:left;width:calc(12.5% - 4.5px);margin:0;padding:3px;"></div>'
    + '<div class="conty c4">Height'
      + '<input type="text" id="h" class="editEnable inputThingy inputEn" value="176.5">' //176
    + '</div>'

    + '<div class="conty c4">Weight'
      + '<input type="text" id="w" class="editEnable inputThingy inputEn" value="79.50">' //82
    + '</div>'

    + '<div class="conty c4">'
      + '<div id="_zDob" class="toolTipclass">DOB</div>'
      + '<input type="text" id="a" class="editEnable inputThingy inputEn" value="1987-01-23">'
    + '</div>'
    //Next are the neck, waist, and hips measurements for the Body Fat calculation.
    + '<div style="clear:both;float:left;width:calc(12.5% - 4.5px);margin:0;padding:3px;"></div>'
    + '<div class="conty c4">'
      + '<div id="_zNeck" class="toolTipclass">Neck</div>'
      + '<input type="text" id="dn" class="editEnable inputThingy inputEn" value="43.35">' //176
    + '</div>'

    + '<div class="conty c4">'
      + '<div id="_zWaist" class="toolTipclass">Waist</div>'
      + '<input type="text" id="dw" class="editEnable inputThingy inputEn" value="89.55">' //82
    + '</div>'

    + '<div class="conty c4">'
      + '<div id="_zHips" class="toolTipclass">Hips&nbsp;(female)</div>'
      + '<input type="text" id="dh" class="editEnable inputThingy inputDi" value="118.75">'
    + '</div>'
  + '</div>'

  //Activity stuff to make the calorie calculation much more accurate.
  + '<div style="background:lightsalmon;overflow:hidden;">'
    + '<div style="clear:both;float:left;width:100%;text-align:center;margin-top:5px;">Activity per day'
      + '<button id="hr" type="button" class="uButtons uButtonGreen uButtonLeft uB15" value="1">hrs</button>'
      + '<button id="mn" type="button" class="uButtons uButtonGrey uButtonRight uB15" value="0">mins</button>' //default
    + '</div>'

    + '<div class="conty c5">Sleep'
      + '<input type="text" id="s" class="editEnable inputThingy inputEn" value="8">'
    + '</div>'

    + '<div class="conty c5">'
      + '<div id="_zSitting" class="toolTipclass">Sitting</div>'
      + '<input type="text" id="na" class="editDisable inputThingy inputDi" value="15.13">'
    + '</div>'

    + '<div class="conty c5">'
      + '<div id="_zLight" class="toolTipclass">light</div>'
      + '<input type="text" id="la" class="editEnable inputThingy inputEn" value="0.75">'
    + '</div>'

    + '<div class="conty c5">'
      + '<div id="_zMedium" class="toolTipclass">Medium</div>'
      + '<input type="text" id="ma" class="editEnable inputThingy inputEn" value="0.05">'
    + '</div>'

    + '<div class="conty c5">'
      + '<div id="_zHeavy" class="toolTipclass">Heavy</div>'
      + '<input type="text" id="ha" class="editEnable inputThingy inputEn" value="0.07">'
    + '</div>'
  + '</div>'

  //Results!
  + '<div style="clear:both;border-top:10px double;background-color:lightblue;overflow:hidden;box-sizing:border-box;">'
    + '<div class="conty c4">'
      + '<div id="_zBFat" class="toolTipclass">Body&nbsp;Fat&nbsp;%</div>'
      + '<input type="text" id="bf" class="editEnable inputThingy inputEn" value="0000">'
    + '</div>'

    + '<div class="conty c4">'
      + '<div id="_zTBF" class="toolTipclass">Target&nbsp;BF%</div>'
      + '<input type="text" id="tbf" class="editEnable inputThingy inputEn" value="17.00">'
    + '</div>'

    + '<div class="conty c4">'
      + '<div id="_ziWeight" class="toolTipclass">Target&nbsp;weight</div>'
      + '<input type="text" id="iW" class="editEnable inputThingy inputEn" value="00.00">'
    + '</div>'

    + '<div class="conty c4">'
      + '<div id="_ziWaist" class="toolTipclass">Ideal&nbsp;waist</div>'
      + '<input type="text" id="d" class="editEnable inputThingy inputEn" value="00.00">'
    + '</div>'

    //+ '<div style="clear:both;float:left;width:calc(12.5% - 4.5px);margin:0;padding:3px;"></div>'
    + '<div class="conty c4">'
      + '<div id="_zCals" class="toolTipclass">Maint&nbsp;calories</div>'
      + '<input type="text" id="c" class="editEnable inputThingy inputEn" value="0000">'
    + '</div>'

    + '<div class="conty c4">'
      + '<div  id="_zTargCals" class="toolTipclass">Target&nbsp;calories</div>'
      + '<input type="text" id="cl" class="editEnable inputThingy inputEn" value="0000">'
    + '</div>'

    + '<div class="conty c4">'
      + '<div id="_zToLose" class="toolTipclass">Lose&nbsp;target</div>'
      + '<input type="text" id="tl" class="editEnable inputThingy inputEn" value="00.00">'
    + '</div>'

    + '<div class="conty c4">'
      + '<div id="_zToGoal" class="toolTipclass">Weeks&nbsp;to&nbsp;target</div>'
      + '<input type="text" id="tg" class="editEnable inputThingy inputEn" value="00.00">'
    + '</div>'
  + '</div>'

+ '</div>'
  //add the tooltip elements:
  + '<div id="pupB" class="ttElem"></div>'
  + '<div id="pup" class="ttElem"></div>'
  + '<div id="pupc" class="ttElem"></div>'
  + '<div id="pupD" class="ttElem"></div>'
  + '<div id="pupDc" class="ttElem"></div>'
  ;
}
function addEventListeners() {
  window.addEventListener('resize', resize, false);
  window.addEventListener('contextmenu', bubbleStop, false);
  window.addEventListener('dblclick', bubbleStop, false);
  window.addEventListener(mouseWheelType, mouseWheel, false);
  window.addEventListener('touchstart', touchDown, false);
  window.addEventListener('touchmove', touchMove, false);
  window.addEventListener('touchcancel', touchUp, false);
  window.addEventListener('touchend', touchUp, false);
  window.addEventListener('touchleave', touchUp, false);
  window.addEventListener('mousedown', mouseDown, false);
  window.addEventListener('mousemove', mouseMove, false);
  window.addEventListener('mouseup', mouseUp, false);
  window.addEventListener('keydown', keyDown, false);
  window.addEventListener('keyup', keyUp, false);
}
function versionCheck() {
  /*
    since every single event listener for updated sw failes to fire,
    I assume that the actual updating (wheh dev tools is not active)
    happens when the page is closed. Whatever. let's just do a
    storage-based version check.

    Obviously this will only work for users who allow storage, and I
    will have to remember to update the zAppVersion on every release!
  */
//debugger;
  var dataToLoad = storageLoad('appVersion');
  if (dataToLoad) {
    if (zAppVersion != dataToLoad) {
      //webbapp has been updated!
      upNotCheck('u');
      storageSave('appVersion', zAppVersion);
    }
  }
  else {
    //this could be because the user declined saving preferences,
    //or if is a new install, or if the user cleared the localStorage.
    storageSave('appVersion', zAppVersion);
  }
}