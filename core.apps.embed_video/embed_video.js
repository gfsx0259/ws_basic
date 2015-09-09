core.apps.embed_video = function(args) {

    this.defaultProfile = {
        title: "",
        app_style: "",
        code: "",
        embed_video_height: "300"
    }
};


core.apps.embed_video.prototype = {

    buildContent: function(el) {
        this.buildModel(el,
            { tag: "div", id: "embed_video_user",
              style: { width: "100%" } }
        );
    },

  
    onOpen: function() {
        this.setTitle(this.profile["title"]);
        this.renderembed_videoCode();
    },


    getembed_videoCode: function() {
        //youtube,DailyMotion,iFilm,myspace : width="486" height="412"
        var preCode = this.profile["code"].replace(/width\s*=\s*"\d*"/ig,'width="100%"');
        preCode = preCode.replace(/height\s*=\s*"\d*"/ig,'height="'+this.profile["embed_video_height"]+'"');
        
        //google video : "width: 400px; height: 326px;"
        preCode = preCode.replace(/width\s*:\s*\d*px\s*;/ig,'width: 100%;');
        preCode = preCode.replace(/height\s*:\s*\d*px\s*/ig,'height: '+this.profile["embed_video_height"]+'px;');
        
        //brightcove : width='486' height='412'
        preCode = preCode.replace(/height\s*=\s*'\d*'/ig,"height='"+this.profile["embed_video_height"]+"'");
        preCode = preCode.replace(/width\s*=\s*'\d*'/ig,"width='100%'");

        //wmode="Opaque"
        if (preCode.search(/<embed/)>-1){
            if (preCode.search(/wmode/)<0){
                preCode = preCode.replace(/<embed/ig,'<embed wmode="Opaque"');
            }else{
                preCode = preCode.replace(/wmode\s*=\s*"\D*"/ig,'wmode="Opaque"');
            }
        }
        
        //PhotoBucket
        if(preCode.search(/<img/) && (preCode.search(/height/)<0 || preCode.search(/width/)<0)){
            preCode = preCode.replace(/<img/,'<img width="100%" height="'+this.profile["embed_video_height"]+'"' )
        }
        return preCode;
    },
    
    renderembed_videoCode: function(){
        this.$["embed_video_user"].innerHTML = this.getembed_videoCode();
    }
    
    

};
core.apps.embed_video.extendPrototype(core.components.html_component);
core.apps.embed_video.extendPrototype(core.components.desktop_app);