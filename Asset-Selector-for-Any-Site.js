// ==UserScript==
// @name         Asset Selector for Any Site
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Demonstrate AEM Asset Selector usage from context of any site.
// @author       Jian Huang
// @match        https://*.adobe.com/*
// @require      https://code.jquery.com/jquery-3.6.0.slim.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=magentosite.cloud
// @grant        none
// ==/UserScript==
var $ = window.jQuery;

var AEMAuthUrl = 'https://author-p7716-e47152.adobeaemcloud.com';
var AEMPubUrl = 'https://publish-p7716-e47152.adobeaemcloud.com';

var assetPickerURL = AEMAuthUrl + '/aem/assetpicker?mode=multiple&assettype=images';
var $callingElement;

$(document).ready(function() {
    'use strict';

    var popup;
    var plugin_css = `
        <style>
            .asset-selector-block {
                position: relative;
            }

            .asset-selector-btn {
                position: absolute;
                bottom: 0;
                right: 0;
                background-color: red;
                color: white;
                padding: 5px;
                cursor: pointer;
                }
        </style>
    `;

    $('head').append(plugin_css);

    setTimeout(function () {
        $('img').after('<div class="asset-selector-btn">Replace</div>');
        $('img').closest('div').addClass('asset-selector-block');
    }, 5000);

    $('body').on('click', '.asset-selector-btn', function() {
        $callingElement = $(this);
        popup = window.open(assetPickerURL, 'dam', 'left=50px, top=50px;, height=600, width=900, status=yes, toolbar=no, menubar=no, location=yes');

        return false;
    });

    if (window.addEventListener) {
        window.addEventListener("message", receiveMessage, false);
    } else if (window.attachEvent) {
        window.attachEvent("onmessage", receiveMessage, false);
    }

    function receiveMessage(event) {
        // Don’t accept messages from other sources!
        if (assetPickerURL.indexOf(event.origin) != 0) {
            return;
        }

        addImage(JSON.parse(event.data));
    }

    function addImage(eventData) {
        $.each(eventData.data, function() {
            $callingElement.prev('img').attr('src', AEMPubUrl + this.path);
            $callingElement.prev('img').attr('srcset', '');
            console.log($callingElement.siblings('source'));
            $callingElement.siblings('source').remove();
        });

        popup.close();
    }
});