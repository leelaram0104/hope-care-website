const menuBtn=document.getElementById("menuBtn"),navMenu=document.getElementById("navMenu");
if(menuBtn&&navMenu){menuBtn.addEventListener("click",()=>{navMenu.classList.toggle("active");menuBtn.innerHTML=navMenu.classList.contains("active")?'<i class="fa-solid fa-xmark"></i>':'<i class="fa-solid fa-bars"></i>'});document.querySelectorAll("#navMenu a").forEach(a=>a.addEventListener("click",()=>{navMenu.classList.remove("active");menuBtn.innerHTML='<i class="fa-solid fa-bars"></i>'}))}
const path=location.pathname.split("/").pop()||"index.html";document.querySelectorAll("#navMenu a").forEach(a=>{if(a.getAttribute("href")===path)a.classList.add("active")});
const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();

function getJSON(k,d){try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}}
function saveActivity(text){const arr=getJSON("hc_activity",[]);arr.unshift({text,time:new Date().toLocaleString()});localStorage.setItem("hc_activity",JSON.stringify(arr.slice(0,20)))}
function increment(k){localStorage.setItem(k,(parseInt(localStorage.getItem(k)||"0")+1).toString())}
if(path!=="system-overview.html"){const views=parseInt(sessionStorage.getItem("hc_views")||"0")+1;sessionStorage.setItem("hc_views",views);saveActivity("Visited "+(path==="index.html"?"Home":path.replace(".html",""))+" page")}

const counters=document.querySelectorAll(".counter");if(counters.length){const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){counters.forEach(c=>{const t=+c.dataset.target;let n=0;const step=Math.max(1,t/60);const go=()=>{n+=step;if(n<t){c.textContent=Math.ceil(n);requestAnimationFrame(go)}else c.textContent=t+"+"};go()});observer.disconnect()}},{threshold:.2});observer.observe(document.querySelector(".stats"))}

/* ===== Visual enhancements + live overview charts ===== */
function addRevealAnimations(){
  const targets=document.querySelectorAll("section:not(.hero), .service-card, .resident-card, .info-card, .form-card, .system-card, .chart-card");
  targets.forEach((el,i)=>{el.classList.add("reveal"); el.style.transitionDelay=Math.min(i*35,350)+"ms";});
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("show")}),{threshold:.08});
  targets.forEach(el=>io.observe(el));
}
addRevealAnimations();

function getCount(key){return parseInt(localStorage.getItem(key)||"0",10)}
function renderOverviewCharts(){
  const bar=document.getElementById("barChart");
  const donut=document.getElementById("activityDonut");
  const legend=document.getElementById("chartLegend");
  if(!bar||!donut||!legend)return;
  const items=[
    {label:"Donations",value:getCount("hc_donation_count")},
    {label:"Volunteers",value:getCount("hc_volunteer_count")},
    {label:"Contacts",value:getJSON("hc_contacts",[]).length}
  ];
  const max=Math.max(1,...items.map(x=>x.value));
  bar.innerHTML=items.map(x=>`<div class="bar-wrap"><span class="bar-value">${x.value}</span><div class="bar" style="--h:${Math.max(12,(x.value/max)*185)}px"></div><span class="bar-label">${x.label}</span></div>`).join("");
  const total=items.reduce((a,x)=>a+x.value,0)||1;
  let cursor=0;
  const stops=items.map((x,i)=>{cursor+=(x.value/total)*100;return cursor;});
  donut.style.setProperty("--d1",stops[0]+"%");
  donut.style.setProperty("--d2",stops[1]+"%");
  donut.style.setProperty("--d3",stops[2]+"%");
  const dots=["#2e7d32","#ffb300","#81c784"];
  legend.innerHTML=items.map((x,i)=>`<div class="legend-row"><span class="legend-left"><span class="legend-dot" style="background:${dots[i]}"></span>${x.label}</span><strong>${x.value}</strong></div>`).join("");
  const mv=document.getElementById("metricViews"),mf=document.getElementById("metricForms"),ma=document.getElementById("metricActivity");
  if(mv)mv.textContent=sessionStorage.getItem("hc_views")||"0";
  if(mf)mf.textContent=localStorage.getItem("hc_total_forms")||"0";
  if(ma)ma.textContent=getJSON("hc_activity",[]).length;
}
renderOverviewCharts();
window.addEventListener("storage",renderOverviewCharts);
