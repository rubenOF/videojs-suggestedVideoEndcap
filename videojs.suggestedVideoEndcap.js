/**
 * Video.js Suggested Video Endcap
 * Created by Justin McCraw for New York Media LLC
 * License information: https://github.com/jmccraw/videojs-suggestedVideoEndcap/blob/master/LICENSE
 * Plugin details: https://github.com/jmccraw/videojs-suggestedVideoEndcap
 */

(function(videojs) {
  'use strict';

  videojs.registerPlugin('suggestedVideoEndcap', function(opts) {
    opts = opts || {
        header: 'You may also like…',
        file: '',
        suggestions: [
          {
            title: '',
            url: '',
            image: '',
            alt: '',
            target: '_self'
          }
        ]
      };
    var player = this;
    var _sve;

    /**
     * Generate the DOM elements for the suggested video endcap content
     * @type {function}
     */
    function constructSuggestedVideoEndcapContent() {
      var sugs = opts.suggestions;
      var _frag = document.createDocumentFragment();
      var _aside = document.createElement('aside');
      var _div = document.createElement('div');
      var _header = document.createElement('h5');
      // can only hold eight suggestions at a time
      var i = sugs.length - 1 > 7 ? 7 : sugs.length - 1;
      var _a;
      var _img;

      _aside.className = 'vjs-suggested-video-endcap';
      _div.className = 'vjs-suggested-video-endcap-container';

      _header.innerHTML = opts.header;
      _header.className = 'vjs-suggested-video-endcap-header';

      _aside.appendChild(_header);

      // construct the individual suggested content pieces
      for (; i >= 0; --i) {
        _a = document.createElement('a');
        _a.className = 'vjs-suggested-video-endcap-link';
        _a.href = sugs[i].url;
        _a.target = sugs[i].target || '_self';
        _a.title = sugs[i].title;

        _img = document.createElement('img');
        _img.className = 'vjs-suggested-video-endcap-img';
        _img.src = sugs[i].image;
        _img.alt = sugs[i].alt || sugs[i].title;
        _a.appendChild(_img);

        _a.innerHTML += sugs[i].title;

        _div.appendChild(_a);
      }

      _aside.appendChild(_div);
      _sve = _aside;
      _frag.appendChild(_aside);
      player.el().appendChild(_frag);
    }

    // attach VideoJS event handlers
    player.on('ended', function() {
      _sve.classList.add('is-active');
    });
    player.on('play', function() {
      _sve.classList.remove('is-active');
    });

    player.ready(function() {
      if (opts.file) {
        videojs.xhr({
          responseType: 'document',
          uri: opts.file,
          headers: {
            'Content-Type': 'application/xml'
          }
        }, function (err, resp, body) {
          var items = body.getElementsByTagName('item');

          opts.suggestions = [];
          for (var i = 0; i < items.length && i < 6; i++) {
            let item = items.item(i);
            let title = item.getElementsByTagName('title').item(0).innerHTML,
              url = item.getElementsByTagName('link').item(0).innerHTML,
              image = item.getElementsByTagName('media:thumbnail').item(0).getAttribute('url');

            opts.suggestions.push({
              title: title,
              url: url,
              image: image,
              alt: '',
              target: '_self'
            });
          }

          opts.suggestions.reverse();
          constructSuggestedVideoEndcapContent();
        });
      }
      else {
        constructSuggestedVideoEndcapContent();
      }
    });


  });
}(window.videojs));
