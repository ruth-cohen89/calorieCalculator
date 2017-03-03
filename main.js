/*
REE = 9.99 x weight + 6.25 x height - 4.92 x age + 166 x sex (males, 1; females, 0) - 161
http://www.ncbi.nlm.nih.gov/pubmed/2305711
*/

/*
  2017-02-25 Omar did a great video about measuring body fat...
  https://www.youtube.com/watch?v=3Qqdgpwy0M0&t
  So, the plan now is to add the Navy's BF calculator algorythm
  and that Fat-Free Mass algorythm to my calculator, then 
  get rid of the cruddy BMI!

  Source of the stuff:
  http://www.dtic.mil/whs/directives/corres/pdf/130803p.pdf

  This is from 2002-11-05 - 15 years ago?!?!?!

  (All circumference and height measurements are in inches.)
  Males: % body fat = 86.010  x log10(abdomen - neck)   -   70.041 x log10(height) + 36.76
Females: % body fat = 163.205 x log10(waist + hip - neck) - 97.684 x log10(height) - 78.387

*/

function resize() {
  //maybe I should make the game bit a squre, then have the scores bit
  //however amount of space is left? what if the available area is square?
  //regardless, let's begin by finding the smallest size out of length and width:
  var a
  , b
  , portraitLayout;

  document.body.style.width = window.innerWidth + 'px';
  document.body.style.height = window.innerHeight + 'px';

  if (window.innerWidth > window.innerHeight) {
    a = window.innerHeight;
    b = window.innerWidth;
    portraitLayout = 0;
  }
  else {
    a = window.innerWidth;
    b = window.innerHeight;
    portraitLayout = 1;
  }


  if (document.getElementById('cont')) {
    /*
      in my webtop, I hava a scaling system for each element.
      perhaps though, I can see if this newer idea would
      work well enough...
      See, just changing the font size of the body should
      make every element scale to the new font size anyway,
      and since that would be done by the browser, I expect
      it to be more efficient than my own dodgy scaling code!
    */
    document.getElementById('cont').style.fontSize = window.innerWidth * .002 + 'em';
  /*
    var gWidth = document.body.offsetWidth;
    var gHeight = (gWidth / (16 / 9));
    if (gHeight > document.body.offsetHeight) {
    gHeight = document.body.offsetHeight;
    gWidth = gHeight * (16 / 9);
    }
    document.getElementById('cont').style.width = gWidth + 'px';
    document.getElementById('cont').style.height = gHeight + 'px';
  */
    //when the available screen is not 16/9, center the game.
    //this should default as 0px for both generaly.
    document.getElementById('cont').style.top = resizeCenter(document.body.offsetHeight, document.getElementById('cont').offsetHeight);
    document.getElementById('cont').style.left = resizeCenter(document.body.offsetWidth, document.getElementById('cont').offsetWidth);

  }

  if (document.getElementById('toastClose')) {
    closeButtonRight('toastClose');
  }
  if (document.getElementById('setsClose')) {
    closeButtonRight('setsClose');
  }
}
function resizeCenter(a, b) {
  return Math.round((a / 2) - (b / 2)) + 'px';
}

