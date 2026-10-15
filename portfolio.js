// ============================================================
// portfolio.js — Matthieu Dano Portfolio
// ============================================================

let dark=true,fr=true;

// Slow background videos for ambiance
function slowVid(id, rate){
  const v = document.getElementById(id);
  if(!v) return;
  const apply = () => { if(v.playbackRate !== rate) v.playbackRate = rate; };
  v.addEventListener('canplay', apply, {once:true});
  v.addEventListener('play', apply);
  apply();
}
window.addEventListener('load', () => {
  slowVid('herovid', 0.6);
  slowVid('uevid', 0.5);
  slowVid('scvid', 0.5);
});

// UE (FondDecran day/night): fast-forward to bright, continue slow OR rewind to night
let _ueRaf = null;
const UE_DAY = 0.45;
function ueToDay(){
  if(_ueRaf){ cancelAnimationFrame(_ueRaf); _ueRaf = null; }
  const v = document.getElementById('uevid');
  if(!v || !v.duration) return;
  const target = v.duration * UE_DAY;
  v.play().catch(()=>{});
  v.playbackRate = 12;
  const check = () => {
    if(v.currentTime >= target){
      v.playbackRate = 0.5; // continue slow from daylight
    } else {
      _ueRaf = requestAnimationFrame(check);
    }
  };
  _ueRaf = requestAnimationFrame(check);
}
function ueToNight(){
  if(_ueRaf){ cancelAnimationFrame(_ueRaf); _ueRaf = null; }
  const v = document.getElementById('uevid');
  if(!v || !v.duration) return;
  v.playbackRate = 1;
  const step = () => {
    v.currentTime = Math.max(0, v.currentTime - 0.5);
    if(v.currentTime > 0.3){
      _ueRaf = requestAnimationFrame(step);
    } else {
      v.currentTime = 0;
      v.playbackRate = 0.5;
      v.play().catch(()=>{});
    }
  };
  _ueRaf = requestAnimationFrame(step);
}
document.getElementById('uevid').addEventListener('loadedmetadata', () => ueToNight());

function tT(){
  dark = !dark;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  const b = document.getElementById('tb');
  b.innerHTML = dark
    ? '\u2600\uFE0F <span class="fr"' + (fr ? '' : ' hidden') + '>Clair</span><span class="en"' + (fr ? ' hidden' : '') + '>Light</span>'
    : '\uD83C\uDF19 <span class="fr"' + (fr ? '' : ' hidden') + '>Sombre</span><span class="en"' + (fr ? ' hidden' : '') + '>Dark</span>';
  if(dark) ueToNight(); else ueToDay();
}
function tL(){
  fr=!fr;
  document.querySelectorAll('.fr').forEach(e=>e.hidden=!fr);
  document.querySelectorAll('.en').forEach(e=>e.hidden=fr);
  document.getElementById('lb2').textContent=fr?'EN':'FR';
}

function oM(id){
  const m=document.getElementById(id);
  m.classList.add('open');
  document.body.style.overflow='hidden';
  const v=m.querySelector('video');
  if(v){v.currentTime=0;v.play().catch(()=>{})}
  // bind lightbox to images in this modal
  const imgs=[...m.querySelectorAll('.mig img')].map(i=>i.src);
  const caps=[...m.querySelectorAll('.mig img')].map(i=>i.dataset.caption||'');
  m.querySelectorAll('.mig img').forEach((img,i)=>{
    img.onclick=e=>{e.stopPropagation();oLB(img.src,imgs,caps,i)};
  });
}
function cM(id){
  const m=document.getElementById(id);
  m.classList.remove('open');
  document.body.style.overflow='';
  const v=m.querySelector('video');
  if(v)v.pause();
}
document.querySelectorAll('.mb').forEach(b=>b.addEventListener('click',e=>{if(e.target===b)cM(b.id)}));

// LIGHTBOX
let lbImgs=[],lbCaps=[],lbIdx=0;
function oLB(src,imgs,caps,idx){
  lbImgs=imgs&&imgs.length?imgs:[src];
  lbCaps=caps&&caps.length?caps:[];
  lbIdx=idx||0;
  document.getElementById('lbimg').src=lbImgs[lbIdx];
  document.getElementById('lbcap').textContent=lbCaps[lbIdx]||'';
  document.getElementById('lbcount').textContent=lbImgs.length>1?(lbIdx+1)+' / '+lbImgs.length:'';
  document.getElementById('lb').classList.add('open');
}
function cLB(){document.getElementById('lb').classList.remove('open')}
function lbNav(d){
  if(lbImgs.length<2)return;
  lbIdx=(lbIdx+d+lbImgs.length)%lbImgs.length;
  document.getElementById('lbimg').src=lbImgs[lbIdx];
  document.getElementById('lbcap').textContent=lbCaps[lbIdx]||'';
  document.getElementById('lbcount').textContent=(lbIdx+1)+' / '+lbImgs.length;
}

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){cLB();document.querySelectorAll('.mb.open').forEach(m=>cM(m.id))}
  const lbOpen=document.getElementById('lb').classList.contains('open');
  if(lbOpen&&e.key==='ArrowRight')lbNav(1);
  if(lbOpen&&e.key==='ArrowLeft')lbNav(-1);
});
