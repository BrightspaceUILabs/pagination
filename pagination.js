import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { getLocalizeResources } from './localization.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';

class Pagination extends RtlMixin(LocalizeMixin(LitElement)) {

	static get properties() {
		return {
			pageNumber: { type: Number },
			maxPageNumber: { type: Number },
			nextPageText: { type: String },
			previousPageText: { type: String },
			showItemCountSelect : { type: Boolean },
			itemCountOptions : { type: Array },
			selectedCountOption : {type: Number},

			_disablePrevPage: { type: Boolean },
			_disableNextPage: { type: Boolean },
		};
	}

	static get styles() {
		return [selectStyles, css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}

			.pagination-container {
				display: flex;
				align-items: center;
			}

			.page-number {
				margin-left: .25rem;
				margin-right: .25rem;
				width: 4em;
			}

			.page-max {
				margin-right: .25rem;
			}

			.d2l-input-select {
				margin-left: 1rem;
			}
		`];
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
		this.pageNumber = 1;
		this.itemCountOptions = [10, 20, 30, 40];
		this.maxPageNumber = 1;
	}

	static async getLocalizeResources(langs) {
		return getLocalizeResources(langs, baseUrl);
	}

	_submitPageNumber(e) {
		if (e.target.value === this.pageNumber) {
			return;
		}

		const event = new CustomEvent('pagination-page-change', {
			detail: {
				page: e.target.value
			},
			bubbles: true,
			composed: true
		});
		this.dispatchEvent(event);
	}

	_navToPreviousPage() {
		const newPageNumber = this.pageNumber - 1;
		const event = new CustomEvent('pagination-page-change', {
			detail: {
				page: newPageNumber
			},
			bubbles: true,
			composed: true
		});
		this.dispatchEvent(event);
	}

	_navToNextPage() {
		const newPageNumber = this.pageNumber + 1;
		const event = new CustomEvent('pagination-page-change', {
			detail: {
				page: newPageNumber
			},
			bubbles: true,
			composed: true
		});
		this.dispatchEvent(event);
	}

	_pageCounterChange(e) {
		const event = new CustomEvent('pagination-item-counter-change', {
			detail: {
				itemCount: e.target.value
			},
			bubbles: true,
			composed: true
		});
		this.dispatchEvent(event);
	}

	disablePreviousPageButton() {
		return this.pageNumber <= 1;
	}

	disableNextPageButton() {
		return this.pageNumber >= this.maxPageNumber;
	}

	render() {
		return html`
		<div class="pagination-container">
			<d2l-button-icon icon="d2l-tier1:chevron-left" @click="${this._navToPreviousPage}" text="${this.previousPageText}" ?disabled=${this.disablePreviousPageButton()}></d2l-button-icon>
			<d2l-input-text class="page-number" aria-label="page_number_title" value="${this.pageNumber}" @blur="${this._submitPageNumber}"></d2l-input-text>
			<span class="page-max">∕ ${this.maxPageNumber}</span>
			<d2l-button-icon icon="d2l-tier1:chevron-right" @click="${this._navToNextPage}" text="${this.nextPageText}" ?disabled=${this.disableNextPageButton()}></d2l-button-icon>

			${this.showItemCountSelect ? html`
				<select class="d2l-input-select" @change="${this._pageCounterChange}">
					${this.itemCountOptions.map(item => html`
						<option ?selected="${this.selectedCountOption === item}" value="${item}">${item} ${}</option>
					`)}
				</select>` : null }

		</div>
		`;
	}
}
customElements.define('d2l-labs-pagination', Pagination);
