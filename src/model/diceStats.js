let miscMod=0;
let selectedAttack=1;

let activeGems=[];
let gemList=[];
let buffTrays=[
  ["Tray 1 :",[]],
  ["Tray 2 :",[]],
  ["Tray 3 :",[]],
  ["Tray 4 :",[]],
  ["Tray 5 :",[]]
];
let nerfTrays=[
  ["Tray 1 :",[]],
  ["Tray 2 :",[]],
  ["Tray 3 :",[]],
  ["Tray 4 :",[]],
  ["Tray 5 :",[]]
];

let playerStats={
  str:10,
  dex:10,
  con:10,
  int:10,
  wis:10,
  cha:10,
  bab:0,
}

let avatarHiggs={
  laugh:"https://res.cloudinary.com/metaverse/image/upload/v1541010546/Avatars/Higgsy/side_higgsLaugh.png",
  snide:"https://res.cloudinary.com/metaverse/image/upload/v1541010541/Avatars/Higgsy/side_higgsSnide.png",
  shocked:"https://res.cloudinary.com/metaverse/image/upload/v1541010539/Avatars/Higgsy/side_higgsShocked.png",
  normal:"https://res.cloudinary.com/metaverse/image/upload/v1541010543/Avatars/Higgsy/side_higgsNormal.png",
  drained:"https://res.cloudinary.com/metaverse/image/upload/v1541010547/Avatars/Higgsy/side_higgsDrained.png",
  mad:"https://res.cloudinary.com/metaverse/image/upload/v1541010545/Avatars/Higgsy/side_higgsMad.png",
}

let characterName="Sample Name (click me)";
let playerAvatar="https://res.cloudinary.com/metaverse/image/upload/v1537235951/DiceTray/charArt/soHANDSOME.png";

let buffTrayNum=0;
let nerfTrayNum=0;

let atkList=[
  {id:1,
  atkStat:"Strength",
  damStat:"Strength",
  name:"Attack Name",
  buffTrays:buffTrays,
  nerfTrays:nerfTrays,
  buffTrayNum:buffTrayNum,
  nerfTrayNum:nerfTrayNum,
  gemList:gemList,
  activeGems:activeGems,
  }
];

let atkTemplate={
  atkStat:"Strength",
  damStat:"Strength",
  name:"Attack Name",
  buffTrays:buffTrays,
  nerfTrays:nerfTrays,
  buffTrayNum:buffTrayNum,
  nerfTrayNum:nerfTrayNum,
  gemList:gemList,
  activeGems:activeGems,
}

