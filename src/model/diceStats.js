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
  bab:1,
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
