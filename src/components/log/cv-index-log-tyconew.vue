<template>
	<!-- -->

	<FixedTop3ColumnAutoSizeLayout top_height="0" right_width="0" left_width="0">
		<template v-slot:centerpanel>
			<CVLogSearch ref="logsearch"></CVLogSearch>

			<div class="w100">
				<CVLogTable ref="logmain" :da="d"></CVLogTable>
				<div class="w100" id="mtab"></div>
				<CVFootMenu ref="footmenu" :foot="foot"></CVFootMenu>
			</div>
		</template>
	</FixedTop3ColumnAutoSizeLayout>
</template>

<script>
	import FixedTop3ColumnAutoSizeLayout from "../../layout/fixedtop-3column-layout";
	import CVLogSearch from "components/log/cv-log-search";
	import CVLogTable from "components/log/cv-log-showtext";
	import CVFootMenu from "components/log/cv-log-footmenu";

	import LOGComponent from "mixin/log";
	export default {
		name: "CVFrameLog",
		mixins: [LOGComponent],
		components: {
			CVLogSearch,
			CVLogTable,
			CVFootMenu,
			FixedTop3ColumnAutoSizeLayout,
		},
	};
</script>
