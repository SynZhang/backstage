/**
 * 表单验证
 * 加载 validator 后在待验证的 HTML 表单元素上添加参数配置。
 * @required validator - https://github.com/sofish/validator.js
 * @param {string} data-type 待验证项的数据类型
 * @param {string} data-validation-empty 验证为空时的提示信息
 * @param {string} data-validation-error 验证失败时的提示信息
 * @param {string} data-validation-placement {'top', 'right', 'bottom', 'left'} 提示信息显示在待验证项周围时的方位
 */

if ($.fn.validator) {
    var identifie = '[required]',
        // 匹配规则
        pattern = {
            'number': '^[1-9]\\d*$',
            'tel': '\\d{3}-\\d{8}|\\d{4}-\\d{7}',
            'mobilephone': '^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$',
            'idcard': '\\d{15}|\\d{18}',
            'qq': '[1-9][0-9]{4,}',
            'ip': '\\d+\\.\\d+\\.\\d+\\.\\d+',
            'zipcode': '[1-9]\\d{5}(?!\\d)'
        };

    // 表单验证初始化
    $('.form').validator();

    // 初始化与更新提示信息的内容与位置
    $(identifie).each(function() {
        var $self = $(this),
            $validation = $('<div>').addClass('validation')
                            .text($(this).data('validation-empty'))
                            .insertAfter(this),
            placement = $self.data('validation-placement'),
            type = $self.data('type'),
            top = $self.offset().top,
            left = $self.offset().left,
            validationTop = top,
            validationLeft = left;

        switch (placement) {
        case 'top':
            validationTop = top - $validation.outerHeight() - 6;
            break;
        case 'right':
            validationLeft = left + $self.outerWidth() + 6;
            break;
        case 'bottom':
            validationTop = top + $self.outerHeight() + 6;
            break;
        case 'left':
            validationLeft = left - $validation.outerWidth() - 6;
            break;
        }

        $validation.css({
            'top': validationTop,
            'left': validationLeft
        }).addClass('validation_' + placement);

        $(this).attr('pattern', pattern[$(this).data('type')]);
        $($self.data('linkage-trigger')).on('change', function() {
            var type = $(this).children('option[value=' + $(this).val() + ']')
                        .data('linkage-type');
            $self.attr('pattern', pattern[type])
                .data('type', type);
        });
    }).on('blur', function() {
        var $self = $(this),
            tip = '',
            $validationTarget = $self.closest($self.data('parent'));

        if ($validationTarget.hasClass('empty')) {
            tip = $self.data('validation-empty');
        } else if ($validationTarget.hasClass('error')) {
            tip = $self.data('validation-error');
        }
        $self.next('.validation').text(tip);
    });
}

/**
 * 复选框批量操作
 * @param  {object} $trigger jQuery对象。单数，指触发“全选”或“反选”的复选框。
 * @param  {object} $checkboxes jQuery对象。指待批量操作的复选框。
 * @return {null}
 */

function checkAllBox($trigger, $checkboxes) {
    $trigger.on('change', function() {
        $checkboxes.prop('checked', $trigger.prop('checked'));
    });

    $checkboxes.on('change', function() {
        if ($(this).prop('checked') == false) {
            $trigger.prop('checked', false);
        }
    });
}