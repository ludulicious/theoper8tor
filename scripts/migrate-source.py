"""One-time, offline migration. Reads archived HTML; never executes remote code.
Do not rerun after editing content: generated Markdown is the maintained source.
"""
from pathlib import Path
import json,re,sys,hashlib,importlib
from urllib.parse import urlparse,unquote
Tree=importlib.import_module('source-html').Tree
ROOT=Path(__file__).resolve().parent.parent
saved_assets={a['source']:a for a in json.loads((ROOT/'docs/assets.json').read_text())} if (ROOT/'docs/assets.json').exists() else {}
assets={};issues=[];redirects={'/home':'/','/coffeechat':'/intentionalcoffeechat'}
records=[]
for file in ['crawl.json','crawl-extras.json','crawl-blog.json']:
 p=ROOT/'docs'/file
 if p.exists():records+=json.loads(p.read_text())
# Retain redirects that originally take visitors to externally hosted resources.
for rec in records:
 if rec['response'].startswith('200|'):
  target=rec['response'].split('|',1)[1];u=urlparse(target)
  if u.hostname not in ['theoper8tor.com','www.theoper8tor.com']:
   redirects[rec['path']]=target
  elif u.path.rstrip('/')!=rec['path'].rstrip('/'):
   redirects[rec['path']]=u.path

def text(n):return re.sub(r'\s+',' ',n.text()).strip().replace('\ufeff','')
def link(url):
 if not url:return ''
 if url.startswith('/cdn-cgi/l/email-protection'):return 'mailto:sim@theoper8tor.com'
 if url in ['/gmbauditsp2pplanner','/thecaringcorner','/eoyoffercheckout']:return 'https://theoper8tor.com'+url
 url=url.replace('https://https://','https://')
 if url.startswith('#new-menu-it'):url=url[len('#new-menu-it'):]
 if url.startswith(('www.','theoper8tor.com','instagram.com','facebook.com','twitter.com','youtube.com','linkedin.com','owwll.com','cashflowcurrency.com','anabsolutewonder.com')):url='https://'+url
 if url.startswith('http:..owwll.com'):url='https://owwll.com'
 u=urlparse(url)
 if u.hostname in ['theoper8tor.com','www.theoper8tor.com']:
  path=u.path.rstrip('/') or '/'
  if path=='/home':path='/'
  if path in ['/gmbauditsp2pplanner','/thecaringcorner','/eoyoffercheckout']:return 'https://theoper8tor.com'+path
  if path=='/cdn-cgi/l/email-protection':return 'mailto:sim@theoper8tor.com'
  return redirects.get(path,path)+('?' + u.query if u.query else '')+('#'+u.fragment if u.fragment else '')
 if u.scheme and u.scheme not in ['https','http','mailto','tel']:return ''
 return url

def image(n,page):
 src=n.attrs.get('src') or n.attrs.get('data-src') or n.attrs.get('data-bg-src')
 if not src or src.startswith('data:'):return ''
 if 'scontent-ord5-2.xx.fbcdn.net' in src:return ''
 original=src
 if '/u_https://' in src:src='https://'+src.split('/u_https://',1)[1]
 src=unquote(src).replace('.svg+xml','.svg')
 # Stable local filenames independent of transformation-CDN parameters.
 ext=Path(urlparse(src).path).suffix.lower()
 if ext not in ['.png','.jpeg','.jpg','.webp','.gif','.svg']:ext='.jpg'
 name=hashlib.sha256(src.encode()).hexdigest()[:12]+ext
 alt=(n.attrs.get('alt') or '').strip() or (page+' — image')
 if src in saved_assets:name=Path(saved_assets[src]['local']).name
 if src not in assets:assets[src]={'source':src,'original':original,'local':'/images/'+name,'alt':alt,'pages':[]}
 if page not in assets[src]['pages']:assets[src]['pages'].append(page)
 return f'![{alt.replace("]", "")} ](/images/{name})'.replace(' ]',']')

def inline(n):
 if not n.tag:return n.data.replace('\ufeff','')
 if n.tag in ['script','style','svg','button']:return ''
 s=''.join(inline(c) for c in n.children)
 if n.tag=='br':return ' '
 if n.tag=='a':
  to=link(n.attrs.get('href',''))
  return f'[{s.strip()}](<{to}>)' if to and s.strip() else s
 if n.tag in ['strong','b']:return '**'+s.strip()+'**' if s.strip() else ''
 if n.tag in ['em','i']:return '*'+s.strip()+'*' if s.strip() else ''
 if n.tag in ['p','h1','h2','h3','li']:return s.strip()+'\n\n'
 return s

def wrap(name,body,depth,props=''):
 if not body.strip():return ''
 fence=':'*(depth+2)
 return f'{fence}{name}{props}\n\n{body.strip()}\n\n{fence}\n\n'

