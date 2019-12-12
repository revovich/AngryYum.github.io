!function(t,e){"function"==typeof define&&define.amd?define(e):t.BackgroundCheck=e()}(this,function(){"use strict";function t(){k=null,C=null,x=null,M={},W&&clearTimeout(W)}function e(t){b("debug")&&console.log(t)}function i(t,e){return n(t,typeof e),void 0===t?e:t}function n(t,e){if(void 0!==t&&typeof t!==e)throw"Incorrect attribute type"}function o(t){for(var i,n,o=[],a=0;a<t.length;a++)if(i=t[a],o.push(i),"IMG"!==i.tagName){if((n=window.getComputedStyle(i).backgroundImage).split(/,url|, url/).length>1)throw"Multiple backgrounds are not supported";if(!n||"none"===n)throw"Element is not an <img> but does not have a background-image";o[a]={img:new Image,el:o[a]},n=(n=n.slice(4,-1)).replace(/"/g,""),o[a].img.src=n,e("CSS Image - "+n)}return o}function a(t,e){var i=t;if("string"==typeof t?i=document.querySelectorAll(t):t&&1===t.nodeType&&(i=[t]),!i||0===i.length||void 0===i.length)throw"Elements not found";return e&&(i=o(i)),Array.prototype.slice.call(i)}function r(){b("debugOverlay")?(C.style.opacity=.5,C.style.pointerEvents="none",document.body.appendChild(C)):C.parentNode&&C.parentNode.removeChild(C)}function g(i){var n=(new Date).getTime()-i;e("Duration: "+n+"ms"),n>b("maxDuration")&&(console.log("BackgroundCheck - Killed"),c(),t())}function l(){H={left:0,top:0,right:document.body.clientWidth,bottom:window.innerHeight},C.width=document.body.clientWidth,C.height=window.innerHeight}function d(t,e,i){var n,o;return-1!==t.indexOf("px")?n=parseFloat(t):-1!==t.indexOf("%")?(n=(o=(n=parseFloat(t))/100)*e,i&&(n-=i*o)):n=e,n}function h(t){var e,i,n;if(t.nodeType){var o=t.getBoundingClientRect();e={left:o.left,right:o.right,top:o.top,bottom:o.bottom,width:o.width,height:o.height},n=t.parentNode,i=t}else e=function(t){var e=window.getComputedStyle(t.el);t.el.style.backgroundRepeat="no-repeat",t.el.style.backgroundOrigin="padding-box";var i=e.backgroundSize.split(" "),n=i[0],o=void 0===i[1]?"auto":i[1],a=t.el.clientWidth/t.el.clientHeight,r=t.img.naturalWidth/t.img.naturalHeight;"cover"===n?a>=r?(n="100%",o="auto"):(n="auto",i[0]="auto",o="100%"):"contain"===n&&(1/r>1/a?(n="auto",i[0]="auto",o="100%"):(n="100%",o="auto")),n="auto"===n?t.img.naturalWidth:d(n,t.el.clientWidth),o="auto"===o?n/t.img.naturalWidth*t.img.naturalHeight:d(o,t.el.clientHeight),"auto"===i[0]&&"auto"!==i[1]&&(n=o/t.img.naturalHeight*t.img.naturalWidth);var g,l,h=e.backgroundPosition;return"top"===h?h="50% 0%":"left"===h?h="0% 50%":"right"===h?h="100% 50%":"bottom"===h?h="50% 100%":"center"===h&&(h="50% 50%"),4===(h=h.split(" ")).length?(g=h[1],l=h[3]):(g=h[0],l=h[1]),l=l||"50%",g=d(g,t.el.clientWidth,n),l=d(l,t.el.clientHeight,o),4===h.length&&("right"===h[0]&&(g=t.el.clientWidth-t.img.naturalWidth-g),"bottom"===h[2]&&(l=t.el.clientHeight-t.img.naturalHeight-l)),g+=t.el.getBoundingClientRect().left,l+=t.el.getBoundingClientRect().top,{left:Math.floor(g),right:Math.floor(g+n),top:Math.floor(l),bottom:Math.floor(l+o),width:Math.floor(n),height:Math.floor(o)}}(t),n=t.el,i=t.img;n=n.getBoundingClientRect(),e.imageTop=0,e.imageLeft=0,e.imageWidth=i.naturalWidth,e.imageHeight=i.naturalHeight;var a,r=e.imageHeight/e.height;return e.top<n.top&&(a=n.top-e.top,e.imageTop=r*a,e.imageHeight-=r*a,e.top+=a,e.height-=a),e.left<n.left&&(a=n.left-e.left,e.imageLeft+=r*a,e.imageWidth-=r*a,e.width-=a,e.left+=a),e.bottom>n.bottom&&(a=e.bottom-n.bottom,e.imageHeight-=r*a,e.height-=a),e.right>n.right&&(a=e.right-n.right,e.imageWidth-=r*a,e.width-=a),e.imageTop=Math.floor(e.imageTop),e.imageLeft=Math.floor(e.imageLeft),e.imageHeight=Math.floor(e.imageHeight),e.imageWidth=Math.floor(e.imageWidth),e}function u(t){var i=h(t);t=t.nodeType?t:t.img,i.imageWidth>0&&i.imageHeight>0&&i.width>0&&i.height>0?x.drawImage(t,i.imageLeft,i.imageTop,i.imageWidth,i.imageHeight,i.left,i.top,i.width,i.height):e("Skipping image - "+t.src+" - area too small")}function m(t,e,i){var n=t.className;switch(i){case"add":n+=" "+e;break;case"remove":var o=new RegExp("(?:^|\\s)"+e+"(?!\\S)","g");n=n.replace(o,"")}t.className=n.trim()}function c(t){for(var e,i=t?[t]:b("targets"),n=0;n<i.length;n++)e=i[n],m(e=b("changeParent")?e.parentNode:e,b("classes").light,"remove"),m(e,b("classes").dark,"remove"),m(e,b("classes").complex,"remove")}function s(t){var i,n,o,a=t.getBoundingClientRect(),r=0,g=0,l=0,d=0,h=b("mask");if(a.width>0&&a.height>0){c(t),t=b("changeParent")?t.parentNode:t,i=x.getImageData(a.left,a.top,a.width,a.height).data;for(var u=0;u<i.length;u+=4)i[u]===h.r&&i[u+1]===h.g&&i[u+2]===h.b?d++:(r++,g+=(n=.2126*i[u]+.7152*i[u+1]+.0722*i[u+2]-l)*n,l+=n/r);d<=i.length/4*(1-b("minOverlap")/100)&&(o=Math.sqrt(g/r)/255,l/=255,e("Target: "+t.className+" lum: "+l+" var: "+o),m(t,l<=b("threshold")/100?b("classes").dark:b("classes").light,"add"),o>b("minComplexity")/100&&m(t,b("classes").complex,"add"))}}function f(t,e){return t=(t.nodeType?t:t.el).getBoundingClientRect(),e=e===H?e:(e.nodeType?e:e.el).getBoundingClientRect(),!(t.right<e.left||t.left>e.right||t.top>e.bottom||t.bottom<e.top)}function p(t){for(var e,i=(new Date).getTime(),n=t&&("IMG"===t.tagName||t.img)?"image":"targets",o=!t,a=b("targets").length,r=0;a>r;r++)f(e=b("targets")[r],H)&&("targets"!==n||t&&t!==e?"image"===n&&f(e,t)&&s(e):(o=!0,s(e)));if("targets"===n&&!o)throw t+" is not a target";g(i)}function v(t){var e=function(t){var e=0;return"static"!==window.getComputedStyle(t).position&&((e=parseInt(window.getComputedStyle(t).zIndex,10)||0)>=0&&e++),e},i=t.parentNode;return 1e5*(i?e(i):0)+e(t)}function w(t,i,n){if(k){var o=b("mask");e("--- BackgroundCheck ---"),e("onLoad event: "+(n&&n.src)),!0!==i&&(x.clearRect(0,0,C.width,C.height),x.fillStyle="rgb("+o.r+", "+o.g+", "+o.b+")",x.fillRect(0,0,C.width,C.height));for(var a,r,g=n?[n]:b("images"),l=function(t){var i=!1;return t.sort(function(t,e){t=t.nodeType?t:t.el,e=e.nodeType?e:e.el;var n=t.compareDocumentPosition(e),o=0;return(t=v(t))>(e=v(e))&&(i=!0),t===e&&2===n?o=1:t===e&&4===n&&(o=-1),o||t-e}),e("Sorted: "+i),i&&e(t),i}(g),d=!1,h=0;h<g.length;h++)f(a=g[h],H)&&(0===(r=a.nodeType?a:a.img).naturalWidth?(d=!0,e("Loading... "+a.src),r.removeEventListener("load",w),l?r.addEventListener("load",w.bind(null,null,!1,null)):r.addEventListener("load",w.bind(null,t,!0,a))):(e("Drawing: "+a.src),u(a)));n||d?n&&p(n):p(t)}}function y(t){!0===b("windowEvents")&&(W&&clearTimeout(W),W=setTimeout(t,200))}function b(t){if(void 0===M[t])throw"Unknown property - "+t;return M[t]}var k,C,x,W,H,T=void 0!==window.orientation?"orientationchange":"resize",M={};return{init:function(t){if(void 0===t||void 0===t.targets)throw"Missing attributes";M.debug=i(t.debug,!1),M.debugOverlay=i(t.debugOverlay,!1),M.targets=a(t.targets),M.images=a(t.images||"img",!0),M.changeParent=i(t.changeParent,!1),M.threshold=i(t.threshold,50),M.minComplexity=i(t.minComplexity,30),M.minOverlap=i(t.minOverlap,50),M.windowEvents=i(t.windowEvents,!0),M.maxDuration=i(t.maxDuration,500),M.mask=i(t.mask,{r:0,g:255,b:0}),M.classes=i(t.classes,{dark:"background--dark",light:"background--light",complex:"background--complex"}),void 0===k&&((C=document.createElement("canvas"))&&C.getContext?(x=C.getContext("2d"),k=!0):k=!1,r(),k&&(C.style.position="fixed",C.style.top="0px",C.style.left="0px",C.style.width="100%",C.style.height="100%",window.addEventListener(T,y.bind(null,function(){l(),w()})),window.addEventListener("scroll",y.bind(null,w)),l(),w()))},destroy:t,refresh:w,set:function(t,e){if(void 0===M[t])throw"Unknown property - "+t;if(void 0===e)throw"Missing value for "+t;if("targets"===t||"images"===t)try{e=a("images"!==t||e?e:"img","images"===t)}catch(t){throw e=[],t}else n(e,typeof M[t]);c(),M[t]=e,w(),"debugOverlay"===t&&r()},get:b,getImageData:function(){for(var t,e=b("images"),i=[],n=0;n<e.length;n++)t=h(e[n]),i.push(t);return i}}});