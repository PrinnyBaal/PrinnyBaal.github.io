
diceProj.view.diceMath = {
  setupUserInterface: function () {
    window.onbeforeunload = beforeUnloadCleanUp;
    setHovers();
    setClicks();

    loadAttack();
    displayConditionals();
    displayLapidary();
    displayMiscMod();
    displayMod();
    displayPlayerAvatar();
    displayTitle();
    displayTrash();
    displayTraySlots();
    checkChange();

    if (!JSON.parse(localStorage.getItem("tutorialSkip"))){
      runTutorial();
    }

    }
};

// animation functions
// -------------------------------
function pendingConditionals(){
  $("#submitConditionals").addClass("shimmering");
}

//functions that change game variables whenever chosen attack is changed
  //-----------------------------------------------------------------
  function saveAttack(){
    let chosen=JSON.parse(localStorage.getItem("selectedAttack"));
    let atkList=JSON.parse(localStorage.getItem("atkList"));
    let chosenObject= findIndexByID(chosen, atkList);

    atkList[chosenObject].activeGems=JSON.parse(localStorage.getItem("activeGems"));
    atkList[chosenObject].gemList=JSON.parse(localStorage.getItem("gemList"));

    atkList[chosenObject].buffTrayNum=JSON.parse(localStorage.getItem("buffTrayNum"));
    atkList[chosenObject].nerfTrayNum=JSON.parse(localStorage.getItem("nerfTrayNum"));

    atkList[chosenObject].buffTrays=JSON.parse(localStorage.getItem("buffTrays"));
    atkList[chosenObject].nerfTrays=JSON.parse(localStorage.getItem("nerfTrays"));

    localStorage.setItem("atkList", JSON.stringify(atkList));
  }
  function loadAttack(){
    let chosen=JSON.parse(localStorage.getItem("selectedAttack"));
    let atkList=JSON.parse(localStorage.getItem("atkList"));
    let chosenObject= findObjectByID(chosen, atkList);


    localStorage.setItem("activeGems", JSON.stringify(chosenObject.activeGems));
    localStorage.setItem("gemList", JSON.stringify(chosenObject.gemList));


    localStorage.setItem("buffTrayNum", JSON.stringify(chosenObject.buffTrayNum));
    localStorage.setItem("nerfTrayNum", JSON.stringify(chosenObject.nerfTrayNum));

    localStorage.setItem("buffTrays", JSON.stringify(chosenObject.buffTrays));
    localStorage.setItem("nerfTrays", JSON.stringify(chosenObject.nerfTrays));

    displayTitle();
    displayLapidary();
    displayTraySlots();
  }
  function beforeUnloadCleanUp(){
    savePositions();
    saveAttack();
  }
// Lapidary Display/Storage
//-------------------------------------------------------------------------------

function displayLapidary(){
  var col=1;
  let setGrid="";
  var row=0;
  let gemList=JSON.parse(localStorage.getItem("gemList"));
  let gemLength=gemList.length;
  let activeGems=JSON.parse(localStorage.getItem("activeGems"));
  let activeLength=activeGems.length;

    //will continue to make rows until there are at LEAST 15, but will continue if there are more gems to set
  setGrid+=`<button id="gemFormButton" class="button btn-block" onclick="buildAGemOverlay()">Open Gem Maker</button>`
  while (row<15 || row<gemLength-activeLength+5){

    //I'm unsure if the class itemGridRow is important or not
    setGrid+=`<div class="row itemGridRow">`;
    setGrid+=`<div id=${row+"lapidarySlot"} class="lapidarySlot col"  ondrop="drop(event)" ondragover="allowDrop(event)">`;
    setGrid+=`</div>`;
    setGrid+=`</div>`;
    row+=1;
  }
  $("#lapidary").html(setGrid);
  stockLapidary(gemList, activeGems);
}
function stockLapidary(gemList, activeGems){
  let slotCode;
  let i=0;
  currentGem=gemList.shift();
  while(currentGem){


    if(activeGems.indexOf(currentGem.id) >= 0){
      currentGem=gemList.shift();
      continue;
    }
    slotCode=`<div class="lapWrapper" draggable="true" ondragstart="drag(event)" id=${currentGem.id +"lapWrapper"}>
                  <img  draggable="false" class="itemImage" id=${currentGem.id} src=${currentGem.img}>
                  <div class="imageShadow" data-held-img="${currentGem.id}"></div>
              </div>`;

    $("#"+i+"lapidarySlot").html(slotCode);
    currentGem=gemList.shift();
    i+=1;
  }
}

//--------------------------------------------------------------------------------

//Misc. UI or UX
//--------------------------------------------------------------------------------
function displayTitle(){
  let chosen=JSON.parse(localStorage.getItem("selectedAttack"));
  let atkList=JSON.parse(localStorage.getItem("atkList"));
  let chosenObject= findObjectByID(chosen, atkList);
  $("#titleBanner").html(chosenObject.name);
}
function displayPlayerAvatar(){
  let avatar=JSON.parse(localStorage.getItem("playerAvatar"));
  let name=JSON.parse(localStorage.getItem("characterName"));
  if (avatar){
    $("#charPortraitImg").attr("src", avatar);
  }
  $("#charNamePlate").html(name);
}

function setHovers(){
  $(".tooltipOverlay").addClass("hiddenInfo");
  $( "#gemTray" ).on("mouseenter mouseleave", ".imageShadow", tooltipHover);
  $( "#lapidary" ).on("mouseenter mouseleave", ".imageShadow", tooltipHover);
  $( "#trashTray" ).on("mouseenter mouseleave", ".imageShadow", tooltipHover);
  $(".ribbonBtn").hover(ribbonHover);
}

function ribbonHover(e){
  $(this).toggleClass('col-6');
  $(this).toggleClass('col-8');
}

function tooltipHover(e){
  if (e.className="imageShadow"){
  }
  if (e.type=="mouseenter"){
    let gemList=JSON.parse(localStorage.getItem("gemList"));
    let currentGem;


      currentGem=findObjectByID(e.target.dataset.heldImg, gemList);
      $("#tooltipName").html(`Name: ${decodeURIComponent(currentGem.name)}`);
      $("#tooltipType").html(`Type: ${currentGem.typeEntries}`);
      $("#tooltipAtk").html(`Atk: ${currentGem.modifier} [${currentGem.variableToHit}]`);
      $("#tooltipDmg").html(`Dmg: ${currentGem.damStaticEntry} [${currentGem.damDiceEntry}]`);
      $("#tooltipStatsPhys").html(`Str: ${currentGem.statChanges.str}  Dex: ${currentGem.statChanges.dex}  Con: ${currentGem.statChanges.con}`);
      $("#tooltipStatsMent").html(`Int: ${currentGem.statChanges.int}  Wis: ${currentGem.statChanges.wis}  Cha: ${currentGem.statChanges.cha} `);

      if (currentGem.description){
        $("#tooltipDesc").html(`Desc: ${decodeURIComponent(currentGem.description)}`);
      }
      else{
        $("#tooltipDesc").html(`Desc: `);
      }
      if (currentGem.conditionTrigger){
        $("#tooltipTrigger").html(`Condition Trigger: ${decodeURIComponent(currentGem.conditionTrigger)}`);
      }
      else{
        $("#tooltipTrigger").html(`Condition Trigger:`);
      }
      $("#tooltipHitType").html(`Atk Type: ${currentGem.staticType}`);
      $("#tooltipStatType").html(`Stat-Change Type: ${currentGem.ablScoreType}`);
      $("#tooltipDamType").html(`Dmg Type: ${currentGem.dmgType}`);

      $(".tooltipOverlay").removeClass("hiddenInfo");


  }
  else{
    $(".tooltipOverlay").addClass("hiddenInfo");
  }
}


function getCharSheet(){
  document.getElementById("charOverlay").style.display = "block";
  if(!$("#activeSheet").html()){
    charSheetAesthetics();
  };
}
function bannerShortCut(){
  charSheetAttacks();
  getCharSheet();
}

function exitSheet(){
  softReset();
  document.getElementById("charOverlay").style.display = "none";
}
//--------------------------------------------------------------------------------

