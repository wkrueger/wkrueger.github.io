(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[850],{617:function(a,b,c){(window.__NEXT_P=window.__NEXT_P||[]).push(["/articles/[slug]",function(){return c(9402)}])},3481:function(d,b,a){"use strict";a.d(b,{S:function(){return m}});var e=a(5893),f=a(9736),g=a(949),h=a(8527),i=a(5193),c=a(1664),j=a.n(c),k={landing:"/",articles:"/articles"},l={"& ul":{display:"flex",justifyContent:"flex-start"},"& li":{display:"flex",alignItems:"center",listStyleType:"none",padding:4,marginTop:4,":first-of-type":{paddingLeft:0},"& a":{display:"inline-block",color:"textAlpha800"}},"& li.active":{fontWeight:"bold","& a":{borderBottom:"solid 2px var(--chakra-colors-orange-500)"}}};function m(a){var b=a.Content,c=(0,g.If)().toggleColorMode;return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(h.M5,{children:(0,e.jsx)(h.W2,{sx:l,maxW:"3xl",children:(0,e.jsx)("nav",{children:(0,e.jsxs)("ul",{children:[(0,e.jsx)("li",{className:"active",children:(0,e.jsx)(j(),{href:k.articles,children:(0,e.jsx)("a",{children:"Artigos"})})}),(0,e.jsx)("li",{children:(0,e.jsx)(j(),{href:k.landing,children:(0,e.jsx)("a",{children:"In\xedcio"})})}),(0,e.jsx)(h.LZ,{}),(0,e.jsx)("li",{className:"left",children:(0,e.jsx)(i.zx,{onClick:c,children:(0,e.jsx)(f.kL,{})})})]})})})}),(0,e.jsx)(h.M5,{as:"main",sx:{mt:8},children:(0,e.jsx)(h.W2,{maxW:"3xl",position:"relative",children:(0,e.jsx)(b,{})})})]})}},7761:function(c,a,b){"use strict";b.d(a,{j:function(){return d}});var d="https://wkrueger.github.io"},9402:function(j,c,a){"use strict";a.r(c),a.d(c,{"__N_SSG":function(){return G},default:function(){return H}});var d={};a.r(d),a.d(d,{MDXContext:function(){return p},MDXProvider:function(){return t},useMDXComponents:function(){return r},withMDXComponents:function(){return q}});var e=a(1799),k=a(5893),h=a(9008),l=a.n(h),m=a(1163),b=a(7294),n=a(3481);function f(b,a){return a=null!=a?a:{},Object.getOwnPropertyDescriptors?Object.defineProperties(b,Object.getOwnPropertyDescriptors(a)):(function(b,d){var a=Object.keys(b);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(b);a.push.apply(a,c)}return a})(Object(a)).forEach(function(c){Object.defineProperty(b,c,Object.getOwnPropertyDescriptor(a,c))}),b}var o=a(2746);let p=b.createContext({});function q(a){return function(c){let d=r(c.components);return b.createElement(a,{...c,allComponents:d})}}function r(a){let c=b.useContext(p);return b.useMemo(()=>"function"==typeof a?a(c):{...c,...a},[c,a])}let s={};function t({components:a,children:d,disableParentContext:e}){let c=r(a);return e&&(c=a||s),b.createElement(p.Provider,{value:c},d)}function u({compiledSource:e,frontmatter:j,scope:f,components:g={},lazy:a}){let[h,k]=(0,b.useState)(!a||"undefined"==typeof window);(0,b.useEffect)(()=>{if(a){let b=window.requestIdleCallback(()=>{k(!0)});return()=>window.cancelIdleCallback(b)}},[]);let i=(0,b.useMemo)(()=>{let a=Object.assign({opts:{...d,...o.c}},{frontmatter:j},f),c=Object.keys(a),g=Object.values(a),b=Reflect.construct(Function,c.concat(`${e}`));return b.apply(b,g).default},[f,e]);if(!h)return b.createElement("div",{dangerouslySetInnerHTML:{__html:""},suppressHydrationWarning:!0});let c=b.createElement(t,{components:g},b.createElement(i,null));return a?b.createElement("div",null,c):c}"undefined"!=typeof window&&(window.requestIdleCallback=window.requestIdleCallback||function(a){var b=Date.now();return setTimeout(function(){a({didTimeout:!1,timeRemaining:function(){return Math.max(0,50-(Date.now()-b))}})},1)},window.cancelIdleCallback=window.cancelIdleCallback||function(a){clearTimeout(a)});var v=a(1604),w=a(8527),x=a(9736),i=a(1664),y=a.n(i);function z(a){var d=(0,b.useContext)(A),c=a.src;return(decodeURI(c),c.startsWith("http"))?(0,k.jsx)("img",(0,e.Z)({},a)):(0,k.jsx)("img",f((0,e.Z)({},a),{src:"/images/"+d.slug+"/"+c}))}var A=(0,b.createContext)({srcPath:"",slug:""}),g={paddingBottom:"6rem",h1:{fontSize:"3xl",fontWeight:"bold",marginTop:8,marginBottom:2,display:"inline-block",borderBottom:"solid 3px var(--chakra-colors-orange-500)",width:"100%",paddingBottom:3,borderRadius:4,"&:first-of-type":{marginTop:0}},"h1 + h2":{mt:4},h2:{color:"headingAccent",fontWeight:"bold",fontSize:"2xl",mt:10,mb:4},h3:{color:"headingAccent",fontSize:"xl",mt:6},p:{my:4},pre:{my:6,p:6,mx:-6,backgroundColor:"preBg",borderRadius:4,color:"white",minWidth:"calc(100% + var(--chakra-space-12))",width:"fit-content"},"ul, ol":{ml:"2rem"},li:{my:3},"p code, ul code":{backgroundColor:"quoteBg"},blockquote:{borderLeft:"solid 3px var(--chakra-colors-orange-200)",my:6,px:6,py:2,mx:-6,backgroundColor:"quoteBg",borderRadius:4,"& > :first-of-type":{mt:0},"& > :last-of-type":{mb:0}},a:{color:"anchorAccent",textDecoration:"underline",textDecorationStyle:"dotted"},img:{my:10}},B=f((0,e.Z)({},g),{h2:f((0,e.Z)({},g.h2),{mt:0,color:"white"}),borderWidth:"1px",borderRadius:"lg",px:6,mx:-6,py:6});function C(){var a=(0,b.useContext)(D).articlesDetail;return(0,k.jsxs)(A.Provider,{value:{srcPath:a.folder,slug:a.slug},children:[(0,k.jsx)(v.m$.div,{sx:{position:"absolute",color:"textAlpha600",top:-6},children:(0,k.jsxs)("span",{className:"date",children:[a.month," / ",a.year]})}),(0,k.jsx)(v.m$.main,{className:"mdcontent",id:"mdcontent",sx:g,children:(0,k.jsx)(u,f((0,e.Z)({},a.mdxSource),{components:{img:z}}))}),Boolean(a.backlinks.length)&&(0,k.jsxs)(v.m$.footer,{sx:B,children:[(0,k.jsx)("h2",{children:"Backlinks"}),(0,k.jsx)(w.aV,{children:a.backlinks.map(function(a){return(0,k.jsxs)(w.HC,{children:[(0,k.jsx)(w.DE,{as:x.mr,color:"green.500"}),(0,k.jsx)(y(),{href:"/articles/"+a.source.path,children:(0,k.jsxs)("a",{children:["(",a.source.year,"/",a.source.month,") ",a.source.title]})})]},a.source.path)})})]})]})}var D=(0,b.createContext)(null);function E(a){return(0,k.jsx)(D.Provider,{value:a,children:(0,k.jsx)(n.S,{Content:C})})}var F=a(7761),G=!0;function H(a){var b=a.articlesDetail.title,c=(0,m.useRouter)();return(0,k.jsxs)("div",{children:[(0,k.jsxs)(l(),{children:[(0,k.jsx)("title",{children:b}),(0,k.jsx)("meta",{property:"og:type",content:"article"}),(0,k.jsx)("meta",{property:"og:title",content:b}),(0,k.jsx)("meta",{property:"org:url",content:F.j+c.asPath})]}),(0,k.jsx)(E,(0,e.Z)({},a))]})}},2746:function(a,d,b){let c=b(5893);a.exports.c=c}},function(a){a.O(0,[426,57,774,888,179],function(){var b;return a(a.s=617)}),_N_E=a.O()}])