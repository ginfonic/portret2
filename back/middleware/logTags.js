function matchConnectTag(req, res, next){
    req.log_tag = 1;
    next();
}

function matchErrorFlagTag(req, res, next) {
    req.log_tag = 2;
    next();
}

function matchErrorTag(req, res, next) {
    req.log_tag = 3;
    next();
}

function authTag(req, res, next) {
    req.log_tag = 4;
    next();
}
function footUpdateTag(req, res, next) {
    req.log_tag = 20;
    next();
}

function footCreateTag(req, res, next) {
    req.log_tag = 21;
    next();
}

function footDeleteTag(req, res, next) {
    req.log_tag = 22;
    next();
}

function deviationApprovedElementTag(req, res, next) {
    req.log_tag = 5;
    next();
}

function deviationApprovedTagTag(req, res, next) {
    req.log_tag = 6;
    next();
}

function deviationCountUrmUpdateTag(req, res, next) {
    req.log_tag = 7;
    next();
}

function downloadDeviationTableTag(req, res, next) {
    req.log_tag = 8;
    next();
}

function footnoteUrmCountDeviationsTag(req, res, next) {
    req.log_tag = 9;
    next();
}

function adminDeviationsUpdateTag(req, res, next) {
    req.log_tag = 10;
    next();
}

function adminMatchUnitUpdateTag(req, res, next) {
    req.log_tag = 11;
    next();
}

function adminMatchBestMatchesUpdateTag(req, res, next) {
    req.log_tag = 12;
    next();
}

function adminDataForBestMatchesTag(req, res, next) {
    req.log_tag = 13;
    next();
}

function adminMatchFromSaveLoadTag(req, res, next) {
    req.log_tag = 14;
    next();
}

function adminSetCutDepsTag(req, res, next) {
    req.log_tag = 15;
    next();
}

function adminFileDeleteTag(req, res, next) {
    req.log_tag = 16;
    next();
}

function adminUploadSapTag(req, res, next) {
    req.log_tag = 17;
    next();
}

function adminDataSapVspUploadTag(req, res, next) {
    req.log_tag = 18;
    next();
}

function adminMoveDepTag(req, res, next) {
    req.log_tag = 19;
    next();
}

function adminDataRemoveTag(req, res, next) {
    req.log_tag = 60;
    next();
}

function logsTagsRedactTags(req, res, next) {
    req.log_tag = 61;
    next();
}

function matchUnitErrorTag(req, res, next) {
    req.log_tag = 62;
    next();
}

function logOutTag(req, res, next) {
    req.log_tag = 64;
    next();
}

function tbUnitAddTag(req, res, next){
    req.log_tag = 24;
    next();
}

function tbUnitChangeTag(req, res, next){
    req.log_tag = 25;
    next();
}

function tbUnitDelTag(req, res, next){
    req.log_tag = 26;
    next();
}

function tbFootDelTag(req, res, next){
    req.log_tag = 27;
    next();
}

function tbFootAddTag(req, res, next){
    req.log_tag = 28;
    next();
}

function tbUnitFootDelTag(req, res, next){
    req.log_tag = 29;
    next();
}

function tbUnitFootAddTag(req, res, next){
    req.log_tag = 30;
    next();
}

function tbTextAddTag(req, res, next){
    req.log_tag = 31;
    next();
}

function tbDepAddTag(req, res, next){
    req.log_tag = 32;
    next();
}

function tbDepNameTag(req, res, next){
    req.log_tag = 33;
    next();
}

function tbDelTag(req, res, next){
    req.log_tag = 34;
    next();
}

function gosbUnitAddTag(req, res, next){
    req.log_tag = 35;
    next();
}

function gosbUnitChangeTag(req, res, next){
    req.log_tag = 36;
    next();
}

function gosbUnitDelTag(req, res, next){
    req.log_tag = 37;
    next();
}

function gosbTextAddTag(req, res, next){
    req.log_tag = 38;
    next();
}

function gosbDepAddTag(req, res, next){
    req.log_tag = 39;
    next();
}

function gosbDepNameTag(req, res, next){
    req.log_tag = 40;
    next();
}

function gosbDelTag(req, res, next){
    req.log_tag = 41;
    next();
}

module.exports = {
    matchConnectTag,
    matchErrorFlagTag,
    matchErrorTag,
    authTag,
    deviationApprovedElementTag,
    deviationApprovedTagTag,
    deviationCountUrmUpdateTag,
    downloadDeviationTableTag,
    footnoteUrmCountDeviationsTag,
    footUpdateTag,
    footCreateTag,
    footDeleteTag,
    tbUnitAddTag,
    tbUnitChangeTag,
    tbUnitDelTag,
    tbTextAddTag,
    tbDepAddTag,
    tbDepNameTag,
    tbDelTag,
    gosbUnitAddTag,
    gosbUnitChangeTag,
    gosbUnitDelTag,
    gosbTextAddTag,
    gosbDepAddTag,
    gosbDepNameTag,
    gosbDelTag,
    adminDataForBestMatchesTag,
    adminDeviationsUpdateTag,
    adminMatchBestMatchesUpdateTag,
    adminMatchUnitUpdateTag,
    adminUploadSapTag,
    adminFileDeleteTag,
    adminSetCutDepsTag,
    adminMatchFromSaveLoadTag,
    adminDataSapVspUploadTag,
    adminMoveDepTag,
    adminDataRemoveTag,
    logsTagsRedactTags,
    matchUnitErrorTag,
    logOutTag
};