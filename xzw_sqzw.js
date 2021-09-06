/*
#胜券在握

入口 京东 频道 美食馆
[task_local]
0 11 * * *
活动地址： https://h5.m.jd.com/babelDiy/Zeus/3Ck6vd8Tz4sJFme5keU9KifFM3aW/index.html?babelChannel=ttt7&activityKey=ebac35856fbbb121653a4006cbb681c9&tttparams=bPQ5UKeB8eyJnTGF0IjoiMzAuNzA4NzQiLCJnTG5nIjoiMTA0LjA5NDc0Mi9J9&lng=104.067741&lat=30.552235
*/
const $ = new Env('胜券在握');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
$.pinList = []
$.gruopId = ''

//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
let UA = `jdapp;android;10.0.10;11;6353336653534626-5343631343032623;network/wifi;model/M2011K2C;addressid/138381132;aid/653f55db546140b2;oaid/49ce3366eea587ee;osVer/30;appBuild/89313;partner/xiaomi001;eufv/1;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 11; M2011K2C Build/RKQ1.200928.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045709 Mobile Safari/537.36`
$.activityKey = '66f241a0515adf04b2ecb500827b119d'
$.tokenKey = '' // AAEAILuQ-3313nyd1c3XtjZN0SF6VMdTs1N4qm8dkLF892oq0

if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }


      await getHomeInfo()
      // await getToken()
      await getPin()
      await getTaskList()
      for (let i = 0; i < 3; i++) {
        console.log(`正在进行第${i}次抽卡...`)
        await openCard()
      }
    }
  }
  console.log(`\n开始账号内互助\n`);
  for (let i = 0; i < cookiesArr.length; i++) {
    $.canHelp = true;
    cookie = cookiesArr[i];
    $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
    if (i === 0) await openGroup()
    if ($.canHelp) {
      for (let j = 0; j < $.pinList.length; j++) {
        if ($.UserName === $.pinList[j].username) continue
        console.log(`${$.UserName}去助力${$.pinList[j].username}`)
        await help($.pinList[j].pin);
        await $.wait(200)
      }
    }
    console.log('******************************切换账号啦！******************************')
  }

// 任务列表接口 https://api.m.jd.com/api?functionId=necklacecard_taskList&appid=coupon-necklace&client=wh5&t=1627869413498
// 获取token：https://api.m.jd.com/client.action?functionId=genToken&clientVersion=10.0.10&build=89313&client=android&d_brand=Xiaomi&d_model=M2011K2C&osVersion=11&screen=3007*1440&partner=xiaomi001&oaid=49ce3366eea587ee&openudid=653f55db546140b2&eid=eidA1170812238s3Asrsvg77TVqEsxzn3x/x9wLK7jU+inUDGw0vFbpWq+zvUxciv2Z1AWQwR3hLhJA6j7PWD9cTEJL8YlIf76emX/TDQ+P6pcTWpYhQ&sdkVersion=30&lang=zh_CN&uuid=653f55db546140b2&aid=653f55db546140b2&area=22_1930_50948_52157&networkType=wifi&wifiBssid=55e26eaab19d32b4ff7a0c36b661dade&uts=0f31TVRjBSt7%2Fo36NscF%2FfXsKmkxeDUAQCojo4AvfuN9CzDQ0VXZLMu0kjxV6Ntof03UxM0ZmBxvrXCOLNTUCI74SoJz8wyrBMVrkbeltI9wR%2BdN4S7w8%2Fgs%2BD%2B90ksm4u19HrWhhhoigr0KxVwSsw%2BocCv%2BRD%2Bv%2B53%2BnxUKtdNe3HH8n4HIgSVlOXggm9SO5Qm9bENDHZT8QN7gVvMqIg%3D%3D&uemps=0-0&harmonyOs=0&st=1627874275716&sign=56c9b7ba9dc1e6c93936be1c133e5138&sv=102
// 首页 https://api.m.jd.com/api?functionId=necklacecard_cardHomePage&appid=coupon-necklace&client=wh5&t=1627869406999
// 获取邀请pin https://api.m.jd.com/client.action?functionId=getEncryptedPinColor&clientVersion=10.0.10&build=89313&client=android&d_brand=Xiaomi&d_model=M2011K2C&osVersion=11&screen=3007*1440&partner=xiaomi001&oaid=49ce3366eea587ee&openudid=653f55db546140b2&eid=eidA1170812238s3Asrsvg77TVqEsxzn3x/x9wLK7jU+inUDGw0vFbpWq+zvUxciv2Z1AWQwR3hLhJA6j7PWD9cTEJL8YlIf76emX/TDQ+P6pcTWpYhQ&sdkVersion=30&lang=zh_CN&uuid=653f55db546140b2&aid=653f55db546140b2&area=22_1930_50948_52157&networkType=wifi&wifiBssid=unknown&uts=0f31TVRjBSt7%2Fo36NscF%2FfXsKmkxeDUAQCojo4AvfuMGQNt8daeLvK7DOgJETYNAqZ55Bz2CD%2Fkh4nj7bjA91%2FDH4VQh6k8o03NScXDqg9Iyo3uqtYxQJX7m4%2F585Y5yVkIIRD1pxt3OXotEl7pG2vb%2BFvmVEoCsz9dPVwbvV%2FwPk9GJ3i%2FA27OZi8mZRO1aPEsOuT6f9RVPXz%2BkokOwDQ%3D%3D&uemps=0-2&harmonyOs=0&st=1627869556358&sign=4890480a6de880fa950274c66b9c82bf&sv=121
// 邀请助力：https://api.m.jd.com/api?functionId=necklacecard_assistPage&appid=coupon-necklace&client=wh5&t=1627870490417
// 助力：https://api.m.jd.com/api?functionId=necklacecard_assist&appid=coupon-necklace&client=wh5&t=1627870617365



})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

