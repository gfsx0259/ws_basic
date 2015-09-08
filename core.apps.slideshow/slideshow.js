core.apps.slideshow = function(args) {

    this.defaultProfile = {
        title: "",
        app_style: "",
        labels: [],
        images: [],
        alts: [],
        urls: [],
        interval: 5,
        effect: "fade",
        height: 200,
        popup: true,
        numbers: true,
        caption: true,
        nav_handle_mouseover: false,
        title_in_nav: false,
        keywords: "",
        picture_position: "fit"
    }

    this.animation_frames = 20;
    this.animation_frame_delay = 20;
}


core.apps.slideshow.prototype = {


    buildContent: function(el) {
        var h = this.profile["height"] + "px";

        this.buildModel(this.$["content"], 
            { tag: "div", className: "slideshow",
              id: "slideshow",
              childs: [
                { tag: "div", 
                  className: "slideshow_box", 
                  id: "box", 
                  childs:[
                    { tag: "div", className: "picture_container",
                      id: "active_slide",
                      style: { zIndex: 1 },
                      display: false,
                      childs: [
                        { tag: "div",
                          childs: [
                            { tag: "img",
                              id: "active_img",
                              className: "slideshow_img", 
                              events: { onclick: "popupImage"} }
                          ]}
                      ]},

                    { tag: "div", className: "picture_container",
                      id: "next_slide",
                      style: { zIndex: 2 },
                      display: false,
                      childs: [
                        { tag: "div",
                          childs: [
                            { tag: "img",
                              id: "next_img",
                              className: "slideshow_img" }
                          ]}
                      ]}
                     
                  ]},
                { tag: "div", 
                  id: "box_nav_content", 
                  className: "nav",
                  childs:[
                    { tag: "div", 
                      className: "caption",
                      id: "box_nav_text" },

                    { tag: "div", 
                      className: "numbers",
                      id: "box_nav" }
                  ]}
              ]}
        );
    },


    onOpen: function() {
        this.setTitle(this.profile["title"]);
        this.$["window"].style.overflow = "hidden";
        this.refresh();
    },


    onClose: function() { 
        clearTimeout(this.timeout);
    },


    updateBoxSize: function() {
        var h = this.profile.height + "px";
        this.$["box"].style.height = h;
        this.$["active_slide"].style.height = h;
        this.$["active_slide"].style.width = this.$["box"].offsetWidth + "px";
        this.$["next_slide"].style.height = h;
        this.$["next_slide"].style.width = this.$["box"].offsetWidth + "px";
    },


    popupImage: function() {
        var url = this.slides[this.active_slide].url;
        if(url) {
            location.href = url;
        } else if(this.profile["popup"]) {
            var images = this.getImagesList();
            desktop.openImageBox(images, this.active_slide);
        }
    },



    getImagesList: function() {
        var res = [];
        for(var i=0; i<this.slides.length; i++) {
            res.push(this.slides[i].file);
        }
        return res;
    },


//TODO:
    showCaption: function(){
        this.$["box_nav_text"].innerHTML = "";
        if (this.profile["caption"]){
            this.$["box_nav_text"].innerHTML = this.slides[this.active_slide].title;
        }

        this.$["active_img"].alt = this.slides[this.active_slide].alt;
        this.$["active_img"].style.cursor = this.slides[this.active_slide].url ? "pointer" : "default";
    },


    boldLink: function(val){
        if(this.profile["numbers"]){
            for(var kt=0;kt< this.slides.length;kt++){
                this.$["title"+kt].className = "";
            }
            var el = this.$["title"+val];
            el.className = "active";
            el.blur();
        }
    },





    initSlides: function() {
        if(this.profile["variable_content"]) {
            this.slides = [];
            if(core.data.variable_content.images) {
                this.slides = core.data.variable_content.images;
            } else if(core.usertype < USERTYPE_ADMIN && this.profile["hide_if_empty"]) {
                this.hideElement("window");
                return;
            }
        } else if(this.profile["keywords"]) {
            this.slides = false;
            var p = {
                dialog: "files",
                act: "search_images",
                q: this.profile["keywords"]
            }
            core.transport.send("/controller.php", p, this.onSearchImagesResponce.bind(this));
        } else {
            this.slides = [];
            var p = this.profile;
            for(var i=0; i<p.labels.length; i++) {
                this.slides.push({
                    title: p.labels[i] || "",
                    file: p.images[i],
                    alt: p.alts[i],
                    url: p.urls[i] || ""
                });
            }
        }
    },



    onSearchImagesResponce: function(r) {
        if(!r || r.status != "search_images_result") {
            return false;
        }
        this.slides = [];
        for(var i=0; i<r.data.length; i++) {
            this.slides.push({
                title: r.data[i],
                file: r.data[i],
                alt: r.data[i],
                url: ""
            });
        }
        this.refresh();
    },



    refresh: function() {
        this.stop();
        this.updateBoxSize();

        this.$["box_nav"].innerHTML = "";
        this.$["box_nav"].className = this.profile["title_in_nav"] ? "titles" : "numbers";
        this.$["box_nav_text"].innerHTML = "";

        if(!this.slides) {
            this.initSlides();
        }
        if(!this.slides || this.slides.length == 0) return;


        var ev, event_name = this.profile["nav_handle_mouseover"] ? "onmousemove" : "onclick";

        if(this.profile["numbers"]) {
            for(var k=0; k<this.slides.length; k++) {
                ev = {};
                ev[event_name] = ["imageMouseEvent", k];
                this.buildModel(this.$["box_nav"],
                    { tag: "a",
                      id: "title"+k,
                      title:  this.slides[k].alt || "",
                      innerHTML: this.profile["title_in_nav"] ? this.slides[k].title : (k+1), 
                      events: ev }
                );
            }
        }
        this.start();
    },



    imageMouseEvent: function(el, val) {
        if(this.active_slide == val || this.animation_started) return;
        this.active_slide = parseInt(val, 10);
        this.showActiveSlide();
    },



// slideshow


    start: function() {
        this.is_show_started = true;
        this.loaded_slides = {};
        this.active_slide = 0;
        this.skip_effect = true;
        this.showActiveSlide(true);
    },


    stop: function() {
        this.is_show_started = true;
        clearTimeout(this.timeout);
    },



    getImageSrc: function(idx) {
        return core.common.getUserFile(this.slides[idx].file)
    },



    showActiveSlide: function() {
        clearTimeout(this.timeout);
        if(!this.loaded_slides[this.active_slide]) {
            this.loadSlide();
            return;
        }
        this.boldLink(this.active_slide);
        this.showCaption();

        if(this.profile["effect"] == "none" || this.skip_effect) {
            this.skip_effect = false;
            this.setSlideSrc("active", this.active_slide);
            this.timeout = setTimeout(this.nextSlide.bind(this), 1000 * this.profile["interval"]);
        } else {
            this.startAnimation();
        }
    },



    nextSlide: function() {
        this.active_slide++;
        if(this.active_slide >= this.slides.length) {
            this.active_slide = 0;
        }
        this.showActiveSlide();
    },



    loadSlide: function() {
        if(!this.img_preloader) {
            this.img_preloader = new Image();
            this.img_preloader.onload = this.onSlidePreloaded.bind(this);
        }
        this.img_preloader.src = this.getImageSrc(this.active_slide);
    },



    onSlidePreloaded: function() {
        this.loaded_slides[this.active_slide] = {
            width: this.img_preloader.width,
            height: this.img_preloader.height
        }
        this.showActiveSlide();
    },



    startAnimation: function() {
        this.animation_started = true;
        this.setSlideSrc("next", this.active_slide);
        this.callFunction("initEffect_" + this.profile["effect"]);
        for(var i=0; i<this.animation_frames; i++) {
            setTimeout(this.processAnimation.bind(this, i), this.animation_frame_delay * (i + 1));
        }
    },


    processAnimation: function(frame) {
        if((frame + 1) / (this.animation_frames - 1) > 1) {
            var pos = 1;
        } else {
            var pos = frame / (this.animation_frames - 1);
        }
        this.callFunction("processEffect_" + this.profile["effect"], pos);

        if(pos == 1) {
            this.endAnimation();
        }
    },


    endAnimation: function() {
        this.callFunction("finishEffect_" + this.profile["effect"]);

        this.setSlideSrc("active", this.active_slide);
        this.setSlideSrc("next", false);


        this.animation_started = false;
        this.timeout = setTimeout(this.nextSlide.bind(this), 1000 * this.profile["interval"]);
    },



    // fade
    initEffect_fade: function() {
        this.$["active_slide"].style.left = 0;
        this.$["next_slide"].style.left = 0;
        this.setElementOpacity("next_slide", 0);
    },


    processEffect_fade: function(pos) {
        var v =  100 - pos * 100
        this.setElementOpacity("active_slide", 100 - pos * 100);
        this.setElementOpacity("next_slide", pos * 100);
    },


    finishEffect_fade: function() {
        this.setElementOpacity("active_slide", 100);
    },


    // scroll
    initEffect_scroll: function() {
        this.$["next_slide"].style.left = "20000px";
    },


    processEffect_scroll: function(pos) {
        var w = this.$["box"].offsetWidth;
        this.$["active_slide"].style.left = (-w * pos) + "px";
        this.$["next_slide"].style.left = (w - w * pos) + "px";
    },


    finishEffect_scroll: function() {
        this.$["next_slide"].style.left = 0;
        this.$["active_slide"].style.left = 0;
    },



    setSlideSrc: function(key, idx) {

        if(idx === false) {
            this.hideElement(key + "_slide");
            return;
        }
        this.showElement(key + "_slide");
        var img_el = this.$[key + "_img"];
        img_el.src = this.getImageSrc(idx);


        var style = {};
        var original_size = this.loaded_slides[idx];

        switch(this.profile["picture_position"]) {
            case "size_height":
                style.height = this.$["box"].offsetHeight;
                style.width = original_size.width * (this.$["box"].offsetHeight / original_size.height);
                style.marginLeft = -0.5 * style.width;
                style.marginTop = -0.5 * style.height;
                break;

            case "size_width":
                style.width = this.$["box"].offsetWidth;
                style.height = original_size.height * (this.$["box"].offsetWidth / original_size.width);
                style.marginLeft = -0.5 * style.width;
                style.marginTop = -0.5 * style.height;
                break;


            case "fit":
                if(original_size.width > original_size.height) {
                    style = {
                        width: original_size.width * (this.$["box"].offsetHeight / original_size.height),
                        height: this.$["box"].offsetHeight
                    }
                    if(style.width > this.$["box"].offsetWidth) {
                        style.width = this.$["box"].offsetWidth;
                        style.height = original_size.height * (style.width / original_size.width);
                    }
                } else {
                    style = {
                        width: this.$["box"].offsetWidth,
                        height: original_size.height * (this.$["box"].offsetWidth / original_size.width)
                    }
                    if(style.height > this.$["box"].offsetHeight) {
                        style.height = this.$["box"].offsetHeight;
                        style.width = original_size.width * (style.height / original_size.height);
                    }
                }
                style.marginLeft = -0.5 * style.width;
                style.marginTop = -0.5 * style.height;
                break;


            case "fill":
                if(original_size.width > original_size.height) {
                    style = {
                        width: original_size.width * (this.$["box"].offsetHeight / original_size.height),
                        height: this.$["box"].offsetHeight
                    }
                    if(style.width < this.$["box"].offsetWidth) {
                        style.height = style.height * (this.$["box"].offsetWidth / style.width);
                        style.width = this.$["box"].offsetWidth;
                    }
                } else {
                    style = {
                        width: this.$["box"].offsetWidth,
                        height: original_size.height * (this.$["box"].offsetWidth / original_size.width)
                    }
                    if(style.height < this.$["box"].offsetHeight) {
                        style.width = style.width * (this.$["box"].offsetHeight / style.height);
                        style.height = this.$["box"].offsetHeight;
                    }
                }
                style.marginLeft = -0.5 * style.width;
                style.marginTop = -0.5 * style.height;
                break;

            case "center":
                style = {
                    marginLeft: -0.5 * original_size.width,
                    marginTop: -0.5 * original_size.height,
                    width: original_size.width,
                    height: original_size.height
                }
                break;

            case "stretch":
                style = {
                    marginLeft: -0.5 * this.$["box"].offsetWidth,
                    marginTop: -0.5 * this.$["box"].offsetHeight,
                    width: this.$["box"].offsetWidth,
                    height: this.$["box"].offsetHeight
                }
                break;
        }

        for(var k in style) {
            img_el.style[k] = style[k] + "px";
        }
    }

 
}
core.apps.slideshow.extendPrototype(core.components.html_component);
core.apps.slideshow.extendPrototype(core.components.desktop_app);