function Tutorial(){
  $("#tutorialOverlay").remove();
  this.genAvatar="https://res.cloudinary.com/metaverse/image/upload/v1537212440/DiceTray/charArt/side_higgsLaugh.png";
  this.overlay=`<div id="tutorialOverlay" class="overlay"></div>`;
  this.queryBox=`<div id="tutorialQueryBox" style="background-color:#d6c3a4; border-color: #a7834b; border-style: solid; border-radius:5%; height:13vh; width:15vw; left:40%;  top:30%; position:absolute; text-align:center; font-size:1vw"> Play tutorial? <button style="position:absolute; bottom:5%; left:20%;" id="tutorialYesButton" class="trayButton darkWoodBtn"> Yes</button>
  <button class="trayButton darkWoodBtn" style="position:absolute; bottom:5%; right:20%;" id="tutorialNoButton">No</button></div>`;
  this.dialogueBox=`<div id="tutorialDialogueBox" class="container-fluid" style="color:white; background-color:black; height:30vh; width:100vw; bottom: 0; position:absolute; z-index:10;">
    <div class="row h-100">
    <div id="tutorialAvatar" style="background-image: url(${this.genAvatar});  background-size: 100% 100%; background-repeat:no-repeat; background-color:brown; border-style: solid;
    border-width: 5px; border-color:white; border-radius:5px;" class="col-2"></div>
    <div id="tutorialDialogue" class="col-9 pt-3" style="font-size:1.25vw"></div>
    <div class="col-1"><button id="tutorialNextButton" class="trayButton darkWoodBtn mt-4" onclick="tutorialChangeFrame()">Next</button></div>
    </div>
  </div>`;

  this.currentFrame=0;
  this.frames=[];
  this.highlighted=[];

  this.changeFrame=function(){
    this.currentFrame++;
    let highlighted=this.highlighted;
    if (highlighted.length){
      for (let i=0; i< highlighted.length; i++){
        $(highlighted[i]).css("z-index", "");
      }
      this.highlighted=[];
    }
    if (this.frames ===undefined){
      return
    }
    else if (this.currentFrame>=this.frames.length){
            $("#tutorialNextButton").attr("onclick",'exitTutorial()');
            return
    }
    else if (this.currentFrame==this.frames.length-1){
      $("#tutorialNextButton").attr("onclick",'exitTutorial()');
    }
    let frameChanges=this.frames[this.currentFrame];
    $("#tutorialDialogue").html(frameChanges.dialogue);

    if (frameChanges.position=="floatText"){; $('#tutorialDialogueBox').css({'bottom': '', 'top': 0}); }
    else{$('#tutorialDialogueBox').css({'bottom': 0, 'top': ''});}

    //set the highlights to actually work
    if (frameChanges.highlights.length){frameChanges.highlights.forEach(function(highlight){$(highlight).css("z-index", 5); console.log(openingTutorial.highlighted); openingTutorial.highlighted.push(highlight);});}

    if (frameChanges.newImage){$('#tutorialAvatar').css("background-image",`url(${frameChanges.newImage})`);}
    else{$('#tutorialAvatar').css("background-image",`url(${this.genAvatar})`);}

    if(frameChanges.clickToProceed===false){ $("#tutorialNextButton").attr("disabled",true);}
    else{ $("#tutorialNextButton").attr("disabled",false);}

    if(frameChanges.queryUser){ $("#tutorialQueryBox").css("display","block");}
    else{ $("#tutorialQueryBox").css("display","none");}


    if(frameChanges.answerYes){$("#tutorialYesButton").attr("onclick",`tutorialChangeFrame()`);}

    if(frameChanges.answerNo){$("#tutorialNoButton").attr("onclick",'exitTutorial()');}
  }

  this.addFrame=function(dialogue, position, highlights, newImage, clickToProceed, queryUser, answerYes, answerNo){
    let newFrame={};
    if (!dialogue){dialogue="";}
    if (!position){position="sinkText";}
    if (!highlights){highlights=[];}
    if (!newImage){newImage=false;}
    if (clickToProceed===undefined){clickToProceed=true;}
    if (!queryUser){queryUser=false;}
    if (!answerYes){answerYes=false;}
    if (!answerNo){answerNo=false;}

    newFrame.dialogue=dialogue;
    newFrame.position=position;
    newFrame.highlights=highlights;
    newFrame.newImage=newImage;
    newFrame.clickToProceed=clickToProceed;
    newFrame.queryUser=queryUser;
    newFrame.answerYes=answerYes;
    newFrame.answerNo=answerNo;

    this.frames.push(newFrame);
  }
}


let openingTutorial=new Tutorial();
function exitTutorial(){
  localStorage.setItem("tutorialSkip", true);
  document.getElementById('tutorialOverlay').style.display= "none";
}

