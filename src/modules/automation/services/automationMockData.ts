import { AutomationScriptExtended, FailureScenario } from '../types';

export const mockFailureScenarios: Record<string, FailureScenario> = {
  member_export_toggle_drift: {
    id: 'scen-member-export-toggle',
    type: 'locator_drift',
    title: 'Toggle Switch Locator Drift in Member Policy Settings',
    description: 'In Cloud Admin Release v3.4, the toggle button ID `#toggle-export-data` was updated to accessible test identifier `[data-testid="member-export-toggle"]`.',
    failedStepIndex: 2,
    brokenLocator: `driver.findElement(By.id("toggle-export-data"))`,
    healedLocator: `driver.findElement(By.cssSelector("[data-testid='member-export-toggle']"))`,
    failureMessage: `NoSuchElementException: Unable to locate element with selector: By.id("toggle-export-data")\n  Target closed after 5000ms timeout during Step: 'Then the toggle for "Enable member to export data" should be "ON"'`,
    plainEnglishExplanation: `The data export toggle switch was rewritten in the Cloud Console v3.4 release. The legacy ID 'toggle-export-data' was replaced with 'data-testid="member-export-toggle"'.`,
    rootCauseAnalysis: `DOM Mutation in Cloud Admin Console (v3.4.0). The toggle switch component was refactored into a custom accessible switch with 'data-testid="member-export-toggle"' and ARIA state 'aria-checked="true"'.`,
    candidates: [
      {
        selector: `driver.findElement(By.cssSelector("[data-testid='member-export-toggle']"))`,
        strategy: 'data-testid',
        confidence: 98,
        isRecommended: true,
        rationale: 'Exact test-id match on member permission toggle switch in active DOM tree.',
      },
      {
        selector: `driver.findElement(By.xpath("//span[contains(text(), 'Enable member to export')]/following-sibling::button"))`,
        strategy: 'semantic-text',
        confidence: 90,
        isRecommended: false,
        rationale: 'Relative XPath based on adjacent label text; resilient to CSS styling changes.',
      },
      {
        selector: `driver.findElement(By.cssSelector(".member-settings-card >> .switch-toggle"))`,
        strategy: 'css-path',
        confidence: 78,
        isRecommended: false,
        rationale: 'CSS ancestor hierarchy match; lower score due to potential styling refactors.',
      },
    ],
    domSnapshotBefore: `<div class="setting-item">
  <span>Enable member to export data to local storage</span>
  <input id="toggle-export-data" type="checkbox" checked />
</div>`,
    domSnapshotAfter: `<div class="setting-item" data-category="permissions">
  <label for="export-toggle">Enable member to export data to local storage</label>
  <button id="export-toggle" data-testid="member-export-toggle" role="switch" aria-checked="true" class="switch-toggle active">
    <span class="slider round"></span>
  </button>
</div>`,
  },

  mfa_button_drift: {
    id: 'scen-mfa-drift',
    type: 'locator_drift',
    title: 'Submit Button ID Replaced with Data-TestID',
    description: 'Frontend release changed `<button id="btn-mfa-submit">` to `<button data-testid="mfa-auth-submit">` in the MFA challenge modal.',
    failedStepIndex: 2,
    brokenLocator: `page.locator('button#btn-mfa-submit')`,
    healedLocator: `page.locator('button[data-testid="mfa-auth-submit"]')`,
    failureMessage: `Error: locator.click: Target closed\nwaiting for locator('button#btn-mfa-submit')\nlocator resolved to 0 elements (timeout 5000ms exceeded)`,
    plainEnglishExplanation: `The submit button ID was replaced with a modern data-testid attribute in the latest web release.`,
    rootCauseAnalysis: `DOM Mutation Detected in AuthModule v2.4.1. The submit element's ID attribute 'btn-mfa-submit' was deprecated in favor of data-testid attribute 'mfa-auth-submit'.`,
    candidates: [
      {
        selector: `page.locator('button[data-testid="mfa-auth-submit"]')`,
        strategy: 'data-testid',
        confidence: 98,
        isRecommended: true,
        rationale: 'Exact test-id match on identical interactive element in current DOM tree.',
      },
      {
        selector: `page.getByRole('button', { name: 'Verify & Confirm Transfer' })`,
        strategy: 'aria-role',
        confidence: 91,
        isRecommended: false,
        rationale: 'Accessible role and button label match with strong semantic stability.',
      },
    ],
    domSnapshotBefore: `<button id="btn-mfa-submit" class="btn btn-primary">Submit Code</button>`,
    domSnapshotAfter: `<button data-testid="mfa-auth-submit" class="btn-verix-primary" role="button" aria-label="Verify & Confirm Transfer">Verify & Confirm Transfer</button>`,
  }
};

