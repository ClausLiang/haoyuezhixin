const app = getApp()
import util from '../../utils/util.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        telPhone: '17610018891'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    // 获取手机号的回调
    getPhoneNumber(e) {
        console.log(e)
        util.getOpenId().then(openId => {
            let params = {
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                openid: openId,
                loginSysName: "APPLETS_HAOFANG"
            }

            if (e.detail && e.detail.encryptedData) {
                wx.$post("/user/api/wxDecryptData", params).then(res => {
                    this.setData({
                        telPhone: res.phoneNumber
                    })
                })
            }
        })
    },
    // 获取用户基本信息的回调
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    toMineInfoPage() {
        wx.navigateTo({
            url: '/pages/mine-info/mine-info',
        })
    }
})