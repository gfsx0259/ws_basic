core.apps.paragraph = function(args) {

    this.bodyText='';
    this.summaryText='';

    this.defaultProfile = {
        title: "",
        app_style: "",
        show_date: false,
        webnote_content_type: '0',
        text_id: null,
        image_path: "",
        image_align: "left",
        image_size: 150
    }
}

core.apps.paragraph.prototype = {

    buildContent: function(el) {
        this.displayTpl(el, "paragraph_content");
        var el = this.$["p_image"];
        el.style.width = this.profile["image_size"] + "px";
        if(core.usertype >= USERTYPE_ADMIN) {
            this.onSettingsRendered()
        }
        this.callFunction("initContributor");
    },

    onOpen: function() {
        this.setTitle(this.profile["title"]);
        this.renderparagraphCode();
        this.renderImage();
    },
    
    renderparagraphCode: function(){
        if(this.profile["text_id"] != null) {
            core.data.texts.get(this.profile["text_id"], this.setContent.bind(this));
        } else {
            this.setContent({ content: "Click here to select document" });
        }
    },

    setContentOrSummary:function(text)
    {
        var ctype=this.profile["webnote_content_type"];
        if(this.$["webnote_content_type"]&&this.$["webnote_content_type"]!=undefined)
            ctype=this.$["webnote_content_type"].value;
        if( ctype=='0')
            this.setContent({ content: text.content});
        else
            this.setContent({ content: text.summary});
        this.bodyText=text.content;
        this.summaryText= text.summary;
    },


    setContent: function(text) {
        this.content = text;
        this.$["p_text"].innerHTML = this.profile["webnote_content_type"] == 1 ? text.summary : text.content;
        if(this.profile["show_date"] && text && text.modified) {
            this.showElement("date_box");
            var d = new Date(text.modified * 1000);
            this.$["date"].innerHTML = d.toLocaleDateString();
        } else {
            this.hideElement("date_box");
        }
    },


    renderImage: function(){
        this.$['p_image'].style.cssText+=";\nfloat:"+this.profile["image_align"];
        //this.$['p_image'].style.cssFloat = this.profile["image_align"];
        if(this.profile["image_align"] == "right"){
           this.$['p_image'].style.marginLeft = "10px";
        }else{
           this.$['p_image'].style.marginRight = "10px";
        }
        if(this.profile["image_path"] !=""){
            this.$['p_image_img'].alt = "";
            this.$['p_image_img'].src = core.common.getUserFile(this.profile["image_path"]);
            this.$['p_image'].style.height = "auto";
            this.$['p_image'].style.border = "0px";
        } else {
            this.$['p_image_img'].alt = "Click here for change image";
        }
    }
}
core.apps.paragraph.extendPrototype(core.components.html_component);
core.apps.paragraph.extendPrototype(core.components.desktop_app);