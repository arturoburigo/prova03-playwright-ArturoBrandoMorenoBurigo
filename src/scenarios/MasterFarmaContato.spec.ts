import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import MasterFarmaPage from '../support/pages/MasterFarmaPage';

test.describe('MasterFarma - Testes Smart - Formulário de Contato', () => {
  let masterFarmaPage: MasterFarmaPage;

  test.beforeEach(async ({ page }) => {
    masterFarmaPage = new MasterFarmaPage(page);
    await masterFarmaPage.navigate();
  });

  test('deve preencher e enviar formulário completo com dados válidos', async ({ page }) => {
    // Arrange - preparar dados de teste com faker
    const contactData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number('(##) #####-####'),
      department: 'Comercial',
      message: faker.lorem.paragraph()
    };

    // Act - preencher e enviar formulário
    await masterFarmaPage.fillContactForm(contactData);
    await masterFarmaPage.acceptPrivacyPolicy();
    await masterFarmaPage.submitForm();

    // Assert - validar sucesso
    await masterFarmaPage.validateSuccessMessage();
  });

  test('deve validar comportamento do checkbox de privacidade', async ({ page }) => {
    // Arrange - preparar dados de teste
    const contactData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number('(##) #####-####'),
      department: 'Administrativo',
      message: 'Teste de validação do checkbox de privacidade'
    };

    // Act - preencher campos do formulário
    await masterFarmaPage.fillContactForm(contactData);

    // Assert - verificar que checkbox de privacidade não está marcado
    const isChecked = await masterFarmaPage.isPrivacyCheckboxChecked();
    expect(isChecked).toBe(false);

    // Act - aceitar política de privacidade
    await masterFarmaPage.acceptPrivacyPolicy();

    // Assert - verificar que checkbox foi marcado
    const isCheckedNow = await masterFarmaPage.isPrivacyCheckboxChecked();
    expect(isCheckedNow).toBe(true);

    // Act - enviar formulário
    await masterFarmaPage.submitForm();

    // Assert - validar que foi enviado com sucesso
    await masterFarmaPage.validateSuccessMessage();
  });

  test('deve testar diferentes departamentos e enviar formulário', async ({ page }) => {
    // Arrange - preparar dados base
    const contactData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number('(##) #####-####'),
      department: 'Marketing',
      message: 'Teste de seleção de departamento'
    };

    // Act - preencher todos os campos incluindo departamento
    await page.locator('#formContato_nome').fill(contactData.name);
    await page.locator('#formContato_email').fill(contactData.email);
    await page.locator('#formContato_telefone').fill(contactData.phone);

    // Act - selecionar departamento usando método nativo do Playwright
    await page.locator('#formContato_departamento').selectOption('Marketing');

    // Assert - verificar que Marketing foi selecionado
    const selectedValue = await page.locator('#formContato_departamento').inputValue();
    expect(selectedValue).toBe('Marketing');

    // Act - preencher mensagem
    await page.locator('#formContato_mensagem').fill(contactData.message);

    // Act - marcar checkbox de privacidade
    await page.locator('#termo').check();

    // Assert - verificar que o checkbox está marcado
    const isChecked = await page.locator('#termo').isChecked();
    expect(isChecked).toBe(true);

    // Act - enviar formulário
    await page.locator('#btnContato').click();

    // Assert - validar mensagem de sucesso (form cleared)
    await page.waitForTimeout(2000);
    await expect(page.locator('#formContato_nome')).toHaveValue('', { timeout: 5000 });
  });
});