// fullscreen handling from webtop then simplified for this project...
function fullScreenToggle() {
  var isFS = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
  if (isFS) {
    killFS.call(document, function() {});
    if (document.getElementById('fs')) {
      document.getElementById('fs').classList.remove('fsd')
      document.getElementById('fs').classList.add('fsu');
    }
  } else {
    getFS.call(document.documentElement, function() {});
    if (document.getElementById('fs')) {
      document.getElementById('fs').classList.remove('fsu')
      document.getElementById('fs').classList.add('fsd');
    }
  }
}
function cc_calc() {
  /*
  REE (males) = 10 x weight (kg) + 6.25 x height (cm) - 5 x age (y) + 5
  REE (females) = 10 x weight (kg) + 6.25 x height (cm) - 5 x age (y) - 161.
  so the difference between sexes is the =5 or -161 on the end :D
  original formula:
  REE = 9.99 x weight + 6.25 x height - 4.92 x age + 166 x sex (males, 1; females, 0) - 161
  http://www.ncbi.nlm.nih.gov/pubmed/2305711

  using http://www.drgily.com/basal-metabolic-rate-calculator.php
  it seems like:
  sedentry = 350
  Light Active = 525
  moderate active = 525
  Very active = 876
  extremely active = 1051

  @ 82kg
  You burned 758 calories through sleeping, for 480 minutes.
  You burned 2066 calories through reclining, reading, for 16 hours.
  2824 - no, that is not right.
  @ 80kg
  2016 + 758


To work out your BMI:
 divide your weight in kilograms (kg) by your height in metres (m)
 then divide the answer by your height again to get your BMI.

For example:
  If you weigh 70kg and you're 1.75m tall, divide 70 by 1.75. The answer is 40.
  Then divide 40 by 1.75. The answer is 22.9. This is your BMI.


optimal waist measurement is half your height I heard too.
*/
  var zWeight, zHeight;
  var zAge = parseFloat(document.getElementById('a').value);
  var zSex = parseFloat(document.getElementById('m').value);
  var zKg = parseInt(document.getElementById('kg').value, 10);
  var zCm = parseInt(document.getElementById('cm').value, 10);
  //convert lb to kg, inch to cm:
  if (zKg) {
    zWeight = parseFloat(document.getElementById('w').value);
  } else {
    zWeight = parseFloat(document.getElementById('w').value) / 2.20462262184877566540;
  }
  if (zCm) {
    zHeight = parseFloat(document.getElementById('h').value);
  } else {
    zHeight = parseFloat(document.getElementById('h').value) / 0.39370078740157482544;
  }
  if (isNaN(zHeight) || isNaN(zWeight) || isNaN(zAge)) {
    document.getElementById('c').value = document.getElementById('b').value = document.getElementById('iW').value = document.getElementById('d').value = document.getElementById('cl').value = document.getElementById('tl').value = document.getElementById('tg').value = 0;
    if (isNaN(zHeight)) {
      document.getElementById('h').style.background = 'linear-gradient(#fbb, #eaa)';
    } else {
      document.getElementById('h').style.background = 'linear-gradient(#fff, #eee)';
    }
    if (isNaN(zWeight)) {
      document.getElementById('w').style.background = 'linear-gradient(#fbb, #eaa)';
    } else {
      document.getElementById('w').style.background = 'linear-gradient(#fff, #eee)';
    }
    if (isNaN(zAge)) {
      document.getElementById('a').style.background = 'linear-gradient(#fbb, #eaa)';
    } else {
      document.getElementById('a').style.background = 'linear-gradient(#fff, #eee)';
    }
    return;
  } else {
    document.getElementById('h').style.background = document.getElementById('w').style.background = document.getElementById('a').style.background = 'linear-gradient(#fff, #eee)';
  }
  //using REE = 9.99 x weight + 6.25 x height - 4.92 x age + 166 x sex (males, 1; females, 0) - 161
  //document.getElementById('c').value =
  //parseInt((zWeight * 9.99) + (zHeight * 6.25) - (zAge * 4.92) + ((zSex * 166) - 161), 10) + parseInt(document.getElementById('add').value, 10)
  /*
  height = 176 cm
  weight = 82kg
  age = 37 years
  the above gives 1742 BEE using mifflin

  now, lets add Metabolic Equivalent of Task  rates... 8hours sleep (0.9) then 16 hours of sitting (1.3)
  divide by 24 hours to get rate per hour:
  1742 / 24 = 72.58333333333333
  times that by 8 for sleep
  (72.58333333333333*8)*0.9 = 522.6
  and for the 16 hours sitting:
                1509.733333333333
  those give 2032.33 total :D

*/
  var totCals = 0;
  //do the Mifflin-ST Joan BMR equation (REAL not simplified)
  var BMRperH = ((zWeight * 9.99) + (zHeight * 6.25) - (zAge * 4.92) + ((zSex * 166) - 161)) / 24;
  var hr = parseInt(document.getElementById('hr').value, 10);
  //var the activity values:
  var s = parseFloat(document.getElementById('s').value);
  var na;
  var la = parseFloat(document.getElementById('la').value);
  var ma = parseFloat(document.getElementById('ma').value);
  var ha = parseFloat(document.getElementById('ha').value);
  if (hr) {
    //hours selected
    //calculate the sitting time in hours by subtracting everything else from 24
    na = document.getElementById('na').value = parseFloat((24 - s - la - ma - ha).toFixed(3));
  } else {
    //convert to hours for minutes
    //calculate the sitting time by subtracting everything else from 24*60
    na = document.getElementById('na').value = parseFloat((1440 - s - la - ma - ha).toFixed(3));
    //divide each f the values by 60 to get the amount in hours
    s /= 60;
    //document.getElementById('s').value / 60
    na /= 60;
    la /= 60;
    ma /= 60;
    ha /= 60;
  }
  //do sleep @ 0.9
  totCals += ((BMRperH * s) * 0.9);
  //do Not active @ 1.2 - really should be 1.3, but sitting quietly is 1.0
  totCals += ((BMRperH * na) * 1.3);
  //do lightly active @ 2.5 eg.washing up casually
  totCals += ((BMRperH * la) * 2.5);
  //do Moderately active @ 4  walking for pleasure is 3.5, brisk is 4.3, very brisk is 5.0
  totCals += ((BMRperH * ma) * 4);
  //do Heavily active @ 8
  totCals += ((BMRperH * ha) * 8);
  document.getElementById('c').value = Math.round(totCals);
  //save the values here
  cc_dataSave();
  var zToGain, tCals;
  var iWeight = (((zHeight / 100) * (zHeight / 100)) * 21.75);
  var iWaist = (zHeight / 2);
  //do BMI:
  document.getElementById('b').value = (zWeight / ((zHeight / 100) * (zHeight / 100))).toFixed(2);
  //is this the same as zWeight / (zHeight * zHeight)
  zToGain = (zWeight - iWeight);
  //if this is a minus, then add 600?
  if (zToGain > 0) {
    tCals = -600;
    document.getElementById('_zToLose').innerHTML = 'Lose target';
  } else {
    tCals = 600;
    zToGain = -zToGain;
    document.getElementById('_zToLose').innerHTML = 'Gain target';
  }
  //add/take 600 from the maintenance calories for target cals per day.
  document.getElementById('cl').value = Math.round(totCals + tCals);
  //amount of time it'd take to get to the ideal weight:
  //times by 2 to get 0.5 into weeks
  //my average appears to be 100g per day, 700g per week
  //2.1Kg should take 3 weeks 2100/7?
  document.getElementById('tg').value = Math.round(zToGain / .7);
  //convert kg back to lb, cm back to inch if needed:
  if (!zKg) {
    zToGain *= 2.20462262184877566540;
    iWeight *= 2.20462262184877566540;
  }
  if (!zCm) {
    iWaist *= 0.39370078740157482544;
  }
  //do ideal waist measurement
  document.getElementById('d').value = iWaist.toFixed(2);
  //do ideal weight
  document.getElementById('iW').value = iWeight.toFixed(2);
  //amount of kg to lose to get to the ideal BMI
  document.getElementById('tl').value = zToGain.toFixed(2);
}
function cc_dataLoad() {
  var dataToLoad = storageLoad('Calorie Calculator')
  var LSsplit1;
  if (dataToLoad) {
    try {
      LSsplit1 = dataToLoad.split(LS1);
      if (LSsplit1[0] === '0') {
        //if female was selected, change to female now
        cc_mClick(document.getElementById('f'));
      }
      document.getElementById('h').value = LSsplit1[1];
      document.getElementById('w').value = LSsplit1[2];
      document.getElementById('a').value = LSsplit1[3];
      if (LSsplit1[4] === '0') {
        cc_mClick(document.getElementById('mn'));
      }
      document.getElementById('s').value = LSsplit1[5];
      document.getElementById('na').value = LSsplit1[6];
      document.getElementById('la').value = LSsplit1[7];
      document.getElementById('ma').value = LSsplit1[8];
      document.getElementById('ha').value = LSsplit1[9];
      if (LSsplit1.length > 9) {
        if (LSsplit1[10] === '0') {
          document.getElementById('in').classList.remove('uButtonGrey');
          document.getElementById('in').classList.add('uButtonGreen');
          document.getElementById('cm').classList.remove('uButtonGreen');
          document.getElementById('cm').classList.add('uButtonGrey');
          document.getElementById('cm').value = 0;
        }
        if (LSsplit1[11] === '0') {
          document.getElementById('lb').classList.remove('uButtonGrey');
          document.getElementById('lb').classList.add('uButtonGreen');
          document.getElementById('kg').classList.remove('uButtonGreen');
          document.getElementById('kg').classList.add('uButtonGrey');
          document.getElementById('kg').value = 0;
        }
      }
    } catch (ex) {//notify of error.
    }
  }
}
function cc_dataSave() {
  var dataToSave = '';
  dataToSave += document.getElementById('m').value + LS1;
  dataToSave += document.getElementById('h').value + LS1;
  dataToSave += document.getElementById('w').value + LS1;
  dataToSave += document.getElementById('a').value + LS1;
  dataToSave += document.getElementById('hr').value + LS1;
  dataToSave += document.getElementById('s').value + LS1;
  dataToSave += document.getElementById('na').value + LS1;
  dataToSave += document.getElementById('la').value + LS1;
  dataToSave += document.getElementById('ma').value + LS1;
  dataToSave += document.getElementById('ha').value + LS1;
  dataToSave += document.getElementById('kg').value + LS1;
  dataToSave += document.getElementById('cm').value + LS1;
  storageSave('Calorie Calculator', dataToSave);
}
function cc_genrerateCombo(selectIt) {
  var a = '';
  for (var b = 0; b <= 24; b++) {
    if (b == selectIt) {
      a += '<option selected>' + b + '</option>'
    } else {
      a += '<option>' + b + '</option>'
    }
  }
  return b;
}
function cc_mClick(zButton) {
  debugger;
  var zButtonID = zButton.id;
  if (zButtonID === 'm') {
    cc_swapButton('m', 'f');
    zButton.value = 1;
  } else if (zButtonID === 'f') {
    cc_swapButton('f', 'm');
    document.getElementById('m').value = 0;
  } else if (zButtonID === 'kg' || zButtonID === 'lb') {
    cc_weight(zButtonID, zButton);
  } else if (zButtonID === 'cm' || zButtonID === 'in') {
    cc_waist(zButtonID, zButton);
  } else if (zButtonID === 'hr' && zButton.classList.contains('uButtonGrey')) {
    cc_swapButton('hr', 'mn');
    zButton.value = 1;
    document.getElementById('s').value = (document.getElementById('s').value / 60).toFixed(3);
    document.getElementById('la').value = (document.getElementById('la').value / 60).toFixed(3);
    document.getElementById('ma').value = (document.getElementById('ma').value / 60).toFixed(3);
    document.getElementById('ha').value = (document.getElementById('ha').value / 60).toFixed(3);
  } else if (zButtonID === 'mn' && zButton.classList.contains('uButtonGrey')) {
    cc_swapButton('mn', 'hr');
    document.getElementById('hr').value = 0;
    document.getElementById('s').value = (document.getElementById('s').value * 60).toFixed(3);
    document.getElementById('la').value = (document.getElementById('la').value * 60).toFixed(3);
    document.getElementById('ma').value = (document.getElementById('ma').value * 60).toFixed(3);
    document.getElementById('ha').value = (document.getElementById('ha').value * 60).toFixed(3);
  }
  cc_calc();
}
function cc_mDown(targID, e) {
  var zNewID = targ.id.split('-');
  if (zNewID[3] === 'I' || zNewID[3] === 'Iv') {
    Mdown.Action = 'ccDrag';
  } else if (zNewID[3].slice(0, 1) === 'C') {
    var dID;
    if (zNewID[3] === 'Cv') {
      dID = zNewID[0] + '-' + zNewID[1] + '-' + zNewID[2] + '-Iv';
    } else {
      dID = zNewID[0] + '-' + zNewID[1] + '-' + zNewID[2] + '-I';
    }
    mEvent.startElem = document.getElementById(dID);
    Mdown.Action = 'ccDrag';
    cc_mMove(mEvent.startElem, e);
  }
}
function cc_mMove(zSlider, e) {
  var zNewID = zSlider.id.split('-');
  var WinNo = zNewID[1];
  var num = zNewID[2];
  //is the mouse
  //find the percentage of the lthe slider's left
  var zWidth = zSlider.parentNode.offsetWidth;
  var zLeft = zSlider.parentNode.offsetLeft;
  var sliderLeft = e.clientX - document.getElementById('Cont').offsetLeft - zLeft - WinPadding;
  //why 9?!?!?
  sliderLeft -= (zSlider.offsetWidth / 2);
  //var sliderPercent = (sliderLeft / zWidth) * 100;
  var sliderPercent = (sliderLeft / (zWidth - zSlider.offsetWidth)) * 100;
  if (sliderPercent < 0) {
    sliderPercent = 0;
  } else if (sliderPercent > 100) {
    sliderPercent = 100;
  }
  //recalculate to offset width of the slider iteself
  var zDiff = (zWidth - zSlider.offsetWidth) / zWidth;
  sliderPercent *= zDiff;
  zSlider.style.left = sliderPercent + '%';
}
function cc_swapButton(zEnable, zDisable) {
  document.getElementById(zEnable).classList.remove('uButtonGrey');
  document.getElementById(zEnable).classList.add('uButtonGreen');
  document.getElementById(zDisable).classList.remove('uButtonGreen');
  document.getElementById(zDisable).classList.add('uButtonGrey');
}
function cc_waist(zButtonID, zButton) {
  // 1 cm is 0.39370078740157482544 inches
  if (zButtonID === 'cm' && zButton.classList.contains('uButtonGrey')) {
    cc_swapButton('cm', 'in');
    zButton.value = '1';
    document.getElementById('h').value = (document.getElementById('h').value / 0.39370078740157482544).toFixed(2);
  } else if (zButtonID === 'in' && zButton.classList.contains('uButtonGrey')) {
    cc_swapButton('in', 'cm');
    document.getElementById('cm').value = 0;
    document.getElementById('h').value = (document.getElementById('h').value * 0.39370078740157482544).toFixed(2);
  }
}
function cc_weight(zButtonID, zButton) {
  //1 Kg = 2.20462262184877566540 lb
  if (zButtonID === 'kg' && zButton.classList.contains('uButtonGrey')) {
    cc_swapButton('kg', 'lb');
    zButton.value = '1';
    document.getElementById('w').value = (document.getElementById('w').value / 2.20462262184877566540).toFixed(2);
  } else if (zButtonID === 'lb' && zButton.classList.contains('uButtonGrey')) {
    cc_swapButton('lb', 'kg');
    document.getElementById('kg').value = 0;
    document.getElementById('w').value = (document.getElementById('w').value * 2.20462262184877566540).toFixed(2);
  }
}