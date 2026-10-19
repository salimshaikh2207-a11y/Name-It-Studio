#!/usr/bin/env python3
"""Apply catalogue-derived SEO after showroom builds without changing product options."""
from pathlib import Path
import html,json,re,subprocess,xml.etree.ElementTree as ET
from datetime import date
R=Path(__file__).resolve().parents[1];BASE='https://nameitstudio.in';E=html.escape
D=json.loads((R/'catalogue/designs.json').read_text());by={d['id']:d for d in D};changed=set()
def save(p,t):
 if p.read_text()!=t:p.write_text(t);changed.add(p)
def block(t,ident,obj):
 t=re.sub(r'<script id="'+ident+r'" type="application/ld\+json">.*?</script>','',t,flags=re.S)
 return t.replace('</head>','<script id="'+ident+'" type="application/ld+json">'+json.dumps(obj,ensure_ascii=False).replace('</','<\\/')+'</script></head>')
def meta(t,prop,val,attr='name'):
 tag=f'<meta {attr}="{prop}" content="{E(val,quote=True)}">';pat=r'<meta '+attr+'="'+re.escape(prop)+r'"[^>]*>'
 return re.sub(pat,lambda _:tag,t) if re.search(pat,t) else t.replace('</head>',tag+'</head>')
def crumbs(names):return {'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':i+1,'name':n,'item':BASE+u} for i,(n,u) in enumerate(names)]}
def social(t,title,desc,url,image):
 for key,val in [('og:type','website'),('og:site_name','Name It Studio'),('og:title',title),('og:description',desc),('og:url',BASE+url),('og:image',BASE+image)]:t=meta(t,key,val,'property')
 for key,val in [('twitter:card','summary_large_image'),('twitter:title',title),('twitter:description',desc),('twitter:image',BASE+image)]:t=meta(t,key,val)
 return t
# Home business identity uses only verified public contact information.
p=R/'index.html';t=p.read_text();desc='Custom acrylic, glass, LED and engraved charcoal nameplates made in Mumbai. Personalise your name, size and finish, with artwork approval before production.'
t=meta(t,'description',desc);t=social(t,'Custom Nameplates in Mumbai | Name It Studio',desc,'/','/assets/hero-doorway/swami-samarth.webp')
t=block(t,'nis-business-schema',{'@context':'https://schema.org','@graph':[{'@type':'Organization','@id':BASE+'/#organization','name':'Name It Studio','url':BASE+'/','logo':BASE+'/assets/name-it-mark.svg','email':'info@nameitstudio.in','telephone':'+919082405720','description':'Custom acrylic, glass and engraved charcoal nameplates crafted in Mumbai.','sameAs':['https://www.instagram.com/nameitstudio.in/']},{'@type':'WebSite','@id':BASE+'/#website','url':BASE+'/','name':'Name It Studio','publisher':{'@id':BASE+'/#organization'}}]});save(p,t)
# Real category descriptions and crawlable links, rather than repeated location pages.
specs=[
('acrylic-nameplates','Custom Acrylic Nameplates','Personalised acrylic nameplates with raised lettering or cut-out designs. Choose your size, language and finish, with or without LED. Crafted in Mumbai.','Choose a white, black or matte black acrylic plate with gold, silver or rose gold lettering. Embossed designs can include LED lighting; debossed designs are made without LED. Browse each design for its construction and price, then share your name, house number and preferred size. We prepare four artwork options for approval before production.','Acrylic'),
('glass-nameplates','Custom Glass Nameplates & LED Designs','Custom glass nameplates in black or white with acrylic or frosted lettering and optional LED. Personalised sizes and design approval. Made in Mumbai.','Choose black or white glass with acrylic or frosted lettering for your entrance. LED lighting is available, and selected frosted-letter designs can include a diamond backdrop. Each product explains its finish, lighting and size options. Share your name and house number, then approve the personalised artwork before we make your plate.','Glass'),
('engraved-charcoal','Charcoal & Engraved Nameplates','Explore engraved charcoal nameplates with decorative borders, raised acrylic letters and optional LED. Custom names and sizes, crafted in Mumbai.','Combine a textured charcoal plate with an engraved decorative border and raised acrylic lettering. Border shapes vary by design, with LED available on suitable builds. Choose a design below and tell us your name, house number and preferred size. Your artwork and final construction are confirmed before production.','Engraved Mandala'),
('led-nameplates','Custom LED Nameplates for Your Home','Shop illuminated acrylic, glass and engraved charcoal nameplates. Personalise your name, size and finish, with design approval before production.','Explore LED nameplates in acrylic, glass and engraved charcoal. Each design pairs personalised lettering with illumination suited to its construction. Check the individual product for the shown finish, lighting and size options, and send a reference photo of your entrance if you would like help choosing. Final artwork and price are confirmed before production.','LED'),
('devotional-nameplates','Personalised Devotional Nameplates','Discover Ganesha, Shiva, Radha Krishna, Om and other devotional nameplates. Custom names, materials and sizes from Name It Studio in Mumbai.','Choose a meaningful motif and combine it with your name and house number. Explore acrylic, glass and engraved designs, with lighting options shown on each product. English, Hindi and Marathi lettering can be discussed with your artwork. Send your preferred design or a reference image to begin your personalised nameplate.','Devotional')]
for slug,title,desc,copy,kind in specs:
 p=R/slug/'index.html';t=p.read_text();url='/'+slug+'/'
 t=re.sub(r'<title>.*?</title>','<title>'+E(title)+' | Name It Studio</title>',t,count=1);t=meta(t,'description',desc)
 t=re.sub(r'<h1>.*?</h1>','<h1>'+E(title)+'</h1>',t,count=1)
 t=re.sub(r'<!-- seo-category-copy -->.*?<!-- /seo-category-copy -->','',t,flags=re.S)
 addition='<!-- seo-category-copy --><section class="showroom-wrap browse-section"><h2>Choose your '+('devotional design' if kind=='Devotional' else 'nameplate')+'</h2><p style="max-width:78ch">'+E(copy)+'</p><p><a class="text-link" href="/how-to-order/">Design approval, payment and delivery →</a> · <a class="text-link" href="/customize/">Discuss a custom design →</a></p></section><!-- /seo-category-copy -->'
 t=t.replace('</main>',addition+'</main>')
 ids=re.findall(r'data-current-design="([^"]+)"',t);items=[by[i] for i in ids if i in by]
 if items:t=social(t,title+' | Name It Studio',desc,url,items[0]['images'][0]['src'])
 t=block(t,'nis-category-schema',{'@context':'https://schema.org','@type':'CollectionPage','name':title,'url':BASE+url,'description':desc,'mainEntity':{'@type':'ItemList','itemListElement':[{'@type':'ListItem','position':i+1,'url':BASE+d['productUrl'],'name':d['name']} for i,d in enumerate(items)]}})
 t=block(t,'nis-breadcrumb-schema',crumbs([('Home','/'),(title,url)]));save(p,t)
