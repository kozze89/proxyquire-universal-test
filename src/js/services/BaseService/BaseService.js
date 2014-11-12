var constants = require('../../constants');
var AppDispatcher = require('../../dispatcher');
var url = require('url');
var request = require('superagent');
var _ = require('underscore');

/**
 * Creates a generic service. Serves as a common base layer for services.
 *
 * Valid options: {
 *   timeout: The time the request should wait before timing out,
 *   baseUrl: A url to prepend all requests with
 * }
 * @param options A map of options.
 * @constructor
 */
function BaseService(options) {
  // TODO: Enforce some options, such as baseUrl
  this.options = _.defaults(options, {
    timeout: 10000
  });

  // URL based pending request map
  this._pendingRequests = {};
}

/**
 * Aborts a pending request
 * @param url The url of the request to abort
 * @private
 */
BaseService.prototype._abortPendingRequests = function(url) {
  if (this._pendingRequests[url]) {
    this._pendingRequests[url]._callback = function(){};
    this._pendingRequests[url].abort();
    this._pendingRequests[url] = null;
  }
};

/**
 * Dispatches a server action.
 * @param type The type of the action. Should be based on a constant
 * @param content Response data (and metadata if it exists)
 * @private
 */
BaseService.prototype._dispatch = function(type, content) {
  var payload = {type: type, content: content};
  AppDispatcher.handleServerAction(payload);
};

/**
 * Builds a function to handle the end of a request.
 * @param type The action type that's being handled
 * @param params Request parameters
 * @returns {Function}
 * @private
 */
BaseService.prototype._makeResultHandler = function(type, params) {
  return _.bind(function (error, result) {
    if (error && error.timeout === this.options.timeout) {

      // If there was a timeout dispatch a timeout action with the timeout
      // specified
      this._dispatch(type, {
        status: constants.request.TIMEOUT,
        timeout: this.options.timeout
      });
    } else if (error || !result.ok) {

      // If there was an error or the result was non 2xx dispatch an error
      // action
      this._dispatch(type, {
        status: constants.request.ERROR,
        error: error,
        httpStatusCode: result && result.status
      });
    } else {

      // If no error or timeout occured dispatch a success action
      this._dispatch(type, {
        status: constants.request.SUCCESS,
        result: result
      });
    }
  }, this);
};

/**
 *
 * @param url The url of the request to start
 * @param request The request object to store, for later cancellation
 * @param type The type of the action
 * @private
 */
BaseService.prototype._startRequest = function(url, request, type) {

  // Abort any ongoing requests
  this._abortPendingRequests(url);

  // Save the new request and dispatch a pending action
  this._pendingRequests[url] = request;
  this._dispatch(type, {
    status: constants.request.PENDING,
    url: url
  });
};

BaseService.prototype._buildUrl = function(path) {
  return url.resolve(this.options.baseUrl, path);
};

/**
 * Runs a GET request with the specified parameters.
 * Dispatches a PENDING action as soon as the request starts.
 * Dispatches a TIMEOUT action if the request times out
 * Dispatches an ERROR action if there was an error.
 *  (NOTE: as of now this action might be triggered if there are issues in the
 *  store method handling the callback)
 *
 * @param path The path to add to the url prefix (Example: /cci/image/1)
 * @param type The action type (Example: GET_CCI_IMAGERY)
 * @param params A map of URL parameters to add to the request
 */
BaseService.prototype.get = function(path, type, params) {
  // TODO: Add support for headers, params, etc

  var req = request
    .get(this._buildUrl(path))
    .query(params || {})
    .timeout(this.options.timeout)
    .end(this._makeResultHandler(type, params));

  this._startRequest(path, req, type);
};


// TODO: Support more HTTP methods

module.exports = BaseService;