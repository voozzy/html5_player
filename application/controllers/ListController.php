<?php

class ListController extends Zend_Controller_Action
{
    protected $_db;

    public function init()
    {
        /* Initialize action controller here */
        $this->_db = Zend_Db_Table::getDefaultAdapter();
    }
    

    private function _SetFileQuality($quality, $path, $filename)
    {
        if ($quality == 'HD') {
            $quality = '
#EXT-X-STREAM-INF:BANDWIDTH=2000000,CODECS="avc1.66.30",RESOLUTION=1920x1080,AUDIO="aac"
' . $path . '/1080p' . $filename . '.mp4/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1200000,CODECS="avc1.66.30",RESOLUTION=1280x720,AUDIO="aac"
' . $path . '/720p' . $filename . '.mp4/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=600000,CODECS="avc1.66.30",RESOLUTION=852x480,AUDIO="aac"
' . $path . '/480p' . $filename . '.mp4/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=300000,CODECS="avc1.66.30",RESOLUTION=480x360,AUDIO="aac"
' . $path . '/360p' . $filename . '.mp4/index.m3u8
';
        } elseif ($quality == 'HQ') {
            $quality = '
#EXT-X-STREAM-INF:BANDWIDTH=1200000,CODECS="avc1.66.30",RESOLUTION=1280x720,AUDIO="aac"
' . $path . '/720p' . $filename . '.mp4/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=600000,CODECS="avc1.66.30",RESOLUTION=852x480,AUDIO="aac"
' . $path . '/480p' . $filename . '.mp4/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=300000,CODECS="avc1.66.30",RESOLUTION=480x360,AUDIO="aac"
' . $path . '/360p' . $filename . '.mp4/index.m3u8
';
        } elseif ($quality == 'SQ') {
            $quality = '
#EXT-X-STREAM-INF:BANDWIDTH=600000,CODECS="avc1.66.30",RESOLUTION=852x480
' . $path . '/480p' . $filename . '.mp4/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=300000,CODECS="avc1.66.30",RESOLUTION=480x360
' . $path . '/360p' . $filename . '.mp4/index.m3u8
';
        } elseif ($quality == 'LQ') {
            $quality = '
#EXT-X-STREAM-INF:BANDWIDTH=300000,CODECS="avc1.66.30",RESOLUTION=480x360,AUDIO="aac"
' . $path . '/360p' . $filename . '.mp4/index.m3u8
';
        }
        return $quality;
    }

    public function indexAction()
    {
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        if($_GET['file']){
            $fileid = $_GET['file'];
        }

        $getFilm = $this->_db->fetchAll("SELECT f.id, f.page_id, fw.id as windowId, fw.quality, fw.name FROM film_window AS fw JOIN films AS f ON f.id = fw.films_id WHERE fw.films_id = (SELECT ffw.films_id FROM film_window AS ffw JOIN new_files AS nf ON nf.window_id = ffw.id WHERE nf.id = '".$fileid."' LIMIT 1)");
//        $film[] = $getFilm = $this->_db->fetchRow("SELECT f.id, f.page_id, fw.id as windowId, fw.quality, fw.name FROM films AS f JOIN film_window AS fw ON fw.films_id = f.id JOIN new_files AS nf ON nf.window_id = fw.id WHERE nf.id ='" . $fileid . "'");

//        if($getFilm['page_id'] == '15') {
//            $recordingStudio = explode(' ', $getFilm['name']);
//            $otherPart = $this->_db->fetchAll("SELECT f.id, f.page_id, fw.id as windowId, fw.quality, fw.name FROM films AS f JOIN film_anotherpart AS fa ON fa.films_id = f.id JOIN film_window AS fw ON fw.films_id = f.id WHERE fa.id_anotherpart IN('".$getFilm['id']."') AND fw.name LIKE '%".$recordingStudio[count($recordingStudio) - 1]."%' ");
//            if($otherPart){
//                $film = array_merge_recursive($film, $otherPart);
//            }
//        }


        $jsonlist = '[';
        foreach ($getFilm as $keyFilm => $valueFilm) {
            $jsonlist .= '
    {
                "name" : "' . $valueFilm['name'] . '",
            "sources" : [';

            $filelist = $this->_db->fetchAll('SELECT nf.* FROM new_files AS nf WHERE nf.window_id="' . $valueFilm['windowId'] . '" order by name ');


            foreach ($filelist as $key => $value) {
                $INF = '#EXTM3U
#EXT-X-VERSION:3
';
                $path = 'http://st' . $value['id_storages'] . '.3tv.im/hls/films/' . $valueFilm['page_id'] . '/' . $valueFilm['id'] . '/' . $valueFilm['windowId'];

//                            $getAudio = $db->fetchAll("SELECT * FROM new_audio WHERE new_file_id='".$value['id']."' ");

//                            if($getAudio) {
//                                foreach ($getAudio as $keyAudio => $valueAudio) {
//$INF .= '#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="aac",NAME="'.$valueAudio['name'].'", DEFAULT=NO,LANGUAGE="'.substr($valueAudio['name'],0,2).'",URI="http://st'.$value['id_storages'].'.3tv.im/hls/films/'.$valueFilm['page_id'].'/'.$valueFilm['id'].'/'.$valueFilm['windowId'].'/'.$valueAudio['name'].'/index.m3u8"
//';
//echo $INF;
//                                }
//                            }

                $play = $this->_SetFileQuality($valueFilm['quality'], $path, $value['name']);
//                            var_dump($play);
//                            echo '<br>';

                $myfile = fopen('/tmp/cdn/' . $value['name'] . '.m3u8', "w") or die("Unable to open file!");;
                fwrite($myfile, $INF);
                fwrite($myfile, $play);
                fclose($myfile);

                $jsonlist .= '
                        {"src" : "http://player.3tv.im/m3u8/' . $value['name'] . '.m3u8", "label": "' . $value['name'] . '"},';


            }
            $jsonlist = substr($jsonlist, 0, strlen($jsonlist) - 1);

            $jsonlist .= '
                ]
    },';
        }
        $jsonlist = substr($jsonlist, 0, strlen($jsonlist) - 1);

        $jsonlist .= '
]
';
        header("Access-Control-Allow-Origin: * ");
        header('Content-Type: application/json; charset=utf-8');
        echo $jsonlist;
    }

}