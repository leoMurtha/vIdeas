if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://leoMurtha:041097ll@ds147890.mlab.com:47890/videas'}
}else{
    module.exports = {mongoURI: 'mongodb://127.0.0.1:27017/videas-dev'}
}