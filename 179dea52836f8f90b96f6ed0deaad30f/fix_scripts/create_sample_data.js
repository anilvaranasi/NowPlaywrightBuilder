// PlayWrightBuilder - Sample Data Fix Script
// Run in: All > System Definition > Scripts - Background
// Scope: Global (or x_146833_playwri_0)
//
// Creates:
//   1 PW Environment   (IBM SG Demo4)
//   1 PW Config        (Demo4 Default)
//   9 Gherkin Step Library records
//   3 PW Feature
//   3 PW Story
//   4 PW Scenario
//  20 PW Scenario Step
//   1 PW Test Run (sample pending)
//   2 PW Test Result (sample pending)
//
// Safe to re-run - upsert pattern, no duplicates.

var SCOPE = 'x_146833_playwri_0';

function upsert(tableName, uniqueField, uniqueValue, fields) {
    var gr = new GlideRecord(tableName);
    gr.addQuery(uniqueField, uniqueValue);
    gr.query();
    if (!gr.next()) {
        gr.initialize();
    }
    for (var f in fields) {
        gr.setValue(f, fields[f]);
    }
    var id;
    if (gr.sys_id) {
        gr.update();
        id = gr.sys_id + '';
        gs.print('  [UPDATE] ' + tableName + ' | ' + uniqueField + '=' + uniqueValue + ' | sys_id=' + id);
    } else {
        id = gr.insert() + '';
        gs.print('  [INSERT] ' + tableName + ' | ' + uniqueField + '=' + uniqueValue + ' | sys_id=' + id);
    }
    return id;
}

function addStep(scenarioId, order, keyword, stepText, stepDefRef) {
    var gr = new GlideRecord(SCOPE + '_pw_scenario_step');
    gr.addQuery('scenario', scenarioId);
    gr.addQuery('order', order);
    gr.query();
    if (!gr.next()) {
        gr.initialize();
    }
    gr.setValue('scenario', scenarioId);
    gr.setValue('order', order);
    gr.setValue('keyword', keyword);
    gr.setValue('step_text', stepText);
    if (stepDefRef) {
        gr.setValue('step_definition_ref', stepDefRef);
    }
    var id;
    if (gr.sys_id) {
        gr.update();
        id = gr.sys_id + '';
    } else {
        id = gr.insert() + '';
    }
    gs.print('  Step ' + order + ' [' + keyword + '] ' + stepText.substring(0, 70));
    return id;
}

gs.print('');
gs.print('==============================================');
gs.print('  PlayWrightBuilder - Sample Data Fix Script');
gs.print('==============================================');

// ---------------------------------------------------------------
// 1. ENVIRONMENT
// ---------------------------------------------------------------
gs.print('\n[1/9] Creating Environment...');
var envId = upsert(SCOPE + '_pw_environment', 'name', 'IBM SG Demo4', {
    name:           'IBM SG Demo4',
    instance_url:   'https://ibmsingaporepteltdemo4.service-now.com',
    username:       'srinivas.anil.kumar.varanasi@ibm.com',
    workspace_path: '/now/sow/home',
    env_type:       'dev',
    is_active:      true
});

// ---------------------------------------------------------------
// 2. PW CONFIG
// ---------------------------------------------------------------
gs.print('\n[2/9] Creating PW Config...');
var cfgId = upsert(SCOPE + '_pw_config', 'name', 'Demo4 Default', {
    name:            'Demo4 Default',
    environment:     envId,
    timeout_seconds: 90,
    workers:         1,
    retries:         0,
    headless:        false,
    browser_channel: 'chrome',
    report_format:   'html',
    features_path:   'features/**/*.feature',
    steps_path:      'step-definitions/**/*.ts'
});

// ---------------------------------------------------------------
// 3. GHERKIN STEP LIBRARY
// ---------------------------------------------------------------
gs.print('\n[3/9] Creating Gherkin Step Library records...');

var stepLoggedIn = upsert(SCOPE + '_gerkin_steps', 'step_pattern', 'I am logged in to ServiceNow', {
    step_pattern:         'I am logged in to ServiceNow',
    keyword:              'Given',
    step_definition_file: 'step-definitions/now-assist-skills.steps.ts',
    page_object:          'hooks.ts (BeforeAll - storageState injection)',
    description:          'No-op step. Authentication handled by BeforeAll hook which injects storageState.',
    is_implemented:       true
});

