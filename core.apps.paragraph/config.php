<?

$config["js_apps"]["core.apps.paragraph"] = array(

    'general' => array(
        'title' => 'Image & Text',
        'name' => 'paragraph',//should be like 3th part of folder
        'version' => '1.0.0',
        'icon' => 'icon.png',
        'category' => CATEGORY_BASIC,
        'description' => '',
        'depends'=>[
            'files_manager',
            'texts_manager'
        ]
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "templates" => array(
                "templates/paragraph_content.xml"
            ),
            "code" => array(
                "paragraph.js",
                "paragraph.admin.js"
            ),
            "styles" => array("style.css")
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array(
                "paragraph.js",
                "paragraph.contributor.js"
            ),
            "templates" => array("templates/paragraph_content.xml"),
            "styles" => array("style.css")
        ),


        USERTYPE_GUEST => array(
            "code" => array("paragraph.js"),
            "templates" => array("templates/paragraph_content.xml"),
            "styles" => array("style.css")
        )
    )


)

?>