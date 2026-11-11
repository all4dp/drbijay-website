(function(){
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* mobile menu + dropdown accordions */
  var burger=$('#burger'),nav=$('#mainnav');
  if(burger&&nav){
    burger.addEventListener('click',function(){var o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o);burger.innerHTML='<svg class="icon" aria-hidden="true"><use href="#i-'+(o?'x':'menu')+'"/></svg>';document.body.style.overflow=o?'hidden':''});
    $$('#mainnav li.dd>a').forEach(function(a){a.addEventListener('click',function(e){
      if(window.innerWidth<=1180){e.preventDefault();a.parentNode.classList.toggle('open')}
    })});
  }

  /* hero slider */
  var slides=$$('.slide'),dots=$$('.dots button'),cur=0,timer;
  function go(i){if(!slides.length)return;cur=(i+slides.length)%slides.length;
    slides.forEach(function(s,k){s.classList.toggle('on',k===cur)});
    dots.forEach(function(d,k){d.setAttribute('aria-current',k===cur?'true':'false')})}
  function auto(){clearInterval(timer);if(!reduce&&slides.length>1)timer=setInterval(function(){go(cur+1)},6000)}
  dots.forEach(function(d,k){d.addEventListener('click',function(){go(k);auto()})});
  var pv=$('.sl-arrow.prev'),nx=$('.sl-arrow.next');
  if(pv)pv.addEventListener('click',function(){go(cur-1);auto()});
  if(nx)nx.addEventListener('click',function(){go(cur+1);auto()});
  var sl=$('.slider');
  if(sl){sl.addEventListener('mouseenter',function(){clearInterval(timer)});sl.addEventListener('mouseleave',auto);
    var sx=null;sl.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
    sl.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40){go(cur+(dx<0?1:-1));auto()}sx=null});}
  go(0);auto();

  /* news ticker: duplicate items for a seamless loop */
  $$('.ticker .track, .aff .track').forEach(function(t){t.innerHTML+=t.innerHTML;
    var kids=t.children,half=kids.length/2;for(var i=half;i<kids.length;i++){kids[i].setAttribute('aria-hidden','true');[kids[i]].concat([].slice.call(kids[i].querySelectorAll('a,button'))).forEach(function(el){if(el.matches('a,button'))el.setAttribute('tabindex','-1')})}});

  /* carousels */
  $$('.car').forEach(function(c){var row=$('.row',c);
    $$('.nav',c).forEach(function(b){b.addEventListener('click',function(){
      var card=row.firstElementChild,step=card?card.getBoundingClientRect().width+24:300;
      var atEnd=row.scrollLeft+row.clientWidth>=row.scrollWidth-4;
      if(b.classList.contains('r')&&atEnd){row.scrollTo({left:0,behavior:'smooth'});return}
      row.scrollBy({left:b.classList.contains('l')?-step:step,behavior:'smooth'})})})});

  /* filter buttons */
  $$('[data-filter]').forEach(function(group){
    var target=$(group.getAttribute('data-filter')),items=target?$$('[data-k]',target):[];
    var btns=$$('.fbtn',group);
    btns.forEach(function(b){
      var v=b.getAttribute('data-v');
      var vs=v.split(' '),hit=function(it){var k=' '+it.getAttribute('data-k')+' ';return vs.some(function(x){return k.indexOf(' '+x+' ')>-1})};
      if(v!=='all'){var n=items.filter(hit).length;b.insertAdjacentHTML('beforeend','<span class="n">'+n+'</span>')}
      else b.insertAdjacentHTML('beforeend','<span class="n">'+items.length+'</span>');
      b.addEventListener('click',function(){
        btns.forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
        items.forEach(function(it){it.hidden=!(v==='all'||hit(it))});
      })})});

  /* counters */
  function fmt(n,suf){return Math.round(n).toLocaleString('en-IN')+(suf||'')}
  function run(el){var to=parseFloat(el.getAttribute('data-to'));if(isNaN(to))return;var suf=el.getAttribute('data-suf')||'';
    if(reduce){el.textContent=fmt(to,suf);return}
    var t0=null,d=1400;function step(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/d),e=1-Math.pow(1-p,3);el.textContent=fmt(to*e,suf);if(p<1)requestAnimationFrame(step)}requestAnimationFrame(step)}
  var cs=$$('[data-to]');
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){run(e.target);io.unobserve(e.target)}})},{threshold:.4});cs.forEach(function(c){io.observe(c)})}
  else cs.forEach(run);

  /* gallery lightbox */
  var lb=$('#lb');
  if(lb){var gi=$$('.gcard'),li=0,img=$('img',lb),cap=$('p',lb);
    function show(i){var vis=gi.filter(function(g){return !g.hidden});if(!vis.length)return;li=(i+vis.length)%vis.length;var g=vis[li];img.src=g.getAttribute('data-full');img.alt=$('img',g).alt;cap.textContent=$('b',g).textContent;lb.classList.add('open')}
    gi.forEach(function(g){g.addEventListener('click',function(){var vis=gi.filter(function(x){return !x.hidden});show(vis.indexOf(g))})});
    $('.x',lb).addEventListener('click',function(){lb.classList.remove('open')});
    $('.pv',lb).addEventListener('click',function(){show(li-1)});
    $('.nx',lb).addEventListener('click',function(){show(li+1)});
    lb.addEventListener('click',function(e){if(e.target===lb)lb.classList.remove('open')});
    document.addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;if(e.key==='Escape')lb.classList.remove('open');if(e.key==='ArrowLeft')show(li-1);if(e.key==='ArrowRight')show(li+1)});
  }

  /* message forms open the visitor's email app */
  $$('form[data-mail]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();
    var d=new FormData(f),name=d.get('name')||'',sub=d.get('subject')||('Message from '+name);
    var body=(d.get('message')||'')+'\n\n'+name+(d.get('email')?'\n'+d.get('email'):'')+(d.get('org')?'\n'+d.get('org'):'');
    location.href='mailto:'+f.getAttribute('data-mail')+'?subject='+encodeURIComponent(sub)+'&body='+encodeURIComponent(body)})});

  /* back to top */
  var tt=$('#totop');if(tt){window.addEventListener('scroll',function(){tt.classList.toggle('show',scrollY>700)},{passive:true});tt.addEventListener('click',function(){scrollTo({top:0,behavior:reduce?'auto':'smooth'})})}
  $$('[data-year]').forEach(function(e){e.textContent=new Date().getFullYear()});


  /* citations-per-year chart */
  function drawChart(data){
    var svg=document.getElementById('citeChart');if(!svg)return;
    var W=520,H=240,L=36,R=10,T=24,B=30,max=Math.max.apply(null,data.map(function(d){return d[1]}));
    var top=Math.ceil(max/20)*20||20,iw=W-L-R,ih=H-T-B,bw=iw/data.length,out='',yr=new Date().getFullYear();
    for(var g=0;g<=top;g+=top/4){var y=T+ih-ih*g/top;out+='<line class="grid" x1="'+L+'" x2="'+(W-R)+'" y1="'+y+'" y2="'+y+'"/><text x="'+(L-8)+'" y="'+(y+4)+'" text-anchor="end">'+Math.round(g)+'</text>'}
    data.forEach(function(d,i){var h=ih*d[1]/top,x=L+i*bw+bw*.22,w=bw*.56,y=T+ih-h;
      out+='<rect class="bar'+(d[1]===max?' hi':'')+'" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="4"/>';
      out+='<text class="val" x="'+(x+w/2)+'" y="'+(y-7)+'" text-anchor="middle">'+d[1]+'</text>';
      out+='<text x="'+(x+w/2)+'" y="'+(H-10)+'" text-anchor="middle">'+d[0]+(d[0]===yr?'*':'')+'</text>'});
    svg.innerHTML=out;svg.setAttribute('aria-label','Citations per year: '+data.map(function(d){return d[0]+': '+d[1]}).join(', '));
  }
  drawChart([[2022,3],[2023,10],[2024,32],[2025,56],[2026,52]]);

  /* research metrics: metrics.json (Google Scholar, refreshed daily by the site's update job) + OpenAlex (live) */
  function setM(k,v){$$('[data-m="'+k+'"]').forEach(function(e){if(e.hasAttribute('data-to')){e.setAttribute('data-to',v);e.textContent=fmt(v,e.getAttribute('data-suf'))}else e.textContent=v})}
  fetch('metrics.json',{cache:'no-store'}).then(function(r){return r.ok?r.json():null}).then(function(m){
    if(!m||!m.scholar)return;var s=m.scholar;
    if(s.citations)setM('gs-cites',s.citations);if(s.h_index)setM('gs-h',s.h_index);if(s.i10_index)setM('gs-i10',s.i10_index);
    if(m.updated)setM('gs-date',m.updated);if(s.by_year&&s.by_year.length)drawChart(s.by_year);
  }).catch(function(){});
  if($('[data-m^="oa-"]'))fetch('https://api.openalex.org/authors/orcid:0000-0001-5217-7041').then(function(r){return r.json()}).then(function(a){
    if(!a||!a.summary_stats)return;setM('oa-cites',a.cited_by_count);setM('oa-h',a.summary_stats.h_index);setM('oa-i10',a.summary_stats.i10_index);setM('oa-works',a.works_count);
    $$('.oa-live').forEach(function(e){e.hidden=false});
  }).catch(function(){});
})();
