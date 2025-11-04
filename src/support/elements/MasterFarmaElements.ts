import { Locator, Page } from '@playwright/test';
import BaseElements from './BaseElements';

export default class MasterFarmaElements extends BaseElements {
  constructor(readonly page: Page) {
    super(page);
    this.page = page;
  }

  getNameField(): Locator {
    return this.page.locator('#formContato_nome');
  }

  getEmailField(): Locator {
    return this.page.locator('#formContato_email');
  }

  getPhoneField(): Locator {
    return this.page.locator('#formContato_telefone');
  }

  getDepartmentSelect(): Locator {
    return this.page.locator('#formContato_departamento');
  }

  getMessageField(): Locator {
    return this.page.locator('#formContato_mensagem');
  }

  getPrivacyCheckbox(): Locator {
    return this.page.locator('#termo');
  }

  getSendButton(): Locator {
    return this.page.locator('#btnContato');
  }

  getSuccessMessage(): Locator {
    return this.page.locator('.wpcf7-response-output');
  }

  getValidationMessage(): Locator {
    return this.page.locator('.wpcf7-not-valid-tip');
  }

  getFormElement(): Locator {
    return this.page.locator('form.wpcf7-form');
  }
}

