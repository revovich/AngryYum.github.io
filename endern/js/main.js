var controller = new ScrollMagic.Controller({
  globalSceneOptions: {
    duration: $('section').height(),
    triggerHook: .025,
    reverse: true
  },
  vertical: false
});
window.addEventListener("wheel", onWheel);

function onWheel(event) {
  event.preventDefault();

  var normalized;  
  var delta = event.wheelDelta;
  var scroll = (window.pageXOffset || document.scrollLeft) - (document.clientLeft || 0) || 0;
  
  if (delta) {
    normalized = (delta % 120) == 0 ? delta / 120 : delta / 12;
  } else {
    delta = event.deltaY || event.detail || 0;
    normalized = -(delta % 3 ? delta * 10 : delta / 3);
  }

  TweenLite.to(window, 0.4, {scrollTo: {x: scroll + 400 * normalized } });
  console.clear();
}