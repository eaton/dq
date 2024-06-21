var j=Object.defineProperty;var c=(t,n)=>j(t,"name",{value:n,configurable:!0});import k from"jszip";import m from"fs-jetpack";import d from"xml2js";import{z as r}from"zod";import O from"micromatch";import{utimes as S}from"utimes";import B from"gray-matter";import h from"jimp";import C from"turndown";async function u(t){if(typeof t=="string"){const n=await m.readAsync(t,"buffer").then(e=>{if(e)return k.loadAsync(e)});if(n===void 0)throw new Error("EBook file could not be read");return n}else return t}c(u,"loadBook");async function $(t){return await u(t).then(n=>Object.keys(n.files))}c($,"listContents");const A=d.Parser;async function w(t){const n=await y(t),o=await new A({async:!0,explicitArray:!1,charkey:"text",normalize:!0,mergeAttrs:!0,tagNameProcessors:[a=>a.startsWith("dc:")?a.replace("dc:",""):a]}).parseStringPromise(n);return M.parse(o).package.metadata}c(w,"getMeta");async function y(t){return await u(t).then(n=>n.files["OEBPS/content.opf"]?.async("string"))}c(y,"getRawMeta");const g=r.string().or(r.object({text:r.string()}).transform(t=>t.text)),E=r.object({title:r.string(),creator:r.array(g).or(g).optional(),contributor:r.array(g).optional().optional(),publisher:r.string().optional(),rights:r.string().optional(),subject:r.array(r.string()).optional(),language:r.string(),identifier:g,source:r.string().optional(),date:r.string()}),M=r.object({package:r.object({metadata:E})}),z=d.Parser;async function b(t){const n=await x(t),o=await new z({async:!0,explicitArray:!1,normalize:!0,mergeAttrs:!0,trim:!0}).parseStringPromise(n);return D.parse(o).ncx.navMap.navPoint}c(b,"getToc");async function x(t){return await u(t).then(n=>n.files["OEBPS/toc.ncx"]?.async("string"))}c(x,"getRawToc");const L=r.string().or(r.object({text:r.string()}).transform(t=>t.text)),R=r.string().or(r.object({src:r.string()}).transform(t=>t.src)),T=r.object({id:r.string(),playOrder:r.coerce.number(),navLabel:L,content:R}),D=r.object({ncx:r.object({navMap:r.object({navPoint:r.array(T)})})});async function P(t,n){const e=await u(t);if(e.files[`OEBPS/${n}`]!==void 0)return await e.files[`OEBPS/${n}`].async("string")}c(P,"getChapter");const N={output:"./output",preserveDates:!0};async function v(t,n={}){const e={...N,...n},o=await u(t);let a=Object.keys(o.files);e.matching!==void 0&&(a=a.filter(s=>O.isMatch(s,e.matching)));const i=m.dir(e.output??".");for(const s of a){const l=o.file(s);if(l){const f=e.rewritePaths?e.rewritePaths(s):s,p=await l.async("nodebuffer");i.write(f,p),e.preserveDates&&await S(i.path(f),{btime:l.date,mtime:l.date})}}}c(v,"copyFiles");async function F(t){const n=await u(t);if(n.files["OEBPS/image/cover.jpg"]!==void 0)return await n.files["OEBPS/image/cover.jpg"].async("nodebuffer").then(e=>h.read(e)).then(e=>e.getPixelColor(50,500)).then(e=>h.intToRGBA(e))}c(F,"getCoverColor");const J={hr:"---",emDelimiter:"*",headingStyle:"atx",bulletListMarker:"*",codeBlockStyle:"fenced"};function G(t,n={}){return H(n).turndown(t)}c(G,"toMarkdown");function H(t={}){const n={...J,blankReplacement:(o,a)=>a.isBlock&&!a.matches("figure")?`

`:a.outerHTML,...t},e=new C(n);return e.remove("title"),e.addRule("listItem",{filter:"li",replacement:(o,a,i)=>{o=o.replace(/^\n+/,"").replace(/\n+$/,`
`).replace(/\n/gm,`
    `);let s=i.bulletListMarker+" ";const l=a.parentNode;if(l.nodeName==="OL"){const f=l.getAttribute("start"),p=Array.prototype.indexOf.call(l.children,a);s=(f?Number(f)+p:p+1)+". "}return s+o+(a.nextSibling&&!/\n$/.test(o)?`
`:"")}}),e.addRule("aba-figure",{filter:"figure",replacement:function(o,a){const i=a.firstChild.firstChild.firstChild,s=i.getAttribute("src"),l=i.getAttribute("alt"),f=a.firstChild.children[1].textContent;return`![${l}](${s} "${f}")`}}),e}c(H,"toMarkdownParser");const I={data:"./output",images:"./output/images",chapters:"./output/src",fonts:!1,unshortenLinks:!0};async function W(t,n={}){const e={...I,...n},o=await u(t);if(e.data){const a=await w(o),i=await F(o);m.dir(e.data).write("meta.json",{color:i,...a})}if(e.chapters){const a=await b(o);for(const i of a){if(i.content.indexOf("#")>-1)continue;const s=await P(o,i.content);if(s){const l={title:i.navLabel,order:i.playOrder},f=G(s),p=i.content.replace(".xhtml",".md");m.dir(e.chapters).write(p,B.stringify({content:f},l))}}}e.images&&await v(o,{matching:"**/image/*.*",preserveDates:!0,rewritePaths:a=>a.replace("OEBPS/image/",""),output:e.images})}c(W,"processBook");export{v as copyFiles,P as getChapter,w as getMeta,y as getRawMeta,x as getRawToc,b as getToc,$ as listContents,u as loadBook,W as processBook};
