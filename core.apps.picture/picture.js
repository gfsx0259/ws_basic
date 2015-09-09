core.apps.picture = function(args) {

    this.defaultProfile = {
        title: "",
        app_style: "",
        height: 200,
        popup: false,
        path: null,
        alt: "",
        picture_position: "fit",
        variable_content: false,
        url: ""
    }
};

core.apps.picture.prototype = {


    buildContent: function(el) {

        this.buildModel(this.$["content"], [
            { tag: "div", id: "box",
              className: "app_picture_container",
              childs: [
                { tag: "div", className: "center",
                  childs:[
                    { tag: "img", 
                      id: "img",
                      events: { onclick: "onImgClick" } }
                  ]}
              ]}
        ]);
    },


    onOpen: function() {
        this.setTitle(this.profile["title"]);
        this.$["window"].style.overflow = "hidden";
        this.refresh();
    },



    onImgClick: function() {
        if(this.profile.url) {
            location.href = this.profile.url;
        } else if(this.profile["popup"]) {
            var img_url = this.profile["variable_content"] ? core.data.variable_content.image : this.profile["path"];

            desktop.openImageBox([img_url]);
        }
    },


    refresh: function(){
        var el = this.$["img"];
        if(this.profile["variable_content"]) {
            var f = core.data.variable_content.image;
            if(core.usertype < USERTYPE_ADMIN && this.profile["hide_if_empty"]) {
                this.hideElement("window");
                return;
            }
        } else {
            var f = this.profile["path"]
        }

        if(!this.img_preloader) {
            this.img_preloader = new Image();
            this.img_preloader.onload = this.onImageLoaded.bind(this);
        }
        this.img_preloader.src = f ? core.common.getUserFile(f) : "/static/blank.gif";
        this.updateHeight();

        el.style.cursor = this.profile.url != "" ? "pointer" : "default";
    },



    onImageLoaded: function() {
        //IT IS IE 7/8 FIX so if image not loaded fully try it again and again in 100 ms
        if(this.img_preloader.complete != null && this.img_preloader.complete == true){
                this.$["img"].src = this.img_preloader.src;
                this.updateImagePosition();
                return;
        }
        setTimeout(this.onImageLoaded.bind(this), 1000);
    },


    onResize: function() {
        this.updateHeight();
        this.updateImagePosition();
    },


    updateHeight: function() {
        this.$["box"].style.height = this.profile.height + "px";
    },


    updateImagePosition: function(){

        var style = {};

        switch(this.profile["picture_position"]) {
            case "size_height":
                style.height = this.$["box"].offsetHeight;
                style.width = this.img_preloader.width * (this.$["box"].offsetHeight / this.img_preloader.height);
                style.marginLeft = -0.5 * style.width;
                style.marginTop = -0.5 * style.height;
                break;

            case "size_width":
                style.width = this.$["box"].offsetWidth;
                style.height = this.img_preloader.height * (this.$["box"].offsetWidth / this.img_preloader.width);
                style.marginLeft = -0.5 * style.width;
                style.marginTop = -0.5 * style.height;
                break;


            case "fit":
                if(this.img_preloader.width > this.img_preloader.height) {
                    style = {
                        width: this.img_preloader.width * (this.$["box"].offsetHeight / this.img_preloader.height),
                        height: this.$["box"].offsetHeight
                    };
                    if(style.width > this.$["box"].offsetWidth) {
                        style.width = this.$["box"].offsetWidth;
                        style.height = this.img_preloader.height * (style.width / this.img_preloader.width);
                    }
                } else {
                    style = {
                        width: this.$["box"].offsetWidth,
                        height: this.img_preloader.height * (this.$["box"].offsetWidth / this.img_preloader.width)
                    };
                    if(style.height > this.$["box"].offsetHeight) {
                        style.height = this.$["box"].offsetHeight;
                        style.width = this.img_preloader.width * (style.height / this.img_preloader.height);
                    }
                }
                style.marginLeft = -0.5 * style.width;
                style.marginTop = -0.5 * style.height;
                break;


            case "fill":
                if(this.img_preloader.width > this.img_preloader.height) {
                    style = {
                        width: this.img_preloader.width * (this.$["box"].offsetHeight / this.img_preloader.height),
                        height: this.$["box"].offsetHeight
                    };
                    if(style.width < this.$["box"].offsetWidth) {
                        style.height = style.height * (this.$["box"].offsetWidth / style.width);
                        style.width = this.$["box"].offsetWidth;
                    }
                } else {
                    style = {
                        width: this.$["box"].offsetWidth,
                        height: this.img_preloader.height * (this.$["box"].offsetWidth / this.img_preloader.width)
                    };
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
                    marginLeft: -0.5 * this.img_preloader.width,
                    marginTop: -0.5 * this.img_preloader.height,
                    width: this.img_preloader.width,
                    height: this.img_preloader.height
                };
                break;

            case "stretch":
                style = {
                    marginLeft: -0.5 * this.$["box"].offsetWidth,
                    marginTop: -0.5 * this.$["box"].offsetHeight,
                    width: this.$["box"].offsetWidth,
                    height: this.$["box"].offsetHeight
                };
                break;
        }

        for(var k in style) {
            this.$["img"].style[k] = style[k] + "px";
        }
    }

};
core.apps.picture.extendPrototype(core.components.html_component);
core.apps.picture.extendPrototype(core.components.desktop_app);