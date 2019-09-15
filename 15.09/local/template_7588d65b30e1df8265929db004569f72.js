
; /* Start:"a:4:{s:4:"full";s:59:"/local/templates/desktop/scripts/common.js?1524822301535973";s:6:"source";s:42:"/local/templates/desktop/scripts/common.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
/**
 * @name InfoBox
 * @version 1.1.13 [March 19, 2014]
 * @author Gary Little (inspired by proof-of-concept code from Pamela Fox of Google)
 * @copyright Copyright 2010 Gary Little [gary at luxcentral.com]
 * @fileoverview InfoBox extends the Google Maps JavaScript API V3 <tt>OverlayView</tt> class.
 *  <p>
 *  An InfoBox behaves like a <tt>google.maps.InfoWindow</tt>, but it supports several
 *  additional properties for advanced styling. An InfoBox can also be used as a map label.
 *  <p>
 *  An InfoBox also fires the same events as a <tt>google.maps.InfoWindow</tt>.
 */

/*!
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browser:true */
/*global google */

/**
 * @name InfoBoxOptions
 * @class This class represents the optional parameter passed to the {@link InfoBox} constructor.
 * @property {string|Node} content The content of the InfoBox (plain text or an HTML DOM node).
 * @property {boolean} [disableAutoPan=false] Disable auto-pan on <tt>open</tt>.
 * @property {number} maxWidth The maximum width (in pixels) of the InfoBox. Set to 0 if no maximum.
 * @property {Size} pixelOffset The offset (in pixels) from the top left corner of the InfoBox
 *  (or the bottom left corner if the <code>alignBottom</code> property is <code>true</code>)
 *  to the map pixel corresponding to <tt>position</tt>.
 * @property {LatLng} position The geographic location at which to display the InfoBox.
 * @property {number} zIndex The CSS z-index style value for the InfoBox.
 *  Note: This value overrides a zIndex setting specified in the <tt>boxStyle</tt> property.
 * @property {string} [boxClass="infoBox"] The name of the CSS class defining the styles for the InfoBox container.
 * @property {Object} [boxStyle] An object literal whose properties define specific CSS
 *  style values to be applied to the InfoBox. Style values defined here override those that may
 *  be defined in the <code>boxClass</code> style sheet. If this property is changed after the
 *  InfoBox has been created, all previously set styles (except those defined in the style sheet)
 *  are removed from the InfoBox before the new style values are applied.
 * @property {string} closeBoxMargin The CSS margin style value for the close box.
 *  The default is "2px" (a 2-pixel margin on all sides).
 * @property {string} closeBoxURL The URL of the image representing the close box.
 *  Note: The default is the URL for Google's standard close box.
 *  Set this property to "" if no close box is required.
 * @property {Size} infoBoxClearance Minimum offset (in pixels) from the InfoBox to the
 *  map edge after an auto-pan.
 * @property {boolean} [isHidden=false] Hide the InfoBox on <tt>open</tt>.
 *  [Deprecated in favor of the <tt>visible</tt> property.]
 * @property {boolean} [visible=true] Show the InfoBox on <tt>open</tt>.
 * @property {boolean} alignBottom Align the bottom left corner of the InfoBox to the <code>position</code>
 *  location (default is <tt>false</tt> which means that the top left corner of the InfoBox is aligned).
 * @property {string} pane The pane where the InfoBox is to appear (default is "floatPane").
 *  Set the pane to "mapPane" if the InfoBox is being used as a map label.
 *  Valid pane names are the property names for the <tt>google.maps.MapPanes</tt> object.
 * @property {boolean} enableEventPropagation Propagate mousedown, mousemove, mouseover, mouseout,
 *  mouseup, click, dblclick, touchstart, touchend, touchmove, and contextmenu events in the InfoBox
 *  (default is <tt>false</tt> to mimic the behavior of a <tt>google.maps.InfoWindow</tt>). Set
 *  this property to <tt>true</tt> if the InfoBox is being used as a map label.
 */

/**
 * Creates an InfoBox with the options specified in {@link InfoBoxOptions}.
 *  Call <tt>InfoBox.open</tt> to add the box to the map.
 * @constructor
 * @param {InfoBoxOptions} [opt_opts]
 */
function InfoBox(opt_opts) {

  opt_opts = opt_opts || {};

  google.maps.OverlayView.apply(this, arguments);

  // Standard options (in common with google.maps.InfoWindow):
  //
  this.content_ = opt_opts.content || "";
  this.disableAutoPan_ = opt_opts.disableAutoPan || false;
  this.maxWidth_ = opt_opts.maxWidth || 0;
  this.pixelOffset_ = opt_opts.pixelOffset || new google.maps.Size(0, 0);
  this.position_ = opt_opts.position || new google.maps.LatLng(0, 0);
  this.zIndex_ = opt_opts.zIndex || null;

  // Additional options (unique to InfoBox):
  //
  this.boxClass_ = opt_opts.boxClass || "infoBox";
  this.boxStyle_ = opt_opts.boxStyle || {};
  this.closeBoxMargin_ = opt_opts.closeBoxMargin || "2px";
  this.closeBoxURL_ = opt_opts.closeBoxURL || "http://www.google.com/intl/en_us/mapfiles/close.gif";
  if (opt_opts.closeBoxURL === "") {
    this.closeBoxURL_ = "";
  }
  this.infoBoxClearance_ = opt_opts.infoBoxClearance || new google.maps.Size(1, 1);

  if (typeof opt_opts.visible === "undefined") {
    if (typeof opt_opts.isHidden === "undefined") {
      opt_opts.visible = true;
    } else {
      opt_opts.visible = !opt_opts.isHidden;
    }
  }
  this.isHidden_ = !opt_opts.visible;

  this.alignBottom_ = opt_opts.alignBottom || false;
  this.pane_ = opt_opts.pane || "floatPane";
  this.enableEventPropagation_ = opt_opts.enableEventPropagation || false;

  this.div_ = null;
  this.closeListener_ = null;
  this.moveListener_ = null;
  this.mapListener_ = null;
  this.contextListener_ = null;
  this.eventListeners_ = null;
  this.fixedWidthSet_ = null;
}

/* InfoBox extends OverlayView in the Google Maps API v3.
 */
InfoBox.prototype = new google.maps.OverlayView();

/**
 * Creates the DIV representing the InfoBox.
 * @private
 */
InfoBox.prototype.createInfoBoxDiv_ = function () {

  var i;
  var events;
  var bw;
  var me = this;

  // This handler prevents an event in the InfoBox from being passed on to the map.
  //
  var cancelHandler = function (e) {
    e.cancelBubble = true;
    if (e.stopPropagation) {
      e.stopPropagation();
    }
  };

  // This handler ignores the current event in the InfoBox and conditionally prevents
  // the event from being passed on to the map. It is used for the contextmenu event.
  //
  var ignoreHandler = function (e) {

    e.returnValue = false;

    if (e.preventDefault) {

      e.preventDefault();
    }

    if (!me.enableEventPropagation_) {

      cancelHandler(e);
    }
  };

  if (!this.div_) {

    this.div_ = document.createElement("div");

    this.setBoxStyle_();

    if (typeof this.content_.nodeType === "undefined") {
      this.div_.innerHTML = this.getCloseBoxImg_() + this.content_;
    } else {
      this.div_.innerHTML = this.getCloseBoxImg_();
      this.div_.appendChild(this.content_);
    }

    // Add the InfoBox DIV to the DOM
    this.getPanes()[this.pane_].appendChild(this.div_);

    this.addClickHandler_();

    if (this.div_.style.width) {

      this.fixedWidthSet_ = true;

    } else {

      if (this.maxWidth_ !== 0 && this.div_.offsetWidth > this.maxWidth_) {

        //this.div_.style.width = this.maxWidth_;
        this.fixedWidthSet_ = true;

      } else { // The following code is needed to overcome problems with MSIE

        bw = this.getBoxWidths_();

        //this.div_.style.width = (this.div_.offsetWidth - bw.left - bw.right) + "px";
        this.fixedWidthSet_ = false;
      }
    }

    this.panBox_(this.disableAutoPan_);

    if (!this.enableEventPropagation_) {

      this.eventListeners_ = [];

      // Cancel event propagation.
      //
      // Note: mousemove not included (to resolve Issue 152)
      events = ["mousedown", "mouseover", "mouseout", "mouseup",
      "click", "dblclick", "touchstart", "touchend", "touchmove"];

      for (i = 0; i < events.length; i++) {

        this.eventListeners_.push(google.maps.event.addDomListener(this.div_, events[i], cancelHandler));
      }

      // Workaround for Google bug that causes the cursor to change to a pointer
      // when the mouse moves over a marker underneath InfoBox.
      this.eventListeners_.push(google.maps.event.addDomListener(this.div_, "mouseover", function (e) {
        this.style.cursor = "default";
      }));
    }

    this.contextListener_ = google.maps.event.addDomListener(this.div_, "contextmenu", ignoreHandler);

    /**
     * This event is fired when the DIV containing the InfoBox's content is attached to the DOM.
     * @name InfoBox#domready
     * @event
     */
    google.maps.event.trigger(this, "domready");
  }
};

/**
 * Returns the HTML <IMG> tag for the close box.
 * @private
 */
InfoBox.prototype.getCloseBoxImg_ = function () {

  var img = "";

  if (this.closeBoxURL_ !== "") {

		img = "<div class=\"close\">" +
			"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\">" +
			"<g><path d=\"M12.596.353l2.83 2.83-12.022 12.02-2.828-2.83z\"/>" +
			"<path d=\"M3.404.353l-2.83 2.83 12.022 12.02 2.828-2.83z\"/></g></svg></div>";

    /*img  = "<img";
    img += " src='" + this.closeBoxURL_ + "'";
    img += " align=right"; // Do this because Opera chokes on style='float: right;'
    img += " style='";
    img += " position: relative;"; // Required by MSIE
    img += " cursor: pointer;";
    img += " margin: " + this.closeBoxMargin_ + ";";
    img += "'>";*/
  }

  return img;
};

/**
 * Adds the click handler to the InfoBox close box.
 * @private
 */
InfoBox.prototype.addClickHandler_ = function () {

  var closeBox;

  if (this.closeBoxURL_ !== "") {

    closeBox = this.div_.firstChild;
    this.closeListener_ = google.maps.event.addDomListener(closeBox, "click", this.getCloseClickHandler_());

  } else {

    this.closeListener_ = null;
  }
};

/**
 * Returns the function to call when the user clicks the close box of an InfoBox.
 * @private
 */
InfoBox.prototype.getCloseClickHandler_ = function () {

  var me = this;

  return function (e) {

    // 1.0.3 fix: Always prevent propagation of a close box click to the map:
    e.cancelBubble = true;

    if (e.stopPropagation) {

      e.stopPropagation();
    }

    /**
     * This event is fired when the InfoBox's close box is clicked.
     * @name InfoBox#closeclick
     * @event
     */
    google.maps.event.trigger(me, "closeclick");

    me.close();
  };
};

/**
 * Pans the map so that the InfoBox appears entirely within the map's visible area.
 * @private
 */
InfoBox.prototype.panBox_ = function (disablePan) {

  var map;
  var bounds;
  var xOffset = 0, yOffset = 0;

  if (!disablePan) {

    map = this.getMap();

    if (map instanceof google.maps.Map) { // Only pan if attached to map, not panorama

      if (!map.getBounds().contains(this.position_)) {
      // Marker not in visible area of map, so set center
      // of map to the marker position first.
        map.setCenter(this.position_);
      }

      bounds = map.getBounds();

      var mapDiv = map.getDiv();
      var mapWidth = mapDiv.offsetWidth;
      var mapHeight = mapDiv.offsetHeight;
      var iwWidth = this.div_.offsetWidth;
      var iwHeight = this.div_.offsetHeight;
			var iwOffsetX = (iwWidth / 2) * -1;
			// var iwOffsetX = this.pixelOffset_.width;
			var iwOffsetY = iwHeight * -1;
      var padX = this.infoBoxClearance_.width;
      var padY = this.infoBoxClearance_.height;
      var pixPosition = this.getProjection().fromLatLngToContainerPixel(this.position_);

      if (pixPosition.x < (-iwOffsetX + padX)) {
        xOffset = pixPosition.x + iwOffsetX - padX;
      } else if ((pixPosition.x + iwWidth + iwOffsetX + padX) > mapWidth) {
        xOffset = pixPosition.x + iwWidth + iwOffsetX + padX - mapWidth;
      }
      if (this.alignBottom_) {
        if (pixPosition.y < (-iwOffsetY + padY + iwHeight)) {
          yOffset = pixPosition.y + iwOffsetY - padY - iwHeight;
        } else if ((pixPosition.y + iwOffsetY + padY) > mapHeight) {
          yOffset = pixPosition.y + iwOffsetY + padY - mapHeight;
        }
      } else {
        if (pixPosition.y < (-iwOffsetY + padY)) {
          yOffset = pixPosition.y + iwOffsetY - padY;
        } else if ((pixPosition.y + iwHeight + iwOffsetY + padY) > mapHeight) {
          yOffset = pixPosition.y + iwHeight + iwOffsetY + padY - mapHeight;
        }
      }

      if (!(xOffset === 0 && yOffset === 0)) {

        // Move the map to the shifted center.
        //
        //var c = map.getCenter();
        map.panBy(xOffset, yOffset - 50);
      }
    }
  }
};

/**
 * Sets the style of the InfoBox by setting the style sheet and applying
 * other specific styles requested.
 * @private
 */
InfoBox.prototype.setBoxStyle_ = function () {

  var i, boxStyle;

  if (this.div_) {

    // Apply style values from the style sheet defined in the boxClass parameter:
    this.div_.className = this.boxClass_;

    // Clear existing inline style values:
    this.div_.style.cssText = "";

    // Apply style values defined in the boxStyle parameter:
    boxStyle = this.boxStyle_;
    for (i in boxStyle) {

      if (boxStyle.hasOwnProperty(i)) {

        this.div_.style[i] = boxStyle[i];
      }
    }

    // Fix for iOS disappearing InfoBox problem.
    // See http://stackoverflow.com/questions/9229535/google-maps-markers-disappear-at-certain-zoom-level-only-on-iphone-ipad
    this.div_.style.WebkitTransform = "translateZ(0)";

    // Fix up opacity style for benefit of MSIE:
    //
    if (typeof this.div_.style.opacity !== "undefined" && this.div_.style.opacity !== "") {
      // See http://www.quirksmode.org/css/opacity.html
      this.div_.style.MsFilter = "\"progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (this.div_.style.opacity * 100) + ")\"";
      this.div_.style.filter = "alpha(opacity=" + (this.div_.style.opacity * 100) + ")";
    }

    // Apply required styles:
    //
    this.div_.style.position = "absolute";
    this.div_.style.visibility = 'hidden';
    if (this.zIndex_ !== null) {

      this.div_.style.zIndex = this.zIndex_;
    }
    if (!this.div_.style.overflow) {
      this.div_.style.overflow = "auto";
    }
  }
};

/**
 * Get the widths of the borders of the InfoBox.
 * @private
 * @return {Object} widths object (top, bottom left, right)
 */
InfoBox.prototype.getBoxWidths_ = function () {

  var computedStyle;
  var bw = {top: 0, bottom: 0, left: 0, right: 0};
  var box = this.div_;

  if (document.defaultView && document.defaultView.getComputedStyle) {

    computedStyle = box.ownerDocument.defaultView.getComputedStyle(box, "");

    if (computedStyle) {

      // The computed styles are always in pixel units (good!)
      bw.top = parseInt(computedStyle.borderTopWidth, 10) || 0;
      bw.bottom = parseInt(computedStyle.borderBottomWidth, 10) || 0;
      bw.left = parseInt(computedStyle.borderLeftWidth, 10) || 0;
      bw.right = parseInt(computedStyle.borderRightWidth, 10) || 0;
    }

  } else if (document.documentElement.currentStyle) { // MSIE

    if (box.currentStyle) {

      // The current styles may not be in pixel units, but assume they are (bad!)
      bw.top = parseInt(box.currentStyle.borderTopWidth, 10) || 0;
      bw.bottom = parseInt(box.currentStyle.borderBottomWidth, 10) || 0;
      bw.left = parseInt(box.currentStyle.borderLeftWidth, 10) || 0;
      bw.right = parseInt(box.currentStyle.borderRightWidth, 10) || 0;
    }
  }

  return bw;
};

/**
 * Invoked when <tt>close</tt> is called. Do not call it directly.
 */
InfoBox.prototype.onRemove = function () {

  if (this.div_) {

    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  }
};

/**
 * Draws the InfoBox based on the current map projection and zoom level.
 */
InfoBox.prototype.draw = function () {

  this.createInfoBoxDiv_();

  var pixPosition = this.getProjection().fromLatLngToDivPixel(this.position_);

	var iwWidth = this.div_.offsetWidth;
	var iwHeight = this.div_.offsetHeight;
	var iwOffsetX = ((iwWidth / 2) - 18) * -1;
	var iwOffsetY = (iwHeight + (window.innerWidth <= 1290 ? 10 : 16)) * -1;

  this.div_.style.left = (pixPosition.x + iwOffsetX) + "px";

  if (this.alignBottom_) {
    this.div_.style.bottom = -(pixPosition.y + iwOffsetY) + "px";
  } else {
    this.div_.style.top = (pixPosition.y + iwOffsetY) + "px";
  }

  if (this.isHidden_) {

    this.div_.style.visibility = "hidden";

  } else {

    this.div_.style.visibility = "visible";
  }
};

/**
 * Sets the options for the InfoBox. Note that changes to the <tt>maxWidth</tt>,
 *  <tt>closeBoxMargin</tt>, <tt>closeBoxURL</tt>, and <tt>enableEventPropagation</tt>
 *  properties have no affect until the current InfoBox is <tt>close</tt>d and a new one
 *  is <tt>open</tt>ed.
 * @param {InfoBoxOptions} opt_opts
 */
InfoBox.prototype.setOptions = function (opt_opts) {
  if (typeof opt_opts.boxClass !== "undefined") { // Must be first

    this.boxClass_ = opt_opts.boxClass;
    this.setBoxStyle_();
  }
  if (typeof opt_opts.boxStyle !== "undefined") { // Must be second

    this.boxStyle_ = opt_opts.boxStyle;
    this.setBoxStyle_();
  }
  if (typeof opt_opts.content !== "undefined") {

    this.setContent(opt_opts.content);
  }
  if (typeof opt_opts.disableAutoPan !== "undefined") {

    this.disableAutoPan_ = opt_opts.disableAutoPan;
  }
  if (typeof opt_opts.maxWidth !== "undefined") {

    this.maxWidth_ = opt_opts.maxWidth;
  }
  if (typeof opt_opts.pixelOffset !== "undefined") {

    this.pixelOffset_ = opt_opts.pixelOffset;
  }
  if (typeof opt_opts.alignBottom !== "undefined") {

    this.alignBottom_ = opt_opts.alignBottom;
  }
  if (typeof opt_opts.position !== "undefined") {

    this.setPosition(opt_opts.position);
  }
  if (typeof opt_opts.zIndex !== "undefined") {

    this.setZIndex(opt_opts.zIndex);
  }
  if (typeof opt_opts.closeBoxMargin !== "undefined") {

    this.closeBoxMargin_ = opt_opts.closeBoxMargin;
  }
  if (typeof opt_opts.closeBoxURL !== "undefined") {

    this.closeBoxURL_ = opt_opts.closeBoxURL;
  }
  if (typeof opt_opts.infoBoxClearance !== "undefined") {

    this.infoBoxClearance_ = opt_opts.infoBoxClearance;
  }
  if (typeof opt_opts.isHidden !== "undefined") {

    this.isHidden_ = opt_opts.isHidden;
  }
  if (typeof opt_opts.visible !== "undefined") {

    this.isHidden_ = !opt_opts.visible;
  }
  if (typeof opt_opts.enableEventPropagation !== "undefined") {

    this.enableEventPropagation_ = opt_opts.enableEventPropagation;
  }

  if (this.div_) {

    this.draw();
  }
};

/**
 * Sets the content of the InfoBox.
 *  The content can be plain text or an HTML DOM node.
 * @param {string|Node} content
 */
InfoBox.prototype.setContent = function (content) {
  this.content_ = content;

  if (this.div_) {

    if (this.closeListener_) {

      google.maps.event.removeListener(this.closeListener_);
      this.closeListener_ = null;
    }

    // Odd code required to make things work with MSIE.
    //
    if (!this.fixedWidthSet_) {

      this.div_.style.width = "";
    }

    if (typeof content.nodeType === "undefined") {
      this.div_.innerHTML = this.getCloseBoxImg_() + content;
    } else {
      this.div_.innerHTML = this.getCloseBoxImg_();
      this.div_.appendChild(content);
    }

    // Perverse code required to make things work with MSIE.
    // (Ensures the close box does, in fact, float to the right.)
    //
    if (!this.fixedWidthSet_) {
      this.div_.style.width = this.div_.offsetWidth + "px";
      if (typeof content.nodeType === "undefined") {
        this.div_.innerHTML = this.getCloseBoxImg_() + content;
      } else {
        this.div_.innerHTML = this.getCloseBoxImg_();
        this.div_.appendChild(content);
      }
    }

    this.addClickHandler_();
  }

  /**
   * This event is fired when the content of the InfoBox changes.
   * @name InfoBox#content_changed
   * @event
   */
  google.maps.event.trigger(this, "content_changed");
};

/**
 * Sets the geographic location of the InfoBox.
 * @param {LatLng} latlng
 */
InfoBox.prototype.setPosition = function (latlng) {

  this.position_ = latlng;

  if (this.div_) {

    this.draw();
  }

  /**
   * This event is fired when the position of the InfoBox changes.
   * @name InfoBox#position_changed
   * @event
   */
  google.maps.event.trigger(this, "position_changed");
};

/**
 * Sets the zIndex style for the InfoBox.
 * @param {number} index
 */
InfoBox.prototype.setZIndex = function (index) {

  this.zIndex_ = index;

  if (this.div_) {

    this.div_.style.zIndex = index;
  }

  /**
   * This event is fired when the zIndex of the InfoBox changes.
   * @name InfoBox#zindex_changed
   * @event
   */
  google.maps.event.trigger(this, "zindex_changed");
};

/**
 * Sets the visibility of the InfoBox.
 * @param {boolean} isVisible
 */
InfoBox.prototype.setVisible = function (isVisible) {

  this.isHidden_ = !isVisible;
  if (this.div_) {
    this.div_.style.visibility = (this.isHidden_ ? "hidden" : "visible");
  }
};

/**
 * Returns the content of the InfoBox.
 * @returns {string}
 */
InfoBox.prototype.getContent = function () {

  return this.content_;
};

/**
 * Returns the geographic location of the InfoBox.
 * @returns {LatLng}
 */
InfoBox.prototype.getPosition = function () {

  return this.position_;
};

/**
 * Returns the zIndex for the InfoBox.
 * @returns {number}
 */
InfoBox.prototype.getZIndex = function () {

  return this.zIndex_;
};

/**
 * Returns a flag indicating whether the InfoBox is visible.
 * @returns {boolean}
 */
InfoBox.prototype.getVisible = function () {

  var isVisible;

  if ((typeof this.getMap() === "undefined") || (this.getMap() === null)) {
    isVisible = false;
  } else {
    isVisible = !this.isHidden_;
  }
  return isVisible;
};

/**
 * Shows the InfoBox. [Deprecated; use <tt>setVisible</tt> instead.]
 */
InfoBox.prototype.show = function () {

  this.isHidden_ = false;
  if (this.div_) {
    this.div_.style.visibility = "visible";
  }
};

/**
 * Hides the InfoBox. [Deprecated; use <tt>setVisible</tt> instead.]
 */
InfoBox.prototype.hide = function () {

  this.isHidden_ = true;
  if (this.div_) {
    this.div_.style.visibility = "hidden";
  }
};

/**
 * Adds the InfoBox to the specified map or Street View panorama. If <tt>anchor</tt>
 *  (usually a <tt>google.maps.Marker</tt>) is specified, the position
 *  of the InfoBox is set to the position of the <tt>anchor</tt>. If the
 *  anchor is dragged to a new location, the InfoBox moves as well.
 * @param {Map|StreetViewPanorama} map
 * @param {MVCObject} [anchor]
 */
InfoBox.prototype.open = function (map, anchor) {

  var me = this;

  if (anchor) {

    this.position_ = anchor.getPosition();
    this.moveListener_ = google.maps.event.addListener(anchor, "position_changed", function () {
      me.setPosition(this.getPosition());
    });

    this.mapListener_ = google.maps.event.addListener(anchor, "map_changed", function() {
      me.setMap(this.map);
    });
  }

  this.setMap(map);

  if (this.div_) {

    this.panBox_();
  }
};

/**
 * Removes the InfoBox from the map.
 */
InfoBox.prototype.close = function () {

  var i;

  if (this.closeListener_) {

    google.maps.event.removeListener(this.closeListener_);
    this.closeListener_ = null;
  }

  if (this.eventListeners_) {

    for (i = 0; i < this.eventListeners_.length; i++) {

      google.maps.event.removeListener(this.eventListeners_[i]);
    }
    this.eventListeners_ = null;
  }

  if (this.moveListener_) {

    google.maps.event.removeListener(this.moveListener_);
    this.moveListener_ = null;
  }

  if (this.mapListener_) {

    google.maps.event.removeListener(this.mapListener_);
    this.mapListener_ = null;
  }

  if (this.contextListener_) {

    google.maps.event.removeListener(this.contextListener_);
    this.contextListener_ = null;
  }

  this.setMap(null);
};

/*! jQuery UI - v1.11.4 - 2016-02-08
* http://jqueryui.com
* Includes: widget.js
* Copyright jQuery Foundation and other contributors; Licensed MIT */

(function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e(jQuery)})(function(e){var t=0,i=Array.prototype.slice;e.cleanData=function(t){return function(i){var s,n,a;for(a=0;null!=(n=i[a]);a++)try{s=e._data(n,"events"),s&&s.remove&&e(n).triggerHandler("remove")}catch(o){}t(i)}}(e.cleanData),e.widget=function(t,i,s){var n,a,o,r,h={},l=t.split(".")[0];return t=t.split(".")[1],n=l+"-"+t,s||(s=i,i=e.Widget),e.expr[":"][n.toLowerCase()]=function(t){return!!e.data(t,n)},e[l]=e[l]||{},a=e[l][t],o=e[l][t]=function(e,t){return this._createWidget?(arguments.length&&this._createWidget(e,t),void 0):new o(e,t)},e.extend(o,a,{version:s.version,_proto:e.extend({},s),_childConstructors:[]}),r=new i,r.options=e.widget.extend({},r.options),e.each(s,function(t,s){return e.isFunction(s)?(h[t]=function(){var e=function(){return i.prototype[t].apply(this,arguments)},n=function(e){return i.prototype[t].apply(this,e)};return function(){var t,i=this._super,a=this._superApply;return this._super=e,this._superApply=n,t=s.apply(this,arguments),this._super=i,this._superApply=a,t}}(),void 0):(h[t]=s,void 0)}),o.prototype=e.widget.extend(r,{widgetEventPrefix:a?r.widgetEventPrefix||t:t},h,{constructor:o,namespace:l,widgetName:t,widgetFullName:n}),a?(e.each(a._childConstructors,function(t,i){var s=i.prototype;e.widget(s.namespace+"."+s.widgetName,o,i._proto)}),delete a._childConstructors):i._childConstructors.push(o),e.widget.bridge(t,o),o},e.widget.extend=function(t){for(var s,n,a=i.call(arguments,1),o=0,r=a.length;r>o;o++)for(s in a[o])n=a[o][s],a[o].hasOwnProperty(s)&&void 0!==n&&(t[s]=e.isPlainObject(n)?e.isPlainObject(t[s])?e.widget.extend({},t[s],n):e.widget.extend({},n):n);return t},e.widget.bridge=function(t,s){var n=s.prototype.widgetFullName||t;e.fn[t]=function(a){var o="string"==typeof a,r=i.call(arguments,1),h=this;return o?this.each(function(){var i,s=e.data(this,n);return"instance"===a?(h=s,!1):s?e.isFunction(s[a])&&"_"!==a.charAt(0)?(i=s[a].apply(s,r),i!==s&&void 0!==i?(h=i&&i.jquery?h.pushStack(i.get()):i,!1):void 0):e.error("no such method '"+a+"' for "+t+" widget instance"):e.error("cannot call methods on "+t+" prior to initialization; "+"attempted to call method '"+a+"'")}):(r.length&&(a=e.widget.extend.apply(null,[a].concat(r))),this.each(function(){var t=e.data(this,n);t?(t.option(a||{}),t._init&&t._init()):e.data(this,n,new s(a,this))})),h}},e.Widget=function(){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(i,s){s=e(s||this.defaultElement||this)[0],this.element=e(s),this.uuid=t++,this.eventNamespace="."+this.widgetName+this.uuid,this.bindings=e(),this.hoverable=e(),this.focusable=e(),s!==this&&(e.data(s,this.widgetFullName,this),this._on(!0,this.element,{remove:function(e){e.target===s&&this.destroy()}}),this.document=e(s.style?s.ownerDocument:s.document||s),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this.options=e.widget.extend({},this.options,this._getCreateOptions(),i),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:e.noop,_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:e.noop,widget:function(){return this.element},option:function(t,i){var s,n,a,o=t;if(0===arguments.length)return e.widget.extend({},this.options);if("string"==typeof t)if(o={},s=t.split("."),t=s.shift(),s.length){for(n=o[t]=e.widget.extend({},this.options[t]),a=0;s.length-1>a;a++)n[s[a]]=n[s[a]]||{},n=n[s[a]];if(t=s.pop(),1===arguments.length)return void 0===n[t]?null:n[t];n[t]=i}else{if(1===arguments.length)return void 0===this.options[t]?null:this.options[t];o[t]=i}return this._setOptions(o),this},_setOptions:function(e){var t;for(t in e)this._setOption(t,e[t]);return this},_setOption:function(e,t){return this.options[e]=t,"disabled"===e&&(this.widget().toggleClass(this.widgetFullName+"-disabled",!!t),t&&(this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus"))),this},enable:function(){return this._setOptions({disabled:!1})},disable:function(){return this._setOptions({disabled:!0})},_on:function(t,i,s){var n,a=this;"boolean"!=typeof t&&(s=i,i=t,t=!1),s?(i=n=e(i),this.bindings=this.bindings.add(i)):(s=i,i=this.element,n=this.widget()),e.each(s,function(s,o){function r(){return t||a.options.disabled!==!0&&!e(this).hasClass("ui-state-disabled")?("string"==typeof o?a[o]:o).apply(a,arguments):void 0}"string"!=typeof o&&(r.guid=o.guid=o.guid||r.guid||e.guid++);var h=s.match(/^([\w:-]*)\s*(.*)$/),l=h[1]+a.eventNamespace,u=h[2];u?n.delegate(u,l,r):i.bind(l,r)})},_off:function(t,i){i=(i||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,t.unbind(i).undelegate(i),this.bindings=e(this.bindings.not(t).get()),this.focusable=e(this.focusable.not(t).get()),this.hoverable=e(this.hoverable.not(t).get())},_delay:function(e,t){function i(){return("string"==typeof e?s[e]:e).apply(s,arguments)}var s=this;return setTimeout(i,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){e(t.currentTarget).addClass("ui-state-hover")},mouseleave:function(t){e(t.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){e(t.currentTarget).addClass("ui-state-focus")},focusout:function(t){e(t.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(t,i,s){var n,a,o=this.options[t];if(s=s||{},i=e.Event(i),i.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),i.target=this.element[0],a=i.originalEvent)for(n in a)n in i||(i[n]=a[n]);return this.element.trigger(i,s),!(e.isFunction(o)&&o.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},e.each({show:"fadeIn",hide:"fadeOut"},function(t,i){e.Widget.prototype["_"+t]=function(s,n,a){"string"==typeof n&&(n={effect:n});var o,r=n?n===!0||"number"==typeof n?i:n.effect||i:t;n=n||{},"number"==typeof n&&(n={duration:n}),o=!e.isEmptyObject(n),n.complete=a,n.delay&&s.delay(n.delay),o&&e.effects&&e.effects.effect[r]?s[t](n):r!==t&&s[r]?s[r](n.duration,n.easing,a):s.queue(function(i){e(this)[t](),a&&a.call(s[0]),i()})}}),e.widget});
/*
 jQuery Masked Input Plugin
 Copyright (c) 2007 - 2015 Josh Bush (digitalbush.com)
 Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license)
 Version: 1.4.1
 */
!function (factory) {
    "function" == typeof define && define.amd ? define(["jquery"], factory) : factory("object" == typeof exports ? require("jquery") : jQuery);
}(function ($) {
    var caretTimeoutId, ua = navigator.userAgent, iPhone = /iphone/i.test(ua), chrome = /chrome/i.test(ua), android = /android/i.test(ua);
    $.mask = {
        definitions: {
            "9": "[0-9]",
            a: "[A-Za-z]",
            "*": "[A-Za-z0-9]"
        },
        autoclear: !0,
        dataName: "rawMaskFn",
        placeholder: "_"
    }, $.fn.extend({
        caret: function (begin, end) {
            var range;
            if (0 !== this.length && !this.is(":hidden")) {
                return "number" == typeof begin ? (end = "number" == typeof end ? end : begin,
                    this.each(function () {
                        this.setSelectionRange ? this.setSelectionRange(begin, end) : this.createTextRange && (range = this.createTextRange(),
                            range.collapse(!0), range.moveEnd("character", end), range.moveStart("character", begin),
                            range.select());
                    })) : (this[0].setSelectionRange ? (begin = this[0].selectionStart, end = this[0].selectionEnd) : document.selection && document.selection.createRange && (range = document.selection.createRange(),
                    begin = 0 - range.duplicate().moveStart("character", -1e5), end = begin + range.text.length),
                {
                    begin: begin,
                    end: end
                });
            }
        },
        unmask: function () {
            return this.trigger("unmask");
        },
        mask: function (mask, settings) {
            var input, defs, tests, partialPosition, firstNonMaskPos, lastRequiredNonMaskPos, len, oldVal;
            if (!mask && this.length > 0) {
                input = $(this[0]);
                var fn = input.data($.mask.dataName);
                return fn ? fn() : void 0;
            }
            return settings = $.extend({
                autoclear: $.mask.autoclear,
                placeholder: $.mask.placeholder,
                completed: null
            }, settings), defs = $.mask.definitions, tests = [], partialPosition = len = mask.length,
                firstNonMaskPos = null, $.each(mask.split(""), function (i, c) {
                "?" == c ? (len--, partialPosition = i) : defs[c] ? (tests.push(new RegExp(defs[c])),
                null === firstNonMaskPos && (firstNonMaskPos = tests.length - 1), partialPosition > i && (lastRequiredNonMaskPos = tests.length - 1)) : tests.push(null);
            }), this.trigger("unmask").each(function () {
                function tryFireCompleted() {
                    if (settings.completed) {
                        for (var i = firstNonMaskPos; lastRequiredNonMaskPos >= i; i++) if (tests[i] && buffer[i] === getPlaceholder(i)) {
                            return;
                        }
                        settings.completed.call(input);
                    }
                }

                function getPlaceholder(i) {
                    return settings.placeholder.charAt(i < settings.placeholder.length ? i : 0);
                }

                function seekNext(pos) {
                    for (; ++pos < len && !tests[pos];) ;
                    return pos;
                }

                function seekPrev(pos) {
                    for (; --pos >= 0 && !tests[pos];) ;
                    return pos;
                }

                function shiftL(begin, end) {
                    var i, j;
                    if (!(0 > begin)) {
                        for (i = begin, j = seekNext(end); len > i; i++) if (tests[i]) {
                            if (!(len > j && tests[i].test(buffer[j]))) {
                                break;
                            }
                            buffer[i] = buffer[j], buffer[j] = getPlaceholder(j), j = seekNext(j);
                        }
                        writeBuffer(), input.caret(Math.max(firstNonMaskPos, begin));
                    }
                }

                function shiftR(pos) {
                    var i, c, j, t;
                    for (i = pos, c = getPlaceholder(pos); len > i; i++) if (tests[i]) {
                        if (j = seekNext(i), t = buffer[i], buffer[i] = c, !(len > j && tests[j].test(t))) {
                            break;
                        }
                        c = t;
                    }
                }

                function androidInputEvent() {
                    var curVal = input.val(), pos = input.caret();
                    if (oldVal && oldVal.length && oldVal.length > curVal.length) {
                        for (checkVal(!0); pos.begin > 0 && !tests[pos.begin - 1];) pos.begin--;
                        if (0 === pos.begin) {
                            for (; pos.begin < firstNonMaskPos && !tests[pos.begin];) pos.begin++;
                        }
                        input.caret(pos.begin, pos.begin);
                    } else {
                        for (checkVal(!0); pos.begin < len && !tests[pos.begin];) pos.begin++;
                        input.caret(pos.begin, pos.begin);
                    }
                    tryFireCompleted();
                }

                function blurEvent() {
                    checkVal(), input.val() != focusText && input.change();
                }

                function keydownEvent(e) {
                    if (!input.prop("readonly")) {
                        var pos, begin, end, k = e.which || e.keyCode;
                        oldVal = input.val(), 8 === k || 46 === k || iPhone && 127 === k ? (pos = input.caret(),
                            begin = pos.begin, end = pos.end, end - begin === 0 && (begin = 46 !== k ? seekPrev(begin) : end = seekNext(begin - 1),
                            end = 46 === k ? seekNext(end) : end), clearBuffer(begin, end), shiftL(begin, end - 1),
                            e.preventDefault()) : 13 === k ? blurEvent.call(this, e) : 27 === k && (input.val(focusText),
                            input.caret(0, checkVal()), e.preventDefault());
                    }
                }

                function keypressEvent(e) {
                    if (!input.prop("readonly")) {
                        var p, c, next, k = e.which || e.keyCode, pos = input.caret();
                        if (!(e.ctrlKey || e.altKey || e.metaKey || 32 > k) && k && 13 !== k) {
                            if (pos.end - pos.begin !== 0 && (clearBuffer(pos.begin, pos.end), shiftL(pos.begin, pos.end - 1)),
                                    p = seekNext(pos.begin - 1), len > p && (c = String.fromCharCode(k), tests[p].test(c))) {
                                if (shiftR(p), buffer[p] = c, writeBuffer(), next = seekNext(p), android) {
                                    var proxy = function () {
                                        $.proxy($.fn.caret, input, next)();
                                    };
                                    setTimeout(proxy, 0);
                                } else {
                                    input.caret(next);
                                }
                                pos.begin <= lastRequiredNonMaskPos && tryFireCompleted();
                            }
                            e.preventDefault();
                        }
                    }
                }

                function clearBuffer(start, end) {
                    var i;
                    for (i = start; end > i && len > i; i++) tests[i] && (buffer[i] = getPlaceholder(i));
                }

                function writeBuffer() {
                    input.val(buffer.join(""));
                }

                function checkVal(allow) {
                    var i, c, pos, test = input.val(), lastMatch = -1;
                    for (i = 0, pos = 0; len > i; i++) if (tests[i]) {
                        for (buffer[i] = getPlaceholder(i); pos++ < test.length;) if (c = test.charAt(pos - 1),
                                tests[i].test(c)) {
                            buffer[i] = c, lastMatch = i;
                            break;
                        }
                        if (pos > test.length) {
                            clearBuffer(i + 1, len);
                            break;
                        }
                    } else {
                        buffer[i] === test.charAt(pos) && pos++, partialPosition > i && (lastMatch = i);
                    }
                    return allow ? writeBuffer() : partialPosition > lastMatch + 1 ? settings.autoclear || buffer.join("") === defaultBuffer ? (input.val() && input.val(""),
                        clearBuffer(0, len)) : writeBuffer() : (writeBuffer(), input.val(input.val().substring(0, lastMatch + 1))),
                        partialPosition ? i : firstNonMaskPos;
                }

                var input = $(this), buffer = $.map(mask.split(""), function (c, i) {
                    return "?" != c ? defs[c] ? getPlaceholder(i) : c : void 0;
                }), defaultBuffer = buffer.join(""), focusText = input.val();
                input.data($.mask.dataName, function () {
                    return $.map(buffer, function (c, i) {
                        return tests[i] && c != getPlaceholder(i) ? c : null;
                    }).join("");
                }), input.one("unmask", function () {
                    input.off(".mask").removeData($.mask.dataName);
                }).on("focus.mask", function () {
                    if (!input.prop("readonly")) {
                        clearTimeout(caretTimeoutId);
                        var pos;
                        focusText = input.val(), pos = checkVal(), caretTimeoutId = setTimeout(function () {
                            input.get(0) === document.activeElement && (writeBuffer(), pos == mask.replace("?", "").length ? input.caret(0, pos) : input.caret(pos));
                        }, 10);
                    }
                }).on("blur.mask", blurEvent).on("keydown.mask", keydownEvent).on("keypress.mask", keypressEvent).on("input.mask paste.mask", function () {
                    input.prop("readonly") || setTimeout(function () {
                        var pos = checkVal(!0);
                        input.caret(pos), tryFireCompleted();
                    }, 0);
                }), chrome && android && input.off("input.mask").on("input.mask", androidInputEvent),
                    checkVal();
            });
        }
    });
});

// Simple JavaScript Templating
(function(){
    var cache = {};

    this.tmpl = function tmpl(str, data){
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.

        var fn = !/\W/.test(str) ?
            cache[str] = cache[str] ||
                tmpl(document.getElementById(str).innerHTML) :

            // Generate a reusable function that will serve as a template
            // generator (and which will be cached).
            new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +

                // Introduce the data as local variables using with(){}
                "with(obj){p.push('" +

                // Convert the template into pure JavaScript
                str
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'")
                + "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn( data ) : fn;
    };
})();
/*!
 * Bootstrap v3.3.7 (http://getbootstrap.com)
 * Copyright 2011-2017 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

/*!
 * Generated using the Bootstrap Customizer (http://getbootstrap.com/customize/?id=d8d3473a3c0f595994a89d24198f9c73)
 * Config saved to config.json and https://gist.github.com/d8d3473a3c0f595994a89d24198f9c73
 */
if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}
+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.7
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.7'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'top'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      if (that.$element) { // TODO: Check whether guarding this code with this `if` is really necessary.
        that.$element
          .removeAttr('aria-describedby')
          .trigger('hidden.bs.' + that.type)
      }
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var isSvg = window.SVGElement && el instanceof window.SVGElement
    // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
    // See https://github.com/twbs/bootstrap/issues/20280
    var elOffset  = isBody ? { top: 0, left: 0 } : (isSvg ? null : $element.offset())
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
      that.$element = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.7
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.7'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/*!
 * Bootstrap-select v1.12.2 (http://silviomoreto.github.io/bootstrap-select)
 *
 * Copyright 2013-2017 bootstrap-select
 * Licensed under MIT (https://github.com/silviomoreto/bootstrap-select/blob/master/LICENSE)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["jquery"], function (a0) {
      return (factory(a0));
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    factory(root["jQuery"]);
  }
}(this, function (jQuery) {

(function ($) {
  'use strict';

  //<editor-fold desc="Shims">
  if (!String.prototype.includes) {
    (function () {
      'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
      var toString = {}.toString;
      var defineProperty = (function () {
        // IE 8 only supports `Object.defineProperty` on DOM elements
        try {
          var object = {};
          var $defineProperty = Object.defineProperty;
          var result = $defineProperty(object, object, object) && $defineProperty;
        } catch (error) {
        }
        return result;
      }());
      var indexOf = ''.indexOf;
      var includes = function (search) {
        if (this == null) {
          throw new TypeError();
        }
        var string = String(this);
        if (search && toString.call(search) == '[object RegExp]') {
          throw new TypeError();
        }
        var stringLength = string.length;
        var searchString = String(search);
        var searchLength = searchString.length;
        var position = arguments.length > 1 ? arguments[1] : undefined;
        // `ToInteger`
        var pos = position ? Number(position) : 0;
        if (pos != pos) { // better `isNaN`
          pos = 0;
        }
        var start = Math.min(Math.max(pos, 0), stringLength);
        // Avoid the `indexOf` call if no match is possible
        if (searchLength + start > stringLength) {
          return false;
        }
        return indexOf.call(string, searchString, pos) != -1;
      };
      if (defineProperty) {
        defineProperty(String.prototype, 'includes', {
          'value': includes,
          'configurable': true,
          'writable': true
        });
      } else {
        String.prototype.includes = includes;
      }
    }());
  }

  if (!String.prototype.startsWith) {
    (function () {
      'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
      var defineProperty = (function () {
        // IE 8 only supports `Object.defineProperty` on DOM elements
        try {
          var object = {};
          var $defineProperty = Object.defineProperty;
          var result = $defineProperty(object, object, object) && $defineProperty;
        } catch (error) {
        }
        return result;
      }());
      var toString = {}.toString;
      var startsWith = function (search) {
        if (this == null) {
          throw new TypeError();
        }
        var string = String(this);
        if (search && toString.call(search) == '[object RegExp]') {
          throw new TypeError();
        }
        var stringLength = string.length;
        var searchString = String(search);
        var searchLength = searchString.length;
        var position = arguments.length > 1 ? arguments[1] : undefined;
        // `ToInteger`
        var pos = position ? Number(position) : 0;
        if (pos != pos) { // better `isNaN`
          pos = 0;
        }
        var start = Math.min(Math.max(pos, 0), stringLength);
        // Avoid the `indexOf` call if no match is possible
        if (searchLength + start > stringLength) {
          return false;
        }
        var index = -1;
        while (++index < searchLength) {
          if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
            return false;
          }
        }
        return true;
      };
      if (defineProperty) {
        defineProperty(String.prototype, 'startsWith', {
          'value': startsWith,
          'configurable': true,
          'writable': true
        });
      } else {
        String.prototype.startsWith = startsWith;
      }
    }());
  }

  if (!Object.keys) {
    Object.keys = function (
      o, // object
      k, // key
      r  // result array
      ){
      // initialize object and result
      r=[];
      // iterate over object keys
      for (k in o)
          // fill result array with non-prototypical keys
        r.hasOwnProperty.call(o, k) && r.push(k);
      // return result
      return r;
    };
  }

  // set data-selected on select element if the value has been programmatically selected
  // prior to initialization of bootstrap-select
  // * consider removing or replacing an alternative method *
  var valHooks = {
    useDefault: false,
    _set: $.valHooks.select.set
  };

  $.valHooks.select.set = function(elem, value) {
    if (value && !valHooks.useDefault) $(elem).data('selected', true);

    return valHooks._set.apply(this, arguments);
  };

  var changed_arguments = null;
  $.fn.triggerNative = function (eventName) {
    var el = this[0],
        event;

    if (el.dispatchEvent) { // for modern browsers & IE9+
      if (typeof Event === 'function') {
        // For modern browsers
        event = new Event(eventName, {
          bubbles: true
        });
      } else {
        // For IE since it doesn't support Event constructor
        event = document.createEvent('Event');
        event.initEvent(eventName, true, false);
      }

      el.dispatchEvent(event);
    } else if (el.fireEvent) { // for IE8
      event = document.createEventObject();
      event.eventType = eventName;
      el.fireEvent('on' + eventName, event);
    } else {
      // fall back to jQuery.trigger
      this.trigger(eventName);
    }
  };
  //</editor-fold>

  // Case insensitive contains search
  $.expr.pseudos.icontains = function (obj, index, meta) {
    var $obj = $(obj).find('a');
    var haystack = ($obj.data('tokens') || $obj.text()).toString().toUpperCase();
    return haystack.includes(meta[3].toUpperCase());
  };

  // Case insensitive begins search
  $.expr.pseudos.ibegins = function (obj, index, meta) {
    var $obj = $(obj).find('a');
    var haystack = ($obj.data('tokens') || $obj.text()).toString().toUpperCase();
    return haystack.startsWith(meta[3].toUpperCase());
  };

  // Case and accent insensitive contains search
  $.expr.pseudos.aicontains = function (obj, index, meta) {
    var $obj = $(obj).find('a');
    var haystack = ($obj.data('tokens') || $obj.data('normalizedText') || $obj.text()).toString().toUpperCase();
    return haystack.includes(meta[3].toUpperCase());
  };

  // Case and accent insensitive begins search
  $.expr.pseudos.aibegins = function (obj, index, meta) {
    var $obj = $(obj).find('a');
    var haystack = ($obj.data('tokens') || $obj.data('normalizedText') || $obj.text()).toString().toUpperCase();
    return haystack.startsWith(meta[3].toUpperCase());
  };

  /**
   * Remove all diatrics from the given text.
   * @access private
   * @param {String} text
   * @returns {String}
   */
  function normalizeToBase(text) {
    var rExps = [
      {re: /[\xC0-\xC6]/g, ch: "A"},
      {re: /[\xE0-\xE6]/g, ch: "a"},
      {re: /[\xC8-\xCB]/g, ch: "E"},
      {re: /[\xE8-\xEB]/g, ch: "e"},
      {re: /[\xCC-\xCF]/g, ch: "I"},
      {re: /[\xEC-\xEF]/g, ch: "i"},
      {re: /[\xD2-\xD6]/g, ch: "O"},
      {re: /[\xF2-\xF6]/g, ch: "o"},
      {re: /[\xD9-\xDC]/g, ch: "U"},
      {re: /[\xF9-\xFC]/g, ch: "u"},
      {re: /[\xC7-\xE7]/g, ch: "c"},
      {re: /[\xD1]/g, ch: "N"},
      {re: /[\xF1]/g, ch: "n"}
    ];
    $.each(rExps, function () {
      text = text ? text.replace(this.re, this.ch) : '';
    });
    return text;
  }


  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };

  var unescapeMap = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x60;': '`'
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + Object.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };

  var htmlEscape = createEscaper(escapeMap);
  var htmlUnescape = createEscaper(unescapeMap);

  var Selectpicker = function (element, options) {
    // bootstrap-select has been initialized - revert valHooks.select.set back to its original function
    if (!valHooks.useDefault) {
      $.valHooks.select.set = valHooks._set;
      valHooks.useDefault = true;
    }

    this.$element = $(element);
    this.$newElement = null;
    this.$button = null;
    this.$menu = null;
    this.$lis = null;
    this.options = options;

    // If we have no title yet, try to pull it from the html title attribute (jQuery doesnt' pick it up as it's not a
    // data-attribute)
    if (this.options.title === null) {
      this.options.title = this.$element.attr('title');
    }

    // Format window padding
    var winPad = this.options.windowPadding;
    if (typeof winPad === 'number') {
      this.options.windowPadding = [winPad, winPad, winPad, winPad];
    }

    //Expose public methods
    this.val = Selectpicker.prototype.val;
    this.render = Selectpicker.prototype.render;
    this.refresh = Selectpicker.prototype.refresh;
    this.setStyle = Selectpicker.prototype.setStyle;
    this.selectAll = Selectpicker.prototype.selectAll;
    this.deselectAll = Selectpicker.prototype.deselectAll;
    this.destroy = Selectpicker.prototype.destroy;
    this.remove = Selectpicker.prototype.remove;
    this.show = Selectpicker.prototype.show;
    this.hide = Selectpicker.prototype.hide;

    this.init();
  };

  Selectpicker.VERSION = '1.12.2';

  // part of this is duplicated in i18n/defaults-en_US.js. Make sure to update both.
  Selectpicker.DEFAULTS = {
    noneSelectedText: 'Nothing selected',
    noneResultsText: 'No results matched {0}',
    countSelectedText: function (numSelected, numTotal) {
      return (numSelected == 1) ? "{0} item selected" : "{0} items selected";
    },
    maxOptionsText: function (numAll, numGroup) {
      return [
        (numAll == 1) ? 'Limit reached ({n} item max)' : 'Limit reached ({n} items max)',
        (numGroup == 1) ? 'Group limit reached ({n} item max)' : 'Group limit reached ({n} items max)'
      ];
    },
    selectAllText: 'Select All',
    deselectAllText: 'Deselect All',
    doneButton: false,
    doneButtonText: 'Close',
    multipleSeparator: ', ',
    styleBase: 'bbtn',
    style: 'bbtn-default',
    size: 'auto',
    title: null,
    selectedTextFormat: 'values',
    width: false,
    container: false,
    hideDisabled: false,
    showSubtext: false,
    showIcon: true,
    showContent: true,
    dropupAuto: true,
    header: false,
    liveSearch: false,
    liveSearchPlaceholder: null,
    liveSearchNormalize: false,
    liveSearchStyle: 'contains',
    actionsBox: false,
    iconBase: 'glyphicon',
    tickIcon: 'glyphicon-ok',
    showTick: false,
    template: {
      caret: '<span class="caret"></span>'
    },
    maxOptions: false,
    mobile: false,
    selectOnTab: false,
    dropdownAlignRight: false,
    windowPadding: 0
  };

  Selectpicker.prototype = {

    constructor: Selectpicker,

    init: function () {
      var that = this,
          id = this.$element.attr('id');

      this.$element.addClass('bs-select-hidden');

      // store originalIndex (key) and newIndex (value) in this.liObj for fast accessibility
      // allows us to do this.$lis.eq(that.liObj[index]) instead of this.$lis.filter('[data-original-index="' + index + '"]')
      this.liObj = {};
      this.multiple = this.$element.prop('multiple');
      this.autofocus = this.$element.prop('autofocus');
      this.$newElement = this.createView();
      this.$element
        .after(this.$newElement)
        .appendTo(this.$newElement);
      this.$button = this.$newElement.children('button');
      this.$menu = this.$newElement.children('.dropdown-menu');
      this.$menuInner = this.$menu.children('.inner');
      this.$searchbox = this.$menu.find('input');

      this.$element.removeClass('bs-select-hidden');

      if (this.options.dropdownAlignRight === true) this.$menu.addClass('dropdown-menu-right');

      if (typeof id !== 'undefined') {
        this.$button.attr('data-id', id);
        $('label[for="' + id + '"]').click(function (e) {
          e.preventDefault();
          that.$button.focus();
        });
      }

      this.checkDisabled();
      this.clickListener();
      if (this.options.liveSearch) this.liveSearchListener();
      this.render();
      this.setStyle();
      this.setWidth();
      if (this.options.container) this.selectPosition();
      this.$menu.data('this', this);
      this.$newElement.data('this', this);
      if (this.options.mobile) this.mobile();

      this.$newElement.on({
        'hide.bs.dropdown': function (e) {
          that.$menuInner.attr('aria-expanded', false);
          that.$element.trigger('hide.bs.select', e);
        },
        'hidden.bs.dropdown': function (e) {
          that.$element.trigger('hidden.bs.select', e);
        },
        'show.bs.dropdown': function (e) {
          that.$menuInner.attr('aria-expanded', true);
          that.$element.trigger('show.bs.select', e);
        },
        'shown.bs.dropdown': function (e) {
          that.$element.trigger('shown.bs.select', e);
        }
      });

      if (that.$element[0].hasAttribute('required')) {
        this.$element.on('invalid', function () {
          that.$button
            .addClass('bs-invalid')
            .focus();

          that.$element.on({
            'focus.bs.select': function () {
              that.$button.focus();
              that.$element.off('focus.bs.select');
            },
            'shown.bs.select': function () {
              that.$element
                .val(that.$element.val()) // set the value to hide the validation message in Chrome when menu is opened
                .off('shown.bs.select');
            },
            'rendered.bs.select': function () {
              // if select is no longer invalid, remove the bs-invalid class
              if (this.validity.valid) that.$button.removeClass('bs-invalid');
              that.$element.off('rendered.bs.select');
            }
          });
        });
      }

      setTimeout(function () {
        that.$element.trigger('loaded.bs.select');
      });
    },

    createDropdown: function () {
      // Options
      // If we are multiple or showTick option is set, then add the show-tick class
      var showTick = (this.multiple || this.options.showTick) ? ' show-tick' : '',
          inputGroup = this.$element.parent().hasClass('input-group') ? ' input-group-bbtn' : '',
          autofocus = this.autofocus ? ' autofocus' : '';
      // Elements
      var header = this.options.header ? '<div class="popover-title"><button type="button" class="close" aria-hidden="true">&times;</button>' + this.options.header + '</div>' : '';
      var searchbox = this.options.liveSearch ?
      '<div class="bs-searchbox">' +
      '<input type="text" class="form-control" autocomplete="off"' +
      (null === this.options.liveSearchPlaceholder ? '' : ' placeholder="' + htmlEscape(this.options.liveSearchPlaceholder) + '"') + ' role="textbox" aria-label="Search">' +
      '</div>'
          : '';
      var actionsbox = this.multiple && this.options.actionsBox ?
      '<div class="bs-actionsbox">' +
      '<div class="bbtn-group bbtn-group-sm bbtn-block">' +
      '<button type="button" class="actions-bbtn bs-select-all bbtn bbtn-default">' +
      this.options.selectAllText +
      '</button>' +
      '<button type="button" class="actions-bbtn bs-deselect-all bbtn bbtn-default">' +
      this.options.deselectAllText +
      '</button>' +
      '</div>' +
      '</div>'
          : '';
      var donebutton = this.multiple && this.options.doneButton ?
      '<div class="bs-donebutton">' +
      '<div class="bbtn-group bbtn-block">' +
      '<button type="button" class="bbtn bbtn-sm bbtn-default">' +
      this.options.doneButtonText +
      '</button>' +
      '</div>' +
      '</div>'
          : '';
      var drop =
          '<div class="bbtn-group bootstrap-select' + showTick + inputGroup + '">' +
          '<button type="button" class="' + this.options.styleBase + ' dropdown-toggle" data-toggle="dropdown"' + autofocus + ' role="button">' +
          '<span class="filter-option pull-left"></span>&nbsp;' +
          '<span class="bs-caret">' +
          this.options.template.caret +
          '</span>' +
          '</button>' +
          '<div class="dropdown-menu open" role="combobox">' +
          header +
          searchbox +
          actionsbox +
          '<ul class="dropdown-menu inner" role="listbox" aria-expanded="false">' +
          '</ul>' +
          donebutton +
          '</div>' +
          '</div>';

      return $(drop);
    },

    createView: function () {
      var $drop = this.createDropdown(),
          li = this.createLi();

      $drop.find('ul')[0].innerHTML = li;
      return $drop;
    },

    reloadLi: function () {
      // rebuild
      var li = this.createLi();
      this.$menuInner[0].innerHTML = li;
    },

    createLi: function () {
      var that = this,
          _li = [],
          optID = 0,
          titleOption = document.createElement('option'),
          liIndex = -1; // increment liIndex whenever a new <li> element is created to ensure liObj is correct

      // Helper functions
      /**
       * @param content
       * @param [index]
       * @param [classes]
       * @param [optgroup]
       * @returns {string}
       */
      var generateLI = function (content, index, classes, optgroup) {
        return '<li' +
            ((typeof classes !== 'undefined' & '' !== classes) ? ' class="' + classes + '"' : '') +
            ((typeof index !== 'undefined' & null !== index) ? ' data-original-index="' + index + '"' : '') +
            ((typeof optgroup !== 'undefined' & null !== optgroup) ? 'data-optgroup="' + optgroup + '"' : '') +
            '>' + content + '</li>';
      };

      /**
       * @param text
       * @param [classes]
       * @param [inline]
       * @param [tokens]
       * @returns {string}
       */
      var generateA = function (text, classes, inline, tokens) {
        return '<a tabindex="0"' +
            (typeof classes !== 'undefined' ? ' class="' + classes + '"' : '') +
            (inline ? ' style="' + inline + '"' : '') +
            (that.options.liveSearchNormalize ? ' data-normalized-text="' + normalizeToBase(htmlEscape($(text).html())) + '"' : '') +
            (typeof tokens !== 'undefined' || tokens !== null ? ' data-tokens="' + tokens + '"' : '') +
            ' role="option">' + text +
            '<span class="' + that.options.iconBase + ' ' + that.options.tickIcon + ' check-mark"></span>' +
            '</a>';
      };

      if (this.options.title && !this.multiple) {
        // this option doesn't create a new <li> element, but does add a new option, so liIndex is decreased
        // since liObj is recalculated on every refresh, liIndex needs to be decreased even if the titleOption is already appended
        liIndex--;

        if (!this.$element.find('.bs-title-option').length) {
          // Use native JS to prepend option (faster)
          var element = this.$element[0];
          titleOption.className = 'bs-title-option';
          titleOption.innerHTML = this.options.title;
          titleOption.value = '';
          element.insertBefore(titleOption, element.firstChild);
          // Check if selected or data-selected attribute is already set on an option. If not, select the titleOption option.
          // the selected item may have been changed by user or programmatically before the bootstrap select plugin runs,
          // if so, the select will have the data-selected attribute
          var $opt = $(element.options[element.selectedIndex]);
          if ($opt.attr('selected') === undefined && this.$element.data('selected') === undefined) {
            titleOption.selected = true;
          }
        }
      }

      var $selectOptions = this.$element.find('option');

      $selectOptions.each(function (index) {
        var $this = $(this);

        liIndex++;

        if ($this.hasClass('bs-title-option')) return;

        // Get the class and text for the option
        var optionClass = this.className || '',
            inline = htmlEscape(this.style.cssText),
            text = $this.data('content') ? $this.data('content') : $this.html(),
            tokens = $this.data('tokens') ? $this.data('tokens') : null,
            subtext = typeof $this.data('subtext') !== 'undefined' ? '<small class="text-muted">' + $this.data('subtext') + '</small>' : '',
            icon = typeof $this.data('icon') !== 'undefined' ? '<span class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></span> ' : '',
            $parent = $this.parent(),
            isOptgroup = $parent[0].tagName === 'OPTGROUP',
            isOptgroupDisabled = isOptgroup && $parent[0].disabled,
            isDisabled = this.disabled || isOptgroupDisabled,
            prevHiddenIndex;

        if (icon !== '' && isDisabled) {
          icon = '<span>' + icon + '</span>';
        }

        if (that.options.hideDisabled && (isDisabled && !isOptgroup || isOptgroupDisabled)) {
          // set prevHiddenIndex - the index of the first hidden option in a group of hidden options
          // used to determine whether or not a divider should be placed after an optgroup if there are
          // hidden options between the optgroup and the first visible option
          prevHiddenIndex = $this.data('prevHiddenIndex');
          $this.next().data('prevHiddenIndex', (prevHiddenIndex !== undefined ? prevHiddenIndex : index));

          liIndex--;
          return;
        }

        if (!$this.data('content')) {
          // Prepend any icon and append any subtext to the main text.
          text = icon + '<span class="text">' + text + subtext + '</span>';
        }

        if (isOptgroup && $this.data('divider') !== true) {
          if (that.options.hideDisabled && isDisabled) {
            if ($parent.data('allOptionsDisabled') === undefined) {
              var $options = $parent.children();
              $parent.data('allOptionsDisabled', $options.filter(':disabled').length === $options.length);
            }

            if ($parent.data('allOptionsDisabled')) {
              liIndex--;
              return;
            }
          }

          var optGroupClass = ' ' + $parent[0].className || '';

          if ($this.index() === 0) { // Is it the first option of the optgroup?
            optID += 1;

            // Get the opt group label
            var label = $parent[0].label,
                labelSubtext = typeof $parent.data('subtext') !== 'undefined' ? '<small class="text-muted">' + $parent.data('subtext') + '</small>' : '',
                labelIcon = $parent.data('icon') ? '<span class="' + that.options.iconBase + ' ' + $parent.data('icon') + '"></span> ' : '';

            label = labelIcon + '<span class="text">' + htmlEscape(label) + labelSubtext + '</span>';

            if (index !== 0 && _li.length > 0) { // Is it NOT the first option of the select && are there elements in the dropdown?
              liIndex++;
              _li.push(generateLI('', null, 'divider', optID + 'div'));
            }
            liIndex++;
            _li.push(generateLI(label, null, 'dropdown-header' + optGroupClass, optID));
          }

          if (that.options.hideDisabled && isDisabled) {
            liIndex--;
            return;
          }

          _li.push(generateLI(generateA(text, 'opt ' + optionClass + optGroupClass, inline, tokens), index, '', optID));
        } else if ($this.data('divider') === true) {
          _li.push(generateLI('', index, 'divider'));
        } else if ($this.data('hidden') === true) {
          // set prevHiddenIndex - the index of the first hidden option in a group of hidden options
          // used to determine whether or not a divider should be placed after an optgroup if there are
          // hidden options between the optgroup and the first visible option
          prevHiddenIndex = $this.data('prevHiddenIndex');
          $this.next().data('prevHiddenIndex', (prevHiddenIndex !== undefined ? prevHiddenIndex : index));

          _li.push(generateLI(generateA(text, optionClass, inline, tokens), index, 'hidden is-hidden'));
        } else {
          var showDivider = this.previousElementSibling && this.previousElementSibling.tagName === 'OPTGROUP';

          // if previous element is not an optgroup and hideDisabled is true
          if (!showDivider && that.options.hideDisabled) {
            prevHiddenIndex = $this.data('prevHiddenIndex');

            if (prevHiddenIndex !== undefined) {
              // select the element **before** the first hidden element in the group
              var prevHidden = $selectOptions.eq(prevHiddenIndex)[0].previousElementSibling;

              if (prevHidden && prevHidden.tagName === 'OPTGROUP' && !prevHidden.disabled) {
                showDivider = true;
              }
            }
          }

          if (showDivider) {
            liIndex++;
            _li.push(generateLI('', null, 'divider', optID + 'div'));
          }
          _li.push(generateLI(generateA(text, optionClass, inline, tokens), index));
        }

        that.liObj[index] = liIndex;
      });

      //If we are not multiple, we don't have a selected item, and we don't have a title, select the first element so something is set in the button
      if (!this.multiple && this.$element.find('option:selected').length === 0 && !this.options.title) {
        this.$element.find('option').eq(0).prop('selected', true).attr('selected', 'selected');
      }

      return _li.join('');
    },

    findLis: function () {
      if (this.$lis == null) this.$lis = this.$menu.find('li');
      return this.$lis;
    },

    /**
     * @param [updateLi] defaults to true
     */
    render: function (updateLi) {
      var that = this,
          notDisabled,
          $selectOptions = this.$element.find('option');

      //Update the LI to match the SELECT
      if (updateLi !== false) {
        $selectOptions.each(function (index) {
          var $lis = that.findLis().eq(that.liObj[index]);

          that.setDisabled(index, this.disabled || this.parentNode.tagName === 'OPTGROUP' && this.parentNode.disabled, $lis);
          that.setSelected(index, this.selected, $lis);
        });
      }

      this.togglePlaceholder();

      this.tabIndex();

      var selectedItems = $selectOptions.map(function () {
        if (this.selected) {
          if (that.options.hideDisabled && (this.disabled || this.parentNode.tagName === 'OPTGROUP' && this.parentNode.disabled)) return;

          var $this = $(this),
              icon = $this.data('icon') && that.options.showIcon ? '<i class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></i> ' : '',
              subtext;

          if (that.options.showSubtext && $this.data('subtext') && !that.multiple) {
            subtext = ' <small class="text-muted">' + $this.data('subtext') + '</small>';
          } else {
            subtext = '';
          }
          if (typeof $this.attr('title') !== 'undefined') {
            return $this.attr('title');
          } else if ($this.data('content') && that.options.showContent) {
            return $this.data('content').toString();
          } else {
            return icon + $this.html() + subtext;
          }
        }
      }).toArray();

      //Fixes issue in IE10 occurring when no default option is selected and at least one option is disabled
      //Convert all the values into a comma delimited string
      var title = !this.multiple ? selectedItems[0] : selectedItems.join(this.options.multipleSeparator);

      //If this is multi select, and the selectText type is count, the show 1 of 2 selected etc..
      if (this.multiple && this.options.selectedTextFormat.indexOf('count') > -1) {
        var max = this.options.selectedTextFormat.split('>');
        if ((max.length > 1 && selectedItems.length > max[1]) || (max.length == 1 && selectedItems.length >= 2)) {
          notDisabled = this.options.hideDisabled ? ', [disabled]' : '';
          var totalCount = $selectOptions.not('[data-divider="true"], [data-hidden="true"]' + notDisabled).length,
              tr8nText = (typeof this.options.countSelectedText === 'function') ? this.options.countSelectedText(selectedItems.length, totalCount) : this.options.countSelectedText;
          title = tr8nText.replace('{0}', selectedItems.length.toString()).replace('{1}', totalCount.toString());
        }
      }

      if (this.options.title == undefined) {
        this.options.title = this.$element.attr('title');
      }

      if (this.options.selectedTextFormat == 'static') {
        title = this.options.title;
      }

      //If we dont have a title, then use the default, or if nothing is set at all, use the not selected text
      if (!title) {
        title = typeof this.options.title !== 'undefined' ? this.options.title : this.options.noneSelectedText;
      }

      //strip all HTML tags and trim the result, then unescape any escaped tags
      this.$button.attr('title', htmlUnescape($.trim(title.replace(/<[^>]*>?/g, ''))));
      this.$button.children('.filter-option').html(title);

      this.$element.trigger('rendered.bs.select');
    },

    /**
     * @param [style]
     * @param [status]
     */
    setStyle: function (style, status) {
      if (this.$element.attr('class')) {
        this.$newElement.addClass(this.$element.attr('class').replace(/selectpicker|mobile-device|bs-select-hidden|validate\[.*\]/gi, ''));
      }

      var buttonClass = style ? style : this.options.style;

      if (status == 'add') {
        this.$button.addClass(buttonClass);
      } else if (status == 'remove') {
        this.$button.removeClass(buttonClass);
      } else {
        this.$button.removeClass(this.options.style);
        this.$button.addClass(buttonClass);
      }
    },

    liHeight: function (refresh) {
      if (!refresh && (this.options.size === false || this.sizeInfo)) return;

      var newElement = document.createElement('div'),
          menu = document.createElement('div'),
          menuInner = document.createElement('ul'),
          divider = document.createElement('li'),
          li = document.createElement('li'),
          a = document.createElement('a'),
          text = document.createElement('span'),
          header = this.options.header && this.$menu.find('.popover-title').length > 0 ? this.$menu.find('.popover-title')[0].cloneNode(true) : null,
          search = this.options.liveSearch ? document.createElement('div') : null,
          actions = this.options.actionsBox && this.multiple && this.$menu.find('.bs-actionsbox').length > 0 ? this.$menu.find('.bs-actionsbox')[0].cloneNode(true) : null,
          doneButton = this.options.doneButton && this.multiple && this.$menu.find('.bs-donebutton').length > 0 ? this.$menu.find('.bs-donebutton')[0].cloneNode(true) : null;

      text.className = 'text';
      newElement.className = this.$menu[0].parentNode.className + ' open';
      menu.className = 'dropdown-menu open';
      menuInner.className = 'dropdown-menu inner';
      divider.className = 'divider';

      text.appendChild(document.createTextNode('Inner text'));
      a.appendChild(text);
      li.appendChild(a);
      menuInner.appendChild(li);
      menuInner.appendChild(divider);
      if (header) menu.appendChild(header);
      if (search) {
        var input = document.createElement('input');
        search.className = 'bs-searchbox';
        input.className = 'form-control';
        search.appendChild(input);
        menu.appendChild(search);
      }
      if (actions) menu.appendChild(actions);
      menu.appendChild(menuInner);
      if (doneButton) menu.appendChild(doneButton);
      newElement.appendChild(menu);

      document.body.appendChild(newElement);

      var liHeight = a.offsetHeight,
          headerHeight = header ? header.offsetHeight : 0,
          searchHeight = search ? search.offsetHeight : 0,
          actionsHeight = actions ? actions.offsetHeight : 0,
          doneButtonHeight = doneButton ? doneButton.offsetHeight : 0,
          dividerHeight = $(divider).outerHeight(true),
          // fall back to jQuery if getComputedStyle is not supported
          menuStyle = typeof getComputedStyle === 'function' ? getComputedStyle(menu) : false,
          $menu = menuStyle ? null : $(menu),
          menuPadding = {
            vert: parseInt(menuStyle ? menuStyle.paddingTop : $menu.css('paddingTop')) +
                  parseInt(menuStyle ? menuStyle.paddingBottom : $menu.css('paddingBottom')) +
                  parseInt(menuStyle ? menuStyle.borderTopWidth : $menu.css('borderTopWidth')) +
                  parseInt(menuStyle ? menuStyle.borderBottomWidth : $menu.css('borderBottomWidth')),
            horiz: parseInt(menuStyle ? menuStyle.paddingLeft : $menu.css('paddingLeft')) +
                  parseInt(menuStyle ? menuStyle.paddingRight : $menu.css('paddingRight')) +
                  parseInt(menuStyle ? menuStyle.borderLeftWidth : $menu.css('borderLeftWidth')) +
                  parseInt(menuStyle ? menuStyle.borderRightWidth : $menu.css('borderRightWidth'))
          },
          menuExtras =  {
            vert: menuPadding.vert +
                  parseInt(menuStyle ? menuStyle.marginTop : $menu.css('marginTop')) +
                  parseInt(menuStyle ? menuStyle.marginBottom : $menu.css('marginBottom')) + 2,
            horiz: menuPadding.horiz +
                  parseInt(menuStyle ? menuStyle.marginLeft : $menu.css('marginLeft')) +
                  parseInt(menuStyle ? menuStyle.marginRight : $menu.css('marginRight')) + 2
          }

      document.body.removeChild(newElement);

      this.sizeInfo = {
        liHeight: liHeight,
        headerHeight: headerHeight,
        searchHeight: searchHeight,
        actionsHeight: actionsHeight,
        doneButtonHeight: doneButtonHeight,
        dividerHeight: dividerHeight,
        menuPadding: menuPadding,
        menuExtras: menuExtras
      };
    },

    setSize: function () {
      this.findLis();
      this.liHeight();

      if (this.options.header) this.$menu.css('padding-top', 0);
      if (this.options.size === false) return;

      var that = this,
          $menu = this.$menu,
          $menuInner = this.$menuInner,
          $window = $(window),
          selectHeight = this.$newElement[0].offsetHeight,
          selectWidth = this.$newElement[0].offsetWidth,
          liHeight = this.sizeInfo['liHeight'],
          headerHeight = this.sizeInfo['headerHeight'],
          searchHeight = this.sizeInfo['searchHeight'],
          actionsHeight = this.sizeInfo['actionsHeight'],
          doneButtonHeight = this.sizeInfo['doneButtonHeight'],
          divHeight = this.sizeInfo['dividerHeight'],
          menuPadding = this.sizeInfo['menuPadding'],
          menuExtras = this.sizeInfo['menuExtras'],
          notDisabled = this.options.hideDisabled ? '.disabled' : '',
          menuHeight,
          menuWidth,
          getHeight,
          getWidth,
          selectOffsetTop,
          selectOffsetBot,
          selectOffsetLeft,
          selectOffsetRight,
          getPos = function() {
            var pos = that.$newElement.offset(),
                $container = $(that.options.container),
                containerPos;

            if (that.options.container && !$container.is('body')) {
              containerPos = $container.offset();
              containerPos.top += parseInt($container.css('borderTopWidth'));
              containerPos.left += parseInt($container.css('borderLeftWidth'));
            } else {
              containerPos = { top: 0, left: 0 };
            }

            var winPad = that.options.windowPadding;
            selectOffsetTop = pos.top - containerPos.top - $window.scrollTop();
            selectOffsetBot = $window.height() - selectOffsetTop - selectHeight - containerPos.top - winPad[2];
            selectOffsetLeft = pos.left - containerPos.left - $window.scrollLeft();
            selectOffsetRight = $window.width() - selectOffsetLeft - selectWidth - containerPos.left - winPad[1];
            selectOffsetTop -= winPad[0];
            selectOffsetLeft -= winPad[3];
          };

      getPos();

      if (this.options.size === 'auto') {
        var getSize = function () {
          var minHeight,
              hasClass = function (className, include) {
                return function (element) {
                    if (include) {
                        return (element.classList ? element.classList.contains(className) : $(element).hasClass(className));
                    } else {
                        return !(element.classList ? element.classList.contains(className) : $(element).hasClass(className));
                    }
                };
              },
              lis = that.$menuInner[0].getElementsByTagName('li'),
              lisVisible = Array.prototype.filter ? Array.prototype.filter.call(lis, hasClass('hidden', false)) : that.$lis.not('.hidden'),
              optGroup = Array.prototype.filter ? Array.prototype.filter.call(lisVisible, hasClass('dropdown-header', true)) : lisVisible.filter('.dropdown-header');

          getPos();
          menuHeight = selectOffsetBot - menuExtras.vert;
          menuWidth = selectOffsetRight - menuExtras.horiz;

          if (that.options.container) {
            if (!$menu.data('height')) $menu.data('height', $menu.height());
            getHeight = $menu.data('height');

            if (!$menu.data('width')) $menu.data('width', $menu.width());
            getWidth = $menu.data('width');
          } else {
            getHeight = $menu.height();
            getWidth = $menu.width();
          }

          if (that.options.dropupAuto) {
            that.$newElement.toggleClass('dropup', selectOffsetTop > selectOffsetBot && (menuHeight - menuExtras.vert) < getHeight);
          }

          if (that.$newElement.hasClass('dropup')) {
            menuHeight = selectOffsetTop - menuExtras.vert;
          }

          if (that.options.dropdownAlignRight === 'auto') {
            $menu.toggleClass('dropdown-menu-right', selectOffsetLeft > selectOffsetRight && (menuWidth - menuExtras.horiz) < (getWidth - selectWidth));
          }

          if ((lisVisible.length + optGroup.length) > 3) {
            minHeight = liHeight * 3 + menuExtras.vert - 2;
          } else {
            minHeight = 0;
          }

          $menu.css({
            'max-height': menuHeight + 'px',
            'overflow': 'hidden',
            'min-height': minHeight + headerHeight + searchHeight + actionsHeight + doneButtonHeight + 'px'
          });
          $menuInner.css({
            'max-height': menuHeight - headerHeight - searchHeight - actionsHeight - doneButtonHeight - menuPadding.vert + 'px',
            'overflow-y': 'auto',
            'min-height': Math.max(minHeight - menuPadding.vert, 0) + 'px'
          });
        };
        getSize();
        this.$searchbox.off('input.getSize propertychange.getSize').on('input.getSize propertychange.getSize', getSize);
        $window.off('resize.getSize scroll.getSize').on('resize.getSize scroll.getSize', getSize);
      } else if (this.options.size && this.options.size != 'auto' && this.$lis.not(notDisabled).length > this.options.size) {
        var optIndex = this.$lis.not('.divider').not(notDisabled).children().slice(0, this.options.size).last().parent().index(),
            divLength = this.$lis.slice(0, optIndex + 1).filter('.divider').length;
        menuHeight = liHeight * this.options.size + divLength * divHeight + menuPadding.vert;

        if (that.options.container) {
          if (!$menu.data('height')) $menu.data('height', $menu.height());
          getHeight = $menu.data('height');
        } else {
          getHeight = $menu.height();
        }

        if (that.options.dropupAuto) {
          //noinspection JSUnusedAssignment
          this.$newElement.toggleClass('dropup', selectOffsetTop > selectOffsetBot && (menuHeight - menuExtras.vert) < getHeight);
        }
        $menu.css({
          'max-height': menuHeight + headerHeight + searchHeight + actionsHeight + doneButtonHeight + 'px',
          'overflow': 'hidden',
          'min-height': ''
        });
        $menuInner.css({
          'max-height': menuHeight - menuPadding.vert + 'px',
          'overflow-y': 'auto',
          'min-height': ''
        });
      }
    },

    setWidth: function () {
      if (this.options.width === 'auto') {
        this.$menu.css('min-width', '0');

        // Get correct width if element is hidden
        var $selectClone = this.$menu.parent().clone().appendTo('body'),
            $selectClone2 = this.options.container ? this.$newElement.clone().appendTo('body') : $selectClone,
            ulWidth = $selectClone.children('.dropdown-menu').outerWidth(),
            bbtnWidth = $selectClone2.css('width', 'auto').children('button').outerWidth();

        $selectClone.remove();
        $selectClone2.remove();

        // Set width to whatever's larger, button title or longest option
        this.$newElement.css('width', Math.max(ulWidth, bbtnWidth) + 'px');
      } else if (this.options.width === 'fit') {
        // Remove inline min-width so width can be changed from 'auto'
        this.$menu.css('min-width', '');
        this.$newElement.css('width', '').addClass('fit-width');
      } else if (this.options.width) {
        // Remove inline min-width so width can be changed from 'auto'
        this.$menu.css('min-width', '');
        this.$newElement.css('width', this.options.width);
      } else {
        // Remove inline min-width/width so width can be changed
        this.$menu.css('min-width', '');
        this.$newElement.css('width', '');
      }
      // Remove fit-width class if width is changed programmatically
      if (this.$newElement.hasClass('fit-width') && this.options.width !== 'fit') {
        this.$newElement.removeClass('fit-width');
      }
    },

    selectPosition: function () {
      this.$bsContainer = $('<div class="bs-container" />');

      var that = this,
          $container = $(this.options.container),
          pos,
          containerPos,
          actualHeight,
          getPlacement = function ($element) {
            that.$bsContainer.addClass($element.attr('class').replace(/form-control|fit-width/gi, '')).toggleClass('dropup', $element.hasClass('dropup'));
            pos = $element.offset();

            if (!$container.is('body')) {
              containerPos = $container.offset();
              containerPos.top += parseInt($container.css('borderTopWidth')) - $container.scrollTop();
              containerPos.left += parseInt($container.css('borderLeftWidth')) - $container.scrollLeft();
            } else {
              containerPos = { top: 0, left: 0 };
            }

            actualHeight = $element.hasClass('dropup') ? 0 : $element[0].offsetHeight;

            that.$bsContainer.css({
              'top': pos.top - containerPos.top + actualHeight,
              'left': pos.left - containerPos.left,
              'width': $element[0].offsetWidth
            });
          };

      this.$button.on('click', function () {
        var $this = $(this);

        if (that.isDisabled()) {
          return;
        }

        getPlacement(that.$newElement);

        that.$bsContainer
          .appendTo(that.options.container)
          .toggleClass('open', !$this.hasClass('open'))
          .append(that.$menu);
      });

      $(window).on('resize scroll', function () {
        getPlacement(that.$newElement);
      });

      this.$element.on('hide.bs.select', function () {
        that.$menu.data('height', that.$menu.height());
        that.$bsContainer.detach();
      });
    },

    /**
     * @param {number} index - the index of the option that is being changed
     * @param {boolean} selected - true if the option is being selected, false if being deselected
     * @param {JQuery} $lis - the 'li' element that is being modified
     */
    setSelected: function (index, selected, $lis) {
      if (!$lis) {
        this.togglePlaceholder(); // check if setSelected is being called by changing the value of the select
        $lis = this.findLis().eq(this.liObj[index]);
      }

      $lis.toggleClass('selected', selected).find('a').attr('aria-selected', selected);
    },

    /**
     * @param {number} index - the index of the option that is being disabled
     * @param {boolean} disabled - true if the option is being disabled, false if being enabled
     * @param {JQuery} $lis - the 'li' element that is being modified
     */
    setDisabled: function (index, disabled, $lis) {
      if (!$lis) {
        $lis = this.findLis().eq(this.liObj[index]);
      }

      if (disabled) {
        $lis.addClass('disabled').children('a').attr('href', '#').attr('tabindex', -1).attr('aria-disabled', true);
      } else {
        $lis.removeClass('disabled').children('a').removeAttr('href').attr('tabindex', 0).attr('aria-disabled', false);
      }
    },

    isDisabled: function () {
      return this.$element[0].disabled;
    },

    checkDisabled: function () {
      var that = this;

      if (this.isDisabled()) {
        this.$newElement.addClass('disabled');
        this.$button.addClass('disabled').attr('tabindex', -1).attr('aria-disabled', true);
      } else {
        if (this.$button.hasClass('disabled')) {
          this.$newElement.removeClass('disabled');
          this.$button.removeClass('disabled').attr('aria-disabled', false);
        }

        if (this.$button.attr('tabindex') == -1 && !this.$element.data('tabindex')) {
          this.$button.removeAttr('tabindex');
        }
      }

      this.$button.click(function () {
        return !that.isDisabled();
      });
    },

    togglePlaceholder: function () {
      var value = this.$element.val();
      this.$button.toggleClass('bs-placeholder', value === null || value === '' || (value.constructor === Array && value.length === 0));
    },

    tabIndex: function () {
      if (this.$element.data('tabindex') !== this.$element.attr('tabindex') &&
        (this.$element.attr('tabindex') !== -98 && this.$element.attr('tabindex') !== '-98')) {
        this.$element.data('tabindex', this.$element.attr('tabindex'));
        this.$button.attr('tabindex', this.$element.data('tabindex'));
      }

      this.$element.attr('tabindex', -98);
    },

    clickListener: function () {
      var that = this,
          $document = $(document);

      $document.data('spaceSelect', false);

      this.$button.on('keyup', function (e) {
        if (/(32)/.test(e.keyCode.toString(10)) && $document.data('spaceSelect')) {
            e.preventDefault();
            $document.data('spaceSelect', false);
        }
      });

      this.$button.on('click', function () {
        that.setSize();
      });

      this.$element.on('shown.bs.select', function () {
        if (!that.options.liveSearch && !that.multiple) {
          that.$menuInner.find('.selected a').focus();
        } else if (!that.multiple) {
          var selectedIndex = that.liObj[that.$element[0].selectedIndex];

          if (typeof selectedIndex !== 'number' || that.options.size === false) return;

          // scroll to selected option
          var offset = that.$lis.eq(selectedIndex)[0].offsetTop - that.$menuInner[0].offsetTop;
          offset = offset - that.$menuInner[0].offsetHeight/2 + that.sizeInfo.liHeight/2;
          that.$menuInner[0].scrollTop = offset;
        }
      });

      this.$menuInner.on('click', 'li a', function (e) {
        var $this = $(this),
            clickedIndex = $this.parent().data('originalIndex'),
            prevValue = that.$element.val(),
            prevIndex = that.$element.prop('selectedIndex'),
            triggerChange = true;

        // Don't close on multi choice menu
        if (that.multiple && that.options.maxOptions !== 1) {
          e.stopPropagation();
        }

        e.preventDefault();

        //Don't run if we have been disabled
        if (!that.isDisabled() && !$this.parent().hasClass('disabled')) {
          var $options = that.$element.find('option'),
              $option = $options.eq(clickedIndex),
              state = $option.prop('selected'),
              $optgroup = $option.parent('optgroup'),
              maxOptions = that.options.maxOptions,
              maxOptionsGrp = $optgroup.data('maxOptions') || false;

          if (!that.multiple) { // Deselect all others if not multi select box
            $options.prop('selected', false);
            $option.prop('selected', true);
            that.$menuInner.find('.selected').removeClass('selected').find('a').attr('aria-selected', false);
            that.setSelected(clickedIndex, true);
          } else { // Toggle the one we have chosen if we are multi select.
            $option.prop('selected', !state);
            that.setSelected(clickedIndex, !state);
            $this.blur();

            if (maxOptions !== false || maxOptionsGrp !== false) {
              var maxReached = maxOptions < $options.filter(':selected').length,
                  maxReachedGrp = maxOptionsGrp < $optgroup.find('option:selected').length;

              if ((maxOptions && maxReached) || (maxOptionsGrp && maxReachedGrp)) {
                if (maxOptions && maxOptions == 1) {
                  $options.prop('selected', false);
                  $option.prop('selected', true);
                  that.$menuInner.find('.selected').removeClass('selected');
                  that.setSelected(clickedIndex, true);
                } else if (maxOptionsGrp && maxOptionsGrp == 1) {
                  $optgroup.find('option:selected').prop('selected', false);
                  $option.prop('selected', true);
                  var optgroupID = $this.parent().data('optgroup');
                  that.$menuInner.find('[data-optgroup="' + optgroupID + '"]').removeClass('selected');
                  that.setSelected(clickedIndex, true);
                } else {
                  var maxOptionsText = typeof that.options.maxOptionsText === 'string' ? [that.options.maxOptionsText, that.options.maxOptionsText] : that.options.maxOptionsText,
                      maxOptionsArr = typeof maxOptionsText === 'function' ? maxOptionsText(maxOptions, maxOptionsGrp) : maxOptionsText,
                      maxTxt = maxOptionsArr[0].replace('{n}', maxOptions),
                      maxTxtGrp = maxOptionsArr[1].replace('{n}', maxOptionsGrp),
                      $notify = $('<div class="notify"></div>');
                  // If {var} is set in array, replace it
                  /** @deprecated */
                  if (maxOptionsArr[2]) {
                    maxTxt = maxTxt.replace('{var}', maxOptionsArr[2][maxOptions > 1 ? 0 : 1]);
                    maxTxtGrp = maxTxtGrp.replace('{var}', maxOptionsArr[2][maxOptionsGrp > 1 ? 0 : 1]);
                  }

                  $option.prop('selected', false);

                  that.$menu.append($notify);

                  if (maxOptions && maxReached) {
                    $notify.append($('<div>' + maxTxt + '</div>'));
                    triggerChange = false;
                    that.$element.trigger('maxReached.bs.select');
                  }

                  if (maxOptionsGrp && maxReachedGrp) {
                    $notify.append($('<div>' + maxTxtGrp + '</div>'));
                    triggerChange = false;
                    that.$element.trigger('maxReachedGrp.bs.select');
                  }

                  setTimeout(function () {
                    that.setSelected(clickedIndex, false);
                  }, 10);

                  $notify.delay(750).fadeOut(300, function () {
                    $(this).remove();
                  });
                }
              }
            }
          }

          if (!that.multiple || (that.multiple && that.options.maxOptions === 1)) {
            that.$button.focus();
          } else if (that.options.liveSearch) {
            that.$searchbox.focus();
          }

          // Trigger select 'change'
          if (triggerChange) {
            if ((prevValue != that.$element.val() && that.multiple) || (prevIndex != that.$element.prop('selectedIndex') && !that.multiple)) {
              // $option.prop('selected') is current option state (selected/unselected). state is previous option state.
              changed_arguments = [clickedIndex, $option.prop('selected'), state];
              that.$element
                .triggerNative('change');
            }
          }
        }
      });

      this.$menu.on('click', 'li.disabled a, .popover-title, .popover-title :not(.close)', function (e) {
        if (e.currentTarget == this) {
          e.preventDefault();
          e.stopPropagation();
          if (that.options.liveSearch && !$(e.target).hasClass('close')) {
            that.$searchbox.focus();
          } else {
            that.$button.focus();
          }
        }
      });

      this.$menuInner.on('click', '.divider, .dropdown-header', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (that.options.liveSearch) {
          that.$searchbox.focus();
        } else {
          that.$button.focus();
        }
      });

      this.$menu.on('click', '.popover-title .close', function () {
        that.$button.click();
      });

      this.$searchbox.on('click', function (e) {
        e.stopPropagation();
      });

      this.$menu.on('click', '.actions-bbtn', function (e) {
        if (that.options.liveSearch) {
          that.$searchbox.focus();
        } else {
          that.$button.focus();
        }

        e.preventDefault();
        e.stopPropagation();

        if ($(this).hasClass('bs-select-all')) {
          that.selectAll();
        } else {
          that.deselectAll();
        }
      });

      this.$element.change(function () {
        that.render(false);
        that.$element.trigger('changed.bs.select', changed_arguments);
        changed_arguments = null;
      });
    },

    liveSearchListener: function () {
      var that = this,
          $no_results = $('<li class="no-results"></li>');

      this.$button.on('click.dropdown.data-api', function () {
        that.$menuInner.find('.active').removeClass('active');
        if (!!that.$searchbox.val()) {
          that.$searchbox.val('');
          that.$lis.not('.is-hidden').removeClass('hidden');
          if (!!$no_results.parent().length) $no_results.remove();
        }
        if (!that.multiple) that.$menuInner.find('.selected').addClass('active');
        setTimeout(function () {
          that.$searchbox.focus();
        }, 10);
      });

      this.$searchbox.on('click.dropdown.data-api focus.dropdown.data-api touchend.dropdown.data-api', function (e) {
        e.stopPropagation();
      });

      this.$searchbox.on('input propertychange', function () {
        that.$lis.not('.is-hidden').removeClass('hidden');
        that.$lis.filter('.active').removeClass('active');
        $no_results.remove();

        if (that.$searchbox.val()) {
          var $searchBase = that.$lis.not('.is-hidden, .divider, .dropdown-header'),
              $hideItems;
          if (that.options.liveSearchNormalize) {
            $hideItems = $searchBase.not(':a' + that._searchStyle() + '("' + normalizeToBase(that.$searchbox.val()) + '")');
          } else {
            $hideItems = $searchBase.not(':' + that._searchStyle() + '("' + that.$searchbox.val() + '")');
          }

          if ($hideItems.length === $searchBase.length) {
            $no_results.html(that.options.noneResultsText.replace('{0}', '"' + htmlEscape(that.$searchbox.val()) + '"'));
            that.$menuInner.append($no_results);
            that.$lis.addClass('hidden');
          } else {
            $hideItems.addClass('hidden');

            var $lisVisible = that.$lis.not('.hidden'),
                $foundDiv;

            // hide divider if first or last visible, or if followed by another divider
            $lisVisible.each(function (index) {
              var $this = $(this);

              if ($this.hasClass('divider')) {
                if ($foundDiv === undefined) {
                  $this.addClass('hidden');
                } else {
                  if ($foundDiv) $foundDiv.addClass('hidden');
                  $foundDiv = $this;
                }
              } else if ($this.hasClass('dropdown-header') && $lisVisible.eq(index + 1).data('optgroup') !== $this.data('optgroup')) {
                $this.addClass('hidden');
              } else {
                $foundDiv = null;
              }
            });
            if ($foundDiv) $foundDiv.addClass('hidden');

            $searchBase.not('.hidden').first().addClass('active');
            that.$menuInner.scrollTop(0);
          }
        }
      });
    },

    _searchStyle: function () {
      var styles = {
        begins: 'ibegins',
        startsWith: 'ibegins'
      };

      return styles[this.options.liveSearchStyle] || 'icontains';
    },

    val: function (value) {
      if (typeof value !== 'undefined') {
        this.$element.val(value);
        this.render();

        return this.$element;
      } else {
        return this.$element.val();
      }
    },

    changeAll: function (status) {
      if (!this.multiple) return;
      if (typeof status === 'undefined') status = true;

      this.findLis();

      var $options = this.$element.find('option'),
          $lisVisible = this.$lis.not('.divider, .dropdown-header, .disabled, .hidden'),
          lisVisLen = $lisVisible.length,
          selectedOptions = [];

      if (status) {
        if ($lisVisible.filter('.selected').length === $lisVisible.length) return;
      } else {
        if ($lisVisible.filter('.selected').length === 0) return;
      }

      $lisVisible.toggleClass('selected', status);

      for (var i = 0; i < lisVisLen; i++) {
        var origIndex = $lisVisible[i].getAttribute('data-original-index');
        selectedOptions[selectedOptions.length] = $options.eq(origIndex)[0];
      }

      $(selectedOptions).prop('selected', status);

      this.render(false);

      this.togglePlaceholder();

      this.$element
        .triggerNative('change');
    },

    selectAll: function () {
      return this.changeAll(true);
    },

    deselectAll: function () {
      return this.changeAll(false);
    },

    toggle: function (e) {
      e = e || window.event;

      if (e) e.stopPropagation();

      this.$button.trigger('click');
    },

    keydown: function (e) {
      var $this = $(this),
          $parent = $this.is('input') ? $this.parent().parent() : $this.parent(),
          $items,
          that = $parent.data('this'),
          index,
          prevIndex,
          isActive,
          selector = ':not(.disabled, .hidden, .dropdown-header, .divider)',
          keyCodeMap = {
            32: ' ',
            48: '0',
            49: '1',
            50: '2',
            51: '3',
            52: '4',
            53: '5',
            54: '6',
            55: '7',
            56: '8',
            57: '9',
            59: ';',
            65: 'a',
            66: 'b',
            67: 'c',
            68: 'd',
            69: 'e',
            70: 'f',
            71: 'g',
            72: 'h',
            73: 'i',
            74: 'j',
            75: 'k',
            76: 'l',
            77: 'm',
            78: 'n',
            79: 'o',
            80: 'p',
            81: 'q',
            82: 'r',
            83: 's',
            84: 't',
            85: 'u',
            86: 'v',
            87: 'w',
            88: 'x',
            89: 'y',
            90: 'z',
            96: '0',
            97: '1',
            98: '2',
            99: '3',
            100: '4',
            101: '5',
            102: '6',
            103: '7',
            104: '8',
            105: '9'
          };


      isActive = that.$newElement.hasClass('open');

      if (!isActive && (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105 || e.keyCode >= 65 && e.keyCode <= 90)) {
        if (!that.options.container) {
          that.setSize();
          that.$menu.parent().addClass('open');
          isActive = true;
        } else {
          that.$button.trigger('click');
        }
        that.$searchbox.focus();
        return;
      }

      if (that.options.liveSearch) {
        if (/(^9$|27)/.test(e.keyCode.toString(10)) && isActive) {
          e.preventDefault();
          e.stopPropagation();
          that.$menuInner.click();
          that.$button.focus();
        }
      }

      if (/(38|40)/.test(e.keyCode.toString(10))) {
        $items = that.$lis.filter(selector);
        if (!$items.length) return;

        if (!that.options.liveSearch) {
          index = $items.index($items.find('a').filter(':focus').parent());
	    } else {
          index = $items.index($items.filter('.active'));
        }

        prevIndex = that.$menuInner.data('prevIndex');

        if (e.keyCode == 38) {
          if ((that.options.liveSearch || index == prevIndex) && index != -1) index--;
          if (index < 0) index += $items.length;
        } else if (e.keyCode == 40) {
          if (that.options.liveSearch || index == prevIndex) index++;
          index = index % $items.length;
        }

        that.$menuInner.data('prevIndex', index);

        if (!that.options.liveSearch) {
          $items.eq(index).children('a').focus();
        } else {
          e.preventDefault();
          if (!$this.hasClass('dropdown-toggle')) {
            $items.removeClass('active').eq(index).addClass('active').children('a').focus();
            $this.focus();
          }
        }

      } else if (!$this.is('input')) {
        var keyIndex = [],
            count,
            prevKey;

        $items = that.$lis.filter(selector);
        $items.each(function (i) {
          if ($.trim($(this).children('a').text().toLowerCase()).substring(0, 1) == keyCodeMap[e.keyCode]) {
            keyIndex.push(i);
          }
        });

        count = $(document).data('keycount');
        count++;
        $(document).data('keycount', count);

        prevKey = $.trim($(':focus').text().toLowerCase()).substring(0, 1);

        if (prevKey != keyCodeMap[e.keyCode]) {
          count = 1;
          $(document).data('keycount', count);
        } else if (count >= keyIndex.length) {
          $(document).data('keycount', 0);
          if (count > keyIndex.length) count = 1;
        }

        $items.eq(keyIndex[count - 1]).children('a').focus();
      }

      // Select focused option if "Enter", "Spacebar" or "Tab" (when selectOnTab is true) are pressed inside the menu.
      if ((/(13|32)/.test(e.keyCode.toString(10)) || (/(^9$)/.test(e.keyCode.toString(10)) && that.options.selectOnTab)) && isActive) {
        if (!/(32)/.test(e.keyCode.toString(10))) e.preventDefault();
        if (!that.options.liveSearch) {
          var elem = $(':focus');
          elem.click();
          // Bring back focus for multiselects
          elem.focus();
          // Prevent screen from scrolling if the user hit the spacebar
          e.preventDefault();
          // Fixes spacebar selection of dropdown items in FF & IE
          $(document).data('spaceSelect', true);
        } else if (!/(32)/.test(e.keyCode.toString(10))) {
          that.$menuInner.find('.active a').click();
          $this.focus();
        }
        $(document).data('keycount', 0);
      }

      if ((/(^9$|27)/.test(e.keyCode.toString(10)) && isActive && (that.multiple || that.options.liveSearch)) || (/(27)/.test(e.keyCode.toString(10)) && !isActive)) {
        that.$menu.parent().removeClass('open');
        if (that.options.container) that.$newElement.removeClass('open');
        that.$button.focus();
      }
    },

    mobile: function () {
      this.$element.addClass('mobile-device');
    },

    refresh: function () {
      this.$lis = null;
      this.liObj = {};
      this.reloadLi();
      this.render();
      this.checkDisabled();
      this.liHeight(true);
      this.setStyle();
      this.setWidth();
      if (this.$lis) this.$searchbox.trigger('propertychange');

      this.$element.trigger('refreshed.bs.select');
    },

    hide: function () {
      this.$newElement.hide();
    },

    show: function () {
      this.$newElement.show();
    },

    remove: function () {
      this.$newElement.remove();
      this.$element.remove();
    },

    destroy: function () {
      this.$newElement.before(this.$element).remove();

      if (this.$bsContainer) {
        this.$bsContainer.remove();
      } else {
        this.$menu.remove();
      }

      this.$element
        .off('.bs.select')
        .removeData('selectpicker')
        .removeClass('bs-select-hidden selectpicker');
    }
  };

  // SELECTPICKER PLUGIN DEFINITION
  // ==============================
  function Plugin(option) {
    // get the args of the outer function..
    var args = arguments;
    // The arguments of the function are explicitly re-defined from the argument list, because the shift causes them
    // to get lost/corrupted in android 2.3 and IE9 #715 #775
    var _option = option;

    [].shift.apply(args);

    var value;
    var chain = this.each(function () {
      var $this = $(this);
      if ($this.is('select')) {
        var data = $this.data('selectpicker'),
            options = typeof _option == 'object' && _option;

        if (!data) {
          var config = $.extend({}, Selectpicker.DEFAULTS, $.fn.selectpicker.defaults || {}, $this.data(), options);
          config.template = $.extend({}, Selectpicker.DEFAULTS.template, ($.fn.selectpicker.defaults ? $.fn.selectpicker.defaults.template : {}), $this.data().template, options.template);
          $this.data('selectpicker', (data = new Selectpicker(this, config)));
        } else if (options) {
          for (var i in options) {
            if (options.hasOwnProperty(i)) {
              data.options[i] = options[i];
            }
          }
        }

        if (typeof _option == 'string') {
          if (data[_option] instanceof Function) {
            value = data[_option].apply(data, args);
          } else {
            value = data.options[_option];
          }
        }
      }
    });

    if (typeof value !== 'undefined') {
      //noinspection JSUnusedAssignment
      return value;
    } else {
      return chain;
    }
  }

  var old = $.fn.selectpicker;
  $.fn.selectpicker = Plugin;
  $.fn.selectpicker.Constructor = Selectpicker;

  // SELECTPICKER NO CONFLICT
  // ========================
  $.fn.selectpicker.noConflict = function () {
    $.fn.selectpicker = old;
    return this;
  };

  $(document)
      .data('keycount', 0)
      .on('keydown.bs.select', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="listbox"], .bs-searchbox input', Selectpicker.prototype.keydown)
      .on('focusin.modal', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="listbox"], .bs-searchbox input', function (e) {
        e.stopPropagation();
      });

  // SELECTPICKER DATA-API
  // =====================
  $(window).on('load.bs.select.data-api', function () {
    $('.selectpicker').each(function () {
      var $selectpicker = $(this);
      Plugin.call($selectpicker, $selectpicker.data());
    })
  });
})(jQuery);


}));

/*!
 * Bootstrap-select v1.12.2 (http://silviomoreto.github.io/bootstrap-select)
 *
 * Copyright 2013-2017 bootstrap-select
 * Licensed under MIT (https://github.com/silviomoreto/bootstrap-select/blob/master/LICENSE)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["jquery"], function (a0) {
      return (factory(a0));
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    factory(root["jQuery"]);
  }
}(this, function (jQuery) {

(function ($) {
  $.fn.selectpicker.defaults = {
    noneSelectedText: 'Ничего не выбрано',
    noneResultsText: 'Совпадений не найдено {0}',
    countSelectedText: 'Выбрано {0} из {1}',
    maxOptionsText: ['Достигнут предел ({n} {var} максимум)', 'Достигнут предел в группе ({n} {var} максимум)', ['шт.', 'шт.']],
    doneButtonText: 'Закрыть',
    selectAllText: 'Выбрать все',
    deselectAllText: 'Отменить все',    
    multipleSeparator: ', '
  };
})(jQuery);


}));

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.7
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.7'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/*!
 * Flickity PACKAGED v2.0.10
 * Touch, responsive, flickable carousels
 *
 * Licensed GPLv3 for open source use
 * or Flickity Commercial License for commercial use
 *
 * http://flickity.metafizzy.co
 * Copyright 2017 Metafizzy
 */

/**
 * Bridget makes jQuery widgets
 * v2.0.1
 * MIT license
 */

/* jshint browser: true, strict: true, undef: true, unused: true */

( function( window, factory ) {
	// universal module definition
	/*jshint strict: false */ /* globals define, module, require */
	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'jquery-bridget/jquery-bridget',[ 'jquery' ], function( jQuery ) {
			return factory( window, jQuery );
		});
	} else if ( typeof module == 'object' && module.exports ) {
		// CommonJS
		module.exports = factory(
			window,
			require('jquery')
		);
	} else {
		// browser global
		window.jQueryBridget = factory(
			window,
			window.jQuery
		);
	}

}( window, function factory( window, jQuery ) {
	'use strict';

// ----- utils ----- //

	var arraySlice = Array.prototype.slice;

// helper function for logging errors
// $.error breaks jQuery chaining
	var console = window.console;
	var logError = typeof console == 'undefined' ? function() {} :
		function( message ) {
			console.error( message );
		};

// ----- jQueryBridget ----- //

	function jQueryBridget( namespace, PluginClass, $ ) {
		$ = $ || jQuery || window.jQuery;
		if ( !$ ) {
			return;
		}

		// add option method -> $().plugin('option', {...})
		if ( !PluginClass.prototype.option ) {
			// option setter
			PluginClass.prototype.option = function( opts ) {
				// bail out if not an object
				if ( !$.isPlainObject( opts ) ){
					return;
				}
				this.options = $.extend( true, this.options, opts );
			};
		}

		// make jQuery plugin
		$.fn[ namespace ] = function( arg0 /*, arg1 */ ) {
			if ( typeof arg0 == 'string' ) {
				// method call $().plugin( 'methodName', { options } )
				// shift arguments by 1
				var args = arraySlice.call( arguments, 1 );
				return methodCall( this, arg0, args );
			}
			// just $().plugin({ options })
			plainCall( this, arg0 );
			return this;
		};

		// $().plugin('methodName')
		function methodCall( $elems, methodName, args ) {
			var returnValue;
			var pluginMethodStr = '$().' + namespace + '("' + methodName + '")';

			$elems.each( function( i, elem ) {
				// get instance
				var instance = $.data( elem, namespace );
				if ( !instance ) {
					logError( namespace + ' not initialized. Cannot call methods, i.e. ' +
						pluginMethodStr );
					return;
				}

				var method = instance[ methodName ];
				if ( !method || methodName.charAt(0) == '_' ) {
					logError( pluginMethodStr + ' is not a valid method' );
					return;
				}

				// apply method, get return value
				var value = method.apply( instance, args );
				// set return value if value is returned, use only first value
				returnValue = returnValue === undefined ? value : returnValue;
			});

			return returnValue !== undefined ? returnValue : $elems;
		}

		function plainCall( $elems, options ) {
			$elems.each( function( i, elem ) {
				var instance = $.data( elem, namespace );
				if ( instance ) {
					// set options & init
					instance.option( options );
					instance._init();
				} else {
					// initialize new instance
					instance = new PluginClass( elem, options );
					$.data( elem, namespace, instance );
				}
			});
		}

		updateJQuery( $ );

	}

// ----- updateJQuery ----- //

// set $.bridget for v1 backwards compatibility
	function updateJQuery( $ ) {
		if ( !$ || ( $ && $.bridget ) ) {
			return;
		}
		$.bridget = jQueryBridget;
	}

	updateJQuery( jQuery || window.jQuery );

// -----  ----- //

	return jQueryBridget;

}));

/**
 * EvEmitter v1.1.0
 * Lil' event emitter
 * MIT License
 */

/* jshint unused: true, undef: true, strict: true */

( function( global, factory ) {
	// universal module definition
	/* jshint strict: false */ /* globals define, module, window */
	if ( typeof define == 'function' && define.amd ) {
		// AMD - RequireJS
		define( 'ev-emitter/ev-emitter',factory );
	} else if ( typeof module == 'object' && module.exports ) {
		// CommonJS - Browserify, Webpack
		module.exports = factory();
	} else {
		// Browser globals
		global.EvEmitter = factory();
	}

}( typeof window != 'undefined' ? window : this, function() {



	function EvEmitter() {}

	var proto = EvEmitter.prototype;

	proto.on = function( eventName, listener ) {
		if ( !eventName || !listener ) {
			return;
		}
		// set events hash
		var events = this._events = this._events || {};
		// set listeners array
		var listeners = events[ eventName ] = events[ eventName ] || [];
		// only add once
		if ( listeners.indexOf( listener ) == -1 ) {
			listeners.push( listener );
		}

		return this;
	};

	proto.once = function( eventName, listener ) {
		if ( !eventName || !listener ) {
			return;
		}
		// add event
		this.on( eventName, listener );
		// set once flag
		// set onceEvents hash
		var onceEvents = this._onceEvents = this._onceEvents || {};
		// set onceListeners object
		var onceListeners = onceEvents[ eventName ] = onceEvents[ eventName ] || {};
		// set flag
		onceListeners[ listener ] = true;

		return this;
	};

	proto.off = function( eventName, listener ) {
		var listeners = this._events && this._events[ eventName ];
		if ( !listeners || !listeners.length ) {
			return;
		}
		var index = listeners.indexOf( listener );
		if ( index != -1 ) {
			listeners.splice( index, 1 );
		}

		return this;
	};

	proto.emitEvent = function( eventName, args ) {
		var listeners = this._events && this._events[ eventName ];
		if ( !listeners || !listeners.length ) {
			return;
		}
		// copy over to avoid interference if .off() in listener
		listeners = listeners.slice(0);
		args = args || [];
		// once stuff
		var onceListeners = this._onceEvents && this._onceEvents[ eventName ];

		for ( var i=0; i < listeners.length; i++ ) {
			var listener = listeners[i]
			var isOnce = onceListeners && onceListeners[ listener ];
			if ( isOnce ) {
				// remove listener
				// remove before trigger to prevent recursion
				this.off( eventName, listener );
				// unset once flag
				delete onceListeners[ listener ];
			}
			// trigger listener
			listener.apply( this, args );
		}

		return this;
	};

	proto.allOff = function() {
		delete this._events;
		delete this._onceEvents;
	};

	return EvEmitter;

}));

/*!
 * getSize v2.0.2
 * measure size of elements
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false, console: false */

( function( window, factory ) {
	'use strict';

	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'get-size/get-size',[],function() {
			return factory();
		});
	} else if ( typeof module == 'object' && module.exports ) {
		// CommonJS
		module.exports = factory();
	} else {
		// browser global
		window.getSize = factory();
	}

})( window, function factory() {
	'use strict';

// -------------------------- helpers -------------------------- //

// get a number from a string, not a percentage
	function getStyleSize( value ) {
		var num = parseFloat( value );
		// not a percent like '100%', and a number
		var isValid = value.indexOf('%') == -1 && !isNaN( num );
		return isValid && num;
	}

	function noop() {}

	var logError = typeof console == 'undefined' ? noop :
		function( message ) {
			console.error( message );
		};

// -------------------------- measurements -------------------------- //

	var measurements = [
		'paddingLeft',
		'paddingRight',
		'paddingTop',
		'paddingBottom',
		'marginLeft',
		'marginRight',
		'marginTop',
		'marginBottom',
		'borderLeftWidth',
		'borderRightWidth',
		'borderTopWidth',
		'borderBottomWidth'
	];

	var measurementsLength = measurements.length;

	function getZeroSize() {
		var size = {
			width: 0,
			height: 0,
			innerWidth: 0,
			innerHeight: 0,
			outerWidth: 0,
			outerHeight: 0
		};
		for ( var i=0; i < measurementsLength; i++ ) {
			var measurement = measurements[i];
			size[ measurement ] = 0;
		}
		return size;
	}

// -------------------------- getStyle -------------------------- //

	/**
	 * getStyle, get style of element, check for Firefox bug
	 * https://bugzilla.mozilla.org/show_bug.cgi?id=548397
	 */
	function getStyle( elem ) {
		var style = getComputedStyle( elem );
		if ( !style ) {
			logError( 'Style returned ' + style +
				'. Are you running this code in a hidden iframe on Firefox? ' +
				'See http://bit.ly/getsizebug1' );
		}
		return style;
	}

// -------------------------- setup -------------------------- //

	var isSetup = false;

	var isBoxSizeOuter;

	/**
	 * setup
	 * check isBoxSizerOuter
	 * do on first getSize() rather than on page load for Firefox bug
	 */
	function setup() {
		// setup once
		if ( isSetup ) {
			return;
		}
		isSetup = true;

		// -------------------------- box sizing -------------------------- //

		/**
		 * WebKit measures the outer-width on style.width on border-box elems
		 * IE & Firefox<29 measures the inner-width
		 */
		var div = document.createElement('div');
		div.style.width = '200px';
		div.style.padding = '1px 2px 3px 4px';
		div.style.borderStyle = 'solid';
		div.style.borderWidth = '1px 2px 3px 4px';
		div.style.boxSizing = 'border-box';

		var body = document.body || document.documentElement;
		body.appendChild( div );
		var style = getStyle( div );

		getSize.isBoxSizeOuter = isBoxSizeOuter = getStyleSize( style.width ) == 200;
		body.removeChild( div );

	}

// -------------------------- getSize -------------------------- //

	function getSize( elem ) {
		setup();

		// use querySeletor if elem is string
		if ( typeof elem == 'string' ) {
			elem = document.querySelector( elem );
		}

		// do not proceed on non-objects
		if ( !elem || typeof elem != 'object' || !elem.nodeType ) {
			return;
		}

		var style = getStyle( elem );

		// if hidden, everything is 0
		if ( style.display == 'none' ) {
			return getZeroSize();
		}

		var size = {};
		size.width = elem.offsetWidth;
		size.height = elem.offsetHeight;

		var isBorderBox = size.isBorderBox = style.boxSizing == 'border-box';

		// get all measurements
		for ( var i=0; i < measurementsLength; i++ ) {
			var measurement = measurements[i];
			var value = style[ measurement ];
			var num = parseFloat( value );
			// any 'auto', 'medium' value will be 0
			size[ measurement ] = !isNaN( num ) ? num : 0;
		}

		var paddingWidth = size.paddingLeft + size.paddingRight;
		var paddingHeight = size.paddingTop + size.paddingBottom;
		var marginWidth = size.marginLeft + size.marginRight;
		var marginHeight = size.marginTop + size.marginBottom;
		var borderWidth = size.borderLeftWidth + size.borderRightWidth;
		var borderHeight = size.borderTopWidth + size.borderBottomWidth;

		var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

		// overwrite width and height if we can get it from style
		var styleWidth = getStyleSize( style.width );
		if ( styleWidth !== false ) {
			size.width = styleWidth +
				// add padding and border unless it's already including it
				( isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth );
		}

		var styleHeight = getStyleSize( style.height );
		if ( styleHeight !== false ) {
			size.height = styleHeight +
				// add padding and border unless it's already including it
				( isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight );
		}

		size.innerWidth = size.width - ( paddingWidth + borderWidth );
		size.innerHeight = size.height - ( paddingHeight + borderHeight );

		size.outerWidth = size.width + marginWidth;
		size.outerHeight = size.height + marginHeight;

		return size;
	}

	return getSize;

});

/**
 * matchesSelector v2.0.2
 * matchesSelector( element, '.selector' )
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */

( function( window, factory ) {
	/*global define: false, module: false */
	'use strict';
	// universal module definition
	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'desandro-matches-selector/matches-selector',factory );
	} else if ( typeof module == 'object' && module.exports ) {
		// CommonJS
		module.exports = factory();
	} else {
		// browser global
		window.matchesSelector = factory();
	}

}( window, function factory() {
	'use strict';

	var matchesMethod = ( function() {
		var ElemProto = window.Element.prototype;
		// check for the standard method name first
		if ( ElemProto.matches ) {
			return 'matches';
		}
		// check un-prefixed
		if ( ElemProto.matchesSelector ) {
			return 'matchesSelector';
		}
		// check vendor prefixes
		var prefixes = [ 'webkit', 'moz', 'ms', 'o' ];

		for ( var i=0; i < prefixes.length; i++ ) {
			var prefix = prefixes[i];
			var method = prefix + 'MatchesSelector';
			if ( ElemProto[ method ] ) {
				return method;
			}
		}
	})();

	return function matchesSelector( elem, selector ) {
		return elem[ matchesMethod ]( selector );
	};

}));

/**
 * Fizzy UI utils v2.0.5
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */

( function( window, factory ) {
	// universal module definition
	/*jshint strict: false */ /*globals define, module, require */

	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'fizzy-ui-utils/utils',[
			'desandro-matches-selector/matches-selector'
		], function( matchesSelector ) {
			return factory( window, matchesSelector );
		});
	} else if ( typeof module == 'object' && module.exports ) {
		// CommonJS
		module.exports = factory(
			window,
			require('desandro-matches-selector')
		);
	} else {
		// browser global
		window.fizzyUIUtils = factory(
			window,
			window.matchesSelector
		);
	}

}( window, function factory( window, matchesSelector ) {



	var utils = {};

// ----- extend ----- //

// extends objects
	utils.extend = function( a, b ) {
		for ( var prop in b ) {
			a[ prop ] = b[ prop ];
		}
		return a;
	};

// ----- modulo ----- //

	utils.modulo = function( num, div ) {
		return ( ( num % div ) + div ) % div;
	};

// ----- makeArray ----- //

// turn element or nodeList into an array
	utils.makeArray = function( obj ) {
		var ary = [];
		if ( Array.isArray( obj ) ) {
			// use object if already an array
			ary = obj;
		} else if ( obj && typeof obj == 'object' &&
			typeof obj.length == 'number' ) {
			// convert nodeList to array
			for ( var i=0; i < obj.length; i++ ) {
				ary.push( obj[i] );
			}
		} else {
			// array of single index
			ary.push( obj );
		}
		return ary;
	};

// ----- removeFrom ----- //

	utils.removeFrom = function( ary, obj ) {
		var index = ary.indexOf( obj );
		if ( index != -1 ) {
			ary.splice( index, 1 );
		}
	};

// ----- getParent ----- //

	utils.getParent = function( elem, selector ) {
		while ( elem.parentNode && elem != document.body ) {
			elem = elem.parentNode;
			if ( matchesSelector( elem, selector ) ) {
				return elem;
			}
		}
	};

// ----- getQueryElement ----- //

// use element as selector string
	utils.getQueryElement = function( elem ) {
		if ( typeof elem == 'string' ) {
			return document.querySelector( elem );
		}
		return elem;
	};

// ----- handleEvent ----- //

// enable .ontype to trigger from .addEventListener( elem, 'type' )
	utils.handleEvent = function( event ) {
		var method = 'on' + event.type;
		if ( this[ method ] ) {
			this[ method ]( event );
		}
	};

// ----- filterFindElements ----- //

	utils.filterFindElements = function( elems, selector ) {
		// make array of elems
		elems = utils.makeArray( elems );
		var ffElems = [];

		elems.forEach( function( elem ) {
			// check that elem is an actual element
			if ( !( elem instanceof HTMLElement ) ) {
				return;
			}
			// add elem if no selector
			if ( !selector ) {
				ffElems.push( elem );
				return;
			}
			// filter & find items if we have a selector
			// filter
			if ( matchesSelector( elem, selector ) ) {
				ffElems.push( elem );
			}
			// find children
			var childElems = elem.querySelectorAll( selector );
			// concat childElems to filterFound array
			for ( var i=0; i < childElems.length; i++ ) {
				ffElems.push( childElems[i] );
			}
		});

		return ffElems;
	};

// ----- debounceMethod ----- //

	utils.debounceMethod = function( _class, methodName, threshold ) {
		// original method
		var method = _class.prototype[ methodName ];
		var timeoutName = methodName + 'Timeout';

		_class.prototype[ methodName ] = function() {
			var timeout = this[ timeoutName ];
			if ( timeout ) {
				clearTimeout( timeout );
			}
			var args = arguments;

			var _this = this;
			this[ timeoutName ] = setTimeout( function() {
				method.apply( _this, args );
				delete _this[ timeoutName ];
			}, threshold || 100 );
		};
	};

// ----- docReady ----- //

	utils.docReady = function( callback ) {
		var readyState = document.readyState;
		if ( readyState == 'complete' || readyState == 'interactive' ) {
			// do async to allow for other scripts to run. metafizzy/flickity#441
			setTimeout( callback );
		} else {
			document.addEventListener( 'DOMContentLoaded', callback );
		}
	};

// ----- htmlInit ----- //

// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
	utils.toDashed = function( str ) {
		return str.replace( /(.)([A-Z])/g, function( match, $1, $2 ) {
			return $1 + '-' + $2;
		}).toLowerCase();
	};

	var console = window.console;
	/**
	 * allow user to initialize classes via [data-namespace] or .js-namespace class
	 * htmlInit( Widget, 'widgetName' )
	 * options are parsed from data-namespace-options
	 */
	utils.htmlInit = function( WidgetClass, namespace ) {
		utils.docReady( function() {
			var dashedNamespace = utils.toDashed( namespace );
			var dataAttr = 'data-' + dashedNamespace;
			var dataAttrElems = document.querySelectorAll( '[' + dataAttr + ']' );
			var jsDashElems = document.querySelectorAll( '.js-' + dashedNamespace );
			var elems = utils.makeArray( dataAttrElems )
				.concat( utils.makeArray( jsDashElems ) );
			var dataOptionsAttr = dataAttr + '-options';
			var jQuery = window.jQuery;

			elems.forEach( function( elem ) {
				var attr = elem.getAttribute( dataAttr ) ||
					elem.getAttribute( dataOptionsAttr );
				var options;
				try {
					options = attr && JSON.parse( attr );
				} catch ( error ) {
					// log error, do not initialize
					if ( console ) {
						console.error( 'Error parsing ' + dataAttr + ' on ' + elem.className +
							': ' + error );
					}
					return;
				}
				// initialize
				var instance = new WidgetClass( elem, options );
				// make available via $().data('namespace')
				if ( jQuery ) {
					jQuery.data( elem, namespace, instance );
				}
			});

		});
	};

// -----  ----- //

	return utils;

}));

// Flickity.Cell
( function( window, factory ) {
	// universal module definition
	/* jshint strict: false */
	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'flickity/js/cell',[
			'get-size/get-size'
		], function( getSize ) {
			return factory( window, getSize );
		});
	} else if ( typeof module == 'object' && module.exports ) {
		// CommonJS
		module.exports = factory(
			window,
			require('get-size')
		);
	} else {
		// browser global
		window.Flickity = window.Flickity || {};
		window.Flickity.Cell = factory(
			window,
			window.getSize
		);
	}

}( window, function factory( window, getSize ) {



	function Cell( elem, parent ) {
		this.element = elem;
		this.parent = parent;

		this.create();
	}

	var proto = Cell.prototype;

	proto.create = function() {
		this.element.style.position = 'absolute';
		this.x = 0;
		this.shift = 0;
	};

	proto.destroy = function() {
		// reset style
		this.element.style.position = '';
		var side = this.parent.originSide;
		this.element.style[ side ] = '';
	};

	proto.getSize = function() {
		this.size = getSize( this.element );
	};

	proto.setPosition = function( x ) {
		this.x = x;
		this.updateTarget();
		this.renderPosition( x );
	};

// setDefaultTarget v1 method, backwards compatibility, remove in v3
	proto.updateTarget = proto.setDefaultTarget = function() {
		var marginProperty = this.parent.originSide == 'left' ? 'marginLeft' : 'marginRight';
		this.target = this.x + this.size[ marginProperty ] +
			this.size.width * this.parent.cellAlign;
	};

	proto.renderPosition = function( x ) {
		// render position of cell with in slider
		var side = this.parent.originSide;
		this.element.style[ side ] = this.parent.getPositionValue( x );
	};

	/**
	 * @param {Integer} factor - 0, 1, or -1
	 **/
	proto.wrapShift = function( shift ) {
		this.shift = shift;
		this.renderPosition( this.x + this.parent.slideableWidth * shift );
	};

	proto.remove = function() {
		this.element.parentNode.removeChild( this.element );
	};

	return Cell;

}));

// slide
( function( window, factory ) {
	// universal module definition
	/* jshint strict: false */
	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'flickity/js/slide',factory );
	} else if ( typeof module == 'object' && module.exports ) {
		// CommonJS
		module.exports = factory();
	} else {
		// browser global
		window.Flickity = window.Flickity || {};
		window.Flickity.Slide = factory();
	}

}( window, function factory() {
	'use strict';

	function Slide( parent ) {
		this.parent = parent;
		this.isOriginLeft = parent.originSide == 'left';
		this.cells = [];
		this.outerWidth = 0;
		this.height = 0;
	}

	var proto = Slide.prototype;

	proto.addCell = function( cell ) {
		this.cells.push( cell );
		this.outerWidth += cell.size.outerWidth;
		this.height = Math.max( cell.size.outerHeight, this.height );
		// first cell stuff
		if ( this.cells.length == 1 ) {
			this.x = cell.x; // x comes from first cell
			var beginMargin = this.isOriginLeft ? 'marginLeft' : 'marginRight';
			this.firstMargin = cell.size[ beginMargin ];
		}
	};

	proto.updateTarget = function() {
		var endMargin = this.isOriginLeft ? 'marginRight' : 'marginLeft';
		var lastCell = this.getLastCell();
		var lastMargin = lastCell ? lastCell.size[ endMargin ] : 0;
		var slideWidth = this.outerWidth - ( this.firstMargin + lastMargin );
		this.target = this.x + this.firstMargin + slideWidth * this.parent.cellAlign;
	};

	proto.getLastCell = function() {
		return this.cells[ this.cells.length - 1 ];
	};

	proto.select = function() {
		this.changeSelectedClass('add');
	};

	proto.unselect = function() {
		this.changeSelectedClass('remove');
	};

	proto.changeSelectedClass = function( method ) {
		this.cells.forEach( function( cell ) {
			cell.element.classList[ method ]('is-selected');
		});
	};

	proto.getCellElements = function() {
		return this.cells.map( function( cell ) {
			return cell.element;
		});
	};

	return Slide;

}));

// animate
( function( window, factory ) {
	// universal module definition
	/* jshint strict: false */
	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'flickity/js/animate',[
			'fizzy-ui-utils/utils'
		], function( utils ) {
			return factory( window, utils );
		});
	} else if ( typeof module == 'object' && module.exports ) {
		// CommonJS
		module.exports = factory(
			window,
			require('fizzy-ui-utils')
		);
	} else {
		// browser global
		window.Flickity = window.Flickity || {};
		window.Flickity.animatePrototype = factory(
			window,
			window.fizzyUIUtils
		);
	}

}( window, function factory( window, utils ) {



// -------------------------- requestAnimationFrame -------------------------- //

// get rAF, prefixed, if present
	var requestAnimationFrame = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame;

// fallback to setTimeout
	var lastTime = 0;
	if ( !requestAnimationFrame )  {
		requestAnimationFrame = function( callback ) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
			var id = setTimeout( callback, timeToCall );
			lastTime = currTime + timeToCall;
			return id;
		};
	}

// -------------------------- animate -------------------------- //

	var proto = {};

	proto.startAnimation = function() {
		if ( this.isAnimating ) {
			return;
		}

		this.isAnimating = true;
		this.restingFrames = 0;
		this.animate();
	};

	proto.animate = function() {
		this.applyDragForce();
		this.applySelectedAttraction();

		var previousX = this.x;

		this.integratePhysics();
		this.positionSlider();
		this.settle( previousX );
		// animate next frame
		if ( this.isAnimating ) {
			var _this = this;
			requestAnimationFrame( function animateFrame() {
				_this.animate();
			});
		}
	};


	var transformProperty = ( function () {
		var style = document.documentElement.style;
		if ( typeof style.transform == 'string' ) {
			return 'transform';
		}
		return 'WebkitTransform';
	})();

	proto.positionSlider = function() {
		var x = this.x;
		// wrap position around
		if ( this.options.wrapAround && this.cells.length > 1 ) {
			x = utils.modulo( x, this.slideableWidth );
			x = x - this.slideableWidth;
			this.shiftWrapCells( x );
		}

		x = x + this.cursorPosition;
		// reverse if right-to-left and using transform
		x = this.options.rightToLeft && transformProperty ? -x : x;
		var value = this.getPositionValue( x );
		// use 3D tranforms for hardware acceleration on iOS
		// but use 2D when settled, for better font-rendering
		this.slider.style[ transformProperty ] = this.isAnimating ?
			'translate3d(' + value + ',0,0)' : 'translateX(' + value + ')';

		// scroll event
		var firstSlide = this.slides[0];
		if ( firstSlide ) {
			var positionX = -this.x - firstSlide.target;
			var progress = positionX / this.slidesWidth;
			this.dispatchEvent( 'scroll', null, [ progress, positionX ] );
		}
	};

	proto.positionSliderAtSelected = function() {
		if ( !this.cells.length ) {
			return;
		}
		this.x = -this.selectedSlide.target;
		this.positionSlider();
	};

	proto.getPositionValue = function( position ) {
		if ( this.options.percentPosition ) {
			// percent position, round to 2 digits, like 12.34%
			return ( Math.round( ( position / this.size.innerWidth ) * 10000 ) * 0.01 )+ '%';
		} else {
			// pixel positioning
			return Math.round( position ) + 'px';
		}
	};

	proto.settle = function( previousX ) {
		// keep track of frames where x hasn't moved
		if ( !this.isPointerDown && Math.round( this.x * 100 ) == Math.round( previousX * 100 ) ) {
			this.restingFrames++;
		}
		// stop animating if resting for 3 or more frames
		if ( this.restingFrames > 2 ) {
			this.isAnimating = false;
			delete this.isFreeScrolling;
			// render position with translateX when settled
			this.positionSlider();
			this.dispatchEvent('settle');
		}
	};

	proto.shiftWrapCells = function( x ) {
		// shift before cells
		var beforeGap = this.cursorPosition + x;
		this._shiftCells( this.beforeShiftCells, beforeGap, -1 );
		// shift after cells
		var afterGap = this.size.innerWidth - ( x + this.slideableWidth + this.cursorPosition );
		this._shiftCells( this.afterShiftCells, afterGap, 1 );
	};

	proto._shiftCells = function( cells, gap, shift ) {
		for ( var i=0; i < cells.length; i++ ) {
			var cell = cells[i];
			var cellShift = gap > 0 ? shift : 0;
			cell.wrapShift( cellShift );
			gap -= cell.size.outerWidth;
		}
	};

	proto._unshiftCells = function( cells ) {
		if ( !cells || !cells.length ) {
			return;
		}
		for ( var i=0; i < cells.length; i++ ) {
			cells[i].wrapShift( 0 );
		}
	};

// -------------------------- physics -------------------------- //

	proto.integratePhysics = function() {
		this.x += this.velocity;
		this.velocity *= this.getFrictionFactor();
	};

	proto.applyForce = function( force ) {
		this.velocity += force;
	};

	proto.getFrictionFactor = function() {
		return 1 - this.options[ this.isFreeScrolling ? 'freeScrollFriction' : 'friction' ];
	};

	proto.getRestingPosition = function() {
		// my thanks to Steven Wittens, who simplified this math greatly
		return this.x + this.velocity / ( 1 - this.getFrictionFactor() );
	};

	proto.applyDragForce = function() {
		if ( !this.isPointerDown ) {
			return;
		}
		// change the position to drag position by applying force
		var dragVelocity = this.dragX - this.x;
		var dragForce = dragVelocity - this.velocity;
		this.applyForce( dragForce );
	};

	proto.applySelectedAttraction = function() {
		// do not attract if pointer down or no cells
		if ( this.isPointerDown || this.isFreeScrolling || !this.cells.length ) {
			return;
		}
		var distance = this.selectedSlide.target * -1 - this.x;
		var force = distance * this.options.selectedAttraction;
		this.applyForce( force );
	};

	return proto;

}));

// Flickity main
( function( window, factory ) {
	// universal module definition
	/* jshint strict: false */
	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'flickity/js/flickity',[
			'ev-emitter/ev-emitter',
			'get-size/get-size',
			'fizzy-ui-utils/utils',
			'./cell',
			'./slide',
			'./animate'
		], function( EvEmitter, getSize, utils, Cell, Slide, animatePrototype ) {
			return factory( window, EvEmitter, getSize, utils, Cell, Slide, animatePrototype );
		});
	} else if ( typeof module == 'object' && module.exports ) {
		// CommonJS
		module.exports = factory(
			window,
			require('ev-emitter'),
			require('get-size'),
			require('fizzy-ui-utils'),
			require('./cell'),
			require('./slide'),
			require('./animate')
		);
	} else {
		// browser global
		var _Flickity = window.Flickity;

		window.Flickity = factory(
			window,
			window.EvEmitter,
			window.getSize,
			window.fizzyUIUtils,
			_Flickity.Cell,
			_Flickity.Slide,
			_Flickity.animatePrototype
		);
	}

}( window, function factory( window, EvEmitter, getSize,
														 utils, Cell, Slide, animatePrototype ) {



// vars
	var jQuery = window.jQuery;
	var getComputedStyle = window.getComputedStyle;
	var console = window.console;

	function moveElements( elems, toElem ) {
		elems = utils.makeArray( elems );
		while ( elems.length ) {
			toElem.appendChild( elems.shift() );
		}
	}

// -------------------------- Flickity -------------------------- //

// globally unique identifiers
	var GUID = 0;
// internal store of all Flickity intances
	var instances = {};

	function Flickity( element, options ) {
		var queryElement = utils.getQueryElement( element );
		if ( !queryElement ) {
			if ( console ) {
				console.error( 'Bad element for Flickity: ' + ( queryElement || element ) );
			}
			return;
		}
		this.element = queryElement;
		// do not initialize twice on same element
		if ( this.element.flickityGUID ) {
			var instance = instances[ this.element.flickityGUID ];
			instance.option( options );
			return instance;
		}

		// add jQuery
		if ( jQuery ) {
			this.$element = jQuery( this.element );
		}
		// options
		this.options = utils.extend( {}, this.constructor.defaults );
		this.option( options );

		// kick things off
		this._create();
	}

	Flickity.defaults = {
		accessibility: true,
		// adaptiveHeight: false,
		cellAlign: 'center',
		// cellSelector: undefined,
		// contain: false,
		freeScrollFriction: 0.075, // friction when free-scrolling
		friction: 0.28, // friction when selecting
		namespaceJQueryEvents: true,
		// initialIndex: 0,
		percentPosition: true,
		resize: true,
		selectedAttraction: 0.025,
		setGallerySize: true
		// watchCSS: false,
		// wrapAround: false
	};

// hash of methods triggered on _create()
	Flickity.createMethods = [];

	var proto = Flickity.prototype;
// inherit EventEmitter
	utils.extend( proto, EvEmitter.prototype );

	proto._create = function() {
		// add id for Flickity.data
		var id = this.guid = ++GUID;
		this.element.flickityGUID = id; // expando
		instances[ id ] = this; // associate via id
		// initial properties
		this.selectedIndex = 0;
		// how many frames slider has been in same position
		this.restingFrames = 0;
		// initial physics properties
		this.x = 0;
		this.velocity = 0;
		this.originSide = this.options.rightToLeft ? 'right' : 'left';
		// create viewport & slider
		this.viewport = document.createElement('div');
		this.viewport.className = 'flickity-viewport';
		this._createSlider();

		if ( this.options.resize || this.options.watchCSS ) {
			window.addEventListener( 'resize', this );
		}

		Flickity.createMethods.forEach( function( method ) {
			this[ method ]();
		}, this );

		if ( this.options.watchCSS ) {
			this.watchCSS();
		} else {
			this.activate();
		}

	};

	/**
	 * set options
	 * @param {Object} opts
	 */
	proto.option = function( opts ) {
		utils.extend( this.options, opts );
	};

	proto.activate = function() {
		if ( this.isActive ) {
			return;
		}
		this.isActive = true;
		this.element.classList.add('flickity-enabled');
		if ( this.options.rightToLeft ) {
			this.element.classList.add('flickity-rtl');
		}

		this.getSize();
		// move initial cell elements so they can be loaded as cells
		var cellElems = this._filterFindCellElements( this.element.children );
		moveElements( cellElems, this.slider );
		this.viewport.appendChild( this.slider );
		this.element.appendChild( this.viewport );
		// get cells from children
		this.reloadCells();

		if ( this.options.accessibility ) {
			// allow element to focusable
			this.element.tabIndex = 0;
			// listen for key presses
			this.element.addEventListener( 'keydown', this );
		}

		this.emitEvent('activate');

		var index;
		var initialIndex = this.options.initialIndex;
		if ( this.isInitActivated ) {
			index = this.selectedIndex;
		} else if ( initialIndex !== undefined ) {
			index = this.cells[ initialIndex ] ? initialIndex : 0;
		} else {
			index = 0;
		}
		// select instantly
		this.select( index, false, true );
		// flag for initial activation, for using initialIndex
		this.isInitActivated = true;
	};

// slider positions the cells
	proto._createSlider = function() {
		// slider element does all the positioning
		var slider = document.createElement('div');
		slider.className = 'flickity-slider';
		slider.style[ this.originSide ] = 0;
		this.slider = slider;
	};

	proto._filterFindCellElements = function( elems ) {
		return utils.filterFindElements( elems, this.options.cellSelector );
	};

// goes through all children
	proto.reloadCells = function() {
		// collection of item elements
		this.cells = this._makeCells( this.slider.children );
		this.positionCells();
		this._getWrapShiftCells();
		this.setGallerySize();
	};

	/**
	 * turn elements into Flickity.Cells
	 * @param {Array or NodeList or HTMLElement} elems
	 * @returns {Array} items - collection of new Flickity Cells
	 */
	proto._makeCells = function( elems ) {
		var cellElems = this._filterFindCellElements( elems );

		// create new Flickity for collection
		var cells = cellElems.map( function( cellElem ) {
			return new Cell( cellElem, this );
		}, this );

		return cells;
	};

	proto.getLastCell = function() {
		return this.cells[ this.cells.length - 1 ];
	};

	proto.getLastSlide = function() {
		return this.slides[ this.slides.length - 1 ];
	};

// positions all cells
	proto.positionCells = function() {
		// size all cells
		this._sizeCells( this.cells );
		// position all cells
		this._positionCells( 0 );
	};

	/**
	 * position certain cells
	 * @param {Integer} index - which cell to start with
	 */
	proto._positionCells = function( index ) {
		index = index || 0;
		// also measure maxCellHeight
		// start 0 if positioning all cells
		this.maxCellHeight = index ? this.maxCellHeight || 0 : 0;
		var cellX = 0;
		// get cellX
		if ( index > 0 ) {
			var startCell = this.cells[ index - 1 ];
			cellX = startCell.x + startCell.size.outerWidth;
		}
		var len = this.cells.length;
		for ( var i=index; i < len; i++ ) {
			var cell = this.cells[i];
			cell.setPosition( cellX );
			cellX += cell.size.outerWidth;
			this.maxCellHeight = Math.max( cell.size.outerHeight, this.maxCellHeight );
		}
		// keep track of cellX for wrap-around
		this.slideableWidth = cellX;
		// slides
		this.updateSlides();
		// contain slides target
		this._containSlides();
		// update slidesWidth
		this.slidesWidth = len ? this.getLastSlide().target - this.slides[0].target : 0;
	};

	/**
	 * cell.getSize() on multiple cells
	 * @param {Array} cells
	 */
	proto._sizeCells = function( cells ) {
		cells.forEach( function( cell ) {
			cell.getSize();
		});
	};

// --------------------------  -------------------------- //

	proto.updateSlides = function() {
		this.slides = [];
		if ( !this.cells.length ) {
			return;
		}

		var slide = new Slide( this );
		this.slides.push( slide );
		var isOriginLeft = this.originSide == 'left';
		var nextMargin = isOriginLeft ? 'marginRight' : 'marginLeft';

		var canCellFit = this._getCanCellFit();

		this.cells.forEach( function( cell, i ) {
			// just add cell if first cell in slide
			if ( !slide.cells.length ) {
				slide.addCell( cell );
				return;
			}

			var slideWidth = ( slide.outerWidth - slide.firstMargin ) +
				( cell.size.outerWidth - cell.size[ nextMargin ] );

			if ( canCellFit.call( this, i, slideWidth ) ) {
				slide.addCell( cell );
			} else {
				// doesn't fit, new slide
				slide.updateTarget();

				slide = new Slide( this );
				this.slides.push( slide );
				slide.addCell( cell );
			}
		}, this );
		// last slide
		slide.updateTarget();
		// update .selectedSlide
		this.updateSelectedSlide();
	};

	proto._getCanCellFit = function() {
		var groupCells = this.options.groupCells;
		if ( !groupCells ) {
			return function() {
				return false;
			};
		} else if ( typeof groupCells == 'number' ) {
			// group by number. 3 -> [0,1,2], [3,4,5], ...
			var number = parseInt( groupCells, 10 );
			return function( i ) {
				return ( i % number ) !== 0;
			};
		}
		// default, group by width of slide
		// parse '75%
		var percentMatch = typeof groupCells == 'string' &&
			groupCells.match(/^(\d+)%$/);
		var percent = percentMatch ? parseInt( percentMatch[1], 10 ) / 100 : 1;
		return function( i, slideWidth ) {
			return slideWidth <= ( this.size.innerWidth + 1 ) * percent;
		};
	};

// alias _init for jQuery plugin .flickity()
	proto._init =
		proto.reposition = function() {
			this.positionCells();
			this.positionSliderAtSelected();
		};

	proto.getSize = function() {
		this.size = getSize( this.element );
		this.setCellAlign();
		this.cursorPosition = this.size.innerWidth * this.cellAlign;
	};

	var cellAlignShorthands = {
		// cell align, then based on origin side
		center: {
			left: 0.5,
			right: 0.5
		},
		left: {
			left: 0,
			right: 1
		},
		right: {
			right: 0,
			left: 1
		}
	};

	proto.setCellAlign = function() {
		var shorthand = cellAlignShorthands[ this.options.cellAlign ];
		this.cellAlign = shorthand ? shorthand[ this.originSide ] : this.options.cellAlign;
	};

	proto.setGallerySize = function() {
		if ( this.options.setGallerySize ) {
			var height = this.options.adaptiveHeight && this.selectedSlide ?
				this.selectedSlide.height : this.maxCellHeight;
			this.viewport.style.height = height + 'px';
		}
	};

	proto._getWrapShiftCells = function() {
		// only for wrap-around
		if ( !this.options.wrapAround ) {
			return;
		}
		// unshift previous cells
		this._unshiftCells( this.beforeShiftCells );
		this._unshiftCells( this.afterShiftCells );
		// get before cells
		// initial gap
		var gapX = this.cursorPosition;
		var cellIndex = this.cells.length - 1;
		this.beforeShiftCells = this._getGapCells( gapX, cellIndex, -1 );
		// get after cells
		// ending gap between last cell and end of gallery viewport
		gapX = this.size.innerWidth - this.cursorPosition;
		// start cloning at first cell, working forwards
		this.afterShiftCells = this._getGapCells( gapX, 0, 1 );
	};

	proto._getGapCells = function( gapX, cellIndex, increment ) {
		// keep adding cells until the cover the initial gap
		var cells = [];
		while ( gapX > 0 ) {
			var cell = this.cells[ cellIndex ];
			if ( !cell ) {
				break;
			}
			cells.push( cell );
			cellIndex += increment;
			gapX -= cell.size.outerWidth;
		}
		return cells;
	};

// ----- contain ----- //

// contain cell targets so no excess sliding
	proto._containSlides = function() {
		if ( !this.options.contain || this.options.wrapAround || !this.cells.length ) {
			return;
		}
		var isRightToLeft = this.options.rightToLeft;
		var beginMargin = isRightToLeft ? 'marginRight' : 'marginLeft';
		var endMargin = isRightToLeft ? 'marginLeft' : 'marginRight';
		var contentWidth = this.slideableWidth - this.getLastCell().size[ endMargin ];
		// content is less than gallery size
		var isContentSmaller = contentWidth < this.size.innerWidth;
		// bounds
		var beginBound = this.cursorPosition + this.cells[0].size[ beginMargin ];
		var endBound = contentWidth - this.size.innerWidth * ( 1 - this.cellAlign );
		// contain each cell target
		this.slides.forEach( function( slide ) {
			if ( isContentSmaller ) {
				// all cells fit inside gallery
				slide.target = contentWidth * this.cellAlign;
			} else {
				// contain to bounds
				slide.target = Math.max( slide.target, beginBound );
				slide.target = Math.min( slide.target, endBound );
			}
		}, this );
	};

// -----  ----- //

	/**
	 * emits events via eventEmitter and jQuery events
	 * @param {String} type - name of event
	 * @param {Event} event - original event
	 * @param {Array} args - extra arguments
	 */
	proto.dispatchEvent = function( type, event, args ) {
		var emitArgs = event ? [ event ].concat( args ) : args;
		this.emitEvent( type, emitArgs );

		if ( jQuery && this.$element ) {
			// default trigger with type if no event
			type += this.options.namespaceJQueryEvents ? '.flickity' : '';
			var $event = type;
			if ( event ) {
				// create jQuery event
				var jQEvent = jQuery.Event( event );
				jQEvent.type = type;
				$event = jQEvent;
			}
			this.$element.trigger( $event, args );
		}
	};

// -------------------------- select -------------------------- //

	/**
	 * @param {Integer} index - index of the slide
	 * @param {Boolean} isWrap - will wrap-around to last/first if at the end
	 * @param {Boolean} isInstant - will immediately set position at selected cell
	 */
	proto.select = function( index, isWrap, isInstant ) {
		if ( !this.isActive ) {
			return;
		}
		index = parseInt( index, 10 );
		this._wrapSelect( index );

		if ( this.options.wrapAround || isWrap ) {
			index = utils.modulo( index, this.slides.length );
		}
		// bail if invalid index
		if ( !this.slides[ index ] ) {
			return;
		}
		this.selectedIndex = index;
		this.updateSelectedSlide();
		if ( isInstant ) {
			this.positionSliderAtSelected();
		} else {
			this.startAnimation();
		}
		if ( this.options.adaptiveHeight ) {
			this.setGallerySize();
		}

		this.dispatchEvent('select');
		// old v1 event name, remove in v3
		this.dispatchEvent('cellSelect');
	};

// wraps position for wrapAround, to move to closest slide. #113
	proto._wrapSelect = function( index ) {
		var len = this.slides.length;
		var isWrapping = this.options.wrapAround && len > 1;
		if ( !isWrapping ) {
			return index;
		}
		var wrapIndex = utils.modulo( index, len );
		// go to shortest
		var delta = Math.abs( wrapIndex - this.selectedIndex );
		var backWrapDelta = Math.abs( ( wrapIndex + len ) - this.selectedIndex );
		var forewardWrapDelta = Math.abs( ( wrapIndex - len ) - this.selectedIndex );
		if ( !this.isDragSelect && backWrapDelta < delta ) {
			index += len;
		} else if ( !this.isDragSelect && forewardWrapDelta < delta ) {
			index -= len;
		}
		// wrap position so slider is within normal area
		if ( index < 0 ) {
			this.x -= this.slideableWidth;
		} else if ( index >= len ) {
			this.x += this.slideableWidth;
		}
	};

	proto.previous = function( isWrap, isInstant ) {
		this.select( this.selectedIndex - 1, isWrap, isInstant );
	};

	proto.next = function( isWrap, isInstant ) {
		this.select( this.selectedIndex + 1, isWrap, isInstant );
	};

	proto.updateSelectedSlide = function() {
		var slide = this.slides[ this.selectedIndex ];
		// selectedIndex could be outside of slides, if triggered before resize()
		if ( !slide ) {
			return;
		}
		// unselect previous selected slide
		this.unselectSelectedSlide();
		// update new selected slide
		this.selectedSlide = slide;
		slide.select();
		this.selectedCells = slide.cells;
		this.selectedElements = slide.getCellElements();
		// HACK: selectedCell & selectedElement is first cell in slide, backwards compatibility
		// Remove in v3?
		this.selectedCell = slide.cells[0];
		this.selectedElement = this.selectedElements[0];
	};

	proto.unselectSelectedSlide = function() {
		if ( this.selectedSlide ) {
			this.selectedSlide.unselect();
		}
	};

	/**
	 * select slide from number or cell element
	 * @param {Element or Number} elem
	 */
	proto.selectCell = function( value, isWrap, isInstant ) {
		// get cell
		var cell;
		if ( typeof value == 'number' ) {
			cell = this.cells[ value ];
		} else {
			// use string as selector
			if ( typeof value == 'string' ) {
				value = this.element.querySelector( value );
			}
			// get cell from element
			cell = this.getCell( value );
		}
		// select slide that has cell
		for ( var i=0; cell && i < this.slides.length; i++ ) {
			var slide = this.slides[i];
			var index = slide.cells.indexOf( cell );
			if ( index != -1 ) {
				this.select( i, isWrap, isInstant );
				return;
			}
		}
	};

// -------------------------- get cells -------------------------- //

	/**
	 * get Flickity.Cell, given an Element
	 * @param {Element} elem
	 * @returns {Flickity.Cell} item
	 */
	proto.getCell = function( elem ) {
		// loop through cells to get the one that matches
		for ( var i=0; i < this.cells.length; i++ ) {
			var cell = this.cells[i];
			if ( cell.element == elem ) {
				return cell;
			}
		}
	};

	/**
	 * get collection of Flickity.Cells, given Elements
	 * @param {Element, Array, NodeList} elems
	 * @returns {Array} cells - Flickity.Cells
	 */
	proto.getCells = function( elems ) {
		elems = utils.makeArray( elems );
		var cells = [];
		elems.forEach( function( elem ) {
			var cell = this.getCell( elem );
			if ( cell ) {
				cells.push( cell );
			}
		}, this );
		return cells;
	};

	/**
	 * get cell elements
	 * @returns {Array} cellElems
	 */
	proto.getCellElements = function() {
		return this.cells.map( function( cell ) {
			return cell.element;
		});
	};

	/**
	 * get parent cell from an element
	 * @param {Element} elem
	 * @returns {Flickit.Cell} cell
	 */
	proto.getParentCell = function( elem ) {
		// first check if elem is cell
		var cell = this.getCell( elem );
		if ( cell ) {
			return cell;
		}
		// try to get parent cell elem
		elem = utils.getParent( elem, '.flickity-slider > *' );
		return this.getCell( elem );
	};

	/**
	 * get cells adjacent to a slide
	 * @param {Integer} adjCount - number of adjacent slides
	 * @param {Integer} index - index of slide to start
	 * @returns {Array} cells - array of Flickity.Cells
	 */
	proto.getAdjacentCellElements = function( adjCount, index ) {
		if ( !adjCount ) {
			return this.selectedSlide.getCellElements();
		}
		index = index === undefined ? this.selectedIndex : index;

		var len = this.slides.length;
		if ( 1 + ( adjCount * 2 ) >= len ) {
			return this.getCellElements();
		}

		var cellElems = [];
		for ( var i = index - adjCount; i <= index + adjCount ; i++ ) {
			var slideIndex = this.options.wrapAround ? utils.modulo( i, len ) : i;
			var slide = this.slides[ slideIndex ];
			if ( slide ) {
				cellElems = cellElems.concat( slide.getCellElements() );
			}
		}
		return cellElems;
	};

// -------------------------- events -------------------------- //

	proto.uiChange = function() {
		this.emitEvent('uiChange');
	};

	proto.childUIPointerDown = function( event ) {
		this.emitEvent( 'childUIPointerDown', [ event ] );
	};

// ----- resize ----- //

	proto.onresize = function() {
		this.watchCSS();
		this.resize();
	};

	utils.debounceMethod( Flickity, 'onresize', 150 );

	proto.resize = function() {
		if ( !this.isActive ) {
			return;
		}
		this.getSize();
		// wrap values
		if ( this.options.wrapAround ) {
			this.x = utils.modulo( this.x, this.slideableWidth );
		}
		this.positionCells();
		this._getWrapShiftCells();
		this.setGallerySize();
		this.emitEvent('resize');
		// update selected index for group slides, instant
		// TODO: position can be lost between groups of various numbers
		var selectedElement = this.selectedElements && this.selectedElements[0];
		this.selectCell( selectedElement, false, true );
	};

// watches the :after property, activates/deactivates
	proto.watchCSS = function() {
		var watchOption = this.options.watchCSS;
		if ( !watchOption ) {
			return;
		}

		var afterContent = getComputedStyle( this.element, ':after' ).content;
		// activate if :after { content: 'flickity' }
		if ( afterContent.indexOf('flickity') != -1 ) {
			this.activate();
		} else {
			this.deactivate();
		}
	};

// ----- keydown ----- //

// go previous/next if left/right keys pressed
	proto.onkeydown = function( event ) {
		// only work if element is in focus
		if ( !this.options.accessibility ||
			( document.activeElement && document.activeElement != this.element ) ) {
			return;
		}

		if ( event.keyCode == 37 ) {
			// go left
			var leftMethod = this.options.rightToLeft ? 'next' : 'previous';
			this.uiChange();
			this[ leftMethod ]();
		} else if ( event.keyCode == 39 ) {
			// go right
			var rightMethod = this.options.rightToLeft ? 'previous' : 'next';
			this.uiChange();
			this[ rightMethod ]();
		}
	};

// -------------------------- destroy -------------------------- //

// deactivate all Flickity functionality, but keep stuff available
	proto.deactivate = function() {
		if ( !this.isActive ) {
			return;
		}
		this.element.classList.remove('flickity-enabled');
		this.element.classList.remove('flickity-rtl');
		// destroy cells
		this.cells.forEach( function( cell ) {
			cell.destroy();
		});
		this.unselectSelectedSlide();
		this.element.removeChild( this.viewport );
		// move child elements back into element
		moveElements( this.slider.children, this.element );
		if ( this.options.accessibility ) {
			this.element.removeAttribute('tabIndex');
			this.element.removeEventListener( 'keydown', this );
		}
		// set flags
		this.isActive = false;
		this.emitEvent('deactivate');
	};

	proto.destroy = function() {
		this.deactivate();
		window.removeEventListener( 'resize', this );
		this.emitEvent('destroy');
		if ( jQuery && this.$element ) {
			jQuery.removeData( this.element, 'flickity' );
		}
		delete this.element.flickityGUID;
		delete instances[ this.guid ];
	};

// -------------------------- prototype -------------------------- //

	utils.extend( proto, animatePrototype );

// -------------------------- extras -------------------------- //

	/**
	 * get Flickity instance from element
	 * @param {Element} elem
	 * @returns {Flickity}
	 */
	Flickity.data = function( elem ) {
		elem = utils.getQueryElement( elem );
		var id = elem && elem.flickityGUID;
		return id && instances[ id ];
	};

	utils.htmlInit( Flickity, 'flickity' );

	if ( jQuery && jQuery.bridget ) {
		jQuery.bridget( 'flickity', Flickity );
	}

// set internal jQuery, for Webpack + jQuery v3, #478
	Flickity.setJQuery = function( jq ) {
		jQuery = jq;
	};

	Flickity.Cell = Cell;

	return Flickity;

}));

/*!
 * Unipointer v2.2.0
 * base class for doing one thing with pointer event
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */

( function( window, factory ) {
	// universal module definition
	/* jshint strict: false */ /*global define, module, require */
	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'unipointer/unipointer',[
			'ev-emitter/ev-emitter'
		], function( EvEmitter ) {
			return factory( window, EvEmitter );
		});
	} else if ( typeof module == 'object' && module.exports ) {
		// CommonJS
		module.exports = factory(
			window,
			require('ev-emitter')
		);
	} else {
		// browser global
		window.Unipointer = factory(
			window,
			window.EvEmitter
		);
	}

}( window, function factory( window, EvEmitter ) {



	function noop() {}

	function Unipointer() {}

// inherit EvEmitter
	var proto = Unipointer.prototype = Object.create( EvEmitter.prototype );

	proto.bindStartEvent = function( elem ) {
		this._bindStartEvent( elem, true );
	};

	proto.unbindStartEvent = function( elem ) {
		this._bindStartEvent( elem, false );
	};

	/**
	 * works as unbinder, as you can ._bindStart( false ) to unbind
	 * @param {Boolean} isBind - will unbind if falsey
	 */
	proto._bindStartEvent = function( elem, isBind ) {
		// munge isBind, default to true
		isBind = isBind === undefined ? true : !!isBind;
		var bindMethod = isBind ? 'addEventListener' : 'removeEventListener';

		if ( window.PointerEvent ) {
			// Pointer Events. Chrome 55, IE11, Edge 14
			elem[ bindMethod ]( 'pointerdown', this );
		} else {
			// listen for both, for devices like Chrome Pixel
			elem[ bindMethod ]( 'mousedown', this );
			elem[ bindMethod ]( 'touchstart', this );
		}
	};

// trigger handler methods for events
	proto.handleEvent = function( event ) {
		var method = 'on' + event.type;
		if ( this[ method ] ) {
			this[ method ]( event );
		}
	};

// returns the touch that we're keeping track of
	proto.getTouch = function( touches ) {
		for ( var i=0; i < touches.length; i++ ) {
			var touch = touches[i];
			if ( touch.identifier == this.pointerIdentifier ) {
				return touch;
			}
		}
	};

// ----- start event ----- //

	proto.onmousedown = function( event ) {
		// dismiss clicks from right or middle buttons
		var button = event.button;
		if ( button && ( button !== 0 && button !== 1 ) ) {
			return;
		}
		this._pointerDown( event, event );
	};

	proto.ontouchstart = function( event ) {
		this._pointerDown( event, event.changedTouches[0] );
	};

	proto.onpointerdown = function( event ) {
		this._pointerDown( event, event );
	};

	/**
	 * pointer start
	 * @param {Event} event
	 * @param {Event or Touch} pointer
	 */
	proto._pointerDown = function( event, pointer ) {
		// dismiss other pointers
		if ( this.isPointerDown ) {
			return;
		}

		this.isPointerDown = true;
		// save pointer identifier to match up touch events
		this.pointerIdentifier = pointer.pointerId !== undefined ?
			// pointerId for pointer events, touch.indentifier for touch events
			pointer.pointerId : pointer.identifier;

		this.pointerDown( event, pointer );
	};

	proto.pointerDown = function( event, pointer ) {
		this._bindPostStartEvents( event );
		this.emitEvent( 'pointerDown', [ event, pointer ] );
	};

// hash of events to be bound after start event
	var postStartEvents = {
		mousedown: [ 'mousemove', 'mouseup' ],
		touchstart: [ 'touchmove', 'touchend', 'touchcancel' ],
		pointerdown: [ 'pointermove', 'pointerup', 'pointercancel' ],
	};

	proto._bindPostStartEvents = function( event ) {
		if ( !event ) {
			return;
		}
		// get proper events to match start event
		var events = postStartEvents[ event.type ];
		// bind events to node
		events.forEach( function( eventName ) {
			window.addEventListener( eventName, this );
		}, this );
		// save these arguments
		this._boundPointerEvents = events;
	};

	proto._unbindPostStartEvents = function() {
		// check for _boundEvents, in case dragEnd triggered twice (old IE8 bug)
		if ( !this._boundPointerEvents ) {
			return;
		}
		this._boundPointerEvents.forEach( function( eventName ) {
			window.removeEventListener( eventName, this );
		}, this );

		delete this._boundPointerEvents;
	};

// ----- move event ----- //

	proto.onmousemove = function( event ) {
		this._pointerMove( event, event );
	};

	proto.onpointermove = function( event ) {
		if ( event.pointerId == this.pointerIdentifier ) {
			this._pointerMove( event, event );
		}
	};

	proto.ontouchmove = function( event ) {
		var touch = this.getTouch( event.changedTouches );
		if ( touch ) {
			this._pointerMove( event, touch );
		}
	};

	/**
	 * pointer move
	 * @param {Event} event
	 * @param {Event or Touch} pointer
	 * @private
	 */
	proto._pointerMove = function( event, pointer ) {
		this.pointerMove( event, pointer );
	};

// public
	proto.pointerMove = function( event, pointer ) {
		this.emitEvent( 'pointerMove', [ event, pointer ] );
	};

// ----- end event ----- //


	proto.onmouseup = function( event ) {
		this._pointerUp( event, event );
	};

	proto.onpointerup = function( event ) {
		if ( event.pointerId == this.pointerIdentifier ) {
			this._pointerUp( event, event );
		}
	};

	proto.ontouchend = function( event ) {
		var touch = this.getTouch( event.changedTouches );
		if ( touch ) {
			this._pointerUp( event, touch );
		}
	};

	/**
	 * pointer up
	 * @param {Event} event
	 * @param {Event or Touch} pointer
	 * @private
	 */
	proto._pointerUp = function( event, pointer ) {
		this._pointerDone();
		this.pointerUp( event, pointer );
	};

// public
	proto.pointerUp = function( event, pointer ) {
		this.emitEvent( 'pointerUp', [ event, pointer ] );
	};

// ----- pointer done ----- //

// triggered on pointer up & pointer cancel
	proto._pointerDone = function() {
		// reset properties
		this.isPointerDown = false;
		delete this.pointerIdentifier;
		// remove events
		this._unbindPostStartEvents();
		this.pointerDone();
	};

	proto.pointerDone = noop;

// ----- pointer cancel ----- //

	proto.onpointercancel = function( event ) {
		if ( event.pointerId == this.pointerIdentifier ) {
			this._pointerCancel( event, event );
		}
	};

	proto.ontouchcancel = function( event ) {
		var touch = this.getTouch( event.changedTouches );
		if ( touch ) {
			this._pointerCancel( event, touch );
		}
	};

	/**
	 * pointer cancel
	 * @param {Event} event
	 * @param {Event or Touch} pointer
	 * @private
	 */
	proto._pointerCancel = function( event, pointer ) {
		this._pointerDone();
		this.pointerCancel( event, pointer );
	};

// public
	proto.pointerCancel = function( event, pointer ) {
		this.emitEvent( 'pointerCancel', [ event, pointer ] );
	};

// -----  ----- //

// utility function for getting x/y coords from event
	Unipointer.getPointerPoint = function( pointer ) {
		return {
			x: pointer.pageX,
			y: pointer.pageY
		};
	};

// -----  ----- //

	return Unipointer;

}));

/*!
 * Unidragger v2.2.3
 * Draggable base class
 * MIT license
 */

/*jshint browser: true, unused: true, undef: true, strict: true */

( function( window, factory ) {
	// universal module definition
	/*jshint strict: false */ /*globals define, module, require */

	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'unidragger/unidragger',[
			'unipointer/unipointer'
		], function( Unipointer ) {
			return factory( window, Unipointer );
		});
	} else if ( typeof module == 'object' && module.exports ) {
		// CommonJS
		module.exports = factory(
			window,
			require('unipointer')
		);
	} else {
		// browser global
		window.Unidragger = factory(
			window,
			window.Unipointer
		);
	}

}( window, function factory( window, Unipointer ) {



// -------------------------- Unidragger -------------------------- //

	function Unidragger() {}

// inherit Unipointer & EvEmitter
	var proto = Unidragger.prototype = Object.create( Unipointer.prototype );

// ----- bind start ----- //

	proto.bindHandles = function() {
		this._bindHandles( true );
	};

	proto.unbindHandles = function() {
		this._bindHandles( false );
	};

	/**
	 * works as unbinder, as you can .bindHandles( false ) to unbind
	 * @param {Boolean} isBind - will unbind if falsey
	 */
	proto._bindHandles = function( isBind ) {
		// munge isBind, default to true
		isBind = isBind === undefined ? true : !!isBind;
		// bind each handle
		var bindMethod = isBind ? 'addEventListener' : 'removeEventListener';
		for ( var i=0; i < this.handles.length; i++ ) {
			var handle = this.handles[i];
			this._bindStartEvent( handle, isBind );
			handle[ bindMethod ]( 'click', this );
			// touch-action: none to override browser touch gestures
			// metafizzy/flickity#540
			if ( window.PointerEvent ) {
				handle.style.touchAction = isBind ? this._touchActionValue : '';
			}
		}
	};

// prototype so it can be overwriteable by Flickity
	proto._touchActionValue = 'none';

// ----- start event ----- //

	/**
	 * pointer start
	 * @param {Event} event
	 * @param {Event or Touch} pointer
	 */
	proto.pointerDown = function( event, pointer ) {
		// dismiss range sliders
		if ( event.target.nodeName == 'INPUT' && event.target.type == 'range' ) {
			// reset pointerDown logic
			this.isPointerDown = false;
			delete this.pointerIdentifier;
			return;
		}

		this._dragPointerDown( event, pointer );
		// kludge to blur focused inputs in dragger
		var focused = document.activeElement;
		if ( focused && focused.blur ) {
			focused.blur();
		}
		// bind move and end events
		this._bindPostStartEvents( event );
		this.emitEvent( 'pointerDown', [ event, pointer ] );
	};

// base pointer down logic
	proto._dragPointerDown = function( event, pointer ) {
		// track to see when dragging starts
		this.pointerDownPoint = Unipointer.getPointerPoint( pointer );

		var canPreventDefault = this.canPreventDefaultOnPointerDown( event, pointer );
		if ( canPreventDefault ) {
			event.preventDefault();
		}
	};

// overwriteable method so Flickity can prevent for scrolling
	proto.canPreventDefaultOnPointerDown = function( event ) {
		// prevent default, unless touchstart or <select>
		return event.target.nodeName != 'SELECT';
	};

// ----- move event ----- //

	/**
	 * drag move
	 * @param {Event} event
	 * @param {Event or Touch} pointer
	 */
	proto.pointerMove = function( event, pointer ) {
		var moveVector = this._dragPointerMove( event, pointer );
		this.emitEvent( 'pointerMove', [ event, pointer, moveVector ] );
		this._dragMove( event, pointer, moveVector );
	};

// base pointer move logic
	proto._dragPointerMove = function( event, pointer ) {
		var movePoint = Unipointer.getPointerPoint( pointer );
		var moveVector = {
			x: movePoint.x - this.pointerDownPoint.x,
			y: movePoint.y - this.pointerDownPoint.y
		};
		// start drag if pointer has moved far enough to start drag
		if ( !this.isDragging && this.hasDragStarted( moveVector ) ) {
			this._dragStart( event, pointer );
		}
		return moveVector;
	};

// condition if pointer has moved far enough to start drag
	proto.hasDragStarted = function( moveVector ) {
		return Math.abs( moveVector.x ) > 3 || Math.abs( moveVector.y ) > 3;
	};


// ----- end event ----- //

	/**
	 * pointer up
	 * @param {Event} event
	 * @param {Event or Touch} pointer
	 */
	proto.pointerUp = function( event, pointer ) {
		this.emitEvent( 'pointerUp', [ event, pointer ] );
		this._dragPointerUp( event, pointer );
	};

	proto._dragPointerUp = function( event, pointer ) {
		if ( this.isDragging ) {
			this._dragEnd( event, pointer );
		} else {
			// pointer didn't move enough for drag to start
			this._staticClick( event, pointer );
		}
	};

// -------------------------- drag -------------------------- //

// dragStart
	proto._dragStart = function( event, pointer ) {
		this.isDragging = true;
		this.dragStartPoint = Unipointer.getPointerPoint( pointer );
		// prevent clicks
		this.isPreventingClicks = true;

		this.dragStart( event, pointer );
	};

	proto.dragStart = function( event, pointer ) {
		this.emitEvent( 'dragStart', [ event, pointer ] );
	};

// dragMove
	proto._dragMove = function( event, pointer, moveVector ) {
		// do not drag if not dragging yet
		if ( !this.isDragging ) {
			return;
		}

		this.dragMove( event, pointer, moveVector );
	};

	proto.dragMove = function( event, pointer, moveVector ) {
		event.preventDefault();
		this.emitEvent( 'dragMove', [ event, pointer, moveVector ] );
	};

// dragEnd
	proto._dragEnd = function( event, pointer ) {
		// set flags
		this.isDragging = false;
		// re-enable clicking async
		setTimeout( function() {
			delete this.isPreventingClicks;
		}.bind( this ) );

		this.dragEnd( event, pointer );
	};

	proto.dragEnd = function( event, pointer ) {
		this.emitEvent( 'dragEnd', [ event, pointer ] );
	};

// ----- onclick ----- //

// handle all clicks and prevent clicks when dragging
	proto.onclick = function( event ) {
		if ( this.isPreventingClicks ) {
			event.preventDefault();
		}
	};

// ----- staticClick ----- //

// triggered after pointer down & up with no/tiny movement
	proto._staticClick = function( event, pointer ) {
		// ignore emulated mouse up clicks
		if ( this.isIgnoringMouseUp && event.type == 'mouseup' ) {
			return;
		}

		// allow click in <input>s and <textarea>s
		var nodeName = event.target.nodeName;
		if ( nodeName == 'INPUT' || nodeName == 'TEXTAREA' ) {
			event.target.focus();
		}
		this.staticClick( event, pointer );

		// set flag for emulated clicks 300ms after touchend
		if ( event.type != 'mouseup' ) {
			this.isIgnoringMouseUp = true;
			// reset flag after 300ms
			setTimeout( function() {
				delete this.isIgnoringMouseUp;
			}.bind( this ), 400 );
		}
	};

	proto.staticClick = function( event, pointer ) {
		this.emitEvent( 'staticClick', [ event, pointer ] );
	};

// ----- utils ----- //

	Unidragger.getPointerPoint = Unipointer.getPointerPoint;

// -----  ----- //

	return Unidragger;

}));

// drag
( function( window, factory ) {
	// universal module definition
	/* jshint strict: false */
	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'flickity/js/drag',[
			'./flickity',
			'unidragger/unidragger',
			'fizzy-ui-utils/utils'
		], function( Flickity, Unidragger, utils ) {
			return factory( window, Flickity, Unidragger, utils );
		});
	} else if ( typeof module == 'object' && module.exports ) {
		// CommonJS
		module.exports = factory(
			window,
			require('./flickity'),
			require('unidragger'),
			require('fizzy-ui-utils')
		);
	} else {
		// browser global
		window.Flickity = factory(
			window,
			window.Flickity,
			window.Unidragger,
			window.fizzyUIUtils
		);
	}

}( window, function factory( window, Flickity, Unidragger, utils ) {



// ----- defaults ----- //

	utils.extend( Flickity.defaults, {
		draggable: true,
		dragThreshold: 3,
	});

// ----- create ----- //

	Flickity.createMethods.push('_createDrag');

// -------------------------- drag prototype -------------------------- //

	var proto = Flickity.prototype;
	utils.extend( proto, Unidragger.prototype );
	proto._touchActionValue = 'pan-y';

// --------------------------  -------------------------- //

	var isTouch = 'createTouch' in document;
	var isTouchmoveScrollCanceled = false;

	proto._createDrag = function() {
		this.on( 'activate', this.bindDrag );
		this.on( 'uiChange', this._uiChangeDrag );
		this.on( 'childUIPointerDown', this._childUIPointerDownDrag );
		this.on( 'deactivate', this.unbindDrag );
		// HACK - add seemingly innocuous handler to fix iOS 10 scroll behavior
		// #457, RubaXa/Sortable#973
		if ( isTouch && !isTouchmoveScrollCanceled ) {
			window.addEventListener( 'touchmove', function() {});
			isTouchmoveScrollCanceled = true;
		}
	};

	proto.bindDrag = function() {
		if ( !this.options.draggable || this.isDragBound ) {
			return;
		}
		this.element.classList.add('is-draggable');
		this.handles = [ this.viewport ];
		this.bindHandles();
		this.isDragBound = true;
	};

	proto.unbindDrag = function() {
		if ( !this.isDragBound ) {
			return;
		}
		this.element.classList.remove('is-draggable');
		this.unbindHandles();
		delete this.isDragBound;
	};

	proto._uiChangeDrag = function() {
		delete this.isFreeScrolling;
	};

	proto._childUIPointerDownDrag = function( event ) {
		event.preventDefault();
		this.pointerDownFocus( event );
	};

// -------------------------- pointer events -------------------------- //

// nodes that have text fields
	var cursorNodes = {
		TEXTAREA: true,
		INPUT: true,
		OPTION: true,
	};

// input types that do not have text fields
	var clickTypes = {
		radio: true,
		checkbox: true,
		button: true,
	
		image: true,
		file: true,
	};

	proto.pointerDown = function( event, pointer ) {
		// dismiss inputs with text fields. #403, #404
		var isCursorInput = cursorNodes[ event.target.nodeName ] &&
			!clickTypes[ event.target.type ];
		if ( isCursorInput ) {
			// reset pointerDown logic
			this.isPointerDown = false;
			delete this.pointerIdentifier;
			return;
		}

		this._dragPointerDown( event, pointer );

		// kludge to blur focused inputs in dragger
		var focused = document.activeElement;
		if ( focused && focused.blur && focused != this.element &&
			// do not blur body for IE9 & 10, #117
			focused != document.body ) {
			focused.blur();
		}
		this.pointerDownFocus( event );
		// stop if it was moving
		this.dragX = this.x;
		this.viewport.classList.add('is-pointer-down');
		// bind move and end events
		this._bindPostStartEvents( event );
		// track scrolling
		this.pointerDownScroll = getScrollPosition();
		window.addEventListener( 'scroll', this );

		this.dispatchEvent( 'pointerDown', event, [ pointer ] );
	};

	proto.pointerDownFocus = function( event ) {
		// focus element, if not touch, and its not an input or select
		var canPointerDown = getCanPointerDown( event );
		if ( !this.options.accessibility || canPointerDown ) {
			return;
		}
		var prevScrollY = window.pageYOffset;
		this.element.focus();
		// hack to fix scroll jump after focus, #76
		if ( window.pageYOffset != prevScrollY ) {
			window.scrollTo( window.pageXOffset, prevScrollY );
		}
	};

	var focusNodes = {
		INPUT: true,
		SELECT: true,
	};

	function getCanPointerDown( event ) {
		var isTouchStart = event.type == 'touchstart';
		var isTouchPointer = event.pointerType == 'touch';
		var isFocusNode = focusNodes[ event.target.nodeName ];
		return isTouchStart || isTouchPointer || isFocusNode;
	}

	proto.canPreventDefaultOnPointerDown = function( event ) {
		// prevent default, unless touchstart or input
		var canPointerDown = getCanPointerDown( event );
		return !canPointerDown;
	};

// ----- move ----- //

	proto.hasDragStarted = function( moveVector ) {
		return Math.abs( moveVector.x ) > this.options.dragThreshold;
	};

// ----- up ----- //

	proto.pointerUp = function( event, pointer ) {
		delete this.isTouchScrolling;
		this.viewport.classList.remove('is-pointer-down');
		this.dispatchEvent( 'pointerUp', event, [ pointer ] );
		this._dragPointerUp( event, pointer );
	};

	proto.pointerDone = function() {
		window.removeEventListener( 'scroll', this );
		delete this.pointerDownScroll;
	};

// -------------------------- dragging -------------------------- //

	proto.dragStart = function( event, pointer ) {
		this.dragStartPosition = this.x;
		this.startAnimation();
		window.removeEventListener( 'scroll', this );
		this.dispatchEvent( 'dragStart', event, [ pointer ] );
	};

	proto.pointerMove = function( event, pointer ) {
		var moveVector = this._dragPointerMove( event, pointer );
		this.dispatchEvent( 'pointerMove', event, [ pointer, moveVector ] );
		this._dragMove( event, pointer, moveVector );
	};

	proto.dragMove = function( event, pointer, moveVector ) {
		event.preventDefault();

		this.previousDragX = this.dragX;
		// reverse if right-to-left
		var direction = this.options.rightToLeft ? -1 : 1;
		var dragX = this.dragStartPosition + moveVector.x * direction;

		if ( !this.options.wrapAround && this.slides.length ) {
			// slow drag
			var originBound = Math.max( -this.slides[0].target, this.dragStartPosition );
			dragX = dragX > originBound ? ( dragX + originBound ) * 0.5 : dragX;
			var endBound = Math.min( -this.getLastSlide().target, this.dragStartPosition );
			dragX = dragX < endBound ? ( dragX + endBound ) * 0.5 : dragX;
		}

		this.dragX = dragX;

		this.dragMoveTime = new Date();
		this.dispatchEvent( 'dragMove', event, [ pointer, moveVector ] );
	};

	proto.dragEnd = function( event, pointer ) {
		if ( this.options.freeScroll ) {
			this.isFreeScrolling = true;
		}
		// set selectedIndex based on where flick will end up
		var index = this.dragEndRestingSelect();

		if ( this.options.freeScroll && !this.options.wrapAround ) {
			// if free-scroll & not wrap around
			// do not free-scroll if going outside of bounding slides
			// so bounding slides can attract slider, and keep it in bounds
			var restingX = this.getRestingPosition();
			this.isFreeScrolling = -restingX > this.slides[0].target &&
				-restingX < this.getLastSlide().target;
		} else if ( !this.options.freeScroll && index == this.selectedIndex ) {
			// boost selection if selected index has not changed
			index += this.dragEndBoostSelect();
		}
		delete this.previousDragX;
		// apply selection
		// TODO refactor this, selecting here feels weird
		// HACK, set flag so dragging stays in correct direction
		this.isDragSelect = this.options.wrapAround;
		this.select( index );
		delete this.isDragSelect;
		this.dispatchEvent( 'dragEnd', event, [ pointer ] );
	};

	proto.dragEndRestingSelect = function() {
		var restingX = this.getRestingPosition();
		// how far away from selected slide
		var distance = Math.abs( this.getSlideDistance( -restingX, this.selectedIndex ) );
		// get closet resting going up and going down
		var positiveResting = this._getClosestResting( restingX, distance, 1 );
		var negativeResting = this._getClosestResting( restingX, distance, -1 );
		// use closer resting for wrap-around
		var index = positiveResting.distance < negativeResting.distance ?
			positiveResting.index : negativeResting.index;
		return index;
	};

	/**
	 * given resting X and distance to selected cell
	 * get the distance and index of the closest cell
	 * @param {Number} restingX - estimated post-flick resting position
	 * @param {Number} distance - distance to selected cell
	 * @param {Integer} increment - +1 or -1, going up or down
	 * @returns {Object} - { distance: {Number}, index: {Integer} }
	 */
	proto._getClosestResting = function( restingX, distance, increment ) {
		var index = this.selectedIndex;
		var minDistance = Infinity;
		var condition = this.options.contain && !this.options.wrapAround ?
			// if contain, keep going if distance is equal to minDistance
			function( d, md ) { return d <= md; } : function( d, md ) { return d < md; };
		while ( condition( distance, minDistance ) ) {
			// measure distance to next cell
			index += increment;
			minDistance = distance;
			distance = this.getSlideDistance( -restingX, index );
			if ( distance === null ) {
				break;
			}
			distance = Math.abs( distance );
		}
		return {
			distance: minDistance,
			// selected was previous index
			index: index - increment
		};
	};

	/**
	 * measure distance between x and a slide target
	 * @param {Number} x
	 * @param {Integer} index - slide index
	 */
	proto.getSlideDistance = function( x, index ) {
		var len = this.slides.length;
		// wrap around if at least 2 slides
		var isWrapAround = this.options.wrapAround && len > 1;
		var slideIndex = isWrapAround ? utils.modulo( index, len ) : index;
		var slide = this.slides[ slideIndex ];
		if ( !slide ) {
			return null;
		}
		// add distance for wrap-around slides
		var wrap = isWrapAround ? this.slideableWidth * Math.floor( index / len ) : 0;
		return x - ( slide.target + wrap );
	};

	proto.dragEndBoostSelect = function() {
		// do not boost if no previousDragX or dragMoveTime
		if ( this.previousDragX === undefined || !this.dragMoveTime ||
			// or if drag was held for 100 ms
			new Date() - this.dragMoveTime > 100 ) {
			return 0;
		}

		var distance = this.getSlideDistance( -this.dragX, this.selectedIndex );
		var delta = this.previousDragX - this.dragX;
		if ( distance > 0 && delta > 0 ) {
			// boost to next if moving towards the right, and positive velocity
			return 1;
		} else if ( distance < 0 && delta < 0 ) {
			// boost to previous if moving towards the left, and negative velocity
			return -1;
		}
		return 0;
	};

// ----- staticClick ----- //

	proto.staticClick = function( event, pointer ) {
		// get clickedCell, if cell was clicked
		var clickedCell = this.getParentCell( event.target );
		var cellElem = clickedCell && clickedCell.element;
		var cellIndex = clickedCell && this.cells.indexOf( clickedCell );
		this.dispatchEvent( 'staticClick', event, [ pointer, cellElem, cellIndex ] );
	};

// ----- scroll ----- //

	proto.onscroll = function() {
		var scroll = getScrollPosition();
		var scrollMoveX = this.pointerDownScroll.x - scroll.x;
		var scrollMoveY = this.pointerDownScroll.y - scroll.y;
		// cancel click/tap if scroll is too much
		if ( Math.abs( scrollMoveX ) > 3 || Math.abs( scrollMoveY ) > 3 ) {
			this._pointerDone();
		}
	};

// ----- utils ----- //

	function getScrollPosition() {
		return {
			x: window.pageXOffset,
			y: window.pageYOffset
		};
	}

// -----  ----- //

	return Flickity;

}));

/*!
 * Tap listener v2.0.0
 * listens to taps
 * MIT license
 */

/*jshint browser: true, unused: true, undef: true, strict: true */

( function( window, factory ) {
	// universal module definition
	/*jshint strict: false*/ /*globals define, module, require */

	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'tap-listener/tap-listener',[
			'unipointer/unipointer'
		], function( Unipointer ) {
			return factory( window, Unipointer );
		});
	} else if ( typeof module == 'object' && module.exports ) {
		// CommonJS
		module.exports = factory(
			window,
			require('unipointer')
		);
	} else {
		// browser global
		window.TapListener = factory(
			window,
			window.Unipointer
		);
	}

}( window, function factory( window, Unipointer ) {



// --------------------------  TapListener -------------------------- //

	function TapListener( elem ) {
		this.bindTap( elem );
	}

// inherit Unipointer & EventEmitter
	var proto = TapListener.prototype = Object.create( Unipointer.prototype );

	/**
	 * bind tap event to element
	 * @param {Element} elem
	 */
	proto.bindTap = function( elem ) {
		if ( !elem ) {
			return;
		}
		this.unbindTap();
		this.tapElement = elem;
		this._bindStartEvent( elem, true );
	};

	proto.unbindTap = function() {
		if ( !this.tapElement ) {
			return;
		}
		this._bindStartEvent( this.tapElement, true );
		delete this.tapElement;
	};

	/**
	 * pointer up
	 * @param {Event} event
	 * @param {Event or Touch} pointer
	 */
	proto.pointerUp = function( event, pointer ) {
		// ignore emulated mouse up clicks
		if ( this.isIgnoringMouseUp && event.type == 'mouseup' ) {
			return;
		}

		var pointerPoint = Unipointer.getPointerPoint( pointer );
		var boundingRect = this.tapElement.getBoundingClientRect();
		var scrollX = window.pageXOffset;
		var scrollY = window.pageYOffset;
		// calculate if pointer is inside tapElement
		var isInside = pointerPoint.x >= boundingRect.left + scrollX &&
			pointerPoint.x <= boundingRect.right + scrollX &&
			pointerPoint.y >= boundingRect.top + scrollY &&
			pointerPoint.y <= boundingRect.bottom + scrollY;
		// trigger callback if pointer is inside element
		if ( isInside ) {
			this.emitEvent( 'tap', [ event, pointer ] );
		}

		// set flag for emulated clicks 300ms after touchend
		if ( event.type != 'mouseup' ) {
			this.isIgnoringMouseUp = true;
			// reset flag after 300ms
			var _this = this;
			setTimeout( function() {
				delete _this.isIgnoringMouseUp;
			}, 400 );
		}
	};

	proto.destroy = function() {
		this.pointerDone();
		this.unbindTap();
	};

// -----  ----- //

	return TapListener;

}));

// prev/next buttons
( function( window, factory ) {
	// universal module definition
	/* jshint strict: false */
	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'flickity/js/prev-next-button',[
			'./flickity',
			'tap-listener/tap-listener',
			'fizzy-ui-utils/utils'
		], function( Flickity, TapListener, utils ) {
			return factory( window, Flickity, TapListener, utils );
		});
	} else if ( typeof module == 'object' && module.exports ) {
		// CommonJS
		module.exports = factory(
			window,
			require('./flickity'),
			require('tap-listener'),
			require('fizzy-ui-utils')
		);
	} else {
		// browser global
		factory(
			window,
			window.Flickity,
			window.TapListener,
			window.fizzyUIUtils
		);
	}

}( window, function factory( window, Flickity, TapListener, utils ) {
	'use strict';

	var svgURI = 'http://www.w3.org/2000/svg';

// -------------------------- PrevNextButton -------------------------- //

	function PrevNextButton( direction, parent ) {
		this.direction = direction;
		this.parent = parent;
		this._create();
	}

	PrevNextButton.prototype = new TapListener();

	PrevNextButton.prototype._create = function() {
		// properties
		this.isEnabled = true;
		this.isPrevious = this.direction == -1;
		var leftDirection = this.parent.options.rightToLeft ? 1 : -1;
		this.isLeft = this.direction == leftDirection;

		var element = this.element = document.createElement('button');
		element.className = 'flickity-prev-next-button';
		element.className += this.isPrevious ? ' previous' : ' next';
		// prevent button from submitting form http://stackoverflow.com/a/10836076/182183
		element.setAttribute( 'type', 'button' );
		// init as disabled
		this.disable();

		element.setAttribute( 'aria-label', this.isPrevious ? 'previous' : 'next' );

		// create arrow
		var svg = this.createSVG();
		element.appendChild( svg );
		// events
		this.on( 'tap', this.onTap );
		this.parent.on( 'select', this.update.bind( this ) );
		this.on( 'pointerDown', this.parent.childUIPointerDown.bind( this.parent ) );
	};

	PrevNextButton.prototype.activate = function() {
		this.bindTap( this.element );
		// click events from keyboard
		this.element.addEventListener( 'click', this );
		// add to DOM
		this.parent.element.appendChild( this.element );
	};

	PrevNextButton.prototype.deactivate = function() {
		// remove from DOM
		this.parent.element.removeChild( this.element );
		// do regular TapListener destroy
		TapListener.prototype.destroy.call( this );
		// click events from keyboard
		this.element.removeEventListener( 'click', this );
	};

	PrevNextButton.prototype.createSVG = function() {
		var svg = document.createElementNS( svgURI, 'svg');
		svg.setAttribute( 'viewBox', '0 0 100 100' );
		var path = document.createElementNS( svgURI, 'path');
		var pathMovements = getArrowMovements( this.parent.options.arrowShape );
		path.setAttribute( 'd', pathMovements );
		path.setAttribute( 'class', 'arrow' );
		// rotate arrow
		if ( !this.isLeft ) {
			path.setAttribute( 'transform', 'translate(100, 100) rotate(180) ' );
		}
		svg.appendChild( path );
		return svg;
	};

// get SVG path movmement
	function getArrowMovements( shape ) {
		// use shape as movement if string
		if ( typeof shape == 'string' ) {
			return shape;
		}
		// create movement string
		return 'M ' + shape.x0 + ',50' +
			' L ' + shape.x1 + ',' + ( shape.y1 + 50 ) +
			' L ' + shape.x2 + ',' + ( shape.y2 + 50 ) +
			' L ' + shape.x3 + ',50 ' +
			' L ' + shape.x2 + ',' + ( 50 - shape.y2 ) +
			' L ' + shape.x1 + ',' + ( 50 - shape.y1 ) +
			' Z';
	}

	PrevNextButton.prototype.onTap = function() {
		if ( !this.isEnabled ) {
			return;
		}
		this.parent.uiChange();
		var method = this.isPrevious ? 'previous' : 'next';
		this.parent[ method ]();
	};

	PrevNextButton.prototype.handleEvent = utils.handleEvent;

	PrevNextButton.prototype.onclick = function() {
		// only allow clicks from keyboard
		var focused = document.activeElement;
		if ( focused && focused == this.element ) {
			this.onTap();
		}
	};

// -----  ----- //

	PrevNextButton.prototype.enable = function() {
		if ( this.isEnabled ) {
			return;
		}
		this.element.disabled = false;
		this.isEnabled = true;
	};

	PrevNextButton.prototype.disable = function() {
		if ( !this.isEnabled ) {
			return;
		}
		this.element.disabled = true;
		this.isEnabled = false;
	};

	PrevNextButton.prototype.update = function() {
		// index of first or last slide, if previous or next
		var slides = this.parent.slides;
		// enable is wrapAround and at least 2 slides
		if ( this.parent.options.wrapAround && slides.length > 1 ) {
			this.enable();
			return;
		}
		var lastIndex = slides.length ? slides.length - 1 : 0;
		var boundIndex = this.isPrevious ? 0 : lastIndex;
		var method = this.parent.selectedIndex == boundIndex ? 'disable' : 'enable';
		this[ method ]();
	};

	PrevNextButton.prototype.destroy = function() {
		this.deactivate();
	};

// -------------------------- Flickity prototype -------------------------- //

	utils.extend( Flickity.defaults, {
		prevNextButtons: true,
		arrowShape: {
			x0: 10,
			x1: 60, y1: 50,
			x2: 70, y2: 40,
			x3: 30
		}
	});

	Flickity.createMethods.push('_createPrevNextButtons');
	var proto = Flickity.prototype;

	proto._createPrevNextButtons = function() {
		if ( !this.options.prevNextButtons ) {
			return;
		}

		this.prevButton = new PrevNextButton( -1, this );
		this.nextButton = new PrevNextButton( 1, this );

		this.on( 'activate', this.activatePrevNextButtons );
	};

	proto.activatePrevNextButtons = function() {
		this.prevButton.activate();
		this.nextButton.activate();
		this.on( 'deactivate', this.deactivatePrevNextButtons );
	};

	proto.deactivatePrevNextButtons = function() {
		this.prevButton.deactivate();
		this.nextButton.deactivate();
		this.off( 'deactivate', this.deactivatePrevNextButtons );
	};

// --------------------------  -------------------------- //

	Flickity.PrevNextButton = PrevNextButton;

	return Flickity;

}));

// page dots
( function( window, factory ) {
	// universal module definition
	/* jshint strict: false */
	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'flickity/js/page-dots',[
			'./flickity',
			'tap-listener/tap-listener',
			'fizzy-ui-utils/utils'
		], function( Flickity, TapListener, utils ) {
			return factory( window, Flickity, TapListener, utils );
		});
	} else if ( typeof module == 'object' && module.exports ) {
		// CommonJS
		module.exports = factory(
			window,
			require('./flickity'),
			require('tap-listener'),
			require('fizzy-ui-utils')
		);
	} else {
		// browser global
		factory(
			window,
			window.Flickity,
			window.TapListener,
			window.fizzyUIUtils
		);
	}

}( window, function factory( window, Flickity, TapListener, utils ) {

// -------------------------- PageDots -------------------------- //



	function PageDots( parent ) {
		this.parent = parent;
		this._create();
	}

	PageDots.prototype = new TapListener();

	PageDots.prototype._create = function() {
		// create holder element
		this.holder = document.createElement('ol');
		this.holder.className = 'flickity-page-dots';
		// create dots, array of elements
		this.dots = [];
		// events
		this.on( 'tap', this.onTap );
		this.on( 'pointerDown', this.parent.childUIPointerDown.bind( this.parent ) );
	};

	PageDots.prototype.activate = function() {
		this.setDots();
		this.bindTap( this.holder );
		// add to DOM
		this.parent.element.appendChild( this.holder );
	};

	PageDots.prototype.deactivate = function() {
		// remove from DOM
		this.parent.element.removeChild( this.holder );
		TapListener.prototype.destroy.call( this );
	};

	PageDots.prototype.setDots = function() {
		// get difference between number of slides and number of dots
		var delta = this.parent.slides.length - this.dots.length;
		if ( delta > 0 ) {
			this.addDots( delta );
		} else if ( delta < 0 ) {
			this.removeDots( -delta );
		}
	};

	PageDots.prototype.addDots = function( count ) {
		var fragment = document.createDocumentFragment();
		var newDots = [];
		while ( count ) {
			var dot = document.createElement('li');
			dot.className = 'dot';
			fragment.appendChild( dot );
			newDots.push( dot );
			count--;
		}
		this.holder.appendChild( fragment );
		this.dots = this.dots.concat( newDots );
	};

	PageDots.prototype.removeDots = function( count ) {
		// remove from this.dots collection
		var removeDots = this.dots.splice( this.dots.length - count, count );
		// remove from DOM
		removeDots.forEach( function( dot ) {
			this.holder.removeChild( dot );
		}, this );
	};

	PageDots.prototype.updateSelected = function() {
		// remove selected class on previous
		if ( this.selectedDot ) {
			this.selectedDot.className = 'dot';
		}
		// don't proceed if no dots
		if ( !this.dots.length ) {
			return;
		}
		this.selectedDot = this.dots[ this.parent.selectedIndex ];
		this.selectedDot.className = 'dot is-selected';
	};

	PageDots.prototype.onTap = function( event ) {
		var target = event.target;
		// only care about dot clicks
		if ( target.nodeName != 'LI' ) {
			return;
		}

		this.parent.uiChange();
		var index = this.dots.indexOf( target );
		this.parent.select( index );
	};

	PageDots.prototype.destroy = function() {
		this.deactivate();
	};

	Flickity.PageDots = PageDots;

// -------------------------- Flickity -------------------------- //

	utils.extend( Flickity.defaults, {
		pageDots: true
	});

	Flickity.createMethods.push('_createPageDots');

	var proto = Flickity.prototype;

	proto._createPageDots = function() {
		if ( !this.options.pageDots ) {
			return;
		}
		this.pageDots = new PageDots( this );
		// events
		this.on( 'activate', this.activatePageDots );
		this.on( 'select', this.updateSelectedPageDots );
		this.on( 'cellChange', this.updatePageDots );
		this.on( 'resize', this.updatePageDots );
		this.on( 'deactivate', this.deactivatePageDots );
	};

	proto.activatePageDots = function() {
		this.pageDots.activate();
	};

	proto.updateSelectedPageDots = function() {
		this.pageDots.updateSelected();
	};

	proto.updatePageDots = function() {
		this.pageDots.setDots();
	};

	proto.deactivatePageDots = function() {
		this.pageDots.deactivate();
	};

// -----  ----- //

	Flickity.PageDots = PageDots;

	return Flickity;

}));

// player & autoPlay
( function( window, factory ) {
	// universal module definition
	/* jshint strict: false */
	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'flickity/js/player',[
			'ev-emitter/ev-emitter',
			'fizzy-ui-utils/utils',
			'./flickity'
		], function( EvEmitter, utils, Flickity ) {
			return factory( EvEmitter, utils, Flickity );
		});
	} else if ( typeof module == 'object' && module.exports ) {
		// CommonJS
		module.exports = factory(
			require('ev-emitter'),
			require('fizzy-ui-utils'),
			require('./flickity')
		);
	} else {
		// browser global
		factory(
			window.EvEmitter,
			window.fizzyUIUtils,
			window.Flickity
		);
	}

}( window, function factory( EvEmitter, utils, Flickity ) {



// -------------------------- Page Visibility -------------------------- //
// https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API

	var hiddenProperty, visibilityEvent;
	if ( 'hidden' in document ) {
		hiddenProperty = 'hidden';
		visibilityEvent = 'visibilitychange';
	} else if ( 'webkitHidden' in document ) {
		hiddenProperty = 'webkitHidden';
		visibilityEvent = 'webkitvisibilitychange';
	}

// -------------------------- Player -------------------------- //

	function Player( parent ) {
		this.parent = parent;
		this.state = 'stopped';
		// visibility change event handler
		if ( visibilityEvent ) {
			this.onVisibilityChange = function() {
				this.visibilityChange();
			}.bind( this );
			this.onVisibilityPlay = function() {
				this.visibilityPlay();
			}.bind( this );
		}
	}

	Player.prototype = Object.create( EvEmitter.prototype );

// start play
	Player.prototype.play = function() {
		if ( this.state == 'playing' ) {
			return;
		}
		// do not play if page is hidden, start playing when page is visible
		var isPageHidden = document[ hiddenProperty ];
		if ( visibilityEvent && isPageHidden ) {
			document.addEventListener( visibilityEvent, this.onVisibilityPlay );
			return;
		}

		this.state = 'playing';
		// listen to visibility change
		if ( visibilityEvent ) {
			document.addEventListener( visibilityEvent, this.onVisibilityChange );
		}
		// start ticking
		this.tick();
	};

	Player.prototype.tick = function() {
		// do not tick if not playing
		if ( this.state != 'playing' ) {
			return;
		}

		var time = this.parent.options.autoPlay;
		// default to 3 seconds
		time = typeof time == 'number' ? time : 3000;
		var _this = this;
		// HACK: reset ticks if stopped and started within interval
		this.clear();
		this.timeout = setTimeout( function() {
			_this.parent.next( true );
			_this.tick();
		}, time );
	};

	Player.prototype.stop = function() {
		this.state = 'stopped';
		this.clear();
		// remove visibility change event
		if ( visibilityEvent ) {
			document.removeEventListener( visibilityEvent, this.onVisibilityChange );
		}
	};

	Player.prototype.clear = function() {
		clearTimeout( this.timeout );
	};

	Player.prototype.pause = function() {
		if ( this.state == 'playing' ) {
			this.state = 'paused';
			this.clear();
		}
	};

	Player.prototype.unpause = function() {
		// re-start play if paused
		if ( this.state == 'paused' ) {
			this.play();
		}
	};

// pause if page visibility is hidden, unpause if visible
	Player.prototype.visibilityChange = function() {
		var isPageHidden = document[ hiddenProperty ];
		this[ isPageHidden ? 'pause' : 'unpause' ]();
	};

	Player.prototype.visibilityPlay = function() {
		this.play();
		document.removeEventListener( visibilityEvent, this.onVisibilityPlay );
	};

// -------------------------- Flickity -------------------------- //

	utils.extend( Flickity.defaults, {
		pauseAutoPlayOnHover: true
	});

	Flickity.createMethods.push('_createPlayer');
	var proto = Flickity.prototype;

	proto._createPlayer = function() {
		this.player = new Player( this );

		this.on( 'activate', this.activatePlayer );
		this.on( 'uiChange', this.stopPlayer );
		this.on( 'pointerDown', this.stopPlayer );
		this.on( 'deactivate', this.deactivatePlayer );
	};

	proto.activatePlayer = function() {
		if ( !this.options.autoPlay ) {
			return;
		}
		this.player.play();
		this.element.addEventListener( 'mouseenter', this );
	};

// Player API, don't hate the ... thanks I know where the door is

	proto.playPlayer = function() {
		this.player.play();
	};

	proto.stopPlayer = function() {
		this.player.stop();
	};

	proto.pausePlayer = function() {
		this.player.pause();
	};

	proto.unpausePlayer = function() {
		this.player.unpause();
	};

	proto.deactivatePlayer = function() {
		this.player.stop();
		this.element.removeEventListener( 'mouseenter', this );
	};

// ----- mouseenter/leave ----- //

// pause auto-play on hover
	proto.onmouseenter = function() {
		if ( !this.options.pauseAutoPlayOnHover ) {
			return;
		}
		this.player.pause();
		this.element.addEventListener( 'mouseleave', this );
	};

// resume auto-play on hover off
	proto.onmouseleave = function() {
		this.player.unpause();
		this.element.removeEventListener( 'mouseleave', this );
	};

// -----  ----- //

	Flickity.Player = Player;

	return Flickity;

}));

// add, remove cell
( function( window, factory ) {
	// universal module definition
	/* jshint strict: false */
	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'flickity/js/add-remove-cell',[
			'./flickity',
			'fizzy-ui-utils/utils'
		], function( Flickity, utils ) {
			return factory( window, Flickity, utils );
		});
	} else if ( typeof module == 'object' && module.exports ) {
		// CommonJS
		module.exports = factory(
			window,
			require('./flickity'),
			require('fizzy-ui-utils')
		);
	} else {
		// browser global
		factory(
			window,
			window.Flickity,
			window.fizzyUIUtils
		);
	}

}( window, function factory( window, Flickity, utils ) {



// append cells to a document fragment
	function getCellsFragment( cells ) {
		var fragment = document.createDocumentFragment();
		cells.forEach( function( cell ) {
			fragment.appendChild( cell.element );
		});
		return fragment;
	}

// -------------------------- add/remove cell prototype -------------------------- //

	var proto = Flickity.prototype;

	/**
	 * Insert, prepend, or append cells
	 * @param {Element, Array, NodeList} elems
	 * @param {Integer} index
	 */
	proto.insert = function( elems, index ) {
		var cells = this._makeCells( elems );
		if ( !cells || !cells.length ) {
			return;
		}
		var len = this.cells.length;
		// default to append
		index = index === undefined ? len : index;
		// add cells with document fragment
		var fragment = getCellsFragment( cells );
		// append to slider
		var isAppend = index == len;
		if ( isAppend ) {
			this.slider.appendChild( fragment );
		} else {
			var insertCellElement = this.cells[ index ].element;
			this.slider.insertBefore( fragment, insertCellElement );
		}
		// add to this.cells
		if ( index === 0 ) {
			// prepend, add to start
			this.cells = cells.concat( this.cells );
		} else if ( isAppend ) {
			// append, add to end
			this.cells = this.cells.concat( cells );
		} else {
			// insert in this.cells
			var endCells = this.cells.splice( index, len - index );
			this.cells = this.cells.concat( cells ).concat( endCells );
		}

		this._sizeCells( cells );

		var selectedIndexDelta = index > this.selectedIndex ? 0 : cells.length;
		this._cellAddedRemoved( index, selectedIndexDelta );
	};

	proto.append = function( elems ) {
		this.insert( elems, this.cells.length );
	};

	proto.prepend = function( elems ) {
		this.insert( elems, 0 );
	};

	/**
	 * Remove cells
	 * @param {Element, Array, NodeList} elems
	 */
	proto.remove = function( elems ) {
		var cells = this.getCells( elems );
		var selectedIndexDelta = 0;
		var len = cells.length;
		var i, cell;
		// calculate selectedIndexDelta, easier if done in seperate loop
		for ( i=0; i < len; i++ ) {
			cell = cells[i];
			var wasBefore = this.cells.indexOf( cell ) < this.selectedIndex;
			selectedIndexDelta -= wasBefore ? 1 : 0;
		}

		for ( i=0; i < len; i++ ) {
			cell = cells[i];
			cell.remove();
			// remove item from collection
			utils.removeFrom( this.cells, cell );
		}

		if ( cells.length ) {
			// update stuff
			this._cellAddedRemoved( 0, selectedIndexDelta );
		}
	};

// updates when cells are added or removed
	proto._cellAddedRemoved = function( changedCellIndex, selectedIndexDelta ) {
		// TODO this math isn't perfect with grouped slides
		selectedIndexDelta = selectedIndexDelta || 0;
		this.selectedIndex += selectedIndexDelta;
		this.selectedIndex = Math.max( 0, Math.min( this.slides.length - 1, this.selectedIndex ) );

		this.cellChange( changedCellIndex, true );
		// backwards compatibility
		this.emitEvent( 'cellAddedRemoved', [ changedCellIndex, selectedIndexDelta ] );
	};

	/**
	 * logic to be run after a cell's size changes
	 * @param {Element} elem - cell's element
	 */
	proto.cellSizeChange = function( elem ) {
		var cell = this.getCell( elem );
		if ( !cell ) {
			return;
		}
		cell.getSize();

		var index = this.cells.indexOf( cell );
		this.cellChange( index );
	};

	/**
	 * logic any time a cell is changed: added, removed, or size changed
	 * @param {Integer} changedCellIndex - index of the changed cell, optional
	 */
	proto.cellChange = function( changedCellIndex, isPositioningSlider ) {
		var prevSlideableWidth = this.slideableWidth;
		this._positionCells( changedCellIndex );
		this._getWrapShiftCells();
		this.setGallerySize();
		this.emitEvent( 'cellChange', [ changedCellIndex ] );
		// position slider
		if ( this.options.freeScroll ) {
			// shift x by change in slideableWidth
			// TODO fix position shifts when prepending w/ freeScroll
			var deltaX = prevSlideableWidth - this.slideableWidth;
			this.x += deltaX * this.cellAlign;
			this.positionSlider();
		} else {
			// do not position slider after lazy load
			if ( isPositioningSlider ) {
				this.positionSliderAtSelected();
			}
			this.select( this.selectedIndex );
		}
	};

// -----  ----- //

	return Flickity;

}));

// lazyload
( function( window, factory ) {
	// universal module definition
	/* jshint strict: false */
	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'flickity/js/lazyload',[
			'./flickity',
			'fizzy-ui-utils/utils'
		], function( Flickity, utils ) {
			return factory( window, Flickity, utils );
		});
	} else if ( typeof module == 'object' && module.exports ) {
		// CommonJS
		module.exports = factory(
			window,
			require('./flickity'),
			require('fizzy-ui-utils')
		);
	} else {
		// browser global
		factory(
			window,
			window.Flickity,
			window.fizzyUIUtils
		);
	}

}( window, function factory( window, Flickity, utils ) {
	'use strict';

	Flickity.createMethods.push('_createLazyload');
	var proto = Flickity.prototype;

	proto._createLazyload = function() {
		this.on( 'select', this.lazyLoad );
	};

	proto.lazyLoad = function() {
		var lazyLoad = this.options.lazyLoad;
		if ( !lazyLoad ) {
			return;
		}
		// get adjacent cells, use lazyLoad option for adjacent count
		var adjCount = typeof lazyLoad == 'number' ? lazyLoad : 0;
		var cellElems = this.getAdjacentCellElements( adjCount );
		// get lazy images in those cells
		var lazyImages = [];
		cellElems.forEach( function( cellElem ) {
			var lazyCellImages = getCellLazyImages( cellElem );
			lazyImages = lazyImages.concat( lazyCellImages );
		});
		// load lazy images
		lazyImages.forEach( function( img ) {
			new LazyLoader( img, this );
		}, this );
	};

	function getCellLazyImages( cellElem ) {
		// check if cell element is lazy image
		if ( cellElem.nodeName == 'IMG' &&
			cellElem.getAttribute('data-flickity-lazyload') ) {
			return [ cellElem ];
		}
		// select lazy images in cell
		var imgs = cellElem.querySelectorAll('img[data-flickity-lazyload]');
		return utils.makeArray( imgs );
	}

// -------------------------- LazyLoader -------------------------- //

	/**
	 * class to handle loading images
	 */
	function LazyLoader( img, flickity ) {
		this.img = img;
		this.flickity = flickity;
		this.load();
	}

	LazyLoader.prototype.handleEvent = utils.handleEvent;

	LazyLoader.prototype.load = function() {
		this.img.addEventListener( 'load', this );
		this.img.addEventListener( 'error', this );
		// load image
		this.img.src = this.img.getAttribute('data-flickity-lazyload');
		// remove attr
		this.img.removeAttribute('data-flickity-lazyload');
	};

	LazyLoader.prototype.onload = function( event ) {
		this.complete( event, 'flickity-lazyloaded' );
	};

	LazyLoader.prototype.onerror = function( event ) {
		this.complete( event, 'flickity-lazyerror' );
	};

	LazyLoader.prototype.complete = function( event, className ) {
		// unbind events
		this.img.removeEventListener( 'load', this );
		this.img.removeEventListener( 'error', this );

		var cell = this.flickity.getParentCell( this.img );
		var cellElem = cell && cell.element;
		this.flickity.cellSizeChange( cellElem );

		this.img.classList.add( className );
		this.flickity.dispatchEvent( 'lazyLoad', event, cellElem );
	};

// -----  ----- //

	Flickity.LazyLoader = LazyLoader;

	return Flickity;

}));

/*!
 * Flickity v2.0.10
 * Touch, responsive, flickable carousels
 *
 * Licensed GPLv3 for open source use
 * or Flickity Commercial License for commercial use
 *
 * http://flickity.metafizzy.co
 * Copyright 2017 Metafizzy
 */

( function( window, factory ) {
	// universal module definition
	/* jshint strict: false */
	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'flickity/js/index',[
			'./flickity',
			'./drag',
			'./prev-next-button',
			'./page-dots',
			'./player',
			'./add-remove-cell',
			'./lazyload'
		], factory );
	} else if ( typeof module == 'object' && module.exports ) {
		// CommonJS
		module.exports = factory(
			require('./flickity'),
			require('./drag'),
			require('./prev-next-button'),
			require('./page-dots'),
			require('./player'),
			require('./add-remove-cell'),
			require('./lazyload')
		);
	}

})( window, function factory( Flickity ) {
	/*jshint strict: false*/
	return Flickity;
});

/*!
 * Flickity asNavFor v2.0.1
 * enable asNavFor for Flickity
 */

/*jshint browser: true, undef: true, unused: true, strict: true*/

( function( window, factory ) {
	// universal module definition
	/*jshint strict: false */ /*globals define, module, require */
	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'flickity-as-nav-for/as-nav-for',[
			'flickity/js/index',
			'fizzy-ui-utils/utils'
		], factory );
	} else if ( typeof module == 'object' && module.exports ) {
		// CommonJS
		module.exports = factory(
			require('flickity'),
			require('fizzy-ui-utils')
		);
	} else {
		// browser global
		window.Flickity = factory(
			window.Flickity,
			window.fizzyUIUtils
		);
	}

}( window, function factory( Flickity, utils ) {



// -------------------------- asNavFor prototype -------------------------- //

// Flickity.defaults.asNavFor = null;

	Flickity.createMethods.push('_createAsNavFor');

	var proto = Flickity.prototype;

	proto._createAsNavFor = function() {
		this.on( 'activate', this.activateAsNavFor );
		this.on( 'deactivate', this.deactivateAsNavFor );
		this.on( 'destroy', this.destroyAsNavFor );

		var asNavForOption = this.options.asNavFor;
		if ( !asNavForOption ) {
			return;
		}
		// HACK do async, give time for other flickity to be initalized
		var _this = this;
		setTimeout( function initNavCompanion() {
			_this.setNavCompanion( asNavForOption );
		});
	};

	proto.setNavCompanion = function( elem ) {
		elem = utils.getQueryElement( elem );
		var companion = Flickity.data( elem );
		// stop if no companion or companion is self
		if ( !companion || companion == this ) {
			return;
		}

		this.navCompanion = companion;
		// companion select
		var _this = this;
		this.onNavCompanionSelect = function() {
			_this.navCompanionSelect();
		};
		companion.on( 'select', this.onNavCompanionSelect );
		// click
		this.on( 'staticClick', this.onNavStaticClick );

		this.navCompanionSelect( true );
	};

	proto.navCompanionSelect = function( isInstant ) {
		if ( !this.navCompanion ) {
			return;
		}
		// select slide that matches first cell of slide
		var selectedCell = this.navCompanion.selectedCells[0];
		var firstIndex = this.navCompanion.cells.indexOf( selectedCell );
		var lastIndex = firstIndex + this.navCompanion.selectedCells.length - 1;
		var selectIndex = Math.floor( lerp( firstIndex, lastIndex,
			this.navCompanion.cellAlign ) );
		this.selectCell( selectIndex, false, isInstant );
		// set nav selected class
		this.removeNavSelectedElements();
		// stop if companion has more cells than this one
		if ( selectIndex >= this.cells.length ) {
			return;
		}

		var selectedCells = this.cells.slice( firstIndex, lastIndex + 1 );
		this.navSelectedElements = selectedCells.map( function( cell ) {
			return cell.element;
		});
		this.changeNavSelectedClass('add');
	};

	function lerp( a, b, t ) {
		return ( b - a ) * t + a;
	}

	proto.changeNavSelectedClass = function( method ) {
		this.navSelectedElements.forEach( function( navElem ) {
			navElem.classList[ method ]('is-nav-selected');
		});
	};

	proto.activateAsNavFor = function() {
		this.navCompanionSelect( true );
	};

	proto.removeNavSelectedElements = function() {
		if ( !this.navSelectedElements ) {
			return;
		}
		this.changeNavSelectedClass('remove');
		delete this.navSelectedElements;
	};

	proto.onNavStaticClick = function( event, pointer, cellElement, cellIndex ) {
		if ( typeof cellIndex == 'number' ) {
			this.navCompanion.selectCell( cellIndex );
		}
	};

	proto.deactivateAsNavFor = function() {
		this.removeNavSelectedElements();
	};

	proto.destroyAsNavFor = function() {
		if ( !this.navCompanion ) {
			return;
		}
		this.navCompanion.off( 'select', this.onNavCompanionSelect );
		this.off( 'staticClick', this.onNavStaticClick );
		delete this.navCompanion;
	};

// -----  ----- //

	return Flickity;

}));

/*!
 * imagesLoaded v4.1.3
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

( function( window, factory ) { 'use strict';
	// universal module definition

	/*global define: false, module: false, require: false */

	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'imagesloaded/imagesloaded',[
			'ev-emitter/ev-emitter'
		], function( EvEmitter ) {
			return factory( window, EvEmitter );
		});
	} else if ( typeof module == 'object' && module.exports ) {
		// CommonJS
		module.exports = factory(
			window,
			require('ev-emitter')
		);
	} else {
		// browser global
		window.imagesLoaded = factory(
			window,
			window.EvEmitter
		);
	}

})( typeof window !== 'undefined' ? window : this,

// --------------------------  factory -------------------------- //

	function factory( window, EvEmitter ) {



		var $ = window.jQuery;
		var console = window.console;

// -------------------------- helpers -------------------------- //

// extend objects
		function extend( a, b ) {
			for ( var prop in b ) {
				a[ prop ] = b[ prop ];
			}
			return a;
		}

// turn element or nodeList into an array
		function makeArray( obj ) {
			var ary = [];
			if ( Array.isArray( obj ) ) {
				// use object if already an array
				ary = obj;
			} else if ( typeof obj.length == 'number' ) {
				// convert nodeList to array
				for ( var i=0; i < obj.length; i++ ) {
					ary.push( obj[i] );
				}
			} else {
				// array of single index
				ary.push( obj );
			}
			return ary;
		}

// -------------------------- imagesLoaded -------------------------- //

		/**
		 * @param {Array, Element, NodeList, String} elem
		 * @param {Object or Function} options - if function, use as callback
		 * @param {Function} onAlways - callback function
		 */
		function ImagesLoaded( elem, options, onAlways ) {
			// coerce ImagesLoaded() without new, to be new ImagesLoaded()
			if ( !( this instanceof ImagesLoaded ) ) {
				return new ImagesLoaded( elem, options, onAlways );
			}
			// use elem as selector string
			if ( typeof elem == 'string' ) {
				elem = document.querySelectorAll( elem );
			}

			this.elements = makeArray( elem );
			this.options = extend( {}, this.options );

			if ( typeof options == 'function' ) {
				onAlways = options;
			} else {
				extend( this.options, options );
			}

			if ( onAlways ) {
				this.on( 'always', onAlways );
			}

			this.getImages();

			if ( $ ) {
				// add jQuery Deferred object
				this.jqDeferred = new $.Deferred();
			}

			// HACK check async to allow time to bind listeners
			setTimeout( function() {
				this.check();
			}.bind( this ));
		}

		ImagesLoaded.prototype = Object.create( EvEmitter.prototype );

		ImagesLoaded.prototype.options = {};

		ImagesLoaded.prototype.getImages = function() {
			this.images = [];

			// filter & find items if we have an item selector
			this.elements.forEach( this.addElementImages, this );
		};

		/**
		 * @param {Node} element
		 */
		ImagesLoaded.prototype.addElementImages = function( elem ) {
			// filter siblings
			if ( elem.nodeName == 'IMG' ) {
				this.addImage( elem );
			}
			// get background image on element
			if ( this.options.background === true ) {
				this.addElementBackgroundImages( elem );
			}

			// find children
			// no non-element nodes, #143
			var nodeType = elem.nodeType;
			if ( !nodeType || !elementNodeTypes[ nodeType ] ) {
				return;
			}
			var childImgs = elem.querySelectorAll('img');
			// concat childElems to filterFound array
			for ( var i=0; i < childImgs.length; i++ ) {
				var img = childImgs[i];
				this.addImage( img );
			}

			// get child background images
			if ( typeof this.options.background == 'string' ) {
				var children = elem.querySelectorAll( this.options.background );
				for ( i=0; i < children.length; i++ ) {
					var child = children[i];
					this.addElementBackgroundImages( child );
				}
			}
		};

		var elementNodeTypes = {
			1: true,
			9: true,
			11: true
		};

		ImagesLoaded.prototype.addElementBackgroundImages = function( elem ) {
			var style = getComputedStyle( elem );
			if ( !style ) {
				// Firefox returns null if in a hidden iframe https://bugzil.la/548397
				return;
			}
			// get url inside url("...")
			var reURL = /url\((['"])?(.*?)\1\)/gi;
			var matches = reURL.exec( style.backgroundImage );
			while ( matches !== null ) {
				var url = matches && matches[2];
				if ( url ) {
					this.addBackground( url, elem );
				}
				matches = reURL.exec( style.backgroundImage );
			}
		};

		/**
		 * @param {Image} img
		 */
		ImagesLoaded.prototype.addImage = function( img ) {
			var loadingImage = new LoadingImage( img );
			this.images.push( loadingImage );
		};

		ImagesLoaded.prototype.addBackground = function( url, elem ) {
			var background = new Background( url, elem );
			this.images.push( background );
		};

		ImagesLoaded.prototype.check = function() {
			var _this = this;
			this.progressedCount = 0;
			this.hasAnyBroken = false;
			// complete if no images
			if ( !this.images.length ) {
				this.complete();
				return;
			}

			function onProgress( image, elem, message ) {
				// HACK - Chrome triggers event before object properties have changed. #83
				setTimeout( function() {
					_this.progress( image, elem, message );
				});
			}

			this.images.forEach( function( loadingImage ) {
				loadingImage.once( 'progress', onProgress );
				loadingImage.check();
			});
		};

		ImagesLoaded.prototype.progress = function( image, elem, message ) {
			this.progressedCount++;
			this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
			// progress event
			this.emitEvent( 'progress', [ this, image, elem ] );
			if ( this.jqDeferred && this.jqDeferred.notify ) {
				this.jqDeferred.notify( this, image );
			}
			// check if completed
			if ( this.progressedCount == this.images.length ) {
				this.complete();
			}

			if ( this.options.debug && console ) {
				console.log( 'progress: ' + message, image, elem );
			}
		};

		ImagesLoaded.prototype.complete = function() {
			var eventName = this.hasAnyBroken ? 'fail' : 'done';
			this.isComplete = true;
			this.emitEvent( eventName, [ this ] );
			this.emitEvent( 'always', [ this ] );
			if ( this.jqDeferred ) {
				var jqMethod = this.hasAnyBroken ? 'reject' : 'resolve';
				this.jqDeferred[ jqMethod ]( this );
			}
		};

// --------------------------  -------------------------- //

		function LoadingImage( img ) {
			this.img = img;
		}

		LoadingImage.prototype = Object.create( EvEmitter.prototype );

		LoadingImage.prototype.check = function() {
			// If complete is true and browser supports natural sizes,
			// try to check for image status manually.
			var isComplete = this.getIsImageComplete();
			if ( isComplete ) {
				// report based on naturalWidth
				this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
				return;
			}

			// If none of the checks above matched, simulate loading on detached element.
			this.proxyImage = new Image();
			this.proxyImage.addEventListener( 'load', this );
			this.proxyImage.addEventListener( 'error', this );
			// bind to image as well for Firefox. #191
			this.img.addEventListener( 'load', this );
			this.img.addEventListener( 'error', this );
			this.proxyImage.src = this.img.src;
		};

		LoadingImage.prototype.getIsImageComplete = function() {
			return this.img.complete && this.img.naturalWidth !== undefined;
		};

		LoadingImage.prototype.confirm = function( isLoaded, message ) {
			this.isLoaded = isLoaded;
			this.emitEvent( 'progress', [ this, this.img, message ] );
		};

// ----- events ----- //

// trigger specified handler for event type
		LoadingImage.prototype.handleEvent = function( event ) {
			var method = 'on' + event.type;
			if ( this[ method ] ) {
				this[ method ]( event );
			}
		};

		LoadingImage.prototype.onload = function() {
			this.confirm( true, 'onload' );
			this.unbindEvents();
		};

		LoadingImage.prototype.onerror = function() {
			this.confirm( false, 'onerror' );
			this.unbindEvents();
		};

		LoadingImage.prototype.unbindEvents = function() {
			this.proxyImage.removeEventListener( 'load', this );
			this.proxyImage.removeEventListener( 'error', this );
			this.img.removeEventListener( 'load', this );
			this.img.removeEventListener( 'error', this );
		};

// -------------------------- Background -------------------------- //

		function Background( url, element ) {
			this.url = url;
			this.element = element;
			this.img = new Image();
		}

// inherit LoadingImage prototype
		Background.prototype = Object.create( LoadingImage.prototype );

		Background.prototype.check = function() {
			this.img.addEventListener( 'load', this );
			this.img.addEventListener( 'error', this );
			this.img.src = this.url;
			// check if image is already complete
			var isComplete = this.getIsImageComplete();
			if ( isComplete ) {
				this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
				this.unbindEvents();
			}
		};

		Background.prototype.unbindEvents = function() {
			this.img.removeEventListener( 'load', this );
			this.img.removeEventListener( 'error', this );
		};

		Background.prototype.confirm = function( isLoaded, message ) {
			this.isLoaded = isLoaded;
			this.emitEvent( 'progress', [ this, this.element, message ] );
		};

// -------------------------- jQuery -------------------------- //

		ImagesLoaded.makeJQueryPlugin = function( jQuery ) {
			jQuery = jQuery || window.jQuery;
			if ( !jQuery ) {
				return;
			}
			// set local variable
			$ = jQuery;
			// $().imagesLoaded()
			$.fn.imagesLoaded = function( options, callback ) {
				var instance = new ImagesLoaded( this, options, callback );
				return instance.jqDeferred.promise( $(this) );
			};
		};
// try making plugin
		ImagesLoaded.makeJQueryPlugin();

// --------------------------  -------------------------- //

		return ImagesLoaded;

	});

/*!
 * Flickity imagesLoaded v2.0.0
 * enables imagesLoaded option for Flickity
 */

/*jshint browser: true, strict: true, undef: true, unused: true */

( function( window, factory ) {
	// universal module definition
	/*jshint strict: false */ /*globals define, module, require */
	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( [
			'flickity/js/index',
			'imagesloaded/imagesloaded'
		], function( Flickity, imagesLoaded ) {
			return factory( window, Flickity, imagesLoaded );
		});
	} else if ( typeof module == 'object' && module.exports ) {
		// CommonJS
		module.exports = factory(
			window,
			require('flickity'),
			require('imagesloaded')
		);
	} else {
		// browser global
		window.Flickity = factory(
			window,
			window.Flickity,
			window.imagesLoaded
		);
	}

}( window, function factory( window, Flickity, imagesLoaded ) {
	'use strict';

	Flickity.createMethods.push('_createImagesLoaded');

	var proto = Flickity.prototype;

	proto._createImagesLoaded = function() {
		this.on( 'activate', this.imagesLoaded );
	};

	proto.imagesLoaded = function() {
		if ( !this.options.imagesLoaded ) {
			return;
		}
		var _this = this;
		function onImagesLoadedProgress( instance, image ) {
			var cell = _this.getParentCell( image.img );
			_this.cellSizeChange( cell && cell.element );
			if ( !_this.options.freeScroll ) {
				_this.positionSliderAtSelected();
			}
		}
		imagesLoaded( this.slider ).on( 'progress', onImagesLoadedProgress );
	};

	return Flickity;

}));

/* == jquery mousewheel plugin == Version: 3.1.13, License: MIT License (MIT) */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});
/* == malihu jquery custom scrollbar plugin == Version: 3.1.5, License: MIT License (MIT) */
!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"undefined"!=typeof module&&module.exports?module.exports=e:e(jQuery,window,document)}(function(e){!function(t){var o="function"==typeof define&&define.amd,a="undefined"!=typeof module&&module.exports,n="https:"==document.location.protocol?"https:":"http:",i="cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js";o||(a?require("jquery-mousewheel")(e):e.event.special.mousewheel||e("head").append(decodeURI("%3Cscript src="+n+"//"+i+"%3E%3C/script%3E"))),t()}(function(){var t,o="mCustomScrollbar",a="mCS",n=".mCustomScrollbar",i={setTop:0,setLeft:0,axis:"y",scrollbarPosition:"inside",scrollInertia:950,autoDraggerLength:!0,alwaysShowScrollbar:0,snapOffset:0,mouseWheel:{enable:!0,scrollAmount:"auto",axis:"y",deltaFactor:"auto",disableOver:["select","option","keygen","datalist","textarea"]},scrollButtons:{scrollType:"stepless",scrollAmount:"auto"},keyboard:{enable:!0,scrollType:"stepless",scrollAmount:"auto"},contentTouchScroll:25,documentTouchScroll:!0,advanced:{autoScrollOnFocus:"input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']",updateOnContentResize:!0,updateOnImageLoad:"auto",autoUpdateTimeout:60},theme:"light",callbacks:{onTotalScrollOffset:0,onTotalScrollBackOffset:0,alwaysTriggerOffsets:!0}},r=0,l={},s=window.attachEvent&&!window.addEventListener?1:0,c=!1,d=["mCSB_dragger_onDrag","mCSB_scrollTools_onDrag","mCS_img_loaded","mCS_disabled","mCS_destroyed","mCS_no_scrollbar","mCS-autoHide","mCS-dir-rtl","mCS_no_scrollbar_y","mCS_no_scrollbar_x","mCS_y_hidden","mCS_x_hidden","mCSB_draggerContainer","mCSB_buttonUp","mCSB_buttonDown","mCSB_buttonLeft","mCSB_buttonRight"],u={init:function(t){var t=e.extend(!0,{},i,t),o=f.call(this);if(t.live){var s=t.liveSelector||this.selector||n,c=e(s);if("off"===t.live)return void m(s);l[s]=setTimeout(function(){c.mCustomScrollbar(t),"once"===t.live&&c.length&&m(s)},500)}else m(s);return t.setWidth=t.set_width?t.set_width:t.setWidth,t.setHeight=t.set_height?t.set_height:t.setHeight,t.axis=t.horizontalScroll?"x":p(t.axis),t.scrollInertia=t.scrollInertia>0&&t.scrollInertia<17?17:t.scrollInertia,"object"!=typeof t.mouseWheel&&1==t.mouseWheel&&(t.mouseWheel={enable:!0,scrollAmount:"auto",axis:"y",preventDefault:!1,deltaFactor:"auto",normalizeDelta:!1,invert:!1}),t.mouseWheel.scrollAmount=t.mouseWheelPixels?t.mouseWheelPixels:t.mouseWheel.scrollAmount,t.mouseWheel.normalizeDelta=t.advanced.normalizeMouseWheelDelta?t.advanced.normalizeMouseWheelDelta:t.mouseWheel.normalizeDelta,t.scrollButtons.scrollType=g(t.scrollButtons.scrollType),h(t),e(o).each(function(){var o=e(this);if(!o.data(a)){o.data(a,{idx:++r,opt:t,scrollRatio:{y:null,x:null},overflowed:null,contentReset:{y:null,x:null},bindEvents:!1,tweenRunning:!1,sequential:{},langDir:o.css("direction"),cbOffsets:null,trigger:null,poll:{size:{o:0,n:0},img:{o:0,n:0},change:{o:0,n:0}}});var n=o.data(a),i=n.opt,l=o.data("mcs-axis"),s=o.data("mcs-scrollbar-position"),c=o.data("mcs-theme");l&&(i.axis=l),s&&(i.scrollbarPosition=s),c&&(i.theme=c,h(i)),v.call(this),n&&i.callbacks.onCreate&&"function"==typeof i.callbacks.onCreate&&i.callbacks.onCreate.call(this),e("#mCSB_"+n.idx+"_container img:not(."+d[2]+")").addClass(d[2]),u.update.call(null,o)}})},update:function(t,o){var n=t||f.call(this);return e(n).each(function(){var t=e(this);if(t.data(a)){var n=t.data(a),i=n.opt,r=e("#mCSB_"+n.idx+"_container"),l=e("#mCSB_"+n.idx),s=[e("#mCSB_"+n.idx+"_dragger_vertical"),e("#mCSB_"+n.idx+"_dragger_horizontal")];if(!r.length)return;n.tweenRunning&&Q(t),o&&n&&i.callbacks.onBeforeUpdate&&"function"==typeof i.callbacks.onBeforeUpdate&&i.callbacks.onBeforeUpdate.call(this),t.hasClass(d[3])&&t.removeClass(d[3]),t.hasClass(d[4])&&t.removeClass(d[4]),l.css("max-height","none"),l.height()!==t.height()&&l.css("max-height",t.height()),_.call(this),"y"===i.axis||i.advanced.autoExpandHorizontalScroll||r.css("width",x(r)),n.overflowed=y.call(this),M.call(this),i.autoDraggerLength&&S.call(this),b.call(this),T.call(this);var c=[Math.abs(r[0].offsetTop),Math.abs(r[0].offsetLeft)];"x"!==i.axis&&(n.overflowed[0]?s[0].height()>s[0].parent().height()?B.call(this):(G(t,c[0].toString(),{dir:"y",dur:0,overwrite:"none"}),n.contentReset.y=null):(B.call(this),"y"===i.axis?k.call(this):"yx"===i.axis&&n.overflowed[1]&&G(t,c[1].toString(),{dir:"x",dur:0,overwrite:"none"}))),"y"!==i.axis&&(n.overflowed[1]?s[1].width()>s[1].parent().width()?B.call(this):(G(t,c[1].toString(),{dir:"x",dur:0,overwrite:"none"}),n.contentReset.x=null):(B.call(this),"x"===i.axis?k.call(this):"yx"===i.axis&&n.overflowed[0]&&G(t,c[0].toString(),{dir:"y",dur:0,overwrite:"none"}))),o&&n&&(2===o&&i.callbacks.onImageLoad&&"function"==typeof i.callbacks.onImageLoad?i.callbacks.onImageLoad.call(this):3===o&&i.callbacks.onSelectorChange&&"function"==typeof i.callbacks.onSelectorChange?i.callbacks.onSelectorChange.call(this):i.callbacks.onUpdate&&"function"==typeof i.callbacks.onUpdate&&i.callbacks.onUpdate.call(this)),N.call(this)}})},scrollTo:function(t,o){if("undefined"!=typeof t&&null!=t){var n=f.call(this);return e(n).each(function(){var n=e(this);if(n.data(a)){var i=n.data(a),r=i.opt,l={trigger:"external",scrollInertia:r.scrollInertia,scrollEasing:"mcsEaseInOut",moveDragger:!1,timeout:60,callbacks:!0,onStart:!0,onUpdate:!0,onComplete:!0},s=e.extend(!0,{},l,o),c=Y.call(this,t),d=s.scrollInertia>0&&s.scrollInertia<17?17:s.scrollInertia;c[0]=X.call(this,c[0],"y"),c[1]=X.call(this,c[1],"x"),s.moveDragger&&(c[0]*=i.scrollRatio.y,c[1]*=i.scrollRatio.x),s.dur=ne()?0:d,setTimeout(function(){null!==c[0]&&"undefined"!=typeof c[0]&&"x"!==r.axis&&i.overflowed[0]&&(s.dir="y",s.overwrite="all",G(n,c[0].toString(),s)),null!==c[1]&&"undefined"!=typeof c[1]&&"y"!==r.axis&&i.overflowed[1]&&(s.dir="x",s.overwrite="none",G(n,c[1].toString(),s))},s.timeout)}})}},stop:function(){var t=f.call(this);return e(t).each(function(){var t=e(this);t.data(a)&&Q(t)})},disable:function(t){var o=f.call(this);return e(o).each(function(){var o=e(this);if(o.data(a)){o.data(a);N.call(this,"remove"),k.call(this),t&&B.call(this),M.call(this,!0),o.addClass(d[3])}})},destroy:function(){var t=f.call(this);return e(t).each(function(){var n=e(this);if(n.data(a)){var i=n.data(a),r=i.opt,l=e("#mCSB_"+i.idx),s=e("#mCSB_"+i.idx+"_container"),c=e(".mCSB_"+i.idx+"_scrollbar");r.live&&m(r.liveSelector||e(t).selector),N.call(this,"remove"),k.call(this),B.call(this),n.removeData(a),$(this,"mcs"),c.remove(),s.find("img."+d[2]).removeClass(d[2]),l.replaceWith(s.contents()),n.removeClass(o+" _"+a+"_"+i.idx+" "+d[6]+" "+d[7]+" "+d[5]+" "+d[3]).addClass(d[4])}})}},f=function(){return"object"!=typeof e(this)||e(this).length<1?n:this},h=function(t){var o=["rounded","rounded-dark","rounded-dots","rounded-dots-dark"],a=["rounded-dots","rounded-dots-dark","3d","3d-dark","3d-thick","3d-thick-dark","inset","inset-dark","inset-2","inset-2-dark","inset-3","inset-3-dark"],n=["minimal","minimal-dark"],i=["minimal","minimal-dark"],r=["minimal","minimal-dark"];t.autoDraggerLength=e.inArray(t.theme,o)>-1?!1:t.autoDraggerLength,t.autoExpandScrollbar=e.inArray(t.theme,a)>-1?!1:t.autoExpandScrollbar,t.scrollButtons.enable=e.inArray(t.theme,n)>-1?!1:t.scrollButtons.enable,t.autoHideScrollbar=e.inArray(t.theme,i)>-1?!0:t.autoHideScrollbar,t.scrollbarPosition=e.inArray(t.theme,r)>-1?"outside":t.scrollbarPosition},m=function(e){l[e]&&(clearTimeout(l[e]),$(l,e))},p=function(e){return"yx"===e||"xy"===e||"auto"===e?"yx":"x"===e||"horizontal"===e?"x":"y"},g=function(e){return"stepped"===e||"pixels"===e||"step"===e||"click"===e?"stepped":"stepless"},v=function(){var t=e(this),n=t.data(a),i=n.opt,r=i.autoExpandScrollbar?" "+d[1]+"_expand":"",l=["<div id='mCSB_"+n.idx+"_scrollbar_vertical' class='mCSB_scrollTools mCSB_"+n.idx+"_scrollbar mCS-"+i.theme+" mCSB_scrollTools_vertical"+r+"'><div class='"+d[12]+"'><div id='mCSB_"+n.idx+"_dragger_vertical' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>","<div id='mCSB_"+n.idx+"_scrollbar_horizontal' class='mCSB_scrollTools mCSB_"+n.idx+"_scrollbar mCS-"+i.theme+" mCSB_scrollTools_horizontal"+r+"'><div class='"+d[12]+"'><div id='mCSB_"+n.idx+"_dragger_horizontal' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>"],s="yx"===i.axis?"mCSB_vertical_horizontal":"x"===i.axis?"mCSB_horizontal":"mCSB_vertical",c="yx"===i.axis?l[0]+l[1]:"x"===i.axis?l[1]:l[0],u="yx"===i.axis?"<div id='mCSB_"+n.idx+"_container_wrapper' class='mCSB_container_wrapper' />":"",f=i.autoHideScrollbar?" "+d[6]:"",h="x"!==i.axis&&"rtl"===n.langDir?" "+d[7]:"";i.setWidth&&t.css("width",i.setWidth),i.setHeight&&t.css("height",i.setHeight),i.setLeft="y"!==i.axis&&"rtl"===n.langDir?"989999px":i.setLeft,t.addClass(o+" _"+a+"_"+n.idx+f+h).wrapInner("<div id='mCSB_"+n.idx+"' class='mCustomScrollBox mCS-"+i.theme+" "+s+"'><div id='mCSB_"+n.idx+"_container' class='mCSB_container' style='position:relative; top:"+i.setTop+"; left:"+i.setLeft+";' dir='"+n.langDir+"' /></div>");var m=e("#mCSB_"+n.idx),p=e("#mCSB_"+n.idx+"_container");"y"===i.axis||i.advanced.autoExpandHorizontalScroll||p.css("width",x(p)),"outside"===i.scrollbarPosition?("static"===t.css("position")&&t.css("position","relative"),t.css("overflow","visible"),m.addClass("mCSB_outside").after(c)):(m.addClass("mCSB_inside").append(c),p.wrap(u)),w.call(this);var g=[e("#mCSB_"+n.idx+"_dragger_vertical"),e("#mCSB_"+n.idx+"_dragger_horizontal")];g[0].css("min-height",g[0].height()),g[1].css("min-width",g[1].width())},x=function(t){var o=[t[0].scrollWidth,Math.max.apply(Math,t.children().map(function(){return e(this).outerWidth(!0)}).get())],a=t.parent().width();return o[0]>a?o[0]:o[1]>a?o[1]:"100%"},_=function(){var t=e(this),o=t.data(a),n=o.opt,i=e("#mCSB_"+o.idx+"_container");if(n.advanced.autoExpandHorizontalScroll&&"y"!==n.axis){i.css({width:"auto","min-width":0,"overflow-x":"scroll"});var r=Math.ceil(i[0].scrollWidth);3===n.advanced.autoExpandHorizontalScroll||2!==n.advanced.autoExpandHorizontalScroll&&r>i.parent().width()?i.css({width:r,"min-width":"100%","overflow-x":"inherit"}):i.css({"overflow-x":"inherit",position:"absolute"}).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({width:Math.ceil(i[0].getBoundingClientRect().right+.4)-Math.floor(i[0].getBoundingClientRect().left),"min-width":"100%",position:"relative"}).unwrap()}},w=function(){var t=e(this),o=t.data(a),n=o.opt,i=e(".mCSB_"+o.idx+"_scrollbar:first"),r=oe(n.scrollButtons.tabindex)?"tabindex='"+n.scrollButtons.tabindex+"'":"",l=["<a href='#' class='"+d[13]+"' "+r+" />","<a href='#' class='"+d[14]+"' "+r+" />","<a href='#' class='"+d[15]+"' "+r+" />","<a href='#' class='"+d[16]+"' "+r+" />"],s=["x"===n.axis?l[2]:l[0],"x"===n.axis?l[3]:l[1],l[2],l[3]];n.scrollButtons.enable&&i.prepend(s[0]).append(s[1]).next(".mCSB_scrollTools").prepend(s[2]).append(s[3])},S=function(){var t=e(this),o=t.data(a),n=e("#mCSB_"+o.idx),i=e("#mCSB_"+o.idx+"_container"),r=[e("#mCSB_"+o.idx+"_dragger_vertical"),e("#mCSB_"+o.idx+"_dragger_horizontal")],l=[n.height()/i.outerHeight(!1),n.width()/i.outerWidth(!1)],c=[parseInt(r[0].css("min-height")),Math.round(l[0]*r[0].parent().height()),parseInt(r[1].css("min-width")),Math.round(l[1]*r[1].parent().width())],d=s&&c[1]<c[0]?c[0]:c[1],u=s&&c[3]<c[2]?c[2]:c[3];r[0].css({height:d,"max-height":r[0].parent().height()-10}).find(".mCSB_dragger_bar").css({"line-height":c[0]+"px"}),r[1].css({width:u,"max-width":r[1].parent().width()-10})},b=function(){var t=e(this),o=t.data(a),n=e("#mCSB_"+o.idx),i=e("#mCSB_"+o.idx+"_container"),r=[e("#mCSB_"+o.idx+"_dragger_vertical"),e("#mCSB_"+o.idx+"_dragger_horizontal")],l=[i.outerHeight(!1)-n.height(),i.outerWidth(!1)-n.width()],s=[l[0]/(r[0].parent().height()-r[0].height()),l[1]/(r[1].parent().width()-r[1].width())];o.scrollRatio={y:s[0],x:s[1]}},C=function(e,t,o){var a=o?d[0]+"_expanded":"",n=e.closest(".mCSB_scrollTools");"active"===t?(e.toggleClass(d[0]+" "+a),n.toggleClass(d[1]),e[0]._draggable=e[0]._draggable?0:1):e[0]._draggable||("hide"===t?(e.removeClass(d[0]),n.removeClass(d[1])):(e.addClass(d[0]),n.addClass(d[1])))},y=function(){var t=e(this),o=t.data(a),n=e("#mCSB_"+o.idx),i=e("#mCSB_"+o.idx+"_container"),r=null==o.overflowed?i.height():i.outerHeight(!1),l=null==o.overflowed?i.width():i.outerWidth(!1),s=i[0].scrollHeight,c=i[0].scrollWidth;return s>r&&(r=s),c>l&&(l=c),[r>n.height(),l>n.width()]},B=function(){var t=e(this),o=t.data(a),n=o.opt,i=e("#mCSB_"+o.idx),r=e("#mCSB_"+o.idx+"_container"),l=[e("#mCSB_"+o.idx+"_dragger_vertical"),e("#mCSB_"+o.idx+"_dragger_horizontal")];if(Q(t),("x"!==n.axis&&!o.overflowed[0]||"y"===n.axis&&o.overflowed[0])&&(l[0].add(r).css("top",0),G(t,"_resetY")),"y"!==n.axis&&!o.overflowed[1]||"x"===n.axis&&o.overflowed[1]){var s=dx=0;"rtl"===o.langDir&&(s=i.width()-r.outerWidth(!1),dx=Math.abs(s/o.scrollRatio.x)),r.css("left",s),l[1].css("left",dx),G(t,"_resetX")}},T=function(){function t(){r=setTimeout(function(){e.event.special.mousewheel?(clearTimeout(r),W.call(o[0])):t()},100)}var o=e(this),n=o.data(a),i=n.opt;if(!n.bindEvents){if(I.call(this),i.contentTouchScroll&&D.call(this),E.call(this),i.mouseWheel.enable){var r;t()}P.call(this),U.call(this),i.advanced.autoScrollOnFocus&&H.call(this),i.scrollButtons.enable&&F.call(this),i.keyboard.enable&&q.call(this),n.bindEvents=!0}},k=function(){var t=e(this),o=t.data(a),n=o.opt,i=a+"_"+o.idx,r=".mCSB_"+o.idx+"_scrollbar",l=e("#mCSB_"+o.idx+",#mCSB_"+o.idx+"_container,#mCSB_"+o.idx+"_container_wrapper,"+r+" ."+d[12]+",#mCSB_"+o.idx+"_dragger_vertical,#mCSB_"+o.idx+"_dragger_horizontal,"+r+">a"),s=e("#mCSB_"+o.idx+"_container");n.advanced.releaseDraggableSelectors&&l.add(e(n.advanced.releaseDraggableSelectors)),n.advanced.extraDraggableSelectors&&l.add(e(n.advanced.extraDraggableSelectors)),o.bindEvents&&(e(document).add(e(!A()||top.document)).unbind("."+i),l.each(function(){e(this).unbind("."+i)}),clearTimeout(t[0]._focusTimeout),$(t[0],"_focusTimeout"),clearTimeout(o.sequential.step),$(o.sequential,"step"),clearTimeout(s[0].onCompleteTimeout),$(s[0],"onCompleteTimeout"),o.bindEvents=!1)},M=function(t){var o=e(this),n=o.data(a),i=n.opt,r=e("#mCSB_"+n.idx+"_container_wrapper"),l=r.length?r:e("#mCSB_"+n.idx+"_container"),s=[e("#mCSB_"+n.idx+"_scrollbar_vertical"),e("#mCSB_"+n.idx+"_scrollbar_horizontal")],c=[s[0].find(".mCSB_dragger"),s[1].find(".mCSB_dragger")];"x"!==i.axis&&(n.overflowed[0]&&!t?(s[0].add(c[0]).add(s[0].children("a")).css("display","block"),l.removeClass(d[8]+" "+d[10])):(i.alwaysShowScrollbar?(2!==i.alwaysShowScrollbar&&c[0].css("display","none"),l.removeClass(d[10])):(s[0].css("display","none"),l.addClass(d[10])),l.addClass(d[8]))),"y"!==i.axis&&(n.overflowed[1]&&!t?(s[1].add(c[1]).add(s[1].children("a")).css("display","block"),l.removeClass(d[9]+" "+d[11])):(i.alwaysShowScrollbar?(2!==i.alwaysShowScrollbar&&c[1].css("display","none"),l.removeClass(d[11])):(s[1].css("display","none"),l.addClass(d[11])),l.addClass(d[9]))),n.overflowed[0]||n.overflowed[1]?o.removeClass(d[5]):o.addClass(d[5])},O=function(t){var o=t.type,a=t.target.ownerDocument!==document&&null!==frameElement?[e(frameElement).offset().top,e(frameElement).offset().left]:null,n=A()&&t.target.ownerDocument!==top.document&&null!==frameElement?[e(t.view.frameElement).offset().top,e(t.view.frameElement).offset().left]:[0,0];switch(o){case"pointerdown":case"MSPointerDown":case"pointermove":case"MSPointerMove":case"pointerup":case"MSPointerUp":return a?[t.originalEvent.pageY-a[0]+n[0],t.originalEvent.pageX-a[1]+n[1],!1]:[t.originalEvent.pageY,t.originalEvent.pageX,!1];case"touchstart":case"touchmove":case"touchend":var i=t.originalEvent.touches[0]||t.originalEvent.changedTouches[0],r=t.originalEvent.touches.length||t.originalEvent.changedTouches.length;return t.target.ownerDocument!==document?[i.screenY,i.screenX,r>1]:[i.pageY,i.pageX,r>1];default:return a?[t.pageY-a[0]+n[0],t.pageX-a[1]+n[1],!1]:[t.pageY,t.pageX,!1]}},I=function(){function t(e,t,a,n){if(h[0].idleTimer=d.scrollInertia<233?250:0,o.attr("id")===f[1])var i="x",s=(o[0].offsetLeft-t+n)*l.scrollRatio.x;else var i="y",s=(o[0].offsetTop-e+a)*l.scrollRatio.y;G(r,s.toString(),{dir:i,drag:!0})}var o,n,i,r=e(this),l=r.data(a),d=l.opt,u=a+"_"+l.idx,f=["mCSB_"+l.idx+"_dragger_vertical","mCSB_"+l.idx+"_dragger_horizontal"],h=e("#mCSB_"+l.idx+"_container"),m=e("#"+f[0]+",#"+f[1]),p=d.advanced.releaseDraggableSelectors?m.add(e(d.advanced.releaseDraggableSelectors)):m,g=d.advanced.extraDraggableSelectors?e(!A()||top.document).add(e(d.advanced.extraDraggableSelectors)):e(!A()||top.document);m.bind("contextmenu."+u,function(e){e.preventDefault()}).bind("mousedown."+u+" touchstart."+u+" pointerdown."+u+" MSPointerDown."+u,function(t){if(t.stopImmediatePropagation(),t.preventDefault(),ee(t)){c=!0,s&&(document.onselectstart=function(){return!1}),L.call(h,!1),Q(r),o=e(this);var a=o.offset(),l=O(t)[0]-a.top,u=O(t)[1]-a.left,f=o.height()+a.top,m=o.width()+a.left;f>l&&l>0&&m>u&&u>0&&(n=l,i=u),C(o,"active",d.autoExpandScrollbar)}}).bind("touchmove."+u,function(e){e.stopImmediatePropagation(),e.preventDefault();var a=o.offset(),r=O(e)[0]-a.top,l=O(e)[1]-a.left;t(n,i,r,l)}),e(document).add(g).bind("mousemove."+u+" pointermove."+u+" MSPointerMove."+u,function(e){if(o){var a=o.offset(),r=O(e)[0]-a.top,l=O(e)[1]-a.left;if(n===r&&i===l)return;t(n,i,r,l)}}).add(p).bind("mouseup."+u+" touchend."+u+" pointerup."+u+" MSPointerUp."+u,function(){o&&(C(o,"active",d.autoExpandScrollbar),o=null),c=!1,s&&(document.onselectstart=null),L.call(h,!0)})},D=function(){function o(e){if(!te(e)||c||O(e)[2])return void(t=0);t=1,b=0,C=0,d=1,y.removeClass("mCS_touch_action");var o=I.offset();u=O(e)[0]-o.top,f=O(e)[1]-o.left,z=[O(e)[0],O(e)[1]]}function n(e){if(te(e)&&!c&&!O(e)[2]&&(T.documentTouchScroll||e.preventDefault(),e.stopImmediatePropagation(),(!C||b)&&d)){g=K();var t=M.offset(),o=O(e)[0]-t.top,a=O(e)[1]-t.left,n="mcsLinearOut";if(E.push(o),W.push(a),z[2]=Math.abs(O(e)[0]-z[0]),z[3]=Math.abs(O(e)[1]-z[1]),B.overflowed[0])var i=D[0].parent().height()-D[0].height(),r=u-o>0&&o-u>-(i*B.scrollRatio.y)&&(2*z[3]<z[2]||"yx"===T.axis);if(B.overflowed[1])var l=D[1].parent().width()-D[1].width(),h=f-a>0&&a-f>-(l*B.scrollRatio.x)&&(2*z[2]<z[3]||"yx"===T.axis);r||h?(U||e.preventDefault(),b=1):(C=1,y.addClass("mCS_touch_action")),U&&e.preventDefault(),w="yx"===T.axis?[u-o,f-a]:"x"===T.axis?[null,f-a]:[u-o,null],I[0].idleTimer=250,B.overflowed[0]&&s(w[0],R,n,"y","all",!0),B.overflowed[1]&&s(w[1],R,n,"x",L,!0)}}function i(e){if(!te(e)||c||O(e)[2])return void(t=0);t=1,e.stopImmediatePropagation(),Q(y),p=K();var o=M.offset();h=O(e)[0]-o.top,m=O(e)[1]-o.left,E=[],W=[]}function r(e){if(te(e)&&!c&&!O(e)[2]){d=0,e.stopImmediatePropagation(),b=0,C=0,v=K();var t=M.offset(),o=O(e)[0]-t.top,a=O(e)[1]-t.left;if(!(v-g>30)){_=1e3/(v-p);var n="mcsEaseOut",i=2.5>_,r=i?[E[E.length-2],W[W.length-2]]:[0,0];x=i?[o-r[0],a-r[1]]:[o-h,a-m];var u=[Math.abs(x[0]),Math.abs(x[1])];_=i?[Math.abs(x[0]/4),Math.abs(x[1]/4)]:[_,_];var f=[Math.abs(I[0].offsetTop)-x[0]*l(u[0]/_[0],_[0]),Math.abs(I[0].offsetLeft)-x[1]*l(u[1]/_[1],_[1])];w="yx"===T.axis?[f[0],f[1]]:"x"===T.axis?[null,f[1]]:[f[0],null],S=[4*u[0]+T.scrollInertia,4*u[1]+T.scrollInertia];var y=parseInt(T.contentTouchScroll)||0;w[0]=u[0]>y?w[0]:0,w[1]=u[1]>y?w[1]:0,B.overflowed[0]&&s(w[0],S[0],n,"y",L,!1),B.overflowed[1]&&s(w[1],S[1],n,"x",L,!1)}}}function l(e,t){var o=[1.5*t,2*t,t/1.5,t/2];return e>90?t>4?o[0]:o[3]:e>60?t>3?o[3]:o[2]:e>30?t>8?o[1]:t>6?o[0]:t>4?t:o[2]:t>8?t:o[3]}function s(e,t,o,a,n,i){e&&G(y,e.toString(),{dur:t,scrollEasing:o,dir:a,overwrite:n,drag:i})}var d,u,f,h,m,p,g,v,x,_,w,S,b,C,y=e(this),B=y.data(a),T=B.opt,k=a+"_"+B.idx,M=e("#mCSB_"+B.idx),I=e("#mCSB_"+B.idx+"_container"),D=[e("#mCSB_"+B.idx+"_dragger_vertical"),e("#mCSB_"+B.idx+"_dragger_horizontal")],E=[],W=[],R=0,L="yx"===T.axis?"none":"all",z=[],P=I.find("iframe"),H=["touchstart."+k+" pointerdown."+k+" MSPointerDown."+k,"touchmove."+k+" pointermove."+k+" MSPointerMove."+k,"touchend."+k+" pointerup."+k+" MSPointerUp."+k],U=void 0!==document.body.style.touchAction&&""!==document.body.style.touchAction;I.bind(H[0],function(e){o(e)}).bind(H[1],function(e){n(e)}),M.bind(H[0],function(e){i(e)}).bind(H[2],function(e){r(e)}),P.length&&P.each(function(){e(this).bind("load",function(){A(this)&&e(this.contentDocument||this.contentWindow.document).bind(H[0],function(e){o(e),i(e)}).bind(H[1],function(e){n(e)}).bind(H[2],function(e){r(e)})})})},E=function(){function o(){return window.getSelection?window.getSelection().toString():document.selection&&"Control"!=document.selection.type?document.selection.createRange().text:0}function n(e,t,o){d.type=o&&i?"stepped":"stepless",d.scrollAmount=10,j(r,e,t,"mcsLinearOut",o?60:null)}var i,r=e(this),l=r.data(a),s=l.opt,d=l.sequential,u=a+"_"+l.idx,f=e("#mCSB_"+l.idx+"_container"),h=f.parent();f.bind("mousedown."+u,function(){t||i||(i=1,c=!0)}).add(document).bind("mousemove."+u,function(e){if(!t&&i&&o()){var a=f.offset(),r=O(e)[0]-a.top+f[0].offsetTop,c=O(e)[1]-a.left+f[0].offsetLeft;r>0&&r<h.height()&&c>0&&c<h.width()?d.step&&n("off",null,"stepped"):("x"!==s.axis&&l.overflowed[0]&&(0>r?n("on",38):r>h.height()&&n("on",40)),"y"!==s.axis&&l.overflowed[1]&&(0>c?n("on",37):c>h.width()&&n("on",39)))}}).bind("mouseup."+u+" dragend."+u,function(){t||(i&&(i=0,n("off",null)),c=!1)})},W=function(){function t(t,a){if(Q(o),!z(o,t.target)){var r="auto"!==i.mouseWheel.deltaFactor?parseInt(i.mouseWheel.deltaFactor):s&&t.deltaFactor<100?100:t.deltaFactor||100,d=i.scrollInertia;if("x"===i.axis||"x"===i.mouseWheel.axis)var u="x",f=[Math.round(r*n.scrollRatio.x),parseInt(i.mouseWheel.scrollAmount)],h="auto"!==i.mouseWheel.scrollAmount?f[1]:f[0]>=l.width()?.9*l.width():f[0],m=Math.abs(e("#mCSB_"+n.idx+"_container")[0].offsetLeft),p=c[1][0].offsetLeft,g=c[1].parent().width()-c[1].width(),v="y"===i.mouseWheel.axis?t.deltaY||a:t.deltaX;else var u="y",f=[Math.round(r*n.scrollRatio.y),parseInt(i.mouseWheel.scrollAmount)],h="auto"!==i.mouseWheel.scrollAmount?f[1]:f[0]>=l.height()?.9*l.height():f[0],m=Math.abs(e("#mCSB_"+n.idx+"_container")[0].offsetTop),p=c[0][0].offsetTop,g=c[0].parent().height()-c[0].height(),v=t.deltaY||a;"y"===u&&!n.overflowed[0]||"x"===u&&!n.overflowed[1]||((i.mouseWheel.invert||t.webkitDirectionInvertedFromDevice)&&(v=-v),i.mouseWheel.normalizeDelta&&(v=0>v?-1:1),(v>0&&0!==p||0>v&&p!==g||i.mouseWheel.preventDefault)&&(t.stopImmediatePropagation(),t.preventDefault()),t.deltaFactor<5&&!i.mouseWheel.normalizeDelta&&(h=t.deltaFactor,d=17),G(o,(m-v*h).toString(),{dir:u,dur:d}))}}if(e(this).data(a)){var o=e(this),n=o.data(a),i=n.opt,r=a+"_"+n.idx,l=e("#mCSB_"+n.idx),c=[e("#mCSB_"+n.idx+"_dragger_vertical"),e("#mCSB_"+n.idx+"_dragger_horizontal")],d=e("#mCSB_"+n.idx+"_container").find("iframe");d.length&&d.each(function(){e(this).bind("load",function(){A(this)&&e(this.contentDocument||this.contentWindow.document).bind("mousewheel."+r,function(e,o){t(e,o)})})}),l.bind("mousewheel."+r,function(e,o){t(e,o)})}},R=new Object,A=function(t){var o=!1,a=!1,n=null;if(void 0===t?a="#empty":void 0!==e(t).attr("id")&&(a=e(t).attr("id")),a!==!1&&void 0!==R[a])return R[a];if(t){try{var i=t.contentDocument||t.contentWindow.document;n=i.body.innerHTML}catch(r){}o=null!==n}else{try{var i=top.document;n=i.body.innerHTML}catch(r){}o=null!==n}return a!==!1&&(R[a]=o),o},L=function(e){var t=this.find("iframe");if(t.length){var o=e?"auto":"none";t.css("pointer-events",o)}},z=function(t,o){var n=o.nodeName.toLowerCase(),i=t.data(a).opt.mouseWheel.disableOver,r=["select","textarea"];return e.inArray(n,i)>-1&&!(e.inArray(n,r)>-1&&!e(o).is(":focus"))},P=function(){var t,o=e(this),n=o.data(a),i=a+"_"+n.idx,r=e("#mCSB_"+n.idx+"_container"),l=r.parent(),s=e(".mCSB_"+n.idx+"_scrollbar ."+d[12]);s.bind("mousedown."+i+" touchstart."+i+" pointerdown."+i+" MSPointerDown."+i,function(o){c=!0,e(o.target).hasClass("mCSB_dragger")||(t=1)}).bind("touchend."+i+" pointerup."+i+" MSPointerUp."+i,function(){c=!1}).bind("click."+i,function(a){if(t&&(t=0,e(a.target).hasClass(d[12])||e(a.target).hasClass("mCSB_draggerRail"))){Q(o);var i=e(this),s=i.find(".mCSB_dragger");if(i.parent(".mCSB_scrollTools_horizontal").length>0){if(!n.overflowed[1])return;var c="x",u=a.pageX>s.offset().left?-1:1,f=Math.abs(r[0].offsetLeft)-u*(.9*l.width())}else{if(!n.overflowed[0])return;var c="y",u=a.pageY>s.offset().top?-1:1,f=Math.abs(r[0].offsetTop)-u*(.9*l.height())}G(o,f.toString(),{dir:c,scrollEasing:"mcsEaseInOut"})}})},H=function(){var t=e(this),o=t.data(a),n=o.opt,i=a+"_"+o.idx,r=e("#mCSB_"+o.idx+"_container"),l=r.parent();r.bind("focusin."+i,function(){var o=e(document.activeElement),a=r.find(".mCustomScrollBox").length,i=0;o.is(n.advanced.autoScrollOnFocus)&&(Q(t),clearTimeout(t[0]._focusTimeout),t[0]._focusTimer=a?(i+17)*a:0,t[0]._focusTimeout=setTimeout(function(){var e=[ae(o)[0],ae(o)[1]],a=[r[0].offsetTop,r[0].offsetLeft],s=[a[0]+e[0]>=0&&a[0]+e[0]<l.height()-o.outerHeight(!1),a[1]+e[1]>=0&&a[0]+e[1]<l.width()-o.outerWidth(!1)],c="yx"!==n.axis||s[0]||s[1]?"all":"none";"x"===n.axis||s[0]||G(t,e[0].toString(),{dir:"y",scrollEasing:"mcsEaseInOut",overwrite:c,dur:i}),"y"===n.axis||s[1]||G(t,e[1].toString(),{dir:"x",scrollEasing:"mcsEaseInOut",overwrite:c,dur:i})},t[0]._focusTimer))})},U=function(){var t=e(this),o=t.data(a),n=a+"_"+o.idx,i=e("#mCSB_"+o.idx+"_container").parent();i.bind("scroll."+n,function(){0===i.scrollTop()&&0===i.scrollLeft()||e(".mCSB_"+o.idx+"_scrollbar").css("visibility","hidden")})},F=function(){var t=e(this),o=t.data(a),n=o.opt,i=o.sequential,r=a+"_"+o.idx,l=".mCSB_"+o.idx+"_scrollbar",s=e(l+">a");s.bind("contextmenu."+r,function(e){e.preventDefault()}).bind("mousedown."+r+" touchstart."+r+" pointerdown."+r+" MSPointerDown."+r+" mouseup."+r+" touchend."+r+" pointerup."+r+" MSPointerUp."+r+" mouseout."+r+" pointerout."+r+" MSPointerOut."+r+" click."+r,function(a){function r(e,o){i.scrollAmount=n.scrollButtons.scrollAmount,j(t,e,o)}if(a.preventDefault(),ee(a)){var l=e(this).attr("class");switch(i.type=n.scrollButtons.scrollType,a.type){case"mousedown":case"touchstart":case"pointerdown":case"MSPointerDown":if("stepped"===i.type)return;c=!0,o.tweenRunning=!1,r("on",l);break;case"mouseup":case"touchend":case"pointerup":case"MSPointerUp":case"mouseout":case"pointerout":case"MSPointerOut":if("stepped"===i.type)return;c=!1,i.dir&&r("off",l);break;case"click":if("stepped"!==i.type||o.tweenRunning)return;r("on",l)}}})},q=function(){function t(t){function a(e,t){r.type=i.keyboard.scrollType,r.scrollAmount=i.keyboard.scrollAmount,"stepped"===r.type&&n.tweenRunning||j(o,e,t)}switch(t.type){case"blur":n.tweenRunning&&r.dir&&a("off",null);break;case"keydown":case"keyup":var l=t.keyCode?t.keyCode:t.which,s="on";if("x"!==i.axis&&(38===l||40===l)||"y"!==i.axis&&(37===l||39===l)){if((38===l||40===l)&&!n.overflowed[0]||(37===l||39===l)&&!n.overflowed[1])return;"keyup"===t.type&&(s="off"),e(document.activeElement).is(u)||(t.preventDefault(),t.stopImmediatePropagation(),a(s,l))}else if(33===l||34===l){if((n.overflowed[0]||n.overflowed[1])&&(t.preventDefault(),t.stopImmediatePropagation()),"keyup"===t.type){Q(o);var f=34===l?-1:1;if("x"===i.axis||"yx"===i.axis&&n.overflowed[1]&&!n.overflowed[0])var h="x",m=Math.abs(c[0].offsetLeft)-f*(.9*d.width());else var h="y",m=Math.abs(c[0].offsetTop)-f*(.9*d.height());G(o,m.toString(),{dir:h,scrollEasing:"mcsEaseInOut"})}}else if((35===l||36===l)&&!e(document.activeElement).is(u)&&((n.overflowed[0]||n.overflowed[1])&&(t.preventDefault(),t.stopImmediatePropagation()),"keyup"===t.type)){if("x"===i.axis||"yx"===i.axis&&n.overflowed[1]&&!n.overflowed[0])var h="x",m=35===l?Math.abs(d.width()-c.outerWidth(!1)):0;else var h="y",m=35===l?Math.abs(d.height()-c.outerHeight(!1)):0;G(o,m.toString(),{dir:h,scrollEasing:"mcsEaseInOut"})}}}var o=e(this),n=o.data(a),i=n.opt,r=n.sequential,l=a+"_"+n.idx,s=e("#mCSB_"+n.idx),c=e("#mCSB_"+n.idx+"_container"),d=c.parent(),u="input,textarea,select,datalist,keygen,[contenteditable='true']",f=c.find("iframe"),h=["blur."+l+" keydown."+l+" keyup."+l];f.length&&f.each(function(){e(this).bind("load",function(){A(this)&&e(this.contentDocument||this.contentWindow.document).bind(h[0],function(e){t(e)})})}),s.attr("tabindex","0").bind(h[0],function(e){t(e)})},j=function(t,o,n,i,r){function l(e){u.snapAmount&&(f.scrollAmount=u.snapAmount instanceof Array?"x"===f.dir[0]?u.snapAmount[1]:u.snapAmount[0]:u.snapAmount);var o="stepped"!==f.type,a=r?r:e?o?p/1.5:g:1e3/60,n=e?o?7.5:40:2.5,s=[Math.abs(h[0].offsetTop),Math.abs(h[0].offsetLeft)],d=[c.scrollRatio.y>10?10:c.scrollRatio.y,c.scrollRatio.x>10?10:c.scrollRatio.x],m="x"===f.dir[0]?s[1]+f.dir[1]*(d[1]*n):s[0]+f.dir[1]*(d[0]*n),v="x"===f.dir[0]?s[1]+f.dir[1]*parseInt(f.scrollAmount):s[0]+f.dir[1]*parseInt(f.scrollAmount),x="auto"!==f.scrollAmount?v:m,_=i?i:e?o?"mcsLinearOut":"mcsEaseInOut":"mcsLinear",w=!!e;return e&&17>a&&(x="x"===f.dir[0]?s[1]:s[0]),G(t,x.toString(),{dir:f.dir[0],scrollEasing:_,dur:a,onComplete:w}),e?void(f.dir=!1):(clearTimeout(f.step),void(f.step=setTimeout(function(){l()},a)))}function s(){clearTimeout(f.step),$(f,"step"),Q(t)}var c=t.data(a),u=c.opt,f=c.sequential,h=e("#mCSB_"+c.idx+"_container"),m="stepped"===f.type,p=u.scrollInertia<26?26:u.scrollInertia,g=u.scrollInertia<1?17:u.scrollInertia;switch(o){case"on":if(f.dir=[n===d[16]||n===d[15]||39===n||37===n?"x":"y",n===d[13]||n===d[15]||38===n||37===n?-1:1],Q(t),oe(n)&&"stepped"===f.type)return;l(m);break;case"off":s(),(m||c.tweenRunning&&f.dir)&&l(!0)}},Y=function(t){var o=e(this).data(a).opt,n=[];return"function"==typeof t&&(t=t()),t instanceof Array?n=t.length>1?[t[0],t[1]]:"x"===o.axis?[null,t[0]]:[t[0],null]:(n[0]=t.y?t.y:t.x||"x"===o.axis?null:t,n[1]=t.x?t.x:t.y||"y"===o.axis?null:t),"function"==typeof n[0]&&(n[0]=n[0]()),"function"==typeof n[1]&&(n[1]=n[1]()),n},X=function(t,o){if(null!=t&&"undefined"!=typeof t){var n=e(this),i=n.data(a),r=i.opt,l=e("#mCSB_"+i.idx+"_container"),s=l.parent(),c=typeof t;o||(o="x"===r.axis?"x":"y");var d="x"===o?l.outerWidth(!1)-s.width():l.outerHeight(!1)-s.height(),f="x"===o?l[0].offsetLeft:l[0].offsetTop,h="x"===o?"left":"top";switch(c){case"function":return t();case"object":var m=t.jquery?t:e(t);if(!m.length)return;return"x"===o?ae(m)[1]:ae(m)[0];case"string":case"number":if(oe(t))return Math.abs(t);if(-1!==t.indexOf("%"))return Math.abs(d*parseInt(t)/100);if(-1!==t.indexOf("-="))return Math.abs(f-parseInt(t.split("-=")[1]));if(-1!==t.indexOf("+=")){var p=f+parseInt(t.split("+=")[1]);return p>=0?0:Math.abs(p)}if(-1!==t.indexOf("px")&&oe(t.split("px")[0]))return Math.abs(t.split("px")[0]);if("top"===t||"left"===t)return 0;if("bottom"===t)return Math.abs(s.height()-l.outerHeight(!1));if("right"===t)return Math.abs(s.width()-l.outerWidth(!1));if("first"===t||"last"===t){var m=l.find(":"+t);return"x"===o?ae(m)[1]:ae(m)[0]}return e(t).length?"x"===o?ae(e(t))[1]:ae(e(t))[0]:(l.css(h,t),void u.update.call(null,n[0]))}}},N=function(t){function o(){return clearTimeout(f[0].autoUpdate),0===l.parents("html").length?void(l=null):void(f[0].autoUpdate=setTimeout(function(){return c.advanced.updateOnSelectorChange&&(s.poll.change.n=i(),s.poll.change.n!==s.poll.change.o)?(s.poll.change.o=s.poll.change.n,void r(3)):c.advanced.updateOnContentResize&&(s.poll.size.n=l[0].scrollHeight+l[0].scrollWidth+f[0].offsetHeight+l[0].offsetHeight+l[0].offsetWidth,s.poll.size.n!==s.poll.size.o)?(s.poll.size.o=s.poll.size.n,void r(1)):!c.advanced.updateOnImageLoad||"auto"===c.advanced.updateOnImageLoad&&"y"===c.axis||(s.poll.img.n=f.find("img").length,s.poll.img.n===s.poll.img.o)?void((c.advanced.updateOnSelectorChange||c.advanced.updateOnContentResize||c.advanced.updateOnImageLoad)&&o()):(s.poll.img.o=s.poll.img.n,void f.find("img").each(function(){n(this)}))},c.advanced.autoUpdateTimeout))}function n(t){function o(e,t){return function(){
return t.apply(e,arguments)}}function a(){this.onload=null,e(t).addClass(d[2]),r(2)}if(e(t).hasClass(d[2]))return void r();var n=new Image;n.onload=o(n,a),n.src=t.src}function i(){c.advanced.updateOnSelectorChange===!0&&(c.advanced.updateOnSelectorChange="*");var e=0,t=f.find(c.advanced.updateOnSelectorChange);return c.advanced.updateOnSelectorChange&&t.length>0&&t.each(function(){e+=this.offsetHeight+this.offsetWidth}),e}function r(e){clearTimeout(f[0].autoUpdate),u.update.call(null,l[0],e)}var l=e(this),s=l.data(a),c=s.opt,f=e("#mCSB_"+s.idx+"_container");return t?(clearTimeout(f[0].autoUpdate),void $(f[0],"autoUpdate")):void o()},V=function(e,t,o){return Math.round(e/t)*t-o},Q=function(t){var o=t.data(a),n=e("#mCSB_"+o.idx+"_container,#mCSB_"+o.idx+"_container_wrapper,#mCSB_"+o.idx+"_dragger_vertical,#mCSB_"+o.idx+"_dragger_horizontal");n.each(function(){Z.call(this)})},G=function(t,o,n){function i(e){return s&&c.callbacks[e]&&"function"==typeof c.callbacks[e]}function r(){return[c.callbacks.alwaysTriggerOffsets||w>=S[0]+y,c.callbacks.alwaysTriggerOffsets||-B>=w]}function l(){var e=[h[0].offsetTop,h[0].offsetLeft],o=[x[0].offsetTop,x[0].offsetLeft],a=[h.outerHeight(!1),h.outerWidth(!1)],i=[f.height(),f.width()];t[0].mcs={content:h,top:e[0],left:e[1],draggerTop:o[0],draggerLeft:o[1],topPct:Math.round(100*Math.abs(e[0])/(Math.abs(a[0])-i[0])),leftPct:Math.round(100*Math.abs(e[1])/(Math.abs(a[1])-i[1])),direction:n.dir}}var s=t.data(a),c=s.opt,d={trigger:"internal",dir:"y",scrollEasing:"mcsEaseOut",drag:!1,dur:c.scrollInertia,overwrite:"all",callbacks:!0,onStart:!0,onUpdate:!0,onComplete:!0},n=e.extend(d,n),u=[n.dur,n.drag?0:n.dur],f=e("#mCSB_"+s.idx),h=e("#mCSB_"+s.idx+"_container"),m=h.parent(),p=c.callbacks.onTotalScrollOffset?Y.call(t,c.callbacks.onTotalScrollOffset):[0,0],g=c.callbacks.onTotalScrollBackOffset?Y.call(t,c.callbacks.onTotalScrollBackOffset):[0,0];if(s.trigger=n.trigger,0===m.scrollTop()&&0===m.scrollLeft()||(e(".mCSB_"+s.idx+"_scrollbar").css("visibility","visible"),m.scrollTop(0).scrollLeft(0)),"_resetY"!==o||s.contentReset.y||(i("onOverflowYNone")&&c.callbacks.onOverflowYNone.call(t[0]),s.contentReset.y=1),"_resetX"!==o||s.contentReset.x||(i("onOverflowXNone")&&c.callbacks.onOverflowXNone.call(t[0]),s.contentReset.x=1),"_resetY"!==o&&"_resetX"!==o){if(!s.contentReset.y&&t[0].mcs||!s.overflowed[0]||(i("onOverflowY")&&c.callbacks.onOverflowY.call(t[0]),s.contentReset.x=null),!s.contentReset.x&&t[0].mcs||!s.overflowed[1]||(i("onOverflowX")&&c.callbacks.onOverflowX.call(t[0]),s.contentReset.x=null),c.snapAmount){var v=c.snapAmount instanceof Array?"x"===n.dir?c.snapAmount[1]:c.snapAmount[0]:c.snapAmount;o=V(o,v,c.snapOffset)}switch(n.dir){case"x":var x=e("#mCSB_"+s.idx+"_dragger_horizontal"),_="left",w=h[0].offsetLeft,S=[f.width()-h.outerWidth(!1),x.parent().width()-x.width()],b=[o,0===o?0:o/s.scrollRatio.x],y=p[1],B=g[1],T=y>0?y/s.scrollRatio.x:0,k=B>0?B/s.scrollRatio.x:0;break;case"y":var x=e("#mCSB_"+s.idx+"_dragger_vertical"),_="top",w=h[0].offsetTop,S=[f.height()-h.outerHeight(!1),x.parent().height()-x.height()],b=[o,0===o?0:o/s.scrollRatio.y],y=p[0],B=g[0],T=y>0?y/s.scrollRatio.y:0,k=B>0?B/s.scrollRatio.y:0}b[1]<0||0===b[0]&&0===b[1]?b=[0,0]:b[1]>=S[1]?b=[S[0],S[1]]:b[0]=-b[0],t[0].mcs||(l(),i("onInit")&&c.callbacks.onInit.call(t[0])),clearTimeout(h[0].onCompleteTimeout),J(x[0],_,Math.round(b[1]),u[1],n.scrollEasing),!s.tweenRunning&&(0===w&&b[0]>=0||w===S[0]&&b[0]<=S[0])||J(h[0],_,Math.round(b[0]),u[0],n.scrollEasing,n.overwrite,{onStart:function(){n.callbacks&&n.onStart&&!s.tweenRunning&&(i("onScrollStart")&&(l(),c.callbacks.onScrollStart.call(t[0])),s.tweenRunning=!0,C(x),s.cbOffsets=r())},onUpdate:function(){n.callbacks&&n.onUpdate&&i("whileScrolling")&&(l(),c.callbacks.whileScrolling.call(t[0]))},onComplete:function(){if(n.callbacks&&n.onComplete){"yx"===c.axis&&clearTimeout(h[0].onCompleteTimeout);var e=h[0].idleTimer||0;h[0].onCompleteTimeout=setTimeout(function(){i("onScroll")&&(l(),c.callbacks.onScroll.call(t[0])),i("onTotalScroll")&&b[1]>=S[1]-T&&s.cbOffsets[0]&&(l(),c.callbacks.onTotalScroll.call(t[0])),i("onTotalScrollBack")&&b[1]<=k&&s.cbOffsets[1]&&(l(),c.callbacks.onTotalScrollBack.call(t[0])),s.tweenRunning=!1,h[0].idleTimer=0,C(x,"hide")},e)}}})}},J=function(e,t,o,a,n,i,r){function l(){S.stop||(x||m.call(),x=K()-v,s(),x>=S.time&&(S.time=x>S.time?x+f-(x-S.time):x+f-1,S.time<x+1&&(S.time=x+1)),S.time<a?S.id=h(l):g.call())}function s(){a>0?(S.currVal=u(S.time,_,b,a,n),w[t]=Math.round(S.currVal)+"px"):w[t]=o+"px",p.call()}function c(){f=1e3/60,S.time=x+f,h=window.requestAnimationFrame?window.requestAnimationFrame:function(e){return s(),setTimeout(e,.01)},S.id=h(l)}function d(){null!=S.id&&(window.requestAnimationFrame?window.cancelAnimationFrame(S.id):clearTimeout(S.id),S.id=null)}function u(e,t,o,a,n){switch(n){case"linear":case"mcsLinear":return o*e/a+t;case"mcsLinearOut":return e/=a,e--,o*Math.sqrt(1-e*e)+t;case"easeInOutSmooth":return e/=a/2,1>e?o/2*e*e+t:(e--,-o/2*(e*(e-2)-1)+t);case"easeInOutStrong":return e/=a/2,1>e?o/2*Math.pow(2,10*(e-1))+t:(e--,o/2*(-Math.pow(2,-10*e)+2)+t);case"easeInOut":case"mcsEaseInOut":return e/=a/2,1>e?o/2*e*e*e+t:(e-=2,o/2*(e*e*e+2)+t);case"easeOutSmooth":return e/=a,e--,-o*(e*e*e*e-1)+t;case"easeOutStrong":return o*(-Math.pow(2,-10*e/a)+1)+t;case"easeOut":case"mcsEaseOut":default:var i=(e/=a)*e,r=i*e;return t+o*(.499999999999997*r*i+-2.5*i*i+5.5*r+-6.5*i+4*e)}}e._mTween||(e._mTween={top:{},left:{}});var f,h,r=r||{},m=r.onStart||function(){},p=r.onUpdate||function(){},g=r.onComplete||function(){},v=K(),x=0,_=e.offsetTop,w=e.style,S=e._mTween[t];"left"===t&&(_=e.offsetLeft);var b=o-_;S.stop=0,"none"!==i&&d(),c()},K=function(){return window.performance&&window.performance.now?window.performance.now():window.performance&&window.performance.webkitNow?window.performance.webkitNow():Date.now?Date.now():(new Date).getTime()},Z=function(){var e=this;e._mTween||(e._mTween={top:{},left:{}});for(var t=["top","left"],o=0;o<t.length;o++){var a=t[o];e._mTween[a].id&&(window.requestAnimationFrame?window.cancelAnimationFrame(e._mTween[a].id):clearTimeout(e._mTween[a].id),e._mTween[a].id=null,e._mTween[a].stop=1)}},$=function(e,t){try{delete e[t]}catch(o){e[t]=null}},ee=function(e){return!(e.which&&1!==e.which)},te=function(e){var t=e.originalEvent.pointerType;return!(t&&"touch"!==t&&2!==t)},oe=function(e){return!isNaN(parseFloat(e))&&isFinite(e)},ae=function(e){var t=e.parents(".mCSB_container");return[e.offset().top-t.offset().top,e.offset().left-t.offset().left]},ne=function(){function e(){var e=["webkit","moz","ms","o"];if("hidden"in document)return"hidden";for(var t=0;t<e.length;t++)if(e[t]+"Hidden"in document)return e[t]+"Hidden";return null}var t=e();return t?document[t]:!1};e.fn[o]=function(t){return u[t]?u[t].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof t&&t?void e.error("Method "+t+" does not exist"):u.init.apply(this,arguments)},e[o]=function(t){return u[t]?u[t].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof t&&t?void e.error("Method "+t+" does not exist"):u.init.apply(this,arguments)},e[o].defaults=i,window[o]=!0,e(window).bind("load",function(){e(n)[o](),e.extend(e.expr[":"],{mcsInView:e.expr[":"].mcsInView||function(t){var o,a,n=e(t),i=n.parents(".mCSB_container");if(i.length)return o=i.parent(),a=[i[0].offsetTop,i[0].offsetLeft],a[0]+ae(n)[0]>=0&&a[0]+ae(n)[0]<o.height()-n.outerHeight(!1)&&a[1]+ae(n)[1]>=0&&a[1]+ae(n)[1]<o.width()-n.outerWidth(!1)},mcsInSight:e.expr[":"].mcsInSight||function(t,o,a){var n,i,r,l,s=e(t),c=s.parents(".mCSB_container"),d="exact"===a[3]?[[1,0],[1,0]]:[[.9,.1],[.6,.4]];if(c.length)return n=[s.outerHeight(!1),s.outerWidth(!1)],r=[c[0].offsetTop+ae(s)[0],c[0].offsetLeft+ae(s)[1]],i=[c.parent()[0].offsetHeight,c.parent()[0].offsetWidth],l=[n[0]<i[0]?d[0]:d[1],n[1]<i[1]?d[0]:d[1]],r[0]-i[0]*l[0][0]<0&&r[0]+n[0]-i[0]*l[0][1]>=0&&r[1]-i[1]*l[1][0]<0&&r[1]+n[1]-i[1]*l[1][1]>=0},mcsOverflow:e.expr[":"].mcsOverflow||function(t){var o=e(t).data(a);if(o)return o.overflowed[0]||o.overflowed[1]}})})})});
/*! nouislider - 10.0.0 - 2017-05-28 14:52:48 */

(function (factory) {

	if ( typeof define === 'function' && define.amd ) {

		// AMD. Register as an anonymous module.
		define([], factory);

	} else if ( typeof exports === 'object' ) {

		// Node/CommonJS
		module.exports = factory();

	} else {

		// Browser globals
		window.noUiSlider = factory();
	}

}(function( ){

	'use strict';

	var VERSION = '10.0.0';


	function isValidFormatter ( entry ) {
		return typeof entry === 'object' && typeof entry.to === 'function' && typeof entry.from === 'function';
	}

	function removeElement ( el ) {
		el.parentElement.removeChild(el);
	}

	// Bindable version
	function preventDefault ( e ) {
		e.preventDefault();
	}

	// Removes duplicates from an array.
	function unique ( array ) {
		return array.filter(function(a){
			return !this[a] ? this[a] = true : false;
		}, {});
	}

	// Round a value to the closest 'to'.
	function closest ( value, to ) {
		return Math.round(value / to) * to;
	}

	// Current position of an element relative to the document.
	function offset ( elem, orientation ) {

		var rect = elem.getBoundingClientRect();
		var doc = elem.ownerDocument;
		var docElem = doc.documentElement;
		var pageOffset = getPageOffset(doc);

		// getBoundingClientRect contains left scroll in Chrome on Android.
		// I haven't found a feature detection that proves this. Worst case
		// scenario on mis-match: the 'tap' feature on horizontal sliders breaks.
		if ( /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) ) {
			pageOffset.x = 0;
		}

		return orientation ? (rect.top + pageOffset.y - docElem.clientTop) : (rect.left + pageOffset.x - docElem.clientLeft);
	}

	// Checks whether a value is numerical.
	function isNumeric ( a ) {
		return typeof a === 'number' && !isNaN( a ) && isFinite( a );
	}

	// Sets a class and removes it after [duration] ms.
	function addClassFor ( element, className, duration ) {
		if (duration > 0) {
			addClass(element, className);
			setTimeout(function(){
				removeClass(element, className);
			}, duration);
		}
	}

	// Limits a value to 0 - 100
	function limit ( a ) {
		return Math.max(Math.min(a, 100), 0);
	}

	// Wraps a variable as an array, if it isn't one yet.
	// Note that an input array is returned by reference!
	function asArray ( a ) {
		return Array.isArray(a) ? a : [a];
	}

	// Counts decimals
	function countDecimals ( numStr ) {
		numStr = String(numStr);
		var pieces = numStr.split(".");
		return pieces.length > 1 ? pieces[1].length : 0;
	}

	// http://youmightnotneedjquery.com/#add_class
	function addClass ( el, className ) {
		if ( el.classList ) {
			el.classList.add(className);
		} else {
			el.className += ' ' + className;
		}
	}

	// http://youmightnotneedjquery.com/#remove_class
	function removeClass ( el, className ) {
		if ( el.classList ) {
			el.classList.remove(className);
		} else {
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	}

	// https://plainjs.com/javascript/attributes/adding-removing-and-testing-for-classes-9/
	function hasClass ( el, className ) {
		return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
	}

	// https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
	function getPageOffset ( doc ) {

		var supportPageOffset = window.pageXOffset !== undefined;
		var isCSS1Compat = ((doc.compatMode || "") === "CSS1Compat");
		var x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? doc.documentElement.scrollLeft : doc.body.scrollLeft;
		var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? doc.documentElement.scrollTop : doc.body.scrollTop;

		return {
			x: x,
			y: y
		};
	}

	// we provide a function to compute constants instead
	// of accessing window.* as soon as the module needs it
	// so that we do not compute anything if not needed
	function getActions ( ) {

		// Determine the events to bind. IE11 implements pointerEvents without
		// a prefix, which breaks compatibility with the IE10 implementation.
		return window.navigator.pointerEnabled ? {
			start: 'pointerdown',
			move: 'pointermove',
			end: 'pointerup'
		} : window.navigator.msPointerEnabled ? {
			start: 'MSPointerDown',
			move: 'MSPointerMove',
			end: 'MSPointerUp'
		} : {
			start: 'mousedown touchstart',
			move: 'mousemove touchmove',
			end: 'mouseup touchend'
		};
	}

	// https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
	// Issue #785
	function getSupportsPassive ( ) {

		var supportsPassive = false;

		try {

			var opts = Object.defineProperty({}, 'passive', {
				get: function() {
					supportsPassive = true;
				}
			});

			window.addEventListener('test', null, opts);

		} catch (e) {}

		return supportsPassive;
	}

	function getSupportsTouchActionNone ( ) {
		return window.CSS && CSS.supports && CSS.supports('touch-action', 'none');
	}


// Value calculation

	// Determine the size of a sub-range in relation to a full range.
	function subRangeRatio ( pa, pb ) {
		return (100 / (pb - pa));
	}

	// (percentage) How many percent is this value of this range?
	function fromPercentage ( range, value ) {
		return (value * 100) / ( range[1] - range[0] );
	}

	// (percentage) Where is this value on this range?
	function toPercentage ( range, value ) {
		return fromPercentage( range, range[0] < 0 ?
		value + Math.abs(range[0]) :
		value - range[0] );
	}

	// (value) How much is this percentage on this range?
	function isPercentage ( range, value ) {
		return ((value * ( range[1] - range[0] )) / 100) + range[0];
	}


// Range conversion

	function getJ ( value, arr ) {

		var j = 1;

		while ( value >= arr[j] ){
			j += 1;
		}

		return j;
	}

	// (percentage) Input a value, find where, on a scale of 0-100, it applies.
	function toStepping ( xVal, xPct, value ) {

		if ( value >= xVal.slice(-1)[0] ){
			return 100;
		}

		var j = getJ( value, xVal ), va, vb, pa, pb;

		va = xVal[j-1];
		vb = xVal[j];
		pa = xPct[j-1];
		pb = xPct[j];

		return pa + (toPercentage([va, vb], value) / subRangeRatio (pa, pb));
	}

	// (value) Input a percentage, find where it is on the specified range.
	function fromStepping ( xVal, xPct, value ) {

		// There is no range group that fits 100
		if ( value >= 100 ){
			return xVal.slice(-1)[0];
		}

		var j = getJ( value, xPct ), va, vb, pa, pb;

		va = xVal[j-1];
		vb = xVal[j];
		pa = xPct[j-1];
		pb = xPct[j];

		return isPercentage([va, vb], (value - pa) * subRangeRatio (pa, pb));
	}

	// (percentage) Get the step that applies at a certain value.
	function getStep ( xPct, xSteps, snap, value ) {

		if ( value === 100 ) {
			return value;
		}

		var j = getJ( value, xPct ), a, b;

		// If 'snap' is set, steps are used as fixed points on the slider.
		if ( snap ) {

			a = xPct[j-1];
			b = xPct[j];

			// Find the closest position, a or b.
			if ((value - a) > ((b-a)/2)){
				return b;
			}

			return a;
		}

		if ( !xSteps[j-1] ){
			return value;
		}

		return xPct[j-1] + closest(
				value - xPct[j-1],
				xSteps[j-1]
			);
	}


// Entry parsing

	function handleEntryPoint ( index, value, that ) {

		var percentage;

		// Wrap numerical input in an array.
		if ( typeof value === "number" ) {
			value = [value];
		}

		// Reject any invalid input, by testing whether value is an array.
		if ( Object.prototype.toString.call( value ) !== '[object Array]' ){
			throw new Error("noUiSlider (" + VERSION + "): 'range' contains invalid value.");
		}

		// Covert min/max syntax to 0 and 100.
		if ( index === 'min' ) {
			percentage = 0;
		} else if ( index === 'max' ) {
			percentage = 100;
		} else {
			percentage = parseFloat( index );
		}

		// Check for correct input.
		if ( !isNumeric( percentage ) || !isNumeric( value[0] ) ) {
			throw new Error("noUiSlider (" + VERSION + "): 'range' value isn't numeric.");
		}

		// Store values.
		that.xPct.push( percentage );
		that.xVal.push( value[0] );

		// NaN will evaluate to false too, but to keep
		// logging clear, set step explicitly. Make sure
		// not to override the 'step' setting with false.
		if ( !percentage ) {
			if ( !isNaN( value[1] ) ) {
				that.xSteps[0] = value[1];
			}
		} else {
			that.xSteps.push( isNaN(value[1]) ? false : value[1] );
		}

		that.xHighestCompleteStep.push(0);
	}

	function handleStepPoint ( i, n, that ) {

		// Ignore 'false' stepping.
		if ( !n ) {
			return true;
		}

		// Factor to range ratio
		that.xSteps[i] = fromPercentage([
				that.xVal[i]
				,that.xVal[i+1]
			], n) / subRangeRatio (
				that.xPct[i],
				that.xPct[i+1] );

		var totalSteps = (that.xVal[i+1] - that.xVal[i]) / that.xNumSteps[i];
		var highestStep = Math.ceil(Number(totalSteps.toFixed(3)) - 1);
		var step = that.xVal[i] + (that.xNumSteps[i] * highestStep);

		that.xHighestCompleteStep[i] = step;
	}


// Interface

	function Spectrum ( entry, snap, singleStep ) {

		this.xPct = [];
		this.xVal = [];
		this.xSteps = [ singleStep || false ];
		this.xNumSteps = [ false ];
		this.xHighestCompleteStep = [];

		this.snap = snap;

		var index, ordered = [ /* [0, 'min'], [1, '50%'], [2, 'max'] */ ];

		// Map the object keys to an array.
		for ( index in entry ) {
			if ( entry.hasOwnProperty(index) ) {
				ordered.push([entry[index], index]);
			}
		}

		// Sort all entries by value (numeric sort).
		if ( ordered.length && typeof ordered[0][0] === "object" ) {
			ordered.sort(function(a, b) { return a[0][0] - b[0][0]; });
		} else {
			ordered.sort(function(a, b) { return a[0] - b[0]; });
		}


		// Convert all entries to subranges.
		for ( index = 0; index < ordered.length; index++ ) {
			handleEntryPoint(ordered[index][1], ordered[index][0], this);
		}

		// Store the actual step values.
		// xSteps is sorted in the same order as xPct and xVal.
		this.xNumSteps = this.xSteps.slice(0);

		// Convert all numeric steps to the percentage of the subrange they represent.
		for ( index = 0; index < this.xNumSteps.length; index++ ) {
			handleStepPoint(index, this.xNumSteps[index], this);
		}
	}

	Spectrum.prototype.getMargin = function ( value ) {

		var step = this.xNumSteps[0];

		if ( step && ((value / step) % 1) !== 0 ) {
			throw new Error("noUiSlider (" + VERSION + "): 'limit', 'margin' and 'padding' must be divisible by step.");
		}

		return this.xPct.length === 2 ? fromPercentage(this.xVal, value) : false;
	};

	Spectrum.prototype.toStepping = function ( value ) {

		value = toStepping( this.xVal, this.xPct, value );

		return value;
	};

	Spectrum.prototype.fromStepping = function ( value ) {

		return fromStepping( this.xVal, this.xPct, value );
	};

	Spectrum.prototype.getStep = function ( value ) {

		value = getStep(this.xPct, this.xSteps, this.snap, value );

		return value;
	};

	Spectrum.prototype.getNearbySteps = function ( value ) {

		var j = getJ(value, this.xPct);

		return {
			stepBefore: { startValue: this.xVal[j-2], step: this.xNumSteps[j-2], highestStep: this.xHighestCompleteStep[j-2] },
			thisStep: { startValue: this.xVal[j-1], step: this.xNumSteps[j-1], highestStep: this.xHighestCompleteStep[j-1] },
			stepAfter: { startValue: this.xVal[j-0], step: this.xNumSteps[j-0], highestStep: this.xHighestCompleteStep[j-0] }
		};
	};

	Spectrum.prototype.countStepDecimals = function () {
		var stepDecimals = this.xNumSteps.map(countDecimals);
		return Math.max.apply(null, stepDecimals);
	};

	// Outside testing
	Spectrum.prototype.convert = function ( value ) {
		return this.getStep(this.toStepping(value));
	};

	/*	Every input option is tested and parsed. This'll prevent
	 endless validation in internal methods. These tests are
	 structured with an item for every option available. An
	 option can be marked as required by setting the 'r' flag.
	 The testing function is provided with three arguments:
	 - The provided value for the option;
	 - A reference to the options object;
	 - The name for the option;

	 The testing function returns false when an error is detected,
	 or true when everything is OK. It can also modify the option
	 object, to make sure all values can be correctly looped elsewhere. */

	var defaultFormatter = { 'to': function( value ){
		return value !== undefined && value.toFixed(2);
	}, 'from': Number };

	function validateFormat ( entry ) {

		// Any object with a to and from method is supported.
		if ( isValidFormatter(entry) ) {
			return true;
		}

		throw new Error("noUiSlider (" + VERSION + "): 'format' requires 'to' and 'from' methods.");
	}

	function testStep ( parsed, entry ) {

		if ( !isNumeric( entry ) ) {
			throw new Error("noUiSlider (" + VERSION + "): 'step' is not numeric.");
		}

		// The step option can still be used to set stepping
		// for linear sliders. Overwritten if set in 'range'.
		parsed.singleStep = entry;
	}

	function testRange ( parsed, entry ) {

		// Filter incorrect input.
		if ( typeof entry !== 'object' || Array.isArray(entry) ) {
			throw new Error("noUiSlider (" + VERSION + "): 'range' is not an object.");
		}

		// Catch missing start or end.
		if ( entry.min === undefined || entry.max === undefined ) {
			throw new Error("noUiSlider (" + VERSION + "): Missing 'min' or 'max' in 'range'.");
		}

		// Catch equal start or end.
		if ( entry.min === entry.max ) {
			throw new Error("noUiSlider (" + VERSION + "): 'range' 'min' and 'max' cannot be equal.");
		}

		parsed.spectrum = new Spectrum(entry, parsed.snap, parsed.singleStep);
	}

	function testStart ( parsed, entry ) {

		entry = asArray(entry);

		// Validate input. Values aren't tested, as the public .val method
		// will always provide a valid location.
		if ( !Array.isArray( entry ) || !entry.length ) {
			throw new Error("noUiSlider (" + VERSION + "): 'start' option is incorrect.");
		}

		// Store the number of handles.
		parsed.handles = entry.length;

		// When the slider is initialized, the .val method will
		// be called with the start options.
		parsed.start = entry;
	}

	function testSnap ( parsed, entry ) {

		// Enforce 100% stepping within subranges.
		parsed.snap = entry;

		if ( typeof entry !== 'boolean' ){
			throw new Error("noUiSlider (" + VERSION + "): 'snap' option must be a boolean.");
		}
	}

	function testAnimate ( parsed, entry ) {

		// Enforce 100% stepping within subranges.
		parsed.animate = entry;

		if ( typeof entry !== 'boolean' ){
			throw new Error("noUiSlider (" + VERSION + "): 'animate' option must be a boolean.");
		}
	}

	function testAnimationDuration ( parsed, entry ) {

		parsed.animationDuration = entry;

		if ( typeof entry !== 'number' ){
			throw new Error("noUiSlider (" + VERSION + "): 'animationDuration' option must be a number.");
		}
	}

	function testConnect ( parsed, entry ) {

		var connect = [false];
		var i;

		// Map legacy options
		if ( entry === 'lower' ) {
			entry = [true, false];
		}

		else if ( entry === 'upper' ) {
			entry = [false, true];
		}

		// Handle boolean options
		if ( entry === true || entry === false ) {

			for ( i = 1; i < parsed.handles; i++ ) {
				connect.push(entry);
			}

			connect.push(false);
		}

		// Reject invalid input
		else if ( !Array.isArray( entry ) || !entry.length || entry.length !== parsed.handles + 1 ) {
			throw new Error("noUiSlider (" + VERSION + "): 'connect' option doesn't match handle count.");
		}

		else {
			connect = entry;
		}

		parsed.connect = connect;
	}

	function testOrientation ( parsed, entry ) {

		// Set orientation to an a numerical value for easy
		// array selection.
		switch ( entry ){
			case 'horizontal':
				parsed.ort = 0;
				break;
			case 'vertical':
				parsed.ort = 1;
				break;
			default:
				throw new Error("noUiSlider (" + VERSION + "): 'orientation' option is invalid.");
		}
	}

	function testMargin ( parsed, entry ) {

		if ( !isNumeric(entry) ){
			throw new Error("noUiSlider (" + VERSION + "): 'margin' option must be numeric.");
		}

		// Issue #582
		if ( entry === 0 ) {
			return;
		}

		parsed.margin = parsed.spectrum.getMargin(entry);

		if ( !parsed.margin ) {
			throw new Error("noUiSlider (" + VERSION + "): 'margin' option is only supported on linear sliders.");
		}
	}

	function testLimit ( parsed, entry ) {

		if ( !isNumeric(entry) ){
			throw new Error("noUiSlider (" + VERSION + "): 'limit' option must be numeric.");
		}

		parsed.limit = parsed.spectrum.getMargin(entry);

		if ( !parsed.limit || parsed.handles < 2 ) {
			throw new Error("noUiSlider (" + VERSION + "): 'limit' option is only supported on linear sliders with 2 or more handles.");
		}
	}

	function testPadding ( parsed, entry ) {

		if ( !isNumeric(entry) ){
			throw new Error("noUiSlider (" + VERSION + "): 'padding' option must be numeric.");
		}

		if ( entry === 0 ) {
			return;
		}

		parsed.padding = parsed.spectrum.getMargin(entry);

		if ( !parsed.padding ) {
			throw new Error("noUiSlider (" + VERSION + "): 'padding' option is only supported on linear sliders.");
		}

		if ( parsed.padding < 0 ) {
			throw new Error("noUiSlider (" + VERSION + "): 'padding' option must be a positive number.");
		}

		if ( parsed.padding >= 50 ) {
			throw new Error("noUiSlider (" + VERSION + "): 'padding' option must be less than half the range.");
		}
	}

	function testDirection ( parsed, entry ) {

		// Set direction as a numerical value for easy parsing.
		// Invert connection for RTL sliders, so that the proper
		// handles get the connect/background classes.
		switch ( entry ) {
			case 'ltr':
				parsed.dir = 0;
				break;
			case 'rtl':
				parsed.dir = 1;
				break;
			default:
				throw new Error("noUiSlider (" + VERSION + "): 'direction' option was not recognized.");
		}
	}

	function testBehaviour ( parsed, entry ) {

		// Make sure the input is a string.
		if ( typeof entry !== 'string' ) {
			throw new Error("noUiSlider (" + VERSION + "): 'behaviour' must be a string containing options.");
		}

		// Check if the string contains any keywords.
		// None are required.
		var tap = entry.indexOf('tap') >= 0;
		var drag = entry.indexOf('drag') >= 0;
		var fixed = entry.indexOf('fixed') >= 0;
		var snap = entry.indexOf('snap') >= 0;
		var hover = entry.indexOf('hover') >= 0;

		if ( fixed ) {

			if ( parsed.handles !== 2 ) {
				throw new Error("noUiSlider (" + VERSION + "): 'fixed' behaviour must be used with 2 handles");
			}

			// Use margin to enforce fixed state
			testMargin(parsed, parsed.start[1] - parsed.start[0]);
		}

		parsed.events = {
			tap: tap || snap,
			drag: drag,
			fixed: fixed,
			snap: snap,
			hover: hover
		};
	}

	function testTooltips ( parsed, entry ) {

		if ( entry === false ) {
			return;
		}

		else if ( entry === true ) {

			parsed.tooltips = [];

			for ( var i = 0; i < parsed.handles; i++ ) {
				parsed.tooltips.push(true);
			}
		}

		else {

			parsed.tooltips = asArray(entry);

			if ( parsed.tooltips.length !== parsed.handles ) {
				throw new Error("noUiSlider (" + VERSION + "): must pass a formatter for all handles.");
			}

			parsed.tooltips.forEach(function(formatter){
				if ( typeof formatter !== 'boolean' && (typeof formatter !== 'object' || typeof formatter.to !== 'function') ) {
					throw new Error("noUiSlider (" + VERSION + "): 'tooltips' must be passed a formatter or 'false'.");
				}
			});
		}
	}

	function testAriaFormat ( parsed, entry ) {
		parsed.ariaFormat = entry;
		validateFormat(entry);
	}

	function testFormat ( parsed, entry ) {
		parsed.format = entry;
		validateFormat(entry);
	}

	function testCssPrefix ( parsed, entry ) {

		if ( entry !== undefined && typeof entry !== 'string' && entry !== false ) {
			throw new Error("noUiSlider (" + VERSION + "): 'cssPrefix' must be a string or `false`.");
		}

		parsed.cssPrefix = entry;
	}

	function testCssClasses ( parsed, entry ) {

		if ( entry !== undefined && typeof entry !== 'object' ) {
			throw new Error("noUiSlider (" + VERSION + "): 'cssClasses' must be an object.");
		}

		if ( typeof parsed.cssPrefix === 'string' ) {
			parsed.cssClasses = {};

			for ( var key in entry ) {
				if ( !entry.hasOwnProperty(key) ) { continue; }

				parsed.cssClasses[key] = parsed.cssPrefix + entry[key];
			}
		} else {
			parsed.cssClasses = entry;
		}
	}

	function testUseRaf ( parsed, entry ) {
		if ( entry === true || entry === false ) {
			parsed.useRequestAnimationFrame = entry;
		} else {
			throw new Error("noUiSlider (" + VERSION + "): 'useRequestAnimationFrame' option should be true (default) or false.");
		}
	}

	// Test all developer settings and parse to assumption-safe values.
	function testOptions ( options ) {

		// To prove a fix for #537, freeze options here.
		// If the object is modified, an error will be thrown.
		// Object.freeze(options);

		var parsed = {
			margin: 0,
			limit: 0,
			padding: 0,
			animate: true,
			animationDuration: 300,
			ariaFormat: defaultFormatter,
			format: defaultFormatter
		};

		// Tests are executed in the order they are presented here.
		var tests = {
			'step': { r: false, t: testStep },
			'start': { r: true, t: testStart },
			'connect': { r: true, t: testConnect },
			'direction': { r: true, t: testDirection },
			'snap': { r: false, t: testSnap },
			'animate': { r: false, t: testAnimate },
			'animationDuration': { r: false, t: testAnimationDuration },
			'range': { r: true, t: testRange },
			'orientation': { r: false, t: testOrientation },
			'margin': { r: false, t: testMargin },
			'limit': { r: false, t: testLimit },
			'padding': { r: false, t: testPadding },
			'behaviour': { r: true, t: testBehaviour },
			'ariaFormat': { r: false, t: testAriaFormat },
			'format': { r: false, t: testFormat },
			'tooltips': { r: false, t: testTooltips },
			'cssPrefix': { r: false, t: testCssPrefix },
			'cssClasses': { r: false, t: testCssClasses },
			'useRequestAnimationFrame': { r: false, t: testUseRaf }
		};

		var defaults = {
			'connect': false,
			'direction': 'ltr',
			'behaviour': 'tap',
			'orientation': 'horizontal',
			'cssPrefix' : 'noUi-',
			'cssClasses': {
				target: 'target',
				base: 'base',
				origin: 'origin',
				handle: 'handle',
				handleLower: 'handle-lower',
				handleUpper: 'handle-upper',
				horizontal: 'horizontal',
				vertical: 'vertical',
				background: 'background',
				connect: 'connect',
				ltr: 'ltr',
				rtl: 'rtl',
				draggable: 'draggable',
				drag: 'state-drag',
				tap: 'state-tap',
				active: 'active',
				tooltip: 'tooltip',
				pips: 'pips',
				pipsHorizontal: 'pips-horizontal',
				pipsVertical: 'pips-vertical',
				marker: 'marker',
				markerHorizontal: 'marker-horizontal',
				markerVertical: 'marker-vertical',
				markerNormal: 'marker-normal',
				markerLarge: 'marker-large',
				markerSub: 'marker-sub',
				value: 'value',
				valueHorizontal: 'value-horizontal',
				valueVertical: 'value-vertical',
				valueNormal: 'value-normal',
				valueLarge: 'value-large',
				valueSub: 'value-sub'
			},
			'useRequestAnimationFrame': true
		};

		// AriaFormat defaults to regular format, if any.
		if ( options.format && !options.ariaFormat ) {
			options.ariaFormat = options.format;
		}

		// Run all options through a testing mechanism to ensure correct
		// input. It should be noted that options might get modified to
		// be handled properly. E.g. wrapping integers in arrays.
		Object.keys(tests).forEach(function( name ){

			// If the option isn't set, but it is required, throw an error.
			if ( options[name] === undefined && defaults[name] === undefined ) {

				if ( tests[name].r ) {
					throw new Error("noUiSlider (" + VERSION + "): '" + name + "' is required.");
				}

				return true;
			}

			tests[name].t( parsed, options[name] === undefined ? defaults[name] : options[name] );
		});

		// Forward pips options
		parsed.pips = options.pips;

		var styles = [['left', 'top'], ['right', 'bottom']];

		// Pre-define the styles.
		parsed.style = styles[parsed.dir][parsed.ort];
		parsed.styleOposite = styles[parsed.dir?0:1][parsed.ort];

		return parsed;
	}


	function closure ( target, options, originalOptions ){

		var actions = getActions();
		var supportsTouchActionNone = getSupportsTouchActionNone();
		var supportsPassive = supportsTouchActionNone && getSupportsPassive();

		// All variables local to 'closure' are prefixed with 'scope_'
		var scope_Target = target;
		var scope_Locations = [];
		var scope_Base;
		var scope_Handles;
		var scope_HandleNumbers = [];
		var scope_ActiveHandle = false;
		var scope_Connects;
		var scope_Spectrum = options.spectrum;
		var scope_Values = [];
		var scope_Events = {};
		var scope_Self;
		var scope_Pips;
		var scope_Listeners = null;
		var scope_Document = target.ownerDocument;
		var scope_DocumentElement = scope_Document.documentElement;
		var scope_Body = scope_Document.body;


		// Creates a node, adds it to target, returns the new node.
		function addNodeTo ( target, className ) {

			var div = scope_Document.createElement('div');

			if ( className ) {
				addClass(div, className);
			}

			target.appendChild(div);

			return div;
		}

		// Append a origin to the base
		function addOrigin ( base, handleNumber ) {

			var origin = addNodeTo(base, options.cssClasses.origin);
			var handle = addNodeTo(origin, options.cssClasses.handle);

			handle.setAttribute('data-handle', handleNumber);

			// https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
			// 0 = focusable and reachable
			handle.setAttribute('tabindex', '0');
			handle.setAttribute('role', 'slider');
			handle.setAttribute('aria-orientation', options.ort ? 'vertical' : 'horizontal');

			if ( handleNumber === 0 ) {
				addClass(handle, options.cssClasses.handleLower);
			}

			else if ( handleNumber === options.handles - 1 ) {
				addClass(handle, options.cssClasses.handleUpper);
			}

			return origin;
		}

		// Insert nodes for connect elements
		function addConnect ( base, add ) {

			if ( !add ) {
				return false;
			}

			return addNodeTo(base, options.cssClasses.connect);
		}

		// Add handles to the slider base.
		function addElements ( connectOptions, base ) {

			scope_Handles = [];
			scope_Connects = [];

			scope_Connects.push(addConnect(base, connectOptions[0]));

			// [::::O====O====O====]
			// connectOptions = [0, 1, 1, 1]

			for ( var i = 0; i < options.handles; i++ ) {
				// Keep a list of all added handles.
				scope_Handles.push(addOrigin(base, i));
				scope_HandleNumbers[i] = i;
				scope_Connects.push(addConnect(base, connectOptions[i + 1]));
			}
		}

		// Initialize a single slider.
		function addSlider ( target ) {

			// Apply classes and data to the target.
			addClass(target, options.cssClasses.target);

			if ( options.dir === 0 ) {
				addClass(target, options.cssClasses.ltr);
			} else {
				addClass(target, options.cssClasses.rtl);
			}

			if ( options.ort === 0 ) {
				addClass(target, options.cssClasses.horizontal);
			} else {
				addClass(target, options.cssClasses.vertical);
			}

			scope_Base = addNodeTo(target, options.cssClasses.base);
		}


		function addTooltip ( handle, handleNumber ) {

			if ( !options.tooltips[handleNumber] ) {
				return false;
			}

			return addNodeTo(handle.firstChild, options.cssClasses.tooltip);
		}

		// The tooltips option is a shorthand for using the 'update' event.
		function tooltips ( ) {

			// Tooltips are added with options.tooltips in original order.
			var tips = scope_Handles.map(addTooltip);

			bindEvent('update', function(values, handleNumber, unencoded) {

				if ( !tips[handleNumber] ) {
					return;
				}

				var formattedValue = values[handleNumber];

				if ( options.tooltips[handleNumber] !== true ) {
					formattedValue = options.tooltips[handleNumber].to(unencoded[handleNumber]);
				}

				tips[handleNumber].innerHTML = formattedValue;
			});
		}


		function aria ( ) {

			bindEvent('update', function ( values, handleNumber, unencoded, tap, positions ) {

				// Update Aria Values for all handles, as a change in one changes min and max values for the next.
				scope_HandleNumbers.forEach(function( handleNumber ){

					var handle = scope_Handles[handleNumber];

					var min = checkHandlePosition(scope_Locations, handleNumber, 0, true, true, true);
					var max = checkHandlePosition(scope_Locations, handleNumber, 100, true, true, true);

					var now = positions[handleNumber];
					var text = options.ariaFormat.to(unencoded[handleNumber]);

					handle.children[0].setAttribute('aria-valuemin', min.toFixed(1));
					handle.children[0].setAttribute('aria-valuemax', max.toFixed(1));
					handle.children[0].setAttribute('aria-valuenow', now.toFixed(1));
					handle.children[0].setAttribute('aria-valuetext', text);
				});
			});
		}


		function getGroup ( mode, values, stepped ) {

			// Use the range.
			if ( mode === 'range' || mode === 'steps' ) {
				return scope_Spectrum.xVal;
			}

			if ( mode === 'count' ) {

				if ( !values ) {
					throw new Error("noUiSlider (" + VERSION + "): 'values' required for mode 'count'.");
				}

				// Divide 0 - 100 in 'count' parts.
				var spread = ( 100 / (values - 1) );
				var v;
				var i = 0;

				values = [];

				// List these parts and have them handled as 'positions'.
				while ( (v = i++ * spread) <= 100 ) {
					values.push(v);
				}

				mode = 'positions';
			}

			if ( mode === 'positions' ) {

				// Map all percentages to on-range values.
				return values.map(function( value ){
					return scope_Spectrum.fromStepping( stepped ? scope_Spectrum.getStep( value ) : value );
				});
			}

			if ( mode === 'values' ) {

				// If the value must be stepped, it needs to be converted to a percentage first.
				if ( stepped ) {

					return values.map(function( value ){

						// Convert to percentage, apply step, return to value.
						return scope_Spectrum.fromStepping( scope_Spectrum.getStep( scope_Spectrum.toStepping( value ) ) );
					});

				}

				// Otherwise, we can simply use the values.
				return values;
			}
		}

		function generateSpread ( density, mode, group ) {

			function safeIncrement(value, increment) {
				// Avoid floating point variance by dropping the smallest decimal places.
				return (value + increment).toFixed(7) / 1;
			}

			var indexes = {};
			var firstInRange = scope_Spectrum.xVal[0];
			var lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length-1];
			var ignoreFirst = false;
			var ignoreLast = false;
			var prevPct = 0;

			// Create a copy of the group, sort it and filter away all duplicates.
			group = unique(group.slice().sort(function(a, b){ return a - b; }));

			// Make sure the range starts with the first element.
			if ( group[0] !== firstInRange ) {
				group.unshift(firstInRange);
				ignoreFirst = true;
			}

			// Likewise for the last one.
			if ( group[group.length - 1] !== lastInRange ) {
				group.push(lastInRange);
				ignoreLast = true;
			}

			group.forEach(function ( current, index ) {

				// Get the current step and the lower + upper positions.
				var step;
				var i;
				var q;
				var low = current;
				var high = group[index+1];
				var newPct;
				var pctDifference;
				var pctPos;
				var type;
				var steps;
				var realSteps;
				var stepsize;

				// When using 'steps' mode, use the provided steps.
				// Otherwise, we'll step on to the next subrange.
				if ( mode === 'steps' ) {
					step = scope_Spectrum.xNumSteps[ index ];
				}

				// Default to a 'full' step.
				if ( !step ) {
					step = high-low;
				}

				// Low can be 0, so test for false. If high is undefined,
				// we are at the last subrange. Index 0 is already handled.
				if ( low === false || high === undefined ) {
					return;
				}

				// Make sure step isn't 0, which would cause an infinite loop (#654)
				step = Math.max(step, 0.0000001);

				// Find all steps in the subrange.
				for ( i = low; i <= high; i = safeIncrement(i, step) ) {

					// Get the percentage value for the current step,
					// calculate the size for the subrange.
					newPct = scope_Spectrum.toStepping( i );
					pctDifference = newPct - prevPct;

					steps = pctDifference / density;
					realSteps = Math.round(steps);

					// This ratio represents the ammount of percentage-space a point indicates.
					// For a density 1 the points/percentage = 1. For density 2, that percentage needs to be re-devided.
					// Round the percentage offset to an even number, then divide by two
					// to spread the offset on both sides of the range.
					stepsize = pctDifference/realSteps;

					// Divide all points evenly, adding the correct number to this subrange.
					// Run up to <= so that 100% gets a point, event if ignoreLast is set.
					for ( q = 1; q <= realSteps; q += 1 ) {

						// The ratio between the rounded value and the actual size might be ~1% off.
						// Correct the percentage offset by the number of points
						// per subrange. density = 1 will result in 100 points on the
						// full range, 2 for 50, 4 for 25, etc.
						pctPos = prevPct + ( q * stepsize );
						indexes[pctPos.toFixed(5)] = ['x', 0];
					}

					// Determine the point type.
					type = (group.indexOf(i) > -1) ? 1 : ( mode === 'steps' ? 2 : 0 );

					// Enforce the 'ignoreFirst' option by overwriting the type for 0.
					if ( !index && ignoreFirst ) {
						type = 0;
					}

					if ( !(i === high && ignoreLast)) {
						// Mark the 'type' of this point. 0 = plain, 1 = real value, 2 = step value.
						indexes[newPct.toFixed(5)] = [i, type];
					}

					// Update the percentage count.
					prevPct = newPct;
				}
			});

			return indexes;
		}

		function addMarking ( spread, filterFunc, formatter ) {

			var element = scope_Document.createElement('div');

			var valueSizeClasses = [
				options.cssClasses.valueNormal,
				options.cssClasses.valueLarge,
				options.cssClasses.valueSub
			];
			var markerSizeClasses = [
				options.cssClasses.markerNormal,
				options.cssClasses.markerLarge,
				options.cssClasses.markerSub
			];
			var valueOrientationClasses = [
				options.cssClasses.valueHorizontal,
				options.cssClasses.valueVertical
			];
			var markerOrientationClasses = [
				options.cssClasses.markerHorizontal,
				options.cssClasses.markerVertical
			];

			addClass(element, options.cssClasses.pips);
			addClass(element, options.ort === 0 ? options.cssClasses.pipsHorizontal : options.cssClasses.pipsVertical);

			function getClasses( type, source ){
				var a = source === options.cssClasses.value;
				var orientationClasses = a ? valueOrientationClasses : markerOrientationClasses;
				var sizeClasses = a ? valueSizeClasses : markerSizeClasses;

				return source + ' ' + orientationClasses[options.ort] + ' ' + sizeClasses[type];
			}

			function addSpread ( offset, values ){

				// Apply the filter function, if it is set.
				values[1] = (values[1] && filterFunc) ? filterFunc(values[0], values[1]) : values[1];

				// Add a marker for every point
				var node = addNodeTo(element, false);
				node.className = getClasses(values[1], options.cssClasses.marker);
				node.style[options.style] = offset + '%';

				// Values are only appended for points marked '1' or '2'.
				if ( values[1] ) {
					node = addNodeTo(element, false);
					node.className = getClasses(values[1], options.cssClasses.value);
					node.style[options.style] = offset + '%';
					node.innerText = formatter.to(values[0]);
				}
			}

			// Append all points.
			Object.keys(spread).forEach(function(a){
				addSpread(a, spread[a]);
			});

			return element;
		}

		function removePips ( ) {
			if ( scope_Pips ) {
				removeElement(scope_Pips);
				scope_Pips = null;
			}
		}

		function pips ( grid ) {

			// Fix #669
			removePips();

			var mode = grid.mode;
			var density = grid.density || 1;
			var filter = grid.filter || false;
			var values = grid.values || false;
			var stepped = grid.stepped || false;
			var group = getGroup( mode, values, stepped );
			var spread = generateSpread( density, mode, group );
			var format = grid.format || {
					to: Math.round
				};

			scope_Pips = scope_Target.appendChild(addMarking(
				spread,
				filter,
				format
			));

			return scope_Pips;
		}


		// Shorthand for base dimensions.
		function baseSize ( ) {
			var rect = scope_Base.getBoundingClientRect(), alt = 'offset' + ['Width', 'Height'][options.ort];
			return options.ort === 0 ? (rect.width||scope_Base[alt]) : (rect.height||scope_Base[alt]);
		}

		// Handler for attaching events trough a proxy.
		function attachEvent ( events, element, callback, data ) {

			// This function can be used to 'filter' events to the slider.
			// element is a node, not a nodeList

			var method = function ( e ){

				if ( scope_Target.hasAttribute('disabled') ) {
					return false;
				}

				// Stop if an active 'tap' transition is taking place.
				if ( hasClass(scope_Target, options.cssClasses.tap) ) {
					return false;
				}

				e = fixEvent(e, data.pageOffset);

				// Handle reject of multitouch
				if ( !e ) {
					return false;
				}

				// Ignore right or middle clicks on start #454
				if ( events === actions.start && e.buttons !== undefined && e.buttons > 1 ) {
					return false;
				}

				// Ignore right or middle clicks on start #454
				if ( data.hover && e.buttons ) {
					return false;
				}

				// 'supportsPassive' is only true if a browser also supports touch-action: none in CSS.
				// iOS safari does not, so it doesn't get to benefit from passive scrolling. iOS does support
				// touch-action: manipulation, but that allows panning, which breaks
				// sliders after zooming/on non-responsive pages.
				// See: https://bugs.webkit.org/show_bug.cgi?id=133112
				if ( !supportsPassive ) {
					e.preventDefault();
				}

				e.calcPoint = e.points[ options.ort ];

				// Call the event handler with the event [ and additional data ].
				callback ( e, data );
			};

			var methods = [];

			// Bind a closure on the target for every event type.
			events.split(' ').forEach(function( eventName ){
				element.addEventListener(eventName, method, supportsPassive ? { passive: true } : false);
				methods.push([eventName, method]);
			});

			return methods;
		}

		// Provide a clean event with standardized offset values.
		function fixEvent ( e, pageOffset ) {

			// Filter the event to register the type, which can be
			// touch, mouse or pointer. Offset changes need to be
			// made on an event specific basis.
			var touch = e.type.indexOf('touch') === 0;
			var mouse = e.type.indexOf('mouse') === 0;
			var pointer = e.type.indexOf('pointer') === 0;

			var x;
			var y;

			// IE10 implemented pointer events with a prefix;
			if ( e.type.indexOf('MSPointer') === 0 ) {
				pointer = true;
			}

			if ( touch ) {

				// Fix bug when user touches with two or more fingers on mobile devices.
				// It's useful when you have two or more sliders on one page,
				// that can be touched simultaneously.
				// #649, #663, #668
				if ( e.touches.length > 1 ) {
					return false;
				}

				// noUiSlider supports one movement at a time,
				// so we can select the first 'changedTouch'.
				x = e.changedTouches[0].pageX;
				y = e.changedTouches[0].pageY;
			}

			pageOffset = pageOffset || getPageOffset(scope_Document);

			if ( mouse || pointer ) {
				x = e.clientX + pageOffset.x;
				y = e.clientY + pageOffset.y;
			}

			e.pageOffset = pageOffset;
			e.points = [x, y];
			e.cursor = mouse || pointer; // Fix #435

			return e;
		}

		// Translate a coordinate in the document to a percentage on the slider
		function calcPointToPercentage ( calcPoint ) {
			var location = calcPoint - offset(scope_Base, options.ort);
			var proposal = ( location * 100 ) / baseSize();
			return options.dir ? 100 - proposal : proposal;
		}

		// Find handle closest to a certain percentage on the slider
		function getClosestHandle ( proposal ) {

			var closest = 100;
			var handleNumber = false;

			scope_Handles.forEach(function(handle, index){

				// Disabled handles are ignored
				if ( handle.hasAttribute('disabled') ) {
					return;
				}

				var pos = Math.abs(scope_Locations[index] - proposal);

				if ( pos < closest ) {
					handleNumber = index;
					closest = pos;
				}
			});

			return handleNumber;
		}

		// Moves handle(s) by a percentage
		// (bool, % to move, [% where handle started, ...], [index in scope_Handles, ...])
		function moveHandles ( upward, proposal, locations, handleNumbers ) {

			var proposals = locations.slice();

			var b = [!upward, upward];
			var f = [upward, !upward];

			// Copy handleNumbers so we don't change the dataset
			handleNumbers = handleNumbers.slice();

			// Check to see which handle is 'leading'.
			// If that one can't move the second can't either.
			if ( upward ) {
				handleNumbers.reverse();
			}

			// Step 1: get the maximum percentage that any of the handles can move
			if ( handleNumbers.length > 1 ) {

				handleNumbers.forEach(function(handleNumber, o) {

					var to = checkHandlePosition(proposals, handleNumber, proposals[handleNumber] + proposal, b[o], f[o], false);

					// Stop if one of the handles can't move.
					if ( to === false ) {
						proposal = 0;
					} else {
						proposal = to - proposals[handleNumber];
						proposals[handleNumber] = to;
					}
				});
			}

			// If using one handle, check backward AND forward
			else {
				b = f = [true];
			}

			var state = false;

			// Step 2: Try to set the handles with the found percentage
			handleNumbers.forEach(function(handleNumber, o) {
				state = setHandle(handleNumber, locations[handleNumber] + proposal, b[o], f[o]) || state;
			});

			// Step 3: If a handle moved, fire events
			if ( state ) {
				handleNumbers.forEach(function(handleNumber){
					fireEvent('update', handleNumber);
					fireEvent('slide', handleNumber);
				});
			}
		}

		// External event handling
		function fireEvent ( eventName, handleNumber, tap ) {

			Object.keys(scope_Events).forEach(function( targetEvent ) {

				var eventType = targetEvent.split('.')[0];

				if ( eventName === eventType ) {
					scope_Events[targetEvent].forEach(function( callback ) {

						callback.call(
							// Use the slider public API as the scope ('this')
							scope_Self,
							// Return values as array, so arg_1[arg_2] is always valid.
							scope_Values.map(options.format.to),
							// Handle index, 0 or 1
							handleNumber,
							// Unformatted slider values
							scope_Values.slice(),
							// Event is fired by tap, true or false
							tap || false,
							// Left offset of the handle, in relation to the slider
							scope_Locations.slice()
						);
					});
				}
			});
		}


		// Fire 'end' when a mouse or pen leaves the document.
		function documentLeave ( event, data ) {
			if ( event.type === "mouseout" && event.target.nodeName === "HTML" && event.relatedTarget === null ){
				eventEnd (event, data);
			}
		}

		// Handle movement on document for handle and range drag.
		function eventMove ( event, data ) {

			// Fix #498
			// Check value of .buttons in 'start' to work around a bug in IE10 mobile (data.buttonsProperty).
			// https://connect.microsoft.com/IE/feedback/details/927005/mobile-ie10-windows-phone-buttons-property-of-pointermove-event-always-zero
			// IE9 has .buttons and .which zero on mousemove.
			// Firefox breaks the spec MDN defines.
			if ( navigator.appVersion.indexOf("MSIE 9") === -1 && event.buttons === 0 && data.buttonsProperty !== 0 ) {
				return eventEnd(event, data);
			}

			// Check if we are moving up or down
			var movement = (options.dir ? -1 : 1) * (event.calcPoint - data.startCalcPoint);

			// Convert the movement into a percentage of the slider width/height
			var proposal = (movement * 100) / data.baseSize;

			moveHandles(movement > 0, proposal, data.locations, data.handleNumbers);
		}

		// Unbind move events on document, call callbacks.
		function eventEnd ( event, data ) {

			// The handle is no longer active, so remove the class.
			if ( scope_ActiveHandle ) {
				removeClass(scope_ActiveHandle, options.cssClasses.active);
				scope_ActiveHandle = false;
			}

			// Remove cursor styles and text-selection events bound to the body.
			if ( event.cursor ) {
				scope_Body.style.cursor = '';
				scope_Body.removeEventListener('selectstart', preventDefault);
			}

			// Unbind the move and end events, which are added on 'start'.
			scope_Listeners.forEach(function( c ) {
				scope_DocumentElement.removeEventListener(c[0], c[1]);
			});

			// Remove dragging class.
			removeClass(scope_Target, options.cssClasses.drag);

			setZindex();

			data.handleNumbers.forEach(function(handleNumber){
				fireEvent('change', handleNumber);
				fireEvent('set', handleNumber);
				fireEvent('end', handleNumber);
			});
		}

		// Bind move events on document.
		function eventStart ( event, data ) {

			if ( data.handleNumbers.length === 1 ) {

				var handle = scope_Handles[data.handleNumbers[0]];

				// Ignore 'disabled' handles
				if ( handle.hasAttribute('disabled') ) {
					return false;
				}

				// Mark the handle as 'active' so it can be styled.
				scope_ActiveHandle = handle.children[0];
				addClass(scope_ActiveHandle, options.cssClasses.active);
			}

			// A drag should never propagate up to the 'tap' event.
			event.stopPropagation();

			// Attach the move and end events.
			var moveEvent = attachEvent(actions.move, scope_DocumentElement, eventMove, {
				startCalcPoint: event.calcPoint,
				baseSize: baseSize(),
				pageOffset: event.pageOffset,
				handleNumbers: data.handleNumbers,
				buttonsProperty: event.buttons,
				locations: scope_Locations.slice()
			});

			var endEvent = attachEvent(actions.end, scope_DocumentElement, eventEnd, {
				handleNumbers: data.handleNumbers
			});

			var outEvent = attachEvent("mouseout", scope_DocumentElement, documentLeave, {
				handleNumbers: data.handleNumbers
			});

			scope_Listeners = moveEvent.concat(endEvent, outEvent);

			// Text selection isn't an issue on touch devices,
			// so adding cursor styles can be skipped.
			if ( event.cursor ) {

				// Prevent the 'I' cursor and extend the range-drag cursor.
				scope_Body.style.cursor = getComputedStyle(event.target).cursor;

				// Mark the target with a dragging state.
				if ( scope_Handles.length > 1 ) {
					addClass(scope_Target, options.cssClasses.drag);
				}

				// Prevent text selection when dragging the handles.
				// In noUiSlider <= 9.2.0, this was handled by calling preventDefault on mouse/touch start/move,
				// which is scroll blocking. The selectstart event is supported by FireFox starting from version 52,
				// meaning the only holdout is iOS Safari. This doesn't matter: text selection isn't triggered there.
				// The 'cursor' flag is false.
				// See: http://caniuse.com/#search=selectstart
				scope_Body.addEventListener('selectstart', preventDefault, false);
			}

			data.handleNumbers.forEach(function(handleNumber){
				fireEvent('start', handleNumber);
			});
		}

		// Move closest handle to tapped location.
		function eventTap ( event ) {

			// The tap event shouldn't propagate up
			event.stopPropagation();

			var proposal = calcPointToPercentage(event.calcPoint);
			var handleNumber = getClosestHandle(proposal);

			// Tackle the case that all handles are 'disabled'.
			if ( handleNumber === false ) {
				return false;
			}

			// Flag the slider as it is now in a transitional state.
			// Transition takes a configurable amount of ms (default 300). Re-enable the slider after that.
			if ( !options.events.snap ) {
				addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
			}

			setHandle(handleNumber, proposal, true, true);

			setZindex();

			fireEvent('slide', handleNumber, true);
			fireEvent('update', handleNumber, true);
			fireEvent('change', handleNumber, true);
			fireEvent('set', handleNumber, true);

			if ( options.events.snap ) {
				eventStart(event, { handleNumbers: [handleNumber] });
			}
		}

		// Fires a 'hover' event for a hovered mouse/pen position.
		function eventHover ( event ) {

			var proposal = calcPointToPercentage(event.calcPoint);

			var to = scope_Spectrum.getStep(proposal);
			var value = scope_Spectrum.fromStepping(to);

			Object.keys(scope_Events).forEach(function( targetEvent ) {
				if ( 'hover' === targetEvent.split('.')[0] ) {
					scope_Events[targetEvent].forEach(function( callback ) {
						callback.call( scope_Self, value );
					});
				}
			});
		}

		// Attach events to several slider parts.
		function bindSliderEvents ( behaviour ) {

			// Attach the standard drag event to the handles.
			if ( !behaviour.fixed ) {

				scope_Handles.forEach(function( handle, index ){

					// These events are only bound to the visual handle
					// element, not the 'real' origin element.
					attachEvent ( actions.start, handle.children[0], eventStart, {
						handleNumbers: [index]
					});
				});
			}

			// Attach the tap event to the slider base.
			if ( behaviour.tap ) {
				attachEvent (actions.start, scope_Base, eventTap, {});
			}

			// Fire hover events
			if ( behaviour.hover ) {
				attachEvent (actions.move, scope_Base, eventHover, { hover: true });
			}

			// Make the range draggable.
			if ( behaviour.drag ){

				scope_Connects.forEach(function( connect, index ){

					if ( connect === false || index === 0 || index === scope_Connects.length - 1 ) {
						return;
					}

					var handleBefore = scope_Handles[index - 1];
					var handleAfter = scope_Handles[index];
					var eventHolders = [connect];

					addClass(connect, options.cssClasses.draggable);

					// When the range is fixed, the entire range can
					// be dragged by the handles. The handle in the first
					// origin will propagate the start event upward,
					// but it needs to be bound manually on the other.
					if ( behaviour.fixed ) {
						eventHolders.push(handleBefore.children[0]);
						eventHolders.push(handleAfter.children[0]);
					}

					eventHolders.forEach(function( eventHolder ) {
						attachEvent ( actions.start, eventHolder, eventStart, {
							handles: [handleBefore, handleAfter],
							handleNumbers: [index - 1, index]
						});
					});
				});
			}
		}


		// Split out the handle positioning logic so the Move event can use it, too
		function checkHandlePosition ( reference, handleNumber, to, lookBackward, lookForward, getValue ) {

			// For sliders with multiple handles, limit movement to the other handle.
			// Apply the margin option by adding it to the handle positions.
			if ( scope_Handles.length > 1 ) {

				if ( lookBackward && handleNumber > 0 ) {
					to = Math.max(to, reference[handleNumber - 1] + options.margin);
				}

				if ( lookForward && handleNumber < scope_Handles.length - 1 ) {
					to = Math.min(to, reference[handleNumber + 1] - options.margin);
				}
			}

			// The limit option has the opposite effect, limiting handles to a
			// maximum distance from another. Limit must be > 0, as otherwise
			// handles would be unmoveable.
			if ( scope_Handles.length > 1 && options.limit ) {

				if ( lookBackward && handleNumber > 0 ) {
					to = Math.min(to, reference[handleNumber - 1] + options.limit);
				}

				if ( lookForward && handleNumber < scope_Handles.length - 1 ) {
					to = Math.max(to, reference[handleNumber + 1] - options.limit);
				}
			}

			// The padding option keeps the handles a certain distance from the
			// edges of the slider. Padding must be > 0.
			if ( options.padding ) {

				if ( handleNumber === 0 ) {
					to = Math.max(to, options.padding);
				}

				if ( handleNumber === scope_Handles.length - 1 ) {
					to = Math.min(to, 100 - options.padding);
				}
			}

			to = scope_Spectrum.getStep(to);

			// Limit percentage to the 0 - 100 range
			to = limit(to);

			// Return false if handle can't move
			if ( to === reference[handleNumber] && !getValue ) {
				return false;
			}

			return to;
		}

		function toPct ( pct ) {
			return pct + '%';
		}

		// Updates scope_Locations and scope_Values, updates visual state
		function updateHandlePosition ( handleNumber, to ) {

			// Update locations.
			scope_Locations[handleNumber] = to;

			// Convert the value to the slider stepping/range.
			scope_Values[handleNumber] = scope_Spectrum.fromStepping(to);

			// Called synchronously or on the next animationFrame
			var stateUpdate = function() {
				scope_Handles[handleNumber].style[options.style] = toPct(to);
				updateConnect(handleNumber);
				updateConnect(handleNumber + 1);
			};

			// Set the handle to the new position.
			// Use requestAnimationFrame for efficient painting.
			// No significant effect in Chrome, Edge sees dramatic performace improvements.
			// Option to disable is useful for unit tests, and single-step debugging.
			if ( window.requestAnimationFrame && options.useRequestAnimationFrame ) {
				window.requestAnimationFrame(stateUpdate);
			} else {
				stateUpdate();
			}
		}

		function setZindex ( ) {

			scope_HandleNumbers.forEach(function(handleNumber){
				// Handles before the slider middle are stacked later = higher,
				// Handles after the middle later is lower
				// [[7] [8] .......... | .......... [5] [4]
				var dir = (scope_Locations[handleNumber] > 50 ? -1 : 1);
				var zIndex = 3 + (scope_Handles.length + (dir * handleNumber));
				scope_Handles[handleNumber].childNodes[0].style.zIndex = zIndex;
			});
		}

		// Test suggested values and apply margin, step.
		function setHandle ( handleNumber, to, lookBackward, lookForward ) {

			to = checkHandlePosition(scope_Locations, handleNumber, to, lookBackward, lookForward, false);

			if ( to === false ) {
				return false;
			}

			updateHandlePosition(handleNumber, to);

			return true;
		}

		// Updates style attribute for connect nodes
		function updateConnect ( index ) {

			// Skip connects set to false
			if ( !scope_Connects[index] ) {
				return;
			}

			var l = 0;
			var h = 100;

			if ( index !== 0 ) {
				l = scope_Locations[index - 1];
			}

			if ( index !== scope_Connects.length - 1 ) {
				h = scope_Locations[index];
			}

			scope_Connects[index].style[options.style] = toPct(l);
			scope_Connects[index].style[options.styleOposite] = toPct(100 - h);
		}

		// ...
		function setValue ( to, handleNumber ) {

			// Setting with null indicates an 'ignore'.
			// Inputting 'false' is invalid.
			if ( to === null || to === false ) {
				return;
			}

			// If a formatted number was passed, attemt to decode it.
			if ( typeof to === 'number' ) {
				to = String(to);
			}

			to = options.format.from(to);

			// Request an update for all links if the value was invalid.
			// Do so too if setting the handle fails.
			if ( to !== false && !isNaN(to) ) {
				setHandle(handleNumber, scope_Spectrum.toStepping(to), false, false);
			}
		}

		// Set the slider value.
		function valueSet ( input, fireSetEvent ) {

			var values = asArray(input);
			var isInit = scope_Locations[0] === undefined;

			// Event fires by default
			fireSetEvent = (fireSetEvent === undefined ? true : !!fireSetEvent);

			values.forEach(setValue);

			// Animation is optional.
			// Make sure the initial values were set before using animated placement.
			if ( options.animate && !isInit ) {
				addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
			}

			// Now that all base values are set, apply constraints
			scope_HandleNumbers.forEach(function(handleNumber){
				setHandle(handleNumber, scope_Locations[handleNumber], true, false);
			});

			setZindex();

			scope_HandleNumbers.forEach(function(handleNumber){

				fireEvent('update', handleNumber);

				// Fire the event only for handles that received a new value, as per #579
				if ( values[handleNumber] !== null && fireSetEvent ) {
					fireEvent('set', handleNumber);
				}
			});
		}

		// Reset slider to initial values
		function valueReset ( fireSetEvent ) {
			valueSet(options.start, fireSetEvent);
		}

		// Get the slider value.
		function valueGet ( ) {

			var values = scope_Values.map(options.format.to);

			// If only one handle is used, return a single value.
			if ( values.length === 1 ){
				return values[0];
			}

			return values;
		}

		// Removes classes from the root and empties it.
		function destroy ( ) {

			for ( var key in options.cssClasses ) {
				if ( !options.cssClasses.hasOwnProperty(key) ) { continue; }
				removeClass(scope_Target, options.cssClasses[key]);
			}

			while (scope_Target.firstChild) {
				scope_Target.removeChild(scope_Target.firstChild);
			}

			delete scope_Target.noUiSlider;
		}

		// Get the current step size for the slider.
		function getCurrentStep ( ) {

			// Check all locations, map them to their stepping point.
			// Get the step point, then find it in the input list.
			return scope_Locations.map(function( location, index ){

				var nearbySteps = scope_Spectrum.getNearbySteps( location );
				var value = scope_Values[index];
				var increment = nearbySteps.thisStep.step;
				var decrement = null;

				// If the next value in this step moves into the next step,
				// the increment is the start of the next step - the current value
				if ( increment !== false ) {
					if ( value + increment > nearbySteps.stepAfter.startValue ) {
						increment = nearbySteps.stepAfter.startValue - value;
					}
				}


				// If the value is beyond the starting point
				if ( value > nearbySteps.thisStep.startValue ) {
					decrement = nearbySteps.thisStep.step;
				}

				else if ( nearbySteps.stepBefore.step === false ) {
					decrement = false;
				}

				// If a handle is at the start of a step, it always steps back into the previous step first
				else {
					decrement = value - nearbySteps.stepBefore.highestStep;
				}


				// Now, if at the slider edges, there is not in/decrement
				if ( location === 100 ) {
					increment = null;
				}

				else if ( location === 0 ) {
					decrement = null;
				}

				// As per #391, the comparison for the decrement step can have some rounding issues.
				var stepDecimals = scope_Spectrum.countStepDecimals();

				// Round per #391
				if ( increment !== null && increment !== false ) {
					increment = Number(increment.toFixed(stepDecimals));
				}

				if ( decrement !== null && decrement !== false ) {
					decrement = Number(decrement.toFixed(stepDecimals));
				}

				return [decrement, increment];
			});
		}

		// Attach an event to this slider, possibly including a namespace
		function bindEvent ( namespacedEvent, callback ) {
			scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
			scope_Events[namespacedEvent].push(callback);

			// If the event bound is 'update,' fire it immediately for all handles.
			if ( namespacedEvent.split('.')[0] === 'update' ) {
				scope_Handles.forEach(function(a, index){
					fireEvent('update', index);
				});
			}
		}

		// Undo attachment of event
		function removeEvent ( namespacedEvent ) {

			var event = namespacedEvent && namespacedEvent.split('.')[0];
			var namespace = event && namespacedEvent.substring(event.length);

			Object.keys(scope_Events).forEach(function( bind ){

				var tEvent = bind.split('.')[0],
					tNamespace = bind.substring(tEvent.length);

				if ( (!event || event === tEvent) && (!namespace || namespace === tNamespace) ) {
					delete scope_Events[bind];
				}
			});
		}

		// Updateable: margin, limit, padding, step, range, animate, snap
		function updateOptions ( optionsToUpdate, fireSetEvent ) {

			// Spectrum is created using the range, snap, direction and step options.
			// 'snap' and 'step' can be updated.
			// If 'snap' and 'step' are not passed, they should remain unchanged.
			var v = valueGet();

			var updateAble = ['margin', 'limit', 'padding', 'range', 'animate', 'snap', 'step', 'format'];

			// Only change options that we're actually passed to update.
			updateAble.forEach(function(name){
				if ( optionsToUpdate[name] !== undefined ) {
					originalOptions[name] = optionsToUpdate[name];
				}
			});

			var newOptions = testOptions(originalOptions);

			// Load new options into the slider state
			updateAble.forEach(function(name){
				if ( optionsToUpdate[name] !== undefined ) {
					options[name] = newOptions[name];
				}
			});

			scope_Spectrum = newOptions.spectrum;

			// Limit, margin and padding depend on the spectrum but are stored outside of it. (#677)
			options.margin = newOptions.margin;
			options.limit = newOptions.limit;
			options.padding = newOptions.padding;

			// Update pips, removes existing.
			if ( options.pips ) {
				pips(options.pips);
			}

			// Invalidate the current positioning so valueSet forces an update.
			scope_Locations = [];
			valueSet(optionsToUpdate.start || v, fireSetEvent);
		}

		// Throw an error if the slider was already initialized.
		if ( scope_Target.noUiSlider ) {
			throw new Error("noUiSlider (" + VERSION + "): Slider was already initialized.");
		}

		// Create the base element, initialise HTML and set classes.
		// Add handles and connect elements.
		addSlider(scope_Target);
		addElements(options.connect, scope_Base);

		scope_Self = {
			destroy: destroy,
			steps: getCurrentStep,
			on: bindEvent,
			off: removeEvent,
			get: valueGet,
			set: valueSet,
			reset: valueReset,
			// Exposed for unit testing, don't use this in your application.
			__moveHandles: function(a, b, c) { moveHandles(a, b, scope_Locations, c); },
			options: originalOptions, // Issue #600, #678
			updateOptions: updateOptions,
			target: scope_Target, // Issue #597
			removePips: removePips,
			pips: pips // Issue #594
		};

		// Attach user events.
		bindSliderEvents(options.events);

		// Use the public value method to set the start values.
		valueSet(options.start);

		if ( options.pips ) {
			pips(options.pips);
		}

		if ( options.tooltips ) {
			tooltips();
		}

		aria();

		return scope_Self;

	}


	// Run the standard initializer
	function initialize ( target, originalOptions ) {

		if ( !target || !target.nodeName ) {
			throw new Error("noUiSlider (" + VERSION + "): create requires a single element, got: " + target);
		}

		// Test the options and create the slider environment;
		var options = testOptions( originalOptions, target );
		var api = closure( target, options, originalOptions );

		target.noUiSlider = api;

		return api;
	}

	// Use an object instead of a function for future expansibility;
	return {
		version: VERSION,
		create: initialize
	};

}));

/*! jquery.selectBoxIt - v3.8.1 - 2013-10-17
 * http://www.selectboxit.com
 * Copyright (c) 2013 Greg Franko; Licensed MIT*/

// Immediately-Invoked Function Expression (IIFE) [Ben Alman Blog Post](http://benalman.com/news/2010/11/immediately-invoked-function-expression/) that calls another IIFE that contains all of the plugin logic.  I used this pattern so that anyone viewing this code would not have to scroll to the bottom of the page to view the local parameters that were passed to the main IIFE.

;(function (selectBoxIt) {

    //ECMAScript 5 Strict Mode: [John Resig Blog Post](http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/)
    "use strict";

    // Calls the second IIFE and locally passes in the global jQuery, window, and document objects
    selectBoxIt(window.jQuery, window, document);

}

// Locally passes in `jQuery`, the `window` object, the `document` object, and an `undefined` variable.  The `jQuery`, `window` and `document` objects are passed in locally, to improve performance, since javascript first searches for a variable match within the local variables set before searching the global variables set.  All of the global variables are also passed in locally to be minifier friendly. `undefined` can be passed in locally, because it is not a reserved word in JavaScript.

(function ($, window, document, undefined) {

    // ECMAScript 5 Strict Mode: [John Resig Blog Post](http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/)
    "use strict";

    // Calling the jQueryUI Widget Factory Method
    $.widget("selectBox.selectBoxIt", {

        // Plugin version
        VERSION: "3.8.1",

        // These options will be used as defaults
        options: {

            // **showEffect**: Accepts String: "none", "fadeIn", "show", "slideDown", or any of the jQueryUI show effects (i.e. "bounce")
            "showEffect": "none",

            // **showEffectOptions**: Accepts an object literal.  All of the available properties are based on the jqueryUI effect options
            "showEffectOptions": {},

            // **showEffectSpeed**: Accepts Number (milliseconds) or String: "slow", "medium", or "fast"
            "showEffectSpeed": "medium",

            // **hideEffect**: Accepts String: "none", "fadeOut", "hide", "slideUp", or any of the jQueryUI hide effects (i.e. "explode")
            "hideEffect": "none",

            // **hideEffectOptions**: Accepts an object literal.  All of the available properties are based on the jqueryUI effect options
            "hideEffectOptions": {},

            // **hideEffectSpeed**: Accepts Number (milliseconds) or String: "slow", "medium", or "fast"
            "hideEffectSpeed": "medium",

            // **showFirstOption**: Shows the first dropdown list option within the dropdown list options list
            "showFirstOption": true,

            // **defaultText**: Overrides the text used by the dropdown list selected option to allow a user to specify custom text.  Accepts a String.
            "defaultText": "",

            // **defaultIcon**: Overrides the icon used by the dropdown list selected option to allow a user to specify a custom icon.  Accepts a String (CSS class name(s)).
            "defaultIcon": "",

            // **downArrowIcon**: Overrides the default down arrow used by the dropdown list to allow a user to specify a custom image.  Accepts a String (CSS class name(s)).
            "downArrowIcon": "",

            // **theme**: Provides theming support for Twitter Bootstrap and jQueryUI
            "theme": "default",

            // **keydownOpen**: Opens the dropdown if the up or down key is pressed when the dropdown is focused
            "keydownOpen": true,

            // **isMobile**: Function to determine if a user's browser is a mobile browser
            "isMobile": function () {

                // Adapted from http://www.detectmobilebrowsers.com
                var ua = navigator.userAgent || navigator.vendor || window.opera;

                // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
                return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);

            },

            // **native**: Triggers the native select box when a user interacts with the drop down
            "native": false,

            // **aggressiveChange**: Will select a drop down item (and trigger a change event) when a user navigates to the item via the keyboard (up and down arrow or search), before a user selects an option with a click or the enter key
            "aggressiveChange": false,

            // **selectWhenHidden: Will allow a user to select an option using the keyboard when the drop down list is hidden and focused
            "selectWhenHidden": true,

            // **viewport**: Allows for a custom domnode used for the viewport. Accepts a selector.  Default is $(window).
            "viewport": $(window),

            // **similarSearch**: Optimizes the search for lists with many similar values (i.e. State lists) by making it easier to navigate through
            "similarSearch": false,

            // **copyAttributes**: HTML attributes that will be copied over to the new drop down
            "copyAttributes": [

                "title",

                "rel"

            ],

            // **copyClasses**: HTML classes that will be copied over to the new drop down.  The value indicates where the classes should be copied.  The default value is 'button', but you can also use 'container' (recommended) or 'none'.
            "copyClasses": "button",

            // **nativeMousedown**: Mimics native firefox drop down behavior by opening the drop down on mousedown and selecting the currently hovered drop down option on mouseup
            "nativeMousedown": false,

            // **customShowHideEvent**: Prevents the drop down from opening on click or mousedown, which allows a user to open/close the drop down with a custom event handler.
            "customShowHideEvent": false,

            // **autoWidth**: Makes sure the width of the drop down is wide enough to fit all of the drop down options
            "autoWidth": true,

            // **html**: Determines whether or not option text is rendered as html or as text
            "html": true,

            // **populate**: Convenience option that accepts JSON data, an array, a single object, or valid HTML string to add options to the drop down list
            "populate": "",

            // **dynamicPositioning**: Determines whether or not the drop down list should fit inside it's viewport
            "dynamicPositioning": true,

            // **hideCurrent**: Determines whether or not the currently selected drop down option is hidden in the list
            "hideCurrent": false

        },

        // Get Themes
        // ----------
        //      Retrieves the active drop down theme and returns the theme object
        "getThemes": function () {

            var self = this,
                theme = $(self.element).attr("data-theme") || "c";

            return {

                // Twitter Bootstrap Theme
                "bootstrap": {

                    "focus": "active",

                    "hover": "",

                    "enabled": "enabled",

                    "disabled": "disabled",

                    "arrow": "caret",

                    "button": "btn",

                    "list": "dropdown-menu",

                    "container": "bootstrap",

                    "open": "open"

                },

                // jQueryUI Theme
                "jqueryui": {

                    "focus": "ui-state-focus",

                    "hover": "ui-state-hover",

                    "enabled": "ui-state-enabled",

                    "disabled": "ui-state-disabled",

                    "arrow": "ui-icon ui-icon-triangle-1-s",

                    "button": "ui-widget ui-state-default",

                    "list": "ui-widget ui-widget-content",

                    "container": "jqueryui",

                    "open": "selectboxit-open"

                },

                // jQuery Mobile Theme
                "jquerymobile": {

                    "focus": "ui-btn-down-" + theme,

                    "hover": "ui-btn-hover-" + theme,

                    "enabled": "ui-enabled",

                    "disabled": "ui-disabled",

                    "arrow": "ui-icon ui-icon-arrow-d ui-icon-shadow",

                    "button": "ui-btn ui-btn-icon-right ui-btn-corner-all ui-shadow ui-btn-up-" + theme,

                    "list": "ui-btn ui-btn-icon-right ui-btn-corner-all ui-shadow ui-btn-up-" + theme,

                    "container": "jquerymobile",

                    "open": "selectboxit-open"

                },

                "default": {

                    "focus": "selectboxit-focus",

                    "hover": "selectboxit-hover",

                    "enabled": "selectboxit-enabled",

                    "disabled": "selectboxit-disabled",

                    "arrow": "selectboxit-default-arrow",

                    "button": "selectboxit-btn",

                    "list": "selectboxit-list",

                    "container": "selectboxit-container",

                    "open": "selectboxit-open"

                }

            };

        },

        // isDeferred
        // ----------
        //      Checks if parameter is a defered object      
        isDeferred: function (def) {
            return $.isPlainObject(def) && def.promise && def.done;
        },

        // _Create
        // -------
        //      Sets the Plugin Instance variables and
        //      constructs the plugin.  Only called once.
        _create: function (internal) {

            var self = this,
                populateOption = self.options["populate"],
                userTheme = self.options["theme"];

            // If the element calling SelectBoxIt is not a select box or is not visible
            if (!self.element.is("select")) {

                // Exits the plugin
                return;

            }

            // Stores a reference to the parent Widget class
            self.widgetProto = $.Widget.prototype;

            // The original select box DOM element
            self.originalElem = self.element[0];

            // The original select box DOM element wrapped in a jQuery object
            self.selectBox = self.element;

            if (self.options["populate"] && self.add && !internal) {

                self.add(populateOption);

            }

            // All of the original select box options
            self.selectItems = self.element.find("option");

            // The first option in the original select box
            self.firstSelectItem = self.selectItems.slice(0, 1);

            // The html document height
            self.documentHeight = $(document).height();

            self.theme = $.isPlainObject(userTheme) ? $.extend({}, self.getThemes()["default"], userTheme) : self.getThemes()[userTheme] ? self.getThemes()[userTheme] : self.getThemes()["default"];

            // The index of the currently selected dropdown list option
            self.currentFocus = 0;

            // Keeps track of which blur events will hide the dropdown list options
            self.blur = true;

            // Array holding all of the original select box options text
            self.textArray = [];

            // Maintains search order in the `search` method
            self.currentIndex = 0;

            // Maintains the current search text in the `search` method
            self.currentText = "";

            // Whether or not the dropdown list opens up or down (depending on how much room is on the page)
            self.flipped = false;

            // If the create method is not called internally by the plugin
            if (!internal) {

                // Saves the original select box `style` attribute within the `selectBoxStyles` plugin instance property
                self.selectBoxStyles = self.selectBox.attr("style");

            }

            // Creates the dropdown elements that will become the dropdown
            // Creates the ul element that will become the dropdown options list
            // Add's all attributes (excluding id, class names, and unselectable properties) to the drop down and drop down items list
            // Hides the original select box and adds the new plugin DOM elements to the page
            // Adds event handlers to the new dropdown list
            self._createDropdownButton()._createUnorderedList()._copyAttributes()._replaceSelectBox()._addClasses(self.theme)._eventHandlers();

            if (self.originalElem.disabled && self.disable) {

                // Disables the dropdown list if the original dropdown list had the `disabled` attribute
                self.disable();

            }

            // If the Aria Accessibility Module has been included
            if (self._ariaAccessibility) {

                // Adds ARIA accessibillity tags to the dropdown list
                self._ariaAccessibility();

            }

            self.isMobile = self.options["isMobile"]();

            if (self._mobile) {

                // Adds mobile support
                self._mobile();

            }

            // If the native option is set to true
            if (self.options["native"]) {

                // Triggers the native select box when a user is interacting with the drop down
                this._applyNativeSelect();

            }

            // Triggers a custom `create` event on the original dropdown list
            self.triggerEvent("create");

            // Maintains chainability
            return self;

        },

        // _Create dropdown button
        // -----------------------
        //      Creates new dropdown and dropdown elements to replace
        //      the original select box with a dropdown list
        _createDropdownButton: function () {

            var self = this,
                originalElemId = self.originalElemId = self.originalElem.id || "",
                originalElemValue = self.originalElemValue = self.originalElem.value || "",
                originalElemName = self.originalElemName = self.originalElem.name || "",
                copyClasses = self.options["copyClasses"],
                selectboxClasses = self.selectBox.attr("class") || "";

            // Creates a dropdown element that contains the dropdown list text value
            self.dropdownText = $("<span/>", {

                // Dynamically sets the dropdown `id` attribute
                "id": originalElemId && originalElemId + "SelectBoxItText",

                "class": "selectboxit-text",

                // IE specific attribute to not allow the element to be selected
                "unselectable": "on",

                // Sets the dropdown `text` to equal the original select box default value
                "text": self.firstSelectItem.text()

            }).// Sets the HTML5 data attribute on the dropdownText `dropdown` element
            attr("data-val", originalElemValue);

            self.dropdownImageContainer = $("<span/>", {

                "class": "selectboxit-option-icon-container"

            });

            // Creates a dropdown element that contains the dropdown list text value
            self.dropdownImage = $("<i/>", {

                // Dynamically sets the dropdown `id` attribute
                "id": originalElemId && originalElemId + "SelectBoxItDefaultIcon",

                "class": "selectboxit-default-icon",

                // IE specific attribute to not allow the element to be selected
                "unselectable": "on"

            });

            // Creates a dropdown to act as the new dropdown list
            self.dropdown = $("<span/>", {

                // Dynamically sets the dropdown `id` attribute
                "id": originalElemId && originalElemId + "SelectBoxIt",

                "class": "selectboxit " + (copyClasses === "button" ? selectboxClasses : "") + " " + (self.selectBox.prop("disabled") ? self.theme["disabled"] : self.theme["enabled"]),

                // Sets the dropdown `name` attribute to be the same name as the original select box
                "name": originalElemName,

                // Sets the dropdown `tabindex` attribute to 0 to allow the dropdown to be focusable
                "tabindex": self.selectBox.attr("tabindex") || "0",

                // IE specific attribute to not allow the element to be selected
                "unselectable": "on"

            }).// Appends the default text to the inner dropdown list dropdown element
            append(self.dropdownImageContainer.append(self.dropdownImage)).append(self.dropdownText);

            // Create the dropdown container that will hold all of the dropdown list dom elements
            self.dropdownContainer = $("<span/>", {

                "id": originalElemId && originalElemId + "SelectBoxItContainer",

                "class": 'selectboxit-container ' + self.theme.container + ' ' + (copyClasses === "container" ? selectboxClasses : "")

            }).// Appends the inner dropdown list dropdown element to the dropdown list container dropdown element
            append(self.dropdown);

            // Maintains chainability
            return self;

        },

        // _Create Unordered List
        // ----------------------
        //      Creates an unordered list element to hold the
        //        new dropdown list options that directly match
        //        the values of the original select box options
        _createUnorderedList: function () {

            // Storing the context of the widget
            var self = this,

                dataDisabled,

                optgroupClass,

                optgroupElement,

                iconClass,

                iconUrl,

                iconUrlClass,

                iconUrlStyle,

            // Declaring the variable that will hold all of the dropdown list option elements
                currentItem = "",

                originalElemId = self.originalElemId || "",

            // Creates an unordered list element
                createdList = $("<ul/>", {

                    // Sets the unordered list `id` attribute
                    "id": originalElemId && originalElemId + "SelectBoxItOptions",

                    "class": "selectboxit-options",

                    //Sets the unordered list `tabindex` attribute to -1 to prevent the unordered list from being focusable
                    "tabindex": -1

                }),

                currentDataSelectedText,

                currentDataText,

                currentDataSearch,

                currentText,

                currentOption,

                parent;

            // Checks the `showFirstOption` plugin option to determine if the first dropdown list option should be shown in the options list.
            if (!self.options["showFirstOption"]) {

                // Disables the first select box option
                self.selectItems.first().attr("disabled", "disabled");

                // Excludes the first dropdown list option from the options list
                self.selectItems = self.selectBox.find("option").slice(1);

            }

            // Loops through the original select box options list and copies the text of each
            // into new list item elements of the new dropdown list
            self.selectItems.each(function (index) {

                currentOption = $(this);

                optgroupClass = "";

                optgroupElement = "";

                dataDisabled = currentOption.prop("disabled");

                iconClass = currentOption.attr("data-icon") || "";

                iconUrl = currentOption.attr("data-iconurl") || "";

                iconUrlClass = iconUrl ? "selectboxit-option-icon-url" : "";

                iconUrlStyle = iconUrl ? 'style="background-image:url(\'' + iconUrl + '\');"' : "";

                currentDataSelectedText = currentOption.attr("data-selectedtext");

                currentDataText = currentOption.attr("data-text");

                currentText = currentDataText ? currentDataText : currentOption.text();

                parent = currentOption.parent();

                // If the current option being traversed is within an optgroup

                if (parent.is("optgroup")) {

                    optgroupClass = "selectboxit-optgroup-option";

                    if (currentOption.index() === 0) {

                        optgroupElement = '<span class="selectboxit-optgroup-header ' + parent.first().attr("class") + '"data-disabled="true">' + parent.first().attr("label") + '</span>';

                    }

                }

                currentOption.attr("value", this.value);

                // Uses string concatenation for speed (applies HTML attribute encoding)
                currentItem += optgroupElement + '<li data-id="' + index + '" data-val="' + this.value + '" data-disabled="' + dataDisabled + '" class="' + optgroupClass + " selectboxit-option " + ($(this).attr("class") || "") + '"><a class="selectboxit-option-anchor"><span class="selectboxit-option-icon-container"><i class="selectboxit-option-icon ' + iconClass + ' ' + (iconUrlClass || self.theme["container"]) + '"' + iconUrlStyle + '></i></span>' + (self.options["html"] ? currentText : self.htmlEscape(currentText)) + '</a></li>';

                currentDataSearch = currentOption.attr("data-search");

                // Stores all of the original select box options text inside of an array
                // (Used later in the `searchAlgorithm` method)
                self.textArray[index] = dataDisabled ? "" : currentDataSearch ? currentDataSearch : currentText;

                // Checks the original select box option for the `selected` attribute
                if (this.selected) {

                    // Replaces the default text with the selected option text
                    self._setText(self.dropdownText, currentDataSelectedText || currentText);

                    //Set the currently selected option
                    self.currentFocus = index;

                }

            });

            // If the `defaultText` option is being used
            if ((self.options["defaultText"] || self.selectBox.attr("data-text"))) {

                var defaultedText = self.options["defaultText"] || self.selectBox.attr("data-text");

                // Overrides the current dropdown default text with the value the user specifies in the `defaultText` option
                self._setText(self.dropdownText, defaultedText);

                self.options["defaultText"] = defaultedText;

            }

            // Append the list item to the unordered list
            createdList.append(currentItem);

            // Stores the dropdown list options list inside of the `list` instance variable
            self.list = createdList;

            // Append the dropdown list options list to the dropdown container element
            self.dropdownContainer.append(self.list);

            // Stores the individual dropdown list options inside of the `listItems` instance variable
            self.listItems = self.list.children("li");

            self.listAnchors = self.list.find("a");

            // Sets the 'selectboxit-option-first' class name on the first drop down option
            self.listItems.first().addClass("selectboxit-option-first");

            // Sets the 'selectboxit-option-last' class name on the last drop down option
            self.listItems.last().addClass("selectboxit-option-last");

            // Set the disabled CSS class for select box options
            self.list.find("li[data-disabled='true']").not(".optgroupHeader").addClass(self.theme["disabled"]);

            self.dropdownImage.addClass(self.selectBox.attr("data-icon") || self.options["defaultIcon"] || self.listItems.eq(self.currentFocus).find("i").attr("class"));

            self.dropdownImage.attr("style", self.listItems.eq(self.currentFocus).find("i").attr("style"));

            //Maintains chainability
            return self;

        },

        // _Replace Select Box
        // -------------------
        //      Hides the original dropdown list and inserts
        //        the new DOM elements
        _replaceSelectBox: function () {

            var self = this,
                height,
                originalElemId = self.originalElem.id || "",
                size = self.selectBox.attr("data-size"),
                listSize = self.listSize = size === undefined ? "auto" : size === "0" || "size" === "auto" ? "auto" : +size,
                downArrowContainerWidth,
                dropdownImageWidth;

            // Hides the original select box
            self.selectBox.css("display", "none").// Adds the new dropdown list to the page directly after the hidden original select box element
            after(self.dropdownContainer);

            self.dropdownContainer.appendTo('body').addClass('selectboxit-rendering');

            // The height of the dropdown list
            height = self.dropdown.height();

            // The down arrow element of the dropdown list
            self.downArrow = $("<i/>", {

                // Dynamically sets the dropdown `id` attribute of the dropdown list down arrow
                "id": originalElemId && originalElemId + "SelectBoxItArrow",

                "class": "selectboxit-arrow",

                // IE specific attribute to not allow the dropdown list text to be selected
                "unselectable": "on"

            });

            // The down arrow container element of the dropdown list
            self.downArrowContainer = $("<span/>", {

                // Dynamically sets the dropdown `id` attribute for the down arrow container element
                "id": originalElemId && originalElemId + "SelectBoxItArrowContainer",

                "class": "selectboxit-arrow-container",

                // IE specific attribute to not allow the dropdown list text to be selected
                "unselectable": "on"

            }).// Inserts the down arrow element inside of the down arrow container element
            append(self.downArrow);

            // Appends the down arrow element to the dropdown list
            self.dropdown.append(self.downArrowContainer);

            // Adds the `selectboxit-selected` class name to the currently selected drop down option
            self.listItems.removeClass("selectboxit-selected").eq(self.currentFocus).addClass("selectboxit-selected");

            // The full outer width of the down arrow container
            downArrowContainerWidth = self.downArrowContainer.outerWidth(true);

            // The full outer width of the dropdown image
            dropdownImageWidth = self.dropdownImage.outerWidth(true);

            // If the `autoWidth` option is true
            if (self.options["autoWidth"]) {

                // Sets the auto width of the drop down
                self.dropdown.css({"width": "auto"}).css({

                    "width": self.list.outerWidth(true) + downArrowContainerWidth + dropdownImageWidth

                });

                self.list.css({

                    "min-width": self.dropdown.width()

                });

            }

            // Dynamically adds the `max-width` and `line-height` CSS styles of the dropdown list text element
            self.dropdownText.css({

                "max-width": self.dropdownContainer.outerWidth(true) - (downArrowContainerWidth + dropdownImageWidth)

            });

            // Adds the new dropdown list to the page directly after the hidden original select box element
            self.selectBox.after(self.dropdownContainer);

            self.dropdownContainer.removeClass('selectboxit-rendering');

            if ($.type(listSize) === "number") {

                // Stores the new `max-height` for later
                self.maxHeight = self.listAnchors.outerHeight(true) * listSize;

            }

            // Maintains chainability
            return self;

        },

        // _Scroll-To-View
        // ---------------
        //      Updates the dropdown list scrollTop value
        _scrollToView: function (type) {

            var self = this,

                currentOption = self.listItems.eq(self.currentFocus),

            // The current scroll positioning of the dropdown list options list
                listScrollTop = self.list.scrollTop(),

            // The height of the currently selected dropdown list option
                currentItemHeight = currentOption.height(),

            // The relative distance from the currently selected dropdown list option to the the top of the dropdown list options list
                currentTopPosition = currentOption.position().top,

                absCurrentTopPosition = Math.abs(currentTopPosition),

            // The height of the dropdown list option list
                listHeight = self.list.height(),

                currentText;

            // Scrolling logic for a text search
            if (type === "search") {

                // Increases the dropdown list options `scrollTop` if a user is searching for an option
                // below the currently selected option that is not visible
                if (listHeight - currentTopPosition < currentItemHeight) {

                    // The selected option will be shown at the very bottom of the visible options list
                    self.list.scrollTop(listScrollTop + (currentTopPosition - (listHeight - currentItemHeight)));

                }

                // Decreases the dropdown list options `scrollTop` if a user is searching for an option above the currently selected option that is not visible
                else if (currentTopPosition < -1) {

                    self.list.scrollTop(currentTopPosition - currentItemHeight);

                }
            }

            // Scrolling logic for the `up` keyboard navigation
            else if (type === "up") {

                // Decreases the dropdown list option list `scrollTop` if a user is navigating to an element that is not visible
                if (currentTopPosition < -1) {

                    self.list.scrollTop(listScrollTop - absCurrentTopPosition);

                }
            }

            // Scrolling logic for the `down` keyboard navigation
            else if (type === "down") {

                // Increases the dropdown list options `scrollTop` if a user is navigating to an element that is not fully visible
                if (listHeight - currentTopPosition < currentItemHeight) {

                    // Increases the dropdown list options `scrollTop` by the height of the current option item.
                    self.list.scrollTop((listScrollTop + (absCurrentTopPosition - listHeight + currentItemHeight)));

                }
            }

            // Maintains chainability
            return self;

        },

        // _Callback
        // ---------
        //      Call the function passed into the method
        _callbackSupport: function (callback) {

            var self = this;

            // Checks to make sure the parameter passed in is a function
            if ($.isFunction(callback)) {

                // Calls the method passed in as a parameter and sets the current `SelectBoxIt` object that is stored in the jQuery data method as the context(allows for `this` to reference the SelectBoxIt API Methods in the callback function. The `dropdown` DOM element that acts as the new dropdown list is also passed as the only parameter to the callback
                callback.call(self, self.dropdown);

            }

            // Maintains chainability
            return self;

        },

        // _setText
        // --------
        //      Set's the text or html for the drop down
        _setText: function (elem, currentText) {

            var self = this;

            if (self.options["html"]) {

                elem.html(currentText);

            }

            else {

                elem.text(currentText);

            }

            return self;

        },

        // Open
        // ----
        //      Opens the dropdown list options list
        open: function (callback) {

            var self = this,
                showEffect = self.options["showEffect"],
                showEffectSpeed = self.options["showEffectSpeed"],
                showEffectOptions = self.options["showEffectOptions"],
                isNative = self.options["native"],
                isMobile = self.isMobile;

            // If there are no select box options, do not try to open the select box
            if (!self.listItems.length || self.dropdown.hasClass(self.theme["disabled"])) {

                return self;

            }

            // If the new drop down is being used and is not visible
            if ((!isNative && !isMobile) && !this.list.is(":visible")) {

                // Triggers a custom "open" event on the original select box
                self.triggerEvent("open");

                if (self._dynamicPositioning && self.options["dynamicPositioning"]) {

                    // Dynamically positions the dropdown list options list
                    self._dynamicPositioning();

                }

                // Uses `no effect`
                if (showEffect === "none") {

                    // Does not require a callback function because this animation will complete before the call to `scrollToView`
                    self.list.show();

                }

                // Uses the jQuery `show` special effect
                else if (showEffect === "show" || showEffect === "slideDown" || showEffect === "fadeIn") {

                    // Requires a callback function to determine when the `show` animation is complete
                    self.list[showEffect](showEffectSpeed);

                }

                // If none of the above options were passed, then a `jqueryUI show effect` is expected
                else {

                    // Allows for custom show effects via the [jQueryUI core effects](http://http://jqueryui.com/demos/show/)
                    self.list.show(showEffect, showEffectOptions, showEffectSpeed);

                }

                self.list.promise().done(function () {

                    // Updates the list `scrollTop` attribute
                    self._scrollToView("search");

                    // Triggers a custom "opened" event when the drop down list is done animating
                    self.triggerEvent("opened");

                });

            }

            // Provide callback function support
            self._callbackSupport(callback);

            // Maintains chainability
            return self;

        },

        // Close
        // -----
        //      Closes the dropdown list options list
        close: function (callback) {

            var self = this,
                hideEffect = self.options["hideEffect"],
                hideEffectSpeed = self.options["hideEffectSpeed"],
                hideEffectOptions = self.options["hideEffectOptions"],
                isNative = self.options["native"],
                isMobile = self.isMobile;

            // If the drop down is being used and is visible
            if ((!isNative && !isMobile) && self.list.is(":visible")) {

                // Triggers a custom "close" event on the original select box
                self.triggerEvent("close");

                // Uses `no effect`
                if (hideEffect === "none") {

                    // Does not require a callback function because this animation will complete before the call to `scrollToView`
                    self.list.hide();

                }

                // Uses the jQuery `hide` special effect
                else if (hideEffect === "hide" || hideEffect === "slideUp" || hideEffect === "fadeOut") {

                    self.list[hideEffect](hideEffectSpeed);

                }

                // If none of the above options were passed, then a `jqueryUI hide effect` is expected
                else {

                    // Allows for custom hide effects via the [jQueryUI core effects](http://http://jqueryui.com/demos/hide/)
                    self.list.hide(hideEffect, hideEffectOptions, hideEffectSpeed);

                }

                // After the drop down list is done animating
                self.list.promise().done(function () {

                    // Triggers a custom "closed" event when the drop down list is done animating
                    self.triggerEvent("closed");

                });

            }

            // Provide callback function support
            self._callbackSupport(callback);

            // Maintains chainability
            return self;

        },

        toggle: function () {

            var self = this,
                listIsVisible = self.list.is(":visible");

            if (listIsVisible) {

                self.close();

            }

            else if (!listIsVisible) {

                self.open();

            }

        },

        // _Key Mappings
        // -------------
        //      Object literal holding the string representation of each key code
        _keyMappings: {

            "38": "up",

            "40": "down",

            "13": "enter",

            "8": "backspace",

            "9": "tab",

            "32": "space",

            "27": "esc"

        },

        // _Key Down Methods
        // -----------------
        //      Methods to use when the keydown event is triggered
        _keydownMethods: function () {

            var self = this,
                moveToOption = self.list.is(":visible") || !self.options["keydownOpen"];

            return {

                "down": function () {

                    // If the plugin options allow keyboard navigation
                    if (self.moveDown && moveToOption) {

                        self.moveDown();

                    }

                },

                "up": function () {

                    // If the plugin options allow keyboard navigation
                    if (self.moveUp && moveToOption) {

                        self.moveUp();

                    }

                },

                "enter": function () {

                    var activeElem = self.listItems.eq(self.currentFocus);

                    // Updates the dropdown list value
                    self._update(activeElem);

                    if (activeElem.attr("data-preventclose") !== "true") {

                        // Closes the drop down list options list
                        self.close();

                    }

                    // Triggers the `enter` events on the original select box
                    self.triggerEvent("enter");

                },

                "tab": function () {

                    // Triggers the custom `tab-blur` event on the original select box
                    self.triggerEvent("tab-blur");

                    // Closes the drop down list
                    self.close();

                },

                "backspace": function () {

                    // Triggers the custom `backspace` event on the original select box
                    self.triggerEvent("backspace");

                },

                "esc": function () {

                    // Closes the dropdown options list
                    self.close();

                }

            };

        },


        // _Event Handlers
        // ---------------
        //      Adds event handlers to the new dropdown and the original select box
        _eventHandlers: function () {

            // LOCAL VARIABLES
            var self = this,
                nativeMousedown = self.options["nativeMousedown"],
                customShowHideEvent = self.options["customShowHideEvent"],
                currentDataText,
                currentText,
                focusClass = self.focusClass,
                hoverClass = self.hoverClass,
                openClass = self.openClass;

            // Select Box events
            this.dropdown.on({

                // `click` event with the `selectBoxIt` namespace
                "click.selectBoxIt": function () {

                    // Used to make sure the dropdown becomes focused (fixes IE issue)
                    self.dropdown.trigger("focus", true);

                    // The `click` handler logic will only be applied if the dropdown list is enabled
                    if (!self.originalElem.disabled) {

                        // Triggers the `click` event on the original select box
                        self.triggerEvent("click");

                        if (!nativeMousedown && !customShowHideEvent) {

                            self.toggle();

                        }

                    }

                },

                // `mousedown` event with the `selectBoxIt` namespace
                "mousedown.selectBoxIt": function () {

                    // Stores data in the jQuery `data` method to help determine if the dropdown list gains focus from a click or tabstop.  The mousedown event fires before the focus event.
                    $(this).data("mdown", true);

                    self.triggerEvent("mousedown");

                    if (nativeMousedown && !customShowHideEvent) {

                        self.toggle();

                    }

                },

                // `mouseup` event with the `selectBoxIt` namespace
                "mouseup.selectBoxIt": function () {

                    self.triggerEvent("mouseup");

                },

                // `blur` event with the `selectBoxIt` namespace.  Uses special blur logic to make sure the dropdown list closes correctly
                "blur.selectBoxIt": function () {

                    // If `self.blur` property is true
                    if (self.blur) {

                        // Triggers both the `blur` and `focusout` events on the original select box.
                        // The `focusout` event is also triggered because the event bubbles
                        // This event has to be used when using event delegation (such as the jQuery `delegate` or `on` methods)
                        // Popular open source projects such as Backbone.js utilize event delegation to bind events, so if you are using Backbone.js, use the `focusout` event instead of the `blur` event
                        self.triggerEvent("blur");

                        // Closes the dropdown list options list
                        self.close();

                        $(this).removeClass(focusClass);

                    }

                },

                "focus.selectBoxIt": function (event, internal) {

                    // Stores the data associated with the mousedown event inside of a local variable
                    var mdown = $(this).data("mdown");

                    // Removes the jQuery data associated with the mousedown event
                    $(this).removeData("mdown");

                    // If a mousedown event did not occur and no data was passed to the focus event (this correctly triggers the focus event), then the dropdown list gained focus from a tabstop
                    if (!mdown && !internal) {

                        setTimeout(function () {

                            // Triggers the `tabFocus` custom event on the original select box
                            self.triggerEvent("tab-focus");

                        }, 0);

                    }

                    // Only trigger the `focus` event on the original select box if the dropdown list is hidden (this verifies that only the correct `focus` events are used to trigger the event on the original select box
                    if (!internal) {

                        if (!$(this).hasClass(self.theme["disabled"])) {

                            $(this).addClass(focusClass);

                        }

                        //Triggers the `focus` default event on the original select box
                        self.triggerEvent("focus");

                    }

                },

                // `keydown` event with the `selectBoxIt` namespace.  Catches all user keyboard navigations
                "keydown.selectBoxIt": function (e) {

                    // Stores the `keycode` value in a local variable
                    var currentKey = self._keyMappings[e.keyCode],

                        keydownMethod = self._keydownMethods()[currentKey];

                    if (keydownMethod) {

                        keydownMethod();

                        if (self.options["keydownOpen"] && (currentKey === "up" || currentKey === "down")) {

                            self.open();

                        }

                    }

                    if (keydownMethod && currentKey !== "tab") {

                        e.preventDefault();

                    }

                },

                // `keypress` event with the `selectBoxIt` namespace.  Catches all user keyboard text searches since you can only reliably get character codes using the `keypress` event
                "keypress.selectBoxIt": function (e) {

                    // Sets the current key to the `keyCode` value if `charCode` does not exist.  Used for cross
                    // browser support since IE uses `keyCode` instead of `charCode`.
                    var currentKey = e.charCode || e.keyCode,

                        key = self._keyMappings[e.charCode || e.keyCode],

                    // Converts unicode values to characters
                        alphaNumericKey = String.fromCharCode(currentKey);

                    // If the plugin options allow text searches
                    if (self.search && (!key || (key && key === "space"))) {

                        // Calls `search` and passes the character value of the user's text search
                        self.search(alphaNumericKey, true, true);

                    }

                    if (key === "space") {

                        e.preventDefault();

                    }

                },

                // `mousenter` event with the `selectBoxIt` namespace .The mouseenter JavaScript event is proprietary to Internet Explorer. Because of the event's general utility, jQuery simulates this event so that it can be used regardless of browser.
                "mouseenter.selectBoxIt": function () {

                    // Trigger the `mouseenter` event on the original select box
                    self.triggerEvent("mouseenter");

                },

                // `mouseleave` event with the `selectBoxIt` namespace. The mouseleave JavaScript event is proprietary to Internet Explorer. Because of the event's general utility, jQuery simulates this event so that it can be used regardless of browser.
                "mouseleave.selectBoxIt": function () {

                    // Trigger the `mouseleave` event on the original select box
                    self.triggerEvent("mouseleave");

                }

            });

            // Select box options events that set the dropdown list blur logic (decides when the dropdown list gets
            // closed)
            self.list.on({

                // `mouseover` event with the `selectBoxIt` namespace
                "mouseover.selectBoxIt": function () {

                    // Prevents the dropdown list options list from closing
                    self.blur = false;

                },

                // `mouseout` event with the `selectBoxIt` namespace
                "mouseout.selectBoxIt": function () {

                    // Allows the dropdown list options list to close
                    self.blur = true;

                },

                // `focusin` event with the `selectBoxIt` namespace
                "focusin.selectBoxIt": function () {

                    // Prevents the default browser outline border to flicker, which results because of the `blur` event
                    self.dropdown.trigger("focus", true);

                }

            });

            // Select box individual options events bound with the jQuery `delegate` method.  `Delegate` was used because binding indropdownidual events to each list item (since we don't know how many there will be) would decrease performance.  Instead, we bind each event to the unordered list, provide the list item context, and allow the list item events to bubble up (`event bubbling`). This greatly increases page performance because we only have to bind an event to one element instead of x number of elements. Delegates the `click` event with the `selectBoxIt` namespace to the list items
            self.list.on({

                "mousedown.selectBoxIt": function () {

                    self._update($(this));

                    self.triggerEvent("option-click");

                    // If the current drop down option is not disabled
                    if ($(this).attr("data-disabled") === "false" && $(this).attr("data-preventclose") !== "true") {

                        // Closes the drop down list
                        self.close();

                    }

                    setTimeout(function () {

                        self.dropdown.trigger('focus', true);

                    }, 0);

                },

                // Delegates the `focusin` event with the `selectBoxIt` namespace to the list items
                "focusin.selectBoxIt": function () {

                    // Removes the hover class from the previous drop down option
                    self.listItems.not($(this)).removeAttr("data-active");

                    $(this).attr("data-active", "");

                    var listIsHidden = self.list.is(":hidden");

                    if ((self.options["searchWhenHidden"] && listIsHidden) || self.options["aggressiveChange"] || (listIsHidden && self.options["selectWhenHidden"])) {

                        self._update($(this));

                    }

                    // Adds the focus CSS class to the currently focused dropdown list option
                    $(this).addClass(focusClass);

                },

                // Delegates the `focus` event with the `selectBoxIt` namespace to the list items
                "mouseup.selectBoxIt": function () {

                    if (nativeMousedown && !customShowHideEvent) {

                        self._update($(this));

                        self.triggerEvent("option-mouseup");

                        // If the current drop down option is not disabled
                        if ($(this).attr("data-disabled") === "false" && $(this).attr("data-preventclose") !== "true") {

                            // Closes the drop down list
                            self.close();

                        }

                    }

                },

                // Delegates the `mouseenter` event with the `selectBoxIt` namespace to the list items
                "mouseenter.selectBoxIt": function () {

                    // If the currently moused over drop down option is not disabled
                    if ($(this).attr("data-disabled") === "false") {

                        self.listItems.removeAttr("data-active");

                        $(this).addClass(focusClass).attr("data-active", "");

                        // Sets the dropdown list indropdownidual options back to the default state and sets the focus CSS class on the currently hovered option
                        self.listItems.not($(this)).removeClass(focusClass);

                        $(this).addClass(focusClass);

                        self.currentFocus = +$(this).attr("data-id");

                    }

                },

                // Delegates the `mouseleave` event with the `selectBoxIt` namespace to the list items
                "mouseleave.selectBoxIt": function () {

                    // If the currently moused over drop down option is not disabled
                    if ($(this).attr("data-disabled") === "false") {

                        // Removes the focus class from the previous drop down option
                        self.listItems.not($(this)).removeClass(focusClass).removeAttr("data-active");

                        $(this).addClass(focusClass);

                        self.currentFocus = +$(this).attr("data-id");

                    }

                },

                // Delegates the `blur` event with the `selectBoxIt` namespace to the list items
                "blur.selectBoxIt": function () {

                    // Removes the focus CSS class from the previously focused dropdown list option
                    $(this).removeClass(focusClass);

                }

            }, ".selectboxit-option");

            // Select box individual option anchor events bound with the jQuery `delegate` method.  `Delegate` was used because binding indropdownidual events to each list item (since we don't know how many there will be) would decrease performance.  Instead, we bind each event to the unordered list, provide the list item context, and allow the list item events to bubble up (`event bubbling`). This greatly increases page performance because we only have to bind an event to one element instead of x number of elements. Delegates the `click` event with the `selectBoxIt` namespace to the list items
            self.list.on({

                "click.selectBoxIt": function (ev) {

                    // Prevents the internal anchor tag from doing anything funny
                    ev.preventDefault();

                }

            }, "a");

            // Original dropdown list events
            self.selectBox.on({

                // `change` event handler with the `selectBoxIt` namespace
                "change.selectBoxIt, internal-change.selectBoxIt": function (event, internal) {

                    var currentOption,
                        currentDataSelectedText;

                    // If the user called the change method
                    if (!internal) {

                        currentOption = self.list.find('li[data-val="' + self.originalElem.value + '"]');

                        // If there is a dropdown option with the same value as the original select box element
                        if (currentOption.length) {

                            self.listItems.eq(self.currentFocus).removeClass(self.focusClass);

                            self.currentFocus = +currentOption.attr("data-id");

                        }

                    }

                    currentOption = self.listItems.eq(self.currentFocus);

                    currentDataSelectedText = currentOption.attr("data-selectedtext");

                    currentDataText = currentOption.attr("data-text");

                    currentText = currentDataText ? currentDataText : currentOption.find("a").text();

                    // Sets the new dropdown list text to the value of the current option
                    self._setText(self.dropdownText, currentDataSelectedText || currentText);

                    self.dropdownText.attr("data-val", self.originalElem.value);

                    if (currentOption.find("i").attr("class")) {

                        self.dropdownImage.attr("class", currentOption.find("i").attr("class")).addClass("selectboxit-default-icon");

                        self.dropdownImage.attr("style", currentOption.find("i").attr("style"));
                    }

                    // Triggers a custom changed event on the original select box
                    self.triggerEvent("changed");

                },

                // `disable` event with the `selectBoxIt` namespace
                "disable.selectBoxIt": function () {

                    // Adds the `disabled` CSS class to the new dropdown list to visually show that it is disabled
                    self.dropdown.addClass(self.theme["disabled"]);

                },

                // `enable` event with the `selectBoxIt` namespace
                "enable.selectBoxIt": function () {

                    // Removes the `disabled` CSS class from the new dropdown list to visually show that it is enabled
                    self.dropdown.removeClass(self.theme["disabled"]);

                },

                // `open` event with the `selectBoxIt` namespace
                "open.selectBoxIt": function () {

                    var currentElem = self.list.find("li[data-val='" + self.dropdownText.attr("data-val") + "']"),
                        activeElem;

                    // If no current element can be found, then select the first drop down option
                    if (!currentElem.length) {

                        // Sets the default value of the dropdown list to the first option that is not disabled
                        currentElem = self.listItems.not("[data-disabled=true]").first();

                    }

                    self.currentFocus = +currentElem.attr("data-id");

                    activeElem = self.listItems.eq(self.currentFocus);

                    self.dropdown.addClass(openClass).// Removes the focus class from the dropdown list and adds the library focus class for both the dropdown list and the currently selected dropdown list option
                    removeClass(hoverClass).addClass(focusClass);

                    self.listItems.removeClass(self.selectedClass).removeAttr("data-active").not(activeElem).removeClass(focusClass);

                    activeElem.addClass(self.selectedClass).addClass(focusClass);

                    if (self.options.hideCurrent) {

                        self.listItems.show();

                        activeElem.hide();

                    }

                },

                "close.selectBoxIt": function () {

                    // Removes the open class from the dropdown container
                    self.dropdown.removeClass(openClass);

                },

                "blur.selectBoxIt": function () {

                    self.dropdown.removeClass(focusClass);

                },

                // `mousenter` event with the `selectBoxIt` namespace
                "mouseenter.selectBoxIt": function () {

                    if (!$(this).hasClass(self.theme["disabled"])) {
                        self.dropdown.addClass(hoverClass);
                    }

                },

                // `mouseleave` event with the `selectBoxIt` namespace
                "mouseleave.selectBoxIt": function () {

                    // Removes the hover CSS class on the previously hovered dropdown list option
                    self.dropdown.removeClass(hoverClass);

                },

                // `destroy` event
                "destroy": function (ev) {

                    // Prevents the default action from happening
                    ev.preventDefault();

                    // Prevents the destroy event from propagating
                    ev.stopPropagation();

                }

            });

            // Maintains chainability
            return self;

        },

        // _update
        // -------
        //      Updates the drop down and select box with the current value
        _update: function (elem) {

            var self = this,
                currentDataSelectedText,
                currentDataText,
                currentText,
                defaultText = self.options["defaultText"] || self.selectBox.attr("data-text"),
                currentElem = self.listItems.eq(self.currentFocus);

            if (elem.attr("data-disabled") === "false") {

                currentDataSelectedText = self.listItems.eq(self.currentFocus).attr("data-selectedtext");

                currentDataText = currentElem.attr("data-text");

                currentText = currentDataText ? currentDataText : currentElem.text();

                // If the default text option is set and the current drop down option is not disabled
                if ((defaultText && self.options["html"] ? self.dropdownText.html() === defaultText : self.dropdownText.text() === defaultText) && self.selectBox.val() === elem.attr("data-val")) {

                    self.triggerEvent("change");

                }

                else {

                    // Sets the original dropdown list value and triggers the `change` event on the original select box
                    self.selectBox.val(elem.attr("data-val"));

                    // Sets `currentFocus` to the currently focused dropdown list option.
                    // The unary `+` operator casts the string to a number
                    // [James Padolsey Blog Post](http://james.padolsey.com/javascript/terse-javascript-101-part-2/)
                    self.currentFocus = +elem.attr("data-id");

                    // Triggers the dropdown list `change` event if a value change occurs
                    if (self.originalElem.value !== self.dropdownText.attr("data-val")) {

                        self.triggerEvent("change");

                    }

                }

            }

        },

        // _addClasses
        // -----------
        //      Adds SelectBoxIt CSS classes
        _addClasses: function (obj) {

            var self = this,

                focusClass = self.focusClass = obj.focus,

                hoverClass = self.hoverClass = obj.hover,

                buttonClass = obj.button,

                listClass = obj.list,

                arrowClass = obj.arrow,

                containerClass = obj.container,

                openClass = self.openClass = obj.open;

            self.selectedClass = "selectboxit-selected";

            self.downArrow.addClass(self.selectBox.attr("data-downarrow") || self.options["downArrowIcon"] || arrowClass);

            // Adds the correct container class to the dropdown list
            self.dropdownContainer.addClass(containerClass);

            // Adds the correct class to the dropdown list
            self.dropdown.addClass(buttonClass);

            // Adds the default class to the dropdown list options
            self.list.addClass(listClass);

            // Maintains chainability
            return self;

        },

        // Refresh
        // -------
        //    The dropdown will rebuild itself.  Useful for dynamic content.
        refresh: function (callback, internal) {

            var self = this;

            // Destroys the plugin and then recreates the plugin
            self._destroySelectBoxIt()._create(true);

            if (!internal) {
                self.triggerEvent("refresh");
            }

            self._callbackSupport(callback);

            //Maintains chainability
            return self;

        },

        // HTML Escape
        // -----------
        //      HTML encodes a string
        htmlEscape: function (str) {

            return String(str)
                .replace(/&/g, "&amp;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");

        },

        // triggerEvent
        // ------------
        //      Trigger's an external event on the original select box element
        triggerEvent: function (eventName) {

            var self = this,
            // Finds the currently option index
                currentIndex = self.options["showFirstOption"] ? self.currentFocus : ((self.currentFocus - 1) >= 0 ? self.currentFocus : 0);

            // Triggers the custom option-click event on the original select box and passes the select box option
            self.selectBox.trigger(eventName, {
                "selectbox": self.selectBox,
                "selectboxOption": self.selectItems.eq(currentIndex),
                "dropdown": self.dropdown,
                "dropdownOption": self.listItems.eq(self.currentFocus)
            });

            // Maintains chainability
            return self;

        },

        // _copyAttributes
        // ---------------
        //      Copies HTML attributes from the original select box to the new drop down 
        _copyAttributes: function () {

            var self = this;

            if (self._addSelectBoxAttributes) {

                self._addSelectBoxAttributes();

            }

            return self;

        },

        // _realOuterWidth
        // ---------------
        //      Retrieves the true outerWidth dimensions of a hidden DOM element
        _realOuterWidth: function (elem) {

            if (elem.is(":visible")) {

                return elem.outerWidth(true);

            }

            var self = this,
                clonedElem = elem.clone(),
                outerWidth;

            clonedElem.css({

                "visibility": "hidden",

                "display": "block",

                "position": "absolute"

            }).appendTo("body");

            outerWidth = clonedElem.outerWidth(true);

            clonedElem.remove();

            return outerWidth;
        }

    });

    // Stores the plugin prototype object in a local variable
    var selectBoxIt = $.selectBox.selectBoxIt.prototype;

    // Add Options Module
    // ==================

    // add
    // ---
    //    Adds drop down options
    //    using JSON data, an array,
    //    a single object, or valid HTML string

    selectBoxIt.add = function (data, callback) {

        this._populate(data, function (data) {

            var self = this,
                dataType = $.type(data),
                value,
                x = 0,
                dataLength,
                elems = [],
                isJSON = self._isJSON(data),
                parsedJSON = isJSON && self._parseJSON(data);

            // If the passed data is a local or JSON array
            if (data && (dataType === "array" || (isJSON && parsedJSON.data && $.type(parsedJSON.data) === "array")) || (dataType === "object" && data.data && $.type(data.data) === "array")) {

                // If the data is JSON
                if (self._isJSON(data)) {

                    // Parses the JSON and stores it in the data local variable
                    data = parsedJSON;

                }

                // If there is an inner `data` property stored in the first level of the JSON array
                if (data.data) {

                    // Set's the data to the inner `data` property
                    data = data.data;

                }

                // Loops through the array
                for (dataLength = data.length; x <= dataLength - 1; x += 1) {

                    // Stores the currently traversed array item in the local `value` variable
                    value = data[x];

                    // If the currently traversed array item is an object literal
                    if ($.isPlainObject(value)) {

                        // Adds an option to the elems array
                        elems.push($("<option/>", value));

                    }

                    // If the currently traversed array item is a string
                    else if ($.type(value) === "string") {

                        // Adds an option to the elems array
                        elems.push($("<option/>", {text: value, value: value}));

                    }

                }

                // Appends all options to the drop down (with the correct object configurations)
                self.selectBox.append(elems);

            }

            // if the passed data is an html string and not a JSON string
            else if (data && dataType === "string" && !self._isJSON(data)) {

                // Appends the html string options to the original select box
                self.selectBox.append(data);

            }

            else if (data && dataType === "object") {

                // Appends an option to the original select box (with the object configurations)
                self.selectBox.append($("<option/>", data));

            }

            else if (data && self._isJSON(data) && $.isPlainObject(self._parseJSON(data))) {

                // Appends an option to the original select box (with the object configurations)
                self.selectBox.append($("<option/>", self._parseJSON(data)));

            }

            // If the dropdown property exists
            if (self.dropdown) {

                // Rebuilds the dropdown
                self.refresh(function () {

                    // Provide callback function support
                    self._callbackSupport(callback);

                }, true);

            } else {

                // Provide callback function support
                self._callbackSupport(callback);

            }

            // Maintains chainability
            return self;

        });

    };

    // parseJSON
    // ---------
    //      Detects JSON support and parses JSON data
    selectBoxIt._parseJSON = function (data) {

        return (JSON && JSON.parse && JSON.parse(data)) || $.parseJSON(data);

    };

    // isjSON
    // ------
    //    Determines if a string is valid JSON

    selectBoxIt._isJSON = function (data) {

        var self = this,
            json;

        try {

            json = self._parseJSON(data);

            // Valid JSON
            return true;

        } catch (e) {

            // Invalid JSON
            return false;

        }

    };

    // _populate
    // --------
    //    Handles asynchronous and synchronous data
    //    to populate the select box

    selectBoxIt._populate = function (data, callback) {

        var self = this;

        data = $.isFunction(data) ? data.call() : data;

        if (self.isDeferred(data)) {

            data.done(function (returnedData) {

                callback.call(self, returnedData);

            });

        }

        else {

            callback.call(self, data);

        }

        // Maintains chainability
        return self;

    };

    // Accessibility Module
    // ====================

    // _ARIA Accessibility
    // ------------------
    //      Adds ARIA (Accessible Rich Internet Applications)
    //      Accessibility Tags to the Select Box

    selectBoxIt._ariaAccessibility = function () {

        var self = this,
            dropdownLabel = $("label[for='" + self.originalElem.id + "']");

        // Adds `ARIA attributes` to the dropdown list
        self.dropdownContainer.attr({

            // W3C `combobox` description: A presentation of a select; usually similar to a textbox where users can type ahead to select an option.
            "role": "combobox",

            //W3C `aria-autocomplete` description: Indicates whether user input completion suggestions are provided.
            "aria-autocomplete": "list",

            "aria-haspopup": "true",

            // W3C `aria-expanded` description: Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed.
            "aria-expanded": "false",

            // W3C `aria-owns` description: The value of the aria-owns attribute is a space-separated list of IDREFS that reference one or more elements in the document by ID. The reason for adding aria-owns is to expose a parent/child contextual relationship to assistive technologies that is otherwise impossible to infer from the DOM.
            "aria-owns": self.list[0].id

        });

        self.dropdownText.attr({

            "aria-live": "polite"

        });

        // Dynamically adds `ARIA attributes` if the new dropdown list is enabled or disabled
        self.dropdown.on({

            //Select box custom `disable` event with the `selectBoxIt` namespace
            "disable.selectBoxIt": function () {

                // W3C `aria-disabled` description: Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
                self.dropdownContainer.attr("aria-disabled", "true");

            },

            // Select box custom `enable` event with the `selectBoxIt` namespace
            "enable.selectBoxIt": function () {

                // W3C `aria-disabled` description: Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
                self.dropdownContainer.attr("aria-disabled", "false");

            }

        });

        if (dropdownLabel.length) {

            // MDN `aria-labelledby` description:  Indicates the IDs of the elements that are the labels for the object.
            self.dropdownContainer.attr("aria-labelledby", dropdownLabel[0].id);

        }

        // Adds ARIA attributes to the dropdown list options list
        self.list.attr({

            // W3C `listbox` description: A widget that allows the user to select one or more items from a list of choices.
            "role": "listbox",

            // Indicates that the dropdown list options list is currently hidden
            "aria-hidden": "true"

        });

        // Adds `ARIA attributes` to the dropdown list options
        self.listItems.attr({

            // This must be set for each element when the container element role is set to `listbox`
            "role": "option"

        });

        // Dynamically updates the new dropdown list `aria-label` attribute after the original dropdown list value changes
        self.selectBox.on({

            // Custom `open` event with the `selectBoxIt` namespace
            "open.selectBoxIt": function () {

                // Indicates that the dropdown list options list is currently visible
                self.list.attr("aria-hidden", "false");

                // Indicates that the dropdown list is currently expanded
                self.dropdownContainer.attr("aria-expanded", "true");

            },

            // Custom `close` event with the `selectBoxIt` namespace
            "close.selectBoxIt": function () {

                // Indicates that the dropdown list options list is currently hidden
                self.list.attr("aria-hidden", "true");

                // Indicates that the dropdown list is currently collapsed
                self.dropdownContainer.attr("aria-expanded", "false");

            }

        });

        // Maintains chainability
        return self;

    };

    // Copy Attributes Module
    // ======================

    // addSelectBoxAttributes
    // ----------------------
    //      Add's all attributes (excluding id, class names, and the style attribute) from the default select box to the new drop down

    selectBoxIt._addSelectBoxAttributes = function () {

        // Stores the plugin context inside of the self variable
        var self = this;

        // Add's all attributes to the currently traversed drop down option
        self._addAttributes(self.selectBox.prop("attributes"), self.dropdown);

        // Add's all attributes to the drop down items list
        self.selectItems.each(function (iterator) {

            // Add's all attributes to the currently traversed drop down option
            self._addAttributes($(this).prop("attributes"), self.listItems.eq(iterator));

        });

        // Maintains chainability
        return self;

    };

    // addAttributes
    // -------------
    //  Add's attributes to a DOM element
    selectBoxIt._addAttributes = function (arr, elem) {

        // Stores the plugin context inside of the self variable
        var self = this,
            whitelist = self.options["copyAttributes"];

        // If there are array properties
        if (arr.length) {

            // Iterates over all of array properties
            $.each(arr, function (iterator, property) {

                // Get's the property name and property value of each property
                var propName = (property.name).toLowerCase(), propValue = property.value;

                // If the currently traversed property value is not "null", is on the whitelist, or is an HTML 5 data attribute
                if (propValue !== "null" && ($.inArray(propName, whitelist) !== -1 || propName.indexOf("data") !== -1)) {

                    // Set's the currently traversed property on element
                    elem.attr(propName, propValue);

                }

            });

        }

        // Maintains chainability
        return self;

    };
    // Destroy Module
    // ==============

    // Destroy
    // -------
    //    Removes the plugin from the page

    selectBoxIt.destroy = function (callback) {

        // Stores the plugin context inside of the self variable
        var self = this;

        self._destroySelectBoxIt();

        // Calls the jQueryUI Widget Factory destroy method
        self.widgetProto.destroy.call(self);

        // Provides callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // Internal Destroy Method
    // -----------------------
    //    Removes the plugin from the page

    selectBoxIt._destroySelectBoxIt = function () {

        // Stores the plugin context inside of the self variable
        var self = this;

        // Unbinds all of the dropdown list event handlers with the `selectBoxIt` namespace
        self.dropdown.off(".selectBoxIt");

        // If the original select box has been placed inside of the new drop down container
        if ($.contains(self.dropdownContainer[0], self.originalElem)) {

            // Moves the original select box before the drop down container
            self.dropdownContainer.before(self.selectBox);

        }

        // Remove all of the `selectBoxIt` DOM elements from the page
        self.dropdownContainer.remove();

        // Resets the style attributes for the original select box
        self.selectBox.removeAttr("style").attr("style", self.selectBoxStyles);

        // Triggers the custom `destroy` event on the original select box
        self.triggerEvent("destroy");

        // Maintains chainability
        return self;

    };

    // Disable Module
    // ==============

    // Disable
    // -------
    //      Disables the new dropdown list

    selectBoxIt.disable = function (callback) {

        var self = this;

        if (!self.options["disabled"]) {

            // Makes sure the dropdown list is closed
            self.close();

            // Sets the `disabled` attribute on the original select box
            self.selectBox.attr("disabled", "disabled");

            // Makes the dropdown list not focusable by removing the `tabindex` attribute
            self.dropdown.removeAttr("tabindex").// Disables styling for enabled state
            removeClass(self.theme["enabled"]).// Enabled styling for disabled state
            addClass(self.theme["disabled"]);

            self.setOption("disabled", true);

            // Triggers a `disable` custom event on the original select box
            self.triggerEvent("disable");

        }

        // Provides callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // Disable Option
    // --------------
    //      Disables a single drop down option

    selectBoxIt.disableOption = function (index, callback) {

        var self = this, currentSelectBoxOption, hasNextEnabled, hasPreviousEnabled, type = $.type(index);

        // If an index is passed to target an indropdownidual drop down option
        if (type === "number") {

            // Makes sure the dropdown list is closed
            self.close();

            // The select box option being targeted
            currentSelectBoxOption = self.selectBox.find("option").eq(index);

            // Triggers a `disable-option` custom event on the original select box and passes the disabled option
            self.triggerEvent("disable-option");

            // Disables the targeted select box option
            currentSelectBoxOption.attr("disabled", "disabled");

            // Disables the drop down option
            self.listItems.eq(index).attr("data-disabled", "true").// Applies disabled styling for the drop down option
            addClass(self.theme["disabled"]);

            // If the currently selected drop down option is the item being disabled
            if (self.currentFocus === index) {

                hasNextEnabled = self.listItems.eq(self.currentFocus).nextAll("li").not("[data-disabled='true']").first().length;

                hasPreviousEnabled = self.listItems.eq(self.currentFocus).prevAll("li").not("[data-disabled='true']").first().length;

                // If there is a currently enabled option beneath the currently selected option
                if (hasNextEnabled) {

                    // Selects the option beneath the currently selected option
                    self.moveDown();

                }

                // If there is a currently enabled option above the currently selected option
                else if (hasPreviousEnabled) {

                    // Selects the option above the currently selected option
                    self.moveUp();

                }

                // If there is not a currently enabled option
                else {

                    // Disables the entire drop down list
                    self.disable();

                }

            }

        }

        // Provides callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // _Is Disabled
    // -----------
    //      Checks the original select box for the
    //    disabled attribute

    selectBoxIt._isDisabled = function (callback) {

        var self = this;

        // If the original select box is disabled
        if (self.originalElem.disabled) {

            // Disables the dropdown list
            self.disable();

        }

        // Maintains chainability
        return self;

    };

    // Dynamic Positioning Module
    // ==========================

    // _Dynamic positioning
    // --------------------
    //      Dynamically positions the dropdown list options list

    selectBoxIt._dynamicPositioning = function () {

        var self = this;

        // If the `size` option is a number
        if ($.type(self.listSize) === "number") {

            // Set's the max-height of the drop down list
            self.list.css("max-height", self.maxHeight || "none");

        }

        // If the `size` option is not a number
        else {

            // Returns the x and y coordinates of the dropdown list options list relative to the document
            var listOffsetTop = self.dropdown.offset().top,

            // The height of the dropdown list options list
                listHeight = self.list.data("max-height") || self.list.outerHeight(),

            // The height of the dropdown list DOM element
                selectBoxHeight = self.dropdown.outerHeight(),

                viewport = self.options["viewport"],

                viewportHeight = viewport.height(),

                viewportScrollTop = $.isWindow(viewport.get(0)) ? viewport.scrollTop() : viewport.offset().top,

                topToBottom = (listOffsetTop + selectBoxHeight + listHeight <= viewportHeight + viewportScrollTop),

                bottomReached = !topToBottom;

            if (!self.list.data("max-height")) {

                self.list.data("max-height", self.list.outerHeight());

            }

            // If there is room on the bottom of the viewport to display the drop down options
            if (!bottomReached) {

                self.list.css("max-height", listHeight);

                // Sets custom CSS properties to place the dropdown list options directly below the dropdown list
                self.list.css("top", "auto");

            }

            // If there is room on the top of the viewport
            else if ((self.dropdown.offset().top - viewportScrollTop) >= listHeight) {

                self.list.css("max-height", listHeight);

                // Sets custom CSS properties to place the dropdown list options directly above the dropdown list
                self.list.css("top", (self.dropdown.position().top - self.list.outerHeight()));

            }

            // If there is not enough room on the top or the bottom
            else {

                var outsideBottomViewport = Math.abs((listOffsetTop + selectBoxHeight + listHeight) - (viewportHeight + viewportScrollTop)),

                    outsideTopViewport = Math.abs((self.dropdown.offset().top - viewportScrollTop) - listHeight);

                // If there is more room on the bottom
                if (outsideBottomViewport < outsideTopViewport) {

                    self.list.css("max-height", listHeight - outsideBottomViewport - (selectBoxHeight / 2));

                    self.list.css("top", "auto");

                }

                // If there is more room on the top
                else {

                    self.list.css("max-height", listHeight - outsideTopViewport - (selectBoxHeight / 2));

                    // Sets custom CSS properties to place the dropdown list options directly above the dropdown list
                    self.list.css("top", (self.dropdown.position().top - self.list.outerHeight()));

                }

            }

        }

        // Maintains chainability
        return self;

    };

    // Enable Module
    // =============

    // Enable
    // ------
    //      Enables the new dropdown list

    selectBoxIt.enable = function (callback) {

        var self = this;

        if (self.options["disabled"]) {

            // Triggers a `enable` custom event on the original select box
            self.triggerEvent("enable");

            // Removes the `disabled` attribute from the original dropdown list
            self.selectBox.removeAttr("disabled");

            // Make the dropdown list focusable
            self.dropdown.attr("tabindex", 0).// Disable styling for disabled state
            removeClass(self.theme["disabled"]).// Enables styling for enabled state
            addClass(self.theme["enabled"]);

            self.setOption("disabled", false);

            // Provide callback function support
            self._callbackSupport(callback);

        }

        // Maintains chainability
        return self;

    };

    // Enable Option
    // -------------
    //      Disables a single drop down option

    selectBoxIt.enableOption = function (index, callback) {

        var self = this, currentSelectBoxOption, currentIndex = 0, hasNextEnabled, hasPreviousEnabled, type = $.type(index);

        // If an index is passed to target an indropdownidual drop down option
        if (type === "number") {

            // The select box option being targeted
            currentSelectBoxOption = self.selectBox.find("option").eq(index);

            // Triggers a `enable-option` custom event on the original select box and passes the enabled option
            self.triggerEvent("enable-option");

            // Disables the targeted select box option
            currentSelectBoxOption.removeAttr("disabled");

            // Disables the drop down option
            self.listItems.eq(index).attr("data-disabled", "false").// Applies disabled styling for the drop down option
            removeClass(self.theme["disabled"]);

        }

        // Provides callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // Keyboard Navigation Module
    // ==========================

    // Move Down
    // ---------
    //      Handles the down keyboard navigation logic

    selectBoxIt.moveDown = function (callback) {

        var self = this;

        // Increments `currentFocus`, which represents the currently focused list item `id` attribute.
        self.currentFocus += 1;

        // Determines whether the dropdown option the user is trying to go to is currently disabled
        var disabled = self.listItems.eq(self.currentFocus).attr("data-disabled") === "true" ? true : false,

            hasNextEnabled = self.listItems.eq(self.currentFocus).nextAll("li").not("[data-disabled='true']").first().length;

        // If the user has reached the top of the list
        if (self.currentFocus === self.listItems.length) {

            // Does not allow the user to continue to go up the list
            self.currentFocus -= 1;

        }

        // If the option the user is trying to go to is disabled, but there is another enabled option
        else if (disabled && hasNextEnabled) {

            // Blur the previously selected option
            self.listItems.eq(self.currentFocus - 1).blur();

            // Call the `moveDown` method again
            self.moveDown();

            // Exit the method
            return;

        }

        // If the option the user is trying to go to is disabled, but there is not another enabled option
        else if (disabled && !hasNextEnabled) {

            self.currentFocus -= 1;

        }

        // If the user has not reached the bottom of the unordered list
        else {

            // Blurs the previously focused list item
            // The jQuery `end()` method allows you to continue chaining while also using a different selector
            self.listItems.eq(self.currentFocus - 1).blur().end().// Focuses the currently focused list item
            eq(self.currentFocus).focusin();

            // Calls `scrollToView` to make sure the `scrollTop` is correctly updated. The `down` user action
            self._scrollToView("down");

            // Triggers the custom `moveDown` event on the original select box
            self.triggerEvent("moveDown");

        }

        // Provide callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // Move Up
    // ------
    //      Handles the up keyboard navigation logic
    selectBoxIt.moveUp = function (callback) {

        var self = this;

        // Increments `currentFocus`, which represents the currently focused list item `id` attribute.
        self.currentFocus -= 1;

        // Determines whether the dropdown option the user is trying to go to is currently disabled
        var disabled = self.listItems.eq(self.currentFocus).attr("data-disabled") === "true" ? true : false,

            hasPreviousEnabled = self.listItems.eq(self.currentFocus).prevAll("li").not("[data-disabled='true']").first().length;

        // If the user has reached the top of the list
        if (self.currentFocus === -1) {

            // Does not allow the user to continue to go up the list
            self.currentFocus += 1;

        }

        // If the option the user is trying to go to is disabled and the user is not trying to go up after the user has reached the top of the list
        else if (disabled && hasPreviousEnabled) {

            // Blur the previously selected option
            self.listItems.eq(self.currentFocus + 1).blur();

            // Call the `moveUp` method again
            self.moveUp();

            // Exits the method
            return;

        }

        else if (disabled && !hasPreviousEnabled) {

            self.currentFocus += 1;

        }

        // If the user has not reached the top of the unordered list
        else {

            // Blurs the previously focused list item
            // The jQuery `end()` method allows you to continue chaining while also using a different selector
            self.listItems.eq(this.currentFocus + 1).blur().end().// Focuses the currently focused list item
            eq(self.currentFocus).focusin();

            // Calls `scrollToView` to make sure the `scrollTop` is correctly updated. The `down` user action
            self._scrollToView("up");

            // Triggers the custom `moveDown` event on the original select box
            self.triggerEvent("moveUp");

        }

        // Provide callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // Keyboard Search Module
    // ======================

    // _Set Current Search Option
    // -------------------------
    //      Sets the currently selected dropdown list search option

    selectBoxIt._setCurrentSearchOption = function (currentOption) {

        var self = this;

        // Does not change the current option if `showFirstOption` is false and the matched search item is the hidden first option.
        // Otherwise, the current option value is updated
        if ((self.options["aggressiveChange"] || self.options["selectWhenHidden"] || self.listItems.eq(currentOption).is(":visible")) && self.listItems.eq(currentOption).data("disabled") !== true) {

            // Calls the `blur` event of the currently selected dropdown list option
            self.listItems.eq(self.currentFocus).blur();

            // Sets `currentIndex` to the currently selected dropdown list option
            self.currentIndex = currentOption;

            // Sets `currentFocus` to the currently selected dropdown list option
            self.currentFocus = currentOption;

            // Focuses the currently selected dropdown list option
            self.listItems.eq(self.currentFocus).focusin();

            // Updates the scrollTop so that the currently selected dropdown list option is visible to the user
            self._scrollToView("search");

            // Triggers the custom `search` event on the original select box
            self.triggerEvent("search");

        }

        // Maintains chainability
        return self;

    };

    // _Search Algorithm
    // -----------------
    //      Uses regular expressions to find text matches
    selectBoxIt._searchAlgorithm = function (currentIndex, alphaNumeric) {

        var self = this,

        // Boolean to determine if a pattern match exists
            matchExists = false,

        // Iteration variable used in the outermost for loop
            x,

        // Iteration variable used in the nested for loop
            y,

        // Variable used to cache the length of the text array (Small enhancement to speed up traversing)
            arrayLength,

        // Variable storing the current search
            currentSearch,

        // Variable storing the textArray property
            textArray = self.textArray,

        // Variable storing the current text property
            currentText = self.currentText;

        // Loops through the text array to find a pattern match
        for (x = currentIndex, arrayLength = textArray.length; x < arrayLength; x += 1) {

            currentSearch = textArray[x];

            // Nested for loop to help search for a pattern match with the currently traversed array item
            for (y = 0; y < arrayLength; y += 1) {

                // Searches for a match
                if (textArray[y].search(alphaNumeric) !== -1) {

                    // `matchExists` is set to true if there is a match
                    matchExists = true;

                    // Exits the nested for loop
                    y = arrayLength;

                }

            } // End nested for loop

            // If a match does not exist
            if (!matchExists) {

                // Sets the current text to the last entered character
                self.currentText = self.currentText.charAt(self.currentText.length - 1).// Escapes the regular expression to make sure special characters are seen as literal characters instead of special commands
                replace(/[|()\[{.+*?$\\]/g, "\\$0");

                currentText = self.currentText;

            }

            // Resets the regular expression with the new value of `self.currentText`
            alphaNumeric = new RegExp(currentText, "gi");

            // Searches based on the first letter of the dropdown list options text if the currentText < 3 characters
            if (currentText.length < 3) {

                alphaNumeric = new RegExp(currentText.charAt(0), "gi");

                // If there is a match based on the first character
                if ((currentSearch.charAt(0).search(alphaNumeric) !== -1)) {

                    // Sets properties of that dropdown list option to make it the currently selected option
                    self._setCurrentSearchOption(x);

                    if ((currentSearch.substring(0, currentText.length).toLowerCase() !== currentText.toLowerCase()) || self.options["similarSearch"]) {

                        // Increments the current index by one
                        self.currentIndex += 1;

                    }

                    // Exits the search
                    return false;

                }

            }

            // If `self.currentText` > 1 character
            else {

                // If there is a match based on the entire string
                if ((currentSearch.search(alphaNumeric) !== -1)) {

                    // Sets properties of that dropdown list option to make it the currently selected option
                    self._setCurrentSearchOption(x);

                    // Exits the search
                    return false;

                }

            }

            // If the current text search is an exact match
            if (currentSearch.toLowerCase() === self.currentText.toLowerCase()) {

                // Sets properties of that dropdown list option to make it the currently selected option
                self._setCurrentSearchOption(x);

                // Resets the current text search to a blank string to start fresh again
                self.currentText = "";

                // Exits the search
                return false;

            }

        }

        // Returns true if there is not a match at all
        return true;

    };

    // Search
    // ------
    //      Calls searchAlgorithm()
    selectBoxIt.search = function (alphaNumericKey, callback, rememberPreviousSearch) {

        var self = this;

        // If the search method is being called internally by the plugin, and not externally as a method by a user
        if (rememberPreviousSearch) {

            // Continued search with history from past searches.  Properly escapes the regular expression
            self.currentText += alphaNumericKey.replace(/[|()\[{.+*?$\\]/g, "\\$0");

        }

        else {

            // Brand new search.  Properly escapes the regular expression
            self.currentText = alphaNumericKey.replace(/[|()\[{.+*?$\\]/g, "\\$0");

        }

        // Searches globally
        var searchResults = self._searchAlgorithm(self.currentIndex, new RegExp(self.currentText, "gi"));

        // Searches the list again if a match is not found.  This is needed, because the first search started at the array indece of the currently selected dropdown list option, and does not search the options before the current array indece.
        // If there are many similar dropdown list options, starting the search at the indece of the currently selected dropdown list option is needed to properly traverse the text array.
        if (searchResults) {

            // Searches the dropdown list values starting from the beginning of the text array
            self._searchAlgorithm(0, self.currentText);

        }

        // Provide callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // Mobile Module
    // =============

    // Set Mobile Text
    // ---------------
    //      Updates the text of the drop down
    selectBoxIt._updateMobileText = function () {

        var self = this,
            currentOption,
            currentDataText,
            currentText;

        currentOption = self.selectBox.find("option").filter(":selected");

        currentDataText = currentOption.attr("data-text");

        currentText = currentDataText ? currentDataText : currentOption.text();

        // Sets the new dropdown list text to the value of the original dropdown list
        self._setText(self.dropdownText, currentText);

        if (self.list.find('li[data-val="' + currentOption.val() + '"]').find("i").attr("class")) {

            self.dropdownImage.attr("class", self.list.find('li[data-val="' + currentOption.val() + '"]').find("i").attr("class")).addClass("selectboxit-default-icon");

        }

    };

    // Apply Native Select
    // -------------------
    //      Applies the original select box directly over the new drop down

    selectBoxIt._applyNativeSelect = function () {

        // Stores the plugin context inside of the self variable
        var self = this;

        // Appends the native select box to the drop down (allows for relative positioning using the position() method)
        self.dropdownContainer.append(self.selectBox);

        self.dropdown.attr("tabindex", "-1");

        // Positions the original select box directly over top the new dropdown list using position absolute and "hides" the original select box using an opacity of 0.  This allows the mobile browser "wheel" interface for better usability.
        self.selectBox.css({

            "display": "block",

            "visibility": "visible",

            "width": self._realOuterWidth(self.dropdown),

            "height": self.dropdown.outerHeight(),

            "opacity": "0",

            "position": "absolute",

            "top": "0",

            "left": "0",

            "cursor": "pointer",

            "z-index": "999999",

            "margin": self.dropdown.css("margin"),

            "padding": "0",

            "-webkit-appearance": "menulist-button"

        });

        if (self.originalElem.disabled) {

            self.triggerEvent("disable");

        }

        return this;

    };

    // Mobile Events
    // -------------
    //      Listens to mobile-specific events
    selectBoxIt._mobileEvents = function () {

        var self = this;

        self.selectBox.on({

            "changed.selectBoxIt": function () {

                self.hasChanged = true;

                self._updateMobileText();

                // Triggers the `option-click` event on mobile
                self.triggerEvent("option-click");

            },

            "mousedown.selectBoxIt": function () {

                // If the select box has not been changed, the defaultText option is being used
                if (!self.hasChanged && self.options.defaultText && !self.originalElem.disabled) {

                    self._updateMobileText();

                    self.triggerEvent("option-click");

                }

            },

            "enable.selectBoxIt": function () {

                // Moves SelectBoxIt onto the page
                self.selectBox.removeClass('selectboxit-rendering');

            },

            "disable.selectBoxIt": function () {

                // Moves SelectBoxIt off the page
                self.selectBox.addClass('selectboxit-rendering');

            }

        });

    };

    // Mobile
    // ------
    //      Applies the native "wheel" interface when a mobile user is interacting with the dropdown

    selectBoxIt._mobile = function (callback) {

        // Stores the plugin context inside of the self variable
        var self = this;

        if (self.isMobile) {

            self._applyNativeSelect();

            self._mobileEvents();

        }

        // Maintains chainability
        return this;

    };

    // Remove Options Module
    // =====================

    // remove
    // ------
    //    Removes drop down list options
    //    using an index

    selectBoxIt.remove = function (indexes, callback) {

        var self = this,
            dataType = $.type(indexes),
            value,
            x = 0,
            dataLength,
            elems = "";

        // If an array is passed in
        if (dataType === "array") {

            // Loops through the array
            for (dataLength = indexes.length; x <= dataLength - 1; x += 1) {

                // Stores the currently traversed array item in the local `value` variable
                value = indexes[x];

                // If the currently traversed array item is an object literal
                if ($.type(value) === "number") {

                    if (elems.length) {

                        // Adds an element to the removal string
                        elems += ", option:eq(" + value + ")";

                    }

                    else {

                        // Adds an element to the removal string
                        elems += "option:eq(" + value + ")";

                    }

                }

            }

            // Removes all of the appropriate options from the select box
            self.selectBox.find(elems).remove();

        }

        // If a number is passed in
        else if (dataType === "number") {

            self.selectBox.find("option").eq(indexes).remove();

        }

        // If anything besides a number or array is passed in
        else {

            // Removes all of the options from the original select box
            self.selectBox.find("option").remove();

        }

        // If the dropdown property exists
        if (self.dropdown) {

            // Rebuilds the dropdown
            self.refresh(function () {

                // Provide callback function support
                self._callbackSupport(callback);

            }, true);

        } else {

            // Provide callback function support
            self._callbackSupport(callback);

        }

        // Maintains chainability
        return self;

    };

    // Select Option Module
    // ====================

    // Select Option
    // -------------
    //      Programatically selects a drop down option by either index or value

    selectBoxIt.selectOption = function (val, callback) {

        // Stores the plugin context inside of the self variable
        var self = this,
            type = $.type(val);

        // Makes sure the passed in position is a number
        if (type === "number") {

            // Set's the original select box value and triggers the change event (which SelectBoxIt listens for)
            self.selectBox.val(self.selectItems.eq(val).val()).change();

        }

        else if (type === "string") {

            // Set's the original select box value and triggers the change event (which SelectBoxIt listens for)
            self.selectBox.val(val).change();

        }

        // Calls the callback function
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // Set Option Module
    // =================

    // Set Option
    // ----------
    //      Accepts an string key, a value, and a callback function to replace a single
    //      property of the plugin options object

    selectBoxIt.setOption = function (key, value, callback) {

        var self = this;

        //Makes sure a string is passed in
        if ($.type(key) === "string") {

            // Sets the plugin option to the new value provided by the user
            self.options[key] = value;

        }

        // Rebuilds the dropdown
        self.refresh(function () {

            // Provide callback function support
            self._callbackSupport(callback);

        }, true);

        // Maintains chainability
        return self;

    };

    // Set Options Module
    // ==================

    // Set Options
    // ----------
    //      Accepts an object to replace plugin options
    //      properties of the plugin options object

    selectBoxIt.setOptions = function (newOptions, callback) {

        var self = this;

        // If the passed in parameter is an object literal
        if ($.isPlainObject(newOptions)) {

            self.options = $.extend({}, self.options, newOptions);

        }

        // Rebuilds the dropdown
        self.refresh(function () {

            // Provide callback function support
            self._callbackSupport(callback);

        }, true);

        // Maintains chainability
        return self;

    };

    // Wait Module
    // ===========

    // Wait
    // ----
    //    Delays execution by the amount of time
    //    specified by the parameter

    selectBoxIt.wait = function (time, callback) {

        var self = this;

        self.widgetProto._delay.call(self, callback, time);

        // Maintains chainability
        return self;

    };
})); // End of all modules

/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.6.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):"undefined"!=typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){"use strict";var b=window.Slick||{};b=function(){function c(c,d){var f,e=this;e.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:a(c),appendDots:a(c),arrows:!0,asNavFor:null,prevArrow:'<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',nextArrow:'<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(b,c){return a('<button type="button" data-role="none" role="button" tabindex="0" />').text(c+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},e.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},a.extend(e,e.initials),e.activeBreakpoint=null,e.animType=null,e.animProp=null,e.breakpoints=[],e.breakpointSettings=[],e.cssTransitions=!1,e.focussed=!1,e.interrupted=!1,e.hidden="hidden",e.paused=!0,e.positionProp=null,e.respondTo=null,e.rowCount=1,e.shouldClick=!0,e.$slider=a(c),e.$slidesCache=null,e.transformType=null,e.transitionType=null,e.visibilityChange="visibilitychange",e.windowWidth=0,e.windowTimer=null,f=a(c).data("slick")||{},e.options=a.extend({},e.defaults,d,f),e.currentSlide=e.options.initialSlide,e.originalSettings=e.options,"undefined"!=typeof document.mozHidden?(e.hidden="mozHidden",e.visibilityChange="mozvisibilitychange"):"undefined"!=typeof document.webkitHidden&&(e.hidden="webkitHidden",e.visibilityChange="webkitvisibilitychange"),e.autoPlay=a.proxy(e.autoPlay,e),e.autoPlayClear=a.proxy(e.autoPlayClear,e),e.autoPlayIterator=a.proxy(e.autoPlayIterator,e),e.changeSlide=a.proxy(e.changeSlide,e),e.clickHandler=a.proxy(e.clickHandler,e),e.selectHandler=a.proxy(e.selectHandler,e),e.setPosition=a.proxy(e.setPosition,e),e.swipeHandler=a.proxy(e.swipeHandler,e),e.dragHandler=a.proxy(e.dragHandler,e),e.keyHandler=a.proxy(e.keyHandler,e),e.instanceUid=b++,e.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,e.registerBreakpoints(),e.init(!0)}var b=0;return c}(),b.prototype.activateADA=function(){var a=this;a.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},b.prototype.addSlide=b.prototype.slickAdd=function(b,c,d){var e=this;if("boolean"==typeof c)d=c,c=null;else if(0>c||c>=e.slideCount)return!1;e.unload(),"number"==typeof c?0===c&&0===e.$slides.length?a(b).appendTo(e.$slideTrack):d?a(b).insertBefore(e.$slides.eq(c)):a(b).insertAfter(e.$slides.eq(c)):d===!0?a(b).prependTo(e.$slideTrack):a(b).appendTo(e.$slideTrack),e.$slides=e.$slideTrack.children(this.options.slide),e.$slideTrack.children(this.options.slide).detach(),e.$slideTrack.append(e.$slides),e.$slides.each(function(b,c){a(c).attr("data-slick-index",b)}),e.$slidesCache=e.$slides,e.reinit()},b.prototype.animateHeight=function(){var a=this;if(1===a.options.slidesToShow&&a.options.adaptiveHeight===!0&&a.options.vertical===!1){var b=a.$slides.eq(a.currentSlide).outerHeight(!0);a.$list.animate({height:b},a.options.speed)}},b.prototype.animateSlide=function(b,c){var d={},e=this;e.animateHeight(),e.options.rtl===!0&&e.options.vertical===!1&&(b=-b),e.transformsEnabled===!1?e.options.vertical===!1?e.$slideTrack.animate({left:b},e.options.speed,e.options.easing,c):e.$slideTrack.animate({top:b},e.options.speed,e.options.easing,c):e.cssTransitions===!1?(e.options.rtl===!0&&(e.currentLeft=-e.currentLeft),a({animStart:e.currentLeft}).animate({animStart:b},{duration:e.options.speed,easing:e.options.easing,step:function(a){a=Math.ceil(a),e.options.vertical===!1?(d[e.animType]="translate("+a+"px, 0px)",e.$slideTrack.css(d)):(d[e.animType]="translate(0px,"+a+"px)",e.$slideTrack.css(d))},complete:function(){c&&c.call()}})):(e.applyTransition(),b=Math.ceil(b),e.options.vertical===!1?d[e.animType]="translate3d("+b+"px, 0px, 0px)":d[e.animType]="translate3d(0px,"+b+"px, 0px)",e.$slideTrack.css(d),c&&setTimeout(function(){e.disableTransition(),c.call()},e.options.speed))},b.prototype.getNavTarget=function(){var b=this,c=b.options.asNavFor;return c&&null!==c&&(c=a(c).not(b.$slider)),c},b.prototype.asNavFor=function(b){var c=this,d=c.getNavTarget();null!==d&&"object"==typeof d&&d.each(function(){var c=a(this).slick("getSlick");c.unslicked||c.slideHandler(b,!0)})},b.prototype.applyTransition=function(a){var b=this,c={};b.options.fade===!1?c[b.transitionType]=b.transformType+" "+b.options.speed+"ms "+b.options.cssEase:c[b.transitionType]="opacity "+b.options.speed+"ms "+b.options.cssEase,b.options.fade===!1?b.$slideTrack.css(c):b.$slides.eq(a).css(c)},b.prototype.autoPlay=function(){var a=this;a.autoPlayClear(),a.slideCount>a.options.slidesToShow&&(a.autoPlayTimer=setInterval(a.autoPlayIterator,a.options.autoplaySpeed))},b.prototype.autoPlayClear=function(){var a=this;a.autoPlayTimer&&clearInterval(a.autoPlayTimer)},b.prototype.autoPlayIterator=function(){var a=this,b=a.currentSlide+a.options.slidesToScroll;a.paused||a.interrupted||a.focussed||(a.options.infinite===!1&&(1===a.direction&&a.currentSlide+1===a.slideCount-1?a.direction=0:0===a.direction&&(b=a.currentSlide-a.options.slidesToScroll,a.currentSlide-1===0&&(a.direction=1))),a.slideHandler(b))},b.prototype.buildArrows=function(){var b=this;b.options.arrows===!0&&(b.$prevArrow=a(b.options.prevArrow).addClass("slick-arrow"),b.$nextArrow=a(b.options.nextArrow).addClass("slick-arrow"),b.slideCount>b.options.slidesToShow?(b.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),b.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),b.htmlExpr.test(b.options.prevArrow)&&b.$prevArrow.prependTo(b.options.appendArrows),b.htmlExpr.test(b.options.nextArrow)&&b.$nextArrow.appendTo(b.options.appendArrows),b.options.infinite!==!0&&b.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):b.$prevArrow.add(b.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},b.prototype.buildDots=function(){var c,d,b=this;if(b.options.dots===!0&&b.slideCount>b.options.slidesToShow){for(b.$slider.addClass("slick-dotted"),d=a("<ul />").addClass(b.options.dotsClass),c=0;c<=b.getDotCount();c+=1)d.append(a("<li />").append(b.options.customPaging.call(this,b,c)));b.$dots=d.appendTo(b.options.appendDots),b.$dots.find("li").first().addClass("slick-active").attr("aria-hidden","false")}},b.prototype.buildOut=function(){var b=this;b.$slides=b.$slider.children(b.options.slide+":not(.slick-cloned)").addClass("slick-slide"),b.slideCount=b.$slides.length,b.$slides.each(function(b,c){a(c).attr("data-slick-index",b).data("originalStyling",a(c).attr("style")||"")}),b.$slider.addClass("slick-slider"),b.$slideTrack=0===b.slideCount?a('<div class="slick-track"/>').appendTo(b.$slider):b.$slides.wrapAll('<div class="slick-track"/>').parent(),b.$list=b.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent(),b.$slideTrack.css("opacity",0),(b.options.centerMode===!0||b.options.swipeToSlide===!0)&&(b.options.slidesToScroll=1),a("img[data-lazy]",b.$slider).not("[src]").addClass("slick-loading"),b.setupInfinite(),b.buildArrows(),b.buildDots(),b.updateDots(),b.setSlideClasses("number"==typeof b.currentSlide?b.currentSlide:0),b.options.draggable===!0&&b.$list.addClass("draggable")},b.prototype.buildRows=function(){var b,c,d,e,f,g,h,a=this;if(e=document.createDocumentFragment(),g=a.$slider.children(),a.options.rows>1){for(h=a.options.slidesPerRow*a.options.rows,f=Math.ceil(g.length/h),b=0;f>b;b++){var i=document.createElement("div");for(c=0;c<a.options.rows;c++){var j=document.createElement("div");for(d=0;d<a.options.slidesPerRow;d++){var k=b*h+(c*a.options.slidesPerRow+d);g.get(k)&&j.appendChild(g.get(k))}i.appendChild(j)}e.appendChild(i)}a.$slider.empty().append(e),a.$slider.children().children().children().css({width:100/a.options.slidesPerRow+"%",display:"inline-block"})}},b.prototype.checkResponsive=function(b,c){var e,f,g,d=this,h=!1,i=d.$slider.width(),j=window.innerWidth||a(window).width();if("window"===d.respondTo?g=j:"slider"===d.respondTo?g=i:"min"===d.respondTo&&(g=Math.min(j,i)),d.options.responsive&&d.options.responsive.length&&null!==d.options.responsive){f=null;for(e in d.breakpoints)d.breakpoints.hasOwnProperty(e)&&(d.originalSettings.mobileFirst===!1?g<d.breakpoints[e]&&(f=d.breakpoints[e]):g>d.breakpoints[e]&&(f=d.breakpoints[e]));null!==f?null!==d.activeBreakpoint?(f!==d.activeBreakpoint||c)&&(d.activeBreakpoint=f,"unslick"===d.breakpointSettings[f]?d.unslick(f):(d.options=a.extend({},d.originalSettings,d.breakpointSettings[f]),b===!0&&(d.currentSlide=d.options.initialSlide),d.refresh(b)),h=f):(d.activeBreakpoint=f,"unslick"===d.breakpointSettings[f]?d.unslick(f):(d.options=a.extend({},d.originalSettings,d.breakpointSettings[f]),b===!0&&(d.currentSlide=d.options.initialSlide),d.refresh(b)),h=f):null!==d.activeBreakpoint&&(d.activeBreakpoint=null,d.options=d.originalSettings,b===!0&&(d.currentSlide=d.options.initialSlide),d.refresh(b),h=f),b||h===!1||d.$slider.trigger("breakpoint",[d,h])}},b.prototype.changeSlide=function(b,c){var f,g,h,d=this,e=a(b.currentTarget);switch(e.is("a")&&b.preventDefault(),e.is("li")||(e=e.closest("li")),h=d.slideCount%d.options.slidesToScroll!==0,f=h?0:(d.slideCount-d.currentSlide)%d.options.slidesToScroll,b.data.message){case"previous":g=0===f?d.options.slidesToScroll:d.options.slidesToShow-f,d.slideCount>d.options.slidesToShow&&d.slideHandler(d.currentSlide-g,!1,c);break;case"next":g=0===f?d.options.slidesToScroll:f,d.slideCount>d.options.slidesToShow&&d.slideHandler(d.currentSlide+g,!1,c);break;case"index":var i=0===b.data.index?0:b.data.index||e.index()*d.options.slidesToScroll;d.slideHandler(d.checkNavigable(i),!1,c),e.children().trigger("focus");break;default:return}},b.prototype.checkNavigable=function(a){var c,d,b=this;if(c=b.getNavigableIndexes(),d=0,a>c[c.length-1])a=c[c.length-1];else for(var e in c){if(a<c[e]){a=d;break}d=c[e]}return a},b.prototype.cleanUpEvents=function(){var b=this;b.options.dots&&null!==b.$dots&&a("li",b.$dots).off("click.slick",b.changeSlide).off("mouseenter.slick",a.proxy(b.interrupt,b,!0)).off("mouseleave.slick",a.proxy(b.interrupt,b,!1)),b.$slider.off("focus.slick blur.slick"),b.options.arrows===!0&&b.slideCount>b.options.slidesToShow&&(b.$prevArrow&&b.$prevArrow.off("click.slick",b.changeSlide),b.$nextArrow&&b.$nextArrow.off("click.slick",b.changeSlide)),b.$list.off("touchstart.slick mousedown.slick",b.swipeHandler),b.$list.off("touchmove.slick mousemove.slick",b.swipeHandler),b.$list.off("touchend.slick mouseup.slick",b.swipeHandler),b.$list.off("touchcancel.slick mouseleave.slick",b.swipeHandler),b.$list.off("click.slick",b.clickHandler),a(document).off(b.visibilityChange,b.visibility),b.cleanUpSlideEvents(),b.options.accessibility===!0&&b.$list.off("keydown.slick",b.keyHandler),b.options.focusOnSelect===!0&&a(b.$slideTrack).children().off("click.slick",b.selectHandler),a(window).off("orientationchange.slick.slick-"+b.instanceUid,b.orientationChange),a(window).off("resize.slick.slick-"+b.instanceUid,b.resize),a("[draggable!=true]",b.$slideTrack).off("dragstart",b.preventDefault),a(window).off("load.slick.slick-"+b.instanceUid,b.setPosition),a(document).off("ready.slick.slick-"+b.instanceUid,b.setPosition)},b.prototype.cleanUpSlideEvents=function(){var b=this;b.$list.off("mouseenter.slick",a.proxy(b.interrupt,b,!0)),b.$list.off("mouseleave.slick",a.proxy(b.interrupt,b,!1))},b.prototype.cleanUpRows=function(){var b,a=this;a.options.rows>1&&(b=a.$slides.children().children(),b.removeAttr("style"),a.$slider.empty().append(b))},b.prototype.clickHandler=function(a){var b=this;b.shouldClick===!1&&(a.stopImmediatePropagation(),a.stopPropagation(),a.preventDefault())},b.prototype.destroy=function(b){var c=this;c.autoPlayClear(),c.touchObject={},c.cleanUpEvents(),a(".slick-cloned",c.$slider).detach(),c.$dots&&c.$dots.remove(),c.$prevArrow&&c.$prevArrow.length&&(c.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),c.htmlExpr.test(c.options.prevArrow)&&c.$prevArrow.remove()),c.$nextArrow&&c.$nextArrow.length&&(c.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),c.htmlExpr.test(c.options.nextArrow)&&c.$nextArrow.remove()),c.$slides&&(c.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){a(this).attr("style",a(this).data("originalStyling"))}),c.$slideTrack.children(this.options.slide).detach(),c.$slideTrack.detach(),c.$list.detach(),c.$slider.append(c.$slides)),c.cleanUpRows(),c.$slider.removeClass("slick-slider"),c.$slider.removeClass("slick-initialized"),c.$slider.removeClass("slick-dotted"),c.unslicked=!0,b||c.$slider.trigger("destroy",[c])},b.prototype.disableTransition=function(a){var b=this,c={};c[b.transitionType]="",b.options.fade===!1?b.$slideTrack.css(c):b.$slides.eq(a).css(c)},b.prototype.fadeSlide=function(a,b){var c=this;c.cssTransitions===!1?(c.$slides.eq(a).css({zIndex:c.options.zIndex}),c.$slides.eq(a).animate({opacity:1},c.options.speed,c.options.easing,b)):(c.applyTransition(a),c.$slides.eq(a).css({opacity:1,zIndex:c.options.zIndex}),b&&setTimeout(function(){c.disableTransition(a),b.call()},c.options.speed))},b.prototype.fadeSlideOut=function(a){var b=this;b.cssTransitions===!1?b.$slides.eq(a).animate({opacity:0,zIndex:b.options.zIndex-2},b.options.speed,b.options.easing):(b.applyTransition(a),b.$slides.eq(a).css({opacity:0,zIndex:b.options.zIndex-2}))},b.prototype.filterSlides=b.prototype.slickFilter=function(a){var b=this;null!==a&&(b.$slidesCache=b.$slides,b.unload(),b.$slideTrack.children(this.options.slide).detach(),b.$slidesCache.filter(a).appendTo(b.$slideTrack),b.reinit())},b.prototype.focusHandler=function(){var b=this;b.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick","*:not(.slick-arrow)",function(c){c.stopImmediatePropagation();var d=a(this);setTimeout(function(){b.options.pauseOnFocus&&(b.focussed=d.is(":focus"),b.autoPlay())},0)})},b.prototype.getCurrent=b.prototype.slickCurrentSlide=function(){var a=this;return a.currentSlide},b.prototype.getDotCount=function(){var a=this,b=0,c=0,d=0;if(a.options.infinite===!0)for(;b<a.slideCount;)++d,b=c+a.options.slidesToScroll,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;else if(a.options.centerMode===!0)d=a.slideCount;else if(a.options.asNavFor)for(;b<a.slideCount;)++d,b=c+a.options.slidesToScroll,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;else d=1+Math.ceil((a.slideCount-a.options.slidesToShow)/a.options.slidesToScroll);return d-1},b.prototype.getLeft=function(a){var c,d,f,b=this,e=0;return b.slideOffset=0,d=b.$slides.first().outerHeight(!0),b.options.infinite===!0?(b.slideCount>b.options.slidesToShow&&(b.slideOffset=b.slideWidth*b.options.slidesToShow*-1,e=d*b.options.slidesToShow*-1),b.slideCount%b.options.slidesToScroll!==0&&a+b.options.slidesToScroll>b.slideCount&&b.slideCount>b.options.slidesToShow&&(a>b.slideCount?(b.slideOffset=(b.options.slidesToShow-(a-b.slideCount))*b.slideWidth*-1,e=(b.options.slidesToShow-(a-b.slideCount))*d*-1):(b.slideOffset=b.slideCount%b.options.slidesToScroll*b.slideWidth*-1,e=b.slideCount%b.options.slidesToScroll*d*-1))):a+b.options.slidesToShow>b.slideCount&&(b.slideOffset=(a+b.options.slidesToShow-b.slideCount)*b.slideWidth,e=(a+b.options.slidesToShow-b.slideCount)*d),b.slideCount<=b.options.slidesToShow&&(b.slideOffset=0,e=0),b.options.centerMode===!0&&b.options.infinite===!0?b.slideOffset+=b.slideWidth*Math.floor(b.options.slidesToShow/2)-b.slideWidth:b.options.centerMode===!0&&(b.slideOffset=0,b.slideOffset+=b.slideWidth*Math.floor(b.options.slidesToShow/2)),c=b.options.vertical===!1?a*b.slideWidth*-1+b.slideOffset:a*d*-1+e,b.options.variableWidth===!0&&(f=b.slideCount<=b.options.slidesToShow||b.options.infinite===!1?b.$slideTrack.children(".slick-slide").eq(a):b.$slideTrack.children(".slick-slide").eq(a+b.options.slidesToShow),c=b.options.rtl===!0?f[0]?-1*(b.$slideTrack.width()-f[0].offsetLeft-f.width()):0:f[0]?-1*f[0].offsetLeft:0,b.options.centerMode===!0&&(f=b.slideCount<=b.options.slidesToShow||b.options.infinite===!1?b.$slideTrack.children(".slick-slide").eq(a):b.$slideTrack.children(".slick-slide").eq(a+b.options.slidesToShow+1),c=b.options.rtl===!0?f[0]?-1*(b.$slideTrack.width()-f[0].offsetLeft-f.width()):0:f[0]?-1*f[0].offsetLeft:0,c+=(b.$list.width()-f.outerWidth())/2)),c},b.prototype.getOption=b.prototype.slickGetOption=function(a){var b=this;return b.options[a]},b.prototype.getNavigableIndexes=function(){var e,a=this,b=0,c=0,d=[];for(a.options.infinite===!1?e=a.slideCount:(b=-1*a.options.slidesToScroll,c=-1*a.options.slidesToScroll,e=2*a.slideCount);e>b;)d.push(b),b=c+a.options.slidesToScroll,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;return d},b.prototype.getSlick=function(){return this},b.prototype.getSlideCount=function(){var c,d,e,b=this;return e=b.options.centerMode===!0?b.slideWidth*Math.floor(b.options.slidesToShow/2):0,b.options.swipeToSlide===!0?(b.$slideTrack.find(".slick-slide").each(function(c,f){return f.offsetLeft-e+a(f).outerWidth()/2>-1*b.swipeLeft?(d=f,!1):void 0}),c=Math.abs(a(d).attr("data-slick-index")-b.currentSlide)||1):b.options.slidesToScroll},b.prototype.goTo=b.prototype.slickGoTo=function(a,b){var c=this;c.changeSlide({data:{message:"index",index:parseInt(a)}},b)},b.prototype.init=function(b){var c=this;a(c.$slider).hasClass("slick-initialized")||(a(c.$slider).addClass("slick-initialized"),c.buildRows(),c.buildOut(),c.setProps(),c.startLoad(),c.loadSlider(),c.initializeEvents(),c.updateArrows(),c.updateDots(),c.checkResponsive(!0),c.focusHandler()),b&&c.$slider.trigger("init",[c]),c.options.accessibility===!0&&c.initADA(),c.options.autoplay&&(c.paused=!1,c.autoPlay())},b.prototype.initADA=function(){var b=this;b.$slides.add(b.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),b.$slideTrack.attr("role","listbox"),b.$slides.not(b.$slideTrack.find(".slick-cloned")).each(function(c){a(this).attr({role:"option","aria-describedby":"slick-slide"+b.instanceUid+c})}),null!==b.$dots&&b.$dots.attr("role","tablist").find("li").each(function(c){a(this).attr({role:"presentation","aria-selected":"false","aria-controls":"navigation"+b.instanceUid+c,id:"slick-slide"+b.instanceUid+c})}).first().attr("aria-selected","true").end().find("button").attr("role","button").end().closest("div").attr("role","toolbar"),b.activateADA()},b.prototype.initArrowEvents=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},a.changeSlide),a.$nextArrow.off("click.slick").on("click.slick",{message:"next"},a.changeSlide))},b.prototype.initDotEvents=function(){var b=this;b.options.dots===!0&&b.slideCount>b.options.slidesToShow&&a("li",b.$dots).on("click.slick",{message:"index"},b.changeSlide),b.options.dots===!0&&b.options.pauseOnDotsHover===!0&&a("li",b.$dots).on("mouseenter.slick",a.proxy(b.interrupt,b,!0)).on("mouseleave.slick",a.proxy(b.interrupt,b,!1))},b.prototype.initSlideEvents=function(){var b=this;b.options.pauseOnHover&&(b.$list.on("mouseenter.slick",a.proxy(b.interrupt,b,!0)),b.$list.on("mouseleave.slick",a.proxy(b.interrupt,b,!1)))},b.prototype.initializeEvents=function(){var b=this;b.initArrowEvents(),b.initDotEvents(),b.initSlideEvents(),b.$list.on("touchstart.slick mousedown.slick",{action:"start"},b.swipeHandler),b.$list.on("touchmove.slick mousemove.slick",{action:"move"},b.swipeHandler),b.$list.on("touchend.slick mouseup.slick",{action:"end"},b.swipeHandler),b.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},b.swipeHandler),b.$list.on("click.slick",b.clickHandler),a(document).on(b.visibilityChange,a.proxy(b.visibility,b)),b.options.accessibility===!0&&b.$list.on("keydown.slick",b.keyHandler),b.options.focusOnSelect===!0&&a(b.$slideTrack).children().on("click.slick",b.selectHandler),a(window).on("orientationchange.slick.slick-"+b.instanceUid,a.proxy(b.orientationChange,b)),a(window).on("resize.slick.slick-"+b.instanceUid,a.proxy(b.resize,b)),a("[draggable!=true]",b.$slideTrack).on("dragstart",b.preventDefault),a(window).on("load.slick.slick-"+b.instanceUid,b.setPosition),a(document).on("ready.slick.slick-"+b.instanceUid,b.setPosition)},b.prototype.initUI=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.show(),a.$nextArrow.show()),a.options.dots===!0&&a.slideCount>a.options.slidesToShow&&a.$dots.show()},b.prototype.keyHandler=function(a){var b=this;a.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===a.keyCode&&b.options.accessibility===!0?b.changeSlide({data:{message:b.options.rtl===!0?"next":"previous"}}):39===a.keyCode&&b.options.accessibility===!0&&b.changeSlide({data:{message:b.options.rtl===!0?"previous":"next"}}))},b.prototype.lazyLoad=function(){function g(c){a("img[data-lazy]",c).each(function(){var c=a(this),d=a(this).attr("data-lazy"),e=document.createElement("img");e.onload=function(){c.animate({opacity:0},100,function(){c.attr("src",d).animate({opacity:1},200,function(){c.removeAttr("data-lazy").removeClass("slick-loading")}),b.$slider.trigger("lazyLoaded",[b,c,d])})},e.onerror=function(){c.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),b.$slider.trigger("lazyLoadError",[b,c,d])},e.src=d})}var c,d,e,f,b=this;b.options.centerMode===!0?b.options.infinite===!0?(e=b.currentSlide+(b.options.slidesToShow/2+1),f=e+b.options.slidesToShow+2):(e=Math.max(0,b.currentSlide-(b.options.slidesToShow/2+1)),f=2+(b.options.slidesToShow/2+1)+b.currentSlide):(e=b.options.infinite?b.options.slidesToShow+b.currentSlide:b.currentSlide,f=Math.ceil(e+b.options.slidesToShow),b.options.fade===!0&&(e>0&&e--,f<=b.slideCount&&f++)),c=b.$slider.find(".slick-slide").slice(e,f),g(c),b.slideCount<=b.options.slidesToShow?(d=b.$slider.find(".slick-slide"),g(d)):b.currentSlide>=b.slideCount-b.options.slidesToShow?(d=b.$slider.find(".slick-cloned").slice(0,b.options.slidesToShow),g(d)):0===b.currentSlide&&(d=b.$slider.find(".slick-cloned").slice(-1*b.options.slidesToShow),g(d))},b.prototype.loadSlider=function(){var a=this;a.setPosition(),a.$slideTrack.css({opacity:1}),a.$slider.removeClass("slick-loading"),a.initUI(),"progressive"===a.options.lazyLoad&&a.progressiveLazyLoad()},b.prototype.next=b.prototype.slickNext=function(){var a=this;a.changeSlide({data:{message:"next"}})},b.prototype.orientationChange=function(){var a=this;a.checkResponsive(),a.setPosition()},b.prototype.pause=b.prototype.slickPause=function(){var a=this;a.autoPlayClear(),a.paused=!0},b.prototype.play=b.prototype.slickPlay=function(){var a=this;a.autoPlay(),a.options.autoplay=!0,a.paused=!1,a.focussed=!1,a.interrupted=!1},b.prototype.postSlide=function(a){var b=this;b.unslicked||(b.$slider.trigger("afterChange",[b,a]),b.animating=!1,b.setPosition(),b.swipeLeft=null,b.options.autoplay&&b.autoPlay(),b.options.accessibility===!0&&b.initADA())},b.prototype.prev=b.prototype.slickPrev=function(){var a=this;a.changeSlide({data:{message:"previous"}})},b.prototype.preventDefault=function(a){a.preventDefault()},b.prototype.progressiveLazyLoad=function(b){b=b||1;var e,f,g,c=this,d=a("img[data-lazy]",c.$slider);d.length?(e=d.first(),f=e.attr("data-lazy"),g=document.createElement("img"),g.onload=function(){e.attr("src",f).removeAttr("data-lazy").removeClass("slick-loading"),c.options.adaptiveHeight===!0&&c.setPosition(),c.$slider.trigger("lazyLoaded",[c,e,f]),c.progressiveLazyLoad()},g.onerror=function(){3>b?setTimeout(function(){c.progressiveLazyLoad(b+1)},500):(e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),c.$slider.trigger("lazyLoadError",[c,e,f]),c.progressiveLazyLoad())},g.src=f):c.$slider.trigger("allImagesLoaded",[c])},b.prototype.refresh=function(b){var d,e,c=this;e=c.slideCount-c.options.slidesToShow,!c.options.infinite&&c.currentSlide>e&&(c.currentSlide=e),c.slideCount<=c.options.slidesToShow&&(c.currentSlide=0),d=c.currentSlide,c.destroy(!0),a.extend(c,c.initials,{currentSlide:d}),c.init(),b||c.changeSlide({data:{message:"index",index:d}},!1)},b.prototype.registerBreakpoints=function(){var c,d,e,b=this,f=b.options.responsive||null;if("array"===a.type(f)&&f.length){b.respondTo=b.options.respondTo||"window";for(c in f)if(e=b.breakpoints.length-1,d=f[c].breakpoint,f.hasOwnProperty(c)){for(;e>=0;)b.breakpoints[e]&&b.breakpoints[e]===d&&b.breakpoints.splice(e,1),e--;b.breakpoints.push(d),b.breakpointSettings[d]=f[c].settings}b.breakpoints.sort(function(a,c){return b.options.mobileFirst?a-c:c-a})}},b.prototype.reinit=function(){var b=this;b.$slides=b.$slideTrack.children(b.options.slide).addClass("slick-slide"),b.slideCount=b.$slides.length,b.currentSlide>=b.slideCount&&0!==b.currentSlide&&(b.currentSlide=b.currentSlide-b.options.slidesToScroll),b.slideCount<=b.options.slidesToShow&&(b.currentSlide=0),b.registerBreakpoints(),b.setProps(),b.setupInfinite(),b.buildArrows(),b.updateArrows(),b.initArrowEvents(),b.buildDots(),b.updateDots(),b.initDotEvents(),b.cleanUpSlideEvents(),b.initSlideEvents(),b.checkResponsive(!1,!0),b.options.focusOnSelect===!0&&a(b.$slideTrack).children().on("click.slick",b.selectHandler),b.setSlideClasses("number"==typeof b.currentSlide?b.currentSlide:0),b.setPosition(),b.focusHandler(),b.paused=!b.options.autoplay,b.autoPlay(),b.$slider.trigger("reInit",[b])},b.prototype.resize=function(){var b=this;a(window).width()!==b.windowWidth&&(clearTimeout(b.windowDelay),b.windowDelay=window.setTimeout(function(){b.windowWidth=a(window).width(),b.checkResponsive(),b.unslicked||b.setPosition()},50))},b.prototype.removeSlide=b.prototype.slickRemove=function(a,b,c){var d=this;return"boolean"==typeof a?(b=a,a=b===!0?0:d.slideCount-1):a=b===!0?--a:a,d.slideCount<1||0>a||a>d.slideCount-1?!1:(d.unload(),c===!0?d.$slideTrack.children().remove():d.$slideTrack.children(this.options.slide).eq(a).remove(),d.$slides=d.$slideTrack.children(this.options.slide),d.$slideTrack.children(this.options.slide).detach(),d.$slideTrack.append(d.$slides),d.$slidesCache=d.$slides,void d.reinit())},b.prototype.setCSS=function(a){var d,e,b=this,c={};b.options.rtl===!0&&(a=-a),d="left"==b.positionProp?Math.ceil(a)+"px":"0px",e="top"==b.positionProp?Math.ceil(a)+"px":"0px",c[b.positionProp]=a,b.transformsEnabled===!1?b.$slideTrack.css(c):(c={},b.cssTransitions===!1?(c[b.animType]="translate("+d+", "+e+")",b.$slideTrack.css(c)):(c[b.animType]="translate3d("+d+", "+e+", 0px)",b.$slideTrack.css(c)))},b.prototype.setDimensions=function(){var a=this;a.options.vertical===!1?a.options.centerMode===!0&&a.$list.css({padding:"0px "+a.options.centerPadding}):(a.$list.height(a.$slides.first().outerHeight(!0)*a.options.slidesToShow),a.options.centerMode===!0&&a.$list.css({padding:a.options.centerPadding+" 0px"})),a.listWidth=a.$list.width(),a.listHeight=a.$list.height(),a.options.vertical===!1&&a.options.variableWidth===!1?(a.slideWidth=Math.ceil(a.listWidth/a.options.slidesToShow),a.$slideTrack.width(Math.ceil(a.slideWidth*a.$slideTrack.children(".slick-slide").length))):a.options.variableWidth===!0?a.$slideTrack.width(5e3*a.slideCount):(a.slideWidth=Math.ceil(a.listWidth),a.$slideTrack.height(Math.ceil(a.$slides.first().outerHeight(!0)*a.$slideTrack.children(".slick-slide").length)));var b=a.$slides.first().outerWidth(!0)-a.$slides.first().width();a.options.variableWidth===!1&&a.$slideTrack.children(".slick-slide").width(a.slideWidth-b)},b.prototype.setFade=function(){var c,b=this;b.$slides.each(function(d,e){c=b.slideWidth*d*-1,b.options.rtl===!0?a(e).css({position:"relative",right:c,top:0,zIndex:b.options.zIndex-2,opacity:0}):a(e).css({position:"relative",left:c,top:0,zIndex:b.options.zIndex-2,opacity:0})}),b.$slides.eq(b.currentSlide).css({zIndex:b.options.zIndex-1,opacity:1})},b.prototype.setHeight=function(){var a=this;if(1===a.options.slidesToShow&&a.options.adaptiveHeight===!0&&a.options.vertical===!1){var b=a.$slides.eq(a.currentSlide).outerHeight(!0);a.$list.css("height",b)}},b.prototype.setOption=b.prototype.slickSetOption=function(){var c,d,e,f,h,b=this,g=!1;if("object"===a.type(arguments[0])?(e=arguments[0],g=arguments[1],h="multiple"):"string"===a.type(arguments[0])&&(e=arguments[0],f=arguments[1],g=arguments[2],"responsive"===arguments[0]&&"array"===a.type(arguments[1])?h="responsive":"undefined"!=typeof arguments[1]&&(h="single")),"single"===h)b.options[e]=f;else if("multiple"===h)a.each(e,function(a,c){b.options[a]=c});else if("responsive"===h)for(d in f)if("array"!==a.type(b.options.responsive))b.options.responsive=[f[d]];else{for(c=b.options.responsive.length-1;c>=0;)b.options.responsive[c].breakpoint===f[d].breakpoint&&b.options.responsive.splice(c,1),c--;b.options.responsive.push(f[d])}g&&(b.unload(),b.reinit())},b.prototype.setPosition=function(){var a=this;a.setDimensions(),a.setHeight(),a.options.fade===!1?a.setCSS(a.getLeft(a.currentSlide)):a.setFade(),a.$slider.trigger("setPosition",[a])},b.prototype.setProps=function(){var a=this,b=document.body.style;a.positionProp=a.options.vertical===!0?"top":"left","top"===a.positionProp?a.$slider.addClass("slick-vertical"):a.$slider.removeClass("slick-vertical"),(void 0!==b.WebkitTransition||void 0!==b.MozTransition||void 0!==b.msTransition)&&a.options.useCSS===!0&&(a.cssTransitions=!0),a.options.fade&&("number"==typeof a.options.zIndex?a.options.zIndex<3&&(a.options.zIndex=3):a.options.zIndex=a.defaults.zIndex),void 0!==b.OTransform&&(a.animType="OTransform",a.transformType="-o-transform",a.transitionType="OTransition",void 0===b.perspectiveProperty&&void 0===b.webkitPerspective&&(a.animType=!1)),void 0!==b.MozTransform&&(a.animType="MozTransform",a.transformType="-moz-transform",a.transitionType="MozTransition",void 0===b.perspectiveProperty&&void 0===b.MozPerspective&&(a.animType=!1)),void 0!==b.webkitTransform&&(a.animType="webkitTransform",a.transformType="-webkit-transform",a.transitionType="webkitTransition",void 0===b.perspectiveProperty&&void 0===b.webkitPerspective&&(a.animType=!1)),void 0!==b.msTransform&&(a.animType="msTransform",a.transformType="-ms-transform",a.transitionType="msTransition",void 0===b.msTransform&&(a.animType=!1)),void 0!==b.transform&&a.animType!==!1&&(a.animType="transform",a.transformType="transform",a.transitionType="transition"),a.transformsEnabled=a.options.useTransform&&null!==a.animType&&a.animType!==!1},b.prototype.setSlideClasses=function(a){var c,d,e,f,b=this;d=b.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),b.$slides.eq(a).addClass("slick-current"),b.options.centerMode===!0?(c=Math.floor(b.options.slidesToShow/2),b.options.infinite===!0&&(a>=c&&a<=b.slideCount-1-c?b.$slides.slice(a-c,a+c+1).addClass("slick-active").attr("aria-hidden","false"):(e=b.options.slidesToShow+a,
d.slice(e-c+1,e+c+2).addClass("slick-active").attr("aria-hidden","false")),0===a?d.eq(d.length-1-b.options.slidesToShow).addClass("slick-center"):a===b.slideCount-1&&d.eq(b.options.slidesToShow).addClass("slick-center")),b.$slides.eq(a).addClass("slick-center")):a>=0&&a<=b.slideCount-b.options.slidesToShow?b.$slides.slice(a,a+b.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):d.length<=b.options.slidesToShow?d.addClass("slick-active").attr("aria-hidden","false"):(f=b.slideCount%b.options.slidesToShow,e=b.options.infinite===!0?b.options.slidesToShow+a:a,b.options.slidesToShow==b.options.slidesToScroll&&b.slideCount-a<b.options.slidesToShow?d.slice(e-(b.options.slidesToShow-f),e+f).addClass("slick-active").attr("aria-hidden","false"):d.slice(e,e+b.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false")),"ondemand"===b.options.lazyLoad&&b.lazyLoad()},b.prototype.setupInfinite=function(){var c,d,e,b=this;if(b.options.fade===!0&&(b.options.centerMode=!1),b.options.infinite===!0&&b.options.fade===!1&&(d=null,b.slideCount>b.options.slidesToShow)){for(e=b.options.centerMode===!0?b.options.slidesToShow+1:b.options.slidesToShow,c=b.slideCount;c>b.slideCount-e;c-=1)d=c-1,a(b.$slides[d]).clone(!0).attr("id","").attr("data-slick-index",d-b.slideCount).prependTo(b.$slideTrack).addClass("slick-cloned");for(c=0;e>c;c+=1)d=c,a(b.$slides[d]).clone(!0).attr("id","").attr("data-slick-index",d+b.slideCount).appendTo(b.$slideTrack).addClass("slick-cloned");b.$slideTrack.find(".slick-cloned").find("[id]").each(function(){a(this).attr("id","")})}},b.prototype.interrupt=function(a){var b=this;a||b.autoPlay(),b.interrupted=a},b.prototype.selectHandler=function(b){var c=this,d=a(b.target).is(".slick-slide")?a(b.target):a(b.target).parents(".slick-slide"),e=parseInt(d.attr("data-slick-index"));return e||(e=0),c.slideCount<=c.options.slidesToShow?(c.setSlideClasses(e),void c.asNavFor(e)):void c.slideHandler(e)},b.prototype.slideHandler=function(a,b,c){var d,e,f,g,j,h=null,i=this;return b=b||!1,i.animating===!0&&i.options.waitForAnimate===!0||i.options.fade===!0&&i.currentSlide===a||i.slideCount<=i.options.slidesToShow?void 0:(b===!1&&i.asNavFor(a),d=a,h=i.getLeft(d),g=i.getLeft(i.currentSlide),i.currentLeft=null===i.swipeLeft?g:i.swipeLeft,i.options.infinite===!1&&i.options.centerMode===!1&&(0>a||a>i.getDotCount()*i.options.slidesToScroll)?void(i.options.fade===!1&&(d=i.currentSlide,c!==!0?i.animateSlide(g,function(){i.postSlide(d)}):i.postSlide(d))):i.options.infinite===!1&&i.options.centerMode===!0&&(0>a||a>i.slideCount-i.options.slidesToScroll)?void(i.options.fade===!1&&(d=i.currentSlide,c!==!0?i.animateSlide(g,function(){i.postSlide(d)}):i.postSlide(d))):(i.options.autoplay&&clearInterval(i.autoPlayTimer),e=0>d?i.slideCount%i.options.slidesToScroll!==0?i.slideCount-i.slideCount%i.options.slidesToScroll:i.slideCount+d:d>=i.slideCount?i.slideCount%i.options.slidesToScroll!==0?0:d-i.slideCount:d,i.animating=!0,i.$slider.trigger("beforeChange",[i,i.currentSlide,e]),f=i.currentSlide,i.currentSlide=e,i.setSlideClasses(i.currentSlide),i.options.asNavFor&&(j=i.getNavTarget(),j=j.slick("getSlick"),j.slideCount<=j.options.slidesToShow&&j.setSlideClasses(i.currentSlide)),i.updateDots(),i.updateArrows(),i.options.fade===!0?(c!==!0?(i.fadeSlideOut(f),i.fadeSlide(e,function(){i.postSlide(e)})):i.postSlide(e),void i.animateHeight()):void(c!==!0?i.animateSlide(h,function(){i.postSlide(e)}):i.postSlide(e))))},b.prototype.startLoad=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.hide(),a.$nextArrow.hide()),a.options.dots===!0&&a.slideCount>a.options.slidesToShow&&a.$dots.hide(),a.$slider.addClass("slick-loading")},b.prototype.swipeDirection=function(){var a,b,c,d,e=this;return a=e.touchObject.startX-e.touchObject.curX,b=e.touchObject.startY-e.touchObject.curY,c=Math.atan2(b,a),d=Math.round(180*c/Math.PI),0>d&&(d=360-Math.abs(d)),45>=d&&d>=0?e.options.rtl===!1?"left":"right":360>=d&&d>=315?e.options.rtl===!1?"left":"right":d>=135&&225>=d?e.options.rtl===!1?"right":"left":e.options.verticalSwiping===!0?d>=35&&135>=d?"down":"up":"vertical"},b.prototype.swipeEnd=function(a){var c,d,b=this;if(b.dragging=!1,b.interrupted=!1,b.shouldClick=b.touchObject.swipeLength>10?!1:!0,void 0===b.touchObject.curX)return!1;if(b.touchObject.edgeHit===!0&&b.$slider.trigger("edge",[b,b.swipeDirection()]),b.touchObject.swipeLength>=b.touchObject.minSwipe){switch(d=b.swipeDirection()){case"left":case"down":c=b.options.swipeToSlide?b.checkNavigable(b.currentSlide+b.getSlideCount()):b.currentSlide+b.getSlideCount(),b.currentDirection=0;break;case"right":case"up":c=b.options.swipeToSlide?b.checkNavigable(b.currentSlide-b.getSlideCount()):b.currentSlide-b.getSlideCount(),b.currentDirection=1}"vertical"!=d&&(b.slideHandler(c),b.touchObject={},b.$slider.trigger("swipe",[b,d]))}else b.touchObject.startX!==b.touchObject.curX&&(b.slideHandler(b.currentSlide),b.touchObject={})},b.prototype.swipeHandler=function(a){var b=this;if(!(b.options.swipe===!1||"ontouchend"in document&&b.options.swipe===!1||b.options.draggable===!1&&-1!==a.type.indexOf("mouse")))switch(b.touchObject.fingerCount=a.originalEvent&&void 0!==a.originalEvent.touches?a.originalEvent.touches.length:1,b.touchObject.minSwipe=b.listWidth/b.options.touchThreshold,b.options.verticalSwiping===!0&&(b.touchObject.minSwipe=b.listHeight/b.options.touchThreshold),a.data.action){case"start":b.swipeStart(a);break;case"move":b.swipeMove(a);break;case"end":b.swipeEnd(a)}},b.prototype.swipeMove=function(a){var d,e,f,g,h,b=this;return h=void 0!==a.originalEvent?a.originalEvent.touches:null,!b.dragging||h&&1!==h.length?!1:(d=b.getLeft(b.currentSlide),b.touchObject.curX=void 0!==h?h[0].pageX:a.clientX,b.touchObject.curY=void 0!==h?h[0].pageY:a.clientY,b.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(b.touchObject.curX-b.touchObject.startX,2))),b.options.verticalSwiping===!0&&(b.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(b.touchObject.curY-b.touchObject.startY,2)))),e=b.swipeDirection(),"vertical"!==e?(void 0!==a.originalEvent&&b.touchObject.swipeLength>4&&a.preventDefault(),g=(b.options.rtl===!1?1:-1)*(b.touchObject.curX>b.touchObject.startX?1:-1),b.options.verticalSwiping===!0&&(g=b.touchObject.curY>b.touchObject.startY?1:-1),f=b.touchObject.swipeLength,b.touchObject.edgeHit=!1,b.options.infinite===!1&&(0===b.currentSlide&&"right"===e||b.currentSlide>=b.getDotCount()&&"left"===e)&&(f=b.touchObject.swipeLength*b.options.edgeFriction,b.touchObject.edgeHit=!0),b.options.vertical===!1?b.swipeLeft=d+f*g:b.swipeLeft=d+f*(b.$list.height()/b.listWidth)*g,b.options.verticalSwiping===!0&&(b.swipeLeft=d+f*g),b.options.fade===!0||b.options.touchMove===!1?!1:b.animating===!0?(b.swipeLeft=null,!1):void b.setCSS(b.swipeLeft)):void 0)},b.prototype.swipeStart=function(a){var c,b=this;return b.interrupted=!0,1!==b.touchObject.fingerCount||b.slideCount<=b.options.slidesToShow?(b.touchObject={},!1):(void 0!==a.originalEvent&&void 0!==a.originalEvent.touches&&(c=a.originalEvent.touches[0]),b.touchObject.startX=b.touchObject.curX=void 0!==c?c.pageX:a.clientX,b.touchObject.startY=b.touchObject.curY=void 0!==c?c.pageY:a.clientY,void(b.dragging=!0))},b.prototype.unfilterSlides=b.prototype.slickUnfilter=function(){var a=this;null!==a.$slidesCache&&(a.unload(),a.$slideTrack.children(this.options.slide).detach(),a.$slidesCache.appendTo(a.$slideTrack),a.reinit())},b.prototype.unload=function(){var b=this;a(".slick-cloned",b.$slider).remove(),b.$dots&&b.$dots.remove(),b.$prevArrow&&b.htmlExpr.test(b.options.prevArrow)&&b.$prevArrow.remove(),b.$nextArrow&&b.htmlExpr.test(b.options.nextArrow)&&b.$nextArrow.remove(),b.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},b.prototype.unslick=function(a){var b=this;b.$slider.trigger("unslick",[b,a]),b.destroy()},b.prototype.updateArrows=function(){var b,a=this;b=Math.floor(a.options.slidesToShow/2),a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&!a.options.infinite&&(a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===a.currentSlide?(a.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):a.currentSlide>=a.slideCount-a.options.slidesToShow&&a.options.centerMode===!1?(a.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):a.currentSlide>=a.slideCount-1&&a.options.centerMode===!0&&(a.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},b.prototype.updateDots=function(){var a=this;null!==a.$dots&&(a.$dots.find("li").removeClass("slick-active").attr("aria-hidden","true"),a.$dots.find("li").eq(Math.floor(a.currentSlide/a.options.slidesToScroll)).addClass("slick-active").attr("aria-hidden","false"))},b.prototype.visibility=function(){var a=this;a.options.autoplay&&(document[a.hidden]?a.interrupted=!0:a.interrupted=!1)},a.fn.slick=function(){var f,g,a=this,c=arguments[0],d=Array.prototype.slice.call(arguments,1),e=a.length;for(f=0;e>f;f++)if("object"==typeof c||"undefined"==typeof c?a[f].slick=new b(a[f],c):g=a[f].slick[c].apply(a[f].slick,d),"undefined"!=typeof g)return g;return a}});
(function ($, document) {

	$.fn.popup = function (options) {
		options = $.extend({}, $.fn.popup.options, options);
		var $body = $('body');
		var $document = $(document);
		var $old_popup = $('.popup');
		var scrollbarWidth = getScrollbarWidth();
		var isBodyOverflowing = document.body.clientWidth < window.innerWidth;

		function closeByEsc(e) {
			if (e.keyCode == 27) {
				$('.popup').trigger('click');
			}
		}

		function getScrollbarWidth() {
			var scrollDiv = document.createElement('div');
			scrollDiv.className = 'popup-scrollbar-measure';
			document.body.appendChild(scrollDiv);
			var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
			document.body.removeChild(scrollDiv);
			return scrollbarWidth;
		}

		$document.on('showPopup', function (e, params) {
			var $popup = $(params.id);
			var $popup_wrapper = $popup.find('.popup__wrapper');

			if ($old_popup.is(':visible')) {
				$body.removeClass(options.bodyClassName).removeClass(options.animateClassName);
				//$old_popup.off('click').hide();
				$old_popup.off('click').hide().removeClass('is-show');
			}

			if (typeof options.beforeShow === 'function') {
				options.beforeShow($popup, $popup_wrapper, params.$link);
			}

			if (isBodyOverflowing) {
				var actualPadding = document.body.style.paddingRight;
				var calculatedPadding = $body.css('padding-right');
				$body.data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + scrollbarWidth + 'px');
			}

			//$popup.show();
			$popup.show().addClass('is-show');
			//$popup_wrapper.scrollTop(0);
			$body.addClass(options.bodyClassName).addClass(options.animateClassName);

			setTimeout(function () {
				$body.removeClass(options.animateClassName);
				$document.on('keyup', closeByEsc);
			}, 600);

			$popup.on('click', function (e) {
				var $target = $(e.target);
				var $parent = $target.parents('.popup__content');
				var $close = $target.parents('.js-close-popup');
				if ((!$target.hasClass('popup__content') && !$parent.length) || $target.hasClass('js-close-popup') || $close.length) {
					e.preventDefault();
					$body.addClass('animation-popup-out');
					setTimeout(function () {
						var padding = $body.data('padding-right');
						if (typeof padding !== 'undefined') {
							$body.css('padding-right', padding).removeData('padding-right');
						}
						$popup.off('click').hide();
						$body.removeClass(options.bodyClassName).removeClass('animation-popup-out');
						$document.off('keyup', closeByEsc);
					}, 600);
				}
			});
		});

		return $(this).each(function () {
			var $link = $(this);
			$link.on('click', function (e) {
				e.preventDefault();
				$document.trigger('showPopup', {
					$link: $link,
					id: $link.data('popup_id')
				});
			});
		});
	};

	$.fn.popup.options = {
		animateClassName: 'animation-popup',
		bodyClassName: 'body-fixed',
		beforeShow: null,
		afterShow: null
	};

})(jQuery, document);

(function ($) {
	$.fn.validate = function (options) {
		options = $.extend({}, $.fn.validate.options, options);

		return $(this).each(function () {
			var $form = $(this);
			var $button = $form.find('[type="sub2mit"]');
			var $inputs = $form.find('input, textarea');
			
			var fulled = function ($this) {
				$this.each(function () {
					var $input = $(this);
					var value = $.trim($input.val());
					if (value.toString().length > 0) {
						$input.addClass('is-full');
					} else {
						$input.removeClass('is-full');
					}
				});
			};
			var callback = function () {
				$button
					.html($button.data('html'))
					.data('html', null)
					.prop('disabled', false)
					.css('background-color', '');
			};
			if (typeof $button.data('preloader') !== "undefined") {
				var preloader = new Image();
				preloader.src = $button.data('preloader');
			}
			$('.input-phone', $form).mask('+7 (999) 999 99 99', {
				placeholder: " "
			});
			$('.input-time', $form).mask('99:99', {
				placeholder: " "
			});
			/*$inputs.on('input blur change keyup', function () {
				check($(this));
				fulled($(this));
			});*/
			$inputs.on('blur change', function () {
				check($(this));
				fulled($(this));
			});
			fulled($inputs);

			$button.off('click').on('click', function (e) {
				e.preventDefault();
				check($inputs);
				if ($button.is(':disabled')) {
					return;
				}
				$button.data('html', $button.html()).prop('disabled', true);
				if (typeof $button.data('preloader') !== "undefined") {
					$button.html('<img src="' + preloader.src + '" alt="...">').css('background-color', '#efefef');
				}
				if (typeof options.onSend === 'function') {
					options.onSend($form, new FormData($form.get(0)), callback);
				}
			});
		});
	};
	$.fn.validate.options = {
		errorClass: 'form-group--error',
		onSend: null
	};
})(jQuery);


(function ($) {
	$.fn.tabs = function (options) {
		options = $.extend({}, $.fn.tabs.options, options);

		return $(this).each(function () {
			var $tabs = $(this);
			$(options.tabSelectorClick, $tabs).on('click', function (e) {
				e.preventDefault();
				var $this = $(this);
				if (!$this.hasClass(options.activeClass)) {
					$(options.tabSelector, $tabs).removeClass(options.activeClass);
					$(options.tabSelectorClick, $tabs).removeClass(options.activeClass);
					$this.addClass(options.activeClass);
					$this.parent(options.tabSelector).addClass(options.activeClass);
					$(options.tabSelectorContent, $tabs).hide();
					var $tab_content = $($this.attr('href'), $tabs);
					$tab_content.show();
					if (typeof options.afterShow === 'function') {
						options.afterShow($this, $tab_content, $tabs);
					}
				}
			}).eq(0).trigger('click');
		});
	};
	$.fn.tabs.options = {
		activeClass: 'active',
		tabSelector: '.tabs__item',
		tabSelectorClick: '.tabs__item>a',
		tabSelectorContent: '.tabs__content',
		afterShow: null
	};
})(jQuery);


$(function () {
	$('.form-select').selectBoxIt({
		autoWidth: false
	});

	$('.js-open-popup').popup({
		beforeShow: function ($popup, $popup_wrapper, $link) {
			if ($link.hasClass('schedule__item')) {
				$popup_wrapper.find('.schedule__item-popup').html($link.find('.schedule__item-hidden').html());
			}
			var $popupText = $('.popup__club-text', $popup);
			if ($popupText.length) {
				$popupText.mCustomScrollbar({
					setHeight: 392,
					callbacks: {
						whileScrolling: function () {
							if (this.mcs.topPct > 90) {
								$popupText.addClass('is-bottom');
							} else {
								$popupText.removeClass('is-bottom');
							}
						}
					}
				});
			}
		}
	});

	$('.form').validate({
		onSend: function ($form, data, callback) {
			$(document).trigger('sendForm', {
				$form: $form,
				data: data,
				callback: callback,
				callbackSuccess: function () {
					var $popup = $form.parents('.popup');
					if ($popup.length) {
						$popup.find('.form').hide();
						$popup.find('.form__success').show();
					} else {
						$(document).trigger('showPopup', {
							$link: $form,
							id: '#popup-success'
						});
					}
				}
			});
		}
	});

	(function ($popover) {
		if (!$popover.length) {
			return;
		}

		$popover.popover({
			content: function () {
				var $this = $(this);
				return $($this.data('contentId')).html();
			},
			placement: 'auto right',
			html: true,
			container: 'body',
			trigger: 'focus',
			template: '<div class="popover" role="tooltip"><a href="#" class="popover-close"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">' +
			'<g><path d="M12.596.353l2.83 2.83-12.022 12.02-2.828-2.83z"></path><path d="M3.404.353l-2.83 2.83 12.022 12.02 2.828-2.83z"></path></g>' +
			'</svg></a><div class="popover-content"></div></div>'
		});

		$(document).on('click', '.popover-close', function (e) {
			e.preventDefault();
			$popover.popover('hide');
		});

		$(window).on('resize', function () {
			$popover.popover('hide');
		});

	})($('[data-toggle="popover"]'));

	(function ($sb) {
		if (!$sb.length) {
			return;
		}

		$('.slider__club', $sb).slick({
			slidesToShow: 1,
			fade: true,
			autoplay: false,
			dots: false,
			swipe: false,
			speed: 0,
			prevArrow: $('.slider__club-arrow-l', $sb),
			nextArrow: $('.slider__club-arrow-r', $sb)
		});
	})($('.slider__block'));

	(function ($tb) {
		if (!$tb.length) {
			return;
		}
		$tb.tabs({
			activeClass: 'is-active',
			//tabSelector: '.h2',
			tabSelectorClick: '.tab__title',
			tabSelectorContent: '.tab__block-item',
			afterShow: function ($tab, $tab_content, $tabs) {
				var $slider = $('.slider__club');
				var id = $tab.attr('href').replace('#', '');
				if ($slider.length) {
					$slider.slick('slickUnfilter');
					$slider.slick('slickFilter', '.is-' + id);
				}
			}
		});

		$('.card__desc', $tb).tabs({
			activeClass: 'is-active',
			//tabSelector: '.h2',
			tabSelectorClick: '.tab__list-title',
			tabSelectorContent: '.tab__list-item'
		})

	})($('.tab__block'));

	(function ($adv) {
		if (!$adv.length) {
			return;
		}

		var $slider = $('.advantages__slider', $adv);
		var $wrapper = $('.wrapper', $adv);
		var left = $wrapper.offset().left;
		left += parseInt($wrapper.css('paddingLeft'), 10);

		$('.advantages__slider-item', $slider).eq(0).css('paddingLeft', left + 'px');

		$slider.flickity({
			cellAlign: 'center',
			contain: true,
			resize: true,
			percentPosition: false,
			pageDots: false,
			groupCells: true,
			prevNextButtons: false
		});

		$slider.on( 'select.flickity', function() {
			var flkty = $slider.data('flickity');
			var $arrows = $('.advantages__arrow', $adv);
			$arrows.removeClass('slick-disabled');
			if(flkty.selectedIndex <= 0) {
				$('.advantages__arrow-l', $adv).addClass('slick-disabled');
			} else if(flkty.selectedIndex >= (flkty.slides.length - 1)) {
				$('.advantages__arrow-r', $adv).addClass('slick-disabled');
			}
		});

		$('.advantages__arrow-l', $adv).on( 'click', function(e) {
			e.preventDefault();
			$slider.flickity('previous');
		});
		$('.advantages__arrow-r', $adv).on( 'click', function(e) {
			e.preventDefault();
			$slider.flickity('next');
		});

		/*$slider.slick({
			slidesToShow: 1,
			infinite: false,
			//centerMode: true,
			variableWidth: true,
			dots: false,
			prevArrow: $('.advantages__arrow-l'),
			nextArrow: $('.advantages__arrow-r')
		});*/
	})($('.advantages'));

	(function ($ex) {
		if (!$ex.length) {
			return;
		}
		$('.extra__title', $ex).on('click', function (e) {
			e.preventDefault();
			var $exh = $(this).parents('.extra');
			$exh.toggleClass('is-open');
		});
	})($('.extra'));


	(function ($cs) {
		if (!$cs.length) {
			return;
		}

		$cs.each(function () {
			var $this = $(this);
			var $slider = $('.card__slider-range', $this);
			var $sliderTitle = $('.card__slider-title', $this);
			var $priceBlock = $this.next();
			var $priceCurrent = $('.new-price', $priceBlock);
			var $priceOld = $('.old-price', $priceBlock);
			var sliderData = $slider.data('values');
			var $linkHint = $('.link__hint', $priceBlock);
			if (typeof sliderData !== 'undefined' && Array.isArray(sliderData)) {
				var slider = $slider.get(0);
				var maxValue = sliderData.length;
				noUiSlider.create(slider, {
					start: 1,
					connect: [true, false],
					step: 1,
					range: {
						'min': 0,
						'max': maxValue
					}
				});
				slider.noUiSlider.on('update', function (values, handle, rawValues) {
					var value = parseInt(rawValues[0], 10);
					var key = value - 1;
					if (value < 1) {
						slider.noUiSlider.set(1);
						return;
					}
					if (typeof sliderData[key] === 'object') {
						var data = sliderData[key];
						$sliderTitle.html(data.text);
						$priceCurrent.html(data.price);
						if (data.priceOld === '') {
							$priceOld.css('visibility', 'hidden');
						} else {
							$priceOld.html(data.priceOld).css('visibility', 'visible');
						}
						if (data.popoverId) {
							$linkHint.data('contentId', data.popoverId);
							$linkHint.show();
						} else {
							$linkHint.hide();
						}
					}
				});
			}
		});
	})($('.card__slider'));

	(function ($cds) {
		if (!$cds.length) {
			return;
		}
		$('.special__link', $cds).on('click', function (e) {
			e.preventDefault();
			var $this = $(this);
			$this.parents('.card__desc-special').addClass('is-open');
		});

	})($('.card__desc-special'));


	(function ($s) {
		if (!$s.length) {
			return;
		}

		$s.slick({
			slidesToShow: 1,
			fade: true,
			autoplaySpeed: 2000,
			autoplay: false,
			dots: false,
			speed: 0,
			prevArrow: $('.slider__arrow-l', $s),
			nextArrow: $('.slider__arrow-r', $s)
		});

	})($('.slider'));

	(function ($ns) {
		if (!$ns.length) {
			return;
		}

		$('.news__slider-items', $ns).slick({
			slidesToShow: 1,
			fade: true,
			dots: false,
			speed: 0,
			prevArrow: $('.news__slider-arrow--l', $ns),
			nextArrow: $('.news__slider-arrow--r', $ns)
		});

	})($('.news__slider'));


	(function ($sch) {
		if (!$sch.length) {
			return;
		}
		$('.club__link-current', $sch).on('click', function (e) {
			e.preventDefault();
			var $this = $(this);
			var $parent = $this.parents('.club__link');
			if ($parent.hasClass('is-open')) {
				$parent.removeClass('is-open');
			} else {
				$('.club__link', $sch).removeClass('is-open');
				$parent.addClass('is-open');
			}
		});


		$('body').on('click', function (e) {
			var $target = $(e.target);
			if (!$target.hasClass('club__link') && !$target.parents('.club__link').length) {
				$('.club__link', $sch).removeClass('is-open');
			}
		});

		$('.selectpicker', $sch).each(function () {
			var $this = $(this);
			var titles = $this.data('titles').split(',');

			$this.on('rendered.bs.select', function () {
				var $dropdown = $this.prev();
				$dropdown.mCustomScrollbar({
					//setHeight: 330
				});
			});

			$this.selectpicker({
				size: false,
				countSelectedText: function (number) {
					var cases = [2, 0, 1, 1, 1, 2];
					return number + ' ' + titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
				}
			});
		});

		$('.filter-clean', $sch).on('click', function (e) {
			e.preventDefault();
			$('.selectpicker').selectpicker('deselectAll');
		});

	})($('.schedule'));

	
});



/* End */
;
; /* Start:"a:4:{s:4:"full";s:57:"/local/templates/.default/scripts/local.js?15184266487436";s:6:"source";s:42:"/local/templates/.default/scripts/local.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
!(function($, document, undefined) {
    $.fn.Uniform = function(options) {
        options = $.extend({}, $.fn.Uniform.options, options);
        this.each(function() {
            var $this = $(this);
            $this.data('uniform', new CUniform($this, options));
        })
    };

    // опции
  

 

  
  

  
})(window.jQuery, document);

var Analytics = function() {
    var self = this;
    // this.$document = $(document);
    self.values = {
        firstVisit: undefined,
        isMobile: undefined,
        hasAdBlock: undefined,
        gaUid: undefined,
        ymUid: undefined
    };

    self.setFirstVisit = function(val) {
        self.values.firstVisit = val;
    };
    self.getFirstVisit = function() {
        return self.values.firstVisit;
    };

    self.setIsMobile = function(val) {
        self.values.isMobile = val;
    };
    self.getIsMobile = function() {
        return self.values.isMobile;
    };

    self.setAdBlock = function(val) {
        self.values.hasAdBlock = val;
    };
    self.getAdBlock = function() {
        return self.values.hasAdBlock;
    };

    self.setGaUid = function(val) {
        self.values.gaUid = val;
    };
    self.getGaUid = function() {
        if (self.values.gaUid === undefined && typeof ga !== 'undefined') {
            var tracker = ga.getAll()[0];
            self.setGaUid(tracker.get('clientId'));
        }
        return self.values.gaUid;
    };

    self.setYmUid = function(val) {
        self.values.ymUid = val;
    };
    self.getYmUid = function() {
        if (self.values.ymUid === undefined && typeof yaCounter31728771 !== 'undefined') {
            self.setYmUid(yaCounter31728771.getClientID());
        }
        return self.values.ymUid;
    };

    window.onload = function() {
        self.setAdBlock(!$('#ad-detect:visible').length);
    };

    return self;
};

function getAnalyticsFormData($form)
{
    if (!$form.length) {
        return;
    }

    var center = '';
    var $clubSelectOption = $form.find('select[name=PROPERTY_CLUB_ID] option:selected');
    var $clubInput = $form.find('input:hidden[name=PROPERTY_CLUB_ID]');
    var phone = $form.find('input[name=PROPERTY_PHONE]').val();
    var clubCode = '';

    if ($clubSelectOption.length) {
        center = $clubSelectOption.text();
        clubCode = $clubSelectOption.data('clubCode');
    } else if($clubInput.length) {
        center = $clubInput.data('clubName');
        clubCode = $clubInput.data('clubCode');
    }

    var params = {phone: phone, center: center, clubCode: clubCode, formType: $form.data('type')};

    if (params.formType === 'card') {
        params.age = $form.find('[name=PROPERTY_CARD_TYPE]').val();
        params.card = $form.find('[name=PROPERTY_VISIT_TYPE]').val();
        var $tariff = $form.find('[name=PROPERTY_TARIFF]');
        if ($tariff.length === 1) {
            params.param3 = $tariff.val();
            params.tariff = $tariff.val();
        }
    }

    params.isMobile = window.analytics.getIsMobile();
    params.cid = window.analytics.getGaUid();
    params.gaUid = window.analytics.getGaUid();
    params.ymUid = window.analytics.getYmUid();

    return params;
}


/* End */
;
; /* Start:"a:4:{s:4:"full";s:56:"/local/templates/desktop/scripts/local.js?15617146862959";s:6:"source";s:41:"/local/templates/desktop/scripts/local.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/




/* End */
;; /* /local/templates/desktop/scripts/common.js?1524822301535973*/
; /* /local/templates/.default/scripts/local.js?15184266487436*/
; /* /local/templates/desktop/scripts/local.js?15617146862959*/
