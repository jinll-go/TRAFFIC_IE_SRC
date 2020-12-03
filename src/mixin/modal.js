// resize.js
export default {
  mounted(){
    this.backlayer_rect_update();
  },
  updated(){
    this.backlayer_rect_update();
  },
  destroyed(){
    this.exit();
  },
  methods:{
    backlayer_rect_update(){
      msg('1111111111')
      if ($('.mask').length == 0) {return;}

      let el = $('.mask').first().children();
      msg(el)

        if ($('#backlayer').length == 0) {


          el.css({position:'absolute'});
          el.css({top:'60px',left:($(document.body).width() - el.width())/2 + 'px',margin:'0 auto'});


          let str = ' <iframe id="backlayer" style="border: 0px;position:absolute;background-color: red;height: ' + el.height() +'px;width: ' + el.width() + 'px;left:' + el.position().left + 'px;top:' + el.position().top + 'px;"></iframe>';

            $(document.body).append(str);


          //drag and move
          el.bind("mousedown",function(event){
            let tag = event.target.tagName.toLowerCase();
            if(tag == 'select' || tag == 'option' )return;
      
            //获取需要拖动节点的坐标 
            var offset_x = $(this)[0].offsetLeft;//x坐标
            var offset_y = $(this)[0].offsetTop;//y坐标
            // 获取当前鼠标的坐标 
            var mouse_x = event.pageX;
            var mouse_y = event.pageY;
         
            // 绑定拖动事件 
            // 由于拖动时，可能鼠标会移出元素，所以应该使用全局（document）元素 
            $(document).bind("mousemove",function(ev){
              // 计算鼠标移动了的位置 
              var _x = ev.pageX - mouse_x;
              var _y = ev.pageY - mouse_y;
              // 设置移动后的元素坐标 
              var now_x = (offset_x + _x ) + "px";
              var now_y = (offset_y + _y ) + "px";
//             msg([now_x,now_y])
              // 改变目标元素的位置 
             el.css({
                top:now_y,
                left:now_x
              });
               $('#backlayer').css({
                top:now_y,
                left:now_x,
              
              });
            });
          });

        // 当鼠标左键松开，接触事件绑定 
        $(document).bind("mouseup",function(){
          $(this).unbind("mousemove");
        });



        }else{
           $('#backlayer').css({
            left:el.css("left"),
            top:el.css("top"),
            width:el.width()+'px',
            height:el.height()+'px',
          })
        }



        //center
       // el.css({top:'60px',left:($(document.body).width() - el.width())/2 + 'px',margin:'0 auto'});
        msg([el.height(),$('#backlayer').height()]);
      /*  if (el.height() > 0 && el.height() != $('#backlayer').height()) {
         
        }
      */
      
       
      
    },
    exit(){

      $('#backlayer').remove();

      this.$store.dispatch("dialog/exit",this.$store.getters.preview.dialog).then(r=>{
          this.$store.commit("preview/dialog_changed",'');
      });
    }
  }
}