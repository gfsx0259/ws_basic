core.apps.paragraph.extendPrototype({

    onFirstRun: function() {
        this.showSettings();
        desktop.openFilesManager(this.onFileSelected.bind(this), "pictures");
    },


    onFileSelected: function(file) {
        this.profile["image_path"] = file;
        this.$["inp_file"].setValue(file);
        this.onSelectTextClick();
    },




    settingsBlocks: [

        { title: "Picture file:", 
          controls: [
            { tag: "wsc_file", id: "inp_file", type: "pictures" }
          ]},


        { title: "Picture align:",
          controls: [
            { tag: "wsc_select", id: "inp_image_align",
              options: [
                { value: "left", text: "Left" },
                { value: "right", text: "Right" },
                { value: "none", text: "None" }
              ]}
          ]},


        { title: "Content:",
          controls: [
            { tag: "wsc_doc_control", id: "inp_doc" },
            { tag: "div", className: "divider" },
            { tag: "wsc_checkbox", title: "Show date of document", id: "inp_show_date" }
          ]}
    ],



    fillSettingsForm: function() {
        this.$["inp_show_date"].setChecked(this.profile["show_date"]);
        this.$["inp_image_align"].setValue(this.profile["image_align"]);
        this.$["inp_file"].setValue(this.profile["image_path"] || "");
        this.$["inp_doc"].setValue({ id: this.profile.text_id, content: this.profile.webnote_content_type == 0 ? "content" : "summary"});
    },


    processSettingsForm: function() {
        this.profile["image_path"] = this.$["inp_file"].value;
        this.profile["show_date"] = this.$["inp_show_date"].checked ? 1 : 0;
        this.profile["image_align"] = this.$["inp_image_align"].value;

        var d = this.$["inp_doc"].value;
        this.profile.text_id = d.id;
        this.profile.webnote_content_type = d.content == "summary" ? 1 : 0;
    },


    onSettingsUpdated: function() {
        this.renderImage();
        this.renderparagraphCode();
    },

    onSelectTextClick: function() {
        if(this.disableClicks) return;
        desktop.openTextsManager(this.onTextSelected.bind(this));
    },

    onTextSelected: function(text) {
        if(this.profile["text_id"] == text.id) return;
        this.profile["text_id"] = text.id;
        this.fillSettingsForm();
        core.data.texts.get(text.id, this.setContentOrSummary.bind(this));
        desktop.layout.savePage();
    },


    getUsedTexts: function() {
        return this.profile["text_id"] ? [this.profile["text_id"]] : null;
    },
    
    onSelectTextClick: function() {
        desktop.openTextsManager(this.onTextSelected.bind(this));
    },

    
    onGetContent: function(text) {
        this.$["p_text"].innerHTML = text ? text.content : "";
    },

    
    changeText:function(){
        this.profile["text_id"] != null ? this.onEditClick() : this.onCreateClick();
    },
    onCreateClick: function(e) {
        this.createdTextTitle = this.profile["title"] + " " + this.id;
        desktop.openTextEditor(null, this.onDocCreated.bind(this));
    },


    onDocCreated: function(doc) {
        doc.title = this.profile["title"] + " " + this.id;

        if(this.profile["webnote_content_type"]=='0') {
            this.onGetContent({ content: doc.content});
        } else {
            this.onGetContent({ content: doc.summary});
        }

        this.bodyText = doc.content;
        this.summaryText = doc.summary;
        doc.act = "create";
        this.sendRequest(doc, "POST");
    },


    onEditClick: function() {
        core.data.texts.get(this.profile["text_id"], this.editText.bind(this));
    },

    editText: function(text) {
        desktop.openTextEditor(text, this.onDocEdited.bind(this));
    },

    onDocEdited: function(doc) {
        doc.id = this.profile["text_id"];
        core.data.texts.updateContent(doc);

        if(this.profile["webnote_content_type"]=='0') {
            this.onGetContent({ content: doc.content});
        } else {
            this.onGetContent({ content: doc.summary});
        }

        this.bodyText=doc.content;
        this.summaryText=doc.summary;

        doc.act = "update";
        this.sendRequest(doc, "POST");
    },

    // requests

    sendRequest: function(p, method) {
        p.dialog = "texts";
        p.get_list = "0";
        core.transport.send("/controller.php", p, this.onSendCreated.bind(this), method);
    },

    onSendCreated: function(id){
        this.profile["text_id"] = id;
        this.saveProfile();
    },
    

    
    // init admin ui

    onSettingsRendered: function() {
        this.buildModel(this.$["p_image"],
            { tag: "div", className: "resize_control",
              events: { onmousedown: "startResize" } }
        );
        this.disableClicks = false;
        this.$["p_image"].onclick = this.onImageClick.bindAsEventListener(this);
        this.$["p_text"].onclick = this.onTextClick.bindAsEventListener(this);     
    },


    onTextClick: function(e) {
        if(this.profile["text_id"] == null) {
            this.onSelectTextClick(e);
        } else {
            this.changeText();
        }
    },


    // img resize
    startResize: function(e) {
        if(this.isResizing) return;
        this.isResizing = true;
        e = core.browser.event.fix(e);
        this.disableClicks = true;
        this.resizeOfs = Math.max(e.clientX, e.clientY);

        core.browser.event.push(document, ["onmousemove", "onmouseup", "ondragstart"]);
        document.onmouseup = this.stopResize.bindAsEventListener(this);
        document.onmousemove = this.resize.bindAsEventListener(this);
        document.ondragstart = function() { return false }
        core.browser.event.kill(e);
        return false;
    },

    resize: function(e) {
        e = core.browser.event.fix(e);
        var cm = Math.max(e.clientX, e.clientY);
        var size = this.profile["image_size"] - this.resizeOfs + cm;
        if(size < 16) size = 16;
        if(size > this.$["content"].offsetWidth) size = this.$["content"].offsetWidth;
        this.$["p_image"].style.width = size + "px";
    },

    stopResize: function(e) {
        this.isResizing = false;
        var nw = this.$["p_image"].offsetWidth;
        if(this.profile["image_size"] != nw) {
            this.profile["image_size"] = nw;
            desktop.layout.savePage();
        }
        this.resizeOfs = null;
        core.browser.event.pop();

        var o = this;
        setTimeout(function() { o.disableClicks = false }, 1000);
    },



    getContent: function() {
        var key = this.profile["webnote_content_type"] == 0 ? "content" : "summary";
        return this.content[key];
    },




    // image controls

    onImageClick: function() {
        if(this.disableClicks) return;
        desktop.openFilesManager(this.onImageFile.bind(this), "pictures")
    },
    
    onImageFile: function(file) {
        this.profile["image_path"] = file;

        if(this.$["inp_file"]) {
            this.$["inp_file"].setValue(file);
        }

        desktop.layout.savePage();
        this.renderImage();
    },



    // sys

    getUsedImages: function() {
        if(this.profile["image_path"]) {
            return [ 
                { file: this.profile["image_path"], title: this.profile["title"] } 
            ];
        }
    }

    
});