var stepHomePage = upsert(SCOPE + '_gerkin_steps', 'step_pattern', 'I am on the Next Experience home page', {
    step_pattern:         'I am on the Next Experience home page',
    keyword:              'Given',
    step_definition_file: 'step-definitions/now-assist-skills.steps.ts',
    page_object:          'NavigationPage',
    description:          'Calls NavigationPage.goToHome(BASE_URL) - navigates to /now/nav/ui/home.',
    is_implemented:       true
});

var stepOpenSkillPicker = upsert(SCOPE + '_gerkin_steps', 'step_pattern', 'I open the Now Assist skill picker', {
    step_pattern:         'I open the Now Assist skill picker',
    keyword:              'When',
    step_definition_file: 'step-definitions/now-assist-skills.steps.ts',
    page_object:          'NowAssistPage',
    description:          'Clicks button[aria-label="Now Assist"] if panel not open. Waits for chat input (60s timeout).',
    is_implemented:       true
});

var stepSeeSkills = upsert(SCOPE + '_gerkin_steps', 'step_pattern', 'I should see at least 1 skill available', {
    step_pattern:         'I should see at least 1 skill available',
    keyword:              'Then',
    step_definition_file: 'step-definitions/now-assist-skills.steps.ts',
    page_object:          'NowAssistPage',
    description:          'Calls getVisibleSkills() and asserts skills.length > 0.',
    is_implemented:       true
});

var stepSkillsToFile = upsert(SCOPE + '_gerkin_steps', 'step_pattern', 'the available skills should be written to a file', {
    step_pattern:         'the available skills should be written to a file',
    keyword:              'Then',
    step_definition_file: 'step-definitions/now-assist-skills.steps.ts',
    page_object:          'NowAssistPage',
    description:          'Calls writeSkillsToFile(skills) - writes to output/now-assist-skills.txt.',
    is_implemented:       true
});

var stepSkillVisible = upsert(SCOPE + '_gerkin_steps', 'step_pattern', 'the skill {string} should be visible', {
    step_pattern:         'the skill {string} should be visible',
    keyword:              'Then',
    step_definition_file: 'step-definitions/now-assist-skills.steps.ts',
    page_object:          'NowAssistPage',
    description:          'Asserts getByRole("button",{name:skillName}).toBeVisible() 15s timeout.',
    is_implemented:       true
});

var stepOpenWorkspaces = upsert(SCOPE + '_gerkin_steps', 'step_pattern', 'I open the Workspaces menu', {
    step_pattern:         'I open the Workspaces menu',
    keyword:              'When',
    step_definition_file: 'step-definitions/(pending)',
    page_object:          'NavigationPage',
    description:          'Calls NavigationPage.openWorkspacesMenu() - clicks Workspaces menuitem.',
    is_implemented:       false
});

var stepOpenSOW = upsert(SCOPE + '_gerkin_steps', 'step_pattern', 'I open the Service Operations Workspace', {
    step_pattern:         'I open the Service Operations Workspace',
    keyword:              'When',
    step_definition_file: 'step-definitions/(pending)',
    page_object:          'SOWPage',
    description:          'Calls SOWPage.open() - clicks SOW link with force:true, waits for /now/sow/ URL.',
    is_implemented:       false
});

var stepSOWLoaded = upsert(SCOPE + '_gerkin_steps', 'step_pattern', 'the Service Operations Workspace should be loaded', {
    step_pattern:         'the Service Operations Workspace should be loaded',
    keyword:              'Then',
    step_definition_file: 'step-definitions/(pending)',
    page_object:          'SOWPage',
    description:          'Asserts page.toHaveURL(/now/sow/) - confirms SOW navigation succeeded.',
    is_implemented:       false
});

// ---------------------------------------------------------------
// 4. FEATURES
// ---------------------------------------------------------------
gs.print('\n[4/9] Creating Features...');

var featNowAssist = upsert(SCOPE + '_pw_feature', 'title', 'Now Assist Skills Panel', {
    title:       'Now Assist Skills Panel',
    description: 'Verify the Now Assist skills panel opens and lists expected AI-powered skills.',
    tags:        '@now-assist',
    file_path:   'features/now-assist-skills.feature',
    active:      true
});

