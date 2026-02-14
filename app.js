const output=document.getElementById("output");
const prOutput=document.getElementById("prOutput");
const historyEl=document.getElementById("history");
const progressChart=document.getElementById("progressChart");

const rankReveal=document.getElementById("rankReveal");
const rankRevealImg=document.getElementById("rankRevealImg");
const rankRevealText=document.getElementById("rankRevealText");

const totalUsers=document.getElementById("totalUsers");
const exerciseSelect=document.getElementById("exerciseSelect");
const goalWeight=document.getElementById("goalWeight");
const goalList=document.getElementById("goalList");

const rankImages={
GOD:"https://file.oyephoto.com/uploads/preview/lord-hanuman-ji-bhakti-photos-for-mobile-wallpapers-hd-11644406115de9ky8hqzg.jpg",
IMMORTAL:"https://i.pinimg.com/736x/73/29/6e/73296ed0bad6d9f33d4e08fcb06ce9e6.jpg",
BEAST:"https://i.pinimg.com/736x/44/ef/14/44ef14e057b7ca9309731ffc26e6a34f.jpg",
INTERMEDIATE:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKN3ttuV2L44SkCTCbhQcknDbsJTQ3s_-8Ng&s",
UNDISCIPLINED:"https://i.pinimg.com/736x/75/6a/ae/756aae0f2277a148c6f823b98d094d64.jpg",
NPC:"https://ih1.redbubble.net/image.5082487452.4686/mp,504x498,matte,f8f8f8,t-pad,600x600,f8f8f8.jpg"
};

let xp=0;
let level=1;
let chart;

function gainXP(){
xp+=20;
if(xp>=100){xp=0;level++;}
document.getElementById("xpBarInner").style.width=xp+"%";
document.getElementById("levelText").innerText="Level "+level+" | XP "+xp+" / 100";
}

function estimate1RM(weight,reps){
if(!weight||!reps)return weight;
return Math.round(weight*(1+reps/30));
}
function calculate(){

let bwv = +document.getElementById("bw").value || 0;  // ✅ FIX ADDED

let bpv = +document.getElementById("bp").value || 0;
let dlv = +document.getElementById("dl").value || 0;
let squatv = +document.getElementById("squat").value || 0;

let bpr = +document.getElementById("bpReps").value || 1;
let dlr = +document.getElementById("dlReps").value || 1;
let sqr = +document.getElementById("squatReps").value || 1;

/* ===== 1RM CALCULATION ===== */
let bp1RM = estimate1RM(bpv, bpr);
let dl1RM = estimate1RM(dlv, dlr);
let squat1RM = estimate1RM(squatv, sqr);

/* ===== SCORE ===== */
let total = (bp1RM + dl1RM + squat1RM) * 1.1;
let score = Math.round(total - bwv);

/* ===== PR ===== */
let pr = Math.max(bp1RM, dl1RM, squat1RM);

document.querySelectorAll(".goalItem").forEach(item=>{
let text=item.innerText;
let goalWeightMatch=text.match(/(\d+)kg/);
if(goalWeightMatch){
let goalWeightValue=parseInt(goalWeightMatch[1]);
if(pr>=goalWeightValue && !item.innerText.includes("ACHIEVED")){
let achieveBtn=item.querySelector(".achieveBtn");
if(achieveBtn) achieveBtn.click();
}
}
});

let ratio = bwv ? (bp1RM + dl1RM + squat1RM) / bwv : 0;

/* ===== RANK ===== */
let rankData = getRank(score);
let rankName = rankData[0];
let tagline = rankData[1];
let rankKey = rankName.toUpperCase();
document.querySelectorAll(".rankCard").forEach(card=>{
card.classList.remove("active");
if(card.dataset.rank === rankKey){
card.classList.add("active");
}
});

/* ===== EXTRA METRICS ===== */
let rpm = Math.round(score * 0.12);
let predictedLift = Math.round(pr * 1.25);
let strengthLimit = Math.round(pr * 1.4);

/* ===== OUTPUT ===== */
output.innerText =
"🔥 Rank: " + rankName +
"\n💪 " + tagline +
"\n⚡ Score: " + score +
"\n🏃 RPM: " + rpm +
"\n🏋️ Est 1RM PR: " + pr + "kg" +
"\n🚀 Lift Potential: " + predictedLift + "kg" +
"\n🧬 Strength Limit: " + strengthLimit + "kg" +
"\n⚖️ Strength Ratio: " + ratio.toFixed(2);

prOutput.innerText = "🏆 Best Lift " + pr + "kg";

/* ===== XP ===== */
gainXP();

/* ===== CARD HIGHLIGHT ===== */
document.querySelectorAll(".rankCard").forEach(c=>{
    c.classList.remove("active");
    if(c.dataset.rank===rankKey)c.classList.add("active");
});

/* ===== RANK REVEAL ===== */
rankRevealImg.src=rankImages[rankKey];
rankRevealText.innerText=rankName+" UNLOCKED";
rankReveal.classList.remove("hidden");
setTimeout(()=>rankReveal.classList.add("hidden"),2500);

/* ===== HISTORY ===== */
let history=JSON.parse(localStorage.getItem("gymHistory"))||[];
history.push({date:new Date().toLocaleDateString(),score,rank:rankKey});
localStorage.setItem("gymHistory",JSON.stringify(history));

loadHistory();
drawChart();
updateRankStats();


}

