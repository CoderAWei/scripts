"use strict";
/**
 * 京喜财富岛
 * 包含雇佣导游，建议每小时1次
 *
 * 此版本暂定默认帮助HelloWorld，帮助助力池
 * export CFD_HELP_HW = true    // 帮助HelloWorld
 * export CFD_HELP_POOL = true  // 帮助助力池
 *
 * 使用jd_env_copy.js同步js环境变量到ts
 * 使用jd_ts_test.ts测试环境变量
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var date_fns_1 = require("date-fns");
var axios_1 = require("axios");
var raw_TS_USER_AGENTS_1 = require("./raw_TS_USER_AGENTS");
var dotenv = require("dotenv");
var CryptoJS = require('crypto-js');
dotenv.config();
var appId = 10028, fingerprint, token, enCryptMethodJD;
var cookie = '', cookiesArr = [], res = '', shareCodes = [];
var CFD_HELP_HW = process.env.CFD_HELP_HW ? process.env.CFD_HELP_HW : "true";
console.log('帮助HelloWorld:', CFD_HELP_HW);
var CFD_HELP_POOL = process.env.CFD_HELP_POOL ? process.env.CFD_HELP_POOL : "true";
console.log('帮助助力池:', CFD_HELP_POOL);
var UserName, index, isLogin, nickName;
!(function () { return __awaiter(void 0, void 0, void 0, function () {
    var i, e_1, employee, _i, employee_1, emp, empRes, _a, _b, sign, bags, _c, _d, s, strTypeCnt, n, shipRes, tasks, _e, _f, t, _g, _h, e, employ, _j, _k, t, _l, _m, b, i, j;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0: return [4 /*yield*/, requestAlgo()];
            case 1:
                _o.sent();
                return [4 /*yield*/, requireConfig()];
            case 2:
                _o.sent();
                i = 0;
                _o.label = 3;
            case 3:
                if (!(i < cookiesArr.length)) return [3 /*break*/, 63];
                cookie = cookiesArr[i];
                UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)[1]);
                index = i + 1;
                isLogin = true;
                nickName = '';
                console.log("\n\u5F00\u59CB\u3010\u4EAC\u4E1C\u8D26\u53F7" + index + "\u3011" + (nickName || UserName) + "\n");
                _o.label = 4;
            case 4:
                _o.trys.push([4, 6, , 7]);
                return [4 /*yield*/, makeShareCodes()];
            case 5:
                _o.sent();
                return [3 /*break*/, 7];
            case 6:
                e_1 = _o.sent();
                console.log(e_1);
                return [3 /*break*/, 7];
            case 7: return [4 /*yield*/, api('story/GetTakeAggrPage', '_cfd_t,bizCode,dwEnv,ptag,source,strZone')];
            case 8:
                // 签到 助力奖励
                res = _o.sent();
                employee = res.Data.Employee.EmployeeList.filter(function (e) {
                    return e.dwStatus === 0;
                });
                _i = 0, employee_1 = employee;
                _o.label = 9;
            case 9:
                if (!(_i < employee_1.length)) return [3 /*break*/, 13];
                emp = employee_1[_i];
                return [4 /*yield*/, api('story/helpdraw', '_cfd_t,bizCode,dwEnv,dwUserId,ptag,source,strZone', { dwUserId: emp.dwId })];
            case 10:
                empRes = _o.sent();
                if (empRes.iRet === 0)
                    console.log('助力奖励领取成功：', empRes.Data.ddwCoin);
                return [4 /*yield*/, wait(1000)];
            case 11:
                _o.sent();
                _o.label = 12;
            case 12:
                _i++;
                return [3 /*break*/, 9];
            case 13:
                if (!(res.Data.Sign.dwTodayStatus === 0)) return [3 /*break*/, 17];
                _a = 0, _b = res.Data.Sign.SignList;
                _o.label = 14;
            case 14:
                if (!(_a < _b.length)) return [3 /*break*/, 17];
                sign = _b[_a];
                if (!(sign.dwDayId === res.Data.Sign.dwTodayId)) return [3 /*break*/, 16];
                return [4 /*yield*/, api('story/RewardSign', '_cfd_t,bizCode,ddwCoin,ddwMoney,dwEnv,dwPrizeLv,dwPrizeType,ptag,source,strPrizePool,strZone', { ddwCoin: sign.ddwCoin, ddwMoney: sign.ddwMoney, dwPrizeLv: sign.dwBingoLevel, dwPrizeType: sign.dwPrizeType, strPrizePool: sign.strPrizePool })];
            case 15:
                res = _o.sent();
                if (res.iRet === 0)
                    console.log('签到成功：', res.Data.ddwCoin, res.Data.ddwMoney, res.Data.strPrizePool);
                return [3 /*break*/, 17];
            case 16:
                _a++;
                return [3 /*break*/, 14];
            case 17: return [4 /*yield*/, api('story/querystorageroom', '_cfd_t,bizCode,dwEnv,ptag,source,strZone')];
            case 18:
                // 清空背包
                res = _o.sent();
                console.log(res);
                bags = [];
                for (_c = 0, _d = res.Data.Office; _c < _d.length; _c++) {
                    s = _d[_c];
                    console.log(s.dwCount, s.dwType);
                    bags.push(s.dwType);
                    bags.push(s.dwCount);
                }
                return [4 /*yield*/, wait(1000)];
            case 19:
                _o.sent();
                strTypeCnt = '';
                for (n = 0; n < bags.length; n++) {
                    if (n % 2 === 0)
                        strTypeCnt += bags[n] + ":";
                    else
                        strTypeCnt += bags[n] + "|";
                }
                if (!(bags.length !== 0)) return [3 /*break*/, 21];
                return [4 /*yield*/, api('story/sellgoods', '_cfd_t,bizCode,dwEnv,dwSceneId,ptag,source,strTypeCnt,strZone', { dwSceneId: '1', strTypeCnt: strTypeCnt })];
            case 20:
                res = _o.sent();
                console.log('卖贝壳收入:', res.Data.ddwCoin, res.Data.ddwMoney);
                _o.label = 21;
            case 21: return [4 /*yield*/, api('user/QueryUserInfo', '_cfd_t,bizCode,ddwTaskId,dwEnv,ptag,source,strShareId,strZone', { ddwTaskId: '', strShareId: '', strMarkList: 'undefined' })];
            case 22:
                // 船来了
                res = _o.sent();
                if (!res.StoryInfo.StoryList) return [3 /*break*/, 27];
                console.log(JSON.stringify(res));
                if (!res.StoryInfo.StoryList[0].Special) return [3 /*break*/, 26];
                console.log("\u8239\u6765\u4E86\uFF0C\u4E58\u5BA2\u662F" + res.StoryInfo.StoryList[0].Special.strName);
                return [4 /*yield*/, api('story/SpecialUserOper', '_cfd_t,bizCode,ddwTriggerDay,dwEnv,dwType,ptag,source,strStoryId,strZone,triggerType', { strStoryId: res.StoryInfo.StoryList[0].strStoryId, dwType: '2', triggerType: 0, ddwTriggerDay: res.StoryInfo.StoryList[0].ddwTriggerDay })];
            case 23:
                shipRes = _o.sent();
                console.log(shipRes);
                console.log('正在下船，等待30s');
                return [4 /*yield*/, wait(30000)];
            case 24:
                _o.sent();
                return [4 /*yield*/, api('story/SpecialUserOper', '_cfd_t,bizCode,ddwTriggerDay,dwEnv,dwType,ptag,source,strStoryId,strZone,triggerType', { strStoryId: res.StoryInfo.StoryList[0].strStoryId, dwType: '3', triggerType: 0, ddwTriggerDay: res.StoryInfo.StoryList[0].ddwTriggerDay })];
            case 25:
                shipRes = _o.sent();
                if (shipRes.iRet === 0)
                    console.log('船客接待成功');
                else
                    console.log('船客接待失败', shipRes);
                _o.label = 26;
            case 26:
                if (res.StoryInfo.StoryList[0].Collector) {
                    console.log('收藏家出现');
                }
                _o.label = 27;
            case 27: return [4 /*yield*/, api('story/QueryRubbishInfo', '_cfd_t,bizCode,dwEnv,ptag,source,strZone')];
            case 28:
                // 垃圾🚮
                res = _o.sent();
                if (!(res.Data.StoryInfo.StoryList.length !== 0)) return [3 /*break*/, 30];
                return [4 /*yield*/, api('story/RubbishOper', '')];
            case 29:
                _o.sent();
                _o.label = 30;
            case 30:
                tasks = void 0;
                return [4 /*yield*/, api('story/GetActTask', '_cfd_t,bizCode,dwEnv,ptag,source,strZone')];
            case 31:
                tasks = _o.sent();
                _e = 0, _f = tasks.Data.TaskList;
                _o.label = 32;
            case 32:
                if (!(_e < _f.length)) return [3 /*break*/, 36];
                t = _f[_e];
                if (!(t.dwCompleteNum === t.dwTargetNum && t.dwAwardStatus === 2)) return [3 /*break*/, 35];
                return [4 /*yield*/, api('Award', '_cfd_t,bizCode,dwEnv,ptag,source,strZone,taskId', { taskId: t.ddwTaskId })];
            case 33:
                res = _o.sent();
                if (res.ret === 0) {
                    console.log(t.strTaskName + "\u9886\u5956\u6210\u529F:", res.data.prizeInfo);
                }
                return [4 /*yield*/, wait(1000)];
            case 34:
                _o.sent();
                _o.label = 35;
            case 35:
                _e++;
                return [3 /*break*/, 32];
            case 36: return [4 /*yield*/, api('user/EmployTourGuideInfo', '_cfd_t,bizCode,dwEnv,ptag,source,strZone')];
            case 37:
                // 导游
                res = _o.sent();
                if (!!res.TourGuideList) return [3 /*break*/, 38];
                console.log('手动雇佣4个试用导游');
                return [3 /*break*/, 43];
            case 38:
                _g = 0, _h = res.TourGuideList;
                _o.label = 39;
            case 39:
                if (!(_g < _h.length)) return [3 /*break*/, 43];
                e = _h[_g];
                if (!(e.strBuildIndex !== 'food' && e.ddwRemainTm === 0)) return [3 /*break*/, 42];
                return [4 /*yield*/, api('user/EmployTourGuide', '_cfd_t,bizCode,ddwConsumeCoin,dwEnv,dwIsFree,ptag,source,strBuildIndex,strZone', { ddwConsumeCoin: e.ddwCostCoin, dwIsFree: 0, strBuildIndex: e.strBuildIndex })];
            case 40:
                employ = _o.sent();
                if (employ.iRet === 0)
                    console.log("\u96C7\u4F63" + e.strBuildIndex + "\u5BFC\u6E38\u6210\u529F");
                if (employ.iRet === 2003)
                    return [3 /*break*/, 43];
                return [4 /*yield*/, wait(1000)];
            case 41:
                _o.sent();
                _o.label = 42;
            case 42:
                _g++;
                return [3 /*break*/, 39];
            case 43: return [4 /*yield*/, mainTask('GetUserTaskStatusList', '_cfd_t,bizCode,dwEnv,ptag,source,strZone,taskId', { taskId: 0 })];
            case 44:
                // 任务⬇️
                tasks = _o.sent();
                _j = 0, _k = tasks.data.userTaskStatusList;
                _o.label = 45;
            case 45:
                if (!(_j < _k.length)) return [3 /*break*/, 52];
                t = _k[_j];
                if (!(t.dateType === 2)) return [3 /*break*/, 51];
                if (!(t.awardStatus === 2 && t.completedTimes === t.targetTimes)) return [3 /*break*/, 48];
                console.log(1, t.taskName);
                return [4 /*yield*/, mainTask('Award', '_cfd_t,bizCode,dwEnv,ptag,source,strZone,taskId', { taskId: t.taskId })];
            case 46:
                res = _o.sent();
                console.log(res);
                if (res.ret === 0) {
                    console.log(t.taskName + "\u9886\u5956\u6210\u529F:", res.data.prizeInfo);
                }
                return [4 /*yield*/, wait(2000)];
            case 47:
                _o.sent();
                return [3 /*break*/, 51];
            case 48:
                if (!(t.awardStatus === 2 && t.completedTimes < t.targetTimes && ([1, 2, 3, 4].includes(t.orderId)))) return [3 /*break*/, 51];
                console.log('做任务:', t.taskId, t.taskName, t.completedTimes, t.targetTimes);
                return [4 /*yield*/, mainTask('DoTask', '_cfd_t,bizCode,configExtra,dwEnv,ptag,source,strZone,taskId', { taskId: t.taskId, configExtra: '' })];
            case 49:
                res = _o.sent();
                console.log('做任务:', res);
                return [4 /*yield*/, wait(5000)];
            case 50:
                _o.sent();
                _o.label = 51;
            case 51:
                _j++;
                return [3 /*break*/, 45];
            case 52:
                _l = 0, _m = ['food', 'fun', 'shop', 'sea'];
                _o.label = 53;
            case 53:
                if (!(_l < _m.length)) return [3 /*break*/, 62];
                b = _m[_l];
                return [4 /*yield*/, api('user/GetBuildInfo', '_cfd_t,bizCode,dwEnv,dwType,ptag,source,strBuildIndex,strZone', { strBuildIndex: b })];
            case 54:
                res = _o.sent();
                console.log(b + "\u5347\u7EA7\u9700\u8981:", res.ddwNextLvlCostCoin);
                return [4 /*yield*/, wait(1000)];
            case 55:
                _o.sent();
                if (!(res.dwCanLvlUp === 1)) return [3 /*break*/, 58];
                return [4 /*yield*/, api('user/BuildLvlUp', '_cfd_t,bizCode,ddwCostCoin,dwEnv,ptag,source,strBuildIndex,strZone', { ddwCostCoin: res.ddwNextLvlCostCoin, strBuildIndex: b })];
            case 56:
                res = _o.sent();
                if (!(res.iRet === 0)) return [3 /*break*/, 58];
                console.log("\u5347\u7EA7\u6210\u529F");
                return [4 /*yield*/, wait(2000)];
            case 57:
                _o.sent();
                _o.label = 58;
            case 58: return [4 /*yield*/, api('user/CollectCoin', '_cfd_t,bizCode,dwEnv,dwType,ptag,source,strBuildIndex,strZone', { strBuildIndex: b, dwType: '1' })];
            case 59:
                res = _o.sent();
                console.log(b + "\u6536\u91D1\u5E01:", res.ddwCoin);
                return [4 /*yield*/, wait(1000)];
            case 60:
                _o.sent();
                _o.label = 61;
            case 61:
                _l++;
                return [3 /*break*/, 53];
            case 62:
                i++;
                return [3 /*break*/, 3];
            case 63:
                // 获取随机助力码
                if (CFD_HELP_HW === 'true') {
                    console.log('这里原本是获取HelloWorld的助力码！');
                }
                if (CFD_HELP_POOL === 'true') {
                    console.log('要是帮助助力池，我的助力就没拉！');
                }
                else {
                    console.log('你的设置是不帮助助力池！');
                }
                i = 0;
                _o.label = 64;
            case 64:
                if (!(i < cookiesArr.length)) return [3 /*break*/, 70];
                j = 0;
                _o.label = 65;
            case 65:
                if (!(j < shareCodes.length)) return [3 /*break*/, 69];
                cookie = cookiesArr[i];
                console.log('去助力:', shareCodes[j]);
                return [4 /*yield*/, api('story/helpbystage', '_cfd_t,bizCode,dwEnv,ptag,source,strShareId,strZone', { strShareId: shareCodes[j] })];
            case 66:
                res = _o.sent();
                console.log('助力:', res);
                if (res.iRet === 2232 || res.sErrMsg === '今日助力次数达到上限，明天再来帮忙吧~') {
                    return [3 /*break*/, 69];
                }
                return [4 /*yield*/, wait(3000)];
            case 67:
                _o.sent();
                _o.label = 68;
            case 68:
                j++;
                return [3 /*break*/, 65];
            case 69:
                i++;
                return [3 /*break*/, 64];
            case 70: return [2 /*return*/];
        }
    });
}); })();
function api(fn, stk, params) {
    var _this = this;
    if (params === void 0) { params = {}; }
    return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
        var url, key, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://m.jingxi.com/jxbfd/" + fn + "?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=" + Date.now() + "&ptag=&_ste=1&_=" + Date.now() + "&sceneval=2&_stk=" + encodeURIComponent(stk);
                    if (['GetUserTaskStatusList', 'Award', 'DoTask'].includes(fn)) {
                        console.log('api2');
                        url = "https://m.jingxi.com/newtasksys/newtasksys_front/" + fn + "?strZone=jxbfd&bizCode=jxbfddch&source=jxbfd&dwEnv=7&_cfd_t=" + Date.now() + "&ptag=&_stk=" + encodeURIComponent(stk) + "&_ste=1&_=" + Date.now() + "&sceneval=2";
                    }
                    if (Object.keys(params).length !== 0) {
                        key = void 0;
                        for (key in params) {
                            if (params.hasOwnProperty(key))
                                url += "&" + key + "=" + params[key];
                        }
                    }
                    url += '&h5st=' + decrypt(stk, url);
                    return [4 /*yield*/, axios_1["default"].get(url, {
                            headers: {
                                'Host': 'm.jingxi.com',
                                'Referer': 'https://st.jingxi.com/',
                                'User-Agent': raw_TS_USER_AGENTS_1["default"],
                                'Cookie': cookie
                            }
                        })];
                case 1:
                    data = (_a.sent()).data;
                    resolve(data);
                    return [2 /*return*/];
            }
        });
    }); });
}
function mainTask(fn, stk, params) {
    var _this = this;
    if (params === void 0) { params = {}; }
    return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
        var url, key, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://m.jingxi.com/newtasksys/newtasksys_front/" + fn + "?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=" + Date.now() + "&ptag=&_stk=" + encodeURIComponent(stk) + "&_ste=1&_=" + Date.now() + "&sceneval=2";
                    if (Object.keys(params).length !== 0) {
                        key = void 0;
                        for (key in params) {
                            if (params.hasOwnProperty(key))
                                url += "&" + key + "=" + params[key];
                        }
                    }
                    url += '&h5st=' + decrypt(stk, url);
                    return [4 /*yield*/, axios_1["default"].get(url, {
                            headers: {
                                'X-Requested-With': 'com.jd.pingou',
                                'Referer': 'https://st.jingxi.com/',
                                'Host': 'm.jingxi.com',
                                'User-Agent': raw_TS_USER_AGENTS_1["default"],
                                'Cookie': cookie
                            }
                        })];
                case 1:
                    data = (_a.sent()).data;
                    resolve(data);
                    return [2 /*return*/];
            }
        });
    }); });
}
function makeShareCodes() {
    var _this = this;
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api('user/QueryUserInfo', '_cfd_t,bizCode,ddwTaskId,dwEnv,ptag,source,strShareId,strZone', { ddwTaskId: '', strShareId: '', strMarkList: 'undefined' })];
                case 1:
                    res = _a.sent();
                    console.log('助力码:', res.strMyShareId);
                    shareCodes.push(res.strMyShareId);
                    resolve();
                    return [2 /*return*/];
            }
        });
    }); });
}
function requestAlgo() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, generateFp()];
                case 1:
                    fingerprint = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                            var data, enCryptMethodJDString;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, axios_1["default"].post('https://cactus.jd.com/request_algo?g_ty=ajax', {
                                            "version": "1.0",
                                            "fp": fingerprint,
                                            "appId": appId,
                                            "timestamp": Date.now(),
                                            "platform": "web",
                                            "expandParams": ""
                                        }, {
                                            "headers": {
                                                'Authority': 'cactus.jd.com',
                                                'Pragma': 'no-cache',
                                                'Cache-Control': 'no-cache',
                                                'Accept': 'application/json',
                                                'User-Agent': raw_TS_USER_AGENTS_1["default"],
                                                'Content-Type': 'application/json',
                                                'Origin': 'https://st.jingxi.com',
                                                'Sec-Fetch-Site': 'cross-site',
                                                'Sec-Fetch-Mode': 'cors',
                                                'Sec-Fetch-Dest': 'empty',
                                                'Referer': 'https://st.jingxi.com/',
                                                'Accept-Language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7'
                                            }
                                        })];
                                    case 1:
                                        data = (_a.sent()).data;
                                        if (data['status'] === 200) {
                                            token = data.data.result.tk;
                                            enCryptMethodJDString = data.data.result.algo;
                                            if (enCryptMethodJDString)
                                                enCryptMethodJD = new Function("return " + enCryptMethodJDString)();
                                        }
                                        else {
                                            console.log("fp: " + fingerprint);
                                            console.log('request_algo 签名参数API请求失败:');
                                        }
                                        resolve(200);
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
            }
        });
    });
}
function decrypt(stk, url) {
    var timestamp = (date_fns_1.format(new Date(), 'yyyyMMddhhmmssSSS'));
    var hash1;
    if (fingerprint && token && enCryptMethodJD) {
        hash1 = enCryptMethodJD(token, fingerprint.toString(), timestamp.toString(), appId.toString(), CryptoJS).toString(CryptoJS.enc.Hex);
    }
    else {
        var random = '5gkjB6SpmC9s';
        token = "tk01wcdf61cb3a8nYUtHcmhSUFFCfddDPRvKvYaMjHkxo6Aj7dhzO+GXGFa9nPXfcgT+mULoF1b1YIS1ghvSlbwhE0Xc";
        fingerprint = 9686767825751161;
        // $.fingerprint = 7811850938414161;
        var str = "" + token + fingerprint + timestamp + appId + random;
        hash1 = CryptoJS.SHA512(str, token).toString(CryptoJS.enc.Hex);
    }
    var st = '';
    stk.split(',').map(function (item, index) {
        st += item + ":" + getQueryString(url, item) + (index === stk.split(',').length - 1 ? '' : '&');
    });
    var hash2 = CryptoJS.HmacSHA256(st, hash1.toString()).toString(CryptoJS.enc.Hex);
    return encodeURIComponent(["".concat(timestamp.toString()), "".concat(fingerprint.toString()), "".concat(appId.toString()), "".concat(token), "".concat(hash2)].join(";"));
}
function requireConfig() {
    return new Promise(function (resolve) {
        console.log('开始获取配置文件\n');
        var jdCookieNode = require('./jdCookie.js');
        Object.keys(jdCookieNode).forEach(function (item) {
            if (jdCookieNode[item]) {
                cookiesArr.push(jdCookieNode[item]);
            }
        });
        console.log("\u5171" + cookiesArr.length + "\u4E2A\u4EAC\u4E1C\u8D26\u53F7\n");
        resolve();
    });
}
function generateFp() {
    var e = "0123456789";
    var a = 13;
    var i = '';
    for (; a--;)
        i += e[Math.random() * e.length | 0];
    return (i + Date.now()).slice(0, 16);
}
function getQueryString(url, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = url.split('?')[1].match(reg);
    if (r != null)
        return unescape(r[2]);
    return '';
}
function wait(t) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, t);
    });
}