//Gem Organization (trayslots)
//--------------------------------------------------------------------------------
function displayTraySlots(){

  let gemList=JSON.parse(localStorage.getItem("gemList"));
  let buffTrayNum=JSON.parse(localStorage.getItem("buffTrayNum"));
  let nerfTrayNum=JSON.parse(localStorage.getItem("nerfTrayNum"));

  let buffTray=JSON.parse(localStorage.getItem("buffTrays"))[buffTrayNum][1];
  let buffTrayName=JSON.parse(localStorage.getItem("buffTrays"))[buffTrayNum][0];


  let nerfTray=JSON.parse(localStorage.getItem("nerfTrays"))[nerfTrayNum][1];
  let nerfTrayName=JSON.parse(localStorage.getItem("nerfTrays"))[nerfTrayNum][0];


  let currentGem;
  let trayCode;

  //loops 5 times, creating somewhere between 5 filled slots or 5 empty slots depending on how many gems are saved in the currently selected slot
  for (let i=0;i<5;i++){


    currentGem= findObjectByID(buffTray.shift(), gemList);
    if (currentGem == false){
      trayCode=``;

      $("#buff"+(i+1)).html(trayCode);
    }
    else{
      trayCode=`<div draggable="true" ondragstart="drag(event)" id=${currentGem.id +"wrapper"} class="wrapper">
                    <img  draggable="false" class="itemImage" id=${currentGem.id} src=${currentGem.img}  style="height:100%; width:100%; object-fit:fill">
                    <div class="imageShadow" data-held-img="${currentGem.id}"></div>
                </div>`;

      $("#buff"+(i+1)).html(trayCode);
    }

    currentGem=findObjectByID(nerfTray.shift(), gemList);
    if (currentGem == false){
      trayCode=``;

      $("#nerf"+(i+1)).html(trayCode);
    }
    else{
      trayCode=`<div draggable="true" ondragstart="drag(event)" id=${currentGem.id +"wrapper"} class="wrapper">
                    <img  draggable="false" class="itemImage" id=${currentGem.id} src=${currentGem.img}  style="height:100%; width:100%; object-fit:fill">
                    <div class="imageShadow" data-held-img="${currentGem.id}"></div>
                </div>`

      $("#nerf"+(i+1)).html(trayCode);
    }
  }

  $("#buffTrayNameForm").val(`${buffTrayName}`);
  $("#nerfTrayNameForm").val(`${nerfTrayName}`);

}
function trayChange(event){
  savePositions();

  let changes=event.data;
  let buffTrayNum=parseInt(JSON.parse(localStorage.getItem("buffTrayNum")));
  let nerfTrayNum=parseInt(JSON.parse(localStorage.getItem("nerfTrayNum")));

  switch (event.data.trayCalled){

    case "buff":
      buffTrayNum+=changes.trayShift;

      if (buffTrayNum>4){
        buffTrayNum=0;
      }
      else if (buffTrayNum<0){
        buffTrayNum=4;
      }
      localStorage.setItem("buffTrayNum", JSON.stringify(buffTrayNum));
    break;

    case "nerf":
      nerfTrayNum+=changes.trayShift;
      if (nerfTrayNum>4){
        nerfTrayNum=0;
      }
      else if (nerfTrayNum<0){
        nerfTrayNum=4;
      }
      localStorage.setItem("nerfTrayNum", JSON.stringify(nerfTrayNum));
      break;

    default:
      console.log("something went wrong with trayChange(), can't tell if altering buff or nerf tray");
      break;
  }


  displayTraySlots();
}
function savePositions(){

  let buffTrayNum=JSON.parse(localStorage.getItem('buffTrayNum'));
  let nerfTrayNum=JSON.parse(localStorage.getItem('nerfTrayNum'));

  let buffTrays=JSON.parse(localStorage.getItem('buffTrays'));
  let nerfTrays=JSON.parse(localStorage.getItem('nerfTrays'));

  let newBuffTray=[];
  let newNerfTray=[];

  //the below line of code is a little nauseating to look at, apologies.
  //it first targets an element with a numbered id, find its child, finds ITS child, gets that child's id (this grandchild should be an object)
  // and THEN converts it into an integer since it comes down as a string
  for (let i=0;i<5;i++){
    if ($("#buff"+(i+1)).children().length > 0){
      newBuffTray.push(parseInt($("#buff"+(i+1)).children().children()[0].id));
    }
    if ($("#nerf"+(i+1))[0]["children"].length > 0){
      newNerfTray.push(parseInt($("#nerf"+(i+1)).children().children()[0].id));
    }

  }

  buffTrays[buffTrayNum][1]=newBuffTray;
  nerfTrays[nerfTrayNum][1]=newNerfTray;


  localStorage.setItem("buffTrays", JSON.stringify(buffTrays));
  localStorage.setItem("nerfTrays", JSON.stringify(nerfTrays));

  updateActive();


}
function updateActive(){
  let buffTrays=JSON.parse(localStorage.getItem("buffTrays"));
  let nerfTrays=JSON.parse(localStorage.getItem("nerfTrays"));
  let activeGems=[];

  for (let i=0; i<5; i++){
    activeGems.push(...buffTrays[i][1]);
    activeGems.push(...nerfTrays[i][1]);
  }

  localStorage.setItem("activeGems", JSON.stringify(activeGems));

}
function trayNameChange(event){
  // https://discourse.wicg.io/t/auto-sizing-text-to-fit-container/1053/7
  let id=event.target.id;
  let newName= event.target.value;

  let buffTrayNum;
  let buffTrays;

  let nerfTrayNum;
  let nerfTrays;

  if (id=="buffTrayNameForm"){
    buffTrayNum=JSON.parse(localStorage.getItem("buffTrayNum"));
    buffTrays=JSON.parse(localStorage.getItem("buffTrays"));
    buffTrays[buffTrayNum][0]=newName;
    localStorage.setItem("buffTrays", JSON.stringify(buffTrays));
  }
  else if (id=="nerfTrayNameForm"){
    nerfTrayNum=JSON.parse(localStorage.getItem("nerfTrayNum"));
    nerfTrays=JSON.parse(localStorage.getItem("nerfTrays"));
    nerfTrays[nerfTrayNum][0]=newName;
    localStorage.setItem("nerfTrays", JSON.stringify(nerfTrays));
  }
  else{
    console.log("error occured in trayNameChange.  Could not determine which tray name (buff/nerf) was being changed.");
  }



}
//--------------------------------------------------------------------------------

//Calculate and display attack modifier for display preview, the dice roller, etc.
//--------------------------------------------------------------------------------

function displayMod(){
  $("#submitConditionals").removeClass("shimmering");
  let chosen=JSON.parse(localStorage.getItem("selectedAttack"));
  let atkList=JSON.parse(localStorage.getItem("atkList"));
  let chosenObject= findObjectByID(chosen, atkList);
  let atkStat;
  let damStat;

  let miscMod=parseInt(JSON.parse(localStorage.getItem("miscMod")));
  let modifier=0;
  let playerStats=JSON.parse(localStorage.getItem("playerStats"));
  let gemEffects;
  let conditionalEffects;

  modifier+=miscMod;
  gemEffects=getGemMods();
  conEffects=conditionalUpdate();
  console.log(gemEffects);
  console.log(conEffects);

  if (gemEffects && conEffects){

    for (x in gemEffects){

      if (x!="Conditionals"){

          if (x=="Untyped"){
            if(conEffects.Untyped.varAtk.length){
              gemEffects[x]["varAtk"].push(...conEffects.Untyped.varAtk);
            }
            if(conEffects.Untyped.varDam.length){
              gemEffects[x]["varDam"].push(...conEffects.Untyped.varDam);
            }

            gemEffects[x]["staticAtk"]+=conEffects[x]["staticAtk"];

            gemEffects[x]["staticDam"]+=conEffects[x]["staticDam"];

            for (y in gemEffects[x]["statChanges"]){
             gemEffects[x]["statChanges"][y]+=conEffects[x]["statChanges"][y];
            }

          }

          if (x=="Circumstance"){
            gemEffects[x]["staticAtk"]+=conEffects[x]["staticAtk"];

            gemEffects[x]["staticDam"]+=conEffects[x]["staticDam"];

            for (y in gemEffects[x]["statChanges"]){
             gemEffects[x]["statChanges"][y]+=conEffects[x]["statChanges"][y];
            }
          }

          if (x!="Circumstance" && x!="Untyped"){
            if (conEffects[x]){
              if(gemEffects[x]["staticAtk"]<conEffects[x]["staticAtk"]){
                gemEffects[x]["staticAtk"]=conEffects[x]["staticAtk"];
              }

              if(gemEffects[x]["staticDam"]<conEffects[x]["staticDam"]){
                gemEffects[x]["staticDam"]=conEffects[x]["staticDam"];
              }
              for (y in gemEffects[x]["statChanges"]){
                if (gemEffects[x]["statChanges"][y]<conEffects[x]["statChanges"][y]){
                  gemEffects[x]["statChanges"][y]=conEffects[x]["statChanges"][y];
                }
              }
            }
          }
      }
    }
    for (x in conEffects){
      if (!gemEffects[x]){
        gemEffects[x]=conEffects[x];

      }
    }
  }



  if (gemEffects){

    for (x in gemEffects){

      if (x!="Conditionals"){

        playerStats.str+=parseInt(gemEffects[x]["statChanges"]["str"]);
        playerStats.dex+=parseInt(gemEffects[x]["statChanges"]["dex"]);
        playerStats.con+=parseInt(gemEffects[x]["statChanges"]["con"]);
        playerStats.wis+=parseInt(gemEffects[x]["statChanges"]["wis"]);
        playerStats.int+=parseInt(gemEffects[x]["statChanges"]["int"]);
        playerStats.cha+=parseInt(gemEffects[x]["statChanges"]["cha"]);

        modifier+=parseInt(gemEffects[x]['staticAtk']);
      }

    }



  }


  switch(chosenObject.atkStat){
    case "Strength":
      atkStat=playerStats.str;
      break;

    case "Dexterity":
      atkStat=playerStats.dex;
      break;

    case "Constitution":
      atkStat=playerStats.con;
      break;

    case "Intelligence":
      atkStat=playerStats.int;
      break;

    case "Wisdom":
      atkStat=playerStats.wis;
      break;

    case "Charisma":
      atkStat=playerStats.cha;
      break;

    default:
      console.log("something went wrong in the atk Switch in displayMod");
      console.log(chosenObject.atkStat);
      break;
  }

  switch(chosenObject.damStat){
    case "Strength":
      damStat=playerStats.str;
      break;

    case "Dexterity":
      damStat=playerStats.dex;
      break;

    case "Constitution":
      damStat=playerStats.con;
      break;

    case "Intelligence":
      damStat=playerStats.int;
      break;

    case "Wisdom":
      damStat=playerStats.wis;
      break;

    case "Charisma":
      damStat=playerStats.cha;
      break;

    default:
      console.log("something went wrong in the dam Switch in getRoll");
      console.log(chosenObject.damStat);
      console.log(chosenObject);
      break;
  }

  //checks player's BAB and player's str Modifier
  modifier+=playerStats.bab;
  modifier+= Math.floor((atkStat-10)/2);

  //once the modifier's math is complete we check if it's positive or negative to decorate it with a + or - sign then
  if (modifier>=0){
    modifier="+"+modifier;
  }

  //next we append a string of the various variable Effects
  //dynamically create a string displaying mod bonuses

  if (gemEffects){
      if(gemEffects.Untyped.varAtk.length){
        modifier+=" + ( ";
        gemEffects.Untyped.varAtk.forEach(function(varyArray){
          if(varyArray[0].match(/^\d/)){
            varyArray=("+"+varyArray);
          }
          modifier+=`${varyArray} `;
        });
        modifier+=")";
      }

  }

    modifier="Your Attack Bonus: "+modifier;
    $("#modInfo").html(modifier);

}
function getGemMods(){
  let activeGems = JSON.parse(localStorage.getItem("activeGems"));
  let gemList= JSON.parse(localStorage.getItem("gemList"));

  let staticGems=[];
  let varGems=[];
  let currentGem;

  let returnedInfo={Untyped:{staticAtk:0,
                            staticDam:0,
                            varAtk:[],
                            varDam:[],
                            statChanges:{str:0, dex:0, con:0, wis:0, int:0, cha:0},},
                  Circumstance:{staticAtk:0,
                                staticDam:0,
                                statChanges:{str:0, dex:0, con:0, wis:0, int:0, cha:0},},
                  Conditionals:[],};

  if (activeGems.length==0){
    return false;
  }

  for (x in activeGems){
    currentGem=findObjectByID(activeGems[x], gemList);
    switch (currentGem.typeEntries){
      case "conditional":
        returnedInfo.Conditionals.push(currentGem);
        break;

      case "variable":
        varGems.push(currentGem);
        break;

      case "static":
        staticGems.push(currentGem);
        break;
    }
  }



  if (varGems.length){

    returnedInfo=unpackStaticChanges(returnedInfo, varGems);

    returnedInfo=unpackVariableChanges(returnedInfo, varGems);

  }

  if (staticGems.length){
    returnedInfo=unpackStaticChanges(returnedInfo, staticGems);

  }

  return returnedInfo;
}

