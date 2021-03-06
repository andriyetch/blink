/**
 * Copyright (c) Microblink Ltd. All rights reserved.
 */
import * as BlinkIDSDK from '@microblink/blinkid-in-browser-sdk';
import { AvailableRecognizers, CameraExperience, EventReady, ImageRecognitionType, RecognitionStatus, SDKError } from './data-structures';
import * as ErrorTypes from './error-structures';
const _IS_IMAGE_CAPTURE = false;
export async function getCameraDevices() {
  const devices = await BlinkIDSDK.getCameraDevices();
  const allDevices = devices.frontCameras.concat(devices.backCameras);
  const finalEntries = allDevices.map((el) => {
    return {
      prettyName: el.label,
      details: el
    };
  });
  return finalEntries;
}
export class SdkService {
  constructor() {
    this.cancelInitiatedFromOutside = false;
    this.showOverlay = false;
    this.eventEmitter$ = document.createElement('a');
  }
  delete() {
    var _a;
    (_a = this.sdk) === null || _a === void 0 ? void 0 : _a.delete();
  }
  initialize(licenseKey, sdkSettings) {
    const loadSettings = new BlinkIDSDK.WasmSDKLoadSettings(licenseKey);
    loadSettings.allowHelloMessage = sdkSettings.allowHelloMessage;
    loadSettings.engineLocation = sdkSettings.engineLocation;
    if (sdkSettings.wasmType) {
      loadSettings.wasmType = sdkSettings.wasmType;
    }
    return new Promise((resolve) => {
      BlinkIDSDK.loadWasmModule(loadSettings)
        .then((sdk) => {
        this.sdk = sdk;
        this.showOverlay = sdk.showOverlay;
        resolve(new EventReady(this.sdk));
      })
        .catch(error => {
        resolve(new SDKError(ErrorTypes.componentErrors.sdkLoadFailed, error));
      });
    });
  }
  checkRecognizers(recognizers) {
    if (!recognizers || !recognizers.length) {
      return {
        status: false,
        message: 'There are no provided recognizers!'
      };
    }
    for (const recognizer of recognizers) {
      if (!this.isRecognizerAvailable(recognizer)) {
        return {
          status: false,
          message: `Recognizer "${recognizer}" doesn't exist!`
        };
      }
      if (recognizer === 'BlinkIdCombinedRecognizer' && recognizers.length > 1) {
        return {
          status: false,
          message: 'Recognizer "BlinkIdCombinedRecognizer" cannot be used in combination with other recognizers!'
        };
      }
    }
    return {
      status: true
    };
  }
  getDesiredCameraExperience(_recognizers = [], _recognizerOptions = {}) {
    if (_recognizers.indexOf('BlinkIdCombinedRecognizer') > -1) {
      return CameraExperience.CardCombined;
    }
    if (_recognizers.indexOf('BlinkIdRecognizer') > -1) {
      return CameraExperience.CardSingleSide;
    }
    return CameraExperience.Barcode;
  }
  async scanFromCamera(configuration, eventCallback) {
    var _a, _b;
    eventCallback({ status: RecognitionStatus.Preparing });
    this.cancelInitiatedFromOutside = false;
    // Prepare terminate mechanism before recognizer and runner instances are created
    this.eventEmitter$.addEventListener('terminate', async () => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      (_b = (_a = this.videoRecognizer) === null || _a === void 0 ? void 0 : _a.cancelRecognition) === null || _b === void 0 ? void 0 : _b.call(_a);
      window.setTimeout(() => { var _a, _b; return (_b = (_a = this.videoRecognizer) === null || _a === void 0 ? void 0 : _a.releaseVideoFeed) === null || _b === void 0 ? void 0 : _b.call(_a); }, 1);
      if (recognizerRunner) {
        try {
          await recognizerRunner.delete();
        }
        catch (error) {
          // Psst, this error should not happen.
        }
      }
      for (const recognizer of recognizers) {
        if (!recognizer) {
          continue;
        }
        if (((_c = recognizer.recognizer) === null || _c === void 0 ? void 0 : _c.objectHandle) > -1) {
          (_e = (_d = recognizer.recognizer).delete) === null || _e === void 0 ? void 0 : _e.call(_d);
        }
        if (((_f = recognizer.successFrame) === null || _f === void 0 ? void 0 : _f.objectHandle) > -1) {
          (_h = (_g = recognizer.successFrame).delete) === null || _h === void 0 ? void 0 : _h.call(_g);
        }
      }
    });
    // Prepare recognizers and runner
    const recognizers = await this.createRecognizers(configuration.recognizers, configuration.recognizerOptions, configuration.successFrame);
    const recognizerRunner = await this.createRecognizerRunner(recognizers, eventCallback);
    try {
      this.videoRecognizer = await BlinkIDSDK.VideoRecognizer.createVideoRecognizerFromCameraStream(configuration.cameraFeed, recognizerRunner, configuration.cameraId);
      eventCallback({ status: RecognitionStatus.Ready });
      await this.videoRecognizer.setVideoRecognitionMode(BlinkIDSDK.VideoRecognitionMode.Recognition);
      this.videoRecognizer.startRecognition(async (recognitionState) => {
        var _a;
        this.videoRecognizer.pauseRecognition();
        eventCallback({ status: RecognitionStatus.Processing });
        if (recognitionState !== BlinkIDSDK.RecognizerResultState.Empty) {
          for (const recognizer of recognizers) {
            const results = await recognizer.recognizer.getResult();
            this.recognizerName = recognizer.recognizer.recognizerName;
            if (!results || results.state === BlinkIDSDK.RecognizerResultState.Empty) {
              eventCallback({
                status: RecognitionStatus.EmptyResultState,
                data: {
                  initiatedByUser: this.cancelInitiatedFromOutside,
                  recognizerName: this.recognizerName
                }
              });
            }
            else {
              const recognitionResults = {
                recognizer: results,
                recognizerName: this.recognizerName
              };
              if (recognizer.successFrame) {
                const successFrameResults = await recognizer.successFrame.getResult();
                if (successFrameResults && successFrameResults.state !== BlinkIDSDK.RecognizerResultState.Empty) {
                  recognitionResults.successFrame = successFrameResults;
                }
              }
              recognitionResults.imageCapture = _IS_IMAGE_CAPTURE;
              if ((_a = configuration.recognizerOptions) === null || _a === void 0 ? void 0 : _a.returnSignedJSON) {
                recognitionResults.resultSignedJSON = await recognizer.recognizer.toSignedJSON();
              }
              const scanData = {
                result: recognitionResults,
                initiatedByUser: this.cancelInitiatedFromOutside,
                imageCapture: _IS_IMAGE_CAPTURE
              };
              eventCallback({
                status: RecognitionStatus.ScanSuccessful,
                data: scanData
              });
              break;
            }
          }
        }
        else {
          eventCallback({
            status: RecognitionStatus.EmptyResultState,
            data: {
              initiatedByUser: this.cancelInitiatedFromOutside,
              recognizerName: ''
            }
          });
        }
        window.setTimeout(() => void this.cancelRecognition(), 400);
      }, configuration.recognitionTimeout);
    }
    catch (error) {
      if (error && ((_a = error.details) === null || _a === void 0 ? void 0 : _a.reason)) {
        const reason = (_b = error.details) === null || _b === void 0 ? void 0 : _b.reason;
        switch (reason) {
          case BlinkIDSDK.NotSupportedReason.MediaDevicesNotSupported:
            eventCallback({ status: RecognitionStatus.NoSupportForMediaDevices });
            break;
          case BlinkIDSDK.NotSupportedReason.CameraNotFound:
            eventCallback({ status: RecognitionStatus.CameraNotFound });
            break;
          case BlinkIDSDK.NotSupportedReason.CameraNotAllowed:
            eventCallback({ status: RecognitionStatus.CameraNotAllowed });
            break;
          case BlinkIDSDK.NotSupportedReason.CameraInUse:
            eventCallback({ status: RecognitionStatus.CameraInUse });
            break;
          default:
            eventCallback({ status: RecognitionStatus.UnableToAccessCamera });
        }
        console.warn('VideoRecognizerError', error.name, '[' + reason + ']:', error.message);
      }
      else {
        eventCallback({ status: RecognitionStatus.UnknownError });
      }
      void this.cancelRecognition();
    }
  }
  async flipCamera() {
    await this.videoRecognizer.flipCamera();
  }
  isCameraFlipped() {
    if (!this.videoRecognizer) {
      return false;
    }
    return this.videoRecognizer.isCameraFlipped();
  }
  isScanFromImageAvailable(_recognizers = [], _recognizerOptions = {}) {
    if (_recognizers.indexOf('BlinkIdCombinedRecognizer') > -1) {
      return false;
    }
    return true;
  }
  getScanFromImageType(_recognizers = [], _recognizerOptions = {}) {
    if (_recognizers.indexOf('BlinkIdCombinedRecognizer') > -1) {
      return ImageRecognitionType.Combined;
    }
    return ImageRecognitionType.Single;
  }
  async scanFromImage(configuration, eventCallback) {
    var _a;
    eventCallback({ status: RecognitionStatus.Preparing });
    const recognizers = await this.createRecognizers(configuration.recognizers, configuration.recognizerOptions);
    const recognizerRunner = await this.createRecognizerRunner(recognizers, eventCallback);
    const handleTerminate = async () => {
      var _a, _b, _c;
      this.eventEmitter$.removeEventListener('terminate', handleTerminate);
      if (recognizerRunner) {
        try {
          await recognizerRunner.delete();
        }
        catch (error) {
          // Psst, this error should not happen.
        }
      }
      for (const recognizer of recognizers) {
        if (!recognizer) {
          continue;
        }
        if (((_a = recognizer.recognizer) === null || _a === void 0 ? void 0 : _a.objectHandle) > -1) {
          (_c = (_b = recognizer.recognizer).delete) === null || _c === void 0 ? void 0 : _c.call(_b);
        }
      }
      this.eventEmitter$.dispatchEvent(new Event('terminate:done'));
    };
    this.eventEmitter$.addEventListener('terminate', handleTerminate);
    // Get image file
    if (!configuration.file || !RegExp(/^image\//).exec(configuration.file.type)) {
      eventCallback({ status: RecognitionStatus.NoImageFileFound });
      window.setTimeout(() => void this.cancelRecognition(), 500);
      return;
    }
    const file = configuration.file;
    const imageElement = new Image();
    imageElement.src = URL.createObjectURL(file);
    await imageElement.decode();
    const imageFrame = BlinkIDSDK.captureFrame(imageElement);
    // Get results
    eventCallback({ status: RecognitionStatus.Processing });
    const processResult = await recognizerRunner.processImage(imageFrame);
    if (processResult !== BlinkIDSDK.RecognizerResultState.Empty) {
      for (const recognizer of recognizers) {
        const results = await recognizer.recognizer.getResult();
        if (!results || results.state === BlinkIDSDK.RecognizerResultState.Empty) {
          eventCallback({
            status: RecognitionStatus.EmptyResultState,
            data: {
              initiatedByUser: this.cancelInitiatedFromOutside,
              recognizerName: recognizer.name
            }
          });
        }
        else {
          const recognitionResults = {
            recognizer: results,
            imageCapture: _IS_IMAGE_CAPTURE,
            recognizerName: recognizer.name
          };
          if ((_a = configuration.recognizerOptions) === null || _a === void 0 ? void 0 : _a.returnSignedJSON) {
            recognitionResults.resultSignedJSON = await recognizer.recognizer.toSignedJSON();
          }
          eventCallback({
            status: RecognitionStatus.ScanSuccessful,
            data: recognitionResults
          });
          break;
        }
      }
    }
    else {
      // If necessary, scan the image once again with different settings
      if (configuration.thoroughScan &&
        configuration.recognizers.indexOf('BlinkIdRecognizer') > -1) {
        const c = configuration;
        c.thoroughScan = false;
        c.recognizerOptions = c.recognizerOptions || {};
        for (const r of c.recognizers) {
          c.recognizerOptions[r] = c.recognizerOptions[r] || {};
          c.recognizerOptions[r].scanCroppedDocumentImage = !!c.recognizerOptions[r].scanCroppedDocumentImage;
          c.recognizerOptions[r].scanCroppedDocumentImage = !c.recognizerOptions[r].scanCroppedDocumentImage;
        }
        const eventHandler = (recognitionEvent) => eventCallback(recognitionEvent);
        const handleTerminateDone = () => {
          this.eventEmitter$.removeEventListener('terminate:done', handleTerminateDone);
          this.scanFromImage(configuration, eventHandler);
        };
        this.eventEmitter$.addEventListener('terminate:done', handleTerminateDone);
        window.setTimeout(() => void this.cancelRecognition(), 500);
        return;
      }
      eventCallback({
        status: RecognitionStatus.EmptyResultState,
        data: {
          initiatedByUser: this.cancelInitiatedFromOutside,
          recognizerName: ''
        }
      });
    }
    window.setTimeout(() => void this.cancelRecognition(), 500);
  }
  async scanFromImageCombined(configuration, eventCallback) {
    var _a;
    eventCallback({ status: RecognitionStatus.Preparing });
    const recognizers = await this.createRecognizers(configuration.recognizers, configuration.recognizerOptions);
    const recognizerRunner = await this.createRecognizerRunner(recognizers, eventCallback);
    const handleTerminate = async () => {
      var _a, _b, _c;
      this.eventEmitter$.removeEventListener('terminate', handleTerminate);
      if (recognizerRunner) {
        try {
          await recognizerRunner.delete();
        }
        catch (error) {
          // Psst, this error should not happen.
        }
      }
      for (const recognizer of recognizers) {
        if (!recognizer) {
          continue;
        }
        if (((_a = recognizer.recognizer) === null || _a === void 0 ? void 0 : _a.objectHandle) > -1) {
          (_c = (_b = recognizer.recognizer).delete) === null || _c === void 0 ? void 0 : _c.call(_b);
        }
      }
      this.eventEmitter$.dispatchEvent(new Event('terminate:done'));
    };
    this.eventEmitter$.addEventListener('terminate', handleTerminate);
    if (!configuration.firstFile) {
      eventCallback({ status: RecognitionStatus.NoFirstImageFileFound });
      window.setTimeout(() => void this.cancelRecognition(), 500);
      return;
    }
    if (!configuration.secondFile) {
      eventCallback({ status: RecognitionStatus.NoSecondImageFileFound });
      window.setTimeout(() => void this.cancelRecognition(), 500);
      return;
    }
    // Get results
    eventCallback({ status: RecognitionStatus.Processing });
    const imageElement = new Image();
    imageElement.src = URL.createObjectURL(configuration.firstFile);
    await imageElement.decode();
    const firstFrame = BlinkIDSDK.captureFrame(imageElement);
    const firstProcessResult = await recognizerRunner.processImage(firstFrame);
    if (firstProcessResult !== BlinkIDSDK.RecognizerResultState.Empty) {
      const imageElement = new Image();
      imageElement.src = URL.createObjectURL(configuration.secondFile);
      await imageElement.decode();
      const secondFrame = BlinkIDSDK.captureFrame(imageElement);
      const secondProcessResult = await recognizerRunner.processImage(secondFrame);
      if (secondProcessResult !== BlinkIDSDK.RecognizerResultState.Empty) {
        for (const recognizer of recognizers) {
          const results = await recognizer.recognizer.getResult();
          if (!results || results.state === BlinkIDSDK.RecognizerResultState.Empty) {
            eventCallback({
              status: RecognitionStatus.EmptyResultState,
              data: {
                initiatedByUser: this.cancelInitiatedFromOutside,
                recognizerName: recognizer.name
              }
            });
          }
          else {
            const recognitionResults = {
              recognizer: results,
              imageCapture: _IS_IMAGE_CAPTURE,
              recognizerName: recognizer.name
            };
            if ((_a = configuration.recognizerOptions) === null || _a === void 0 ? void 0 : _a.returnSignedJSON) {
              recognitionResults.resultSignedJSON = await recognizer.recognizer.toSignedJSON();
            }
            eventCallback({
              status: RecognitionStatus.ScanSuccessful,
              data: recognitionResults
            });
            break;
          }
        }
      }
      else {
        eventCallback({
          status: RecognitionStatus.EmptyResultState,
          data: {
            initiatedByUser: this.cancelInitiatedFromOutside,
            recognizerName: ''
          }
        });
      }
    }
    else {
      // If necessary, scan the image once again with different settings
      if (configuration.thoroughScan &&
        configuration.recognizers.indexOf('BlinkIdCombinedRecognizer') > -1) {
        const c = configuration;
        c.thoroughScan = false;
        c.recognizerOptions = c.recognizerOptions || {};
        for (const r of c.recognizers) {
          c.recognizerOptions[r] = c.recognizerOptions[r] || {};
          c.recognizerOptions[r].scanCroppedDocumentImage = !!c.recognizerOptions[r].scanCroppedDocumentImage;
          c.recognizerOptions[r].scanCroppedDocumentImage = !c.recognizerOptions[r].scanCroppedDocumentImage;
        }
        const eventHandler = (recognitionEvent) => eventCallback(recognitionEvent);
        const handleTerminateDone = () => {
          this.eventEmitter$.removeEventListener('terminate:done', handleTerminateDone);
          this.scanFromImageCombined(configuration, eventHandler);
        };
        this.eventEmitter$.addEventListener('terminate:done', handleTerminateDone);
        window.setTimeout(() => void this.cancelRecognition(), 500);
        return;
      }
      eventCallback({
        status: RecognitionStatus.EmptyResultState,
        data: {
          initiatedByUser: this.cancelInitiatedFromOutside,
          recognizerName: ''
        }
      });
    }
    window.setTimeout(() => void this.cancelRecognition(), 500);
  }
  async stopRecognition() {
    void await this.cancelRecognition(true);
  }
  async resumeRecognition() {
    this.videoRecognizer.resumeRecognition(true);
  }
  changeCameraDevice(camera) {
    return new Promise((resolve) => {
      this.videoRecognizer.changeCameraDevice(camera)
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }
  getProductIntegrationInfo() {
    return this.sdk.getProductIntegrationInfo();
  }
  //////////////////////////////////////////////////////////////////////////////
  //
  // PRIVATE METHODS
  isRecognizerAvailable(recognizer) {
    return !!AvailableRecognizers[recognizer];
  }
  async createRecognizers(recognizers, recognizerOptions, successFrame = false) {
    const pureRecognizers = [];
    for (const recognizer of recognizers) {
      const instance = await BlinkIDSDK[AvailableRecognizers[recognizer]](this.sdk);
      pureRecognizers.push(instance);
    }
    if (recognizerOptions && Object.keys(recognizerOptions).length > 0) {
      for (const recognizer of pureRecognizers) {
        const settings = await recognizer.currentSettings();
        let updated = false;
        if (!recognizerOptions[recognizer.recognizerName] ||
          Object.keys(recognizerOptions[recognizer.recognizerName]).length < 1) {
          continue;
        }
        for (const [key, value] of Object.entries(recognizerOptions[recognizer.recognizerName])) {
          if (key in settings) {
            settings[key] = value;
            updated = true;
          }
        }
        if (updated) {
          await recognizer.updateSettings(settings);
        }
      }
    }
    const recognizerInstances = [];
    for (let i = 0; i < pureRecognizers.length; ++i) {
      const recognizer = pureRecognizers[i];
      const instance = { name: recognizers[i], recognizer };
      if (successFrame) {
        const successFrameGrabber = await BlinkIDSDK.createSuccessFrameGrabberRecognizer(this.sdk, recognizer);
        instance.successFrame = successFrameGrabber;
      }
      recognizerInstances.push(instance);
    }
    return recognizerInstances;
  }
  async createRecognizerRunner(recognizers, eventCallback) {
    const metadataCallbacks = {
      onDetectionFailed: () => eventCallback({ status: RecognitionStatus.DetectionFailed }),
      onQuadDetection: (quad) => {
        eventCallback({ status: RecognitionStatus.DetectionStatusChange, data: quad });
        const detectionStatus = quad.detectionStatus;
        switch (detectionStatus) {
          case BlinkIDSDK.DetectionStatus.Fail:
            eventCallback({ status: RecognitionStatus.DetectionStatusSuccess });
            break;
          case BlinkIDSDK.DetectionStatus.Success:
            eventCallback({ status: RecognitionStatus.DetectionStatusSuccess });
            break;
          case BlinkIDSDK.DetectionStatus.CameraTooHigh:
            eventCallback({ status: RecognitionStatus.DetectionStatusCameraTooHigh });
            break;
          case BlinkIDSDK.DetectionStatus.FallbackSuccess:
            eventCallback({ status: RecognitionStatus.DetectionStatusFallbackSuccess });
            break;
          case BlinkIDSDK.DetectionStatus.Partial:
            eventCallback({ status: RecognitionStatus.DetectionStatusPartial });
            break;
          case BlinkIDSDK.DetectionStatus.CameraAtAngle:
            eventCallback({ status: RecognitionStatus.DetectionStatusCameraAtAngle });
            break;
          case BlinkIDSDK.DetectionStatus.CameraTooNear:
            eventCallback({ status: RecognitionStatus.DetectionStatusCameraTooNear });
            break;
          case BlinkIDSDK.DetectionStatus.DocumentTooCloseToEdge:
            eventCallback({ status: RecognitionStatus.DetectionStatusDocumentTooCloseToEdge });
            break;
          default:
          // Send nothing
        }
      }
    };
    const blinkIdGeneric = recognizers.find(el => el.recognizer.recognizerName === 'BlinkIdRecognizer');
    const blinkIdCombined = recognizers.find(el => el.recognizer.recognizerName === 'BlinkIdCombinedRecognizer');
    if (blinkIdGeneric || blinkIdCombined) {
      for (const el of recognizers) {
        if (el.recognizer.recognizerName === 'BlinkIdRecognizer' ||
          el.recognizer.recognizerName === 'BlinkIdCombinedRecognizer') {
          const settings = await el.recognizer.currentSettings();
          settings.barcodeScanningStartedCallback = () => eventCallback({ status: RecognitionStatus.BarcodeScanningStarted });
          settings.classifierCallback = (supported) => {
            eventCallback({ status: RecognitionStatus.DocumentClassified, data: supported });
          };
          await el.recognizer.updateSettings(settings);
        }
      }
    }
    if (blinkIdCombined) {
      metadataCallbacks.onFirstSideResult = () => eventCallback({ status: RecognitionStatus.OnFirstSideResult });
    }
    const recognizerRunner = await BlinkIDSDK.createRecognizerRunner(this.sdk, recognizers.map((el) => el.successFrame || el.recognizer), false, metadataCallbacks);
    return recognizerRunner;
  }
  async cancelRecognition(initiatedFromOutside = false) {
    this.cancelInitiatedFromOutside = initiatedFromOutside;
    this.eventEmitter$.dispatchEvent(new Event('terminate'));
  }
}
