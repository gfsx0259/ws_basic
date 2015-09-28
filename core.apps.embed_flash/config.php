<?

$config["js_apps"]["core.apps.embed_flash"] = array(

    'general' => array(
        'title' => 'Embed flash',
        'name' => 'embed_flash',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_MEDIA,
        'description' => ''
    ),


    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "embed_flash.js",
                "embed_flash.admin.js"
            )
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array("embed_flash.js")
        ),


        USERTYPE_GUEST => array(
            "code" => array("embed_flash.js")
        )
    )

)


?>