function displayConditionals() {
  $("#updateConditionalsBtn").removeClass("shimmering");
  savePositions();
  displayMod();
  let occupied;
  let formText="";
  let conditionals=getGemMods()["Conditionals"];


  //finally we create a form for the conditionalGems
  //create html for a form made from the conditionals
  if (conditionals){
    if (conditionals.length){
      $("#submitConditionals").removeClass("hidden");
      occupied=0;
      conditionals.forEach(function(conGem){
        //we open a new div row
        if (occupied==0){
          formText+=`<div class="row ml-1">`;
        }
        //we fill in the html for a new conditional
        //we don't currently use the conditional tet as it's to bulky.  However we may implement a tooltip feature in the future
        formText+=`<div class="form-check col">
                      <input class="form-check-input" type="checkbox" name="conditional${conGem.id}" "id="conditional${conGem.id}" value="${conGem.id}">
                      <label class="form-check-label" for="conditional${conGem.id}">${decodeURIComponent(conGem.name)}</label>
                    </div>`;
        occupied+=1;
        //if a div is 'full' we close it and reset occupation so we'll make a new one at the start of the next loop
        if (occupied==2){
          formText+=`</div>`;
          occupied=0;
        }
      });
        //if we leave the forEach loop and occupied is equal to 1 that means we never closed off one of our divs so we'll do that now
      if (occupied==1){
        formText+=`</div>`;
      }
    }
    else{
      $("#submitConditionals").addClass("hidden");
    }
  }
  else{
    $("#submitConditionals").addClass("hidden");
  }


     //set the html of #modInfo & #conditionalForm

  $("#conditionalForm").html(formText);
}
function conditionalUpdate(){

  let returnedInfo={Untyped:{staticAtk:0,
                            staticDam:0,
                            varAtk:[],
                            varDam:[],
                            statChanges:{str:0, dex:0, con:0, wis:0, int:0, cha:0},},
                  Circumstance:{staticAtk:0,
                                staticDam:0,
                                statChanges:{str:0, dex:0, con:0, wis:0, int:0, cha:0},},};


  let gemList=JSON.parse(localStorage.getItem("gemList"));
  let data= $("#targetConditionalForm").serialize().split("&");
  let newData=[];
  let activeCons=[];


  if (data==false){
    return false;
  }
  data.forEach(function(check){
    newData.push(check.substring(check.indexOf("=")+1));
  });

  //loops through ids of active Conditionals
  //uses the id to pull their gem's stats from the master gemList in the form of an object
  //pushes the object into an array for our use
  newData.forEach(function(conID){
    activeCons.push(findObjectByID(conID, gemList));
  });


  returnedInfo=unpackStaticChanges(returnedInfo, activeCons);
  returnedInfo=unpackVariableChanges(returnedInfo, activeCons);

  return returnedInfo;

}
function unpackStaticChanges(returnedInfo, gems){
  for (x in gems){
    //a special case
    if (gems[x].staticType=="Untyped" || gems[x].staticType=="Circumstance"){
      returnedInfo[gems[x].staticType].staticAtk+=parseInt(gems[x].modifier);
    }
    //we've encountered this case before
    else if (returnedInfo.hasOwnProperty(gems[x].staticType)){
      if(parseInt(returnedInfo[gems[x].staticType].staticAtk) < parseInt(gems[x].modifier)){
        returnedInfo[gems[x].staticType].staticAtk=parseInt(gems[x].modifier);}
    }
    //we need to add a new property for this case
    else{
      returnedInfo[gems[x].staticType]={staticAtk:gems[x].modifier,staticDam:0,statChanges:{str:0, dex:0, con:0, wis:0, int:0, cha:0}};
      }

    //a special case
    if (gems[x].dmgType=="Untyped" || gems[x].dmgType=="Circumstance"){
      returnedInfo[gems[x].dmgType].staticAtk+=parseInt(gems[x].damStaticEntry);
    }
    //we've encountered this case before
    else if (returnedInfo.hasOwnProperty(gems[x].dmgType)){
      if(parseInt(returnedInfo[gems[x].dmgType].staticDam) < parseInt(gems[x].damStaticEntry)){
        returnedInfo[gems[x].dmgType].staticAtk=parseInt(gems[x].damStaticEntry);}
    }
    //we need to add a new property for this case
    else{
      returnedInfo[gems[x].dmgType]={staticAtk:0,staticDam:gems[x].damStaticEntry,statChanges:{str:0, dex:0, con:0, wis:0, int:0, cha:0}};
      }

    //a special case
    if (gems[x].ablScoreType=="Untyped" || gems[x].ablScoreType=="Circumstance"){
      returnedInfo[gems[x].ablScoreType].statChanges.str+=parseInt(gems[x].strChangeEntry);
      returnedInfo[gems[x].ablScoreType].statChanges.dex+=parseInt(gems[x].dexChangeEntry);
      returnedInfo[gems[x].ablScoreType].statChanges.con+=parseInt(gems[x].conChangeEntry);
      returnedInfo[gems[x].ablScoreType].statChanges.wis+=parseInt(gems[x].wisChangeEntry);
      returnedInfo[gems[x].ablScoreType].statChanges.int+=parseInt(gems[x].intChangeEntry);
      returnedInfo[gems[x].ablScoreType].statChanges.cha+=parseInt(gems[x].chaChangeEntry);
    }
    //we've encountered this case before
    else if (returnedInfo.hasOwnProperty(gems[x].ablScoreType)){
      if(returnedInfo[gems[x].ablScoreType].statChanges.str<parseInt(gems[x].strChangeEntry)){
        returnedInfo[gems[x].ablScoreType].statChanges.str=parseInt(gems[x].strChangeEntry);
      }
      if(returnedInfo[gems[x].ablScoreType].statChanges.dex<parseInt(gems[x].dexChangeEntry)){
        returnedInfo[gems[x].ablScoreType].statChanges.dex=parseInt(gems[x].dexChangeEntry);
      }
      if(returnedInfo[gems[x].ablScoreType].statChanges.con<parseInt(gems[x].conChangeEntry)){
        returnedInfo[gems[x].ablScoreType].statChanges.con=parseInt(gems[x].conChangeEntry);
      }
      if(returnedInfo[gems[x].ablScoreType].statChanges.wis<parseInt(gems[x].wisChangeEntry)){
        returnedInfo[gems[x].ablScoreType].statChanges.wis=parseInt(gems[x].wisChangeEntry);
      }
      if(returnedInfo[gems[x].ablScoreType].statChanges.int<parseInt(gems[x].intChangeEntry)){
        returnedInfo[gems[x].ablScoreType].statChanges.int=parseInt(gems[x].intChangeEntry);
      }
      if(returnedInfo[gems[x].ablScoreType].statChanges.cha<parseInt(gems[x].chaChangeEntry)){
        returnedInfo[gems[x].ablScoreType].statChanges.cha=parseInt(gems[x].chaChangeEntry);
      }
    }
    //we need to add a new property for this case
    else{
      returnedInfo[gems[x].ablScoreType]={staticAtk:0,staticDam:0,
        statChanges:{str:gems[x].strChangeEntry, dex:gems[x].dexChangeEntry, con:gems[x].conChangeEntry, wis:gems[x].wisChangeEntry, int:gems[x].intChangeEntry, cha:gems[x].chaChangeEntry}};
      }

  }

  return returnedInfo;




}
function unpackVariableChanges(returnedInfo, gems){
  for (x in gems){
    if (gems[x].variableToHit){
      returnedInfo.Untyped.varAtk.push(gems[x].variableToHit);
    }
    if (gems[x].damDiceEntry){
      returnedInfo.Untyped.varDam.push(gems[x].damDiceEntry);
    }
  }

  return returnedInfo;
}

  //calculates and displays a quick and dirty "misc" modifier for on the fly changes
