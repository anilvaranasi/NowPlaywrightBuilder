// PlayWrightBuilder - Test: verify FeatureFileGenerator output
//
// Run in: All > System Definition > Scripts - Background (scope: x_146833_playwri_0)
// PURPOSE: Quick smoke test - prints generated .feature and NowConfig.env to output
//
// Run AFTER FeatureFileGenerator Script Include is created in Studio.

var SCOPE = 'x_146833_playwri_0';

// Find the "Now Assist Skills Panel" feature (created by create_sample_data.js)
var feat = new GlideRecord(SCOPE + '_pw_feature');
feat.addQuery('title', 'Now Assist Skills Panel');
feat.setLimit(1);
feat.query();

if (!feat.next()) {
    gs.print('ERROR: Feature "Now Assist Skills Panel" not found.');
    gs.print('Run create_sample_data.js first.');
} else {
    var gen = new x_146833_playwri_0.FeatureFileGenerator();
    var result = gen.generateForFeature(feat.sys_id + '');

    if (result.error) {
        gs.print('ERROR: ' + result.error);
    } else {
        gs.print('');
        gs.print('==================== .feature FILE ====================');
        gs.print(result.featureContent);
        gs.print('==================== NowConfig.env ====================');
        gs.print(result.nowConfigContent);
        gs.print('=======================================================');
        gs.print('File path: ' + result.filePath);
    }
}
