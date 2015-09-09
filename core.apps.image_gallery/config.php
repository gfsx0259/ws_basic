<?

$config["js_apps"]["core.apps.image_gallery"] = array(

    'general' => array(
        'title' => 'Gallery',
        'name' => 'image_gallery',//should be like 3th part of folder
        'version' => '1.0.0',
        'icon' => 'icon.png',
        'category' => CATEGORY_MEDIA,
        'description' => '',
        'depends' => [
            'files_manager'
        ]
    ),


    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "image_gallery.js",
                "image_gallery.admin.js"
            )
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array(
                "image_gallery.js"
            )
        ),


        USERTYPE_GUEST => array(
            "code" => array(
                "image_gallery.js"
            )
        )
    )

)


?>