def migrate(file,dest,title=None,layout='story'):
 source=file.read_text();tree=Tree(source);page=file.stem.replace('__','/')
 m=re.search(r'<script[^>]*id="__NUXT_DATA__"[^>]*>(.*?)</script>',source,re.S)
 a=json.loads(m[1]) if m else []
 def resolve(n,depth=0):
  if depth>8:return None
  v=a[n] if isinstance(n,int) and n>=0 else n
  if isinstance(v,dict):return {k:resolve(x,depth+1) for k,x in v.items()}
  if isinstance(v,list):return [resolve(x,depth+1) for x in v]
  return v
 metadata={};steps={}
 for i,v in enumerate(a):
  if not isinstance(v,dict):continue
  if 'nodeId' in v:
   d=resolve(i);metadata[d['nodeId']]=d
  if 'url' in v and 'value' in v:
   d=resolve(i)
   if isinstance(d.get('url'),str) and d['url'].startswith('/') and isinstance(d.get('value'),str):steps[d['value']]=d['url']
 heading=False
 def render(n,depth=0):
  nonlocal heading
  if n.tag in ['script','style','noscript','svg']:return ''
  if n.has('hide-element') or 'display:none' in n.attrs.get('style','').replace(' ',''):return ''
  if n.has('c-nav-menu'):return ''
  if n.has('c-heading') or n.has('c-sub-heading'):
   s=text(n)
   if not s:return ''
   h='#' if not heading else '##';heading=True
   if len(s)>95 and h!='#':return s+'\n\n'
   return h+' '+s+'\n\n'
  if n.has('c-paragraph'):
   return inline(n).strip()+'\n\n'
  if n.has('c-bullet-list'):
   return ''.join('- '+re.sub(r'\s+',' ',inline(li)).strip()+'\n' for li in n.find(lambda c:c.tag=='li'))+'\n'
  if n.has('c-button'):
   anchors=n.find(lambda c:c.tag=='a' and c.attrs.get('href'));d=metadata.get('c'+n.attrs.get('id',''),{})
   label=d.get('text',{}).get('value') or (text(anchors[0]) if anchors else text(n))
   url=anchors[0].attrs['href'] if anchors else d.get('visitWebsite',{}).get('value',{}).get('url','')
   action=d.get('action',{}).get('value')
   if not url and action=='go-to-funnel-step':url=steps.get(d.get('stepPath',{}).get('value'),'')
   if not url and action=='scroll-to-element':url='#'+d.get('scrollToElement',{}).get('value','')
   if not url and action=='popup':
    url='/contact';issues.append({'page':page,'issue':'Popup button replaced by contact link','label':label})
   if not url:
    if label:issues.append({'page':page,'issue':'Source button has no working destination','label':label})
    return ''
   return wrap('action-link','',depth) if not label else ':'*(depth+2)+'action-link'+jsonprops({'label':label.strip(),'to':link(url),'id':n.attrs.get('id','')})+'\n::'+':'*depth+'\n\n'
  if n.has('c-form') or n.has('c-calendar'):
   d=metadata.get('c'+n.attrs.get('id',''),{});kind='form' if n.has('c-form') else 'booking';key='formId' if kind=='form' else 'calendarId';ident=d.get(key,{}).get('value')
   if ident and ident!='none':
    url='https://link.funnelstreams.com/widget/'+('form/' if kind=='form' else 'booking/')+ident
    return ':'*(depth+2)+'provider-embed'+jsonprops({'src':url,'title':'Party line signup' if ident=='5U8kWDT5dbeY7KKyktlf' else ('Contact The Oper8tor' if kind=='form' else title or page)})+'\n' + ':'*(depth+2)+'\n\n'
   return ''
  if n.has('c-video'):
   thumb=n.find(lambda c:'youtube.com/vi/' in c.attrs.get('data-bg-src',''))
   if thumb:
    ident=thumb[0].attrs['data-bg-src'].split('/vi/')[1].split('/')[0]
    return ':'*(depth+2)+'provider-embed'+jsonprops({'src':'https://www.youtube-nocookie.com/embed/'+ident,'title':'The Oper8tor video','kind':'video'})+'\n'+':'*(depth+2)+'\n\n'
   return ''
  if n.has('c-faq'):
   # FAQ markup contains both questions and answer stories in source HTML.
   return ''.join(render(c,depth) for c in n.children) or inline(n).strip()+'\n\n'
  if n.has('c-custom-code') and text(n):return inline(n).strip()+'\n\n'
  if n.has('c-custom-code') and n.find(lambda c:c.tag=='iframe'):return ''.join(render(c,depth) for c in n.children)
  if n.has('c-custom-code'):
   issues.append({'page':page,'issue':'Custom script excluded; retained in archived HTML','id':n.attrs.get('id')})
   return ''
  if n.tag=='img':return image(n,page)+'\n\n'
  if n.tag=='iframe':
   return ':'*(depth+2)+'provider-embed'+jsonprops({'src':n.attrs.get('src',''),'title':n.attrs.get('title','The Oper8tor media')})+'\n'+':'*(depth+2)+'\n\n'
  if n.has('c-row'):
   cols=n.find(lambda c:c.has('c-column'))
   if len(cols)>1 and len(cols)<=4:
    parts=[wrap('content-panel',''.join(render(c,depth+2) for c in col.children),depth+1) for col in cols]
    if len([p for p in parts if p.strip()])>1:return wrap('content-grid',''.join(parts),depth,jsonprops({'columns':str(min(3,len(cols)))}))
  if n.tag in ['h1','h2','h3']:
   h='#' if not heading else '##';heading=True;return h+' '+text(n)+'\n\n'
  if n.tag in ['p','li','blockquote'] and text(n):return inline(n).strip()+'\n\n'
  if n.tag=='a':
   imgs=n.find(lambda c:c.tag=='img')
   if imgs:
    body=''.join(image(i,page) for i in imgs);to=link(n.attrs.get('href',''));return ('['+body+'](<'+to+'>)' if to else body)+'\n\n'
  if not n.tag:return ''
  return ''.join(render(c,depth) for c in n.children)
 def jsonprops(d):return '{'+ ' '.join(k+'='+json.dumps(v,ensure_ascii=False) for k,v in d.items())+'}'
 sections=tree.root.find(lambda n:n.has('c-section'));body=''
 for s in sections:
  if s.find(lambda n:n.has('c-nav-menu')):continue
  if s.attrs.get('id') in ['section-ePD3Q7Us2I','section-baU1fthJv','section-FcEU9_HEX','section-vvs7ayBKjw','section-d3aF-56tA1']:continue
  result=''.join(render(c,1) for c in s.children)
  if result.strip():body+=wrap('site-section',result,0)
 if not body.strip():return False
 title=title or text(tree.root.find(lambda n:n.tag=='title')[0])
 if not heading:body='# '+title+'\n\n'+body
 candidates=tree.root.find(lambda n:n.has('c-paragraph'))
 desc=next((text(n) for n in candidates if len(text(n))>40),title)[:155]
 data={'title':title,'description':desc,'layout':layout}
 if '--assets-only' not in sys.argv:dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text('---\n'+ '\n'.join(k+': '+json.dumps(v,ensure_ascii=False) for k,v in data.items())+'\n---\n\n'+body)
 return True
