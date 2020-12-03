
<template>



<div class="main">
<!--
 <div id="prev" style="width:10px;position:absolute;top:0px;left:0px;height:100%" v-show="$UI['CVFramePlayback'].showBackup.visible">
    <a class="prev arrow"  v-show="false" @click="change_tab"></a> 

 </div>
 -->
  <CVFramePlayBack v-show="odd"></CVFramePlayBack>
   <CVModalDialogBackup v-show="even"></CVModalDialogBackup>
<!--
  <div id="next" style="width:10px;position:absolute;top:0px;right:0px;height:100%" v-show="$UI['CVFramePlayback'].showBackup.visible">  
    <a class="next arrow"  v-show="false" @click="change_tab"></a>
  </div>
 -->
</div> 




</template>

<script>

import CVFramePlayBack from 'components/playback/cv-index-playback'


import CVModalDialogBackup from 'components/playback/cv-modal-dialog-backupV2'



export default {
	name:'CVFramePBSlider',
 	data(){
 		return {
 		
 		}
 	},
 	mounted(){//缓存组件 第一次mounted、
      /*$("#prev").hover(
        function(){
            $(this).children().first().stop().fadeTo("slow",1,function(){
                $(this).css("display", "block");
            })
        },
        function(){
            $(this).children().first().stop().fadeTo("slow",0,function(){
                $(this).css("display", 'none');
            })
        }
    );


      $("#next").hover(
          function(){
              $(this).children().first().stop().fadeTo("slow",1,function(){
                  $(this).css("display", "block");
              })
          },
          function(){
              $(this).children().first().stop().fadeTo("slow",0,function(){
                  $(this).css("display", 'none');
              })
          }
      );*/
       if (this.activated) {
             if (this.current_idx == 1) {
                this.$store.commit( 'playback/activated',true);
             }else{
                this.$store.commit( 'backup/activated',true);
             }
         }else{
            
              this.$store.commit('playback/activated',false);
              this.$store.commit( 'backup/activated',false);
           
         }
 	},
 	methods:{
    change_tab(){
      if (!this.$store.getters.channel_checked){
          alert(this.$store.getters.current_language.i18n_check_channel_first);
          return;
      }
      this.$store.dispatch("pbslider_tab_change",!this.current_idx?1:0);
    }
 

 	},

  computed:{
    activated(){
      return this.$store.getters.pbslider_activated;
    },
    height(){
      this.init_subs();
      return (this.$store.getters.content_rect.height - 76 - 41)+'px';
    },
    odd(){
      return this.current_idx == 1;
    },
    even(){
      return this.current_idx == 0;
    },
    current_idx(){
        return this.$store.getters.pbslider_tab_idx;
    }
  },
  watch:{
    activated(newVal,oldVal)
    {
        if (newVal) {
             if (this.current_idx == 1) {
                this.$store.commit( 'playback/activated',true);
             }else{
                this.$store.commit( 'backup/activated',true);
             }
         }else{
            
              this.$store.commit('playback/activated',false);
              this.$store.commit( 'backup/activated',false);
           
         }
    }
  },
 	components:{
 		CVFramePlayBack,
 	  CVModalDialogBackup
 	}
}
    
</script>