openingTutorial.addFrame("Hi there, it looks like you <i>might</i> be new.  Would you like me to give you a tour?  If you say no you can always change your mind by scrolling down and pressing the blue 'Replay Tour' button (I'm kinda covering it up right now but it's at the very bottom of the page).", "sinkText", false, avatarHiggs.normal, false, true, openingTutorial.changeFrame, exitTutorial);
openingTutorial.addFrame("Great!  Well I guess first off you can call me Higgsy. To proceed through the tour just click the 'next' button over on the right, if it's inactive though just look for any on-screen instructions.");
openingTutorial.addFrame("Our first stop is the lapidary!  That's where we make and store all our...oh, right, I should explain what gems are.", "sinkText", false, avatarHiggs.snide);
openingTutorial.addFrame("A gem is just any spell, feat, class ability, item, etc. that affects your attack modifier or damage modifier in some way.  You can see why we gave them a nickname.  Hopefully you'll see why we chose the nickname 'gem' soon enough.");
openingTutorial.addFrame("Anywho, the lapidary is this purple box on the left. The button above it opens up a form to define then create the gems relevant to your character.  You can put a minimal amount of information into your gem like just a name and noting that it gives you +2 to attack when slotted in.  Or you can give a <b>lot</b> of information and include what kind of bonus it gives, a description of how the bonus works, etc.","sinkText", ["#lapidary"]);
openingTutorial.addFrame("There's a bit more to it, but the form has plenty of helpful tooltips if you hover over the questions.  If you want you can try creating a gem now, I'll wait!  I recommend trying to make a gem for each of the three major types (Static, Variable, and Conditional).  The form'll automatically stop you from making an invalid gem.  ...err wait you didn't ALREADY do that as soon as I showed you the button on the last screen did you?","sinkText", ["#lapidary"], avatarHiggs.mad);
openingTutorial.addFrame("Okay!  So hopefully making your gem went well.  If it did you should see it nestled in your lapidary on the left.  If you don't see it...well, carp I guess that's a bug.  I've only seen it once before and refreshing the page then trying again solved it for me." ,"sinkText", ["#lapidary"], avatarHiggs.normal);
openingTutorial.addFrame("In any case, please let my maker know about any bugs or complaints.  ...unless those complaints are about me.  Okay fine, also if they're about me.  Anyhow, next thing to know is that you can hover over any gem to see its information displayed on these three sheets I just highlighted for you." ,"sinkText", ["#lapidary", "#infoSlot", "#dieHolder", "#resultBox"], avatarHiggs.mad);
openingTutorial.addFrame("You might have also noted that these three sheets aren't exactly blank when you're NOT hovering over a gem.  The first sheet shows your current Atk/dmg bonus.  Currently it's at +0 because you don't have any gems slotted, by default your Base Attack Bonus is set to 0 and all your stats modifiers are also set to 0.  I'll show you where to change that later." ,"sinkText", ["#infoSlot"], avatarHiggs.normal);
openingTutorial.addFrame("The middle sheet just has a picture of a d20 you can click to roll.  If you do, we'll simulate your attack and damage rolls on the sheet to the right.  Feel free to give it a few clicks if you want.  This includes a d20 roll added to your to-hit, along with any dice we need to roll based on any gems you have slotted (for example if you have a +2d4 to your attack rolls for some reason).  Speaking of, I bet you're wondering what this 'slotting' I keep talking about means.  First off I'll go ahead and get out of the way, then I'll show you~" ,"sinkText", ["#infoSlot", "#dieHolder", "#resultBox"]);
openingTutorial.addFrame("Huh, it's <i>cozy</i> back here.  But alright, if you want your gem to be factored in all you have to do is slot it into one of these trays by dragging and dropping.  Each row has 5 renamable trays you can cycle through.  Click the black nameplate to rename, and click the arrows next to it to cycle.", "floatText", ["#lapidary", "#infoSlot", "#dieHolder", "#resultBox", "#gemTray"], avatarHiggs.normal);
openingTutorial.addFrame("You may also have noticed the number stapled to the right of the trays.  This is a miscMod for quick and dirty adjustments to your to-hit.  For example if the GM decides to give you a -2 to-hit due to weird weather conditions or something.", "floatText", ["#lapidary", "#infoSlot", "#dieHolder", "#resultBox", "#miscMod"], avatarHiggs.mad);
openingTutorial.addFrame("After you've added or removed any gems from the trays you'll have to update the sheets.  To do that just click the button labeled 'Update Display' on the first sheet.  It should start glowing and moving to remind you to do so after any gems are moved or other changes are made.", "floatText", ["#lapidary", "#infoSlot", "#dieHolder", "#resultBox", "#gemTray", "#miscMod"], avatarHiggs.normal);
openingTutorial.addFrame("One more thing to note is that if that if you slotted in a Conditional Gem it won't be considered to have an effect even if you've slotted it in and clicked 'Update Display'.  Instead the first sheet will get a list of checkboxes linked to every slotted conditional gem.  In this case you can check the boxes to activate the linked conditional gem.  I like to set the buff-spells I've prepared for the day this way or use it to remind me about things like 'flanking' or 'high ground' that are always available but only 'turn-on' if certain battlefield conditions are met.", "floatText", ["#lapidary", "#infoSlot", "#dieHolder", "#resultBox", "#gemTray"]);
openingTutorial.addFrame("If you ever create a gem and realize you made a mistake or just don't want it anymore you can destroy it by throwing it into the box beneath the lapidary.  Then click the 'incinerate gems' button on it to delete all gems that are in the box.  To reset EVERYTHING click the red reset all button (scroll down a little if you don't see it).", "floatText", ["#lapidary", "#trashTray", "#gemTray}"], avatarHiggs.snide);
openingTutorial.addFrame("Okay, last thing!  The portrait on the bottom right lets you choose some character art for yourself, save/swap between different attacks that can have their own gem set-ups, change the nameplate of your attack to something other than 'attack name', change your base ability scores or base attack bonus, or to see the credits.", "floatText", ["#charPortrait"], avatarHiggs.normal);
openingTutorial.addFrame("Did you try clicking the portrait?  Hah, well you'll just have to be wait until I'm done to actually play through that.  Luckily for you, I <i>am</i> done.  I hope you find this useful either now or after a few feature updates.  Remember, your feedback is really important to me!  Well, not to -me- but to the person who writes my lines.  Higgsy, out!");

