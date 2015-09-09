<?php

/**
 * Class dialog_controller_calendar
 * @property api_calendar calendar
 */
class dialog_controller_calendar extends dialog_controller
{

    public $appAPIs = ['calendar'];

    function array2event(&$v)
    {
        $v['repeat_weekdays'] = $this->calendar->int2weekdays($v['repeat_weekdays']);
        $v['repeat_data'] = unserialize($v['repeat_data']);
        if (!$v['repeat_data']) $v['repeat_data'] = array();
    }

    function event2array(&$v)
    {
        $v['repeat_weekdays'] = $this->calendar->weekdays2int($v['repeat_weekdays']);
        $v['repeat_data'] = serialize($v['repeat_data']);
    }


    // return all categories
    function getCategories()
    {
        return array(
            'status' => 'categories',
            'data' => $this->calendar->getCategories()
        );
    }


    function run()
    {
        parent::run();
        switch ($_REQUEST['act']) {

            // common

            case 'get_data':
                $events = $this->calendar->getEvents();
                for ($i = 0; $i < count($events); $i++) {
                    $this->array2event($events[$i]);
                }
                $res = array(
                    'status' => 'data',
                    'events' => $events,
                );

                if ($_REQUEST['get_categories']) {
                    $res['categories'] = $this->calendar->getCategories();
                }

                return $res;
                break;

            case 'get_events':
                $events = $this->calendar->getSearchEvents($_REQUEST['event'], $_REQUEST['category']);
                for ($i = 0; $i < count($events); $i++) {
                    $this->array2event($events[$i]);
                }
                $res = array(
                    'status' => 'data',
                    'events' => $events,
                );

                if ($_REQUEST['get_categories']) {
                    $res['categories'] = $this->calendar->getCategories();
                }

                return $res;
                break;


            // categories

            case 'get_categories':
                return $this->getCategories();
                break;

            case 'delete_category':
                if (!$this->canEdit()) return array('status' => 'error');
                $this->calendar->deleteCategory($_REQUEST['id']);
                return $this->getCategories();
                break;


            case 'update_category':
                if (!$this->canEdit()) return array('status' => 'error');
                $this->calendar->updateCategory($_REQUEST);
                return $this->getCategories();
                break;

            case 'create_category':
                if (!$this->canEdit()) return array('status' => 'error');
                $this->calendar->createCategory($_REQUEST);
                return $this->getCategories();
                break;


            // events

            case 'save_event':
                if (!$this->canEdit()) return array('status' => 'error');

                $data = $this->json->decode(str_replace("\'", "'", $_REQUEST['data']));
                if (!$data) {
                    return array('status' => 'error');
                }
                $this->event2array($data);
                if ($data['id'] == null) {
                    $id = $this->calendar->createEvent($data);
                    return array('status' => 'event_created', 'id' => $id);
                } else {
                    $this->calendar->updateEvent($data);
                    return array('status' => 'event_updated');
                }
                break;

            case 'delete_event':
                if (!$this->canEdit()) return array('status' => 'error');
                $this->calendar->deleteEvent($_REQUEST['event_id']);
                return array('status' => 'event_deleted');
                break;

        }//case

    }//run::


    function canEdit()
    {
        if ($this->usertype >= USERTYPE_ADMIN) {
            return true;
        } else if ($this->usertype == USERTYPE_CONTRIBUTOR) {
            $p = $this->contributors->getData();
            if ($p['manage_events']) return true;
        }
        return false;
    }
}