function loadHistory(){
let history=JSON.parse(localStorage.getItem("gymHistory"))||[];
historyEl.innerHTML="";
history.slice().reverse().forEach(h=>{
let li=document.createElement("li");
li.innerText=h.date+" "+h.rank+" "+h.score;
historyEl.appendChild(li);
});
}

function drawChart(){
let history=JSON.parse(localStorage.getItem("gymHistory"))||[];
let ctx=progressChart.getContext("2d");
if(chart)chart.destroy();
chart=new Chart(ctx,{
type:"line",
data:{
labels:history.map(h=>h.date),
datasets:[{
label: history.length ? history[history.length-1].rank : "Rank",
data:history.map(h=>h.score),
borderWidth:3,
tension:0.4,
fill:true
}]
},
options:{
responsive:true,
plugins:{
legend:{
labels:{
color:"#ff4444",
font:{size:14}
}
}
},
scales:{
x:{ticks:{color:"#ffaaaa"}},
y:{ticks:{color:"#ffaaaa"}}
}
}
});
}

function setGoal(){
let ex=exerciseSelect.value;
let wt=goalWeight.value;
if(!wt)return;

let li=document.createElement("li");
li.className="goalItem";

li.innerHTML=
ex+" Goal "+wt+"kg "+
"<button class='achieveBtn'>✅</button> "+
"<button class='deleteBtn'>❌</button>";

goalList.appendChild(li);

goalWeight.value="";
}
goalList.addEventListener("click",function(e){

if(e.target.classList.contains("deleteBtn")){
e.target.parentElement.remove();
}

if(e.target.classList.contains("achieveBtn")){
let item=e.target.parentElement;
item.style.textDecoration="line-through";
item.style.color="#00ff88";
e.target.remove();

let banner=document.createElement("div");
banner.className="goalBanner";
banner.innerText="🎉 HOORAY! GOAL ACHIEVED!";
item.appendChild(banner);
}

});

function updateRankStats(){
let history=JSON.parse(localStorage.getItem("gymHistory"))||[];
let counts={GOD:0,IMMORTAL:0,BEAST:0,INTERMEDIATE:0,UNDISCIPLINED:0,NPC:0};

history.forEach(h=>counts[h.rank]++);

totalUsers.innerText="Users Ranked: "+history.length;

document.querySelectorAll(".rankCard").forEach(card=>{
card.querySelector(".rankCount").innerText=counts[card.dataset.rank]+" Users";
});
}

function createParticles(){
const particles=document.getElementById("particles");
for(let i=0;i<40;i++){
let p=document.createElement("div");
p.className="particle";
p.style.left=Math.random()*100+"%";
p.style.animationDuration=(3+Math.random()*5)+"s";
particles.appendChild(p);
}
}

createParticles();
loadHistory();
drawChart();
updateRankStats();

