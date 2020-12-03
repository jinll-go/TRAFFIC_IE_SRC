import Vue from 'vue'; //此处import进来的模块(vue.runtime.js)有问题。导致$store属性注入失败
import Vuex from 'vuex';

import Base from './modules/base';
import Login from './modules/login';
import Preview from './modules/preview';
import Playback from './modules/playback';
import File from './modules/file';
import Config from './modules/config';

import PTZ from './modules/ptz';
import PTZExtend from './modules/ptzextend';

import DeviceInfo from './modules/deviceinfo/deviceinfo';
//import QRCode from './modules/deviceinfo/qrcode';
//import Decoder from './modules/deviceinfo/decoder';
//import AudioSet from './modules/deviceinfo/audioset';
//import TimeSet from './modules/deviceinfo/timeset';

//import VideoShow from './modules/channels/videoshow';
//import VideoSet from './modules/channels/videoset';
//import VideoPara from './modules/channels/videopara';
//import Movement from './modules/channels/movement';
//import MotionDetection from './modules/channels/motiondetection';
//import Sections from './modules/channels/sections';
//import LinkTypeCfg from './modules/channels/linktypecfg';
//import VideoHide from './modules/channels/videohide';
//import VideoShelter from './modules/channels/videoshelter';
//import VideoCounter from './modules/channels/videocounter';
//import VideoAreaDetect from './modules/channels/videoareadetect';
//import VideoObject from './modules/channels/videoobject';
//import SoundAlarm from './modules/channels/soundalarm';
//import VirtualLine from './modules/channels/virtualline';
//import SmartMotion from './modules/channels/smartmotion';
//import VideoDiagnose from './modules/channels/videodiagnose';
//import FireDetect from './modules/channels/firedetect';
//import FaceDetect from './modules/channels/facedetect';
//import PlateDetect from './modules/channels/platedetect';
//import VideoPlan from './modules/channels/videoplan';

//import VideoRetrograde from './modules/channels/videoretrograde';
//import VideoMaxHeight from './modules/channels/videomaxheight';
//import VideoDensity from './modules/channels/videodensity';
//import VideoHuman from './modules/channels/videohuman';

//import NetWorkSetting from './modules/network/networksetting';
//import Wifi from './modules/network/wifi';
//import PlatForm from './modules/network/platform';
//import Multicast from './modules/network/multicast';
//import DDNS from './modules/network/ddns';
//import NAS from './modules/network/nas';

//import NTP from './modules/network/ntp';
//import Email from './modules/network/email';
//import Ftp from './modules/network/ftp';
//import SIP from './modules/network/sip';
//import Snmp from './modules/network/snmp';
//import Upnp from './modules/network/upnp';
//import BlackWhiteList from './modules/network/blackwhitelist';

//import AlarmIn from './modules/alarm/alarmin';
//import AlarmOut from './modules/alarm/alarmout';
//import AlarmException from './modules/alarm/alarmexception';

import UserManage from './modules/usermanage/usermanage';

//import Update from './modules/system/update';
import AutoReboot from './modules/system/autoreboot';
import LocalSettings from './modules/system/localsettings';

//import WaterMark from './modules/system/watermark';

//import Restore from './modules/system/restore';
//import HD from './modules/system/hd';
//import Developer from './modules/system/developer';

import Log from './modules/log';

import Face from './modules/face';
import Person from './modules/person';
import Temperature from './modules/temperature';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        Base,

        Login,
        Preview,
        Playback,
        File,
        Config,
        PTZ,
        PTZExtend,

        DeviceInfo,

        UserManage,

        AutoReboot,
        LocalSettings,

        Log,
        Face,
        Person,

        Temperature,
    },
});
