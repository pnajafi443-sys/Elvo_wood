const db=supabase.createClient(ELVO_CONFIG.supabaseUrl,ELVO_CONFIG.supabasePublishableKey);
const root=document.querySelector('#product-detail');
const A=window.ELVO_ASSETS||{};
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function money(n){return new Intl.NumberFormat('fa-IR').format(Number(n||0))+' تومان';}
function imageUrl(path,bucket){if(!path)return '';if(path.startsWith('__EMBED__:'))return A[path.slice(10)]||'';if(path.startsWith('http'))return path;return `${ELVO_CONFIG.supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;}
const demo={
 'demo-1':{name:'جا قاشقی چوبی',price:780000,dimensions:'۱۳ × ۱۸ × ۱۲ سانتی‌متر',wood_type:'راش طبیعی',finish_color:'مات طبیعی',short_description:'اکسسوری کاربردی و مینیمال برای نظم دادن به فضای آشپزخانه.',description:'طراحی ساده، ساخت دقیق و حس گرم چوب طبیعی؛ مناسب برای استفاده روزمره و چیدمان آشپزخانه.',main_image:'__EMBED__:product-02.jpg'},
 'demo-2':{name:'تخته سرو مستطیل',price:1250000,dimensions:'۲۵ × ۳۵ سانتی‌متر',wood_type:'گردو',finish_color:'روغن طبیعی',short_description:'تخته سرو چوبی با فرم مینیمال و کاربردی.',description:'سطح مناسب برای سرو و استفاده روزمره، با پرداخت طبیعی و ظاهر گرم چوب.',main_image:'__EMBED__:product-03.jpg'},
 'demo-3':{name:'نمکدان و فلفل‌پاش',price:890000,dimensions:'۶ × ۶ × ۱۲ سانتی‌متر',wood_type:'راش',finish_color:'مات',short_description:'ست کوچک و کاربردی برای میز و آشپزخانه.',description:'فرم ساده و جمع‌وجور برای استفاده روزانه.',main_image:'__EMBED__:product-04.jpg'},
 'demo-4':{name:'جا دستمال کاغذی',price:650000,dimensions:'۱۵ × ۱۵ × ۲۲ سانتی‌متر',wood_type:'راش',finish_color:'طبیعی',short_description:'جا دستمال چوبی با طراحی تمیز و مینیمال.',description:'ترکیب کاربرد و زیبایی برای میز آشپزخانه.',main_image:'__EMBED__:product-05.jpg'},
 'demo-5':{name:'ست ادویه‌جات',price:1280000,dimensions:'۱۵ × ۲۰ × ۲۵ سانتی‌متر',wood_type:'گردو',finish_color:'طبیعی',short_description:'چیدمان منظم ادویه‌ها با یک طراحی چوبی گرم.',description:'مناسب برای آشپزخانه‌های مینیمال و دکورهای طبیعی.',main_image:'__EMBED__:product-06.jpg'},
 'demo-6':{name:'کاسه چوبی',price:890000,dimensions:'۲۰ × ۲۰ × ۸ سانتی‌متر',wood_type:'راش',finish_color:'روغن طبیعی',short_description:'کاسه چوبی دست‌ساز برای سرو و دکور.',description:'بافت طبیعی چوب در کنار فرم ساده و کاربردی.',main_image:'__EMBED__:product-07.jpg'},
 'demo-7':{name:'جا ابزار آشپزخانه',price:750000,dimensions:'۱۲ × ۱۷ × ۱۵ سانتی‌متر',wood_type:'راش',finish_color:'مات طبیعی',short_description:'نظم‌دهنده ابزارهای پرکاربرد آشپزخانه.',description:'یک اکسسوری کاربردی برای دسترسی راحت‌تر به ابزارها.',main_image:'__EMBED__:product-08.jpg'},
 'demo-8':{name:'سینی گرد چوبی',price:1080000,dimensions:'قطر ۳۰ سانتی‌متر',wood_type:'گردو',finish_color:'روغن طبیعی',short_description:'سینی گرد با ظاهر گرم و ساده.',description:'مناسب برای سرو، پذیرایی و استفاده دکوراتیو.',main_image:'__EMBED__:product-09.jpg'}
};
async function load(){
 const id=new URLSearchParams(location.search).get('id');
 if(!id){root.innerHTML='<div class="empty">محصول پیدا نشد.</div>';return;}
 let p=null,frames=[];
 if(id.startsWith('demo-')){p=demo[id];}
 else{const {data,error}=await db.from('products').select('*').eq('id',id).eq('active',true).single();if(!error)p=data;if(p){const r=await db.from('product_360_frames').select('*').eq('product_id',id).order('frame_index');frames=r.data||[];}}
 if(!p){root.innerHTML='<div class="empty">محصول پیدا نشد.</div>';return;}
 const gallery=(p.gallery_images||[]); const all=[p.main_image,...gallery].filter(Boolean);
 root.innerHTML=`<section class="detail-grid"><div><div class="main-photo"><img id="main-photo" src="${imageUrl(all[0],'product-images')}" alt="${esc(p.name)}"></div><div class="thumbs">${all.map((x,i)=>`<button data-src="${imageUrl(x,'product-images')}"><img src="${imageUrl(x,'product-images')}"></button>`).join('')}</div>${frames.length?`<div class="viewer"><div class="viewer-head"><h3>نمای 360 درجه</h3><span>برای چرخاندن بکشید</span></div><div class="viewer-stage"><img id="frame-img" src="${imageUrl(frames[0].frame_path,'product-360')}"></div><input id="frame-range" type="range" min="0" max="${frames.length-1}" value="0"></div>`:''}</div><div class="detail-info"><p class="eyebrow">ELVO WOOD</p><h1>${esc(p.name)}</h1><div class="price">${money(p.price)}</div><div class="specs"><div><span>ابعاد</span><b>${esc(p.dimensions||'—')}</b></div><div><span>نوع چوب</span><b>${esc(p.wood_type||'—')}</b></div><div><span>پرداخت / رنگ</span><b>${esc(p.finish_color||'—')}</b></div></div><p class="lead">${esc(p.short_description||'')}</p><div class="description">${esc(p.description||'')}</div><a class="btn contact-product" target="_blank" href="${ELVO_CONFIG.whatsapp}">استعلام و سفارش</a></div></section>`;
 document.querySelectorAll('.thumbs button').forEach(b=>b.onclick=()=>document.querySelector('#main-photo').src=b.dataset.src);
 if(frames.length){const range=document.querySelector('#frame-range'),img=document.querySelector('#frame-img');const set=i=>img.src=imageUrl(frames[Number(i)].frame_path,'product-360');range.oninput=e=>set(e.target.value);let startX=null;img.parentElement.onpointerdown=e=>startX=e.clientX;img.parentElement.onpointermove=e=>{if(startX===null)return;const dx=e.clientX-startX;if(Math.abs(dx)>8){let v=Number(range.value)-(dx>0?1:-1);v=Math.max(0,Math.min(frames.length-1,v));range.value=v;set(v);startX=e.clientX;}};img.parentElement.onpointerup=()=>startX=null;}
}
load();
