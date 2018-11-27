/**
 * @file mip-qtkj-layer 组件
 * @author yzxsl
 */

define(function (require) {
    'use strict';
    var customElement = require('customElement').create();
    customElement.prototype.firstInviewCallback = function () {
        var element = this.element;
        function ShowHide() {
            this.switch = arguments[0];
            this.content = arguments[1];
            this.close = arguments[2];
            this.change();
        }
        function hasClass(dom, className) {
            className = className.replace(/^\s|\s$/g, '');
            return (' ' + ((dom || {}).className || '').replace(/\s/g, ' ') + ' ').indexOf(' ' + className + ' ') >= 0;
        }
        function getStyle(ele, cssProp) {
            return ele.currentStyle ? ele.currentStyle[cssProp] : getComputedStyle(ele, false)[cssProp];
        }
        ShowHide.prototype.change = function () {
            var con = this.content;
            this.switch.onclick = function () {
                if (con.style.display === 'none' || con.style.display === '') {
                    con.style.display = 'block';
                }
                else {
                    con.style.display = 'none';
                }
            };
            this.close.onclick = function () {
                con.style.display = 'none';
            };
        };
        new ShowHide(
            document.getElementsByClassName('layer-show')[parseInt(element.getAttribute('sindex'), 10)],
            document.getElementsByClassName('layer-hide')[parseInt(element.getAttribute('hindex'), 10)],
            document.getElementsByClassName('layer-close')[parseInt(element.getAttribute('cindex'), 10)]
        );
    };
    return customElement;
});
