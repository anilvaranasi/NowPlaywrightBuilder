// PlayWrightBuilder - Table Creation Fix Script
// Run in: All > System Definition > Scripts - Background  (GLOBAL scope)
//
// PURPOSE: Creates all 8 PlayWrightBuilder custom tables and their fields
//          because source control XML may not reliably create tables via
//          sys_db_object / sys_dictionary files.
//
// TABLES CREATED:
//   x_146833_playwri_0_pw_environment
//   x_146833_playwri_0_pw_config
//   x_146833_playwri_0_pw_feature
//   x_146833_playwri_0_pw_story
//   x_146833_playwri_0_pw_scenario
//   x_146833_playwri_0_pw_scenario_step
//   x_146833_playwri_0_pw_test_run
//   x_146833_playwri_0_pw_test_result
//
// Safe to re-run. Skips tables and fields that already exist.

var APP_SCOPE = 'x_146833_playwri_0';
var APP_PACKAGE_ID = '179dea52836f8f90b96f6ed0deaad30f';

gs.print('');
gs.print('==============================================');
gs.print('  PlayWrightBuilder - Table Creation Script');
gs.print('==============================================');

// ------------------------------------------------------------------
// Helper: ensure a table exists in sys_db_object
// Returns the sys_id of the table record
// ------------------------------------------------------------------
function ensureTable(tableName, label) {
    var gr = new GlideRecord('sys_db_object');
    gr.addQuery('name', tableName);
    gr.query();
    if (gr.next()) {
        gs.print('  [EXISTS]  Table: ' + tableName);
        return gr.sys_id + '';
    }
    gr.initialize();
    gr.setValue('name', tableName);
    gr.setValue('label', label);
    gr.setValue('sys_name', label);
    gr.setValue('sys_package', APP_PACKAGE_ID);
    gr.setValue('sys_scope', APP_PACKAGE_ID);
    gr.setValue('create_access', true);
    gr.setValue('read_access', true);
    gr.setValue('update_access', true);
    gr.setValue('delete_access', false);
    gr.setValue('is_extendable', false);
    var id = gr.insert() + '';
    gs.print('  [CREATED] Table: ' + tableName + ' | sys_id=' + id);
    return id;
}

// ------------------------------------------------------------------
// Helper: ensure a field exists on a table (sys_dictionary)
// ------------------------------------------------------------------
function ensureField(tableName, fieldName, fieldLabel, fieldType, opts) {
    var gr = new GlideRecord('sys_dictionary');
    gr.addQuery('name', tableName);
    gr.addQuery('element', fieldName);
    gr.query();
    if (gr.next()) {
        return; // already exists
    }
    gr.initialize();
    gr.setValue('name', tableName);
    gr.setValue('element', fieldName);
    gr.setValue('column_label', fieldLabel);
    gr.setValue('internal_type', fieldType);
    gr.setValue('sys_package', APP_PACKAGE_ID);
    gr.setValue('sys_scope', APP_PACKAGE_ID);
    gr.setValue('active', true);
    if (opts) {
        if (opts.max_length)    gr.setValue('max_length', opts.max_length);
        if (opts.mandatory)     gr.setValue('mandatory', opts.mandatory);
        if (opts.default_val)   gr.setValue('default_value', opts.default_val);
        if (opts.reference)     gr.setValue('reference', opts.reference);
        if (opts.choice)        gr.setValue('choice', opts.choice);
        if (opts.display)       gr.setValue('display', opts.display);
    }
    gr.insert();
    gs.print('    + field: ' + fieldName + ' (' + fieldType + ')');
}

// ==================================================================
// TABLE 1: pw_environment
// ==================================================================
gs.print('\n[1/8] pw_environment');
ensureTable(APP_SCOPE + '_pw_environment', 'PW Environment');
ensureField(APP_SCOPE + '_pw_environment', 'name',           'Name',             'string',   {max_length:100, mandatory:true, display:true});
ensureField(APP_SCOPE + '_pw_environment', 'instance_url',   'Instance URL',     'url',      {max_length:500, mandatory:true});
ensureField(APP_SCOPE + '_pw_environment', 'username',       'Username',         'string',   {max_length:255, mandatory:true});
ensureField(APP_SCOPE + '_pw_environment', 'password',       'Password',         'password2',{max_length:255});
ensureField(APP_SCOPE + '_pw_environment', 'workspace_path', 'Workspace Path',   'string',   {max_length:500, default_val:'/now/sow/home'});
ensureField(APP_SCOPE + '_pw_environment', 'env_type',       'Environment Type', 'choice',   {max_length:40, default_val:'dev', choice:1});
ensureField(APP_SCOPE + '_pw_environment', 'is_active',      'Is Active',        'boolean',  {default_val:'true'});

