<?php

class dialog_controller_gmap extends dialog_controller
{

    var $APIs = array("countries");


    function run()
    {
        parent::run();

        switch ($_REQUEST["action"]) {
            case "get_countries":
                $countries = $this->countries->getAll("iso, printable_name");
                return array("status" => "done",
                    "countries" => $countries);
                break;
        }
    }

}

?>