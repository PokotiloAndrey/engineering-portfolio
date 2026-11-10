type EventName = "session_start"|"session_end"|"screen_view"|"screen_leave"|"content_view"|"content_leave"|"click"|"scroll_depth";
type EventRow = {event_id:string;session_id:string;event_name:EventName;occurred_at:string;screen?:string;content_type?:string;content_key?:string;target?:string;duration_ms?:number;scroll_depth_pct?:number;properties?:{language?:string;tag?:string;outbound?:boolean}};
let tracker: ReturnType<typeof createTracker>|null=null;
export function trackContent(type:string,key:string) {tracker?.setContent(type,key);}
export function trackScreen(screen:string){tracker?.setScreen(screen);}
export function startAnalytics(initData:string) {
  if(tracker || !initData || !import.meta.env.VITE_SUPABASE_URL) return;
  tracker=createTracker(initData);
}
function createTracker(initData:string) {
  const url=import.meta.env.VITE_SUPABASE_URL.replace(/\/$/,"")+"/functions/v1/miniapp-analytics";
  const session=crypto.randomUUID();
  let queue:EventRow[]=[];
  let sending=false;
  let screen="loading", contentType="",contentKey="",entered=performance.now();
  let contentEntered=entered,depth=0,active=document.visibilityState==="visible";
  const emit=(event_name:EventName,other:Partial<EventRow>={})=>{
    queue.push({event_id:crypto.randomUUID(),session_id:session,event_name,occurred_at:new Date().toISOString(),screen,...other});
    if(queue.length>=20) void flush();
  };
  const flush=async()=>{
    if(sending||!queue.length) return;
    sending=true; const batch=queue.splice(0,40);
    try {
      const r=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({initData,events:batch}),keepalive:true});
      if(!r.ok) queue=batch.concat(queue).slice(0,120);
    }catch {queue=batch.concat(queue).slice(0,120);}
    finally{sending=false;}
  };
  const leaveContent=()=>{
    if(contentType) emit("content_leave",{content_type:contentType,content_key:contentKey,duration_ms:Math.min(86400000,Math.round(performance.now()-contentEntered))});
  };
  const leaveScreen=()=>{leaveContent();emit("screen_leave",{duration_ms:Math.min(86400000,Math.round(performance.now()-entered)),scroll_depth_pct:depth});};
  const setScreen=(s:string)=>{if(s===screen)return;if(active)leaveScreen();screen=s;entered=performance.now();depth=0;contentType="";contentKey="";if(active)emit("screen_view");};
  const setContent=(type:string,key:string)=>{if(type===contentType&&key===contentKey)return;if(active)leaveContent();contentType=type;contentKey=key;contentEntered=performance.now();if(active&&type)emit("content_view",{content_type:type,content_key:key});};
  const scroll=()=>{const scroller=document.scrollingElement||document.documentElement;const p=Math.round(100*(scroller.scrollTop+scroller.clientHeight)/Math.max(scroller.scrollHeight,1));depth=Math.max(depth,Math.min(100,p));};
  const click=(event:MouseEvent)=>{
    const el=(event.target as Element|null)?.closest("button,a,[role=button]") as HTMLElement|null;
    if(!el||el.closest("[data-analytics-ignore]"))return;
    const a=el instanceof HTMLAnchorElement?el:null;
    // Avoid collecting UI text (it can contain user data). Stable key/label only.
    const target=el.dataset.analyticsId||"unlabeled."+el.tagName.toLowerCase();
    emit("click",{target:target.slice(0,160),content_type:contentType||undefined,content_key:contentKey||undefined,properties:{tag:el.tagName.toLowerCase(),outbound:Boolean(a&&a.origin!==location.origin)}});
  };
  const visibility=()=>{if(document.visibilityState==="hidden"&&active){leaveScreen();active=false;void flush();}else if(document.visibilityState==="visible"&&!active){active=true;entered=performance.now();contentEntered=entered;emit("screen_view");if(contentType)emit("content_view",{content_type:contentType,content_key:contentKey});}};
  const end=()=>{if(active)leaveScreen();emit("session_end");void flush();};
  document.addEventListener("click",click,true);
  document.addEventListener("scroll",scroll,true);
  document.addEventListener("visibilitychange",visibility);
  window.addEventListener("pagehide",end);
  const timer=window.setInterval(()=>void flush(),5000);
  emit("session_start",{properties:{language:navigator.language.slice(0,16)}});
  return {setScreen,setContent,stop(){window.clearInterval(timer);document.removeEventListener("click",click,true);document.removeEventListener("scroll",scroll,true);document.removeEventListener("visibilitychange",visibility);window.removeEventListener("pagehide",end);}};
}