var featIncident = upsert(SCOPE + '_pw_feature', 'title', 'Incident Management', {
    title:       'Incident Management',
    description: 'Create and verify Incident records via the ServiceNow classic UI form.',
    tags:        '@incident',
    file_path:   'features/incident-management.feature',
    active:      true
});

var featSOW = upsert(SCOPE + '_pw_feature', 'title', 'Service Operations Workspace', {
    title:       'Service Operations Workspace',
    description: 'Navigate to and verify the Service Operations Workspace (SOW) loads correctly.',
    tags:        '@sow',
    file_path:   'features/sow.feature',
    active:      true
});

// ---------------------------------------------------------------
// 5. USER STORIES
// ---------------------------------------------------------------
gs.print('\n[5/9] Creating User Stories...');

var storyViewSkills = upsert(SCOPE + '_pw_story', 'title', 'View available Now Assist skills', {
    title:    'View available Now Assist skills',
    feature:  featNowAssist,
    as_a:     'a ServiceNow user',
    i_want:   'to open the Now Assist panel',
    so_that:  'I can see what AI-powered skills are available to me',
    priority: 'high'
});

var storyCreateIncident = upsert(SCOPE + '_pw_story', 'title', 'Create a new Incident record', {
    title:               'Create a new Incident record',
    feature:             featIncident,
    as_a:                'a ServiceNow agent',
    i_want:              'to create a new Incident via the classic UI form',
    so_that:             'I can verify the record is saved with the correct field values',
    priority:            'high',
    acceptance_criteria: 'URL no longer contains sys_id=-1 after submit. Short Description and Urgency persist on the saved form.'
});

var storyOpenSOW = upsert(SCOPE + '_pw_story', 'title', 'Open the Service Operations Workspace', {
    title:    'Open the Service Operations Workspace',
    feature:  featSOW,
    as_a:     'a ServiceNow operator',
    i_want:   'to navigate to the Service Operations Workspace',
    so_that:  'I can verify the workspace loads and downstream tests can start inside it',
    priority: 'medium'
});

// ---------------------------------------------------------------
// 6. SCENARIOS
// ---------------------------------------------------------------
gs.print('\n[6/9] Creating Scenarios...');

var scenViewAllSkills = upsert(SCOPE + '_pw_scenario', 'title', 'View all available Now Assist skills', {
    title:            'View all available Now Assist skills',
    story:            storyViewSkills,
    feature:          featNowAssist,
    type:             'scenario',
    tags:             '@now-assist',
    background_steps: 'Given I am logged in to ServiceNow\nAnd I am on the Next Experience home page',
    order:            1,
    active:           true
});

var scenVerifySkills = upsert(SCOPE + '_pw_scenario', 'title', 'Verify specific skills are present', {
    title:            'Verify specific skills are present',
    story:            storyViewSkills,
    feature:          featNowAssist,
    type:             'scenario',
    tags:             '@now-assist',
    background_steps: 'Given I am logged in to ServiceNow\nAnd I am on the Next Experience home page',
    order:            2,
    active:           true
});

var scenCreateIncident = upsert(SCOPE + '_pw_scenario', 'title', 'Create a new Incident and verify submission', {
    title:   'Create a new Incident and verify submission',
    story:   storyCreateIncident,
    feature: featIncident,
    type:    'scenario',
    tags:    '@incident',
    order:   1,
    active:  true
});

var scenOpenSOW = upsert(SCOPE + '_pw_scenario', 'title', 'Navigate to and open the Service Operations Workspace', {
    title:   'Navigate to and open the Service Operations Workspace',
    story:   storyOpenSOW,
    feature: featSOW,
    type:    'scenario',
    tags:    '@sow',
    order:   1,
    active:  true
});

// ---------------------------------------------------------------
// 7. SCENARIO STEPS
// ---------------------------------------------------------------
gs.print('\n[7/9] Creating Scenario Steps...');

gs.print('  -- Scenario: View all available Now Assist skills');
addStep(scenViewAllSkills, 1, 'When', 'I open the Now Assist skill picker',              stepOpenSkillPicker);
addStep(scenViewAllSkills, 2, 'Then', 'I should see at least 1 skill available',         stepSeeSkills);
addStep(scenViewAllSkills, 3, 'And',  'the available skills should be written to a file', stepSkillsToFile);

