'use strict';

const index = require('./index-6d840b58.js');

/*
 Stencil Client Patch Browser v2.12.0 | MIT Licensed | https://stenciljs.com
 */
const patchBrowser = () => {
    const importMeta = (typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('blinkid-in-browser.cjs.js', document.baseURI).href));
    const opts = {};
    if (importMeta !== '') {
        opts.resourcesUrl = new URL('.', importMeta).href;
    }
    return index.promiseResolve(opts);
};

patchBrowser().then(options => {
  return index.bootstrapLazy([["blinkid-in-browser_16.cjs",[[1,"blinkid-in-browser",{"allowHelloMessage":[4,"allow-hello-message"],"engineLocation":[1,"engine-location"],"licenseKey":[1,"license-key"],"wasmType":[1,"wasm-type"],"rawRecognizers":[1,"recognizers"],"recognizers":[16],"recognizerOptions":[16],"recognitionTimeout":[2,"recognition-timeout"],"includeSuccessFrame":[4,"include-success-frame"],"enableDrag":[4,"enable-drag"],"hideFeedback":[4,"hide-feedback"],"hideLoadingAndErrorUi":[4,"hide-loading-and-error-ui"],"scanFromCamera":[4,"scan-from-camera"],"scanFromImage":[4,"scan-from-image"],"thoroughScanFromImage":[4,"thorough-scan-from-image"],"galleryOverlayType":[1,"gallery-overlay-type"],"galleryDropType":[1,"gallery-drop-type"],"showActionLabels":[4,"show-action-labels"],"showModalWindows":[4,"show-modal-windows"],"showCameraFeedbackBarcodeMessage":[4,"show-camera-feedback-barcode-message"],"rawTranslations":[1,"translations"],"translations":[16],"iconCameraDefault":[1,"icon-camera-default"],"iconCameraActive":[1,"icon-camera-active"],"iconGalleryDefault":[1,"icon-gallery-default"],"iconGalleryActive":[1,"icon-gallery-active"],"iconInvalidFormat":[1,"icon-invalid-format"],"iconSpinnerScreenLoading":[1,"icon-spinner-screen-loading"],"iconSpinnerFromGalleryExperience":[1,"icon-spinner-from-gallery-experience"],"iconGalleryScanningCompleted":[1,"icon-gallery-scanning-completed"],"cameraId":[1,"camera-id"],"setUiState":[64],"startCameraScan":[64],"startImageScan":[64],"startCombinedImageScan":[64],"setUiMessage":[64],"getProductIntegrationInfo":[64]}],[1,"mb-component",{"allowHelloMessage":[4,"allow-hello-message"],"engineLocation":[1,"engine-location"],"licenseKey":[1,"license-key"],"wasmType":[1025,"wasm-type"],"recognizers":[1040],"recognizerOptions":[1040],"recognitionTimeout":[2,"recognition-timeout"],"includeSuccessFrame":[4,"include-success-frame"],"enableDrag":[4,"enable-drag"],"hideLoadingAndErrorUi":[4,"hide-loading-and-error-ui"],"rtl":[4],"scanFromCamera":[4,"scan-from-camera"],"scanFromImage":[4,"scan-from-image"],"thoroughScanFromImage":[4,"thorough-scan-from-image"],"galleryOverlayType":[1,"gallery-overlay-type"],"galleryDropType":[1,"gallery-drop-type"],"showActionLabels":[4,"show-action-labels"],"showModalWindows":[4,"show-modal-windows"],"showCameraFeedbackBarcodeMessage":[4,"show-camera-feedback-barcode-message"],"showScanningLine":[4,"show-scanning-line"],"iconCameraDefault":[1,"icon-camera-default"],"iconCameraActive":[1,"icon-camera-active"],"iconGalleryDefault":[1,"icon-gallery-default"],"iconGalleryActive":[1,"icon-gallery-active"],"iconInvalidFormat":[1,"icon-invalid-format"],"iconSpinnerScreenLoading":[1,"icon-spinner-screen-loading"],"iconSpinnerFromGalleryExperience":[1,"icon-spinner-from-gallery-experience"],"iconGalleryScanningCompleted":[1,"icon-gallery-scanning-completed"],"sdkService":[16],"translationService":[16],"cameraId":[1,"camera-id"],"galleryExperienceModalErrorWindowVisible":[32],"apiProcessStatusVisible":[32],"apiProcessStatusState":[32],"startCameraScan":[64],"startImageScan":[64],"startCombinedImageScan":[64],"setUiState":[64]}],[1,"mb-container"],[1,"mb-feedback",{"visible":[4],"paragraphClassName":[32],"paragraphValue":[32],"show":[64]}],[1,"mb-camera-experience",{"type":[1],"showOverlay":[4,"show-overlay"],"translationService":[16],"apiState":[1,"api-state"],"cameraFlipped":[4,"camera-flipped"],"showScanningLine":[4,"show-scanning-line"],"showCameraFeedbackBarcodeMessage":[4,"show-camera-feedback-barcode-message"],"cameraCursorBarcodeClassName":[32],"cameraCursorIdentityCardClassName":[32],"cameraCursorPaymentCardClassName":[32],"scanningLineBarcodeClassName":[32],"scanningLinePaymentCardClassName":[32],"cameraMessageIdentityCardContent":[32],"cameraMessageIdentityCardClassName":[32],"setActiveCamera":[64],"populateCameraDevices":[64],"setCameraFlipState":[64],"setState":[64],"resetState":[64]}],[1,"mb-api-process-status",{"visible":[4],"state":[1],"translationService":[16]}],[1,"mb-button",{"disabled":[4],"icon":[4],"preventDefault":[4,"prevent-default"],"visible":[4],"selected":[4],"imageSrcDefault":[1,"image-src-default"],"imageSrcActive":[1,"image-src-active"],"imageAlt":[1,"image-alt"],"label":[1],"translationService":[16],"imageSrc":[32]}],[1,"mb-button-classic",{"disabled":[4],"preventDefault":[4,"prevent-default"]}],[1,"mb-completed",{"icon":[1]}],[1,"mb-image-box",{"boxTitle":[1,"box-title"],"anchorText":[1,"anchor-text"],"clear":[64]}],[1,"mb-overlay",{"fullscreen":[4],"visible":[4]}],[1,"mb-screen",{"visible":[4]}],[1,"mb-spinner",{"icon":[1],"size":[1]}],[1,"mb-camera-toolbar",{"showClose":[4,"show-close"],"enableCameraFlip":[4,"enable-camera-flip"],"cameraFlipped":[4,"camera-flipped"],"isDesktop":[32],"setActiveCamera":[64],"populateCameraDevices":[64]}],[1,"mb-modal",{"visible":[4],"modalTitle":[1,"modal-title"],"content":[1],"contentCentered":[4,"content-centered"]}],[1,"mb-camera-selection",{"activeCamera":[32],"cameraList":[32],"isListVisible":[32],"setActiveCamera":[64],"populateCameraDevices":[64]}]]]], options);
});
