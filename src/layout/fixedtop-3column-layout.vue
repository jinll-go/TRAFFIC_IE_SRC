<template>
	<div>
		<div :style="top" v-if="top_height > 0">
			<slot name="header">
				<!-- <h1>this is default header</h1>-->
			</slot>
		</div>

		<div :style="left" v-if="left_width > 0">
			<slot name="leftpanel">
				<!--  <h1>this is default left</h1>-->
			</slot>
		</div>
		<div :style="center">
			<slot name="centerpanel">
				<!-- <h1>this is default center</h1>-->
			</slot>
		</div>
		<div :style="right" v-if="right_width > 0">
			<slot name="rightpanel">
				<!-- <h1>this is default right</h1>-->
			</slot>
		</div>
	</div>
</template>
<script>
	export default {
		props: {
			top_height: {
				type: Number,
				default: 76,
			},
			// 多个可能的类型
			left_width: {
				type: Number,
				default: 0,
			},
			// 必填的字符串
			right_width: {
				type: Number,
				default: 0,
			},
		},
		data() {
			return {
				top: {
					position: "absolute",
					width: "100%",
					top: "0px",
					left: "0px",
					right: "0px",
					height: this.top_height + "px",
				},
				left: {
					position: "absolute",
					top: this.top_height + "px",
					left: "0px",
					width: this.left_width + "px",
					bottom: "0px",
					//background: "blue",
				},
				center: {
					position: "absolute",
					top: this.top_height + "px",
					left: this.left_width + "px",
					right: this.right_width + "px",
					bottom: "0px",
					//background: "red",
				},
				right: {
					position: "absolute",
					width: this.right_width + "px",
					top: this.top_height + "px",
					right: "0px",
					bottom: "0px",
					//	background: "green",
				},
			};
		},
	};
</script>