files={
 'index':('00.index.md','The Oper8tor'), 'speaker':('01.speaker.md','Speaker, interviewer, trainer & spokesperson'),
 'services':('02.services/00.index.md','Services'), 'initial-consultation':('02.services/01.initial-consultation.md','Initial Consultation'),
 'fastaction':('02.services/02.fastaction.md','Fast Action Consultation'),'client-relations-retention':('02.services/03.client-relations-retention.md','Client Relations & Retention'),
 'bbb':('02.services/04.bbb.md','Brilliance — Brain Dump — Bank'),'systems-audit':('02.services/05.systems-audit.md','Systems Audit for Maximum Performance'),
 'funnel-mapping':('02.services/06.funnel-mapping.md','Funnel Mapping'), 'readytoscale':('02.services/07.readytoscale.md','Ready to Scale'),
 'book-online':('03.booking/00.book-online.md','Book Online'),'expertcoffeechat':('03.booking/01.expertcoffeechat.md','Virtual Coffee with The Oper8tor'),
 'bookingpagevision':('03.booking/02.bookingpagevision.md','Ready to Scale — Vision'), 'bookingpagevocal':('03.booking/03.bookingpagevocal.md','Ready to Scale — Vocal'),
 'bookingpagevisible':('03.booking/04.bookingpagevisible.md','Ready to Scale — Visible'), 'coffeechat':('03.booking/05.intentionalcoffeechat.md','Intentional Coffee Chat'),
 'newsletter':('05.information/07.newsletter.md','Oper8te 911 | 411 | 311'), 'contact':('04.contact.md','Contact The Oper8tor'), 'shop':('05.information/00.shop.md','Shop'), 'connect':('05.information/01.connect.md','Connect with Dr. Staci Moore'),
 'schedule':('05.information/02.schedule.md','Schedule of Events'), 'affiliate':('05.information/03.affiliate.md','Affiliate Disclaimers'), 'about':('05.information/04.about.md','About'),
 'p2pplanner':('05.information/05.p2pplanner.md','The Passion to Profit Planner'), 'aicompanion':('05.information/06.aicompanion.md','Your AI Revenue Strategist & Companion'),
 'blog':('06.blog/00.index.md','Blog')}
for name,(dest,title) in files.items():
 f=ROOT/'docs/source'/(name+'.html')
 if f.exists() and '--blog-only' not in sys.argv:migrate(f,ROOT/'content'/dest,title,'blog' if name=='blog' else 'story')
for index,f in enumerate(sorted((ROOT/'docs/source').glob('blog__b__*.html')),1):
 slug=f.stem.split('__')[-1];migrate(f,ROOT/'content/06.blog'/(f'{index:02}.'+slug+'.md'),layout='article')
logo=Tree((ROOT/'docs/source/index.html').read_text()).root.find(lambda n:n.tag=='img')[0]
image(logo,'/')
(ROOT/'docs/assets.json').write_text(json.dumps(list(assets.values()),indent=2))
(ROOT/'docs/extraction-issues.json').write_text(json.dumps(issues,indent=2))
(ROOT/'shared/legacy-redirects.json').write_text(json.dumps(redirects,indent=2)+'\n')
print('Generated',len(files),'page entries;',len(assets),'assets;',len(issues),'source issues')