function displayMiscMod(){
  let miscMod=parseInt(JSON.parse(localStorage.getItem("miscMod")));
  $("#currMisc").html(miscMod);
}
function changeMiscMod(event){
  $("#updateConditionalsBtn").addClass("shimmering");
  let miscMod=parseInt(JSON.parse(localStorage.getItem("miscMod")));
  miscMod+=event.data.modShift;

  localStorage.setItem("miscMod",JSON.stringify(miscMod));
  $("#currMisc").html(miscMod);
}

function getRoll(){
  let chosen=JSON.parse(localStorage.getItem("selectedAttack"));
  let atkList=JSON.parse(localStorage.getItem("atkList"));
  let chosenObject= findObjectByID(chosen, atkList);
  let atkStat;
  let damStat;


  let castDie=dieRoll(20);
  let finResult=castDie;
  let dmgDisplay;

  let miscMod=parseInt(JSON.parse(localStorage.getItem("miscMod")));
  let playerStats=JSON.parse(localStorage.getItem("playerStats"));
  let conEffects=conditionalUpdate();
  let gemEffects=getGemMods();
  let splitDie;

  let totalDmg=0;

  finResult+=miscMod;


  if (gemEffects && conEffects){
    for (x in gemEffects){
      if (x!="Conditionals"){
          if (x=="Untyped"){
            if(conEffects.Untyped.varAtk.length){
              gemEffects[x]["varAtk"].push(...conEffects.Untyped.varAtk);
            }
            if(conEffects.Untyped.varDam.length){
              gemEffects[x]["varDam"].push(...conEffects.Untyped.varDam);
            }
            gemEffects[x]["staticAtk"]+=conEffects[x]["staticAtk"];
            gemEffects[x]["staticDam"]+=conEffects[x]["staticDam"];

            for (y in gemEffects[x]["statChanges"]){
             gemEffects[x]["statChanges"][y]+=conEffects[x]["statChanges"][y];
            }
          }
          if (x=="Circumstance"){
            gemEffects[x]["staticAtk"]+=conEffects[x]["staticAtk"];
            gemEffects[x]["staticDam"]+=conEffects[x]["staticDam"];
            for (y in gemEffects[x]["statChanges"]){
             gemEffects[x]["statChanges"][y]+=conEffects[x]["statChanges"][y];
            }
          }
            if (x!="Circumstance" && x!="Untyped"){
                      if (conEffects[x]){
                        if(gemEffects[x]["staticAtk"]<conEffects[x]["staticAtk"]){
                          gemEffects[x]["staticAtk"]=conEffects[x]["staticAtk"];
                        }

                        if(gemEffects[x]["staticDam"]<conEffects[x]["staticDam"]){
                          gemEffects[x]["staticDam"]=conEffects[x]["staticDam"];
                        }
                        for (y in gemEffects[x]["statChanges"]){
                          if (gemEffects[x]["statChanges"][y]<conEffects[x]["statChanges"][y]){
                            gemEffects[x]["statChanges"][y]=conEffects[x]["statChanges"][y];
                          }
                        }
                      }
                    }
                }
              }
              for (x in conEffects){
                if (!gemEffects[x]){
                  gemEffects[x]=conEffects[x];

                }
              }
            }
    //       if (x!="Circumstance" && x!="Untyped"){
    //         if(gemEffects[x]["staticAtk"]<conEffects[x]["staticAtk"]){
    //           gemEffects[x]["staticAtk"]=conEffects[x]["staticAtk"];
    //         }
    //         if(gemEffects[x]["staticDam"]<conEffects[x]["staticDam"]){
    //           gemEffects[x]["staticDam"]=conEffects[x]["staticDam"];
    //         }
    //         for (y in gemEffects[x]["statChanges"]){
    //           if (gemEffects[x]["statChanges"][y]<conEffects[x]["statChanges"][y]){
    //             gemEffects[x]["statChanges"][y]=conEffects[x]["statChanges"][y];
    //           }
    //         }
    //       }
    //   }
    // }
  // }


  if (gemEffects){
    for (x in gemEffects){
      if (x!="Conditionals"){
        playerStats.str+=parseInt(gemEffects[x]["statChanges"]["str"]);
        playerStats.dex+=parseInt(gemEffects[x]["statChanges"]["dex"]);
        playerStats.con+=parseInt(gemEffects[x]["statChanges"]["con"]);
        playerStats.wis+=parseInt(gemEffects[x]["statChanges"]["wis"]);
        playerStats.int+=parseInt(gemEffects[x]["statChanges"]["int"]);
        playerStats.cha+=parseInt(gemEffects[x]["statChanges"]["cha"]);
        finResult+=parseInt(gemEffects[x]['staticAtk']);
        totalDmg+=parseInt(gemEffects[x]['staticDam']);
      }
    }
  }



  switch(chosenObject.atkStat){
    case "Strength":
      atkStat=playerStats.str;
      break;

    case "Dexterity":
      atkStat=playerStats.dex;
      break;

    case "Constitution":
      atkStat=playerStats.con;
      break;

    case "Intelligence":
      atkStat=playerStats.int;
      break;

    case "Wisdom":
      atkStat=playerStats.wis;
      break;

    case "Charisma":
      atkStat=playerStats.cha;
      break;

    default:
      console.log("something went wrong in the Switch in getRoll");
      break;
  }

  switch(chosenObject.damStat){
    case "Strength":
      damStat=playerStats.str;
      break;

    case "Dexterity":
      damStat=playerStats.dex;
      break;

    case "Constitution":
      damStat=playerStats.con;
      break;

    case "Intelligence":
      damStat=playerStats.int;
      break;

    case "Wisdom":
      damStat=playerStats.wis;
      break;

    case "Charisma":
      damStat=playerStats.cha;
      break;

    default:
      console.log("something went wrong in the Switch in getRoll");
      break;
  }


  //checks player's BAB and player's str Modifier
  //In future versions we'll have a Switch to swap between what stats we're using
  finResult+=playerStats.bab;
  finResult+= Math.floor((atkStat-10)/2);
  totalDmg+=Math.floor((damStat-10)/2);


  //next we randomly calculate the value of all the explicitly variable mods
  dmgDisplay=totalDmg;
  if (gemEffects){

      if (gemEffects.Untyped.varAtk){
        gemEffects.Untyped.varAtk.forEach(function(die){
          splitDie=die.split("d");
          for (x in splitDie){
            splitDie[x]=parseInt(splitDie[x]);
          }
          if (splitDie[0]<0){
            splitDie[0]=splitDie[0]*(-1);
            for (let x=0;x<splitDie[0];x++){
              finResult-=dieRoll(splitDie[1]);
            }
          }
          else {
            for (let x=0;x<splitDie[0];x++){
              finResult+=dieRoll(splitDie[1]);
            }
          }
        });
      }

      if (gemEffects.Untyped.varDam){
        gemEffects.Untyped.varDam.forEach(function(die){
          dmgDisplay+=` +${die}`;
          splitDie=die.split("d");
          for (x in splitDie){
            splitDie[x]=parseInt(splitDie[x]);
          }
          if (splitDie[0]<0){
            splitDie[0]=splitDie[0]*(-1);
            for (let x=0;x<splitDie[0];x++){
              totalDmg-=dieRoll(splitDie[1]);
            }
          }
          else {
            for (let x=0;x<splitDie[0];x++){
              totalDmg+=dieRoll(splitDie[1]);
            }
          }
        });
      }

  }




  finResult=`Result: ${finResult}`;

  $("#resultNum").html(finResult);
  $("#dieNum").html("D20 Roll:"+castDie);
  $("#dmgResult").html(`Damage: ${totalDmg} [${dmgDisplay}]`);

}

