<?


/**
 * @property mysql db
 */
class api_calendar
{


    // categories

    function getCategories()
    {
        $sql = "
                SELECT
                    *
                FROM
                    calendar_categories";
        return $this->db->get_key_list($sql, null, "id");
    }

    function getCategoriesList()
    {
        $sql = "
                SELECT
                    *
                FROM
                    calendar_categories";
        return $this->db->get_list($sql);
    }


    function createCategory($data)
    {
        $sql = "
                INSERT INTO
                    calendar_categories
                    (title, color, textcolor)
                VALUES
                    (%title%, %color%, %textcolor%)";
        $this->db->query($sql, $data);
        $id = $this->db->insert_id();
        return $id;
    }


    function updateCategory($data)
    {
        $sql = "
                UPDATE
                    calendar_categories
                SET
                    title = %title%, 
                    color = %color%,
                    textcolor = %textcolor%
                WHERE
                    id = %id%";
        $this->db->query($sql, $data);
    }


    function deleteCategory($category_id)
    {
        $sql = "
                DELETE FROM
                    calendar_categories
                WHERE
                    id = %id%";
        $this->db->query($sql, array("id" => $category_id));
    }




    // events


    // get all site events
    function getEvents()
    {
        $sql = "
                SELECT
                    id,
                    category_id,
                    what,
                    tags,
                    description,
                    city,
                    street,
                    state,
                    country,
                    contact_name,
                    contact_phone,
                    UNIX_TIMESTAMP(rsvp_date) as rsvp_date,
                    cost,
                    UNIX_TIMESTAMP(date) as date,
                    DATE_FORMAT(time_start, %tf1%) AS time_start,
                    DATE_FORMAT(time_start, %tf2%) AS time_start_12,
                    LCASE(DATE_FORMAT(time_start, %tf3%)) AS time_start_ampm,
                    DATE_FORMAT(time_end, %tf1%) AS time_end,
                    DATE_FORMAT(time_end, %tf2%) AS time_end_12,
                    LCASE(DATE_FORMAT(time_end, %tf3%)) AS time_end_ampm,
                    has_time_end,
                    all_day,
                    repeat_mode,
                    offset,
                    repeat_data,
                    repeat_period,
                    repeat_weekdays,
                    more_info,
                    UNIX_TIMESTAMP(repeat_date_end) as repeat_date_end
                FROM
                    calendar_events
                ORDER BY
                    date";

        $p = array(
            "tf1" => "%H:%i",   // in 24 hours format
            "tf2" => "%h:%i",   // in 12 hours format
            "tf3" => "%p"       // AM/PM

        );
        return $this->db->get_list($sql, $p);
    }

    // get all site events according to the search parameters
    function getSearchEvents($event, $catId)
    {
        $sql = "
                SELECT
                    id,
                    category_id,
                    what,
                    tags,
                    description,
                    city,
                    street,
                    state,
                    country,
                    contact_name,
                    contact_phone,
                    UNIX_TIMESTAMP(rsvp_date) as rsvp_date,
                    cost,
                    UNIX_TIMESTAMP(date) as date,
                    DATE_FORMAT(time_start, %tf1%) AS time_start,
                    DATE_FORMAT(time_start, %tf2%) AS time_start_12,
                    LCASE(DATE_FORMAT(time_start, %tf3%)) AS time_start_ampm,
                    DATE_FORMAT(time_end, %tf1%) AS time_end,
                    DATE_FORMAT(time_end, %tf2%) AS time_end_12,
                    LCASE(DATE_FORMAT(time_end, %tf3%)) AS time_end_ampm,
                    has_time_end,
                    all_day,
                    repeat_mode,
                    offset,
                    repeat_data,
                    repeat_period,
                    repeat_weekdays,
                    more_info,
                    UNIX_TIMESTAMP(repeat_date_end) as repeat_date_end
                FROM
                    calendar_events";

        $p = array(
            "tf1" => "%H:%i",   // in 24 hours format
            "tf2" => "%h:%i",   // in 12 hours format
            "tf3" => "%p",       // AM/PM


        );

        if ($event && $event != 'Filter list....') {
            $event = '%' . $event . '%';
            $sql .= "
                      AND what LIKE (%event%) ";
            $p['event'] = $event;
        }

        if ($catId) {

            $sql .= "
                      AND category_id = %catId% ";
            $p['catId'] = $catId;
        }

        return $this->db->get_list($sql, $p);
    }


