import { css, html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import '@brightspace-ui/core/components/button/button-icon.js';

class Pagination extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			nextPageText: { type: String },
			previousPageText: { type: String },
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	static async getLocalizeResources(langs) {
		const langResources = {
			'en': { 'myLangTerm': 'I am a localized string!' }
		};

		for (let i = 0; i < langs.length; i++) {
			if (langResources[langs[i]]) {
				return {
					language: langs[i],
					resources: langResources[langs[i]]
				};
			}
		}

		return null;
	}

	constructor() {
		super();

		this.nextPageText = 'To next page';
		this.previousPageText = 'To previous page';
	}

	render() {
		return html`
		<d2l-button-icon icon="d2l-tier1:chevron-left" on-tap="_onTap" text="${previousPageText}" ?disabled=${_disablePrevPage}>
		</d2l-button-icon>

		<d2l-button-icon icon="d2l-tier1:chevron-right" on-tap="_onTap" text="${nextPageText}" ?disabled=${_disableNextPage}>
		</d2l-button-icon>
		`;
	}
}
customElements.define('d2l-labs-pagination', Pagination);
