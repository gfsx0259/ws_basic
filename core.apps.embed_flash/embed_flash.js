core.apps.embed_flash = function(args) {

    this.defaultProfile = {
        title: "",
        app_style: "",
        code: "",
        embed_flash_height: "300"
    }
}


core.apps.embed_flash.prototype = {

    buildContent: function(el) {
        this.buildModel(el,
            { tag: "div", id: "embed_flash_user",
              style: { width: "100%" } }
        );
    },

    
    onOpen: function() {
        this.setTitle(this.profile["title"]);
        this.renderembed_flashCode();
    },

    getembed_flashCode: function() {
        //youtube,DailyMotion,iFilm,myspace : width="486" height="412"

        var h = this.profile["embed_flash_height"];
        var preCode = this.profile["code"].replace(/width\s*=\s*"\d*"/ig,'width="100%"');
        preCode = preCode.replace(/height\s*=\s*"\d*"/ig,'height="'+h+'"');
        
        //google video : "width: 400px; height: 326px;"
        preCode = preCode.replace(/width\s*:\s*\d*px\s*;/ig,'width: 100%;');
        preCode = preCode.replace(/height\s*:\s*\d*px\s*/ig,'height: '+h+'px;');
        
        //brightcove : width='486' height='412'
        preCode = preCode.replace(/height\s*=\s*'\d*'/ig,"height='"+h+"'");
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
            preCode = preCode.replace(/<img/,'<img width="100%" height="'+this.profile["embed_flash_height"]+'"' )
        }
        return preCode;
    },
    
    renderembed_flashCode: function() {
        var el = this.$["embed_flash_user"];
        el.style.height = this.profile["embed_flash_height"] + "px";
        el.innerHTML = this.getembed_flashCode();
    }
    
    

}
core.apps.embed_flash.extendPrototype(core.components.html_component);
core.apps.embed_flash.extendPrototype(core.components.desktop_app);