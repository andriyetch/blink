/**
 * Copyright (c) Microblink Ltd. All rights reserved.
 */
import { Component, Element, Event, Host, h, Prop, Method } from '@stencil/core';
import { SdkService } from '../../utils/sdk.service';
import { TranslationService } from '../../utils/translation.service';
import * as GenericHelpers from '../../utils/generic.helpers';
export class BlinkidInBrowser {
  constructor() {
    this.blocked = false;
    /**
     * Write a hello message to the browser console when license check is successfully performed.
     *
     * Hello message will contain the name and version of the SDK, which are required information for all support
     * tickets.
     *
     * Default value is true.
     */
    this.allowHelloMessage = true;
    /**
     * Absolute location of WASM and related JS/data files. Useful when resource files should be loaded over CDN, or
     * when web frameworks/libraries are used which store resources in specific locations, e.g. inside "assets" folder.
     *
     * Important: if engine is hosted on another origin, CORS must be enabled between two hosts. That is, server where
     * engine is hosted must have 'Access-Control-Allow-Origin' header for the location of the web app.
     *
     * Important: SDK and WASM resources must be from the same version of package.
     *
     * Default value is empty string, i.e. "". In case of empty string, value of "window.location.origin" property is
     * going to be used.
     */
    this.engineLocation = '';
    /**
     * Defines the type of the WebAssembly build that will be loaded. If omitted, SDK will determine
     * the best possible WebAssembly build which should be loaded based on the browser support.
     *
     * Available WebAssembly builds:
     *
     * - 'BASIC'
     * - 'ADVANCED'
     * - 'ADVANCED_WITH_THREADS'
     *
     * For more information about different WebAssembly builds, check out the `src/MicroblinkSDK/WasmType.ts` file.
     */
    this.wasmType = '';
    /**
     * Set to 'true' if success frame should be included in final scanning results.
     *
     * Default value is 'false'.
     */
    this.includeSuccessFrame = false;
    /**
     * Set to 'false' if component should not enable drag and drop functionality.
     *
     * Default value is 'true'.
     */
    this.enableDrag = true;
    /**
     * If set to 'true', UI component will not display feedback, i.e. information and error messages.
     *
     * Setting this attribute to 'false' won't disable 'scanError' and 'scanInfo' events.
     *
     * Default value is 'false'.
     */
    this.hideFeedback = false;
    /**
     * If set to 'true', UI component will become visible after successful SDK initialization. Also, error screen
     * is not going to be displayed in case of initialization error.
     *
     * If set to 'false', loading and error screens of the UI component will be visible during initialization and in case
     * of an error.
     *
     * Default value is 'false'.
     */
    this.hideLoadingAndErrorUi = false;
    /**
     * Set to 'true' if scan from camera should be enabled. If set to 'true' and camera is not available or disabled,
     * related button will be visible but disabled.
     *
     * Default value is 'true'.
     */
    this.scanFromCamera = true;
    /**
     * Set to 'true' if scan from image should be enabled.
     *
     * Default value is 'true'.
     */
    this.scanFromImage = true;
    /**
     * Set to 'true' if scan from image should execute twice in case that first result is empty.
     *
     * If enabled, this option will add/remove 'scanCroppedDocumentImage' recognizer option for the
     * second scan action.
     */
    this.thoroughScanFromImage = false;
    /**
     * Define whether to use 'FULLSCREEN' or 'INLINE' gallery overlay type.
     *
     * If 'FULLSCREEN' is used, when a user selects an image from which data should be extracted, an overlay will pop up
     * and cover the whole screen.
     *
     * On the other hand, if 'INLINE' is used, there is no overlay but rather a 'Processing' message inside the UI
     * component.
     *
     * Default value is 'INLINE'.
     */
    this.galleryOverlayType = 'INLINE';
    /**
     * Define whether to use 'FULLSCREEN' or 'INLINE' gallery dropdown type.
     *
     * If 'FULLSCREEN' is used, when a user drags an image over the UI component, an overlay will pop up and cover the
     * whole screen.
     *
     * If 'INLINE' is used, there is no fullscreen overlay, but rather the overlay is restricted to the size of the UI
     * component.
     *
     * Default value is 'INLINE'.
     */
    this.galleryDropType = 'INLINE';
    /**
     * Set to 'true' if text labels should be displayed below action buttons.
     *
     * Default value is 'false'.
     */
    this.showActionLabels = false;
    /**
     * Set to 'true' if modal window should be displayed in case of an error.
     *
     * Default value is 'false'.
     */
    this.showModalWindows = false;
    /**
     * Set to 'true' if for Barcode scanning camera feedback message should be displayed on camera screen.
     *
     * Default value is 'false'.
     */
    this.showCameraFeedbackBarcodeMessage = false;
    /**
     * Camera device ID passed from root component.
     *
     * Client can choose which camera to turn on if array of cameras exists.
     *
     */
    this.cameraId = null;
  }
  /**
   * Control UI state of camera overlay.
   *
   * Possible values are 'ERROR' | 'LOADING' | 'NONE' | 'SUCCESS'.
   *
   * In case of state `ERROR` and if `showModalWindows` is set to `true`, modal window
   * with error message will be displayed. Otherwise, UI will close.
   */
  async setUiState(state) {
    this.mbComponentEl.setUiState(state);
  }
  /**
   * Starts camera scan using camera overlay with usage instructions.
   */
  async startCameraScan() {
    this.mbComponentEl.startCameraScan();
  }
  /**
   * Starts image scan, emits results from provided file.
   *
   * @param file File to scan
   */
  async startImageScan(file) {
    this.mbComponentEl.startImageScan(file);
  }
  /**
   * Starts combined image scan, emits results from provided files.
   *
   * @param firstFile File to scan as first image
   * @param secondFile File to scan as second image
   */
  async startCombinedImageScan(firstFile, secondFile) {
    this.mbComponentEl.startCombinedImageScan(firstFile, secondFile);
  }
  /**
   * Show message alongside UI component.
   *
   * Possible values for `state` are 'FEEDBACK_ERROR' | 'FEEDBACK_INFO' | 'FEEDBACK_OK'.
   */
  async setUiMessage(state, message) {
    this.feedbackEl.show({ state, message });
  }
  /**
   * Get information about product integration.
   */
  async getProductIntegrationInfo() {
    var _a;
    return (_a = this.sdkService) === null || _a === void 0 ? void 0 : _a.getProductIntegrationInfo();
  }
  componentWillLoad() {
    this.init();
  }
  componentWillUpdate() {
    var _a;
    if (this.blocked) {
      return;
    }
    (_a = this.sdkService) === null || _a === void 0 ? void 0 : _a.delete();
    this.init();
  }
  disconnectedCallback() {
    var _a;
    (_a = this.sdkService) === null || _a === void 0 ? void 0 : _a.delete();
  }
  init() {
    const rawRecognizers = GenericHelpers.stringToArray(this.rawRecognizers);
    this.finalRecognizers = this.recognizers ? this.recognizers : rawRecognizers;
    const rawTranslations = GenericHelpers.stringToObject(this.rawTranslations);
    this.finalTranslations = this.translations ? this.translations : rawTranslations;
    this.translationService = new TranslationService(this.finalTranslations || {});
    this.sdkService = new SdkService();
  }
  render() {
    return (h(Host, null,
      h("mb-container", null,
        h("mb-component", { dir: this.hostEl.getAttribute('dir'), ref: el => this.mbComponentEl = el, allowHelloMessage: this.allowHelloMessage, engineLocation: this.engineLocation, licenseKey: this.licenseKey, wasmType: this.wasmType, recognizers: this.finalRecognizers, recognizerOptions: this.recognizerOptions, recognitionTimeout: this.recognitionTimeout, includeSuccessFrame: this.includeSuccessFrame, enableDrag: this.enableDrag, hideLoadingAndErrorUi: this.hideLoadingAndErrorUi, scanFromCamera: this.scanFromCamera, scanFromImage: this.scanFromImage, thoroughScanFromImage: this.thoroughScanFromImage, galleryOverlayType: this.galleryOverlayType, galleryDropType: this.galleryDropType, showActionLabels: this.showActionLabels, showModalWindows: this.showModalWindows, showCameraFeedbackBarcodeMessage: this.showCameraFeedbackBarcodeMessage, iconCameraDefault: this.iconCameraDefault, iconCameraActive: this.iconCameraActive, iconGalleryDefault: this.iconGalleryDefault, iconGalleryActive: this.iconGalleryActive, iconInvalidFormat: this.iconInvalidFormat, iconSpinnerScreenLoading: this.iconSpinnerScreenLoading, iconSpinnerFromGalleryExperience: this.iconSpinnerFromGalleryExperience, iconGalleryScanningCompleted: this.iconGalleryScanningCompleted, sdkService: this.sdkService, translationService: this.translationService, cameraId: this.cameraId, onBlock: (ev) => { this.blocked = ev.detail; }, onFeedback: (ev) => this.feedbackEl.show(ev.detail) }),
        h("mb-feedback", { dir: this.hostEl.getAttribute('dir'), visible: !this.hideFeedback, ref: el => this.feedbackEl = el }))));
  }
  static get is() { return "blinkid-in-browser"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["blinkid-in-browser.scss"]
  }; }
  static get styleUrls() { return {
    "$": ["blinkid-in-browser.css"]
  }; }
  static get properties() { return {
    "allowHelloMessage": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Write a hello message to the browser console when license check is successfully performed.\n\nHello message will contain the name and version of the SDK, which are required information for all support\ntickets.\n\nDefault value is true."
      },
      "attribute": "allow-hello-message",
      "reflect": false,
      "defaultValue": "true"
    },
    "engineLocation": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Absolute location of WASM and related JS/data files. Useful when resource files should be loaded over CDN, or\nwhen web frameworks/libraries are used which store resources in specific locations, e.g. inside \"assets\" folder.\n\nImportant: if engine is hosted on another origin, CORS must be enabled between two hosts. That is, server where\nengine is hosted must have 'Access-Control-Allow-Origin' header for the location of the web app.\n\nImportant: SDK and WASM resources must be from the same version of package.\n\nDefault value is empty string, i.e. \"\". In case of empty string, value of \"window.location.origin\" property is\ngoing to be used."
      },
      "attribute": "engine-location",
      "reflect": false,
      "defaultValue": "''"
    },
    "licenseKey": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "License key which is going to be used to unlock WASM library.\n\nKeep in mind that UI component will reinitialize every time license key is changed."
      },
      "attribute": "license-key",
      "reflect": false
    },
    "wasmType": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Defines the type of the WebAssembly build that will be loaded. If omitted, SDK will determine\nthe best possible WebAssembly build which should be loaded based on the browser support.\n\nAvailable WebAssembly builds:\n\n- 'BASIC'\n- 'ADVANCED'\n- 'ADVANCED_WITH_THREADS'\n\nFor more information about different WebAssembly builds, check out the `src/MicroblinkSDK/WasmType.ts` file."
      },
      "attribute": "wasm-type",
      "reflect": false,
      "defaultValue": "''"
    },
    "rawRecognizers": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "List of recognizers which should be used.\n\nAvailable recognizers for BlinkID:\n\n- IdBarcodeRecognizer\n- BlinkIdRecognizer\n- BlinkIdCombinedRecognizer\n   - cannot be used in combination with other recognizers\n   - when defined, scan from image is not available\n\nRecognizers can be defined by setting HTML attribute \"recognizers\", for example:\n\n`<blinkid-in-browser recognizers=\"IdBarcodeRecognizer,BlinkIdRecognizer\"></blinkid-in-browser>`"
      },
      "attribute": "recognizers",
      "reflect": false
    },
    "recognizers": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "Array<string>",
        "resolved": "string[]",
        "references": {
          "Array": {
            "location": "global"
          }
        }
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "List of recognizers which should be used.\n\nAvailable recognizers for BlinkID:\n\n- IdBarcodeRecognizer\n- BlinkIdRecognizer\n- BlinkIdCombinedRecognizer\n   - cannot be used in combination with other recognizers\n   - when defined, scan from image is not available\n\nRecognizers can be defined by setting JS property \"recognizers\", for example:\n\n```\nconst blinkId = document.querySelector('blinkid-in-browser');\nblinkId.recognizers = ['IdBarcodeRecognizer', 'BlinkIdRecognizer'];\n```"
      }
    },
    "recognizerOptions": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "{ [key: string]: any }",
        "resolved": "{ [key: string]: any; }",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Specify recognizer options. This option can only bet set as a JavaScript property.\n\nPass an object to `recognizerOptions` property where each key represents a recognizer, while\nthe value represents desired recognizer options.\n\n```\nblinkId.recognizerOptions = {\n  'BlinkIdRecognizer': {\n    'returnFullDocumentImage': true,\n\n    // When setting values for enums, check the source code to see possible values.\n    // For AnonymizationMode we can see the list of possible values in\n    // `src/Recognizers/BlinkID/Generic/AnonymizationMode.ts` file.\n    'anonymizationMode': 0\n  }\n}\n```\n\nFor a full list of available recognizer options see source code of a recognizer. For example,\nlist of available recognizer options for BlinkIdRecognizer can be seen in the\n`src/Recognizers/BlinkID/Generic/BlinkIdRecognizer.ts` file."
      }
    },
    "recognitionTimeout": {
      "type": "number",
      "mutable": false,
      "complexType": {
        "original": "number",
        "resolved": "number",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Amount of time in milliseconds before the recognition process is cancelled regardless of\nwhether recognition was successful or not.\n\nThis setting applies only to video recognition.\n\nKeep in mind that the timer starts after the first non-empty result. This behaviour ensures\nthat the user has enough time to take out the document and place it in front of the camera\ndevice."
      },
      "attribute": "recognition-timeout",
      "reflect": false
    },
    "includeSuccessFrame": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Set to 'true' if success frame should be included in final scanning results.\n\nDefault value is 'false'."
      },
      "attribute": "include-success-frame",
      "reflect": false,
      "defaultValue": "false"
    },
    "enableDrag": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Set to 'false' if component should not enable drag and drop functionality.\n\nDefault value is 'true'."
      },
      "attribute": "enable-drag",
      "reflect": false,
      "defaultValue": "true"
    },
    "hideFeedback": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "If set to 'true', UI component will not display feedback, i.e. information and error messages.\n\nSetting this attribute to 'false' won't disable 'scanError' and 'scanInfo' events.\n\nDefault value is 'false'."
      },
      "attribute": "hide-feedback",
      "reflect": false,
      "defaultValue": "false"
    },
    "hideLoadingAndErrorUi": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "If set to 'true', UI component will become visible after successful SDK initialization. Also, error screen\nis not going to be displayed in case of initialization error.\n\nIf set to 'false', loading and error screens of the UI component will be visible during initialization and in case\nof an error.\n\nDefault value is 'false'."
      },
      "attribute": "hide-loading-and-error-ui",
      "reflect": false,
      "defaultValue": "false"
    },
    "scanFromCamera": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Set to 'true' if scan from camera should be enabled. If set to 'true' and camera is not available or disabled,\nrelated button will be visible but disabled.\n\nDefault value is 'true'."
      },
      "attribute": "scan-from-camera",
      "reflect": false,
      "defaultValue": "true"
    },
    "scanFromImage": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Set to 'true' if scan from image should be enabled.\n\nDefault value is 'true'."
      },
      "attribute": "scan-from-image",
      "reflect": false,
      "defaultValue": "true"
    },
    "thoroughScanFromImage": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Set to 'true' if scan from image should execute twice in case that first result is empty.\n\nIf enabled, this option will add/remove 'scanCroppedDocumentImage' recognizer option for the\nsecond scan action."
      },
      "attribute": "thorough-scan-from-image",
      "reflect": false,
      "defaultValue": "false"
    },
    "galleryOverlayType": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "'FULLSCREEN' | 'INLINE'",
        "resolved": "\"FULLSCREEN\" | \"INLINE\"",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Define whether to use 'FULLSCREEN' or 'INLINE' gallery overlay type.\n\nIf 'FULLSCREEN' is used, when a user selects an image from which data should be extracted, an overlay will pop up\nand cover the whole screen.\n\nOn the other hand, if 'INLINE' is used, there is no overlay but rather a 'Processing' message inside the UI\ncomponent.\n\nDefault value is 'INLINE'."
      },
      "attribute": "gallery-overlay-type",
      "reflect": false,
      "defaultValue": "'INLINE'"
    },
    "galleryDropType": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "'FULLSCREEN' | 'INLINE'",
        "resolved": "\"FULLSCREEN\" | \"INLINE\"",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Define whether to use 'FULLSCREEN' or 'INLINE' gallery dropdown type.\n\nIf 'FULLSCREEN' is used, when a user drags an image over the UI component, an overlay will pop up and cover the\nwhole screen.\n\nIf 'INLINE' is used, there is no fullscreen overlay, but rather the overlay is restricted to the size of the UI\ncomponent.\n\nDefault value is 'INLINE'."
      },
      "attribute": "gallery-drop-type",
      "reflect": false,
      "defaultValue": "'INLINE'"
    },
    "showActionLabels": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Set to 'true' if text labels should be displayed below action buttons.\n\nDefault value is 'false'."
      },
      "attribute": "show-action-labels",
      "reflect": false,
      "defaultValue": "false"
    },
    "showModalWindows": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Set to 'true' if modal window should be displayed in case of an error.\n\nDefault value is 'false'."
      },
      "attribute": "show-modal-windows",
      "reflect": false,
      "defaultValue": "false"
    },
    "showCameraFeedbackBarcodeMessage": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Set to 'true' if for Barcode scanning camera feedback message should be displayed on camera screen.\n\nDefault value is 'false'."
      },
      "attribute": "show-camera-feedback-barcode-message",
      "reflect": false,
      "defaultValue": "false"
    },
    "rawTranslations": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Set custom translations for UI component. List of available translation keys can be found in\n`src/utils/translation.service.ts` file."
      },
      "attribute": "translations",
      "reflect": false
    },
    "translations": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "{ [key: string]: string }",
        "resolved": "{ [key: string]: string; }",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Set custom translations for UI component. List of available translation keys can be found in\n`src/utils/translation.service.ts` file."
      }
    },
    "iconCameraDefault": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Provide alternative camera icon.\n\nEvery value that is placed here is passed as a value of `src` attribute to <img> element. This attribute can be\nused to provide location, base64 or any URL of alternative camera icon.\n\nImage is scaled to 20x20 pixels."
      },
      "attribute": "icon-camera-default",
      "reflect": false
    },
    "iconCameraActive": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Hover state of iconCameraDefault."
      },
      "attribute": "icon-camera-active",
      "reflect": false
    },
    "iconGalleryDefault": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Provide alternative gallery icon. This icon is also used during drag and drop action.\n\nEvery value that is placed here is passed as a value of `src` attribute to <img> element. This attribute can be\nused to provide location, base64 or any URL of alternative gallery icon.\n\nImage is scaled to 20x20 pixels. In drag and drop dialog image is scaled to 24x24 pixels."
      },
      "attribute": "icon-gallery-default",
      "reflect": false
    },
    "iconGalleryActive": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Hover state of iconGalleryDefault."
      },
      "attribute": "icon-gallery-active",
      "reflect": false
    },
    "iconInvalidFormat": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Provide alternative invalid format icon which is used during drag and drop action.\n\nEvery value that is placed here is passed as a value of `src` attribute to <img> element. This attribute can be\nused to provide location, base64 or any URL of alternative icon.\n\nImage is scaled to 24x24 pixels."
      },
      "attribute": "icon-invalid-format",
      "reflect": false
    },
    "iconSpinnerScreenLoading": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Provide alternative loading icon. CSS rotation is applied to this icon.\n\nEvery value that is placed here is passed as a value of `src` attribute to <img> element. This attribute can be\nused to provide location, base64 or any URL of alternative icon.\n\nImage is scaled to 24x24 pixels."
      },
      "attribute": "icon-spinner-screen-loading",
      "reflect": false
    },
    "iconSpinnerFromGalleryExperience": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Provide alternative loading icon. CSS rotation is applied to this icon.\n\nEvery value that is placed here is passed as a value of `src` attribute to <img> element. This attribute can be\nused to provide location, base64 or any URL of alternative icon.\n\nImage is scaled to 24x24 pixels."
      },
      "attribute": "icon-spinner-from-gallery-experience",
      "reflect": false
    },
    "iconGalleryScanningCompleted": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Provide alternative completed icon. This icon is used when gallery scanning process is done, in case that\n`galleryOverlayType` property is set to `INLINE`.\n\nEvery value that is placed here is passed as a value of `src` attribute to <img> element. This attribute can be\nused to provide location, base64 or any URL of alternative icon.\n\nImage is scaled to 24x24 pixels."
      },
      "attribute": "icon-gallery-scanning-completed",
      "reflect": false
    },
    "cameraId": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string | null",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Camera device ID passed from root component.\n\nClient can choose which camera to turn on if array of cameras exists."
      },
      "attribute": "camera-id",
      "reflect": false,
      "defaultValue": "null"
    }
  }; }
  static get events() { return [{
      "method": "fatalError",
      "name": "fatalError",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Event which is emitted during initialization of UI component.\n\nEach event contains `code` property which has deatils about fatal errror."
      },
      "complexType": {
        "original": "SDKError",
        "resolved": "SDKError",
        "references": {
          "SDKError": {
            "location": "import",
            "path": "../../utils/data-structures"
          }
        }
      }
    }, {
      "method": "ready",
      "name": "ready",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Event which is emitted when UI component is successfully initialized and ready for use."
      },
      "complexType": {
        "original": "EventReady",
        "resolved": "EventReady",
        "references": {
          "EventReady": {
            "location": "import",
            "path": "../../utils/data-structures"
          }
        }
      }
    }, {
      "method": "scanError",
      "name": "scanError",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Event which is emitted during or immediately after scan error."
      },
      "complexType": {
        "original": "EventScanError",
        "resolved": "EventScanError",
        "references": {
          "EventScanError": {
            "location": "import",
            "path": "../../utils/data-structures"
          }
        }
      }
    }, {
      "method": "scanSuccess",
      "name": "scanSuccess",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Event which is emitted after successful scan. This event contains recognition results."
      },
      "complexType": {
        "original": "EventScanSuccess",
        "resolved": "EventScanSuccess",
        "references": {
          "EventScanSuccess": {
            "location": "import",
            "path": "../../utils/data-structures"
          }
        }
      }
    }, {
      "method": "feedback",
      "name": "feedback",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Event which is emitted during positive or negative user feedback. If attribute/property\n`hideFeedback` is set to `false`, UI component will display the feedback."
      },
      "complexType": {
        "original": "FeedbackMessage",
        "resolved": "FeedbackMessage",
        "references": {
          "FeedbackMessage": {
            "location": "import",
            "path": "../../utils/data-structures"
          }
        }
      }
    }, {
      "method": "cameraScanStarted",
      "name": "cameraScanStarted",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Event which is emitted when camera scan is started, i.e. when user clicks on\n_scan from camera_ button."
      },
      "complexType": {
        "original": "null",
        "resolved": "null",
        "references": {}
      }
    }, {
      "method": "imageScanStarted",
      "name": "imageScanStarted",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Event which is emitted when image scan is started, i.e. when user clicks on\n_scan from gallery button."
      },
      "complexType": {
        "original": "null",
        "resolved": "null",
        "references": {}
      }
    }, {
      "method": "scanAborted",
      "name": "scanAborted",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Event which is emitted when scan is aborted, i.e. when user clicks on\nclose from the gallery toolbar, or presses escape key."
      },
      "complexType": {
        "original": "null",
        "resolved": "null",
        "references": {}
      }
    }]; }
  static get methods() { return {
    "setUiState": {
      "complexType": {
        "signature": "(state: 'ERROR' | 'LOADING' | 'NONE' | 'SUCCESS') => Promise<void>",
        "parameters": [{
            "tags": [],
            "text": ""
          }],
        "references": {
          "Promise": {
            "location": "global"
          }
        },
        "return": "Promise<void>"
      },
      "docs": {
        "text": "Control UI state of camera overlay.\n\nPossible values are 'ERROR' | 'LOADING' | 'NONE' | 'SUCCESS'.\n\nIn case of state `ERROR` and if `showModalWindows` is set to `true`, modal window\nwith error message will be displayed. Otherwise, UI will close.",
        "tags": []
      }
    },
    "startCameraScan": {
      "complexType": {
        "signature": "() => Promise<void>",
        "parameters": [],
        "references": {
          "Promise": {
            "location": "global"
          }
        },
        "return": "Promise<void>"
      },
      "docs": {
        "text": "Starts camera scan using camera overlay with usage instructions.",
        "tags": []
      }
    },
    "startImageScan": {
      "complexType": {
        "signature": "(file: File) => Promise<void>",
        "parameters": [{
            "tags": [{
                "name": "param",
                "text": "file File to scan"
              }],
            "text": "File to scan"
          }],
        "references": {
          "Promise": {
            "location": "global"
          },
          "File": {
            "location": "global"
          }
        },
        "return": "Promise<void>"
      },
      "docs": {
        "text": "Starts image scan, emits results from provided file.",
        "tags": [{
            "name": "param",
            "text": "file File to scan"
          }]
      }
    },
    "startCombinedImageScan": {
      "complexType": {
        "signature": "(firstFile: File, secondFile: File) => Promise<void>",
        "parameters": [{
            "tags": [{
                "name": "param",
                "text": "firstFile File to scan as first image"
              }],
            "text": "File to scan as first image"
          }, {
            "tags": [{
                "name": "param",
                "text": "secondFile File to scan as second image"
              }],
            "text": "File to scan as second image"
          }],
        "references": {
          "Promise": {
            "location": "global"
          },
          "File": {
            "location": "global"
          }
        },
        "return": "Promise<void>"
      },
      "docs": {
        "text": "Starts combined image scan, emits results from provided files.",
        "tags": [{
            "name": "param",
            "text": "firstFile File to scan as first image"
          }, {
            "name": "param",
            "text": "secondFile File to scan as second image"
          }]
      }
    },
    "setUiMessage": {
      "complexType": {
        "signature": "(state: 'FEEDBACK_ERROR' | 'FEEDBACK_INFO' | 'FEEDBACK_OK', message: string) => Promise<void>",
        "parameters": [{
            "tags": [],
            "text": ""
          }, {
            "tags": [],
            "text": ""
          }],
        "references": {
          "Promise": {
            "location": "global"
          }
        },
        "return": "Promise<void>"
      },
      "docs": {
        "text": "Show message alongside UI component.\n\nPossible values for `state` are 'FEEDBACK_ERROR' | 'FEEDBACK_INFO' | 'FEEDBACK_OK'.",
        "tags": []
      }
    },
    "getProductIntegrationInfo": {
      "complexType": {
        "signature": "() => Promise<ProductIntegrationInfo>",
        "parameters": [],
        "references": {
          "Promise": {
            "location": "global"
          },
          "ProductIntegrationInfo": {
            "location": "import",
            "path": "../../utils/data-structures"
          }
        },
        "return": "Promise<ProductIntegrationInfo>"
      },
      "docs": {
        "text": "Get information about product integration.",
        "tags": []
      }
    }
  }; }
  static get elementRef() { return "hostEl"; }
}
