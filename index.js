const cheerio = require("cheerio");
const request = require("request");
const URL = "http://59.69.102.9/zgyw/index.aspx";
const URL_ARTICLE = "http://59.69.102.9/zgyw/study/LearningContent.aspx?type=1&id=1&learningid=3073";
let cookie = "";

/*
 *登入网站并获取cookie
 */
function login(stuNo, psw) {
    request(URL, (error, response, data) => {
        const $ = cheerio.load(data.toString());
        cookie = response.rawHeaders.toString().substr(144, 42);
        const VIEWSTATE = $("#__VIEWSTATE").attr("value");
        request.post({
            url: URL,
            headers: {
                "Cookie": cookie.toString()
            },
            form: {
                "__VIEWSTATE": VIEWSTATE,
                "ctl00$ContentPlaceHolder1$name": args[0],
                "ctl00$ContentPlaceHolder1$pwd": args[1],
                "ctl00$ContentPlaceHolder1$login": "登入"
            }
        });
    });
}

/*
 *刷分系统
 */
async function f() {
    setTimeout(f, 60000);
    await request({
        url: URL_ARTICLE,
        headers: {
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Cookie': cookie
        }
    }, () => {
    });
    await request({
            url: URL,
            headers: {
                'Accept-Language': 'zh-CN,zh;q=0.9',
                'Cookie': cookie
            }
        },
        (error, response, body) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(body.toString());
                if ($("#ctl00_ContentPlaceHolder1_lblonlineTime font").html() != null) {
                    const time_temp = parseInt($("#ctl00_ContentPlaceHolder1_lblonlineTime font").html().substring(0, 4));
                    console.log(new Date() + " " + args[0] + " " + time_temp);
                } else {
                    login();
                }
            }
        });
}


//判断输入学号和密码 
const args = process.argv.splice(2);
if (args.length != 2) console.log("请输入用户名和密码！");
//执行程序
f();