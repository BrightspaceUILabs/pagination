import '../pagination';

import {expect, fixture, html, oneEvent} from '@open-wc/testing';
import {runConstructor} from '@brightspace-ui/core/tools/constructor-test-helper';

describe('pagination', () => {
	describe('accessibility', () => {
		it('should pass all axe tests (basic)', async() => {
			const el = await fixture(html`<d2l-labs-pagination></d2l-labs-pagination>`);
			await el.updateComplete;
			expect(el).to.be.accessible();
		});

		it('should pass all axe tests (full)', async() => {
			const el = await fixture(
				html`<d2l-labs-pagination
					pageNumber="1"
					maxPageNumber="6"
					showItemCountSelect
					itemCountOptions="[10, 20, 50, 100]"
					selectedCountOption="20"
				>
				</d2l-labs-pagination>`
			);
			await el.updateComplete;
			expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-labs-pagination');
		});
	});

	describe('render', () => {
		it('should render page number and max page number correctly', async() => {
			const el = await fixture(html`<d2l-labs-pagination pageNumber="3" maxPageNumber="8"></d2l-labs-pagination>`);
			const pageInput = el.shadowRoot.querySelector('d2l-input-text');
			const maxPageIndicator = el.shadowRoot.querySelector('span.page-max');
			expect(pageInput.value).to.equal('3');
			expect(maxPageIndicator.innerText).to.equal('∕ 8'); // this isn't a regular slash

			// by default, it should not render the page size selector
			const pageSizeSelector = el.shadowRoot.querySelector('select');
			expect(pageSizeSelector).to.be.null;
		});

		it('should render page size selector with correct options and initial selection', async() => {
			const el = await fixture(html`
				<d2l-labs-pagination
					pageNumber="3"
					maxPageNumber="8"
					showItemCountSelect
					itemCountOptions="[2,5,37,159]"
					selectedCountOption="37"
				></d2l-labs-pagination>`
			);
			const pageNumberInput = el.shadowRoot.querySelector('d2l-input-text');
			const maxPageIndicator = el.shadowRoot.querySelector('span.page-max');
			expect(pageNumberInput.value).to.equal('3');
			expect(maxPageIndicator.innerText).to.equal('∕ 8'); // this isn't a regular slash

			const pageSizeSelector = el.shadowRoot.querySelector('select');
			expect(pageSizeSelector).to.not.be.null;
			const pageSizeOptions = Array.from(pageSizeSelector.querySelectorAll('option'));
			expect(pageSizeOptions.length).to.equal(4);
			['2', '5', '37', '159'].forEach((value, idx) => {
				expect(pageSizeOptions[idx].value).to.equal(value);
			});

			const pageSizeOptionsSelected = Array.from(pageSizeSelector.querySelectorAll('option[selected]'));
			expect(pageSizeOptionsSelected.length).to.equal(1);
			expect(pageSizeOptionsSelected[0].value).to.equal('37');
		});

		describe('disable arrows if the page they would go to is invalid', () => {
			async function getPaginationEl(pageNumber, maxPages, dir) {
				const el = await fixture(
					html`<d2l-labs-pagination
						pageNumber="${pageNumber}"
						maxPageNumber="${maxPages}"
						dir="${dir}"
					></d2l-labs-pagination>`
				);
				const leftButton = el.shadowRoot.querySelector('d2l-button-icon[icon="d2l-tier1:chevron-left"]');
				const rightButton = el.shadowRoot.querySelector('d2l-button-icon[icon="d2l-tier1:chevron-right"]');

				return {el, leftButton, rightButton};
			}

			describe('ltr', () => {
				it('should disable left button (ltr)', async() => {
					const {leftButton, rightButton} = await getPaginationEl(1, 5, 'ltr');
					expect(leftButton.disabled).to.be.true;
					expect(rightButton.disabled).to.be.false;
				});

				it('should disable right button (ltr)', async() => {
					const {leftButton, rightButton} = await getPaginationEl(5, 5, 'ltr');
					expect(leftButton.disabled).to.be.false;
					expect(rightButton.disabled).to.be.true;
				});

				it('should disable both buttons if there is only 1 page', async() => {
					const {leftButton, rightButton} = await getPaginationEl(1, 1, 'ltr');
					expect(leftButton.disabled).to.be.true;
					expect(rightButton.disabled).to.be.true;
				});

				it('should disable both buttons if there are 0 pages', async() => {
					const {leftButton, rightButton} = await getPaginationEl(0, 0, 'ltr');
					expect(leftButton.disabled).to.be.true;
					expect(rightButton.disabled).to.be.true;
				});

				it('should disable neither button if current page is not first or last', async() => {
					const {leftButton, rightButton} = await getPaginationEl(2, 3, 'ltr');
					expect(leftButton.disabled).to.be.false;
					expect(rightButton.disabled).to.be.false;
				});
			});

			describe('rtl', () => {
				// in rtl, the "left" button is actually on the right side and mirrored so it looks like a right arrow
				// so the "left" button is still the one that is disabled, even though it's really the right button
				// (and vice-versa for the "right" button, which is actually on the left)

				it('should disable left button (rtl)', async() => {
					const {leftButton, rightButton} = await getPaginationEl(1, 5, 'rtl');
					expect(leftButton.disabled).to.be.true;
					expect(rightButton.disabled).to.be.false;
				});

				it('should disable right button (rtl)', async() => {
					const {leftButton, rightButton} = await getPaginationEl(5, 5, 'rtl');
					expect(leftButton.disabled).to.be.false;
					expect(rightButton.disabled).to.be.true;
				});

				it('should disable both buttons if there is only 1 page', async() => {
					const {leftButton, rightButton} = await getPaginationEl(1, 1, 'rtl');
					expect(leftButton.disabled).to.be.true;
					expect(rightButton.disabled).to.be.true;
				});

				it('should disable both buttons if there are 0 pages', async() => {
					const {leftButton, rightButton} = await getPaginationEl(0, 0, 'rtl');
					expect(leftButton.disabled).to.be.true;
					expect(rightButton.disabled).to.be.true;
				});

				it('should disable neither button if current page is not first or last', async() => {
					const {leftButton, rightButton} = await getPaginationEl(2, 3, 'rtl');
					expect(leftButton.disabled).to.be.false;
					expect(rightButton.disabled).to.be.false;
				});
			});
		});
	});

	describe('eventing', () => {
		describe('valid page change event', () => {
			let el;
			beforeEach(async() => {
				el = await fixture(
					html`<d2l-labs-pagination pageNumber="2" maxPageNumber="3"></d2l-labs-pagination>`
				);
			});

			it('should fire when arrows are clickable and have been clicked', async() => {
				const leftButton = el.shadowRoot.querySelector('d2l-button-icon[icon="d2l-tier1:chevron-left"]');
				const rightButton = el.shadowRoot.querySelector('d2l-button-icon[icon="d2l-tier1:chevron-right"]');

				let listener = oneEvent(el, 'pagination-page-change');
				leftButton.click();
				let event = await listener;
				expect(event.detail.page).to.equal(1);

				// reset listener
				listener = oneEvent(el, 'pagination-page-change');
				rightButton.click();
				event = await listener;
				expect(event.detail.page).to.equal(3);
			});

			it('should fire when new page number is valid and user hits Enter', async() => {
				const listener = oneEvent(el, 'pagination-page-change');

				const pageNumberInput = el.shadowRoot.querySelector('d2l-input-text');
				pageNumberInput.value = '3';
				pageNumberInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

				const event = await listener;
				expect(event.detail.page).to.equal('3');
			});

			it('should fire when new page number is valid and page input element loses focus', async() => {
				const listener = oneEvent(el, 'pagination-page-change');

				const pageNumberInput = el.shadowRoot.querySelector('d2l-input-text');
				await pageNumberInput.updateComplete;
				const inputEl = pageNumberInput.shadowRoot.querySelector('input');
				inputEl.focus();
				pageNumberInput.value = '3';
				inputEl.blur();

				const event = await listener;
				expect(event.detail.page).to.equal('3');
			});
		});

		describe('invalid page number', () => {
			// Note: these tests rely on the assumption that if events will be fired, they will be fired within 100 ms
			const timeout = 100;
			let el;

			// returns either the event or the returnValIfTimeout, whichever is resolved first
			async function verifyEventTimeout(listener, returnValIfTimeout) {
				return await Promise.race([
					listener,
					new Promise(resolve => setTimeout(() => resolve(returnValIfTimeout), timeout))
				]);
			}

			beforeEach(async() => {
				el = await fixture(
					html`<d2l-labs-pagination pageNumber="4" maxPageNumber="5"></d2l-labs-pagination>`
				);
			});

			it('should fire the event before the timeout (sanity check - ensure verifyEventTimeout is working)', async() => {
				const listener = oneEvent(el, 'pagination-page-change');
				const pageNumberInput = el.shadowRoot.querySelector('d2l-input-text');
				pageNumberInput.value = '5';
				pageNumberInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

				const result = await verifyEventTimeout(listener, 'no event fired');
				expect(result).not.to.equal('no event fired');
				expect(result.detail.page).to.equal('5');
			});

			it('should not fire when new page number is an invalid page number', async() => {
				let listener = oneEvent(el, 'pagination-page-change');
				const pageNumberInput = el.shadowRoot.querySelector('d2l-input-text');
				pageNumberInput.value = '0';
				pageNumberInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

				let result = await verifyEventTimeout(listener, 'no event fired');
				expect(result).to.equal('no event fired');

				listener = oneEvent(el, 'pagination-page-change');
				pageNumberInput.value = '7';
				pageNumberInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

				result = await verifyEventTimeout(listener, 'no event fired');
				expect(result).to.equal('no event fired');
			});

			it('should not fire when new page number is not a number', async() => {
				const listener = oneEvent(el, 'pagination-page-change');
				const pageNumberInput = el.shadowRoot.querySelector('d2l-input-text');
				pageNumberInput.value = 'foo';
				pageNumberInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

				const result = await verifyEventTimeout(listener, 'no event fired');
				expect(result).to.equal('no event fired');
			});

			it('should not fire in response to keypresses that are not Enter', async() => {
				const listener = oneEvent(el, 'pagination-page-change');
				const pageNumberInput = el.shadowRoot.querySelector('d2l-input-text');
				pageNumberInput.value = '3';
				pageNumberInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space' }));

				const result = await verifyEventTimeout(listener, 'no event fired');
				expect(result).to.equal('no event fired');
			});
		});

		describe('page size change', () => {
			it('should fire when the page size selector value changes', async() => {
				const el = await fixture(
					html`<d2l-labs-pagination
						pageNumber="2"
						maxPageNumber="3"
						showItemCountSelect
						itemCountOptions="[10, 20, 50, 100]"
						selectedCountOption="20"
					></d2l-labs-pagination>`
				);

				const listener = oneEvent(el, 'pagination-item-counter-change');
				const pageSizeSelector = el.shadowRoot.querySelector('select.d2l-input-select');
				pageSizeSelector.value = '10';
				pageSizeSelector.dispatchEvent(new Event('change'));

				const event = await listener;
				expect(event.detail.itemCount).to.equal('10');
			});
		});
	});
});
