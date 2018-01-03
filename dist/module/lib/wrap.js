'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.countTypesTags = countTypesTags;
exports.createElementWithNoScript = createElementWithNoScript;
exports.wrapTypesToLazyChild = wrapTypesToLazyChild;
exports.wrapTypesToNoScript = wrapTypesToNoScript;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _Lazy = require('../components/Lazy');

var _Lazy2 = _interopRequireDefault(_Lazy);

var _LazyChild = require('../components/LazyChild');

var _LazyChild2 = _interopRequireDefault(_LazyChild);

var _LazyGroup = require('../components/LazyGroup');

var _LazyGroup2 = _interopRequireDefault(_LazyGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function countTypesTags(types, children) {
    var count = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    if (!children) {
        return count;
    }

    _react2.default.Children.forEach(children, function (child) {
        if (!child || child.type === _Lazy2.default || child.type === _LazyGroup2.default || child.type === _LazyChild2.default) {
            return;
        } else if (types.includes(child.type)) {
            count++;
        } else {
            var props = child.props || child._store && child._store.props || {};
            count += countTypesTags(types, props.children);
        }
    });

    return count;
}

function propsWithNoScriptRender(children) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var noscript = (0, _server.renderToStaticMarkup)(_react2.default.createElement('noscript', null, children));

    var __html = noscript.replace('<noscript>', '<!--[if IE 9]><!--><noscript><!--<![endif]-->').replace('</noscript>', '<!--[if IE 9]><!--></noscript><!--<![endif]-->');

    props.dangerouslySetInnerHTML = { __html: __html };

    return props;
}

// Creates an element whose children are inside a `<noscript>`
// ===================================
// Note: If we support legacy browsers, we don't support passing context
// through, and vice versa.
function createElementWithNoScript(type) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var children = arguments[2];
    var ltIE9 = arguments[3];

    if (ltIE9) {
        return _react2.default.createElement(type, propsWithNoScriptRender(children, props));
    }

    return _react2.default.createElement(type, props, _react2.default.createElement('noscript', null, children));
}

function wrapTypesToLazyChild(types, children, wrapper, callback) {
    if (!children) {
        return children;
    }

    return _react2.default.Children.map(children, function (child) {
        if (!child || child.type === _Lazy2.default || child.type === _LazyGroup2.default || child.type === _LazyChild2.default) {
            return child;
        } else if (types.includes(child.type)) {
            return _react2.default.createElement(
                _LazyChild2.default,
                { callback: callback, wrapper: wrapper },
                child
            );
        } else {
            var props = child.props || child._store && child._store.props || {};
            var _children = wrapTypesToLazyChild(types, props.children, wrapper, callback);

            if (_children !== props.children) {
                return _react2.default.cloneElement(child, null, _children);
            } else {
                return child;
            }
        }
    });
}

function wrapTypesToNoScript(types, children, ltIE9, wrapper) {
    if (!children) {
        return children;
    }

    return _react2.default.Children.map(children, function (child) {
        if (!child || child.type === _Lazy2.default || child.type === _LazyGroup2.default || child.type === _LazyChild2.default) {
            return child;
        } else if (types.includes(child.type)) {
            return createElementWithNoScript(wrapper, {}, child, ltIE9);
        } else {
            var props = child.props || child._store && child._store.props || {};
            var _children2 = wrapTypesToNoScript(types, props.children, ltIE9, wrapper);

            if (_children2 !== props.children) {
                return _react2.default.cloneElement(child, null, _children2);
            } else {
                return child;
            }
        }
    });
}