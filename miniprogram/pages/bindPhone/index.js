// miniprogram/pages/bindPhone/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:'/images/user-unlogin.png',
    userInfo:app.globalData.userInfo,
    codeBtnText:'获取验证码',
    getCodeFlag:false,
    phoneNum:null,
    data_id:null,
    codeInput:null,
    lon:null,
    lat:null,
    nation: null,
    province: null,
    city: null,
    district: null,
    street: null,
    street_number: null,
    saveCode:null,
    town:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.identity){
      this.setData({
        identity: options.identity
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showModal({
      title: '温馨提示',
      content: '由于暂未开通线上支付功能，请使用同支付宝手机号登录，用于收付款！',
      showCancel:false,
      confirmText:'知道了'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      avatarUrl: app.globalData.avatarUrl,
      userInfo: app.globalData.userInfo
    })
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: (res) => {       
        this.setData({
          lon : res.longitude,
          lat : res.latitude
        })
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + res.latitude + ',' + res.longitude +'&key=M7JBZ-3TSKJ-U3FFV-KVSPJ-LKHE6-QTFJ2',
          success:(res)=>{
            console.log(res)
            if(res.statusCode === 200){
              this.setData({
                nation:res.data.result.address_component.nation,
                province: res.data.result.address_component.province,
                city: res.data.result.address_component.nation,
                district: res.data.result.address_component.district,
                street: res.data.result.address_component.street,
                street_number: res.data.result.address_component.street_number,
                town: res.data.result.address_reference.town.title,
              })
            }
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  phoneInputFn(e){
    const regPhone = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/
    if (!regPhone.test(e.detail.value)) {
      wx.showToast({
        title: '手机号码格式输入有误！',
        icon: 'none',
        duration: 1500
      })
    } else {
      this.setData({
        phoneNum: e.detail.value
      })
    }
  },
  getCode(){
    this.setData({
      getCodeFlag:true
    })
    
    let s = 60
    let timer = setInterval(()=>{
      s--
      this.setData({
        codeBtnText:  s +'s'
      })
      if(s<=0){
        clearInterval(timer)
        this.setData({
          getCodeFlag:false,
          codeBtnText:'获取验证码'
        })
      }
    },1000)
    let code = '';
    //设置长度，这里看需求，我这里设置了4
    let codeLength = 6;
    //设置随机字符
    let random = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
    //循环codeLength 我设置的6就是循环6次
    for (let i = 0; i < codeLength; i++) {
      //设置随机数范围,这设置为0 ~ 10
      let index = Math.floor(Math.random() * 10);
      //字符串拼接 将每次随机的字符 进行拼接
      code += random[index];
    }
    this.setData({
      saveCode:code
    })
    console.log(code)
    let options = {
      "showapi_timestamp": this.formatterDateTime(),
      "showapi_appid": '82070', //这里需要改成自己的appid
      "showapi_sign": '3dc16dd4b04647f894c226cd48823550',  //这里需要改成自己的应用的密钥secret
      "content": '{"userName":"' + this.data.userInfo.nickName + '","code":"' + code +'","comName":"奔跑侠"}',
      "mobile":this.data.phoneNum,
      "tNum": "T150606060602",
    }
    wx.showModal({
      title: '验证码',
      content: '【安全登录】尊敬的'+this.data.userInfo.nickName+'，您好！您本次的验证码是'+code+'，请妥善保管（奔跑侠）。(开发版本节省短信验证码接口次数使用弹框形式)',
      showCancel:false,
      confirmText:'填入',
      success:(res)=>{
        if(res.confirm){
          this.setData({
            codeInput:code
          })
        }
      }
    })
    // wx.request({
    //   url: 'https://route.showapi.com/28-1',
    //   data:options,
    //   success:(res)=>{
    //     console.log(res)
    //     wx.showToast({
    //       title: '验证码已发送',
    //       icon: 'success',
    //       duration: 2000
    //     })
    //     this.saveUserInfo(code)
    //   },
    //   fail:(res)=>{
    //     cosnole.log(res)
    //   }
    // })
  },
  formatterDateTime() {
    var date = new Date()
    var month = date.getMonth() + 1
        var datetime = date.getFullYear()
      + ""// "年"
      + (month >= 10 ? month : "0" + month)
      + ""// "月"
      + (date.getDate() < 10 ? "0" + date.getDate() : date
        .getDate())
      + ""
      + (date.getHours() < 10 ? "0" + date.getHours() : date
        .getHours())
      + ""
      + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
        .getMinutes())
      + ""
      + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
        .getSeconds());
    return datetime;
  },
  saveUserInfo(code){
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('userInfo').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        console.log(res)
        // 用户第一次登录
        if(res.data.length===0){
          // 添加用户信息
          db.collection('userInfo').add({
            data: {
              code: code,
              phoneNum: this.data.phoneNum,
              latitude:this.data.lat,
              longitude:this.data.lon,
              isLogin:true,
              loginTime: this.formatterDateTime(),
              identity:this.data.identity,
              nation: this.data.nation,
              province: this.data.province,
              city: this.data.city,
              district: this.data.district,
              street: this.data.street,
              street_number: this.data.street_number,
              town: this.data.town
            },
            success: res => {
              wx.hideLoading()
              wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 2000,
                complete: (res) => {
                  if(this.data.identity === 'boss'){
                    wx.navigateTo({
                      url: '/pages/bossPages/map/index',
                    })
                  } else if(this.data.identity === 'run') {
                    wx.switchTab({
                      url: "/pages/runPages/list/index",
                    })
                  }
                }
              })
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '用户信息入库失败，请重试！'
              })
              console.error('[数据库] [新增记录] 失败：', err)
            }
          })
        } else {
          // 用户信息已经存在   更新 库中的 代码
          this.setData({
            data_id:res.data[0]._id
          })
          db.collection('userInfo').doc(this.data.data_id).update({
            data: {
              code: code,
              latitude: this.data.lat,
              longitude: this.data.lon,
              isLogin:true,
              loginTime: this.formatterDateTime(),
              nation: this.data.nation,
              province: this.data.province,
              city: this.data.city,
              district: this.data.district,
              street: this.data.street,
              street_number: this.data.street_number,
              town:this.data.town
            },
            success: res => {
              wx.hideLoading()
              wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 2000,
                complete: (res) => {
                  console.log(123,res)
                  console.log(this.data.identity)
                  if (this.data.identity === 'boss') {
                    wx.navigateTo({
                      url: '/pages/bossPages/map/index',
                    })
                  } else if (this.data.identity === 'run') {
                    wx.navigateTo({
                      url: "/pages/runPages/list/index",
                    })
                  }
                }
              })
            },
          })
        }
      }
    })
  },
  submit(){
    wx.showLoading({
      title: '正在登录…',
    })
    this.checkSaveInfo()
  },
  checkSaveInfo(){
    if (!this.data.phoneNum) {
      wx.showToast({
        title: '请填写手机号！'
      })
      return 
    }
    if(this.data.saveCode !== this.data.codeInput){
      wx.showToast({
        title: '验证码填写有误！',
      })
      return 
    }
    if(this.data.lat&&this.data.lon&&this.data.town){

    } else {
      wx.showToast({
        title: '定位失败！',
      })
      return false
    }
   
    this.saveUserInfo(this.data.codeInput)
  }

})