function openGroup() {
  return new Promise((resolve, reject) => {
    let options = {
      url: `https://api.m.jd.com/api?functionId=necklacecard_openGroup&appid=coupon-necklace&client=wh5&t=1627888358283 `,
      body: `body=${JSON.stringify({activityKey: $.activityKey})}`,
      headers: {
        'User-Agent': UA,
        "Cookie": cookie,
        'Host': 'api.m.jd.com',
        'Origin': 'https://h5.m.jd.com'
      }
    }

    $.post(options, (err, resp, data) => {
      try {
        const reust = JSON.parse(data)
        // console.log(reust)
        if (reust.data && reust.data.result) {
          $.gruopId = reust.data.result.groupId
        }
        console.log(`${$.UserName}的gruopId是${$.gruopId}`)

        if (Number(reust.data.biz_code) !== 0) {
          console.log(`${$.UserName} ${reust.data.biz_msg}`)
        }
        resolve()

      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}

function getHomeInfo() {
  return new Promise((resolve, reject) => {
    let options = {
      url: `https://api.m.jd.com/api?functionId=necklacecard_cardHomePage&appid=coupon-necklace&client=wh5&t=1627885690799`,
      body: `body=${JSON.stringify({activityKey: $.activityKey})}`,
      headers: {
        'User-Agent': UA,
        "Cookie": cookie,
        'Host': 'api.m.jd.com',
        'Origin': 'https://h5.m.jd.com'
      }
    }

    $.post(options, (err, resp, data) => {
      try {
        const reust = JSON.parse(data)
        if (Number(reust.data.rtn_code) === 0) {
          $.activityKey = reust.data.result.activityKey
          console.log(`当前共有${reust.data.result.collectedCardsNum}张卡片，`)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}

function getToken() {
  return new Promise((resolve, reject) => {
    let options = {
      url: `https://api.m.jd.com/client.action?functionId=genToken&clientVersion=10.0.10&build=89313&client=android&d_brand=Xiaomi&d_model=M2011K2C&osVersion=11&screen=3007*1440&partner=xiaomi001&oaid=49ce3366eea587ee&openudid=653f55db546140b2&eid=eidA1170812238s3Asrsvg77TVqEsxzn3x/x9wLK7jU+inUDGw0vFbpWq+zvUxciv2Z1AWQwR3hLhJA6j7PWD9cTEJL8YlIf76emX/TDQ+P6pcTWpYhQ&sdkVersion=30&lang=zh_CN&uuid=653f55db546140b2&aid=653f55db546140b2&area=22_1930_50948_52157&networkType=wifi&wifiBssid=55e26eaab19d32b4ff7a0c36b661dade&uts=0f31TVRjBSt7%2Fo36NscF%2FfXsKmkxeDUAQCojo4AvfuN9CzDQ0VXZLMu0kjxV6Ntof03UxM0ZmBxvrXCOLNTUCI74SoJz8wyrBMVrkbeltI9wR%2BdN4S7w8%2Fgs%2BD%2B90ksm4u19HrWhhhoigr0KxVwSsw%2BocCv%2BRD%2Bv%2B53%2BnxUKtdNe3HH8n4HIgSVlOXggm9SO5Qm9bENDHZT8QN7gVvMqIg%3D%3D&uemps=0-0&harmonyOs=0&st=1627876213536&sign=5195b6eca8da61c4ad232c9ad689de05&sv=120 `,
      body: `body=%7B%22action%22%3A%22to%22%2C%22to%22%3A%22https%253A%252F%252Fh5.m.jd.com%252FbabelDiy%252FZeus%252F3Ck6vd8Tz4sJFme5keU9KifFM3aW%252Findex.html%253FbabelChannel%253Dttt7%2526activityKey%253Debac35856fbbb121653a4006cbb681c9%2526tttparams%253DbPQ5UKeB8eyJnTGF0IjoiMzAuNzA4NzQiLCJnTG5nIjoiMTA0LjA5NDc0Mi9J9%2526lng%253D104.067741%2526lat%253D30.552235%2526sid%253Ddb581050324a759d57f413b642da812w%2526un_area%253D22_1930_50948_52157%22%7D&`,
      headers: {
        'User-Agent': UA,
        "Cookie": cookie,
        'Host': 'api.m.jd.com',
        'Origin': 'https://h5.m.jd.com'
      }
    }

    $.post(options, async (err, resp, data) => {
      try {

        const reust = JSON.parse(data)
        reust.tokenKey && ($.tokenKey = reust.tokenKey)

      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}

function getPin() {
  return new Promise((resolve, reject) => {
    let options = {
      url: `https://api.m.jd.com/client.action?functionId=getEncryptedPinColor&clientVersion=10.0.10&build=89313&client=android&d_brand=Xiaomi&d_model=M2011K2C&osVersion=11&screen=3007*1440&partner=xiaomi001&oaid=49ce3366eea587ee&openudid=653f55db546140b2&eid=eidA1170812238s3Asrsvg77TVqEsxzn3x/x9wLK7jU+inUDGw0vFbpWq+zvUxciv2Z1AWQwR3hLhJA6j7PWD9cTEJL8YlIf76emX/TDQ+P6pcTWpYhQ&sdkVersion=30&lang=zh_CN&uuid=653f55db546140b2&aid=653f55db546140b2&area=22_1930_50948_52157&networkType=wifi&wifiBssid=55e26eaab19d32b4ff7a0c36b661dade&uts=0f31TVRjBSt7%2Fo36NscF%2FfXsKmkxeDUAQCojo4AvfuMXwP%2F9OSV8r954joiTnziMn63QK4ZOKf%2FTRNvBHEGoFaeYRDeVEnE87WfSa6Bt5apkMQxAoAUVzTYNvOVqT4L%2FaeRuAr85N1Q0f0axmswZh8K69CfqmL48v8SHHGS%2FKlkPmZo8RtrVYJCPSl29lqR93ZKqkBSlpEmLCBPIAy2rLw%3D%3D&uemps=0-2&harmonyOs=0&st=1627887267698&sign=d89b0a10b39a3813a89030a03bc03aa9&sv=120 `,
      body: `body=%7B%7D&`,
      headers: {
        'User-Agent': UA,
        "Cookie": cookie,
        'Host': 'api.m.jd.com',
        'Origin': 'https://h5.m.jd.com'
      }
    }

    $.post(options, async (err, resp, data) => {
      try {

        const reust = JSON.parse(data)
        // console.log(reust)
        if (reust.bcode && Number(reust.bcode) === 200) {
          console.log(`${$.UserName}的pin是${reust.result}`)
          $.pinList.push({
            username: $.UserName,
            pin: reust.result
          })
        } else {
          console.log(`${$.UserName}获取pin失败`)
        }

      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}

function getTaskList() {
  return new Promise((resolve, reject) => {
    const params = {
      activityKey: $.activityKey
    }
    let options = {
      url: `https://api.m.jd.com/api?functionId=necklacecard_taskList&appid=coupon-necklace&client=wh5&t=${new Date().getTime()}`,
      body: `body=${JSON.stringify(params)}`,
      headers: {
        'User-Agent': UA,
        "Cookie": cookie,
        'Host': 'api.m.jd.com',
        'Origin': 'https://h5.m.jd.com'
      }
    }

    $.post(options, async(err, resp, data) => {
      try {
        const reust = JSON.parse(data)
        if (Number(reust.rtn_code) === 0) {
          const tasks = reust.data.result.componentTaskInfo
          // console.log(tasks)
          for(let i = 0; i < tasks.length; i++) {
            if (tasks[i].taskStatus === 3) {
              console.log(`当前任务 ${tasks[i].name || tasks[i].taskTitle} 已完成`)
              continue
            }
            if (tasks[i].encryptTaskId) {
              // console.log(tasks[i].encryptTaskId, tasks[i].itemId)
              const res = await taskReport(tasks[i].encryptTaskId, tasks[i].itemId)
              console.log(`${tasks[i].name || tasks[i].taskTitle}: ${res}`)
            } else continue

          }
        } else {
          console.log(`💥${reust.rtn_msg}`)
        }


      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}

function taskReport(taskId, itemId) {
  // console.log(`activityKey: ${$.activityKey},taskId: ${taskId}, itemId: ${itemId}`)
  // console.log(`body={"activityKey":"${$.activityKey}","encryptTaskId": "${taskId}","itemId": "${itemId}}"`)
  const bodyParams = {
    activityKey: $.activityKey,
    encryptTaskId: taskId,
    itemId: itemId
  }
  // console.log(JSON.stringify(bodyParams))
  return new Promise((resolve, reject) => {
    let options = {
      url: `https://api.m.jd.com/api?functionId=necklacecard_taskReport&appid=coupon-necklace&client=wh5&t=1627883026692`,
      body: `body=${JSON.stringify(bodyParams)}`,
      headers: {
        'User-Agent': UA,
        "Cookie": cookie,
        'Host': 'api.m.jd.com',
        'Origin': 'https://h5.m.jd.com'
      }
    }

    $.post(options, async(err, resp, data) => {
      try {
        const reust = JSON.parse(data)
        // console.log(reust)
        if (reust.data && (reust.data.biz_code === 0 || reust.data.biz_code === 4)) {
          resolve(reust.data.biz_msg)
        }

      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}

function openCard() {
  return new Promise((resolve, reject) => {
    let options = {
      url: `https://api.m.jd.com/api?functionId=necklacecard_openCard&appid=coupon-necklace&client=wh5&t=1627884802101`,
      body: `body=${JSON.stringify({activityKey: $.activityKey})}`,
      headers: {
        'User-Agent': UA,
        "Cookie": cookie,
        'Host': 'api.m.jd.com',
        'Origin': 'https://h5.m.jd.com'
      }
    }

    $.post(options, (err, resp, data) => {
      try {
        const reust = JSON.parse(data)
        // console.log(reust)
        if (reust.data.biz_code === 0) {
          console.log(`恭喜你，获得 ${reust.data.result.cardName} 卡片一张`)
        } else {
          console.log(reust.data.biz_msg)
        }
        resolve()


      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}

function help() {
  return new Promise((resolve, reject) => {
    const bodyParams = {
      activityKey: $.activityKey,
      groupId: $.gruopId,
      eu: 6353336653534626,
      fv: 5343631343032623
    }
    let options = {
      url: `https://api.m.jd.com/api?functionId=necklacecard_assist&appid=coupon-necklace&client=wh5&t=1627886507385`,
      body: `body=${JSON.stringify(bodyParams)}`,
      headers: {
        'User-Agent': UA,
        "Cookie": cookie,
        'Host': 'api.m.jd.com',
        'Origin': 'https://h5.m.jd.com'
      }
    }

    $.post(options, (err, resp, data) => {
      try {
        const reust = JSON.parse(data)
        console.log(reust)
        if (reust.data.biz_code === 0) {
          resolve()
        } else {
          console.log(reust.data.biz_msg)
        }


      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}

async function TotalBean() {
    return new Promise(async resolve => {
      const options = {
        "url": `https://me-api.jd.com/user_new/info/GetJDUserInfoUnion`,
        "headers": {
          'Host': "me-api.jd.com",
          "Accept": "application/json,text/plain, */*",
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "zh-cn",
          "Connection": "keep-alive",
          "Cookie": cookie,
          "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
          "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
        }
      }
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (data) {
              data = JSON.parse(data);
              if (data["retcode"] === 13) {
                $.isLogin = false; //cookie过期
                return;
              }
              if (data["retcode"] === 0) {
                $.nickName = (data["base"] && data["base"].nickname) || $.UserName;
              } else {
                $.nickName = $.UserName;
              }
            } else {
              console.log(`京东服务器返回空数据`)
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve();
        }
      })
    })
  }

  // prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
