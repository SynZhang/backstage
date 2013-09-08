require(['app/crumb', 'jquery.tab', 'jquery.accordion'],
  function(breadcrumb) {
    var $html        = $('html'),
        crumb        = breadcrumb.getInstance(),
        $loading     = $('#loading'),
        offsetAside  = $('#switcher_aside_left').offset().left,
        isAsideShown = true;

    require(['app/main/common']);

    // 导航提示 @todo
    crumb.register($('.nav_major [data-toggle="tab"]'),
                    $(), 1);
    crumb.register($('.aside [data-toggle="accordion"]'),
                    $('.nav_major .is-tab-title_on > a'), 2);
    crumb.register($('#aside_left .menu-item'),
                    $('#aside_left .is-accordion-head_on'), 3);
    $('.aside .is-accordion-head_on').trigger('click.crumb');

    // 切换菜单激活样式
    $('#aside_left').find('.menu-item').on('click', function() {
      $('.menu-item').removeClass('is-menu-item_on');
      $(this).addClass('is-menu-item_on');
    });

    // 侧边栏切换显示／隐藏
    $('#switcher_aside_left').on('click', function() {
      isAsideShown = !isAsideShown;
      var offset = isAsideShown ? (0 - offsetAside) : offsetAside;

      $('#aside_left')[isAsideShown ? 'show' : 'hide']();

      $('#switcher_aside_left').css('left', function() {
        return $(this).offset().left - offset;
      });

      if (isAsideShown) {
        $('#switcher_aside_left').removeClass('is-switcher_vertical_off')
          .addClass('is-switcher_vertical_on');
      } else {
        $('#switcher_aside_left').removeClass('is-switcher_vertical_on')
          .addClass('is-switcher_vertical_off');
      }

      $('#maincontainer').css('left', function() {
        return $(this).offset().left - offset;
      });

      if ($html.hasClass('lt-ie7')) {
        fillWidthHeight('.maincontainer', 'width');
      }

      $('.crumb').css('left', function() {
        return $(this).offset().left - offset;
      });
    });

    /**
     * 兼容性处理
     */
    if ($html.hasClass('lt-ie7')) {
      // IE 6

      var params = [
          {
            selector: '.aside', // .aside 只有 line-height 的高度，没自适应剩余高度
            attribute: 'height'
          },
          {
            selector: '.maincontainer', // .maincontainer 宽度超出自身 left 大小的宽度，高度超出自身 top 大小的高度
            attribute: 'width'
          },
          {
            selector: '.maincontainer',
            attribute: 'height'
          },
          {
            selector: '.switcher_aside',
            attribute: 'height'
          }
        ];

      $(window).on('resize', function() {
        var length = params.length;
        for (var i = 0; i < length; i++) {
          var param = params[i];
          fillWidthHeight(param.selector, param.attribute);
        }
      });
      $(window).trigger('resize');
    } else if ($html.hasClass('lt-ie8') && !$html.hasClass('lt-ie7')) {
      // IE 7

      // .main(iframe) 高度没自适应为 100%
      $('.main').css('height', function() {
        return $(this).parent().height();
      });
    }

    /**
     * 补充剩余宽度或高度
     * @param  { Object } selector 选择器，指需要自适应宽度或高度的元素。
     * @param  { String } attribute 'width' 或者 'height'。
     * @return { Null }
     */
    function fillWidthHeight(selector, attribute) {
      var attr = attribute.toLowerCase();
      if (attr === 'width' || attr === 'height') {
        $(selector).css(attr, function() {
          return $(this).parent()[attr == 'width' ? 'width' : 'height']() -
            parseInt($(this).css(attr == 'width' ? 'left' : 'top'), 10) -
            parseInt($(this).css(attr == 'width' ? 'right' : 'bottom'), 10);
        });
      }
    }
});