    function createEvent($data)
    {
        $sql = "
                INSERT INTO
                    calendar_events 
                    (
                    category_id,
                    what, 
                    tags, 
                    description, 
                    city,
                    street,
                    state,
                    country,
                    contact_name,
                    contact_phone,
                    rsvp_date,
                    cost,
                    date, 
                    time_start, 
                    time_end, 
                    has_time_end,
                    all_day,
                    repeat_mode, 
                    offset,
                    repeat_data,
                    repeat_period, 
                    repeat_weekdays,
                    repeat_date_end,
                    more_info
                )
                VALUES 
                    (
                    %category_id%,
                    %what%,
                    %tags%,
                    %description%,
                    %city%,
                    %street%,
                    %state%,
                    %country%,
                    %contact_name%,
                    %contact_phone%,
                    %rsvp_date%,
                    %cost%,
                    %date%,
                    %time_start%,
                    %time_end%,
                    %has_time_end%,
                    %all_day%,
                    %repeat_mode%,
                    %offset%,
                    %repeat_data%,
                    %repeat_period%,
                    %repeat_weekdays%,
                    %repeat_date_end%,
                    %more_info%
                )";
        $data["date"] = date("Y-m-d", $data["date"]);
        $data["rsvp_date"] = date("Y-m-d", $data["rsvp_date"]);
        $data["repeat_date_end"] = date("Y-m-d", $data["repeat_date_end"]);
        $this->db->query($sql, $data);
        $id = $this->db->insert_id();
        return $id;
    }


    function updateEvent($data)
    {
        if ($data["time_start_ampm"] == "pm") {
            list($h, $m) = explode(":", $data["time_start_12"]);
            $h = (int)$h;
            if ($h == 12) $h = 0;
            $data["time_start_24"] = (12 + $h) . ":" . $m;
        } else {
            $data["time_start_24"] = $data["time_start_12"];
        }
        if ($data["time_end_ampm"] == "pm") {
            list($h, $m) = explode(":", $data["time_end_12"]);
            $h = (int)$h;
            if ($h == 12) $h = 0;
            $data["time_end_24"] = (12 + $h) . ":" . $m;
        } else {
            $data["time_end_24"] = $data["time_end_12"];
        }
        $sql = "
                UPDATE
                    calendar_events
                SET
                    category_id = %category_id%,
                    what = %what%,
                    tags = %tags%, 
                    description = %description%, 

                    city = %city%,
                    street = %street%,
                    state = %state%,
                    country = %country%,

                    contact_name = %contact_name%,
                    contact_phone = %contact_phone%,
                    rsvp_date = %rsvp_date%,
                    cost = %cost%,
                    date = %date%, 
                    time_start = %time_start_24%, 
                    time_end = %time_end_24%, 
                    has_time_end = %has_time_end%,
                    all_day = %all_day%,
                    repeat_mode = %repeat_mode%, 
                    offset = %offset%,
                    repeat_data = %repeat_data%,
                    repeat_period = %repeat_period%, 
                    repeat_weekdays = %repeat_weekdays%,
                    repeat_date_end = %repeat_date_end%,
                    more_info = %more_info%

                WHERE
                    id = %id%";
        $data["date"] = date("Y-m-d", $data["date"]);
        $data["rsvp_date"] = date("Y-m-d", $data["rsvp_date"]);
        $data["repeat_date_end"] = date("Y-m-d", $data["repeat_date_end"]);
        $this->db->query($sql, $data);
    }


    function deleteEvent($event_id)
    {
        $sql = "
                DELETE FROM
                    calendar_events
                WHERE
                    id = %eid%
                LIMIT 1";
        $this->db->query($sql, array("eid" => $event_id));
    }


    // weekdays converters

    var $weekdays_short = array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");

    // $days - array of weekdays nums, sunday - 0
    function weekdays2int($days)
    {
        $wd = 0;
        for ($i = 0; $i < count($days); $i++) {
            $wd = $wd | (1 << $days[$i]);
        }
        return $wd;
    }


