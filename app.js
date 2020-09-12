import {
    WX_BASE_URL_API,
    WX_BASE_URL_WEBAPP,
    WX_BASE_URL_TEXT,
    WX_LOCATION_KEY
} from "./config/index"
import {
    get,
    post
} from "./utils/request"
App({
    onLaunch: function () {
        // 区分环境
        const accountInfo = wx.getAccountInfoSync()
        const envVersion = accountInfo.miniProgram.envVersion
        let ENV = 'test'
        wx.$ENV = ENV
        wx.$ENV_VERSION = envVersion
        wx.$BASE_URL_TEXT = WX_BASE_URL_TEXT[ENV]
        wx.$BASE_URL_API = WX_BASE_URL_API[ENV]
        wx.$BASE_URL_WEBAPP = WX_BASE_URL_WEBAPP[ENV]
        wx.$LOCATION_KEY = WX_LOCATION_KEY[ENV]
        // 注入request方法
        wx.$get = get
        wx.$post = post

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
    globalData: {
        userInfo: null
    }
})