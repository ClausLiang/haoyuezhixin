// components/navBar/navBar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

        back: {
            type: Boolean,
            value: true
        },

        home: {
            type: Boolean,
            value: true
        },
        title: {
            type: String,
            value: ''
        },
        // 黑色还是白色
        iconTheme: {
            type: String,
            value: 'black'
        },
        // 返回几层
        delta: {
            type: Number,
            value: 1
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        showBack: true,
    },
    /**
     * 组件的生命周期
     */
    lifetimes: {
        created: function () {
            this.getSystemInfo()
        },
        attached: function () {
            this.setStyle()
        }
    },
    pageLifetimes: {
        show: function () {
            const pages = getCurrentPages();
            //页面栈没有可返回页面，隐藏back
            this.setData({
                showBack: pages.length > 1 && this.data.back
            })
        },
        hide: function () {}
    },
    /**
     * 组件的方法列表
     */
    methods: {
        back: function () {
            wx.navigateBack({
                delta: 1
            })
            this.triggerEvent('back', {
                delta: this.data.delta
            });
        },
        home: function () {
            wx.reLaunch({
                url: '/pages/index/index'
            })
            this.triggerEvent('home', {});
        },
        setStyle: function () {
            const {
                statusBarHeight,
                navBarHeight,
                capsulePosition,
                navBarExtendHeight,
                ios,
                windowWidth
            } = getApp().globalSystemInfo;
            const {
                showBack,
                home,
                title
            } = this.data;
            //胶囊按钮右侧到屏幕右侧的边距
            let rightDistance = windowWidth - capsulePosition.right;
            //胶囊按钮左侧到屏幕右侧的边距
            let leftWidth = windowWidth - capsulePosition.left;
            let navigationbarinnerStyle = [
                `color: ${this.data.color}`,
                `background: ${this.data.background}`,
                `height:${navBarHeight + navBarExtendHeight}px`,
                `padding-top:${statusBarHeight}px`,
                `padding-right:${leftWidth}px`,
                `padding-bottom:${navBarExtendHeight}px`
            ].join(';');
            let navBarLeft = [];
            // 只有返回或home
            if ((showBack && !home) || (!showBack && home)) {
                navBarLeft = [
                    `width:${capsulePosition.width}px`,
                    `height:${capsulePosition.height}px`
                ].join(';');
            }
            // 返回home都有，或者有标题
            else if ((showBack && home) || title) {
                navBarLeft = [
                    `width:${capsulePosition.width}px`,
                    `height:${capsulePosition.height}px`,
                    `margin-left:${rightDistance}px`
                ].join(';');
            } else {
                navBarLeft = [`width:auto`, `margin-left:0px`].join(';');
            }
            this.setData({
                navigationbarinnerStyle,
                navBarLeft,
                navBarHeight,
                capsulePosition,
                navBarExtendHeight,
                ios
            })

        },
        getSystemInfo() {
            const app = getApp()
            if (app.globalSystemInfo && !app.globalSystemInfo.ios) {
                return app.globalSystemInfo;
            } else {
                let systemInfo = wx.getSystemInfoSync()

                // 双重取反将变量转为布尔类型
                let ios = !!(systemInfo.system.toLowerCase().search('ios') + 1);
                let rect
                try {
                    // 胶囊的布局位置信息
                    rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
                    if (rect === null) {
                        throw 'getMenuButtonBoundingClientRect error';
                    }
                    //取值为0的情况  有可能width不为0 top为0的情况
                    if (!rect.width || !rect.top || !rect.left || !rect.height) {
                        throw 'getMenuButtonBoundingClientRect error';
                    }
                } catch (error) {
                    let gap = ''; //胶囊按钮上下间距 使导航内容居中
                    let width = 96; //胶囊的宽度
                    if (systemInfo.platform === 'android') {
                        gap = 8;
                        width = 96;
                    } else if (systemInfo.platform === 'devtools') {
                        if (ios) {
                            gap = 5.5; //开发工具中ios手机
                        } else {
                            gap = 7.5; //开发工具中android和其他手机
                        }
                    } else {
                        gap = 4;
                        width = 88;
                    }
                    if (!systemInfo.statusBarHeight) {
                        //开启wifi的情况下修复statusBarHeight值获取不到
                        systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;
                    }
                    rect = {
                        //获取不到胶囊信息就自定义重置一个
                        bottom: systemInfo.statusBarHeight + gap + 32,
                        height: 32,
                        left: systemInfo.windowWidth - width - 10,
                        right: systemInfo.windowWidth - 10,
                        top: systemInfo.statusBarHeight + gap,
                        width: width
                    };
                    console.log('error', error);
                    console.log('rect', rect);
                }

                let navBarHeight = '';
                if (!systemInfo.statusBarHeight) {
                    systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;
                    navBarHeight = (function () {
                        let gap = rect.top - systemInfo.statusBarHeight;
                        return 2 * gap + rect.height;
                    })();

                    systemInfo.statusBarHeight = 0;
                    systemInfo.navBarExtendHeight = 0; //下方扩展4像素高度 防止下方边距太小
                } else {
                    navBarHeight = (function () {
                        let gap = rect.top - systemInfo.statusBarHeight;
                        return systemInfo.statusBarHeight + 2 * gap + rect.height;
                    })();
                    if (ios) {
                        systemInfo.navBarExtendHeight = 4; //下方扩展4像素高度 防止下方边距太小
                    } else {
                        systemInfo.navBarExtendHeight = 0;
                    }
                }
                systemInfo.navBarHeight = navBarHeight; //导航栏高度不包括statusBarHeight
                systemInfo.capsulePosition = rect; //右上角胶囊按钮信息bottom: 58 height: 32 left: 317 right: 404 top: 26 width: 87 目前发现在大多机型都是固定值 为防止不一样所以会使用动态值来计算nav元素大小
                systemInfo.ios = ios; //是否ios

                app.globalSystemInfo = systemInfo; //将信息保存到全局变量中,后边再用就不用重新异步获取了

                return systemInfo;
            }

        }
    }
})