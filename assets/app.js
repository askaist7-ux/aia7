(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)], base=document.body.dataset.base;
const say=(el,text)=>{if(el)el.textContent=text;};
// Navigation: links navigate; adjacent buttons expand a single panel.
let lastToggle=null;
function closeMenus(restore=false){$$('.nav-toggle').forEach(b=>{b.setAttribute('aria-expanded','false');$('#'+b.getAttribute('aria-controls')).hidden=true;});if(restore&&lastToggle)lastToggle.focus();}
$$('.nav-toggle').forEach(b=>b.addEventListener('click',()=>{const open=b.getAttribute('aria-expanded')!=='true';closeMenus();lastToggle=b;b.setAttribute('aria-expanded',String(open));$('#'+b.getAttribute('aria-controls')).hidden=!open;}));
document.addEventListener('click',e=>{if(!e.target.closest('.nav-group'))closeMenus();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenus(true);});
const dialog=$('#mobile-nav'),open=$('.mobile-open');
function closeMobile(){dialog.close();}
open?.addEventListener('click',()=>{closeMenus();dialog.showModal();document.body.style.overflow='hidden';open.setAttribute('aria-expanded','true');$('.mobile-close',dialog).focus();});
$('.mobile-close')?.addEventListener('click',closeMobile);
dialog?.addEventListener('close',()=>{document.body.style.overflow='';open.setAttribute('aria-expanded','false');open.focus();});
dialog?.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const items=$$('a[href],button:not([disabled]),summary,input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]',dialog).filter(el=>el.getClientRects().length>0);const first=items[0],last=items[items.length-1];if(!first)return;if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
dialog?.addEventListener('click',e=>{if(e.target===dialog&&e.clientX<dialog.getBoundingClientRect().left)closeMobile();});
window.addEventListener('resize',()=>{if(innerWidth>=1200&&dialog?.open)closeMobile();});

