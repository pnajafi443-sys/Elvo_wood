const db = supabase.createClient(ELVO_CONFIG.supabaseUrl, ELVO_CONFIG.supabasePublishableKey);
const grid=document.querySelector('#products-grid'), search=document.querySelector('#search'), sort=document.querySelector('#sort'), countEl=document.querySelector('#productCount'), pagination=document.querySelector('#pagination');
let products=[], page=1, perPage=8;
const demo=[
 {id:'demo-1',name:'جا قاشقی چوبی',price:780000,dimensions:'۱۳ × ۱۸ × ۱۲ سانتی‌متر',main_image:'assets/product-02.jpg'},
 {id:'demo-2',name:'تخته سرو مستطیل',price:1250000,dimensions:'۲۵ × ۳۵ سانتی‌متر',main_image:'assets/product-03.jpg'},
 {id:'demo-3',name:'نمکدان و فلفل‌پاش',price:890000,dimensions:'۶ × ۶ × ۱۲ سانتی‌متر',main_image:'assets/product-04.jpg'},
 {id:'demo-4',name:'جا دستمال کاغذی',price:650000,dimensions:'۱۵ × ۱۵ × ۲۲ سانتی‌متر',main_image:'assets/product-05.jpg'},
 {id:'demo-5',name:'ست ادویه‌جات',price:1280000,dimensions:'۱۵ × ۲۰ × ۲۵ سانتی‌متر',main_image:'assets/product-06.jpg'},
 {id:'demo-6',name:'کاسه چوبی',price:890000,dimensions:'۲۰ × ۲۰ × ۸ سانتی‌متر',main_image:'assets/product-07.jpg'},
 {id:'demo-7',name:'جا ابزار آشپزخانه',price:750000,dimensions:'۱۲ × ۱۷ × ۱۵ سانتی‌متر',main_image:'assets/product-08.jpg'},
 {id:'demo-8',name:'سینی گرد چوبی',price:1080000,dimensions:'قطر ۳۰ سانتی‌متر',main_image:'assets/product-09.jpg'}
];
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function money(n){return new Intl.NumberFormat('fa-IR').format(Number(n||0))+' تومان'}
function imageUrl(path){if(!path)return '';if(path.startsWith('http')||path.startsWith('assets/'))return path;return `${ELVO_CONFIG.supabaseUrl}/storage/v1/object/public/product-images/${path}`}
function card(p){const href=String(p.id).startsWith('demo-')?'#contact':`product.html?id=${p.id}`;return `<article class="product-card"><a href="${href}"><div class="product-image"><img src="${imageUrl(p.main_image)}" alt="${esc(p.name)}"><span class="favorite">♡</span></div><div class="product-meta"><h3>${esc(p.name)}</h3><p>ابعاد: ${esc(p.dimensions||'—')}</p><strong>${money(p.price)}</strong><span class="view-product">مشاهده محصول</span></div></a></article>`}
function render(){let q=(search?.value||'').trim().toLowerCase();let list=products.filter(p=>String(p.name||'').toLowerCase().includes(q));if(sort?.value==='price-asc')list.sort((a,b)=>Number(a.price)-Number(b.price));if(sort?.value==='price-desc')list.sort((a,b)=>Number(b.price)-Number(a.price));countEl.textContent=new Intl.NumberFormat('fa-IR').format(list.length)+' محصول';let pages=Math.max(1,Math.ceil(list.length/perPage));page=Math.min(page,pages);let visible=list.slice((page-1)*perPage,page*perPage);grid.innerHTML=visible.length?visible.map(card).join(''):'<div class="empty">محصولی پیدا نشد.</div>';pagination.innerHTML=pages>1?Array.from({length:pages},(_,i)=>`<button class="${i+1===page?'active':''}" data-page="${i+1}">${new Intl.NumberFormat('fa-IR').format(i+1)}</button>`).join(''):'';pagination.querySelectorAll('button').forEach(b=>b.onclick=()=>{page=Number(b.dataset.page);render()})}
async function load(){try{const {data,error}=await db.from('products').select('*').eq('active',true).order('created_at',{ascending:false});if(error)throw error;products=(data&&data.length)?data:demo}catch(e){console.warn('Using visual demo products until real products are added.',e);products=demo}render()}
document.querySelectorAll('[data-whatsapp]').forEach(a=>a.href=ELVO_CONFIG.whatsapp);document.querySelectorAll('[data-instagram]').forEach(a=>a.href=ELVO_CONFIG.instagram);
search?.addEventListener('input',()=>{page=1;render()});sort?.addEventListener('change',()=>{page=1;render()});
document.querySelector('#focusSearch')?.addEventListener('click',()=>{document.querySelector('#search')?.focus();document.querySelector('#products')?.scrollIntoView({behavior:'smooth'})});
const menu=document.querySelector('#mobileMenu');document.querySelector('#menuBtn')?.addEventListener('click',()=>menu?.classList.add('open'));document.querySelector('#closeMenu')?.addEventListener('click',()=>menu?.classList.remove('open'));menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));
load();