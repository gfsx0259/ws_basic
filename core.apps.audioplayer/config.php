<?php
//TODO try move here somehow SWFObject
$config["js_apps"]["core.apps.audioplayer"] = array(

    'general' => array(
        'title' => 'Audio player',
        'name' => 'audioplayer',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_MEDIA,
        'description' => ''
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "audioplayer.js",
                "audioplayer.admin.js"
            ),
            "styles" => array("styles/audioplayer.admin.css")
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array(
                "audioplayer.js"
            )
        ),


        USERTYPE_GUEST => array(
            "code" => array(
                "audioplayer.js"
            )
        )
    )

);