gs.print('  -- Scenario: Verify specific skills are present');
addStep(scenVerifySkills, 1, 'When', 'I open the Now Assist skill picker',                       stepOpenSkillPicker);
addStep(scenVerifySkills, 2, 'Then', 'the skill "Generate resolution notes" should be visible',  stepSkillVisible);
addStep(scenVerifySkills, 3, 'And',  'the skill "Summarize a record" should be visible',         stepSkillVisible);
addStep(scenVerifySkills, 4, 'And',  'the skill "Incident assist" should be visible',            stepSkillVisible);

gs.print('  -- Scenario: Create a new Incident and verify submission');
addStep(scenCreateIncident, 1, 'Given', 'I am logged in to ServiceNow',                                                    stepLoggedIn);
addStep(scenCreateIncident, 2, 'When',  'I navigate to the new Incident form',                                             null);
addStep(scenCreateIncident, 3, 'And',   'I fill in Short Description with "Automated test - Playwright incident creation"', null);
addStep(scenCreateIncident, 4, 'And',   'I set Urgency to "2" (Medium)',                                                   null);
addStep(scenCreateIncident, 5, 'And',   'I submit the Incident form',                                                      null);
addStep(scenCreateIncident, 6, 'Then',  'the URL should not contain sys_id=-1',                                            null);
addStep(scenCreateIncident, 7, 'And',   'the Short Description field should contain the expected value',                   null);
addStep(scenCreateIncident, 8, 'And',   'the Urgency field should have value "2"',                                         null);

gs.print('  -- Scenario: Navigate to and open the Service Operations Workspace');
addStep(scenOpenSOW, 1, 'Given', 'I am logged in to ServiceNow',                           stepLoggedIn);
addStep(scenOpenSOW, 2, 'And',   'I am on the Next Experience home page',                  stepHomePage);
addStep(scenOpenSOW, 3, 'When',  'I open the Workspaces menu',                             stepOpenWorkspaces);
addStep(scenOpenSOW, 4, 'And',   'I open the Service Operations Workspace',                stepOpenSOW);
addStep(scenOpenSOW, 5, 'Then',  'the Service Operations Workspace should be loaded',      stepSOWLoaded);

// ---------------------------------------------------------------
// 8. SAMPLE TEST RUN
// ---------------------------------------------------------------
gs.print('\n[8/9] Creating sample Test Run...');

var runId = upsert(SCOPE + '_pw_test_run', 'name', 'Now Assist Skills Run 1', {
    name:            'Now Assist Skills Run 1',
    feature:         featNowAssist,
    config:          cfgId,
    environment:     envId,
    triggered_by:    gs.getUserID(),
    status:          'pending',
    total_scenarios: 2,
    passed:          0,
    failed:          0
});

// ---------------------------------------------------------------
// 9. SAMPLE TEST RESULTS
// ---------------------------------------------------------------
gs.print('\n[9/9] Creating sample Test Results...');

upsert(SCOPE + '_pw_test_result', 'scenario', scenViewAllSkills, {
    test_run:    runId,
    scenario:    scenViewAllSkills,
    status:      'pending',
    duration_ms: 0
});

upsert(SCOPE + '_pw_test_result', 'scenario', scenVerifySkills, {
    test_run:    runId,
    scenario:    scenVerifySkills,
    status:      'pending',
    duration_ms: 0
});

gs.print('');
gs.print('==============================================');
gs.print('  DONE - Sample data creation complete!');
gs.print('');
gs.print('  Verify in these list views:');
gs.print('  x_146833_playwri_0_pw_environment.list');
gs.print('  x_146833_playwri_0_pw_config.list');
gs.print('  x_146833_playwri_0_pw_feature.list');
gs.print('  x_146833_playwri_0_pw_story.list');
gs.print('  x_146833_playwri_0_pw_scenario.list');
gs.print('  x_146833_playwri_0_pw_scenario_step.list');
gs.print('  x_146833_playwri_0_gerkin_steps.list');
gs.print('  x_146833_playwri_0_pw_test_run.list');
gs.print('  x_146833_playwri_0_pw_test_result.list');
gs.print('');
gs.print('  NOTE: Set the password on IBM SG Demo4 environment record manually.');
gs.print('==============================================');