function tutorialChangeFrame(){
  openingTutorial.changeFrame();
}

function runTutorial(){
  let tutorial=openingTutorial;
  if (!$("#tutorialOverlay").length){
    $("body").append(tutorial.overlay);
    $("#tutorialOverlay").append(tutorial.queryBox);
    $("#tutorialOverlay").append(tutorial.dialogueBox);
    document.getElementById('tutorialOverlay').style.display= "block";
    tutorial.currentFrame--;
  }

  tutorial.changeFrame();
}

function Gem(rawGem) {
  let rawKeys=Object.keys(rawGem)
  for (x in rawKeys){
    this[rawKeys[x]]=rawGem[[rawKeys[x]]];
  }
}

Gem.prototype.setID=function(){

  let gemList=JSON.parse(localStorage.getItem("gemList"));
  //checks if the id of this object is already set (note that this conditional would return as false even if we have an id IF that id is 0 which is a falsey value)
  if (this.id !== undefined){
    console.log("this gem already has an ID");
    console.log(this.id);
    return;
  }
  else if (gemList.length==0){
    //would use 0 to start the ids with but 0 would be treated as a falsey value, causing the id to be reset when it shouldn't be if we called setID again for some reason
    this.id=1;
    gemList.push(this);
  }
  else{
    let gemArray=[];
    let l=gemList.length;

    for (let i=0; i<l ; i++){
      gemArray.push(gemList[i].id);
    }
    this.id=Math.max(...gemArray)+1;
    gemList.push(this);
  }

  localStorage.setItem("gemList",JSON.stringify(gemList));
  return;
};

function loadURLS(blueprint){


  let imageURL = []; // list of image URLs
  let images = []; /// array to hold images.
  var imageCount = 0; // number of loaded images;
  let promises=[];

  let dataURL="https://res.cloudinary.com/metaverse/image/upload/v1533578071/bloodMoonGame/charArt/higgsBard.png";

  let text=blueprint.name;



  if (blueprint.effectEntries=="boon"){

    imageURL.push(['https://res.cloudinary.com/metaverse/image/upload/v1535221982/DiceTray/Gems/buffBox.png',"box"]);
  }
  else{

    imageURL.push(['https://res.cloudinary.com/metaverse/image/upload/v1535221984/DiceTray/Gems/nerfBox.png',"box"]);
  }

  switch(blueprint.typeEntries){
    case "static":
      imageURL.push(['https://res.cloudinary.com/metaverse/image/upload/v1535396751/DiceTray/Gems/simpleIcon.png',"type"]);
      break;

    case "variable":
      imageURL.push(['https://res.cloudinary.com/metaverse/image/upload/v1535396753/DiceTray/Gems/variableIcon.png',"type"]);
      break;
    case "conditional":
      imageURL.push(['https://res.cloudinary.com/metaverse/image/upload/a_25/v1535396750/DiceTray/Gems/conditionIcon.png',"type"]);
      break;
    default:
      console.log("There was an error selecting the right flair for a gem.  Double check loadURLS");
      imageURL.push(['https://res.cloudinary.com/metaverse/image/upload/v1535396753/DiceTray/Gems/variableIcon.png',"type"]);
      break;
  }


  //https://codereview.stackexchange.com/questions/128587/check-if-images-are-loaded-es6-promises

  imageURL.forEach((url) => {
      promises.push(new Promise((resolve, reject) => {
          const img = new Image();

          img.crossOrigin = "anonymous"

          img.onload = () => {
              resolve({
                  url:img,
                  status: 'ok',
                  name:url[1],
                  text:text,
              });
          };

          // Call `resolve` even if the image fails to load. If we were to
          // call `reject`, the whole "system" would break
          img.onerror = () => {
              resolve({
                  url:img,
                  status: 'error',
                  name:url[1],
                  text:text,
              });
          };

          img.src = url[0];
      }));
  });

  return Promise.all(promises);

}

