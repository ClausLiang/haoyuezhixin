//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
    },

    onLoad: function () {
        
    },
    toWebView: function () {
        wx.navigateTo({
            url: '/pages/web-view/web-view',
        })
    }
})