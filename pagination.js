import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { Localizer } from './lang/localization.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';

class Pagination extends RtlMixin(Localizer(LitElement)) {

	static get properties() {
		return {
			pageNumber: { type: Number, attribute: 'page-number', reflect: true },
			maxPageNumber: { type: Number, attribute: 'max-page-number', reflect: true },
			showItemCountSelect : { type: Boolean, attribute: 'show-item-count-select', reflect: true },
			itemCountOptions : { type: Array, attribute: 'item-count-options' },
			selectedCountOption : { type: Number, attribute: 'selected-count-option', reflect: true },
		};
	}

	static get styles() {
		return [selectStyles, css`
			:host {
				align-content: center;
				align-items: center;
				display: flex;
				flex-direction: row;
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

			.d2l-pagination-container {
				display: block;
			}

			.d2l-page-selector-container {
				margin: 15px;
			}

			.d2l-page-selector-container > * {
				display: inline-flex;
			}

			.d2l-page-number {
				margin-left: 0.25rem;
				margin-right: 0.25rem;
				width: 4em;
			}

			.d2l-page-max-text {
				margin-right: 0.25rem;
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

	_disablePreviousPageButton() {
		return this.pageNumber <= 1;
	}

	_disableNextPageButton() {
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
			<div class="d2l-pagination-container d2l-page-selector-container">
				<d2l-button-icon icon="tier1:chevron-left" @click="${this._navToPreviousPage}" text="${this.localize('page_previous')}" ?disabled=${this._disablePreviousPageButton()}></d2l-button-icon>
				<d2l-input-text
					class="d2l-page-number"
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
				<!-- a11y note: setting aria-hidden to true because info here is covered by input element -->
				<span class="d2l-page-max-text" aria-hidden="true">∕ ${this.maxPageNumber}</span>
				<d2l-button-icon icon="tier1:chevron-right" @click="${this._navToNextPage}" text="${this.localize('page_next')}" ?disabled=${this._disableNextPageButton()}></d2l-button-icon>
			</div>

			${this.showItemCountSelect ? html`
				<div class="d2l-pagination-container">
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
