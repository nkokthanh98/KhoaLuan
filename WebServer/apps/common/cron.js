const cron = require('cron');
const moment = require('moment')
const currentDate = moment().format('YYYY-MM-DD');
const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
const currentTime = moment().format('HH:mm:ss')
const { calculateAverage, saveAverage } = require('../models/average')

function financial(x) {
  return Number.parseFloat(x).toFixed(2);
}

module.exports = function(io) {
  io.on('connection', function(socket) {
      // tạo 1 cronjob
    const job = new cron.CronJob({
      cronTime: '* * * * *', // 1 phút
      async onTick() {
        const param = [1, 2, 3]
        let items = []

        await Promise.all(
            // lặp mảng did [1, 2, 3]
            param.map(async item => {
                // query DB tính trung bình theo did (ngày hiện tại)
                let data = await calculateAverage(item, currentDate);
            
                // đẩy dũ liệu vào 1 mảng (format lấy 2 chữ số sau .)
                items.push({
                    data: financial(data[0].average)
                })

                // lưu DB giá trị trung bình vừa tính được theo did.
                saveAverage(item, financial(data[0].average), currentDateTime)
            })
        )

        // gửi data ra client
        socket.emit('average', items)        
        
      },
      start: true,
      timeZone: 'Asia/Ho_Chi_Minh',
    });
    
    job.start();
  });
};


