var http = require('http');
var cheerio = require('cheerio');
var url = 'http://www.imooc.com/learn/348';
var baseUrl = 'http://www.imooc.com/learn/';
var videoIds = [348,259,197,134,75];

function filterChapters(html) {
    var $ = cheerio.load(html);
    var title = $('.i-mid').text();
	console.log(title);
    var number = parseInt($($('.i-mid')[0]).text.trim(), 10);
	console.log(number);
    // var chapters = $('.chapter');
    //   courseData =  { 
    //       title:title,
    //       number:number,
    //       videos:[{
    //         chapterTitle: '',
    //         videos: [
    //             title,'',
    //             id,''
    //         ]
    //     }]} 

    var courseData = {
        title: title,
        videos: [],
        number: number,
    }
    chapters.each(function (item) {
        var chapter = $(this);
        var chapterTitle = chapter.find('strong').text();
        var videos = chapter.find('.video').children('li');
        var chapterData = {
            chapterTitle: chapterTitle,
            videos: []
        }
        videos.each(function (item) {
            var video = $(this).find('.studyvideo');
            var videoTitle = video.text();
            var id = video.attr('href').split('video/')[1];

            chapterData.videos.push({
                title: videoTitle,
                id: id
            })
        })
        courseData.push(chapterData);
    })

    return courseData;
};

function printCourseInfo(coursesData) {
    coursesData.forEach(function (courseData) {
        console.log(courseData.number + '人学过' + courseData.title + '\n');
    })
    courseData.forEach(function (courseData) {
        console.log("###" + courseData.title + '');
        courseData.forEach(function (item) {
            var chapterTitle = item.chapterTitle;

            console.log(chapterTitle + '\n');

            item.videos.forEach(function (video) {
                console.log('[' + video.id + ']' + video.title + '\n');
            })

        })
    })
}

function getPageAsync(url) {
    return new Promise(function (resolve, reject) {
        console.log('正在爬取' + url);


        http.get(url, function (res) {
            var html = '';

            res.on('data', function (data) {
                html += data;
            })

            res.on('end', function () {
                resolve(html)
                //var courseData = filterChapters(html);

                //printCourseInfo(courseData);
            })
        }).on('error', function () {
            reject(e)
            console.log("异常");
        });
    })
}

var fetchCourseArray = [];

videoIds.forEach(function (id) {
    fetchCourseArray.push(getPageAsync(baseUrl + id));
})

Promise
    .all([fetchCourseArray])
    .then(function (pages) {
        var courseData = [];

        page.forEach(function (html) {
            var course = filterChapters(html)

            coursesData.push(course);
        })

        courseData.sort(function (a, b) {
            return a.number < b.number;
        })

        printCourseInfo(courseData);
    })

