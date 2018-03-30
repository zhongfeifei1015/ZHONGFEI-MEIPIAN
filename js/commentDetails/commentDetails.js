function pageCommentDetails() {
  $('.content').scrollTop(0);
  currentClickMsgId = currentClickMsgId+"" ;
  // $("#uiContentList").html("");
  // $('.commentNum').html("");
  initDownResh();
  //进入自动触发一次
  $.pullToRefreshTrigger("#commentContent");
  //下拉刷新
  function initDownResh() {
    if (documentFlag == true) {
      $(document).on("refresh", "#commentContent", function () {
        // 模拟1s的加载过程
        function callBackFunc() {
          $.pullToRefreshDone("#commentContent");
          $.attachInfiniteScroll($('#commentContent'));
        }
        render(callBackFunc);
      });
      documentFlag = false;
    }
  }

  function render(callBackFunc) {
    $('.infinite-scroll-preloader').hide();
    //初始化参数
    var paramaAjaxD = {};
    paramaAjaxD.msgId = currentClickMsgId;
    paramaAjaxD.imId = selfImId;
    //开启加载指示器
    $.showIndicator();
    $.ajax({
      url: postUrl + "/getBlogInfo",
      type: "post",
      dataType: "json",
      data: JSON.stringify(paramaAjaxD),
      contentType: "application/json;charset=utf-8",
      success: function (res) {
        $.hideIndicator();
        $("#uiContentList").html("");
        $('.commentNum').html("");
        if (res.code == 200 && res.data!= 0) {
          headInitNum(res.data);
          dataHandler(res.data);
          if (!!callBackFunc) {
            callBackFunc();
          }
          if (res.data[0].comment.length < 10) {
            //$('.infinite-scroll-preloader').hide();
            $('#noMore').show();
          }
        } else {
          $('#noMore').show();
        }
      }
    });
  }

  //处理数据到UI
  function dataHandler(data) {
    if( data[0].blog.blogMsgId == currentClickMsgId && data[0].comment.length!=0){
      for(var i = data[0].comment.length-1;i>=0;i--){
        uiItemList(data, i);
      }
    }
  }
  //ui模板
  function uiItemList(data, i) {
    var name = data[0].blog.userName;
    var msg = JSON.parse(data[0].comment[i].msgContent).text.msg;
    var node = '<div class="commentList" id ="'+data[0].comment[i].blogMsgId+'">';
    node += ' <div class="infoImage">';
    node += '   <img src="./images/timg.jpg" alt="">';
    node += ' </div>';
    node += ' <div class="infoContent">';
    node += '   <div class="infoName">';
    node += '     <span class="userName"> '+ data[0].blog.userName +'</span>';
    // node += '     <span class="praise">';
    // node += '       <img src="./images/pic1.png" alt="" class="praiseImg"> <span class="praiseNum">0</span>';
    // node += '     </span>';
    node += '   </div>';
    node += '   <div class="infoContentText"> '+ Face().get(msg) +'</div>';
    // node += '<div class="infoContentReply">';
    // node += '<div class="replyList">';
    // node += '  <span class="replyText"><span class="infoNameReply">冰心:</span>主要是赶巧.安写幽默小段子多了,在这写点评换换口味.主要是赶巧.安写幽默小段子多了,在这写          点评换换口味主要是赶巧.安写幽默小段子多了';
    // node += '</span>';
    // node += '</div>';
    // node += ' <div class="replyCount">共10条回复></div>';
    // node += '</div>';
    node += '   <div class="infoTime">';
    node += ''+ getDateDiff(data[0].comment[i].createTime)+'';
    node += '   </div>';
    // node += ' </div>';
    node += ' </div>';
    $("#uiContentList").append(node);
  }

  function uiContent(data) {
    var msg = JSON.parse(data.msgContent).text.msg;
    var node = '<div class="commentList">';
    node += ' <div class="infoImage">';
    node += '   <img src="./images/timg.jpg" alt="">';
    node += ' </div>';
    node += ' <div class="infoContent">';
    node += '   <div class="infoName">';
    node += '     <span class="userName">'+ data.userName +'</span>';
    // node += '     <span class="praise">';
    // node += '       <img src="./images/pic1.png" alt="" class="praiseImg"> <span class="praiseNum">0</span>';
    // node += '     </span>';
    node += '   </div>';
    node += '   <div class="infoContentText">';
    node += '     '+ msg+'';
    node += '   </div>';
    node += '   <div class="infoTime">';
    node += '     刚刚';
    node += '   </div>';
    node += ' </div>';
    node += ' </div>';
    $("#uiContentList").prepend(node);
  }

  function headInitNum(data){
    var commentNum = data[0].commentNum;
    if(commentNum>0){
      text ="";
      text += '<em>'+commentNum+'</em>条评论';
      $('.commentNum').append(text);
    }else{
      text ="";
      text += '<em>0</em>条评论';
      $('.commentNum').append(text);
    }
  }
  //点赞
  $('#uiContentList').on('click', '.praiseImg', function (e) {
    //阻止默认行为
    e.stopImmediatePropagation()
    var $thumbsUp = $(this).siblings();
    if ($thumbsUp.hasClass('thumb_active') == false) {
      var pramAjax = {};
      pramAjax.blogAuthorImid = selfImId;
      pramAjax.blogMsgid = currentClickMsgId;
      pramAjax.imId = selfImId;
      $.ajax({
        url: postUrl + "/thumbsUp",
        type: 'post',
        dataType: 'json',
        data: JSON.stringify(pramAjax),
        contentType: "application/json;charset=utf-8",
        success: function (res) {
          console.log(res);
          $thumbsUp.addClass('thumb_active');
          $(e.target).attr("src", "./images/good2.png")
          var goodCount = $thumbsUp.html();
          goodCount++;
          $thumbsUp.html(goodCount);
        }
      });
    } else {
      //取消点赞
      var pramRemmoveAjax = {};
      pramRemmoveAjax.msgId = currentClickMsgId;
      pramRemmoveAjax.blogMsgid = currentClickMsgId;
      pramRemmoveAjax.imId = selfImId;
      $.ajax({
        url: postUrl + "/cancelThumbsUp",
        type: 'post',
        dataType: 'json',
        data: JSON.stringify(pramRemmoveAjax),
        contentType: "application/json;charset=utf-8",
        success: function (res) {
          if(res.code==200){
            $thumbsUp.removeClass('thumb_active');
            $(e.target).attr("src", "./images/pic1.png")
            var goodCount = $thumbsUp.html();
            goodCount--;
            $thumbsUp.html(goodCount);
          }
        }
      });
    }
  });

  //发送评论
  $('.sendConmment').click(function () {
    var commentText = $.trim($("#commentText").val());
    if (commentText == "") {
      $.toast("请输入评论内容");
      $('#commentText').val("").focus();
      return;
    }
    var pramAjaxSend = {};
    pramAjaxSend.msgContent = {
        "text": {
          "msg": commentText
        }
      },
      pramAjaxSend.blogMsgid = currentClickMsgId,
      pramAjaxSend.blogAuthorImid = selfImId,
      pramAjaxSend.pimid = selfImId,
      pramAjaxSend.pmsgid = currentClickMsgId,
      pramAjaxSend.imid = selfImId,
      $.ajax({
        url: postUrl + "/makeComments",
        type: 'post',
        dataType: 'json',
        data: JSON.stringify(pramAjaxSend),
        contentType: "application/json;charset=utf-8",
        success: function (res) {
          if (res.code == 200) {
            setTimeout(function(){
              uiContent(res.data);
              $('#commentText').val("");
              $('.content').scrollTop(0); 
              $.toast("评论成功");
              var commentNum = $('.commentNum em').html();
              commentNum++;
              $('.commentNum em').html(commentNum);
            },500)
          }
        }
      });
  })

  $('#uiContentList').on('click', '.infoNameReply', function (e) {
    e.stopImmediatePropagation();
    $.router.load('./myPage.html');
  });
  $('#uiContentList').on('click', '.infoImage', function (e) {
    e.stopImmediatePropagation();
    $.router.load('./myPage.html');
  });
  $('#uiContentList').on('click', '.userName', function (e) {
    e.stopImmediatePropagation();
    $.router.load('./myPage.html');
  });
  //点击评论跳转到评论详情
  $('#uiContentList').on('click', '.commentList', function () {
    currentMsgId = $(this).attr("id");
    $.router.load('./allComments.html');
  })

  //滚动下拉显示回到顶部按钮
  $('.content').scroll(function () {
    scrollHeight = $('.content').scrollTop();
    if (scrollHeight > 200) {
      $('.topBackComent').fadeIn();
    } else {
      $('.topBackComent').fadeOut();
    }
  });
  //点击按钮回到顶部
  $('#topBackComent').tap(function () {
    $('.content').scrollTop(0);
  });
}


