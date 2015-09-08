core.apps.audioplayer = function(args) {
    this.defaultProfile = {
        title: "",
        app_style: "",
        showlist: 1,
        showvolume: 1,
        autoplay: 0,
        loop: 0,
        width: "200",
        height: "100",
        showloading: "autohide",
        tracks: [],
        titles: []
    }
}

core.apps.audioplayer.prototype = {


    onOpen: function() {
        this.setTitle(this.profile["title"]);
        this.render();
    },


    render: function() {
        var height = this.profile["height"];
        var width = this.profile["width"];
        var flashvars = {}

        var params = {
            wmode: "Opaque"
        }
        if(this.profile["showlist"] == 0) {
            flashvars["showlist"] = "0";
            flashvars["height"] = "20";
            params["height"] = "20";
            height = "20";
        }
        flashvars["width"] = width;
        flashvars["height"] = height;

        var files = [];
        for(var i=0; i<this.profile["tracks"].length; i++) {
            files[i] = core.common.getUserFile(this.profile["tracks"][i]);
        }
        flashvars["mp3"] = files.join("|");
        var t = clone(this.profile["titles"]);
        for(var i=0; i<this.profile["tracks"].length; i++) {
            if(!t[i]) t[i] = this.profile["tracks"][i];
        }
        flashvars["title"] = t.join("|");

        flashvars["showvolume"] = this.profile["showvolume"] ? "1" : "0";
        if (this.profile["autoplay"] == 1) flashvars["autoplay"] = "1";
        if (this.profile["loop"] == 1) flashvars["loop"] = "1";

        flashvars["showloading"] = this.profile["showloading"];

        var oid = "audioplayer_object" + this.id;

        if(this.isEmbedded) {
            swfobject.removeSWF(oid);
        }
        this.buildModel(this.$["content"], 
            { tag: "div", id: "audioplayer_object" }
        );
        this.$["audioplayer_object"].id = oid;

        swfobject.embedSWF("/static/flash/player_mp3_multi.swf", oid, width, height, "9.0.0", "", flashvars, params);
        this.isEmbedded = true;
    }
}
core.apps.audioplayer.extendPrototype(core.components.html_component);
core.apps.audioplayer.extendPrototype(core.components.desktop_app);