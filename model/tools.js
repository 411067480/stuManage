/**
 * Created by Administrator on 2018/3/21 0021.
 */
var md5 = require('md5');

const multer = require('koa-multer');
let tools={
    multer(){  
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/upload/associationcate_Image')
            },
            filename: function (req, file, cb) {
                var fileFormat = (file.originalname).split(".");  
                cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
            }
        })
        var upload = multer({ storage: storage });
        return upload
    },
    multer_title(){  /*???????????*/
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/upload/title_Image')
            },
            filename: function (req, file, cb) {
                var fileFormat = (file.originalname).split(".");   
                cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
            }
        })
        var upload = multer({ storage: storage });
        return upload
    },
    multer_video(){  /*???????????*/
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/upload/shiping')
            },
            filename: function (req, file, cb) {
                var fileFormat = (file.originalname).split(".");   /*????????  ???????*/
                cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
            }
        })
        var upload = multer({ storage: storage });
        return upload
    },
    multer_united_announce(){  /*???????????*/
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/upload/united_announce_Image')
            },
            filename: function (req, file, cb) {
                var fileFormat = (file.originalname).split(".");   /*????????  ???????*/
                cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
            }
        })
        var upload = multer({ storage: storage });
        return upload
    },
    multer_focus(){  /*???????????*/
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/upload/focus_Image')
            },
            filename: function (req, file, cb) {
                var fileFormat = (file.originalname).split(".");   /*????????  ???????*/
                cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
            }
        })
        var upload = multer({ storage: storage });
        return upload
    },
    multer_link(){  /*???????????*/
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/upload/link_Image')
            },
            filename: function (req, file, cb) {
                var fileFormat = (file.originalname).split(".");   /*????????  ???????*/
                cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
            }
        })
        var upload = multer({ storage: storage });
        return upload
    },
    multer_news(){  /*???????????*/
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/upload/news_Image')
            },
            filename: function (req, file, cb) {
                var fileFormat = (file.originalname).split(".");   /*????????  ???????*/
                cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
            }
        })
        var upload = multer({ storage: storage });
        return upload
    },
    multer_manage(){  /*???????????*/
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/upload/manage_Image')
            },
            filename: function (req, file, cb) {
                var fileFormat = (file.originalname).split(".");   /*????????  ???????*/
                cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
            }
        })
        var upload = multer({ storage: storage });
        return upload
    },
    getTime(){

        return new Date()
    },
    md5(str){
        return md5(str)
    },
    cateToList(data){


        //1????????????

        var firstArr=[];

        for(var i=0;i<data.length;i++){
            if(data[i].pid=='0'){
                firstArr.push(data[i]);
            }
        }
        //2?????????????
        //console.log(firstArr);

        for(var i=0;i<firstArr.length;i++){

            firstArr[i].list=[];
            //???????��?????  ??????????pid????????????_id
            for(var j=0;j<data.length;j++){
                if(firstArr[i]._id==data[j].pid){
                    firstArr[i].list.push(data[j]);
                }
            }

        }

        //console.log(firstArr);

        return firstArr;
    }
}

module.exports=tools;