# Breadcrumbs match the visible Home > Catalogue > Product navigation.
for d in D:
 p=R/d['productUrl'].lstrip('/')/'index.html';t=p.read_text()
 if d['id'] in ['N82','N83']:
  material='Acrylic' if d['category']=='Acrylic' else 'Charcoal & Engraved'
  t=re.sub(r'<title>.*?</title>','<title>'+E(d['name']+' | '+material+' | Name It Studio')+'</title>',t,count=1)
 t=block(t,'nis-breadcrumb-schema',crumbs([('Home','/'),('Catalogue','/catalogue/'),(d['name'],d['productUrl'])]));save(p,t)
# Give the customizer a visible page heading, also present in the source template.
for p in [R/'templates/customizer.inc',R/'customize/index.html']:
 t=p.read_text()
 if not re.search(r'<h1\b',t):
  heading='<section class="showroom-wrap listing-intro"><h1>Customise your nameplate</h1><p>Choose your material, design, size and lettering. We confirm your artwork before production.</p></section>'
  t=t.replace('<main>','<main>'+heading,1) if p.suffix=='.html' else heading+t
 save(p,t)
# Preserve existing canonical sitemap scope; add product images and accurate modified dates.
NS='http://www.sitemaps.org/schemas/sitemap/0.9';INS='http://www.google.com/schemas/sitemap-image/1.1';ET.register_namespace('',NS);ET.register_namespace('image',INS)
p=R/'sitemap.xml';tree=ET.parse(p);root=tree.getroot();products={BASE+d['productUrl']:d for d in D}
for row in root:
 url=row.find('{'+NS+'}loc').text;page=R/url.removeprefix(BASE).lstrip('/')/'index.html'
 if page in changed:
  lm=row.find('{'+NS+'}lastmod')
  if lm is None:lm=ET.SubElement(row,'{'+NS+'}lastmod')
  lm.text=date.today().isoformat()
 for old in list(row.findall('{'+INS+'}image')):row.remove(old)
 if url in products:
  for image in products[url]['images']:
   node=ET.SubElement(row,'{'+INS+'}image');ET.SubElement(node,'{'+INS+'}loc').text=BASE+image['src']
ET.indent(tree,space='  ');tree.write(p,encoding='utf-8',xml_declaration=True)
print('SEO updated:',len(changed),'pages/templates;',len(D),'product breadcrumbs; sitemap images added.')
