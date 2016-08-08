var fs = require("fs");
var path = "D:/资料/SmartMeter_Sts_Server-Java-master/SmartMeter_STS_Server-ejb/src/main/java/com/joymeter/orm"
const dir = []; 
function explorer(path) {
    fs.readdir(path, function (err, files) {
        if (err) {
            console.log("error:\n" + err);
            return;
        }

        files.forEach(function (file) {
            fs.stat(path + "/" + file , function (err, stat) {
                if (err) {
                    console.log(err);
                    return;
                }
                if (stat.isDirectory()) {
                    console.log(path + "/" + file + "/");
                    explorer(path + "/" + file);
                } else {
                    console.log(file);
                }
            })
        })
    })
}

explorer(path);