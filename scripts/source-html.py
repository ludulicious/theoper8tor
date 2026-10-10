"""Small inert HTML tree reader for the archived migration source (never executes scripts)."""
from html.parser import HTMLParser
class Node:
 def __init__(self,tag='',attrs=None,parent=None,text=''):
  self.tag=tag;self.attrs=dict(attrs or []);self.parent=parent;self.children=[];self.data=text
 def find(self,predicate):
  out=[]
  for c in self.children:
   if predicate(c):out.append(c)
   out.extend(c.find(predicate))
  return out
 def has(self,cls):return cls in self.attrs.get('class','').split()
 def text(self):
  if self.tag in ['script','style']:return ''
  return self.data+''.join(c.text() for c in self.children)
class Tree(HTMLParser):
 def __init__(self,source):
  super().__init__(convert_charrefs=True);self.root=Node('root');self.current=self.root;self.feed(source)
 def handle_starttag(self,t,a):
  n=Node(t,a,self.current);self.current.children.append(n)
  if t not in ['img','br','hr','input','link','meta','source','area','embed','wbr','col','base','param']:self.current=n
 def handle_startendtag(self,t,a):self.handle_starttag(t,a);self.handle_endtag(t)
 def handle_endtag(self,t):
  n=self.current
  while n.parent:
   if n.tag==t:self.current=n.parent;return
   n=n.parent
 def handle_data(self,d):self.current.children.append(Node(text=d,parent=self.current))
