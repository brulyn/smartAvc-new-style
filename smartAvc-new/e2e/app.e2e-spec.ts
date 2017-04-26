import { SmartavcAdminPage } from './app.po';

describe('smartavc-admin App', () => {
  let page: SmartavcAdminPage;

  beforeEach(() => {
    page = new SmartavcAdminPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
