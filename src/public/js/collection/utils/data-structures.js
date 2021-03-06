/**
 * Copyright (c) Microblink Ltd. All rights reserved.
 */
export { SDKError } from '@microblink/blinkid-in-browser-sdk';
/**
 * Events
 */
export class EventReady {
  constructor(sdk) {
    this.sdk = sdk;
  }
}
export class EventScanError {
  constructor(code, fatal, message, recognizerName, details) {
    this.code = code;
    this.fatal = fatal;
    this.message = message;
    this.recognizerName = recognizerName;
    if (details) {
      this.details = details;
    }
  }
}
export class EventScanSuccess {
  constructor(recognizer, recognizerName, successFrame) {
    this.recognizer = recognizer;
    this.recognizerName = recognizerName;
    if (successFrame) {
      this.successFrame = successFrame;
    }
  }
}
/**
 * Error codes
 */
export var Code;
(function (Code) {
  Code["EmptyResult"] = "EMPTY_RESULT";
  Code["InvalidRecognizerOptions"] = "INVALID_RECOGNIZER_OPTIONS";
  Code["NoImageFileFound"] = "NO_IMAGE_FILE_FOUND";
  Code["NoFirstImageFileFound"] = "NO_FIRST_IMAGE_FILE_FOUND";
  Code["NoSecondImageFileFound"] = "NO_SECOND_IMAGE_FILE_FOUND";
  Code["GenericScanError"] = "GENERIC_SCAN_ERROR";
  Code["CameraNotAllowed"] = "CAMERA_NOT_ALLOWED";
  Code["CameraInUse"] = "CAMERA_IN_USE";
  Code["CameraGenericError"] = "CAMERA_GENERIC_ERROR";
})(Code || (Code = {}));
/**
 * Scan structures
 */