//----------------------------------------------------------------------------

//Allows user to create gems via a form overlayed onto the screen
function buildAGemOverlay(){

  $("#buildAGemForm").trigger("reset");

  document.getElementById("gemOverlay").style.display = "block";

}
function checkChange(){
  //check what changed
  $(".formChangers").change(function(e){
    switch (e.target.value){

      case "static":
        //show static mod
        $("#staticSegment").removeClass("hidden");
        $("#modEntry").attr("required", "");
        //hide amount of dice/size of dice entries
        $("#variableSegment").addClass("hidden");
        $("#variableToHit").removeAttr("required");
        //hide triggering condition
        $("#conTriggerSegment").addClass("hidden");
        break;
      case "variable":

        //hide static mod
        $("#staticSegment").addClass("hidden");
        $("#modEntry").removeAttr("required");
        //show variable dice entry(ies)
        $("#variableSegment").removeClass("hidden");
        $("#variableToHit").attr("required", "");
        //hide triggering condition
        $("#conTriggerSegment").addClass("hidden");
        break;
      case "conditional":
        //show static mod
        $("#staticSegment").removeClass("hidden");
        $("#modEntry").removeAttr("required");
        //show variable dice entry(ies)
        $("#variableSegment").removeClass("hidden");
        $("#variableToHit").removeAttr("required");
        //show triggering condition
        $("#conTriggerSegment").removeClass("hidden");
        break;
    }

  })
}
function toggleForm(){
  // This function handles our transition from hiding and showing a part of our "create a gem" form
  //  First we add a class to our dropdown widget to make it flip over
  // After that we toggle a class in the element we want to hide that will hide it from the user
  // Next we test whether we're showing or hiding elements by checking the html of an element we change whenever we go from one mode to the other
  // finally we remove or return the element to the standard tabindex

  $("#gemDropdown").toggleClass("flipped");
  $("#hiddenForm").toggleClass("hidden");

  switch($("#moreOrLess").html()){
    case "More":
      $("#moreOrLess").html("Less");
      $( ".toggleTab" ).prop( "tabIndex", 0);
      break;
    case "Less":
      $("#moreOrLess").html("More");
      $( ".toggleTab" ).prop( "tabIndex", -1 );
      break;
    default:
      console.log("for some reason the toggleForm function isn't finding either the text Less OR More");
      break;

  }
}
function exitForm(){
  $("#buildAGemForm").trigger("reset");
  document.getElementById("gemOverlay").style.display = "none";
}

function newGemSubmit(e){


  //this takes our form data and turns it into a nice object!
  let data=$(e.target).serialize().split("&");

  let obj={};
  for(var key in data){
        obj[data[key].split("=")[0]] = data[key].split("=")[1];
    }

  //we need to take all the stat portions of our object and combo them into a single object

  obj.statChanges={
    str:obj.strChangeEntry,
    dex:obj.dexChangeEntry,
    con:obj.conChangeEntry,
    int:obj.intChangeEntry,
    wis:obj.wisChangeEntry,
    cha:obj.chaChangeEntry,
  };

  // obj.varDiceQualityEntry=5;
  // obj.varDiceQuantity=2;

  obj=gemFromForm(obj);

  $("#buildAGemForm").trigger("reset");

    // You must return false to prevent the default form behavior
  return false;
}
function gemFromForm(formGem){
  //object is altered to


  let oldKeys=["nameEntry","modEntry",  "descriptionEntry",
              "triggerEntry", "miscEffectsEntry"];  //TODO MORE HERE
  let newKeys=["name", "modifier", "description",
              "conditionTrigger", "miscEffects"];
  //this goes through a process of renaming the form obj into one we can pass onto our gem then passing it back

  formGem=objRename(formGem, oldKeys, newKeys);

  createGem(formGem);

  displayLapidary();
}
//-------------------------------------------------------------


//Handles allowing users to delete gems
function displayTrash(){
  var col=1;
  let setGrid="";
  var row=0;

    //will continue to make rows until there are at LEAST 15, but will continue if there are more gems to set
  setGrid+=`<button class="buttonNegative btn-block" onclick="incinerateTrash()">Incinerate Gems</button>`
  while (row<15){


    setGrid+=`<div class="row itemGridRow">`;
    setGrid+=`<div id=${"trashSlot"+row} class="trashSlot col"  ondrop="drop(event)" ondragover="allowDrop(event)">`;
    setGrid+=`</div>`;
    setGrid+=`</div>`;
    row+=1;
  }
  $("#trashTray").html(setGrid);
}
function incinerateTrash(){

  let gemList=JSON.parse(localStorage.getItem("gemList"));
  let trashPile=[];

  for (let i=0;i<15;i++){
    if ($("#trashSlot"+i).children().length > 0){
      trashPile.push(parseInt($("#trashSlot"+i).children().children()[0].id));
    }
  }


  trashPile.forEach(function(id){
    gemList=(removeObjectByID(id, gemList));

  })


  localStorage.setItem("gemList", JSON.stringify(gemList));
  displayLapidary();
  displayTrash();
  displayTraySlots();
}
//----------------------------------------------------------------------------



//Allows user to store, retrieve and alter basic parameters of different attacks (each with their own set of saved gems)
//----------------------------------------------------------------------------
function charSheetAttacks(){
  let newPage='';
  let atkList=JSON.parse(localStorage.getItem("atkList"));
  atkList.forEach(function(attack){
    newPage+=`<div class="container-fluid mt-4 p-2" style="background-color:#d6c3a4; border-color: #a7834b; border-style: solid; border-radius:5%;">
              <form  onsubmit="event.preventDefault();">
                <label for="selected" class="col-form-label">
                  <input class="checkboxAttackSelect" id="selectAtk${attack.id}" type="checkbox" name="selected" onChange="selectAttack(event)"> :Selected Attack
                </label>
              </form>
            <form id="atkNum${attack.id}" class="needsValidation" onsubmit="event.preventDefault(); setAttack(event)">
                 <div class="form-group row">
                   <div class="col">
                     <label for="atkName" class="col-form-label" >Attack Name:</label>
                     <input type="text" class="form-control"  value="${attack.name}" name="atkName" required>
                   </div>

                 </div>

            <div class="form-group row">
              <div class="col-6">
                <label for="atkStat" class="col-form-label" >To-hit Stat:
                  <select name="atkStat" class="form-control">`;

    switch(attack.atkStat){
      case "Strength":
        newPage+=`<option selected>Strength</option>
        <option>Dexterity</option>
        <option>Constitution</option>
        <option>Wisdom</option>
        <option>Intelligence</option>
        <option>Charisma</option>`;
        break;

      case "Dexterity":
        newPage+=`<option>Strength</option>
        <option selected>Dexterity</option>
        <option>Constitution</option>
        <option>Wisdom</option>
        <option>Intelligence</option>
        <option>Charisma</option>`;
        break;

      case "Constitution":
        newPage+=`<option>Strength</option>
        <option>Dexterity</option>
        <option selected>Constitution</option>
        <option>Wisdom</option>
        <option>Intelligence</option>
        <option>Charisma</option>`;
        break;

      case "Intelligence":
        newPage+=`<option>Strength</option>
        <option>Dexterity</option>
        <option>Constitution</option>
        <option >Wisdom</option>
        <option selected>Intelligence</option>
        <option>Charisma</option>`;
        break;

      case "Wisdom":
        newPage+=`<option>Strength</option>
        <option>Dexterity</option>
        <option>Constitution</option>
        <option selected>Wisdom</option>
        <option >Intelligence</option>
        <option>Charisma</option>`;
        break;

      case "Charisma":
        newPage+=`<option>Strength</option>
        <option>Dexterity</option>
        <option>Constitution</option>
        <option>Wisdom</option>
        <option>Intelligence</option>
        <option selected>Charisma</option>`;
        break;

      default:
        console.log("something went wrong in the Switch in charSheetAttacks");
        break;

    }

    newPage+= `</select>
                </label>
              </div>
              <div class="col-6">
                <label for="damStat" class="col-form-label" >To-dmg Stat:
                  <select name="damStat" class="form-control">`;
    switch(attack.damStat){
      case "Strength":
        newPage+=`<option selected>Strength</option>
        <option>Dexterity</option>
        <option>Constitution</option>
        <option>Wisdom</option>
        <option>Intelligence</option>
        <option>Charisma</option>`;
        break;

      case "Dexterity":
        newPage+=`<option>Strength</option>
        <option selected>Dexterity</option>
        <option>Constitution</option>
        <option>Wisdom</option>
        <option>Intelligence</option>
        <option>Charisma</option>`;
        break;

      case "Constitution":
        newPage+=`<option>Strength</option>
        <option>Dexterity</option>
        <option selected>Constitution</option>
        <option>Wisdom</option>
        <option>Intelligence</option>
        <option>Charisma</option>`;
        break;

      case "Intelligence":
        newPage+=`<option>Strength</option>
        <option>Dexterity</option>
        <option>Constitution</option>
        <option selected>Wisdom</option>
        <option>Intelligence</option>
        <option>Charisma</option>`;
        break;

      case "Wisdom":
        newPage+=`<option>Strength</option>
        <option>Dexterity</option>
        <option>Constitution</option>
        <option>Wisdom</option>
        <option selected>Intelligence</option>
        <option>Charisma</option>`;
        break;

      case "Charisma":
        newPage+=`<option>Strength</option>
        <option>Dexterity</option>
        <option>Constitution</option>
        <option>Wisdom</option>
        <option>Intelligence</option>
        <option selected>Charisma</option>`;
        break;

      default:
        console.log("something went wrong in the Switch in charSheetAttacks");
        break;
                  }
        newPage+=`
                  </select>
                </label>
              </div>
            </div>
            <button class="trayButton darkWoodBtn" type="submit"> Submit Changes</button>
            <button class="trayButton darkWoodBtn deleteAttack" id="delBtn${attack.id}" type="button"> dbl click to delete this attack</button>
            </form>

          </div>

          <hr>`;
  })
  newPage+=`<button class="trayButton darkWoodBtn" onclick="setNewAttack()">Add an attack</button>`;



  $("#activeSheet").html(newPage);
  $(".deleteAttack").dblclick(deleteAttack);
  setSelectedAttack();

}
function setAttack(event){
  let atkList=JSON.parse(localStorage.getItem("atkList"));
  let formArray=$(event.target).serializeArray();
  let atkName=getValueFromSerial("atkName", formArray);
  let atkStat=getValueFromSerial("atkStat", formArray);
  let damStat=getValueFromSerial("damStat", formArray);
  let attack=findObjectByID(event.target.id.substr(6), atkList);

  if(attack){
    attack.name=atkName;
    if (atkStat){
      attack.atkStat=atkStat;
    }
    if (damStat){
      attack.damStat=damStat;
    }
    atkList=removeObjectByID(event.target.id.substr(6), atkList);
    atkList.unshift(attack);

    localStorage.setItem("atkList", JSON.stringify(atkList));
  }
  else{
    console.log("Error occured in Setattack: VarNotFound");
    return;
  }

}
function selectAttack(event){


  let targetID=parseInt(event.target.id.substr(9));
  let selected=parseInt(localStorage.getItem("selectedAttack"));
  if (event.target.checked){
      saveAttack();
      localStorage.setItem("selectedAttack", JSON.stringify(targetID));
      loadAttack();
      setSelectedAttack();
    }
  else{
    if(targetID==selected){
        $(event.target).prop("checked",true);
        alert("Bugs can creep up if you don't have a selected attack.  Instead of removing the checkmark on this one, try adding a checkmark on the attack you DO want to select!");
      }
    }

  }
