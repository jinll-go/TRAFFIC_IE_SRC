<template>
	<transition name="fade">
		<div class="img-view" @click="bigImg">
			<!-- 遮罩层 -->
			<div class="img-layer"></div>
			<div class="img">
				<img :src="imgSrc" @mousewheel="scale_img" />
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'CVFileDialog',
	props: ['imgSrc'],
	methods: {
		bigImg() {
			this.$emit('clickit')
		},
		scale_img(e) {
			e = window.event || e // old IE support
			let delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail))

			console.log(e.target)
			e.target.style.width =
				Math.max(352, Math.min(1920, e.target.width + 30 * delta)) +
				'px'
		},
	},
}
</script>

<style>
/*动画*/
.fade-enter-active,
.fade-leave-active {
	transition: all 0.2s linear;
	transform: translate3D(0, 0, 0);
}

	.fade-enter,
	.fade-leave-active {
		transform: translate3D(100%, 0, 0);
	}

	/*bigimg */
	.img-view{
		position: absolute;
	    width: 100%;
	top: -70px;

	}

	/* 遮罩层样式*/
	.img-view .img-layer {
		position: fixed;
		z-index: 999;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.8);
		width: 100%;
		height: 100%;
		overflow: hidden;

	}

	/*不限制图片大小，实现居中*/
	.img-view  .img img {
		max-width: 100%;
		width: 60%;
	    display: block;
	    position: absolute;
	    top:0px;
	    left:0px;
	    right:0px;
	    bottom:0px;
	    margin: 40px auto ;
	    z-index: 1000;
	}

</style>
