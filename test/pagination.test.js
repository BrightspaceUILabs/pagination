import '../pagination';

import {expect, fixture, html} from '@open-wc/testing';
import {runConstructor} from '@brightspace-ui/core/tools/constructor-test-helper';

describe('pagination', () => {
	describe('accessibility', () => {
		it('should pass all axe tests if no options are passed', async() => {
			const el = await fixture(html`<d2l-labs-pagination></d2l-labs-pagination>`);
			await el.updateComplete;
			expect(el).to.be.accessible();
		});

		it('should pass all axe tests if all options are passed', async() => {
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
});
