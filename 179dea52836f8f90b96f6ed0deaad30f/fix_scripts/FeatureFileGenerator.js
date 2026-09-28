// PlayWrightBuilder - FeatureFileGenerator Script Include
//
// Create in Studio:
//   All > PlayWrightBuilder > Script Includes > New
//   Name:         FeatureFileGenerator
//   API Name:     x_146833_playwri_0.FeatureFileGenerator
//   Client callable: false
//   Accessible from: This application scope only
//
// Usage (from Flow Designer action script or background script):
//   var gen = new x_146833_playwri_0.FeatureFileGenerator();
//   var result = gen.generateForFeature(featureSysId);
//   gs.print(result.featureContent);
//   gs.print(result.nowConfigContent);

var FeatureFileGenerator = Class.create();
FeatureFileGenerator.prototype = {

    initialize: function() {},

    // ------------------------------------------------------------------
    // Main entry point
    // Returns: { featureContent: string, nowConfigContent: string,
    //            featureTitle: string, filePath: string, error: string }
    // ------------------------------------------------------------------
    generateForFeature: function(featureSysId) {
        var result = {
            featureContent:   '',
            nowConfigContent: '',
            featureTitle:     '',
            filePath:         '',
            error:            ''
        };

        // Load feature record
        var feat = new GlideRecord('x_146833_playwri_0_pw_feature');
        if (!feat.get(featureSysId)) {
            result.error = 'Feature not found: ' + featureSysId;
            return result;
        }
        result.featureTitle = feat.getValue('title');
        result.filePath     = feat.getValue('file_path') || ('features/' + this._slug(feat.getValue('title')) + '.feature');

        // Build .feature file
        result.featureContent   = this._buildFeatureFile(feat);

        // Build NowConfig.env (needs an active config linked to this feature or default)
        result.nowConfigContent = this._buildNowConfig(feat);

        return result;
    },

    // ------------------------------------------------------------------
    // Build the full .feature file text
    // ------------------------------------------------------------------
    _buildFeatureFile: function(feat) {
        var lines = [];
        var tags  = feat.getValue('tags');
        if (tags) { lines.push(tags); }
        lines.push('Feature: ' + feat.getValue('title'));

        var desc = feat.getValue('description');
        if (desc) {
            var descLines = desc.split('\n');
            for (var d = 0; d < descLines.length; d++) {
                lines.push('  ' + descLines[d]);
            }
        }
        lines.push('');

        // Load scenarios ordered by their order field
        var scen = new GlideRecord('x_146833_playwri_0_pw_scenario');
        scen.addQuery('feature', feat.sys_id + '');
        scen.addQuery('active', true);
        scen.orderBy('order');
        scen.query();

        while (scen.next()) {
            lines = lines.concat(this._buildScenarioBlock(scen));
            lines.push('');
        }

        return lines.join('\n');
    },

    // ------------------------------------------------------------------
    // Build a single Scenario block
    // ------------------------------------------------------------------
    _buildScenarioBlock: function(scen) {
        var lines  = [];
        var type   = scen.getValue('type') || 'scenario';
        var keyword = (type === 'scenario_outline') ? 'Scenario Outline' : 'Scenario';

        var tags = scen.getValue('tags');
        if (tags) { lines.push('  ' + tags); }

        lines.push('  ' + keyword + ': ' + scen.getValue('title'));

        // Background steps (stored as raw Gherkin lines)
        var bg = scen.getValue('background_steps');
        if (bg) {
            var bgLines = bg.split('\n');
            for (var b = 0; b < bgLines.length; b++) {
                var bgLine = bgLines[b].trim();
                if (bgLine) { lines.push('    ' + bgLine); }
            }
        }

        // Scenario steps ordered by order field
        var step = new GlideRecord('x_146833_playwri_0_pw_scenario_step');
        step.addQuery('scenario', scen.sys_id + '');
        step.orderBy('order');
        step.query();

        while (step.next()) {
            var keyword = step.getValue('keyword') || 'Given';
            var text    = step.getValue('step_text') || '';
            lines.push('    ' + keyword + ' ' + text);

            var docString = step.getValue('doc_string');
            if (docString) {
                lines.push('      """');
                var dsLines = docString.split('\n');
                for (var ds = 0; ds < dsLines.length; ds++) {
                    lines.push('      ' + dsLines[ds]);
                }
                lines.push('      """');
            }

            var dataTable = step.getValue('data_table');
            if (dataTable) {
                var dtLines = dataTable.split('\n');
                for (var dt = 0; dt < dtLines.length; dt++) {
                    if (dtLines[dt].trim()) { lines.push('      ' + dtLines[dt].trim()); }
                }
            }
        }

        return lines;
    },

    // ------------------------------------------------------------------
    // Build NowConfig.env content from the active pw_config + environment
    // ------------------------------------------------------------------
    _buildNowConfig: function(feat) {
        // Find active config - prefer one linked to this feature, fall back to any active
        var cfg = new GlideRecord('x_146833_playwri_0_pw_config');
        cfg.addQuery('active', true);
        cfg.setLimit(1);
        cfg.query();

        if (!cfg.next()) {
            return '# No active PW Config found\n';
        }

        var envId = cfg.getValue('environment');
        var env   = new GlideRecord('x_146833_playwri_0_pw_environment');
        if (!env.get(envId)) {
            return '# No environment linked to config\n';
        }

        var lines = [];
        lines.push('# Auto-generated by PlayWrightBuilder');
        lines.push('# Feature: ' + feat.getValue('title'));
        lines.push('# Config:  ' + cfg.getValue('name'));
        lines.push('');
        lines.push('SN_INSTANCE_URL='   + (env.getValue('instance_url')   || ''));
        lines.push('SN_USERNAME='       + (env.getValue('username')        || ''));
        lines.push('SN_PASSWORD='       + (env.getDisplayValue('password') || ''));
        lines.push('SN_WORKSPACE_PATH=' + (env.getValue('workspace_path')  || '/now/sow/home'));
        lines.push('');
        lines.push('TIMEOUT='           + (cfg.getValue('timeout_seconds') || '90'));
        lines.push('WORKERS='           + (cfg.getValue('workers')          || '1'));
        lines.push('RETRIES='           + (cfg.getValue('retries')          || '0'));
        lines.push('HEADLESS='          + (cfg.getValue('headless')         || 'false'));
        lines.push('BROWSER_CHANNEL='   + (cfg.getValue('browser_channel')  || 'chrome'));
        lines.push('REPORT_FORMAT='     + (cfg.getValue('report_format')    || 'html'));
        lines.push('FEATURES_PATH='     + (cfg.getValue('features_path')    || 'features/**/*.feature'));
        lines.push('STEPS_PATH='        + (cfg.getValue('steps_path')       || 'step-definitions/**/*.ts'));

        return lines.join('\n') + '\n';
    },

    // ------------------------------------------------------------------
    // Slugify a title to a safe filename
    // ------------------------------------------------------------------
    _slug: function(title) {
        return (title || 'feature')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    },

    type: 'FeatureFileGenerator'
};
