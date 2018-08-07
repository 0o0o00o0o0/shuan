Zepto (function ($) {
  /**
   *  初始化select  等数据
   */
  var isposting = false;
  var baseUrl = '';
  var num = 60;
  var optionDom = '';
  //手机号正则
  var phoneReg = /(^1\d{10}$)/;
  // 加载下拉数据
  for (var i = 0; i < json.length; i++) {
    optionDom +=
      '<option value ="' + json[i].value + '">' + json[i].name + '</option>';
  }
  $ ('.textselect').append (optionDom);
  $ ('.Endpoint').html (json[0].value);
  $ ('.textselect').change (function (e) {
    $ ('.Endpoint').html (e.target.value);
  });
  $ ('.shade').css ('display', 'none'); // 遮罩层

  // 点击解压客户端下载
  function urlClicked () {
    window.open ('https://github.com/Genetalks/gtz.git');
  }
  $ ('#url').click (function () {
    urlClicked ();
  });
  ////   电话号码发送按钮点击事件
  $ ('.sendcode').click (function () {
    var phone = $.trim ($ ('.telephone_number').val ());
    if (phoneReg.test (phone)) {
      $ ('.sendcode').prop ('disabled', true); /// 正则验证通过  60秒倒计时
      $ ('.sendcode').css ('background', '#ccc');
      var time = setInterval (() => {
        if (num > 0) {
          $ ('.sendcode').html (num + 's后再次发送');
          num--;
        } else {
          $ ('.sendcode').prop ('disabled', false);
          $ ('.sendcode').html ('发送');
          $ ('.sendcode').css ('background', '#296AEB');
          num = 60;
          clearInterval (time);
        }
      }, 1000);
      $.ajax ({
        // 异步发送ajax 获取数据
        type: 'GET',
        url: '/api/v1/sms/' + phone + '/code',
        success: function (data) {
          if (data.status === 200) {
            console.log ('短信发送成功');
          } else {
            alert (data.message);
          }
        },
        error: function (e) {
          console.log (e);
          alert ('请求出错，请稍后再试');
        },
      });
    } else {
      alert ('请输入正确的手机号码');
    }
  });
  /**
   *  提交总体数据
   */
  $ ('.start_ys').click (function () {
    clearTimeout (timeout);
    var phonenum = $ ('.telephone_number').val ();
    var postdata = {
      access_key_id: $ ('.access_key_iD').val (),
      secret_access_key: $ ('.secret_access_key').val (),
      endpoint: $ ('.textselect').val (),
      from_bucket: $ ('.form_bucket').val (),
      to_bucket: $ ('.to_bucket').val (),
      telephone_number: phonenum,
      verification_code: $ ('.verification_code').val (),
    };
    if (!phoneReg.test ($.trim ($ ('.telephone_number').val ()))) {
      alert ('请输入正确的手机号码重试');
      return;
    }
    var timeout = setTimeout (() => {
      //  避免重复提交
      if (!isposting) {
        isposting = true;
        $.ajax ({
          // 异步发送ajax 获取数据
          type: 'POST',
          url: baseUrl + '/api/v1.0/get_client_proxy',
          data: JSON.stringify (postdata),
          contentType: 'application/json',
          success: function (data) {
            data = JSON.parse (data);
            // 数据成功处理
            if (data.code === 0) {
              $ ('.bluephone').html (
                phonenum.substring (0, 3) + '****' + phonenum.substring (7, 11)
              );
              $ ('.shade').css ('display', 'block');
            } else {
              alert (data.info);
            }
            isposting = false;
          },
          error: function (e) {
            console.log (e);
            alert ('请求出错，请稍后再试');
            isposting = false;
          },
        });
      } else {
        alert ('数据提交中，请稍后再试');
      }
    }, 500);
  });
  /**
 *  遮罩层消失
 */
  $ ('.finally').click (function () {
    $ ('.shade').css ('display', 'none');
    // 清空输入框数据
    $ ('.access_key_iD').val ('');
    $ ('.secret_access_key').val ('');
    $ ('.textselect').val (json[0].value);
    $ ('.form_bucket').val ('');
    $ ('.to_bucket').val ('');
    $ ('.telephone_number').val ('');
    $ ('.verification_code').val ('');
  });
});
