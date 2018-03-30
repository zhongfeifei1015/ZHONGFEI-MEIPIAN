function details(){
  //获取当前点击的动态msgId;
  currentClickMsgId = currentClickMsgId+"" ;
  console.log(currentClickMsgId)
   //获取当前点击的动态模版id;
  topicName = topicName +"";
  new Snowflake({
    containerId:"details",
    imgSrc:"./images/realLeaf.png",
    picNumber:"10",
    isRotate:true,
  });
  // $("#details .bar-nav").html('');
  // $("#detailContent").html('');
  $('.newComment').html('');
  $('.detailsBar').html('');
    $.ajax({
      url: postUrl + '/getBlogInfo',
      type: "POST",
      data: '{ "msgId":"' + currentClickMsgId + '","imId":"' + selfImId + '"}',
      contentType: "application/json;charset=utf-8",
      success: function (res) {
        $('.newComment-detailContent').html('');
        console.log(res)
        if (res.code == 200) {
          renderDetailHtml(res);
          commentInitUi(res.data);
          detailsBarUi(res.data);
        }
      },
      error: function (msg) {
        $.toast("网络错误");
      }
    });

    function commentInitUi(data){
      html = '';
      html += ' <p>最新评论('+data[0].commentNum+')</p>'+
              '<div class="newComment-detailContent">'
              if(data[0].comment.length-1<=5){
                for (var i = data[0].comment.length-1; i >= 0 ; i--) {
                  newComentUi(data,i)
                }
              }else{
                  for (var i = 4; i >= 0 ; i--) {
                    newComentUi(data,i)
                }
              }
      html += ' <div class="watchAll" id="watchAll" onclick="watchAll()">查看所有评论&nbsp> </div>'
      '</div>'
      $('.newComment').append(html);
    }
    function newComentUi(data,i){
        var msg = JSON.parse(data[0].comment[i].msgContent).text.msg;
        html += '<div class="newComment-detail">'+
        '<div class="newComment-avatar">'+
        '  <img src="./images/timg.jpg">'+
        '</div>'+
        '<div class="newComment-imformation">'+
        '  <div class="newComment-name">'+
        '    <span class="newComment-name1">' +data[0].blog.userName+'</span>'+
        '    <span class="newComment-time">'+ getDateDiff(data[0].comment[i].createTime)+'</span>'+
        '  </div>'+
        '  <span class="newComment-text">'+ msg +'</span>'+
        '</div>'+
      '</div>'
    }
    //底部ui
    function detailsBarUi(data){
      var html ='';
      html += ' <li id="detaisThumpUp">'+
      '<div class="good-image"><img src="./images/pic1.png"></div>'+
      '<div class="good-text">点赞<span>'+data[0].thumbUpNum+'</span></div>'+
      '</li>'+
      '<li id="detaisComment">'+
      '<div class="comment-image"><img src="./images/pic3.png"></div>'+
      '  <div class="good-text" onclick="watchAll()">评论<span>'+data[0].commentNum+'</span> </div>'+
      '</li>'
      $('.detailsBar').append(html);
    }

    //点赞
  $('.detailsBar').on('click', '.good-image', function (e) {
    //阻止默认行为
    e.stopImmediatePropagation()
    var $thumbsUp = $(this).siblings().children();
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
          if(res.code == 200){
            $thumbsUp.addClass('thumb_active');
            $(e.target).siblings().addClass('thumb_active');
            $(e.target).children().attr("src", "./images/good2.png")
            var goodCount = $thumbsUp.html();
            goodCount++;
            $thumbsUp.html(goodCount);
          }
        }
      });
    } 
  });

    $('#detaisComment').click(function(){
      $.router.load('./commentDetails.html');
    });
    $('.guanzhu').click(function(e){
      var pramAjaxAttention = {};
      pramAjaxAttention.imId = selfImId,
      pramAjaxAttention.attentionImid = '422301196605010552',
      pramAjaxAttention.from_type = 0,
      $.ajax({
        url: postUrl + "/attention",
        type: 'post',
        dataType: 'json',
        data: JSON.stringify(pramAjaxAttention),
        contentType: "application/json;charset=utf-8",
        success: function (res) {
          if (res.code == 200) {
            console.log(res)
            $(e.target).remove();
            $.toast('关注成功');
          }
        }
      });
    });

  if(topicName == 'model1'){
    $('#detail_cotent').removeClass().addClass('modelActive1');
  }else if(topicName == 'model2'){
    $('#detail_cotent').removeClass().addClass('modelActive2');
  }else if(topicName == 'model3'){
    $('#detail_cotent').removeClass().addClass('modelActive3');
  } else if(topicName == 'model4'){
    $('#detail_cotent').removeClass().addClass('modelActive4');
  }else if(topicName == 'model5'){
    $('#detail_cotent').removeClass().addClass('modelActive5');
  }else if(topicName == 'model6'){
    $('#detail_cotent').removeClass().addClass('modelActive6');
  }
    
};
  
  //将时间戳转为时间
  Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function renderDetailHtml(res){
  var header = '<a class="button button-link button-nav pull-left getBackToPage" href="javascript:history.go(-1);">'+
        '<span style="padding-left: 10px">'+
          '<img src="./images/leftBack.png" alt="" style="width:10px;margin-top:14px;">'+
        '</span>'+
      '</a>'+
      '<a href="./myPage.html" class="button button-link button-nav name-center" style="width: 30%;margin-left: 25%;">'+
        '<img src="./images/timg.jpg">'+
        '<span class="button-name">'+ res.data[0].blog.userName +'</span>'+
      '</a>'+
      '<span class="guanzhu">关注</span>'
      
      var text = '<h3>' + JSON.parse(res.data[0].blog.msgContent).text.title + '</h3>' +
        '<div class="detailInfo">' +
        '<span class="time">'+ (new Date(Number(res.data[0].blog.createTime))).format('yyyy-MM-dd hh:mm:ss') +'</span>' +
        '<a href="#">'+ res.data[0].blog.userName +'</a>' +
        //'<span class="readNum">阅读4524</span>' +
        '</div>' +
        '<div class="picture">' +
        '<img src="' + JSON.parse(res.data[0].blog.msgContent).picture[0].pictureUrl + '" alt="" style="width:100%;height:170px;">' +
        '</div>' +
        '<div class="article">' +
        '<p>' + JSON.parse(res.data[0].blog.msgContent).text.msg + '</p>' +
        '  </div>'+
        '  </div>'
          var text = text.replace(/<img src='..\/..\/images\/addImg.png'>/g,"<p></p>");
          $("#details .bar-nav").html(header);
          $("#detailContent").html(text);
          $.hideIndicator();
}
function watchAll(){
   $.router.load("./commentDetails.html");
}