(function(){var a=["fillStyle","font","globalAlpha","globalCompositeOperation","lineCap","lineDashOffset","lineJoin","lineWidth","miterLimit","shadowBlur","shadowColor","shadowOffsetX","shadowOffsetY","strokeStyle","textAlign","textBaseLine"],b=function(a){var b=a.getContext("2d"),c=window.devicePixelRatio||1;return 1!==c&&(a.style.width=a.width+"px",a.style.height=a.height+"px",a.width*=c,a.height*=c,b.scale(c,c)),a},c=function(b,c){for(var d in c)-1!==a.indexOf(d)&&(b[d]=c[d])},d=this.CircularProgress=function(b){var c,d,e;b=b||{},this.el=document.createElement("canvas"),this.options=b,b.text=b.text||{},b.text.value=b.text.value||null,c=this.el.getContext("2d");for(d in a)e=a[d],b[e]="undefined"!=typeof b[e]?b[e]:c[e];b.radius&&this.radius(b.radius)};d.prototype.update=function(a){return this._percent=a,this.draw(),this},d.prototype.radius=function(a){var c=2*a;return this.el.width=c,this.el.height=c,b(this.el),this},d.prototype.draw=function(){var a,b,d,e=this.options,f=this.el.getContext("2d"),g=Math.min(this._percent,100),h=window.devicePixelRatio||1,i=2*Math.PI*g/100,j=this.el.width/h,k=j/2,l=k,m=k;return f.clearRect(0,0,j,j),e.initial&&(c(f,e),c(f,e.initial),f.beginPath(),f.arc(l,m,k-f.lineWidth,0,2*Math.PI,!1),f.stroke()),c(f,e),f.beginPath(),f.arc(l,m,k-f.lineWidth,0,i,!1),f.stroke(),e.text&&(c(f,e),c(f,e.text)),b=null===e.text.value?(0|g)+"%":e.text.value,a=f.measureText(b).width,d=f.font.match(/(\d+)px/),d=d?d[1]:0,f.fillText(b,l-a/2+1,m+d/2-1),this}}).call(this);
