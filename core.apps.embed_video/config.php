<?php

$config["js_apps"]["core.apps.embed_video"] = array(

    'general' => array(
        'title' => 'Embed video',
        'name' => 'embed_video',//should be like 3th part of folder
        'version' => '1.0.0',
        'icon' => 'icon.png',
        'category' => CATEGORY_MEDIA,
        'description' => ''
    ),


    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "embed_video.js",
                "embed_video.admin.js"
            )
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array("embed_video.js")
        ),


        USERTYPE_GUEST => array(
            "code" => array("embed_video.js")
        )
    )

);