function setSelectedAttack(){
  let selected=parseInt(JSON.parse(localStorage.getItem("selectedAttack")));

  if (selected){
    $(".checkboxAttackSelect").each(function(){
      if (this.id.substr(9)!=selected){
        $(this).prop("checked", false);

      }
      else if(this.id.substr(9)==selected){
        $(this).prop("checked", true);

      }
      else{
        console.log("there was an error in setSelectedAttack: PL526")
      }
    });
  }
  else{
    console.log("attempted to run setSelectedAttack, however there is no selected attack in storage!");
  }
}

function setNewAttack(){
  let atkTemplate=  JSON.parse(localStorage.getItem("atkTemplate"));
  setAttackID(atkTemplate);
  charSheetAttacks();
}
function setAttackID(attack){
  let atkList=JSON.parse(localStorage.getItem("atkList"));
  //checks if the id of this object is already set (note that this conditional would return as false even if we have an id IF that id is 0 which is a falsey value)
  if (attack.id !== undefined){
    console.log("this gem already has an ID");
    console.log(attack.id);
    return;
  }
  else if (atkList.length==0){
    //would use 0 to start the ids with but 0 would be treated as a falsey value, causing the id to be reset when it shouldn't be if we called setID again for some reason
    attack.id=1;
    atkList.push(attack);
  }
  else{
    let atkArray=[];
    let l=atkList.length;

    for (let i=0; i<l ; i++){
      atkArray.push(atkList[i].id);
    }
    attack.id=Math.max(...atkArray)+1;
    atkList.push(attack);
  }

  localStorage.setItem("atkList",JSON.stringify(atkList));
  return;
}
function deleteAttack(event){
  let selected=JSON.parse(localStorage.getItem("selectedAttack"));
  let atkList=JSON.parse(localStorage.getItem("atkList"));
  if (this.id.substr(6)==selected){
    alert("This is your active attack!  If you want to delete it, select a different attack first.");
    return;
  }
  else{
    atkList=removeObjectByID(this.id.substr(6), atkList);
    localStorage.setItem("atkList", JSON.stringify(atkList));
    charSheetAttacks();
  }

}
//-------------------------------------------------------------

//Allows user to alter basic stats of their character (which apply across different attacks)
//-------------------------------------------------------------
function charSheetStats(){
  let newPage='';
  let playerStats=JSON.parse(localStorage.getItem("playerStats"));

  newPage+=`<form class="needsValidation" id="BABForm" onsubmit="event.preventDefault(); setBAB(event);">
       <div class="form-group row">
         <div class="col-5 offset-1">
           Misc. Statistics: <br>
           <label for="BAB" class="col-form-label" >Base Attack Bonus:</label>
           <input type="number" class="form-control" id="BAB" value="${playerStats.bab}" name="BAB" required>
         <button class="trayButton darkWoodBtn col" type="submit" > Submit </button>
       </div>
     </div>
     </form>
     <hr>
     <form class="needsValidation" id="ablScoresForm" onsubmit="event.preventDefault(); setAblScores(event);">
         <div class="col-4 offset-4">Base Ability Scores:</div>
         <div class="form-group row">

           <div class="col-5 offset-1">

             <label for="strScore">Base Strength</label>
             <input type="number" name="strScore" class="form-control toggleTab" id="strScore" rows="1" value="${playerStats.str}"></input>

             <label for="dexScore">Base Dexterity</label>
             <input type="number" name="dexScore" class="form-control toggleTab" id="dexScore" rows="1" value="${playerStats.dex}"></input>

             <label for="conScore">Base Constitution</label>
             <input type="number" name="conScore" class="form-control toggleTab" id="conScore" rows="1" value="${playerStats.con}"></input>

           </div>

           <div class="col-5">

             <label for="intScore">Base Intelligence</label>
             <input type="number" name="intScore" class="form-control toggleTab" id="intScore" rows="1" value="${playerStats.int}"></input>

             <label for="wisScore">Base Wisdom</label>
             <input type="number" name="wisScore" class="form-control toggleTab" id="wisScore" rows="1" value="${playerStats.wis}"></input>

             <label for="chaScore">Base Charisma</label>
             <input type="number" name="chaScore" class="form-control toggleTab" id="chaScore" rows="1" value="${playerStats.cha}"></input>

           </div>

         </div>
         <button class="trayButton darkWoodBtn col-3 offset-3" type="submit"> Submit </button>
       </form>`;

  $("#activeSheet").html(newPage);
  displayMod();
}
function setAblScores(event){
  let playerStats=JSON.parse(localStorage.getItem("playerStats"));
  let name=$("#ablScoresForm").serializeArray();
  name.forEach(function(pair){
    switch(pair.name){
      case "strScore":
        playerStats.str=parseInt(pair.value);
        break;

      case "dexScore":
        playerStats.dex=parseInt(pair.value);
        break;

      case "conScore":
        playerStats.con=parseInt(pair.value);
        break;

      case "intScore":
        playerStats.int=parseInt(pair.value);
        break;

      case "wisScore":
        playerStats.wis=parseInt(pair.value);
        break;

      case "chaScore":
        playerStats.cha=parseInt(pair.value);
        break;

      default:
        console.log("erm, something broke in setAblScores: AX456");
        break;

    }
  })

  localStorage.setItem("playerStats", JSON.stringify(playerStats));
}
function setBAB(event){
  let playerStats=JSON.parse(localStorage.getItem("playerStats"));
  let bab=$("#BABForm").serializeArray()[0].value;
  playerStats.bab=parseInt(bab);
  localStorage.setItem("playerStats", JSON.stringify(playerStats));
}
//-------------------------------------------------------------