function compositor(promisedImgs) {
      //https://stackoverflow.com/questions/7283065/canvas-combing-two-images-return-one-img-html-object

      let text;
      let currentImg;
      let len=promisedImgs.length;
      let box;
      let type;
      let dataURL;

      text=decodeURIComponent(promisedImgs[0].text);

      for (let i=0; i<len; i++){
        currentImg=promisedImgs[i];
        switch (currentImg.name){
                case "box":
                  box=currentImg.url;
                  break;

                case "type":
                  type=currentImg.url;
                  break;

                default:
                  console.log("you may want to fix a few things.  can't find a type for curr IMG in the compositor");
                  console.log(currentImg);
                  break;
        }
      }

      //this number will increase as we create more things that need to be composited
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        // composite now

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(box, 0,0, canvas.width, canvas.height);
        ctx.drawImage(type, canvas.width*.8,canvas.height*.2, canvas.width*.2, canvas.height*.8);
        ctx.save();
        ctx.font = "20px 'Palatino'";
        var metrics = ctx.measureText(text);
        var textWidth = metrics.width;


        var scalex = (canvas.width*.75 / textWidth);
        var scaley = (canvas.height*.8 / 23);

        var ypos = (canvas.height / (scaley * 1.25));
        var xpos=(canvas.width/ (scalex))*.05;

            //canvas.width*.3/textWidth
        ctx.scale(scalex, scaley);
        ctx.fillText(text,xpos, ypos);
        ctx.restore();

        dataURL=canvas.toDataURL("image/jpeg", 0.5);

        return(dataURL);
      }

function createGem(rawGem){
  let newGem= new Gem(rawGem);

  loadURLS(newGem)
  .then(function(e){let mouse=e; return(compositor(mouse));})
  .then(function(f){newGem.img=f; newGem.setID(); displayLapidary();});
}

//setting up local Storage after a reset

if (localStorage.getItem("playerStats") === null) {
  localStorage.setItem('playerStats', JSON.stringify(playerStats));
}

if (localStorage.getItem("miscMod") === null) {
  localStorage.setItem('miscMod', JSON.stringify(miscMod));
}

if (localStorage.getItem("atkList") === null) {
  localStorage.setItem('atkList', JSON.stringify(atkList));
}

if (localStorage.getItem("selectedAttack") === null) {
  localStorage.setItem('selectedAttack', JSON.stringify(selectedAttack));
}

if (localStorage.getItem("atkTemplate") === null) {
  localStorage.setItem('atkTemplate', JSON.stringify(atkTemplate));
}

if (localStorage.getItem("gemList") === null) {
  localStorage.setItem('gemList', JSON.stringify(gemList));
}

if (localStorage.getItem("activeGems") === null) {
  localStorage.setItem('activeGems', JSON.stringify(activeGems));
}

if (localStorage.getItem("characterName") === null) {
  localStorage.setItem('characterName', JSON.stringify(characterName));
}

if (localStorage.getItem("playerAvatar") === null) {
  localStorage.setItem('playerAvatar', JSON.stringify(playerAvatar));
}


function resetStorage(){
  if (window.confirm("Do you really want to delete all your saved info?")) {
  localStorage.clear();
  location.reload();
}

}
