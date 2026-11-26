const KEY="nilanjanc-pa-tasks-v1";let tasks=[];let filter="all";let deferredInstall=null;
const $=id=>document.getElementById(id);
try{tasks=JSON.parse(localStorage.getItem(KEY)||"[]");if(!Array.isArray(tasks))tasks=[]}catch{tasks=[]}
$("dateLabel").textContent=new Intl.DateTimeFormat(undefined,{weekday:"long",day:"numeric",month:"long"}).format(new Date());
function save(){localStorage.setItem(KEY,JSON.stringify(tasks));render()}
function render(){const visible=tasks.filter(t=>filter==="all"||(filter==="active"&&!t.done)||(filter==="done"&&t.done));$("taskList").replaceChildren();$("empty").hidden=visible.length>0;$("openCount").textContent=tasks.filter(t=>!t.done).length;for(const t of visible){const li=document.createElement("li");if(t.done)li.classList.add("done");const cb=document.createElement("input");cb.type="checkbox";cb.checked=t.done;cb.setAttribute("aria-label","Mark task complete");cb.addEventListener("change",()=>{t.done=cb.checked;save()});const span=document.createElement("span");span.className="task-text";span.textContent=t.text;const del=document.createElement("button");del.className="delete";del.textContent="Delete";del.addEventListener("click",()=>{tasks=tasks.filter(x=>x.id!==t.id);save()});li.append(cb,span,del);$("taskList").append(li)}}
function addTask(text){const value=text.trim();if(value)tasks.unshift({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),text:value,done:false,createdAt:new Date().toISOString()})}
$("taskForm").addEventListener("submit",e=>{e.preventDefault();addTask($("taskInput").value);$("taskInput").value="";save();$("taskInput").focus()});
document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{filter=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("selected",x===b));render()}));
$("importBtn").addEventListener("click",()=>{const lines=$("bulkInput").value.split(/\r?\n/).map(x=>x.replace(/^\s*[-•*]\s*/,"").trim()).filter(Boolean);lines.reverse().forEach(addTask);$("bulkInput").value="";save()});
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstall=e;$("installBtn").hidden=false});
$("installBtn").addEventListener("click",async()=>{if(!deferredInstall)return;deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;$("installBtn").hidden=true});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(err=>console.warn("Offline support unavailable",err)));
render();