//Allows user to change aesthetic parts of their character, such as their portrait and their name
//-------------------------------------------------------------
function charSheetAesthetics(){
  let newPage='';
  let customArt=JSON.parse(localStorage.getItem("customAvatar"));
  let name=JSON.parse(localStorage.getItem("characterName"));

  let sourceList=["https://res.cloudinary.com/metaverse/image/upload/v1537225996/DiceTray/charArt/Sprite_male_mage_A_curious01.png",
                  "https://res.cloudinary.com/metaverse/image/upload/v1537225985/DiceTray/charArt/Sprite_Female_Mage_Smirk01.png",
                  "https://res.cloudinary.com/metaverse/image/upload/v1537223686/DiceTray/charArt/vamp.png",
                  "https://res.cloudinary.com/metaverse/image/upload/v1537235964/DiceTray/charArt/redCourtDame.png",
                  "https://res.cloudinary.com/metaverse/image/upload/v1537223687/DiceTray/charArt/guy1.png",
                  "https://res.cloudinary.com/metaverse/image/upload/v1537235968/DiceTray/charArt/whiteMage.png",
                  "https://res.cloudinary.com/metaverse/image/upload/v1537235951/DiceTray/charArt/soHANDSOME.png",
                  "https://res.cloudinary.com/metaverse/image/upload/v1537213424/DiceTray/charArt/cellonyPortrait.png"];

  newPage+=`<div><div class="col-4 offset-4 mt-4">
            <form class="needsValidation" id="charNameForm" onsubmit="event.preventDefault(); setName(event);">
              <div class="form-group row">
                <div class="col">
                  <label for="charNameEntry" class="col-form-label" >Char Name:</label>
                  <input type="text" class="form-control" id="charNameEntry" value="${name}" name="charNameEntry" required>
                  <button class="trayButton darkWoodBtn col" type="submit"> Submit </button>
                </div>
              </div>
            </form>
        </div></div>
        <hr>`;

  newPage+=`<p style="text-align: center;">Choose your Character's art:</p>
  <form class="needsValidation" id="artEntryForm" onsubmit="event.preventDefault(); artEntry(event);">
    <div class="form-group row">
      <div class="col-4 offset-4">
        <label for="artLinkEntry" class="col-form-label" >Link to your own art:</label>
        <input type="text" class="form-control" id="artLinkEntry" placeholder="Place valid image link here" name="artLinkEntry" required>
        <button class="trayButton darkWoodBtn col" type="submit"> Submit </button>
      </div>
    </div>
  </form>
  <div class="container" style="margin-bottom:5vh;  width:30vw;">

    <div class="row no-gutters">
      <div id="customArtSlot" class="col-4 charSquare" style="height:10vw;">
        <img class="charImg imgChoice" id="playerChosenArt" src="${customArt}" style="height:100%; width:100%;" alt="User-linked Image">
      </div>`;

    sourceList.forEach(function(source){
      newPage+= `<div class="col-4 charSquare" style="height:10vw;">
                    <img class="charImg imgChoice" src=${source} style="height:100%; width:100%;" alt="Responsive image">
                  </div>`
      });

    newPage+=`</div>
          </div>`;
    $("#activeSheet").html(newPage);
    $(".charImg").click(chooseNewAvatar);


}
function setName(event){
  let name=$("#charNameForm").serializeArray()[0].value;
  localStorage.setItem("characterName", JSON.stringify(name));
  displayPlayerAvatar();
}
function chooseNewAvatar(event){
  let chosenAvatar=event.target.src;
  localStorage.setItem("playerAvatar", JSON.stringify(chosenAvatar));
  displayPlayerAvatar();
}
function artEntry(){
  let artSubmission=$("#artEntryForm").serializeArray()[0].value;
  $('#playerChosenArt').attr("src", artSubmission);
  localStorage.setItem("customAvatar", JSON.stringify(artSubmission));

}
//-------------------------------------------------------------

//Allows user to view the different artists and sources whose contributions to the creative commons helped make this project possible
//-----and to whose creativity and hard work I'm truly grateful.
//-------------------------------------------------------------------------------
function charSheetCredits(){
  let newPage='';


  newPage+=`<div class="row" id="creditsTitle">
    <div class="col-3" style="font-size:5vw;">Credits:</div>
  </div>
  <hr>
  Note: artist links open in a new tab.  Art has been resized from the originals to fit their current use.  (If you would like your art to be removed please contact me at: Ssonson@alumni.nd.edu)

  <div class="row" id="artTitle">
    <div class="col-3" style="font-size:2vw;">Character Art:</div>
  </div>
  <hr>

  <div class="row" id="artCredits">
      <ul class="col-11 offset-1">
        <li><img class="charSquare" src="https://res.cloudinary.com/metaverse/image/upload/v1537235968/DiceTray/charArt/whiteMage.png" style="height:5vw; width:5vw;" alt="White Mage"> Created by: <a href="https://lemmasoft.renai.us/forums/viewtopic.php?f=52&t=51023" rel="noopener noreferrer" target="_blank">RlinZ</a></li>
        <li><img class="charSquare" src="https://res.cloudinary.com/metaverse/image/upload/v1537235964/DiceTray/charArt/redCourtDame.png" style="height:5vw; width:5vw;" alt="Red Dame"> Created by: <a href="https://lemmasoft.renai.us/forums/viewtopic.php?f=52&t=49900&p=485362&hilit=sprite#p485362" rel="noopener noreferrer" target="_blank">Orcus1</a></li>
        <li><img class="charSquare" src="https://res.cloudinary.com/metaverse/image/upload/v1537235951/DiceTray/charArt/soHANDSOME.png" style="height:5vw; width:5vw;" alt="Handsome Spriteman"> Created by: <a href="https://lemmasoft.renai.us/forums/viewtopic.php?f=52&t=36406&p=397894&hilit=sprite#p397894" rel="noopener noreferrer" target="_blank">Doot</a></li>
        <li><img class="charSquare" src="https://res.cloudinary.com/metaverse/image/upload/v1537225996/DiceTray/charArt/Sprite_male_mage_A_curious01.png" style="height:5vw; width:5vw;" alt="Male Mage"> Created by: <a href="https://lemmasoft.renai.us/forums/viewtopic.php?f=52&t=45090&p=461217&hilit=male#p461217" rel="noopener noreferrer" target="_blank">Red Chan AKA WithoutPenOrPaper</a></li>
        <li><img class="charSquare" src="https://res.cloudinary.com/metaverse/image/upload/v1537225985/DiceTray/charArt/Sprite_Female_Mage_Smirk01.png" style="height:5vw; width:5vw;" alt="Female Mage"> Created by: <a href="https://lemmasoft.renai.us/forums/viewtopic.php?f=52&t=45090&p=461217&hilit=male#p461217" rel="noopener noreferrer" target="_blank">Red Chan AKA WithoutPenOrPaper</a></li>
        <li><img class="charSquare" src="https://res.cloudinary.com/metaverse/image/upload/v1537223687/DiceTray/charArt/guy1.png" style="height:5vw; width:5vw;" alt="Young Gentleman"> Created by: <a href="https://lemmasoft.renai.us/forums/viewtopic.php?f=52&t=25412" rel="noopener noreferrer" target="_blank">Sapiboong</a></li>
        <li><img class="charSquare" src="https://res.cloudinary.com/metaverse/image/upload/v1537223686/DiceTray/charArt/vamp.png" style="height:5vw; width:5vw;" alt="Vamp"> Created by: <a href="https://lemmasoft.renai.us/forums/viewtopic.php?f=52&t=51355&p=493324&hilit=vampire#p493324" rel="noopener noreferrer" target="_blank">Concept by Vicious Viking (Deviantart). Emotions by Aimyraude (Cloudnovel/Discord).</a></li>
        <li><img class="charSquare" src="https://res.cloudinary.com/metaverse/image/upload/v1537213424/DiceTray/charArt/cellonyPortrait.png" style="height:5vw; width:5vw;" alt="Celleny"> Created by: <a href="https://lemmasoft.renai.us/forums/viewtopic.php?f=52&t=46270" rel="noopener noreferrer" target="_blank">Succuren</a></li>
        <li><img class="charSquare" src="https://res.cloudinary.com/metaverse/image/upload/v1541010546/Avatars/Higgsy/side_higgsLaugh.png" style="height:5vw; width:5vw;" alt="Higgsy"> Created by: <a href="https://lemmasoft.renai.us/forums/viewtopic.php?f=52&t=48688&p=480951&hilit=female+sprite#p480951" rel="noopener noreferrer" target="_blank">GrammaHobbes</a></li>
      </ul>
    </div>

    <div class="row" id="iconTitle">
      <div class="col-3" style="font-size:2vw;">Icons/assets:</div>
    </div>
    <hr>

  <div class="row" id="iconCredits">

    <ul>
      <li><img class="charSquare" src="https://res.cloudinary.com/metaverse/image/upload/v1535396753/DiceTray/Gems/variableIcon.png" style="height:5vw; width:5vw;" alt="Variable Die"> Icon by: <a href="https://icons8.com/license/" rel="noopener noreferrer" target="_blank">Icons8</a></li>
      <li><img class="charSquare" src="https://res.cloudinary.com/metaverse/image/upload/v1535396751/DiceTray/Gems/simpleIcon.png" style="height:5vw; width:5vw;" alt="Simple Arrow"> Icon by: <a href="https://icons8.com/license/" rel="noopener noreferrer" target="_blank">Icons8</a></li>
      <li><img class="charSquare" src="https://res.cloudinary.com/metaverse/image/upload/v1535396750/DiceTray/Gems/conditionIcon.png" style="height:5vw; width:5vw;" alt="Conditional Lock"> Icon by: <a href="https://icons8.com/license/" rel="noopener noreferrer" target="_blank">Icons8</a></li>
      <li><img class="charSquare" src="https://res.cloudinary.com/metaverse/image/upload/v1538505202/DiceTray/UI%20Icons/icons8-chevron-up-50.png" style="height:5vw; width:5vw;" alt="Chevron"> Icon by: <a href="https://icons8.com/license/" rel="noopener noreferrer" target="_blank">Icons8</a></li>
      <li><img class="charSquare" src="https://res.cloudinary.com/metaverse/image/upload/v1535221984/DiceTray/Gems/nerfBox.png" style="height:5vw; width:5vw;" alt="Textbox"> Original (was made as a visual novel textbox but recolored/edited for use here) by: <a href="https://lemmasoft.renai.us/forums/viewtopic.php?f=52&t=17268#p226366" rel="noopener noreferrer" target="_blank">Ookami Kasumi</a></li>
      <li><img class="charSquare" src="https://res.cloudinary.com/metaverse/image/upload/v1538581612/Backgrounds/No%20Attribution/d20-2699387_640.png" style="height:5vw; width:5vw;" alt="d20"> d20 by: <a href="https://pixabay.com/en/d20-dice-dungeons-dragons-2699387/" rel="noopener noreferrer" target="_blank">pixabay</a></li>


      <li><img class="charSquare" src="https://res.cloudinary.com/metaverse/image/upload/v1538584304/Backgrounds/No%20Attribution/transparent-background-math.gif" style="height:5vw; width:5vw;" alt="Math Background"> Math Background From: <a href="https://ubisafe.org/explore/background-transparent-math/" rel="noopener noreferrer" target="_blank">Ubisafe</a></li>
      <li><img class="charSquare" src="https://res.cloudinary.com/metaverse/image/upload/v1538607257/Backgrounds/No%20Attribution/old_paper_2_by_edgelight-d8zx7kf.jpg" style="height:5vw; width:5vw;" alt="Paper"> Paper by: <a href="https://www.deviantart.com/edgelight/art/Old-paper-2-544065423" rel="noopener noreferrer" target="_blank">Edgelight</a></li>
      <li><img class="charSquare" src="https://res.cloudinary.com/metaverse/image/upload/v1538519779/Backgrounds/No%20Attribution/grungy_paper_texture_v_13_by_bashcorpo.png" style="height:5vw; width:5vw;" alt="Paper"> Paper by: <a href="https://www.deviantart.com/bashcorpo/art/Grungy-paper-texture-v-13-82031622" rel="noopener noreferrer" target="_blank">Bashcorpo</a></li>
      <li><img class="charSquare" src="https://res.cloudinary.com/metaverse/image/upload/v1538519297/Backgrounds/No%20Attribution/grungy_paper_texture_v_15_by_bashcorpo-d7s770b.jpg" style="height:5vw; width:5vw;" alt="Paper"> Paper by: <a href="https://www.deviantart.com/bashcorpo/art/Grungy-paper-texture-v-13-82031622" rel="noopener noreferrer" target="_blank">Bashcorpo</a></li>
      <li><img class="charSquare" src="https://res.cloudinary.com/metaverse/image/upload/v1538518854/Backgrounds/No%20Attribution/paper_texture_v2_by_bashcorpo.png" style="height:5vw; width:5vw;" alt="Paper"> Paper by: <a href="https://www.deviantart.com/bashcorpo/art/Grungy-paper-texture-v-13-82031622" rel="noopener noreferrer" target="_blank">Bashcorpo</a></li>


    </ul>
    </ul>
  </div>

  <div class="row" id="sfxTitle">
    <div class="col-3" style="font-size:2vw;">SFX:</div>
  </div>
  <hr>

  <div class="row pl-4" id="sfxCredits">
    This page intentionally left silent.

  </div>

  <div class="row" id="otherTitle">
    <div class="col-3" style="font-size:2vw;">Other:</div>
  </div>
  <hr>

  <div class="row pl-4" id="otherCredits">
    <p>

      All unlisted backgrounds are taken from the subtle patterns collection at: <a href="https://www.toptal.com/designers/subtlepatterns/" rel="noopener noreferrer" target="_blank">Toptal</a>
      <br ><br />
      This sheet is intended as a general gaming tool with the ability to mimic most any d20 system and still be useful for other systems(the dice-roller is fairly d20 specific.)
      <br ><br />

      That being said, I personally made this to help me play Pathfinder.  This site isn't endorsed by Pathfinder in any way but a lot of the testing I did and the corner cases I checked were pretty Pathfinder specific.  Some features (such as being able to label buffs as being circumstance, enhancement, etc.) are, while not useless in other systems, better suited for Pathfinder.  In any case, just to be on the safe side in case a game term I used isn't an industry standard term and instead part of Paizo's copyright: <br /><br />

      "This website uses trademarks and/or copyrights owned by Paizo Inc., which are used under Paizo's Community Use Policy. We are expressly prohibited from charging you to use or access this content. This website is not published, endorsed, or specifically approved by Paizo Inc. For more information about Paizo's Community Use Policy, please visit paizo.com/communityuse. For more information about Paizo Inc. and Paizo products, please visit paizo.com."
    </p>
  </div>`;

    $("#activeSheet").html(newPage);



}
//-------------------------------------------------------------------------------


