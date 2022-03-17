<script>
	import '../app.css';
	import Layout from '../components/Layout.svelte';
</script>

<Layout>
	<slot />
</Layout>

<style lang="scss" global>
	/* XXX: Replicate main.scss in order to work around some bugs on upstream lulz */
	@import 'normalize';
	$static: '';
	@import './../../node_modules/@ons/design-system/scss/vars/colors';
	@import './../../node_modules/@ons/design-system/scss/vars/typography';
	@import './../../node_modules/@ons/design-system/scss/vars/grid';
	@import './../../node_modules/@ons/design-system/scss/vars/forms';
	@import './../../node_modules/@ons/design-system/scss/helpers/index';
	@import './../../node_modules/@ons/design-system/scss/base/index';
	@import './../../node_modules/@ons/design-system/scss/objects/index';
	@import './../../node_modules/@ons/design-system/components/access-code/uac';
	@import './../../node_modules/@ons/design-system/components/address-output/address-output';
	@import './../../node_modules/@ons/design-system/components/articles/articles';
	@import './../../node_modules/@ons/design-system/components/autosuggest/autosuggest';
	@import './../../node_modules/@ons/design-system/components/breadcrumbs/breadcrumbs';
	@import './../../node_modules/@ons/design-system/components/button/button';
	@import './../../node_modules/@ons/design-system/components/call-to-action/call-to-action';
	@import './../../node_modules/@ons/design-system/components/card/card';
	@import './../../node_modules/@ons/design-system/components/checkboxes/checkbox';
	@import './../../node_modules/@ons/design-system/components/checkboxes/checkboxes';
	@import './../../node_modules/@ons/design-system/components/collapsible/collapsible';
	@import './../../node_modules/@ons/design-system/components/content-pagination/content-pagination';
	@import './../../node_modules/@ons/design-system/components/cookies-banner/cookies-banner';
	@import './../../node_modules/@ons/design-system/components/download-resources/download-resources';
	@import './../../node_modules/@ons/design-system/components/downloads/downloads';
	@import './../../node_modules/@ons/design-system/components/external-link/external-link';
	@import './../../node_modules/@ons/design-system/components/feedback/feedback';
	@import './../../node_modules/@ons/design-system/components/field/field-group';
	@import './../../node_modules/@ons/design-system/components/field/field';
	@import './../../node_modules/@ons/design-system/components/fieldset/fieldset';
	@import './../../node_modules/@ons/design-system/components/find-a-support-centre/find-a-support-centre';
	@import './../../node_modules/@ons/design-system/components/footer/footer';
	@import './../../node_modules/@ons/design-system/components/header/header-nav';
	@import './../../node_modules/@ons/design-system/components/header/header';
	@import './../../node_modules/@ons/design-system/components/hero/hero';
	@import './../../node_modules/@ons/design-system/components/icons/icons';
	@import './../../node_modules/@ons/design-system/components/images/images';
	@import './../../node_modules/@ons/design-system/components/input/input-type';
	@import './../../node_modules/@ons/design-system/components/input/input';
	@import './../../node_modules/@ons/design-system/components/label/label';
	@import './../../node_modules/@ons/design-system/components/language-selector/language';
	@import './../../node_modules/@ons/design-system/components/lists/list';
	@import './../../node_modules/@ons/design-system/components/message-list/message-list';
	@import './../../node_modules/@ons/design-system/components/message/message';
	@import './../../node_modules/@ons/design-system/components/metadata/metadata';
	@import './../../node_modules/@ons/design-system/components/modal/modal';
	@import './../../node_modules/@ons/design-system/components/pagination/pagination';
	@import './../../node_modules/@ons/design-system/components/panel/panel';
	@import './../../node_modules/@ons/design-system/components/phase-banner/phase-banner';
	@import './../../node_modules/@ons/design-system/components/promotional-banner/promo-banner';
	@import './../../node_modules/@ons/design-system/components/question/question';
	@import './../../node_modules/@ons/design-system/components/quote/quote';
	@import './../../node_modules/@ons/design-system/components/radios/radio';
	@import './../../node_modules/@ons/design-system/components/radios/radios';
	@import './../../node_modules/@ons/design-system/components/related-content/related-content';
	@import './../../node_modules/@ons/design-system/components/relationships/relationships';
	@import './../../node_modules/@ons/design-system/components/search/search';
	@import './../../node_modules/@ons/design-system/components/section-navigation/section-navigation';
	@import './../../node_modules/@ons/design-system/components/skip-to-content/skip';
	@import './../../node_modules/@ons/design-system/components/status/status';
	@import './../../node_modules/@ons/design-system/components/summary/summary';
	@import './../../node_modules/@ons/design-system/components/table-of-contents/toc';
	@import './../../node_modules/@ons/design-system/components/table/table';
	@import './../../node_modules/@ons/design-system/components/tabs/tabs';
	@import './../../node_modules/@ons/design-system/components/text-indent/text-indent';
	@import './../../node_modules/@ons/design-system/components/timeline/timeline';
	@import './../../node_modules/@ons/design-system/components/upload/upload';
	@import './../../node_modules/@ons/design-system/components/video/video';
	@import './../../node_modules/@ons/design-system/scss/utilities/index';
	// Right to left
	@import './../../node_modules/@ons/design-system/scss/overrides/rtl';
	// High Contrast Mode
	@import './../../node_modules/@ons/design-system/scss/overrides/hcm';

	/* TODO: Replace with the following once [this bug](https://github.com/ONSdigital/design-system/issues/1750) is fixed. */
	/* $static: ""; */
	/* @import "./../../node_modules/@ons/design-system/scss/main.scss"; */

	/* TODO: Better yet, only include vars here (with overridden $static variable) and include component specific SCSS on per component basis */
</style>