const cf=$('#course-filters');
if(cf){
 const grid=$('#course-grid'),cards=$$('[data-course]',grid),keys=['q','category','level','mode','price','status','sort'];
 const params=new URLSearchParams(location.search);
 keys.forEach(k=>{if(params.has(k)&&cf.elements[k])cf.elements[k].value=params.get(k);});
 function filter(update){const values=Object.fromEntries(keys.map(k=>[k,cf.elements[k].value]));const q=values.q.trim().toLocaleLowerCase('ko');let count=0;
 cards.forEach(c=>{const yes=(!q||c.dataset.search.toLocaleLowerCase('ko').includes(q))&&['category','level','mode','price','status'].every(k=>!values[k]||c.dataset[k]===values[k]);c.hidden=!yes;if(yes)count++;});
 const ordered=values.sort==='title'?[...cards].sort((a,b)=>$('h3',a).textContent.localeCompare($('h3',b).textContent,'ko')):cards;ordered.forEach(c=>grid.append(c));
 const selected=['category','level','mode','price','status'].filter(k=>values[k]).length;say($('#course-count'),`교육 구성 안내 ${count}개 · 선택 조건 ${selected}개${q?' · 검색어: '+values.q:''}`);$('#course-empty').hidden=count>0;
 if(update){const p=new URLSearchParams;keys.forEach(k=>{if(values[k]&&!(k==='sort'&&values[k]==='default'))p.set(k,values[k]);});try{history.replaceState(null,'',location.pathname+(p.size?'?'+p:'')+location.hash);}catch(_){}}
 }
 cf.addEventListener('submit',e=>{e.preventDefault();filter(true);});cf.addEventListener('change',()=>filter(true));cf.addEventListener('reset',()=>{setTimeout(()=>{keys.forEach(k=>cf.elements[k].value=k==='sort'?'default':'');filter(true);},0);});window.addEventListener('pageshow',()=>filter(false));filter(false);
}
const search=$('#site-search');
if(search){const input=$('#site-q'),type=$('#search-type');input.value=new URLSearchParams(location.search).get('q')||'';
 function run(){const q=input.value.trim(),term=q.toLocaleLowerCase('ko'),results=$('#search-results');results.replaceChildren();say($('#search-heading'),q?'“'+q+'” 검색 결과':'검색어를 입력해주세요.');if(!q){say($('#search-status'),'교육 분야와 공개 자료를 검색할 수 있습니다.');return;}
 try{const found=window.ACADEMY_PAGES.filter(p=>!['search','sitemap'].includes(p.path)&&(!type.value||p.type===type.value)&&(p.title+' '+p.desc).toLocaleLowerCase('ko').includes(term));say($('#search-status'),found.length?`${found.length}개의 결과`:'일치하는 결과가 없습니다. 검색어를 바꾸거나 교육 문의를 이용해주세요.');const buckets=new Map();found.forEach(p=>{if(!buckets.has(p.type))buckets.set(p.type,[]);buckets.get(p.type).push(p);});for(const [category,items] of buckets){const section=document.createElement('section');section.className='search-group';const h=document.createElement('h3');h.textContent=category;section.append(h);items.forEach(p=>{const art=document.createElement('article');art.className='search-result';const title=document.createElement('h4'),a=document.createElement('a');a.href=base+p.href;a.textContent=p.title;title.append(a);const desc=document.createElement('p');desc.textContent=p.desc;art.append(title,desc);section.append(art);});results.append(section);}
 }catch(_){say($('#search-status'),'검색 데이터를 읽지 못했습니다. 페이지를 다시 열거나 전체 페이지 안내를 이용해주세요.');}
 try{history.replaceState(null,'',location.pathname+'?q='+encodeURIComponent(q));}catch(_){}
 }
 search.addEventListener('submit',e=>{e.preventDefault();run();});type.addEventListener('change',run);if(input.value)run();
}
const faq=$('#faq-search');if(faq){const run=()=>{const q=$('#faq-q').value.trim().toLowerCase(),cat=$('#faq-category').value;let count=0;$$('[data-faq]').forEach(d=>{const yes=(!q||d.textContent.toLowerCase().includes(q))&&(!cat||d.dataset.category===cat);d.hidden=!yes;if(yes)count++;});say($('#faq-count'),`${count}개의 질문`);$('#faq-empty').hidden=count>0;};faq.addEventListener('submit',e=>{e.preventDefault();run();});$('#faq-q').addEventListener('input',run);$('#faq-category').addEventListener('change',run);}
$$('[data-empty-filter]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();say($('#empty-filter-status'),$('select',f).value+' 분야에 공개된 항목이 없습니다.');}));
$$('.copy-button').forEach(b=>b.addEventListener('click',async()=>{const text=$('#'+b.dataset.copy).textContent,status=$('.copy-status',b.closest('.resource-block')||b.parentElement.parentElement);try{if(!navigator.clipboard)throw Error();await navigator.clipboard.writeText(text);say(status,'텍스트를 복사했습니다.');}catch(_){const range=document.createRange();range.selectNodeContents($('#'+b.dataset.copy));const sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);say(status,'자동 복사를 사용할 수 없습니다. 선택된 텍스트를 Ctrl+C 또는 기기의 복사 기능으로 복사해주세요.');}}));
function download(text,name){const blob=new Blob(['\ufeff'+text],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
const form=$('#inquiry-form');if(form){let draft='';const topic=$('#topic');topic.value=(new URLSearchParams(location.search).get('topic')||'').slice(0,150);const date=$('#date');const koreanToday=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());date.min=koreanToday;
 const errors=$('#error-summary'),result=$('#draft-result');
 function error(el,message){el.setAttribute('aria-invalid','true');const span=$('#'+el.id+'-error');if(span){span.textContent=message;el.setAttribute('aria-describedby',span.id);}return [el,message];}
 form.addEventListener('submit',e=>{e.preventDefault();errors.hidden=true;errors.replaceChildren();$$('[aria-invalid]',form).forEach(el=>{el.removeAttribute('aria-invalid');el.removeAttribute('aria-describedby');});$$('.field-error',form).forEach(el=>el.textContent='');const issues=[];
 ['organization','person','contact-method','contact','purpose'].forEach(id=>{const el=$('#'+id);if(!el.value.trim())issues.push(error(el,'필수 항목을 입력해주세요.'));});
 const method=$('#contact-method').value,contact=$('#contact');if(contact.value.trim()&&method==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.value.trim()))issues.push(error(contact,'이메일 주소 형식을 확인해주세요.'));if(contact.value.trim()&&method==='phone'&&!/^\+?[\d\s()-]{8,25}$/.test(contact.value.trim()))issues.push(error(contact,'전화번호를 숫자와 하이픈으로 입력해주세요.'));
 if(!$('#ack').checked)issues.push(error($('#ack'),'자동 접수가 아님을 확인해주세요.'));const people=$('#people');if(people.value&&!people.validity.valid){people.setCustomValidity('');issues.push([people,'대상 인원은 1~100000 사이의 정수로 입력해주세요.']);people.setAttribute('aria-invalid','true');}if(date.value&&date.value<koreanToday){issues.push([date,'희망 일정은 오늘 이후로 선택해주세요.']);date.setAttribute('aria-invalid','true');}
 if(issues.length){const h=document.createElement('h3');h.textContent='입력 내용을 확인해주세요.';errors.append(h);const ul=document.createElement('ul');issues.forEach(([el,msg])=>{const li=document.createElement('li'),a=document.createElement('a');a.href='#'+el.id;a.textContent=($('label[for="'+el.id+'"]')?.textContent||'확인 항목')+': '+msg;a.addEventListener('click',event=>{event.preventDefault();el.focus();});li.append(a);ul.append(li);});errors.append(ul);errors.hidden=false;errors.focus();result.hidden=true;return;}
 const entries=[...new FormData(form).entries()];draft=`AI ACADEMY ${form.dataset.formTitle} (작성본 · 미접수)\n작성일: ${koreanToday} (한국 시간)\n\n`+entries.map(([k,v])=>`${k}: ${String(v).trim()||'미정'}`).join('\n')+'\n\n이 문서는 자동 접수되지 않았습니다. 직접 발송 후 운영자에게 접수 여부를 확인해주세요.\n연락처: 010-2627-3771 / e_iiias@naver.com';say($('#draft-preview'),draft);const email=$('#email-draft');email.href='mailto:e_iiias@naver.com?subject='+encodeURIComponent('[AI아카데미] '+form.dataset.formTitle)+'&body='+encodeURIComponent(draft);result.hidden=false;result.focus();result.scrollIntoView({behavior:'auto',block:'start'});say($('#draft-status'),'작성만 완료되었습니다. 발송 및 접수는 이루어지지 않았습니다.');
 });
 $('#download-draft').addEventListener('click',()=>{if(!draft)return;download(draft,'AI아카데미_'+form.dataset.formTitle+'_미접수.txt');say($('#draft-status'),'다운로드를 요청했습니다. 파일을 확인한 뒤 직접 전달해주세요. 자동 접수되지 않았습니다.');});$('#email-draft').addEventListener('click',()=>say($('#draft-status'),'이메일 앱 열기를 요청했습니다. 이메일 앱에서 직접 발송해야 하며, 발송·접수 여부는 이 사이트에서 확인할 수 없습니다.'));$('#edit-draft').addEventListener('click',()=>{result.hidden=true;$('#organization').focus();});form.addEventListener('input',()=>{if(!result.hidden){result.hidden=true;draft='';}});
}
})();
