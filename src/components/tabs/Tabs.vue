<template>
	<div>
		<div class="tab">
			<ul role="tablist">
				<li v-for="(tab, i) in tabs" :key="i" :class="{ curr: tab.isActive, 'is-disabled': tab.isDisabled }" role="presentation" v-show="tab.isVisible">
					<a v-html="tab.header" :aria-controls="tab.hash" :aria-selected="tab.isActive" @click="selectTab(tab.hash, $event)" role="tab"></a>
				</li>
			</ul>
		</div>
		<div class="cc">
			<section :aria-hidden="!isActive" class="tabs-component-panel" :id="hash" role="tabpanel">
				<slot name="mainfrm" :activeTabHash="activeTabHash" />
			</section>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';
	export default {
		props: {
			tabs: {
				type: Array,
				default: [],
			},
			// [{ isActive: true, isDisabled: false, isVisible: true, hash: '', header: '' }],
		},

		data: () => ({
			activeTabHash: '',
		}),



		mounted() {




			if (this.tabs.length) {
				this.selectTab(this.tabs[0].hash);
			}
		},

		methods: {
			findTab(hash) {
				return this.tabs.find((tab) => {
				
					return tab.hash === hash;
				});
			},

			selectTab(selectedTabHash, event) {

				const selectedTab = this.findTab(selectedTabHash);

				if (!selectedTab) {
					return;
				}

				if (selectedTab.isDisabled) {
					return;
				}
                //reload current components
                if (this.activeTabHash == selectedTab.hash) {
                    this.$emit('refresh', selectedTab.hash);
                } else {
                    //change
				this.tabs.forEach((tab) => {
					tab.isActive = tab.hash === selectedTab.hash;
				});

				Vue.nextTick(() => {
					this.$emit('changed', { tab: selectedTab });
				});

				this.activeTabHash = selectedTab.hash;
                }
			},

			setTabVisible(hash, visible) {
				const tab = this.findTab(hash);

				if (!tab) {
					return;
				}

				tab.isVisible = visible;

				if (tab.isActive) {
					// If tab is active, set a different one as active.
					tab.isActive = visible;

					this.tabs.every((tab, index, array) => {
						if (tab.isVisible) {
							tab.isActive = true;

							return false;
						}

						return true;
					});
				}
			},
		},
	};
</script>
