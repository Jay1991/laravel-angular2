'use strict';var lang_1 = require('angular2/src/facade/lang');
var di_1 = require('angular2/src/core/di');
var core_1 = require("angular2/core");
var common_1 = require("angular2/common");
var testability_1 = require('angular2/src/core/testability/testability');
var dom_adapter_1 = require('angular2/src/platform/dom/dom_adapter');
var dom_events_1 = require('angular2/src/platform/dom/events/dom_events');
var key_events_1 = require('angular2/src/platform/dom/events/key_events');
var hammer_gestures_1 = require('angular2/src/platform/dom/events/hammer_gestures');
var dom_tokens_1 = require('angular2/src/platform/dom/dom_tokens');
var dom_renderer_1 = require('angular2/src/platform/dom/dom_renderer');
var shared_styles_host_1 = require('angular2/src/platform/dom/shared_styles_host');
var shared_styles_host_2 = require("angular2/src/platform/dom/shared_styles_host");
var browser_details_1 = require("angular2/src/animate/browser_details");
var animation_builder_1 = require("angular2/src/animate/animation_builder");
var browser_adapter_1 = require('./browser/browser_adapter');
var testability_2 = require('angular2/src/platform/browser/testability');
var wtf_init_1 = require('angular2/src/core/profile/wtf_init');
var event_manager_1 = require("angular2/src/platform/dom/events/event_manager");
var common_dom_1 = require('angular2/platform/common_dom');
var dom_tokens_2 = require('angular2/src/platform/dom/dom_tokens');
exports.DOCUMENT = dom_tokens_2.DOCUMENT;
var title_1 = require('angular2/src/platform/browser/title');
exports.Title = title_1.Title;
var common_dom_2 = require('angular2/platform/common_dom');
exports.ELEMENT_PROBE_PROVIDERS = common_dom_2.ELEMENT_PROBE_PROVIDERS;
exports.ELEMENT_PROBE_PROVIDERS_PROD_MODE = common_dom_2.ELEMENT_PROBE_PROVIDERS_PROD_MODE;
exports.inspectNativeElement = common_dom_2.inspectNativeElement;
exports.By = common_dom_2.By;
var browser_adapter_2 = require('./browser/browser_adapter');
exports.BrowserDomAdapter = browser_adapter_2.BrowserDomAdapter;
var tools_1 = require('angular2/src/platform/browser/tools/tools');
exports.enableDebugTools = tools_1.enableDebugTools;
exports.disableDebugTools = tools_1.disableDebugTools;
/**
 * A set of providers to initialize the Angular platform in a web browser.
 *
 * Used automatically by `bootstrap`, or can be passed to {@link platform}.
 */
exports.BROWSER_PROVIDERS = lang_1.CONST_EXPR([
    core_1.PLATFORM_COMMON_PROVIDERS,
    new di_1.Provider(core_1.PLATFORM_INITIALIZER, { useValue: initDomAdapter, multi: true }),
]);
function _exceptionHandler() {
    // !IS_DART is required because we must rethrow exceptions in JS,
    // but must not rethrow exceptions in Dart
    return new core_1.ExceptionHandler(dom_adapter_1.DOM, !lang_1.IS_DART);
}
function _document() {
    return dom_adapter_1.DOM.defaultDoc();
}
/**
 * A set of providers to initialize an Angular application in a web browser.
 *
 * Used automatically by `bootstrap`, or can be passed to {@link PlatformRef.application}.
 */
