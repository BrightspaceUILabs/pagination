import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { Localizer } from './lang/localization.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';

class Pagination extends RtlMixin(Localizer(LitElement)) {

	static get properties() {
		return {
			pageNumber: { type: Number },
			maxPageNumber: { type: Number },
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
				display: flex;
				flex-direction: row;
				align-items: center;
				align-content: center;
				justify-content: center;
				white-space: nowrap;
			}

			:host([hidden]) {
				display: none;
			}

			@media (max-width: 544px) {
				:host {
					flex-direction: column-reverse;
				}
			}

			.pagination-container {
				display: block;
			}

			.page-selector-container {
				margin: 15px;
			}

			.page-selector-container > * {
				display: inline-flex;
			}

			.page-number {
				margin-left: .25rem;
				margin-right: .25rem;
				width: 4em;
			}

			.page-max {
				margin-right: .25rem;
				vertical-align: middle;
			}
		`];
	}

	constructor() {
		super();
		this.pageNumber = 1;
		this.itemCountOptions = [10, 20, 30, 40];
		this.maxPageNumber = 1;
	}

	_handleKeydown(e) {
		if (e.key === 'Enter') {
			this._submitPageNumber(e);
		}
	}

	_submitPageNumber(e) {
		if (!this._isValidNumber(e.target.value)) {
			e.target.value = this.pageNumber.toString();
			return;
		}

		this._firePageChangeEvent(Number(e.target.value));
	}

	/**
	 * @param {Number} newPageNumber
	 * @private
	 */
	_firePageChangeEvent(newPageNumber) {
		this.dispatchEvent(new CustomEvent('pagination-page-change', {
			detail: {
				page: newPageNumber
			},
			bubbles: true,
			composed: true
		}));
	}

	_navToPreviousPage() {
		this._firePageChangeEvent(this.pageNumber - 1);
	}

	_navToNextPage() {
		this._firePageChangeEvent(this.pageNumber + 1);
	}

	_pageCounterChange(e) {
		const event = new CustomEvent('pagination-item-counter-change', {
			detail: {
				itemCount: Number(e.target.value)
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

	_isValidNumber(input) {
		const value = Number(input);
		return !isNaN(value) &&
            isFinite(value) &&
            Math.floor(value) === value &&
            value >= 1 &&
			value <= this.maxPageNumber &&
			value !== Number(this.pageNumber);
	}

	render() {
		return html`
			<div class="pagination-container page-selector-container">
				<d2l-button-icon icon="tier1:chevron-left" @click="${this._navToPreviousPage}" text="${this.localize('page_previous')}" ?disabled=${this.disablePreviousPageButton()}></d2l-button-icon>
				<d2l-input-text
					class="page-number"
					autocomplete="off"
					autocorrect="off"
					type="text"
					label="${this.localize('page_number_title', {pageNumber: this.pageNumber, maxPageNumber: this.maxPageNumber})}"
					label-hidden
					value="${this.pageNumber}"
					@blur="${this._submitPageNumber}"
					@keydown="${this._handleKeydown}"
				></d2l-input-text>
				<!-- Note: this uses a division slash rather than a regular slash -->
				<!-- a11y note: setting aria-hidden to true because it's covered by the previous element -->
				<span class="page-max" aria-hidden="true">∕ ${this.maxPageNumber}</span>
				<d2l-button-icon icon="tier1:chevron-right" @click="${this._navToNextPage}" text="${this.localize('page_next')}" ?disabled=${this.disableNextPageButton()}></d2l-button-icon>
			</div>

			${this.showItemCountSelect ? html`
				<div class="pagination-container">
					<select
						aria-label="${this.localize('page_size_title')}"
						title="${this.localize('page_size_title')}"
						class="d2l-input-select"
						@change="${this._pageCounterChange}"
					>
						${this.itemCountOptions.map(item => html`
							<option ?selected="${this.selectedCountOption === item}" value="${item}">${this.localize('page_size_option', 'count', item)}</option>
						`)}
					</select>
				</div>
			` : null }
		`;
	}
}
customElements.define('d2l-labs-pagination', Pagination);
