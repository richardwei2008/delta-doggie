<?php
namespace security;

require_once(dirname(__FILE__) ."/../database/DbConfig.php");
require_once(dirname(__FILE__) ."/../config/AppConfig.php");

require_once(dirname(__FILE__) . "/../dao/UserPDO.php");
require_once(dirname(__FILE__) . "/../service/MacService.php");


use \PDO;
use \PDOException;
use database\DbConfig;
use app\AppConfig;
use customer\UserPDO;

header('Content-Type: application/json; charset=utf-8');

$requestObj = json_decode(file_get_contents("php://input"));

session_start();

$sessionId = session_id();
$tokenService = new TokenService();


$type = $requestObj->type;
if ($type === 'READ') {
    $tokenService->startGame($sessionId);
} else if ($type === 'UPDATE') {
    $tokenService->updateGame($sessionId, $requestObj);
}

class TokenService
{
    function getToken($nonce) {
         return md5($nonce);
    }

    function getAccessToken($token, $sessionId) {
        return $token.':'.md5($token.AppConfig::APP_SECRET.$sessionId);
    }

    function startGame($sessionId) {
        $nonce = time();
        //echo "Session Id:".$sessionId.'<br>';
        $tokenService = new TokenService();
        $token = $tokenService->getToken($nonce);
        //echo "Token:".$token.'<br>';
        $accessToken = $tokenService->getAccessToken($token, $sessionId);

        $macService = new MacService(PHP_OS);
        $macIp = $macService->getIp();

        $userPDO = new UserPDO();
        $find = $userPDO->findByAccessToken($accessToken);
        if ($find) {
            echo json_encode(array('success'=>false, 'message'=>'非法访问，请重新参与游戏！'));
            return;
        }
        $ret = $userPDO->insertFullSingleRow($accessToken, $token, $nonce, date("Y-m-d H:i:s", time()), $sessionId, $macIp);
        //echo "Access Token:".$accessToken.'<br>';
        if($ret) {
            echo json_encode(array('success'=>true, 'message'=>'成功', 'accessToken'=>$accessToken));
        } else {
            echo json_encode(array('success'=>false, 'message'=>'非法访问，请重新参与游戏！'));
        }
    }

    function updateGame($sessionId, $requestObj) {
        $accessToken = $requestObj->accessToken;
        $level = $requestObj->level;
        $name = $requestObj->name;
        $cellphone = $requestObj->cellphone;

        if ($this->isInvalidInput($name) || $this->isInvalidInput($cellphone)) {
            echo json_encode(array('success'=>false,  'message'=>"填写完整信息！"));
            return;
        }


        $macService = new MacService(PHP_OS);
        $macIp = $macService->getIp();

        $userPDO = new UserPDO();
        $ret = $userPDO->checkIp($macIp, date("Y-m-d"), date("Y-m-d",strtotime("+1 day")));
        if (null !== $ret && $ret->numberOfWinner >= 1000) {
            echo json_encode(array('success'=>false, 'message'=>"您访问过于频繁，请明天再来！"));
            return;
        }

        $find = $userPDO->findByAccessToken($accessToken);
        if ($find) {
            $md5 = $this->getAccessToken($find->token, $sessionId);
            if ($find->accessToken !== $md5) {
                echo json_encode(array('success'=>false, 'message'=>'非法访问，请重新参与游戏！'));
                return;
            }

            $find = $userPDO->findByCellphone($cellphone);
            if ($find) {
                echo json_encode(array('success'=>false, 'message'=>'您已提交过联系信息，请耐心等待！'));
                return;
            }

            $ret = $userPDO->updateUser($accessToken, $level, $name, $cellphone);
            //echo "Access Token:".$accessToken.'<br>';
            if($ret) {
                echo json_encode(array('success'=>true, 'message'=>'提交成功',  'accessToken'=>$accessToken));
            } else {
                echo json_encode(array('success'=>false, 'message'=>'非法访问，请重新参与游戏！'));
            }
        } else {
            echo json_encode(array('success'=>false, 'message'=>'非法访问，请重新参与游戏！'));
        }
    }

    public function isInvalidInput($input) {
        if (null === $input || 'null' === $input || '' === trim($input) || '-1' === $input) {
            return true;
        }
        return false;
    }
}
