core.apps.image_gallery = function(args) {

    this.defaultProfile = {
        title: "",
        app_style: "",
        image_height: 100,
        popup: false,
        cols: 3,
        spacing: 1,
        items: [],
        items_per_page: 9
    }
};


core.apps.image_gallery.prototype = {


    onOpen: function() {
        this.setTitle(this.profile["title"]);
        this.$["window"].style.overflow = "hidden";
        this.buildModel(this.$["content"], [
            { tag: "div",
              id: "pager_top" },
            { tag: "div", 
              className: "image_gallery", 
              id: "image_gallery",
              childs:[
                { tag:"table", id:'table',
                  childs: [
                    { tag: "tbody", id: "table_body" }
                  ]}
              ]},
            { tag: "div",
              id: "pager_bottom" }
        ]);
        this.refresh();
    },



    refresh: function() {
        this.offset = 0;
        this.renderPage();

        if(this.profile.items.length > this.profile.items_per_page) {
            this.showElements(["pager_top", "pager_bottom"]);
            if(!this.pagers) {
                var p = {
                    per_page: this.profile.items_per_page,
                    parent: this.$["pager_top"],
                    callback: this.setOffset.bind(this),
                    class_name: "pager"
                };
                this.pagers = { top: new core.objects.pager(p) };
                p.parent = this.$["pager_bottom"];
                this.pagers["bottom"] = new core.objects.pager(p);
            }
            this.pagers["top"].setData(this.offset, this.profile.items.length, this.profile.items_per_page);
            this.pagers["bottom"].setData(this.offset, this.profile.items.length, this.profile.items_per_page);
        } else {
            this.hideElements(["pager_top", "pager_bottom"]);
        }
    },



    setOffset: function(ofs) {
        this.offset = ofs;
        this.pagers["top"].setData(this.offset, this.profile.items.length, this.profile.items_per_page);
        this.pagers["bottom"].setData(this.offset, this.profile.items.length, this.profile.items_per_page);
        this.renderPage();
    },



    renderPage: function() {
        core.browser.element.removeChilds(this.$["table_body"]);
        var col_width = Math.floor(98/this.profile.cols) + "%",
            rows = Math.ceil(this.profile.items_per_page/this.profile.cols),
            m = [],
            mr,
            item_idx = 0,
            img_src,
            is_empty_cell,
            page_item,
            cell_m;


        for(var r=0; r<rows; r++) {
            mr = {
                tag: "tr",
                className: "row",
                childs: []
            };
            for(var c=0; c<this.profile.cols; c++) {
                var page_item = this.profile.items[item_idx + this.offset];
                if(!page_item || item_idx >= this.profile.items_per_page) continue;


                cell_m = [];
                if(page_item.file) {
                    cell_m.push(
                        { tag: "img", className: "gallery_img",
                          events: { 
                            onclick: ["onImgClick", item_idx + this.offset],
                            ondblclick: ["onImgDblClick", item_idx + this.offset] },
                          src: core.common.getUserFile(page_item.file),
                          alt: page_item.alt,
                          style: { 
                            width: "auto",
                            height: this.profile.image_height + "px", 
                            cursor: ((page_item.url && page_item.url != "http://") ? "pointer" : "default")
                          }}
                    );
                }

                if(page_item.code) {
                    cell_m.push(
                        { tag: "div", 
                          style: { 
                            width: "auto",
                            height: page_item.file ? "auto" : this.profile.image_height + "px"
                          },
                          innerHTML: this.processCode(page_item.code) }
                    );
                }

                if(page_item.html) {
                    cell_m.push(
                        { tag: "div", 
                          innerHTML: page_item.html }
                    );
                }


                mr.childs.push(
                    { tag: "td",
                      style: { width: col_width },
                      childs: [
                        { tag: "div", 
                          did:'div',
                          className: is_empty_cell ? "cell_div empty" : "cell_div",
                          style: { margin: this.profile.spacing + "px" },
                          childs: [
                            { tag: "div", className: "img_box",
                              childs: [
                                { tag: "div", className: "t",
                                  innerHTML: "<div class='tr'><div class='tc'></div></div>" },
                                { tag: "div", className: "m",
                                  childs: [
                                    { tag: "div", className: "mr",
                                      childs: [
                                        { tag: "div", className: "mc",
                                          childs: cell_m }
                                      ]}
                                  ]},
                                { tag: "div", className: "b",
                                  innerHTML: "<div class='br'><div class='bc'></div></div>" }
                              ]}
                              /*,
                            { tag: "div", 
                              className:'caption', 
                              html: is_empty_cell ? "" : page_item.title }
                              */
                          ]}
                      ]}
                );
                item_idx++;
            }
            m.push(mr);
        }
        this.buildModel(this.$.table_body, m);
    },



    onImgClick: function(e, idx) {
        clearTimeout(this.img_click_timeout);
        this.img_click_timeout = setTimeout(this.imgClick.bind(this, idx), core.config.dbl_click_delay);
    },


    imgClick: function(idx) {
        if(this.profile.items[idx].url) {
            desktop.loadURL(this.profile.items[idx].url);
        } else if(this.profile.popup && this.profile.items[idx].file) {
            var images = [], active_image_idx = 0;
            for(var i=0; i<this.profile.items.length; i++) {
                if(this.profile.items[i].file) {
                    images.push(this.profile.items[i].file);
                    if(this.profile.items[idx].file == this.profile.items[i].file) {
                        active_image_idx = images.length - 1;
                    }
                }
            }

            if(images.length) {
                desktop.openImageBox(images, active_image_idx);
            }
        }
    },


    onImgDblClick: function(e, idx) {
        clearTimeout(this.img_click_timeout);
        if(core.usertype >= USERTYPE_ADMIN) {
            this.openImagesManager(false, idx);
        }
    },



    processCode: function(code) {
        var code = code.replace(/width\s*=\s*"\d*"/ig,'width="100%"');
        code = code.replace(/height\s*=\s*"\d*"/ig,'height="'+this.profile["image_height"]+'"');
        
        code = code.replace(/width\s*:\s*\d*px\s*;/ig,'width: 100%;');
        code = code.replace(/height\s*:\s*\d*px\s*/ig,'height: '+this.profile["image_height"]+'px;');
        
        code = code.replace(/height\s*=\s*'\d*'/ig,"height='"+this.profile["image_height"]+"'");
        code = code.replace(/width\s*=\s*'\d*'/ig,"width='100%'");

        if (code.search(/<embed/)>-1){
            if (code.search(/wmode/)<0){
                code = code.replace(/<embed/ig,'<embed wmode="Opaque"');
            }else{
                code = code.replace(/wmode\s*=\s*"\D*"/ig,'wmode="Opaque"');
            }
        }

        if(code.search(/<img/) && (code.search(/height/)<0 || code.search(/width/)<0)){
            code = code.replace(/<img/,'<img width="100%" height="'+this.profile["image_height"]+'"' )
        }
        return code;
    }

};
core.apps.image_gallery.extendPrototype(core.components.html_component);
core.apps.image_gallery.extendPrototype(core.components.desktop_app);