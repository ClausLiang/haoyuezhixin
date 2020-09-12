const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}
// 获取openid
function getOpenId() {
    return new Promise((resolve, reject) => {
        wx.login({
            success: res => {
                let params = {
                    loginSysName: "APPLETS_HAOFANG",
                    loginType: 7,
                    loginName: res.code,
                };
                wx.$post("/user/api/wxAuth", params).then((res) => {
                    if (!res) {
                        wx.showToast({
                            icon: 'none',
                            title: '获取不到openid',
                        })
                    }
                    resolve(res.openid)
                }).then(res => {
                    reject('')
                })
            },
            fail: err => {
                reject('')
            }
        })
    })

}

module.exports = {
    formatTime: formatTime,
    getOpenId: getOpenId
}