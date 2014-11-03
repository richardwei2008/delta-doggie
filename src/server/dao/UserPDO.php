<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 14-8-12
 * Time: 下午11:09
 */

namespace customer;
require_once(dirname(__FILE__) ."/../database/DbConfig.php");

use \PDO;
use \PDOException;
use database\DbConfig;

class UserPDO {

    private $conn = null;

    /**
     * @param null|\PDO $conn
     */
    public function setConn($conn)
    {
        return $this->conn;
    }

    /**
     * @return null|\PDO
     */
    public function getConn()
    {
        if ($this->conn == null) {
            $connectionString = sprintf("mysql:host=%s;dbname=%s",
                DbConfig::DB_HOST,
                DbConfig::DB_NAME);
            try {
                $this->conn = new PDO($connectionString,
                    DbConfig::DB_USER,
                    DbConfig::DB_PASSWORD,
                    array(PDO::MYSQL_ATTR_INIT_COMMAND => "set names utf8")
                );
                //            echo "Connected successfully.";
            } catch (PDOException $pe) {
                die($pe->getMessage());
            }
        }
        return $this->conn;
    }

    /**
     * Open the database connection
     */
    public function __construct(){
    }

    public function insertSingleRow($openid){
        try {
            $clnq_user_info = array(
                ':openid' => $openid);

            $sql = 'INSERT INTO clnq_user_info(openid)
                    VALUES(:openid)';
            $q = $this->getConn()->prepare($sql);

            if($q->execute($clnq_user_info)) {
                return $this->getConn()->lastInsertId();
            } else {
                return 0;
            }
        } catch (Exception $ex) {
            echo($ex->getMessage());
        }
    }

    public function insertFullSingleRow($accessToken, $token, $nonce, $servertime, $sessionId, $macIp){
        try {
            $dlt_user_info = array(
                ':accessToken' => $accessToken,
                ':token' => $token,
                ':nonce' => $nonce,
                ':servertime' => $servertime,
                ':sessionId' => $sessionId,
                ':macIp' => $macIp
            );

            $sql = 'INSERT INTO dlt_user_info(accessToken, token, nonce, servertime, sessionId, macIp)
                    VALUES(:accessToken, :token, :nonce, :servertime, :sessionId, :macIp)';
            $q = $this->getConn()->prepare($sql);

            if($q->execute($dlt_user_info)) {
                return $this->getConn()->lastInsertId();
            } else {
                return 0;
            }
        } catch (Exception $ex) {
            echo($ex->getMessage());
        }
    }

    public function updateUser($accessToken, $level, $name, $cellphone){
        try {
            $dlt_user_info = array(
                ':accessToken' => $accessToken,
                ':level' => $level,
                ':name' => $name,
                ':cellphone' => $cellphone,
                ':lastupdatetime' => date("Y-m-d H:i:s", time())
            );

            $sql = 'UPDATE dlt_user_info
                    set level = :level,
                     name =:name,
                     cellphone = :cellphone,
                     lastupdatetime = :lastupdatetime
                    WHERE accessToken = :accessToken';
            $q = $this->getConn()->prepare($sql);

            if($q->execute($dlt_user_info)) {
                return 1;
            } else {
                return 0;
            }
        } catch (Exception $ex) {
            echo($ex->getMessage());
        }
    }

    public function findByAccessToken($accessToken){
        try {
            $dlt_user_info = array(
                ':accessToken' => $accessToken);

            $sql = 'SELECT accessToken, token, nonce, sessionId, macIp
                    FROM dlt_user_info
                    WHERE accessToken  = :accessToken';

            $q = $this->getConn()->prepare($sql);
            $q->execute($dlt_user_info);
            $q->setFetchMode(PDO::FETCH_ASSOC);
            while ($r = $q->fetchObject()) {
                return $r;
            }
        } catch (Exception $ex) {
            echo($ex->getMessage());
        }
    }

    public function findByCellphone($cellphone){
        try {
            $dlt_user_info = array(
                ':cellphone' => $cellphone);

            $sql = 'SELECT accessToken, token, nonce, sessionId, macIp
                    FROM dlt_user_info
                    WHERE cellphone  = :cellphone';

            $q = $this->getConn()->prepare($sql);
            $q->execute($dlt_user_info);
            $q->setFetchMode(PDO::FETCH_ASSOC);
            while ($r = $q->fetchObject()) {
                return $r;
            }
        } catch (Exception $ex) {
            echo($ex->getMessage());
        }
    }

    public function checkIp($macIp, $dateFrom, $dateTo){
        try {
            $dlt_user_info = array(
                ':macIp' => $macIp,
                ':dateFrom'     => $dateFrom,
                ':dateTo'     => $dateTo
            );

            $sql = 'SELECT count(1) as numberOfWinner
                    FROM dlt_user_info
                    WHERE macIp = :macIp
                    AND createtime BETWEEN :dateFrom AND :dateTo';

            $q = $this->getConn()->prepare($sql);
            $q->execute($dlt_user_info);
            $q->setFetchMode(PDO::FETCH_ASSOC);
            while ($r = $q->fetchObject()) {
                return $r;
            }
        } catch (Exception $ex) {
            echo($ex->getMessage());
        }
    }
}
