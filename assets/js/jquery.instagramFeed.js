(function ($) {
    var defaults = {
        'host': "https://www.instagram.com/",
        'username': '',
        'tag': '',
        'user_id': '',
        'location': '',
        'container': '',
        'display_profile': true,
        'display_biography': true,
        'display_gallery': true,
        'display_captions': false,
        'display_igtv': false,
        'max_tries': 8,
        'callback': null,
        'styling': true,
        'items': 8,
        'items_per_row': 4,
        'margin': 0.5,
        'image_size': 640,
        'lazy_load': false,
        'cache_time': 360,
        'on_error': console.error
    };
    var image_sizes = {
        "150": 0,
        "240": 1,
        "320": 2,
        "480": 3,
        "640": 4
    };
    var escape_map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };

    function escape_string(str) {
        return str.replace(/[&<>"'`=\/]/g, function (char) {
            return escape_map[char];
        });
    }


    /**
     * Rendering
     */
    function render(options, data){
        var html = "", styles;

        /**
         * Styles
         */
        if(options.styling){
            var width = (100 - options.margin * 2 * options.items_per_row) / options.items_per_row;
            styles = {
                profile_container: ' style="text-align:center;"',
                profile_image: ' style="border-radius:10em;width:15%;max-width:125px;min-width:50px;"',
                profile_name: ' style="font-size:1.2em;"',
                profile_biography: ' style="font-size:1em;"',
                gallery_image: ' style="width:100%;"',
                gallery_image_link: ' style="width:' + width + '%; margin:' + options.margin + '%;position:relative; display: inline-block; height: 100%;"'
            };
            
            if(options.display_captions){
                html += "<style>\
                    a[data-caption]:hover::after {\
                        content: attr(data-caption);\
                        text-align: center;\
                        font-size: 0.8rem;\
                        color: black;\
                        position: absolute;\
                        left: 0;\
                        right: 0;\
                        bottom: 0;\
                        padding: 1%;\
                        max-height: 100%;\
                        overflow-y: auto;\
                        overflow-x: hidden;\
                        background-color: hsla(0, 100%, 100%, 0.8);\
                    }\
                </style>";
            }
        }else{
            styles = {
                profile_container: "",
                profile_image: "",
                profile_name: "",
                profile_biography: "",
                gallery_image: "",
                gallery_image_link: ""
            };
        }

        /**
         * Gallery
         */
        if(options.display_gallery){
            var image_index = typeof image_sizes[options.image_size] !== "undefined" ? image_sizes[options.image_size] : image_sizes[640],
                imgs = data,
                max = (imgs.length > options.items) ? options.items : imgs.length;

            html += "<div class='instagram_gallery'>";
            for (var i = 0; i < max; i++) {
                var url = imgs[i].permalink,
                    image, type_resource, 
                    caption = imgs[i].caption;

                if(caption === false){
                    caption = (options.type == "userid" ? '' : options.id) + " image";
                }
                if (caption) caption = escape_string(caption);

                switch (imgs[i].media_type) {
                    case "CAROUSEL_ALBUM":
                        type_resource = "sidecar"
                        image = imgs[i].media_url;
                        break;
                    case "VIDEO":
                        type_resource = "video";
                        image = imgs[i].thumbnail_url
                        break;
                    default:
                        type_resource = "image";
                        image = imgs[i].media_url;
                }

                html += '<a href="' + url + '"' + (options.display_captions ? ' data-caption="' + caption + '"' : '') + ' class="instagram-' + type_resource + '" rel="noopener" target="_blank"' + styles.gallery_image_link + '>';
                html += '<img' + (options.lazy_load ? ' loading="lazy"' : '') + ' src="' + image + '" alt="' + caption + '"' + styles.gallery_image + ' />';
                html += '</a>';
            }
            html += '</div>';
        }

        $(options.container).html(html);
    }

    $.instagramFeed = function (opts) {
        var options = $.fn.extend({}, defaults, opts);

        if (options.username == "" && options.tag == "" && options.user_id == "" && options.location == "") {
            options.on_error("Instagram Feed: Error, no username, tag or user_id defined.", 1);
            return false;
        }

        if(typeof opts.display_profile !== "undefined" && opts.display_profile && options.user_id != ""){
            console.warn("Instagram Feed: 'display_profile' is not available using 'user_id' (GraphQL API)");
        }
        
        if(typeof opts.display_biography !== "undefined" && opts.display_biography && (options.tag != "" || options.location != "" || options.user_id != "")){
            console.warn("Instagram Feed: 'display_biography' is not available unless you are loading an user ('username' parameter)");
        }

        if (typeof options.get_data !== "undefined") {
            console.warn("Instagram Feed: options.get_data is deprecated, options.callback is always called if defined");
        }

        if (options.callback == null && options.container == "") {
            options.on_error("Instagram Feed: Error, neither container found nor callback defined.", 2);
            return false;
        }

        if(options.username != ""){
            options.type = "username";
            options.id = options.username;
        }else if(options.tag != ""){
            options.type = "tag";
            options.id = options.tag;
        }else if(options.location != ""){
            options.type = "location";
            options.id = options.location;
        }else{
            options.type = "userid";
            options.id = options.user_id;
        }

        options.cache_data_key = 'instagramFeed_' + options.type + '_' + options.id;
        options.cache_time_key = options.cache_data_key + '_time';

        var token = 'INSERT_TOKEN_HERE';
        var fields = 'id,media_type,media_url,thumbnail_url,timestamp,permalink,caption';
        var limit = options.items; // Set a number of display items

        $.ajax ( {
            url: 'https://graph.instagram.com/me/media?fields='+ fields +'&access_token='+ token +'&limit='+ limit,
            type: 'GET',
            success: function( response ) {
                render(options, response.data);
            },
            error: function(data) {
                var html = '<div class="class-no-data">No Images Found</div>';
                $('#instagram-feed').append(html);
                }
        });

        // Refreshes the token - it expires every 60 days
        const refreshed = fetch('https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=' + token);

        return true;
    };

})(jQuery);