//toolkit Functions
//These functions all just help us perform a common task such as searching through an array,
//to find an object with a particular id, etc.
//----------------------------------------------------------------------------------------------
function findObjectByID(newID, list){

  for (var i = 0;  i<list.length; i++){
    if (list[i].id==newID){
      return list[i];
    }
  }

  return false;
}
function findIndexByID(newID, list){

  for (var i = 0;  i<list.length; i++){
    if (list[i].id==newID){
      return i;
    }
  }

  return false;
}
function removeObjectByID(newID, list){


  for (var i = 0;  i<list.length; i++){
    if (list[i].id==newID){
      list.splice(i, 1);
      return list;
    }
  }

  console.log("id: " + newID+ " was not found in following list");
  console.log(list);
  return false;
}
function getValueFromSerial(name,serialArray){

  let result=false;
  serialArray.forEach(function(pair){
    if(pair.name==name){
      result=pair.value;
      return;
    }
  })
  return result;
}

function objRename(obj, oldKeys, newKeys){
  for(var x in oldKeys){
    obj[ newKeys[x] ] = obj[ oldKeys[x] ];
    delete obj[ oldKeys[x] ];
  }

  return obj;
}

function dieRoll(x){
  return Math.floor((Math.random()*x)+1);
}

function setClicks(){
  $("#raiseMiscMod").click({modShift:1},changeMiscMod);
  $("#raiseMiscMod5").click({modShift:5},changeMiscMod);
  $("#lowerMiscMod").click({modShift:-1}, changeMiscMod);
  $("#lowerMiscMod5").click({modShift:-5}, changeMiscMod);

  $("#uptickBuffTray").click({trayShift:1, trayCalled:"buff"}, trayChange);
  $("#downtickBuffTray").click({trayShift:-1, trayCalled:"buff"}, trayChange);
  $("#uptickNerfTray").click({trayShift:1, trayCalled:"nerf"}, trayChange);
  $("#downtickNerfTray").click({trayShift:-1, trayCalled:"nerf"}, trayChange);

  $("#die").click(getRoll);
  $("#titleBanner").click(bannerShortCut);
  $("#charPortrait").click(getCharSheet);
  $("#resetButton").click(resetStorage);
  $("#tutorialButton").click(replayTutorial);
  $("#saveGemsButton").click(savePositions);

  $("#artPageButton").click(charSheetAesthetics);
  $("#statsPageButton").click(charSheetStats);
  $("#attacksPageButton").click(charSheetAttacks);
  $("#creditsPageButton").click(charSheetCredits);
  $("#exitPageButton").click(exitSheet);

  $("#exitGemFormButton").click(exitForm);
  $("#showGemOptions").click(toggleForm);
}



function softReset(){
  displayLapidary();
  displayMiscMod();
  displayMod();
  displayPlayerAvatar();
  displayTitle();
  displayTrash();
  displayTraySlots();
  checkChange();

  setHovers();
}
function replayTutorial(){
  localStorage.setItem("tutorialSkip", false);
  location.reload();
}

//These functions allow use to implement drag/drop features
//----------------------------------------------------------------------------------------------

function allowDrop(ev) {
      ev.preventDefault();
}
function drag(ev) {
    //$("#"+ev.target.id).parent().removeClass('zoomIn');
    ev.dataTransfer.setData("text/plain", ev.target.id);
}
function drop(ev) {

    ev.preventDefault();
    if(ev.target.nodeName=="DIV"){
      var data = ev.dataTransfer.getData("text/plain");
      ev.target.appendChild(document.getElementById(data));
      $("#updateConditionalsBtn").addClass("shimmering");
    }

}

// function graveyard, scheduled to be deleted if their removal or replacement causes no errors
//----------------------------------------------------------------------------------------------