exports.BROWSER_APP_COMMON_PROVIDERS = lang_1.CONST_EXPR([
    core_1.APPLICATION_COMMON_PROVIDERS,
    common_1.FORM_PROVIDERS,
    new di_1.Provider(core_1.PLATFORM_PIPES, { useValue: common_1.COMMON_PIPES, multi: true }),
    new di_1.Provider(core_1.PLATFORM_DIRECTIVES, { useValue: common_1.COMMON_DIRECTIVES, multi: true }),
    new di_1.Provider(core_1.ExceptionHandler, { useFactory: _exceptionHandler, deps: [] }),
    new di_1.Provider(dom_tokens_1.DOCUMENT, { useFactory: _document, deps: [] }),
    new di_1.Provider(event_manager_1.EVENT_MANAGER_PLUGINS, { useClass: dom_events_1.DomEventsPlugin, multi: true }),
    new di_1.Provider(event_manager_1.EVENT_MANAGER_PLUGINS, { useClass: key_events_1.KeyEventsPlugin, multi: true }),
    new di_1.Provider(event_manager_1.EVENT_MANAGER_PLUGINS, { useClass: hammer_gestures_1.HammerGesturesPlugin, multi: true }),
    new di_1.Provider(dom_renderer_1.DomRootRenderer, { useClass: dom_renderer_1.DomRootRenderer_ }),
    new di_1.Provider(core_1.RootRenderer, { useExisting: dom_renderer_1.DomRootRenderer }),
    new di_1.Provider(shared_styles_host_2.SharedStylesHost, { useExisting: shared_styles_host_1.DomSharedStylesHost }),
    shared_styles_host_1.DomSharedStylesHost,
    testability_1.Testability,
    browser_details_1.BrowserDetails,
    animation_builder_1.AnimationBuilder,
    event_manager_1.EventManager,
    common_dom_1.ELEMENT_PROBE_PROVIDERS
]);
function initDomAdapter() {
    browser_adapter_1.BrowserDomAdapter.makeCurrent();
    wtf_init_1.wtfInit();
    testability_2.BrowserGetTestability.init();
}
exports.initDomAdapter = initDomAdapter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlcl9jb21tb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbmd1bGFyMi9zcmMvcGxhdGZvcm0vYnJvd3Nlcl9jb21tb24udHMiXSwibmFtZXMiOlsiX2V4Y2VwdGlvbkhhbmRsZXIiLCJfZG9jdW1lbnQiLCJpbml0RG9tQWRhcHRlciJdLCJtYXBwaW5ncyI6IkFBQUEscUJBQWtDLDBCQUEwQixDQUFDLENBQUE7QUFDN0QsbUJBQXVELHNCQUFzQixDQUFDLENBQUE7QUFFOUUscUJBWU8sZUFBZSxDQUFDLENBQUE7QUFDdkIsdUJBQThELGlCQUFpQixDQUFDLENBQUE7QUFDaEYsNEJBQTBCLDJDQUEyQyxDQUFDLENBQUE7QUFDdEUsNEJBQWtCLHVDQUF1QyxDQUFDLENBQUE7QUFDMUQsMkJBQThCLDZDQUE2QyxDQUFDLENBQUE7QUFDNUUsMkJBQThCLDZDQUE2QyxDQUFDLENBQUE7QUFDNUUsZ0NBQW1DLGtEQUFrRCxDQUFDLENBQUE7QUFDdEYsMkJBQXVCLHNDQUFzQyxDQUFDLENBQUE7QUFDOUQsNkJBQWdELHdDQUF3QyxDQUFDLENBQUE7QUFDekYsbUNBQWtDLDhDQUE4QyxDQUFDLENBQUE7QUFDakYsbUNBQStCLDhDQUE4QyxDQUFDLENBQUE7QUFDOUUsZ0NBQTZCLHNDQUFzQyxDQUFDLENBQUE7QUFDcEUsa0NBQStCLHdDQUF3QyxDQUFDLENBQUE7QUFDeEUsZ0NBQWdDLDJCQUEyQixDQUFDLENBQUE7QUFDNUQsNEJBQW9DLDJDQUEyQyxDQUFDLENBQUE7QUFDaEYseUJBQXNCLG9DQUFvQyxDQUFDLENBQUE7QUFDM0QsOEJBQWtELGdEQUFnRCxDQUFDLENBQUE7QUFDbkcsMkJBQXNDLDhCQUE4QixDQUFDLENBQUE7QUFDckUsMkJBQXVCLHNDQUFzQyxDQUFDO0FBQXRELHlDQUFzRDtBQUM5RCxzQkFBb0IscUNBQXFDLENBQUM7QUFBbEQsOEJBQWtEO0FBQzFELDJCQUtPLDhCQUE4QixDQUFDO0FBSnBDLHVFQUF1QjtBQUN2QiwyRkFBaUM7QUFDakMsaUVBQW9CO0FBQ3BCLDZCQUNvQztBQUN0QyxnQ0FBZ0MsMkJBQTJCLENBQUM7QUFBcEQsZ0VBQW9EO0FBQzVELHNCQUFrRCwyQ0FBMkMsQ0FBQztBQUF0RixvREFBZ0I7QUFBRSxzREFBb0U7QUFFOUY7Ozs7R0FJRztBQUNVLHlCQUFpQixHQUEyQyxpQkFBVSxDQUFDO0lBQ2xGLGdDQUF5QjtJQUN6QixJQUFJLGFBQVEsQ0FBQywyQkFBb0IsRUFBRSxFQUFDLFFBQVEsRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDO0NBQzVFLENBQUMsQ0FBQztBQUVIO0lBQ0VBLGlFQUFpRUE7SUFDakVBLDBDQUEwQ0E7SUFDMUNBLE1BQU1BLENBQUNBLElBQUlBLHVCQUFnQkEsQ0FBQ0EsaUJBQUdBLEVBQUVBLENBQUNBLGNBQU9BLENBQUNBLENBQUNBO0FBQzdDQSxDQUFDQTtBQUVEO0lBQ0VDLE1BQU1BLENBQUNBLGlCQUFHQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQTtBQUMxQkEsQ0FBQ0E7QUFFRDs7OztHQUlHO0FBQ1Usb0NBQTRCLEdBQTJDLGlCQUFVLENBQUM7SUFDN0YsbUNBQTRCO0lBQzVCLHVCQUFjO0lBQ2QsSUFBSSxhQUFRLENBQUMscUJBQWMsRUFBRSxFQUFDLFFBQVEsRUFBRSxxQkFBWSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQztJQUNuRSxJQUFJLGFBQVEsQ0FBQywwQkFBbUIsRUFBRSxFQUFDLFFBQVEsRUFBRSwwQkFBaUIsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUM7SUFDN0UsSUFBSSxhQUFRLENBQUMsdUJBQWdCLEVBQUUsRUFBQyxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQyxDQUFDO0lBQ3pFLElBQUksYUFBUSxDQUFDLHFCQUFRLEVBQUUsRUFBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUMsQ0FBQztJQUN6RCxJQUFJLGFBQVEsQ0FBQyxxQ0FBcUIsRUFBRSxFQUFDLFFBQVEsRUFBRSw0QkFBZSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQztJQUM3RSxJQUFJLGFBQVEsQ0FBQyxxQ0FBcUIsRUFBRSxFQUFDLFFBQVEsRUFBRSw0QkFBZSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQztJQUM3RSxJQUFJLGFBQVEsQ0FBQyxxQ0FBcUIsRUFBRSxFQUFDLFFBQVEsRUFBRSxzQ0FBb0IsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUM7SUFDbEYsSUFBSSxhQUFRLENBQUMsOEJBQWUsRUFBRSxFQUFDLFFBQVEsRUFBRSwrQkFBZ0IsRUFBQyxDQUFDO0lBQzNELElBQUksYUFBUSxDQUFDLG1CQUFZLEVBQUUsRUFBQyxXQUFXLEVBQUUsOEJBQWUsRUFBQyxDQUFDO0lBQzFELElBQUksYUFBUSxDQUFDLHFDQUFnQixFQUFFLEVBQUMsV0FBVyxFQUFFLHdDQUFtQixFQUFDLENBQUM7SUFDbEUsd0NBQW1CO0lBQ25CLHlCQUFXO0lBQ1gsZ0NBQWM7SUFDZCxvQ0FBZ0I7SUFDaEIsNEJBQVk7SUFDWixvQ0FBdUI7Q0FDeEIsQ0FBQyxDQUFDO0FBRUg7SUFDRUMsbUNBQWlCQSxDQUFDQSxXQUFXQSxFQUFFQSxDQUFDQTtJQUNoQ0Esa0JBQU9BLEVBQUVBLENBQUNBO0lBQ1ZBLG1DQUFxQkEsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0E7QUFDL0JBLENBQUNBO0FBSmUsc0JBQWMsaUJBSTdCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NPTlNUX0VYUFIsIElTX0RBUlR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge3Byb3ZpZGUsIFByb3ZpZGVyLCBJbmplY3RvciwgT3BhcXVlVG9rZW59IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcblxuaW1wb3J0IHtcbiAgUExBVEZPUk1fSU5JVElBTElaRVIsXG4gIFBMQVRGT1JNX0RJUkVDVElWRVMsXG4gIFBMQVRGT1JNX1BJUEVTLFxuICBDb21wb25lbnRSZWYsXG4gIHBsYXRmb3JtLFxuICBFeGNlcHRpb25IYW5kbGVyLFxuICBSZWZsZWN0b3IsXG4gIFJvb3RSZW5kZXJlcixcbiAgcmVmbGVjdG9yLFxuICBBUFBMSUNBVElPTl9DT01NT05fUFJPVklERVJTLFxuICBQTEFURk9STV9DT01NT05fUFJPVklERVJTXG59IGZyb20gXCJhbmd1bGFyMi9jb3JlXCI7XG5pbXBvcnQge0NPTU1PTl9ESVJFQ1RJVkVTLCBDT01NT05fUElQRVMsIEZPUk1fUFJPVklERVJTfSBmcm9tIFwiYW5ndWxhcjIvY29tbW9uXCI7XG5pbXBvcnQge1Rlc3RhYmlsaXR5fSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS90ZXN0YWJpbGl0eS90ZXN0YWJpbGl0eSc7XG5pbXBvcnQge0RPTX0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9kb21fYWRhcHRlcic7XG5pbXBvcnQge0RvbUV2ZW50c1BsdWdpbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9ldmVudHMvZG9tX2V2ZW50cyc7XG5pbXBvcnQge0tleUV2ZW50c1BsdWdpbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9ldmVudHMva2V5X2V2ZW50cyc7XG5pbXBvcnQge0hhbW1lckdlc3R1cmVzUGx1Z2lufSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2V2ZW50cy9oYW1tZXJfZ2VzdHVyZXMnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9kb21fdG9rZW5zJztcbmltcG9ydCB7RG9tUm9vdFJlbmRlcmVyLCBEb21Sb290UmVuZGVyZXJffSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2RvbV9yZW5kZXJlcic7XG5pbXBvcnQge0RvbVNoYXJlZFN0eWxlc0hvc3R9IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9kb20vc2hhcmVkX3N0eWxlc19ob3N0JztcbmltcG9ydCB7U2hhcmVkU3R5bGVzSG9zdH0gZnJvbSBcImFuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9kb20vc2hhcmVkX3N0eWxlc19ob3N0XCI7XG5pbXBvcnQge0Jyb3dzZXJEZXRhaWxzfSBmcm9tIFwiYW5ndWxhcjIvc3JjL2FuaW1hdGUvYnJvd3Nlcl9kZXRhaWxzXCI7XG5pbXBvcnQge0FuaW1hdGlvbkJ1aWxkZXJ9IGZyb20gXCJhbmd1bGFyMi9zcmMvYW5pbWF0ZS9hbmltYXRpb25fYnVpbGRlclwiO1xuaW1wb3J0IHtCcm93c2VyRG9tQWRhcHRlcn0gZnJvbSAnLi9icm93c2VyL2Jyb3dzZXJfYWRhcHRlcic7XG5pbXBvcnQge0Jyb3dzZXJHZXRUZXN0YWJpbGl0eX0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2Jyb3dzZXIvdGVzdGFiaWxpdHknO1xuaW1wb3J0IHt3dGZJbml0fSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9wcm9maWxlL3d0Zl9pbml0JztcbmltcG9ydCB7RXZlbnRNYW5hZ2VyLCBFVkVOVF9NQU5BR0VSX1BMVUdJTlN9IGZyb20gXCJhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2V2ZW50cy9ldmVudF9tYW5hZ2VyXCI7XG5pbXBvcnQge0VMRU1FTlRfUFJPQkVfUFJPVklERVJTfSBmcm9tICdhbmd1bGFyMi9wbGF0Zm9ybS9jb21tb25fZG9tJztcbmV4cG9ydCB7RE9DVU1FTlR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9kb20vZG9tX3Rva2Vucyc7XG5leHBvcnQge1RpdGxlfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vYnJvd3Nlci90aXRsZSc7XG5leHBvcnQge1xuICBFTEVNRU5UX1BST0JFX1BST1ZJREVSUyxcbiAgRUxFTUVOVF9QUk9CRV9QUk9WSURFUlNfUFJPRF9NT0RFLFxuICBpbnNwZWN0TmF0aXZlRWxlbWVudCxcbiAgQnlcbn0gZnJvbSAnYW5ndWxhcjIvcGxhdGZvcm0vY29tbW9uX2RvbSc7XG5leHBvcnQge0Jyb3dzZXJEb21BZGFwdGVyfSBmcm9tICcuL2Jyb3dzZXIvYnJvd3Nlcl9hZGFwdGVyJztcbmV4cG9ydCB7ZW5hYmxlRGVidWdUb29scywgZGlzYWJsZURlYnVnVG9vbHN9IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9icm93c2VyL3Rvb2xzL3Rvb2xzJztcblxuLyoqXG4gKiBBIHNldCBvZiBwcm92aWRlcnMgdG8gaW5pdGlhbGl6ZSB0aGUgQW5ndWxhciBwbGF0Zm9ybSBpbiBhIHdlYiBicm93c2VyLlxuICpcbiAqIFVzZWQgYXV0b21hdGljYWxseSBieSBgYm9vdHN0cmFwYCwgb3IgY2FuIGJlIHBhc3NlZCB0byB7QGxpbmsgcGxhdGZvcm19LlxuICovXG5leHBvcnQgY29uc3QgQlJPV1NFUl9QUk9WSURFUlM6IEFycmF5PGFueSAvKlR5cGUgfCBQcm92aWRlciB8IGFueVtdKi8+ID0gQ09OU1RfRVhQUihbXG4gIFBMQVRGT1JNX0NPTU1PTl9QUk9WSURFUlMsXG4gIG5ldyBQcm92aWRlcihQTEFURk9STV9JTklUSUFMSVpFUiwge3VzZVZhbHVlOiBpbml0RG9tQWRhcHRlciwgbXVsdGk6IHRydWV9KSxcbl0pO1xuXG5mdW5jdGlvbiBfZXhjZXB0aW9uSGFuZGxlcigpOiBFeGNlcHRpb25IYW5kbGVyIHtcbiAgLy8gIUlTX0RBUlQgaXMgcmVxdWlyZWQgYmVjYXVzZSB3ZSBtdXN0IHJldGhyb3cgZXhjZXB0aW9ucyBpbiBKUyxcbiAgLy8gYnV0IG11c3Qgbm90IHJldGhyb3cgZXhjZXB0aW9ucyBpbiBEYXJ0XG4gIHJldHVybiBuZXcgRXhjZXB0aW9uSGFuZGxlcihET00sICFJU19EQVJUKTtcbn1cblxuZnVuY3Rpb24gX2RvY3VtZW50KCk6IGFueSB7XG4gIHJldHVybiBET00uZGVmYXVsdERvYygpO1xufVxuXG4vKipcbiAqIEEgc2V0IG9mIHByb3ZpZGVycyB0byBpbml0aWFsaXplIGFuIEFuZ3VsYXIgYXBwbGljYXRpb24gaW4gYSB3ZWIgYnJvd3Nlci5cbiAqXG4gKiBVc2VkIGF1dG9tYXRpY2FsbHkgYnkgYGJvb3RzdHJhcGAsIG9yIGNhbiBiZSBwYXNzZWQgdG8ge0BsaW5rIFBsYXRmb3JtUmVmLmFwcGxpY2F0aW9ufS5cbiAqL1xuZXhwb3J0IGNvbnN0IEJST1dTRVJfQVBQX0NPTU1PTl9QUk9WSURFUlM6IEFycmF5PGFueSAvKlR5cGUgfCBQcm92aWRlciB8IGFueVtdKi8+ID0gQ09OU1RfRVhQUihbXG4gIEFQUExJQ0FUSU9OX0NPTU1PTl9QUk9WSURFUlMsXG4gIEZPUk1fUFJPVklERVJTLFxuICBuZXcgUHJvdmlkZXIoUExBVEZPUk1fUElQRVMsIHt1c2VWYWx1ZTogQ09NTU9OX1BJUEVTLCBtdWx0aTogdHJ1ZX0pLFxuICBuZXcgUHJvdmlkZXIoUExBVEZPUk1fRElSRUNUSVZFUywge3VzZVZhbHVlOiBDT01NT05fRElSRUNUSVZFUywgbXVsdGk6IHRydWV9KSxcbiAgbmV3IFByb3ZpZGVyKEV4Y2VwdGlvbkhhbmRsZXIsIHt1c2VGYWN0b3J5OiBfZXhjZXB0aW9uSGFuZGxlciwgZGVwczogW119KSxcbiAgbmV3IFByb3ZpZGVyKERPQ1VNRU5ULCB7dXNlRmFjdG9yeTogX2RvY3VtZW50LCBkZXBzOiBbXX0pLFxuICBuZXcgUHJvdmlkZXIoRVZFTlRfTUFOQUdFUl9QTFVHSU5TLCB7dXNlQ2xhc3M6IERvbUV2ZW50c1BsdWdpbiwgbXVsdGk6IHRydWV9KSxcbiAgbmV3IFByb3ZpZGVyKEVWRU5UX01BTkFHRVJfUExVR0lOUywge3VzZUNsYXNzOiBLZXlFdmVudHNQbHVnaW4sIG11bHRpOiB0cnVlfSksXG4gIG5ldyBQcm92aWRlcihFVkVOVF9NQU5BR0VSX1BMVUdJTlMsIHt1c2VDbGFzczogSGFtbWVyR2VzdHVyZXNQbHVnaW4sIG11bHRpOiB0cnVlfSksXG4gIG5ldyBQcm92aWRlcihEb21Sb290UmVuZGVyZXIsIHt1c2VDbGFzczogRG9tUm9vdFJlbmRlcmVyX30pLFxuICBuZXcgUHJvdmlkZXIoUm9vdFJlbmRlcmVyLCB7dXNlRXhpc3Rpbmc6IERvbVJvb3RSZW5kZXJlcn0pLFxuICBuZXcgUHJvdmlkZXIoU2hhcmVkU3R5bGVzSG9zdCwge3VzZUV4aXN0aW5nOiBEb21TaGFyZWRTdHlsZXNIb3N0fSksXG4gIERvbVNoYXJlZFN0eWxlc0hvc3QsXG4gIFRlc3RhYmlsaXR5LFxuICBCcm93c2VyRGV0YWlscyxcbiAgQW5pbWF0aW9uQnVpbGRlcixcbiAgRXZlbnRNYW5hZ2VyLFxuICBFTEVNRU5UX1BST0JFX1BST1ZJREVSU1xuXSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0RG9tQWRhcHRlcigpIHtcbiAgQnJvd3NlckRvbUFkYXB0ZXIubWFrZUN1cnJlbnQoKTtcbiAgd3RmSW5pdCgpO1xuICBCcm93c2VyR2V0VGVzdGFiaWxpdHkuaW5pdCgpO1xufVxuIl19