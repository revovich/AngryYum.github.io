!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof exports?module.exports=e:e(jQuery)}(function(e){var t,i,n=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],o="onwheel"in window.document||9<=window.document.documentMode?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],l=Array.prototype.slice;if(e.event.fixHooks)for(var s=n.length;s;)e.event.fixHooks[n[--s]]=e.event.mouseHooks;var a=e.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var t=o.length;t;)this.addEventListener(o[--t],h,!1);else this.onmousewheel=h;e.data(this,"mousewheel-line-height",a.getLineHeight(this)),e.data(this,"mousewheel-page-height",a.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var t=o.length;t;)this.removeEventListener(o[--t],h,!1);else this.onmousewheel=null;e.removeData(this,"mousewheel-line-height"),e.removeData(this,"mousewheel-page-height")},getLineHeight:function(t){var i=e(t),n=i["offsetParent"in e.fn?"offsetParent":"parent"]();return n.length||(n=e("body")),parseInt(n.css("fontSize"),10)||parseInt(i.css("fontSize"),10)||16},getPageHeight:function(t){return e(t).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};function h(n){var o,s=n||window.event,h=l.call(arguments,1),f=0,d=0,w=0;if((n=e.event.fix(s)).type="mousewheel","detail"in s&&(w=-1*s.detail),"wheelDelta"in s&&(w=s.wheelDelta),"wheelDeltaY"in s&&(w=s.wheelDeltaY),"wheelDeltaX"in s&&(d=-1*s.wheelDeltaX),"axis"in s&&s.axis===s.HORIZONTAL_AXIS&&(d=-1*w,w=0),f=0===w?d:w,"deltaY"in s&&(f=w=-1*s.deltaY),"deltaX"in s&&(d=s.deltaX,0===w&&(f=-1*d)),0!==w||0!==d){if(1===s.deltaMode){var c=e.data(this,"mousewheel-line-height");f*=c,w*=c,d*=c}else if(2===s.deltaMode){var m=e.data(this,"mousewheel-page-height");f*=m,w*=m,d*=m}if(o=Math.max(Math.abs(w),Math.abs(d)),(!i||o<i)&&u(s,i=o)&&(i/=40),u(s,o)&&(f/=40,d/=40,w/=40),f=Math[1<=f?"floor":"ceil"](f/i),d=Math[1<=d?"floor":"ceil"](d/i),w=Math[1<=w?"floor":"ceil"](w/i),a.settings.normalizeOffset&&this.getBoundingClientRect){var g=this.getBoundingClientRect();n.offsetX=n.clientX-g.left,n.offsetY=n.clientY-g.top}return n.deltaX=d,n.deltaY=w,n.deltaFactor=i,n.deltaMode=0,h.unshift(n,f,d,w),t&&window.clearTimeout(t),t=window.setTimeout(r,200),(e.event.dispatch||e.event.handle).apply(this,h)}}function r(){i=null}function u(e,t){return a.settings.adjustOldDeltas&&"mousewheel"===e.type&&t%120==0}e.fn.extend({mousewheel:function(e){return e?this.on("mousewheel",e):this.trigger("mousewheel")},unmousewheel:function(e){return this.off("mousewheel",e)}})});