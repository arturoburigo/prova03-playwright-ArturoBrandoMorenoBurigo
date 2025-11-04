import { Page, expect } from '@playwright/test';
import MasterFarmaElements from '../elements/MasterFarmaElements';
import BasePage from './BasePage';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  department: string;
  message: string;
}

export default class MasterFarmaPage extends BasePage {
  readonly masterFarmaElements: MasterFarmaElements;

  constructor(readonly page: Page) {
    super(page);
    this.page = page;
    this.masterFarmaElements = new MasterFarmaElements(page);
  }

  async navigate(): Promise<void> {
    await this.page.goto('https://www.masterfarma.com.br/contato/');
    await this.page.waitForLoadState('networkidle');
  }

  async fillContactForm(data: ContactFormData): Promise<void> {
    await this.masterFarmaElements.getNameField().fill(data.name);
    await this.masterFarmaElements.getEmailField().fill(data.email);
    await this.masterFarmaElements.getPhoneField().fill(data.phone);
    await this.masterFarmaElements.getDepartmentSelect().selectOption(data.department);
    await this.masterFarmaElements.getMessageField().fill(data.message);
  }

  async acceptPrivacyPolicy(): Promise<void> {
    await this.masterFarmaElements.getPrivacyCheckbox().check();
  }

  async submitForm(): Promise<void> {
    await this.masterFarmaElements.getSendButton().click();
  }

  async selectDepartment(department: string): Promise<void> {
    await this.masterFarmaElements.getDepartmentSelect().selectOption(department);
  }

  async validateSuccessMessage(): Promise<void> {
    // Wait for form to be processed
    await this.page.waitForTimeout(2000);

    // Success is indicated by the form being cleared
    await expect(this.masterFarmaElements.getNameField()).toHaveValue('', {
      timeout: 5000
    });

    // Optionally check for success message if visible
    const successMessage = this.masterFarmaElements.getSuccessMessage();
    const isVisible = await successMessage.isVisible().catch(() => false);
    if (isVisible) {
      const messageText = await successMessage.textContent();
      expect(messageText).toContain('sucesso');
    }
  }

  async validateRequiredFields(): Promise<void> {
    const validationMessages = this.masterFarmaElements.getValidationMessage();
    await expect(validationMessages.first()).toBeVisible();
  }

  async isPrivacyCheckboxChecked(): Promise<boolean> {
    return await this.masterFarmaElements.getPrivacyCheckbox().isChecked();
  }

  async getSelectedDepartment(): Promise<string | null> {
    return await this.masterFarmaElements.getDepartmentSelect().inputValue();
  }
}