export const initialAutomationScripts: AutomationScriptExtended[] = [
  {
    id: 'auto-cloud204',
    projectId: 'proj-1',
    testCaseId: 'tc-201',
    storyKey: 'CLOUD-204',
    storyTitle: 'Workspace Admin Data Export & PII Masking Governance Policy',
    testCaseKey: 'TC-201',
    testCaseTitle: 'Verify Workspace Admin can enable local data export toggle for team member',
    featureTitle: 'CLOUD-204 - Workspace Admin Data Export & PII Masking Governance Policy',
    featureTags: ['@CLOUD204', '@admin', '@cloud', '@privacy', '@security', '@compliance', '@run'],
    folderCategory: 'Cloud Governance',
    name: 'CLOUD204_Data_Export_Policy.feature',
    framework: 'Playwright',
    repoPath: 'src/test/resources/features/CloudGovernance/CLOUD204_Data_Export_Policy.feature',
    status: 'Flaky',
    lastRunStatus: 'Failed',
    lastExecutedAt: '2026-08-30T09:14:00Z',
    executionCount: 12,
    lastExecutionDuration: 4.6,
    failureScenario: mockFailureScenarios.member_export_toggle_drift,
    gherkinContent: `@CLOUD204 @admin @cloud @privacy @security @compliance @run
Feature: CLOUD-204 - Workspace Admin Data Export & PII Masking Governance Policy

  @CLOUD204_export_policy
  Scenario Outline: <Testcase> - Organization Admin configures data export and privacy policy toggles for Team Member
    Given that the "<adminUserRole>" is logged in to Cloud Admin Console and launch Policy Utility Application through chrome "<adminUser>"
    When user selects member "<targetMember>" from the select team member dropdown
    Then the toggle for "Enable member to export data to local storage" should be "ON"
    And the toggle for "Enable cloud backup synchronization" should be "ON"
    And the toggle for "Enable audit logging for sensitive assets" should be "ON"
    When User turn OFF the toggle for "Enable member to export data to local storage"
    Then the "View/Edit Member Permissions" page should be displayed
    Then the user is logged out of the application

  @qa3
  Examples:
    | Testcase | adminUserRole | adminUser | targetMemberRole | targetMember |
    | TC_201   | CloudAdmin    | adminUser | DataAnalystRole  | analystUser  |`,
    pageObjectClass: `// Page Object Model: MemberPermissionsPage.java
package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class MemberPermissionsPage {
  private WebDriver driver;

  // ⚠️ BROKEN SELECTOR: ID deprecated in Cloud v3.4 release
  private By exportToggle = By.id("toggle-export-data");
  private By memberDropdown = By.id("select-member-dropdown");
  private By saveSettingsBtn = By.cssSelector("[data-testid='save-settings']");

  public MemberPermissionsPage(WebDriver driver) {
    this.driver = driver;
  }

  public void selectMember(String memberName) {
    driver.findElement(memberDropdown).sendKeys(memberName);
  }

  public boolean isExportToggleOn() {
    WebElement toggle = driver.findElement(exportToggle);
    return toggle.isSelected() || toggle.getAttribute("class").contains("active");
  }

  public void toggleExportData() {
    driver.findElement(exportToggle).click();
  }
}`,
    healedPageObjectClass: `// Page Object Model: MemberPermissionsPage.java (AI Repaired)
package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class MemberPermissionsPage {
  private WebDriver driver;

  // ✨ HEALED SELECTOR: Repaired with 98% AI Confidence
  private By exportToggle = By.cssSelector("[data-testid='member-export-toggle']");
  private By memberDropdown = By.id("select-member-dropdown");
  private By saveSettingsBtn = By.cssSelector("[data-testid='save-settings']");

  public MemberPermissionsPage(WebDriver driver) {
    this.driver = driver;
  }

  public void selectMember(String memberName) {
    driver.findElement(memberDropdown).sendKeys(memberName);
  }

  public boolean isExportToggleOn() {
    WebElement toggle = driver.findElement(exportToggle);
    return toggle.getAttribute("aria-checked").equals("true") || toggle.getAttribute("class").contains("active");
  }

  public void toggleExportData() {
    driver.findElement(exportToggle).click();
  }
}`,
    steps: [
      {
        stepNumber: 1,
        keyword: 'Given',
        title: 'Given that CloudAdmin is logged in to Admin Console',
        action: 'Authenticate CloudAdmin and open Policy Utility',
        locator: `driver.get("https://admin.cloud.enterprise.internal/policies")`,
        expectedResult: 'Cloud Admin Console permissions dashboard loaded',
        status: 'passed',
        durationMs: 380,
        uiTargetName: 'Admin Portal'
      },
      {
        stepNumber: 2,
        keyword: 'When',
        title: 'When user selects member from the dropdown',
        action: 'Choose member "Sarah Jenkins (Data Analyst)" from select member dropdown',
        locator: `driver.findElement(By.id("select-member-dropdown"))`,
        expectedResult: 'Member permissions policy panel populated',
        status: 'passed',
        durationMs: 310,
        uiTargetName: 'Member Selector'
      },
      {
        stepNumber: 3,
        keyword: 'Then',
        title: 'Then toggle for "Enable member to export data" should be "ON"',
        action: 'Assert export data toggle state is ON',
        locator: `driver.findElement(By.id("toggle-export-data"))`,
        healedLocator: `driver.findElement(By.cssSelector("[data-testid='member-export-toggle']"))`,
        expectedResult: 'Toggle switch in active ON position (aria-checked=true)',
        status: 'failed',
        durationMs: 5012,
        errorLog: `NoSuchElementException: Unable to locate element By.id("toggle-export-data")`,
        uiTargetName: 'Export Data Toggle'
      },
      {
        stepNumber: 4,
        keyword: 'When',
        title: 'When User turn OFF the toggle for export data',
        action: 'Click toggle button to switch state to OFF',
        locator: `driver.findElement(By.cssSelector("[data-testid='member-export-toggle']"))`,
        expectedResult: 'Toggle state changes to OFF',
        status: 'pending',
        durationMs: 0,
        uiTargetName: 'Toggle Action'
      },
      {
        stepNumber: 5,
        keyword: 'Then',
        title: 'Then the user is logged out of the application',
        action: 'Perform clean signout and verify session termination',
        locator: `driver.findElement(By.id("btn-logout"))`,
        expectedResult: 'Session ended and login page displayed',
        status: 'pending',
        durationMs: 0,
        uiTargetName: 'Logout'
      }
    ],
    code: `@CLOUD204 @admin @cloud @privacy @security @compliance @run
Feature: CLOUD-204 - Workspace Admin Data Export & PII Masking Governance Policy

  @CLOUD204_export_policy
  Scenario Outline: <Testcase> - Organization Admin configures data export and privacy policy toggles for Team Member
    Given that the "<adminUserRole>" is logged in to Cloud Admin Console and launch Policy Utility Application through chrome "<adminUser>"
    When user selects member "<targetMember>" from the select team member dropdown
    Then the toggle for "Enable member to export data to local storage" should be "ON"
    And the toggle for "Enable cloud backup synchronization" should be "ON"
    And the toggle for "Enable audit logging for sensitive assets" should be "ON"
    When User turn OFF the toggle for "Enable member to export data to local storage"
    Then the "View/Edit Member Permissions" page should be displayed
    Then the user is logged out of the application

  @qa3
  Examples:
    | Testcase | adminUserRole | adminUser | targetMemberRole | targetMember |
    | TC_201   | CloudAdmin    | adminUser | DataAnalystRole  | analystUser  |`,
    originalCode: `driver.findElement(By.id("toggle-export-data")).click();`,
    healedCode: `driver.findElement(By.cssSelector("[data-testid='member-export-toggle']")).click();`
  },
  {
    id: 'auto-dbank104',
    projectId: 'proj-1',
    testCaseId: 'tc-2',
    storyKey: 'DBANK-104',
    storyTitle: 'International Wire Transfer with Multi-Factor Authentication',
    testCaseKey: 'TC-302',
    testCaseTitle: 'High-Value Wire Transaction MFA Challenge Flow',
    featureTitle: 'DBANK-104 - Wire Transfer Biometric MFA Approval Flow',
    featureTags: ['@DBANK104', '@payments', '@mfa', '@security'],
    folderCategory: 'Payments & Transfers',
    name: 'DBANK104_Wire_Transfer_MFA.feature',
    framework: 'Playwright',
    repoPath: 'src/test/resources/features/Payments/DBANK104_Wire_Transfer_MFA.feature',
    status: 'Active',
    lastRunStatus: 'Passed',
    lastExecutedAt: '2026-08-30T09:12:00Z',
    executionCount: 24,
    lastExecutionDuration: 3.4,
    gherkinContent: `@DBANK104 @payments @mfa @security
Feature: DBANK-104 - High-Value Wire Transfer with Multi-Factor Authentication

  Scenario: Verify wire transfer exceeds threshold triggers MFA challenge
    Given verified customer is logged into digital banking portal
    When customer initiates wire transfer of "$5,000" USD to international beneficiary
    Then MFA security challenge modal should prompt for 6-digit TOTP token
    When customer enters valid OTP code "849201" and confirms authorization
    Then transaction confirmation receipt should display status "APPROVED"`,
    pageObjectClass: `// Page Object Model: WireTransferPage.ts
export class WireTransferPage {
  constructor(private page: Page) {}

  amountInput = () => this.page.locator('input#transfer-amount');
  otpInput = () => this.page.locator('input#otp-input');
  submitAuthBtn = () => this.page.locator('button[data-testid="mfa-auth-submit"]');
  receiptBadge = () => this.page.locator('.receipt-status-badge');

  async initiateTransfer(amount: string) {
    await this.amountInput().fill(amount);
  }
}`,
    steps: [
      {
        stepNumber: 1,
        keyword: 'Given',
        title: 'Given customer is logged into banking portal',
        action: 'Authenticate customer and load wire transfer view',
        locator: `page.goto('/transfers/wire')`,
        expectedResult: 'Wire transfer form loaded',
        status: 'passed',
        durationMs: 280,
        uiTargetName: 'Wire Transfer Portal'
      },
      {
        stepNumber: 2,
        keyword: 'When',
        title: 'When customer initiates transfer of $5,000 USD',
        action: 'Fill transfer amount and select beneficiary',
        locator: `page.locator('input#transfer-amount').fill('5000')`,
        expectedResult: 'MFA trigger threshold evaluated',
        status: 'passed',
        durationMs: 320,
        uiTargetName: 'Amount Input'
      },
      {
        stepNumber: 3,
        keyword: 'Then',
        title: 'Then MFA modal should prompt for 6-digit OTP token',
        action: 'Input OTP code 849201 and click verify',
        locator: `page.locator('button[data-testid="mfa-auth-submit"]')`,
        expectedResult: 'MFA approved and transaction processed',
        status: 'passed',
        durationMs: 410,
        uiTargetName: 'MFA Verification'
      }
    ],
    code: `@DBANK104 @payments @mfa @security
Feature: DBANK-104 - High-Value Wire Transfer with Multi-Factor Authentication

  Scenario: Verify wire transfer exceeds threshold triggers MFA challenge
    Given verified customer is logged into digital banking portal
    When customer initiates wire transfer of "$5,000" USD to international beneficiary
    Then MFA security challenge modal should prompt for 6-digit TOTP token
    When customer enters valid OTP code "849201" and confirms authorization
    Then transaction confirmation receipt should display status "APPROVED"`
  },
  {
    id: 'auto-dbank108',
    projectId: 'proj-1',
    testCaseId: 'tc-3',
    storyKey: 'DBANK-108',
    storyTitle: 'Instant Virtual Card Generation & Spending Limits',
    testCaseKey: 'TC-308',
    testCaseTitle: 'Virtual Card Instant Lock & Spending Threshold',
    featureTitle: 'DBANK-108 - Virtual Card Management and Instant Freeze',
    featureTags: ['@DBANK108', '@cards', '@limits'],
    folderCategory: 'Cards & Limits',
    name: 'DBANK108_Virtual_Card_Freeze.feature',
    framework: 'Cypress',
    repoPath: 'src/test/resources/features/Cards/DBANK108_Virtual_Card_Freeze.feature',
    status: 'Healed',
    lastRunStatus: 'Passed',
    lastExecutedAt: '2026-08-30T08:45:00Z',
    executionCount: 16,
    lastExecutionDuration: 2.7,
    healedAt: '2026-08-30T08:44:12Z',
    selfHealingLogs: [
      {
        healedAt: '2026-08-30T08:44:12Z',
        oldSelector: `button.btn-freeze-toggle`,
        newSelector: `button[data-testid="card-lock-action"]`,
        confidence: 96,
      }
    ],
    gherkinContent: `@DBANK108 @cards @limits
Feature: DBANK-108 - Virtual Card Management and Instant Freeze

  Scenario: User locks virtual card to block unauthorized transactions
    Given customer navigates to Virtual Cards wallet
    When customer clicks toggle for "Lock Virtual Card" on card "VISA-4091"
    Then the card status should immediately transition to "FROZEN"
    And real-time POS authorization sandbox should reject pending charges`,
    pageObjectClass: `// Page Object Model: VirtualCardsPage.ts
export class VirtualCardsPage {
  cardChip = () => cy.get('.virtual-card-chip');
  // Healed locator (96% confidence)
  lockButton = () => cy.get('button[data-testid="card-lock-action"]');
  statusBadge = () => cy.get('.card-status-badge');
}`,
    steps: [
      {
        stepNumber: 1,
        keyword: 'Given',
        title: 'Given customer navigates to Virtual Cards wallet',
        action: 'Open cards dashboard view',
        locator: `cy.visit('/cards/virtual')`,
        expectedResult: 'Cards wallet rendered',
        status: 'passed',
        durationMs: 250,
        uiTargetName: 'Cards Dashboard'
      },
      {
        stepNumber: 2,
        keyword: 'When',
        title: 'When customer clicks toggle for "Lock Virtual Card"',
        action: 'Toggle card lock switch',
        locator: `cy.get('button[data-testid="card-lock-action"]')`,
        expectedResult: 'Card status updated to FROZEN',
        status: 'passed',
        durationMs: 380,
        uiTargetName: 'Card Lock Action'
      }
    ],
    code: `@DBANK108 @cards @limits
Feature: DBANK-108 - Virtual Card Management and Instant Freeze

  Scenario: User locks virtual card to block unauthorized transactions
    Given customer navigates to Virtual Cards wallet
    When customer clicks toggle for "Lock Virtual Card" on card "VISA-4091"
    Then the card status should immediately transition to "FROZEN"
    And real-time POS authorization sandbox should reject pending charges`
  }
];
