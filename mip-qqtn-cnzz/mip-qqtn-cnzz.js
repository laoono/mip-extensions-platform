/**
* @file CNZZ统计插件
* @exports modulename
* @author chenrui09@baidu.com
* @version 1.0
* @copyright 2016 Baidu.com, Inc. All Rights Reserved
*/

define(function (require) {
    var $ = require('zepto');

    var customElement = require('customElement').create();
    customElement.prototype.build = function () {
        var element = this.element;
        var $element = $(element);
        var token = element.getAttribute('token');
        var setConfig = element.getAttribute('setconfig');
        var yczc;
        if (token) {
            window.yczc = window.yczc || [];
            yczc.push([
                '_setAccount',
                token
            ]);

            // 检测setconfig是否存在
            if (setConfig) {
                var setCustom = buildArry(decodeURIComponent(setConfig));
                yczc.push(setCustom);
            }

            var cnzzScript = document.createElement('script');
            var src = 'https://s12.cnzz.com/z_stat.php?id=' + token
                        + '&web_id=' + token;
            cnzzScript.setAttribute('language', 'JavaScript');
            cnzzScript.src = src;
            $element.append($(cnzzScript));
            bindEle();
        }

    };


    // 绑定事件
    function bindEle() {
        var tagBox = document.querySelectorAll('*[data-stats-cnzz-obj]');

        for (var index = 0; index < tagBox.length; index++) {
            var statusData = tagBox[index].getAttribute('data-stats-cnzz-obj');

            // 检测statusData是否存在
            if (!statusData) {
                return;
            }

            try {
                statusData = JSON.parse(decodeURIComponent(statusData));
            } catch (e) {
                return;
            }
            var eventtype = statusData.type;
            if (!statusData.data) {
                return;
            }

            var data = buildArry(statusData.data);

            if (eventtype !== 'click' && eventtype !== 'mouseup' && eventtype !== 'load') {
                // 事件限制到click,mouseup,load(直接触发)
                return;
            }

            if ($(tagBox[index]).hasClass('mip-stats-eventload')) {
                return;
            }

            $(tagBox[index]).addClass('mip-stats-eventload');
            var yczc;
            if (eventtype === 'load') {
                yczc.push(data);
            }
            else {
                tagBox[index].addEventListener(eventtype, function (event) {
                    var tempData = this.getAttribute('data-stats-cnzz-obj');
                    if (!tempData) {
                        return;
                    }
                    var statusJson;
                    try {
                        statusJson = JSON.parse(decodeURIComponent(tempData));
                    } catch (e) {
                        return;
                    }
                    if (!statusJson.data) {
                        return;
                    }
                    var attrData = buildArry(statusJson.data);
                    yczc.push(attrData);
                }, false);
            }
        }
    }

    // 数据换转
    function buildArry(arrayStr) {
        if (!arrayStr) {
            return;
        }

        var strArr = arrayStr.slice(1, arrayStr.length - 1).split(',');
        var newArray = [];

        for (var index = 0; index < strArr.length; index++) {
            var item = strArr[index].replace(/(^\s*)|(\s*$)/g, '').replace(/\'/g, '');
            if (item === 'false' || item === 'true') {
                item = Boolean(item);
            }

            newArray.push(item);
        }
        return newArray;
    }

    return customElement;
});
