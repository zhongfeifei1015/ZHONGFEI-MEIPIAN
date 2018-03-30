function myPageInfo() {
  var loadMore = false;
  var addMoreAjAX = false;
  //是否在需要滑动的开关，
var isNeedScroll = true;
  var pramAjaxDy = {};
  pramAjaxDy.imId = selfImId,
  pramAjaxDy.backwords = true;
  pramAjaxDy.lastBlogMsgid = 0;
  pramAjaxDy.lastUpdateTime = "0";
  pramAjaxDy.blogNum = 10;
  $('#myPageContent').html('');
  //开启加载指示器
  $.showIndicator();
  downRefrshAjax();
  initLoadMoreAll();
  //获取个人信息
  var pramAjaxInfo = {};
  pramAjaxInfo.targetImId = selfImId,
  pramAjaxInfo.imId = selfImId,
  $.ajax({
    url: postUrl + "/getUserInfo",
    type: 'post',
    dataType: 'json',
    data: JSON.stringify(pramAjaxInfo),
    contentType: "application/json;charset=utf-8",
    success: function (res) {
      if (res.code == 200) {
        $('#userName').html(res.data.user.userName);
        $('.attention .attentionNum').html(res.data.attentionList);
        $('.fass .fassNum').html(res.data.fansSize);
      }
    }
  });

  function downRefrshAjax(){
      //获取个人相关动态
  var pramAjaxDy = {};
  pramAjaxDy.imId = selfImId,
  pramAjaxDy.backwords = true;
  pramAjaxDy.lastBlogMsgid = 0;
  pramAjaxDy.lastUpdateTime = "0";
  pramAjaxDy.blogNum = 10;
    $.ajax({
      url: postUrl + "/getBlog",
      type: 'post',
      dataType: 'json',
      data: JSON.stringify(pramAjaxDy),
      contentType: "application/json;charset=utf-8",
      success: function (res) {
        if (res.code == 200) {
          console.log(res)
          dataHandDataBottom(res.data);
          getMyPageLastData(res.data);
        }
      }
    });
  }

  function initLoadMoreAll() {
    var loading = false;
    $(document).on('infinite','#myPageContentAll',function () {
      console.log('66666')
      if (!isNeedScroll)
        return;
      // 如果正在加载，则退出
      if (loading) return;
      // 设置flag
      loading = true;
      $('#noMore').hide();
      $('#loadMoreloding').show();
      loadMoreAjaxMyPage(stopLoad);
      function stopLoad() {
        // 重置加载flag
        loading = false;
        if (isOverLoad) {
          isOverLoad = false;
          return;
        }
        //容器发生改变,如果是js滚动，需要刷新滚动
        $.refreshScroller();
      };
    });
  };

   //重新拼接好参数
   function getMyPageLastData(datas) {
    if (datas.length == 0) {
      return;
    }
    lastData = datas[datas.length - 1].blog;
    console.log(lastData)
    pramAjaxDy.lastBlogMsgid = lastData.blogMsgId;
    pramAjaxDy.lastUpdateTime = lastData.updateTime;
  }

    //滚动数据处理
    function dataHandDataBottom(data) {
      //判断是否有数据，无数据就显示没有更多
      if (data.length == 0) {
        isOverLoad = true;
        $("#noMore").show();
        $("#loadMoreloding").hide();
        return;
      }
      //当数据小于十个的时候不显示加载更多
      if (data.length < 10) {
        $("#loadMoreloding").hide();
        $("#noMore").show();
        $.detachInfiniteScroll($('#tab1Content'));
      }
      myPageUi(data); ;
    }
  
  //加载更多ajax
  function loadMoreAjaxMyPage(callBack) {
    //开启加载指示器
    $.showIndicator();
    pramAjaxDy.lastBlogMsgid = lastData.blogMsgId;
    pramAjaxDy.lastUpdateTime = lastData.updateTime;
    $.ajax({
      url: postUrl + "/getBlog",
      type: "POST",
      data: JSON.stringify(pramAjaxDy),
      contentType: "application/json;charset=utf-8",
      success: function (res) {
        console.log(res)
        $.hideIndicator();
        if (res.code == 200) {
          if (res.data.length != 0) {
            //最后一条的时间和id;获取最后的数据填充参数以便回调
            getMyPageLastData(res.data)
          } else {
            $('#loadMoreloding').hide();
            $('#noMore').show();
            return;
          }
          $("#loadMoreloding").hide();
          dataHandDataBottom(res.data);
          //是否有回调
          if (!!callBack) {
            callBack();
          }
        }
      },
      error: function (msg) {
        $.toast("网络请求超时！！！")
      }
    });
  }

  $('.content').scroll(function () {
    var scrollHeight = $('.content').scrollTop();
    if (scrollHeight > 0 && scrollHeight <= 100) {
      $('.topbarShowOrHide').css({'opacity':0.3,'display':'block'})
    } else if (scrollHeight > 100) {
      $('.topbarShowOrHide').css({'opacity':1,'display':'block'})
    } else {
      $('.topbarShowOrHide').css({'opacity':1,'display':'none'});
    }
  });

  //点击美篇动态跳转至详情
  $("#myPageContent").on("click", ".ul_content_active_content", function () {
    $.router.load('/details.html');
    currentClickMsgId = $(this).attr("msg");
    console.log(currentClickMsgId)
    topicName = $(this).attr("topicName");
  });

   //模板
   function myPageUi(data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
      if(data[i].blog != null){
        var topicName = JSON.parse(data[i].blog.msgContent).text.topicName;
        html += '<li class="ul_content_active_content" msg="' + data[i].blog.msgId +'" topicName="'+topicName + '">' +
        '<p class="infoNameMyPage"><img src="./images/1.jpg"><span>云淡风轻</span></p>' +
        '<div class="active_title">' + JSON.parse(data[i].blog.msgContent).text.title + '</div>' +
        '<div class="active_img">' +
        '<img src="' + JSON.parse(data[i].blog.msgContent).picture[0].pictureUrl + '">' +
        '</div>' +
        '<div class="good">' +
        '<div class="good_people">' +
        '<span class="clearfix good_people_span">' +
        '<img src="./images/21.jpg">' +
        '<img src="./images/22.jpg">' +
        '<img src="./images/timg1.jpg">' +
        '<img src="./images/timg.jpg">' +
        '<em><img src="./images/btn_icon_44.png">'+data[i].thumbUpNum+'</em>' +
        '</span>' +
        '<div class="good_people_right">' +
        '<span><img src="./images/btn_icon_45.png">'+data[i].commentNum+'</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</li>'
    }
  }
    $('#myPageContent').append(html);
  }

}