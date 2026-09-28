// PlayWrightBuilder - Flow Designer Action: Generate Feature File
//
// Create in Studio:
//   All > PlayWrightBuilder > Flow Designer > Actions > New Action
//   Name:     Generate Feature File
//   Category: PlayWrightBuilder
//
// ACTION INPUTS (add these in the Inputs section):
//   feature_sys_id  (String, mandatory) - sys_id of pw_feature record
//
// ACTION OUTPUTS (add these in the Outputs section):
//   feature_content   (String) - full .feature file text
//   now_config_content (String) - NowConfig.env text
//   feature_title     (String) - human label of the feature
//   file_path         (String) - relative path e.g. features/now-assist-skills.feature
//   error             (String) - empty on success, message on failure
//
// SCRIPT STEP - paste this into a "Script" step inside the action:

(function execute(inputs, outputs) {

    var gen = new x_146833_playwri_0.FeatureFileGenerator();
    var result = gen.generateForFeature(inputs.feature_sys_id);

    outputs.feature_content    = result.featureContent;
    outputs.now_config_content = result.nowConfigContent;
    outputs.feature_title      = result.featureTitle;
    outputs.file_path          = result.filePath;
    outputs.error              = result.error;

    if (result.error) {
        gs.error('GenerateFeatureFile: ' + result.error);
    } else {
        gs.info('GenerateFeatureFile: Generated ' + result.filePath + ' (' + result.featureContent.length + ' chars)');
    }

})(inputs, outputs);