    // weekdays order: lowest bit = sunday, then monday etc
    function int2weekdays($v)
    {
        $wd_js = array();
        $wd = (int)$v;
        for ($i = 0; $i < 7; $i++) {
            if ($wd & (1 << $i)) {
                $wd_js[] = $i;
            }
        }
        return $wd_js;
    }

    /**
     * Newsletters code
     * @param $time_start
     * @param $time_end
     * @param string $category_id
     * @param string $tags
     * @return null
     */
    function &getByPeriod($time_start, $time_end, $category_id = "", $tags = "")
    {
        $p = array(
            "dstart" => $time_start,
            "dend" => $time_end,
            "tf" => "%h:%i%p"
        );

        if ($tags != "") {
            $tags = str_replace(",", " ", $tags);
            $tags = explode(" ", $tags);

            $tags_where = array();
            for ($i = 0; $i < count($tags); $i++) {
                $t = trim($tags[$i]);
                if (strlen($t) > 2) {
                    $key = "tw" . $i;
                    $p[$key] = "%" . $t . "%";
                    $tags_where[] = "tags LIKE %" . $key . "%";
                }
            }
            $tags_where = "AND (" . implode(" OR ", $tags_where) . ")";
        } else {
            $tags_where = "";
        }
        $category_id = (int)$category_id;
        $category_where = $category_id ? " category_id = '" . addslashes($category_id) . "'" : "";

        $sql = "
                SELECT
                    id,
                    UNIX_TIMESTAMP(date) as date,
                    MONTH(date) as date_month,
                    YEAR(date) as date_year,
                    DAYOFMONTH(date) as date_day,
                    repeat_mode,
                    offset,
                    repeat_period,
                    repeat_weekdays,
                    UNIX_TIMESTAMP(repeat_date_end) as repeat_date_end
                FROM
                    calendar_events
                WHERE
                    " . $category_where . " AND
                    (
                        (repeat_mode = '' AND 
                         date > FROM_UNIXTIME(%dstart%) AND 
                         date < FROM_UNIXTIME(%dend%)
                        )
                        OR
                        (repeat_mode <> '' AND
                         (UNIX_TIMESTAMP(repeat_date_end) = 0 OR UNIX_TIMESTAMP(repeat_date_end) > FROM_UNIXTIME(%dstart%))
                        )
                    )" . $tags_where;


        $all = $this->db->get_list($sql, $p);
        $ids = array();
        for ($i = 0; $i < count($all); $i++) {
            $e =& $all[$i];
            if ($e["repeat_mode"] == "" || $this->isReccurence($e, $time_start, $time_end)) {
                $ids[] = $e["id"];
            }
        }


        if (count($ids)) {
            $sql = "
                    SELECT
                        e.id,
                        e.what,
                        e.tags,
                        e.description,
                        e.city,
                        e.street,
                        e.state,
                        e.country,
                        e.contact_name,
                        e.contact_phone,
                        UNIX_TIMESTAMP(e.rsvp_date) as rsvp_date,
                        e.cost,
                        UNIX_TIMESTAMP(e.date) as date,
                        DATE_FORMAT(e.time_start, %tf%) AS time_start,
                        DATE_FORMAT(e.time_end, %tf%) AS time_end,
                        e.has_time_end,
                        e.all_day,
                        e.repeat_mode,
                        e.offset,
                        e.repeat_period,
                        e.repeat_weekdays,
                        UNIX_TIMESTAMP(e.repeat_date_end) as repeat_date_end,
                        e.category_id as category_id,
                        c.title as category_title
                    FROM
                        calendar_events as e
                    LEFT JOIN
                        calendar_categories as c
                    ON
                        e.category_id = c.id
                    WHERE
                        e.id IN (" . implode(",", $ids) . ")";
            return $this->db->get_list($sql, $p);
        }
        return null;
    }


    function isReccurence($e, $time_start, $time_end)
    {
        if ($e["repeat_mode"] == "d") return true;

        $y = $e["date_year"];
        $m = $e["date_month"];
        $d = $e["date_day"];

        $n = $e["repeat_mode"];
        $p = $e["date"];
        if ($n == "w") {
            $n = "d";
            $mult = 7;
        } else {
            $mult = 1;
        }
        do {
            $p = mktime(0, 0, 0, $m, $d, $y);
            ${$n} += $e["repeat_period"];
        } while ($p < $time_start);

        return $p < $time_end;
    }


}