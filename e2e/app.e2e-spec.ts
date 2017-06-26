import { NodepadPage } from './app.po';

describe('nodepad App', () => {
  let page: NodepadPage;

  beforeEach(() => {
    page = new NodepadPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