export const AvailableRecognizers = {
  IdBarcodeRecognizer: 'createIdBarcodeRecognizer',
  BlinkIdRecognizer: 'createBlinkIdRecognizer',
  BlinkIdCombinedRecognizer: 'createBlinkIdCombinedRecognizer',
};
export var ImageRecognitionType;
(function (ImageRecognitionType) {
  ImageRecognitionType["Single"] = "Single";
  ImageRecognitionType["Combined"] = "Combined";
})(ImageRecognitionType || (ImageRecognitionType = {}));
export var CombinedImageType;
(function (CombinedImageType) {
  CombinedImageType["First"] = "First";
  CombinedImageType["Second"] = "Second";
})(CombinedImageType || (CombinedImageType = {}));
export var RecognitionStatus;
(function (RecognitionStatus) {
  RecognitionStatus["NoImageFileFound"] = "NoImageFileFound";
  RecognitionStatus["NoFirstImageFileFound"] = "NoFirstImageFileFound";
  RecognitionStatus["NoSecondImageFileFound"] = "NoSecondImageFileFound";
  RecognitionStatus["Preparing"] = "Preparing";
  RecognitionStatus["Ready"] = "Ready";
  RecognitionStatus["Processing"] = "Processing";
  RecognitionStatus["DetectionFailed"] = "DetectionFailed";
  RecognitionStatus["EmptyResultState"] = "EmptyResultState";
  RecognitionStatus["OnFirstSideResult"] = "OnFirstSideResult";
  RecognitionStatus["ScanSuccessful"] = "ScanSuccessful";
  RecognitionStatus["DocumentClassified"] = "DocumentClassified";
  // Camera states
  RecognitionStatus["DetectionStatusChange"] = "DetectionStatusChange";
  RecognitionStatus["NoSupportForMediaDevices"] = "NoSupportForMediaDevices";
  RecognitionStatus["CameraNotFound"] = "CameraNotFound";
  RecognitionStatus["CameraNotAllowed"] = "CameraNotAllowed";
  RecognitionStatus["UnableToAccessCamera"] = "UnableToAccessCamera";
  RecognitionStatus["CameraInUse"] = "CameraInUse";
  RecognitionStatus["CameraGenericError"] = "CameraGenericError";
  // Errors
  RecognitionStatus["UnknownError"] = "UnknownError";
  RecognitionStatus["BarcodeScanningStarted"] = "BarcodeScanningStarted";
  // BlinkIDSDK.DetectionStatus
  RecognitionStatus["DetectionStatusFail"] = "Fail";
  RecognitionStatus["DetectionStatusSuccess"] = "Success";
  RecognitionStatus["DetectionStatusCameraTooHigh"] = "CameraTooHigh";
  RecognitionStatus["DetectionStatusFallbackSuccess"] = "FallbackSuccess";
  RecognitionStatus["DetectionStatusPartial"] = "Partial";
  RecognitionStatus["DetectionStatusCameraAtAngle"] = "CameraAtAngle";
  RecognitionStatus["DetectionStatusCameraTooNear"] = "CameraTooNear";
  RecognitionStatus["DetectionStatusDocumentTooCloseToEdge"] = "DocumentTooCloseToEdge";
})(RecognitionStatus || (RecognitionStatus = {}));
export var CameraExperience;
(function (CameraExperience) {
  CameraExperience["Barcode"] = "BARCODE";
  CameraExperience["CardCombined"] = "CARD_COMBINED";
  CameraExperience["CardSingleSide"] = "CARD_SINGLE_SIDE";
  CameraExperience["PaymentCard"] = "PAYMENT_CARD";
})(CameraExperience || (CameraExperience = {}));
export var CameraExperienceState;
(function (CameraExperienceState) {
  CameraExperienceState["BarcodeScanning"] = "BarcodeScanning";
  CameraExperienceState["AdjustAngle"] = "AdjustAngle";
  CameraExperienceState["Classification"] = "Classification";
  CameraExperienceState["Default"] = "Default";
  CameraExperienceState["Detection"] = "Detection";
  CameraExperienceState["Done"] = "Done";
  CameraExperienceState["DoneAll"] = "DoneAll";
  CameraExperienceState["Flip"] = "Flip";
  CameraExperienceState["MoveCloser"] = "MoveCloser";
  CameraExperienceState["MoveFarther"] = "MoveFarther";
})(CameraExperienceState || (CameraExperienceState = {}));
export const CameraExperienceStateDuration = new Map([
  [CameraExperienceState.BarcodeScanning, 3500],
  [CameraExperienceState.AdjustAngle, 2500],
  [CameraExperienceState.Default, 500],
  [CameraExperienceState.Done, 300],
  [CameraExperienceState.DoneAll, 400],
  [CameraExperienceState.Flip, 3500],
  [CameraExperienceState.MoveCloser, 2500],
  [CameraExperienceState.MoveFarther, 2500]
]);
export var CameraExperienceReticleAnimation;
(function (CameraExperienceReticleAnimation) {
  CameraExperienceReticleAnimation[CameraExperienceReticleAnimation["Default"] = 0] = "Default";
  CameraExperienceReticleAnimation[CameraExperienceReticleAnimation["Detection"] = 1] = "Detection";
  CameraExperienceReticleAnimation[CameraExperienceReticleAnimation["Classification"] = 2] = "Classification";
})(CameraExperienceReticleAnimation || (CameraExperienceReticleAnimation = {}));
/**
 * User feedback structures
 */
export var FeedbackCode;
(function (FeedbackCode) {
  FeedbackCode["CameraDisabled"] = "CAMERA_DISABLED";
  FeedbackCode["CameraGenericError"] = "CAMERA_GENERIC_ERROR";
  FeedbackCode["CameraInUse"] = "CAMERA_IN_USE";
  FeedbackCode["CameraNotAllowed"] = "CAMERA_NOT_ALLOWED";
  FeedbackCode["GenericScanError"] = "GENERIC_SCAN_ERROR";
  FeedbackCode["ScanStarted"] = "SCAN_STARTED";
  FeedbackCode["ScanUnsuccessful"] = "SCAN_UNSUCCESSFUL";
  FeedbackCode["ScanSuccessful"] = "SCAN_SUCCESSFUL";
})(FeedbackCode || (FeedbackCode = {}));
