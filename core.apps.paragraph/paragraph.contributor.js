core.apps.paragraph.extendPrototype({


    initContributor: function() {
        if(!this.profile["text_id"] || core.data.c_permissions["manage_docs"] != 1) return;
        this.$["p_text"].onclick = this.onTextClick.bindAsEventListener(this);     
        core.data.texts.addListener(this.profile["text_id"], this.id, this.setContent.bind(this));
    },


    onTextClick: function(e) {
        desktop.openTextEditor(this.getContent(), this.updateText.bind(this));
    },


    updateText: function(html) {
        desktop.setState("loading");
        var p = {
            dialog: "texts_manager",
            act: "update",
            id: this.profile["text_id"],
            content: html
        };
        this.tmpHTML = html;
        core.transport.send("/controller.php", p, this.onTextUpdated.bind(this), "POST");
    },


    onTextUpdated: function(text_id) {
        core.data.texts.setContent(this.profile["text_id"], this.tmpHTML);
        this.setContent({ content: this.tmpHTML});
        desktop.setState("normal");
    },

    getContent: function() {
        return this.$["p_text"].innerHTML;
    }

});