// ==================================================================
// TABLE 2: pw_config
// ==================================================================
gs.print('\n[2/8] pw_config');
ensureTable(APP_SCOPE + '_pw_config', 'PW Config');
ensureField(APP_SCOPE + '_pw_config', 'name',            'Name',             'string',  {max_length:100, mandatory:true, display:true});
ensureField(APP_SCOPE + '_pw_config', 'environment',     'Environment',      'reference',{reference: APP_SCOPE + '_pw_environment'});
ensureField(APP_SCOPE + '_pw_config', 'timeout_seconds', 'Timeout (sec)',    'integer', {default_val:'90'});
ensureField(APP_SCOPE + '_pw_config', 'workers',         'Workers',          'integer', {default_val:'1'});
ensureField(APP_SCOPE + '_pw_config', 'retries',         'Retries',          'integer', {default_val:'0'});
ensureField(APP_SCOPE + '_pw_config', 'headless',        'Headless',         'boolean', {default_val:'false'});
ensureField(APP_SCOPE + '_pw_config', 'browser_channel', 'Browser Channel',  'string',  {max_length:50, default_val:'chrome'});
ensureField(APP_SCOPE + '_pw_config', 'report_format',   'Report Format',    'choice',  {max_length:20, default_val:'html', choice:1});
ensureField(APP_SCOPE + '_pw_config', 'features_path',   'Features Path',    'string',  {max_length:500, default_val:'features/**/*.feature'});
ensureField(APP_SCOPE + '_pw_config', 'steps_path',      'Steps Path',       'string',  {max_length:500, default_val:'step-definitions/**/*.ts'});

// ==================================================================
// TABLE 3: pw_feature
// ==================================================================
gs.print('\n[3/8] pw_feature');
ensureTable(APP_SCOPE + '_pw_feature', 'PW Feature');
ensureField(APP_SCOPE + '_pw_feature', 'title',       'Title',       'string',  {max_length:255, mandatory:true, display:true});
ensureField(APP_SCOPE + '_pw_feature', 'description', 'Description', 'string',  {max_length:4000});
ensureField(APP_SCOPE + '_pw_feature', 'tags',        'Tags',        'string',  {max_length:500});
ensureField(APP_SCOPE + '_pw_feature', 'file_path',   'File Path',   'string',  {max_length:500});
ensureField(APP_SCOPE + '_pw_feature', 'active',      'Active',      'boolean', {default_val:'true'});

// ==================================================================
// TABLE 4: pw_story
// ==================================================================
gs.print('\n[4/8] pw_story');
ensureTable(APP_SCOPE + '_pw_story', 'PW Story');
ensureField(APP_SCOPE + '_pw_story', 'title',               'Title',               'string',   {max_length:255, mandatory:true, display:true});
ensureField(APP_SCOPE + '_pw_story', 'feature',             'Feature',             'reference',{reference: APP_SCOPE + '_pw_feature'});
ensureField(APP_SCOPE + '_pw_story', 'as_a',                'As A',                'string',   {max_length:255});
ensureField(APP_SCOPE + '_pw_story', 'i_want',              'I Want',              'string',   {max_length:500});
ensureField(APP_SCOPE + '_pw_story', 'so_that',             'So That',             'string',   {max_length:500});
ensureField(APP_SCOPE + '_pw_story', 'priority',            'Priority',            'choice',   {max_length:20, default_val:'medium', choice:1});
ensureField(APP_SCOPE + '_pw_story', 'acceptance_criteria', 'Acceptance Criteria', 'string',   {max_length:4000});

// ==================================================================
// TABLE 5: pw_scenario
// ==================================================================
gs.print('\n[5/8] pw_scenario');
ensureTable(APP_SCOPE + '_pw_scenario', 'PW Scenario');
ensureField(APP_SCOPE + '_pw_scenario', 'title',            'Title',            'string',   {max_length:255, mandatory:true, display:true});
ensureField(APP_SCOPE + '_pw_scenario', 'story',            'Story',            'reference',{reference: APP_SCOPE + '_pw_story'});
ensureField(APP_SCOPE + '_pw_scenario', 'feature',          'Feature',          'reference',{reference: APP_SCOPE + '_pw_feature'});
ensureField(APP_SCOPE + '_pw_scenario', 'type',             'Type',             'choice',   {max_length:40, default_val:'scenario', choice:1});
ensureField(APP_SCOPE + '_pw_scenario', 'tags',             'Tags',             'string',   {max_length:500});
ensureField(APP_SCOPE + '_pw_scenario', 'background_steps', 'Background Steps', 'string',   {max_length:4000});
ensureField(APP_SCOPE + '_pw_scenario', 'order',            'Order',            'integer',  {default_val:'1'});
ensureField(APP_SCOPE + '_pw_scenario', 'active',           'Active',           'boolean',  {default_val:'true'});

