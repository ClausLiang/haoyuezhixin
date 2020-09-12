let loadingCount = 0

function requestHandle({
    type,
    url,
    params,
    isFormData,
    resolve,
    reject
}) {
    let loadingBox = setTimeout(() => {
        wx.showLoading({
            title: '加载中',
        })
    }, 500);
    loadingCount++;

    let token = wx.getStorageSync('userData').token || '';
    wx.request({
        url: wx.$BASE_URL_API + url,
        header: {
            'content-type': isFormData ? 'application/x-www-form-urlencoded' : 'application/json',
            'token': token
        },
        method: type,
        data: params || {},
        success(res) {
            // 每次返回结果都清掉定时器，如果500ms内的话就不会出现loading
            clearTimeout(loadingBox)
            loadingCount--;

            // 如果全部请求都返回就清掉loading
            if (loadingCount === 0) {
                wx.hideLoading()
            }

            const {
                data,
                code,
                msg
            } = res.data

            if (code === 200) {
                resolve(data)
            } else {
                wx.showToast({
                    title: msg,
                    icon: 'none'
                })
                reject(res)
            }
        },
        fail(err) {
            wx.showToast({
                icon: 'none',
                title: '网络错误，请检查网络链接！',
            })
            reject(err)
        }

    })
}

export function post(url, params, isFormData) {
    return new Promise((resolve, reject) => {
        requestHandle({
            type: "POST",
            url,
            params,
            isFormData,
            resolve,
            reject
        });
    })
}
export function get(url, params, isFormData) {
    return new Promise((resolve, reject) => {
        requestHandle({
            type: "GET",
            url,
            params,
            isFormData,
            resolve,
            reject
        });
    })
}