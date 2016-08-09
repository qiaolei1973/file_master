var fs = require("fs");
var path = "C:/Users/Jhone/Documents/SmartMeter_Amr_Web-Java/src/main/java/com/joymeter/controller"
function explorer(path) {
    return new Promise(function (res, rej) {
        fs.readdir(path, function (err, files) {
            let arr = [];
            if (err) {
                console.log("error:\n" + err);
                return;
            }
            files.forEach(function (file) {
                let s = file
                re = /[a-zA-Z]+/
                if (re.test(s)) {
                    str = re.exec(s)[0];
                    arr.push(str);
                }
            })
            res(arr);
        })
    })
}

// explorer(path).then(function(data){
//     data.forEach(function(fName){
//         fs.writeFileSync(fName+".js",)
//     })
// })
function splitSqlDoc() {
    var sqlPath = "C:/Users/Jhone/Documents/SmartMeter_Vms_Amr_Client-Sencha/Doc"
    var sqlDoc = fs.readFileSync(sqlPath + "/crebas.txt", "UTF-8");
    // var sqlDoc1 = sqlDoc.replace(new RegExp(/\W+/g),"  ")
    //var newDoc = fs.writeFileSync("doc.txt",sqlDoc);
    var _respl = /\/\*(=)+\*\//;
    let _re1 = /create table+[\s\w\d(),'\-\$\:\。\.\，\/\%]+/
    var arr1 = sqlDoc.split(_respl);
    var arr2 = [];
    for (let i = 0; i < arr1.length; i++) {
        if (_re1.test(arr1[i])) {
            arr2.push(_re1.exec(arr1[i])[0])
        }
    }
    return arr2;
}

function getKey() {
    var arr2 = splitSqlDoc();
    let arr3 = [];
    for (let i = 0; i < arr2.length; i++) {
        arr3[i] = [];
        let table_str = (/table T_ZhongAn_(\w)+/).exec(arr2[i])[0]
        let title_ = table_str.split(" ")[1].split("_");
        let title = "";
        arr2[i].replace((/primary key+\s+\(+F_+[A-Za-z]+_+[A-Za-z]+\)/), "");
        for (let j = 0; j < title_.length; j++) {
            title += title_[j]
        }
        arr3[i].push(title);
        //匹配名称
        let value = arr2[i].match((/F_+[A-Za-z_0-9]+/g));
        let len = value.length
        for (let m = 0; m < len; m++) {
            let value_ = value[m].split("_");
            let valueStr = "";
            for (let k = 0; k < value_.length; k++) {
                valueStr += value_[k];
            }
            value[m] = valueStr;
        }
        arr3[i] = arr3[i].concat(value);
    }
    return arr3;
}

var Fill = function (title, data) {
    var strTemp =
        "Ext.define('Vms.model." + title + "', {\n" +
        "extend: 'Vms.base.BaseModel', \n" +
        "alias: 'model." + title + "',\n" +
        " fields: [\n" + data +
        " ]\n" +
        "}); "
    return strTemp;
}

!function _mkdir() {
    var data = getKey();
    for (var i = 0; i < data.length; i++) {
        let len = data[i].length -1
        let str = "";
        let title = data[i][0];
        for (let j = 1; j < len; j++) {
            str += "  { name:'" + data[i][j] + "', type: 'string' },\n"
        }
        var strTemp = Fill(title, str);
        fs.writeFileSync("model/" + data[i][0] + ".js", strTemp)
    }
} ()

// !function _mkfilr(){
//     fs.writeFileSync("model/hello"+".js","nothing")
// }()