// ==================================================================
// TABLE 6: pw_scenario_step
// ==================================================================
gs.print('\n[6/8] pw_scenario_step');
ensureTable(APP_SCOPE + '_pw_scenario_step', 'PW Scenario Step');
ensureField(APP_SCOPE + '_pw_scenario_step', 'scenario',           'Scenario',          'reference',{reference: APP_SCOPE + '_pw_scenario', mandatory:true});
ensureField(APP_SCOPE + '_pw_scenario_step', 'order',              'Order',             'integer',  {mandatory:true, default_val:'1'});
ensureField(APP_SCOPE + '_pw_scenario_step', 'keyword',            'Keyword',           'choice',   {max_length:10, default_val:'Given', choice:1});
ensureField(APP_SCOPE + '_pw_scenario_step', 'step_text',          'Step Text',         'string',   {max_length:1000, mandatory:true});
ensureField(APP_SCOPE + '_pw_scenario_step', 'step_definition_ref','Step Definition',   'reference',{reference: APP_SCOPE + '_gerkin_steps'});
ensureField(APP_SCOPE + '_pw_scenario_step', 'data_table',         'Data Table',        'string',   {max_length:4000});
ensureField(APP_SCOPE + '_pw_scenario_step', 'doc_string',         'Doc String',        'string',   {max_length:4000});

// ==================================================================
// TABLE 7: pw_test_run
// ==================================================================
gs.print('\n[7/8] pw_test_run');
ensureTable(APP_SCOPE + '_pw_test_run', 'PW Test Run');
ensureField(APP_SCOPE + '_pw_test_run', 'name',            'Name',            'string',   {max_length:255, mandatory:true, display:true});
ensureField(APP_SCOPE + '_pw_test_run', 'feature',         'Feature',         'reference',{reference: APP_SCOPE + '_pw_feature'});
ensureField(APP_SCOPE + '_pw_test_run', 'config',          'Config',          'reference',{reference: APP_SCOPE + '_pw_config'});
ensureField(APP_SCOPE + '_pw_test_run', 'environment',     'Environment',     'reference',{reference: APP_SCOPE + '_pw_environment'});
ensureField(APP_SCOPE + '_pw_test_run', 'triggered_by',    'Triggered By',    'reference',{reference: 'sys_user'});
ensureField(APP_SCOPE + '_pw_test_run', 'status',          'Status',          'choice',   {max_length:20, default_val:'pending', choice:1});
ensureField(APP_SCOPE + '_pw_test_run', 'started_at',      'Started At',      'glide_date_time',{});
ensureField(APP_SCOPE + '_pw_test_run', 'completed_at',    'Completed At',    'glide_date_time',{});
ensureField(APP_SCOPE + '_pw_test_run', 'total_scenarios', 'Total Scenarios', 'integer',  {default_val:'0'});
ensureField(APP_SCOPE + '_pw_test_run', 'passed',          'Passed',          'integer',  {default_val:'0'});
ensureField(APP_SCOPE + '_pw_test_run', 'failed',          'Failed',          'integer',  {default_val:'0'});
ensureField(APP_SCOPE + '_pw_test_run', 'skipped',         'Skipped',         'integer',  {default_val:'0'});
ensureField(APP_SCOPE + '_pw_test_run', 'report_url',      'Report URL',      'url',      {max_length:1000});

// ==================================================================
// TABLE 8: pw_test_result
// ==================================================================
gs.print('\n[8/8] pw_test_result');
ensureTable(APP_SCOPE + '_pw_test_result', 'PW Test Result');
ensureField(APP_SCOPE + '_pw_test_result', 'test_run',     'Test Run',     'reference',{reference: APP_SCOPE + '_pw_test_run', mandatory:true});
ensureField(APP_SCOPE + '_pw_test_result', 'scenario',     'Scenario',     'reference',{reference: APP_SCOPE + '_pw_scenario', mandatory:true, display:true});
ensureField(APP_SCOPE + '_pw_test_result', 'status',       'Status',       'choice',   {max_length:20, default_val:'pending', choice:1});
ensureField(APP_SCOPE + '_pw_test_result', 'duration_ms',  'Duration (ms)','integer',  {default_val:'0'});
ensureField(APP_SCOPE + '_pw_test_result', 'error_message','Error Message','string',   {max_length:4000});
ensureField(APP_SCOPE + '_pw_test_result', 'stack_trace',  'Stack Trace',  'string',   {max_length:8000});
ensureField(APP_SCOPE + '_pw_test_result', 'screenshot',   'Screenshot',   'string',   {max_length:1000});
ensureField(APP_SCOPE + '_pw_test_result', 'started_at',   'Started At',   'glide_date_time',{});
ensureField(APP_SCOPE + '_pw_test_result', 'completed_at', 'Completed At', 'glide_date_time',{});

gs.print('');
gs.print('==============================================');
gs.print('  TABLE CREATION COMPLETE');
gs.print('');
gs.print('  NEXT: Run create_sample_data.js to populate');
gs.print('  records into these tables.');
gs.print('');
gs.print('  Verify tables exist:');
gs.print('  x_146833_playwri_0_pw_environment.list');
gs.print('  x_146833_playwri_0_pw_config.list');
gs.print('  x_146833_playwri_0_pw_feature.list');
gs.print('  x_146833_playwri_0_pw_story.list');
gs.print('  x_146833_playwri_0_pw_scenario.list');
gs.print('  x_146833_playwri_0_pw_scenario_step.list');
gs.print('  x_146833_playwri_0_pw_test_run.list');
gs.print('  x_146833_playwri_0_pw_test_result.list');
gs.print('==============================================');
