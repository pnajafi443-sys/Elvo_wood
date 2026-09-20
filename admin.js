const db=supabase.createClient(ELVO_CONFIG.supabaseUrl,ELVO_CONFIG.supabasePublishableKey);
const loginView=document.querySelector('#login-view'),adminView=document.querySelector('#admin-view'),form=document.querySelector('#product-form'); let products=[];
const $=s=>document.querySelector(s); function msg(el,t,ok=false){el.textContent=t;el.className=ok?'ok':'err';}
function esc(s=''){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function money(n){return new Intl.NumberFormat('fa-IR').format(Number(n||0))+' تومان';}
async function isAdmin(){const {data:{user}}=await db.auth.getUser(); if(!user)return false; const {data}=await db.from('admin_users').select('user_id').eq('user_id',user.id).maybeSingle(); return !!data;}
async function show(){if(await isAdmin()){loginView.classList.add('hidden');adminView.classList.remove('hidden');loadProducts();}}
$('#login-form').onsubmit=async e=>{e.preventDefault();const {error}=await db.auth.signInWithPassword({email:$('#email').value,password:$('#password').value});if(error)msg($('#login-msg'),'ایمیل یا رمز عبور صحیح نیست.');else show();};
$('#logout').onclick=async()=>{await db.auth.signOut();location.reload();};
async function loadProducts(){const {data,error}=await db.from('products').select('*').order('created_at',{ascending:false});if(error){msg($('#save-msg'),'خطا در دریافت محصولات');return;}products=data||[];renderList();}
function renderList(){const q=($('#admin-search').value||'').toLowerCase();$('#product-list').innerHTML=products.filter(p=>p.name.toLowerCase().includes(q)).map(p=>`<button class="product-row" data-id="${p.id}"><span class="row-image" style="background-image:url('${p.main_image?.startsWith('http')?p.main_image:(p.main_image?ELVO_CONFIG.supabaseUrl+'/storage/v1/object/public/product-images/'+p.main_image:'')}')"></span><span>${esc(p.name)}</span><small>اکسسوری آشپزخانه</small><small>${money(p.price)}</small><small class="status-pill ${p.active?'active':'inactive'}">${p.active?'فعال':'غیرفعال'}</small><span class="row-actions">✎　◉　⋮</span></button>`).join('')||'<div class="empty">محصولی وجود ندارد.</div>';document.querySelectorAll('.product-row').forEach(x=>x.onclick=()=>edit(x.dataset.id));}
$('#admin-search').oninput=renderList;
$('#new-product').onclick=()=>resetForm();
function resetForm(){$('#product-id').value='';$('#editor-title').textContent='محصول جدید';form.reset();$('#active').checked=true;$('#delete-product').style.display='none';}
function edit(id){const p=products.find(x=>x.id===id);if(!p)return;$('#product-id').value=p.id;$('#editor-title').textContent='ویرایش: '+p.name;['name','price','dimensions','wood_type','finish_color','short_description','description'].forEach(k=>$('#'+k).value=p[k]??'');$('#active').checked=p.active;$('#delete-product').style.display='inline-flex';window.scrollTo({top:0,behavior:'smooth'});}
async function upload(file,bucket,path){const {error}=await db.storage.from(bucket).upload(path,file,{upsert:true,contentType:file.type});if(error)throw error;return path;}
form.onsubmit=async e=>{e.preventDefault();msg($('#save-msg'),'در حال ذخیره...');try{
const id=$('#product-id').value||crypto.randomUUID(); const existing=products.find(p=>p.id===id);
let main=existing?.main_image||null; let gallery=existing?.gallery_images||[];
const mainFile=$('#main-image').files[0]; if(mainFile){const path=`${id}/main-${Date.now()}-${mainFile.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;main=await upload(mainFile,'product-images',path);}
for(const f of $('#gallery').files){const path=`${id}/gallery-${Date.now()}-${Math.random().toString(36).slice(2)}-${f.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;gallery.push(await upload(f,'product-images',path));}
const payload={id,name:$('#name').value,price:Number($('#price').value||0),dimensions:$('#dimensions').value,wood_type:$('#wood_type').value,finish_color:$('#finish_color').value,short_description:$('#short_description').value,description:$('#description').value,main_image:main,gallery_images:gallery,active:$('#active').checked};
const r=existing?await db.from('products').update(payload).eq('id',id):await db.from('products').insert(payload);if(r.error)throw r.error;
for(let i=0;i<$('#frames360').files.length;i++){const f=$('#frames360').files[i];const path=`${id}/frame-${String(i).padStart(3,'0')}-${Date.now()}-${f.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;const saved=await upload(f,'product-360',path);await db.from('product_360_frames').insert({product_id:id,frame_index:i,frame_path:saved});}
msg($('#save-msg'),'محصول با موفقیت ذخیره شد.',true);resetForm();await loadProducts();
}catch(err){console.error(err);msg($('#save-msg'),'خطا: '+(err.message||'عملیات انجام نشد'));}};
$('#delete-product').onclick=async()=>{const id=$('#product-id').value;if(!id)return;if(!confirm('این محصول حذف شود؟'))return;const {error}=await db.from('products').delete().eq('id',id);if(error){msg($('#save-msg'),'حذف انجام نشد');return;}msg($('#save-msg'),'محصول حذف شد.',true);resetForm();loadProducts();};
db.auth.onAuthStateChange(()=>show()); show();