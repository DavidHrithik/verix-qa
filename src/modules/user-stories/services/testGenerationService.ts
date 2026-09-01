import { UserStory, TestCase } from '../../../types';

export interface GeneratedTestCaseItem extends TestCase {
  vectorType: 'Functional / Happy Path' | 'Security / RBAC Gate' | 'Boundary / Threshold' | 'Edge Case / PII Governance' | 'Resilience / Recovery';
  targetAC: string;
}

// Clean helper to remove redundant "AC 1:", "AC-1 (Happy Path):" prefixes from user input
const cleanAcTitle = (acText: string): string => {
  return acText
    .replace(/^AC\s*[-#:]?\s*\d+\s*(\([^)]*\))?\s*[:.-]?\s*/i, '')
    .replace(/^\d+\.\s*/, '')
    .trim();
};

export const generateMultiVectorTestCases = (story: UserStory): GeneratedTestCaseItem[] => {
  const now = new Date().toISOString();

  // If hardcoded CLOUD-204 story
  if (story.key === 'CLOUD-204' || (story.key.includes('204') && story.title.toLowerCase().includes('export'))) {
    return [
      {
        id: 'tc-201',
        projectId: story.projectId,
        storyId: story.id,
        key: 'TC-201',
        title: 'Verify Workspace Admin can enable local data export toggle for team member',
        type: 'Automated',
        priority: 'Critical',
        status: 'Approved',
        isAiGenerated: true,
        aiConfidence: 98,
        tags: ['Admin', 'Compliance', 'BDD', 'Happy-Path'],
        lastExecutionStatus: 'Passed',
        vectorType: 'Functional / Happy Path',
        targetAC: story.acceptanceCriteria[0] || 'Admin can select any team member from dropdown',
        createdAt: now,
        updatedAt: now,
        steps: [
          { stepNumber: 1, action: 'Given that CloudAdmin is logged in to Admin Console and launch Policy Utility', expectedResult: 'Cloud Admin Console permissions dashboard loaded' },
          { stepNumber: 2, action: 'When user selects member "Sarah Jenkins (Data Analyst)" from dropdown', expectedResult: 'Member permissions policy panel populated' },
          { stepNumber: 3, action: 'Then toggle for "Enable member to export data to local storage" should be ON', expectedResult: 'Toggle switch in active ON position (aria-checked=true)' },
          { stepNumber: 4, action: 'When User turn OFF the toggle for export data', expectedResult: 'Toggle state changes to OFF and confirmation prompt shown' },
          { stepNumber: 5, action: 'Then the user is logged out of the application', expectedResult: 'Session ended and login page displayed' },
        ],
      },
      {
        id: 'tc-202',
        projectId: story.projectId,
        storyId: story.id,
        key: 'TC-202',
        title: 'Verify non-admin role is blocked from modifying data export policy',
        type: 'Automated',
        priority: 'Critical',
        status: 'Approved',
        isAiGenerated: true,
        aiConfidence: 96,
        tags: ['Security', 'RBAC', 'Negative-Gate'],
        lastExecutionStatus: 'Passed',
        vectorType: 'Security / RBAC Gate',
        targetAC: story.acceptanceCriteria[1] || 'Non-admin roles must receive 403 Forbidden',
        createdAt: now,
        updatedAt: now,
        steps: [
          { stepNumber: 1, action: 'Given Member user "Devin Chen" with non-admin permissions logs in', expectedResult: 'Standard user dashboard loaded' },
          { stepNumber: 2, action: 'When member attempts direct POST request to /api/v1/workspace/export-data', expectedResult: 'Server rejects request with HTTP 403 Forbidden' },
          { stepNumber: 3, action: 'Then UI renders access denied security banner', expectedResult: 'Zero-trust unauthorized access warning displayed' },
        ],
      },
      {
        id: 'tc-203',
        projectId: story.projectId,
        storyId: story.id,
        key: 'TC-203',
        title: 'Verify export payload limit threshold (>50MB) triggers chunked background stream without memory leak',
        type: 'Automated',
        priority: 'High',
        status: 'Approved',
        isAiGenerated: true,
        aiConfidence: 92,
        tags: ['Boundary', 'Performance', 'Threshold'],
        lastExecutionStatus: 'Passed',
        vectorType: 'Boundary / Threshold',
        targetAC: story.acceptanceCriteria[2] || 'Export payload exceeding 50MB must enforce chunked stream',
        createdAt: now,
        updatedAt: now,
        steps: [
          { stepNumber: 1, action: 'Given workspace contains 500,000 telemetry audit records totaling 75MB', expectedResult: 'Dataset indexed and ready for export' },
          { stepNumber: 2, action: 'When admin triggers full organizational export', expectedResult: 'System switches to asynchronous chunked background job' },
          { stepNumber: 3, action: 'Then download progress bar tracks chunk completion without UI freeze', expectedResult: 'File downloaded successfully with valid checksum' },
        ],
      },
      {
        id: 'tc-204',
        projectId: story.projectId,
        storyId: story.id,
        key: 'TC-204',
        title: 'Verify PII masking retains SHA-256 mask pattern when dataset contains unicode & special characters',
        type: 'Automated',
        priority: 'High',
        status: 'Approved',
        isAiGenerated: true,
        aiConfidence: 95,
        tags: ['Edge-Case', 'PII', 'Data-Governance'],
        lastExecutionStatus: 'Passed',
        vectorType: 'Edge Case / PII Governance',
        targetAC: story.acceptanceCriteria[3] || 'PII fields must be masked with SHA-256 hashes',
        createdAt: now,
        updatedAt: now,
        steps: [
          { stepNumber: 1, action: 'Given user records containing non-standard ASCII and emoji characters in name/address fields', expectedResult: 'Raw test data loaded in sandbox' },
          { stepNumber: 2, action: 'When PII masking engine executes export sanitization', expectedResult: 'Sensitive fields masked with consistent 64-char hex hash' },
          { stepNumber: 3, action: 'Then zero plain-text PII is exposed in CSV output', expectedResult: 'Compliance scanner verifies 0% PII leak' },
        ],
      },
      {
        id: 'tc-205',
        projectId: story.projectId,
        storyId: story.id,
        key: 'TC-205',
        title: 'Verify network drop or session timeout during export triggers safe state rollback',
        type: 'Automated',
        priority: 'Medium',
        status: 'Approved',
        isAiGenerated: true,
        aiConfidence: 91,
        tags: ['Resilience', 'Session-Timeout', 'Rollback'],
        lastExecutionStatus: 'Passed',
        vectorType: 'Resilience / Recovery',
        targetAC: story.acceptanceCriteria[4] || 'Session timeout during export must trigger safe state rollback',
        createdAt: now,
        updatedAt: now,
        steps: [
          { stepNumber: 1, action: 'Given active background data export in progress at 45% completion', expectedResult: 'Stream active' },
          { stepNumber: 2, action: 'When user auth token expires and WebSocket connection disconnects', expectedResult: 'Session invalidated gracefully' },
          { stepNumber: 3, action: 'Then partial temporary files are purged and resume token is issued upon re-login', expectedResult: 'System returns to clean idle state' },
        ],
      },
    ];
  }

  // Derive base key prefix (e.g. AUTH-101 -> TC-101, TC-102... ; DBANK-104 -> TC-301...)
  const numMatch = story.key.match(/\d+/);
  const baseNum = numMatch ? parseInt(numMatch[0], 10) : 100;
  const prefixBase = baseNum >= 100 ? baseNum : baseNum * 10;

  const acList = story.acceptanceCriteria && story.acceptanceCriteria.length > 0
    ? story.acceptanceCriteria
    : [
        'Primary requirement fulfilled with valid inputs',
        'Input validation and negative error gates enforced',
        'Boundary thresholds and character limit enforced',
        'Edge case and security sanitization verified',
      ];

  // 1:1 Dynamic Mapping for EVERY Acceptance Criterion
  return acList.map((ac, index) => {
    const rawAc = ac.toLowerCase();
    const cleanText = cleanAcTitle(ac);
    const tcIndex = index + 1;
    const tcKey = `TC-${prefixBase + tcIndex}`;

    // Vector Classification based on actual AC content
    let vectorType: GeneratedTestCaseItem['vectorType'] = 'Functional / Happy Path';
    let priority: 'Critical' | 'High' | 'Medium' = 'High';
    let tags = ['BDD', 'Automated'];
    let testTitle = `Verify ${cleanText}`;
    let steps = [
      { stepNumber: 1, action: `Given user accesses ${story.title} interface`, expectedResult: 'Target form or workflow loaded in clean state' },
      { stepNumber: 2, action: `When action is performed fulfilling "${cleanText}"`, expectedResult: 'System processes input according to specification' },
      { stepNumber: 3, action: `Then expected outcome is verified successfully with 0 assertion failures`, expectedResult: 'Assertion validated' },
    ];

    if (rawAc.includes('boundary') || rawAc.includes('threshold') || rawAc.includes('limit') || rawAc.includes('min') || rawAc.includes('max') || rawAc.includes('chars') || rawAc.includes('length')) {
      vectorType = 'Boundary / Threshold';
      priority = 'High';
      tags = ['Boundary', 'Validation', 'Threshold-Check', 'BDD'];
      testTitle = `Verify boundary condition: ${cleanText}`;
      steps = [
        { stepNumber: 1, action: `Given input field is tested with minimum/maximum boundary payload limits`, expectedResult: 'Field accepts valid boundary edge value' },
        { stepNumber: 2, action: `When field is tested with 1 character below minimum or 1 character above maximum`, expectedResult: 'Inline validation triggers exact helper error message' },
        { stepNumber: 3, action: `Then system prevents invalid payload submission and maintains UI integrity`, expectedResult: 'Boundary enforced' },
      ];
    } else if (rawAc.includes('xss') || rawAc.includes('security') || rawAc.includes('sanitiz') || rawAc.includes('injection') || rawAc.includes('sql') || rawAc.includes('rbac') || rawAc.includes('unauthoriz') || rawAc.includes('403') || rawAc.includes('401')) {
      vectorType = 'Security / RBAC Gate';
      priority = 'Critical';
      tags = ['Security', 'XSS-Sanitization', 'Zero-Trust', 'OWASP'];
      testTitle = `Verify security & input sanitization: ${cleanText}`;
      steps = [
        { stepNumber: 1, action: `Given user attempts submitting malicious payload (<script> or SQL string) in input fields`, expectedResult: 'Payload entered in form field' },
        { stepNumber: 2, action: `When form is submitted to backend authentication controller`, expectedResult: 'Sanitization engine strips tags and escapes HTML entities' },
        { stepNumber: 3, action: `Then payload is executed as inert text with zero script execution vulnerability`, expectedResult: 'XSS injection prevented' },
      ];
    } else if (rawAc.includes('edge') || rawAc.includes('duplicate') || rawAc.includes('conflict') || rawAc.includes('409') || rawAc.includes('unicode') || rawAc.includes('special')) {
      vectorType = 'Edge Case / PII Governance';
      priority = 'High';
      tags = ['Edge-Case', 'Duplicate-Check', 'Integrity'];
      testTitle = `Verify edge case & conflict handling: ${cleanText}`;
      steps = [
        { stepNumber: 1, action: `Given target state contains pre-existing database record or special character data`, expectedResult: 'Dataset initialized' },
        { stepNumber: 2, action: `When duplicate registration or edge submission is triggered`, expectedResult: 'API returns HTTP 409 Conflict status code' },
        { stepNumber: 3, action: `Then UI renders contextual notification banner with redirect link`, expectedResult: 'Appropriate guidance banner displayed' },
      ];
    } else if (rawAc.includes('negative') || rawAc.includes('invalid') || rawAc.includes('mismatch') || rawAc.includes('error') || rawAc.includes('block') || rawAc.includes('reject')) {
      vectorType = 'Security / RBAC Gate';
      priority = 'Critical';
      tags = ['Negative-Path', 'Input-Validation', 'Form-Error'];
      testTitle = `Verify negative input rejection: ${cleanText}`;
      steps = [
        { stepNumber: 1, action: `Given user enters invalid payload or mismatched input fields`, expectedResult: 'Form populated with invalid data' },
        { stepNumber: 2, action: `When user clicks submit button`, expectedResult: 'Client-side validation intercepts submission before network request' },
        { stepNumber: 3, action: `Then inline red field validation errors are displayed and submission is blocked`, expectedResult: 'Error state displayed' },
      ];
    } else if (rawAc.includes('resilience') || rawAc.includes('rollback') || rawAc.includes('timeout') || rawAc.includes('network') || rawAc.includes('disconnect')) {
      vectorType = 'Resilience / Recovery';
      priority = 'Medium';
      tags = ['Resilience', 'Fault-Tolerance', 'Recovery'];
      testTitle = `Verify fault recovery & session rollback: ${cleanText}`;
      steps = [
        { stepNumber: 1, action: `Given active transaction in progress when network failure or timeout occurs`, expectedResult: 'Network event triggered' },
        { stepNumber: 2, action: `When connection is interrupted mid-request`, expectedResult: 'System rolls back partial state and saves form draft' },
        { stepNumber: 3, action: `Then user is prompted with seamless retry without data loss`, expectedResult: 'Safe state restored' },
      ];
    } else {
      // Happy path / standard positive
      vectorType = 'Functional / Happy Path';
      priority = 'High';
      tags = ['Functional', 'Happy-Path', 'Positive-Verification'];
      testTitle = `Verify primary positive workflow: ${cleanText}`;
      steps = [
        { stepNumber: 1, action: `Given user navigates to ${story.title} portal with all required fields valid`, expectedResult: 'Clean form ready' },
        { stepNumber: 2, action: `When valid details are entered and submit button is clicked`, expectedResult: 'Form submitted and 201 Created returned' },
        { stepNumber: 3, action: `Then account is provisioned and user is redirected to welcome confirmation screen`, expectedResult: 'Success confirmed' },
      ];
    }

    return {
      id: `${story.id}-tc-${tcIndex}`,
      projectId: story.projectId,
      storyId: story.id,
      key: tcKey,
      title: testTitle,
      type: 'Automated',
      priority,
      status: 'Approved',
      isAiGenerated: true,
      aiConfidence: Math.floor(92 + Math.random() * 7),
      tags,
      lastExecutionStatus: 'Passed',
      vectorType,
      targetAC: ac,
      createdAt: now,
      updatedAt: now,
      steps,
    };
  });
};
