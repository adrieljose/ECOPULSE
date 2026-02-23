var oE = { exports: {} }, Ih = {}, lE = { exports: {} }, Vt = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ww;
function nN() {
  if (Ww) return Vt;
  Ww = 1;
  var a = Symbol.for("react.element"), l = Symbol.for("react.portal"), c = Symbol.for("react.fragment"), p = Symbol.for("react.strict_mode"), g = Symbol.for("react.profiler"), E = Symbol.for("react.provider"), h = Symbol.for("react.context"), x = Symbol.for("react.forward_ref"), b = Symbol.for("react.suspense"), R = Symbol.for("react.memo"), D = Symbol.for("react.lazy"), M = Symbol.iterator;
  function A(N) {
    return N === null || typeof N != "object" ? null : (N = M && N[M] || N["@@iterator"], typeof N == "function" ? N : null);
  }
  var j = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, q = Object.assign, re = {};
  function ie(N, ee, be) {
    this.props = N, this.context = ee, this.refs = re, this.updater = be || j;
  }
  ie.prototype.isReactComponent = {}, ie.prototype.setState = function(N, ee) {
    if (typeof N != "object" && typeof N != "function" && N != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, N, ee, "setState");
  }, ie.prototype.forceUpdate = function(N) {
    this.updater.enqueueForceUpdate(this, N, "forceUpdate");
  };
  function ue() {
  }
  ue.prototype = ie.prototype;
  function he(N, ee, be) {
    this.props = N, this.context = ee, this.refs = re, this.updater = be || j;
  }
  var ne = he.prototype = new ue();
  ne.constructor = he, q(ne, ie.prototype), ne.isPureReactComponent = !0;
  var Se = Array.isArray, ae = Object.prototype.hasOwnProperty, Re = { current: null }, xe = { key: !0, ref: !0, __self: !0, __source: !0 };
  function le(N, ee, be) {
    var Ie, Ne = {}, bt = null, mt = null;
    if (ee != null) for (Ie in ee.ref !== void 0 && (mt = ee.ref), ee.key !== void 0 && (bt = "" + ee.key), ee) ae.call(ee, Ie) && !xe.hasOwnProperty(Ie) && (Ne[Ie] = ee[Ie]);
    var Ue = arguments.length - 2;
    if (Ue === 1) Ne.children = be;
    else if (1 < Ue) {
      for (var ft = Array(Ue), Ot = 0; Ot < Ue; Ot++) ft[Ot] = arguments[Ot + 2];
      Ne.children = ft;
    }
    if (N && N.defaultProps) for (Ie in Ue = N.defaultProps, Ue) Ne[Ie] === void 0 && (Ne[Ie] = Ue[Ie]);
    return { $$typeof: a, type: N, key: bt, ref: mt, props: Ne, _owner: Re.current };
  }
  function Xe(N, ee) {
    return { $$typeof: a, type: N.type, key: ee, ref: N.ref, props: N.props, _owner: N._owner };
  }
  function yt(N) {
    return typeof N == "object" && N !== null && N.$$typeof === a;
  }
  function Mt(N) {
    var ee = { "=": "=0", ":": "=2" };
    return "$" + N.replace(/[=:]/g, function(be) {
      return ee[be];
    });
  }
  var gt = /\/+/g;
  function We(N, ee) {
    return typeof N == "object" && N !== null && N.key != null ? Mt("" + N.key) : ee.toString(36);
  }
  function Rt(N, ee, be, Ie, Ne) {
    var bt = typeof N;
    (bt === "undefined" || bt === "boolean") && (N = null);
    var mt = !1;
    if (N === null) mt = !0;
    else switch (bt) {
      case "string":
      case "number":
        mt = !0;
        break;
      case "object":
        switch (N.$$typeof) {
          case a:
          case l:
            mt = !0;
        }
    }
    if (mt) return mt = N, Ne = Ne(mt), N = Ie === "" ? "." + We(mt, 0) : Ie, Se(Ne) ? (be = "", N != null && (be = N.replace(gt, "$&/") + "/"), Rt(Ne, ee, be, "", function(Ot) {
      return Ot;
    })) : Ne != null && (yt(Ne) && (Ne = Xe(Ne, be + (!Ne.key || mt && mt.key === Ne.key ? "" : ("" + Ne.key).replace(gt, "$&/") + "/") + N)), ee.push(Ne)), 1;
    if (mt = 0, Ie = Ie === "" ? "." : Ie + ":", Se(N)) for (var Ue = 0; Ue < N.length; Ue++) {
      bt = N[Ue];
      var ft = Ie + We(bt, Ue);
      mt += Rt(bt, ee, be, ft, Ne);
    }
    else if (ft = A(N), typeof ft == "function") for (N = ft.call(N), Ue = 0; !(bt = N.next()).done; ) bt = bt.value, ft = Ie + We(bt, Ue++), mt += Rt(bt, ee, be, ft, Ne);
    else if (bt === "object") throw ee = String(N), Error("Objects are not valid as a React child (found: " + (ee === "[object Object]" ? "object with keys {" + Object.keys(N).join(", ") + "}" : ee) + "). If you meant to render a collection of children, use an array instead.");
    return mt;
  }
  function pt(N, ee, be) {
    if (N == null) return N;
    var Ie = [], Ne = 0;
    return Rt(N, Ie, "", "", function(bt) {
      return ee.call(be, bt, Ne++);
    }), Ie;
  }
  function ht(N) {
    if (N._status === -1) {
      var ee = N._result;
      ee = ee(), ee.then(function(be) {
        (N._status === 0 || N._status === -1) && (N._status = 1, N._result = be);
      }, function(be) {
        (N._status === 0 || N._status === -1) && (N._status = 2, N._result = be);
      }), N._status === -1 && (N._status = 0, N._result = ee);
    }
    if (N._status === 1) return N._result.default;
    throw N._result;
  }
  var ye = { current: null }, K = { transition: null }, De = { ReactCurrentDispatcher: ye, ReactCurrentBatchConfig: K, ReactCurrentOwner: Re };
  return Vt.Children = { map: pt, forEach: function(N, ee, be) {
    pt(N, function() {
      ee.apply(this, arguments);
    }, be);
  }, count: function(N) {
    var ee = 0;
    return pt(N, function() {
      ee++;
    }), ee;
  }, toArray: function(N) {
    return pt(N, function(ee) {
      return ee;
    }) || [];
  }, only: function(N) {
    if (!yt(N)) throw Error("React.Children.only expected to receive a single React element child.");
    return N;
  } }, Vt.Component = ie, Vt.Fragment = c, Vt.Profiler = g, Vt.PureComponent = he, Vt.StrictMode = p, Vt.Suspense = b, Vt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = De, Vt.cloneElement = function(N, ee, be) {
    if (N == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + N + ".");
    var Ie = q({}, N.props), Ne = N.key, bt = N.ref, mt = N._owner;
    if (ee != null) {
      if (ee.ref !== void 0 && (bt = ee.ref, mt = Re.current), ee.key !== void 0 && (Ne = "" + ee.key), N.type && N.type.defaultProps) var Ue = N.type.defaultProps;
      for (ft in ee) ae.call(ee, ft) && !xe.hasOwnProperty(ft) && (Ie[ft] = ee[ft] === void 0 && Ue !== void 0 ? Ue[ft] : ee[ft]);
    }
    var ft = arguments.length - 2;
    if (ft === 1) Ie.children = be;
    else if (1 < ft) {
      Ue = Array(ft);
      for (var Ot = 0; Ot < ft; Ot++) Ue[Ot] = arguments[Ot + 2];
      Ie.children = Ue;
    }
    return { $$typeof: a, type: N.type, key: Ne, ref: bt, props: Ie, _owner: mt };
  }, Vt.createContext = function(N) {
    return N = { $$typeof: h, _currentValue: N, _currentValue2: N, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, N.Provider = { $$typeof: E, _context: N }, N.Consumer = N;
  }, Vt.createElement = le, Vt.createFactory = function(N) {
    var ee = le.bind(null, N);
    return ee.type = N, ee;
  }, Vt.createRef = function() {
    return { current: null };
  }, Vt.forwardRef = function(N) {
    return { $$typeof: x, render: N };
  }, Vt.isValidElement = yt, Vt.lazy = function(N) {
    return { $$typeof: D, _payload: { _status: -1, _result: N }, _init: ht };
  }, Vt.memo = function(N, ee) {
    return { $$typeof: R, type: N, compare: ee === void 0 ? null : ee };
  }, Vt.startTransition = function(N) {
    var ee = K.transition;
    K.transition = {};
    try {
      N();
    } finally {
      K.transition = ee;
    }
  }, Vt.unstable_act = function() {
    throw Error("act(...) is not supported in production builds of React.");
  }, Vt.useCallback = function(N, ee) {
    return ye.current.useCallback(N, ee);
  }, Vt.useContext = function(N) {
    return ye.current.useContext(N);
  }, Vt.useDebugValue = function() {
  }, Vt.useDeferredValue = function(N) {
    return ye.current.useDeferredValue(N);
  }, Vt.useEffect = function(N, ee) {
    return ye.current.useEffect(N, ee);
  }, Vt.useId = function() {
    return ye.current.useId();
  }, Vt.useImperativeHandle = function(N, ee, be) {
    return ye.current.useImperativeHandle(N, ee, be);
  }, Vt.useInsertionEffect = function(N, ee) {
    return ye.current.useInsertionEffect(N, ee);
  }, Vt.useLayoutEffect = function(N, ee) {
    return ye.current.useLayoutEffect(N, ee);
  }, Vt.useMemo = function(N, ee) {
    return ye.current.useMemo(N, ee);
  }, Vt.useReducer = function(N, ee, be) {
    return ye.current.useReducer(N, ee, be);
  }, Vt.useRef = function(N) {
    return ye.current.useRef(N);
  }, Vt.useState = function(N) {
    return ye.current.useState(N);
  }, Vt.useSyncExternalStore = function(N, ee, be) {
    return ye.current.useSyncExternalStore(N, ee, be);
  }, Vt.useTransition = function() {
    return ye.current.useTransition();
  }, Vt.version = "18.2.0", Vt;
}
var Gh = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Gh.exports;
var Gw;
function rN() {
  return Gw || (Gw = 1, function(a, l) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var c = "18.2.0", p = Symbol.for("react.element"), g = Symbol.for("react.portal"), E = Symbol.for("react.fragment"), h = Symbol.for("react.strict_mode"), x = Symbol.for("react.profiler"), b = Symbol.for("react.provider"), R = Symbol.for("react.context"), D = Symbol.for("react.forward_ref"), M = Symbol.for("react.suspense"), A = Symbol.for("react.suspense_list"), j = Symbol.for("react.memo"), q = Symbol.for("react.lazy"), re = Symbol.for("react.offscreen"), ie = Symbol.iterator, ue = "@@iterator";
      function he(T) {
        if (T === null || typeof T != "object")
          return null;
        var L = ie && T[ie] || T[ue];
        return typeof L == "function" ? L : null;
      }
      var ne = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, Se = {
        transition: null
      }, ae = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, Re = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, xe = {}, le = null;
      function Xe(T) {
        le = T;
      }
      xe.setExtraStackFrame = function(T) {
        le = T;
      }, xe.getCurrentStack = null, xe.getStackAddendum = function() {
        var T = "";
        le && (T += le);
        var L = xe.getCurrentStack;
        return L && (T += L() || ""), T;
      };
      var yt = !1, Mt = !1, gt = !1, We = !1, Rt = !1, pt = {
        ReactCurrentDispatcher: ne,
        ReactCurrentBatchConfig: Se,
        ReactCurrentOwner: Re
      };
      pt.ReactDebugCurrentFrame = xe, pt.ReactCurrentActQueue = ae;
      function ht(T) {
        {
          for (var L = arguments.length, W = new Array(L > 1 ? L - 1 : 0), X = 1; X < L; X++)
            W[X - 1] = arguments[X];
          K("warn", T, W);
        }
      }
      function ye(T) {
        {
          for (var L = arguments.length, W = new Array(L > 1 ? L - 1 : 0), X = 1; X < L; X++)
            W[X - 1] = arguments[X];
          K("error", T, W);
        }
      }
      function K(T, L, W) {
        {
          var X = pt.ReactDebugCurrentFrame, ve = X.getStackAddendum();
          ve !== "" && (L += "%s", W = W.concat([ve]));
          var qe = W.map(function(Te) {
            return String(Te);
          });
          qe.unshift("Warning: " + L), Function.prototype.apply.call(console[T], console, qe);
        }
      }
      var De = {};
      function N(T, L) {
        {
          var W = T.constructor, X = W && (W.displayName || W.name) || "ReactClass", ve = X + "." + L;
          if (De[ve])
            return;
          ye("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", L, X), De[ve] = !0;
        }
      }
      var ee = {
        /**
         * Checks whether or not this composite component is mounted.
         * @param {ReactClass} publicInstance The instance we want to test.
         * @return {boolean} True if mounted, false otherwise.
         * @protected
         * @final
         */
        isMounted: function(T) {
          return !1;
        },
        /**
         * Forces an update. This should only be invoked when it is known with
         * certainty that we are **not** in a DOM transaction.
         *
         * You may want to call this when you know that some deeper aspect of the
         * component's state has changed but `setState` was not called.
         *
         * This will not invoke `shouldComponentUpdate`, but it will invoke
         * `componentWillUpdate` and `componentDidUpdate`.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueForceUpdate: function(T, L, W) {
          N(T, "forceUpdate");
        },
        /**
         * Replaces all of the state. Always use this or `setState` to mutate state.
         * You should treat `this.state` as immutable.
         *
         * There is no guarantee that `this.state` will be immediately updated, so
         * accessing `this.state` after calling this method may return the old value.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} completeState Next state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueReplaceState: function(T, L, W, X) {
          N(T, "replaceState");
        },
        /**
         * Sets a subset of the state. This only exists because _pendingState is
         * internal. This provides a merging strategy that is not available to deep
         * properties which is confusing. TODO: Expose pendingState or don't use it
         * during the merge.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} partialState Next partial state to be merged with state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} Name of the calling function in the public API.
         * @internal
         */
        enqueueSetState: function(T, L, W, X) {
          N(T, "setState");
        }
      }, be = Object.assign, Ie = {};
      Object.freeze(Ie);
      function Ne(T, L, W) {
        this.props = T, this.context = L, this.refs = Ie, this.updater = W || ee;
      }
      Ne.prototype.isReactComponent = {}, Ne.prototype.setState = function(T, L) {
        if (typeof T != "object" && typeof T != "function" && T != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, T, L, "setState");
      }, Ne.prototype.forceUpdate = function(T) {
        this.updater.enqueueForceUpdate(this, T, "forceUpdate");
      };
      {
        var bt = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, mt = function(T, L) {
          Object.defineProperty(Ne.prototype, T, {
            get: function() {
              ht("%s(...) is deprecated in plain JavaScript React classes. %s", L[0], L[1]);
            }
          });
        };
        for (var Ue in bt)
          bt.hasOwnProperty(Ue) && mt(Ue, bt[Ue]);
      }
      function ft() {
      }
      ft.prototype = Ne.prototype;
      function Ot(T, L, W) {
        this.props = T, this.context = L, this.refs = Ie, this.updater = W || ee;
      }
      var wn = Ot.prototype = new ft();
      wn.constructor = Ot, be(wn, Ne.prototype), wn.isPureReactComponent = !0;
      function mn() {
        var T = {
          current: null
        };
        return Object.seal(T), T;
      }
      var Vn = Array.isArray;
      function Dn(T) {
        return Vn(T);
      }
      function cr(T) {
        {
          var L = typeof Symbol == "function" && Symbol.toStringTag, W = L && T[Symbol.toStringTag] || T.constructor.name || "Object";
          return W;
        }
      }
      function Yn(T) {
        try {
          return er(T), !1;
        } catch {
          return !0;
        }
      }
      function er(T) {
        return "" + T;
      }
      function Jr(T) {
        if (Yn(T))
          return ye("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", cr(T)), er(T);
      }
      function Ta(T, L, W) {
        var X = T.displayName;
        if (X)
          return X;
        var ve = L.displayName || L.name || "";
        return ve !== "" ? W + "(" + ve + ")" : W;
      }
      function vi(T) {
        return T.displayName || "Context";
      }
      function tr(T) {
        if (T == null)
          return null;
        if (typeof T.tag == "number" && ye("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof T == "function")
          return T.displayName || T.name || null;
        if (typeof T == "string")
          return T;
        switch (T) {
          case E:
            return "Fragment";
          case g:
            return "Portal";
          case x:
            return "Profiler";
          case h:
            return "StrictMode";
          case M:
            return "Suspense";
          case A:
            return "SuspenseList";
        }
        if (typeof T == "object")
          switch (T.$$typeof) {
            case R:
              var L = T;
              return vi(L) + ".Consumer";
            case b:
              var W = T;
              return vi(W._context) + ".Provider";
            case D:
              return Ta(T, T.render, "ForwardRef");
            case j:
              var X = T.displayName || null;
              return X !== null ? X : tr(T.type) || "Memo";
            case q: {
              var ve = T, qe = ve._payload, Te = ve._init;
              try {
                return tr(Te(qe));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var _n = Object.prototype.hasOwnProperty, $n = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, kr, ra, zn;
      zn = {};
      function Dr(T) {
        if (_n.call(T, "ref")) {
          var L = Object.getOwnPropertyDescriptor(T, "ref").get;
          if (L && L.isReactWarning)
            return !1;
        }
        return T.ref !== void 0;
      }
      function yi(T) {
        if (_n.call(T, "key")) {
          var L = Object.getOwnPropertyDescriptor(T, "key").get;
          if (L && L.isReactWarning)
            return !1;
        }
        return T.key !== void 0;
      }
      function ia(T, L) {
        var W = function() {
          kr || (kr = !0, ye("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", L));
        };
        W.isReactWarning = !0, Object.defineProperty(T, "key", {
          get: W,
          configurable: !0
        });
      }
      function ba(T, L) {
        var W = function() {
          ra || (ra = !0, ye("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", L));
        };
        W.isReactWarning = !0, Object.defineProperty(T, "ref", {
          get: W,
          configurable: !0
        });
      }
      function ge(T) {
        if (typeof T.ref == "string" && Re.current && T.__self && Re.current.stateNode !== T.__self) {
          var L = tr(Re.current.type);
          zn[L] || (ye('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', L, T.ref), zn[L] = !0);
        }
      }
      var Ye = function(T, L, W, X, ve, qe, Te) {
        var nt = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: p,
          // Built-in properties that belong on the element
          type: T,
          key: L,
          ref: W,
          props: Te,
          // Record the component responsible for creating this element.
          _owner: qe
        };
        return nt._store = {}, Object.defineProperty(nt._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(nt, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: X
        }), Object.defineProperty(nt, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: ve
        }), Object.freeze && (Object.freeze(nt.props), Object.freeze(nt)), nt;
      };
      function St(T, L, W) {
        var X, ve = {}, qe = null, Te = null, nt = null, xt = null;
        if (L != null) {
          Dr(L) && (Te = L.ref, ge(L)), yi(L) && (Jr(L.key), qe = "" + L.key), nt = L.__self === void 0 ? null : L.__self, xt = L.__source === void 0 ? null : L.__source;
          for (X in L)
            _n.call(L, X) && !$n.hasOwnProperty(X) && (ve[X] = L[X]);
        }
        var zt = arguments.length - 2;
        if (zt === 1)
          ve.children = W;
        else if (zt > 1) {
          for (var ln = Array(zt), qt = 0; qt < zt; qt++)
            ln[qt] = arguments[qt + 2];
          Object.freeze && Object.freeze(ln), ve.children = ln;
        }
        if (T && T.defaultProps) {
          var Tt = T.defaultProps;
          for (X in Tt)
            ve[X] === void 0 && (ve[X] = Tt[X]);
        }
        if (qe || Te) {
          var Zt = typeof T == "function" ? T.displayName || T.name || "Unknown" : T;
          qe && ia(ve, Zt), Te && ba(ve, Zt);
        }
        return Ye(T, qe, Te, nt, xt, Re.current, ve);
      }
      function Yt(T, L) {
        var W = Ye(T.type, L, T.ref, T._self, T._source, T._owner, T.props);
        return W;
      }
      function an(T, L, W) {
        if (T == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + T + ".");
        var X, ve = be({}, T.props), qe = T.key, Te = T.ref, nt = T._self, xt = T._source, zt = T._owner;
        if (L != null) {
          Dr(L) && (Te = L.ref, zt = Re.current), yi(L) && (Jr(L.key), qe = "" + L.key);
          var ln;
          T.type && T.type.defaultProps && (ln = T.type.defaultProps);
          for (X in L)
            _n.call(L, X) && !$n.hasOwnProperty(X) && (L[X] === void 0 && ln !== void 0 ? ve[X] = ln[X] : ve[X] = L[X]);
        }
        var qt = arguments.length - 2;
        if (qt === 1)
          ve.children = W;
        else if (qt > 1) {
          for (var Tt = Array(qt), Zt = 0; Zt < qt; Zt++)
            Tt[Zt] = arguments[Zt + 2];
          ve.children = Tt;
        }
        return Ye(T.type, qe, Te, nt, xt, zt, ve);
      }
      function Cn(T) {
        return typeof T == "object" && T !== null && T.$$typeof === p;
      }
      var fn = ".", nr = ":";
      function on(T) {
        var L = /[=:]/g, W = {
          "=": "=0",
          ":": "=2"
        }, X = T.replace(L, function(ve) {
          return W[ve];
        });
        return "$" + X;
      }
      var Kt = !1, Qt = /\/+/g;
      function gi(T) {
        return T.replace(Qt, "$&/");
      }
      function _r(T, L) {
        return typeof T == "object" && T !== null && T.key != null ? (Jr(T.key), on("" + T.key)) : L.toString(36);
      }
      function Ai(T, L, W, X, ve) {
        var qe = typeof T;
        (qe === "undefined" || qe === "boolean") && (T = null);
        var Te = !1;
        if (T === null)
          Te = !0;
        else
          switch (qe) {
            case "string":
            case "number":
              Te = !0;
              break;
            case "object":
              switch (T.$$typeof) {
                case p:
                case g:
                  Te = !0;
              }
          }
        if (Te) {
          var nt = T, xt = ve(nt), zt = X === "" ? fn + _r(nt, 0) : X;
          if (Dn(xt)) {
            var ln = "";
            zt != null && (ln = gi(zt) + "/"), Ai(xt, L, ln, "", function($d) {
              return $d;
            });
          } else xt != null && (Cn(xt) && (xt.key && (!nt || nt.key !== xt.key) && Jr(xt.key), xt = Yt(
            xt,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            W + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (xt.key && (!nt || nt.key !== xt.key) ? (
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              gi("" + xt.key) + "/"
            ) : "") + zt
          )), L.push(xt));
          return 1;
        }
        var qt, Tt, Zt = 0, En = X === "" ? fn : X + nr;
        if (Dn(T))
          for (var Go = 0; Go < T.length; Go++)
            qt = T[Go], Tt = En + _r(qt, Go), Zt += Ai(qt, L, W, Tt, ve);
        else {
          var Vu = he(T);
          if (typeof Vu == "function") {
            var ao = T;
            Vu === ao.entries && (Kt || ht("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), Kt = !0);
            for (var zu = Vu.call(ao), Pl, Yd = 0; !(Pl = zu.next()).done; )
              qt = Pl.value, Tt = En + _r(qt, Yd++), Zt += Ai(qt, L, W, Tt, ve);
          } else if (qe === "object") {
            var Gc = String(T);
            throw new Error("Objects are not valid as a React child (found: " + (Gc === "[object Object]" ? "object with keys {" + Object.keys(T).join(", ") + "}" : Gc) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return Zt;
      }
      function eo(T, L, W) {
        if (T == null)
          return T;
        var X = [], ve = 0;
        return Ai(T, X, "", "", function(qe) {
          return L.call(W, qe, ve++);
        }), X;
      }
      function Rl(T) {
        var L = 0;
        return eo(T, function() {
          L++;
        }), L;
      }
      function kl(T, L, W) {
        eo(T, function() {
          L.apply(this, arguments);
        }, W);
      }
      function Uo(T) {
        return eo(T, function(L) {
          return L;
        }) || [];
      }
      function Fo(T) {
        if (!Cn(T))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return T;
      }
      function Dl(T) {
        var L = {
          $$typeof: R,
          // As a workaround to support multiple concurrent renderers, we categorize
          // some renderers as primary and others as secondary. We only expect
          // there to be two concurrent renderers at most: React Native (primary) and
          // Fabric (secondary); React DOM (primary) and React ART (secondary).
          // Secondary renderers store their context values on separate fields.
          _currentValue: T,
          _currentValue2: T,
          // Used to track how many concurrent renderers this context currently
          // supports within in a single renderer. Such as parallel server rendering.
          _threadCount: 0,
          // These are circular
          Provider: null,
          Consumer: null,
          // Add these to use same hidden class in VM as ServerContext
          _defaultValue: null,
          _globalName: null
        };
        L.Provider = {
          $$typeof: b,
          _context: L
        };
        var W = !1, X = !1, ve = !1;
        {
          var qe = {
            $$typeof: R,
            _context: L
          };
          Object.defineProperties(qe, {
            Provider: {
              get: function() {
                return X || (X = !0, ye("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), L.Provider;
              },
              set: function(Te) {
                L.Provider = Te;
              }
            },
            _currentValue: {
              get: function() {
                return L._currentValue;
              },
              set: function(Te) {
                L._currentValue = Te;
              }
            },
            _currentValue2: {
              get: function() {
                return L._currentValue2;
              },
              set: function(Te) {
                L._currentValue2 = Te;
              }
            },
            _threadCount: {
              get: function() {
                return L._threadCount;
              },
              set: function(Te) {
                L._threadCount = Te;
              }
            },
            Consumer: {
              get: function() {
                return W || (W = !0, ye("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), L.Consumer;
              }
            },
            displayName: {
              get: function() {
                return L.displayName;
              },
              set: function(Te) {
                ve || (ht("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", Te), ve = !0);
              }
            }
          }), L.Consumer = qe;
        }
        return L._currentRenderer = null, L._currentRenderer2 = null, L;
      }
      var zr = -1, Ur = 0, Mr = 1, xa = 2;
      function aa(T) {
        if (T._status === zr) {
          var L = T._result, W = L();
          if (W.then(function(qe) {
            if (T._status === Ur || T._status === zr) {
              var Te = T;
              Te._status = Mr, Te._result = qe;
            }
          }, function(qe) {
            if (T._status === Ur || T._status === zr) {
              var Te = T;
              Te._status = xa, Te._result = qe;
            }
          }), T._status === zr) {
            var X = T;
            X._status = Ur, X._result = W;
          }
        }
        if (T._status === Mr) {
          var ve = T._result;
          return ve === void 0 && ye(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, ve), "default" in ve || ye(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, ve), ve.default;
        } else
          throw T._result;
      }
      function wa(T) {
        var L = {
          // We use these fields to store the result.
          _status: zr,
          _result: T
        }, W = {
          $$typeof: q,
          _payload: L,
          _init: aa
        };
        {
          var X, ve;
          Object.defineProperties(W, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return X;
              },
              set: function(qe) {
                ye("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), X = qe, Object.defineProperty(W, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return ve;
              },
              set: function(qe) {
                ye("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), ve = qe, Object.defineProperty(W, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return W;
      }
      function P(T) {
        T != null && T.$$typeof === j ? ye("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof T != "function" ? ye("forwardRef requires a render function but was given %s.", T === null ? "null" : typeof T) : T.length !== 0 && T.length !== 2 && ye("forwardRef render functions accept exactly two parameters: props and ref. %s", T.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), T != null && (T.defaultProps != null || T.propTypes != null) && ye("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var L = {
          $$typeof: D,
          render: T
        };
        {
          var W;
          Object.defineProperty(L, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return W;
            },
            set: function(X) {
              W = X, !T.name && !T.displayName && (T.displayName = X);
            }
          });
        }
        return L;
      }
      var ce;
      ce = Symbol.for("react.module.reference");
      function Ce(T) {
        return !!(typeof T == "string" || typeof T == "function" || T === E || T === x || Rt || T === h || T === M || T === A || We || T === re || yt || Mt || gt || typeof T == "object" && T !== null && (T.$$typeof === q || T.$$typeof === j || T.$$typeof === b || T.$$typeof === R || T.$$typeof === D || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        T.$$typeof === ce || T.getModuleId !== void 0));
      }
      function Je(T, L) {
        Ce(T) || ye("memo: The first argument must be a component. Instead received: %s", T === null ? "null" : typeof T);
        var W = {
          $$typeof: j,
          type: T,
          compare: L === void 0 ? null : L
        };
        {
          var X;
          Object.defineProperty(W, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return X;
            },
            set: function(ve) {
              X = ve, !T.name && !T.displayName && (T.displayName = ve);
            }
          });
        }
        return W;
      }
      function it() {
        var T = ne.current;
        return T === null && ye(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), T;
      }
      function Ct(T) {
        var L = it();
        if (T._context !== void 0) {
          var W = T._context;
          W.Consumer === T ? ye("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : W.Provider === T && ye("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return L.useContext(T);
      }
      function et(T) {
        var L = it();
        return L.useState(T);
      }
      function Et(T, L, W) {
        var X = it();
        return X.useReducer(T, L, W);
      }
      function Wn(T) {
        var L = it();
        return L.useRef(T);
      }
      function tn(T, L) {
        var W = it();
        return W.useEffect(T, L);
      }
      function dn(T, L) {
        var W = it();
        return W.useInsertionEffect(T, L);
      }
      function fr(T, L) {
        var W = it();
        return W.useLayoutEffect(T, L);
      }
      function oa(T, L) {
        var W = it();
        return W.useCallback(T, L);
      }
      function _l(T, L) {
        var W = it();
        return W.useMemo(T, L);
      }
      function Si(T, L, W) {
        var X = it();
        return X.useImperativeHandle(T, L, W);
      }
      function Gt(T, L) {
        {
          var W = it();
          return W.useDebugValue(T, L);
        }
      }
      function kt() {
        var T = it();
        return T.useTransition();
      }
      function to(T) {
        var L = it();
        return L.useDeferredValue(T);
      }
      function Ou() {
        var T = it();
        return T.useId();
      }
      function Ml(T, L, W) {
        var X = it();
        return X.useSyncExternalStore(T, L, W);
      }
      var jo = 0, Ts, Bo, ei, Au, Fr, $c, Wc;
      function bs() {
      }
      bs.__reactDisabledLog = !0;
      function Ho() {
        {
          if (jo === 0) {
            Ts = console.log, Bo = console.info, ei = console.warn, Au = console.error, Fr = console.group, $c = console.groupCollapsed, Wc = console.groupEnd;
            var T = {
              configurable: !0,
              enumerable: !0,
              value: bs,
              writable: !0
            };
            Object.defineProperties(console, {
              info: T,
              log: T,
              warn: T,
              error: T,
              group: T,
              groupCollapsed: T,
              groupEnd: T
            });
          }
          jo++;
        }
      }
      function Ci() {
        {
          if (jo--, jo === 0) {
            var T = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: be({}, T, {
                value: Ts
              }),
              info: be({}, T, {
                value: Bo
              }),
              warn: be({}, T, {
                value: ei
              }),
              error: be({}, T, {
                value: Au
              }),
              group: be({}, T, {
                value: Fr
              }),
              groupCollapsed: be({}, T, {
                value: $c
              }),
              groupEnd: be({}, T, {
                value: Wc
              })
            });
          }
          jo < 0 && ye("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var la = pt.ReactCurrentDispatcher, sa;
      function xs(T, L, W) {
        {
          if (sa === void 0)
            try {
              throw Error();
            } catch (ve) {
              var X = ve.stack.trim().match(/\n( *(at )?)/);
              sa = X && X[1] || "";
            }
          return `
` + sa + T;
        }
      }
      var Ol = !1, Io;
      {
        var ws = typeof WeakMap == "function" ? WeakMap : Map;
        Io = new ws();
      }
      function Rs(T, L) {
        if (!T || Ol)
          return "";
        {
          var W = Io.get(T);
          if (W !== void 0)
            return W;
        }
        var X;
        Ol = !0;
        var ve = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var qe;
        qe = la.current, la.current = null, Ho();
        try {
          if (L) {
            var Te = function() {
              throw Error();
            };
            if (Object.defineProperty(Te.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(Te, []);
              } catch (En) {
                X = En;
              }
              Reflect.construct(T, [], Te);
            } else {
              try {
                Te.call();
              } catch (En) {
                X = En;
              }
              T.call(Te.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (En) {
              X = En;
            }
            T();
          }
        } catch (En) {
          if (En && X && typeof En.stack == "string") {
            for (var nt = En.stack.split(`
`), xt = X.stack.split(`
`), zt = nt.length - 1, ln = xt.length - 1; zt >= 1 && ln >= 0 && nt[zt] !== xt[ln]; )
              ln--;
            for (; zt >= 1 && ln >= 0; zt--, ln--)
              if (nt[zt] !== xt[ln]) {
                if (zt !== 1 || ln !== 1)
                  do
                    if (zt--, ln--, ln < 0 || nt[zt] !== xt[ln]) {
                      var qt = `
` + nt[zt].replace(" at new ", " at ");
                      return T.displayName && qt.includes("<anonymous>") && (qt = qt.replace("<anonymous>", T.displayName)), typeof T == "function" && Io.set(T, qt), qt;
                    }
                  while (zt >= 1 && ln >= 0);
                break;
              }
          }
        } finally {
          Ol = !1, la.current = qe, Ci(), Error.prepareStackTrace = ve;
        }
        var Tt = T ? T.displayName || T.name : "", Zt = Tt ? xs(Tt) : "";
        return typeof T == "function" && Io.set(T, Zt), Zt;
      }
      function no(T, L, W) {
        return Rs(T, !1);
      }
      function Hd(T) {
        var L = T.prototype;
        return !!(L && L.isReactComponent);
      }
      function ro(T, L, W) {
        if (T == null)
          return "";
        if (typeof T == "function")
          return Rs(T, Hd(T));
        if (typeof T == "string")
          return xs(T);
        switch (T) {
          case M:
            return xs("Suspense");
          case A:
            return xs("SuspenseList");
        }
        if (typeof T == "object")
          switch (T.$$typeof) {
            case D:
              return no(T.render);
            case j:
              return ro(T.type, L, W);
            case q: {
              var X = T, ve = X._payload, qe = X._init;
              try {
                return ro(qe(ve), L, W);
              } catch {
              }
            }
          }
        return "";
      }
      var Ft = {}, ks = pt.ReactDebugCurrentFrame;
      function jt(T) {
        if (T) {
          var L = T._owner, W = ro(T.type, T._source, L ? L.type : null);
          ks.setExtraStackFrame(W);
        } else
          ks.setExtraStackFrame(null);
      }
      function Lu(T, L, W, X, ve) {
        {
          var qe = Function.call.bind(_n);
          for (var Te in T)
            if (qe(T, Te)) {
              var nt = void 0;
              try {
                if (typeof T[Te] != "function") {
                  var xt = Error((X || "React class") + ": " + W + " type `" + Te + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof T[Te] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw xt.name = "Invariant Violation", xt;
                }
                nt = T[Te](L, Te, X, W, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (zt) {
                nt = zt;
              }
              nt && !(nt instanceof Error) && (jt(ve), ye("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", X || "React class", W, Te, typeof nt), jt(null)), nt instanceof Error && !(nt.message in Ft) && (Ft[nt.message] = !0, jt(ve), ye("Failed %s type: %s", W, nt.message), jt(null));
            }
        }
      }
      function Ra(T) {
        if (T) {
          var L = T._owner, W = ro(T.type, T._source, L ? L.type : null);
          Xe(W);
        } else
          Xe(null);
      }
      var lt;
      lt = !1;
      function Ds() {
        if (Re.current) {
          var T = tr(Re.current.type);
          if (T)
            return `

Check the render method of \`` + T + "`.";
        }
        return "";
      }
      function dr(T) {
        if (T !== void 0) {
          var L = T.fileName.replace(/^.*[\\\/]/, ""), W = T.lineNumber;
          return `

Check your code at ` + L + ":" + W + ".";
        }
        return "";
      }
      function ka(T) {
        return T != null ? dr(T.__source) : "";
      }
      var jr = {};
      function Da(T) {
        var L = Ds();
        if (!L) {
          var W = typeof T == "string" ? T : T.displayName || T.name;
          W && (L = `

Check the top-level render call using <` + W + ">.");
        }
        return L;
      }
      function pn(T, L) {
        if (!(!T._store || T._store.validated || T.key != null)) {
          T._store.validated = !0;
          var W = Da(L);
          if (!jr[W]) {
            jr[W] = !0;
            var X = "";
            T && T._owner && T._owner !== Re.current && (X = " It was passed a child from " + tr(T._owner.type) + "."), Ra(T), ye('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', W, X), Ra(null);
          }
        }
      }
      function Xt(T, L) {
        if (typeof T == "object") {
          if (Dn(T))
            for (var W = 0; W < T.length; W++) {
              var X = T[W];
              Cn(X) && pn(X, L);
            }
          else if (Cn(T))
            T._store && (T._store.validated = !0);
          else if (T) {
            var ve = he(T);
            if (typeof ve == "function" && ve !== T.entries)
              for (var qe = ve.call(T), Te; !(Te = qe.next()).done; )
                Cn(Te.value) && pn(Te.value, L);
          }
        }
      }
      function Yo(T) {
        {
          var L = T.type;
          if (L == null || typeof L == "string")
            return;
          var W;
          if (typeof L == "function")
            W = L.propTypes;
          else if (typeof L == "object" && (L.$$typeof === D || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          L.$$typeof === j))
            W = L.propTypes;
          else
            return;
          if (W) {
            var X = tr(L);
            Lu(W, T.props, "prop", X, T);
          } else if (L.PropTypes !== void 0 && !lt) {
            lt = !0;
            var ve = tr(L);
            ye("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", ve || "Unknown");
          }
          typeof L.getDefaultProps == "function" && !L.getDefaultProps.isReactClassApproved && ye("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function Gn(T) {
        {
          for (var L = Object.keys(T.props), W = 0; W < L.length; W++) {
            var X = L[W];
            if (X !== "children" && X !== "key") {
              Ra(T), ye("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", X), Ra(null);
              break;
            }
          }
          T.ref !== null && (Ra(T), ye("Invalid attribute `ref` supplied to `React.Fragment`."), Ra(null));
        }
      }
      function Br(T, L, W) {
        var X = Ce(T);
        if (!X) {
          var ve = "";
          (T === void 0 || typeof T == "object" && T !== null && Object.keys(T).length === 0) && (ve += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var qe = ka(L);
          qe ? ve += qe : ve += Ds();
          var Te;
          T === null ? Te = "null" : Dn(T) ? Te = "array" : T !== void 0 && T.$$typeof === p ? (Te = "<" + (tr(T.type) || "Unknown") + " />", ve = " Did you accidentally export a JSX literal instead of a component?") : Te = typeof T, ye("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", Te, ve);
        }
        var nt = St.apply(this, arguments);
        if (nt == null)
          return nt;
        if (X)
          for (var xt = 2; xt < arguments.length; xt++)
            Xt(arguments[xt], T);
        return T === E ? Gn(nt) : Yo(nt), nt;
      }
      var Li = !1;
      function Al(T) {
        var L = Br.bind(null, T);
        return L.type = T, Li || (Li = !0, ht("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(L, "type", {
          enumerable: !1,
          get: function() {
            return ht("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: T
            }), T;
          }
        }), L;
      }
      function Nu(T, L, W) {
        for (var X = an.apply(this, arguments), ve = 2; ve < arguments.length; ve++)
          Xt(arguments[ve], X.type);
        return Yo(X), X;
      }
      function Pu(T, L) {
        var W = Se.transition;
        Se.transition = {};
        var X = Se.transition;
        Se.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          T();
        } finally {
          if (Se.transition = W, W === null && X._updatedFibers) {
            var ve = X._updatedFibers.size;
            ve > 10 && ht("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), X._updatedFibers.clear();
          }
        }
      }
      var $o = !1, Ll = null;
      function Id(T) {
        if (Ll === null)
          try {
            var L = ("require" + Math.random()).slice(0, 7), W = a && a[L];
            Ll = W.call(a, "timers").setImmediate;
          } catch {
            Ll = function(ve) {
              $o === !1 && ($o = !0, typeof MessageChannel > "u" && ye("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var qe = new MessageChannel();
              qe.port1.onmessage = ve, qe.port2.postMessage(void 0);
            };
          }
        return Ll(T);
      }
      var Ni = 0, ua = !1;
      function io(T) {
        {
          var L = Ni;
          Ni++, ae.current === null && (ae.current = []);
          var W = ae.isBatchingLegacy, X;
          try {
            if (ae.isBatchingLegacy = !0, X = T(), !W && ae.didScheduleLegacyUpdate) {
              var ve = ae.current;
              ve !== null && (ae.didScheduleLegacyUpdate = !1, Wo(ve));
            }
          } catch (Tt) {
            throw Pi(L), Tt;
          } finally {
            ae.isBatchingLegacy = W;
          }
          if (X !== null && typeof X == "object" && typeof X.then == "function") {
            var qe = X, Te = !1, nt = {
              then: function(Tt, Zt) {
                Te = !0, qe.then(function(En) {
                  Pi(L), Ni === 0 ? _s(En, Tt, Zt) : Tt(En);
                }, function(En) {
                  Pi(L), Zt(En);
                });
              }
            };
            return !ua && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              Te || (ua = !0, ye("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), nt;
          } else {
            var xt = X;
            if (Pi(L), Ni === 0) {
              var zt = ae.current;
              zt !== null && (Wo(zt), ae.current = null);
              var ln = {
                then: function(Tt, Zt) {
                  ae.current === null ? (ae.current = [], _s(xt, Tt, Zt)) : Tt(xt);
                }
              };
              return ln;
            } else {
              var qt = {
                then: function(Tt, Zt) {
                  Tt(xt);
                }
              };
              return qt;
            }
          }
        }
      }
      function Pi(T) {
        T !== Ni - 1 && ye("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), Ni = T;
      }
      function _s(T, L, W) {
        {
          var X = ae.current;
          if (X !== null)
            try {
              Wo(X), Id(function() {
                X.length === 0 ? (ae.current = null, L(T)) : _s(T, L, W);
              });
            } catch (ve) {
              W(ve);
            }
          else
            L(T);
        }
      }
      var Ms = !1;
      function Wo(T) {
        if (!Ms) {
          Ms = !0;
          var L = 0;
          try {
            for (; L < T.length; L++) {
              var W = T[L];
              do
                W = W(!0);
              while (W !== null);
            }
            T.length = 0;
          } catch (X) {
            throw T = T.slice(L + 1), X;
          } finally {
            Ms = !1;
          }
        }
      }
      var Nl = Br, Os = Nu, As = Al, ca = {
        map: eo,
        forEach: kl,
        count: Rl,
        toArray: Uo,
        only: Fo
      };
      l.Children = ca, l.Component = Ne, l.Fragment = E, l.Profiler = x, l.PureComponent = Ot, l.StrictMode = h, l.Suspense = M, l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = pt, l.cloneElement = Os, l.createContext = Dl, l.createElement = Nl, l.createFactory = As, l.createRef = mn, l.forwardRef = P, l.isValidElement = Cn, l.lazy = wa, l.memo = Je, l.startTransition = Pu, l.unstable_act = io, l.useCallback = oa, l.useContext = Ct, l.useDebugValue = Gt, l.useDeferredValue = to, l.useEffect = tn, l.useId = Ou, l.useImperativeHandle = Si, l.useInsertionEffect = dn, l.useLayoutEffect = fr, l.useMemo = _l, l.useReducer = Et, l.useRef = Wn, l.useState = et, l.useSyncExternalStore = Ml, l.useTransition = kt, l.version = c, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(Gh, Gh.exports)), Gh.exports;
}
process.env.NODE_ENV === "production" ? lE.exports = nN() : lE.exports = rN();
var at = lE.exports;
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Kw;
function iN() {
  if (Kw) return Ih;
  Kw = 1;
  var a = at, l = Symbol.for("react.element"), c = Symbol.for("react.fragment"), p = Object.prototype.hasOwnProperty, g = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, E = { key: !0, ref: !0, __self: !0, __source: !0 };
  function h(x, b, R) {
    var D, M = {}, A = null, j = null;
    R !== void 0 && (A = "" + R), b.key !== void 0 && (A = "" + b.key), b.ref !== void 0 && (j = b.ref);
    for (D in b) p.call(b, D) && !E.hasOwnProperty(D) && (M[D] = b[D]);
    if (x && x.defaultProps) for (D in b = x.defaultProps, b) M[D] === void 0 && (M[D] = b[D]);
    return { $$typeof: l, type: x, key: A, ref: j, props: M, _owner: g.current };
  }
  return Ih.Fragment = c, Ih.jsx = h, Ih.jsxs = h, Ih;
}
var Yh = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Qw;
function aN() {
  return Qw || (Qw = 1, process.env.NODE_ENV !== "production" && function() {
    var a = at, l = Symbol.for("react.element"), c = Symbol.for("react.portal"), p = Symbol.for("react.fragment"), g = Symbol.for("react.strict_mode"), E = Symbol.for("react.profiler"), h = Symbol.for("react.provider"), x = Symbol.for("react.context"), b = Symbol.for("react.forward_ref"), R = Symbol.for("react.suspense"), D = Symbol.for("react.suspense_list"), M = Symbol.for("react.memo"), A = Symbol.for("react.lazy"), j = Symbol.for("react.offscreen"), q = Symbol.iterator, re = "@@iterator";
    function ie(P) {
      if (P === null || typeof P != "object")
        return null;
      var ce = q && P[q] || P[re];
      return typeof ce == "function" ? ce : null;
    }
    var ue = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function he(P) {
      {
        for (var ce = arguments.length, Ce = new Array(ce > 1 ? ce - 1 : 0), Je = 1; Je < ce; Je++)
          Ce[Je - 1] = arguments[Je];
        ne("error", P, Ce);
      }
    }
    function ne(P, ce, Ce) {
      {
        var Je = ue.ReactDebugCurrentFrame, it = Je.getStackAddendum();
        it !== "" && (ce += "%s", Ce = Ce.concat([it]));
        var Ct = Ce.map(function(et) {
          return String(et);
        });
        Ct.unshift("Warning: " + ce), Function.prototype.apply.call(console[P], console, Ct);
      }
    }
    var Se = !1, ae = !1, Re = !1, xe = !1, le = !1, Xe;
    Xe = Symbol.for("react.module.reference");
    function yt(P) {
      return !!(typeof P == "string" || typeof P == "function" || P === p || P === E || le || P === g || P === R || P === D || xe || P === j || Se || ae || Re || typeof P == "object" && P !== null && (P.$$typeof === A || P.$$typeof === M || P.$$typeof === h || P.$$typeof === x || P.$$typeof === b || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      P.$$typeof === Xe || P.getModuleId !== void 0));
    }
    function Mt(P, ce, Ce) {
      var Je = P.displayName;
      if (Je)
        return Je;
      var it = ce.displayName || ce.name || "";
      return it !== "" ? Ce + "(" + it + ")" : Ce;
    }
    function gt(P) {
      return P.displayName || "Context";
    }
    function We(P) {
      if (P == null)
        return null;
      if (typeof P.tag == "number" && he("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof P == "function")
        return P.displayName || P.name || null;
      if (typeof P == "string")
        return P;
      switch (P) {
        case p:
          return "Fragment";
        case c:
          return "Portal";
        case E:
          return "Profiler";
        case g:
          return "StrictMode";
        case R:
          return "Suspense";
        case D:
          return "SuspenseList";
      }
      if (typeof P == "object")
        switch (P.$$typeof) {
          case x:
            var ce = P;
            return gt(ce) + ".Consumer";
          case h:
            var Ce = P;
            return gt(Ce._context) + ".Provider";
          case b:
            return Mt(P, P.render, "ForwardRef");
          case M:
            var Je = P.displayName || null;
            return Je !== null ? Je : We(P.type) || "Memo";
          case A: {
            var it = P, Ct = it._payload, et = it._init;
            try {
              return We(et(Ct));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var Rt = Object.assign, pt = 0, ht, ye, K, De, N, ee, be;
    function Ie() {
    }
    Ie.__reactDisabledLog = !0;
    function Ne() {
      {
        if (pt === 0) {
          ht = console.log, ye = console.info, K = console.warn, De = console.error, N = console.group, ee = console.groupCollapsed, be = console.groupEnd;
          var P = {
            configurable: !0,
            enumerable: !0,
            value: Ie,
            writable: !0
          };
          Object.defineProperties(console, {
            info: P,
            log: P,
            warn: P,
            error: P,
            group: P,
            groupCollapsed: P,
            groupEnd: P
          });
        }
        pt++;
      }
    }
    function bt() {
      {
        if (pt--, pt === 0) {
          var P = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Rt({}, P, {
              value: ht
            }),
            info: Rt({}, P, {
              value: ye
            }),
            warn: Rt({}, P, {
              value: K
            }),
            error: Rt({}, P, {
              value: De
            }),
            group: Rt({}, P, {
              value: N
            }),
            groupCollapsed: Rt({}, P, {
              value: ee
            }),
            groupEnd: Rt({}, P, {
              value: be
            })
          });
        }
        pt < 0 && he("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var mt = ue.ReactCurrentDispatcher, Ue;
    function ft(P, ce, Ce) {
      {
        if (Ue === void 0)
          try {
            throw Error();
          } catch (it) {
            var Je = it.stack.trim().match(/\n( *(at )?)/);
            Ue = Je && Je[1] || "";
          }
        return `
` + Ue + P;
      }
    }
    var Ot = !1, wn;
    {
      var mn = typeof WeakMap == "function" ? WeakMap : Map;
      wn = new mn();
    }
    function Vn(P, ce) {
      if (!P || Ot)
        return "";
      {
        var Ce = wn.get(P);
        if (Ce !== void 0)
          return Ce;
      }
      var Je;
      Ot = !0;
      var it = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var Ct;
      Ct = mt.current, mt.current = null, Ne();
      try {
        if (ce) {
          var et = function() {
            throw Error();
          };
          if (Object.defineProperty(et.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(et, []);
            } catch (Si) {
              Je = Si;
            }
            Reflect.construct(P, [], et);
          } else {
            try {
              et.call();
            } catch (Si) {
              Je = Si;
            }
            P.call(et.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (Si) {
            Je = Si;
          }
          P();
        }
      } catch (Si) {
        if (Si && Je && typeof Si.stack == "string") {
          for (var Et = Si.stack.split(`
`), Wn = Je.stack.split(`
`), tn = Et.length - 1, dn = Wn.length - 1; tn >= 1 && dn >= 0 && Et[tn] !== Wn[dn]; )
            dn--;
          for (; tn >= 1 && dn >= 0; tn--, dn--)
            if (Et[tn] !== Wn[dn]) {
              if (tn !== 1 || dn !== 1)
                do
                  if (tn--, dn--, dn < 0 || Et[tn] !== Wn[dn]) {
                    var fr = `
` + Et[tn].replace(" at new ", " at ");
                    return P.displayName && fr.includes("<anonymous>") && (fr = fr.replace("<anonymous>", P.displayName)), typeof P == "function" && wn.set(P, fr), fr;
                  }
                while (tn >= 1 && dn >= 0);
              break;
            }
        }
      } finally {
        Ot = !1, mt.current = Ct, bt(), Error.prepareStackTrace = it;
      }
      var oa = P ? P.displayName || P.name : "", _l = oa ? ft(oa) : "";
      return typeof P == "function" && wn.set(P, _l), _l;
    }
    function Dn(P, ce, Ce) {
      return Vn(P, !1);
    }
    function cr(P) {
      var ce = P.prototype;
      return !!(ce && ce.isReactComponent);
    }
    function Yn(P, ce, Ce) {
      if (P == null)
        return "";
      if (typeof P == "function")
        return Vn(P, cr(P));
      if (typeof P == "string")
        return ft(P);
      switch (P) {
        case R:
          return ft("Suspense");
        case D:
          return ft("SuspenseList");
      }
      if (typeof P == "object")
        switch (P.$$typeof) {
          case b:
            return Dn(P.render);
          case M:
            return Yn(P.type, ce, Ce);
          case A: {
            var Je = P, it = Je._payload, Ct = Je._init;
            try {
              return Yn(Ct(it), ce, Ce);
            } catch {
            }
          }
        }
      return "";
    }
    var er = Object.prototype.hasOwnProperty, Jr = {}, Ta = ue.ReactDebugCurrentFrame;
    function vi(P) {
      if (P) {
        var ce = P._owner, Ce = Yn(P.type, P._source, ce ? ce.type : null);
        Ta.setExtraStackFrame(Ce);
      } else
        Ta.setExtraStackFrame(null);
    }
    function tr(P, ce, Ce, Je, it) {
      {
        var Ct = Function.call.bind(er);
        for (var et in P)
          if (Ct(P, et)) {
            var Et = void 0;
            try {
              if (typeof P[et] != "function") {
                var Wn = Error((Je || "React class") + ": " + Ce + " type `" + et + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof P[et] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw Wn.name = "Invariant Violation", Wn;
              }
              Et = P[et](ce, et, Je, Ce, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (tn) {
              Et = tn;
            }
            Et && !(Et instanceof Error) && (vi(it), he("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", Je || "React class", Ce, et, typeof Et), vi(null)), Et instanceof Error && !(Et.message in Jr) && (Jr[Et.message] = !0, vi(it), he("Failed %s type: %s", Ce, Et.message), vi(null));
          }
      }
    }
    var _n = Array.isArray;
    function $n(P) {
      return _n(P);
    }
    function kr(P) {
      {
        var ce = typeof Symbol == "function" && Symbol.toStringTag, Ce = ce && P[Symbol.toStringTag] || P.constructor.name || "Object";
        return Ce;
      }
    }
    function ra(P) {
      try {
        return zn(P), !1;
      } catch {
        return !0;
      }
    }
    function zn(P) {
      return "" + P;
    }
    function Dr(P) {
      if (ra(P))
        return he("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", kr(P)), zn(P);
    }
    var yi = ue.ReactCurrentOwner, ia = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, ba, ge;
    function Ye(P) {
      if (er.call(P, "ref")) {
        var ce = Object.getOwnPropertyDescriptor(P, "ref").get;
        if (ce && ce.isReactWarning)
          return !1;
      }
      return P.ref !== void 0;
    }
    function St(P) {
      if (er.call(P, "key")) {
        var ce = Object.getOwnPropertyDescriptor(P, "key").get;
        if (ce && ce.isReactWarning)
          return !1;
      }
      return P.key !== void 0;
    }
    function Yt(P, ce) {
      typeof P.ref == "string" && yi.current;
    }
    function an(P, ce) {
      {
        var Ce = function() {
          ba || (ba = !0, he("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", ce));
        };
        Ce.isReactWarning = !0, Object.defineProperty(P, "key", {
          get: Ce,
          configurable: !0
        });
      }
    }
    function Cn(P, ce) {
      {
        var Ce = function() {
          ge || (ge = !0, he("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", ce));
        };
        Ce.isReactWarning = !0, Object.defineProperty(P, "ref", {
          get: Ce,
          configurable: !0
        });
      }
    }
    var fn = function(P, ce, Ce, Je, it, Ct, et) {
      var Et = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: l,
        // Built-in properties that belong on the element
        type: P,
        key: ce,
        ref: Ce,
        props: et,
        // Record the component responsible for creating this element.
        _owner: Ct
      };
      return Et._store = {}, Object.defineProperty(Et._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(Et, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Je
      }), Object.defineProperty(Et, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: it
      }), Object.freeze && (Object.freeze(Et.props), Object.freeze(Et)), Et;
    };
    function nr(P, ce, Ce, Je, it) {
      {
        var Ct, et = {}, Et = null, Wn = null;
        Ce !== void 0 && (Dr(Ce), Et = "" + Ce), St(ce) && (Dr(ce.key), Et = "" + ce.key), Ye(ce) && (Wn = ce.ref, Yt(ce, it));
        for (Ct in ce)
          er.call(ce, Ct) && !ia.hasOwnProperty(Ct) && (et[Ct] = ce[Ct]);
        if (P && P.defaultProps) {
          var tn = P.defaultProps;
          for (Ct in tn)
            et[Ct] === void 0 && (et[Ct] = tn[Ct]);
        }
        if (Et || Wn) {
          var dn = typeof P == "function" ? P.displayName || P.name || "Unknown" : P;
          Et && an(et, dn), Wn && Cn(et, dn);
        }
        return fn(P, Et, Wn, it, Je, yi.current, et);
      }
    }
    var on = ue.ReactCurrentOwner, Kt = ue.ReactDebugCurrentFrame;
    function Qt(P) {
      if (P) {
        var ce = P._owner, Ce = Yn(P.type, P._source, ce ? ce.type : null);
        Kt.setExtraStackFrame(Ce);
      } else
        Kt.setExtraStackFrame(null);
    }
    var gi;
    gi = !1;
    function _r(P) {
      return typeof P == "object" && P !== null && P.$$typeof === l;
    }
    function Ai() {
      {
        if (on.current) {
          var P = We(on.current.type);
          if (P)
            return `

Check the render method of \`` + P + "`.";
        }
        return "";
      }
    }
    function eo(P) {
      return "";
    }
    var Rl = {};
    function kl(P) {
      {
        var ce = Ai();
        if (!ce) {
          var Ce = typeof P == "string" ? P : P.displayName || P.name;
          Ce && (ce = `

Check the top-level render call using <` + Ce + ">.");
        }
        return ce;
      }
    }
    function Uo(P, ce) {
      {
        if (!P._store || P._store.validated || P.key != null)
          return;
        P._store.validated = !0;
        var Ce = kl(ce);
        if (Rl[Ce])
          return;
        Rl[Ce] = !0;
        var Je = "";
        P && P._owner && P._owner !== on.current && (Je = " It was passed a child from " + We(P._owner.type) + "."), Qt(P), he('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', Ce, Je), Qt(null);
      }
    }
    function Fo(P, ce) {
      {
        if (typeof P != "object")
          return;
        if ($n(P))
          for (var Ce = 0; Ce < P.length; Ce++) {
            var Je = P[Ce];
            _r(Je) && Uo(Je, ce);
          }
        else if (_r(P))
          P._store && (P._store.validated = !0);
        else if (P) {
          var it = ie(P);
          if (typeof it == "function" && it !== P.entries)
            for (var Ct = it.call(P), et; !(et = Ct.next()).done; )
              _r(et.value) && Uo(et.value, ce);
        }
      }
    }
    function Dl(P) {
      {
        var ce = P.type;
        if (ce == null || typeof ce == "string")
          return;
        var Ce;
        if (typeof ce == "function")
          Ce = ce.propTypes;
        else if (typeof ce == "object" && (ce.$$typeof === b || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        ce.$$typeof === M))
          Ce = ce.propTypes;
        else
          return;
        if (Ce) {
          var Je = We(ce);
          tr(Ce, P.props, "prop", Je, P);
        } else if (ce.PropTypes !== void 0 && !gi) {
          gi = !0;
          var it = We(ce);
          he("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", it || "Unknown");
        }
        typeof ce.getDefaultProps == "function" && !ce.getDefaultProps.isReactClassApproved && he("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function zr(P) {
      {
        for (var ce = Object.keys(P.props), Ce = 0; Ce < ce.length; Ce++) {
          var Je = ce[Ce];
          if (Je !== "children" && Je !== "key") {
            Qt(P), he("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", Je), Qt(null);
            break;
          }
        }
        P.ref !== null && (Qt(P), he("Invalid attribute `ref` supplied to `React.Fragment`."), Qt(null));
      }
    }
    function Ur(P, ce, Ce, Je, it, Ct) {
      {
        var et = yt(P);
        if (!et) {
          var Et = "";
          (P === void 0 || typeof P == "object" && P !== null && Object.keys(P).length === 0) && (Et += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Wn = eo();
          Wn ? Et += Wn : Et += Ai();
          var tn;
          P === null ? tn = "null" : $n(P) ? tn = "array" : P !== void 0 && P.$$typeof === l ? (tn = "<" + (We(P.type) || "Unknown") + " />", Et = " Did you accidentally export a JSX literal instead of a component?") : tn = typeof P, he("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", tn, Et);
        }
        var dn = nr(P, ce, Ce, it, Ct);
        if (dn == null)
          return dn;
        if (et) {
          var fr = ce.children;
          if (fr !== void 0)
            if (Je)
              if ($n(fr)) {
                for (var oa = 0; oa < fr.length; oa++)
                  Fo(fr[oa], P);
                Object.freeze && Object.freeze(fr);
              } else
                he("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Fo(fr, P);
        }
        return P === p ? zr(dn) : Dl(dn), dn;
      }
    }
    function Mr(P, ce, Ce) {
      return Ur(P, ce, Ce, !0);
    }
    function xa(P, ce, Ce) {
      return Ur(P, ce, Ce, !1);
    }
    var aa = xa, wa = Mr;
    Yh.Fragment = p, Yh.jsx = aa, Yh.jsxs = wa;
  }()), Yh;
}
process.env.NODE_ENV === "production" ? oE.exports = iN() : oE.exports = aN();
var Jn = oE.exports, sE = { exports: {} }, ea = {}, ag = { exports: {} }, BC = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Xw;
function oN() {
  return Xw || (Xw = 1, function(a) {
    function l(K, De) {
      var N = K.length;
      K.push(De);
      e: for (; 0 < N; ) {
        var ee = N - 1 >>> 1, be = K[ee];
        if (0 < g(be, De)) K[ee] = De, K[N] = be, N = ee;
        else break e;
      }
    }
    function c(K) {
      return K.length === 0 ? null : K[0];
    }
    function p(K) {
      if (K.length === 0) return null;
      var De = K[0], N = K.pop();
      if (N !== De) {
        K[0] = N;
        e: for (var ee = 0, be = K.length, Ie = be >>> 1; ee < Ie; ) {
          var Ne = 2 * (ee + 1) - 1, bt = K[Ne], mt = Ne + 1, Ue = K[mt];
          if (0 > g(bt, N)) mt < be && 0 > g(Ue, bt) ? (K[ee] = Ue, K[mt] = N, ee = mt) : (K[ee] = bt, K[Ne] = N, ee = Ne);
          else if (mt < be && 0 > g(Ue, N)) K[ee] = Ue, K[mt] = N, ee = mt;
          else break e;
        }
      }
      return De;
    }
    function g(K, De) {
      var N = K.sortIndex - De.sortIndex;
      return N !== 0 ? N : K.id - De.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var E = performance;
      a.unstable_now = function() {
        return E.now();
      };
    } else {
      var h = Date, x = h.now();
      a.unstable_now = function() {
        return h.now() - x;
      };
    }
    var b = [], R = [], D = 1, M = null, A = 3, j = !1, q = !1, re = !1, ie = typeof setTimeout == "function" ? setTimeout : null, ue = typeof clearTimeout == "function" ? clearTimeout : null, he = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function ne(K) {
      for (var De = c(R); De !== null; ) {
        if (De.callback === null) p(R);
        else if (De.startTime <= K) p(R), De.sortIndex = De.expirationTime, l(b, De);
        else break;
        De = c(R);
      }
    }
    function Se(K) {
      if (re = !1, ne(K), !q) if (c(b) !== null) q = !0, ht(ae);
      else {
        var De = c(R);
        De !== null && ye(Se, De.startTime - K);
      }
    }
    function ae(K, De) {
      q = !1, re && (re = !1, ue(le), le = -1), j = !0;
      var N = A;
      try {
        for (ne(De), M = c(b); M !== null && (!(M.expirationTime > De) || K && !Mt()); ) {
          var ee = M.callback;
          if (typeof ee == "function") {
            M.callback = null, A = M.priorityLevel;
            var be = ee(M.expirationTime <= De);
            De = a.unstable_now(), typeof be == "function" ? M.callback = be : M === c(b) && p(b), ne(De);
          } else p(b);
          M = c(b);
        }
        if (M !== null) var Ie = !0;
        else {
          var Ne = c(R);
          Ne !== null && ye(Se, Ne.startTime - De), Ie = !1;
        }
        return Ie;
      } finally {
        M = null, A = N, j = !1;
      }
    }
    var Re = !1, xe = null, le = -1, Xe = 5, yt = -1;
    function Mt() {
      return !(a.unstable_now() - yt < Xe);
    }
    function gt() {
      if (xe !== null) {
        var K = a.unstable_now();
        yt = K;
        var De = !0;
        try {
          De = xe(!0, K);
        } finally {
          De ? We() : (Re = !1, xe = null);
        }
      } else Re = !1;
    }
    var We;
    if (typeof he == "function") We = function() {
      he(gt);
    };
    else if (typeof MessageChannel < "u") {
      var Rt = new MessageChannel(), pt = Rt.port2;
      Rt.port1.onmessage = gt, We = function() {
        pt.postMessage(null);
      };
    } else We = function() {
      ie(gt, 0);
    };
    function ht(K) {
      xe = K, Re || (Re = !0, We());
    }
    function ye(K, De) {
      le = ie(function() {
        K(a.unstable_now());
      }, De);
    }
    a.unstable_IdlePriority = 5, a.unstable_ImmediatePriority = 1, a.unstable_LowPriority = 4, a.unstable_NormalPriority = 3, a.unstable_Profiling = null, a.unstable_UserBlockingPriority = 2, a.unstable_cancelCallback = function(K) {
      K.callback = null;
    }, a.unstable_continueExecution = function() {
      q || j || (q = !0, ht(ae));
    }, a.unstable_forceFrameRate = function(K) {
      0 > K || 125 < K ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Xe = 0 < K ? Math.floor(1e3 / K) : 5;
    }, a.unstable_getCurrentPriorityLevel = function() {
      return A;
    }, a.unstable_getFirstCallbackNode = function() {
      return c(b);
    }, a.unstable_next = function(K) {
      switch (A) {
        case 1:
        case 2:
        case 3:
          var De = 3;
          break;
        default:
          De = A;
      }
      var N = A;
      A = De;
      try {
        return K();
      } finally {
        A = N;
      }
    }, a.unstable_pauseExecution = function() {
    }, a.unstable_requestPaint = function() {
    }, a.unstable_runWithPriority = function(K, De) {
      switch (K) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          K = 3;
      }
      var N = A;
      A = K;
      try {
        return De();
      } finally {
        A = N;
      }
    }, a.unstable_scheduleCallback = function(K, De, N) {
      var ee = a.unstable_now();
      switch (typeof N == "object" && N !== null ? (N = N.delay, N = typeof N == "number" && 0 < N ? ee + N : ee) : N = ee, K) {
        case 1:
          var be = -1;
          break;
        case 2:
          be = 250;
          break;
        case 5:
          be = 1073741823;
          break;
        case 4:
          be = 1e4;
          break;
        default:
          be = 5e3;
      }
      return be = N + be, K = { id: D++, callback: De, priorityLevel: K, startTime: N, expirationTime: be, sortIndex: -1 }, N > ee ? (K.sortIndex = N, l(R, K), c(b) === null && K === c(R) && (re ? (ue(le), le = -1) : re = !0, ye(Se, N - ee))) : (K.sortIndex = be, l(b, K), q || j || (q = !0, ht(ae))), K;
    }, a.unstable_shouldYield = Mt, a.unstable_wrapCallback = function(K) {
      var De = A;
      return function() {
        var N = A;
        A = De;
        try {
          return K.apply(this, arguments);
        } finally {
          A = N;
        }
      };
    };
  }(BC)), BC;
}
var HC = {};
/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var qw;
function lN() {
  return qw || (qw = 1, function(a) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var l = !1, c = 5;
      function p(ge, Ye) {
        var St = ge.length;
        ge.push(Ye), h(ge, Ye, St);
      }
      function g(ge) {
        return ge.length === 0 ? null : ge[0];
      }
      function E(ge) {
        if (ge.length === 0)
          return null;
        var Ye = ge[0], St = ge.pop();
        return St !== Ye && (ge[0] = St, x(ge, St, 0)), Ye;
      }
      function h(ge, Ye, St) {
        for (var Yt = St; Yt > 0; ) {
          var an = Yt - 1 >>> 1, Cn = ge[an];
          if (b(Cn, Ye) > 0)
            ge[an] = Ye, ge[Yt] = Cn, Yt = an;
          else
            return;
        }
      }
      function x(ge, Ye, St) {
        for (var Yt = St, an = ge.length, Cn = an >>> 1; Yt < Cn; ) {
          var fn = (Yt + 1) * 2 - 1, nr = ge[fn], on = fn + 1, Kt = ge[on];
          if (b(nr, Ye) < 0)
            on < an && b(Kt, nr) < 0 ? (ge[Yt] = Kt, ge[on] = Ye, Yt = on) : (ge[Yt] = nr, ge[fn] = Ye, Yt = fn);
          else if (on < an && b(Kt, Ye) < 0)
            ge[Yt] = Kt, ge[on] = Ye, Yt = on;
          else
            return;
        }
      }
      function b(ge, Ye) {
        var St = ge.sortIndex - Ye.sortIndex;
        return St !== 0 ? St : ge.id - Ye.id;
      }
      var R = 1, D = 2, M = 3, A = 4, j = 5;
      function q(ge, Ye) {
      }
      var re = typeof performance == "object" && typeof performance.now == "function";
      if (re) {
        var ie = performance;
        a.unstable_now = function() {
          return ie.now();
        };
      } else {
        var ue = Date, he = ue.now();
        a.unstable_now = function() {
          return ue.now() - he;
        };
      }
      var ne = 1073741823, Se = -1, ae = 250, Re = 5e3, xe = 1e4, le = ne, Xe = [], yt = [], Mt = 1, gt = null, We = M, Rt = !1, pt = !1, ht = !1, ye = typeof setTimeout == "function" ? setTimeout : null, K = typeof clearTimeout == "function" ? clearTimeout : null, De = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function N(ge) {
        for (var Ye = g(yt); Ye !== null; ) {
          if (Ye.callback === null)
            E(yt);
          else if (Ye.startTime <= ge)
            E(yt), Ye.sortIndex = Ye.expirationTime, p(Xe, Ye);
          else
            return;
          Ye = g(yt);
        }
      }
      function ee(ge) {
        if (ht = !1, N(ge), !pt)
          if (g(Xe) !== null)
            pt = !0, zn(be);
          else {
            var Ye = g(yt);
            Ye !== null && Dr(ee, Ye.startTime - ge);
          }
      }
      function be(ge, Ye) {
        pt = !1, ht && (ht = !1, yi()), Rt = !0;
        var St = We;
        try {
          var Yt;
          if (!l) return Ie(ge, Ye);
        } finally {
          gt = null, We = St, Rt = !1;
        }
      }
      function Ie(ge, Ye) {
        var St = Ye;
        for (N(St), gt = g(Xe); gt !== null && !(gt.expirationTime > St && (!ge || Ta())); ) {
          var Yt = gt.callback;
          if (typeof Yt == "function") {
            gt.callback = null, We = gt.priorityLevel;
            var an = gt.expirationTime <= St, Cn = Yt(an);
            St = a.unstable_now(), typeof Cn == "function" ? gt.callback = Cn : gt === g(Xe) && E(Xe), N(St);
          } else
            E(Xe);
          gt = g(Xe);
        }
        if (gt !== null)
          return !0;
        var fn = g(yt);
        return fn !== null && Dr(ee, fn.startTime - St), !1;
      }
      function Ne(ge, Ye) {
        switch (ge) {
          case R:
          case D:
          case M:
          case A:
          case j:
            break;
          default:
            ge = M;
        }
        var St = We;
        We = ge;
        try {
          return Ye();
        } finally {
          We = St;
        }
      }
      function bt(ge) {
        var Ye;
        switch (We) {
          case R:
          case D:
          case M:
            Ye = M;
            break;
          default:
            Ye = We;
            break;
        }
        var St = We;
        We = Ye;
        try {
          return ge();
        } finally {
          We = St;
        }
      }
      function mt(ge) {
        var Ye = We;
        return function() {
          var St = We;
          We = Ye;
          try {
            return ge.apply(this, arguments);
          } finally {
            We = St;
          }
        };
      }
      function Ue(ge, Ye, St) {
        var Yt = a.unstable_now(), an;
        if (typeof St == "object" && St !== null) {
          var Cn = St.delay;
          typeof Cn == "number" && Cn > 0 ? an = Yt + Cn : an = Yt;
        } else
          an = Yt;
        var fn;
        switch (ge) {
          case R:
            fn = Se;
            break;
          case D:
            fn = ae;
            break;
          case j:
            fn = le;
            break;
          case A:
            fn = xe;
            break;
          case M:
          default:
            fn = Re;
            break;
        }
        var nr = an + fn, on = {
          id: Mt++,
          callback: Ye,
          priorityLevel: ge,
          startTime: an,
          expirationTime: nr,
          sortIndex: -1
        };
        return an > Yt ? (on.sortIndex = an, p(yt, on), g(Xe) === null && on === g(yt) && (ht ? yi() : ht = !0, Dr(ee, an - Yt))) : (on.sortIndex = nr, p(Xe, on), !pt && !Rt && (pt = !0, zn(be))), on;
      }
      function ft() {
      }
      function Ot() {
        !pt && !Rt && (pt = !0, zn(be));
      }
      function wn() {
        return g(Xe);
      }
      function mn(ge) {
        ge.callback = null;
      }
      function Vn() {
        return We;
      }
      var Dn = !1, cr = null, Yn = -1, er = c, Jr = -1;
      function Ta() {
        var ge = a.unstable_now() - Jr;
        return !(ge < er);
      }
      function vi() {
      }
      function tr(ge) {
        if (ge < 0 || ge > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        ge > 0 ? er = Math.floor(1e3 / ge) : er = c;
      }
      var _n = function() {
        if (cr !== null) {
          var ge = a.unstable_now();
          Jr = ge;
          var Ye = !0, St = !0;
          try {
            St = cr(Ye, ge);
          } finally {
            St ? $n() : (Dn = !1, cr = null);
          }
        } else
          Dn = !1;
      }, $n;
      if (typeof De == "function")
        $n = function() {
          De(_n);
        };
      else if (typeof MessageChannel < "u") {
        var kr = new MessageChannel(), ra = kr.port2;
        kr.port1.onmessage = _n, $n = function() {
          ra.postMessage(null);
        };
      } else
        $n = function() {
          ye(_n, 0);
        };
      function zn(ge) {
        cr = ge, Dn || (Dn = !0, $n());
      }
      function Dr(ge, Ye) {
        Yn = ye(function() {
          ge(a.unstable_now());
        }, Ye);
      }
      function yi() {
        K(Yn), Yn = -1;
      }
      var ia = vi, ba = null;
      a.unstable_IdlePriority = j, a.unstable_ImmediatePriority = R, a.unstable_LowPriority = A, a.unstable_NormalPriority = M, a.unstable_Profiling = ba, a.unstable_UserBlockingPriority = D, a.unstable_cancelCallback = mn, a.unstable_continueExecution = Ot, a.unstable_forceFrameRate = tr, a.unstable_getCurrentPriorityLevel = Vn, a.unstable_getFirstCallbackNode = wn, a.unstable_next = bt, a.unstable_pauseExecution = ft, a.unstable_requestPaint = ia, a.unstable_runWithPriority = Ne, a.unstable_scheduleCallback = Ue, a.unstable_shouldYield = Ta, a.unstable_wrapCallback = mt, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(HC)), HC;
}
var Zw;
function b1() {
  return Zw || (Zw = 1, process.env.NODE_ENV === "production" ? ag.exports = oN() : ag.exports = lN()), ag.exports;
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Jw;
function sN() {
  if (Jw) return ea;
  Jw = 1;
  var a = at, l = b1();
  function c(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, s = 1; s < arguments.length; s++) r += "&args[]=" + encodeURIComponent(arguments[s]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var p = /* @__PURE__ */ new Set(), g = {};
  function E(n, r) {
    h(n, r), h(n + "Capture", r);
  }
  function h(n, r) {
    for (g[n] = r, n = 0; n < r.length; n++) p.add(r[n]);
  }
  var x = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), b = Object.prototype.hasOwnProperty, R = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, D = {}, M = {};
  function A(n) {
    return b.call(M, n) ? !0 : b.call(D, n) ? !1 : R.test(n) ? M[n] = !0 : (D[n] = !0, !1);
  }
  function j(n, r, s, f) {
    if (s !== null && s.type === 0) return !1;
    switch (typeof r) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return f ? !1 : s !== null ? !s.acceptsBooleans : (n = n.toLowerCase().slice(0, 5), n !== "data-" && n !== "aria-");
      default:
        return !1;
    }
  }
  function q(n, r, s, f) {
    if (r === null || typeof r > "u" || j(n, r, s, f)) return !0;
    if (f) return !1;
    if (s !== null) switch (s.type) {
      case 3:
        return !r;
      case 4:
        return r === !1;
      case 5:
        return isNaN(r);
      case 6:
        return isNaN(r) || 1 > r;
    }
    return !1;
  }
  function re(n, r, s, f, m, y, w) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = f, this.attributeNamespace = m, this.mustUseProperty = s, this.propertyName = n, this.type = r, this.sanitizeURL = y, this.removeEmptyString = w;
  }
  var ie = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    ie[n] = new re(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var r = n[0];
    ie[r] = new re(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    ie[n] = new re(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    ie[n] = new re(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    ie[n] = new re(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    ie[n] = new re(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    ie[n] = new re(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    ie[n] = new re(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    ie[n] = new re(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var ue = /[\-:]([a-z])/g;
  function he(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      ue,
      he
    );
    ie[r] = new re(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace(ue, he);
    ie[r] = new re(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace(ue, he);
    ie[r] = new re(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    ie[n] = new re(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), ie.xlinkHref = new re("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    ie[n] = new re(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function ne(n, r, s, f) {
    var m = ie.hasOwnProperty(r) ? ie[r] : null;
    (m !== null ? m.type !== 0 : f || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (q(r, s, m, f) && (s = null), f || m === null ? A(r) && (s === null ? n.removeAttribute(r) : n.setAttribute(r, "" + s)) : m.mustUseProperty ? n[m.propertyName] = s === null ? m.type === 3 ? !1 : "" : s : (r = m.attributeName, f = m.attributeNamespace, s === null ? n.removeAttribute(r) : (m = m.type, s = m === 3 || m === 4 && s === !0 ? "" : "" + s, f ? n.setAttributeNS(f, r, s) : n.setAttribute(r, s))));
  }
  var Se = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ae = Symbol.for("react.element"), Re = Symbol.for("react.portal"), xe = Symbol.for("react.fragment"), le = Symbol.for("react.strict_mode"), Xe = Symbol.for("react.profiler"), yt = Symbol.for("react.provider"), Mt = Symbol.for("react.context"), gt = Symbol.for("react.forward_ref"), We = Symbol.for("react.suspense"), Rt = Symbol.for("react.suspense_list"), pt = Symbol.for("react.memo"), ht = Symbol.for("react.lazy"), ye = Symbol.for("react.offscreen"), K = Symbol.iterator;
  function De(n) {
    return n === null || typeof n != "object" ? null : (n = K && n[K] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var N = Object.assign, ee;
  function be(n) {
    if (ee === void 0) try {
      throw Error();
    } catch (s) {
      var r = s.stack.trim().match(/\n( *(at )?)/);
      ee = r && r[1] || "";
    }
    return `
` + ee + n;
  }
  var Ie = !1;
  function Ne(n, r) {
    if (!n || Ie) return "";
    Ie = !0;
    var s = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (r) if (r = function() {
        throw Error();
      }, Object.defineProperty(r.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(r, []);
        } catch (Q) {
          var f = Q;
        }
        Reflect.construct(n, [], r);
      } else {
        try {
          r.call();
        } catch (Q) {
          f = Q;
        }
        n.call(r.prototype);
      }
      else {
        try {
          throw Error();
        } catch (Q) {
          f = Q;
        }
        n();
      }
    } catch (Q) {
      if (Q && f && typeof Q.stack == "string") {
        for (var m = Q.stack.split(`
`), y = f.stack.split(`
`), w = m.length - 1, O = y.length - 1; 1 <= w && 0 <= O && m[w] !== y[O]; ) O--;
        for (; 1 <= w && 0 <= O; w--, O--) if (m[w] !== y[O]) {
          if (w !== 1 || O !== 1)
            do
              if (w--, O--, 0 > O || m[w] !== y[O]) {
                var V = `
` + m[w].replace(" at new ", " at ");
                return n.displayName && V.includes("<anonymous>") && (V = V.replace("<anonymous>", n.displayName)), V;
              }
            while (1 <= w && 0 <= O);
          break;
        }
      }
    } finally {
      Ie = !1, Error.prepareStackTrace = s;
    }
    return (n = n ? n.displayName || n.name : "") ? be(n) : "";
  }
  function bt(n) {
    switch (n.tag) {
      case 5:
        return be(n.type);
      case 16:
        return be("Lazy");
      case 13:
        return be("Suspense");
      case 19:
        return be("SuspenseList");
      case 0:
      case 2:
      case 15:
        return n = Ne(n.type, !1), n;
      case 11:
        return n = Ne(n.type.render, !1), n;
      case 1:
        return n = Ne(n.type, !0), n;
      default:
        return "";
    }
  }
  function mt(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case xe:
        return "Fragment";
      case Re:
        return "Portal";
      case Xe:
        return "Profiler";
      case le:
        return "StrictMode";
      case We:
        return "Suspense";
      case Rt:
        return "SuspenseList";
    }
    if (typeof n == "object") switch (n.$$typeof) {
      case Mt:
        return (n.displayName || "Context") + ".Consumer";
      case yt:
        return (n._context.displayName || "Context") + ".Provider";
      case gt:
        var r = n.render;
        return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
      case pt:
        return r = n.displayName || null, r !== null ? r : mt(n.type) || "Memo";
      case ht:
        r = n._payload, n = n._init;
        try {
          return mt(n(r));
        } catch {
        }
    }
    return null;
  }
  function Ue(n) {
    var r = n.type;
    switch (n.tag) {
      case 24:
        return "Cache";
      case 9:
        return (r.displayName || "Context") + ".Consumer";
      case 10:
        return (r._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return n = r.render, n = n.displayName || n.name || "", r.displayName || (n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return r;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return mt(r);
      case 8:
        return r === le ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof r == "function") return r.displayName || r.name || null;
        if (typeof r == "string") return r;
    }
    return null;
  }
  function ft(n) {
    switch (typeof n) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return n;
      case "object":
        return n;
      default:
        return "";
    }
  }
  function Ot(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function wn(n) {
    var r = Ot(n) ? "checked" : "value", s = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), f = "" + n[r];
    if (!n.hasOwnProperty(r) && typeof s < "u" && typeof s.get == "function" && typeof s.set == "function") {
      var m = s.get, y = s.set;
      return Object.defineProperty(n, r, { configurable: !0, get: function() {
        return m.call(this);
      }, set: function(w) {
        f = "" + w, y.call(this, w);
      } }), Object.defineProperty(n, r, { enumerable: s.enumerable }), { getValue: function() {
        return f;
      }, setValue: function(w) {
        f = "" + w;
      }, stopTracking: function() {
        n._valueTracker = null, delete n[r];
      } };
    }
  }
  function mn(n) {
    n._valueTracker || (n._valueTracker = wn(n));
  }
  function Vn(n) {
    if (!n) return !1;
    var r = n._valueTracker;
    if (!r) return !0;
    var s = r.getValue(), f = "";
    return n && (f = Ot(n) ? n.checked ? "true" : "false" : n.value), n = f, n !== s ? (r.setValue(n), !0) : !1;
  }
  function Dn(n) {
    if (n = n || (typeof document < "u" ? document : void 0), typeof n > "u") return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function cr(n, r) {
    var s = r.checked;
    return N({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: s ?? n._wrapperState.initialChecked });
  }
  function Yn(n, r) {
    var s = r.defaultValue == null ? "" : r.defaultValue, f = r.checked != null ? r.checked : r.defaultChecked;
    s = ft(r.value != null ? r.value : s), n._wrapperState = { initialChecked: f, initialValue: s, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function er(n, r) {
    r = r.checked, r != null && ne(n, "checked", r, !1);
  }
  function Jr(n, r) {
    er(n, r);
    var s = ft(r.value), f = r.type;
    if (s != null) f === "number" ? (s === 0 && n.value === "" || n.value != s) && (n.value = "" + s) : n.value !== "" + s && (n.value = "" + s);
    else if (f === "submit" || f === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? vi(n, r.type, s) : r.hasOwnProperty("defaultValue") && vi(n, r.type, ft(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
  }
  function Ta(n, r, s) {
    if (r.hasOwnProperty("value") || r.hasOwnProperty("defaultValue")) {
      var f = r.type;
      if (!(f !== "submit" && f !== "reset" || r.value !== void 0 && r.value !== null)) return;
      r = "" + n._wrapperState.initialValue, s || r === n.value || (n.value = r), n.defaultValue = r;
    }
    s = n.name, s !== "" && (n.name = ""), n.defaultChecked = !!n._wrapperState.initialChecked, s !== "" && (n.name = s);
  }
  function vi(n, r, s) {
    (r !== "number" || Dn(n.ownerDocument) !== n) && (s == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + s && (n.defaultValue = "" + s));
  }
  var tr = Array.isArray;
  function _n(n, r, s, f) {
    if (n = n.options, r) {
      r = {};
      for (var m = 0; m < s.length; m++) r["$" + s[m]] = !0;
      for (s = 0; s < n.length; s++) m = r.hasOwnProperty("$" + n[s].value), n[s].selected !== m && (n[s].selected = m), m && f && (n[s].defaultSelected = !0);
    } else {
      for (s = "" + ft(s), r = null, m = 0; m < n.length; m++) {
        if (n[m].value === s) {
          n[m].selected = !0, f && (n[m].defaultSelected = !0);
          return;
        }
        r !== null || n[m].disabled || (r = n[m]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function $n(n, r) {
    if (r.dangerouslySetInnerHTML != null) throw Error(c(91));
    return N({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function kr(n, r) {
    var s = r.value;
    if (s == null) {
      if (s = r.children, r = r.defaultValue, s != null) {
        if (r != null) throw Error(c(92));
        if (tr(s)) {
          if (1 < s.length) throw Error(c(93));
          s = s[0];
        }
        r = s;
      }
      r == null && (r = ""), s = r;
    }
    n._wrapperState = { initialValue: ft(s) };
  }
  function ra(n, r) {
    var s = ft(r.value), f = ft(r.defaultValue);
    s != null && (s = "" + s, s !== n.value && (n.value = s), r.defaultValue == null && n.defaultValue !== s && (n.defaultValue = s)), f != null && (n.defaultValue = "" + f);
  }
  function zn(n) {
    var r = n.textContent;
    r === n._wrapperState.initialValue && r !== "" && r !== null && (n.value = r);
  }
  function Dr(n) {
    switch (n) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function yi(n, r) {
    return n == null || n === "http://www.w3.org/1999/xhtml" ? Dr(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
  }
  var ia, ba = function(n) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(r, s, f, m) {
      MSApp.execUnsafeLocalFunction(function() {
        return n(r, s, f, m);
      });
    } : n;
  }(function(n, r) {
    if (n.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in n) n.innerHTML = r;
    else {
      for (ia = ia || document.createElement("div"), ia.innerHTML = "<svg>" + r.valueOf().toString() + "</svg>", r = ia.firstChild; n.firstChild; ) n.removeChild(n.firstChild);
      for (; r.firstChild; ) n.appendChild(r.firstChild);
    }
  });
  function ge(n, r) {
    if (r) {
      var s = n.firstChild;
      if (s && s === n.lastChild && s.nodeType === 3) {
        s.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var Ye = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, St = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Ye).forEach(function(n) {
    St.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), Ye[r] = Ye[n];
    });
  });
  function Yt(n, r, s) {
    return r == null || typeof r == "boolean" || r === "" ? "" : s || typeof r != "number" || r === 0 || Ye.hasOwnProperty(n) && Ye[n] ? ("" + r).trim() : r + "px";
  }
  function an(n, r) {
    n = n.style;
    for (var s in r) if (r.hasOwnProperty(s)) {
      var f = s.indexOf("--") === 0, m = Yt(s, r[s], f);
      s === "float" && (s = "cssFloat"), f ? n.setProperty(s, m) : n[s] = m;
    }
  }
  var Cn = N({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function fn(n, r) {
    if (r) {
      if (Cn[n] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(c(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(c(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(c(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(c(62));
    }
  }
  function nr(n, r) {
    if (n.indexOf("-") === -1) return typeof r.is == "string";
    switch (n) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var on = null;
  function Kt(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var Qt = null, gi = null, _r = null;
  function Ai(n) {
    if (n = Qe(n)) {
      if (typeof Qt != "function") throw Error(c(280));
      var r = n.stateNode;
      r && (r = Tn(r), Qt(n.stateNode, n.type, r));
    }
  }
  function eo(n) {
    gi ? _r ? _r.push(n) : _r = [n] : gi = n;
  }
  function Rl() {
    if (gi) {
      var n = gi, r = _r;
      if (_r = gi = null, Ai(n), r) for (n = 0; n < r.length; n++) Ai(r[n]);
    }
  }
  function kl(n, r) {
    return n(r);
  }
  function Uo() {
  }
  var Fo = !1;
  function Dl(n, r, s) {
    if (Fo) return n(r, s);
    Fo = !0;
    try {
      return kl(n, r, s);
    } finally {
      Fo = !1, (gi !== null || _r !== null) && (Uo(), Rl());
    }
  }
  function zr(n, r) {
    var s = n.stateNode;
    if (s === null) return null;
    var f = Tn(s);
    if (f === null) return null;
    s = f[r];
    e: switch (r) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (f = !f.disabled) || (n = n.type, f = !(n === "button" || n === "input" || n === "select" || n === "textarea")), n = !f;
        break e;
      default:
        n = !1;
    }
    if (n) return null;
    if (s && typeof s != "function") throw Error(c(231, r, typeof s));
    return s;
  }
  var Ur = !1;
  if (x) try {
    var Mr = {};
    Object.defineProperty(Mr, "passive", { get: function() {
      Ur = !0;
    } }), window.addEventListener("test", Mr, Mr), window.removeEventListener("test", Mr, Mr);
  } catch {
    Ur = !1;
  }
  function xa(n, r, s, f, m, y, w, O, V) {
    var Q = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(s, Q);
    } catch (fe) {
      this.onError(fe);
    }
  }
  var aa = !1, wa = null, P = !1, ce = null, Ce = { onError: function(n) {
    aa = !0, wa = n;
  } };
  function Je(n, r, s, f, m, y, w, O, V) {
    aa = !1, wa = null, xa.apply(Ce, arguments);
  }
  function it(n, r, s, f, m, y, w, O, V) {
    if (Je.apply(this, arguments), aa) {
      if (aa) {
        var Q = wa;
        aa = !1, wa = null;
      } else throw Error(c(198));
      P || (P = !0, ce = Q);
    }
  }
  function Ct(n) {
    var r = n, s = n;
    if (n.alternate) for (; r.return; ) r = r.return;
    else {
      n = r;
      do
        r = n, r.flags & 4098 && (s = r.return), n = r.return;
      while (n);
    }
    return r.tag === 3 ? s : null;
  }
  function et(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null) return r.dehydrated;
    }
    return null;
  }
  function Et(n) {
    if (Ct(n) !== n) throw Error(c(188));
  }
  function Wn(n) {
    var r = n.alternate;
    if (!r) {
      if (r = Ct(n), r === null) throw Error(c(188));
      return r !== n ? null : n;
    }
    for (var s = n, f = r; ; ) {
      var m = s.return;
      if (m === null) break;
      var y = m.alternate;
      if (y === null) {
        if (f = m.return, f !== null) {
          s = f;
          continue;
        }
        break;
      }
      if (m.child === y.child) {
        for (y = m.child; y; ) {
          if (y === s) return Et(m), n;
          if (y === f) return Et(m), r;
          y = y.sibling;
        }
        throw Error(c(188));
      }
      if (s.return !== f.return) s = m, f = y;
      else {
        for (var w = !1, O = m.child; O; ) {
          if (O === s) {
            w = !0, s = m, f = y;
            break;
          }
          if (O === f) {
            w = !0, f = m, s = y;
            break;
          }
          O = O.sibling;
        }
        if (!w) {
          for (O = y.child; O; ) {
            if (O === s) {
              w = !0, s = y, f = m;
              break;
            }
            if (O === f) {
              w = !0, f = y, s = m;
              break;
            }
            O = O.sibling;
          }
          if (!w) throw Error(c(189));
        }
      }
      if (s.alternate !== f) throw Error(c(190));
    }
    if (s.tag !== 3) throw Error(c(188));
    return s.stateNode.current === s ? n : r;
  }
  function tn(n) {
    return n = Wn(n), n !== null ? dn(n) : null;
  }
  function dn(n) {
    if (n.tag === 5 || n.tag === 6) return n;
    for (n = n.child; n !== null; ) {
      var r = dn(n);
      if (r !== null) return r;
      n = n.sibling;
    }
    return null;
  }
  var fr = l.unstable_scheduleCallback, oa = l.unstable_cancelCallback, _l = l.unstable_shouldYield, Si = l.unstable_requestPaint, Gt = l.unstable_now, kt = l.unstable_getCurrentPriorityLevel, to = l.unstable_ImmediatePriority, Ou = l.unstable_UserBlockingPriority, Ml = l.unstable_NormalPriority, jo = l.unstable_LowPriority, Ts = l.unstable_IdlePriority, Bo = null, ei = null;
  function Au(n) {
    if (ei && typeof ei.onCommitFiberRoot == "function") try {
      ei.onCommitFiberRoot(Bo, n, void 0, (n.current.flags & 128) === 128);
    } catch {
    }
  }
  var Fr = Math.clz32 ? Math.clz32 : bs, $c = Math.log, Wc = Math.LN2;
  function bs(n) {
    return n >>>= 0, n === 0 ? 32 : 31 - ($c(n) / Wc | 0) | 0;
  }
  var Ho = 64, Ci = 4194304;
  function la(n) {
    switch (n & -n) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return n & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return n & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return n;
    }
  }
  function sa(n, r) {
    var s = n.pendingLanes;
    if (s === 0) return 0;
    var f = 0, m = n.suspendedLanes, y = n.pingedLanes, w = s & 268435455;
    if (w !== 0) {
      var O = w & ~m;
      O !== 0 ? f = la(O) : (y &= w, y !== 0 && (f = la(y)));
    } else w = s & ~m, w !== 0 ? f = la(w) : y !== 0 && (f = la(y));
    if (f === 0) return 0;
    if (r !== 0 && r !== f && !(r & m) && (m = f & -f, y = r & -r, m >= y || m === 16 && (y & 4194240) !== 0)) return r;
    if (f & 4 && (f |= s & 16), r = n.entangledLanes, r !== 0) for (n = n.entanglements, r &= f; 0 < r; ) s = 31 - Fr(r), m = 1 << s, f |= n[s], r &= ~m;
    return f;
  }
  function xs(n, r) {
    switch (n) {
      case 1:
      case 2:
      case 4:
        return r + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return r + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Ol(n, r) {
    for (var s = n.suspendedLanes, f = n.pingedLanes, m = n.expirationTimes, y = n.pendingLanes; 0 < y; ) {
      var w = 31 - Fr(y), O = 1 << w, V = m[w];
      V === -1 ? (!(O & s) || O & f) && (m[w] = xs(O, r)) : V <= r && (n.expiredLanes |= O), y &= ~O;
    }
  }
  function Io(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function ws() {
    var n = Ho;
    return Ho <<= 1, !(Ho & 4194240) && (Ho = 64), n;
  }
  function Rs(n) {
    for (var r = [], s = 0; 31 > s; s++) r.push(n);
    return r;
  }
  function no(n, r, s) {
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - Fr(r), n[r] = s;
  }
  function Hd(n, r) {
    var s = n.pendingLanes & ~r;
    n.pendingLanes = r, n.suspendedLanes = 0, n.pingedLanes = 0, n.expiredLanes &= r, n.mutableReadLanes &= r, n.entangledLanes &= r, r = n.entanglements;
    var f = n.eventTimes;
    for (n = n.expirationTimes; 0 < s; ) {
      var m = 31 - Fr(s), y = 1 << m;
      r[m] = 0, f[m] = -1, n[m] = -1, s &= ~y;
    }
  }
  function ro(n, r) {
    var s = n.entangledLanes |= r;
    for (n = n.entanglements; s; ) {
      var f = 31 - Fr(s), m = 1 << f;
      m & r | n[f] & r && (n[f] |= r), s &= ~m;
    }
  }
  var Ft = 0;
  function ks(n) {
    return n &= -n, 1 < n ? 4 < n ? n & 268435455 ? 16 : 536870912 : 4 : 1;
  }
  var jt, Lu, Ra, lt, Ds, dr = !1, ka = [], jr = null, Da = null, pn = null, Xt = /* @__PURE__ */ new Map(), Yo = /* @__PURE__ */ new Map(), Gn = [], Br = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Li(n, r) {
    switch (n) {
      case "focusin":
      case "focusout":
        jr = null;
        break;
      case "dragenter":
      case "dragleave":
        Da = null;
        break;
      case "mouseover":
      case "mouseout":
        pn = null;
        break;
      case "pointerover":
      case "pointerout":
        Xt.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Yo.delete(r.pointerId);
    }
  }
  function Al(n, r, s, f, m, y) {
    return n === null || n.nativeEvent !== y ? (n = { blockedOn: r, domEventName: s, eventSystemFlags: f, nativeEvent: y, targetContainers: [m] }, r !== null && (r = Qe(r), r !== null && Lu(r)), n) : (n.eventSystemFlags |= f, r = n.targetContainers, m !== null && r.indexOf(m) === -1 && r.push(m), n);
  }
  function Nu(n, r, s, f, m) {
    switch (r) {
      case "focusin":
        return jr = Al(jr, n, r, s, f, m), !0;
      case "dragenter":
        return Da = Al(Da, n, r, s, f, m), !0;
      case "mouseover":
        return pn = Al(pn, n, r, s, f, m), !0;
      case "pointerover":
        var y = m.pointerId;
        return Xt.set(y, Al(Xt.get(y) || null, n, r, s, f, m)), !0;
      case "gotpointercapture":
        return y = m.pointerId, Yo.set(y, Al(Yo.get(y) || null, n, r, s, f, m)), !0;
    }
    return !1;
  }
  function Pu(n) {
    var r = Bl(n.target);
    if (r !== null) {
      var s = Ct(r);
      if (s !== null) {
        if (r = s.tag, r === 13) {
          if (r = et(s), r !== null) {
            n.blockedOn = r, Ds(n.priority, function() {
              Ra(s);
            });
            return;
          }
        } else if (r === 3 && s.stateNode.current.memoizedState.isDehydrated) {
          n.blockedOn = s.tag === 3 ? s.stateNode.containerInfo : null;
          return;
        }
      }
    }
    n.blockedOn = null;
  }
  function $o(n) {
    if (n.blockedOn !== null) return !1;
    for (var r = n.targetContainers; 0 < r.length; ) {
      var s = Os(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (s === null) {
        s = n.nativeEvent;
        var f = new s.constructor(s.type, s);
        on = f, s.target.dispatchEvent(f), on = null;
      } else return r = Qe(s), r !== null && Lu(r), n.blockedOn = s, !1;
      r.shift();
    }
    return !0;
  }
  function Ll(n, r, s) {
    $o(n) && s.delete(r);
  }
  function Id() {
    dr = !1, jr !== null && $o(jr) && (jr = null), Da !== null && $o(Da) && (Da = null), pn !== null && $o(pn) && (pn = null), Xt.forEach(Ll), Yo.forEach(Ll);
  }
  function Ni(n, r) {
    n.blockedOn === r && (n.blockedOn = null, dr || (dr = !0, l.unstable_scheduleCallback(l.unstable_NormalPriority, Id)));
  }
  function ua(n) {
    function r(m) {
      return Ni(m, n);
    }
    if (0 < ka.length) {
      Ni(ka[0], n);
      for (var s = 1; s < ka.length; s++) {
        var f = ka[s];
        f.blockedOn === n && (f.blockedOn = null);
      }
    }
    for (jr !== null && Ni(jr, n), Da !== null && Ni(Da, n), pn !== null && Ni(pn, n), Xt.forEach(r), Yo.forEach(r), s = 0; s < Gn.length; s++) f = Gn[s], f.blockedOn === n && (f.blockedOn = null);
    for (; 0 < Gn.length && (s = Gn[0], s.blockedOn === null); ) Pu(s), s.blockedOn === null && Gn.shift();
  }
  var io = Se.ReactCurrentBatchConfig, Pi = !0;
  function _s(n, r, s, f) {
    var m = Ft, y = io.transition;
    io.transition = null;
    try {
      Ft = 1, Wo(n, r, s, f);
    } finally {
      Ft = m, io.transition = y;
    }
  }
  function Ms(n, r, s, f) {
    var m = Ft, y = io.transition;
    io.transition = null;
    try {
      Ft = 4, Wo(n, r, s, f);
    } finally {
      Ft = m, io.transition = y;
    }
  }
  function Wo(n, r, s, f) {
    if (Pi) {
      var m = Os(n, r, s, f);
      if (m === null) af(n, r, f, Nl, s), Li(n, f);
      else if (Nu(m, n, r, s, f)) f.stopPropagation();
      else if (Li(n, f), r & 4 && -1 < Br.indexOf(n)) {
        for (; m !== null; ) {
          var y = Qe(m);
          if (y !== null && jt(y), y = Os(n, r, s, f), y === null && af(n, r, f, Nl, s), y === m) break;
          m = y;
        }
        m !== null && f.stopPropagation();
      } else af(n, r, f, null, s);
    }
  }
  var Nl = null;
  function Os(n, r, s, f) {
    if (Nl = null, n = Kt(f), n = Bl(n), n !== null) if (r = Ct(n), r === null) n = null;
    else if (s = r.tag, s === 13) {
      if (n = et(r), n !== null) return n;
      n = null;
    } else if (s === 3) {
      if (r.stateNode.current.memoizedState.isDehydrated) return r.tag === 3 ? r.stateNode.containerInfo : null;
      n = null;
    } else r !== n && (n = null);
    return Nl = n, null;
  }
  function As(n) {
    switch (n) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (kt()) {
          case to:
            return 1;
          case Ou:
            return 4;
          case Ml:
          case jo:
            return 16;
          case Ts:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var ca = null, T = null, L = null;
  function W() {
    if (L) return L;
    var n, r = T, s = r.length, f, m = "value" in ca ? ca.value : ca.textContent, y = m.length;
    for (n = 0; n < s && r[n] === m[n]; n++) ;
    var w = s - n;
    for (f = 1; f <= w && r[s - f] === m[y - f]; f++) ;
    return L = m.slice(n, 1 < f ? 1 - f : void 0);
  }
  function X(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function ve() {
    return !0;
  }
  function qe() {
    return !1;
  }
  function Te(n) {
    function r(s, f, m, y, w) {
      this._reactName = s, this._targetInst = m, this.type = f, this.nativeEvent = y, this.target = w, this.currentTarget = null;
      for (var O in n) n.hasOwnProperty(O) && (s = n[O], this[O] = s ? s(y) : y[O]);
      return this.isDefaultPrevented = (y.defaultPrevented != null ? y.defaultPrevented : y.returnValue === !1) ? ve : qe, this.isPropagationStopped = qe, this;
    }
    return N(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var s = this.nativeEvent;
      s && (s.preventDefault ? s.preventDefault() : typeof s.returnValue != "unknown" && (s.returnValue = !1), this.isDefaultPrevented = ve);
    }, stopPropagation: function() {
      var s = this.nativeEvent;
      s && (s.stopPropagation ? s.stopPropagation() : typeof s.cancelBubble != "unknown" && (s.cancelBubble = !0), this.isPropagationStopped = ve);
    }, persist: function() {
    }, isPersistent: ve }), r;
  }
  var nt = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, xt = Te(nt), zt = N({}, nt, { view: 0, detail: 0 }), ln = Te(zt), qt, Tt, Zt, En = N({}, zt, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Kd, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== Zt && (Zt && n.type === "mousemove" ? (qt = n.screenX - Zt.screenX, Tt = n.screenY - Zt.screenY) : Tt = qt = 0, Zt = n), qt);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : Tt;
  } }), Go = Te(En), Vu = N({}, En, { dataTransfer: 0 }), ao = Te(Vu), zu = N({}, zt, { relatedTarget: 0 }), Pl = Te(zu), Yd = N({}, nt, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Gc = Te(Yd), $d = N({}, nt, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), lm = Te($d), Wd = N({}, nt, { data: 0 }), Gd = Te(Wd), sm = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, um = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Rg = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function oo(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = Rg[n]) ? !!r[n] : !1;
  }
  function Kd() {
    return oo;
  }
  var Qd = N({}, zt, { key: function(n) {
    if (n.key) {
      var r = sm[n.key] || n.key;
      if (r !== "Unidentified") return r;
    }
    return n.type === "keypress" ? (n = X(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? um[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Kd, charCode: function(n) {
    return n.type === "keypress" ? X(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? X(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), Xd = Te(Qd), qd = N({}, En, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), cm = Te(qd), Kc = N({}, zt, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Kd }), fm = Te(Kc), ti = N({}, nt, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), lo = Te(ti), Un = N({}, En, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), so = Te(Un), Zd = [9, 13, 27, 32], Ls = x && "CompositionEvent" in window, Uu = null;
  x && "documentMode" in document && (Uu = document.documentMode);
  var Fu = x && "TextEvent" in window && !Uu, dm = x && (!Ls || Uu && 8 < Uu && 11 >= Uu), pm = " ", Qc = !1;
  function hm(n, r) {
    switch (n) {
      case "keyup":
        return Zd.indexOf(r.keyCode) !== -1;
      case "keydown":
        return r.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function mm(n) {
    return n = n.detail, typeof n == "object" && "data" in n ? n.data : null;
  }
  var Ns = !1;
  function vm(n, r) {
    switch (n) {
      case "compositionend":
        return mm(r);
      case "keypress":
        return r.which !== 32 ? null : (Qc = !0, pm);
      case "textInput":
        return n = r.data, n === pm && Qc ? null : n;
      default:
        return null;
    }
  }
  function kg(n, r) {
    if (Ns) return n === "compositionend" || !Ls && hm(n, r) ? (n = W(), L = T = ca = null, Ns = !1, n) : null;
    switch (n) {
      case "paste":
        return null;
      case "keypress":
        if (!(r.ctrlKey || r.altKey || r.metaKey) || r.ctrlKey && r.altKey) {
          if (r.char && 1 < r.char.length) return r.char;
          if (r.which) return String.fromCharCode(r.which);
        }
        return null;
      case "compositionend":
        return dm && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var Dg = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function ym(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!Dg[n.type] : r === "textarea";
  }
  function Jd(n, r, s, f) {
    eo(f), r = $u(r, "onChange"), 0 < r.length && (s = new xt("onChange", "change", null, s, f), n.push({ event: s, listeners: r }));
  }
  var _a = null, Vl = null;
  function gm(n) {
    Fl(n, 0);
  }
  function ju(n) {
    var r = da(n);
    if (Vn(r)) return n;
  }
  function _g(n, r) {
    if (n === "change") return r;
  }
  var Sm = !1;
  if (x) {
    var ep;
    if (x) {
      var tp = "oninput" in document;
      if (!tp) {
        var Cm = document.createElement("div");
        Cm.setAttribute("oninput", "return;"), tp = typeof Cm.oninput == "function";
      }
      ep = tp;
    } else ep = !1;
    Sm = ep && (!document.documentMode || 9 < document.documentMode);
  }
  function Em() {
    _a && (_a.detachEvent("onpropertychange", Tm), Vl = _a = null);
  }
  function Tm(n) {
    if (n.propertyName === "value" && ju(Vl)) {
      var r = [];
      Jd(r, Vl, n, Kt(n)), Dl(gm, r);
    }
  }
  function Mg(n, r, s) {
    n === "focusin" ? (Em(), _a = r, Vl = s, _a.attachEvent("onpropertychange", Tm)) : n === "focusout" && Em();
  }
  function bm(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown") return ju(Vl);
  }
  function Og(n, r) {
    if (n === "click") return ju(r);
  }
  function xm(n, r) {
    if (n === "input" || n === "change") return ju(r);
  }
  function Ag(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var fa = typeof Object.is == "function" ? Object.is : Ag;
  function Bu(n, r) {
    if (fa(n, r)) return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null) return !1;
    var s = Object.keys(n), f = Object.keys(r);
    if (s.length !== f.length) return !1;
    for (f = 0; f < s.length; f++) {
      var m = s[f];
      if (!b.call(r, m) || !fa(n[m], r[m])) return !1;
    }
    return !0;
  }
  function wm(n) {
    for (; n && n.firstChild; ) n = n.firstChild;
    return n;
  }
  function Xc(n, r) {
    var s = wm(n);
    n = 0;
    for (var f; s; ) {
      if (s.nodeType === 3) {
        if (f = n + s.textContent.length, n <= r && f >= r) return { node: s, offset: r - n };
        n = f;
      }
      e: {
        for (; s; ) {
          if (s.nextSibling) {
            s = s.nextSibling;
            break e;
          }
          s = s.parentNode;
        }
        s = void 0;
      }
      s = wm(s);
    }
  }
  function Ko(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? Ko(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function Hu() {
    for (var n = window, r = Dn(); r instanceof n.HTMLIFrameElement; ) {
      try {
        var s = typeof r.contentWindow.location.href == "string";
      } catch {
        s = !1;
      }
      if (s) n = r.contentWindow;
      else break;
      r = Dn(n.document);
    }
    return r;
  }
  function qc(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function Ps(n) {
    var r = Hu(), s = n.focusedElem, f = n.selectionRange;
    if (r !== s && s && s.ownerDocument && Ko(s.ownerDocument.documentElement, s)) {
      if (f !== null && qc(s)) {
        if (r = f.start, n = f.end, n === void 0 && (n = r), "selectionStart" in s) s.selectionStart = r, s.selectionEnd = Math.min(n, s.value.length);
        else if (n = (r = s.ownerDocument || document) && r.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var m = s.textContent.length, y = Math.min(f.start, m);
          f = f.end === void 0 ? y : Math.min(f.end, m), !n.extend && y > f && (m = f, f = y, y = m), m = Xc(s, y);
          var w = Xc(
            s,
            f
          );
          m && w && (n.rangeCount !== 1 || n.anchorNode !== m.node || n.anchorOffset !== m.offset || n.focusNode !== w.node || n.focusOffset !== w.offset) && (r = r.createRange(), r.setStart(m.node, m.offset), n.removeAllRanges(), y > f ? (n.addRange(r), n.extend(w.node, w.offset)) : (r.setEnd(w.node, w.offset), n.addRange(r)));
        }
      }
      for (r = [], n = s; n = n.parentNode; ) n.nodeType === 1 && r.push({ element: n, left: n.scrollLeft, top: n.scrollTop });
      for (typeof s.focus == "function" && s.focus(), s = 0; s < r.length; s++) n = r[s], n.element.scrollLeft = n.left, n.element.scrollTop = n.top;
    }
  }
  var Lg = x && "documentMode" in document && 11 >= document.documentMode, Vs = null, np = null, Iu = null, rp = !1;
  function ip(n, r, s) {
    var f = s.window === s ? s.document : s.nodeType === 9 ? s : s.ownerDocument;
    rp || Vs == null || Vs !== Dn(f) || (f = Vs, "selectionStart" in f && qc(f) ? f = { start: f.selectionStart, end: f.selectionEnd } : (f = (f.ownerDocument && f.ownerDocument.defaultView || window).getSelection(), f = { anchorNode: f.anchorNode, anchorOffset: f.anchorOffset, focusNode: f.focusNode, focusOffset: f.focusOffset }), Iu && Bu(Iu, f) || (Iu = f, f = $u(np, "onSelect"), 0 < f.length && (r = new xt("onSelect", "select", null, r, s), n.push({ event: r, listeners: f }), r.target = Vs)));
  }
  function Zc(n, r) {
    var s = {};
    return s[n.toLowerCase()] = r.toLowerCase(), s["Webkit" + n] = "webkit" + r, s["Moz" + n] = "moz" + r, s;
  }
  var zl = { animationend: Zc("Animation", "AnimationEnd"), animationiteration: Zc("Animation", "AnimationIteration"), animationstart: Zc("Animation", "AnimationStart"), transitionend: Zc("Transition", "TransitionEnd") }, pr = {}, ap = {};
  x && (ap = document.createElement("div").style, "AnimationEvent" in window || (delete zl.animationend.animation, delete zl.animationiteration.animation, delete zl.animationstart.animation), "TransitionEvent" in window || delete zl.transitionend.transition);
  function Jc(n) {
    if (pr[n]) return pr[n];
    if (!zl[n]) return n;
    var r = zl[n], s;
    for (s in r) if (r.hasOwnProperty(s) && s in ap) return pr[n] = r[s];
    return n;
  }
  var Rm = Jc("animationend"), km = Jc("animationiteration"), Dm = Jc("animationstart"), _m = Jc("transitionend"), op = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Vi(n, r) {
    op.set(n, r), E(r, [n]);
  }
  for (var lp = 0; lp < ef.length; lp++) {
    var Ul = ef[lp], Ng = Ul.toLowerCase(), Pg = Ul[0].toUpperCase() + Ul.slice(1);
    Vi(Ng, "on" + Pg);
  }
  Vi(Rm, "onAnimationEnd"), Vi(km, "onAnimationIteration"), Vi(Dm, "onAnimationStart"), Vi("dblclick", "onDoubleClick"), Vi("focusin", "onFocus"), Vi("focusout", "onBlur"), Vi(_m, "onTransitionEnd"), h("onMouseEnter", ["mouseout", "mouseover"]), h("onMouseLeave", ["mouseout", "mouseover"]), h("onPointerEnter", ["pointerout", "pointerover"]), h("onPointerLeave", ["pointerout", "pointerover"]), E("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), E("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), E("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), E("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), E("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), E("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var Yu = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), sp = new Set("cancel close invalid load scroll toggle".split(" ").concat(Yu));
  function tf(n, r, s) {
    var f = n.type || "unknown-event";
    n.currentTarget = s, it(f, r, void 0, n), n.currentTarget = null;
  }
  function Fl(n, r) {
    r = (r & 4) !== 0;
    for (var s = 0; s < n.length; s++) {
      var f = n[s], m = f.event;
      f = f.listeners;
      e: {
        var y = void 0;
        if (r) for (var w = f.length - 1; 0 <= w; w--) {
          var O = f[w], V = O.instance, Q = O.currentTarget;
          if (O = O.listener, V !== y && m.isPropagationStopped()) break e;
          tf(m, O, Q), y = V;
        }
        else for (w = 0; w < f.length; w++) {
          if (O = f[w], V = O.instance, Q = O.currentTarget, O = O.listener, V !== y && m.isPropagationStopped()) break e;
          tf(m, O, Q), y = V;
        }
      }
    }
    if (P) throw n = ce, P = !1, ce = null, n;
  }
  function $t(n, r) {
    var s = r[Ku];
    s === void 0 && (s = r[Ku] = /* @__PURE__ */ new Set());
    var f = n + "__bubble";
    s.has(f) || (Mm(r, n, 2, !1), s.add(f));
  }
  function nf(n, r, s) {
    var f = 0;
    r && (f |= 4), Mm(s, n, f, r);
  }
  var rf = "_reactListening" + Math.random().toString(36).slice(2);
  function zs(n) {
    if (!n[rf]) {
      n[rf] = !0, p.forEach(function(s) {
        s !== "selectionchange" && (sp.has(s) || nf(s, !1, n), nf(s, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[rf] || (r[rf] = !0, nf("selectionchange", !1, r));
    }
  }
  function Mm(n, r, s, f) {
    switch (As(r)) {
      case 1:
        var m = _s;
        break;
      case 4:
        m = Ms;
        break;
      default:
        m = Wo;
    }
    s = m.bind(null, r, s, n), m = void 0, !Ur || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (m = !0), f ? m !== void 0 ? n.addEventListener(r, s, { capture: !0, passive: m }) : n.addEventListener(r, s, !0) : m !== void 0 ? n.addEventListener(r, s, { passive: m }) : n.addEventListener(r, s, !1);
  }
  function af(n, r, s, f, m) {
    var y = f;
    if (!(r & 1) && !(r & 2) && f !== null) e: for (; ; ) {
      if (f === null) return;
      var w = f.tag;
      if (w === 3 || w === 4) {
        var O = f.stateNode.containerInfo;
        if (O === m || O.nodeType === 8 && O.parentNode === m) break;
        if (w === 4) for (w = f.return; w !== null; ) {
          var V = w.tag;
          if ((V === 3 || V === 4) && (V = w.stateNode.containerInfo, V === m || V.nodeType === 8 && V.parentNode === m)) return;
          w = w.return;
        }
        for (; O !== null; ) {
          if (w = Bl(O), w === null) return;
          if (V = w.tag, V === 5 || V === 6) {
            f = y = w;
            continue e;
          }
          O = O.parentNode;
        }
      }
      f = f.return;
    }
    Dl(function() {
      var Q = y, fe = Kt(s), de = [];
      e: {
        var se = op.get(n);
        if (se !== void 0) {
          var Me = xt, Ve = n;
          switch (n) {
            case "keypress":
              if (X(s) === 0) break e;
            case "keydown":
            case "keyup":
              Me = Xd;
              break;
            case "focusin":
              Ve = "focus", Me = Pl;
              break;
            case "focusout":
              Ve = "blur", Me = Pl;
              break;
            case "beforeblur":
            case "afterblur":
              Me = Pl;
              break;
            case "click":
              if (s.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              Me = Go;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              Me = ao;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              Me = fm;
              break;
            case Rm:
            case km:
            case Dm:
              Me = Gc;
              break;
            case _m:
              Me = lo;
              break;
            case "scroll":
              Me = ln;
              break;
            case "wheel":
              Me = so;
              break;
            case "copy":
            case "cut":
            case "paste":
              Me = lm;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              Me = cm;
          }
          var Fe = (r & 4) !== 0, An = !Fe && n === "scroll", H = Fe ? se !== null ? se + "Capture" : null : se;
          Fe = [];
          for (var U = Q, B; U !== null; ) {
            B = U;
            var me = B.stateNode;
            if (B.tag === 5 && me !== null && (B = me, H !== null && (me = zr(U, H), me != null && Fe.push(Us(U, me, B)))), An) break;
            U = U.return;
          }
          0 < Fe.length && (se = new Me(se, Ve, null, s, fe), de.push({ event: se, listeners: Fe }));
        }
      }
      if (!(r & 7)) {
        e: {
          if (se = n === "mouseover" || n === "pointerover", Me = n === "mouseout" || n === "pointerout", se && s !== on && (Ve = s.relatedTarget || s.fromElement) && (Bl(Ve) || Ve[uo])) break e;
          if ((Me || se) && (se = fe.window === fe ? fe : (se = fe.ownerDocument) ? se.defaultView || se.parentWindow : window, Me ? (Ve = s.relatedTarget || s.toElement, Me = Q, Ve = Ve ? Bl(Ve) : null, Ve !== null && (An = Ct(Ve), Ve !== An || Ve.tag !== 5 && Ve.tag !== 6) && (Ve = null)) : (Me = null, Ve = Q), Me !== Ve)) {
            if (Fe = Go, me = "onMouseLeave", H = "onMouseEnter", U = "mouse", (n === "pointerout" || n === "pointerover") && (Fe = cm, me = "onPointerLeave", H = "onPointerEnter", U = "pointer"), An = Me == null ? se : da(Me), B = Ve == null ? se : da(Ve), se = new Fe(me, U + "leave", Me, s, fe), se.target = An, se.relatedTarget = B, me = null, Bl(fe) === Q && (Fe = new Fe(H, U + "enter", Ve, s, fe), Fe.target = B, Fe.relatedTarget = An, me = Fe), An = me, Me && Ve) t: {
              for (Fe = Me, H = Ve, U = 0, B = Fe; B; B = Qo(B)) U++;
              for (B = 0, me = H; me; me = Qo(me)) B++;
              for (; 0 < U - B; ) Fe = Qo(Fe), U--;
              for (; 0 < B - U; ) H = Qo(H), B--;
              for (; U--; ) {
                if (Fe === H || H !== null && Fe === H.alternate) break t;
                Fe = Qo(Fe), H = Qo(H);
              }
              Fe = null;
            }
            else Fe = null;
            Me !== null && Om(de, se, Me, Fe, !1), Ve !== null && An !== null && Om(de, An, Ve, Fe, !0);
          }
        }
        e: {
          if (se = Q ? da(Q) : window, Me = se.nodeName && se.nodeName.toLowerCase(), Me === "select" || Me === "input" && se.type === "file") var He = _g;
          else if (ym(se)) if (Sm) He = xm;
          else {
            He = bm;
            var rt = Mg;
          }
          else (Me = se.nodeName) && Me.toLowerCase() === "input" && (se.type === "checkbox" || se.type === "radio") && (He = Og);
          if (He && (He = He(n, Q))) {
            Jd(de, He, s, fe);
            break e;
          }
          rt && rt(n, se, Q), n === "focusout" && (rt = se._wrapperState) && rt.controlled && se.type === "number" && vi(se, "number", se.value);
        }
        switch (rt = Q ? da(Q) : window, n) {
          case "focusin":
            (ym(rt) || rt.contentEditable === "true") && (Vs = rt, np = Q, Iu = null);
            break;
          case "focusout":
            Iu = np = Vs = null;
            break;
          case "mousedown":
            rp = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            rp = !1, ip(de, s, fe);
            break;
          case "selectionchange":
            if (Lg) break;
          case "keydown":
          case "keyup":
            ip(de, s, fe);
        }
        var tt;
        if (Ls) e: {
          switch (n) {
            case "compositionstart":
              var st = "onCompositionStart";
              break e;
            case "compositionend":
              st = "onCompositionEnd";
              break e;
            case "compositionupdate":
              st = "onCompositionUpdate";
              break e;
          }
          st = void 0;
        }
        else Ns ? hm(n, s) && (st = "onCompositionEnd") : n === "keydown" && s.keyCode === 229 && (st = "onCompositionStart");
        st && (dm && s.locale !== "ko" && (Ns || st !== "onCompositionStart" ? st === "onCompositionEnd" && Ns && (tt = W()) : (ca = fe, T = "value" in ca ? ca.value : ca.textContent, Ns = !0)), rt = $u(Q, st), 0 < rt.length && (st = new Gd(st, n, null, s, fe), de.push({ event: st, listeners: rt }), tt ? st.data = tt : (tt = mm(s), tt !== null && (st.data = tt)))), (tt = Fu ? vm(n, s) : kg(n, s)) && (Q = $u(Q, "onBeforeInput"), 0 < Q.length && (fe = new Gd("onBeforeInput", "beforeinput", null, s, fe), de.push({ event: fe, listeners: Q }), fe.data = tt));
      }
      Fl(de, r);
    });
  }
  function Us(n, r, s) {
    return { instance: n, listener: r, currentTarget: s };
  }
  function $u(n, r) {
    for (var s = r + "Capture", f = []; n !== null; ) {
      var m = n, y = m.stateNode;
      m.tag === 5 && y !== null && (m = y, y = zr(n, s), y != null && f.unshift(Us(n, y, m)), y = zr(n, r), y != null && f.push(Us(n, y, m))), n = n.return;
    }
    return f;
  }
  function Qo(n) {
    if (n === null) return null;
    do
      n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function Om(n, r, s, f, m) {
    for (var y = r._reactName, w = []; s !== null && s !== f; ) {
      var O = s, V = O.alternate, Q = O.stateNode;
      if (V !== null && V === f) break;
      O.tag === 5 && Q !== null && (O = Q, m ? (V = zr(s, y), V != null && w.unshift(Us(s, V, O))) : m || (V = zr(s, y), V != null && w.push(Us(s, V, O)))), s = s.return;
    }
    w.length !== 0 && n.push({ event: r, listeners: w });
  }
  var Am = /\r\n?/g, Vg = /\u0000|\uFFFD/g;
  function Lm(n) {
    return (typeof n == "string" ? n : "" + n).replace(Am, `
`).replace(Vg, "");
  }
  function of(n, r, s) {
    if (r = Lm(r), Lm(n) !== r && s) throw Error(c(425));
  }
  function Xo() {
  }
  var Wu = null, jl = null;
  function lf(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var sf = typeof setTimeout == "function" ? setTimeout : void 0, up = typeof clearTimeout == "function" ? clearTimeout : void 0, Nm = typeof Promise == "function" ? Promise : void 0, Fs = typeof queueMicrotask == "function" ? queueMicrotask : typeof Nm < "u" ? function(n) {
    return Nm.resolve(null).then(n).catch(uf);
  } : sf;
  function uf(n) {
    setTimeout(function() {
      throw n;
    });
  }
  function js(n, r) {
    var s = r, f = 0;
    do {
      var m = s.nextSibling;
      if (n.removeChild(s), m && m.nodeType === 8) if (s = m.data, s === "/$") {
        if (f === 0) {
          n.removeChild(m), ua(r);
          return;
        }
        f--;
      } else s !== "$" && s !== "$?" && s !== "$!" || f++;
      s = m;
    } while (s);
    ua(r);
  }
  function Ma(n) {
    for (; n != null; n = n.nextSibling) {
      var r = n.nodeType;
      if (r === 1 || r === 3) break;
      if (r === 8) {
        if (r = n.data, r === "$" || r === "$!" || r === "$?") break;
        if (r === "/$") return null;
      }
    }
    return n;
  }
  function Pm(n) {
    n = n.previousSibling;
    for (var r = 0; n; ) {
      if (n.nodeType === 8) {
        var s = n.data;
        if (s === "$" || s === "$!" || s === "$?") {
          if (r === 0) return n;
          r--;
        } else s === "/$" && r++;
      }
      n = n.previousSibling;
    }
    return null;
  }
  var qo = Math.random().toString(36).slice(2), Oa = "__reactFiber$" + qo, Gu = "__reactProps$" + qo, uo = "__reactContainer$" + qo, Ku = "__reactEvents$" + qo, Bs = "__reactListeners$" + qo, zg = "__reactHandles$" + qo;
  function Bl(n) {
    var r = n[Oa];
    if (r) return r;
    for (var s = n.parentNode; s; ) {
      if (r = s[uo] || s[Oa]) {
        if (s = r.alternate, r.child !== null || s !== null && s.child !== null) for (n = Pm(n); n !== null; ) {
          if (s = n[Oa]) return s;
          n = Pm(n);
        }
        return r;
      }
      n = s, s = n.parentNode;
    }
    return null;
  }
  function Qe(n) {
    return n = n[Oa] || n[uo], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function da(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(c(33));
  }
  function Tn(n) {
    return n[Gu] || null;
  }
  var At = [], zi = -1;
  function Ui(n) {
    return { current: n };
  }
  function sn(n) {
    0 > zi || (n.current = At[zi], At[zi] = null, zi--);
  }
  function Ge(n, r) {
    zi++, At[zi] = n.current, n.current = r;
  }
  var Or = {}, Rn = Ui(Or), Kn = Ui(!1), ni = Or;
  function ri(n, r) {
    var s = n.type.contextTypes;
    if (!s) return Or;
    var f = n.stateNode;
    if (f && f.__reactInternalMemoizedUnmaskedChildContext === r) return f.__reactInternalMemoizedMaskedChildContext;
    var m = {}, y;
    for (y in s) m[y] = r[y];
    return f && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = r, n.__reactInternalMemoizedMaskedChildContext = m), m;
  }
  function Fn(n) {
    return n = n.childContextTypes, n != null;
  }
  function Hs() {
    sn(Kn), sn(Rn);
  }
  function Vm(n, r, s) {
    if (Rn.current !== Or) throw Error(c(168));
    Ge(Rn, r), Ge(Kn, s);
  }
  function Qu(n, r, s) {
    var f = n.stateNode;
    if (r = r.childContextTypes, typeof f.getChildContext != "function") return s;
    f = f.getChildContext();
    for (var m in f) if (!(m in r)) throw Error(c(108, Ue(n) || "Unknown", m));
    return N({}, s, f);
  }
  function rr(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || Or, ni = Rn.current, Ge(Rn, n), Ge(Kn, Kn.current), !0;
  }
  function cf(n, r, s) {
    var f = n.stateNode;
    if (!f) throw Error(c(169));
    s ? (n = Qu(n, r, ni), f.__reactInternalMemoizedMergedChildContext = n, sn(Kn), sn(Rn), Ge(Rn, n)) : sn(Kn), Ge(Kn, s);
  }
  var Aa = null, Is = !1, co = !1;
  function ff(n) {
    Aa === null ? Aa = [n] : Aa.push(n);
  }
  function Zo(n) {
    Is = !0, ff(n);
  }
  function La() {
    if (!co && Aa !== null) {
      co = !0;
      var n = 0, r = Ft;
      try {
        var s = Aa;
        for (Ft = 1; n < s.length; n++) {
          var f = s[n];
          do
            f = f(!0);
          while (f !== null);
        }
        Aa = null, Is = !1;
      } catch (m) {
        throw Aa !== null && (Aa = Aa.slice(n + 1)), fr(to, La), m;
      } finally {
        Ft = r, co = !1;
      }
    }
    return null;
  }
  var Jo = [], el = 0, tl = null, fo = 0, jn = [], Fi = 0, Ei = null, Na = 1, Pa = "";
  function Hl(n, r) {
    Jo[el++] = fo, Jo[el++] = tl, tl = n, fo = r;
  }
  function zm(n, r, s) {
    jn[Fi++] = Na, jn[Fi++] = Pa, jn[Fi++] = Ei, Ei = n;
    var f = Na;
    n = Pa;
    var m = 32 - Fr(f) - 1;
    f &= ~(1 << m), s += 1;
    var y = 32 - Fr(r) + m;
    if (30 < y) {
      var w = m - m % 5;
      y = (f & (1 << w) - 1).toString(32), f >>= w, m -= w, Na = 1 << 32 - Fr(r) + m | s << m | f, Pa = y + n;
    } else Na = 1 << y | s << m | f, Pa = n;
  }
  function df(n) {
    n.return !== null && (Hl(n, 1), zm(n, 1, 0));
  }
  function pf(n) {
    for (; n === tl; ) tl = Jo[--el], Jo[el] = null, fo = Jo[--el], Jo[el] = null;
    for (; n === Ei; ) Ei = jn[--Fi], jn[Fi] = null, Pa = jn[--Fi], jn[Fi] = null, Na = jn[--Fi], jn[Fi] = null;
  }
  var ii = null, ai = null, vn = !1, ji = null;
  function cp(n, r) {
    var s = Ki(5, null, null, 0);
    s.elementType = "DELETED", s.stateNode = r, s.return = n, r = n.deletions, r === null ? (n.deletions = [s], n.flags |= 16) : r.push(s);
  }
  function Um(n, r) {
    switch (n.tag) {
      case 5:
        var s = n.type;
        return r = r.nodeType !== 1 || s.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (n.stateNode = r, ii = n, ai = Ma(r.firstChild), !0) : !1;
      case 6:
        return r = n.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (n.stateNode = r, ii = n, ai = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (s = Ei !== null ? { id: Na, overflow: Pa } : null, n.memoizedState = { dehydrated: r, treeContext: s, retryLane: 1073741824 }, s = Ki(18, null, null, 0), s.stateNode = r, s.return = n, n.child = s, ii = n, ai = null, !0) : !1;
      default:
        return !1;
    }
  }
  function fp(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function dp(n) {
    if (vn) {
      var r = ai;
      if (r) {
        var s = r;
        if (!Um(n, r)) {
          if (fp(n)) throw Error(c(418));
          r = Ma(s.nextSibling);
          var f = ii;
          r && Um(n, r) ? cp(f, s) : (n.flags = n.flags & -4097 | 2, vn = !1, ii = n);
        }
      } else {
        if (fp(n)) throw Error(c(418));
        n.flags = n.flags & -4097 | 2, vn = !1, ii = n;
      }
    }
  }
  function Qn(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; ) n = n.return;
    ii = n;
  }
  function hf(n) {
    if (n !== ii) return !1;
    if (!vn) return Qn(n), vn = !0, !1;
    var r;
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !lf(n.type, n.memoizedProps)), r && (r = ai)) {
      if (fp(n)) throw Xu(), Error(c(418));
      for (; r; ) cp(n, r), r = Ma(r.nextSibling);
    }
    if (Qn(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(c(317));
      e: {
        for (n = n.nextSibling, r = 0; n; ) {
          if (n.nodeType === 8) {
            var s = n.data;
            if (s === "/$") {
              if (r === 0) {
                ai = Ma(n.nextSibling);
                break e;
              }
              r--;
            } else s !== "$" && s !== "$!" && s !== "$?" || r++;
          }
          n = n.nextSibling;
        }
        ai = null;
      }
    } else ai = ii ? Ma(n.stateNode.nextSibling) : null;
    return !0;
  }
  function Xu() {
    for (var n = ai; n; ) n = Ma(n.nextSibling);
  }
  function nl() {
    ai = ii = null, vn = !1;
  }
  function po(n) {
    ji === null ? ji = [n] : ji.push(n);
  }
  var Ug = Se.ReactCurrentBatchConfig;
  function Ti(n, r) {
    if (n && n.defaultProps) {
      r = N({}, r), n = n.defaultProps;
      for (var s in n) r[s] === void 0 && (r[s] = n[s]);
      return r;
    }
    return r;
  }
  var mf = Ui(null), vf = null, pa = null, ir = null;
  function we() {
    ir = pa = vf = null;
  }
  function Bi(n) {
    var r = mf.current;
    sn(mf), n._currentValue = r;
  }
  function bi(n, r, s) {
    for (; n !== null; ) {
      var f = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, f !== null && (f.childLanes |= r)) : f !== null && (f.childLanes & r) !== r && (f.childLanes |= r), n === s) break;
      n = n.return;
    }
  }
  function Ys(n, r) {
    vf = n, ir = pa = null, n = n.dependencies, n !== null && n.firstContext !== null && (n.lanes & r && (Ar = !0), n.firstContext = null);
  }
  function Hi(n) {
    var r = n._currentValue;
    if (ir !== n) if (n = { context: n, memoizedValue: r, next: null }, pa === null) {
      if (vf === null) throw Error(c(308));
      pa = n, vf.dependencies = { lanes: 0, firstContext: n };
    } else pa = pa.next = n;
    return r;
  }
  var Il = null;
  function pp(n) {
    Il === null ? Il = [n] : Il.push(n);
  }
  function Fm(n, r, s, f) {
    var m = r.interleaved;
    return m === null ? (s.next = s, pp(r)) : (s.next = m.next, m.next = s), r.interleaved = s, un(n, f);
  }
  function un(n, r) {
    n.lanes |= r;
    var s = n.alternate;
    for (s !== null && (s.lanes |= r), s = n, n = n.return; n !== null; ) n.childLanes |= r, s = n.alternate, s !== null && (s.childLanes |= r), s = n, n = n.return;
    return s.tag === 3 ? s.stateNode : null;
  }
  var rl = !1;
  function hp(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function jm(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function Va(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function Ii(n, r, s) {
    var f = n.updateQueue;
    if (f === null) return null;
    if (f = f.shared, Ut & 2) {
      var m = f.pending;
      return m === null ? r.next = r : (r.next = m.next, m.next = r), f.pending = r, un(n, s);
    }
    return m = f.interleaved, m === null ? (r.next = r, pp(f)) : (r.next = m.next, m.next = r), f.interleaved = r, un(n, s);
  }
  function ho(n, r, s) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (s & 4194240) !== 0)) {
      var f = r.lanes;
      f &= n.pendingLanes, s |= f, r.lanes = s, ro(n, s);
    }
  }
  function Bm(n, r) {
    var s = n.updateQueue, f = n.alternate;
    if (f !== null && (f = f.updateQueue, s === f)) {
      var m = null, y = null;
      if (s = s.firstBaseUpdate, s !== null) {
        do {
          var w = { eventTime: s.eventTime, lane: s.lane, tag: s.tag, payload: s.payload, callback: s.callback, next: null };
          y === null ? m = y = w : y = y.next = w, s = s.next;
        } while (s !== null);
        y === null ? m = y = r : y = y.next = r;
      } else m = y = r;
      s = { baseState: f.baseState, firstBaseUpdate: m, lastBaseUpdate: y, shared: f.shared, effects: f.effects }, n.updateQueue = s;
      return;
    }
    n = s.lastBaseUpdate, n === null ? s.firstBaseUpdate = r : n.next = r, s.lastBaseUpdate = r;
  }
  function yf(n, r, s, f) {
    var m = n.updateQueue;
    rl = !1;
    var y = m.firstBaseUpdate, w = m.lastBaseUpdate, O = m.shared.pending;
    if (O !== null) {
      m.shared.pending = null;
      var V = O, Q = V.next;
      V.next = null, w === null ? y = Q : w.next = Q, w = V;
      var fe = n.alternate;
      fe !== null && (fe = fe.updateQueue, O = fe.lastBaseUpdate, O !== w && (O === null ? fe.firstBaseUpdate = Q : O.next = Q, fe.lastBaseUpdate = V));
    }
    if (y !== null) {
      var de = m.baseState;
      w = 0, fe = Q = V = null, O = y;
      do {
        var se = O.lane, Me = O.eventTime;
        if ((f & se) === se) {
          fe !== null && (fe = fe.next = {
            eventTime: Me,
            lane: 0,
            tag: O.tag,
            payload: O.payload,
            callback: O.callback,
            next: null
          });
          e: {
            var Ve = n, Fe = O;
            switch (se = r, Me = s, Fe.tag) {
              case 1:
                if (Ve = Fe.payload, typeof Ve == "function") {
                  de = Ve.call(Me, de, se);
                  break e;
                }
                de = Ve;
                break e;
              case 3:
                Ve.flags = Ve.flags & -65537 | 128;
              case 0:
                if (Ve = Fe.payload, se = typeof Ve == "function" ? Ve.call(Me, de, se) : Ve, se == null) break e;
                de = N({}, de, se);
                break e;
              case 2:
                rl = !0;
            }
          }
          O.callback !== null && O.lane !== 0 && (n.flags |= 64, se = m.effects, se === null ? m.effects = [O] : se.push(O));
        } else Me = { eventTime: Me, lane: se, tag: O.tag, payload: O.payload, callback: O.callback, next: null }, fe === null ? (Q = fe = Me, V = de) : fe = fe.next = Me, w |= se;
        if (O = O.next, O === null) {
          if (O = m.shared.pending, O === null) break;
          se = O, O = se.next, se.next = null, m.lastBaseUpdate = se, m.shared.pending = null;
        }
      } while (!0);
      if (fe === null && (V = de), m.baseState = V, m.firstBaseUpdate = Q, m.lastBaseUpdate = fe, r = m.shared.interleaved, r !== null) {
        m = r;
        do
          w |= m.lane, m = m.next;
        while (m !== r);
      } else y === null && (m.shared.lanes = 0);
      go |= w, n.lanes = w, n.memoizedState = de;
    }
  }
  function Hm(n, r, s) {
    if (n = r.effects, r.effects = null, n !== null) for (r = 0; r < n.length; r++) {
      var f = n[r], m = f.callback;
      if (m !== null) {
        if (f.callback = null, f = s, typeof m != "function") throw Error(c(191, m));
        m.call(f);
      }
    }
  }
  var Im = new a.Component().refs;
  function mp(n, r, s, f) {
    r = n.memoizedState, s = s(f, r), s = s == null ? r : N({}, r, s), n.memoizedState = s, n.lanes === 0 && (n.updateQueue.baseState = s);
  }
  var gf = { isMounted: function(n) {
    return (n = n._reactInternals) ? Ct(n) === n : !1;
  }, enqueueSetState: function(n, r, s) {
    n = n._reactInternals;
    var f = vr(), m = Gi(n), y = Va(f, m);
    y.payload = r, s != null && (y.callback = s), r = Ii(n, y, m), r !== null && (ya(r, n, m, f), ho(r, n, m));
  }, enqueueReplaceState: function(n, r, s) {
    n = n._reactInternals;
    var f = vr(), m = Gi(n), y = Va(f, m);
    y.tag = 1, y.payload = r, s != null && (y.callback = s), r = Ii(n, y, m), r !== null && (ya(r, n, m, f), ho(r, n, m));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var s = vr(), f = Gi(n), m = Va(s, f);
    m.tag = 2, r != null && (m.callback = r), r = Ii(n, m, f), r !== null && (ya(r, n, f, s), ho(r, n, f));
  } };
  function vp(n, r, s, f, m, y, w) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(f, y, w) : r.prototype && r.prototype.isPureReactComponent ? !Bu(s, f) || !Bu(m, y) : !0;
  }
  function yp(n, r, s) {
    var f = !1, m = Or, y = r.contextType;
    return typeof y == "object" && y !== null ? y = Hi(y) : (m = Fn(r) ? ni : Rn.current, f = r.contextTypes, y = (f = f != null) ? ri(n, m) : Or), r = new r(s, y), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = gf, n.stateNode = r, r._reactInternals = n, f && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = m, n.__reactInternalMemoizedMaskedChildContext = y), r;
  }
  function Ym(n, r, s, f) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(s, f), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(s, f), r.state !== n && gf.enqueueReplaceState(r, r.state, null);
  }
  function gp(n, r, s, f) {
    var m = n.stateNode;
    m.props = s, m.state = n.memoizedState, m.refs = Im, hp(n);
    var y = r.contextType;
    typeof y == "object" && y !== null ? m.context = Hi(y) : (y = Fn(r) ? ni : Rn.current, m.context = ri(n, y)), m.state = n.memoizedState, y = r.getDerivedStateFromProps, typeof y == "function" && (mp(n, r, y, s), m.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof m.getSnapshotBeforeUpdate == "function" || typeof m.UNSAFE_componentWillMount != "function" && typeof m.componentWillMount != "function" || (r = m.state, typeof m.componentWillMount == "function" && m.componentWillMount(), typeof m.UNSAFE_componentWillMount == "function" && m.UNSAFE_componentWillMount(), r !== m.state && gf.enqueueReplaceState(m, m.state, null), yf(n, s, m, f), m.state = n.memoizedState), typeof m.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function qu(n, r, s) {
    if (n = s.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (s._owner) {
        if (s = s._owner, s) {
          if (s.tag !== 1) throw Error(c(309));
          var f = s.stateNode;
        }
        if (!f) throw Error(c(147, n));
        var m = f, y = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === y ? r.ref : (r = function(w) {
          var O = m.refs;
          O === Im && (O = m.refs = {}), w === null ? delete O[y] : O[y] = w;
        }, r._stringRef = y, r);
      }
      if (typeof n != "string") throw Error(c(284));
      if (!s._owner) throw Error(c(290, n));
    }
    return n;
  }
  function Sf(n, r) {
    throw n = Object.prototype.toString.call(r), Error(c(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n));
  }
  function $m(n) {
    var r = n._init;
    return r(n._payload);
  }
  function Wm(n) {
    function r(H, U) {
      if (n) {
        var B = H.deletions;
        B === null ? (H.deletions = [U], H.flags |= 16) : B.push(U);
      }
    }
    function s(H, U) {
      if (!n) return null;
      for (; U !== null; ) r(H, U), U = U.sibling;
      return null;
    }
    function f(H, U) {
      for (H = /* @__PURE__ */ new Map(); U !== null; ) U.key !== null ? H.set(U.key, U) : H.set(U.index, U), U = U.sibling;
      return H;
    }
    function m(H, U) {
      return H = To(H, U), H.index = 0, H.sibling = null, H;
    }
    function y(H, U, B) {
      return H.index = B, n ? (B = H.alternate, B !== null ? (B = B.index, B < U ? (H.flags |= 2, U) : B) : (H.flags |= 2, U)) : (H.flags |= 1048576, U);
    }
    function w(H) {
      return n && H.alternate === null && (H.flags |= 2), H;
    }
    function O(H, U, B, me) {
      return U === null || U.tag !== 6 ? (U = Yf(B, H.mode, me), U.return = H, U) : (U = m(U, B), U.return = H, U);
    }
    function V(H, U, B, me) {
      var He = B.type;
      return He === xe ? fe(H, U, B.props.children, me, B.key) : U !== null && (U.elementType === He || typeof He == "object" && He !== null && He.$$typeof === ht && $m(He) === U.type) ? (me = m(U, B.props), me.ref = qu(H, U, B), me.return = H, me) : (me = ou(B.type, B.key, B.props, null, H.mode, me), me.ref = qu(H, U, B), me.return = H, me);
    }
    function Q(H, U, B, me) {
      return U === null || U.tag !== 4 || U.stateNode.containerInfo !== B.containerInfo || U.stateNode.implementation !== B.implementation ? (U = $f(B, H.mode, me), U.return = H, U) : (U = m(U, B.children || []), U.return = H, U);
    }
    function fe(H, U, B, me, He) {
      return U === null || U.tag !== 7 ? (U = ga(B, H.mode, me, He), U.return = H, U) : (U = m(U, B), U.return = H, U);
    }
    function de(H, U, B) {
      if (typeof U == "string" && U !== "" || typeof U == "number") return U = Yf("" + U, H.mode, B), U.return = H, U;
      if (typeof U == "object" && U !== null) {
        switch (U.$$typeof) {
          case ae:
            return B = ou(U.type, U.key, U.props, null, H.mode, B), B.ref = qu(H, null, U), B.return = H, B;
          case Re:
            return U = $f(U, H.mode, B), U.return = H, U;
          case ht:
            var me = U._init;
            return de(H, me(U._payload), B);
        }
        if (tr(U) || De(U)) return U = ga(U, H.mode, B, null), U.return = H, U;
        Sf(H, U);
      }
      return null;
    }
    function se(H, U, B, me) {
      var He = U !== null ? U.key : null;
      if (typeof B == "string" && B !== "" || typeof B == "number") return He !== null ? null : O(H, U, "" + B, me);
      if (typeof B == "object" && B !== null) {
        switch (B.$$typeof) {
          case ae:
            return B.key === He ? V(H, U, B, me) : null;
          case Re:
            return B.key === He ? Q(H, U, B, me) : null;
          case ht:
            return He = B._init, se(
              H,
              U,
              He(B._payload),
              me
            );
        }
        if (tr(B) || De(B)) return He !== null ? null : fe(H, U, B, me, null);
        Sf(H, B);
      }
      return null;
    }
    function Me(H, U, B, me, He) {
      if (typeof me == "string" && me !== "" || typeof me == "number") return H = H.get(B) || null, O(U, H, "" + me, He);
      if (typeof me == "object" && me !== null) {
        switch (me.$$typeof) {
          case ae:
            return H = H.get(me.key === null ? B : me.key) || null, V(U, H, me, He);
          case Re:
            return H = H.get(me.key === null ? B : me.key) || null, Q(U, H, me, He);
          case ht:
            var rt = me._init;
            return Me(H, U, B, rt(me._payload), He);
        }
        if (tr(me) || De(me)) return H = H.get(B) || null, fe(U, H, me, He, null);
        Sf(U, me);
      }
      return null;
    }
    function Ve(H, U, B, me) {
      for (var He = null, rt = null, tt = U, st = U = 0, lr = null; tt !== null && st < B.length; st++) {
        tt.index > st ? (lr = tt, tt = null) : lr = tt.sibling;
        var Bt = se(H, tt, B[st], me);
        if (Bt === null) {
          tt === null && (tt = lr);
          break;
        }
        n && tt && Bt.alternate === null && r(H, tt), U = y(Bt, U, st), rt === null ? He = Bt : rt.sibling = Bt, rt = Bt, tt = lr;
      }
      if (st === B.length) return s(H, tt), vn && Hl(H, st), He;
      if (tt === null) {
        for (; st < B.length; st++) tt = de(H, B[st], me), tt !== null && (U = y(tt, U, st), rt === null ? He = tt : rt.sibling = tt, rt = tt);
        return vn && Hl(H, st), He;
      }
      for (tt = f(H, tt); st < B.length; st++) lr = Me(tt, H, st, B[st], me), lr !== null && (n && lr.alternate !== null && tt.delete(lr.key === null ? st : lr.key), U = y(lr, U, st), rt === null ? He = lr : rt.sibling = lr, rt = lr);
      return n && tt.forEach(function(bo) {
        return r(H, bo);
      }), vn && Hl(H, st), He;
    }
    function Fe(H, U, B, me) {
      var He = De(B);
      if (typeof He != "function") throw Error(c(150));
      if (B = He.call(B), B == null) throw Error(c(151));
      for (var rt = He = null, tt = U, st = U = 0, lr = null, Bt = B.next(); tt !== null && !Bt.done; st++, Bt = B.next()) {
        tt.index > st ? (lr = tt, tt = null) : lr = tt.sibling;
        var bo = se(H, tt, Bt.value, me);
        if (bo === null) {
          tt === null && (tt = lr);
          break;
        }
        n && tt && bo.alternate === null && r(H, tt), U = y(bo, U, st), rt === null ? He = bo : rt.sibling = bo, rt = bo, tt = lr;
      }
      if (Bt.done) return s(
        H,
        tt
      ), vn && Hl(H, st), He;
      if (tt === null) {
        for (; !Bt.done; st++, Bt = B.next()) Bt = de(H, Bt.value, me), Bt !== null && (U = y(Bt, U, st), rt === null ? He = Bt : rt.sibling = Bt, rt = Bt);
        return vn && Hl(H, st), He;
      }
      for (tt = f(H, tt); !Bt.done; st++, Bt = B.next()) Bt = Me(tt, H, st, Bt.value, me), Bt !== null && (n && Bt.alternate !== null && tt.delete(Bt.key === null ? st : Bt.key), U = y(Bt, U, st), rt === null ? He = Bt : rt.sibling = Bt, rt = Bt);
      return n && tt.forEach(function(Dv) {
        return r(H, Dv);
      }), vn && Hl(H, st), He;
    }
    function An(H, U, B, me) {
      if (typeof B == "object" && B !== null && B.type === xe && B.key === null && (B = B.props.children), typeof B == "object" && B !== null) {
        switch (B.$$typeof) {
          case ae:
            e: {
              for (var He = B.key, rt = U; rt !== null; ) {
                if (rt.key === He) {
                  if (He = B.type, He === xe) {
                    if (rt.tag === 7) {
                      s(H, rt.sibling), U = m(rt, B.props.children), U.return = H, H = U;
                      break e;
                    }
                  } else if (rt.elementType === He || typeof He == "object" && He !== null && He.$$typeof === ht && $m(He) === rt.type) {
                    s(H, rt.sibling), U = m(rt, B.props), U.ref = qu(H, rt, B), U.return = H, H = U;
                    break e;
                  }
                  s(H, rt);
                  break;
                } else r(H, rt);
                rt = rt.sibling;
              }
              B.type === xe ? (U = ga(B.props.children, H.mode, me, B.key), U.return = H, H = U) : (me = ou(B.type, B.key, B.props, null, H.mode, me), me.ref = qu(H, U, B), me.return = H, H = me);
            }
            return w(H);
          case Re:
            e: {
              for (rt = B.key; U !== null; ) {
                if (U.key === rt) if (U.tag === 4 && U.stateNode.containerInfo === B.containerInfo && U.stateNode.implementation === B.implementation) {
                  s(H, U.sibling), U = m(U, B.children || []), U.return = H, H = U;
                  break e;
                } else {
                  s(H, U);
                  break;
                }
                else r(H, U);
                U = U.sibling;
              }
              U = $f(B, H.mode, me), U.return = H, H = U;
            }
            return w(H);
          case ht:
            return rt = B._init, An(H, U, rt(B._payload), me);
        }
        if (tr(B)) return Ve(H, U, B, me);
        if (De(B)) return Fe(H, U, B, me);
        Sf(H, B);
      }
      return typeof B == "string" && B !== "" || typeof B == "number" ? (B = "" + B, U !== null && U.tag === 6 ? (s(H, U.sibling), U = m(U, B), U.return = H, H = U) : (s(H, U), U = Yf(B, H.mode, me), U.return = H, H = U), w(H)) : s(H, U);
    }
    return An;
  }
  var Yl = Wm(!0), Gm = Wm(!1), $s = {}, za = Ui($s), Zu = Ui($s), $l = Ui($s);
  function Ke(n) {
    if (n === $s) throw Error(c(174));
    return n;
  }
  function wt(n, r) {
    switch (Ge($l, r), Ge(Zu, n), Ge(za, $s), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : yi(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = yi(r, n);
    }
    sn(za), Ge(za, r);
  }
  function Lt() {
    sn(za), sn(Zu), sn($l);
  }
  function Mn(n) {
    Ke($l.current);
    var r = Ke(za.current), s = yi(r, n.type);
    r !== s && (Ge(Zu, n), Ge(za, s));
  }
  function Yi(n) {
    Zu.current === n && (sn(za), sn(Zu));
  }
  var yn = Ui(0);
  function Cf(n) {
    for (var r = n; r !== null; ) {
      if (r.tag === 13) {
        var s = r.memoizedState;
        if (s !== null && (s = s.dehydrated, s === null || s.data === "$?" || s.data === "$!")) return r;
      } else if (r.tag === 19 && r.memoizedProps.revealOrder !== void 0) {
        if (r.flags & 128) return r;
      } else if (r.child !== null) {
        r.child.return = r, r = r.child;
        continue;
      }
      if (r === n) break;
      for (; r.sibling === null; ) {
        if (r.return === null || r.return === n) return null;
        r = r.return;
      }
      r.sibling.return = r.return, r = r.sibling;
    }
    return null;
  }
  var Sp = [];
  function Cp() {
    for (var n = 0; n < Sp.length; n++) Sp[n]._workInProgressVersionPrimary = null;
    Sp.length = 0;
  }
  var Ws = Se.ReactCurrentDispatcher, oe = Se.ReactCurrentBatchConfig, gn = 0, _e = null, Sn = null, cn = null, Ua = !1, oi = !1, mo = 0, Gs = 0;
  function Bn() {
    throw Error(c(321));
  }
  function Ju(n, r) {
    if (r === null) return !1;
    for (var s = 0; s < r.length && s < n.length; s++) if (!fa(n[s], r[s])) return !1;
    return !0;
  }
  function ec(n, r, s, f, m, y) {
    if (gn = y, _e = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, Ws.current = n === null || n.memoizedState === null ? jg : Tp, n = s(f, m), oi) {
      y = 0;
      do {
        if (oi = !1, mo = 0, 25 <= y) throw Error(c(301));
        y += 1, cn = Sn = null, r.updateQueue = null, Ws.current = Zm, n = s(f, m);
      } while (oi);
    }
    if (Ws.current = Js, r = Sn !== null && Sn.next !== null, gn = 0, cn = Sn = _e = null, Ua = !1, r) throw Error(c(300));
    return n;
  }
  function tc() {
    var n = mo !== 0;
    return mo = 0, n;
  }
  function $i() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return cn === null ? _e.memoizedState = cn = n : cn = cn.next = n, cn;
  }
  function li() {
    if (Sn === null) {
      var n = _e.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = Sn.next;
    var r = cn === null ? _e.memoizedState : cn.next;
    if (r !== null) cn = r, Sn = n;
    else {
      if (n === null) throw Error(c(310));
      Sn = n, n = { memoizedState: Sn.memoizedState, baseState: Sn.baseState, baseQueue: Sn.baseQueue, queue: Sn.queue, next: null }, cn === null ? _e.memoizedState = cn = n : cn = cn.next = n;
    }
    return cn;
  }
  function Wl(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function nc(n) {
    var r = li(), s = r.queue;
    if (s === null) throw Error(c(311));
    s.lastRenderedReducer = n;
    var f = Sn, m = f.baseQueue, y = s.pending;
    if (y !== null) {
      if (m !== null) {
        var w = m.next;
        m.next = y.next, y.next = w;
      }
      f.baseQueue = m = y, s.pending = null;
    }
    if (m !== null) {
      y = m.next, f = f.baseState;
      var O = w = null, V = null, Q = y;
      do {
        var fe = Q.lane;
        if ((gn & fe) === fe) V !== null && (V = V.next = { lane: 0, action: Q.action, hasEagerState: Q.hasEagerState, eagerState: Q.eagerState, next: null }), f = Q.hasEagerState ? Q.eagerState : n(f, Q.action);
        else {
          var de = {
            lane: fe,
            action: Q.action,
            hasEagerState: Q.hasEagerState,
            eagerState: Q.eagerState,
            next: null
          };
          V === null ? (O = V = de, w = f) : V = V.next = de, _e.lanes |= fe, go |= fe;
        }
        Q = Q.next;
      } while (Q !== null && Q !== y);
      V === null ? w = f : V.next = O, fa(f, r.memoizedState) || (Ar = !0), r.memoizedState = f, r.baseState = w, r.baseQueue = V, s.lastRenderedState = f;
    }
    if (n = s.interleaved, n !== null) {
      m = n;
      do
        y = m.lane, _e.lanes |= y, go |= y, m = m.next;
      while (m !== n);
    } else m === null && (s.lanes = 0);
    return [r.memoizedState, s.dispatch];
  }
  function rc(n) {
    var r = li(), s = r.queue;
    if (s === null) throw Error(c(311));
    s.lastRenderedReducer = n;
    var f = s.dispatch, m = s.pending, y = r.memoizedState;
    if (m !== null) {
      s.pending = null;
      var w = m = m.next;
      do
        y = n(y, w.action), w = w.next;
      while (w !== m);
      fa(y, r.memoizedState) || (Ar = !0), r.memoizedState = y, r.baseQueue === null && (r.baseState = y), s.lastRenderedState = y;
    }
    return [y, f];
  }
  function Ef() {
  }
  function Tf(n, r) {
    var s = _e, f = li(), m = r(), y = !fa(f.memoizedState, m);
    if (y && (f.memoizedState = m, Ar = !0), f = f.queue, Mf(wf.bind(null, s, f, n), [n]), f.getSnapshot !== r || y || cn !== null && cn.memoizedState.tag & 1) {
      if (s.flags |= 2048, Fa(9, xf.bind(null, s, f, m, r), void 0, null), or === null) throw Error(c(349));
      gn & 30 || bf(s, r, m);
    }
    return m;
  }
  function bf(n, r, s) {
    n.flags |= 16384, n = { getSnapshot: r, value: s }, r = _e.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, _e.updateQueue = r, r.stores = [n]) : (s = r.stores, s === null ? r.stores = [n] : s.push(n));
  }
  function xf(n, r, s, f) {
    r.value = s, r.getSnapshot = f, Rf(r) && kf(n);
  }
  function wf(n, r, s) {
    return s(function() {
      Rf(r) && kf(n);
    });
  }
  function Rf(n) {
    var r = n.getSnapshot;
    n = n.value;
    try {
      var s = r();
      return !fa(n, s);
    } catch {
      return !0;
    }
  }
  function kf(n) {
    var r = un(n, 1);
    r !== null && ya(r, n, 1, -1);
  }
  function ic(n) {
    var r = $i();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Wl, lastRenderedState: n }, r.queue = n, n = n.dispatch = Fg.bind(null, _e, n), [r.memoizedState, n];
  }
  function Fa(n, r, s, f) {
    return n = { tag: n, create: r, destroy: s, deps: f, next: null }, r = _e.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, _e.updateQueue = r, r.lastEffect = n.next = n) : (s = r.lastEffect, s === null ? r.lastEffect = n.next = n : (f = s.next, s.next = n, n.next = f, r.lastEffect = n)), n;
  }
  function Df() {
    return li().memoizedState;
  }
  function Ks(n, r, s, f) {
    var m = $i();
    _e.flags |= n, m.memoizedState = Fa(1 | r, s, void 0, f === void 0 ? null : f);
  }
  function Qs(n, r, s, f) {
    var m = li();
    f = f === void 0 ? null : f;
    var y = void 0;
    if (Sn !== null) {
      var w = Sn.memoizedState;
      if (y = w.destroy, f !== null && Ju(f, w.deps)) {
        m.memoizedState = Fa(r, s, y, f);
        return;
      }
    }
    _e.flags |= n, m.memoizedState = Fa(1 | r, s, y, f);
  }
  function _f(n, r) {
    return Ks(8390656, 8, n, r);
  }
  function Mf(n, r) {
    return Qs(2048, 8, n, r);
  }
  function Xs(n, r) {
    return Qs(4, 2, n, r);
  }
  function Ep(n, r) {
    return Qs(4, 4, n, r);
  }
  function qs(n, r) {
    if (typeof r == "function") return n = n(), r(n), function() {
      r(null);
    };
    if (r != null) return n = n(), r.current = n, function() {
      r.current = null;
    };
  }
  function il(n, r, s) {
    return s = s != null ? s.concat([n]) : null, Qs(4, 4, qs.bind(null, r, n), s);
  }
  function Hr() {
  }
  function Km(n, r) {
    var s = li();
    r = r === void 0 ? null : r;
    var f = s.memoizedState;
    return f !== null && r !== null && Ju(r, f[1]) ? f[0] : (s.memoizedState = [n, r], n);
  }
  function nn(n, r) {
    var s = li();
    r = r === void 0 ? null : r;
    var f = s.memoizedState;
    return f !== null && r !== null && Ju(r, f[1]) ? f[0] : (n = n(), s.memoizedState = [n, r], n);
  }
  function ac(n, r, s) {
    return gn & 21 ? (fa(s, r) || (s = ws(), _e.lanes |= s, go |= s, n.baseState = !0), r) : (n.baseState && (n.baseState = !1, Ar = !0), n.memoizedState = s);
  }
  function Of(n, r) {
    var s = Ft;
    Ft = s !== 0 && 4 > s ? s : 4, n(!0);
    var f = oe.transition;
    oe.transition = {};
    try {
      n(!1), r();
    } finally {
      Ft = s, oe.transition = f;
    }
  }
  function Zs() {
    return li().memoizedState;
  }
  function Af(n, r, s) {
    var f = Gi(n);
    if (s = { lane: f, action: s, hasEagerState: !1, eagerState: null, next: null }, Qm(n)) Xm(r, s);
    else if (s = Fm(n, r, s, f), s !== null) {
      var m = vr();
      ya(s, n, f, m), qm(s, r, f);
    }
  }
  function Fg(n, r, s) {
    var f = Gi(n), m = { lane: f, action: s, hasEagerState: !1, eagerState: null, next: null };
    if (Qm(n)) Xm(r, m);
    else {
      var y = n.alternate;
      if (n.lanes === 0 && (y === null || y.lanes === 0) && (y = r.lastRenderedReducer, y !== null)) try {
        var w = r.lastRenderedState, O = y(w, s);
        if (m.hasEagerState = !0, m.eagerState = O, fa(O, w)) {
          var V = r.interleaved;
          V === null ? (m.next = m, pp(r)) : (m.next = V.next, V.next = m), r.interleaved = m;
          return;
        }
      } catch {
      } finally {
      }
      s = Fm(n, r, m, f), s !== null && (m = vr(), ya(s, n, f, m), qm(s, r, f));
    }
  }
  function Qm(n) {
    var r = n.alternate;
    return n === _e || r !== null && r === _e;
  }
  function Xm(n, r) {
    oi = Ua = !0;
    var s = n.pending;
    s === null ? r.next = r : (r.next = s.next, s.next = r), n.pending = r;
  }
  function qm(n, r, s) {
    if (s & 4194240) {
      var f = r.lanes;
      f &= n.pendingLanes, s |= f, r.lanes = s, ro(n, s);
    }
  }
  var Js = { readContext: Hi, useCallback: Bn, useContext: Bn, useEffect: Bn, useImperativeHandle: Bn, useInsertionEffect: Bn, useLayoutEffect: Bn, useMemo: Bn, useReducer: Bn, useRef: Bn, useState: Bn, useDebugValue: Bn, useDeferredValue: Bn, useTransition: Bn, useMutableSource: Bn, useSyncExternalStore: Bn, useId: Bn, unstable_isNewReconciler: !1 }, jg = { readContext: Hi, useCallback: function(n, r) {
    return $i().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: Hi, useEffect: _f, useImperativeHandle: function(n, r, s) {
    return s = s != null ? s.concat([n]) : null, Ks(
      4194308,
      4,
      qs.bind(null, r, n),
      s
    );
  }, useLayoutEffect: function(n, r) {
    return Ks(4194308, 4, n, r);
  }, useInsertionEffect: function(n, r) {
    return Ks(4, 2, n, r);
  }, useMemo: function(n, r) {
    var s = $i();
    return r = r === void 0 ? null : r, n = n(), s.memoizedState = [n, r], n;
  }, useReducer: function(n, r, s) {
    var f = $i();
    return r = s !== void 0 ? s(r) : r, f.memoizedState = f.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, f.queue = n, n = n.dispatch = Af.bind(null, _e, n), [f.memoizedState, n];
  }, useRef: function(n) {
    var r = $i();
    return n = { current: n }, r.memoizedState = n;
  }, useState: ic, useDebugValue: Hr, useDeferredValue: function(n) {
    return $i().memoizedState = n;
  }, useTransition: function() {
    var n = ic(!1), r = n[0];
    return n = Of.bind(null, n[1]), $i().memoizedState = n, [r, n];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(n, r, s) {
    var f = _e, m = $i();
    if (vn) {
      if (s === void 0) throw Error(c(407));
      s = s();
    } else {
      if (s = r(), or === null) throw Error(c(349));
      gn & 30 || bf(f, r, s);
    }
    m.memoizedState = s;
    var y = { value: s, getSnapshot: r };
    return m.queue = y, _f(wf.bind(
      null,
      f,
      y,
      n
    ), [n]), f.flags |= 2048, Fa(9, xf.bind(null, f, y, s, r), void 0, null), s;
  }, useId: function() {
    var n = $i(), r = or.identifierPrefix;
    if (vn) {
      var s = Pa, f = Na;
      s = (f & ~(1 << 32 - Fr(f) - 1)).toString(32) + s, r = ":" + r + "R" + s, s = mo++, 0 < s && (r += "H" + s.toString(32)), r += ":";
    } else s = Gs++, r = ":" + r + "r" + s.toString(32) + ":";
    return n.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, Tp = {
    readContext: Hi,
    useCallback: Km,
    useContext: Hi,
    useEffect: Mf,
    useImperativeHandle: il,
    useInsertionEffect: Xs,
    useLayoutEffect: Ep,
    useMemo: nn,
    useReducer: nc,
    useRef: Df,
    useState: function() {
      return nc(Wl);
    },
    useDebugValue: Hr,
    useDeferredValue: function(n) {
      var r = li();
      return ac(r, Sn.memoizedState, n);
    },
    useTransition: function() {
      var n = nc(Wl)[0], r = li().memoizedState;
      return [n, r];
    },
    useMutableSource: Ef,
    useSyncExternalStore: Tf,
    useId: Zs,
    unstable_isNewReconciler: !1
  }, Zm = { readContext: Hi, useCallback: Km, useContext: Hi, useEffect: Mf, useImperativeHandle: il, useInsertionEffect: Xs, useLayoutEffect: Ep, useMemo: nn, useReducer: rc, useRef: Df, useState: function() {
    return rc(Wl);
  }, useDebugValue: Hr, useDeferredValue: function(n) {
    var r = li();
    return Sn === null ? r.memoizedState = n : ac(r, Sn.memoizedState, n);
  }, useTransition: function() {
    var n = rc(Wl)[0], r = li().memoizedState;
    return [n, r];
  }, useMutableSource: Ef, useSyncExternalStore: Tf, useId: Zs, unstable_isNewReconciler: !1 };
  function eu(n, r) {
    try {
      var s = "", f = r;
      do
        s += bt(f), f = f.return;
      while (f);
      var m = s;
    } catch (y) {
      m = `
Error generating stack: ` + y.message + `
` + y.stack;
    }
    return { value: n, source: r, stack: m, digest: null };
  }
  function bp(n, r, s) {
    return { value: n, source: null, stack: s ?? null, digest: r ?? null };
  }
  function tu(n, r) {
    try {
      console.error(r.value);
    } catch (s) {
      setTimeout(function() {
        throw s;
      });
    }
  }
  var Bg = typeof WeakMap == "function" ? WeakMap : Map;
  function xp(n, r, s) {
    s = Va(-1, s), s.tag = 3, s.payload = { element: null };
    var f = r.value;
    return s.callback = function() {
      fl || (fl = !0, zp = f), tu(n, r);
    }, s;
  }
  function wp(n, r, s) {
    s = Va(-1, s), s.tag = 3;
    var f = n.type.getDerivedStateFromError;
    if (typeof f == "function") {
      var m = r.value;
      s.payload = function() {
        return f(m);
      }, s.callback = function() {
        tu(n, r);
      };
    }
    var y = n.stateNode;
    return y !== null && typeof y.componentDidCatch == "function" && (s.callback = function() {
      tu(n, r), typeof f != "function" && (dl === null ? dl = /* @__PURE__ */ new Set([this]) : dl.add(this));
      var w = r.stack;
      this.componentDidCatch(r.value, { componentStack: w !== null ? w : "" });
    }), s;
  }
  function Jm(n, r, s) {
    var f = n.pingCache;
    if (f === null) {
      f = n.pingCache = new Bg();
      var m = /* @__PURE__ */ new Set();
      f.set(r, m);
    } else m = f.get(r), m === void 0 && (m = /* @__PURE__ */ new Set(), f.set(r, m));
    m.has(s) || (m.add(s), n = Wg.bind(null, n, r, s), r.then(n, n));
  }
  function al(n) {
    do {
      var r;
      if ((r = n.tag === 13) && (r = n.memoizedState, r = r !== null ? r.dehydrated !== null : !0), r) return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function nu(n, r, s, f, m) {
    return n.mode & 1 ? (n.flags |= 65536, n.lanes = m, n) : (n === r ? n.flags |= 65536 : (n.flags |= 128, s.flags |= 131072, s.flags &= -52805, s.tag === 1 && (s.alternate === null ? s.tag = 17 : (r = Va(-1, 1), r.tag = 2, Ii(s, r, 1))), s.lanes |= 1), n);
  }
  var Gl = Se.ReactCurrentOwner, Ar = !1;
  function rn(n, r, s, f) {
    r.child = n === null ? Gm(r, null, s, f) : Yl(r, n.child, s, f);
  }
  function Kl(n, r, s, f, m) {
    s = s.render;
    var y = r.ref;
    return Ys(r, m), f = ec(n, r, s, f, y, m), s = tc(), n !== null && !Ar ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~m, xi(n, r, m)) : (vn && s && df(r), r.flags |= 1, rn(n, r, f, m), r.child);
  }
  function vt(n, r, s, f, m) {
    if (n === null) {
      var y = s.type;
      return typeof y == "function" && !Bp(y) && y.defaultProps === void 0 && s.compare === null && s.defaultProps === void 0 ? (r.tag = 15, r.type = y, oc(n, r, y, f, m)) : (n = ou(s.type, null, f, r, r.mode, m), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (y = n.child, !(n.lanes & m)) {
      var w = y.memoizedProps;
      if (s = s.compare, s = s !== null ? s : Bu, s(w, f) && n.ref === r.ref) return xi(n, r, m);
    }
    return r.flags |= 1, n = To(y, f), n.ref = r.ref, n.return = r, r.child = n;
  }
  function oc(n, r, s, f, m) {
    if (n !== null) {
      var y = n.memoizedProps;
      if (Bu(y, f) && n.ref === r.ref) if (Ar = !1, r.pendingProps = f = y, (n.lanes & m) !== 0) n.flags & 131072 && (Ar = !0);
      else return r.lanes = n.lanes, xi(n, r, m);
    }
    return kp(n, r, s, f, m);
  }
  function Rp(n, r, s) {
    var f = r.pendingProps, m = f.children, y = n !== null ? n.memoizedState : null;
    if (f.mode === "hidden") if (!(r.mode & 1)) r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Ge(ul, wi), wi |= s;
    else {
      if (!(s & 1073741824)) return n = y !== null ? y.baseLanes | s : s, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, Ge(ul, wi), wi |= n, null;
      r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, f = y !== null ? y.baseLanes : s, Ge(ul, wi), wi |= f;
    }
    else y !== null ? (f = y.baseLanes | s, r.memoizedState = null) : f = s, Ge(ul, wi), wi |= f;
    return rn(n, r, m, s), r.child;
  }
  function Hg(n, r) {
    var s = r.ref;
    (n === null && s !== null || n !== null && n.ref !== s) && (r.flags |= 512, r.flags |= 2097152);
  }
  function kp(n, r, s, f, m) {
    var y = Fn(s) ? ni : Rn.current;
    return y = ri(r, y), Ys(r, m), s = ec(n, r, s, f, y, m), f = tc(), n !== null && !Ar ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~m, xi(n, r, m)) : (vn && f && df(r), r.flags |= 1, rn(n, r, s, m), r.child);
  }
  function Lf(n, r, s, f, m) {
    if (Fn(s)) {
      var y = !0;
      rr(r);
    } else y = !1;
    if (Ys(r, m), r.stateNode === null) Xl(n, r), yp(r, s, f), gp(r, s, f, m), f = !0;
    else if (n === null) {
      var w = r.stateNode, O = r.memoizedProps;
      w.props = O;
      var V = w.context, Q = s.contextType;
      typeof Q == "object" && Q !== null ? Q = Hi(Q) : (Q = Fn(s) ? ni : Rn.current, Q = ri(r, Q));
      var fe = s.getDerivedStateFromProps, de = typeof fe == "function" || typeof w.getSnapshotBeforeUpdate == "function";
      de || typeof w.UNSAFE_componentWillReceiveProps != "function" && typeof w.componentWillReceiveProps != "function" || (O !== f || V !== Q) && Ym(r, w, f, Q), rl = !1;
      var se = r.memoizedState;
      w.state = se, yf(r, f, w, m), V = r.memoizedState, O !== f || se !== V || Kn.current || rl ? (typeof fe == "function" && (mp(r, s, fe, f), V = r.memoizedState), (O = rl || vp(r, s, O, f, se, V, Q)) ? (de || typeof w.UNSAFE_componentWillMount != "function" && typeof w.componentWillMount != "function" || (typeof w.componentWillMount == "function" && w.componentWillMount(), typeof w.UNSAFE_componentWillMount == "function" && w.UNSAFE_componentWillMount()), typeof w.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof w.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = f, r.memoizedState = V), w.props = f, w.state = V, w.context = Q, f = O) : (typeof w.componentDidMount == "function" && (r.flags |= 4194308), f = !1);
    } else {
      w = r.stateNode, jm(n, r), O = r.memoizedProps, Q = r.type === r.elementType ? O : Ti(r.type, O), w.props = Q, de = r.pendingProps, se = w.context, V = s.contextType, typeof V == "object" && V !== null ? V = Hi(V) : (V = Fn(s) ? ni : Rn.current, V = ri(r, V));
      var Me = s.getDerivedStateFromProps;
      (fe = typeof Me == "function" || typeof w.getSnapshotBeforeUpdate == "function") || typeof w.UNSAFE_componentWillReceiveProps != "function" && typeof w.componentWillReceiveProps != "function" || (O !== de || se !== V) && Ym(r, w, f, V), rl = !1, se = r.memoizedState, w.state = se, yf(r, f, w, m);
      var Ve = r.memoizedState;
      O !== de || se !== Ve || Kn.current || rl ? (typeof Me == "function" && (mp(r, s, Me, f), Ve = r.memoizedState), (Q = rl || vp(r, s, Q, f, se, Ve, V) || !1) ? (fe || typeof w.UNSAFE_componentWillUpdate != "function" && typeof w.componentWillUpdate != "function" || (typeof w.componentWillUpdate == "function" && w.componentWillUpdate(f, Ve, V), typeof w.UNSAFE_componentWillUpdate == "function" && w.UNSAFE_componentWillUpdate(f, Ve, V)), typeof w.componentDidUpdate == "function" && (r.flags |= 4), typeof w.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof w.componentDidUpdate != "function" || O === n.memoizedProps && se === n.memoizedState || (r.flags |= 4), typeof w.getSnapshotBeforeUpdate != "function" || O === n.memoizedProps && se === n.memoizedState || (r.flags |= 1024), r.memoizedProps = f, r.memoizedState = Ve), w.props = f, w.state = Ve, w.context = V, f = Q) : (typeof w.componentDidUpdate != "function" || O === n.memoizedProps && se === n.memoizedState || (r.flags |= 4), typeof w.getSnapshotBeforeUpdate != "function" || O === n.memoizedProps && se === n.memoizedState || (r.flags |= 1024), f = !1);
    }
    return Ql(n, r, s, f, y, m);
  }
  function Ql(n, r, s, f, m, y) {
    Hg(n, r);
    var w = (r.flags & 128) !== 0;
    if (!f && !w) return m && cf(r, s, !1), xi(n, r, y);
    f = r.stateNode, Gl.current = r;
    var O = w && typeof s.getDerivedStateFromError != "function" ? null : f.render();
    return r.flags |= 1, n !== null && w ? (r.child = Yl(r, n.child, null, y), r.child = Yl(r, null, O, y)) : rn(n, r, O, y), r.memoizedState = f.state, m && cf(r, s, !0), r.child;
  }
  function ev(n) {
    var r = n.stateNode;
    r.pendingContext ? Vm(n, r.pendingContext, r.pendingContext !== r.context) : r.context && Vm(n, r.context, !1), wt(n, r.containerInfo);
  }
  function Dp(n, r, s, f, m) {
    return nl(), po(m), r.flags |= 256, rn(n, r, s, f), r.child;
  }
  var _p = { dehydrated: null, treeContext: null, retryLane: 0 };
  function lc(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function tv(n, r, s) {
    var f = r.pendingProps, m = yn.current, y = !1, w = (r.flags & 128) !== 0, O;
    if ((O = w) || (O = n !== null && n.memoizedState === null ? !1 : (m & 2) !== 0), O ? (y = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (m |= 1), Ge(yn, m & 1), n === null)
      return dp(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? (r.mode & 1 ? n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824 : r.lanes = 1, null) : (w = f.children, n = f.fallback, y ? (f = r.mode, y = r.child, w = { mode: "hidden", children: w }, !(f & 1) && y !== null ? (y.childLanes = 0, y.pendingProps = w) : y = If(w, f, 0, null), n = ga(n, f, s, null), y.return = r, n.return = r, y.sibling = n, r.child = y, r.child.memoizedState = lc(s), r.memoizedState = _p, n) : Nf(r, w));
    if (m = n.memoizedState, m !== null && (O = m.dehydrated, O !== null)) return nv(n, r, w, f, O, m, s);
    if (y) {
      y = f.fallback, w = r.mode, m = n.child, O = m.sibling;
      var V = { mode: "hidden", children: f.children };
      return !(w & 1) && r.child !== m ? (f = r.child, f.childLanes = 0, f.pendingProps = V, r.deletions = null) : (f = To(m, V), f.subtreeFlags = m.subtreeFlags & 14680064), O !== null ? y = To(O, y) : (y = ga(y, w, s, null), y.flags |= 2), y.return = r, f.return = r, f.sibling = y, r.child = f, f = y, y = r.child, w = n.child.memoizedState, w = w === null ? lc(s) : { baseLanes: w.baseLanes | s, cachePool: null, transitions: w.transitions }, y.memoizedState = w, y.childLanes = n.childLanes & ~s, r.memoizedState = _p, f;
    }
    return y = n.child, n = y.sibling, f = To(y, { mode: "visible", children: f.children }), !(r.mode & 1) && (f.lanes = s), f.return = r, f.sibling = null, n !== null && (s = r.deletions, s === null ? (r.deletions = [n], r.flags |= 16) : s.push(n)), r.child = f, r.memoizedState = null, f;
  }
  function Nf(n, r) {
    return r = If({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function sc(n, r, s, f) {
    return f !== null && po(f), Yl(r, n.child, null, s), n = Nf(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function nv(n, r, s, f, m, y, w) {
    if (s)
      return r.flags & 256 ? (r.flags &= -257, f = bp(Error(c(422))), sc(n, r, w, f)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (y = f.fallback, m = r.mode, f = If({ mode: "visible", children: f.children }, m, 0, null), y = ga(y, m, w, null), y.flags |= 2, f.return = r, y.return = r, f.sibling = y, r.child = f, r.mode & 1 && Yl(r, n.child, null, w), r.child.memoizedState = lc(w), r.memoizedState = _p, y);
    if (!(r.mode & 1)) return sc(n, r, w, null);
    if (m.data === "$!") {
      if (f = m.nextSibling && m.nextSibling.dataset, f) var O = f.dgst;
      return f = O, y = Error(c(419)), f = bp(y, f, void 0), sc(n, r, w, f);
    }
    if (O = (w & n.childLanes) !== 0, Ar || O) {
      if (f = or, f !== null) {
        switch (w & -w) {
          case 4:
            m = 2;
            break;
          case 16:
            m = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            m = 32;
            break;
          case 536870912:
            m = 268435456;
            break;
          default:
            m = 0;
        }
        m = m & (f.suspendedLanes | w) ? 0 : m, m !== 0 && m !== y.retryLane && (y.retryLane = m, un(n, m), ya(f, n, m, -1));
      }
      return jp(), f = bp(Error(c(421))), sc(n, r, w, f);
    }
    return m.data === "$?" ? (r.flags |= 128, r.child = n.child, r = gv.bind(null, n), m._reactRetry = r, null) : (n = y.treeContext, ai = Ma(m.nextSibling), ii = r, vn = !0, ji = null, n !== null && (jn[Fi++] = Na, jn[Fi++] = Pa, jn[Fi++] = Ei, Na = n.id, Pa = n.overflow, Ei = r), r = Nf(r, f.children), r.flags |= 4096, r);
  }
  function si(n, r, s) {
    n.lanes |= r;
    var f = n.alternate;
    f !== null && (f.lanes |= r), bi(n.return, r, s);
  }
  function ha(n, r, s, f, m) {
    var y = n.memoizedState;
    y === null ? n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: f, tail: s, tailMode: m } : (y.isBackwards = r, y.rendering = null, y.renderingStartTime = 0, y.last = f, y.tail = s, y.tailMode = m);
  }
  function ja(n, r, s) {
    var f = r.pendingProps, m = f.revealOrder, y = f.tail;
    if (rn(n, r, f.children, s), f = yn.current, f & 2) f = f & 1 | 2, r.flags |= 128;
    else {
      if (n !== null && n.flags & 128) e: for (n = r.child; n !== null; ) {
        if (n.tag === 13) n.memoizedState !== null && si(n, s, r);
        else if (n.tag === 19) si(n, s, r);
        else if (n.child !== null) {
          n.child.return = n, n = n.child;
          continue;
        }
        if (n === r) break e;
        for (; n.sibling === null; ) {
          if (n.return === null || n.return === r) break e;
          n = n.return;
        }
        n.sibling.return = n.return, n = n.sibling;
      }
      f &= 1;
    }
    if (Ge(yn, f), !(r.mode & 1)) r.memoizedState = null;
    else switch (m) {
      case "forwards":
        for (s = r.child, m = null; s !== null; ) n = s.alternate, n !== null && Cf(n) === null && (m = s), s = s.sibling;
        s = m, s === null ? (m = r.child, r.child = null) : (m = s.sibling, s.sibling = null), ha(r, !1, m, s, y);
        break;
      case "backwards":
        for (s = null, m = r.child, r.child = null; m !== null; ) {
          if (n = m.alternate, n !== null && Cf(n) === null) {
            r.child = m;
            break;
          }
          n = m.sibling, m.sibling = s, s = m, m = n;
        }
        ha(r, !0, s, null, y);
        break;
      case "together":
        ha(r, !1, null, null, void 0);
        break;
      default:
        r.memoizedState = null;
    }
    return r.child;
  }
  function Xl(n, r) {
    !(r.mode & 1) && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function xi(n, r, s) {
    if (n !== null && (r.dependencies = n.dependencies), go |= r.lanes, !(s & r.childLanes)) return null;
    if (n !== null && r.child !== n.child) throw Error(c(153));
    if (r.child !== null) {
      for (n = r.child, s = To(n, n.pendingProps), r.child = s, s.return = r; n.sibling !== null; ) n = n.sibling, s = s.sibling = To(n, n.pendingProps), s.return = r;
      s.sibling = null;
    }
    return r.child;
  }
  function ma(n, r, s) {
    switch (r.tag) {
      case 3:
        ev(r), nl();
        break;
      case 5:
        Mn(r);
        break;
      case 1:
        Fn(r.type) && rr(r);
        break;
      case 4:
        wt(r, r.stateNode.containerInfo);
        break;
      case 10:
        var f = r.type._context, m = r.memoizedProps.value;
        Ge(mf, f._currentValue), f._currentValue = m;
        break;
      case 13:
        if (f = r.memoizedState, f !== null)
          return f.dehydrated !== null ? (Ge(yn, yn.current & 1), r.flags |= 128, null) : s & r.child.childLanes ? tv(n, r, s) : (Ge(yn, yn.current & 1), n = xi(n, r, s), n !== null ? n.sibling : null);
        Ge(yn, yn.current & 1);
        break;
      case 19:
        if (f = (s & r.childLanes) !== 0, n.flags & 128) {
          if (f) return ja(n, r, s);
          r.flags |= 128;
        }
        if (m = r.memoizedState, m !== null && (m.rendering = null, m.tail = null, m.lastEffect = null), Ge(yn, yn.current), f) break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, Rp(n, r, s);
    }
    return xi(n, r, s);
  }
  var Xn, Mp, rv, iv;
  Xn = function(n, r) {
    for (var s = r.child; s !== null; ) {
      if (s.tag === 5 || s.tag === 6) n.appendChild(s.stateNode);
      else if (s.tag !== 4 && s.child !== null) {
        s.child.return = s, s = s.child;
        continue;
      }
      if (s === r) break;
      for (; s.sibling === null; ) {
        if (s.return === null || s.return === r) return;
        s = s.return;
      }
      s.sibling.return = s.return, s = s.sibling;
    }
  }, Mp = function() {
  }, rv = function(n, r, s, f) {
    var m = n.memoizedProps;
    if (m !== f) {
      n = r.stateNode, Ke(za.current);
      var y = null;
      switch (s) {
        case "input":
          m = cr(n, m), f = cr(n, f), y = [];
          break;
        case "select":
          m = N({}, m, { value: void 0 }), f = N({}, f, { value: void 0 }), y = [];
          break;
        case "textarea":
          m = $n(n, m), f = $n(n, f), y = [];
          break;
        default:
          typeof m.onClick != "function" && typeof f.onClick == "function" && (n.onclick = Xo);
      }
      fn(s, f);
      var w;
      s = null;
      for (Q in m) if (!f.hasOwnProperty(Q) && m.hasOwnProperty(Q) && m[Q] != null) if (Q === "style") {
        var O = m[Q];
        for (w in O) O.hasOwnProperty(w) && (s || (s = {}), s[w] = "");
      } else Q !== "dangerouslySetInnerHTML" && Q !== "children" && Q !== "suppressContentEditableWarning" && Q !== "suppressHydrationWarning" && Q !== "autoFocus" && (g.hasOwnProperty(Q) ? y || (y = []) : (y = y || []).push(Q, null));
      for (Q in f) {
        var V = f[Q];
        if (O = m != null ? m[Q] : void 0, f.hasOwnProperty(Q) && V !== O && (V != null || O != null)) if (Q === "style") if (O) {
          for (w in O) !O.hasOwnProperty(w) || V && V.hasOwnProperty(w) || (s || (s = {}), s[w] = "");
          for (w in V) V.hasOwnProperty(w) && O[w] !== V[w] && (s || (s = {}), s[w] = V[w]);
        } else s || (y || (y = []), y.push(
          Q,
          s
        )), s = V;
        else Q === "dangerouslySetInnerHTML" ? (V = V ? V.__html : void 0, O = O ? O.__html : void 0, V != null && O !== V && (y = y || []).push(Q, V)) : Q === "children" ? typeof V != "string" && typeof V != "number" || (y = y || []).push(Q, "" + V) : Q !== "suppressContentEditableWarning" && Q !== "suppressHydrationWarning" && (g.hasOwnProperty(Q) ? (V != null && Q === "onScroll" && $t("scroll", n), y || O === V || (y = [])) : (y = y || []).push(Q, V));
      }
      s && (y = y || []).push("style", s);
      var Q = y;
      (r.updateQueue = Q) && (r.flags |= 4);
    }
  }, iv = function(n, r, s, f) {
    s !== f && (r.flags |= 4);
  };
  function ql(n, r) {
    if (!vn) switch (n.tailMode) {
      case "hidden":
        r = n.tail;
        for (var s = null; r !== null; ) r.alternate !== null && (s = r), r = r.sibling;
        s === null ? n.tail = null : s.sibling = null;
        break;
      case "collapsed":
        s = n.tail;
        for (var f = null; s !== null; ) s.alternate !== null && (f = s), s = s.sibling;
        f === null ? r || n.tail === null ? n.tail = null : n.tail.sibling = null : f.sibling = null;
    }
  }
  function hr(n) {
    var r = n.alternate !== null && n.alternate.child === n.child, s = 0, f = 0;
    if (r) for (var m = n.child; m !== null; ) s |= m.lanes | m.childLanes, f |= m.subtreeFlags & 14680064, f |= m.flags & 14680064, m.return = n, m = m.sibling;
    else for (m = n.child; m !== null; ) s |= m.lanes | m.childLanes, f |= m.subtreeFlags, f |= m.flags, m.return = n, m = m.sibling;
    return n.subtreeFlags |= f, n.childLanes = s, r;
  }
  function Pf(n, r, s) {
    var f = r.pendingProps;
    switch (pf(r), r.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return hr(r), null;
      case 1:
        return Fn(r.type) && Hs(), hr(r), null;
      case 3:
        return f = r.stateNode, Lt(), sn(Kn), sn(Rn), Cp(), f.pendingContext && (f.context = f.pendingContext, f.pendingContext = null), (n === null || n.child === null) && (hf(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && !(r.flags & 256) || (r.flags |= 1024, ji !== null && (Up(ji), ji = null))), Mp(n, r), hr(r), null;
      case 5:
        Yi(r);
        var m = Ke($l.current);
        if (s = r.type, n !== null && r.stateNode != null) rv(n, r, s, f, m), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!f) {
            if (r.stateNode === null) throw Error(c(166));
            return hr(r), null;
          }
          if (n = Ke(za.current), hf(r)) {
            f = r.stateNode, s = r.type;
            var y = r.memoizedProps;
            switch (f[Oa] = r, f[Gu] = y, n = (r.mode & 1) !== 0, s) {
              case "dialog":
                $t("cancel", f), $t("close", f);
                break;
              case "iframe":
              case "object":
              case "embed":
                $t("load", f);
                break;
              case "video":
              case "audio":
                for (m = 0; m < Yu.length; m++) $t(Yu[m], f);
                break;
              case "source":
                $t("error", f);
                break;
              case "img":
              case "image":
              case "link":
                $t(
                  "error",
                  f
                ), $t("load", f);
                break;
              case "details":
                $t("toggle", f);
                break;
              case "input":
                Yn(f, y), $t("invalid", f);
                break;
              case "select":
                f._wrapperState = { wasMultiple: !!y.multiple }, $t("invalid", f);
                break;
              case "textarea":
                kr(f, y), $t("invalid", f);
            }
            fn(s, y), m = null;
            for (var w in y) if (y.hasOwnProperty(w)) {
              var O = y[w];
              w === "children" ? typeof O == "string" ? f.textContent !== O && (y.suppressHydrationWarning !== !0 && of(f.textContent, O, n), m = ["children", O]) : typeof O == "number" && f.textContent !== "" + O && (y.suppressHydrationWarning !== !0 && of(
                f.textContent,
                O,
                n
              ), m = ["children", "" + O]) : g.hasOwnProperty(w) && O != null && w === "onScroll" && $t("scroll", f);
            }
            switch (s) {
              case "input":
                mn(f), Ta(f, y, !0);
                break;
              case "textarea":
                mn(f), zn(f);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof y.onClick == "function" && (f.onclick = Xo);
            }
            f = m, r.updateQueue = f, f !== null && (r.flags |= 4);
          } else {
            w = m.nodeType === 9 ? m : m.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = Dr(s)), n === "http://www.w3.org/1999/xhtml" ? s === "script" ? (n = w.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof f.is == "string" ? n = w.createElement(s, { is: f.is }) : (n = w.createElement(s), s === "select" && (w = n, f.multiple ? w.multiple = !0 : f.size && (w.size = f.size))) : n = w.createElementNS(n, s), n[Oa] = r, n[Gu] = f, Xn(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (w = nr(s, f), s) {
                case "dialog":
                  $t("cancel", n), $t("close", n), m = f;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  $t("load", n), m = f;
                  break;
                case "video":
                case "audio":
                  for (m = 0; m < Yu.length; m++) $t(Yu[m], n);
                  m = f;
                  break;
                case "source":
                  $t("error", n), m = f;
                  break;
                case "img":
                case "image":
                case "link":
                  $t(
                    "error",
                    n
                  ), $t("load", n), m = f;
                  break;
                case "details":
                  $t("toggle", n), m = f;
                  break;
                case "input":
                  Yn(n, f), m = cr(n, f), $t("invalid", n);
                  break;
                case "option":
                  m = f;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!f.multiple }, m = N({}, f, { value: void 0 }), $t("invalid", n);
                  break;
                case "textarea":
                  kr(n, f), m = $n(n, f), $t("invalid", n);
                  break;
                default:
                  m = f;
              }
              fn(s, m), O = m;
              for (y in O) if (O.hasOwnProperty(y)) {
                var V = O[y];
                y === "style" ? an(n, V) : y === "dangerouslySetInnerHTML" ? (V = V ? V.__html : void 0, V != null && ba(n, V)) : y === "children" ? typeof V == "string" ? (s !== "textarea" || V !== "") && ge(n, V) : typeof V == "number" && ge(n, "" + V) : y !== "suppressContentEditableWarning" && y !== "suppressHydrationWarning" && y !== "autoFocus" && (g.hasOwnProperty(y) ? V != null && y === "onScroll" && $t("scroll", n) : V != null && ne(n, y, V, w));
              }
              switch (s) {
                case "input":
                  mn(n), Ta(n, f, !1);
                  break;
                case "textarea":
                  mn(n), zn(n);
                  break;
                case "option":
                  f.value != null && n.setAttribute("value", "" + ft(f.value));
                  break;
                case "select":
                  n.multiple = !!f.multiple, y = f.value, y != null ? _n(n, !!f.multiple, y, !1) : f.defaultValue != null && _n(
                    n,
                    !!f.multiple,
                    f.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof m.onClick == "function" && (n.onclick = Xo);
              }
              switch (s) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  f = !!f.autoFocus;
                  break e;
                case "img":
                  f = !0;
                  break e;
                default:
                  f = !1;
              }
            }
            f && (r.flags |= 4);
          }
          r.ref !== null && (r.flags |= 512, r.flags |= 2097152);
        }
        return hr(r), null;
      case 6:
        if (n && r.stateNode != null) iv(n, r, n.memoizedProps, f);
        else {
          if (typeof f != "string" && r.stateNode === null) throw Error(c(166));
          if (s = Ke($l.current), Ke(za.current), hf(r)) {
            if (f = r.stateNode, s = r.memoizedProps, f[Oa] = r, (y = f.nodeValue !== s) && (n = ii, n !== null)) switch (n.tag) {
              case 3:
                of(f.nodeValue, s, (n.mode & 1) !== 0);
                break;
              case 5:
                n.memoizedProps.suppressHydrationWarning !== !0 && of(f.nodeValue, s, (n.mode & 1) !== 0);
            }
            y && (r.flags |= 4);
          } else f = (s.nodeType === 9 ? s : s.ownerDocument).createTextNode(f), f[Oa] = r, r.stateNode = f;
        }
        return hr(r), null;
      case 13:
        if (sn(yn), f = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (vn && ai !== null && r.mode & 1 && !(r.flags & 128)) Xu(), nl(), r.flags |= 98560, y = !1;
          else if (y = hf(r), f !== null && f.dehydrated !== null) {
            if (n === null) {
              if (!y) throw Error(c(318));
              if (y = r.memoizedState, y = y !== null ? y.dehydrated : null, !y) throw Error(c(317));
              y[Oa] = r;
            } else nl(), !(r.flags & 128) && (r.memoizedState = null), r.flags |= 4;
            hr(r), y = !1;
          } else ji !== null && (Up(ji), ji = null), y = !0;
          if (!y) return r.flags & 65536 ? r : null;
        }
        return r.flags & 128 ? (r.lanes = s, r) : (f = f !== null, f !== (n !== null && n.memoizedState !== null) && f && (r.child.flags |= 8192, r.mode & 1 && (n === null || yn.current & 1 ? qn === 0 && (qn = 3) : jp())), r.updateQueue !== null && (r.flags |= 4), hr(r), null);
      case 4:
        return Lt(), Mp(n, r), n === null && zs(r.stateNode.containerInfo), hr(r), null;
      case 10:
        return Bi(r.type._context), hr(r), null;
      case 17:
        return Fn(r.type) && Hs(), hr(r), null;
      case 19:
        if (sn(yn), y = r.memoizedState, y === null) return hr(r), null;
        if (f = (r.flags & 128) !== 0, w = y.rendering, w === null) if (f) ql(y, !1);
        else {
          if (qn !== 0 || n !== null && n.flags & 128) for (n = r.child; n !== null; ) {
            if (w = Cf(n), w !== null) {
              for (r.flags |= 128, ql(y, !1), f = w.updateQueue, f !== null && (r.updateQueue = f, r.flags |= 4), r.subtreeFlags = 0, f = s, s = r.child; s !== null; ) y = s, n = f, y.flags &= 14680066, w = y.alternate, w === null ? (y.childLanes = 0, y.lanes = n, y.child = null, y.subtreeFlags = 0, y.memoizedProps = null, y.memoizedState = null, y.updateQueue = null, y.dependencies = null, y.stateNode = null) : (y.childLanes = w.childLanes, y.lanes = w.lanes, y.child = w.child, y.subtreeFlags = 0, y.deletions = null, y.memoizedProps = w.memoizedProps, y.memoizedState = w.memoizedState, y.updateQueue = w.updateQueue, y.type = w.type, n = w.dependencies, y.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), s = s.sibling;
              return Ge(yn, yn.current & 1 | 2), r.child;
            }
            n = n.sibling;
          }
          y.tail !== null && Gt() > Ia && (r.flags |= 128, f = !0, ql(y, !1), r.lanes = 4194304);
        }
        else {
          if (!f) if (n = Cf(w), n !== null) {
            if (r.flags |= 128, f = !0, s = n.updateQueue, s !== null && (r.updateQueue = s, r.flags |= 4), ql(y, !0), y.tail === null && y.tailMode === "hidden" && !w.alternate && !vn) return hr(r), null;
          } else 2 * Gt() - y.renderingStartTime > Ia && s !== 1073741824 && (r.flags |= 128, f = !0, ql(y, !1), r.lanes = 4194304);
          y.isBackwards ? (w.sibling = r.child, r.child = w) : (s = y.last, s !== null ? s.sibling = w : r.child = w, y.last = w);
        }
        return y.tail !== null ? (r = y.tail, y.rendering = r, y.tail = r.sibling, y.renderingStartTime = Gt(), r.sibling = null, s = yn.current, Ge(yn, f ? s & 1 | 2 : s & 1), r) : (hr(r), null);
      case 22:
      case 23:
        return vc(), f = r.memoizedState !== null, n !== null && n.memoizedState !== null !== f && (r.flags |= 8192), f && r.mode & 1 ? wi & 1073741824 && (hr(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : hr(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(c(156, r.tag));
  }
  function av(n, r) {
    switch (pf(r), r.tag) {
      case 1:
        return Fn(r.type) && Hs(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return Lt(), sn(Kn), sn(Rn), Cp(), n = r.flags, n & 65536 && !(n & 128) ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return Yi(r), null;
      case 13:
        if (sn(yn), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null) throw Error(c(340));
          nl();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return sn(yn), null;
      case 4:
        return Lt(), null;
      case 10:
        return Bi(r.type._context), null;
      case 22:
      case 23:
        return vc(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Vf = !1, Lr = !1, Op = typeof WeakSet == "function" ? WeakSet : Set, Pe = null;
  function Zl(n, r) {
    var s = n.ref;
    if (s !== null) if (typeof s == "function") try {
      s(null);
    } catch (f) {
      kn(n, r, f);
    }
    else s.current = null;
  }
  function Ap(n, r, s) {
    try {
      s();
    } catch (f) {
      kn(n, r, f);
    }
  }
  var Lp = !1;
  function Ig(n, r) {
    if (Wu = Pi, n = Hu(), qc(n)) {
      if ("selectionStart" in n) var s = { start: n.selectionStart, end: n.selectionEnd };
      else e: {
        s = (s = n.ownerDocument) && s.defaultView || window;
        var f = s.getSelection && s.getSelection();
        if (f && f.rangeCount !== 0) {
          s = f.anchorNode;
          var m = f.anchorOffset, y = f.focusNode;
          f = f.focusOffset;
          try {
            s.nodeType, y.nodeType;
          } catch {
            s = null;
            break e;
          }
          var w = 0, O = -1, V = -1, Q = 0, fe = 0, de = n, se = null;
          t: for (; ; ) {
            for (var Me; de !== s || m !== 0 && de.nodeType !== 3 || (O = w + m), de !== y || f !== 0 && de.nodeType !== 3 || (V = w + f), de.nodeType === 3 && (w += de.nodeValue.length), (Me = de.firstChild) !== null; )
              se = de, de = Me;
            for (; ; ) {
              if (de === n) break t;
              if (se === s && ++Q === m && (O = w), se === y && ++fe === f && (V = w), (Me = de.nextSibling) !== null) break;
              de = se, se = de.parentNode;
            }
            de = Me;
          }
          s = O === -1 || V === -1 ? null : { start: O, end: V };
        } else s = null;
      }
      s = s || { start: 0, end: 0 };
    } else s = null;
    for (jl = { focusedElem: n, selectionRange: s }, Pi = !1, Pe = r; Pe !== null; ) if (r = Pe, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null) n.return = r, Pe = n;
    else for (; Pe !== null; ) {
      r = Pe;
      try {
        var Ve = r.alternate;
        if (r.flags & 1024) switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (Ve !== null) {
              var Fe = Ve.memoizedProps, An = Ve.memoizedState, H = r.stateNode, U = H.getSnapshotBeforeUpdate(r.elementType === r.type ? Fe : Ti(r.type, Fe), An);
              H.__reactInternalSnapshotBeforeUpdate = U;
            }
            break;
          case 3:
            var B = r.stateNode.containerInfo;
            B.nodeType === 1 ? B.textContent = "" : B.nodeType === 9 && B.documentElement && B.removeChild(B.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(c(163));
        }
      } catch (me) {
        kn(r, r.return, me);
      }
      if (n = r.sibling, n !== null) {
        n.return = r.return, Pe = n;
        break;
      }
      Pe = r.return;
    }
    return Ve = Lp, Lp = !1, Ve;
  }
  function ru(n, r, s) {
    var f = r.updateQueue;
    if (f = f !== null ? f.lastEffect : null, f !== null) {
      var m = f = f.next;
      do {
        if ((m.tag & n) === n) {
          var y = m.destroy;
          m.destroy = void 0, y !== void 0 && Ap(r, s, y);
        }
        m = m.next;
      } while (m !== f);
    }
  }
  function zf(n, r) {
    if (r = r.updateQueue, r = r !== null ? r.lastEffect : null, r !== null) {
      var s = r = r.next;
      do {
        if ((s.tag & n) === n) {
          var f = s.create;
          s.destroy = f();
        }
        s = s.next;
      } while (s !== r);
    }
  }
  function uc(n) {
    var r = n.ref;
    if (r !== null) {
      var s = n.stateNode;
      switch (n.tag) {
        case 5:
          n = s;
          break;
        default:
          n = s;
      }
      typeof r == "function" ? r(n) : r.current = n;
    }
  }
  function cc(n) {
    var r = n.alternate;
    r !== null && (n.alternate = null, cc(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[Oa], delete r[Gu], delete r[Ku], delete r[Bs], delete r[zg])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
  }
  function vo(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function yo(n) {
    e: for (; ; ) {
      for (; n.sibling === null; ) {
        if (n.return === null || vo(n.return)) return null;
        n = n.return;
      }
      for (n.sibling.return = n.return, n = n.sibling; n.tag !== 5 && n.tag !== 6 && n.tag !== 18; ) {
        if (n.flags & 2 || n.child === null || n.tag === 4) continue e;
        n.child.return = n, n = n.child;
      }
      if (!(n.flags & 2)) return n.stateNode;
    }
  }
  function Ba(n, r, s) {
    var f = n.tag;
    if (f === 5 || f === 6) n = n.stateNode, r ? s.nodeType === 8 ? s.parentNode.insertBefore(n, r) : s.insertBefore(n, r) : (s.nodeType === 8 ? (r = s.parentNode, r.insertBefore(n, s)) : (r = s, r.appendChild(n)), s = s._reactRootContainer, s != null || r.onclick !== null || (r.onclick = Xo));
    else if (f !== 4 && (n = n.child, n !== null)) for (Ba(n, r, s), n = n.sibling; n !== null; ) Ba(n, r, s), n = n.sibling;
  }
  function Jl(n, r, s) {
    var f = n.tag;
    if (f === 5 || f === 6) n = n.stateNode, r ? s.insertBefore(n, r) : s.appendChild(n);
    else if (f !== 4 && (n = n.child, n !== null)) for (Jl(n, r, s), n = n.sibling; n !== null; ) Jl(n, r, s), n = n.sibling;
  }
  var On = null, ar = !1;
  function ol(n, r, s) {
    for (s = s.child; s !== null; ) ov(n, r, s), s = s.sibling;
  }
  function ov(n, r, s) {
    if (ei && typeof ei.onCommitFiberUnmount == "function") try {
      ei.onCommitFiberUnmount(Bo, s);
    } catch {
    }
    switch (s.tag) {
      case 5:
        Lr || Zl(s, r);
      case 6:
        var f = On, m = ar;
        On = null, ol(n, r, s), On = f, ar = m, On !== null && (ar ? (n = On, s = s.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(s) : n.removeChild(s)) : On.removeChild(s.stateNode));
        break;
      case 18:
        On !== null && (ar ? (n = On, s = s.stateNode, n.nodeType === 8 ? js(n.parentNode, s) : n.nodeType === 1 && js(n, s), ua(n)) : js(On, s.stateNode));
        break;
      case 4:
        f = On, m = ar, On = s.stateNode.containerInfo, ar = !0, ol(n, r, s), On = f, ar = m;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Lr && (f = s.updateQueue, f !== null && (f = f.lastEffect, f !== null))) {
          m = f = f.next;
          do {
            var y = m, w = y.destroy;
            y = y.tag, w !== void 0 && (y & 2 || y & 4) && Ap(s, r, w), m = m.next;
          } while (m !== f);
        }
        ol(n, r, s);
        break;
      case 1:
        if (!Lr && (Zl(s, r), f = s.stateNode, typeof f.componentWillUnmount == "function")) try {
          f.props = s.memoizedProps, f.state = s.memoizedState, f.componentWillUnmount();
        } catch (O) {
          kn(s, r, O);
        }
        ol(n, r, s);
        break;
      case 21:
        ol(n, r, s);
        break;
      case 22:
        s.mode & 1 ? (Lr = (f = Lr) || s.memoizedState !== null, ol(n, r, s), Lr = f) : ol(n, r, s);
        break;
      default:
        ol(n, r, s);
    }
  }
  function lv(n) {
    var r = n.updateQueue;
    if (r !== null) {
      n.updateQueue = null;
      var s = n.stateNode;
      s === null && (s = n.stateNode = new Op()), r.forEach(function(f) {
        var m = Gg.bind(null, n, f);
        s.has(f) || (s.add(f), f.then(m, m));
      });
    }
  }
  function Wi(n, r) {
    var s = r.deletions;
    if (s !== null) for (var f = 0; f < s.length; f++) {
      var m = s[f];
      try {
        var y = n, w = r, O = w;
        e: for (; O !== null; ) {
          switch (O.tag) {
            case 5:
              On = O.stateNode, ar = !1;
              break e;
            case 3:
              On = O.stateNode.containerInfo, ar = !0;
              break e;
            case 4:
              On = O.stateNode.containerInfo, ar = !0;
              break e;
          }
          O = O.return;
        }
        if (On === null) throw Error(c(160));
        ov(y, w, m), On = null, ar = !1;
        var V = m.alternate;
        V !== null && (V.return = null), m.return = null;
      } catch (Q) {
        kn(m, r, Q);
      }
    }
    if (r.subtreeFlags & 12854) for (r = r.child; r !== null; ) iu(r, n), r = r.sibling;
  }
  function iu(n, r) {
    var s = n.alternate, f = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (Wi(r, n), Ha(n), f & 4) {
          try {
            ru(3, n, n.return), zf(3, n);
          } catch (Fe) {
            kn(n, n.return, Fe);
          }
          try {
            ru(5, n, n.return);
          } catch (Fe) {
            kn(n, n.return, Fe);
          }
        }
        break;
      case 1:
        Wi(r, n), Ha(n), f & 512 && s !== null && Zl(s, s.return);
        break;
      case 5:
        if (Wi(r, n), Ha(n), f & 512 && s !== null && Zl(s, s.return), n.flags & 32) {
          var m = n.stateNode;
          try {
            ge(m, "");
          } catch (Fe) {
            kn(n, n.return, Fe);
          }
        }
        if (f & 4 && (m = n.stateNode, m != null)) {
          var y = n.memoizedProps, w = s !== null ? s.memoizedProps : y, O = n.type, V = n.updateQueue;
          if (n.updateQueue = null, V !== null) try {
            O === "input" && y.type === "radio" && y.name != null && er(m, y), nr(O, w);
            var Q = nr(O, y);
            for (w = 0; w < V.length; w += 2) {
              var fe = V[w], de = V[w + 1];
              fe === "style" ? an(m, de) : fe === "dangerouslySetInnerHTML" ? ba(m, de) : fe === "children" ? ge(m, de) : ne(m, fe, de, Q);
            }
            switch (O) {
              case "input":
                Jr(m, y);
                break;
              case "textarea":
                ra(m, y);
                break;
              case "select":
                var se = m._wrapperState.wasMultiple;
                m._wrapperState.wasMultiple = !!y.multiple;
                var Me = y.value;
                Me != null ? _n(m, !!y.multiple, Me, !1) : se !== !!y.multiple && (y.defaultValue != null ? _n(
                  m,
                  !!y.multiple,
                  y.defaultValue,
                  !0
                ) : _n(m, !!y.multiple, y.multiple ? [] : "", !1));
            }
            m[Gu] = y;
          } catch (Fe) {
            kn(n, n.return, Fe);
          }
        }
        break;
      case 6:
        if (Wi(r, n), Ha(n), f & 4) {
          if (n.stateNode === null) throw Error(c(162));
          m = n.stateNode, y = n.memoizedProps;
          try {
            m.nodeValue = y;
          } catch (Fe) {
            kn(n, n.return, Fe);
          }
        }
        break;
      case 3:
        if (Wi(r, n), Ha(n), f & 4 && s !== null && s.memoizedState.isDehydrated) try {
          ua(r.containerInfo);
        } catch (Fe) {
          kn(n, n.return, Fe);
        }
        break;
      case 4:
        Wi(r, n), Ha(n);
        break;
      case 13:
        Wi(r, n), Ha(n), m = n.child, m.flags & 8192 && (y = m.memoizedState !== null, m.stateNode.isHidden = y, !y || m.alternate !== null && m.alternate.memoizedState !== null || (Vp = Gt())), f & 4 && lv(n);
        break;
      case 22:
        if (fe = s !== null && s.memoizedState !== null, n.mode & 1 ? (Lr = (Q = Lr) || fe, Wi(r, n), Lr = Q) : Wi(r, n), Ha(n), f & 8192) {
          if (Q = n.memoizedState !== null, (n.stateNode.isHidden = Q) && !fe && n.mode & 1) for (Pe = n, fe = n.child; fe !== null; ) {
            for (de = Pe = fe; Pe !== null; ) {
              switch (se = Pe, Me = se.child, se.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  ru(4, se, se.return);
                  break;
                case 1:
                  Zl(se, se.return);
                  var Ve = se.stateNode;
                  if (typeof Ve.componentWillUnmount == "function") {
                    f = se, s = se.return;
                    try {
                      r = f, Ve.props = r.memoizedProps, Ve.state = r.memoizedState, Ve.componentWillUnmount();
                    } catch (Fe) {
                      kn(f, s, Fe);
                    }
                  }
                  break;
                case 5:
                  Zl(se, se.return);
                  break;
                case 22:
                  if (se.memoizedState !== null) {
                    Np(de);
                    continue;
                  }
              }
              Me !== null ? (Me.return = se, Pe = Me) : Np(de);
            }
            fe = fe.sibling;
          }
          e: for (fe = null, de = n; ; ) {
            if (de.tag === 5) {
              if (fe === null) {
                fe = de;
                try {
                  m = de.stateNode, Q ? (y = m.style, typeof y.setProperty == "function" ? y.setProperty("display", "none", "important") : y.display = "none") : (O = de.stateNode, V = de.memoizedProps.style, w = V != null && V.hasOwnProperty("display") ? V.display : null, O.style.display = Yt("display", w));
                } catch (Fe) {
                  kn(n, n.return, Fe);
                }
              }
            } else if (de.tag === 6) {
              if (fe === null) try {
                de.stateNode.nodeValue = Q ? "" : de.memoizedProps;
              } catch (Fe) {
                kn(n, n.return, Fe);
              }
            } else if ((de.tag !== 22 && de.tag !== 23 || de.memoizedState === null || de === n) && de.child !== null) {
              de.child.return = de, de = de.child;
              continue;
            }
            if (de === n) break e;
            for (; de.sibling === null; ) {
              if (de.return === null || de.return === n) break e;
              fe === de && (fe = null), de = de.return;
            }
            fe === de && (fe = null), de.sibling.return = de.return, de = de.sibling;
          }
        }
        break;
      case 19:
        Wi(r, n), Ha(n), f & 4 && lv(n);
        break;
      case 21:
        break;
      default:
        Wi(
          r,
          n
        ), Ha(n);
    }
  }
  function Ha(n) {
    var r = n.flags;
    if (r & 2) {
      try {
        e: {
          for (var s = n.return; s !== null; ) {
            if (vo(s)) {
              var f = s;
              break e;
            }
            s = s.return;
          }
          throw Error(c(160));
        }
        switch (f.tag) {
          case 5:
            var m = f.stateNode;
            f.flags & 32 && (ge(m, ""), f.flags &= -33);
            var y = yo(n);
            Jl(n, y, m);
            break;
          case 3:
          case 4:
            var w = f.stateNode.containerInfo, O = yo(n);
            Ba(n, O, w);
            break;
          default:
            throw Error(c(161));
        }
      } catch (V) {
        kn(n, n.return, V);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function sv(n, r, s) {
    Pe = n, uv(n);
  }
  function uv(n, r, s) {
    for (var f = (n.mode & 1) !== 0; Pe !== null; ) {
      var m = Pe, y = m.child;
      if (m.tag === 22 && f) {
        var w = m.memoizedState !== null || Vf;
        if (!w) {
          var O = m.alternate, V = O !== null && O.memoizedState !== null || Lr;
          O = Vf;
          var Q = Lr;
          if (Vf = w, (Lr = V) && !Q) for (Pe = m; Pe !== null; ) w = Pe, V = w.child, w.tag === 22 && w.memoizedState !== null ? cv(m) : V !== null ? (V.return = w, Pe = V) : cv(m);
          for (; y !== null; ) Pe = y, uv(y), y = y.sibling;
          Pe = m, Vf = O, Lr = Q;
        }
        fc(n);
      } else m.subtreeFlags & 8772 && y !== null ? (y.return = m, Pe = y) : fc(n);
    }
  }
  function fc(n) {
    for (; Pe !== null; ) {
      var r = Pe;
      if (r.flags & 8772) {
        var s = r.alternate;
        try {
          if (r.flags & 8772) switch (r.tag) {
            case 0:
            case 11:
            case 15:
              Lr || zf(5, r);
              break;
            case 1:
              var f = r.stateNode;
              if (r.flags & 4 && !Lr) if (s === null) f.componentDidMount();
              else {
                var m = r.elementType === r.type ? s.memoizedProps : Ti(r.type, s.memoizedProps);
                f.componentDidUpdate(m, s.memoizedState, f.__reactInternalSnapshotBeforeUpdate);
              }
              var y = r.updateQueue;
              y !== null && Hm(r, y, f);
              break;
            case 3:
              var w = r.updateQueue;
              if (w !== null) {
                if (s = null, r.child !== null) switch (r.child.tag) {
                  case 5:
                    s = r.child.stateNode;
                    break;
                  case 1:
                    s = r.child.stateNode;
                }
                Hm(r, w, s);
              }
              break;
            case 5:
              var O = r.stateNode;
              if (s === null && r.flags & 4) {
                s = O;
                var V = r.memoizedProps;
                switch (r.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    V.autoFocus && s.focus();
                    break;
                  case "img":
                    V.src && (s.src = V.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (r.memoizedState === null) {
                var Q = r.alternate;
                if (Q !== null) {
                  var fe = Q.memoizedState;
                  if (fe !== null) {
                    var de = fe.dehydrated;
                    de !== null && ua(de);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(c(163));
          }
          Lr || r.flags & 512 && uc(r);
        } catch (se) {
          kn(r, r.return, se);
        }
      }
      if (r === n) {
        Pe = null;
        break;
      }
      if (s = r.sibling, s !== null) {
        s.return = r.return, Pe = s;
        break;
      }
      Pe = r.return;
    }
  }
  function Np(n) {
    for (; Pe !== null; ) {
      var r = Pe;
      if (r === n) {
        Pe = null;
        break;
      }
      var s = r.sibling;
      if (s !== null) {
        s.return = r.return, Pe = s;
        break;
      }
      Pe = r.return;
    }
  }
  function cv(n) {
    for (; Pe !== null; ) {
      var r = Pe;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var s = r.return;
            try {
              zf(4, r);
            } catch (V) {
              kn(r, s, V);
            }
            break;
          case 1:
            var f = r.stateNode;
            if (typeof f.componentDidMount == "function") {
              var m = r.return;
              try {
                f.componentDidMount();
              } catch (V) {
                kn(r, m, V);
              }
            }
            var y = r.return;
            try {
              uc(r);
            } catch (V) {
              kn(r, y, V);
            }
            break;
          case 5:
            var w = r.return;
            try {
              uc(r);
            } catch (V) {
              kn(r, w, V);
            }
        }
      } catch (V) {
        kn(r, r.return, V);
      }
      if (r === n) {
        Pe = null;
        break;
      }
      var O = r.sibling;
      if (O !== null) {
        O.return = r.return, Pe = O;
        break;
      }
      Pe = r.return;
    }
  }
  var dc = Math.ceil, ll = Se.ReactCurrentDispatcher, sl = Se.ReactCurrentOwner, ui = Se.ReactCurrentBatchConfig, Ut = 0, or = null, Hn = null, mr = 0, wi = 0, ul = Ui(0), qn = 0, cl = null, go = 0, pc = 0, Pp = 0, hc = null, ci = null, Vp = 0, Ia = 1 / 0, va = null, fl = !1, zp = null, dl = null, mc = !1, So = null, es = 0, pl = 0, Uf = null, Nr = -1, Co = 0;
  function vr() {
    return Ut & 6 ? Gt() : Nr !== -1 ? Nr : Nr = Gt();
  }
  function Gi(n) {
    return n.mode & 1 ? Ut & 2 && mr !== 0 ? mr & -mr : Ug.transition !== null ? (Co === 0 && (Co = ws()), Co) : (n = Ft, n !== 0 || (n = window.event, n = n === void 0 ? 16 : As(n.type)), n) : 1;
  }
  function ya(n, r, s, f) {
    if (50 < pl) throw pl = 0, Uf = null, Error(c(185));
    no(n, s, f), (!(Ut & 2) || n !== or) && (n === or && (!(Ut & 2) && (pc |= s), qn === 4 && Eo(n, mr)), Pr(n, f), s === 1 && Ut === 0 && !(r.mode & 1) && (Ia = Gt() + 500, Is && La()));
  }
  function Pr(n, r) {
    var s = n.callbackNode;
    Ol(n, r);
    var f = sa(n, n === or ? mr : 0);
    if (f === 0) s !== null && oa(s), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = f & -f, n.callbackPriority !== r) {
      if (s != null && oa(s), r === 1) n.tag === 0 ? Zo(fv.bind(null, n)) : ff(fv.bind(null, n)), Fs(function() {
        !(Ut & 6) && La();
      }), s = null;
      else {
        switch (ks(f)) {
          case 1:
            s = to;
            break;
          case 4:
            s = Ou;
            break;
          case 16:
            s = Ml;
            break;
          case 536870912:
            s = Ts;
            break;
          default:
            s = Ml;
        }
        s = Cv(s, Ff.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = s;
    }
  }
  function Ff(n, r) {
    if (Nr = -1, Co = 0, Ut & 6) throw Error(c(327));
    var s = n.callbackNode;
    if (au() && n.callbackNode !== s) return null;
    var f = sa(n, n === or ? mr : 0);
    if (f === 0) return null;
    if (f & 30 || f & n.expiredLanes || r) r = Bf(n, f);
    else {
      r = f;
      var m = Ut;
      Ut |= 2;
      var y = pv();
      (or !== n || mr !== r) && (va = null, Ia = Gt() + 500, rs(n, r));
      do
        try {
          Yg();
          break;
        } catch (O) {
          dv(n, O);
        }
      while (!0);
      we(), ll.current = y, Ut = m, Hn !== null ? r = 0 : (or = null, mr = 0, r = qn);
    }
    if (r !== 0) {
      if (r === 2 && (m = Io(n), m !== 0 && (f = m, r = ts(n, m))), r === 1) throw s = cl, rs(n, 0), Eo(n, f), Pr(n, Gt()), s;
      if (r === 6) Eo(n, f);
      else {
        if (m = n.current.alternate, !(f & 30) && !jf(m) && (r = Bf(n, f), r === 2 && (y = Io(n), y !== 0 && (f = y, r = ts(n, y))), r === 1)) throw s = cl, rs(n, 0), Eo(n, f), Pr(n, Gt()), s;
        switch (n.finishedWork = m, n.finishedLanes = f, r) {
          case 0:
          case 1:
            throw Error(c(345));
          case 2:
            is(n, ci, va);
            break;
          case 3:
            if (Eo(n, f), (f & 130023424) === f && (r = Vp + 500 - Gt(), 10 < r)) {
              if (sa(n, 0) !== 0) break;
              if (m = n.suspendedLanes, (m & f) !== f) {
                vr(), n.pingedLanes |= n.suspendedLanes & m;
                break;
              }
              n.timeoutHandle = sf(is.bind(null, n, ci, va), r);
              break;
            }
            is(n, ci, va);
            break;
          case 4:
            if (Eo(n, f), (f & 4194240) === f) break;
            for (r = n.eventTimes, m = -1; 0 < f; ) {
              var w = 31 - Fr(f);
              y = 1 << w, w = r[w], w > m && (m = w), f &= ~y;
            }
            if (f = m, f = Gt() - f, f = (120 > f ? 120 : 480 > f ? 480 : 1080 > f ? 1080 : 1920 > f ? 1920 : 3e3 > f ? 3e3 : 4320 > f ? 4320 : 1960 * dc(f / 1960)) - f, 10 < f) {
              n.timeoutHandle = sf(is.bind(null, n, ci, va), f);
              break;
            }
            is(n, ci, va);
            break;
          case 5:
            is(n, ci, va);
            break;
          default:
            throw Error(c(329));
        }
      }
    }
    return Pr(n, Gt()), n.callbackNode === s ? Ff.bind(null, n) : null;
  }
  function ts(n, r) {
    var s = hc;
    return n.current.memoizedState.isDehydrated && (rs(n, r).flags |= 256), n = Bf(n, r), n !== 2 && (r = ci, ci = s, r !== null && Up(r)), n;
  }
  function Up(n) {
    ci === null ? ci = n : ci.push.apply(ci, n);
  }
  function jf(n) {
    for (var r = n; ; ) {
      if (r.flags & 16384) {
        var s = r.updateQueue;
        if (s !== null && (s = s.stores, s !== null)) for (var f = 0; f < s.length; f++) {
          var m = s[f], y = m.getSnapshot;
          m = m.value;
          try {
            if (!fa(y(), m)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (s = r.child, r.subtreeFlags & 16384 && s !== null) s.return = r, r = s;
      else {
        if (r === n) break;
        for (; r.sibling === null; ) {
          if (r.return === null || r.return === n) return !0;
          r = r.return;
        }
        r.sibling.return = r.return, r = r.sibling;
      }
    }
    return !0;
  }
  function Eo(n, r) {
    for (r &= ~Pp, r &= ~pc, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var s = 31 - Fr(r), f = 1 << s;
      n[s] = -1, r &= ~f;
    }
  }
  function fv(n) {
    if (Ut & 6) throw Error(c(327));
    au();
    var r = sa(n, 0);
    if (!(r & 1)) return Pr(n, Gt()), null;
    var s = Bf(n, r);
    if (n.tag !== 0 && s === 2) {
      var f = Io(n);
      f !== 0 && (r = f, s = ts(n, f));
    }
    if (s === 1) throw s = cl, rs(n, 0), Eo(n, r), Pr(n, Gt()), s;
    if (s === 6) throw Error(c(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, is(n, ci, va), Pr(n, Gt()), null;
  }
  function Fp(n, r) {
    var s = Ut;
    Ut |= 1;
    try {
      return n(r);
    } finally {
      Ut = s, Ut === 0 && (Ia = Gt() + 500, Is && La());
    }
  }
  function ns(n) {
    So !== null && So.tag === 0 && !(Ut & 6) && au();
    var r = Ut;
    Ut |= 1;
    var s = ui.transition, f = Ft;
    try {
      if (ui.transition = null, Ft = 1, n) return n();
    } finally {
      Ft = f, ui.transition = s, Ut = r, !(Ut & 6) && La();
    }
  }
  function vc() {
    wi = ul.current, sn(ul);
  }
  function rs(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var s = n.timeoutHandle;
    if (s !== -1 && (n.timeoutHandle = -1, up(s)), Hn !== null) for (s = Hn.return; s !== null; ) {
      var f = s;
      switch (pf(f), f.tag) {
        case 1:
          f = f.type.childContextTypes, f != null && Hs();
          break;
        case 3:
          Lt(), sn(Kn), sn(Rn), Cp();
          break;
        case 5:
          Yi(f);
          break;
        case 4:
          Lt();
          break;
        case 13:
          sn(yn);
          break;
        case 19:
          sn(yn);
          break;
        case 10:
          Bi(f.type._context);
          break;
        case 22:
        case 23:
          vc();
      }
      s = s.return;
    }
    if (or = n, Hn = n = To(n.current, null), mr = wi = r, qn = 0, cl = null, Pp = pc = go = 0, ci = hc = null, Il !== null) {
      for (r = 0; r < Il.length; r++) if (s = Il[r], f = s.interleaved, f !== null) {
        s.interleaved = null;
        var m = f.next, y = s.pending;
        if (y !== null) {
          var w = y.next;
          y.next = m, f.next = w;
        }
        s.pending = f;
      }
      Il = null;
    }
    return n;
  }
  function dv(n, r) {
    do {
      var s = Hn;
      try {
        if (we(), Ws.current = Js, Ua) {
          for (var f = _e.memoizedState; f !== null; ) {
            var m = f.queue;
            m !== null && (m.pending = null), f = f.next;
          }
          Ua = !1;
        }
        if (gn = 0, cn = Sn = _e = null, oi = !1, mo = 0, sl.current = null, s === null || s.return === null) {
          qn = 1, cl = r, Hn = null;
          break;
        }
        e: {
          var y = n, w = s.return, O = s, V = r;
          if (r = mr, O.flags |= 32768, V !== null && typeof V == "object" && typeof V.then == "function") {
            var Q = V, fe = O, de = fe.tag;
            if (!(fe.mode & 1) && (de === 0 || de === 11 || de === 15)) {
              var se = fe.alternate;
              se ? (fe.updateQueue = se.updateQueue, fe.memoizedState = se.memoizedState, fe.lanes = se.lanes) : (fe.updateQueue = null, fe.memoizedState = null);
            }
            var Me = al(w);
            if (Me !== null) {
              Me.flags &= -257, nu(Me, w, O, y, r), Me.mode & 1 && Jm(y, Q, r), r = Me, V = Q;
              var Ve = r.updateQueue;
              if (Ve === null) {
                var Fe = /* @__PURE__ */ new Set();
                Fe.add(V), r.updateQueue = Fe;
              } else Ve.add(V);
              break e;
            } else {
              if (!(r & 1)) {
                Jm(y, Q, r), jp();
                break e;
              }
              V = Error(c(426));
            }
          } else if (vn && O.mode & 1) {
            var An = al(w);
            if (An !== null) {
              !(An.flags & 65536) && (An.flags |= 256), nu(An, w, O, y, r), po(eu(V, O));
              break e;
            }
          }
          y = V = eu(V, O), qn !== 4 && (qn = 2), hc === null ? hc = [y] : hc.push(y), y = w;
          do {
            switch (y.tag) {
              case 3:
                y.flags |= 65536, r &= -r, y.lanes |= r;
                var H = xp(y, V, r);
                Bm(y, H);
                break e;
              case 1:
                O = V;
                var U = y.type, B = y.stateNode;
                if (!(y.flags & 128) && (typeof U.getDerivedStateFromError == "function" || B !== null && typeof B.componentDidCatch == "function" && (dl === null || !dl.has(B)))) {
                  y.flags |= 65536, r &= -r, y.lanes |= r;
                  var me = wp(y, O, r);
                  Bm(y, me);
                  break e;
                }
            }
            y = y.return;
          } while (y !== null);
        }
        vv(s);
      } catch (He) {
        r = He, Hn === s && s !== null && (Hn = s = s.return);
        continue;
      }
      break;
    } while (!0);
  }
  function pv() {
    var n = ll.current;
    return ll.current = Js, n === null ? Js : n;
  }
  function jp() {
    (qn === 0 || qn === 3 || qn === 2) && (qn = 4), or === null || !(go & 268435455) && !(pc & 268435455) || Eo(or, mr);
  }
  function Bf(n, r) {
    var s = Ut;
    Ut |= 2;
    var f = pv();
    (or !== n || mr !== r) && (va = null, rs(n, r));
    do
      try {
        hv();
        break;
      } catch (m) {
        dv(n, m);
      }
    while (!0);
    if (we(), Ut = s, ll.current = f, Hn !== null) throw Error(c(261));
    return or = null, mr = 0, qn;
  }
  function hv() {
    for (; Hn !== null; ) mv(Hn);
  }
  function Yg() {
    for (; Hn !== null && !_l(); ) mv(Hn);
  }
  function mv(n) {
    var r = Sv(n.alternate, n, wi);
    n.memoizedProps = n.pendingProps, r === null ? vv(n) : Hn = r, sl.current = null;
  }
  function vv(n) {
    var r = n;
    do {
      var s = r.alternate;
      if (n = r.return, r.flags & 32768) {
        if (s = av(s, r), s !== null) {
          s.flags &= 32767, Hn = s;
          return;
        }
        if (n !== null) n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          qn = 6, Hn = null;
          return;
        }
      } else if (s = Pf(s, r, wi), s !== null) {
        Hn = s;
        return;
      }
      if (r = r.sibling, r !== null) {
        Hn = r;
        return;
      }
      Hn = r = n;
    } while (r !== null);
    qn === 0 && (qn = 5);
  }
  function is(n, r, s) {
    var f = Ft, m = ui.transition;
    try {
      ui.transition = null, Ft = 1, $g(n, r, s, f);
    } finally {
      ui.transition = m, Ft = f;
    }
    return null;
  }
  function $g(n, r, s, f) {
    do
      au();
    while (So !== null);
    if (Ut & 6) throw Error(c(327));
    s = n.finishedWork;
    var m = n.finishedLanes;
    if (s === null) return null;
    if (n.finishedWork = null, n.finishedLanes = 0, s === n.current) throw Error(c(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var y = s.lanes | s.childLanes;
    if (Hd(n, y), n === or && (Hn = or = null, mr = 0), !(s.subtreeFlags & 2064) && !(s.flags & 2064) || mc || (mc = !0, Cv(Ml, function() {
      return au(), null;
    })), y = (s.flags & 15990) !== 0, s.subtreeFlags & 15990 || y) {
      y = ui.transition, ui.transition = null;
      var w = Ft;
      Ft = 1;
      var O = Ut;
      Ut |= 4, sl.current = null, Ig(n, s), iu(s, n), Ps(jl), Pi = !!Wu, jl = Wu = null, n.current = s, sv(s), Si(), Ut = O, Ft = w, ui.transition = y;
    } else n.current = s;
    if (mc && (mc = !1, So = n, es = m), y = n.pendingLanes, y === 0 && (dl = null), Au(s.stateNode), Pr(n, Gt()), r !== null) for (f = n.onRecoverableError, s = 0; s < r.length; s++) m = r[s], f(m.value, { componentStack: m.stack, digest: m.digest });
    if (fl) throw fl = !1, n = zp, zp = null, n;
    return es & 1 && n.tag !== 0 && au(), y = n.pendingLanes, y & 1 ? n === Uf ? pl++ : (pl = 0, Uf = n) : pl = 0, La(), null;
  }
  function au() {
    if (So !== null) {
      var n = ks(es), r = ui.transition, s = Ft;
      try {
        if (ui.transition = null, Ft = 16 > n ? 16 : n, So === null) var f = !1;
        else {
          if (n = So, So = null, es = 0, Ut & 6) throw Error(c(331));
          var m = Ut;
          for (Ut |= 4, Pe = n.current; Pe !== null; ) {
            var y = Pe, w = y.child;
            if (Pe.flags & 16) {
              var O = y.deletions;
              if (O !== null) {
                for (var V = 0; V < O.length; V++) {
                  var Q = O[V];
                  for (Pe = Q; Pe !== null; ) {
                    var fe = Pe;
                    switch (fe.tag) {
                      case 0:
                      case 11:
                      case 15:
                        ru(8, fe, y);
                    }
                    var de = fe.child;
                    if (de !== null) de.return = fe, Pe = de;
                    else for (; Pe !== null; ) {
                      fe = Pe;
                      var se = fe.sibling, Me = fe.return;
                      if (cc(fe), fe === Q) {
                        Pe = null;
                        break;
                      }
                      if (se !== null) {
                        se.return = Me, Pe = se;
                        break;
                      }
                      Pe = Me;
                    }
                  }
                }
                var Ve = y.alternate;
                if (Ve !== null) {
                  var Fe = Ve.child;
                  if (Fe !== null) {
                    Ve.child = null;
                    do {
                      var An = Fe.sibling;
                      Fe.sibling = null, Fe = An;
                    } while (Fe !== null);
                  }
                }
                Pe = y;
              }
            }
            if (y.subtreeFlags & 2064 && w !== null) w.return = y, Pe = w;
            else e: for (; Pe !== null; ) {
              if (y = Pe, y.flags & 2048) switch (y.tag) {
                case 0:
                case 11:
                case 15:
                  ru(9, y, y.return);
              }
              var H = y.sibling;
              if (H !== null) {
                H.return = y.return, Pe = H;
                break e;
              }
              Pe = y.return;
            }
          }
          var U = n.current;
          for (Pe = U; Pe !== null; ) {
            w = Pe;
            var B = w.child;
            if (w.subtreeFlags & 2064 && B !== null) B.return = w, Pe = B;
            else e: for (w = U; Pe !== null; ) {
              if (O = Pe, O.flags & 2048) try {
                switch (O.tag) {
                  case 0:
                  case 11:
                  case 15:
                    zf(9, O);
                }
              } catch (He) {
                kn(O, O.return, He);
              }
              if (O === w) {
                Pe = null;
                break e;
              }
              var me = O.sibling;
              if (me !== null) {
                me.return = O.return, Pe = me;
                break e;
              }
              Pe = O.return;
            }
          }
          if (Ut = m, La(), ei && typeof ei.onPostCommitFiberRoot == "function") try {
            ei.onPostCommitFiberRoot(Bo, n);
          } catch {
          }
          f = !0;
        }
        return f;
      } finally {
        Ft = s, ui.transition = r;
      }
    }
    return !1;
  }
  function Hf(n, r, s) {
    r = eu(s, r), r = xp(n, r, 1), n = Ii(n, r, 1), r = vr(), n !== null && (no(n, 1, r), Pr(n, r));
  }
  function kn(n, r, s) {
    if (n.tag === 3) Hf(n, n, s);
    else for (; r !== null; ) {
      if (r.tag === 3) {
        Hf(r, n, s);
        break;
      } else if (r.tag === 1) {
        var f = r.stateNode;
        if (typeof r.type.getDerivedStateFromError == "function" || typeof f.componentDidCatch == "function" && (dl === null || !dl.has(f))) {
          n = eu(s, n), n = wp(r, n, 1), r = Ii(r, n, 1), n = vr(), r !== null && (no(r, 1, n), Pr(r, n));
          break;
        }
      }
      r = r.return;
    }
  }
  function Wg(n, r, s) {
    var f = n.pingCache;
    f !== null && f.delete(r), r = vr(), n.pingedLanes |= n.suspendedLanes & s, or === n && (mr & s) === s && (qn === 4 || qn === 3 && (mr & 130023424) === mr && 500 > Gt() - Vp ? rs(n, 0) : Pp |= s), Pr(n, r);
  }
  function yv(n, r) {
    r === 0 && (n.mode & 1 ? (r = Ci, Ci <<= 1, !(Ci & 130023424) && (Ci = 4194304)) : r = 1);
    var s = vr();
    n = un(n, r), n !== null && (no(n, r, s), Pr(n, s));
  }
  function gv(n) {
    var r = n.memoizedState, s = 0;
    r !== null && (s = r.retryLane), yv(n, s);
  }
  function Gg(n, r) {
    var s = 0;
    switch (n.tag) {
      case 13:
        var f = n.stateNode, m = n.memoizedState;
        m !== null && (s = m.retryLane);
        break;
      case 19:
        f = n.stateNode;
        break;
      default:
        throw Error(c(314));
    }
    f !== null && f.delete(r), yv(n, s);
  }
  var Sv;
  Sv = function(n, r, s) {
    if (n !== null) if (n.memoizedProps !== r.pendingProps || Kn.current) Ar = !0;
    else {
      if (!(n.lanes & s) && !(r.flags & 128)) return Ar = !1, ma(n, r, s);
      Ar = !!(n.flags & 131072);
    }
    else Ar = !1, vn && r.flags & 1048576 && zm(r, fo, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var f = r.type;
        Xl(n, r), n = r.pendingProps;
        var m = ri(r, Rn.current);
        Ys(r, s), m = ec(null, r, f, n, m, s);
        var y = tc();
        return r.flags |= 1, typeof m == "object" && m !== null && typeof m.render == "function" && m.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, Fn(f) ? (y = !0, rr(r)) : y = !1, r.memoizedState = m.state !== null && m.state !== void 0 ? m.state : null, hp(r), m.updater = gf, r.stateNode = m, m._reactInternals = r, gp(r, f, n, s), r = Ql(null, r, f, !0, y, s)) : (r.tag = 0, vn && y && df(r), rn(null, r, m, s), r = r.child), r;
      case 16:
        f = r.elementType;
        e: {
          switch (Xl(n, r), n = r.pendingProps, m = f._init, f = m(f._payload), r.type = f, m = r.tag = Qg(f), n = Ti(f, n), m) {
            case 0:
              r = kp(null, r, f, n, s);
              break e;
            case 1:
              r = Lf(null, r, f, n, s);
              break e;
            case 11:
              r = Kl(null, r, f, n, s);
              break e;
            case 14:
              r = vt(null, r, f, Ti(f.type, n), s);
              break e;
          }
          throw Error(c(
            306,
            f,
            ""
          ));
        }
        return r;
      case 0:
        return f = r.type, m = r.pendingProps, m = r.elementType === f ? m : Ti(f, m), kp(n, r, f, m, s);
      case 1:
        return f = r.type, m = r.pendingProps, m = r.elementType === f ? m : Ti(f, m), Lf(n, r, f, m, s);
      case 3:
        e: {
          if (ev(r), n === null) throw Error(c(387));
          f = r.pendingProps, y = r.memoizedState, m = y.element, jm(n, r), yf(r, f, null, s);
          var w = r.memoizedState;
          if (f = w.element, y.isDehydrated) if (y = { element: f, isDehydrated: !1, cache: w.cache, pendingSuspenseBoundaries: w.pendingSuspenseBoundaries, transitions: w.transitions }, r.updateQueue.baseState = y, r.memoizedState = y, r.flags & 256) {
            m = eu(Error(c(423)), r), r = Dp(n, r, f, s, m);
            break e;
          } else if (f !== m) {
            m = eu(Error(c(424)), r), r = Dp(n, r, f, s, m);
            break e;
          } else for (ai = Ma(r.stateNode.containerInfo.firstChild), ii = r, vn = !0, ji = null, s = Gm(r, null, f, s), r.child = s; s; ) s.flags = s.flags & -3 | 4096, s = s.sibling;
          else {
            if (nl(), f === m) {
              r = xi(n, r, s);
              break e;
            }
            rn(n, r, f, s);
          }
          r = r.child;
        }
        return r;
      case 5:
        return Mn(r), n === null && dp(r), f = r.type, m = r.pendingProps, y = n !== null ? n.memoizedProps : null, w = m.children, lf(f, m) ? w = null : y !== null && lf(f, y) && (r.flags |= 32), Hg(n, r), rn(n, r, w, s), r.child;
      case 6:
        return n === null && dp(r), null;
      case 13:
        return tv(n, r, s);
      case 4:
        return wt(r, r.stateNode.containerInfo), f = r.pendingProps, n === null ? r.child = Yl(r, null, f, s) : rn(n, r, f, s), r.child;
      case 11:
        return f = r.type, m = r.pendingProps, m = r.elementType === f ? m : Ti(f, m), Kl(n, r, f, m, s);
      case 7:
        return rn(n, r, r.pendingProps, s), r.child;
      case 8:
        return rn(n, r, r.pendingProps.children, s), r.child;
      case 12:
        return rn(n, r, r.pendingProps.children, s), r.child;
      case 10:
        e: {
          if (f = r.type._context, m = r.pendingProps, y = r.memoizedProps, w = m.value, Ge(mf, f._currentValue), f._currentValue = w, y !== null) if (fa(y.value, w)) {
            if (y.children === m.children && !Kn.current) {
              r = xi(n, r, s);
              break e;
            }
          } else for (y = r.child, y !== null && (y.return = r); y !== null; ) {
            var O = y.dependencies;
            if (O !== null) {
              w = y.child;
              for (var V = O.firstContext; V !== null; ) {
                if (V.context === f) {
                  if (y.tag === 1) {
                    V = Va(-1, s & -s), V.tag = 2;
                    var Q = y.updateQueue;
                    if (Q !== null) {
                      Q = Q.shared;
                      var fe = Q.pending;
                      fe === null ? V.next = V : (V.next = fe.next, fe.next = V), Q.pending = V;
                    }
                  }
                  y.lanes |= s, V = y.alternate, V !== null && (V.lanes |= s), bi(
                    y.return,
                    s,
                    r
                  ), O.lanes |= s;
                  break;
                }
                V = V.next;
              }
            } else if (y.tag === 10) w = y.type === r.type ? null : y.child;
            else if (y.tag === 18) {
              if (w = y.return, w === null) throw Error(c(341));
              w.lanes |= s, O = w.alternate, O !== null && (O.lanes |= s), bi(w, s, r), w = y.sibling;
            } else w = y.child;
            if (w !== null) w.return = y;
            else for (w = y; w !== null; ) {
              if (w === r) {
                w = null;
                break;
              }
              if (y = w.sibling, y !== null) {
                y.return = w.return, w = y;
                break;
              }
              w = w.return;
            }
            y = w;
          }
          rn(n, r, m.children, s), r = r.child;
        }
        return r;
      case 9:
        return m = r.type, f = r.pendingProps.children, Ys(r, s), m = Hi(m), f = f(m), r.flags |= 1, rn(n, r, f, s), r.child;
      case 14:
        return f = r.type, m = Ti(f, r.pendingProps), m = Ti(f.type, m), vt(n, r, f, m, s);
      case 15:
        return oc(n, r, r.type, r.pendingProps, s);
      case 17:
        return f = r.type, m = r.pendingProps, m = r.elementType === f ? m : Ti(f, m), Xl(n, r), r.tag = 1, Fn(f) ? (n = !0, rr(r)) : n = !1, Ys(r, s), yp(r, f, m), gp(r, f, m, s), Ql(null, r, f, !0, n, s);
      case 19:
        return ja(n, r, s);
      case 22:
        return Rp(n, r, s);
    }
    throw Error(c(156, r.tag));
  };
  function Cv(n, r) {
    return fr(n, r);
  }
  function Kg(n, r, s, f) {
    this.tag = n, this.key = s, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = f, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Ki(n, r, s, f) {
    return new Kg(n, r, s, f);
  }
  function Bp(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function Qg(n) {
    if (typeof n == "function") return Bp(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === gt) return 11;
      if (n === pt) return 14;
    }
    return 2;
  }
  function To(n, r) {
    var s = n.alternate;
    return s === null ? (s = Ki(n.tag, r, n.key, n.mode), s.elementType = n.elementType, s.type = n.type, s.stateNode = n.stateNode, s.alternate = n, n.alternate = s) : (s.pendingProps = r, s.type = n.type, s.flags = 0, s.subtreeFlags = 0, s.deletions = null), s.flags = n.flags & 14680064, s.childLanes = n.childLanes, s.lanes = n.lanes, s.child = n.child, s.memoizedProps = n.memoizedProps, s.memoizedState = n.memoizedState, s.updateQueue = n.updateQueue, r = n.dependencies, s.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, s.sibling = n.sibling, s.index = n.index, s.ref = n.ref, s;
  }
  function ou(n, r, s, f, m, y) {
    var w = 2;
    if (f = n, typeof n == "function") Bp(n) && (w = 1);
    else if (typeof n == "string") w = 5;
    else e: switch (n) {
      case xe:
        return ga(s.children, m, y, r);
      case le:
        w = 8, m |= 8;
        break;
      case Xe:
        return n = Ki(12, s, r, m | 2), n.elementType = Xe, n.lanes = y, n;
      case We:
        return n = Ki(13, s, r, m), n.elementType = We, n.lanes = y, n;
      case Rt:
        return n = Ki(19, s, r, m), n.elementType = Rt, n.lanes = y, n;
      case ye:
        return If(s, m, y, r);
      default:
        if (typeof n == "object" && n !== null) switch (n.$$typeof) {
          case yt:
            w = 10;
            break e;
          case Mt:
            w = 9;
            break e;
          case gt:
            w = 11;
            break e;
          case pt:
            w = 14;
            break e;
          case ht:
            w = 16, f = null;
            break e;
        }
        throw Error(c(130, n == null ? n : typeof n, ""));
    }
    return r = Ki(w, s, r, m), r.elementType = n, r.type = f, r.lanes = y, r;
  }
  function ga(n, r, s, f) {
    return n = Ki(7, n, f, r), n.lanes = s, n;
  }
  function If(n, r, s, f) {
    return n = Ki(22, n, f, r), n.elementType = ye, n.lanes = s, n.stateNode = { isHidden: !1 }, n;
  }
  function Yf(n, r, s) {
    return n = Ki(6, n, null, r), n.lanes = s, n;
  }
  function $f(n, r, s) {
    return r = Ki(4, n.children !== null ? n.children : [], n.key, r), r.lanes = s, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function Ev(n, r, s, f, m) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Rs(0), this.expirationTimes = Rs(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Rs(0), this.identifierPrefix = f, this.onRecoverableError = m, this.mutableSourceEagerHydrationData = null;
  }
  function Hp(n, r, s, f, m, y, w, O, V) {
    return n = new Ev(n, r, s, O, V), r === 1 ? (r = 1, y === !0 && (r |= 8)) : r = 0, y = Ki(3, null, null, r), n.current = y, y.stateNode = n, y.memoizedState = { element: f, isDehydrated: s, cache: null, transitions: null, pendingSuspenseBoundaries: null }, hp(y), n;
  }
  function Tv(n, r, s) {
    var f = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: Re, key: f == null ? null : "" + f, children: n, containerInfo: r, implementation: s };
  }
  function bv(n) {
    if (!n) return Or;
    n = n._reactInternals;
    e: {
      if (Ct(n) !== n || n.tag !== 1) throw Error(c(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (Fn(r.type)) {
              r = r.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        r = r.return;
      } while (r !== null);
      throw Error(c(171));
    }
    if (n.tag === 1) {
      var s = n.type;
      if (Fn(s)) return Qu(n, s, r);
    }
    return r;
  }
  function xv(n, r, s, f, m, y, w, O, V) {
    return n = Hp(s, f, !0, n, m, y, w, O, V), n.context = bv(null), s = n.current, f = vr(), m = Gi(s), y = Va(f, m), y.callback = r ?? null, Ii(s, y, m), n.current.lanes = m, no(n, m, f), Pr(n, f), n;
  }
  function Wf(n, r, s, f) {
    var m = r.current, y = vr(), w = Gi(m);
    return s = bv(s), r.context === null ? r.context = s : r.pendingContext = s, r = Va(y, w), r.payload = { element: n }, f = f === void 0 ? null : f, f !== null && (r.callback = f), n = Ii(m, r, w), n !== null && (ya(n, m, w, y), ho(n, m, w)), w;
  }
  function yc(n) {
    if (n = n.current, !n.child) return null;
    switch (n.child.tag) {
      case 5:
        return n.child.stateNode;
      default:
        return n.child.stateNode;
    }
  }
  function Ip(n, r) {
    if (n = n.memoizedState, n !== null && n.dehydrated !== null) {
      var s = n.retryLane;
      n.retryLane = s !== 0 && s < r ? s : r;
    }
  }
  function Gf(n, r) {
    Ip(n, r), (n = n.alternate) && Ip(n, r);
  }
  function lu() {
    return null;
  }
  var wv = typeof reportError == "function" ? reportError : function(n) {
    console.error(n);
  };
  function Yp(n) {
    this._internalRoot = n;
  }
  Kf.prototype.render = Yp.prototype.render = function(n) {
    var r = this._internalRoot;
    if (r === null) throw Error(c(409));
    Wf(n, r, null, null);
  }, Kf.prototype.unmount = Yp.prototype.unmount = function() {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var r = n.containerInfo;
      ns(function() {
        Wf(null, n, null, null);
      }), r[uo] = null;
    }
  };
  function Kf(n) {
    this._internalRoot = n;
  }
  Kf.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var r = lt();
      n = { blockedOn: null, target: n, priority: r };
      for (var s = 0; s < Gn.length && r !== 0 && r < Gn[s].priority; s++) ;
      Gn.splice(s, 0, n), s === 0 && Pu(n);
    }
  };
  function $p(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function Qf(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function Rv() {
  }
  function kv(n, r, s, f, m) {
    if (m) {
      if (typeof f == "function") {
        var y = f;
        f = function() {
          var Q = yc(w);
          y.call(Q);
        };
      }
      var w = xv(r, f, n, 0, null, !1, !1, "", Rv);
      return n._reactRootContainer = w, n[uo] = w.current, zs(n.nodeType === 8 ? n.parentNode : n), ns(), w;
    }
    for (; m = n.lastChild; ) n.removeChild(m);
    if (typeof f == "function") {
      var O = f;
      f = function() {
        var Q = yc(V);
        O.call(Q);
      };
    }
    var V = Hp(n, 0, !1, null, null, !1, !1, "", Rv);
    return n._reactRootContainer = V, n[uo] = V.current, zs(n.nodeType === 8 ? n.parentNode : n), ns(function() {
      Wf(r, V, s, f);
    }), V;
  }
  function Xf(n, r, s, f, m) {
    var y = s._reactRootContainer;
    if (y) {
      var w = y;
      if (typeof m == "function") {
        var O = m;
        m = function() {
          var V = yc(w);
          O.call(V);
        };
      }
      Wf(r, w, n, m);
    } else w = kv(s, r, n, m, f);
    return yc(w);
  }
  jt = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var s = la(r.pendingLanes);
          s !== 0 && (ro(r, s | 1), Pr(r, Gt()), !(Ut & 6) && (Ia = Gt() + 500, La()));
        }
        break;
      case 13:
        ns(function() {
          var f = un(n, 1);
          if (f !== null) {
            var m = vr();
            ya(f, n, 1, m);
          }
        }), Gf(n, 1);
    }
  }, Lu = function(n) {
    if (n.tag === 13) {
      var r = un(n, 134217728);
      if (r !== null) {
        var s = vr();
        ya(r, n, 134217728, s);
      }
      Gf(n, 134217728);
    }
  }, Ra = function(n) {
    if (n.tag === 13) {
      var r = Gi(n), s = un(n, r);
      if (s !== null) {
        var f = vr();
        ya(s, n, r, f);
      }
      Gf(n, r);
    }
  }, lt = function() {
    return Ft;
  }, Ds = function(n, r) {
    var s = Ft;
    try {
      return Ft = n, r();
    } finally {
      Ft = s;
    }
  }, Qt = function(n, r, s) {
    switch (r) {
      case "input":
        if (Jr(n, s), r = s.name, s.type === "radio" && r != null) {
          for (s = n; s.parentNode; ) s = s.parentNode;
          for (s = s.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < s.length; r++) {
            var f = s[r];
            if (f !== n && f.form === n.form) {
              var m = Tn(f);
              if (!m) throw Error(c(90));
              Vn(f), Jr(f, m);
            }
          }
        }
        break;
      case "textarea":
        ra(n, s);
        break;
      case "select":
        r = s.value, r != null && _n(n, !!s.multiple, r, !1);
    }
  }, kl = Fp, Uo = ns;
  var Xg = { usingClientEntryPoint: !1, Events: [Qe, da, Tn, eo, Rl, Fp] }, su = { findFiberByHostInstance: Bl, bundleType: 0, version: "18.2.0", rendererPackageName: "react-dom" }, gc = { bundleType: su.bundleType, version: su.version, rendererPackageName: su.rendererPackageName, rendererConfig: su.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: Se.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = tn(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: su.findFiberByHostInstance || lu, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.2.0-next-9e3b772b8-20220608" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var hl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!hl.isDisabled && hl.supportsFiber) try {
      Bo = hl.inject(gc), ei = hl;
    } catch {
    }
  }
  return ea.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Xg, ea.createPortal = function(n, r) {
    var s = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!$p(r)) throw Error(c(200));
    return Tv(n, r, null, s);
  }, ea.createRoot = function(n, r) {
    if (!$p(n)) throw Error(c(299));
    var s = !1, f = "", m = wv;
    return r != null && (r.unstable_strictMode === !0 && (s = !0), r.identifierPrefix !== void 0 && (f = r.identifierPrefix), r.onRecoverableError !== void 0 && (m = r.onRecoverableError)), r = Hp(n, 1, !1, null, null, s, !1, f, m), n[uo] = r.current, zs(n.nodeType === 8 ? n.parentNode : n), new Yp(r);
  }, ea.findDOMNode = function(n) {
    if (n == null) return null;
    if (n.nodeType === 1) return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(c(188)) : (n = Object.keys(n).join(","), Error(c(268, n)));
    return n = tn(r), n = n === null ? null : n.stateNode, n;
  }, ea.flushSync = function(n) {
    return ns(n);
  }, ea.hydrate = function(n, r, s) {
    if (!Qf(r)) throw Error(c(200));
    return Xf(null, n, r, !0, s);
  }, ea.hydrateRoot = function(n, r, s) {
    if (!$p(n)) throw Error(c(405));
    var f = s != null && s.hydratedSources || null, m = !1, y = "", w = wv;
    if (s != null && (s.unstable_strictMode === !0 && (m = !0), s.identifierPrefix !== void 0 && (y = s.identifierPrefix), s.onRecoverableError !== void 0 && (w = s.onRecoverableError)), r = xv(r, null, n, 1, s ?? null, m, !1, y, w), n[uo] = r.current, zs(n), f) for (n = 0; n < f.length; n++) s = f[n], m = s._getVersion, m = m(s._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [s, m] : r.mutableSourceEagerHydrationData.push(
      s,
      m
    );
    return new Kf(r);
  }, ea.render = function(n, r, s) {
    if (!Qf(r)) throw Error(c(200));
    return Xf(null, n, r, !1, s);
  }, ea.unmountComponentAtNode = function(n) {
    if (!Qf(n)) throw Error(c(40));
    return n._reactRootContainer ? (ns(function() {
      Xf(null, null, n, !1, function() {
        n._reactRootContainer = null, n[uo] = null;
      });
    }), !0) : !1;
  }, ea.unstable_batchedUpdates = Fp, ea.unstable_renderSubtreeIntoContainer = function(n, r, s, f) {
    if (!Qf(s)) throw Error(c(200));
    if (n == null || n._reactInternals === void 0) throw Error(c(38));
    return Xf(n, r, s, !1, f);
  }, ea.version = "18.2.0-next-9e3b772b8-20220608", ea;
}
var ta = {};
/**
 * @license React
 * react-dom.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var eR;
function uN() {
  return eR || (eR = 1, process.env.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var a = at, l = b1(), c = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, p = !1;
    function g(e) {
      p = e;
    }
    function E(e) {
      if (!p) {
        for (var t = arguments.length, i = new Array(t > 1 ? t - 1 : 0), o = 1; o < t; o++)
          i[o - 1] = arguments[o];
        x("warn", e, i);
      }
    }
    function h(e) {
      if (!p) {
        for (var t = arguments.length, i = new Array(t > 1 ? t - 1 : 0), o = 1; o < t; o++)
          i[o - 1] = arguments[o];
        x("error", e, i);
      }
    }
    function x(e, t, i) {
      {
        var o = c.ReactDebugCurrentFrame, u = o.getStackAddendum();
        u !== "" && (t += "%s", i = i.concat([u]));
        var d = i.map(function(v) {
          return String(v);
        });
        d.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, d);
      }
    }
    var b = 0, R = 1, D = 2, M = 3, A = 4, j = 5, q = 6, re = 7, ie = 8, ue = 9, he = 10, ne = 11, Se = 12, ae = 13, Re = 14, xe = 15, le = 16, Xe = 17, yt = 18, Mt = 19, gt = 21, We = 22, Rt = 23, pt = 24, ht = 25, ye = !0, K = !1, De = !1, N = !1, ee = !1, be = !1, Ie = !0, Ne = !0, bt = !0, mt = /* @__PURE__ */ new Set(), Ue = {}, ft = {};
    function Ot(e, t) {
      wn(e, t), wn(e + "Capture", t);
    }
    function wn(e, t) {
      Ue[e] && h("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), Ue[e] = t;
      {
        var i = e.toLowerCase();
        ft[i] = e, e === "onDoubleClick" && (ft.ondblclick = e);
      }
      for (var o = 0; o < t.length; o++)
        mt.add(t[o]);
    }
    var mn = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", Vn = Object.prototype.hasOwnProperty;
    function Dn(e) {
      {
        var t = typeof Symbol == "function" && Symbol.toStringTag, i = t && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return i;
      }
    }
    function cr(e) {
      try {
        return Yn(e), !1;
      } catch {
        return !0;
      }
    }
    function Yn(e) {
      return "" + e;
    }
    function er(e, t) {
      if (cr(e))
        return h("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Dn(e)), Yn(e);
    }
    function Jr(e) {
      if (cr(e))
        return h("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Dn(e)), Yn(e);
    }
    function Ta(e, t) {
      if (cr(e))
        return h("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Dn(e)), Yn(e);
    }
    function vi(e, t) {
      if (cr(e))
        return h("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Dn(e)), Yn(e);
    }
    function tr(e) {
      if (cr(e))
        return h("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", Dn(e)), Yn(e);
    }
    function _n(e) {
      if (cr(e))
        return h("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before before using it here.", Dn(e)), Yn(e);
    }
    var $n = 0, kr = 1, ra = 2, zn = 3, Dr = 4, yi = 5, ia = 6, ba = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", ge = ba + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", Ye = new RegExp("^[" + ba + "][" + ge + "]*$"), St = {}, Yt = {};
    function an(e) {
      return Vn.call(Yt, e) ? !0 : Vn.call(St, e) ? !1 : Ye.test(e) ? (Yt[e] = !0, !0) : (St[e] = !0, h("Invalid attribute name: `%s`", e), !1);
    }
    function Cn(e, t, i) {
      return t !== null ? t.type === $n : i ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
    }
    function fn(e, t, i, o) {
      if (i !== null && i.type === $n)
        return !1;
      switch (typeof t) {
        case "function":
        case "symbol":
          return !0;
        case "boolean": {
          if (o)
            return !1;
          if (i !== null)
            return !i.acceptsBooleans;
          var u = e.toLowerCase().slice(0, 5);
          return u !== "data-" && u !== "aria-";
        }
        default:
          return !1;
      }
    }
    function nr(e, t, i, o) {
      if (t === null || typeof t > "u" || fn(e, t, i, o))
        return !0;
      if (o)
        return !1;
      if (i !== null)
        switch (i.type) {
          case zn:
            return !t;
          case Dr:
            return t === !1;
          case yi:
            return isNaN(t);
          case ia:
            return isNaN(t) || t < 1;
        }
      return !1;
    }
    function on(e) {
      return Qt.hasOwnProperty(e) ? Qt[e] : null;
    }
    function Kt(e, t, i, o, u, d, v) {
      this.acceptsBooleans = t === ra || t === zn || t === Dr, this.attributeName = o, this.attributeNamespace = u, this.mustUseProperty = i, this.propertyName = e, this.type = t, this.sanitizeURL = d, this.removeEmptyString = v;
    }
    var Qt = {}, gi = [
      "children",
      "dangerouslySetInnerHTML",
      // TODO: This prevents the assignment of defaultValue to regular
      // elements (not just inputs). Now that ReactDOMInput assigns to the
      // defaultValue property -- do we need this?
      "defaultValue",
      "defaultChecked",
      "innerHTML",
      "suppressContentEditableWarning",
      "suppressHydrationWarning",
      "style"
    ];
    gi.forEach(function(e) {
      Qt[e] = new Kt(
        e,
        $n,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
      var t = e[0], i = e[1];
      Qt[t] = new Kt(
        t,
        kr,
        !1,
        // mustUseProperty
        i,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
      Qt[e] = new Kt(
        e,
        ra,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
      Qt[e] = new Kt(
        e,
        ra,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "allowFullScreen",
      "async",
      // Note: there is a special case that prevents it from being written to the DOM
      // on the client side because the browsers are inconsistent. Instead we call focus().
      "autoFocus",
      "autoPlay",
      "controls",
      "default",
      "defer",
      "disabled",
      "disablePictureInPicture",
      "disableRemotePlayback",
      "formNoValidate",
      "hidden",
      "loop",
      "noModule",
      "noValidate",
      "open",
      "playsInline",
      "readOnly",
      "required",
      "reversed",
      "scoped",
      "seamless",
      // Microdata
      "itemScope"
    ].forEach(function(e) {
      Qt[e] = new Kt(
        e,
        zn,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "checked",
      // Note: `option.selected` is not updated if `select.multiple` is
      // disabled with `removeAttribute`. We have special logic for handling this.
      "multiple",
      "muted",
      "selected"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Qt[e] = new Kt(
        e,
        zn,
        !0,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "capture",
      "download"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Qt[e] = new Kt(
        e,
        Dr,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "cols",
      "rows",
      "size",
      "span"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Qt[e] = new Kt(
        e,
        ia,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["rowSpan", "start"].forEach(function(e) {
      Qt[e] = new Kt(
        e,
        yi,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var _r = /[\-\:]([a-z])/g, Ai = function(e) {
      return e[1].toUpperCase();
    };
    [
      "accent-height",
      "alignment-baseline",
      "arabic-form",
      "baseline-shift",
      "cap-height",
      "clip-path",
      "clip-rule",
      "color-interpolation",
      "color-interpolation-filters",
      "color-profile",
      "color-rendering",
      "dominant-baseline",
      "enable-background",
      "fill-opacity",
      "fill-rule",
      "flood-color",
      "flood-opacity",
      "font-family",
      "font-size",
      "font-size-adjust",
      "font-stretch",
      "font-style",
      "font-variant",
      "font-weight",
      "glyph-name",
      "glyph-orientation-horizontal",
      "glyph-orientation-vertical",
      "horiz-adv-x",
      "horiz-origin-x",
      "image-rendering",
      "letter-spacing",
      "lighting-color",
      "marker-end",
      "marker-mid",
      "marker-start",
      "overline-position",
      "overline-thickness",
      "paint-order",
      "panose-1",
      "pointer-events",
      "rendering-intent",
      "shape-rendering",
      "stop-color",
      "stop-opacity",
      "strikethrough-position",
      "strikethrough-thickness",
      "stroke-dasharray",
      "stroke-dashoffset",
      "stroke-linecap",
      "stroke-linejoin",
      "stroke-miterlimit",
      "stroke-opacity",
      "stroke-width",
      "text-anchor",
      "text-decoration",
      "text-rendering",
      "underline-position",
      "underline-thickness",
      "unicode-bidi",
      "unicode-range",
      "units-per-em",
      "v-alphabetic",
      "v-hanging",
      "v-ideographic",
      "v-mathematical",
      "vector-effect",
      "vert-adv-y",
      "vert-origin-x",
      "vert-origin-y",
      "word-spacing",
      "writing-mode",
      "xmlns:xlink",
      "x-height"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(_r, Ai);
      Qt[t] = new Kt(
        t,
        kr,
        !1,
        // mustUseProperty
        e,
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xlink:actuate",
      "xlink:arcrole",
      "xlink:role",
      "xlink:show",
      "xlink:title",
      "xlink:type"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(_r, Ai);
      Qt[t] = new Kt(
        t,
        kr,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/1999/xlink",
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xml:base",
      "xml:lang",
      "xml:space"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(_r, Ai);
      Qt[t] = new Kt(
        t,
        kr,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/XML/1998/namespace",
        !1,
        // sanitizeURL
        !1
      );
    }), ["tabIndex", "crossOrigin"].forEach(function(e) {
      Qt[e] = new Kt(
        e,
        kr,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var eo = "xlinkHref";
    Qt[eo] = new Kt(
      "xlinkHref",
      kr,
      !1,
      // mustUseProperty
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      // sanitizeURL
      !1
    ), ["src", "href", "action", "formAction"].forEach(function(e) {
      Qt[e] = new Kt(
        e,
        kr,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !0,
        // sanitizeURL
        !0
      );
    });
    var Rl = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, kl = !1;
    function Uo(e) {
      !kl && Rl.test(e) && (kl = !0, h("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(e)));
    }
    function Fo(e, t, i, o) {
      if (o.mustUseProperty) {
        var u = o.propertyName;
        return e[u];
      } else {
        er(i, t), o.sanitizeURL && Uo("" + i);
        var d = o.attributeName, v = null;
        if (o.type === Dr) {
          if (e.hasAttribute(d)) {
            var S = e.getAttribute(d);
            return S === "" ? !0 : nr(t, i, o, !1) ? S : S === "" + i ? i : S;
          }
        } else if (e.hasAttribute(d)) {
          if (nr(t, i, o, !1))
            return e.getAttribute(d);
          if (o.type === zn)
            return i;
          v = e.getAttribute(d);
        }
        return nr(t, i, o, !1) ? v === null ? i : v : v === "" + i ? i : v;
      }
    }
    function Dl(e, t, i, o) {
      {
        if (!an(t))
          return;
        if (!e.hasAttribute(t))
          return i === void 0 ? void 0 : null;
        var u = e.getAttribute(t);
        return er(i, t), u === "" + i ? i : u;
      }
    }
    function zr(e, t, i, o) {
      var u = on(t);
      if (!Cn(t, u, o)) {
        if (nr(t, i, u, o) && (i = null), o || u === null) {
          if (an(t)) {
            var d = t;
            i === null ? e.removeAttribute(d) : (er(i, t), e.setAttribute(d, "" + i));
          }
          return;
        }
        var v = u.mustUseProperty;
        if (v) {
          var S = u.propertyName;
          if (i === null) {
            var C = u.type;
            e[S] = C === zn ? !1 : "";
          } else
            e[S] = i;
          return;
        }
        var k = u.attributeName, _ = u.attributeNamespace;
        if (i === null)
          e.removeAttribute(k);
        else {
          var F = u.type, z;
          F === zn || F === Dr && i === !0 ? z = "" : (er(i, k), z = "" + i, u.sanitizeURL && Uo(z.toString())), _ ? e.setAttributeNS(_, k, z) : e.setAttribute(k, z);
        }
      }
    }
    var Ur = Symbol.for("react.element"), Mr = Symbol.for("react.portal"), xa = Symbol.for("react.fragment"), aa = Symbol.for("react.strict_mode"), wa = Symbol.for("react.profiler"), P = Symbol.for("react.provider"), ce = Symbol.for("react.context"), Ce = Symbol.for("react.forward_ref"), Je = Symbol.for("react.suspense"), it = Symbol.for("react.suspense_list"), Ct = Symbol.for("react.memo"), et = Symbol.for("react.lazy"), Et = Symbol.for("react.scope"), Wn = Symbol.for("react.debug_trace_mode"), tn = Symbol.for("react.offscreen"), dn = Symbol.for("react.legacy_hidden"), fr = Symbol.for("react.cache"), oa = Symbol.for("react.tracing_marker"), _l = Symbol.iterator, Si = "@@iterator";
    function Gt(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = _l && e[_l] || e[Si];
      return typeof t == "function" ? t : null;
    }
    var kt = Object.assign, to = 0, Ou, Ml, jo, Ts, Bo, ei, Au;
    function Fr() {
    }
    Fr.__reactDisabledLog = !0;
    function $c() {
      {
        if (to === 0) {
          Ou = console.log, Ml = console.info, jo = console.warn, Ts = console.error, Bo = console.group, ei = console.groupCollapsed, Au = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: Fr,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        to++;
      }
    }
    function Wc() {
      {
        if (to--, to === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: kt({}, e, {
              value: Ou
            }),
            info: kt({}, e, {
              value: Ml
            }),
            warn: kt({}, e, {
              value: jo
            }),
            error: kt({}, e, {
              value: Ts
            }),
            group: kt({}, e, {
              value: Bo
            }),
            groupCollapsed: kt({}, e, {
              value: ei
            }),
            groupEnd: kt({}, e, {
              value: Au
            })
          });
        }
        to < 0 && h("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var bs = c.ReactCurrentDispatcher, Ho;
    function Ci(e, t, i) {
      {
        if (Ho === void 0)
          try {
            throw Error();
          } catch (u) {
            var o = u.stack.trim().match(/\n( *(at )?)/);
            Ho = o && o[1] || "";
          }
        return `
` + Ho + e;
      }
    }
    var la = !1, sa;
    {
      var xs = typeof WeakMap == "function" ? WeakMap : Map;
      sa = new xs();
    }
    function Ol(e, t) {
      if (!e || la)
        return "";
      {
        var i = sa.get(e);
        if (i !== void 0)
          return i;
      }
      var o;
      la = !0;
      var u = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var d;
      d = bs.current, bs.current = null, $c();
      try {
        if (t) {
          var v = function() {
            throw Error();
          };
          if (Object.defineProperty(v.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(v, []);
            } catch (G) {
              o = G;
            }
            Reflect.construct(e, [], v);
          } else {
            try {
              v.call();
            } catch (G) {
              o = G;
            }
            e.call(v.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (G) {
            o = G;
          }
          e();
        }
      } catch (G) {
        if (G && o && typeof G.stack == "string") {
          for (var S = G.stack.split(`
`), C = o.stack.split(`
`), k = S.length - 1, _ = C.length - 1; k >= 1 && _ >= 0 && S[k] !== C[_]; )
            _--;
          for (; k >= 1 && _ >= 0; k--, _--)
            if (S[k] !== C[_]) {
              if (k !== 1 || _ !== 1)
                do
                  if (k--, _--, _ < 0 || S[k] !== C[_]) {
                    var F = `
` + S[k].replace(" at new ", " at ");
                    return e.displayName && F.includes("<anonymous>") && (F = F.replace("<anonymous>", e.displayName)), typeof e == "function" && sa.set(e, F), F;
                  }
                while (k >= 1 && _ >= 0);
              break;
            }
        }
      } finally {
        la = !1, bs.current = d, Wc(), Error.prepareStackTrace = u;
      }
      var z = e ? e.displayName || e.name : "", $ = z ? Ci(z) : "";
      return typeof e == "function" && sa.set(e, $), $;
    }
    function Io(e, t, i) {
      return Ol(e, !0);
    }
    function ws(e, t, i) {
      return Ol(e, !1);
    }
    function Rs(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function no(e, t, i) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return Ol(e, Rs(e));
      if (typeof e == "string")
        return Ci(e);
      switch (e) {
        case Je:
          return Ci("Suspense");
        case it:
          return Ci("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case Ce:
            return ws(e.render);
          case Ct:
            return no(e.type, t, i);
          case et: {
            var o = e, u = o._payload, d = o._init;
            try {
              return no(d(u), t, i);
            } catch {
            }
          }
        }
      return "";
    }
    function Hd(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case j:
          return Ci(e.type);
        case le:
          return Ci("Lazy");
        case ae:
          return Ci("Suspense");
        case Mt:
          return Ci("SuspenseList");
        case b:
        case D:
        case xe:
          return ws(e.type);
        case ne:
          return ws(e.type.render);
        case R:
          return Io(e.type);
        default:
          return "";
      }
    }
    function ro(e) {
      try {
        var t = "", i = e;
        do
          t += Hd(i), i = i.return;
        while (i);
        return t;
      } catch (o) {
        return `
Error generating stack: ` + o.message + `
` + o.stack;
      }
    }
    function Ft(e, t, i) {
      var o = e.displayName;
      if (o)
        return o;
      var u = t.displayName || t.name || "";
      return u !== "" ? i + "(" + u + ")" : i;
    }
    function ks(e) {
      return e.displayName || "Context";
    }
    function jt(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && h("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case xa:
          return "Fragment";
        case Mr:
          return "Portal";
        case wa:
          return "Profiler";
        case aa:
          return "StrictMode";
        case Je:
          return "Suspense";
        case it:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case ce:
            var t = e;
            return ks(t) + ".Consumer";
          case P:
            var i = e;
            return ks(i._context) + ".Provider";
          case Ce:
            return Ft(e, e.render, "ForwardRef");
          case Ct:
            var o = e.displayName || null;
            return o !== null ? o : jt(e.type) || "Memo";
          case et: {
            var u = e, d = u._payload, v = u._init;
            try {
              return jt(v(d));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    function Lu(e, t, i) {
      var o = t.displayName || t.name || "";
      return e.displayName || (o !== "" ? i + "(" + o + ")" : i);
    }
    function Ra(e) {
      return e.displayName || "Context";
    }
    function lt(e) {
      var t = e.tag, i = e.type;
      switch (t) {
        case pt:
          return "Cache";
        case ue:
          var o = i;
          return Ra(o) + ".Consumer";
        case he:
          var u = i;
          return Ra(u._context) + ".Provider";
        case yt:
          return "DehydratedFragment";
        case ne:
          return Lu(i, i.render, "ForwardRef");
        case re:
          return "Fragment";
        case j:
          return i;
        case A:
          return "Portal";
        case M:
          return "Root";
        case q:
          return "Text";
        case le:
          return jt(i);
        case ie:
          return i === aa ? "StrictMode" : "Mode";
        case We:
          return "Offscreen";
        case Se:
          return "Profiler";
        case gt:
          return "Scope";
        case ae:
          return "Suspense";
        case Mt:
          return "SuspenseList";
        case ht:
          return "TracingMarker";
        case R:
        case b:
        case Xe:
        case D:
        case Re:
        case xe:
          if (typeof i == "function")
            return i.displayName || i.name || null;
          if (typeof i == "string")
            return i;
          break;
      }
      return null;
    }
    var Ds = c.ReactDebugCurrentFrame, dr = null, ka = !1;
    function jr() {
      {
        if (dr === null)
          return null;
        var e = dr._debugOwner;
        if (e !== null && typeof e < "u")
          return lt(e);
      }
      return null;
    }
    function Da() {
      return dr === null ? "" : ro(dr);
    }
    function pn() {
      Ds.getCurrentStack = null, dr = null, ka = !1;
    }
    function Xt(e) {
      Ds.getCurrentStack = e === null ? null : Da, dr = e, ka = !1;
    }
    function Yo() {
      return dr;
    }
    function Gn(e) {
      ka = e;
    }
    function Br(e) {
      return "" + e;
    }
    function Li(e) {
      switch (typeof e) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return _n(e), e;
        default:
          return "";
      }
    }
    var Al = {
      button: !0,
      checkbox: !0,
      image: !0,
      hidden: !0,
      radio: !0,
      reset: !0,
      submit: !0
    };
    function Nu(e, t) {
      Al[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || h("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || h("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
    }
    function Pu(e) {
      var t = e.type, i = e.nodeName;
      return i && i.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function $o(e) {
      return e._valueTracker;
    }
    function Ll(e) {
      e._valueTracker = null;
    }
    function Id(e) {
      var t = "";
      return e && (Pu(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
    }
    function Ni(e) {
      var t = Pu(e) ? "checked" : "value", i = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      _n(e[t]);
      var o = "" + e[t];
      if (!(e.hasOwnProperty(t) || typeof i > "u" || typeof i.get != "function" || typeof i.set != "function")) {
        var u = i.get, d = i.set;
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function() {
            return u.call(this);
          },
          set: function(S) {
            _n(S), o = "" + S, d.call(this, S);
          }
        }), Object.defineProperty(e, t, {
          enumerable: i.enumerable
        });
        var v = {
          getValue: function() {
            return o;
          },
          setValue: function(S) {
            _n(S), o = "" + S;
          },
          stopTracking: function() {
            Ll(e), delete e[t];
          }
        };
        return v;
      }
    }
    function ua(e) {
      $o(e) || (e._valueTracker = Ni(e));
    }
    function io(e) {
      if (!e)
        return !1;
      var t = $o(e);
      if (!t)
        return !0;
      var i = t.getValue(), o = Id(e);
      return o !== i ? (t.setValue(o), !0) : !1;
    }
    function Pi(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u")
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var _s = !1, Ms = !1, Wo = !1, Nl = !1;
    function Os(e) {
      var t = e.type === "checkbox" || e.type === "radio";
      return t ? e.checked != null : e.value != null;
    }
    function As(e, t) {
      var i = e, o = t.checked, u = kt({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: o ?? i._wrapperState.initialChecked
      });
      return u;
    }
    function ca(e, t) {
      Nu("input", t), t.checked !== void 0 && t.defaultChecked !== void 0 && !Ms && (h("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", jr() || "A component", t.type), Ms = !0), t.value !== void 0 && t.defaultValue !== void 0 && !_s && (h("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", jr() || "A component", t.type), _s = !0);
      var i = e, o = t.defaultValue == null ? "" : t.defaultValue;
      i._wrapperState = {
        initialChecked: t.checked != null ? t.checked : t.defaultChecked,
        initialValue: Li(t.value != null ? t.value : o),
        controlled: Os(t)
      };
    }
    function T(e, t) {
      var i = e, o = t.checked;
      o != null && zr(i, "checked", o, !1);
    }
    function L(e, t) {
      var i = e;
      {
        var o = Os(t);
        !i._wrapperState.controlled && o && !Nl && (h("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), Nl = !0), i._wrapperState.controlled && !o && !Wo && (h("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), Wo = !0);
      }
      T(e, t);
      var u = Li(t.value), d = t.type;
      if (u != null)
        d === "number" ? (u === 0 && i.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        i.value != u) && (i.value = Br(u)) : i.value !== Br(u) && (i.value = Br(u));
      else if (d === "submit" || d === "reset") {
        i.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? qe(i, t.type, u) : t.hasOwnProperty("defaultValue") && qe(i, t.type, Li(t.defaultValue)), t.checked == null && t.defaultChecked != null && (i.defaultChecked = !!t.defaultChecked);
    }
    function W(e, t, i) {
      var o = e;
      if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var u = t.type, d = u === "submit" || u === "reset";
        if (d && (t.value === void 0 || t.value === null))
          return;
        var v = Br(o._wrapperState.initialValue);
        i || v !== o.value && (o.value = v), o.defaultValue = v;
      }
      var S = o.name;
      S !== "" && (o.name = ""), o.defaultChecked = !o.defaultChecked, o.defaultChecked = !!o._wrapperState.initialChecked, S !== "" && (o.name = S);
    }
    function X(e, t) {
      var i = e;
      L(i, t), ve(i, t);
    }
    function ve(e, t) {
      var i = t.name;
      if (t.type === "radio" && i != null) {
        for (var o = e; o.parentNode; )
          o = o.parentNode;
        er(i, "name");
        for (var u = o.querySelectorAll("input[name=" + JSON.stringify("" + i) + '][type="radio"]'), d = 0; d < u.length; d++) {
          var v = u[d];
          if (!(v === e || v.form !== e.form)) {
            var S = $v(v);
            if (!S)
              throw new Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
            io(v), L(v, S);
          }
        }
      }
    }
    function qe(e, t, i) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || Pi(e.ownerDocument) !== e) && (i == null ? e.defaultValue = Br(e._wrapperState.initialValue) : e.defaultValue !== Br(i) && (e.defaultValue = Br(i)));
    }
    var Te = !1, nt = !1, xt = !1;
    function zt(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? a.Children.forEach(t.children, function(i) {
        i != null && (typeof i == "string" || typeof i == "number" || nt || (nt = !0, h("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (xt || (xt = !0, h("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !Te && (h("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), Te = !0);
    }
    function ln(e, t) {
      t.value != null && e.setAttribute("value", Br(Li(t.value)));
    }
    var qt = Array.isArray;
    function Tt(e) {
      return qt(e);
    }
    var Zt;
    Zt = !1;
    function En() {
      var e = jr();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    var Go = ["value", "defaultValue"];
    function Vu(e) {
      {
        Nu("select", e);
        for (var t = 0; t < Go.length; t++) {
          var i = Go[t];
          if (e[i] != null) {
            var o = Tt(e[i]);
            e.multiple && !o ? h("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", i, En()) : !e.multiple && o && h("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", i, En());
          }
        }
      }
    }
    function ao(e, t, i, o) {
      var u = e.options;
      if (t) {
        for (var d = i, v = {}, S = 0; S < d.length; S++)
          v["$" + d[S]] = !0;
        for (var C = 0; C < u.length; C++) {
          var k = v.hasOwnProperty("$" + u[C].value);
          u[C].selected !== k && (u[C].selected = k), k && o && (u[C].defaultSelected = !0);
        }
      } else {
        for (var _ = Br(Li(i)), F = null, z = 0; z < u.length; z++) {
          if (u[z].value === _) {
            u[z].selected = !0, o && (u[z].defaultSelected = !0);
            return;
          }
          F === null && !u[z].disabled && (F = u[z]);
        }
        F !== null && (F.selected = !0);
      }
    }
    function zu(e, t) {
      return kt({}, t, {
        value: void 0
      });
    }
    function Pl(e, t) {
      var i = e;
      Vu(t), i._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !Zt && (h("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), Zt = !0);
    }
    function Yd(e, t) {
      var i = e;
      i.multiple = !!t.multiple;
      var o = t.value;
      o != null ? ao(i, !!t.multiple, o, !1) : t.defaultValue != null && ao(i, !!t.multiple, t.defaultValue, !0);
    }
    function Gc(e, t) {
      var i = e, o = i._wrapperState.wasMultiple;
      i._wrapperState.wasMultiple = !!t.multiple;
      var u = t.value;
      u != null ? ao(i, !!t.multiple, u, !1) : o !== !!t.multiple && (t.defaultValue != null ? ao(i, !!t.multiple, t.defaultValue, !0) : ao(i, !!t.multiple, t.multiple ? [] : "", !1));
    }
    function $d(e, t) {
      var i = e, o = t.value;
      o != null && ao(i, !!t.multiple, o, !1);
    }
    var lm = !1;
    function Wd(e, t) {
      var i = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var o = kt({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: Br(i._wrapperState.initialValue)
      });
      return o;
    }
    function Gd(e, t) {
      var i = e;
      Nu("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !lm && (h("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", jr() || "A component"), lm = !0);
      var o = t.value;
      if (o == null) {
        var u = t.children, d = t.defaultValue;
        if (u != null) {
          h("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (d != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (Tt(u)) {
              if (u.length > 1)
                throw new Error("<textarea> can only have at most one child.");
              u = u[0];
            }
            d = u;
          }
        }
        d == null && (d = ""), o = d;
      }
      i._wrapperState = {
        initialValue: Li(o)
      };
    }
    function sm(e, t) {
      var i = e, o = Li(t.value), u = Li(t.defaultValue);
      if (o != null) {
        var d = Br(o);
        d !== i.value && (i.value = d), t.defaultValue == null && i.defaultValue !== d && (i.defaultValue = d);
      }
      u != null && (i.defaultValue = Br(u));
    }
    function um(e, t) {
      var i = e, o = i.textContent;
      o === i._wrapperState.initialValue && o !== "" && o !== null && (i.value = o);
    }
    function Rg(e, t) {
      sm(e, t);
    }
    var oo = "http://www.w3.org/1999/xhtml", Kd = "http://www.w3.org/1998/Math/MathML", Qd = "http://www.w3.org/2000/svg";
    function Xd(e) {
      switch (e) {
        case "svg":
          return Qd;
        case "math":
          return Kd;
        default:
          return oo;
      }
    }
    function qd(e, t) {
      return e == null || e === oo ? Xd(t) : e === Qd && t === "foreignObject" ? oo : e;
    }
    var cm = function(e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, i, o, u) {
        MSApp.execUnsafeLocalFunction(function() {
          return e(t, i, o, u);
        });
      } : e;
    }, Kc, fm = cm(function(e, t) {
      if (e.namespaceURI === Qd && !("innerHTML" in e)) {
        Kc = Kc || document.createElement("div"), Kc.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var i = Kc.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; i.firstChild; )
          e.appendChild(i.firstChild);
        return;
      }
      e.innerHTML = t;
    }), ti = 1, lo = 3, Un = 8, so = 9, Zd = 11, Ls = function(e, t) {
      if (t) {
        var i = e.firstChild;
        if (i && i === e.lastChild && i.nodeType === lo) {
          i.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }, Uu = {
      animation: ["animationDelay", "animationDirection", "animationDuration", "animationFillMode", "animationIterationCount", "animationName", "animationPlayState", "animationTimingFunction"],
      background: ["backgroundAttachment", "backgroundClip", "backgroundColor", "backgroundImage", "backgroundOrigin", "backgroundPositionX", "backgroundPositionY", "backgroundRepeat", "backgroundSize"],
      backgroundPosition: ["backgroundPositionX", "backgroundPositionY"],
      border: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth", "borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth", "borderLeftColor", "borderLeftStyle", "borderLeftWidth", "borderRightColor", "borderRightStyle", "borderRightWidth", "borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderBlockEnd: ["borderBlockEndColor", "borderBlockEndStyle", "borderBlockEndWidth"],
      borderBlockStart: ["borderBlockStartColor", "borderBlockStartStyle", "borderBlockStartWidth"],
      borderBottom: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth"],
      borderColor: ["borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor"],
      borderImage: ["borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth"],
      borderInlineEnd: ["borderInlineEndColor", "borderInlineEndStyle", "borderInlineEndWidth"],
      borderInlineStart: ["borderInlineStartColor", "borderInlineStartStyle", "borderInlineStartWidth"],
      borderLeft: ["borderLeftColor", "borderLeftStyle", "borderLeftWidth"],
      borderRadius: ["borderBottomLeftRadius", "borderBottomRightRadius", "borderTopLeftRadius", "borderTopRightRadius"],
      borderRight: ["borderRightColor", "borderRightStyle", "borderRightWidth"],
      borderStyle: ["borderBottomStyle", "borderLeftStyle", "borderRightStyle", "borderTopStyle"],
      borderTop: ["borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderWidth: ["borderBottomWidth", "borderLeftWidth", "borderRightWidth", "borderTopWidth"],
      columnRule: ["columnRuleColor", "columnRuleStyle", "columnRuleWidth"],
      columns: ["columnCount", "columnWidth"],
      flex: ["flexBasis", "flexGrow", "flexShrink"],
      flexFlow: ["flexDirection", "flexWrap"],
      font: ["fontFamily", "fontFeatureSettings", "fontKerning", "fontLanguageOverride", "fontSize", "fontSizeAdjust", "fontStretch", "fontStyle", "fontVariant", "fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition", "fontWeight", "lineHeight"],
      fontVariant: ["fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition"],
      gap: ["columnGap", "rowGap"],
      grid: ["gridAutoColumns", "gridAutoFlow", "gridAutoRows", "gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      gridArea: ["gridColumnEnd", "gridColumnStart", "gridRowEnd", "gridRowStart"],
      gridColumn: ["gridColumnEnd", "gridColumnStart"],
      gridColumnGap: ["columnGap"],
      gridGap: ["columnGap", "rowGap"],
      gridRow: ["gridRowEnd", "gridRowStart"],
      gridRowGap: ["rowGap"],
      gridTemplate: ["gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      listStyle: ["listStyleImage", "listStylePosition", "listStyleType"],
      margin: ["marginBottom", "marginLeft", "marginRight", "marginTop"],
      marker: ["markerEnd", "markerMid", "markerStart"],
      mask: ["maskClip", "maskComposite", "maskImage", "maskMode", "maskOrigin", "maskPositionX", "maskPositionY", "maskRepeat", "maskSize"],
      maskPosition: ["maskPositionX", "maskPositionY"],
      outline: ["outlineColor", "outlineStyle", "outlineWidth"],
      overflow: ["overflowX", "overflowY"],
      padding: ["paddingBottom", "paddingLeft", "paddingRight", "paddingTop"],
      placeContent: ["alignContent", "justifyContent"],
      placeItems: ["alignItems", "justifyItems"],
      placeSelf: ["alignSelf", "justifySelf"],
      textDecoration: ["textDecorationColor", "textDecorationLine", "textDecorationStyle"],
      textEmphasis: ["textEmphasisColor", "textEmphasisStyle"],
      transition: ["transitionDelay", "transitionDuration", "transitionProperty", "transitionTimingFunction"],
      wordWrap: ["overflowWrap"]
    }, Fu = {
      animationIterationCount: !0,
      aspectRatio: !0,
      borderImageOutset: !0,
      borderImageSlice: !0,
      borderImageWidth: !0,
      boxFlex: !0,
      boxFlexGroup: !0,
      boxOrdinalGroup: !0,
      columnCount: !0,
      columns: !0,
      flex: !0,
      flexGrow: !0,
      flexPositive: !0,
      flexShrink: !0,
      flexNegative: !0,
      flexOrder: !0,
      gridArea: !0,
      gridRow: !0,
      gridRowEnd: !0,
      gridRowSpan: !0,
      gridRowStart: !0,
      gridColumn: !0,
      gridColumnEnd: !0,
      gridColumnSpan: !0,
      gridColumnStart: !0,
      fontWeight: !0,
      lineClamp: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      tabSize: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
      // SVG-related properties
      fillOpacity: !0,
      floodOpacity: !0,
      stopOpacity: !0,
      strokeDasharray: !0,
      strokeDashoffset: !0,
      strokeMiterlimit: !0,
      strokeOpacity: !0,
      strokeWidth: !0
    };
    function dm(e, t) {
      return e + t.charAt(0).toUpperCase() + t.substring(1);
    }
    var pm = ["Webkit", "ms", "Moz", "O"];
    Object.keys(Fu).forEach(function(e) {
      pm.forEach(function(t) {
        Fu[dm(t, e)] = Fu[e];
      });
    });
    function Qc(e, t, i) {
      var o = t == null || typeof t == "boolean" || t === "";
      return o ? "" : !i && typeof t == "number" && t !== 0 && !(Fu.hasOwnProperty(e) && Fu[e]) ? t + "px" : (vi(t, e), ("" + t).trim());
    }
    var hm = /([A-Z])/g, mm = /^ms-/;
    function Ns(e) {
      return e.replace(hm, "-$1").toLowerCase().replace(mm, "-ms-");
    }
    var vm = function() {
    };
    {
      var kg = /^(?:webkit|moz|o)[A-Z]/, Dg = /^-ms-/, ym = /-(.)/g, Jd = /;\s*$/, _a = {}, Vl = {}, gm = !1, ju = !1, _g = function(e) {
        return e.replace(ym, function(t, i) {
          return i.toUpperCase();
        });
      }, Sm = function(e) {
        _a.hasOwnProperty(e) && _a[e] || (_a[e] = !0, h(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          _g(e.replace(Dg, "ms-"))
        ));
      }, ep = function(e) {
        _a.hasOwnProperty(e) && _a[e] || (_a[e] = !0, h("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, tp = function(e, t) {
        Vl.hasOwnProperty(t) && Vl[t] || (Vl[t] = !0, h(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(Jd, "")));
      }, Cm = function(e, t) {
        gm || (gm = !0, h("`NaN` is an invalid value for the `%s` css style property.", e));
      }, Em = function(e, t) {
        ju || (ju = !0, h("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      vm = function(e, t) {
        e.indexOf("-") > -1 ? Sm(e) : kg.test(e) ? ep(e) : Jd.test(t) && tp(e, t), typeof t == "number" && (isNaN(t) ? Cm(e, t) : isFinite(t) || Em(e, t));
      };
    }
    var Tm = vm;
    function Mg(e) {
      {
        var t = "", i = "";
        for (var o in e)
          if (e.hasOwnProperty(o)) {
            var u = e[o];
            if (u != null) {
              var d = o.indexOf("--") === 0;
              t += i + (d ? o : Ns(o)) + ":", t += Qc(o, u, d), i = ";";
            }
          }
        return t || null;
      }
    }
    function bm(e, t) {
      var i = e.style;
      for (var o in t)
        if (t.hasOwnProperty(o)) {
          var u = o.indexOf("--") === 0;
          u || Tm(o, t[o]);
          var d = Qc(o, t[o], u);
          o === "float" && (o = "cssFloat"), u ? i.setProperty(o, d) : i[o] = d;
        }
    }
    function Og(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function xm(e) {
      var t = {};
      for (var i in e)
        for (var o = Uu[i] || [i], u = 0; u < o.length; u++)
          t[o[u]] = i;
      return t;
    }
    function Ag(e, t) {
      {
        if (!t)
          return;
        var i = xm(e), o = xm(t), u = {};
        for (var d in i) {
          var v = i[d], S = o[d];
          if (S && v !== S) {
            var C = v + "," + S;
            if (u[C])
              continue;
            u[C] = !0, h("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", Og(e[v]) ? "Removing" : "Updating", v, S);
          }
        }
      }
    }
    var fa = {
      area: !0,
      base: !0,
      br: !0,
      col: !0,
      embed: !0,
      hr: !0,
      img: !0,
      input: !0,
      keygen: !0,
      link: !0,
      meta: !0,
      param: !0,
      source: !0,
      track: !0,
      wbr: !0
      // NOTE: menuitem's close tag should be omitted, but that causes problems.
    }, Bu = kt({
      menuitem: !0
    }, fa), wm = "__html";
    function Xc(e, t) {
      if (t) {
        if (Bu[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
          throw new Error(e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
        if (t.dangerouslySetInnerHTML != null) {
          if (t.children != null)
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if (typeof t.dangerouslySetInnerHTML != "object" || !(wm in t.dangerouslySetInnerHTML))
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
        }
        if (!t.suppressContentEditableWarning && t.contentEditable && t.children != null && h("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."), t.style != null && typeof t.style != "object")
          throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
      }
    }
    function Ko(e, t) {
      if (e.indexOf("-") === -1)
        return typeof t.is == "string";
      switch (e) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return !1;
        default:
          return !0;
      }
    }
    var Hu = {
      // HTML
      accept: "accept",
      acceptcharset: "acceptCharset",
      "accept-charset": "acceptCharset",
      accesskey: "accessKey",
      action: "action",
      allowfullscreen: "allowFullScreen",
      alt: "alt",
      as: "as",
      async: "async",
      autocapitalize: "autoCapitalize",
      autocomplete: "autoComplete",
      autocorrect: "autoCorrect",
      autofocus: "autoFocus",
      autoplay: "autoPlay",
      autosave: "autoSave",
      capture: "capture",
      cellpadding: "cellPadding",
      cellspacing: "cellSpacing",
      challenge: "challenge",
      charset: "charSet",
      checked: "checked",
      children: "children",
      cite: "cite",
      class: "className",
      classid: "classID",
      classname: "className",
      cols: "cols",
      colspan: "colSpan",
      content: "content",
      contenteditable: "contentEditable",
      contextmenu: "contextMenu",
      controls: "controls",
      controlslist: "controlsList",
      coords: "coords",
      crossorigin: "crossOrigin",
      dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
      data: "data",
      datetime: "dateTime",
      default: "default",
      defaultchecked: "defaultChecked",
      defaultvalue: "defaultValue",
      defer: "defer",
      dir: "dir",
      disabled: "disabled",
      disablepictureinpicture: "disablePictureInPicture",
      disableremoteplayback: "disableRemotePlayback",
      download: "download",
      draggable: "draggable",
      enctype: "encType",
      enterkeyhint: "enterKeyHint",
      for: "htmlFor",
      form: "form",
      formmethod: "formMethod",
      formaction: "formAction",
      formenctype: "formEncType",
      formnovalidate: "formNoValidate",
      formtarget: "formTarget",
      frameborder: "frameBorder",
      headers: "headers",
      height: "height",
      hidden: "hidden",
      high: "high",
      href: "href",
      hreflang: "hrefLang",
      htmlfor: "htmlFor",
      httpequiv: "httpEquiv",
      "http-equiv": "httpEquiv",
      icon: "icon",
      id: "id",
      imagesizes: "imageSizes",
      imagesrcset: "imageSrcSet",
      innerhtml: "innerHTML",
      inputmode: "inputMode",
      integrity: "integrity",
      is: "is",
      itemid: "itemID",
      itemprop: "itemProp",
      itemref: "itemRef",
      itemscope: "itemScope",
      itemtype: "itemType",
      keyparams: "keyParams",
      keytype: "keyType",
      kind: "kind",
      label: "label",
      lang: "lang",
      list: "list",
      loop: "loop",
      low: "low",
      manifest: "manifest",
      marginwidth: "marginWidth",
      marginheight: "marginHeight",
      max: "max",
      maxlength: "maxLength",
      media: "media",
      mediagroup: "mediaGroup",
      method: "method",
      min: "min",
      minlength: "minLength",
      multiple: "multiple",
      muted: "muted",
      name: "name",
      nomodule: "noModule",
      nonce: "nonce",
      novalidate: "noValidate",
      open: "open",
      optimum: "optimum",
      pattern: "pattern",
      placeholder: "placeholder",
      playsinline: "playsInline",
      poster: "poster",
      preload: "preload",
      profile: "profile",
      radiogroup: "radioGroup",
      readonly: "readOnly",
      referrerpolicy: "referrerPolicy",
      rel: "rel",
      required: "required",
      reversed: "reversed",
      role: "role",
      rows: "rows",
      rowspan: "rowSpan",
      sandbox: "sandbox",
      scope: "scope",
      scoped: "scoped",
      scrolling: "scrolling",
      seamless: "seamless",
      selected: "selected",
      shape: "shape",
      size: "size",
      sizes: "sizes",
      span: "span",
      spellcheck: "spellCheck",
      src: "src",
      srcdoc: "srcDoc",
      srclang: "srcLang",
      srcset: "srcSet",
      start: "start",
      step: "step",
      style: "style",
      summary: "summary",
      tabindex: "tabIndex",
      target: "target",
      title: "title",
      type: "type",
      usemap: "useMap",
      value: "value",
      width: "width",
      wmode: "wmode",
      wrap: "wrap",
      // SVG
      about: "about",
      accentheight: "accentHeight",
      "accent-height": "accentHeight",
      accumulate: "accumulate",
      additive: "additive",
      alignmentbaseline: "alignmentBaseline",
      "alignment-baseline": "alignmentBaseline",
      allowreorder: "allowReorder",
      alphabetic: "alphabetic",
      amplitude: "amplitude",
      arabicform: "arabicForm",
      "arabic-form": "arabicForm",
      ascent: "ascent",
      attributename: "attributeName",
      attributetype: "attributeType",
      autoreverse: "autoReverse",
      azimuth: "azimuth",
      basefrequency: "baseFrequency",
      baselineshift: "baselineShift",
      "baseline-shift": "baselineShift",
      baseprofile: "baseProfile",
      bbox: "bbox",
      begin: "begin",
      bias: "bias",
      by: "by",
      calcmode: "calcMode",
      capheight: "capHeight",
      "cap-height": "capHeight",
      clip: "clip",
      clippath: "clipPath",
      "clip-path": "clipPath",
      clippathunits: "clipPathUnits",
      cliprule: "clipRule",
      "clip-rule": "clipRule",
      color: "color",
      colorinterpolation: "colorInterpolation",
      "color-interpolation": "colorInterpolation",
      colorinterpolationfilters: "colorInterpolationFilters",
      "color-interpolation-filters": "colorInterpolationFilters",
      colorprofile: "colorProfile",
      "color-profile": "colorProfile",
      colorrendering: "colorRendering",
      "color-rendering": "colorRendering",
      contentscripttype: "contentScriptType",
      contentstyletype: "contentStyleType",
      cursor: "cursor",
      cx: "cx",
      cy: "cy",
      d: "d",
      datatype: "datatype",
      decelerate: "decelerate",
      descent: "descent",
      diffuseconstant: "diffuseConstant",
      direction: "direction",
      display: "display",
      divisor: "divisor",
      dominantbaseline: "dominantBaseline",
      "dominant-baseline": "dominantBaseline",
      dur: "dur",
      dx: "dx",
      dy: "dy",
      edgemode: "edgeMode",
      elevation: "elevation",
      enablebackground: "enableBackground",
      "enable-background": "enableBackground",
      end: "end",
      exponent: "exponent",
      externalresourcesrequired: "externalResourcesRequired",
      fill: "fill",
      fillopacity: "fillOpacity",
      "fill-opacity": "fillOpacity",
      fillrule: "fillRule",
      "fill-rule": "fillRule",
      filter: "filter",
      filterres: "filterRes",
      filterunits: "filterUnits",
      floodopacity: "floodOpacity",
      "flood-opacity": "floodOpacity",
      floodcolor: "floodColor",
      "flood-color": "floodColor",
      focusable: "focusable",
      fontfamily: "fontFamily",
      "font-family": "fontFamily",
      fontsize: "fontSize",
      "font-size": "fontSize",
      fontsizeadjust: "fontSizeAdjust",
      "font-size-adjust": "fontSizeAdjust",
      fontstretch: "fontStretch",
      "font-stretch": "fontStretch",
      fontstyle: "fontStyle",
      "font-style": "fontStyle",
      fontvariant: "fontVariant",
      "font-variant": "fontVariant",
      fontweight: "fontWeight",
      "font-weight": "fontWeight",
      format: "format",
      from: "from",
      fx: "fx",
      fy: "fy",
      g1: "g1",
      g2: "g2",
      glyphname: "glyphName",
      "glyph-name": "glyphName",
      glyphorientationhorizontal: "glyphOrientationHorizontal",
      "glyph-orientation-horizontal": "glyphOrientationHorizontal",
      glyphorientationvertical: "glyphOrientationVertical",
      "glyph-orientation-vertical": "glyphOrientationVertical",
      glyphref: "glyphRef",
      gradienttransform: "gradientTransform",
      gradientunits: "gradientUnits",
      hanging: "hanging",
      horizadvx: "horizAdvX",
      "horiz-adv-x": "horizAdvX",
      horizoriginx: "horizOriginX",
      "horiz-origin-x": "horizOriginX",
      ideographic: "ideographic",
      imagerendering: "imageRendering",
      "image-rendering": "imageRendering",
      in2: "in2",
      in: "in",
      inlist: "inlist",
      intercept: "intercept",
      k1: "k1",
      k2: "k2",
      k3: "k3",
      k4: "k4",
      k: "k",
      kernelmatrix: "kernelMatrix",
      kernelunitlength: "kernelUnitLength",
      kerning: "kerning",
      keypoints: "keyPoints",
      keysplines: "keySplines",
      keytimes: "keyTimes",
      lengthadjust: "lengthAdjust",
      letterspacing: "letterSpacing",
      "letter-spacing": "letterSpacing",
      lightingcolor: "lightingColor",
      "lighting-color": "lightingColor",
      limitingconeangle: "limitingConeAngle",
      local: "local",
      markerend: "markerEnd",
      "marker-end": "markerEnd",
      markerheight: "markerHeight",
      markermid: "markerMid",
      "marker-mid": "markerMid",
      markerstart: "markerStart",
      "marker-start": "markerStart",
      markerunits: "markerUnits",
      markerwidth: "markerWidth",
      mask: "mask",
      maskcontentunits: "maskContentUnits",
      maskunits: "maskUnits",
      mathematical: "mathematical",
      mode: "mode",
      numoctaves: "numOctaves",
      offset: "offset",
      opacity: "opacity",
      operator: "operator",
      order: "order",
      orient: "orient",
      orientation: "orientation",
      origin: "origin",
      overflow: "overflow",
      overlineposition: "overlinePosition",
      "overline-position": "overlinePosition",
      overlinethickness: "overlineThickness",
      "overline-thickness": "overlineThickness",
      paintorder: "paintOrder",
      "paint-order": "paintOrder",
      panose1: "panose1",
      "panose-1": "panose1",
      pathlength: "pathLength",
      patterncontentunits: "patternContentUnits",
      patterntransform: "patternTransform",
      patternunits: "patternUnits",
      pointerevents: "pointerEvents",
      "pointer-events": "pointerEvents",
      points: "points",
      pointsatx: "pointsAtX",
      pointsaty: "pointsAtY",
      pointsatz: "pointsAtZ",
      prefix: "prefix",
      preservealpha: "preserveAlpha",
      preserveaspectratio: "preserveAspectRatio",
      primitiveunits: "primitiveUnits",
      property: "property",
      r: "r",
      radius: "radius",
      refx: "refX",
      refy: "refY",
      renderingintent: "renderingIntent",
      "rendering-intent": "renderingIntent",
      repeatcount: "repeatCount",
      repeatdur: "repeatDur",
      requiredextensions: "requiredExtensions",
      requiredfeatures: "requiredFeatures",
      resource: "resource",
      restart: "restart",
      result: "result",
      results: "results",
      rotate: "rotate",
      rx: "rx",
      ry: "ry",
      scale: "scale",
      security: "security",
      seed: "seed",
      shaperendering: "shapeRendering",
      "shape-rendering": "shapeRendering",
      slope: "slope",
      spacing: "spacing",
      specularconstant: "specularConstant",
      specularexponent: "specularExponent",
      speed: "speed",
      spreadmethod: "spreadMethod",
      startoffset: "startOffset",
      stddeviation: "stdDeviation",
      stemh: "stemh",
      stemv: "stemv",
      stitchtiles: "stitchTiles",
      stopcolor: "stopColor",
      "stop-color": "stopColor",
      stopopacity: "stopOpacity",
      "stop-opacity": "stopOpacity",
      strikethroughposition: "strikethroughPosition",
      "strikethrough-position": "strikethroughPosition",
      strikethroughthickness: "strikethroughThickness",
      "strikethrough-thickness": "strikethroughThickness",
      string: "string",
      stroke: "stroke",
      strokedasharray: "strokeDasharray",
      "stroke-dasharray": "strokeDasharray",
      strokedashoffset: "strokeDashoffset",
      "stroke-dashoffset": "strokeDashoffset",
      strokelinecap: "strokeLinecap",
      "stroke-linecap": "strokeLinecap",
      strokelinejoin: "strokeLinejoin",
      "stroke-linejoin": "strokeLinejoin",
      strokemiterlimit: "strokeMiterlimit",
      "stroke-miterlimit": "strokeMiterlimit",
      strokewidth: "strokeWidth",
      "stroke-width": "strokeWidth",
      strokeopacity: "strokeOpacity",
      "stroke-opacity": "strokeOpacity",
      suppresscontenteditablewarning: "suppressContentEditableWarning",
      suppresshydrationwarning: "suppressHydrationWarning",
      surfacescale: "surfaceScale",
      systemlanguage: "systemLanguage",
      tablevalues: "tableValues",
      targetx: "targetX",
      targety: "targetY",
      textanchor: "textAnchor",
      "text-anchor": "textAnchor",
      textdecoration: "textDecoration",
      "text-decoration": "textDecoration",
      textlength: "textLength",
      textrendering: "textRendering",
      "text-rendering": "textRendering",
      to: "to",
      transform: "transform",
      typeof: "typeof",
      u1: "u1",
      u2: "u2",
      underlineposition: "underlinePosition",
      "underline-position": "underlinePosition",
      underlinethickness: "underlineThickness",
      "underline-thickness": "underlineThickness",
      unicode: "unicode",
      unicodebidi: "unicodeBidi",
      "unicode-bidi": "unicodeBidi",
      unicoderange: "unicodeRange",
      "unicode-range": "unicodeRange",
      unitsperem: "unitsPerEm",
      "units-per-em": "unitsPerEm",
      unselectable: "unselectable",
      valphabetic: "vAlphabetic",
      "v-alphabetic": "vAlphabetic",
      values: "values",
      vectoreffect: "vectorEffect",
      "vector-effect": "vectorEffect",
      version: "version",
      vertadvy: "vertAdvY",
      "vert-adv-y": "vertAdvY",
      vertoriginx: "vertOriginX",
      "vert-origin-x": "vertOriginX",
      vertoriginy: "vertOriginY",
      "vert-origin-y": "vertOriginY",
      vhanging: "vHanging",
      "v-hanging": "vHanging",
      videographic: "vIdeographic",
      "v-ideographic": "vIdeographic",
      viewbox: "viewBox",
      viewtarget: "viewTarget",
      visibility: "visibility",
      vmathematical: "vMathematical",
      "v-mathematical": "vMathematical",
      vocab: "vocab",
      widths: "widths",
      wordspacing: "wordSpacing",
      "word-spacing": "wordSpacing",
      writingmode: "writingMode",
      "writing-mode": "writingMode",
      x1: "x1",
      x2: "x2",
      x: "x",
      xchannelselector: "xChannelSelector",
      xheight: "xHeight",
      "x-height": "xHeight",
      xlinkactuate: "xlinkActuate",
      "xlink:actuate": "xlinkActuate",
      xlinkarcrole: "xlinkArcrole",
      "xlink:arcrole": "xlinkArcrole",
      xlinkhref: "xlinkHref",
      "xlink:href": "xlinkHref",
      xlinkrole: "xlinkRole",
      "xlink:role": "xlinkRole",
      xlinkshow: "xlinkShow",
      "xlink:show": "xlinkShow",
      xlinktitle: "xlinkTitle",
      "xlink:title": "xlinkTitle",
      xlinktype: "xlinkType",
      "xlink:type": "xlinkType",
      xmlbase: "xmlBase",
      "xml:base": "xmlBase",
      xmllang: "xmlLang",
      "xml:lang": "xmlLang",
      xmlns: "xmlns",
      "xml:space": "xmlSpace",
      xmlnsxlink: "xmlnsXlink",
      "xmlns:xlink": "xmlnsXlink",
      xmlspace: "xmlSpace",
      y1: "y1",
      y2: "y2",
      y: "y",
      ychannelselector: "yChannelSelector",
      z: "z",
      zoomandpan: "zoomAndPan"
    }, qc = {
      "aria-current": 0,
      // state
      "aria-description": 0,
      "aria-details": 0,
      "aria-disabled": 0,
      // state
      "aria-hidden": 0,
      // state
      "aria-invalid": 0,
      // state
      "aria-keyshortcuts": 0,
      "aria-label": 0,
      "aria-roledescription": 0,
      // Widget Attributes
      "aria-autocomplete": 0,
      "aria-checked": 0,
      "aria-expanded": 0,
      "aria-haspopup": 0,
      "aria-level": 0,
      "aria-modal": 0,
      "aria-multiline": 0,
      "aria-multiselectable": 0,
      "aria-orientation": 0,
      "aria-placeholder": 0,
      "aria-pressed": 0,
      "aria-readonly": 0,
      "aria-required": 0,
      "aria-selected": 0,
      "aria-sort": 0,
      "aria-valuemax": 0,
      "aria-valuemin": 0,
      "aria-valuenow": 0,
      "aria-valuetext": 0,
      // Live Region Attributes
      "aria-atomic": 0,
      "aria-busy": 0,
      "aria-live": 0,
      "aria-relevant": 0,
      // Drag-and-Drop Attributes
      "aria-dropeffect": 0,
      "aria-grabbed": 0,
      // Relationship Attributes
      "aria-activedescendant": 0,
      "aria-colcount": 0,
      "aria-colindex": 0,
      "aria-colspan": 0,
      "aria-controls": 0,
      "aria-describedby": 0,
      "aria-errormessage": 0,
      "aria-flowto": 0,
      "aria-labelledby": 0,
      "aria-owns": 0,
      "aria-posinset": 0,
      "aria-rowcount": 0,
      "aria-rowindex": 0,
      "aria-rowspan": 0,
      "aria-setsize": 0
    }, Ps = {}, Lg = new RegExp("^(aria)-[" + ge + "]*$"), Vs = new RegExp("^(aria)[A-Z][" + ge + "]*$");
    function np(e, t) {
      {
        if (Vn.call(Ps, t) && Ps[t])
          return !0;
        if (Vs.test(t)) {
          var i = "aria-" + t.slice(4).toLowerCase(), o = qc.hasOwnProperty(i) ? i : null;
          if (o == null)
            return h("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), Ps[t] = !0, !0;
          if (t !== o)
            return h("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, o), Ps[t] = !0, !0;
        }
        if (Lg.test(t)) {
          var u = t.toLowerCase(), d = qc.hasOwnProperty(u) ? u : null;
          if (d == null)
            return Ps[t] = !0, !1;
          if (t !== d)
            return h("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, d), Ps[t] = !0, !0;
        }
      }
      return !0;
    }
    function Iu(e, t) {
      {
        var i = [];
        for (var o in t) {
          var u = np(e, o);
          u || i.push(o);
        }
        var d = i.map(function(v) {
          return "`" + v + "`";
        }).join(", ");
        i.length === 1 ? h("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", d, e) : i.length > 1 && h("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", d, e);
      }
    }
    function rp(e, t) {
      Ko(e, t) || Iu(e, t);
    }
    var ip = !1;
    function Zc(e, t) {
      {
        if (e !== "input" && e !== "textarea" && e !== "select")
          return;
        t != null && t.value === null && !ip && (ip = !0, e === "select" && t.multiple ? h("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : h("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
      }
    }
    var zl = function() {
    };
    {
      var pr = {}, ap = /^on./, Jc = /^on[^A-Z]/, Rm = new RegExp("^(aria)-[" + ge + "]*$"), km = new RegExp("^(aria)[A-Z][" + ge + "]*$");
      zl = function(e, t, i, o) {
        if (Vn.call(pr, t) && pr[t])
          return !0;
        var u = t.toLowerCase();
        if (u === "onfocusin" || u === "onfocusout")
          return h("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), pr[t] = !0, !0;
        if (o != null) {
          var d = o.registrationNameDependencies, v = o.possibleRegistrationNames;
          if (d.hasOwnProperty(t))
            return !0;
          var S = v.hasOwnProperty(u) ? v[u] : null;
          if (S != null)
            return h("Invalid event handler property `%s`. Did you mean `%s`?", t, S), pr[t] = !0, !0;
          if (ap.test(t))
            return h("Unknown event handler property `%s`. It will be ignored.", t), pr[t] = !0, !0;
        } else if (ap.test(t))
          return Jc.test(t) && h("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), pr[t] = !0, !0;
        if (Rm.test(t) || km.test(t))
          return !0;
        if (u === "innerhtml")
          return h("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), pr[t] = !0, !0;
        if (u === "aria")
          return h("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), pr[t] = !0, !0;
        if (u === "is" && i !== null && i !== void 0 && typeof i != "string")
          return h("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof i), pr[t] = !0, !0;
        if (typeof i == "number" && isNaN(i))
          return h("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), pr[t] = !0, !0;
        var C = on(t), k = C !== null && C.type === $n;
        if (Hu.hasOwnProperty(u)) {
          var _ = Hu[u];
          if (_ !== t)
            return h("Invalid DOM property `%s`. Did you mean `%s`?", t, _), pr[t] = !0, !0;
        } else if (!k && t !== u)
          return h("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, u), pr[t] = !0, !0;
        return typeof i == "boolean" && fn(t, i, C, !1) ? (i ? h('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', i, t, t, i, t) : h('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', i, t, t, i, t, t, t), pr[t] = !0, !0) : k ? !0 : fn(t, i, C, !1) ? (pr[t] = !0, !1) : ((i === "false" || i === "true") && C !== null && C.type === zn && (h("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", i, t, i === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, i), pr[t] = !0), !0);
      };
    }
    var Dm = function(e, t, i) {
      {
        var o = [];
        for (var u in t) {
          var d = zl(e, u, t[u], i);
          d || o.push(u);
        }
        var v = o.map(function(S) {
          return "`" + S + "`";
        }).join(", ");
        o.length === 1 ? h("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", v, e) : o.length > 1 && h("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", v, e);
      }
    };
    function _m(e, t, i) {
      Ko(e, t) || Dm(e, t, i);
    }
    var op = 1, ef = 2, Vi = 4, lp = op | ef | Vi, Ul = null;
    function Ng(e) {
      Ul !== null && h("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), Ul = e;
    }
    function Pg() {
      Ul === null && h("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), Ul = null;
    }
    function Yu(e) {
      return e === Ul;
    }
    function sp(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === lo ? t.parentNode : t;
    }
    var tf = null, Fl = null, $t = null;
    function nf(e) {
      var t = fu(e);
      if (t) {
        if (typeof tf != "function")
          throw new Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
        var i = t.stateNode;
        if (i) {
          var o = $v(i);
          tf(t.stateNode, t.type, o);
        }
      }
    }
    function rf(e) {
      tf = e;
    }
    function zs(e) {
      Fl ? $t ? $t.push(e) : $t = [e] : Fl = e;
    }
    function Mm() {
      return Fl !== null || $t !== null;
    }
    function af() {
      if (Fl) {
        var e = Fl, t = $t;
        if (Fl = null, $t = null, nf(e), t)
          for (var i = 0; i < t.length; i++)
            nf(t[i]);
      }
    }
    var Us = function(e, t) {
      return e(t);
    }, $u = function() {
    }, Qo = !1;
    function Om() {
      var e = Mm();
      e && ($u(), af());
    }
    function Am(e, t, i) {
      if (Qo)
        return e(t, i);
      Qo = !0;
      try {
        return Us(e, t, i);
      } finally {
        Qo = !1, Om();
      }
    }
    function Vg(e, t, i) {
      Us = e, $u = i;
    }
    function Lm(e) {
      return e === "button" || e === "input" || e === "select" || e === "textarea";
    }
    function of(e, t, i) {
      switch (e) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          return !!(i.disabled && Lm(t));
        default:
          return !1;
      }
    }
    function Xo(e, t) {
      var i = e.stateNode;
      if (i === null)
        return null;
      var o = $v(i);
      if (o === null)
        return null;
      var u = o[t];
      if (of(t, e.type, o))
        return null;
      if (u && typeof u != "function")
        throw new Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof u + "` type.");
      return u;
    }
    var Wu = !1;
    if (mn)
      try {
        var jl = {};
        Object.defineProperty(jl, "passive", {
          get: function() {
            Wu = !0;
          }
        }), window.addEventListener("test", jl, jl), window.removeEventListener("test", jl, jl);
      } catch {
        Wu = !1;
      }
    function lf(e, t, i, o, u, d, v, S, C) {
      var k = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(i, k);
      } catch (_) {
        this.onError(_);
      }
    }
    var sf = lf;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var up = document.createElement("react");
      sf = function(t, i, o, u, d, v, S, C, k) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var _ = document.createEvent("Event"), F = !1, z = !0, $ = window.event, G = Object.getOwnPropertyDescriptor(window, "event");
        function Z() {
          up.removeEventListener(J, Ze, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = $);
        }
        var Ae = Array.prototype.slice.call(arguments, 3);
        function Ze() {
          F = !0, Z(), i.apply(o, Ae), z = !1;
        }
        var $e, Pt = !1, Dt = !1;
        function I(Y) {
          if ($e = Y.error, Pt = !0, $e === null && Y.colno === 0 && Y.lineno === 0 && (Dt = !0), Y.defaultPrevented && $e != null && typeof $e == "object")
            try {
              $e._suppressLogging = !0;
            } catch {
            }
        }
        var J = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", I), up.addEventListener(J, Ze, !1), _.initEvent(J, !1, !1), up.dispatchEvent(_), G && Object.defineProperty(window, "event", G), F && z && (Pt ? Dt && ($e = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : $e = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError($e)), window.removeEventListener("error", I), !F)
          return Z(), lf.apply(this, arguments);
      };
    }
    var Nm = sf, Fs = !1, uf = null, js = !1, Ma = null, Pm = {
      onError: function(e) {
        Fs = !0, uf = e;
      }
    };
    function qo(e, t, i, o, u, d, v, S, C) {
      Fs = !1, uf = null, Nm.apply(Pm, arguments);
    }
    function Oa(e, t, i, o, u, d, v, S, C) {
      if (qo.apply(this, arguments), Fs) {
        var k = Ku();
        js || (js = !0, Ma = k);
      }
    }
    function Gu() {
      if (js) {
        var e = Ma;
        throw js = !1, Ma = null, e;
      }
    }
    function uo() {
      return Fs;
    }
    function Ku() {
      if (Fs) {
        var e = uf;
        return Fs = !1, uf = null, e;
      } else
        throw new Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    function Bs(e) {
      return e._reactInternals;
    }
    function zg(e) {
      return e._reactInternals !== void 0;
    }
    function Bl(e, t) {
      e._reactInternals = t;
    }
    var Qe = (
      /*                      */
      0
    ), da = (
      /*                */
      1
    ), Tn = (
      /*                    */
      2
    ), At = (
      /*                       */
      4
    ), zi = (
      /*                */
      16
    ), Ui = (
      /*                 */
      32
    ), sn = (
      /*                     */
      64
    ), Ge = (
      /*                   */
      128
    ), Or = (
      /*            */
      256
    ), Rn = (
      /*                          */
      512
    ), Kn = (
      /*                     */
      1024
    ), ni = (
      /*                      */
      2048
    ), ri = (
      /*                    */
      4096
    ), Fn = (
      /*                   */
      8192
    ), Hs = (
      /*             */
      16384
    ), Vm = (
      /*               */
      32767
    ), Qu = (
      /*                   */
      32768
    ), rr = (
      /*                */
      65536
    ), cf = (
      /* */
      131072
    ), Aa = (
      /*                       */
      1048576
    ), Is = (
      /*                    */
      2097152
    ), co = (
      /*                 */
      4194304
    ), ff = (
      /*                */
      8388608
    ), Zo = (
      /*               */
      16777216
    ), La = (
      /*              */
      33554432
    ), Jo = (
      // TODO: Remove Update flag from before mutation phase by re-landing Visibility
      // flag logic (see #20043)
      At | Kn | 0
    ), el = Tn | At | zi | Ui | Rn | ri | Fn, tl = At | sn | Rn | Fn, fo = ni | zi, jn = co | ff | Is, Fi = c.ReactCurrentOwner;
    function Ei(e) {
      var t = e, i = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var o = t;
        do
          t = o, (t.flags & (Tn | ri)) !== Qe && (i = t.return), o = t.return;
        while (o);
      }
      return t.tag === M ? i : null;
    }
    function Na(e) {
      if (e.tag === ae) {
        var t = e.memoizedState;
        if (t === null) {
          var i = e.alternate;
          i !== null && (t = i.memoizedState);
        }
        if (t !== null)
          return t.dehydrated;
      }
      return null;
    }
    function Pa(e) {
      return e.tag === M ? e.stateNode.containerInfo : null;
    }
    function Hl(e) {
      return Ei(e) === e;
    }
    function zm(e) {
      {
        var t = Fi.current;
        if (t !== null && t.tag === R) {
          var i = t, o = i.stateNode;
          o._warnedAboutRefsInRender || h("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", lt(i) || "A component"), o._warnedAboutRefsInRender = !0;
        }
      }
      var u = Bs(e);
      return u ? Ei(u) === u : !1;
    }
    function df(e) {
      if (Ei(e) !== e)
        throw new Error("Unable to find node on an unmounted component.");
    }
    function pf(e) {
      var t = e.alternate;
      if (!t) {
        var i = Ei(e);
        if (i === null)
          throw new Error("Unable to find node on an unmounted component.");
        return i !== e ? null : e;
      }
      for (var o = e, u = t; ; ) {
        var d = o.return;
        if (d === null)
          break;
        var v = d.alternate;
        if (v === null) {
          var S = d.return;
          if (S !== null) {
            o = u = S;
            continue;
          }
          break;
        }
        if (d.child === v.child) {
          for (var C = d.child; C; ) {
            if (C === o)
              return df(d), e;
            if (C === u)
              return df(d), t;
            C = C.sibling;
          }
          throw new Error("Unable to find node on an unmounted component.");
        }
        if (o.return !== u.return)
          o = d, u = v;
        else {
          for (var k = !1, _ = d.child; _; ) {
            if (_ === o) {
              k = !0, o = d, u = v;
              break;
            }
            if (_ === u) {
              k = !0, u = d, o = v;
              break;
            }
            _ = _.sibling;
          }
          if (!k) {
            for (_ = v.child; _; ) {
              if (_ === o) {
                k = !0, o = v, u = d;
                break;
              }
              if (_ === u) {
                k = !0, u = v, o = d;
                break;
              }
              _ = _.sibling;
            }
            if (!k)
              throw new Error("Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.");
          }
        }
        if (o.alternate !== u)
          throw new Error("Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue.");
      }
      if (o.tag !== M)
        throw new Error("Unable to find node on an unmounted component.");
      return o.stateNode.current === o ? e : t;
    }
    function ii(e) {
      var t = pf(e);
      return t !== null ? ai(t) : null;
    }
    function ai(e) {
      if (e.tag === j || e.tag === q)
        return e;
      for (var t = e.child; t !== null; ) {
        var i = ai(t);
        if (i !== null)
          return i;
        t = t.sibling;
      }
      return null;
    }
    function vn(e) {
      var t = pf(e);
      return t !== null ? ji(t) : null;
    }
    function ji(e) {
      if (e.tag === j || e.tag === q)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== A) {
          var i = ji(t);
          if (i !== null)
            return i;
        }
        t = t.sibling;
      }
      return null;
    }
    var cp = l.unstable_scheduleCallback, Um = l.unstable_cancelCallback, fp = l.unstable_shouldYield, dp = l.unstable_requestPaint, Qn = l.unstable_now, hf = l.unstable_getCurrentPriorityLevel, Xu = l.unstable_ImmediatePriority, nl = l.unstable_UserBlockingPriority, po = l.unstable_NormalPriority, Ug = l.unstable_LowPriority, Ti = l.unstable_IdlePriority, mf = l.unstable_yieldValue, vf = l.unstable_setDisableYieldValue, pa = null, ir = null, we = null, Bi = !1, bi = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function Ys(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return h("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        Ie && (e = kt({}, e, {
          getLaneLabelMap: hp,
          injectProfilingHooks: rl
        })), pa = t.inject(e), ir = t;
      } catch (i) {
        h("React instrumentation encountered an error: %s.", i);
      }
      return !!t.checkDCE;
    }
    function Hi(e, t) {
      if (ir && typeof ir.onScheduleFiberRoot == "function")
        try {
          ir.onScheduleFiberRoot(pa, e, t);
        } catch (i) {
          Bi || (Bi = !0, h("React instrumentation encountered an error: %s", i));
        }
    }
    function Il(e, t) {
      if (ir && typeof ir.onCommitFiberRoot == "function")
        try {
          var i = (e.current.flags & Ge) === Ge;
          if (Ne) {
            var o;
            switch (t) {
              case si:
                o = Xu;
                break;
              case ha:
                o = nl;
                break;
              case ja:
                o = po;
                break;
              case Xl:
                o = Ti;
                break;
              default:
                o = po;
                break;
            }
            ir.onCommitFiberRoot(pa, e, o, i);
          }
        } catch (u) {
          Bi || (Bi = !0, h("React instrumentation encountered an error: %s", u));
        }
    }
    function pp(e) {
      if (ir && typeof ir.onPostCommitFiberRoot == "function")
        try {
          ir.onPostCommitFiberRoot(pa, e);
        } catch (t) {
          Bi || (Bi = !0, h("React instrumentation encountered an error: %s", t));
        }
    }
    function Fm(e) {
      if (ir && typeof ir.onCommitFiberUnmount == "function")
        try {
          ir.onCommitFiberUnmount(pa, e);
        } catch (t) {
          Bi || (Bi = !0, h("React instrumentation encountered an error: %s", t));
        }
    }
    function un(e) {
      if (typeof mf == "function" && (vf(e), g(e)), ir && typeof ir.setStrictMode == "function")
        try {
          ir.setStrictMode(pa, e);
        } catch (t) {
          Bi || (Bi = !0, h("React instrumentation encountered an error: %s", t));
        }
    }
    function rl(e) {
      we = e;
    }
    function hp() {
      {
        for (var e = /* @__PURE__ */ new Map(), t = 1, i = 0; i < Ws; i++) {
          var o = Km(t);
          e.set(t, o), t *= 2;
        }
        return e;
      }
    }
    function jm(e) {
      we !== null && typeof we.markCommitStarted == "function" && we.markCommitStarted(e);
    }
    function Va() {
      we !== null && typeof we.markCommitStopped == "function" && we.markCommitStopped();
    }
    function Ii(e) {
      we !== null && typeof we.markComponentRenderStarted == "function" && we.markComponentRenderStarted(e);
    }
    function ho() {
      we !== null && typeof we.markComponentRenderStopped == "function" && we.markComponentRenderStopped();
    }
    function Bm(e) {
      we !== null && typeof we.markComponentPassiveEffectMountStarted == "function" && we.markComponentPassiveEffectMountStarted(e);
    }
    function yf() {
      we !== null && typeof we.markComponentPassiveEffectMountStopped == "function" && we.markComponentPassiveEffectMountStopped();
    }
    function Hm(e) {
      we !== null && typeof we.markComponentPassiveEffectUnmountStarted == "function" && we.markComponentPassiveEffectUnmountStarted(e);
    }
    function Im() {
      we !== null && typeof we.markComponentPassiveEffectUnmountStopped == "function" && we.markComponentPassiveEffectUnmountStopped();
    }
    function mp(e) {
      we !== null && typeof we.markComponentLayoutEffectMountStarted == "function" && we.markComponentLayoutEffectMountStarted(e);
    }
    function gf() {
      we !== null && typeof we.markComponentLayoutEffectMountStopped == "function" && we.markComponentLayoutEffectMountStopped();
    }
    function vp(e) {
      we !== null && typeof we.markComponentLayoutEffectUnmountStarted == "function" && we.markComponentLayoutEffectUnmountStarted(e);
    }
    function yp() {
      we !== null && typeof we.markComponentLayoutEffectUnmountStopped == "function" && we.markComponentLayoutEffectUnmountStopped();
    }
    function Ym(e, t, i) {
      we !== null && typeof we.markComponentErrored == "function" && we.markComponentErrored(e, t, i);
    }
    function gp(e, t, i) {
      we !== null && typeof we.markComponentSuspended == "function" && we.markComponentSuspended(e, t, i);
    }
    function qu(e) {
      we !== null && typeof we.markLayoutEffectsStarted == "function" && we.markLayoutEffectsStarted(e);
    }
    function Sf() {
      we !== null && typeof we.markLayoutEffectsStopped == "function" && we.markLayoutEffectsStopped();
    }
    function $m(e) {
      we !== null && typeof we.markPassiveEffectsStarted == "function" && we.markPassiveEffectsStarted(e);
    }
    function Wm() {
      we !== null && typeof we.markPassiveEffectsStopped == "function" && we.markPassiveEffectsStopped();
    }
    function Yl(e) {
      we !== null && typeof we.markRenderStarted == "function" && we.markRenderStarted(e);
    }
    function Gm() {
      we !== null && typeof we.markRenderYielded == "function" && we.markRenderYielded();
    }
    function $s() {
      we !== null && typeof we.markRenderStopped == "function" && we.markRenderStopped();
    }
    function za(e) {
      we !== null && typeof we.markRenderScheduled == "function" && we.markRenderScheduled(e);
    }
    function Zu(e, t) {
      we !== null && typeof we.markForceUpdateScheduled == "function" && we.markForceUpdateScheduled(e, t);
    }
    function $l(e, t) {
      we !== null && typeof we.markStateUpdateScheduled == "function" && we.markStateUpdateScheduled(e, t);
    }
    var Ke = (
      /*                         */
      0
    ), wt = (
      /*                 */
      1
    ), Lt = (
      /*                    */
      2
    ), Mn = (
      /*               */
      8
    ), Yi = (
      /*              */
      16
    ), yn = Math.clz32 ? Math.clz32 : Cp, Cf = Math.log, Sp = Math.LN2;
    function Cp(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (Cf(t) / Sp | 0) | 0;
    }
    var Ws = 31, oe = (
      /*                        */
      0
    ), gn = (
      /*                          */
      0
    ), _e = (
      /*                        */
      1
    ), Sn = (
      /*    */
      2
    ), cn = (
      /*             */
      4
    ), Ua = (
      /*            */
      8
    ), oi = (
      /*                     */
      16
    ), mo = (
      /*                */
      32
    ), Gs = (
      /*                       */
      4194240
    ), Bn = (
      /*                        */
      64
    ), Ju = (
      /*                        */
      128
    ), ec = (
      /*                        */
      256
    ), tc = (
      /*                        */
      512
    ), $i = (
      /*                        */
      1024
    ), li = (
      /*                        */
      2048
    ), Wl = (
      /*                        */
      4096
    ), nc = (
      /*                        */
      8192
    ), rc = (
      /*                        */
      16384
    ), Ef = (
      /*                       */
      32768
    ), Tf = (
      /*                       */
      65536
    ), bf = (
      /*                       */
      131072
    ), xf = (
      /*                       */
      262144
    ), wf = (
      /*                       */
      524288
    ), Rf = (
      /*                       */
      1048576
    ), kf = (
      /*                       */
      2097152
    ), ic = (
      /*                            */
      130023424
    ), Fa = (
      /*                             */
      4194304
    ), Df = (
      /*                             */
      8388608
    ), Ks = (
      /*                             */
      16777216
    ), Qs = (
      /*                             */
      33554432
    ), _f = (
      /*                             */
      67108864
    ), Mf = Fa, Xs = (
      /*          */
      134217728
    ), Ep = (
      /*                          */
      268435455
    ), qs = (
      /*               */
      268435456
    ), il = (
      /*                        */
      536870912
    ), Hr = (
      /*                   */
      1073741824
    );
    function Km(e) {
      {
        if (e & _e)
          return "Sync";
        if (e & Sn)
          return "InputContinuousHydration";
        if (e & cn)
          return "InputContinuous";
        if (e & Ua)
          return "DefaultHydration";
        if (e & oi)
          return "Default";
        if (e & mo)
          return "TransitionHydration";
        if (e & Gs)
          return "Transition";
        if (e & ic)
          return "Retry";
        if (e & Xs)
          return "SelectiveHydration";
        if (e & qs)
          return "IdleHydration";
        if (e & il)
          return "Idle";
        if (e & Hr)
          return "Offscreen";
      }
    }
    var nn = -1, ac = Bn, Of = Fa;
    function Zs(e) {
      switch (al(e)) {
        case _e:
          return _e;
        case Sn:
          return Sn;
        case cn:
          return cn;
        case Ua:
          return Ua;
        case oi:
          return oi;
        case mo:
          return mo;
        case Bn:
        case Ju:
        case ec:
        case tc:
        case $i:
        case li:
        case Wl:
        case nc:
        case rc:
        case Ef:
        case Tf:
        case bf:
        case xf:
        case wf:
        case Rf:
        case kf:
          return e & Gs;
        case Fa:
        case Df:
        case Ks:
        case Qs:
        case _f:
          return e & ic;
        case Xs:
          return Xs;
        case qs:
          return qs;
        case il:
          return il;
        case Hr:
          return Hr;
        default:
          return h("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function Af(e, t) {
      var i = e.pendingLanes;
      if (i === oe)
        return oe;
      var o = oe, u = e.suspendedLanes, d = e.pingedLanes, v = i & Ep;
      if (v !== oe) {
        var S = v & ~u;
        if (S !== oe)
          o = Zs(S);
        else {
          var C = v & d;
          C !== oe && (o = Zs(C));
        }
      } else {
        var k = i & ~u;
        k !== oe ? o = Zs(k) : d !== oe && (o = Zs(d));
      }
      if (o === oe)
        return oe;
      if (t !== oe && t !== o && // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (t & u) === oe) {
        var _ = al(o), F = al(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          _ >= F || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          _ === oi && (F & Gs) !== oe
        )
          return t;
      }
      (o & cn) !== oe && (o |= i & oi);
      var z = e.entangledLanes;
      if (z !== oe)
        for (var $ = e.entanglements, G = o & z; G > 0; ) {
          var Z = Gl(G), Ae = 1 << Z;
          o |= $[Z], G &= ~Ae;
        }
      return o;
    }
    function Fg(e, t) {
      for (var i = e.eventTimes, o = nn; t > 0; ) {
        var u = Gl(t), d = 1 << u, v = i[u];
        v > o && (o = v), t &= ~d;
      }
      return o;
    }
    function Qm(e, t) {
      switch (e) {
        case _e:
        case Sn:
        case cn:
          return t + 250;
        case Ua:
        case oi:
        case mo:
        case Bn:
        case Ju:
        case ec:
        case tc:
        case $i:
        case li:
        case Wl:
        case nc:
        case rc:
        case Ef:
        case Tf:
        case bf:
        case xf:
        case wf:
        case Rf:
        case kf:
          return t + 5e3;
        case Fa:
        case Df:
        case Ks:
        case Qs:
        case _f:
          return nn;
        case Xs:
        case qs:
        case il:
        case Hr:
          return nn;
        default:
          return h("Should have found matching lanes. This is a bug in React."), nn;
      }
    }
    function Xm(e, t) {
      for (var i = e.pendingLanes, o = e.suspendedLanes, u = e.pingedLanes, d = e.expirationTimes, v = i; v > 0; ) {
        var S = Gl(v), C = 1 << S, k = d[S];
        k === nn ? ((C & o) === oe || (C & u) !== oe) && (d[S] = Qm(C, t)) : k <= t && (e.expiredLanes |= C), v &= ~C;
      }
    }
    function qm(e) {
      return Zs(e.pendingLanes);
    }
    function Js(e) {
      var t = e.pendingLanes & ~Hr;
      return t !== oe ? t : t & Hr ? Hr : oe;
    }
    function jg(e) {
      return (e & _e) !== oe;
    }
    function Tp(e) {
      return (e & Ep) !== oe;
    }
    function Zm(e) {
      return (e & ic) === e;
    }
    function eu(e) {
      var t = _e | cn | oi;
      return (e & t) === oe;
    }
    function bp(e) {
      return (e & Gs) === e;
    }
    function tu(e, t) {
      var i = Sn | cn | Ua | oi;
      return (t & i) !== oe;
    }
    function Bg(e, t) {
      return (t & e.expiredLanes) !== oe;
    }
    function xp(e) {
      return (e & Gs) !== oe;
    }
    function wp() {
      var e = ac;
      return ac <<= 1, (ac & Gs) === oe && (ac = Bn), e;
    }
    function Jm() {
      var e = Of;
      return Of <<= 1, (Of & ic) === oe && (Of = Fa), e;
    }
    function al(e) {
      return e & -e;
    }
    function nu(e) {
      return al(e);
    }
    function Gl(e) {
      return 31 - yn(e);
    }
    function Ar(e) {
      return Gl(e);
    }
    function rn(e, t) {
      return (e & t) !== oe;
    }
    function Kl(e, t) {
      return (e & t) === t;
    }
    function vt(e, t) {
      return e | t;
    }
    function oc(e, t) {
      return e & ~t;
    }
    function Rp(e, t) {
      return e & t;
    }
    function Hg(e) {
      return e;
    }
    function kp(e, t) {
      return e !== gn && e < t ? e : t;
    }
    function Lf(e) {
      for (var t = [], i = 0; i < Ws; i++)
        t.push(e);
      return t;
    }
    function Ql(e, t, i) {
      e.pendingLanes |= t, t !== il && (e.suspendedLanes = oe, e.pingedLanes = oe);
      var o = e.eventTimes, u = Ar(t);
      o[u] = i;
    }
    function ev(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var i = e.expirationTimes, o = t; o > 0; ) {
        var u = Gl(o), d = 1 << u;
        i[u] = nn, o &= ~d;
      }
    }
    function Dp(e, t, i) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function _p(e, t) {
      var i = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = oe, e.pingedLanes = oe, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var o = e.entanglements, u = e.eventTimes, d = e.expirationTimes, v = i; v > 0; ) {
        var S = Gl(v), C = 1 << S;
        o[S] = oe, u[S] = nn, d[S] = nn, v &= ~C;
      }
    }
    function lc(e, t) {
      for (var i = e.entangledLanes |= t, o = e.entanglements, u = i; u; ) {
        var d = Gl(u), v = 1 << d;
        // Is this one of the newly entangled lanes?
        v & t | // Is this lane transitively entangled with the newly entangled lanes?
        o[d] & t && (o[d] |= t), u &= ~v;
      }
    }
    function tv(e, t) {
      var i = al(t), o;
      switch (i) {
        case cn:
          o = Sn;
          break;
        case oi:
          o = Ua;
          break;
        case Bn:
        case Ju:
        case ec:
        case tc:
        case $i:
        case li:
        case Wl:
        case nc:
        case rc:
        case Ef:
        case Tf:
        case bf:
        case xf:
        case wf:
        case Rf:
        case kf:
        case Fa:
        case Df:
        case Ks:
        case Qs:
        case _f:
          o = mo;
          break;
        case il:
          o = qs;
          break;
        default:
          o = gn;
          break;
      }
      return (o & (e.suspendedLanes | t)) !== gn ? gn : o;
    }
    function Nf(e, t, i) {
      if (bi)
        for (var o = e.pendingUpdatersLaneMap; i > 0; ) {
          var u = Ar(i), d = 1 << u, v = o[u];
          v.add(t), i &= ~d;
        }
    }
    function sc(e, t) {
      if (bi)
        for (var i = e.pendingUpdatersLaneMap, o = e.memoizedUpdaters; t > 0; ) {
          var u = Ar(t), d = 1 << u, v = i[u];
          v.size > 0 && (v.forEach(function(S) {
            var C = S.alternate;
            (C === null || !o.has(C)) && o.add(S);
          }), v.clear()), t &= ~d;
        }
    }
    function nv(e, t) {
      return null;
    }
    var si = _e, ha = cn, ja = oi, Xl = il, xi = gn;
    function ma() {
      return xi;
    }
    function Xn(e) {
      xi = e;
    }
    function Mp(e, t) {
      var i = xi;
      try {
        return xi = e, t();
      } finally {
        xi = i;
      }
    }
    function rv(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function iv(e, t) {
      return e > t ? e : t;
    }
    function ql(e, t) {
      return e !== 0 && e < t;
    }
    function hr(e) {
      var t = al(e);
      return ql(si, t) ? ql(ha, t) ? Tp(t) ? ja : Xl : ha : si;
    }
    function Pf(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var av;
    function Vf(e) {
      av = e;
    }
    function Lr(e) {
      av(e);
    }
    var Op;
    function Pe(e) {
      Op = e;
    }
    var Zl;
    function Ap(e) {
      Zl = e;
    }
    var Lp;
    function Ig(e) {
      Lp = e;
    }
    var ru;
    function zf(e) {
      ru = e;
    }
    var uc = !1, cc = [], vo = null, yo = null, Ba = null, Jl = /* @__PURE__ */ new Map(), On = /* @__PURE__ */ new Map(), ar = [], ol = [
      "mousedown",
      "mouseup",
      "touchcancel",
      "touchend",
      "touchstart",
      "auxclick",
      "dblclick",
      "pointercancel",
      "pointerdown",
      "pointerup",
      "dragend",
      "dragstart",
      "drop",
      "compositionend",
      "compositionstart",
      "keydown",
      "keypress",
      "keyup",
      "input",
      "textInput",
      // Intentionally camelCase
      "copy",
      "cut",
      "paste",
      "click",
      "change",
      "contextmenu",
      "reset",
      "submit"
    ];
    function ov(e) {
      return ol.indexOf(e) > -1;
    }
    function lv(e, t, i, o, u) {
      return {
        blockedOn: e,
        domEventName: t,
        eventSystemFlags: i,
        nativeEvent: u,
        targetContainers: [o]
      };
    }
    function Wi(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          vo = null;
          break;
        case "dragenter":
        case "dragleave":
          yo = null;
          break;
        case "mouseover":
        case "mouseout":
          Ba = null;
          break;
        case "pointerover":
        case "pointerout": {
          var i = t.pointerId;
          Jl.delete(i);
          break;
        }
        case "gotpointercapture":
        case "lostpointercapture": {
          var o = t.pointerId;
          On.delete(o);
          break;
        }
      }
    }
    function iu(e, t, i, o, u, d) {
      if (e === null || e.nativeEvent !== d) {
        var v = lv(t, i, o, u, d);
        if (t !== null) {
          var S = fu(t);
          S !== null && Op(S);
        }
        return v;
      }
      e.eventSystemFlags |= o;
      var C = e.targetContainers;
      return u !== null && C.indexOf(u) === -1 && C.push(u), e;
    }
    function Ha(e, t, i, o, u) {
      switch (t) {
        case "focusin": {
          var d = u;
          return vo = iu(vo, e, t, i, o, d), !0;
        }
        case "dragenter": {
          var v = u;
          return yo = iu(yo, e, t, i, o, v), !0;
        }
        case "mouseover": {
          var S = u;
          return Ba = iu(Ba, e, t, i, o, S), !0;
        }
        case "pointerover": {
          var C = u, k = C.pointerId;
          return Jl.set(k, iu(Jl.get(k) || null, e, t, i, o, C)), !0;
        }
        case "gotpointercapture": {
          var _ = u, F = _.pointerId;
          return On.set(F, iu(On.get(F) || null, e, t, i, o, _)), !0;
        }
      }
      return !1;
    }
    function sv(e) {
      var t = Ec(e.target);
      if (t !== null) {
        var i = Ei(t);
        if (i !== null) {
          var o = i.tag;
          if (o === ae) {
            var u = Na(i);
            if (u !== null) {
              e.blockedOn = u, ru(e.priority, function() {
                Zl(i);
              });
              return;
            }
          } else if (o === M) {
            var d = i.stateNode;
            if (Pf(d)) {
              e.blockedOn = Pa(i);
              return;
            }
          }
        }
      }
      e.blockedOn = null;
    }
    function uv(e) {
      for (var t = Lp(), i = {
        blockedOn: null,
        target: e,
        priority: t
      }, o = 0; o < ar.length && ql(t, ar[o].priority); o++)
        ;
      ar.splice(o, 0, i), o === 0 && sv(i);
    }
    function fc(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0; ) {
        var i = t[0], o = go(e.domEventName, e.eventSystemFlags, i, e.nativeEvent);
        if (o === null) {
          var u = e.nativeEvent, d = new u.constructor(u.type, u);
          Ng(d), u.target.dispatchEvent(d), Pg();
        } else {
          var v = fu(o);
          return v !== null && Op(v), e.blockedOn = o, !1;
        }
        t.shift();
      }
      return !0;
    }
    function Np(e, t, i) {
      fc(e) && i.delete(t);
    }
    function cv() {
      uc = !1, vo !== null && fc(vo) && (vo = null), yo !== null && fc(yo) && (yo = null), Ba !== null && fc(Ba) && (Ba = null), Jl.forEach(Np), On.forEach(Np);
    }
    function dc(e, t) {
      e.blockedOn === t && (e.blockedOn = null, uc || (uc = !0, l.unstable_scheduleCallback(l.unstable_NormalPriority, cv)));
    }
    function ll(e) {
      if (cc.length > 0) {
        dc(cc[0], e);
        for (var t = 1; t < cc.length; t++) {
          var i = cc[t];
          i.blockedOn === e && (i.blockedOn = null);
        }
      }
      vo !== null && dc(vo, e), yo !== null && dc(yo, e), Ba !== null && dc(Ba, e);
      var o = function(S) {
        return dc(S, e);
      };
      Jl.forEach(o), On.forEach(o);
      for (var u = 0; u < ar.length; u++) {
        var d = ar[u];
        d.blockedOn === e && (d.blockedOn = null);
      }
      for (; ar.length > 0; ) {
        var v = ar[0];
        if (v.blockedOn !== null)
          break;
        sv(v), v.blockedOn === null && ar.shift();
      }
    }
    var sl = c.ReactCurrentBatchConfig, ui = !0;
    function Ut(e) {
      ui = !!e;
    }
    function or() {
      return ui;
    }
    function Hn(e, t, i) {
      var o = pc(t), u;
      switch (o) {
        case si:
          u = mr;
          break;
        case ha:
          u = wi;
          break;
        case ja:
        default:
          u = ul;
          break;
      }
      return u.bind(null, t, i, e);
    }
    function mr(e, t, i, o) {
      var u = ma(), d = sl.transition;
      sl.transition = null;
      try {
        Xn(si), ul(e, t, i, o);
      } finally {
        Xn(u), sl.transition = d;
      }
    }
    function wi(e, t, i, o) {
      var u = ma(), d = sl.transition;
      sl.transition = null;
      try {
        Xn(ha), ul(e, t, i, o);
      } finally {
        Xn(u), sl.transition = d;
      }
    }
    function ul(e, t, i, o) {
      ui && qn(e, t, i, o);
    }
    function qn(e, t, i, o) {
      var u = go(e, t, i, o);
      if (u === null) {
        rS(e, t, o, cl, i), Wi(e, o);
        return;
      }
      if (Ha(u, e, t, i, o)) {
        o.stopPropagation();
        return;
      }
      if (Wi(e, o), t & Vi && ov(e)) {
        for (; u !== null; ) {
          var d = fu(u);
          d !== null && Lr(d);
          var v = go(e, t, i, o);
          if (v === null && rS(e, t, o, cl, i), v === u)
            break;
          u = v;
        }
        u !== null && o.stopPropagation();
        return;
      }
      rS(e, t, o, null, i);
    }
    var cl = null;
    function go(e, t, i, o) {
      cl = null;
      var u = sp(o), d = Ec(u);
      if (d !== null) {
        var v = Ei(d);
        if (v === null)
          d = null;
        else {
          var S = v.tag;
          if (S === ae) {
            var C = Na(v);
            if (C !== null)
              return C;
            d = null;
          } else if (S === M) {
            var k = v.stateNode;
            if (Pf(k))
              return Pa(v);
            d = null;
          } else v !== d && (d = null);
        }
      }
      return cl = d, null;
    }
    function pc(e) {
      switch (e) {
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return si;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "toggle":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return ha;
        case "message": {
          var t = hf();
          switch (t) {
            case Xu:
              return si;
            case nl:
              return ha;
            case po:
            case Ug:
              return ja;
            case Ti:
              return Xl;
            default:
              return ja;
          }
        }
        default:
          return ja;
      }
    }
    function Pp(e, t, i) {
      return e.addEventListener(t, i, !1), i;
    }
    function hc(e, t, i) {
      return e.addEventListener(t, i, !0), i;
    }
    function ci(e, t, i, o) {
      return e.addEventListener(t, i, {
        capture: !0,
        passive: o
      }), i;
    }
    function Vp(e, t, i, o) {
      return e.addEventListener(t, i, {
        passive: o
      }), i;
    }
    var Ia = null, va = null, fl = null;
    function zp(e) {
      return Ia = e, va = So(), !0;
    }
    function dl() {
      Ia = null, va = null, fl = null;
    }
    function mc() {
      if (fl)
        return fl;
      var e, t = va, i = t.length, o, u = So(), d = u.length;
      for (e = 0; e < i && t[e] === u[e]; e++)
        ;
      var v = i - e;
      for (o = 1; o <= v && t[i - o] === u[d - o]; o++)
        ;
      var S = o > 1 ? 1 - o : void 0;
      return fl = u.slice(e, S), fl;
    }
    function So() {
      return "value" in Ia ? Ia.value : Ia.textContent;
    }
    function es(e) {
      var t, i = e.keyCode;
      return "charCode" in e ? (t = e.charCode, t === 0 && i === 13 && (t = 13)) : t = i, t === 10 && (t = 13), t >= 32 || t === 13 ? t : 0;
    }
    function pl() {
      return !0;
    }
    function Uf() {
      return !1;
    }
    function Nr(e) {
      function t(i, o, u, d, v) {
        this._reactName = i, this._targetInst = u, this.type = o, this.nativeEvent = d, this.target = v, this.currentTarget = null;
        for (var S in e)
          if (e.hasOwnProperty(S)) {
            var C = e[S];
            C ? this[S] = C(d) : this[S] = d[S];
          }
        var k = d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === !1;
        return k ? this.isDefaultPrevented = pl : this.isDefaultPrevented = Uf, this.isPropagationStopped = Uf, this;
      }
      return kt(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var i = this.nativeEvent;
          i && (i.preventDefault ? i.preventDefault() : typeof i.returnValue != "unknown" && (i.returnValue = !1), this.isDefaultPrevented = pl);
        },
        stopPropagation: function() {
          var i = this.nativeEvent;
          i && (i.stopPropagation ? i.stopPropagation() : typeof i.cancelBubble != "unknown" && (i.cancelBubble = !0), this.isPropagationStopped = pl);
        },
        /**
         * We release all dispatched `SyntheticEvent`s after each event loop, adding
         * them back into the pool. This allows a way to hold onto a reference that
         * won't be added back into the pool.
         */
        persist: function() {
        },
        /**
         * Checks if this event should be released back into the pool.
         *
         * @return {boolean} True if this should not be released, false otherwise.
         */
        isPersistent: pl
      }), t;
    }
    var Co = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, vr = Nr(Co), Gi = kt({}, Co, {
      view: 0,
      detail: 0
    }), ya = Nr(Gi), Pr, Ff, ts;
    function Up(e) {
      e !== ts && (ts && e.type === "mousemove" ? (Pr = e.screenX - ts.screenX, Ff = e.screenY - ts.screenY) : (Pr = 0, Ff = 0), ts = e);
    }
    var jf = kt({}, Gi, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: Hf,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        return "movementX" in e ? e.movementX : (Up(e), Pr);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Ff;
      }
    }), Eo = Nr(jf), fv = kt({}, jf, {
      dataTransfer: 0
    }), Fp = Nr(fv), ns = kt({}, Gi, {
      relatedTarget: 0
    }), vc = Nr(ns), rs = kt({}, Co, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), dv = Nr(rs), pv = kt({}, Co, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), jp = Nr(pv), Bf = kt({}, Co, {
      data: 0
    }), hv = Nr(Bf), Yg = hv, mv = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified"
    }, vv = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta"
    };
    function is(e) {
      if (e.key) {
        var t = mv[e.key] || e.key;
        if (t !== "Unidentified")
          return t;
      }
      if (e.type === "keypress") {
        var i = es(e);
        return i === 13 ? "Enter" : String.fromCharCode(i);
      }
      return e.type === "keydown" || e.type === "keyup" ? vv[e.keyCode] || "Unidentified" : "";
    }
    var $g = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function au(e) {
      var t = this, i = t.nativeEvent;
      if (i.getModifierState)
        return i.getModifierState(e);
      var o = $g[e];
      return o ? !!i[o] : !1;
    }
    function Hf(e) {
      return au;
    }
    var kn = kt({}, Gi, {
      key: is,
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: Hf,
      // Legacy Interface
      charCode: function(e) {
        return e.type === "keypress" ? es(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? es(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), Wg = Nr(kn), yv = kt({}, jf, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0
    }), gv = Nr(yv), Gg = kt({}, Gi, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Hf
    }), Sv = Nr(Gg), Cv = kt({}, Co, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), Kg = Nr(Cv), Ki = kt({}, jf, {
      deltaX: function(e) {
        return "deltaX" in e ? e.deltaX : (
          // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
          "wheelDeltaX" in e ? -e.wheelDeltaX : 0
        );
      },
      deltaY: function(e) {
        return "deltaY" in e ? e.deltaY : (
          // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
          "wheelDeltaY" in e ? -e.wheelDeltaY : (
            // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
            "wheelDelta" in e ? -e.wheelDelta : 0
          )
        );
      },
      deltaZ: 0,
      // Browsers without "deltaMode" is reporting in raw wheel delta where one
      // notch on the scroll is always +/- 120, roughly equivalent to pixels.
      // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
      // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
      deltaMode: 0
    }), Bp = Nr(Ki), Qg = [9, 13, 27, 32], To = 229, ou = mn && "CompositionEvent" in window, ga = null;
    mn && "documentMode" in document && (ga = document.documentMode);
    var If = mn && "TextEvent" in window && !ga, Yf = mn && (!ou || ga && ga > 8 && ga <= 11), $f = 32, Ev = String.fromCharCode($f);
    function Hp() {
      Ot("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), Ot("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), Ot("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), Ot("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
    }
    var Tv = !1;
    function bv(e) {
      return (e.ctrlKey || e.altKey || e.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
      !(e.ctrlKey && e.altKey);
    }
    function xv(e) {
      switch (e) {
        case "compositionstart":
          return "onCompositionStart";
        case "compositionend":
          return "onCompositionEnd";
        case "compositionupdate":
          return "onCompositionUpdate";
      }
    }
    function Wf(e, t) {
      return e === "keydown" && t.keyCode === To;
    }
    function yc(e, t) {
      switch (e) {
        case "keyup":
          return Qg.indexOf(t.keyCode) !== -1;
        case "keydown":
          return t.keyCode !== To;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function Ip(e) {
      var t = e.detail;
      return typeof t == "object" && "data" in t ? t.data : null;
    }
    function Gf(e) {
      return e.locale === "ko";
    }
    var lu = !1;
    function wv(e, t, i, o, u) {
      var d, v;
      if (ou ? d = xv(t) : lu ? yc(t, o) && (d = "onCompositionEnd") : Wf(t, o) && (d = "onCompositionStart"), !d)
        return null;
      Yf && !Gf(o) && (!lu && d === "onCompositionStart" ? lu = zp(u) : d === "onCompositionEnd" && lu && (v = mc()));
      var S = Av(i, d);
      if (S.length > 0) {
        var C = new hv(d, t, null, o, u);
        if (e.push({
          event: C,
          listeners: S
        }), v)
          C.data = v;
        else {
          var k = Ip(o);
          k !== null && (C.data = k);
        }
      }
    }
    function Yp(e, t) {
      switch (e) {
        case "compositionend":
          return Ip(t);
        case "keypress":
          var i = t.which;
          return i !== $f ? null : (Tv = !0, Ev);
        case "textInput":
          var o = t.data;
          return o === Ev && Tv ? null : o;
        default:
          return null;
      }
    }
    function Kf(e, t) {
      if (lu) {
        if (e === "compositionend" || !ou && yc(e, t)) {
          var i = mc();
          return dl(), lu = !1, i;
        }
        return null;
      }
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!bv(t)) {
            if (t.char && t.char.length > 1)
              return t.char;
            if (t.which)
              return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return Yf && !Gf(t) ? null : t.data;
        default:
          return null;
      }
    }
    function $p(e, t, i, o, u) {
      var d;
      if (If ? d = Yp(t, o) : d = Kf(t, o), !d)
        return null;
      var v = Av(i, "onBeforeInput");
      if (v.length > 0) {
        var S = new Yg("onBeforeInput", "beforeinput", null, o, u);
        e.push({
          event: S,
          listeners: v
        }), S.data = d;
      }
    }
    function Qf(e, t, i, o, u, d, v) {
      wv(e, t, i, o, u), $p(e, t, i, o, u);
    }
    var Rv = {
      color: !0,
      date: !0,
      datetime: !0,
      "datetime-local": !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0
    };
    function kv(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!Rv[e.type] : t === "textarea";
    }
    /**
     * Checks if an event is supported in the current execution environment.
     *
     * NOTE: This will not work correctly for non-generic events such as `change`,
     * `reset`, `load`, `error`, and `select`.
     *
     * Borrows from Modernizr.
     *
     * @param {string} eventNameSuffix Event name, e.g. "click".
     * @return {boolean} True if the event is supported.
     * @internal
     * @license Modernizr 3.0.0pre (Custom Build) | MIT
     */
    function Xf(e) {
      if (!mn)
        return !1;
      var t = "on" + e, i = t in document;
      if (!i) {
        var o = document.createElement("div");
        o.setAttribute(t, "return;"), i = typeof o[t] == "function";
      }
      return i;
    }
    function Xg() {
      Ot("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function su(e, t, i, o) {
      zs(o);
      var u = Av(t, "onChange");
      if (u.length > 0) {
        var d = new vr("onChange", "change", null, i, o);
        e.push({
          event: d,
          listeners: u
        });
      }
    }
    var gc = null, hl = null;
    function n(e) {
      var t = e.nodeName && e.nodeName.toLowerCase();
      return t === "select" || t === "input" && e.type === "file";
    }
    function r(e) {
      var t = [];
      su(t, hl, e, sp(e)), Am(s, t);
    }
    function s(e) {
      xT(e, 0);
    }
    function f(e) {
      var t = nd(e);
      if (io(t))
        return e;
    }
    function m(e, t) {
      if (e === "change")
        return t;
    }
    var y = !1;
    mn && (y = Xf("input") && (!document.documentMode || document.documentMode > 9));
    function w(e, t) {
      gc = e, hl = t, gc.attachEvent("onpropertychange", V);
    }
    function O() {
      gc && (gc.detachEvent("onpropertychange", V), gc = null, hl = null);
    }
    function V(e) {
      e.propertyName === "value" && f(hl) && r(e);
    }
    function Q(e, t, i) {
      e === "focusin" ? (O(), w(t, i)) : e === "focusout" && O();
    }
    function fe(e, t) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return f(hl);
    }
    function de(e) {
      var t = e.nodeName;
      return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
    }
    function se(e, t) {
      if (e === "click")
        return f(t);
    }
    function Me(e, t) {
      if (e === "input" || e === "change")
        return f(t);
    }
    function Ve(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || qe(e, "number", e.value);
    }
    function Fe(e, t, i, o, u, d, v) {
      var S = i ? nd(i) : window, C, k;
      if (n(S) ? C = m : kv(S) ? y ? C = Me : (C = fe, k = Q) : de(S) && (C = se), C) {
        var _ = C(t, i);
        if (_) {
          su(e, _, o, u);
          return;
        }
      }
      k && k(t, S, i), t === "focusout" && Ve(S);
    }
    function An() {
      wn("onMouseEnter", ["mouseout", "mouseover"]), wn("onMouseLeave", ["mouseout", "mouseover"]), wn("onPointerEnter", ["pointerout", "pointerover"]), wn("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function H(e, t, i, o, u, d, v) {
      var S = t === "mouseover" || t === "pointerover", C = t === "mouseout" || t === "pointerout";
      if (S && !Yu(o)) {
        var k = o.relatedTarget || o.fromElement;
        if (k && (Ec(k) || ah(k)))
          return;
      }
      if (!(!C && !S)) {
        var _;
        if (u.window === u)
          _ = u;
        else {
          var F = u.ownerDocument;
          F ? _ = F.defaultView || F.parentWindow : _ = window;
        }
        var z, $;
        if (C) {
          var G = o.relatedTarget || o.toElement;
          if (z = i, $ = G ? Ec(G) : null, $ !== null) {
            var Z = Ei($);
            ($ !== Z || $.tag !== j && $.tag !== q) && ($ = null);
          }
        } else
          z = null, $ = i;
        if (z !== $) {
          var Ae = Eo, Ze = "onMouseLeave", $e = "onMouseEnter", Pt = "mouse";
          (t === "pointerout" || t === "pointerover") && (Ae = gv, Ze = "onPointerLeave", $e = "onPointerEnter", Pt = "pointer");
          var Dt = z == null ? _ : nd(z), I = $ == null ? _ : nd($), J = new Ae(Ze, Pt + "leave", z, o, u);
          J.target = Dt, J.relatedTarget = I;
          var Y = null, pe = Ec(u);
          if (pe === i) {
            var Le = new Ae($e, Pt + "enter", $, o, u);
            Le.target = I, Le.relatedTarget = Dt, Y = Le;
          }
          PD(e, J, Y, z, $);
        }
      }
    }
    function U(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var B = typeof Object.is == "function" ? Object.is : U;
    function me(e, t) {
      if (B(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var i = Object.keys(e), o = Object.keys(t);
      if (i.length !== o.length)
        return !1;
      for (var u = 0; u < i.length; u++) {
        var d = i[u];
        if (!Vn.call(t, d) || !B(e[d], t[d]))
          return !1;
      }
      return !0;
    }
    function He(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function rt(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function tt(e, t) {
      for (var i = He(e), o = 0, u = 0; i; ) {
        if (i.nodeType === lo) {
          if (u = o + i.textContent.length, o <= t && u >= t)
            return {
              node: i,
              offset: t - o
            };
          o = u;
        }
        i = He(rt(i));
      }
    }
    function st(e) {
      var t = e.ownerDocument, i = t && t.defaultView || window, o = i.getSelection && i.getSelection();
      if (!o || o.rangeCount === 0)
        return null;
      var u = o.anchorNode, d = o.anchorOffset, v = o.focusNode, S = o.focusOffset;
      try {
        u.nodeType, v.nodeType;
      } catch {
        return null;
      }
      return lr(e, u, d, v, S);
    }
    function lr(e, t, i, o, u) {
      var d = 0, v = -1, S = -1, C = 0, k = 0, _ = e, F = null;
      e: for (; ; ) {
        for (var z = null; _ === t && (i === 0 || _.nodeType === lo) && (v = d + i), _ === o && (u === 0 || _.nodeType === lo) && (S = d + u), _.nodeType === lo && (d += _.nodeValue.length), (z = _.firstChild) !== null; )
          F = _, _ = z;
        for (; ; ) {
          if (_ === e)
            break e;
          if (F === t && ++C === i && (v = d), F === o && ++k === u && (S = d), (z = _.nextSibling) !== null)
            break;
          _ = F, F = _.parentNode;
        }
        _ = z;
      }
      return v === -1 || S === -1 ? null : {
        start: v,
        end: S
      };
    }
    function Bt(e, t) {
      var i = e.ownerDocument || document, o = i && i.defaultView || window;
      if (o.getSelection) {
        var u = o.getSelection(), d = e.textContent.length, v = Math.min(t.start, d), S = t.end === void 0 ? v : Math.min(t.end, d);
        if (!u.extend && v > S) {
          var C = S;
          S = v, v = C;
        }
        var k = tt(e, v), _ = tt(e, S);
        if (k && _) {
          if (u.rangeCount === 1 && u.anchorNode === k.node && u.anchorOffset === k.offset && u.focusNode === _.node && u.focusOffset === _.offset)
            return;
          var F = i.createRange();
          F.setStart(k.node, k.offset), u.removeAllRanges(), v > S ? (u.addRange(F), u.extend(_.node, _.offset)) : (F.setEnd(_.node, _.offset), u.addRange(F));
        }
      }
    }
    function bo(e) {
      return e && e.nodeType === lo;
    }
    function Dv(e, t) {
      return !e || !t ? !1 : e === t ? !0 : bo(e) ? !1 : bo(t) ? Dv(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function yD(e) {
      return e && e.ownerDocument && Dv(e.ownerDocument.documentElement, e);
    }
    function gD(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function hT() {
      for (var e = window, t = Pi(); t instanceof e.HTMLIFrameElement; ) {
        if (gD(t))
          e = t.contentWindow;
        else
          return t;
        t = Pi(e.document);
      }
      return t;
    }
    function qg(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function SD() {
      var e = hT();
      return {
        focusedElem: e,
        selectionRange: qg(e) ? ED(e) : null
      };
    }
    function CD(e) {
      var t = hT(), i = e.focusedElem, o = e.selectionRange;
      if (t !== i && yD(i)) {
        o !== null && qg(i) && TD(i, o);
        for (var u = [], d = i; d = d.parentNode; )
          d.nodeType === ti && u.push({
            element: d,
            left: d.scrollLeft,
            top: d.scrollTop
          });
        typeof i.focus == "function" && i.focus();
        for (var v = 0; v < u.length; v++) {
          var S = u[v];
          S.element.scrollLeft = S.left, S.element.scrollTop = S.top;
        }
      }
    }
    function ED(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = st(e), t || {
        start: 0,
        end: 0
      };
    }
    function TD(e, t) {
      var i = t.start, o = t.end;
      o === void 0 && (o = i), "selectionStart" in e ? (e.selectionStart = i, e.selectionEnd = Math.min(o, e.value.length)) : Bt(e, t);
    }
    var bD = mn && "documentMode" in document && document.documentMode <= 11;
    function xD() {
      Ot("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var qf = null, Zg = null, Wp = null, Jg = !1;
    function wD(e) {
      if ("selectionStart" in e && qg(e))
        return {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      var t = e.ownerDocument && e.ownerDocument.defaultView || window, i = t.getSelection();
      return {
        anchorNode: i.anchorNode,
        anchorOffset: i.anchorOffset,
        focusNode: i.focusNode,
        focusOffset: i.focusOffset
      };
    }
    function RD(e) {
      return e.window === e ? e.document : e.nodeType === so ? e : e.ownerDocument;
    }
    function mT(e, t, i) {
      var o = RD(i);
      if (!(Jg || qf == null || qf !== Pi(o))) {
        var u = wD(qf);
        if (!Wp || !me(Wp, u)) {
          Wp = u;
          var d = Av(Zg, "onSelect");
          if (d.length > 0) {
            var v = new vr("onSelect", "select", null, t, i);
            e.push({
              event: v,
              listeners: d
            }), v.target = qf;
          }
        }
      }
    }
    function kD(e, t, i, o, u, d, v) {
      var S = i ? nd(i) : window;
      switch (t) {
        case "focusin":
          (kv(S) || S.contentEditable === "true") && (qf = S, Zg = i, Wp = null);
          break;
        case "focusout":
          qf = null, Zg = null, Wp = null;
          break;
        case "mousedown":
          Jg = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Jg = !1, mT(e, o, u);
          break;
        case "selectionchange":
          if (bD)
            break;
        case "keydown":
        case "keyup":
          mT(e, o, u);
      }
    }
    function _v(e, t) {
      var i = {};
      return i[e.toLowerCase()] = t.toLowerCase(), i["Webkit" + e] = "webkit" + t, i["Moz" + e] = "moz" + t, i;
    }
    var Zf = {
      animationend: _v("Animation", "AnimationEnd"),
      animationiteration: _v("Animation", "AnimationIteration"),
      animationstart: _v("Animation", "AnimationStart"),
      transitionend: _v("Transition", "TransitionEnd")
    }, eS = {}, vT = {};
    mn && (vT = document.createElement("div").style, "AnimationEvent" in window || (delete Zf.animationend.animation, delete Zf.animationiteration.animation, delete Zf.animationstart.animation), "TransitionEvent" in window || delete Zf.transitionend.transition);
    function Mv(e) {
      if (eS[e])
        return eS[e];
      if (!Zf[e])
        return e;
      var t = Zf[e];
      for (var i in t)
        if (t.hasOwnProperty(i) && i in vT)
          return eS[e] = t[i];
      return e;
    }
    var yT = Mv("animationend"), gT = Mv("animationiteration"), ST = Mv("animationstart"), CT = Mv("transitionend"), ET = /* @__PURE__ */ new Map(), TT = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function uu(e, t) {
      ET.set(e, t), Ot(t, [e]);
    }
    function DD() {
      for (var e = 0; e < TT.length; e++) {
        var t = TT[e], i = t.toLowerCase(), o = t[0].toUpperCase() + t.slice(1);
        uu(i, "on" + o);
      }
      uu(yT, "onAnimationEnd"), uu(gT, "onAnimationIteration"), uu(ST, "onAnimationStart"), uu("dblclick", "onDoubleClick"), uu("focusin", "onFocus"), uu("focusout", "onBlur"), uu(CT, "onTransitionEnd");
    }
    function _D(e, t, i, o, u, d, v) {
      var S = ET.get(t);
      if (S !== void 0) {
        var C = vr, k = t;
        switch (t) {
          case "keypress":
            if (es(o) === 0)
              return;
          case "keydown":
          case "keyup":
            C = Wg;
            break;
          case "focusin":
            k = "focus", C = vc;
            break;
          case "focusout":
            k = "blur", C = vc;
            break;
          case "beforeblur":
          case "afterblur":
            C = vc;
            break;
          case "click":
            if (o.button === 2)
              return;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            C = Eo;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            C = Fp;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            C = Sv;
            break;
          case yT:
          case gT:
          case ST:
            C = dv;
            break;
          case CT:
            C = Kg;
            break;
          case "scroll":
            C = ya;
            break;
          case "wheel":
            C = Bp;
            break;
          case "copy":
          case "cut":
          case "paste":
            C = jp;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            C = gv;
            break;
        }
        var _ = (d & Vi) !== 0;
        {
          var F = !_ && // TODO: ideally, we'd eventually add all events from
          // nonDelegatedEvents list in DOMPluginEventSystem.
          // Then we can remove this special list.
          // This is a breaking change that can wait until React 18.
          t === "scroll", z = LD(i, S, o.type, _, F);
          if (z.length > 0) {
            var $ = new C(S, k, null, o, u);
            e.push({
              event: $,
              listeners: z
            });
          }
        }
      }
    }
    DD(), An(), Xg(), xD(), Hp();
    function MD(e, t, i, o, u, d, v) {
      _D(e, t, i, o, u, d);
      var S = (d & lp) === 0;
      S && (H(e, t, i, o, u), Fe(e, t, i, o, u), kD(e, t, i, o, u), Qf(e, t, i, o, u));
    }
    var Gp = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], tS = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(Gp));
    function bT(e, t, i) {
      var o = e.type || "unknown-event";
      e.currentTarget = i, Oa(o, t, void 0, e), e.currentTarget = null;
    }
    function OD(e, t, i) {
      var o;
      if (i)
        for (var u = t.length - 1; u >= 0; u--) {
          var d = t[u], v = d.instance, S = d.currentTarget, C = d.listener;
          if (v !== o && e.isPropagationStopped())
            return;
          bT(e, C, S), o = v;
        }
      else
        for (var k = 0; k < t.length; k++) {
          var _ = t[k], F = _.instance, z = _.currentTarget, $ = _.listener;
          if (F !== o && e.isPropagationStopped())
            return;
          bT(e, $, z), o = F;
        }
    }
    function xT(e, t) {
      for (var i = (t & Vi) !== 0, o = 0; o < e.length; o++) {
        var u = e[o], d = u.event, v = u.listeners;
        OD(d, v, i);
      }
      Gu();
    }
    function AD(e, t, i, o, u) {
      var d = sp(i), v = [];
      MD(v, e, o, i, d, t), xT(v, t);
    }
    function bn(e, t) {
      tS.has(e) || h('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var i = !1, o = sM(t), u = VD(e);
      o.has(u) || (wT(t, e, ef, i), o.add(u));
    }
    function nS(e, t, i) {
      tS.has(e) && !t && h('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var o = 0;
      t && (o |= Vi), wT(i, e, o, t);
    }
    var Ov = "_reactListening" + Math.random().toString(36).slice(2);
    function Kp(e) {
      if (!e[Ov]) {
        e[Ov] = !0, mt.forEach(function(i) {
          i !== "selectionchange" && (tS.has(i) || nS(i, !1, e), nS(i, !0, e));
        });
        var t = e.nodeType === so ? e : e.ownerDocument;
        t !== null && (t[Ov] || (t[Ov] = !0, nS("selectionchange", !1, t)));
      }
    }
    function wT(e, t, i, o, u) {
      var d = Hn(e, t, i), v = void 0;
      Wu && (t === "touchstart" || t === "touchmove" || t === "wheel") && (v = !0), e = e, o ? v !== void 0 ? ci(e, t, d, v) : hc(e, t, d) : v !== void 0 ? Vp(e, t, d, v) : Pp(e, t, d);
    }
    function RT(e, t) {
      return e === t || e.nodeType === Un && e.parentNode === t;
    }
    function rS(e, t, i, o, u) {
      var d = o;
      if (!(t & op) && !(t & ef)) {
        var v = u;
        if (o !== null) {
          var S = o;
          e: for (; ; ) {
            if (S === null)
              return;
            var C = S.tag;
            if (C === M || C === A) {
              var k = S.stateNode.containerInfo;
              if (RT(k, v))
                break;
              if (C === A)
                for (var _ = S.return; _ !== null; ) {
                  var F = _.tag;
                  if (F === M || F === A) {
                    var z = _.stateNode.containerInfo;
                    if (RT(z, v))
                      return;
                  }
                  _ = _.return;
                }
              for (; k !== null; ) {
                var $ = Ec(k);
                if ($ === null)
                  return;
                var G = $.tag;
                if (G === j || G === q) {
                  S = d = $;
                  continue e;
                }
                k = k.parentNode;
              }
            }
            S = S.return;
          }
        }
      }
      Am(function() {
        return AD(e, t, i, d);
      });
    }
    function Qp(e, t, i) {
      return {
        instance: e,
        listener: t,
        currentTarget: i
      };
    }
    function LD(e, t, i, o, u, d) {
      for (var v = t !== null ? t + "Capture" : null, S = o ? v : t, C = [], k = e, _ = null; k !== null; ) {
        var F = k, z = F.stateNode, $ = F.tag;
        if ($ === j && z !== null && (_ = z, S !== null)) {
          var G = Xo(k, S);
          G != null && C.push(Qp(k, G, _));
        }
        if (u)
          break;
        k = k.return;
      }
      return C;
    }
    function Av(e, t) {
      for (var i = t + "Capture", o = [], u = e; u !== null; ) {
        var d = u, v = d.stateNode, S = d.tag;
        if (S === j && v !== null) {
          var C = v, k = Xo(u, i);
          k != null && o.unshift(Qp(u, k, C));
          var _ = Xo(u, t);
          _ != null && o.push(Qp(u, _, C));
        }
        u = u.return;
      }
      return o;
    }
    function Jf(e) {
      if (e === null)
        return null;
      do
        e = e.return;
      while (e && e.tag !== j);
      return e || null;
    }
    function ND(e, t) {
      for (var i = e, o = t, u = 0, d = i; d; d = Jf(d))
        u++;
      for (var v = 0, S = o; S; S = Jf(S))
        v++;
      for (; u - v > 0; )
        i = Jf(i), u--;
      for (; v - u > 0; )
        o = Jf(o), v--;
      for (var C = u; C--; ) {
        if (i === o || o !== null && i === o.alternate)
          return i;
        i = Jf(i), o = Jf(o);
      }
      return null;
    }
    function kT(e, t, i, o, u) {
      for (var d = t._reactName, v = [], S = i; S !== null && S !== o; ) {
        var C = S, k = C.alternate, _ = C.stateNode, F = C.tag;
        if (k !== null && k === o)
          break;
        if (F === j && _ !== null) {
          var z = _;
          if (u) {
            var $ = Xo(S, d);
            $ != null && v.unshift(Qp(S, $, z));
          } else if (!u) {
            var G = Xo(S, d);
            G != null && v.push(Qp(S, G, z));
          }
        }
        S = S.return;
      }
      v.length !== 0 && e.push({
        event: t,
        listeners: v
      });
    }
    function PD(e, t, i, o, u) {
      var d = o && u ? ND(o, u) : null;
      o !== null && kT(e, t, o, d, !1), u !== null && i !== null && kT(e, i, u, d, !0);
    }
    function VD(e, t) {
      return e + "__bubble";
    }
    var Qi = !1, Xp = "dangerouslySetInnerHTML", Lv = "suppressContentEditableWarning", cu = "suppressHydrationWarning", DT = "autoFocus", Sc = "children", Cc = "style", Nv = "__html", iS, Pv, qp, _T, Vv, MT, OT;
    iS = {
      // There are working polyfills for <dialog>. Let people use it.
      dialog: !0,
      // Electron ships a custom <webview> tag to display external web content in
      // an isolated frame and process.
      // This tag is not present in non Electron environments such as JSDom which
      // is often used for testing purposes.
      // @see https://electronjs.org/docs/api/webview-tag
      webview: !0
    }, Pv = function(e, t) {
      rp(e, t), Zc(e, t), _m(e, t, {
        registrationNameDependencies: Ue,
        possibleRegistrationNames: ft
      });
    }, MT = mn && !document.documentMode, qp = function(e, t, i) {
      if (!Qi) {
        var o = zv(i), u = zv(t);
        u !== o && (Qi = !0, h("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(u), JSON.stringify(o)));
      }
    }, _T = function(e) {
      if (!Qi) {
        Qi = !0;
        var t = [];
        e.forEach(function(i) {
          t.push(i);
        }), h("Extra attributes from the server: %s", t);
      }
    }, Vv = function(e, t) {
      t === !1 ? h("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : h("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, OT = function(e, t) {
      var i = e.namespaceURI === oo ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return i.innerHTML = t, i.innerHTML;
    };
    var zD = /\r\n?/g, UD = /\u0000|\uFFFD/g;
    function zv(e) {
      tr(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(zD, `
`).replace(UD, "");
    }
    function Uv(e, t, i, o) {
      var u = zv(t), d = zv(e);
      if (d !== u && (o && (Qi || (Qi = !0, h('Text content did not match. Server: "%s" Client: "%s"', d, u))), i && ye))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function AT(e) {
      return e.nodeType === so ? e : e.ownerDocument;
    }
    function FD() {
    }
    function Fv(e) {
      e.onclick = FD;
    }
    function jD(e, t, i, o, u) {
      for (var d in o)
        if (o.hasOwnProperty(d)) {
          var v = o[d];
          if (d === Cc)
            v && Object.freeze(v), bm(t, v);
          else if (d === Xp) {
            var S = v ? v[Nv] : void 0;
            S != null && fm(t, S);
          } else if (d === Sc)
            if (typeof v == "string") {
              var C = e !== "textarea" || v !== "";
              C && Ls(t, v);
            } else typeof v == "number" && Ls(t, "" + v);
          else d === Lv || d === cu || d === DT || (Ue.hasOwnProperty(d) ? v != null && (typeof v != "function" && Vv(d, v), d === "onScroll" && bn("scroll", t)) : v != null && zr(t, d, v, u));
        }
    }
    function BD(e, t, i, o) {
      for (var u = 0; u < t.length; u += 2) {
        var d = t[u], v = t[u + 1];
        d === Cc ? bm(e, v) : d === Xp ? fm(e, v) : d === Sc ? Ls(e, v) : zr(e, d, v, o);
      }
    }
    function HD(e, t, i, o) {
      var u, d = AT(i), v, S = o;
      if (S === oo && (S = Xd(e)), S === oo) {
        if (u = Ko(e, t), !u && e !== e.toLowerCase() && h("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", e), e === "script") {
          var C = d.createElement("div");
          C.innerHTML = "<script><\/script>";
          var k = C.firstChild;
          v = C.removeChild(k);
        } else if (typeof t.is == "string")
          v = d.createElement(e, {
            is: t.is
          });
        else if (v = d.createElement(e), e === "select") {
          var _ = v;
          t.multiple ? _.multiple = !0 : t.size && (_.size = t.size);
        }
      } else
        v = d.createElementNS(S, e);
      return S === oo && !u && Object.prototype.toString.call(v) === "[object HTMLUnknownElement]" && !Vn.call(iS, e) && (iS[e] = !0, h("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), v;
    }
    function ID(e, t) {
      return AT(t).createTextNode(e);
    }
    function YD(e, t, i, o) {
      var u = Ko(t, i);
      Pv(t, i);
      var d;
      switch (t) {
        case "dialog":
          bn("cancel", e), bn("close", e), d = i;
          break;
        case "iframe":
        case "object":
        case "embed":
          bn("load", e), d = i;
          break;
        case "video":
        case "audio":
          for (var v = 0; v < Gp.length; v++)
            bn(Gp[v], e);
          d = i;
          break;
        case "source":
          bn("error", e), d = i;
          break;
        case "img":
        case "image":
        case "link":
          bn("error", e), bn("load", e), d = i;
          break;
        case "details":
          bn("toggle", e), d = i;
          break;
        case "input":
          ca(e, i), d = As(e, i), bn("invalid", e);
          break;
        case "option":
          zt(e, i), d = i;
          break;
        case "select":
          Pl(e, i), d = zu(e, i), bn("invalid", e);
          break;
        case "textarea":
          Gd(e, i), d = Wd(e, i), bn("invalid", e);
          break;
        default:
          d = i;
      }
      switch (Xc(t, d), jD(t, e, o, d, u), t) {
        case "input":
          ua(e), W(e, i, !1);
          break;
        case "textarea":
          ua(e), um(e);
          break;
        case "option":
          ln(e, i);
          break;
        case "select":
          Yd(e, i);
          break;
        default:
          typeof d.onClick == "function" && Fv(e);
          break;
      }
    }
    function $D(e, t, i, o, u) {
      Pv(t, o);
      var d = null, v, S;
      switch (t) {
        case "input":
          v = As(e, i), S = As(e, o), d = [];
          break;
        case "select":
          v = zu(e, i), S = zu(e, o), d = [];
          break;
        case "textarea":
          v = Wd(e, i), S = Wd(e, o), d = [];
          break;
        default:
          v = i, S = o, typeof v.onClick != "function" && typeof S.onClick == "function" && Fv(e);
          break;
      }
      Xc(t, S);
      var C, k, _ = null;
      for (C in v)
        if (!(S.hasOwnProperty(C) || !v.hasOwnProperty(C) || v[C] == null))
          if (C === Cc) {
            var F = v[C];
            for (k in F)
              F.hasOwnProperty(k) && (_ || (_ = {}), _[k] = "");
          } else C === Xp || C === Sc || C === Lv || C === cu || C === DT || (Ue.hasOwnProperty(C) ? d || (d = []) : (d = d || []).push(C, null));
      for (C in S) {
        var z = S[C], $ = v != null ? v[C] : void 0;
        if (!(!S.hasOwnProperty(C) || z === $ || z == null && $ == null))
          if (C === Cc)
            if (z && Object.freeze(z), $) {
              for (k in $)
                $.hasOwnProperty(k) && (!z || !z.hasOwnProperty(k)) && (_ || (_ = {}), _[k] = "");
              for (k in z)
                z.hasOwnProperty(k) && $[k] !== z[k] && (_ || (_ = {}), _[k] = z[k]);
            } else
              _ || (d || (d = []), d.push(C, _)), _ = z;
          else if (C === Xp) {
            var G = z ? z[Nv] : void 0, Z = $ ? $[Nv] : void 0;
            G != null && Z !== G && (d = d || []).push(C, G);
          } else C === Sc ? (typeof z == "string" || typeof z == "number") && (d = d || []).push(C, "" + z) : C === Lv || C === cu || (Ue.hasOwnProperty(C) ? (z != null && (typeof z != "function" && Vv(C, z), C === "onScroll" && bn("scroll", e)), !d && $ !== z && (d = [])) : (d = d || []).push(C, z));
      }
      return _ && (Ag(_, S[Cc]), (d = d || []).push(Cc, _)), d;
    }
    function WD(e, t, i, o, u) {
      i === "input" && u.type === "radio" && u.name != null && T(e, u);
      var d = Ko(i, o), v = Ko(i, u);
      switch (BD(e, t, d, v), i) {
        case "input":
          L(e, u);
          break;
        case "textarea":
          sm(e, u);
          break;
        case "select":
          Gc(e, u);
          break;
      }
    }
    function GD(e) {
      {
        var t = e.toLowerCase();
        return Hu.hasOwnProperty(t) && Hu[t] || null;
      }
    }
    function KD(e, t, i, o, u, d, v) {
      var S, C;
      switch (S = Ko(t, i), Pv(t, i), t) {
        case "dialog":
          bn("cancel", e), bn("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          bn("load", e);
          break;
        case "video":
        case "audio":
          for (var k = 0; k < Gp.length; k++)
            bn(Gp[k], e);
          break;
        case "source":
          bn("error", e);
          break;
        case "img":
        case "image":
        case "link":
          bn("error", e), bn("load", e);
          break;
        case "details":
          bn("toggle", e);
          break;
        case "input":
          ca(e, i), bn("invalid", e);
          break;
        case "option":
          zt(e, i);
          break;
        case "select":
          Pl(e, i), bn("invalid", e);
          break;
        case "textarea":
          Gd(e, i), bn("invalid", e);
          break;
      }
      Xc(t, i);
      {
        C = /* @__PURE__ */ new Set();
        for (var _ = e.attributes, F = 0; F < _.length; F++) {
          var z = _[F].name.toLowerCase();
          switch (z) {
            case "value":
              break;
            case "checked":
              break;
            case "selected":
              break;
            default:
              C.add(_[F].name);
          }
        }
      }
      var $ = null;
      for (var G in i)
        if (i.hasOwnProperty(G)) {
          var Z = i[G];
          if (G === Sc)
            typeof Z == "string" ? e.textContent !== Z && (i[cu] !== !0 && Uv(e.textContent, Z, d, v), $ = [Sc, Z]) : typeof Z == "number" && e.textContent !== "" + Z && (i[cu] !== !0 && Uv(e.textContent, Z, d, v), $ = [Sc, "" + Z]);
          else if (Ue.hasOwnProperty(G))
            Z != null && (typeof Z != "function" && Vv(G, Z), G === "onScroll" && bn("scroll", e));
          else if (v && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof S == "boolean") {
            var Ae = void 0, Ze = on(G);
            if (i[cu] !== !0) {
              if (!(G === Lv || G === cu || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              G === "value" || G === "checked" || G === "selected")) {
                if (G === Xp) {
                  var $e = e.innerHTML, Pt = Z ? Z[Nv] : void 0;
                  if (Pt != null) {
                    var Dt = OT(e, Pt);
                    Dt !== $e && qp(G, $e, Dt);
                  }
                } else if (G === Cc) {
                  if (C.delete(G), MT) {
                    var I = Mg(Z);
                    Ae = e.getAttribute("style"), I !== Ae && qp(G, Ae, I);
                  }
                } else if (S && !ee)
                  C.delete(G.toLowerCase()), Ae = Dl(e, G, Z), Z !== Ae && qp(G, Ae, Z);
                else if (!Cn(G, Ze, S) && !nr(G, Z, Ze, S)) {
                  var J = !1;
                  if (Ze !== null)
                    C.delete(Ze.attributeName), Ae = Fo(e, G, Z, Ze);
                  else {
                    var Y = o;
                    if (Y === oo && (Y = Xd(t)), Y === oo)
                      C.delete(G.toLowerCase());
                    else {
                      var pe = GD(G);
                      pe !== null && pe !== G && (J = !0, C.delete(pe)), C.delete(G);
                    }
                    Ae = Dl(e, G, Z);
                  }
                  var Le = ee;
                  !Le && Z !== Ae && !J && qp(G, Ae, Z);
                }
              }
            }
          }
        }
      switch (v && // $FlowFixMe - Should be inferred as not undefined.
      C.size > 0 && i[cu] !== !0 && _T(C), t) {
        case "input":
          ua(e), W(e, i, !0);
          break;
        case "textarea":
          ua(e), um(e);
          break;
        case "select":
        case "option":
          break;
        default:
          typeof i.onClick == "function" && Fv(e);
          break;
      }
      return $;
    }
    function QD(e, t, i) {
      var o = e.nodeValue !== t;
      return o;
    }
    function aS(e, t) {
      {
        if (Qi)
          return;
        Qi = !0, h("Did not expect server HTML to contain a <%s> in <%s>.", t.nodeName.toLowerCase(), e.nodeName.toLowerCase());
      }
    }
    function oS(e, t) {
      {
        if (Qi)
          return;
        Qi = !0, h('Did not expect server HTML to contain the text node "%s" in <%s>.', t.nodeValue, e.nodeName.toLowerCase());
      }
    }
    function lS(e, t, i) {
      {
        if (Qi)
          return;
        Qi = !0, h("Expected server HTML to contain a matching <%s> in <%s>.", t, e.nodeName.toLowerCase());
      }
    }
    function sS(e, t) {
      {
        if (t === "" || Qi)
          return;
        Qi = !0, h('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function XD(e, t, i) {
      switch (t) {
        case "input":
          X(e, i);
          return;
        case "textarea":
          Rg(e, i);
          return;
        case "select":
          $d(e, i);
          return;
      }
    }
    var Zp = function() {
    }, Jp = function() {
    };
    {
      var qD = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], LT = [
        "applet",
        "caption",
        "html",
        "table",
        "td",
        "th",
        "marquee",
        "object",
        "template",
        // https://html.spec.whatwg.org/multipage/syntax.html#html-integration-point
        // TODO: Distinguish by namespace here -- for <title>, including it here
        // errs on the side of fewer warnings
        "foreignObject",
        "desc",
        "title"
      ], ZD = LT.concat(["button"]), JD = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], NT = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };
      Jp = function(e, t) {
        var i = kt({}, e || NT), o = {
          tag: t
        };
        return LT.indexOf(t) !== -1 && (i.aTagInScope = null, i.buttonTagInScope = null, i.nobrTagInScope = null), ZD.indexOf(t) !== -1 && (i.pTagInButtonScope = null), qD.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (i.listItemTagAutoclosing = null, i.dlItemTagAutoclosing = null), i.current = o, t === "form" && (i.formTag = o), t === "a" && (i.aTagInScope = o), t === "button" && (i.buttonTagInScope = o), t === "nobr" && (i.nobrTagInScope = o), t === "p" && (i.pTagInButtonScope = o), t === "li" && (i.listItemTagAutoclosing = o), (t === "dd" || t === "dt") && (i.dlItemTagAutoclosing = o), i;
      };
      var e_ = function(e, t) {
        switch (t) {
          case "select":
            return e === "option" || e === "optgroup" || e === "#text";
          case "optgroup":
            return e === "option" || e === "#text";
          case "option":
            return e === "#text";
          case "tr":
            return e === "th" || e === "td" || e === "style" || e === "script" || e === "template";
          case "tbody":
          case "thead":
          case "tfoot":
            return e === "tr" || e === "style" || e === "script" || e === "template";
          case "colgroup":
            return e === "col" || e === "template";
          case "table":
            return e === "caption" || e === "colgroup" || e === "tbody" || e === "tfoot" || e === "thead" || e === "style" || e === "script" || e === "template";
          case "head":
            return e === "base" || e === "basefont" || e === "bgsound" || e === "link" || e === "meta" || e === "title" || e === "noscript" || e === "noframes" || e === "style" || e === "script" || e === "template";
          case "html":
            return e === "head" || e === "body" || e === "frameset";
          case "frameset":
            return e === "frame";
          case "#document":
            return e === "html";
        }
        switch (e) {
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t !== "h1" && t !== "h2" && t !== "h3" && t !== "h4" && t !== "h5" && t !== "h6";
          case "rp":
          case "rt":
            return JD.indexOf(t) === -1;
          case "body":
          case "caption":
          case "col":
          case "colgroup":
          case "frameset":
          case "frame":
          case "head":
          case "html":
          case "tbody":
          case "td":
          case "tfoot":
          case "th":
          case "thead":
          case "tr":
            return t == null;
        }
        return !0;
      }, t_ = function(e, t) {
        switch (e) {
          case "address":
          case "article":
          case "aside":
          case "blockquote":
          case "center":
          case "details":
          case "dialog":
          case "dir":
          case "div":
          case "dl":
          case "fieldset":
          case "figcaption":
          case "figure":
          case "footer":
          case "header":
          case "hgroup":
          case "main":
          case "menu":
          case "nav":
          case "ol":
          case "p":
          case "section":
          case "summary":
          case "ul":
          case "pre":
          case "listing":
          case "table":
          case "hr":
          case "xmp":
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t.pTagInButtonScope;
          case "form":
            return t.formTag || t.pTagInButtonScope;
          case "li":
            return t.listItemTagAutoclosing;
          case "dd":
          case "dt":
            return t.dlItemTagAutoclosing;
          case "button":
            return t.buttonTagInScope;
          case "a":
            return t.aTagInScope;
          case "nobr":
            return t.nobrTagInScope;
        }
        return null;
      }, PT = {};
      Zp = function(e, t, i) {
        i = i || NT;
        var o = i.current, u = o && o.tag;
        t != null && (e != null && h("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var d = e_(e, u) ? null : o, v = d ? null : t_(e, i), S = d || v;
        if (S) {
          var C = S.tag, k = !!d + "|" + e + "|" + C;
          if (!PT[k]) {
            PT[k] = !0;
            var _ = e, F = "";
            if (e === "#text" ? /\S/.test(t) ? _ = "Text nodes" : (_ = "Whitespace text nodes", F = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : _ = "<" + e + ">", d) {
              var z = "";
              C === "table" && e === "tr" && (z += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), h("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", _, C, F, z);
            } else
              h("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", _, C);
          }
        }
      };
    }
    var jv = "suppressHydrationWarning", Bv = "$", Hv = "/$", eh = "$?", th = "$!", n_ = "style", uS = null, cS = null;
    function r_(e) {
      var t, i, o = e.nodeType;
      switch (o) {
        case so:
        case Zd: {
          t = o === so ? "#document" : "#fragment";
          var u = e.documentElement;
          i = u ? u.namespaceURI : qd(null, "");
          break;
        }
        default: {
          var d = o === Un ? e.parentNode : e, v = d.namespaceURI || null;
          t = d.tagName, i = qd(v, t);
          break;
        }
      }
      {
        var S = t.toLowerCase(), C = Jp(null, S);
        return {
          namespace: i,
          ancestorInfo: C
        };
      }
    }
    function i_(e, t, i) {
      {
        var o = e, u = qd(o.namespace, t), d = Jp(o.ancestorInfo, t);
        return {
          namespace: u,
          ancestorInfo: d
        };
      }
    }
    function AF(e) {
      return e;
    }
    function a_(e) {
      uS = or(), cS = SD();
      var t = null;
      return Ut(!1), t;
    }
    function o_(e) {
      CD(cS), Ut(uS), uS = null, cS = null;
    }
    function l_(e, t, i, o, u) {
      var d;
      {
        var v = o;
        if (Zp(e, null, v.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var S = "" + t.children, C = Jp(v.ancestorInfo, e);
          Zp(null, S, C);
        }
        d = v.namespace;
      }
      var k = HD(e, t, i, d);
      return ih(u, k), gS(k, t), k;
    }
    function s_(e, t) {
      e.appendChild(t);
    }
    function u_(e, t, i, o, u) {
      switch (YD(e, t, i, o), t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          return !!i.autoFocus;
        case "img":
          return !0;
        default:
          return !1;
      }
    }
    function c_(e, t, i, o, u, d) {
      {
        var v = d;
        if (typeof o.children != typeof i.children && (typeof o.children == "string" || typeof o.children == "number")) {
          var S = "" + o.children, C = Jp(v.ancestorInfo, t);
          Zp(null, S, C);
        }
      }
      return $D(e, t, i, o);
    }
    function fS(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function f_(e, t, i, o) {
      {
        var u = i;
        Zp(null, e, u.ancestorInfo);
      }
      var d = ID(e, t);
      return ih(o, d), d;
    }
    function d_() {
      var e = window.event;
      return e === void 0 ? ja : pc(e.type);
    }
    var dS = typeof setTimeout == "function" ? setTimeout : void 0, p_ = typeof clearTimeout == "function" ? clearTimeout : void 0, pS = -1, VT = typeof Promise == "function" ? Promise : void 0, h_ = typeof queueMicrotask == "function" ? queueMicrotask : typeof VT < "u" ? function(e) {
      return VT.resolve(null).then(e).catch(m_);
    } : dS;
    function m_(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function v_(e, t, i, o) {
      switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          i.autoFocus && e.focus();
          return;
        case "img": {
          i.src && (e.src = i.src);
          return;
        }
      }
    }
    function y_(e, t, i, o, u, d) {
      WD(e, t, i, o, u), gS(e, u);
    }
    function zT(e) {
      Ls(e, "");
    }
    function g_(e, t, i) {
      e.nodeValue = i;
    }
    function S_(e, t) {
      e.appendChild(t);
    }
    function C_(e, t) {
      var i;
      e.nodeType === Un ? (i = e.parentNode, i.insertBefore(t, e)) : (i = e, i.appendChild(t));
      var o = e._reactRootContainer;
      o == null && i.onclick === null && Fv(i);
    }
    function E_(e, t, i) {
      e.insertBefore(t, i);
    }
    function T_(e, t, i) {
      e.nodeType === Un ? e.parentNode.insertBefore(t, i) : e.insertBefore(t, i);
    }
    function b_(e, t) {
      e.removeChild(t);
    }
    function x_(e, t) {
      e.nodeType === Un ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function hS(e, t) {
      var i = t, o = 0;
      do {
        var u = i.nextSibling;
        if (e.removeChild(i), u && u.nodeType === Un) {
          var d = u.data;
          if (d === Hv)
            if (o === 0) {
              e.removeChild(u), ll(t);
              return;
            } else
              o--;
          else (d === Bv || d === eh || d === th) && o++;
        }
        i = u;
      } while (i);
      ll(t);
    }
    function w_(e, t) {
      e.nodeType === Un ? hS(e.parentNode, t) : e.nodeType === ti && hS(e, t), ll(e);
    }
    function R_(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function k_(e) {
      e.nodeValue = "";
    }
    function D_(e, t) {
      e = e;
      var i = t[n_], o = i != null && i.hasOwnProperty("display") ? i.display : null;
      e.style.display = Qc("display", o);
    }
    function __(e, t) {
      e.nodeValue = t;
    }
    function M_(e) {
      e.nodeType === ti ? e.textContent = "" : e.nodeType === so && e.documentElement && e.removeChild(e.documentElement);
    }
    function O_(e, t, i) {
      return e.nodeType !== ti || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function A_(e, t) {
      return t === "" || e.nodeType !== lo ? null : e;
    }
    function L_(e) {
      return e.nodeType !== Un ? null : e;
    }
    function UT(e) {
      return e.data === eh;
    }
    function mS(e) {
      return e.data === th;
    }
    function N_(e) {
      var t = e.nextSibling && e.nextSibling.dataset, i, o, u;
      return t && (i = t.dgst, o = t.msg, u = t.stck), {
        message: o,
        digest: i,
        stack: u
      };
    }
    function P_(e, t) {
      e._reactRetry = t;
    }
    function Iv(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === ti || t === lo)
          break;
        if (t === Un) {
          var i = e.data;
          if (i === Bv || i === th || i === eh)
            break;
          if (i === Hv)
            return null;
        }
      }
      return e;
    }
    function nh(e) {
      return Iv(e.nextSibling);
    }
    function V_(e) {
      return Iv(e.firstChild);
    }
    function z_(e) {
      return Iv(e.firstChild);
    }
    function U_(e) {
      return Iv(e.nextSibling);
    }
    function F_(e, t, i, o, u, d, v) {
      ih(d, e), gS(e, i);
      var S;
      {
        var C = u;
        S = C.namespace;
      }
      var k = (d.mode & wt) !== Ke;
      return KD(e, t, i, S, o, k, v);
    }
    function j_(e, t, i, o) {
      return ih(i, e), i.mode & wt, QD(e, t);
    }
    function B_(e, t) {
      ih(t, e);
    }
    function H_(e) {
      for (var t = e.nextSibling, i = 0; t; ) {
        if (t.nodeType === Un) {
          var o = t.data;
          if (o === Hv) {
            if (i === 0)
              return nh(t);
            i--;
          } else (o === Bv || o === th || o === eh) && i++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function FT(e) {
      for (var t = e.previousSibling, i = 0; t; ) {
        if (t.nodeType === Un) {
          var o = t.data;
          if (o === Bv || o === th || o === eh) {
            if (i === 0)
              return t;
            i--;
          } else o === Hv && i++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function I_(e) {
      ll(e);
    }
    function Y_(e) {
      ll(e);
    }
    function $_(e) {
      return e !== "head" && e !== "body";
    }
    function W_(e, t, i, o) {
      var u = !0;
      Uv(t.nodeValue, i, o, u);
    }
    function G_(e, t, i, o, u, d) {
      if (t[jv] !== !0) {
        var v = !0;
        Uv(o.nodeValue, u, d, v);
      }
    }
    function K_(e, t) {
      t.nodeType === ti ? aS(e, t) : t.nodeType === Un || oS(e, t);
    }
    function Q_(e, t) {
      {
        var i = e.parentNode;
        i !== null && (t.nodeType === ti ? aS(i, t) : t.nodeType === Un || oS(i, t));
      }
    }
    function X_(e, t, i, o, u) {
      (u || t[jv] !== !0) && (o.nodeType === ti ? aS(i, o) : o.nodeType === Un || oS(i, o));
    }
    function q_(e, t, i) {
      lS(e, t);
    }
    function Z_(e, t) {
      sS(e, t);
    }
    function J_(e, t, i) {
      {
        var o = e.parentNode;
        o !== null && lS(o, t);
      }
    }
    function eM(e, t) {
      {
        var i = e.parentNode;
        i !== null && sS(i, t);
      }
    }
    function tM(e, t, i, o, u, d) {
      (d || t[jv] !== !0) && lS(i, o);
    }
    function nM(e, t, i, o, u) {
      (u || t[jv] !== !0) && sS(i, o);
    }
    function rM(e) {
      h("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function iM(e) {
      Kp(e);
    }
    var ed = Math.random().toString(36).slice(2), td = "__reactFiber$" + ed, vS = "__reactProps$" + ed, rh = "__reactContainer$" + ed, yS = "__reactEvents$" + ed, aM = "__reactListeners$" + ed, oM = "__reactHandles$" + ed;
    function lM(e) {
      delete e[td], delete e[vS], delete e[yS], delete e[aM], delete e[oM];
    }
    function ih(e, t) {
      t[td] = e;
    }
    function Yv(e, t) {
      t[rh] = e;
    }
    function jT(e) {
      e[rh] = null;
    }
    function ah(e) {
      return !!e[rh];
    }
    function Ec(e) {
      var t = e[td];
      if (t)
        return t;
      for (var i = e.parentNode; i; ) {
        if (t = i[rh] || i[td], t) {
          var o = t.alternate;
          if (t.child !== null || o !== null && o.child !== null)
            for (var u = FT(e); u !== null; ) {
              var d = u[td];
              if (d)
                return d;
              u = FT(u);
            }
          return t;
        }
        e = i, i = e.parentNode;
      }
      return null;
    }
    function fu(e) {
      var t = e[td] || e[rh];
      return t && (t.tag === j || t.tag === q || t.tag === ae || t.tag === M) ? t : null;
    }
    function nd(e) {
      if (e.tag === j || e.tag === q)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function $v(e) {
      return e[vS] || null;
    }
    function gS(e, t) {
      e[vS] = t;
    }
    function sM(e) {
      var t = e[yS];
      return t === void 0 && (t = e[yS] = /* @__PURE__ */ new Set()), t;
    }
    var BT = {}, HT = c.ReactDebugCurrentFrame;
    function Wv(e) {
      if (e) {
        var t = e._owner, i = no(e.type, e._source, t ? t.type : null);
        HT.setExtraStackFrame(i);
      } else
        HT.setExtraStackFrame(null);
    }
    function xo(e, t, i, o, u) {
      {
        var d = Function.call.bind(Vn);
        for (var v in e)
          if (d(e, v)) {
            var S = void 0;
            try {
              if (typeof e[v] != "function") {
                var C = Error((o || "React class") + ": " + i + " type `" + v + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[v] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw C.name = "Invariant Violation", C;
              }
              S = e[v](t, v, o, i, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (k) {
              S = k;
            }
            S && !(S instanceof Error) && (Wv(u), h("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", o || "React class", i, v, typeof S), Wv(null)), S instanceof Error && !(S.message in BT) && (BT[S.message] = !0, Wv(u), h("Failed %s type: %s", i, S.message), Wv(null));
          }
      }
    }
    var SS = [], Gv;
    Gv = [];
    var as = -1;
    function du(e) {
      return {
        current: e
      };
    }
    function fi(e, t) {
      if (as < 0) {
        h("Unexpected pop.");
        return;
      }
      t !== Gv[as] && h("Unexpected Fiber popped."), e.current = SS[as], SS[as] = null, Gv[as] = null, as--;
    }
    function di(e, t, i) {
      as++, SS[as] = e.current, Gv[as] = i, e.current = t;
    }
    var CS;
    CS = {};
    var Sa = {};
    Object.freeze(Sa);
    var os = du(Sa), ml = du(!1), ES = Sa;
    function rd(e, t, i) {
      return i && vl(t) ? ES : os.current;
    }
    function IT(e, t, i) {
      {
        var o = e.stateNode;
        o.__reactInternalMemoizedUnmaskedChildContext = t, o.__reactInternalMemoizedMaskedChildContext = i;
      }
    }
    function id(e, t) {
      {
        var i = e.type, o = i.contextTypes;
        if (!o)
          return Sa;
        var u = e.stateNode;
        if (u && u.__reactInternalMemoizedUnmaskedChildContext === t)
          return u.__reactInternalMemoizedMaskedChildContext;
        var d = {};
        for (var v in o)
          d[v] = t[v];
        {
          var S = lt(e) || "Unknown";
          xo(o, d, "context", S);
        }
        return u && IT(e, t, d), d;
      }
    }
    function Kv() {
      return ml.current;
    }
    function vl(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function Qv(e) {
      fi(ml, e), fi(os, e);
    }
    function TS(e) {
      fi(ml, e), fi(os, e);
    }
    function YT(e, t, i) {
      {
        if (os.current !== Sa)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        di(os, t, e), di(ml, i, e);
      }
    }
    function $T(e, t, i) {
      {
        var o = e.stateNode, u = t.childContextTypes;
        if (typeof o.getChildContext != "function") {
          {
            var d = lt(e) || "Unknown";
            CS[d] || (CS[d] = !0, h("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", d, d));
          }
          return i;
        }
        var v = o.getChildContext();
        for (var S in v)
          if (!(S in u))
            throw new Error((lt(e) || "Unknown") + '.getChildContext(): key "' + S + '" is not defined in childContextTypes.');
        {
          var C = lt(e) || "Unknown";
          xo(u, v, "child context", C);
        }
        return kt({}, i, v);
      }
    }
    function Xv(e) {
      {
        var t = e.stateNode, i = t && t.__reactInternalMemoizedMergedChildContext || Sa;
        return ES = os.current, di(os, i, e), di(ml, ml.current, e), !0;
      }
    }
    function WT(e, t, i) {
      {
        var o = e.stateNode;
        if (!o)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (i) {
          var u = $T(e, t, ES);
          o.__reactInternalMemoizedMergedChildContext = u, fi(ml, e), fi(os, e), di(os, u, e), di(ml, i, e);
        } else
          fi(ml, e), di(ml, i, e);
      }
    }
    function uM(e) {
      {
        if (!Hl(e) || e.tag !== R)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case M:
              return t.stateNode.context;
            case R: {
              var i = t.type;
              if (vl(i))
                return t.stateNode.__reactInternalMemoizedMergedChildContext;
              break;
            }
          }
          t = t.return;
        } while (t !== null);
        throw new Error("Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    var pu = 0, qv = 1, ls = null, bS = !1, xS = !1;
    function GT(e) {
      ls === null ? ls = [e] : ls.push(e);
    }
    function cM(e) {
      bS = !0, GT(e);
    }
    function KT() {
      bS && hu();
    }
    function hu() {
      if (!xS && ls !== null) {
        xS = !0;
        var e = 0, t = ma();
        try {
          var i = !0, o = ls;
          for (Xn(si); e < o.length; e++) {
            var u = o[e];
            do
              u = u(i);
            while (u !== null);
          }
          ls = null, bS = !1;
        } catch (d) {
          throw ls !== null && (ls = ls.slice(e + 1)), cp(Xu, hu), d;
        } finally {
          Xn(t), xS = !1;
        }
      }
      return null;
    }
    var ad = [], od = 0, Zv = null, Jv = 0, Ya = [], $a = 0, Tc = null, ss = 1, us = "";
    function fM(e) {
      return xc(), (e.flags & Aa) !== Qe;
    }
    function dM(e) {
      return xc(), Jv;
    }
    function pM() {
      var e = us, t = ss, i = t & ~hM(t);
      return i.toString(32) + e;
    }
    function bc(e, t) {
      xc(), ad[od++] = Jv, ad[od++] = Zv, Zv = e, Jv = t;
    }
    function QT(e, t, i) {
      xc(), Ya[$a++] = ss, Ya[$a++] = us, Ya[$a++] = Tc, Tc = e;
      var o = ss, u = us, d = ey(o) - 1, v = o & ~(1 << d), S = i + 1, C = ey(t) + d;
      if (C > 30) {
        var k = d - d % 5, _ = (1 << k) - 1, F = (v & _).toString(32), z = v >> k, $ = d - k, G = ey(t) + $, Z = S << $, Ae = Z | z, Ze = F + u;
        ss = 1 << G | Ae, us = Ze;
      } else {
        var $e = S << d, Pt = $e | v, Dt = u;
        ss = 1 << C | Pt, us = Dt;
      }
    }
    function wS(e) {
      xc();
      var t = e.return;
      if (t !== null) {
        var i = 1, o = 0;
        bc(e, i), QT(e, i, o);
      }
    }
    function ey(e) {
      return 32 - yn(e);
    }
    function hM(e) {
      return 1 << ey(e) - 1;
    }
    function RS(e) {
      for (; e === Zv; )
        Zv = ad[--od], ad[od] = null, Jv = ad[--od], ad[od] = null;
      for (; e === Tc; )
        Tc = Ya[--$a], Ya[$a] = null, us = Ya[--$a], Ya[$a] = null, ss = Ya[--$a], Ya[$a] = null;
    }
    function mM() {
      return xc(), Tc !== null ? {
        id: ss,
        overflow: us
      } : null;
    }
    function vM(e, t) {
      xc(), Ya[$a++] = ss, Ya[$a++] = us, Ya[$a++] = Tc, ss = t.id, us = t.overflow, Tc = e;
    }
    function xc() {
      Yr() || h("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var Ir = null, Wa = null, wo = !1, wc = !1, mu = null;
    function yM() {
      wo && h("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function XT() {
      wc = !0;
    }
    function gM() {
      return wc;
    }
    function SM(e) {
      var t = e.stateNode.containerInfo;
      return Wa = z_(t), Ir = e, wo = !0, mu = null, wc = !1, !0;
    }
    function CM(e, t, i) {
      return Wa = U_(t), Ir = e, wo = !0, mu = null, wc = !1, i !== null && vM(e, i), !0;
    }
    function qT(e, t) {
      switch (e.tag) {
        case M: {
          K_(e.stateNode.containerInfo, t);
          break;
        }
        case j: {
          var i = (e.mode & wt) !== Ke;
          X_(
            e.type,
            e.memoizedProps,
            e.stateNode,
            t,
            // TODO: Delete this argument when we remove the legacy root API.
            i
          );
          break;
        }
        case ae: {
          var o = e.memoizedState;
          o.dehydrated !== null && Q_(o.dehydrated, t);
          break;
        }
      }
    }
    function ZT(e, t) {
      qT(e, t);
      var i = bL();
      i.stateNode = t, i.return = e;
      var o = e.deletions;
      o === null ? (e.deletions = [i], e.flags |= zi) : o.push(i);
    }
    function kS(e, t) {
      {
        if (wc)
          return;
        switch (e.tag) {
          case M: {
            var i = e.stateNode.containerInfo;
            switch (t.tag) {
              case j:
                var o = t.type;
                t.pendingProps, q_(i, o);
                break;
              case q:
                var u = t.pendingProps;
                Z_(i, u);
                break;
            }
            break;
          }
          case j: {
            var d = e.type, v = e.memoizedProps, S = e.stateNode;
            switch (t.tag) {
              case j: {
                var C = t.type, k = t.pendingProps, _ = (e.mode & wt) !== Ke;
                tM(
                  d,
                  v,
                  S,
                  C,
                  k,
                  // TODO: Delete this argument when we remove the legacy root API.
                  _
                );
                break;
              }
              case q: {
                var F = t.pendingProps, z = (e.mode & wt) !== Ke;
                nM(
                  d,
                  v,
                  S,
                  F,
                  // TODO: Delete this argument when we remove the legacy root API.
                  z
                );
                break;
              }
            }
            break;
          }
          case ae: {
            var $ = e.memoizedState, G = $.dehydrated;
            if (G !== null) switch (t.tag) {
              case j:
                var Z = t.type;
                t.pendingProps, J_(G, Z);
                break;
              case q:
                var Ae = t.pendingProps;
                eM(G, Ae);
                break;
            }
            break;
          }
          default:
            return;
        }
      }
    }
    function JT(e, t) {
      t.flags = t.flags & ~ri | Tn, kS(e, t);
    }
    function eb(e, t) {
      switch (e.tag) {
        case j: {
          var i = e.type;
          e.pendingProps;
          var o = O_(t, i);
          return o !== null ? (e.stateNode = o, Ir = e, Wa = V_(o), !0) : !1;
        }
        case q: {
          var u = e.pendingProps, d = A_(t, u);
          return d !== null ? (e.stateNode = d, Ir = e, Wa = null, !0) : !1;
        }
        case ae: {
          var v = L_(t);
          if (v !== null) {
            var S = {
              dehydrated: v,
              treeContext: mM(),
              retryLane: Hr
            };
            e.memoizedState = S;
            var C = xL(v);
            return C.return = e, e.child = C, Ir = e, Wa = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function DS(e) {
      return (e.mode & wt) !== Ke && (e.flags & Ge) === Qe;
    }
    function _S(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function MS(e) {
      if (wo) {
        var t = Wa;
        if (!t) {
          DS(e) && (kS(Ir, e), _S()), JT(Ir, e), wo = !1, Ir = e;
          return;
        }
        var i = t;
        if (!eb(e, t)) {
          DS(e) && (kS(Ir, e), _S()), t = nh(i);
          var o = Ir;
          if (!t || !eb(e, t)) {
            JT(Ir, e), wo = !1, Ir = e;
            return;
          }
          ZT(o, i);
        }
      }
    }
    function EM(e, t, i) {
      var o = e.stateNode, u = !wc, d = F_(o, e.type, e.memoizedProps, t, i, e, u);
      return e.updateQueue = d, d !== null;
    }
    function TM(e) {
      var t = e.stateNode, i = e.memoizedProps, o = j_(t, i, e);
      if (o) {
        var u = Ir;
        if (u !== null)
          switch (u.tag) {
            case M: {
              var d = u.stateNode.containerInfo, v = (u.mode & wt) !== Ke;
              W_(
                d,
                t,
                i,
                // TODO: Delete this argument when we remove the legacy root API.
                v
              );
              break;
            }
            case j: {
              var S = u.type, C = u.memoizedProps, k = u.stateNode, _ = (u.mode & wt) !== Ke;
              G_(
                S,
                C,
                k,
                t,
                i,
                // TODO: Delete this argument when we remove the legacy root API.
                _
              );
              break;
            }
          }
      }
      return o;
    }
    function bM(e) {
      var t = e.memoizedState, i = t !== null ? t.dehydrated : null;
      if (!i)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      B_(i, e);
    }
    function xM(e) {
      var t = e.memoizedState, i = t !== null ? t.dehydrated : null;
      if (!i)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return H_(i);
    }
    function tb(e) {
      for (var t = e.return; t !== null && t.tag !== j && t.tag !== M && t.tag !== ae; )
        t = t.return;
      Ir = t;
    }
    function ty(e) {
      if (e !== Ir)
        return !1;
      if (!wo)
        return tb(e), wo = !0, !1;
      if (e.tag !== M && (e.tag !== j || $_(e.type) && !fS(e.type, e.memoizedProps))) {
        var t = Wa;
        if (t)
          if (DS(e))
            nb(e), _S();
          else
            for (; t; )
              ZT(e, t), t = nh(t);
      }
      return tb(e), e.tag === ae ? Wa = xM(e) : Wa = Ir ? nh(e.stateNode) : null, !0;
    }
    function wM() {
      return wo && Wa !== null;
    }
    function nb(e) {
      for (var t = Wa; t; )
        qT(e, t), t = nh(t);
    }
    function ld() {
      Ir = null, Wa = null, wo = !1, wc = !1;
    }
    function rb() {
      mu !== null && (qx(mu), mu = null);
    }
    function Yr() {
      return wo;
    }
    function OS(e) {
      mu === null ? mu = [e] : mu.push(e);
    }
    var RM = c.ReactCurrentBatchConfig, kM = null;
    function DM() {
      return RM.transition;
    }
    var Ro = {
      recordUnsafeLifecycleWarnings: function(e, t) {
      },
      flushPendingUnsafeLifecycleWarnings: function() {
      },
      recordLegacyContextWarning: function(e, t) {
      },
      flushLegacyContextWarning: function() {
      },
      discardPendingWarnings: function() {
      }
    };
    {
      var _M = function(e) {
        for (var t = null, i = e; i !== null; )
          i.mode & Mn && (t = i), i = i.return;
        return t;
      }, Rc = function(e) {
        var t = [];
        return e.forEach(function(i) {
          t.push(i);
        }), t.sort().join(", ");
      }, oh = [], lh = [], sh = [], uh = [], ch = [], fh = [], kc = /* @__PURE__ */ new Set();
      Ro.recordUnsafeLifecycleWarnings = function(e, t) {
        kc.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && oh.push(e), e.mode & Mn && typeof t.UNSAFE_componentWillMount == "function" && lh.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && sh.push(e), e.mode & Mn && typeof t.UNSAFE_componentWillReceiveProps == "function" && uh.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && ch.push(e), e.mode & Mn && typeof t.UNSAFE_componentWillUpdate == "function" && fh.push(e));
      }, Ro.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        oh.length > 0 && (oh.forEach(function(z) {
          e.add(lt(z) || "Component"), kc.add(z.type);
        }), oh = []);
        var t = /* @__PURE__ */ new Set();
        lh.length > 0 && (lh.forEach(function(z) {
          t.add(lt(z) || "Component"), kc.add(z.type);
        }), lh = []);
        var i = /* @__PURE__ */ new Set();
        sh.length > 0 && (sh.forEach(function(z) {
          i.add(lt(z) || "Component"), kc.add(z.type);
        }), sh = []);
        var o = /* @__PURE__ */ new Set();
        uh.length > 0 && (uh.forEach(function(z) {
          o.add(lt(z) || "Component"), kc.add(z.type);
        }), uh = []);
        var u = /* @__PURE__ */ new Set();
        ch.length > 0 && (ch.forEach(function(z) {
          u.add(lt(z) || "Component"), kc.add(z.type);
        }), ch = []);
        var d = /* @__PURE__ */ new Set();
        if (fh.length > 0 && (fh.forEach(function(z) {
          d.add(lt(z) || "Component"), kc.add(z.type);
        }), fh = []), t.size > 0) {
          var v = Rc(t);
          h(`Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`, v);
        }
        if (o.size > 0) {
          var S = Rc(o);
          h(`Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state

Please update the following components: %s`, S);
        }
        if (d.size > 0) {
          var C = Rc(d);
          h(`Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`, C);
        }
        if (e.size > 0) {
          var k = Rc(e);
          E(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, k);
        }
        if (i.size > 0) {
          var _ = Rc(i);
          E(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, _);
        }
        if (u.size > 0) {
          var F = Rc(u);
          E(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, F);
        }
      };
      var ny = /* @__PURE__ */ new Map(), ib = /* @__PURE__ */ new Set();
      Ro.recordLegacyContextWarning = function(e, t) {
        var i = _M(e);
        if (i === null) {
          h("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!ib.has(e.type)) {
          var o = ny.get(i);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (o === void 0 && (o = [], ny.set(i, o)), o.push(e));
        }
      }, Ro.flushLegacyContextWarning = function() {
        ny.forEach(function(e, t) {
          if (e.length !== 0) {
            var i = e[0], o = /* @__PURE__ */ new Set();
            e.forEach(function(d) {
              o.add(lt(d) || "Component"), ib.add(d.type);
            });
            var u = Rc(o);
            try {
              Xt(i), h(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u);
            } finally {
              pn();
            }
          }
        });
      }, Ro.discardPendingWarnings = function() {
        oh = [], lh = [], sh = [], uh = [], ch = [], fh = [], ny = /* @__PURE__ */ new Map();
      };
    }
    function ko(e, t) {
      if (e && e.defaultProps) {
        var i = kt({}, t), o = e.defaultProps;
        for (var u in o)
          i[u] === void 0 && (i[u] = o[u]);
        return i;
      }
      return t;
    }
    var AS = du(null), LS;
    LS = {};
    var ry = null, sd = null, NS = null, iy = !1;
    function ay() {
      ry = null, sd = null, NS = null, iy = !1;
    }
    function ab() {
      iy = !0;
    }
    function ob() {
      iy = !1;
    }
    function lb(e, t, i) {
      di(AS, t._currentValue, e), t._currentValue = i, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== LS && h("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = LS;
    }
    function PS(e, t) {
      var i = AS.current;
      fi(AS, t), e._currentValue = i;
    }
    function VS(e, t, i) {
      for (var o = e; o !== null; ) {
        var u = o.alternate;
        if (Kl(o.childLanes, t) ? u !== null && !Kl(u.childLanes, t) && (u.childLanes = vt(u.childLanes, t)) : (o.childLanes = vt(o.childLanes, t), u !== null && (u.childLanes = vt(u.childLanes, t))), o === i)
          break;
        o = o.return;
      }
      o !== i && h("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function MM(e, t, i) {
      OM(e, t, i);
    }
    function OM(e, t, i) {
      var o = e.child;
      for (o !== null && (o.return = e); o !== null; ) {
        var u = void 0, d = o.dependencies;
        if (d !== null) {
          u = o.child;
          for (var v = d.firstContext; v !== null; ) {
            if (v.context === t) {
              if (o.tag === R) {
                var S = nu(i), C = cs(nn, S);
                C.tag = ly;
                var k = o.updateQueue;
                if (k !== null) {
                  var _ = k.shared, F = _.pending;
                  F === null ? C.next = C : (C.next = F.next, F.next = C), _.pending = C;
                }
              }
              o.lanes = vt(o.lanes, i);
              var z = o.alternate;
              z !== null && (z.lanes = vt(z.lanes, i)), VS(o.return, i, e), d.lanes = vt(d.lanes, i);
              break;
            }
            v = v.next;
          }
        } else if (o.tag === he)
          u = o.type === e.type ? null : o.child;
        else if (o.tag === yt) {
          var $ = o.return;
          if ($ === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          $.lanes = vt($.lanes, i);
          var G = $.alternate;
          G !== null && (G.lanes = vt(G.lanes, i)), VS($, i, e), u = o.sibling;
        } else
          u = o.child;
        if (u !== null)
          u.return = o;
        else
          for (u = o; u !== null; ) {
            if (u === e) {
              u = null;
              break;
            }
            var Z = u.sibling;
            if (Z !== null) {
              Z.return = u.return, u = Z;
              break;
            }
            u = u.return;
          }
        o = u;
      }
    }
    function ud(e, t) {
      ry = e, sd = null, NS = null;
      var i = e.dependencies;
      if (i !== null) {
        var o = i.firstContext;
        o !== null && (rn(i.lanes, t) && wh(), i.firstContext = null);
      }
    }
    function sr(e) {
      iy && h("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (NS !== e) {
        var i = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (sd === null) {
          if (ry === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          sd = i, ry.dependencies = {
            lanes: oe,
            firstContext: i
          };
        } else
          sd = sd.next = i;
      }
      return t;
    }
    var Dc = null;
    function zS(e) {
      Dc === null ? Dc = [e] : Dc.push(e);
    }
    function AM() {
      if (Dc !== null) {
        for (var e = 0; e < Dc.length; e++) {
          var t = Dc[e], i = t.interleaved;
          if (i !== null) {
            t.interleaved = null;
            var o = i.next, u = t.pending;
            if (u !== null) {
              var d = u.next;
              u.next = o, i.next = d;
            }
            t.pending = i;
          }
        }
        Dc = null;
      }
    }
    function sb(e, t, i, o) {
      var u = t.interleaved;
      return u === null ? (i.next = i, zS(t)) : (i.next = u.next, u.next = i), t.interleaved = i, oy(e, o);
    }
    function LM(e, t, i, o) {
      var u = t.interleaved;
      u === null ? (i.next = i, zS(t)) : (i.next = u.next, u.next = i), t.interleaved = i;
    }
    function NM(e, t, i, o) {
      var u = t.interleaved;
      return u === null ? (i.next = i, zS(t)) : (i.next = u.next, u.next = i), t.interleaved = i, oy(e, o);
    }
    function Xi(e, t) {
      return oy(e, t);
    }
    var PM = oy;
    function oy(e, t) {
      e.lanes = vt(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = vt(i.lanes, t)), i === null && (e.flags & (Tn | ri)) !== Qe && uw(e);
      for (var o = e, u = e.return; u !== null; )
        u.childLanes = vt(u.childLanes, t), i = u.alternate, i !== null ? i.childLanes = vt(i.childLanes, t) : (u.flags & (Tn | ri)) !== Qe && uw(e), o = u, u = u.return;
      if (o.tag === M) {
        var d = o.stateNode;
        return d;
      } else
        return null;
    }
    var ub = 0, cb = 1, ly = 2, US = 3, sy = !1, FS, uy;
    FS = !1, uy = null;
    function jS(e) {
      var t = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          interleaved: null,
          lanes: oe
        },
        effects: null
      };
      e.updateQueue = t;
    }
    function fb(e, t) {
      var i = t.updateQueue, o = e.updateQueue;
      if (i === o) {
        var u = {
          baseState: o.baseState,
          firstBaseUpdate: o.firstBaseUpdate,
          lastBaseUpdate: o.lastBaseUpdate,
          shared: o.shared,
          effects: o.effects
        };
        t.updateQueue = u;
      }
    }
    function cs(e, t) {
      var i = {
        eventTime: e,
        lane: t,
        tag: ub,
        payload: null,
        callback: null,
        next: null
      };
      return i;
    }
    function vu(e, t, i) {
      var o = e.updateQueue;
      if (o === null)
        return null;
      var u = o.shared;
      if (uy === u && !FS && (h("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), FS = !0), PA()) {
        var d = u.pending;
        return d === null ? t.next = t : (t.next = d.next, d.next = t), u.pending = t, PM(e, i);
      } else
        return NM(e, u, t, i);
    }
    function cy(e, t, i) {
      var o = t.updateQueue;
      if (o !== null) {
        var u = o.shared;
        if (xp(i)) {
          var d = u.lanes;
          d = Rp(d, e.pendingLanes);
          var v = vt(d, i);
          u.lanes = v, lc(e, v);
        }
      }
    }
    function BS(e, t) {
      var i = e.updateQueue, o = e.alternate;
      if (o !== null) {
        var u = o.updateQueue;
        if (i === u) {
          var d = null, v = null, S = i.firstBaseUpdate;
          if (S !== null) {
            var C = S;
            do {
              var k = {
                eventTime: C.eventTime,
                lane: C.lane,
                tag: C.tag,
                payload: C.payload,
                callback: C.callback,
                next: null
              };
              v === null ? d = v = k : (v.next = k, v = k), C = C.next;
            } while (C !== null);
            v === null ? d = v = t : (v.next = t, v = t);
          } else
            d = v = t;
          i = {
            baseState: u.baseState,
            firstBaseUpdate: d,
            lastBaseUpdate: v,
            shared: u.shared,
            effects: u.effects
          }, e.updateQueue = i;
          return;
        }
      }
      var _ = i.lastBaseUpdate;
      _ === null ? i.firstBaseUpdate = t : _.next = t, i.lastBaseUpdate = t;
    }
    function VM(e, t, i, o, u, d) {
      switch (i.tag) {
        case cb: {
          var v = i.payload;
          if (typeof v == "function") {
            ab();
            var S = v.call(d, o, u);
            {
              if (e.mode & Mn) {
                un(!0);
                try {
                  v.call(d, o, u);
                } finally {
                  un(!1);
                }
              }
              ob();
            }
            return S;
          }
          return v;
        }
        case US:
          e.flags = e.flags & ~rr | Ge;
        case ub: {
          var C = i.payload, k;
          if (typeof C == "function") {
            ab(), k = C.call(d, o, u);
            {
              if (e.mode & Mn) {
                un(!0);
                try {
                  C.call(d, o, u);
                } finally {
                  un(!1);
                }
              }
              ob();
            }
          } else
            k = C;
          return k == null ? o : kt({}, o, k);
        }
        case ly:
          return sy = !0, o;
      }
      return o;
    }
    function fy(e, t, i, o) {
      var u = e.updateQueue;
      sy = !1, uy = u.shared;
      var d = u.firstBaseUpdate, v = u.lastBaseUpdate, S = u.shared.pending;
      if (S !== null) {
        u.shared.pending = null;
        var C = S, k = C.next;
        C.next = null, v === null ? d = k : v.next = k, v = C;
        var _ = e.alternate;
        if (_ !== null) {
          var F = _.updateQueue, z = F.lastBaseUpdate;
          z !== v && (z === null ? F.firstBaseUpdate = k : z.next = k, F.lastBaseUpdate = C);
        }
      }
      if (d !== null) {
        var $ = u.baseState, G = oe, Z = null, Ae = null, Ze = null, $e = d;
        do {
          var Pt = $e.lane, Dt = $e.eventTime;
          if (Kl(o, Pt)) {
            if (Ze !== null) {
              var J = {
                eventTime: Dt,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: gn,
                tag: $e.tag,
                payload: $e.payload,
                callback: $e.callback,
                next: null
              };
              Ze = Ze.next = J;
            }
            $ = VM(e, u, $e, $, t, i);
            var Y = $e.callback;
            if (Y !== null && // If the update was already committed, we should not queue its
            // callback again.
            $e.lane !== gn) {
              e.flags |= sn;
              var pe = u.effects;
              pe === null ? u.effects = [$e] : pe.push($e);
            }
          } else {
            var I = {
              eventTime: Dt,
              lane: Pt,
              tag: $e.tag,
              payload: $e.payload,
              callback: $e.callback,
              next: null
            };
            Ze === null ? (Ae = Ze = I, Z = $) : Ze = Ze.next = I, G = vt(G, Pt);
          }
          if ($e = $e.next, $e === null) {
            if (S = u.shared.pending, S === null)
              break;
            var Le = S, ke = Le.next;
            Le.next = null, $e = ke, u.lastBaseUpdate = Le, u.shared.pending = null;
          }
        } while (!0);
        Ze === null && (Z = $), u.baseState = Z, u.firstBaseUpdate = Ae, u.lastBaseUpdate = Ze;
        var ot = u.shared.interleaved;
        if (ot !== null) {
          var dt = ot;
          do
            G = vt(G, dt.lane), dt = dt.next;
          while (dt !== ot);
        } else d === null && (u.shared.lanes = oe);
        zh(G), e.lanes = G, e.memoizedState = $;
      }
      uy = null;
    }
    function zM(e, t) {
      if (typeof e != "function")
        throw new Error("Invalid argument passed as callback. Expected a function. Instead " + ("received: " + e));
      e.call(t);
    }
    function db() {
      sy = !1;
    }
    function dy() {
      return sy;
    }
    function pb(e, t, i) {
      var o = t.effects;
      if (t.effects = null, o !== null)
        for (var u = 0; u < o.length; u++) {
          var d = o[u], v = d.callback;
          v !== null && (d.callback = null, zM(v, i));
        }
    }
    var HS = {}, hb = new a.Component().refs, IS, YS, $S, WS, GS, mb, py, KS, QS, XS;
    {
      IS = /* @__PURE__ */ new Set(), YS = /* @__PURE__ */ new Set(), $S = /* @__PURE__ */ new Set(), WS = /* @__PURE__ */ new Set(), KS = /* @__PURE__ */ new Set(), GS = /* @__PURE__ */ new Set(), QS = /* @__PURE__ */ new Set(), XS = /* @__PURE__ */ new Set();
      var vb = /* @__PURE__ */ new Set();
      py = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var i = t + "_" + e;
          vb.has(i) || (vb.add(i), h("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, mb = function(e, t) {
        if (t === void 0) {
          var i = jt(e) || "Component";
          GS.has(i) || (GS.add(i), h("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", i));
        }
      }, Object.defineProperty(HS, "_processChildContext", {
        enumerable: !1,
        value: function() {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(HS);
    }
    function qS(e, t, i, o) {
      var u = e.memoizedState, d = i(o, u);
      {
        if (e.mode & Mn) {
          un(!0);
          try {
            d = i(o, u);
          } finally {
            un(!1);
          }
        }
        mb(t, d);
      }
      var v = d == null ? u : kt({}, u, d);
      if (e.memoizedState = v, e.lanes === oe) {
        var S = e.updateQueue;
        S.baseState = v;
      }
    }
    var ZS = {
      isMounted: zm,
      enqueueSetState: function(e, t, i) {
        var o = Bs(e), u = Di(), d = xu(o), v = cs(u, d);
        v.payload = t, i != null && (py(i, "setState"), v.callback = i);
        var S = vu(o, v, d);
        S !== null && (xr(S, o, d, u), cy(S, o, d)), $l(o, d);
      },
      enqueueReplaceState: function(e, t, i) {
        var o = Bs(e), u = Di(), d = xu(o), v = cs(u, d);
        v.tag = cb, v.payload = t, i != null && (py(i, "replaceState"), v.callback = i);
        var S = vu(o, v, d);
        S !== null && (xr(S, o, d, u), cy(S, o, d)), $l(o, d);
      },
      enqueueForceUpdate: function(e, t) {
        var i = Bs(e), o = Di(), u = xu(i), d = cs(o, u);
        d.tag = ly, t != null && (py(t, "forceUpdate"), d.callback = t);
        var v = vu(i, d, u);
        v !== null && (xr(v, i, u, o), cy(v, i, u)), Zu(i, u);
      }
    };
    function yb(e, t, i, o, u, d, v) {
      var S = e.stateNode;
      if (typeof S.shouldComponentUpdate == "function") {
        var C = S.shouldComponentUpdate(o, d, v);
        {
          if (e.mode & Mn) {
            un(!0);
            try {
              C = S.shouldComponentUpdate(o, d, v);
            } finally {
              un(!1);
            }
          }
          C === void 0 && h("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", jt(t) || "Component");
        }
        return C;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !me(i, o) || !me(u, d) : !0;
    }
    function UM(e, t, i) {
      var o = e.stateNode;
      {
        var u = jt(t) || "Component", d = o.render;
        d || (t.prototype && typeof t.prototype.render == "function" ? h("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", u) : h("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", u)), o.getInitialState && !o.getInitialState.isReactClassApproved && !o.state && h("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", u), o.getDefaultProps && !o.getDefaultProps.isReactClassApproved && h("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", u), o.propTypes && h("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", u), o.contextType && h("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", u), o.contextTypes && h("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", u), t.contextType && t.contextTypes && !QS.has(t) && (QS.add(t), h("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", u)), typeof o.componentShouldUpdate == "function" && h("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", u), t.prototype && t.prototype.isPureReactComponent && typeof o.shouldComponentUpdate < "u" && h("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", jt(t) || "A pure component"), typeof o.componentDidUnmount == "function" && h("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", u), typeof o.componentDidReceiveProps == "function" && h("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", u), typeof o.componentWillRecieveProps == "function" && h("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", u), typeof o.UNSAFE_componentWillRecieveProps == "function" && h("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", u);
        var v = o.props !== i;
        o.props !== void 0 && v && h("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", u, u), o.defaultProps && h("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", u, u), typeof o.getSnapshotBeforeUpdate == "function" && typeof o.componentDidUpdate != "function" && !$S.has(t) && ($S.add(t), h("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", jt(t))), typeof o.getDerivedStateFromProps == "function" && h("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof o.getDerivedStateFromError == "function" && h("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof t.getSnapshotBeforeUpdate == "function" && h("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", u);
        var S = o.state;
        S && (typeof S != "object" || Tt(S)) && h("%s.state: must be set to an object or null", u), typeof o.getChildContext == "function" && typeof t.childContextTypes != "object" && h("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", u);
      }
    }
    function gb(e, t) {
      t.updater = ZS, e.stateNode = t, Bl(t, e), t._reactInternalInstance = HS;
    }
    function Sb(e, t, i) {
      var o = !1, u = Sa, d = Sa, v = t.contextType;
      if ("contextType" in t) {
        var S = (
          // Allow null for conditional declaration
          v === null || v !== void 0 && v.$$typeof === ce && v._context === void 0
        );
        if (!S && !XS.has(t)) {
          XS.add(t);
          var C = "";
          v === void 0 ? C = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof v != "object" ? C = " However, it is set to a " + typeof v + "." : v.$$typeof === P ? C = " Did you accidentally pass the Context.Provider instead?" : v._context !== void 0 ? C = " Did you accidentally pass the Context.Consumer instead?" : C = " However, it is set to an object with keys {" + Object.keys(v).join(", ") + "}.", h("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", jt(t) || "Component", C);
        }
      }
      if (typeof v == "object" && v !== null)
        d = sr(v);
      else {
        u = rd(e, t, !0);
        var k = t.contextTypes;
        o = k != null, d = o ? id(e, u) : Sa;
      }
      var _ = new t(i, d);
      if (e.mode & Mn) {
        un(!0);
        try {
          _ = new t(i, d);
        } finally {
          un(!1);
        }
      }
      var F = e.memoizedState = _.state !== null && _.state !== void 0 ? _.state : null;
      gb(e, _);
      {
        if (typeof t.getDerivedStateFromProps == "function" && F === null) {
          var z = jt(t) || "Component";
          YS.has(z) || (YS.add(z), h("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", z, _.state === null ? "null" : "undefined", z));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof _.getSnapshotBeforeUpdate == "function") {
          var $ = null, G = null, Z = null;
          if (typeof _.componentWillMount == "function" && _.componentWillMount.__suppressDeprecationWarning !== !0 ? $ = "componentWillMount" : typeof _.UNSAFE_componentWillMount == "function" && ($ = "UNSAFE_componentWillMount"), typeof _.componentWillReceiveProps == "function" && _.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? G = "componentWillReceiveProps" : typeof _.UNSAFE_componentWillReceiveProps == "function" && (G = "UNSAFE_componentWillReceiveProps"), typeof _.componentWillUpdate == "function" && _.componentWillUpdate.__suppressDeprecationWarning !== !0 ? Z = "componentWillUpdate" : typeof _.UNSAFE_componentWillUpdate == "function" && (Z = "UNSAFE_componentWillUpdate"), $ !== null || G !== null || Z !== null) {
            var Ae = jt(t) || "Component", Ze = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            WS.has(Ae) || (WS.add(Ae), h(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, Ae, Ze, $ !== null ? `
  ` + $ : "", G !== null ? `
  ` + G : "", Z !== null ? `
  ` + Z : ""));
          }
        }
      }
      return o && IT(e, u, d), _;
    }
    function FM(e, t) {
      var i = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), i !== t.state && (h("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", lt(e) || "Component"), ZS.enqueueReplaceState(t, t.state, null));
    }
    function Cb(e, t, i, o) {
      var u = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(i, o), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(i, o), t.state !== u) {
        {
          var d = lt(e) || "Component";
          IS.has(d) || (IS.add(d), h("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", d));
        }
        ZS.enqueueReplaceState(t, t.state, null);
      }
    }
    function JS(e, t, i, o) {
      UM(e, t, i);
      var u = e.stateNode;
      u.props = i, u.state = e.memoizedState, u.refs = hb, jS(e);
      var d = t.contextType;
      if (typeof d == "object" && d !== null)
        u.context = sr(d);
      else {
        var v = rd(e, t, !0);
        u.context = id(e, v);
      }
      {
        if (u.state === i) {
          var S = jt(t) || "Component";
          KS.has(S) || (KS.add(S), h("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", S));
        }
        e.mode & Mn && Ro.recordLegacyContextWarning(e, u), Ro.recordUnsafeLifecycleWarnings(e, u);
      }
      u.state = e.memoizedState;
      var C = t.getDerivedStateFromProps;
      if (typeof C == "function" && (qS(e, t, C, i), u.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof u.getSnapshotBeforeUpdate != "function" && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (FM(e, u), fy(e, i, u, o), u.state = e.memoizedState), typeof u.componentDidMount == "function") {
        var k = At;
        k |= co, (e.mode & Yi) !== Ke && (k |= Zo), e.flags |= k;
      }
    }
    function jM(e, t, i, o) {
      var u = e.stateNode, d = e.memoizedProps;
      u.props = d;
      var v = u.context, S = t.contextType, C = Sa;
      if (typeof S == "object" && S !== null)
        C = sr(S);
      else {
        var k = rd(e, t, !0);
        C = id(e, k);
      }
      var _ = t.getDerivedStateFromProps, F = typeof _ == "function" || typeof u.getSnapshotBeforeUpdate == "function";
      !F && (typeof u.UNSAFE_componentWillReceiveProps == "function" || typeof u.componentWillReceiveProps == "function") && (d !== i || v !== C) && Cb(e, u, i, C), db();
      var z = e.memoizedState, $ = u.state = z;
      if (fy(e, i, u, o), $ = e.memoizedState, d === i && z === $ && !Kv() && !dy()) {
        if (typeof u.componentDidMount == "function") {
          var G = At;
          G |= co, (e.mode & Yi) !== Ke && (G |= Zo), e.flags |= G;
        }
        return !1;
      }
      typeof _ == "function" && (qS(e, t, _, i), $ = e.memoizedState);
      var Z = dy() || yb(e, t, d, i, z, $, C);
      if (Z) {
        if (!F && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function") {
          var Ae = At;
          Ae |= co, (e.mode & Yi) !== Ke && (Ae |= Zo), e.flags |= Ae;
        }
      } else {
        if (typeof u.componentDidMount == "function") {
          var Ze = At;
          Ze |= co, (e.mode & Yi) !== Ke && (Ze |= Zo), e.flags |= Ze;
        }
        e.memoizedProps = i, e.memoizedState = $;
      }
      return u.props = i, u.state = $, u.context = C, Z;
    }
    function BM(e, t, i, o, u) {
      var d = t.stateNode;
      fb(e, t);
      var v = t.memoizedProps, S = t.type === t.elementType ? v : ko(t.type, v);
      d.props = S;
      var C = t.pendingProps, k = d.context, _ = i.contextType, F = Sa;
      if (typeof _ == "object" && _ !== null)
        F = sr(_);
      else {
        var z = rd(t, i, !0);
        F = id(t, z);
      }
      var $ = i.getDerivedStateFromProps, G = typeof $ == "function" || typeof d.getSnapshotBeforeUpdate == "function";
      !G && (typeof d.UNSAFE_componentWillReceiveProps == "function" || typeof d.componentWillReceiveProps == "function") && (v !== C || k !== F) && Cb(t, d, o, F), db();
      var Z = t.memoizedState, Ae = d.state = Z;
      if (fy(t, o, d, u), Ae = t.memoizedState, v === C && Z === Ae && !Kv() && !dy() && !De)
        return typeof d.componentDidUpdate == "function" && (v !== e.memoizedProps || Z !== e.memoizedState) && (t.flags |= At), typeof d.getSnapshotBeforeUpdate == "function" && (v !== e.memoizedProps || Z !== e.memoizedState) && (t.flags |= Kn), !1;
      typeof $ == "function" && (qS(t, i, $, o), Ae = t.memoizedState);
      var Ze = dy() || yb(t, i, S, o, Z, Ae, F) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      De;
      return Ze ? (!G && (typeof d.UNSAFE_componentWillUpdate == "function" || typeof d.componentWillUpdate == "function") && (typeof d.componentWillUpdate == "function" && d.componentWillUpdate(o, Ae, F), typeof d.UNSAFE_componentWillUpdate == "function" && d.UNSAFE_componentWillUpdate(o, Ae, F)), typeof d.componentDidUpdate == "function" && (t.flags |= At), typeof d.getSnapshotBeforeUpdate == "function" && (t.flags |= Kn)) : (typeof d.componentDidUpdate == "function" && (v !== e.memoizedProps || Z !== e.memoizedState) && (t.flags |= At), typeof d.getSnapshotBeforeUpdate == "function" && (v !== e.memoizedProps || Z !== e.memoizedState) && (t.flags |= Kn), t.memoizedProps = o, t.memoizedState = Ae), d.props = o, d.state = Ae, d.context = F, Ze;
    }
    var e0, t0, n0, r0, i0, Eb = function(e, t) {
    };
    e0 = !1, t0 = !1, n0 = {}, r0 = {}, i0 = {}, Eb = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var i = lt(t) || "Component";
        r0[i] || (r0[i] = !0, h('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function dh(e, t, i) {
      var o = i.ref;
      if (o !== null && typeof o != "function" && typeof o != "object") {
        if ((e.mode & Mn || be) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(i._owner && i._self && i._owner.stateNode !== i._self)) {
          var u = lt(e) || "Component";
          n0[u] || (h('A string ref, "%s", has been found within a strict mode tree. String refs are a source of potential bugs and should be avoided. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', o), n0[u] = !0);
        }
        if (i._owner) {
          var d = i._owner, v;
          if (d) {
            var S = d;
            if (S.tag !== R)
              throw new Error("Function components cannot have string refs. We recommend using useRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref");
            v = S.stateNode;
          }
          if (!v)
            throw new Error("Missing owner for string ref " + o + ". This error is likely caused by a bug in React. Please file an issue.");
          var C = v;
          Ta(o, "ref");
          var k = "" + o;
          if (t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === k)
            return t.ref;
          var _ = function(F) {
            var z = C.refs;
            z === hb && (z = C.refs = {}), F === null ? delete z[k] : z[k] = F;
          };
          return _._stringRef = k, _;
        } else {
          if (typeof o != "string")
            throw new Error("Expected ref to be a function, a string, an object returned by React.createRef(), or null.");
          if (!i._owner)
            throw new Error("Element ref was specified as a string (" + o + `) but no owner was set. This could happen for one of the following reasons:
1. You may be adding a ref to a function component
2. You may be adding a ref to a component that was not created inside a component's render method
3. You have multiple copies of React loaded
See https://reactjs.org/link/refs-must-have-owner for more information.`);
        }
      }
      return o;
    }
    function hy(e, t) {
      var i = Object.prototype.toString.call(t);
      throw new Error("Objects are not valid as a React child (found: " + (i === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : i) + "). If you meant to render a collection of children, use an array instead.");
    }
    function my(e) {
      {
        var t = lt(e) || "Component";
        if (i0[t])
          return;
        i0[t] = !0, h("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function Tb(e) {
      var t = e._payload, i = e._init;
      return i(t);
    }
    function bb(e) {
      function t(I, J) {
        if (e) {
          var Y = I.deletions;
          Y === null ? (I.deletions = [J], I.flags |= zi) : Y.push(J);
        }
      }
      function i(I, J) {
        if (!e)
          return null;
        for (var Y = J; Y !== null; )
          t(I, Y), Y = Y.sibling;
        return null;
      }
      function o(I, J) {
        for (var Y = /* @__PURE__ */ new Map(), pe = J; pe !== null; )
          pe.key !== null ? Y.set(pe.key, pe) : Y.set(pe.index, pe), pe = pe.sibling;
        return Y;
      }
      function u(I, J) {
        var Y = Vc(I, J);
        return Y.index = 0, Y.sibling = null, Y;
      }
      function d(I, J, Y) {
        if (I.index = Y, !e)
          return I.flags |= Aa, J;
        var pe = I.alternate;
        if (pe !== null) {
          var Le = pe.index;
          return Le < J ? (I.flags |= Tn, J) : Le;
        } else
          return I.flags |= Tn, J;
      }
      function v(I) {
        return e && I.alternate === null && (I.flags |= Tn), I;
      }
      function S(I, J, Y, pe) {
        if (J === null || J.tag !== q) {
          var Le = OC(Y, I.mode, pe);
          return Le.return = I, Le;
        } else {
          var ke = u(J, Y);
          return ke.return = I, ke;
        }
      }
      function C(I, J, Y, pe) {
        var Le = Y.type;
        if (Le === xa)
          return _(I, J, Y.props.children, pe, Y.key);
        if (J !== null && (J.elementType === Le || // Keep this check inline so it only runs on the false path:
        pw(J, Y) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof Le == "object" && Le !== null && Le.$$typeof === et && Tb(Le) === J.type)) {
          var ke = u(J, Y.props);
          return ke.ref = dh(I, J, Y), ke.return = I, ke._debugSource = Y._source, ke._debugOwner = Y._owner, ke;
        }
        var ot = MC(Y, I.mode, pe);
        return ot.ref = dh(I, J, Y), ot.return = I, ot;
      }
      function k(I, J, Y, pe) {
        if (J === null || J.tag !== A || J.stateNode.containerInfo !== Y.containerInfo || J.stateNode.implementation !== Y.implementation) {
          var Le = AC(Y, I.mode, pe);
          return Le.return = I, Le;
        } else {
          var ke = u(J, Y.children || []);
          return ke.return = I, ke;
        }
      }
      function _(I, J, Y, pe, Le) {
        if (J === null || J.tag !== re) {
          var ke = Ru(Y, I.mode, pe, Le);
          return ke.return = I, ke;
        } else {
          var ot = u(J, Y);
          return ot.return = I, ot;
        }
      }
      function F(I, J, Y) {
        if (typeof J == "string" && J !== "" || typeof J == "number") {
          var pe = OC("" + J, I.mode, Y);
          return pe.return = I, pe;
        }
        if (typeof J == "object" && J !== null) {
          switch (J.$$typeof) {
            case Ur: {
              var Le = MC(J, I.mode, Y);
              return Le.ref = dh(I, null, J), Le.return = I, Le;
            }
            case Mr: {
              var ke = AC(J, I.mode, Y);
              return ke.return = I, ke;
            }
            case et: {
              var ot = J._payload, dt = J._init;
              return F(I, dt(ot), Y);
            }
          }
          if (Tt(J) || Gt(J)) {
            var en = Ru(J, I.mode, Y, null);
            return en.return = I, en;
          }
          hy(I, J);
        }
        return typeof J == "function" && my(I), null;
      }
      function z(I, J, Y, pe) {
        var Le = J !== null ? J.key : null;
        if (typeof Y == "string" && Y !== "" || typeof Y == "number")
          return Le !== null ? null : S(I, J, "" + Y, pe);
        if (typeof Y == "object" && Y !== null) {
          switch (Y.$$typeof) {
            case Ur:
              return Y.key === Le ? C(I, J, Y, pe) : null;
            case Mr:
              return Y.key === Le ? k(I, J, Y, pe) : null;
            case et: {
              var ke = Y._payload, ot = Y._init;
              return z(I, J, ot(ke), pe);
            }
          }
          if (Tt(Y) || Gt(Y))
            return Le !== null ? null : _(I, J, Y, pe, null);
          hy(I, Y);
        }
        return typeof Y == "function" && my(I), null;
      }
      function $(I, J, Y, pe, Le) {
        if (typeof pe == "string" && pe !== "" || typeof pe == "number") {
          var ke = I.get(Y) || null;
          return S(J, ke, "" + pe, Le);
        }
        if (typeof pe == "object" && pe !== null) {
          switch (pe.$$typeof) {
            case Ur: {
              var ot = I.get(pe.key === null ? Y : pe.key) || null;
              return C(J, ot, pe, Le);
            }
            case Mr: {
              var dt = I.get(pe.key === null ? Y : pe.key) || null;
              return k(J, dt, pe, Le);
            }
            case et:
              var en = pe._payload, Ht = pe._init;
              return $(I, J, Y, Ht(en), Le);
          }
          if (Tt(pe) || Gt(pe)) {
            var Zn = I.get(Y) || null;
            return _(J, Zn, pe, Le, null);
          }
          hy(J, pe);
        }
        return typeof pe == "function" && my(J), null;
      }
      function G(I, J, Y) {
        {
          if (typeof I != "object" || I === null)
            return J;
          switch (I.$$typeof) {
            case Ur:
            case Mr:
              Eb(I, Y);
              var pe = I.key;
              if (typeof pe != "string")
                break;
              if (J === null) {
                J = /* @__PURE__ */ new Set(), J.add(pe);
                break;
              }
              if (!J.has(pe)) {
                J.add(pe);
                break;
              }
              h("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", pe);
              break;
            case et:
              var Le = I._payload, ke = I._init;
              G(ke(Le), J, Y);
              break;
          }
        }
        return J;
      }
      function Z(I, J, Y, pe) {
        for (var Le = null, ke = 0; ke < Y.length; ke++) {
          var ot = Y[ke];
          Le = G(ot, Le, I);
        }
        for (var dt = null, en = null, Ht = J, Zn = 0, It = 0, In = null; Ht !== null && It < Y.length; It++) {
          Ht.index > It ? (In = Ht, Ht = null) : In = Ht.sibling;
          var hi = z(I, Ht, Y[It], pe);
          if (hi === null) {
            Ht === null && (Ht = In);
            break;
          }
          e && Ht && hi.alternate === null && t(I, Ht), Zn = d(hi, Zn, It), en === null ? dt = hi : en.sibling = hi, en = hi, Ht = In;
        }
        if (It === Y.length) {
          if (i(I, Ht), Yr()) {
            var qr = It;
            bc(I, qr);
          }
          return dt;
        }
        if (Ht === null) {
          for (; It < Y.length; It++) {
            var Ea = F(I, Y[It], pe);
            Ea !== null && (Zn = d(Ea, Zn, It), en === null ? dt = Ea : en.sibling = Ea, en = Ea);
          }
          if (Yr()) {
            var _i = It;
            bc(I, _i);
          }
          return dt;
        }
        for (var Mi = o(I, Ht); It < Y.length; It++) {
          var mi = $(Mi, I, It, Y[It], pe);
          mi !== null && (e && mi.alternate !== null && Mi.delete(mi.key === null ? It : mi.key), Zn = d(mi, Zn, It), en === null ? dt = mi : en.sibling = mi, en = mi);
        }
        if (e && Mi.forEach(function(Rd) {
          return t(I, Rd);
        }), Yr()) {
          var vs = It;
          bc(I, vs);
        }
        return dt;
      }
      function Ae(I, J, Y, pe) {
        var Le = Gt(Y);
        if (typeof Le != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          Y[Symbol.toStringTag] === "Generator" && (t0 || h("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), t0 = !0), Y.entries === Le && (e0 || h("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), e0 = !0);
          var ke = Le.call(Y);
          if (ke)
            for (var ot = null, dt = ke.next(); !dt.done; dt = ke.next()) {
              var en = dt.value;
              ot = G(en, ot, I);
            }
        }
        var Ht = Le.call(Y);
        if (Ht == null)
          throw new Error("An iterable object provided no iterator.");
        for (var Zn = null, It = null, In = J, hi = 0, qr = 0, Ea = null, _i = Ht.next(); In !== null && !_i.done; qr++, _i = Ht.next()) {
          In.index > qr ? (Ea = In, In = null) : Ea = In.sibling;
          var Mi = z(I, In, _i.value, pe);
          if (Mi === null) {
            In === null && (In = Ea);
            break;
          }
          e && In && Mi.alternate === null && t(I, In), hi = d(Mi, hi, qr), It === null ? Zn = Mi : It.sibling = Mi, It = Mi, In = Ea;
        }
        if (_i.done) {
          if (i(I, In), Yr()) {
            var mi = qr;
            bc(I, mi);
          }
          return Zn;
        }
        if (In === null) {
          for (; !_i.done; qr++, _i = Ht.next()) {
            var vs = F(I, _i.value, pe);
            vs !== null && (hi = d(vs, hi, qr), It === null ? Zn = vs : It.sibling = vs, It = vs);
          }
          if (Yr()) {
            var Rd = qr;
            bc(I, Rd);
          }
          return Zn;
        }
        for (var Hh = o(I, In); !_i.done; qr++, _i = Ht.next()) {
          var xl = $(Hh, I, qr, _i.value, pe);
          xl !== null && (e && xl.alternate !== null && Hh.delete(xl.key === null ? qr : xl.key), hi = d(xl, hi, qr), It === null ? Zn = xl : It.sibling = xl, It = xl);
        }
        if (e && Hh.forEach(function(tN) {
          return t(I, tN);
        }), Yr()) {
          var eN = qr;
          bc(I, eN);
        }
        return Zn;
      }
      function Ze(I, J, Y, pe) {
        if (J !== null && J.tag === q) {
          i(I, J.sibling);
          var Le = u(J, Y);
          return Le.return = I, Le;
        }
        i(I, J);
        var ke = OC(Y, I.mode, pe);
        return ke.return = I, ke;
      }
      function $e(I, J, Y, pe) {
        for (var Le = Y.key, ke = J; ke !== null; ) {
          if (ke.key === Le) {
            var ot = Y.type;
            if (ot === xa) {
              if (ke.tag === re) {
                i(I, ke.sibling);
                var dt = u(ke, Y.props.children);
                return dt.return = I, dt._debugSource = Y._source, dt._debugOwner = Y._owner, dt;
              }
            } else if (ke.elementType === ot || // Keep this check inline so it only runs on the false path:
            pw(ke, Y) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof ot == "object" && ot !== null && ot.$$typeof === et && Tb(ot) === ke.type) {
              i(I, ke.sibling);
              var en = u(ke, Y.props);
              return en.ref = dh(I, ke, Y), en.return = I, en._debugSource = Y._source, en._debugOwner = Y._owner, en;
            }
            i(I, ke);
            break;
          } else
            t(I, ke);
          ke = ke.sibling;
        }
        if (Y.type === xa) {
          var Ht = Ru(Y.props.children, I.mode, pe, Y.key);
          return Ht.return = I, Ht;
        } else {
          var Zn = MC(Y, I.mode, pe);
          return Zn.ref = dh(I, J, Y), Zn.return = I, Zn;
        }
      }
      function Pt(I, J, Y, pe) {
        for (var Le = Y.key, ke = J; ke !== null; ) {
          if (ke.key === Le)
            if (ke.tag === A && ke.stateNode.containerInfo === Y.containerInfo && ke.stateNode.implementation === Y.implementation) {
              i(I, ke.sibling);
              var ot = u(ke, Y.children || []);
              return ot.return = I, ot;
            } else {
              i(I, ke);
              break;
            }
          else
            t(I, ke);
          ke = ke.sibling;
        }
        var dt = AC(Y, I.mode, pe);
        return dt.return = I, dt;
      }
      function Dt(I, J, Y, pe) {
        var Le = typeof Y == "object" && Y !== null && Y.type === xa && Y.key === null;
        if (Le && (Y = Y.props.children), typeof Y == "object" && Y !== null) {
          switch (Y.$$typeof) {
            case Ur:
              return v($e(I, J, Y, pe));
            case Mr:
              return v(Pt(I, J, Y, pe));
            case et:
              var ke = Y._payload, ot = Y._init;
              return Dt(I, J, ot(ke), pe);
          }
          if (Tt(Y))
            return Z(I, J, Y, pe);
          if (Gt(Y))
            return Ae(I, J, Y, pe);
          hy(I, Y);
        }
        return typeof Y == "string" && Y !== "" || typeof Y == "number" ? v(Ze(I, J, "" + Y, pe)) : (typeof Y == "function" && my(I), i(I, J));
      }
      return Dt;
    }
    var cd = bb(!0), xb = bb(!1);
    function HM(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var i = t.child, o = Vc(i, i.pendingProps);
        for (t.child = o, o.return = t; i.sibling !== null; )
          i = i.sibling, o = o.sibling = Vc(i, i.pendingProps), o.return = t;
        o.sibling = null;
      }
    }
    function IM(e, t) {
      for (var i = e.child; i !== null; )
        gL(i, t), i = i.sibling;
    }
    var ph = {}, yu = du(ph), hh = du(ph), vy = du(ph);
    function yy(e) {
      if (e === ph)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function wb() {
      var e = yy(vy.current);
      return e;
    }
    function a0(e, t) {
      di(vy, t, e), di(hh, e, e), di(yu, ph, e);
      var i = r_(t);
      fi(yu, e), di(yu, i, e);
    }
    function fd(e) {
      fi(yu, e), fi(hh, e), fi(vy, e);
    }
    function o0() {
      var e = yy(yu.current);
      return e;
    }
    function Rb(e) {
      yy(vy.current);
      var t = yy(yu.current), i = i_(t, e.type);
      t !== i && (di(hh, e, e), di(yu, i, e));
    }
    function l0(e) {
      hh.current === e && (fi(yu, e), fi(hh, e));
    }
    var YM = 0, kb = 1, Db = 1, mh = 2, Do = du(YM);
    function s0(e, t) {
      return (e & t) !== 0;
    }
    function dd(e) {
      return e & kb;
    }
    function u0(e, t) {
      return e & kb | t;
    }
    function $M(e, t) {
      return e | t;
    }
    function gu(e, t) {
      di(Do, t, e);
    }
    function pd(e) {
      fi(Do, e);
    }
    function WM(e, t) {
      var i = e.memoizedState;
      return i !== null ? i.dehydrated !== null : (e.memoizedProps, !0);
    }
    function gy(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === ae) {
          var i = t.memoizedState;
          if (i !== null) {
            var o = i.dehydrated;
            if (o === null || UT(o) || mS(o))
              return t;
          }
        } else if (t.tag === Mt && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var u = (t.flags & Ge) !== Qe;
          if (u)
            return t;
        } else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === e)
          return null;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            return null;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return null;
    }
    var qi = (
      /*   */
      0
    ), yr = (
      /* */
      1
    ), yl = (
      /*  */
      2
    ), gr = (
      /*    */
      4
    ), $r = (
      /*   */
      8
    ), c0 = [];
    function f0() {
      for (var e = 0; e < c0.length; e++) {
        var t = c0[e];
        t._workInProgressVersionPrimary = null;
      }
      c0.length = 0;
    }
    function GM(e, t) {
      var i = t._getVersion, o = i(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, o] : e.mutableSourceEagerHydrationData.push(t, o);
    }
    var Oe = c.ReactCurrentDispatcher, vh = c.ReactCurrentBatchConfig, d0, hd;
    d0 = /* @__PURE__ */ new Set();
    var _c = oe, Jt = null, Sr = null, Cr = null, Sy = !1, yh = !1, gh = 0, KM = 0, QM = 25, te = null, Ga = null, Su = -1, p0 = !1;
    function Wt() {
      {
        var e = te;
        Ga === null ? Ga = [e] : Ga.push(e);
      }
    }
    function Ee() {
      {
        var e = te;
        Ga !== null && (Su++, Ga[Su] !== e && XM(e));
      }
    }
    function md(e) {
      e != null && !Tt(e) && h("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", te, typeof e);
    }
    function XM(e) {
      {
        var t = lt(Jt);
        if (!d0.has(t) && (d0.add(t), Ga !== null)) {
          for (var i = "", o = 30, u = 0; u <= Su; u++) {
            for (var d = Ga[u], v = u === Su ? e : d, S = u + 1 + ". " + d; S.length < o; )
              S += " ";
            S += v + `
`, i += S;
          }
          h(`React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://reactjs.org/link/rules-of-hooks

   Previous render            Next render
   ------------------------------------------------------
%s   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
`, t, i);
        }
      }
    }
    function pi() {
      throw new Error(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`);
    }
    function h0(e, t) {
      if (p0)
        return !1;
      if (t === null)
        return h("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", te), !1;
      e.length !== t.length && h(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, te, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var i = 0; i < t.length && i < e.length; i++)
        if (!B(e[i], t[i]))
          return !1;
      return !0;
    }
    function vd(e, t, i, o, u, d) {
      _c = d, Jt = t, Ga = e !== null ? e._debugHookTypes : null, Su = -1, p0 = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = oe, e !== null && e.memoizedState !== null ? Oe.current = Xb : Ga !== null ? Oe.current = Qb : Oe.current = Kb;
      var v = i(o, u);
      if (yh) {
        var S = 0;
        do {
          if (yh = !1, gh = 0, S >= QM)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          S += 1, p0 = !1, Sr = null, Cr = null, t.updateQueue = null, Su = -1, Oe.current = qb, v = i(o, u);
        } while (yh);
      }
      Oe.current = Ay, t._debugHookTypes = Ga;
      var C = Sr !== null && Sr.next !== null;
      if (_c = oe, Jt = null, Sr = null, Cr = null, te = null, Ga = null, Su = -1, e !== null && (e.flags & jn) !== (t.flags & jn) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & wt) !== Ke && h("Internal React error: Expected static flag was missing. Please notify the React team."), Sy = !1, C)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return v;
    }
    function yd() {
      var e = gh !== 0;
      return gh = 0, e;
    }
    function _b(e, t, i) {
      t.updateQueue = e.updateQueue, (t.mode & Yi) !== Ke ? t.flags &= -50333701 : t.flags &= -2053, e.lanes = oc(e.lanes, i);
    }
    function Mb() {
      if (Oe.current = Ay, Sy) {
        for (var e = Jt.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        Sy = !1;
      }
      _c = oe, Jt = null, Sr = null, Cr = null, Ga = null, Su = -1, te = null, Ib = !1, yh = !1, gh = 0;
    }
    function gl() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return Cr === null ? Jt.memoizedState = Cr = e : Cr = Cr.next = e, Cr;
    }
    function Ka() {
      var e;
      if (Sr === null) {
        var t = Jt.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = Sr.next;
      var i;
      if (Cr === null ? i = Jt.memoizedState : i = Cr.next, i !== null)
        Cr = i, i = Cr.next, Sr = e;
      else {
        if (e === null)
          throw new Error("Rendered more hooks than during the previous render.");
        Sr = e;
        var o = {
          memoizedState: Sr.memoizedState,
          baseState: Sr.baseState,
          baseQueue: Sr.baseQueue,
          queue: Sr.queue,
          next: null
        };
        Cr === null ? Jt.memoizedState = Cr = o : Cr = Cr.next = o;
      }
      return Cr;
    }
    function Ob() {
      return {
        lastEffect: null,
        stores: null
      };
    }
    function m0(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function v0(e, t, i) {
      var o = gl(), u;
      i !== void 0 ? u = i(t) : u = t, o.memoizedState = o.baseState = u;
      var d = {
        pending: null,
        interleaved: null,
        lanes: oe,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: u
      };
      o.queue = d;
      var v = d.dispatch = eO.bind(null, Jt, d);
      return [o.memoizedState, v];
    }
    function y0(e, t, i) {
      var o = Ka(), u = o.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var d = Sr, v = d.baseQueue, S = u.pending;
      if (S !== null) {
        if (v !== null) {
          var C = v.next, k = S.next;
          v.next = k, S.next = C;
        }
        d.baseQueue !== v && h("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), d.baseQueue = v = S, u.pending = null;
      }
      if (v !== null) {
        var _ = v.next, F = d.baseState, z = null, $ = null, G = null, Z = _;
        do {
          var Ae = Z.lane;
          if (Kl(_c, Ae)) {
            if (G !== null) {
              var $e = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: gn,
                action: Z.action,
                hasEagerState: Z.hasEagerState,
                eagerState: Z.eagerState,
                next: null
              };
              G = G.next = $e;
            }
            if (Z.hasEagerState)
              F = Z.eagerState;
            else {
              var Pt = Z.action;
              F = e(F, Pt);
            }
          } else {
            var Ze = {
              lane: Ae,
              action: Z.action,
              hasEagerState: Z.hasEagerState,
              eagerState: Z.eagerState,
              next: null
            };
            G === null ? ($ = G = Ze, z = F) : G = G.next = Ze, Jt.lanes = vt(Jt.lanes, Ae), zh(Ae);
          }
          Z = Z.next;
        } while (Z !== null && Z !== _);
        G === null ? z = F : G.next = $, B(F, o.memoizedState) || wh(), o.memoizedState = F, o.baseState = z, o.baseQueue = G, u.lastRenderedState = F;
      }
      var Dt = u.interleaved;
      if (Dt !== null) {
        var I = Dt;
        do {
          var J = I.lane;
          Jt.lanes = vt(Jt.lanes, J), zh(J), I = I.next;
        } while (I !== Dt);
      } else v === null && (u.lanes = oe);
      var Y = u.dispatch;
      return [o.memoizedState, Y];
    }
    function g0(e, t, i) {
      var o = Ka(), u = o.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var d = u.dispatch, v = u.pending, S = o.memoizedState;
      if (v !== null) {
        u.pending = null;
        var C = v.next, k = C;
        do {
          var _ = k.action;
          S = e(S, _), k = k.next;
        } while (k !== C);
        B(S, o.memoizedState) || wh(), o.memoizedState = S, o.baseQueue === null && (o.baseState = S), u.lastRenderedState = S;
      }
      return [S, d];
    }
    function LF(e, t, i) {
    }
    function NF(e, t, i) {
    }
    function S0(e, t, i) {
      var o = Jt, u = gl(), d, v = Yr();
      if (v) {
        if (i === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        d = i(), hd || d !== i() && (h("The result of getServerSnapshot should be cached to avoid an infinite loop"), hd = !0);
      } else {
        if (d = t(), !hd) {
          var S = t();
          B(d, S) || (h("The result of getSnapshot should be cached to avoid an infinite loop"), hd = !0);
        }
        var C = Xy();
        if (C === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        tu(C, _c) || Ab(o, t, d);
      }
      u.memoizedState = d;
      var k = {
        value: d,
        getSnapshot: t
      };
      return u.queue = k, xy(Nb.bind(null, o, k, e), [e]), o.flags |= ni, Sh(yr | $r, Lb.bind(null, o, k, d, t), void 0, null), d;
    }
    function Cy(e, t, i) {
      var o = Jt, u = Ka(), d = t();
      if (!hd) {
        var v = t();
        B(d, v) || (h("The result of getSnapshot should be cached to avoid an infinite loop"), hd = !0);
      }
      var S = u.memoizedState, C = !B(S, d);
      C && (u.memoizedState = d, wh());
      var k = u.queue;
      if (Eh(Nb.bind(null, o, k, e), [e]), k.getSnapshot !== t || C || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      Cr !== null && Cr.memoizedState.tag & yr) {
        o.flags |= ni, Sh(yr | $r, Lb.bind(null, o, k, d, t), void 0, null);
        var _ = Xy();
        if (_ === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        tu(_, _c) || Ab(o, t, d);
      }
      return d;
    }
    function Ab(e, t, i) {
      e.flags |= Hs;
      var o = {
        getSnapshot: t,
        value: i
      }, u = Jt.updateQueue;
      if (u === null)
        u = Ob(), Jt.updateQueue = u, u.stores = [o];
      else {
        var d = u.stores;
        d === null ? u.stores = [o] : d.push(o);
      }
    }
    function Lb(e, t, i, o) {
      t.value = i, t.getSnapshot = o, Pb(t) && Vb(e);
    }
    function Nb(e, t, i) {
      var o = function() {
        Pb(t) && Vb(e);
      };
      return i(o);
    }
    function Pb(e) {
      var t = e.getSnapshot, i = e.value;
      try {
        var o = t();
        return !B(i, o);
      } catch {
        return !0;
      }
    }
    function Vb(e) {
      var t = Xi(e, _e);
      t !== null && xr(t, e, _e, nn);
    }
    function Ey(e) {
      var t = gl();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var i = {
        pending: null,
        interleaved: null,
        lanes: oe,
        dispatch: null,
        lastRenderedReducer: m0,
        lastRenderedState: e
      };
      t.queue = i;
      var o = i.dispatch = tO.bind(null, Jt, i);
      return [t.memoizedState, o];
    }
    function C0(e) {
      return y0(m0);
    }
    function E0(e) {
      return g0(m0);
    }
    function Sh(e, t, i, o) {
      var u = {
        tag: e,
        create: t,
        destroy: i,
        deps: o,
        // Circular
        next: null
      }, d = Jt.updateQueue;
      if (d === null)
        d = Ob(), Jt.updateQueue = d, d.lastEffect = u.next = u;
      else {
        var v = d.lastEffect;
        if (v === null)
          d.lastEffect = u.next = u;
        else {
          var S = v.next;
          v.next = u, u.next = S, d.lastEffect = u;
        }
      }
      return u;
    }
    function T0(e) {
      var t = gl();
      {
        var i = {
          current: e
        };
        return t.memoizedState = i, i;
      }
    }
    function Ty(e) {
      var t = Ka();
      return t.memoizedState;
    }
    function Ch(e, t, i, o) {
      var u = gl(), d = o === void 0 ? null : o;
      Jt.flags |= e, u.memoizedState = Sh(yr | t, i, void 0, d);
    }
    function by(e, t, i, o) {
      var u = Ka(), d = o === void 0 ? null : o, v = void 0;
      if (Sr !== null) {
        var S = Sr.memoizedState;
        if (v = S.destroy, d !== null) {
          var C = S.deps;
          if (h0(d, C)) {
            u.memoizedState = Sh(t, i, v, d);
            return;
          }
        }
      }
      Jt.flags |= e, u.memoizedState = Sh(yr | t, i, v, d);
    }
    function xy(e, t) {
      return (Jt.mode & Yi) !== Ke ? Ch(La | ni | ff, $r, e, t) : Ch(ni | ff, $r, e, t);
    }
    function Eh(e, t) {
      return by(ni, $r, e, t);
    }
    function b0(e, t) {
      return Ch(At, yl, e, t);
    }
    function wy(e, t) {
      return by(At, yl, e, t);
    }
    function x0(e, t) {
      var i = At;
      return i |= co, (Jt.mode & Yi) !== Ke && (i |= Zo), Ch(i, gr, e, t);
    }
    function Ry(e, t) {
      return by(At, gr, e, t);
    }
    function zb(e, t) {
      if (typeof t == "function") {
        var i = t, o = e();
        return i(o), function() {
          i(null);
        };
      } else if (t != null) {
        var u = t;
        u.hasOwnProperty("current") || h("Expected useImperativeHandle() first argument to either be a ref callback or React.createRef() object. Instead received: %s.", "an object with keys {" + Object.keys(u).join(", ") + "}");
        var d = e();
        return u.current = d, function() {
          u.current = null;
        };
      }
    }
    function w0(e, t, i) {
      typeof t != "function" && h("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var o = i != null ? i.concat([e]) : null, u = At;
      return u |= co, (Jt.mode & Yi) !== Ke && (u |= Zo), Ch(u, gr, zb.bind(null, t, e), o);
    }
    function ky(e, t, i) {
      typeof t != "function" && h("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var o = i != null ? i.concat([e]) : null;
      return by(At, gr, zb.bind(null, t, e), o);
    }
    function qM(e, t) {
    }
    var Dy = qM;
    function R0(e, t) {
      var i = gl(), o = t === void 0 ? null : t;
      return i.memoizedState = [e, o], e;
    }
    function _y(e, t) {
      var i = Ka(), o = t === void 0 ? null : t, u = i.memoizedState;
      if (u !== null && o !== null) {
        var d = u[1];
        if (h0(o, d))
          return u[0];
      }
      return i.memoizedState = [e, o], e;
    }
    function k0(e, t) {
      var i = gl(), o = t === void 0 ? null : t, u = e();
      return i.memoizedState = [u, o], u;
    }
    function My(e, t) {
      var i = Ka(), o = t === void 0 ? null : t, u = i.memoizedState;
      if (u !== null && o !== null) {
        var d = u[1];
        if (h0(o, d))
          return u[0];
      }
      var v = e();
      return i.memoizedState = [v, o], v;
    }
    function D0(e) {
      var t = gl();
      return t.memoizedState = e, e;
    }
    function Ub(e) {
      var t = Ka(), i = Sr, o = i.memoizedState;
      return jb(t, o, e);
    }
    function Fb(e) {
      var t = Ka();
      if (Sr === null)
        return t.memoizedState = e, e;
      var i = Sr.memoizedState;
      return jb(t, i, e);
    }
    function jb(e, t, i) {
      var o = !eu(_c);
      if (o) {
        if (!B(i, t)) {
          var u = wp();
          Jt.lanes = vt(Jt.lanes, u), zh(u), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, wh()), e.memoizedState = i, i;
    }
    function ZM(e, t, i) {
      var o = ma();
      Xn(rv(o, ha)), e(!0);
      var u = vh.transition;
      vh.transition = {};
      var d = vh.transition;
      vh.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if (Xn(o), vh.transition = u, u === null && d._updatedFibers) {
          var v = d._updatedFibers.size;
          v > 10 && E("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), d._updatedFibers.clear();
        }
      }
    }
    function _0() {
      var e = Ey(!1), t = e[0], i = e[1], o = ZM.bind(null, i), u = gl();
      return u.memoizedState = o, [t, o];
    }
    function Bb() {
      var e = C0(), t = e[0], i = Ka(), o = i.memoizedState;
      return [t, o];
    }
    function Hb() {
      var e = E0(), t = e[0], i = Ka(), o = i.memoizedState;
      return [t, o];
    }
    var Ib = !1;
    function JM() {
      return Ib;
    }
    function M0() {
      var e = gl(), t = Xy(), i = t.identifierPrefix, o;
      if (Yr()) {
        var u = pM();
        o = ":" + i + "R" + u;
        var d = gh++;
        d > 0 && (o += "H" + d.toString(32)), o += ":";
      } else {
        var v = KM++;
        o = ":" + i + "r" + v.toString(32) + ":";
      }
      return e.memoizedState = o, o;
    }
    function Oy() {
      var e = Ka(), t = e.memoizedState;
      return t;
    }
    function eO(e, t, i) {
      typeof arguments[3] == "function" && h("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var o = xu(e), u = {
        lane: o,
        action: i,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (Yb(e))
        $b(t, u);
      else {
        var d = sb(e, t, u, o);
        if (d !== null) {
          var v = Di();
          xr(d, e, o, v), Wb(d, t, o);
        }
      }
      Gb(e, o);
    }
    function tO(e, t, i) {
      typeof arguments[3] == "function" && h("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var o = xu(e), u = {
        lane: o,
        action: i,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (Yb(e))
        $b(t, u);
      else {
        var d = e.alternate;
        if (e.lanes === oe && (d === null || d.lanes === oe)) {
          var v = t.lastRenderedReducer;
          if (v !== null) {
            var S;
            S = Oe.current, Oe.current = _o;
            try {
              var C = t.lastRenderedState, k = v(C, i);
              if (u.hasEagerState = !0, u.eagerState = k, B(k, C)) {
                LM(e, t, u, o);
                return;
              }
            } catch {
            } finally {
              Oe.current = S;
            }
          }
        }
        var _ = sb(e, t, u, o);
        if (_ !== null) {
          var F = Di();
          xr(_, e, o, F), Wb(_, t, o);
        }
      }
      Gb(e, o);
    }
    function Yb(e) {
      var t = e.alternate;
      return e === Jt || t !== null && t === Jt;
    }
    function $b(e, t) {
      yh = Sy = !0;
      var i = e.pending;
      i === null ? t.next = t : (t.next = i.next, i.next = t), e.pending = t;
    }
    function Wb(e, t, i) {
      if (xp(i)) {
        var o = t.lanes;
        o = Rp(o, e.pendingLanes);
        var u = vt(o, i);
        t.lanes = u, lc(e, u);
      }
    }
    function Gb(e, t, i) {
      $l(e, t);
    }
    var Ay = {
      readContext: sr,
      useCallback: pi,
      useContext: pi,
      useEffect: pi,
      useImperativeHandle: pi,
      useInsertionEffect: pi,
      useLayoutEffect: pi,
      useMemo: pi,
      useReducer: pi,
      useRef: pi,
      useState: pi,
      useDebugValue: pi,
      useDeferredValue: pi,
      useTransition: pi,
      useMutableSource: pi,
      useSyncExternalStore: pi,
      useId: pi,
      unstable_isNewReconciler: K
    }, Kb = null, Qb = null, Xb = null, qb = null, Sl = null, _o = null, Ly = null;
    {
      var O0 = function() {
        h("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, ut = function() {
        h("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      Kb = {
        readContext: function(e) {
          return sr(e);
        },
        useCallback: function(e, t) {
          return te = "useCallback", Wt(), md(t), R0(e, t);
        },
        useContext: function(e) {
          return te = "useContext", Wt(), sr(e);
        },
        useEffect: function(e, t) {
          return te = "useEffect", Wt(), md(t), xy(e, t);
        },
        useImperativeHandle: function(e, t, i) {
          return te = "useImperativeHandle", Wt(), md(i), w0(e, t, i);
        },
        useInsertionEffect: function(e, t) {
          return te = "useInsertionEffect", Wt(), md(t), b0(e, t);
        },
        useLayoutEffect: function(e, t) {
          return te = "useLayoutEffect", Wt(), md(t), x0(e, t);
        },
        useMemo: function(e, t) {
          te = "useMemo", Wt(), md(t);
          var i = Oe.current;
          Oe.current = Sl;
          try {
            return k0(e, t);
          } finally {
            Oe.current = i;
          }
        },
        useReducer: function(e, t, i) {
          te = "useReducer", Wt();
          var o = Oe.current;
          Oe.current = Sl;
          try {
            return v0(e, t, i);
          } finally {
            Oe.current = o;
          }
        },
        useRef: function(e) {
          return te = "useRef", Wt(), T0(e);
        },
        useState: function(e) {
          te = "useState", Wt();
          var t = Oe.current;
          Oe.current = Sl;
          try {
            return Ey(e);
          } finally {
            Oe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return te = "useDebugValue", Wt(), void 0;
        },
        useDeferredValue: function(e) {
          return te = "useDeferredValue", Wt(), D0(e);
        },
        useTransition: function() {
          return te = "useTransition", Wt(), _0();
        },
        useMutableSource: function(e, t, i) {
          return te = "useMutableSource", Wt(), void 0;
        },
        useSyncExternalStore: function(e, t, i) {
          return te = "useSyncExternalStore", Wt(), S0(e, t, i);
        },
        useId: function() {
          return te = "useId", Wt(), M0();
        },
        unstable_isNewReconciler: K
      }, Qb = {
        readContext: function(e) {
          return sr(e);
        },
        useCallback: function(e, t) {
          return te = "useCallback", Ee(), R0(e, t);
        },
        useContext: function(e) {
          return te = "useContext", Ee(), sr(e);
        },
        useEffect: function(e, t) {
          return te = "useEffect", Ee(), xy(e, t);
        },
        useImperativeHandle: function(e, t, i) {
          return te = "useImperativeHandle", Ee(), w0(e, t, i);
        },
        useInsertionEffect: function(e, t) {
          return te = "useInsertionEffect", Ee(), b0(e, t);
        },
        useLayoutEffect: function(e, t) {
          return te = "useLayoutEffect", Ee(), x0(e, t);
        },
        useMemo: function(e, t) {
          te = "useMemo", Ee();
          var i = Oe.current;
          Oe.current = Sl;
          try {
            return k0(e, t);
          } finally {
            Oe.current = i;
          }
        },
        useReducer: function(e, t, i) {
          te = "useReducer", Ee();
          var o = Oe.current;
          Oe.current = Sl;
          try {
            return v0(e, t, i);
          } finally {
            Oe.current = o;
          }
        },
        useRef: function(e) {
          return te = "useRef", Ee(), T0(e);
        },
        useState: function(e) {
          te = "useState", Ee();
          var t = Oe.current;
          Oe.current = Sl;
          try {
            return Ey(e);
          } finally {
            Oe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return te = "useDebugValue", Ee(), void 0;
        },
        useDeferredValue: function(e) {
          return te = "useDeferredValue", Ee(), D0(e);
        },
        useTransition: function() {
          return te = "useTransition", Ee(), _0();
        },
        useMutableSource: function(e, t, i) {
          return te = "useMutableSource", Ee(), void 0;
        },
        useSyncExternalStore: function(e, t, i) {
          return te = "useSyncExternalStore", Ee(), S0(e, t, i);
        },
        useId: function() {
          return te = "useId", Ee(), M0();
        },
        unstable_isNewReconciler: K
      }, Xb = {
        readContext: function(e) {
          return sr(e);
        },
        useCallback: function(e, t) {
          return te = "useCallback", Ee(), _y(e, t);
        },
        useContext: function(e) {
          return te = "useContext", Ee(), sr(e);
        },
        useEffect: function(e, t) {
          return te = "useEffect", Ee(), Eh(e, t);
        },
        useImperativeHandle: function(e, t, i) {
          return te = "useImperativeHandle", Ee(), ky(e, t, i);
        },
        useInsertionEffect: function(e, t) {
          return te = "useInsertionEffect", Ee(), wy(e, t);
        },
        useLayoutEffect: function(e, t) {
          return te = "useLayoutEffect", Ee(), Ry(e, t);
        },
        useMemo: function(e, t) {
          te = "useMemo", Ee();
          var i = Oe.current;
          Oe.current = _o;
          try {
            return My(e, t);
          } finally {
            Oe.current = i;
          }
        },
        useReducer: function(e, t, i) {
          te = "useReducer", Ee();
          var o = Oe.current;
          Oe.current = _o;
          try {
            return y0(e, t, i);
          } finally {
            Oe.current = o;
          }
        },
        useRef: function(e) {
          return te = "useRef", Ee(), Ty();
        },
        useState: function(e) {
          te = "useState", Ee();
          var t = Oe.current;
          Oe.current = _o;
          try {
            return C0(e);
          } finally {
            Oe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return te = "useDebugValue", Ee(), Dy();
        },
        useDeferredValue: function(e) {
          return te = "useDeferredValue", Ee(), Ub(e);
        },
        useTransition: function() {
          return te = "useTransition", Ee(), Bb();
        },
        useMutableSource: function(e, t, i) {
          return te = "useMutableSource", Ee(), void 0;
        },
        useSyncExternalStore: function(e, t, i) {
          return te = "useSyncExternalStore", Ee(), Cy(e, t);
        },
        useId: function() {
          return te = "useId", Ee(), Oy();
        },
        unstable_isNewReconciler: K
      }, qb = {
        readContext: function(e) {
          return sr(e);
        },
        useCallback: function(e, t) {
          return te = "useCallback", Ee(), _y(e, t);
        },
        useContext: function(e) {
          return te = "useContext", Ee(), sr(e);
        },
        useEffect: function(e, t) {
          return te = "useEffect", Ee(), Eh(e, t);
        },
        useImperativeHandle: function(e, t, i) {
          return te = "useImperativeHandle", Ee(), ky(e, t, i);
        },
        useInsertionEffect: function(e, t) {
          return te = "useInsertionEffect", Ee(), wy(e, t);
        },
        useLayoutEffect: function(e, t) {
          return te = "useLayoutEffect", Ee(), Ry(e, t);
        },
        useMemo: function(e, t) {
          te = "useMemo", Ee();
          var i = Oe.current;
          Oe.current = Ly;
          try {
            return My(e, t);
          } finally {
            Oe.current = i;
          }
        },
        useReducer: function(e, t, i) {
          te = "useReducer", Ee();
          var o = Oe.current;
          Oe.current = Ly;
          try {
            return g0(e, t, i);
          } finally {
            Oe.current = o;
          }
        },
        useRef: function(e) {
          return te = "useRef", Ee(), Ty();
        },
        useState: function(e) {
          te = "useState", Ee();
          var t = Oe.current;
          Oe.current = Ly;
          try {
            return E0(e);
          } finally {
            Oe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return te = "useDebugValue", Ee(), Dy();
        },
        useDeferredValue: function(e) {
          return te = "useDeferredValue", Ee(), Fb(e);
        },
        useTransition: function() {
          return te = "useTransition", Ee(), Hb();
        },
        useMutableSource: function(e, t, i) {
          return te = "useMutableSource", Ee(), void 0;
        },
        useSyncExternalStore: function(e, t, i) {
          return te = "useSyncExternalStore", Ee(), Cy(e, t);
        },
        useId: function() {
          return te = "useId", Ee(), Oy();
        },
        unstable_isNewReconciler: K
      }, Sl = {
        readContext: function(e) {
          return O0(), sr(e);
        },
        useCallback: function(e, t) {
          return te = "useCallback", ut(), Wt(), R0(e, t);
        },
        useContext: function(e) {
          return te = "useContext", ut(), Wt(), sr(e);
        },
        useEffect: function(e, t) {
          return te = "useEffect", ut(), Wt(), xy(e, t);
        },
        useImperativeHandle: function(e, t, i) {
          return te = "useImperativeHandle", ut(), Wt(), w0(e, t, i);
        },
        useInsertionEffect: function(e, t) {
          return te = "useInsertionEffect", ut(), Wt(), b0(e, t);
        },
        useLayoutEffect: function(e, t) {
          return te = "useLayoutEffect", ut(), Wt(), x0(e, t);
        },
        useMemo: function(e, t) {
          te = "useMemo", ut(), Wt();
          var i = Oe.current;
          Oe.current = Sl;
          try {
            return k0(e, t);
          } finally {
            Oe.current = i;
          }
        },
        useReducer: function(e, t, i) {
          te = "useReducer", ut(), Wt();
          var o = Oe.current;
          Oe.current = Sl;
          try {
            return v0(e, t, i);
          } finally {
            Oe.current = o;
          }
        },
        useRef: function(e) {
          return te = "useRef", ut(), Wt(), T0(e);
        },
        useState: function(e) {
          te = "useState", ut(), Wt();
          var t = Oe.current;
          Oe.current = Sl;
          try {
            return Ey(e);
          } finally {
            Oe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return te = "useDebugValue", ut(), Wt(), void 0;
        },
        useDeferredValue: function(e) {
          return te = "useDeferredValue", ut(), Wt(), D0(e);
        },
        useTransition: function() {
          return te = "useTransition", ut(), Wt(), _0();
        },
        useMutableSource: function(e, t, i) {
          return te = "useMutableSource", ut(), Wt(), void 0;
        },
        useSyncExternalStore: function(e, t, i) {
          return te = "useSyncExternalStore", ut(), Wt(), S0(e, t, i);
        },
        useId: function() {
          return te = "useId", ut(), Wt(), M0();
        },
        unstable_isNewReconciler: K
      }, _o = {
        readContext: function(e) {
          return O0(), sr(e);
        },
        useCallback: function(e, t) {
          return te = "useCallback", ut(), Ee(), _y(e, t);
        },
        useContext: function(e) {
          return te = "useContext", ut(), Ee(), sr(e);
        },
        useEffect: function(e, t) {
          return te = "useEffect", ut(), Ee(), Eh(e, t);
        },
        useImperativeHandle: function(e, t, i) {
          return te = "useImperativeHandle", ut(), Ee(), ky(e, t, i);
        },
        useInsertionEffect: function(e, t) {
          return te = "useInsertionEffect", ut(), Ee(), wy(e, t);
        },
        useLayoutEffect: function(e, t) {
          return te = "useLayoutEffect", ut(), Ee(), Ry(e, t);
        },
        useMemo: function(e, t) {
          te = "useMemo", ut(), Ee();
          var i = Oe.current;
          Oe.current = _o;
          try {
            return My(e, t);
          } finally {
            Oe.current = i;
          }
        },
        useReducer: function(e, t, i) {
          te = "useReducer", ut(), Ee();
          var o = Oe.current;
          Oe.current = _o;
          try {
            return y0(e, t, i);
          } finally {
            Oe.current = o;
          }
        },
        useRef: function(e) {
          return te = "useRef", ut(), Ee(), Ty();
        },
        useState: function(e) {
          te = "useState", ut(), Ee();
          var t = Oe.current;
          Oe.current = _o;
          try {
            return C0(e);
          } finally {
            Oe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return te = "useDebugValue", ut(), Ee(), Dy();
        },
        useDeferredValue: function(e) {
          return te = "useDeferredValue", ut(), Ee(), Ub(e);
        },
        useTransition: function() {
          return te = "useTransition", ut(), Ee(), Bb();
        },
        useMutableSource: function(e, t, i) {
          return te = "useMutableSource", ut(), Ee(), void 0;
        },
        useSyncExternalStore: function(e, t, i) {
          return te = "useSyncExternalStore", ut(), Ee(), Cy(e, t);
        },
        useId: function() {
          return te = "useId", ut(), Ee(), Oy();
        },
        unstable_isNewReconciler: K
      }, Ly = {
        readContext: function(e) {
          return O0(), sr(e);
        },
        useCallback: function(e, t) {
          return te = "useCallback", ut(), Ee(), _y(e, t);
        },
        useContext: function(e) {
          return te = "useContext", ut(), Ee(), sr(e);
        },
        useEffect: function(e, t) {
          return te = "useEffect", ut(), Ee(), Eh(e, t);
        },
        useImperativeHandle: function(e, t, i) {
          return te = "useImperativeHandle", ut(), Ee(), ky(e, t, i);
        },
        useInsertionEffect: function(e, t) {
          return te = "useInsertionEffect", ut(), Ee(), wy(e, t);
        },
        useLayoutEffect: function(e, t) {
          return te = "useLayoutEffect", ut(), Ee(), Ry(e, t);
        },
        useMemo: function(e, t) {
          te = "useMemo", ut(), Ee();
          var i = Oe.current;
          Oe.current = _o;
          try {
            return My(e, t);
          } finally {
            Oe.current = i;
          }
        },
        useReducer: function(e, t, i) {
          te = "useReducer", ut(), Ee();
          var o = Oe.current;
          Oe.current = _o;
          try {
            return g0(e, t, i);
          } finally {
            Oe.current = o;
          }
        },
        useRef: function(e) {
          return te = "useRef", ut(), Ee(), Ty();
        },
        useState: function(e) {
          te = "useState", ut(), Ee();
          var t = Oe.current;
          Oe.current = _o;
          try {
            return E0(e);
          } finally {
            Oe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return te = "useDebugValue", ut(), Ee(), Dy();
        },
        useDeferredValue: function(e) {
          return te = "useDeferredValue", ut(), Ee(), Fb(e);
        },
        useTransition: function() {
          return te = "useTransition", ut(), Ee(), Hb();
        },
        useMutableSource: function(e, t, i) {
          return te = "useMutableSource", ut(), Ee(), void 0;
        },
        useSyncExternalStore: function(e, t, i) {
          return te = "useSyncExternalStore", ut(), Ee(), Cy(e, t);
        },
        useId: function() {
          return te = "useId", ut(), Ee(), Oy();
        },
        unstable_isNewReconciler: K
      };
    }
    var Cu = l.unstable_now, Zb = 0, Ny = -1, Th = -1, Py = -1, A0 = !1, Vy = !1;
    function Jb() {
      return A0;
    }
    function nO() {
      Vy = !0;
    }
    function rO() {
      A0 = !1, Vy = !1;
    }
    function iO() {
      A0 = Vy, Vy = !1;
    }
    function ex() {
      return Zb;
    }
    function tx() {
      Zb = Cu();
    }
    function L0(e) {
      Th = Cu(), e.actualStartTime < 0 && (e.actualStartTime = Cu());
    }
    function nx(e) {
      Th = -1;
    }
    function zy(e, t) {
      if (Th >= 0) {
        var i = Cu() - Th;
        e.actualDuration += i, t && (e.selfBaseDuration = i), Th = -1;
      }
    }
    function Cl(e) {
      if (Ny >= 0) {
        var t = Cu() - Ny;
        Ny = -1;
        for (var i = e.return; i !== null; ) {
          switch (i.tag) {
            case M:
              var o = i.stateNode;
              o.effectDuration += t;
              return;
            case Se:
              var u = i.stateNode;
              u.effectDuration += t;
              return;
          }
          i = i.return;
        }
      }
    }
    function N0(e) {
      if (Py >= 0) {
        var t = Cu() - Py;
        Py = -1;
        for (var i = e.return; i !== null; ) {
          switch (i.tag) {
            case M:
              var o = i.stateNode;
              o !== null && (o.passiveEffectDuration += t);
              return;
            case Se:
              var u = i.stateNode;
              u !== null && (u.passiveEffectDuration += t);
              return;
          }
          i = i.return;
        }
      }
    }
    function El() {
      Ny = Cu();
    }
    function P0() {
      Py = Cu();
    }
    function V0(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function Mc(e, t) {
      return {
        value: e,
        source: t,
        stack: ro(t),
        digest: null
      };
    }
    function z0(e, t, i) {
      return {
        value: e,
        source: null,
        stack: i ?? null,
        digest: t ?? null
      };
    }
    function aO(e, t) {
      return !0;
    }
    function U0(e, t) {
      try {
        var i = aO(e, t);
        if (i === !1)
          return;
        var o = t.value, u = t.source, d = t.stack, v = d !== null ? d : "";
        if (o != null && o._suppressLogging) {
          if (e.tag === R)
            return;
          console.error(o);
        }
        var S = u ? lt(u) : null, C = S ? "The above error occurred in the <" + S + "> component:" : "The above error occurred in one of your React components:", k;
        if (e.tag === M)
          k = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var _ = lt(e) || "Anonymous";
          k = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + _ + ".");
        }
        var F = C + `
` + v + `

` + ("" + k);
        console.error(F);
      } catch (z) {
        setTimeout(function() {
          throw z;
        });
      }
    }
    var oO = typeof WeakMap == "function" ? WeakMap : Map;
    function rx(e, t, i) {
      var o = cs(nn, i);
      o.tag = US, o.payload = {
        element: null
      };
      var u = t.value;
      return o.callback = function() {
        ZA(u), U0(e, t);
      }, o;
    }
    function F0(e, t, i) {
      var o = cs(nn, i);
      o.tag = US;
      var u = e.type.getDerivedStateFromError;
      if (typeof u == "function") {
        var d = t.value;
        o.payload = function() {
          return u(d);
        }, o.callback = function() {
          hw(e), U0(e, t);
        };
      }
      var v = e.stateNode;
      return v !== null && typeof v.componentDidCatch == "function" && (o.callback = function() {
        hw(e), U0(e, t), typeof u != "function" && XA(this);
        var C = t.value, k = t.stack;
        this.componentDidCatch(C, {
          componentStack: k !== null ? k : ""
        }), typeof u != "function" && (rn(e.lanes, _e) || h("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", lt(e) || "Unknown"));
      }), o;
    }
    function ix(e, t, i) {
      var o = e.pingCache, u;
      if (o === null ? (o = e.pingCache = new oO(), u = /* @__PURE__ */ new Set(), o.set(t, u)) : (u = o.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), o.set(t, u))), !u.has(i)) {
        u.add(i);
        var d = JA.bind(null, e, t, i);
        bi && Uh(e, i), t.then(d, d);
      }
    }
    function lO(e, t, i, o) {
      var u = e.updateQueue;
      if (u === null) {
        var d = /* @__PURE__ */ new Set();
        d.add(i), e.updateQueue = d;
      } else
        u.add(i);
    }
    function sO(e, t) {
      var i = e.tag;
      if ((e.mode & wt) === Ke && (i === b || i === ne || i === xe)) {
        var o = e.alternate;
        o ? (e.updateQueue = o.updateQueue, e.memoizedState = o.memoizedState, e.lanes = o.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function ax(e) {
      var t = e;
      do {
        if (t.tag === ae && WM(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function ox(e, t, i, o, u) {
      if ((e.mode & wt) === Ke) {
        if (e === t)
          e.flags |= rr;
        else {
          if (e.flags |= Ge, i.flags |= cf, i.flags &= -52805, i.tag === R) {
            var d = i.alternate;
            if (d === null)
              i.tag = Xe;
            else {
              var v = cs(nn, _e);
              v.tag = ly, vu(i, v, _e);
            }
          }
          i.lanes = vt(i.lanes, _e);
        }
        return e;
      }
      return e.flags |= rr, e.lanes = u, e;
    }
    function uO(e, t, i, o, u) {
      if (i.flags |= Qu, bi && Uh(e, u), o !== null && typeof o == "object" && typeof o.then == "function") {
        var d = o;
        sO(i), Yr() && i.mode & wt && XT();
        var v = ax(t);
        if (v !== null) {
          v.flags &= ~Or, ox(v, t, i, e, u), v.mode & wt && ix(e, d, u), lO(v, e, d);
          return;
        } else {
          if (!jg(u)) {
            ix(e, d, u), gC();
            return;
          }
          var S = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          o = S;
        }
      } else if (Yr() && i.mode & wt) {
        XT();
        var C = ax(t);
        if (C !== null) {
          (C.flags & rr) === Qe && (C.flags |= Or), ox(C, t, i, e, u), OS(Mc(o, i));
          return;
        }
      }
      o = Mc(o, i), HA(o);
      var k = t;
      do {
        switch (k.tag) {
          case M: {
            var _ = o;
            k.flags |= rr;
            var F = nu(u);
            k.lanes = vt(k.lanes, F);
            var z = rx(k, _, F);
            BS(k, z);
            return;
          }
          case R:
            var $ = o, G = k.type, Z = k.stateNode;
            if ((k.flags & Ge) === Qe && (typeof G.getDerivedStateFromError == "function" || Z !== null && typeof Z.componentDidCatch == "function" && !aw(Z))) {
              k.flags |= rr;
              var Ae = nu(u);
              k.lanes = vt(k.lanes, Ae);
              var Ze = F0(k, $, Ae);
              BS(k, Ze);
              return;
            }
            break;
        }
        k = k.return;
      } while (k !== null);
    }
    function cO() {
      return null;
    }
    var bh = c.ReactCurrentOwner, Mo = !1, j0, xh, B0, H0, I0, Oc, Y0, Uy;
    j0 = {}, xh = {}, B0 = {}, H0 = {}, I0 = {}, Oc = !1, Y0 = {}, Uy = {};
    function Ri(e, t, i, o) {
      e === null ? t.child = xb(t, null, i, o) : t.child = cd(t, e.child, i, o);
    }
    function fO(e, t, i, o) {
      t.child = cd(t, e.child, null, o), t.child = cd(t, null, i, o);
    }
    function lx(e, t, i, o, u) {
      if (t.type !== t.elementType) {
        var d = i.propTypes;
        d && xo(
          d,
          o,
          // Resolved props
          "prop",
          jt(i)
        );
      }
      var v = i.render, S = t.ref, C, k;
      ud(t, u), Ii(t);
      {
        if (bh.current = t, Gn(!0), C = vd(e, t, v, o, S, u), k = yd(), t.mode & Mn) {
          un(!0);
          try {
            C = vd(e, t, v, o, S, u), k = yd();
          } finally {
            un(!1);
          }
        }
        Gn(!1);
      }
      return ho(), e !== null && !Mo ? (_b(e, t, u), fs(e, t, u)) : (Yr() && k && wS(t), t.flags |= da, Ri(e, t, C, u), t.child);
    }
    function sx(e, t, i, o, u) {
      if (e === null) {
        var d = i.type;
        if (vL(d) && i.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        i.defaultProps === void 0) {
          var v = d;
          return v = wd(d), t.tag = xe, t.type = v, G0(t, d), ux(e, t, v, o, u);
        }
        {
          var S = d.propTypes;
          S && xo(
            S,
            o,
            // Resolved props
            "prop",
            jt(d)
          );
        }
        var C = _C(i.type, null, o, t, t.mode, u);
        return C.ref = t.ref, C.return = t, t.child = C, C;
      }
      {
        var k = i.type, _ = k.propTypes;
        _ && xo(
          _,
          o,
          // Resolved props
          "prop",
          jt(k)
        );
      }
      var F = e.child, z = J0(e, u);
      if (!z) {
        var $ = F.memoizedProps, G = i.compare;
        if (G = G !== null ? G : me, G($, o) && e.ref === t.ref)
          return fs(e, t, u);
      }
      t.flags |= da;
      var Z = Vc(F, o);
      return Z.ref = t.ref, Z.return = t, t.child = Z, Z;
    }
    function ux(e, t, i, o, u) {
      if (t.type !== t.elementType) {
        var d = t.elementType;
        if (d.$$typeof === et) {
          var v = d, S = v._payload, C = v._init;
          try {
            d = C(S);
          } catch {
            d = null;
          }
          var k = d && d.propTypes;
          k && xo(
            k,
            o,
            // Resolved (SimpleMemoComponent has no defaultProps)
            "prop",
            jt(d)
          );
        }
      }
      if (e !== null) {
        var _ = e.memoizedProps;
        if (me(_, o) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (Mo = !1, t.pendingProps = o = _, J0(e, u))
            (e.flags & cf) !== Qe && (Mo = !0);
          else return t.lanes = e.lanes, fs(e, t, u);
      }
      return $0(e, t, i, o, u);
    }
    function cx(e, t, i) {
      var o = t.pendingProps, u = o.children, d = e !== null ? e.memoizedState : null;
      if (o.mode === "hidden" || N)
        if ((t.mode & wt) === Ke) {
          var v = {
            baseLanes: oe,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = v, qy(t, i);
        } else if (rn(i, Hr)) {
          var F = {
            baseLanes: oe,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = F;
          var z = d !== null ? d.baseLanes : i;
          qy(t, z);
        } else {
          var S = null, C;
          if (d !== null) {
            var k = d.baseLanes;
            C = vt(k, i);
          } else
            C = i;
          t.lanes = t.childLanes = Hr;
          var _ = {
            baseLanes: C,
            cachePool: S,
            transitions: null
          };
          return t.memoizedState = _, t.updateQueue = null, qy(t, C), null;
        }
      else {
        var $;
        d !== null ? ($ = vt(d.baseLanes, i), t.memoizedState = null) : $ = i, qy(t, $);
      }
      return Ri(e, t, u, i), t.child;
    }
    function dO(e, t, i) {
      var o = t.pendingProps;
      return Ri(e, t, o, i), t.child;
    }
    function pO(e, t, i) {
      var o = t.pendingProps.children;
      return Ri(e, t, o, i), t.child;
    }
    function hO(e, t, i) {
      {
        t.flags |= At;
        {
          var o = t.stateNode;
          o.effectDuration = 0, o.passiveEffectDuration = 0;
        }
      }
      var u = t.pendingProps, d = u.children;
      return Ri(e, t, d, i), t.child;
    }
    function fx(e, t) {
      var i = t.ref;
      (e === null && i !== null || e !== null && e.ref !== i) && (t.flags |= Rn, t.flags |= Is);
    }
    function $0(e, t, i, o, u) {
      if (t.type !== t.elementType) {
        var d = i.propTypes;
        d && xo(
          d,
          o,
          // Resolved props
          "prop",
          jt(i)
        );
      }
      var v;
      {
        var S = rd(t, i, !0);
        v = id(t, S);
      }
      var C, k;
      ud(t, u), Ii(t);
      {
        if (bh.current = t, Gn(!0), C = vd(e, t, i, o, v, u), k = yd(), t.mode & Mn) {
          un(!0);
          try {
            C = vd(e, t, i, o, v, u), k = yd();
          } finally {
            un(!1);
          }
        }
        Gn(!1);
      }
      return ho(), e !== null && !Mo ? (_b(e, t, u), fs(e, t, u)) : (Yr() && k && wS(t), t.flags |= da, Ri(e, t, C, u), t.child);
    }
    function dx(e, t, i, o, u) {
      {
        switch (OL(t)) {
          case !1: {
            var d = t.stateNode, v = t.type, S = new v(t.memoizedProps, d.context), C = S.state;
            d.updater.enqueueSetState(d, C, null);
            break;
          }
          case !0: {
            t.flags |= Ge, t.flags |= rr;
            var k = new Error("Simulated error coming from DevTools"), _ = nu(u);
            t.lanes = vt(t.lanes, _);
            var F = F0(t, Mc(k, t), _);
            BS(t, F);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var z = i.propTypes;
          z && xo(
            z,
            o,
            // Resolved props
            "prop",
            jt(i)
          );
        }
      }
      var $;
      vl(i) ? ($ = !0, Xv(t)) : $ = !1, ud(t, u);
      var G = t.stateNode, Z;
      G === null ? (jy(e, t), Sb(t, i, o), JS(t, i, o, u), Z = !0) : e === null ? Z = jM(t, i, o, u) : Z = BM(e, t, i, o, u);
      var Ae = W0(e, t, i, Z, $, u);
      {
        var Ze = t.stateNode;
        Z && Ze.props !== o && (Oc || h("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", lt(t) || "a component"), Oc = !0);
      }
      return Ae;
    }
    function W0(e, t, i, o, u, d) {
      fx(e, t);
      var v = (t.flags & Ge) !== Qe;
      if (!o && !v)
        return u && WT(t, i, !1), fs(e, t, d);
      var S = t.stateNode;
      bh.current = t;
      var C;
      if (v && typeof i.getDerivedStateFromError != "function")
        C = null, nx();
      else {
        Ii(t);
        {
          if (Gn(!0), C = S.render(), t.mode & Mn) {
            un(!0);
            try {
              S.render();
            } finally {
              un(!1);
            }
          }
          Gn(!1);
        }
        ho();
      }
      return t.flags |= da, e !== null && v ? fO(e, t, C, d) : Ri(e, t, C, d), t.memoizedState = S.state, u && WT(t, i, !0), t.child;
    }
    function px(e) {
      var t = e.stateNode;
      t.pendingContext ? YT(e, t.pendingContext, t.pendingContext !== t.context) : t.context && YT(e, t.context, !1), a0(e, t.containerInfo);
    }
    function mO(e, t, i) {
      if (px(t), e === null)
        throw new Error("Should have a current fiber. This is a bug in React.");
      var o = t.pendingProps, u = t.memoizedState, d = u.element;
      fb(e, t), fy(t, o, null, i);
      var v = t.memoizedState;
      t.stateNode;
      var S = v.element;
      if (u.isDehydrated) {
        var C = {
          element: S,
          isDehydrated: !1,
          cache: v.cache,
          pendingSuspenseBoundaries: v.pendingSuspenseBoundaries,
          transitions: v.transitions
        }, k = t.updateQueue;
        if (k.baseState = C, t.memoizedState = C, t.flags & Or) {
          var _ = Mc(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return hx(e, t, S, i, _);
        } else if (S !== d) {
          var F = Mc(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return hx(e, t, S, i, F);
        } else {
          SM(t);
          var z = xb(t, null, S, i);
          t.child = z;
          for (var $ = z; $; )
            $.flags = $.flags & ~Tn | ri, $ = $.sibling;
        }
      } else {
        if (ld(), S === d)
          return fs(e, t, i);
        Ri(e, t, S, i);
      }
      return t.child;
    }
    function hx(e, t, i, o, u) {
      return ld(), OS(u), t.flags |= Or, Ri(e, t, i, o), t.child;
    }
    function vO(e, t, i) {
      Rb(t), e === null && MS(t);
      var o = t.type, u = t.pendingProps, d = e !== null ? e.memoizedProps : null, v = u.children, S = fS(o, u);
      return S ? v = null : d !== null && fS(o, d) && (t.flags |= Ui), fx(e, t), Ri(e, t, v, i), t.child;
    }
    function yO(e, t) {
      return e === null && MS(t), null;
    }
    function gO(e, t, i, o) {
      jy(e, t);
      var u = t.pendingProps, d = i, v = d._payload, S = d._init, C = S(v);
      t.type = C;
      var k = t.tag = yL(C), _ = ko(C, u), F;
      switch (k) {
        case b:
          return G0(t, C), t.type = C = wd(C), F = $0(null, t, C, _, o), F;
        case R:
          return t.type = C = bC(C), F = dx(null, t, C, _, o), F;
        case ne:
          return t.type = C = xC(C), F = lx(null, t, C, _, o), F;
        case Re: {
          if (t.type !== t.elementType) {
            var z = C.propTypes;
            z && xo(
              z,
              _,
              // Resolved for outer only
              "prop",
              jt(C)
            );
          }
          return F = sx(
            null,
            t,
            C,
            ko(C.type, _),
            // The inner type can have defaults too
            o
          ), F;
        }
      }
      var $ = "";
      throw C !== null && typeof C == "object" && C.$$typeof === et && ($ = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + C + ". " + ("Lazy element type must resolve to a class or function." + $));
    }
    function SO(e, t, i, o, u) {
      jy(e, t), t.tag = R;
      var d;
      return vl(i) ? (d = !0, Xv(t)) : d = !1, ud(t, u), Sb(t, i, o), JS(t, i, o, u), W0(null, t, i, !0, d, u);
    }
    function CO(e, t, i, o) {
      jy(e, t);
      var u = t.pendingProps, d;
      {
        var v = rd(t, i, !1);
        d = id(t, v);
      }
      ud(t, o);
      var S, C;
      Ii(t);
      {
        if (i.prototype && typeof i.prototype.render == "function") {
          var k = jt(i) || "Unknown";
          j0[k] || (h("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", k, k), j0[k] = !0);
        }
        t.mode & Mn && Ro.recordLegacyContextWarning(t, null), Gn(!0), bh.current = t, S = vd(null, t, i, u, d, o), C = yd(), Gn(!1);
      }
      if (ho(), t.flags |= da, typeof S == "object" && S !== null && typeof S.render == "function" && S.$$typeof === void 0) {
        var _ = jt(i) || "Unknown";
        xh[_] || (h("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", _, _, _), xh[_] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof S == "object" && S !== null && typeof S.render == "function" && S.$$typeof === void 0
      ) {
        {
          var F = jt(i) || "Unknown";
          xh[F] || (h("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", F, F, F), xh[F] = !0);
        }
        t.tag = R, t.memoizedState = null, t.updateQueue = null;
        var z = !1;
        return vl(i) ? (z = !0, Xv(t)) : z = !1, t.memoizedState = S.state !== null && S.state !== void 0 ? S.state : null, jS(t), gb(t, S), JS(t, i, u, o), W0(null, t, i, !0, z, o);
      } else {
        if (t.tag = b, t.mode & Mn) {
          un(!0);
          try {
            S = vd(null, t, i, u, d, o), C = yd();
          } finally {
            un(!1);
          }
        }
        return Yr() && C && wS(t), Ri(null, t, S, o), G0(t, i), t.child;
      }
    }
    function G0(e, t) {
      {
        if (t && t.childContextTypes && h("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var i = "", o = jr();
          o && (i += `

Check the render method of \`` + o + "`.");
          var u = o || "", d = e._debugSource;
          d && (u = d.fileName + ":" + d.lineNumber), I0[u] || (I0[u] = !0, h("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", i));
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var v = jt(t) || "Unknown";
          H0[v] || (h("%s: Function components do not support getDerivedStateFromProps.", v), H0[v] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var S = jt(t) || "Unknown";
          B0[S] || (h("%s: Function components do not support contextType.", S), B0[S] = !0);
        }
      }
    }
    var K0 = {
      dehydrated: null,
      treeContext: null,
      retryLane: gn
    };
    function Q0(e) {
      return {
        baseLanes: e,
        cachePool: cO(),
        transitions: null
      };
    }
    function EO(e, t) {
      var i = null;
      return {
        baseLanes: vt(e.baseLanes, t),
        cachePool: i,
        transitions: e.transitions
      };
    }
    function TO(e, t, i, o) {
      if (t !== null) {
        var u = t.memoizedState;
        if (u === null)
          return !1;
      }
      return s0(e, mh);
    }
    function bO(e, t) {
      return oc(e.childLanes, t);
    }
    function mx(e, t, i) {
      var o = t.pendingProps;
      AL(t) && (t.flags |= Ge);
      var u = Do.current, d = !1, v = (t.flags & Ge) !== Qe;
      if (v || TO(u, e) ? (d = !0, t.flags &= ~Ge) : (e === null || e.memoizedState !== null) && (u = $M(u, Db)), u = dd(u), gu(t, u), e === null) {
        MS(t);
        var S = t.memoizedState;
        if (S !== null) {
          var C = S.dehydrated;
          if (C !== null)
            return DO(t, C);
        }
        var k = o.children, _ = o.fallback;
        if (d) {
          var F = xO(t, k, _, i), z = t.child;
          return z.memoizedState = Q0(i), t.memoizedState = K0, F;
        } else
          return X0(t, k);
      } else {
        var $ = e.memoizedState;
        if ($ !== null) {
          var G = $.dehydrated;
          if (G !== null)
            return _O(e, t, v, o, G, $, i);
        }
        if (d) {
          var Z = o.fallback, Ae = o.children, Ze = RO(e, t, Ae, Z, i), $e = t.child, Pt = e.child.memoizedState;
          return $e.memoizedState = Pt === null ? Q0(i) : EO(Pt, i), $e.childLanes = bO(e, i), t.memoizedState = K0, Ze;
        } else {
          var Dt = o.children, I = wO(e, t, Dt, i);
          return t.memoizedState = null, I;
        }
      }
    }
    function X0(e, t, i) {
      var o = e.mode, u = {
        mode: "visible",
        children: t
      }, d = q0(u, o);
      return d.return = e, e.child = d, d;
    }
    function xO(e, t, i, o) {
      var u = e.mode, d = e.child, v = {
        mode: "hidden",
        children: t
      }, S, C;
      return (u & wt) === Ke && d !== null ? (S = d, S.childLanes = oe, S.pendingProps = v, e.mode & Lt && (S.actualDuration = 0, S.actualStartTime = -1, S.selfBaseDuration = 0, S.treeBaseDuration = 0), C = Ru(i, u, o, null)) : (S = q0(v, u), C = Ru(i, u, o, null)), S.return = e, C.return = e, S.sibling = C, e.child = S, C;
    }
    function q0(e, t, i) {
      return vw(e, t, oe, null);
    }
    function vx(e, t) {
      return Vc(e, t);
    }
    function wO(e, t, i, o) {
      var u = e.child, d = u.sibling, v = vx(u, {
        mode: "visible",
        children: i
      });
      if ((t.mode & wt) === Ke && (v.lanes = o), v.return = t, v.sibling = null, d !== null) {
        var S = t.deletions;
        S === null ? (t.deletions = [d], t.flags |= zi) : S.push(d);
      }
      return t.child = v, v;
    }
    function RO(e, t, i, o, u) {
      var d = t.mode, v = e.child, S = v.sibling, C = {
        mode: "hidden",
        children: i
      }, k;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (d & wt) === Ke && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== v
      ) {
        var _ = t.child;
        k = _, k.childLanes = oe, k.pendingProps = C, t.mode & Lt && (k.actualDuration = 0, k.actualStartTime = -1, k.selfBaseDuration = v.selfBaseDuration, k.treeBaseDuration = v.treeBaseDuration), t.deletions = null;
      } else
        k = vx(v, C), k.subtreeFlags = v.subtreeFlags & jn;
      var F;
      return S !== null ? F = Vc(S, o) : (F = Ru(o, d, u, null), F.flags |= Tn), F.return = t, k.return = t, k.sibling = F, t.child = k, F;
    }
    function Fy(e, t, i, o) {
      o !== null && OS(o), cd(t, e.child, null, i);
      var u = t.pendingProps, d = u.children, v = X0(t, d);
      return v.flags |= Tn, t.memoizedState = null, v;
    }
    function kO(e, t, i, o, u) {
      var d = t.mode, v = {
        mode: "visible",
        children: i
      }, S = q0(v, d), C = Ru(o, d, u, null);
      return C.flags |= Tn, S.return = t, C.return = t, S.sibling = C, t.child = S, (t.mode & wt) !== Ke && cd(t, e.child, null, u), C;
    }
    function DO(e, t, i) {
      return (e.mode & wt) === Ke ? (h("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = _e) : mS(t) ? e.lanes = Ua : e.lanes = Hr, null;
    }
    function _O(e, t, i, o, u, d, v) {
      if (i)
        if (t.flags & Or) {
          t.flags &= ~Or;
          var I = z0(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return Fy(e, t, v, I);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= Ge, null;
          var J = o.children, Y = o.fallback, pe = kO(e, t, J, Y, v), Le = t.child;
          return Le.memoizedState = Q0(v), t.memoizedState = K0, pe;
        }
      else {
        if (yM(), (t.mode & wt) === Ke)
          return Fy(
            e,
            t,
            v,
            // TODO: When we delete legacy mode, we should make this error argument
            // required — every concurrent mode path that causes hydration to
            // de-opt to client rendering should have an error message.
            null
          );
        if (mS(u)) {
          var S, C, k;
          {
            var _ = N_(u);
            S = _.digest, C = _.message, k = _.stack;
          }
          var F;
          C ? F = new Error(C) : F = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var z = z0(F, S, k);
          return Fy(e, t, v, z);
        }
        var $ = rn(v, e.childLanes);
        if (Mo || $) {
          var G = Xy();
          if (G !== null) {
            var Z = tv(G, v);
            if (Z !== gn && Z !== d.retryLane) {
              d.retryLane = Z;
              var Ae = nn;
              Xi(e, Z), xr(G, e, Z, Ae);
            }
          }
          gC();
          var Ze = z0(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return Fy(e, t, v, Ze);
        } else if (UT(u)) {
          t.flags |= Ge, t.child = e.child;
          var $e = eL.bind(null, e);
          return P_(u, $e), null;
        } else {
          CM(t, u, d.treeContext);
          var Pt = o.children, Dt = X0(t, Pt);
          return Dt.flags |= ri, Dt;
        }
      }
    }
    function yx(e, t, i) {
      e.lanes = vt(e.lanes, t);
      var o = e.alternate;
      o !== null && (o.lanes = vt(o.lanes, t)), VS(e.return, t, i);
    }
    function MO(e, t, i) {
      for (var o = t; o !== null; ) {
        if (o.tag === ae) {
          var u = o.memoizedState;
          u !== null && yx(o, i, e);
        } else if (o.tag === Mt)
          yx(o, i, e);
        else if (o.child !== null) {
          o.child.return = o, o = o.child;
          continue;
        }
        if (o === e)
          return;
        for (; o.sibling === null; ) {
          if (o.return === null || o.return === e)
            return;
          o = o.return;
        }
        o.sibling.return = o.return, o = o.sibling;
      }
    }
    function OO(e) {
      for (var t = e, i = null; t !== null; ) {
        var o = t.alternate;
        o !== null && gy(o) === null && (i = t), t = t.sibling;
      }
      return i;
    }
    function AO(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !Y0[e])
        if (Y0[e] = !0, typeof e == "string")
          switch (e.toLowerCase()) {
            case "together":
            case "forwards":
            case "backwards": {
              h('"%s" is not a valid value for revealOrder on <SuspenseList />. Use lowercase "%s" instead.', e, e.toLowerCase());
              break;
            }
            case "forward":
            case "backward": {
              h('"%s" is not a valid value for revealOrder on <SuspenseList />. React uses the -s suffix in the spelling. Use "%ss" instead.', e, e.toLowerCase());
              break;
            }
            default:
              h('"%s" is not a supported revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
              break;
          }
        else
          h('%s is not a supported value for revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
    }
    function LO(e, t) {
      e !== void 0 && !Uy[e] && (e !== "collapsed" && e !== "hidden" ? (Uy[e] = !0, h('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (Uy[e] = !0, h('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function gx(e, t) {
      {
        var i = Tt(e), o = !i && typeof Gt(e) == "function";
        if (i || o) {
          var u = i ? "array" : "iterable";
          return h("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", u, t, u), !1;
        }
      }
      return !0;
    }
    function NO(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (Tt(e)) {
          for (var i = 0; i < e.length; i++)
            if (!gx(e[i], i))
              return;
        } else {
          var o = Gt(e);
          if (typeof o == "function") {
            var u = o.call(e);
            if (u)
              for (var d = u.next(), v = 0; !d.done; d = u.next()) {
                if (!gx(d.value, v))
                  return;
                v++;
              }
          } else
            h('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function Z0(e, t, i, o, u) {
      var d = e.memoizedState;
      d === null ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: o,
        tail: i,
        tailMode: u
      } : (d.isBackwards = t, d.rendering = null, d.renderingStartTime = 0, d.last = o, d.tail = i, d.tailMode = u);
    }
    function Sx(e, t, i) {
      var o = t.pendingProps, u = o.revealOrder, d = o.tail, v = o.children;
      AO(u), LO(d, u), NO(v, u), Ri(e, t, v, i);
      var S = Do.current, C = s0(S, mh);
      if (C)
        S = u0(S, mh), t.flags |= Ge;
      else {
        var k = e !== null && (e.flags & Ge) !== Qe;
        k && MO(t, t.child, i), S = dd(S);
      }
      if (gu(t, S), (t.mode & wt) === Ke)
        t.memoizedState = null;
      else
        switch (u) {
          case "forwards": {
            var _ = OO(t.child), F;
            _ === null ? (F = t.child, t.child = null) : (F = _.sibling, _.sibling = null), Z0(
              t,
              !1,
              // isBackwards
              F,
              _,
              d
            );
            break;
          }
          case "backwards": {
            var z = null, $ = t.child;
            for (t.child = null; $ !== null; ) {
              var G = $.alternate;
              if (G !== null && gy(G) === null) {
                t.child = $;
                break;
              }
              var Z = $.sibling;
              $.sibling = z, z = $, $ = Z;
            }
            Z0(
              t,
              !0,
              // isBackwards
              z,
              null,
              // last
              d
            );
            break;
          }
          case "together": {
            Z0(
              t,
              !1,
              // isBackwards
              null,
              // tail
              null,
              // last
              void 0
            );
            break;
          }
          default:
            t.memoizedState = null;
        }
      return t.child;
    }
    function PO(e, t, i) {
      a0(t, t.stateNode.containerInfo);
      var o = t.pendingProps;
      return e === null ? t.child = cd(t, null, o, i) : Ri(e, t, o, i), t.child;
    }
    var Cx = !1;
    function VO(e, t, i) {
      var o = t.type, u = o._context, d = t.pendingProps, v = t.memoizedProps, S = d.value;
      {
        "value" in d || Cx || (Cx = !0, h("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var C = t.type.propTypes;
        C && xo(C, d, "prop", "Context.Provider");
      }
      if (lb(t, u, S), v !== null) {
        var k = v.value;
        if (B(k, S)) {
          if (v.children === d.children && !Kv())
            return fs(e, t, i);
        } else
          MM(t, u, i);
      }
      var _ = d.children;
      return Ri(e, t, _, i), t.child;
    }
    var Ex = !1;
    function zO(e, t, i) {
      var o = t.type;
      o._context === void 0 ? o !== o.Consumer && (Ex || (Ex = !0, h("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : o = o._context;
      var u = t.pendingProps, d = u.children;
      typeof d != "function" && h("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), ud(t, i);
      var v = sr(o);
      Ii(t);
      var S;
      return bh.current = t, Gn(!0), S = d(v), Gn(!1), ho(), t.flags |= da, Ri(e, t, S, i), t.child;
    }
    function wh() {
      Mo = !0;
    }
    function jy(e, t) {
      (t.mode & wt) === Ke && e !== null && (e.alternate = null, t.alternate = null, t.flags |= Tn);
    }
    function fs(e, t, i) {
      return e !== null && (t.dependencies = e.dependencies), nx(), zh(t.lanes), rn(i, t.childLanes) ? (HM(e, t), t.child) : null;
    }
    function UO(e, t, i) {
      {
        var o = t.return;
        if (o === null)
          throw new Error("Cannot swap the root fiber.");
        if (e.alternate = null, t.alternate = null, i.index = t.index, i.sibling = t.sibling, i.return = t.return, i.ref = t.ref, t === o.child)
          o.child = i;
        else {
          var u = o.child;
          if (u === null)
            throw new Error("Expected parent to have a child.");
          for (; u.sibling !== t; )
            if (u = u.sibling, u === null)
              throw new Error("Expected to find the previous sibling.");
          u.sibling = i;
        }
        var d = o.deletions;
        return d === null ? (o.deletions = [e], o.flags |= zi) : d.push(e), i.flags |= Tn, i;
      }
    }
    function J0(e, t) {
      var i = e.lanes;
      return !!rn(i, t);
    }
    function FO(e, t, i) {
      switch (t.tag) {
        case M:
          px(t), t.stateNode, ld();
          break;
        case j:
          Rb(t);
          break;
        case R: {
          var o = t.type;
          vl(o) && Xv(t);
          break;
        }
        case A:
          a0(t, t.stateNode.containerInfo);
          break;
        case he: {
          var u = t.memoizedProps.value, d = t.type._context;
          lb(t, d, u);
          break;
        }
        case Se:
          {
            var v = rn(i, t.childLanes);
            v && (t.flags |= At);
            {
              var S = t.stateNode;
              S.effectDuration = 0, S.passiveEffectDuration = 0;
            }
          }
          break;
        case ae: {
          var C = t.memoizedState;
          if (C !== null) {
            if (C.dehydrated !== null)
              return gu(t, dd(Do.current)), t.flags |= Ge, null;
            var k = t.child, _ = k.childLanes;
            if (rn(i, _))
              return mx(e, t, i);
            gu(t, dd(Do.current));
            var F = fs(e, t, i);
            return F !== null ? F.sibling : null;
          } else
            gu(t, dd(Do.current));
          break;
        }
        case Mt: {
          var z = (e.flags & Ge) !== Qe, $ = rn(i, t.childLanes);
          if (z) {
            if ($)
              return Sx(e, t, i);
            t.flags |= Ge;
          }
          var G = t.memoizedState;
          if (G !== null && (G.rendering = null, G.tail = null, G.lastEffect = null), gu(t, Do.current), $)
            break;
          return null;
        }
        case We:
        case Rt:
          return t.lanes = oe, cx(e, t, i);
      }
      return fs(e, t, i);
    }
    function Tx(e, t, i) {
      if (t._debugNeedsRemount && e !== null)
        return UO(e, t, _C(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var o = e.memoizedProps, u = t.pendingProps;
        if (o !== u || Kv() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          Mo = !0;
        else {
          var d = J0(e, i);
          if (!d && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & Ge) === Qe)
            return Mo = !1, FO(e, t, i);
          (e.flags & cf) !== Qe ? Mo = !0 : Mo = !1;
        }
      } else if (Mo = !1, Yr() && fM(t)) {
        var v = t.index, S = dM();
        QT(t, S, v);
      }
      switch (t.lanes = oe, t.tag) {
        case D:
          return CO(e, t, t.type, i);
        case le: {
          var C = t.elementType;
          return gO(e, t, C, i);
        }
        case b: {
          var k = t.type, _ = t.pendingProps, F = t.elementType === k ? _ : ko(k, _);
          return $0(e, t, k, F, i);
        }
        case R: {
          var z = t.type, $ = t.pendingProps, G = t.elementType === z ? $ : ko(z, $);
          return dx(e, t, z, G, i);
        }
        case M:
          return mO(e, t, i);
        case j:
          return vO(e, t, i);
        case q:
          return yO(e, t);
        case ae:
          return mx(e, t, i);
        case A:
          return PO(e, t, i);
        case ne: {
          var Z = t.type, Ae = t.pendingProps, Ze = t.elementType === Z ? Ae : ko(Z, Ae);
          return lx(e, t, Z, Ze, i);
        }
        case re:
          return dO(e, t, i);
        case ie:
          return pO(e, t, i);
        case Se:
          return hO(e, t, i);
        case he:
          return VO(e, t, i);
        case ue:
          return zO(e, t, i);
        case Re: {
          var $e = t.type, Pt = t.pendingProps, Dt = ko($e, Pt);
          if (t.type !== t.elementType) {
            var I = $e.propTypes;
            I && xo(
              I,
              Dt,
              // Resolved for outer only
              "prop",
              jt($e)
            );
          }
          return Dt = ko($e.type, Dt), sx(e, t, $e, Dt, i);
        }
        case xe:
          return ux(e, t, t.type, t.pendingProps, i);
        case Xe: {
          var J = t.type, Y = t.pendingProps, pe = t.elementType === J ? Y : ko(J, Y);
          return SO(e, t, J, pe, i);
        }
        case Mt:
          return Sx(e, t, i);
        case gt:
          break;
        case We:
          return cx(e, t, i);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function gd(e) {
      e.flags |= At;
    }
    function bx(e) {
      e.flags |= Rn, e.flags |= Is;
    }
    var xx, eC, wx, Rx;
    xx = function(e, t, i, o) {
      for (var u = t.child; u !== null; ) {
        if (u.tag === j || u.tag === q)
          s_(e, u.stateNode);
        else if (u.tag !== A) {
          if (u.child !== null) {
            u.child.return = u, u = u.child;
            continue;
          }
        }
        if (u === t)
          return;
        for (; u.sibling === null; ) {
          if (u.return === null || u.return === t)
            return;
          u = u.return;
        }
        u.sibling.return = u.return, u = u.sibling;
      }
    }, eC = function(e, t) {
    }, wx = function(e, t, i, o, u) {
      var d = e.memoizedProps;
      if (d !== o) {
        var v = t.stateNode, S = o0(), C = c_(v, i, d, o, u, S);
        t.updateQueue = C, C && gd(t);
      }
    }, Rx = function(e, t, i, o) {
      i !== o && gd(t);
    };
    function Rh(e, t) {
      if (!Yr())
        switch (e.tailMode) {
          case "hidden": {
            for (var i = e.tail, o = null; i !== null; )
              i.alternate !== null && (o = i), i = i.sibling;
            o === null ? e.tail = null : o.sibling = null;
            break;
          }
          case "collapsed": {
            for (var u = e.tail, d = null; u !== null; )
              u.alternate !== null && (d = u), u = u.sibling;
            d === null ? !t && e.tail !== null ? e.tail.sibling = null : e.tail = null : d.sibling = null;
            break;
          }
        }
    }
    function Wr(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, i = oe, o = Qe;
      if (t) {
        if ((e.mode & Lt) !== Ke) {
          for (var C = e.selfBaseDuration, k = e.child; k !== null; )
            i = vt(i, vt(k.lanes, k.childLanes)), o |= k.subtreeFlags & jn, o |= k.flags & jn, C += k.treeBaseDuration, k = k.sibling;
          e.treeBaseDuration = C;
        } else
          for (var _ = e.child; _ !== null; )
            i = vt(i, vt(_.lanes, _.childLanes)), o |= _.subtreeFlags & jn, o |= _.flags & jn, _.return = e, _ = _.sibling;
        e.subtreeFlags |= o;
      } else {
        if ((e.mode & Lt) !== Ke) {
          for (var u = e.actualDuration, d = e.selfBaseDuration, v = e.child; v !== null; )
            i = vt(i, vt(v.lanes, v.childLanes)), o |= v.subtreeFlags, o |= v.flags, u += v.actualDuration, d += v.treeBaseDuration, v = v.sibling;
          e.actualDuration = u, e.treeBaseDuration = d;
        } else
          for (var S = e.child; S !== null; )
            i = vt(i, vt(S.lanes, S.childLanes)), o |= S.subtreeFlags, o |= S.flags, S.return = e, S = S.sibling;
        e.subtreeFlags |= o;
      }
      return e.childLanes = i, t;
    }
    function jO(e, t, i) {
      if (wM() && (t.mode & wt) !== Ke && (t.flags & Ge) === Qe)
        return nb(t), ld(), t.flags |= Or | Qu | rr, !1;
      var o = ty(t);
      if (i !== null && i.dehydrated !== null)
        if (e === null) {
          if (!o)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (bM(t), Wr(t), (t.mode & Lt) !== Ke) {
            var u = i !== null;
            if (u) {
              var d = t.child;
              d !== null && (t.treeBaseDuration -= d.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (ld(), (t.flags & Ge) === Qe && (t.memoizedState = null), t.flags |= At, Wr(t), (t.mode & Lt) !== Ke) {
            var v = i !== null;
            if (v) {
              var S = t.child;
              S !== null && (t.treeBaseDuration -= S.treeBaseDuration);
            }
          }
          return !1;
        }
      else
        return rb(), !0;
    }
    function kx(e, t, i) {
      var o = t.pendingProps;
      switch (RS(t), t.tag) {
        case D:
        case le:
        case xe:
        case b:
        case ne:
        case re:
        case ie:
        case Se:
        case ue:
        case Re:
          return Wr(t), null;
        case R: {
          var u = t.type;
          return vl(u) && Qv(t), Wr(t), null;
        }
        case M: {
          var d = t.stateNode;
          if (fd(t), TS(t), f0(), d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null), e === null || e.child === null) {
            var v = ty(t);
            if (v)
              gd(t);
            else if (e !== null) {
              var S = e.memoizedState;
              // Check if this is a client root
              (!S.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & Or) !== Qe) && (t.flags |= Kn, rb());
            }
          }
          return eC(e, t), Wr(t), null;
        }
        case j: {
          l0(t);
          var C = wb(), k = t.type;
          if (e !== null && t.stateNode != null)
            wx(e, t, k, o, C), e.ref !== t.ref && bx(t);
          else {
            if (!o) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return Wr(t), null;
            }
            var _ = o0(), F = ty(t);
            if (F)
              EM(t, C, _) && gd(t);
            else {
              var z = l_(k, o, C, _, t);
              xx(z, t, !1, !1), t.stateNode = z, u_(z, k, o, C) && gd(t);
            }
            t.ref !== null && bx(t);
          }
          return Wr(t), null;
        }
        case q: {
          var $ = o;
          if (e && t.stateNode != null) {
            var G = e.memoizedProps;
            Rx(e, t, G, $);
          } else {
            if (typeof $ != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var Z = wb(), Ae = o0(), Ze = ty(t);
            Ze ? TM(t) && gd(t) : t.stateNode = f_($, Z, Ae, t);
          }
          return Wr(t), null;
        }
        case ae: {
          pd(t);
          var $e = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var Pt = jO(e, t, $e);
            if (!Pt)
              return t.flags & rr ? t : null;
          }
          if ((t.flags & Ge) !== Qe)
            return t.lanes = i, (t.mode & Lt) !== Ke && V0(t), t;
          var Dt = $e !== null, I = e !== null && e.memoizedState !== null;
          if (Dt !== I && Dt) {
            var J = t.child;
            if (J.flags |= Fn, (t.mode & wt) !== Ke) {
              var Y = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !0);
              Y || s0(Do.current, Db) ? BA() : gC();
            }
          }
          var pe = t.updateQueue;
          if (pe !== null && (t.flags |= At), Wr(t), (t.mode & Lt) !== Ke && Dt) {
            var Le = t.child;
            Le !== null && (t.treeBaseDuration -= Le.treeBaseDuration);
          }
          return null;
        }
        case A:
          return fd(t), eC(e, t), e === null && iM(t.stateNode.containerInfo), Wr(t), null;
        case he:
          var ke = t.type._context;
          return PS(ke, t), Wr(t), null;
        case Xe: {
          var ot = t.type;
          return vl(ot) && Qv(t), Wr(t), null;
        }
        case Mt: {
          pd(t);
          var dt = t.memoizedState;
          if (dt === null)
            return Wr(t), null;
          var en = (t.flags & Ge) !== Qe, Ht = dt.rendering;
          if (Ht === null)
            if (en)
              Rh(dt, !1);
            else {
              var Zn = IA() && (e === null || (e.flags & Ge) === Qe);
              if (!Zn)
                for (var It = t.child; It !== null; ) {
                  var In = gy(It);
                  if (In !== null) {
                    en = !0, t.flags |= Ge, Rh(dt, !1);
                    var hi = In.updateQueue;
                    return hi !== null && (t.updateQueue = hi, t.flags |= At), t.subtreeFlags = Qe, IM(t, i), gu(t, u0(Do.current, mh)), t.child;
                  }
                  It = It.sibling;
                }
              dt.tail !== null && Qn() > Kx() && (t.flags |= Ge, en = !0, Rh(dt, !1), t.lanes = Mf);
            }
          else {
            if (!en) {
              var qr = gy(Ht);
              if (qr !== null) {
                t.flags |= Ge, en = !0;
                var Ea = qr.updateQueue;
                if (Ea !== null && (t.updateQueue = Ea, t.flags |= At), Rh(dt, !0), dt.tail === null && dt.tailMode === "hidden" && !Ht.alternate && !Yr())
                  return Wr(t), null;
              } else // The time it took to render last row is greater than the remaining
              // time we have to render. So rendering one more row would likely
              // exceed it.
              Qn() * 2 - dt.renderingStartTime > Kx() && i !== Hr && (t.flags |= Ge, en = !0, Rh(dt, !1), t.lanes = Mf);
            }
            if (dt.isBackwards)
              Ht.sibling = t.child, t.child = Ht;
            else {
              var _i = dt.last;
              _i !== null ? _i.sibling = Ht : t.child = Ht, dt.last = Ht;
            }
          }
          if (dt.tail !== null) {
            var Mi = dt.tail;
            dt.rendering = Mi, dt.tail = Mi.sibling, dt.renderingStartTime = Qn(), Mi.sibling = null;
            var mi = Do.current;
            return en ? mi = u0(mi, mh) : mi = dd(mi), gu(t, mi), Mi;
          }
          return Wr(t), null;
        }
        case gt:
          break;
        case We:
        case Rt: {
          yC(t);
          var vs = t.memoizedState, Rd = vs !== null;
          if (e !== null) {
            var Hh = e.memoizedState, xl = Hh !== null;
            xl !== Rd && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !N && (t.flags |= Fn);
          }
          return !Rd || (t.mode & wt) === Ke ? Wr(t) : rn(bl, Hr) && (Wr(t), t.subtreeFlags & (Tn | At) && (t.flags |= Fn)), null;
        }
        case pt:
          return null;
        case ht:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function BO(e, t, i) {
      switch (RS(t), t.tag) {
        case R: {
          var o = t.type;
          vl(o) && Qv(t);
          var u = t.flags;
          return u & rr ? (t.flags = u & ~rr | Ge, (t.mode & Lt) !== Ke && V0(t), t) : null;
        }
        case M: {
          t.stateNode, fd(t), TS(t), f0();
          var d = t.flags;
          return (d & rr) !== Qe && (d & Ge) === Qe ? (t.flags = d & ~rr | Ge, t) : null;
        }
        case j:
          return l0(t), null;
        case ae: {
          pd(t);
          var v = t.memoizedState;
          if (v !== null && v.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            ld();
          }
          var S = t.flags;
          return S & rr ? (t.flags = S & ~rr | Ge, (t.mode & Lt) !== Ke && V0(t), t) : null;
        }
        case Mt:
          return pd(t), null;
        case A:
          return fd(t), null;
        case he:
          var C = t.type._context;
          return PS(C, t), null;
        case We:
        case Rt:
          return yC(t), null;
        case pt:
          return null;
        default:
          return null;
      }
    }
    function Dx(e, t, i) {
      switch (RS(t), t.tag) {
        case R: {
          var o = t.type.childContextTypes;
          o != null && Qv(t);
          break;
        }
        case M: {
          t.stateNode, fd(t), TS(t), f0();
          break;
        }
        case j: {
          l0(t);
          break;
        }
        case A:
          fd(t);
          break;
        case ae:
          pd(t);
          break;
        case Mt:
          pd(t);
          break;
        case he:
          var u = t.type._context;
          PS(u, t);
          break;
        case We:
        case Rt:
          yC(t);
          break;
      }
    }
    var _x = null;
    _x = /* @__PURE__ */ new Set();
    var By = !1, Gr = !1, HO = typeof WeakSet == "function" ? WeakSet : Set, ze = null, Sd = null, Cd = null;
    function IO(e) {
      qo(null, function() {
        throw e;
      }), Ku();
    }
    var YO = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & Lt)
        try {
          El(), t.componentWillUnmount();
        } finally {
          Cl(e);
        }
      else
        t.componentWillUnmount();
    };
    function Mx(e, t) {
      try {
        Eu(gr, e);
      } catch (i) {
        hn(e, t, i);
      }
    }
    function tC(e, t, i) {
      try {
        YO(e, i);
      } catch (o) {
        hn(e, t, o);
      }
    }
    function $O(e, t, i) {
      try {
        i.componentDidMount();
      } catch (o) {
        hn(e, t, o);
      }
    }
    function Ox(e, t) {
      try {
        Lx(e);
      } catch (i) {
        hn(e, t, i);
      }
    }
    function Ed(e, t) {
      var i = e.ref;
      if (i !== null)
        if (typeof i == "function") {
          var o;
          try {
            if (Ne && bt && e.mode & Lt)
              try {
                El(), o = i(null);
              } finally {
                Cl(e);
              }
            else
              o = i(null);
          } catch (u) {
            hn(e, t, u);
          }
          typeof o == "function" && h("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", lt(e));
        } else
          i.current = null;
    }
    function Hy(e, t, i) {
      try {
        i();
      } catch (o) {
        hn(e, t, o);
      }
    }
    var Ax = !1;
    function WO(e, t) {
      a_(e.containerInfo), ze = t, GO();
      var i = Ax;
      return Ax = !1, i;
    }
    function GO() {
      for (; ze !== null; ) {
        var e = ze, t = e.child;
        (e.subtreeFlags & Jo) !== Qe && t !== null ? (t.return = e, ze = t) : KO();
      }
    }
    function KO() {
      for (; ze !== null; ) {
        var e = ze;
        Xt(e);
        try {
          QO(e);
        } catch (i) {
          hn(e, e.return, i);
        }
        pn();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, ze = t;
          return;
        }
        ze = e.return;
      }
    }
    function QO(e) {
      var t = e.alternate, i = e.flags;
      if ((i & Kn) !== Qe) {
        switch (Xt(e), e.tag) {
          case b:
          case ne:
          case xe:
            break;
          case R: {
            if (t !== null) {
              var o = t.memoizedProps, u = t.memoizedState, d = e.stateNode;
              e.type === e.elementType && !Oc && (d.props !== e.memoizedProps && h("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", lt(e) || "instance"), d.state !== e.memoizedState && h("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", lt(e) || "instance"));
              var v = d.getSnapshotBeforeUpdate(e.elementType === e.type ? o : ko(e.type, o), u);
              {
                var S = _x;
                v === void 0 && !S.has(e.type) && (S.add(e.type), h("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", lt(e)));
              }
              d.__reactInternalSnapshotBeforeUpdate = v;
            }
            break;
          }
          case M: {
            {
              var C = e.stateNode;
              M_(C.containerInfo);
            }
            break;
          }
          case j:
          case q:
          case A:
          case Xe:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
        pn();
      }
    }
    function Oo(e, t, i) {
      var o = t.updateQueue, u = o !== null ? o.lastEffect : null;
      if (u !== null) {
        var d = u.next, v = d;
        do {
          if ((v.tag & e) === e) {
            var S = v.destroy;
            v.destroy = void 0, S !== void 0 && ((e & $r) !== qi ? Hm(t) : (e & gr) !== qi && vp(t), (e & yl) !== qi && Fh(!0), Hy(t, i, S), (e & yl) !== qi && Fh(!1), (e & $r) !== qi ? Im() : (e & gr) !== qi && yp());
          }
          v = v.next;
        } while (v !== d);
      }
    }
    function Eu(e, t) {
      var i = t.updateQueue, o = i !== null ? i.lastEffect : null;
      if (o !== null) {
        var u = o.next, d = u;
        do {
          if ((d.tag & e) === e) {
            (e & $r) !== qi ? Bm(t) : (e & gr) !== qi && mp(t);
            var v = d.create;
            (e & yl) !== qi && Fh(!0), d.destroy = v(), (e & yl) !== qi && Fh(!1), (e & $r) !== qi ? yf() : (e & gr) !== qi && gf();
            {
              var S = d.destroy;
              if (S !== void 0 && typeof S != "function") {
                var C = void 0;
                (d.tag & gr) !== Qe ? C = "useLayoutEffect" : (d.tag & yl) !== Qe ? C = "useInsertionEffect" : C = "useEffect";
                var k = void 0;
                S === null ? k = " You returned null. If your effect does not require clean up, return undefined (or nothing)." : typeof S.then == "function" ? k = `

It looks like you wrote ` + C + `(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:

` + C + `(() => {
  async function fetchData() {
    // You can await here
    const response = await MyAPI.getData(someId);
    // ...
  }
  fetchData();
}, [someId]); // Or [] if effect doesn't need props or state

Learn more about data fetching with Hooks: https://reactjs.org/link/hooks-data-fetching` : k = " You returned: " + S, h("%s must not return anything besides a function, which is used for clean-up.%s", C, k);
              }
            }
          }
          d = d.next;
        } while (d !== u);
      }
    }
    function XO(e, t) {
      if ((t.flags & At) !== Qe)
        switch (t.tag) {
          case Se: {
            var i = t.stateNode.passiveEffectDuration, o = t.memoizedProps, u = o.id, d = o.onPostCommit, v = ex(), S = t.alternate === null ? "mount" : "update";
            Jb() && (S = "nested-update"), typeof d == "function" && d(u, S, i, v);
            var C = t.return;
            e: for (; C !== null; ) {
              switch (C.tag) {
                case M:
                  var k = C.stateNode;
                  k.passiveEffectDuration += i;
                  break e;
                case Se:
                  var _ = C.stateNode;
                  _.passiveEffectDuration += i;
                  break e;
              }
              C = C.return;
            }
            break;
          }
        }
    }
    function qO(e, t, i, o) {
      if ((i.flags & tl) !== Qe)
        switch (i.tag) {
          case b:
          case ne:
          case xe: {
            if (!Gr)
              if (i.mode & Lt)
                try {
                  El(), Eu(gr | yr, i);
                } finally {
                  Cl(i);
                }
              else
                Eu(gr | yr, i);
            break;
          }
          case R: {
            var u = i.stateNode;
            if (i.flags & At && !Gr)
              if (t === null)
                if (i.type === i.elementType && !Oc && (u.props !== i.memoizedProps && h("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", lt(i) || "instance"), u.state !== i.memoizedState && h("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", lt(i) || "instance")), i.mode & Lt)
                  try {
                    El(), u.componentDidMount();
                  } finally {
                    Cl(i);
                  }
                else
                  u.componentDidMount();
              else {
                var d = i.elementType === i.type ? t.memoizedProps : ko(i.type, t.memoizedProps), v = t.memoizedState;
                if (i.type === i.elementType && !Oc && (u.props !== i.memoizedProps && h("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", lt(i) || "instance"), u.state !== i.memoizedState && h("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", lt(i) || "instance")), i.mode & Lt)
                  try {
                    El(), u.componentDidUpdate(d, v, u.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    Cl(i);
                  }
                else
                  u.componentDidUpdate(d, v, u.__reactInternalSnapshotBeforeUpdate);
              }
            var S = i.updateQueue;
            S !== null && (i.type === i.elementType && !Oc && (u.props !== i.memoizedProps && h("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", lt(i) || "instance"), u.state !== i.memoizedState && h("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", lt(i) || "instance")), pb(i, S, u));
            break;
          }
          case M: {
            var C = i.updateQueue;
            if (C !== null) {
              var k = null;
              if (i.child !== null)
                switch (i.child.tag) {
                  case j:
                    k = i.child.stateNode;
                    break;
                  case R:
                    k = i.child.stateNode;
                    break;
                }
              pb(i, C, k);
            }
            break;
          }
          case j: {
            var _ = i.stateNode;
            if (t === null && i.flags & At) {
              var F = i.type, z = i.memoizedProps;
              v_(_, F, z);
            }
            break;
          }
          case q:
            break;
          case A:
            break;
          case Se: {
            {
              var $ = i.memoizedProps, G = $.onCommit, Z = $.onRender, Ae = i.stateNode.effectDuration, Ze = ex(), $e = t === null ? "mount" : "update";
              Jb() && ($e = "nested-update"), typeof Z == "function" && Z(i.memoizedProps.id, $e, i.actualDuration, i.treeBaseDuration, i.actualStartTime, Ze);
              {
                typeof G == "function" && G(i.memoizedProps.id, $e, Ae, Ze), KA(i);
                var Pt = i.return;
                e: for (; Pt !== null; ) {
                  switch (Pt.tag) {
                    case M:
                      var Dt = Pt.stateNode;
                      Dt.effectDuration += Ae;
                      break e;
                    case Se:
                      var I = Pt.stateNode;
                      I.effectDuration += Ae;
                      break e;
                  }
                  Pt = Pt.return;
                }
              }
            }
            break;
          }
          case ae: {
            aA(e, i);
            break;
          }
          case Mt:
          case Xe:
          case gt:
          case We:
          case Rt:
          case ht:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      Gr || i.flags & Rn && Lx(i);
    }
    function ZO(e) {
      switch (e.tag) {
        case b:
        case ne:
        case xe: {
          if (e.mode & Lt)
            try {
              El(), Mx(e, e.return);
            } finally {
              Cl(e);
            }
          else
            Mx(e, e.return);
          break;
        }
        case R: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && $O(e, e.return, t), Ox(e, e.return);
          break;
        }
        case j: {
          Ox(e, e.return);
          break;
        }
      }
    }
    function JO(e, t) {
      for (var i = null, o = e; ; ) {
        if (o.tag === j) {
          if (i === null) {
            i = o;
            try {
              var u = o.stateNode;
              t ? R_(u) : D_(o.stateNode, o.memoizedProps);
            } catch (v) {
              hn(e, e.return, v);
            }
          }
        } else if (o.tag === q) {
          if (i === null)
            try {
              var d = o.stateNode;
              t ? k_(d) : __(d, o.memoizedProps);
            } catch (v) {
              hn(e, e.return, v);
            }
        } else if (!((o.tag === We || o.tag === Rt) && o.memoizedState !== null && o !== e)) {
          if (o.child !== null) {
            o.child.return = o, o = o.child;
            continue;
          }
        }
        if (o === e)
          return;
        for (; o.sibling === null; ) {
          if (o.return === null || o.return === e)
            return;
          i === o && (i = null), o = o.return;
        }
        i === o && (i = null), o.sibling.return = o.return, o = o.sibling;
      }
    }
    function Lx(e) {
      var t = e.ref;
      if (t !== null) {
        var i = e.stateNode, o;
        switch (e.tag) {
          case j:
            o = i;
            break;
          default:
            o = i;
        }
        if (typeof t == "function") {
          var u;
          if (e.mode & Lt)
            try {
              El(), u = t(o);
            } finally {
              Cl(e);
            }
          else
            u = t(o);
          typeof u == "function" && h("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", lt(e));
        } else
          t.hasOwnProperty("current") || h("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", lt(e)), t.current = o;
      }
    }
    function eA(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function Nx(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, Nx(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === j) {
          var i = e.stateNode;
          i !== null && lM(i);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function tA(e) {
      for (var t = e.return; t !== null; ) {
        if (Px(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function Px(e) {
      return e.tag === j || e.tag === M || e.tag === A;
    }
    function Vx(e) {
      var t = e;
      e: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || Px(t.return))
            return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== j && t.tag !== q && t.tag !== yt; ) {
          if (t.flags & Tn || t.child === null || t.tag === A)
            continue e;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & Tn))
          return t.stateNode;
      }
    }
    function nA(e) {
      var t = tA(e);
      switch (t.tag) {
        case j: {
          var i = t.stateNode;
          t.flags & Ui && (zT(i), t.flags &= ~Ui);
          var o = Vx(e);
          rC(e, o, i);
          break;
        }
        case M:
        case A: {
          var u = t.stateNode.containerInfo, d = Vx(e);
          nC(e, d, u);
          break;
        }
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function nC(e, t, i) {
      var o = e.tag, u = o === j || o === q;
      if (u) {
        var d = e.stateNode;
        t ? T_(i, d, t) : C_(i, d);
      } else if (o !== A) {
        var v = e.child;
        if (v !== null) {
          nC(v, t, i);
          for (var S = v.sibling; S !== null; )
            nC(S, t, i), S = S.sibling;
        }
      }
    }
    function rC(e, t, i) {
      var o = e.tag, u = o === j || o === q;
      if (u) {
        var d = e.stateNode;
        t ? E_(i, d, t) : S_(i, d);
      } else if (o !== A) {
        var v = e.child;
        if (v !== null) {
          rC(v, t, i);
          for (var S = v.sibling; S !== null; )
            rC(S, t, i), S = S.sibling;
        }
      }
    }
    var Kr = null, Ao = !1;
    function rA(e, t, i) {
      {
        var o = t;
        e: for (; o !== null; ) {
          switch (o.tag) {
            case j: {
              Kr = o.stateNode, Ao = !1;
              break e;
            }
            case M: {
              Kr = o.stateNode.containerInfo, Ao = !0;
              break e;
            }
            case A: {
              Kr = o.stateNode.containerInfo, Ao = !0;
              break e;
            }
          }
          o = o.return;
        }
        if (Kr === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        zx(e, t, i), Kr = null, Ao = !1;
      }
      eA(i);
    }
    function Tu(e, t, i) {
      for (var o = i.child; o !== null; )
        zx(e, t, o), o = o.sibling;
    }
    function zx(e, t, i) {
      switch (Fm(i), i.tag) {
        case j:
          Gr || Ed(i, t);
        case q: {
          {
            var o = Kr, u = Ao;
            Kr = null, Tu(e, t, i), Kr = o, Ao = u, Kr !== null && (Ao ? x_(Kr, i.stateNode) : b_(Kr, i.stateNode));
          }
          return;
        }
        case yt: {
          Kr !== null && (Ao ? w_(Kr, i.stateNode) : hS(Kr, i.stateNode));
          return;
        }
        case A: {
          {
            var d = Kr, v = Ao;
            Kr = i.stateNode.containerInfo, Ao = !0, Tu(e, t, i), Kr = d, Ao = v;
          }
          return;
        }
        case b:
        case ne:
        case Re:
        case xe: {
          if (!Gr) {
            var S = i.updateQueue;
            if (S !== null) {
              var C = S.lastEffect;
              if (C !== null) {
                var k = C.next, _ = k;
                do {
                  var F = _, z = F.destroy, $ = F.tag;
                  z !== void 0 && (($ & yl) !== qi ? Hy(i, t, z) : ($ & gr) !== qi && (vp(i), i.mode & Lt ? (El(), Hy(i, t, z), Cl(i)) : Hy(i, t, z), yp())), _ = _.next;
                } while (_ !== k);
              }
            }
          }
          Tu(e, t, i);
          return;
        }
        case R: {
          if (!Gr) {
            Ed(i, t);
            var G = i.stateNode;
            typeof G.componentWillUnmount == "function" && tC(i, t, G);
          }
          Tu(e, t, i);
          return;
        }
        case gt: {
          Tu(e, t, i);
          return;
        }
        case We: {
          if (
            // TODO: Remove this dead flag
            i.mode & wt
          ) {
            var Z = Gr;
            Gr = Z || i.memoizedState !== null, Tu(e, t, i), Gr = Z;
          } else
            Tu(e, t, i);
          break;
        }
        default: {
          Tu(e, t, i);
          return;
        }
      }
    }
    function iA(e) {
      e.memoizedState;
    }
    function aA(e, t) {
      var i = t.memoizedState;
      if (i === null) {
        var o = t.alternate;
        if (o !== null) {
          var u = o.memoizedState;
          if (u !== null) {
            var d = u.dehydrated;
            d !== null && Y_(d);
          }
        }
      }
    }
    function Ux(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var i = e.stateNode;
        i === null && (i = e.stateNode = new HO()), t.forEach(function(o) {
          var u = tL.bind(null, e, o);
          if (!i.has(o)) {
            if (i.add(o), bi)
              if (Sd !== null && Cd !== null)
                Uh(Cd, Sd);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            o.then(u, u);
          }
        });
      }
    }
    function oA(e, t, i) {
      Sd = i, Cd = e, Xt(t), Fx(t, e), Xt(t), Sd = null, Cd = null;
    }
    function Lo(e, t, i) {
      var o = t.deletions;
      if (o !== null)
        for (var u = 0; u < o.length; u++) {
          var d = o[u];
          try {
            rA(e, t, d);
          } catch (C) {
            hn(d, t, C);
          }
        }
      var v = Yo();
      if (t.subtreeFlags & el)
        for (var S = t.child; S !== null; )
          Xt(S), Fx(S, e), S = S.sibling;
      Xt(v);
    }
    function Fx(e, t, i) {
      var o = e.alternate, u = e.flags;
      switch (e.tag) {
        case b:
        case ne:
        case Re:
        case xe: {
          if (Lo(t, e), Tl(e), u & At) {
            try {
              Oo(yl | yr, e, e.return), Eu(yl | yr, e);
            } catch (ot) {
              hn(e, e.return, ot);
            }
            if (e.mode & Lt) {
              try {
                El(), Oo(gr | yr, e, e.return);
              } catch (ot) {
                hn(e, e.return, ot);
              }
              Cl(e);
            } else
              try {
                Oo(gr | yr, e, e.return);
              } catch (ot) {
                hn(e, e.return, ot);
              }
          }
          return;
        }
        case R: {
          Lo(t, e), Tl(e), u & Rn && o !== null && Ed(o, o.return);
          return;
        }
        case j: {
          Lo(t, e), Tl(e), u & Rn && o !== null && Ed(o, o.return);
          {
            if (e.flags & Ui) {
              var d = e.stateNode;
              try {
                zT(d);
              } catch (ot) {
                hn(e, e.return, ot);
              }
            }
            if (u & At) {
              var v = e.stateNode;
              if (v != null) {
                var S = e.memoizedProps, C = o !== null ? o.memoizedProps : S, k = e.type, _ = e.updateQueue;
                if (e.updateQueue = null, _ !== null)
                  try {
                    y_(v, _, k, C, S, e);
                  } catch (ot) {
                    hn(e, e.return, ot);
                  }
              }
            }
          }
          return;
        }
        case q: {
          if (Lo(t, e), Tl(e), u & At) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var F = e.stateNode, z = e.memoizedProps, $ = o !== null ? o.memoizedProps : z;
            try {
              g_(F, $, z);
            } catch (ot) {
              hn(e, e.return, ot);
            }
          }
          return;
        }
        case M: {
          if (Lo(t, e), Tl(e), u & At && o !== null) {
            var G = o.memoizedState;
            if (G.isDehydrated)
              try {
                I_(t.containerInfo);
              } catch (ot) {
                hn(e, e.return, ot);
              }
          }
          return;
        }
        case A: {
          Lo(t, e), Tl(e);
          return;
        }
        case ae: {
          Lo(t, e), Tl(e);
          var Z = e.child;
          if (Z.flags & Fn) {
            var Ae = Z.stateNode, Ze = Z.memoizedState, $e = Ze !== null;
            if (Ae.isHidden = $e, $e) {
              var Pt = Z.alternate !== null && Z.alternate.memoizedState !== null;
              Pt || jA();
            }
          }
          if (u & At) {
            try {
              iA(e);
            } catch (ot) {
              hn(e, e.return, ot);
            }
            Ux(e);
          }
          return;
        }
        case We: {
          var Dt = o !== null && o.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & wt
          ) {
            var I = Gr;
            Gr = I || Dt, Lo(t, e), Gr = I;
          } else
            Lo(t, e);
          if (Tl(e), u & Fn) {
            var J = e.stateNode, Y = e.memoizedState, pe = Y !== null, Le = e;
            if (J.isHidden = pe, pe && !Dt && (Le.mode & wt) !== Ke) {
              ze = Le;
              for (var ke = Le.child; ke !== null; )
                ze = ke, sA(ke), ke = ke.sibling;
            }
            JO(Le, pe);
          }
          return;
        }
        case Mt: {
          Lo(t, e), Tl(e), u & At && Ux(e);
          return;
        }
        case gt:
          return;
        default: {
          Lo(t, e), Tl(e);
          return;
        }
      }
    }
    function Tl(e) {
      var t = e.flags;
      if (t & Tn) {
        try {
          nA(e);
        } catch (i) {
          hn(e, e.return, i);
        }
        e.flags &= ~Tn;
      }
      t & ri && (e.flags &= ~ri);
    }
    function lA(e, t, i) {
      Sd = i, Cd = t, ze = e, jx(e, t, i), Sd = null, Cd = null;
    }
    function jx(e, t, i) {
      for (var o = (e.mode & wt) !== Ke; ze !== null; ) {
        var u = ze, d = u.child;
        if (u.tag === We && o) {
          var v = u.memoizedState !== null, S = v || By;
          if (S) {
            iC(e, t, i);
            continue;
          } else {
            var C = u.alternate, k = C !== null && C.memoizedState !== null, _ = k || Gr, F = By, z = Gr;
            By = S, Gr = _, Gr && !z && (ze = u, uA(u));
            for (var $ = d; $ !== null; )
              ze = $, jx(
                $,
                // New root; bubble back up to here and stop.
                t,
                i
              ), $ = $.sibling;
            ze = u, By = F, Gr = z, iC(e, t, i);
            continue;
          }
        }
        (u.subtreeFlags & tl) !== Qe && d !== null ? (d.return = u, ze = d) : iC(e, t, i);
      }
    }
    function iC(e, t, i) {
      for (; ze !== null; ) {
        var o = ze;
        if ((o.flags & tl) !== Qe) {
          var u = o.alternate;
          Xt(o);
          try {
            qO(t, u, o, i);
          } catch (v) {
            hn(o, o.return, v);
          }
          pn();
        }
        if (o === e) {
          ze = null;
          return;
        }
        var d = o.sibling;
        if (d !== null) {
          d.return = o.return, ze = d;
          return;
        }
        ze = o.return;
      }
    }
    function sA(e) {
      for (; ze !== null; ) {
        var t = ze, i = t.child;
        switch (t.tag) {
          case b:
          case ne:
          case Re:
          case xe: {
            if (t.mode & Lt)
              try {
                El(), Oo(gr, t, t.return);
              } finally {
                Cl(t);
              }
            else
              Oo(gr, t, t.return);
            break;
          }
          case R: {
            Ed(t, t.return);
            var o = t.stateNode;
            typeof o.componentWillUnmount == "function" && tC(t, t.return, o);
            break;
          }
          case j: {
            Ed(t, t.return);
            break;
          }
          case We: {
            var u = t.memoizedState !== null;
            if (u) {
              Bx(e);
              continue;
            }
            break;
          }
        }
        i !== null ? (i.return = t, ze = i) : Bx(e);
      }
    }
    function Bx(e) {
      for (; ze !== null; ) {
        var t = ze;
        if (t === e) {
          ze = null;
          return;
        }
        var i = t.sibling;
        if (i !== null) {
          i.return = t.return, ze = i;
          return;
        }
        ze = t.return;
      }
    }
    function uA(e) {
      for (; ze !== null; ) {
        var t = ze, i = t.child;
        if (t.tag === We) {
          var o = t.memoizedState !== null;
          if (o) {
            Hx(e);
            continue;
          }
        }
        i !== null ? (i.return = t, ze = i) : Hx(e);
      }
    }
    function Hx(e) {
      for (; ze !== null; ) {
        var t = ze;
        Xt(t);
        try {
          ZO(t);
        } catch (o) {
          hn(t, t.return, o);
        }
        if (pn(), t === e) {
          ze = null;
          return;
        }
        var i = t.sibling;
        if (i !== null) {
          i.return = t.return, ze = i;
          return;
        }
        ze = t.return;
      }
    }
    function cA(e, t, i, o) {
      ze = t, fA(t, e, i, o);
    }
    function fA(e, t, i, o) {
      for (; ze !== null; ) {
        var u = ze, d = u.child;
        (u.subtreeFlags & fo) !== Qe && d !== null ? (d.return = u, ze = d) : dA(e, t, i, o);
      }
    }
    function dA(e, t, i, o) {
      for (; ze !== null; ) {
        var u = ze;
        if ((u.flags & ni) !== Qe) {
          Xt(u);
          try {
            pA(t, u, i, o);
          } catch (v) {
            hn(u, u.return, v);
          }
          pn();
        }
        if (u === e) {
          ze = null;
          return;
        }
        var d = u.sibling;
        if (d !== null) {
          d.return = u.return, ze = d;
          return;
        }
        ze = u.return;
      }
    }
    function pA(e, t, i, o) {
      switch (t.tag) {
        case b:
        case ne:
        case xe: {
          if (t.mode & Lt) {
            P0();
            try {
              Eu($r | yr, t);
            } finally {
              N0(t);
            }
          } else
            Eu($r | yr, t);
          break;
        }
      }
    }
    function hA(e) {
      ze = e, mA();
    }
    function mA() {
      for (; ze !== null; ) {
        var e = ze, t = e.child;
        if ((ze.flags & zi) !== Qe) {
          var i = e.deletions;
          if (i !== null) {
            for (var o = 0; o < i.length; o++) {
              var u = i[o];
              ze = u, gA(u, e);
            }
            {
              var d = e.alternate;
              if (d !== null) {
                var v = d.child;
                if (v !== null) {
                  d.child = null;
                  do {
                    var S = v.sibling;
                    v.sibling = null, v = S;
                  } while (v !== null);
                }
              }
            }
            ze = e;
          }
        }
        (e.subtreeFlags & fo) !== Qe && t !== null ? (t.return = e, ze = t) : vA();
      }
    }
    function vA() {
      for (; ze !== null; ) {
        var e = ze;
        (e.flags & ni) !== Qe && (Xt(e), yA(e), pn());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, ze = t;
          return;
        }
        ze = e.return;
      }
    }
    function yA(e) {
      switch (e.tag) {
        case b:
        case ne:
        case xe: {
          e.mode & Lt ? (P0(), Oo($r | yr, e, e.return), N0(e)) : Oo($r | yr, e, e.return);
          break;
        }
      }
    }
    function gA(e, t) {
      for (; ze !== null; ) {
        var i = ze;
        Xt(i), CA(i, t), pn();
        var o = i.child;
        o !== null ? (o.return = i, ze = o) : SA(e);
      }
    }
    function SA(e) {
      for (; ze !== null; ) {
        var t = ze, i = t.sibling, o = t.return;
        if (Nx(t), t === e) {
          ze = null;
          return;
        }
        if (i !== null) {
          i.return = o, ze = i;
          return;
        }
        ze = o;
      }
    }
    function CA(e, t) {
      switch (e.tag) {
        case b:
        case ne:
        case xe: {
          e.mode & Lt ? (P0(), Oo($r, e, t), N0(e)) : Oo($r, e, t);
          break;
        }
      }
    }
    function EA(e) {
      switch (e.tag) {
        case b:
        case ne:
        case xe: {
          try {
            Eu(gr | yr, e);
          } catch (i) {
            hn(e, e.return, i);
          }
          break;
        }
        case R: {
          var t = e.stateNode;
          try {
            t.componentDidMount();
          } catch (i) {
            hn(e, e.return, i);
          }
          break;
        }
      }
    }
    function TA(e) {
      switch (e.tag) {
        case b:
        case ne:
        case xe: {
          try {
            Eu($r | yr, e);
          } catch (t) {
            hn(e, e.return, t);
          }
          break;
        }
      }
    }
    function bA(e) {
      switch (e.tag) {
        case b:
        case ne:
        case xe: {
          try {
            Oo(gr | yr, e, e.return);
          } catch (i) {
            hn(e, e.return, i);
          }
          break;
        }
        case R: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && tC(e, e.return, t);
          break;
        }
      }
    }
    function xA(e) {
      switch (e.tag) {
        case b:
        case ne:
        case xe:
          try {
            Oo($r | yr, e, e.return);
          } catch (t) {
            hn(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var kh = Symbol.for;
      kh("selector.component"), kh("selector.has_pseudo_class"), kh("selector.role"), kh("selector.test_id"), kh("selector.text");
    }
    var wA = [];
    function RA() {
      wA.forEach(function(e) {
        return e();
      });
    }
    var kA = c.ReactCurrentActQueue;
    function DA(e) {
      {
        var t = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        ), i = typeof jest < "u";
        return i && t !== !1;
      }
    }
    function Ix() {
      {
        var e = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        );
        return !e && kA.current !== null && h("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var _A = Math.ceil, aC = c.ReactCurrentDispatcher, oC = c.ReactCurrentOwner, Qr = c.ReactCurrentBatchConfig, No = c.ReactCurrentActQueue, Er = (
      /*             */
      0
    ), Yx = (
      /*               */
      1
    ), Xr = (
      /*                */
      2
    ), Qa = (
      /*                */
      4
    ), ds = 0, Dh = 1, Ac = 2, Iy = 3, _h = 4, $x = 5, lC = 6, Nt = Er, ki = null, Ln = null, Tr = oe, bl = oe, sC = du(oe), br = ds, Mh = null, Yy = oe, Oh = oe, $y = oe, Ah = null, Zi = null, uC = 0, Wx = 500, Gx = 1 / 0, MA = 500, ps = null;
    function Lh() {
      Gx = Qn() + MA;
    }
    function Kx() {
      return Gx;
    }
    var Wy = !1, cC = null, Td = null, Lc = !1, bu = null, Nh = oe, fC = [], dC = null, OA = 50, Ph = 0, pC = null, hC = !1, Gy = !1, AA = 50, bd = 0, Ky = null, Vh = nn, Qy = oe, Qx = !1;
    function Xy() {
      return ki;
    }
    function Di() {
      return (Nt & (Xr | Qa)) !== Er ? Qn() : (Vh !== nn || (Vh = Qn()), Vh);
    }
    function xu(e) {
      var t = e.mode;
      if ((t & wt) === Ke)
        return _e;
      if ((Nt & Xr) !== Er && Tr !== oe)
        return nu(Tr);
      var i = DM() !== kM;
      if (i) {
        if (Qr.transition !== null) {
          var o = Qr.transition;
          o._updatedFibers || (o._updatedFibers = /* @__PURE__ */ new Set()), o._updatedFibers.add(e);
        }
        return Qy === gn && (Qy = wp()), Qy;
      }
      var u = ma();
      if (u !== gn)
        return u;
      var d = d_();
      return d;
    }
    function LA(e) {
      var t = e.mode;
      return (t & wt) === Ke ? _e : Jm();
    }
    function xr(e, t, i, o) {
      rL(), Qx && h("useInsertionEffect must not schedule updates."), hC && (Gy = !0), Ql(e, i, o), (Nt & Xr) !== oe && e === ki ? oL(t) : (bi && Nf(e, t, i), lL(t), e === ki && ((Nt & Xr) === Er && (Oh = vt(Oh, i)), br === _h && wu(e, Tr)), Ji(e, o), i === _e && Nt === Er && (t.mode & wt) === Ke && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !No.isBatchingLegacy && (Lh(), KT()));
    }
    function NA(e, t, i) {
      var o = e.current;
      o.lanes = t, Ql(e, t, i), Ji(e, i);
    }
    function PA(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        (Nt & Xr) !== Er
      );
    }
    function Ji(e, t) {
      var i = e.callbackNode;
      Xm(e, t);
      var o = Af(e, e === ki ? Tr : oe);
      if (o === oe) {
        i !== null && fw(i), e.callbackNode = null, e.callbackPriority = gn;
        return;
      }
      var u = al(o), d = e.callbackPriority;
      if (d === u && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(No.current !== null && i !== EC)) {
        i == null && d !== _e && h("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      i != null && fw(i);
      var v;
      if (u === _e)
        e.tag === pu ? (No.isBatchingLegacy !== null && (No.didScheduleLegacyUpdate = !0), cM(Zx.bind(null, e))) : GT(Zx.bind(null, e)), No.current !== null ? No.current.push(hu) : h_(function() {
          (Nt & (Xr | Qa)) === Er && hu();
        }), v = null;
      else {
        var S;
        switch (hr(o)) {
          case si:
            S = Xu;
            break;
          case ha:
            S = nl;
            break;
          case ja:
            S = po;
            break;
          case Xl:
            S = Ti;
            break;
          default:
            S = po;
            break;
        }
        v = TC(S, Xx.bind(null, e));
      }
      e.callbackPriority = u, e.callbackNode = v;
    }
    function Xx(e, t) {
      if (rO(), Vh = nn, Qy = oe, (Nt & (Xr | Qa)) !== Er)
        throw new Error("Should not already be working.");
      var i = e.callbackNode, o = ms();
      if (o && e.callbackNode !== i)
        return null;
      var u = Af(e, e === ki ? Tr : oe);
      if (u === oe)
        return null;
      var d = !tu(e, u) && !Bg(e, u) && !t, v = d ? $A(e, u) : Zy(e, u);
      if (v !== ds) {
        if (v === Ac) {
          var S = Js(e);
          S !== oe && (u = S, v = mC(e, S));
        }
        if (v === Dh) {
          var C = Mh;
          throw Nc(e, oe), wu(e, u), Ji(e, Qn()), C;
        }
        if (v === lC)
          wu(e, u);
        else {
          var k = !tu(e, u), _ = e.current.alternate;
          if (k && !zA(_)) {
            if (v = Zy(e, u), v === Ac) {
              var F = Js(e);
              F !== oe && (u = F, v = mC(e, F));
            }
            if (v === Dh) {
              var z = Mh;
              throw Nc(e, oe), wu(e, u), Ji(e, Qn()), z;
            }
          }
          e.finishedWork = _, e.finishedLanes = u, VA(e, v, u);
        }
      }
      return Ji(e, Qn()), e.callbackNode === i ? Xx.bind(null, e) : null;
    }
    function mC(e, t) {
      var i = Ah;
      if (Pf(e)) {
        var o = Nc(e, t);
        o.flags |= Or, rM(e.containerInfo);
      }
      var u = Zy(e, t);
      if (u !== Ac) {
        var d = Zi;
        Zi = i, d !== null && qx(d);
      }
      return u;
    }
    function qx(e) {
      Zi === null ? Zi = e : Zi.push.apply(Zi, e);
    }
    function VA(e, t, i) {
      switch (t) {
        case ds:
        case Dh:
          throw new Error("Root did not complete. This is a bug in React.");
        case Ac: {
          Pc(e, Zi, ps);
          break;
        }
        case Iy: {
          if (wu(e, i), Zm(i) && // do not delay if we're inside an act() scope
          !dw()) {
            var o = uC + Wx - Qn();
            if (o > 10) {
              var u = Af(e, oe);
              if (u !== oe)
                break;
              var d = e.suspendedLanes;
              if (!Kl(d, i)) {
                Di(), Dp(e, d);
                break;
              }
              e.timeoutHandle = dS(Pc.bind(null, e, Zi, ps), o);
              break;
            }
          }
          Pc(e, Zi, ps);
          break;
        }
        case _h: {
          if (wu(e, i), bp(i))
            break;
          if (!dw()) {
            var v = Fg(e, i), S = v, C = Qn() - S, k = nL(C) - C;
            if (k > 10) {
              e.timeoutHandle = dS(Pc.bind(null, e, Zi, ps), k);
              break;
            }
          }
          Pc(e, Zi, ps);
          break;
        }
        case $x: {
          Pc(e, Zi, ps);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function zA(e) {
      for (var t = e; ; ) {
        if (t.flags & Hs) {
          var i = t.updateQueue;
          if (i !== null) {
            var o = i.stores;
            if (o !== null)
              for (var u = 0; u < o.length; u++) {
                var d = o[u], v = d.getSnapshot, S = d.value;
                try {
                  if (!B(v(), S))
                    return !1;
                } catch {
                  return !1;
                }
              }
          }
        }
        var C = t.child;
        if (t.subtreeFlags & Hs && C !== null) {
          C.return = t, t = C;
          continue;
        }
        if (t === e)
          return !0;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return !0;
    }
    function wu(e, t) {
      t = oc(t, $y), t = oc(t, Oh), ev(e, t);
    }
    function Zx(e) {
      if (iO(), (Nt & (Xr | Qa)) !== Er)
        throw new Error("Should not already be working.");
      ms();
      var t = Af(e, oe);
      if (!rn(t, _e))
        return Ji(e, Qn()), null;
      var i = Zy(e, t);
      if (e.tag !== pu && i === Ac) {
        var o = Js(e);
        o !== oe && (t = o, i = mC(e, o));
      }
      if (i === Dh) {
        var u = Mh;
        throw Nc(e, oe), wu(e, t), Ji(e, Qn()), u;
      }
      if (i === lC)
        throw new Error("Root did not complete. This is a bug in React.");
      var d = e.current.alternate;
      return e.finishedWork = d, e.finishedLanes = t, Pc(e, Zi, ps), Ji(e, Qn()), null;
    }
    function UA(e, t) {
      t !== oe && (lc(e, vt(t, _e)), Ji(e, Qn()), (Nt & (Xr | Qa)) === Er && (Lh(), hu()));
    }
    function vC(e, t) {
      var i = Nt;
      Nt |= Yx;
      try {
        return e(t);
      } finally {
        Nt = i, Nt === Er && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !No.isBatchingLegacy && (Lh(), KT());
      }
    }
    function FA(e, t, i, o, u) {
      var d = ma(), v = Qr.transition;
      try {
        return Qr.transition = null, Xn(si), e(t, i, o, u);
      } finally {
        Xn(d), Qr.transition = v, Nt === Er && Lh();
      }
    }
    function hs(e) {
      bu !== null && bu.tag === pu && (Nt & (Xr | Qa)) === Er && ms();
      var t = Nt;
      Nt |= Yx;
      var i = Qr.transition, o = ma();
      try {
        return Qr.transition = null, Xn(si), e ? e() : void 0;
      } finally {
        Xn(o), Qr.transition = i, Nt = t, (Nt & (Xr | Qa)) === Er && hu();
      }
    }
    function Jx() {
      return (Nt & (Xr | Qa)) !== Er;
    }
    function qy(e, t) {
      di(sC, bl, e), bl = vt(bl, t);
    }
    function yC(e) {
      bl = sC.current, fi(sC, e);
    }
    function Nc(e, t) {
      e.finishedWork = null, e.finishedLanes = oe;
      var i = e.timeoutHandle;
      if (i !== pS && (e.timeoutHandle = pS, p_(i)), Ln !== null)
        for (var o = Ln.return; o !== null; ) {
          var u = o.alternate;
          Dx(u, o), o = o.return;
        }
      ki = e;
      var d = Vc(e.current, null);
      return Ln = d, Tr = bl = t, br = ds, Mh = null, Yy = oe, Oh = oe, $y = oe, Ah = null, Zi = null, AM(), Ro.discardPendingWarnings(), d;
    }
    function ew(e, t) {
      do {
        var i = Ln;
        try {
          if (ay(), Mb(), pn(), oC.current = null, i === null || i.return === null) {
            br = Dh, Mh = t, Ln = null;
            return;
          }
          if (Ne && i.mode & Lt && zy(i, !0), Ie)
            if (ho(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var o = t;
              gp(i, o, Tr);
            } else
              Ym(i, t, Tr);
          uO(e, i.return, i, t, Tr), iw(i);
        } catch (u) {
          t = u, Ln === i && i !== null ? (i = i.return, Ln = i) : i = Ln;
          continue;
        }
        return;
      } while (!0);
    }
    function tw() {
      var e = aC.current;
      return aC.current = Ay, e === null ? Ay : e;
    }
    function nw(e) {
      aC.current = e;
    }
    function jA() {
      uC = Qn();
    }
    function zh(e) {
      Yy = vt(e, Yy);
    }
    function BA() {
      br === ds && (br = Iy);
    }
    function gC() {
      (br === ds || br === Iy || br === Ac) && (br = _h), ki !== null && (Tp(Yy) || Tp(Oh)) && wu(ki, Tr);
    }
    function HA(e) {
      br !== _h && (br = Ac), Ah === null ? Ah = [e] : Ah.push(e);
    }
    function IA() {
      return br === ds;
    }
    function Zy(e, t) {
      var i = Nt;
      Nt |= Xr;
      var o = tw();
      if (ki !== e || Tr !== t) {
        if (bi) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (Uh(e, Tr), u.clear()), sc(e, t);
        }
        ps = nv(), Nc(e, t);
      }
      Yl(t);
      do
        try {
          YA();
          break;
        } catch (d) {
          ew(e, d);
        }
      while (!0);
      if (ay(), Nt = i, nw(o), Ln !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return $s(), ki = null, Tr = oe, br;
    }
    function YA() {
      for (; Ln !== null; )
        rw(Ln);
    }
    function $A(e, t) {
      var i = Nt;
      Nt |= Xr;
      var o = tw();
      if (ki !== e || Tr !== t) {
        if (bi) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (Uh(e, Tr), u.clear()), sc(e, t);
        }
        ps = nv(), Lh(), Nc(e, t);
      }
      Yl(t);
      do
        try {
          WA();
          break;
        } catch (d) {
          ew(e, d);
        }
      while (!0);
      return ay(), nw(o), Nt = i, Ln !== null ? (Gm(), ds) : ($s(), ki = null, Tr = oe, br);
    }
    function WA() {
      for (; Ln !== null && !fp(); )
        rw(Ln);
    }
    function rw(e) {
      var t = e.alternate;
      Xt(e);
      var i;
      (e.mode & Lt) !== Ke ? (L0(e), i = SC(t, e, bl), zy(e, !0)) : i = SC(t, e, bl), pn(), e.memoizedProps = e.pendingProps, i === null ? iw(e) : Ln = i, oC.current = null;
    }
    function iw(e) {
      var t = e;
      do {
        var i = t.alternate, o = t.return;
        if ((t.flags & Qu) === Qe) {
          Xt(t);
          var u = void 0;
          if ((t.mode & Lt) === Ke ? u = kx(i, t, bl) : (L0(t), u = kx(i, t, bl), zy(t, !1)), pn(), u !== null) {
            Ln = u;
            return;
          }
        } else {
          var d = BO(i, t);
          if (d !== null) {
            d.flags &= Vm, Ln = d;
            return;
          }
          if ((t.mode & Lt) !== Ke) {
            zy(t, !1);
            for (var v = t.actualDuration, S = t.child; S !== null; )
              v += S.actualDuration, S = S.sibling;
            t.actualDuration = v;
          }
          if (o !== null)
            o.flags |= Qu, o.subtreeFlags = Qe, o.deletions = null;
          else {
            br = lC, Ln = null;
            return;
          }
        }
        var C = t.sibling;
        if (C !== null) {
          Ln = C;
          return;
        }
        t = o, Ln = t;
      } while (t !== null);
      br === ds && (br = $x);
    }
    function Pc(e, t, i) {
      var o = ma(), u = Qr.transition;
      try {
        Qr.transition = null, Xn(si), GA(e, t, i, o);
      } finally {
        Qr.transition = u, Xn(o);
      }
      return null;
    }
    function GA(e, t, i, o) {
      do
        ms();
      while (bu !== null);
      if (iL(), (Nt & (Xr | Qa)) !== Er)
        throw new Error("Should not already be working.");
      var u = e.finishedWork, d = e.finishedLanes;
      if (jm(d), u === null)
        return Va(), null;
      if (d === oe && h("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = oe, u === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = gn;
      var v = vt(u.lanes, u.childLanes);
      _p(e, v), e === ki && (ki = null, Ln = null, Tr = oe), ((u.subtreeFlags & fo) !== Qe || (u.flags & fo) !== Qe) && (Lc || (Lc = !0, dC = i, TC(po, function() {
        return ms(), null;
      })));
      var S = (u.subtreeFlags & (Jo | el | tl | fo)) !== Qe, C = (u.flags & (Jo | el | tl | fo)) !== Qe;
      if (S || C) {
        var k = Qr.transition;
        Qr.transition = null;
        var _ = ma();
        Xn(si);
        var F = Nt;
        Nt |= Qa, oC.current = null, WO(e, u), tx(), oA(e, u, d), o_(e.containerInfo), e.current = u, qu(d), lA(u, e, d), Sf(), dp(), Nt = F, Xn(_), Qr.transition = k;
      } else
        e.current = u, tx();
      var z = Lc;
      if (Lc ? (Lc = !1, bu = e, Nh = d) : (bd = 0, Ky = null), v = e.pendingLanes, v === oe && (Td = null), z || sw(e.current, !1), Il(u.stateNode, o), bi && e.memoizedUpdaters.clear(), RA(), Ji(e, Qn()), t !== null)
        for (var $ = e.onRecoverableError, G = 0; G < t.length; G++) {
          var Z = t[G], Ae = Z.stack, Ze = Z.digest;
          $(Z.value, {
            componentStack: Ae,
            digest: Ze
          });
        }
      if (Wy) {
        Wy = !1;
        var $e = cC;
        throw cC = null, $e;
      }
      return rn(Nh, _e) && e.tag !== pu && ms(), v = e.pendingLanes, rn(v, _e) ? (nO(), e === pC ? Ph++ : (Ph = 0, pC = e)) : Ph = 0, hu(), Va(), null;
    }
    function ms() {
      if (bu !== null) {
        var e = hr(Nh), t = iv(ja, e), i = Qr.transition, o = ma();
        try {
          return Qr.transition = null, Xn(t), QA();
        } finally {
          Xn(o), Qr.transition = i;
        }
      }
      return !1;
    }
    function KA(e) {
      fC.push(e), Lc || (Lc = !0, TC(po, function() {
        return ms(), null;
      }));
    }
    function QA() {
      if (bu === null)
        return !1;
      var e = dC;
      dC = null;
      var t = bu, i = Nh;
      if (bu = null, Nh = oe, (Nt & (Xr | Qa)) !== Er)
        throw new Error("Cannot flush passive effects while already rendering.");
      hC = !0, Gy = !1, $m(i);
      var o = Nt;
      Nt |= Qa, hA(t.current), cA(t, t.current, i, e);
      {
        var u = fC;
        fC = [];
        for (var d = 0; d < u.length; d++) {
          var v = u[d];
          XO(t, v);
        }
      }
      Wm(), sw(t.current, !0), Nt = o, hu(), Gy ? t === Ky ? bd++ : (bd = 0, Ky = t) : bd = 0, hC = !1, Gy = !1, pp(t);
      {
        var S = t.current.stateNode;
        S.effectDuration = 0, S.passiveEffectDuration = 0;
      }
      return !0;
    }
    function aw(e) {
      return Td !== null && Td.has(e);
    }
    function XA(e) {
      Td === null ? Td = /* @__PURE__ */ new Set([e]) : Td.add(e);
    }
    function qA(e) {
      Wy || (Wy = !0, cC = e);
    }
    var ZA = qA;
    function ow(e, t, i) {
      var o = Mc(i, t), u = rx(e, o, _e), d = vu(e, u, _e), v = Di();
      d !== null && (Ql(d, _e, v), Ji(d, v));
    }
    function hn(e, t, i) {
      if (IO(i), Fh(!1), e.tag === M) {
        ow(e, e, i);
        return;
      }
      var o = null;
      for (o = t; o !== null; ) {
        if (o.tag === M) {
          ow(o, e, i);
          return;
        } else if (o.tag === R) {
          var u = o.type, d = o.stateNode;
          if (typeof u.getDerivedStateFromError == "function" || typeof d.componentDidCatch == "function" && !aw(d)) {
            var v = Mc(i, e), S = F0(o, v, _e), C = vu(o, S, _e), k = Di();
            C !== null && (Ql(C, _e, k), Ji(C, k));
            return;
          }
        }
        o = o.return;
      }
      h(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, i);
    }
    function JA(e, t, i) {
      var o = e.pingCache;
      o !== null && o.delete(t);
      var u = Di();
      Dp(e, i), sL(e), ki === e && Kl(Tr, i) && (br === _h || br === Iy && Zm(Tr) && Qn() - uC < Wx ? Nc(e, oe) : $y = vt($y, i)), Ji(e, u);
    }
    function lw(e, t) {
      t === gn && (t = LA(e));
      var i = Di(), o = Xi(e, t);
      o !== null && (Ql(o, t, i), Ji(o, i));
    }
    function eL(e) {
      var t = e.memoizedState, i = gn;
      t !== null && (i = t.retryLane), lw(e, i);
    }
    function tL(e, t) {
      var i = gn, o;
      switch (e.tag) {
        case ae:
          o = e.stateNode;
          var u = e.memoizedState;
          u !== null && (i = u.retryLane);
          break;
        case Mt:
          o = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      o !== null && o.delete(t), lw(e, i);
    }
    function nL(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : _A(e / 1960) * 1960;
    }
    function rL() {
      if (Ph > OA)
        throw Ph = 0, pC = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      bd > AA && (bd = 0, Ky = null, h("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function iL() {
      Ro.flushLegacyContextWarning(), Ro.flushPendingUnsafeLifecycleWarnings();
    }
    function sw(e, t) {
      Xt(e), Jy(e, Zo, bA), t && Jy(e, La, xA), Jy(e, Zo, EA), t && Jy(e, La, TA), pn();
    }
    function Jy(e, t, i) {
      for (var o = e, u = null; o !== null; ) {
        var d = o.subtreeFlags & t;
        o !== u && o.child !== null && d !== Qe ? o = o.child : ((o.flags & t) !== Qe && i(o), o.sibling !== null ? o = o.sibling : o = u = o.return);
      }
    }
    var eg = null;
    function uw(e) {
      {
        if ((Nt & Xr) !== Er || !(e.mode & wt))
          return;
        var t = e.tag;
        if (t !== D && t !== M && t !== R && t !== b && t !== ne && t !== Re && t !== xe)
          return;
        var i = lt(e) || "ReactComponent";
        if (eg !== null) {
          if (eg.has(i))
            return;
          eg.add(i);
        } else
          eg = /* @__PURE__ */ new Set([i]);
        var o = dr;
        try {
          Xt(e), h("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          o ? Xt(e) : pn();
        }
      }
    }
    var SC;
    {
      var aL = null;
      SC = function(e, t, i) {
        var o = yw(aL, t);
        try {
          return Tx(e, t, i);
        } catch (d) {
          if (gM() || d !== null && typeof d == "object" && typeof d.then == "function")
            throw d;
          if (ay(), Mb(), Dx(e, t), yw(t, o), t.mode & Lt && L0(t), qo(null, Tx, null, e, t, i), uo()) {
            var u = Ku();
            typeof u == "object" && u !== null && u._suppressLogging && typeof d == "object" && d !== null && !d._suppressLogging && (d._suppressLogging = !0);
          }
          throw d;
        }
      };
    }
    var cw = !1, CC;
    CC = /* @__PURE__ */ new Set();
    function oL(e) {
      if (ka && !JM())
        switch (e.tag) {
          case b:
          case ne:
          case xe: {
            var t = Ln && lt(Ln) || "Unknown", i = t;
            if (!CC.has(i)) {
              CC.add(i);
              var o = lt(e) || "Unknown";
              h("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", o, t, t);
            }
            break;
          }
          case R: {
            cw || (h("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), cw = !0);
            break;
          }
        }
    }
    function Uh(e, t) {
      if (bi) {
        var i = e.memoizedUpdaters;
        i.forEach(function(o) {
          Nf(e, o, t);
        });
      }
    }
    var EC = {};
    function TC(e, t) {
      {
        var i = No.current;
        return i !== null ? (i.push(t), EC) : cp(e, t);
      }
    }
    function fw(e) {
      if (e !== EC)
        return Um(e);
    }
    function dw() {
      return No.current !== null;
    }
    function lL(e) {
      {
        if (e.mode & wt) {
          if (!Ix())
            return;
        } else if (!DA() || Nt !== Er || e.tag !== b && e.tag !== ne && e.tag !== xe)
          return;
        if (No.current === null) {
          var t = dr;
          try {
            Xt(e), h(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, lt(e));
          } finally {
            t ? Xt(e) : pn();
          }
        }
      }
    }
    function sL(e) {
      e.tag !== pu && Ix() && No.current === null && h(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function Fh(e) {
      Qx = e;
    }
    var Xa = null, xd = null, uL = function(e) {
      Xa = e;
    };
    function wd(e) {
      {
        if (Xa === null)
          return e;
        var t = Xa(e);
        return t === void 0 ? e : t.current;
      }
    }
    function bC(e) {
      return wd(e);
    }
    function xC(e) {
      {
        if (Xa === null)
          return e;
        var t = Xa(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var i = wd(e.render);
            if (e.render !== i) {
              var o = {
                $$typeof: Ce,
                render: i
              };
              return e.displayName !== void 0 && (o.displayName = e.displayName), o;
            }
          }
          return e;
        }
        return t.current;
      }
    }
    function pw(e, t) {
      {
        if (Xa === null)
          return !1;
        var i = e.elementType, o = t.type, u = !1, d = typeof o == "object" && o !== null ? o.$$typeof : null;
        switch (e.tag) {
          case R: {
            typeof o == "function" && (u = !0);
            break;
          }
          case b: {
            (typeof o == "function" || d === et) && (u = !0);
            break;
          }
          case ne: {
            (d === Ce || d === et) && (u = !0);
            break;
          }
          case Re:
          case xe: {
            (d === Ct || d === et) && (u = !0);
            break;
          }
          default:
            return !1;
        }
        if (u) {
          var v = Xa(i);
          if (v !== void 0 && v === Xa(o))
            return !0;
        }
        return !1;
      }
    }
    function hw(e) {
      {
        if (Xa === null || typeof WeakSet != "function")
          return;
        xd === null && (xd = /* @__PURE__ */ new WeakSet()), xd.add(e);
      }
    }
    var cL = function(e, t) {
      {
        if (Xa === null)
          return;
        var i = t.staleFamilies, o = t.updatedFamilies;
        ms(), hs(function() {
          wC(e.current, o, i);
        });
      }
    }, fL = function(e, t) {
      {
        if (e.context !== Sa)
          return;
        ms(), hs(function() {
          jh(t, e, null, null);
        });
      }
    };
    function wC(e, t, i) {
      {
        var o = e.alternate, u = e.child, d = e.sibling, v = e.tag, S = e.type, C = null;
        switch (v) {
          case b:
          case xe:
          case R:
            C = S;
            break;
          case ne:
            C = S.render;
            break;
        }
        if (Xa === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var k = !1, _ = !1;
        if (C !== null) {
          var F = Xa(C);
          F !== void 0 && (i.has(F) ? _ = !0 : t.has(F) && (v === R ? _ = !0 : k = !0));
        }
        if (xd !== null && (xd.has(e) || o !== null && xd.has(o)) && (_ = !0), _ && (e._debugNeedsRemount = !0), _ || k) {
          var z = Xi(e, _e);
          z !== null && xr(z, e, _e, nn);
        }
        u !== null && !_ && wC(u, t, i), d !== null && wC(d, t, i);
      }
    }
    var dL = function(e, t) {
      {
        var i = /* @__PURE__ */ new Set(), o = new Set(t.map(function(u) {
          return u.current;
        }));
        return RC(e.current, o, i), i;
      }
    };
    function RC(e, t, i) {
      {
        var o = e.child, u = e.sibling, d = e.tag, v = e.type, S = null;
        switch (d) {
          case b:
          case xe:
          case R:
            S = v;
            break;
          case ne:
            S = v.render;
            break;
        }
        var C = !1;
        S !== null && t.has(S) && (C = !0), C ? pL(e, i) : o !== null && RC(o, t, i), u !== null && RC(u, t, i);
      }
    }
    function pL(e, t) {
      {
        var i = hL(e, t);
        if (i)
          return;
        for (var o = e; ; ) {
          switch (o.tag) {
            case j:
              t.add(o.stateNode);
              return;
            case A:
              t.add(o.stateNode.containerInfo);
              return;
            case M:
              t.add(o.stateNode.containerInfo);
              return;
          }
          if (o.return === null)
            throw new Error("Expected to reach root first.");
          o = o.return;
        }
      }
    }
    function hL(e, t) {
      for (var i = e, o = !1; ; ) {
        if (i.tag === j)
          o = !0, t.add(i.stateNode);
        else if (i.child !== null) {
          i.child.return = i, i = i.child;
          continue;
        }
        if (i === e)
          return o;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === e)
            return o;
          i = i.return;
        }
        i.sibling.return = i.return, i = i.sibling;
      }
      return !1;
    }
    var kC;
    {
      kC = !1;
      try {
        var mw = Object.preventExtensions({});
      } catch {
        kC = !0;
      }
    }
    function mL(e, t, i, o) {
      this.tag = e, this.key = i, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = o, this.flags = Qe, this.subtreeFlags = Qe, this.deletions = null, this.lanes = oe, this.childLanes = oe, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !kC && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var Ca = function(e, t, i, o) {
      return new mL(e, t, i, o);
    };
    function DC(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function vL(e) {
      return typeof e == "function" && !DC(e) && e.defaultProps === void 0;
    }
    function yL(e) {
      if (typeof e == "function")
        return DC(e) ? R : b;
      if (e != null) {
        var t = e.$$typeof;
        if (t === Ce)
          return ne;
        if (t === Ct)
          return Re;
      }
      return D;
    }
    function Vc(e, t) {
      var i = e.alternate;
      i === null ? (i = Ca(e.tag, t, e.key, e.mode), i.elementType = e.elementType, i.type = e.type, i.stateNode = e.stateNode, i._debugSource = e._debugSource, i._debugOwner = e._debugOwner, i._debugHookTypes = e._debugHookTypes, i.alternate = e, e.alternate = i) : (i.pendingProps = t, i.type = e.type, i.flags = Qe, i.subtreeFlags = Qe, i.deletions = null, i.actualDuration = 0, i.actualStartTime = -1), i.flags = e.flags & jn, i.childLanes = e.childLanes, i.lanes = e.lanes, i.child = e.child, i.memoizedProps = e.memoizedProps, i.memoizedState = e.memoizedState, i.updateQueue = e.updateQueue;
      var o = e.dependencies;
      switch (i.dependencies = o === null ? null : {
        lanes: o.lanes,
        firstContext: o.firstContext
      }, i.sibling = e.sibling, i.index = e.index, i.ref = e.ref, i.selfBaseDuration = e.selfBaseDuration, i.treeBaseDuration = e.treeBaseDuration, i._debugNeedsRemount = e._debugNeedsRemount, i.tag) {
        case D:
        case b:
        case xe:
          i.type = wd(e.type);
          break;
        case R:
          i.type = bC(e.type);
          break;
        case ne:
          i.type = xC(e.type);
          break;
      }
      return i;
    }
    function gL(e, t) {
      e.flags &= jn | Tn;
      var i = e.alternate;
      if (i === null)
        e.childLanes = oe, e.lanes = t, e.child = null, e.subtreeFlags = Qe, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = i.childLanes, e.lanes = i.lanes, e.child = i.child, e.subtreeFlags = Qe, e.deletions = null, e.memoizedProps = i.memoizedProps, e.memoizedState = i.memoizedState, e.updateQueue = i.updateQueue, e.type = i.type;
        var o = i.dependencies;
        e.dependencies = o === null ? null : {
          lanes: o.lanes,
          firstContext: o.firstContext
        }, e.selfBaseDuration = i.selfBaseDuration, e.treeBaseDuration = i.treeBaseDuration;
      }
      return e;
    }
    function SL(e, t, i) {
      var o;
      return e === qv ? (o = wt, t === !0 && (o |= Mn, o |= Yi)) : o = Ke, bi && (o |= Lt), Ca(M, null, null, o);
    }
    function _C(e, t, i, o, u, d) {
      var v = D, S = e;
      if (typeof e == "function")
        DC(e) ? (v = R, S = bC(S)) : S = wd(S);
      else if (typeof e == "string")
        v = j;
      else
        e: switch (e) {
          case xa:
            return Ru(i.children, u, d, t);
          case aa:
            v = ie, u |= Mn, (u & wt) !== Ke && (u |= Yi);
            break;
          case wa:
            return CL(i, u, d, t);
          case Je:
            return EL(i, u, d, t);
          case it:
            return TL(i, u, d, t);
          case tn:
            return vw(i, u, d, t);
          case dn:
          case Et:
          case fr:
          case oa:
          case Wn:
          default: {
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case P:
                  v = he;
                  break e;
                case ce:
                  v = ue;
                  break e;
                case Ce:
                  v = ne, S = xC(S);
                  break e;
                case Ct:
                  v = Re;
                  break e;
                case et:
                  v = le, S = null;
                  break e;
              }
            var C = "";
            {
              (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (C += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var k = o ? lt(o) : null;
              k && (C += `

Check the render method of \`` + k + "`.");
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + C));
          }
        }
      var _ = Ca(v, i, t, u);
      return _.elementType = e, _.type = S, _.lanes = d, _._debugOwner = o, _;
    }
    function MC(e, t, i) {
      var o = null;
      o = e._owner;
      var u = e.type, d = e.key, v = e.props, S = _C(u, d, v, o, t, i);
      return S._debugSource = e._source, S._debugOwner = e._owner, S;
    }
    function Ru(e, t, i, o) {
      var u = Ca(re, e, o, t);
      return u.lanes = i, u;
    }
    function CL(e, t, i, o) {
      typeof e.id != "string" && h('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var u = Ca(Se, e, o, t | Lt);
      return u.elementType = wa, u.lanes = i, u.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, u;
    }
    function EL(e, t, i, o) {
      var u = Ca(ae, e, o, t);
      return u.elementType = Je, u.lanes = i, u;
    }
    function TL(e, t, i, o) {
      var u = Ca(Mt, e, o, t);
      return u.elementType = it, u.lanes = i, u;
    }
    function vw(e, t, i, o) {
      var u = Ca(We, e, o, t);
      u.elementType = tn, u.lanes = i;
      var d = {
        isHidden: !1
      };
      return u.stateNode = d, u;
    }
    function OC(e, t, i) {
      var o = Ca(q, e, null, t);
      return o.lanes = i, o;
    }
    function bL() {
      var e = Ca(j, null, null, Ke);
      return e.elementType = "DELETED", e;
    }
    function xL(e) {
      var t = Ca(yt, null, null, Ke);
      return t.stateNode = e, t;
    }
    function AC(e, t, i) {
      var o = e.children !== null ? e.children : [], u = Ca(A, o, e.key, t);
      return u.lanes = i, u.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, u;
    }
    function yw(e, t) {
      return e === null && (e = Ca(D, null, null, Ke)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function wL(e, t, i, o, u) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = pS, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = gn, this.eventTimes = Lf(oe), this.expirationTimes = Lf(nn), this.pendingLanes = oe, this.suspendedLanes = oe, this.pingedLanes = oe, this.expiredLanes = oe, this.mutableReadLanes = oe, this.finishedLanes = oe, this.entangledLanes = oe, this.entanglements = Lf(oe), this.identifierPrefix = o, this.onRecoverableError = u, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var d = this.pendingUpdatersLaneMap = [], v = 0; v < Ws; v++)
          d.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case qv:
          this._debugRootType = i ? "hydrateRoot()" : "createRoot()";
          break;
        case pu:
          this._debugRootType = i ? "hydrate()" : "render()";
          break;
      }
    }
    function gw(e, t, i, o, u, d, v, S, C, k) {
      var _ = new wL(e, t, i, S, C), F = SL(t, d);
      _.current = F, F.stateNode = _;
      {
        var z = {
          element: o,
          isDehydrated: i,
          cache: null,
          // not enabled yet
          transitions: null,
          pendingSuspenseBoundaries: null
        };
        F.memoizedState = z;
      }
      return jS(F), _;
    }
    var LC = "18.2.0";
    function RL(e, t, i) {
      var o = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      return Jr(o), {
        // This tag allow us to uniquely identify this as a React Portal
        $$typeof: Mr,
        key: o == null ? null : "" + o,
        children: e,
        containerInfo: t,
        implementation: i
      };
    }
    var NC, PC;
    NC = !1, PC = {};
    function Sw(e) {
      if (!e)
        return Sa;
      var t = Bs(e), i = uM(t);
      if (t.tag === R) {
        var o = t.type;
        if (vl(o))
          return $T(t, o, i);
      }
      return i;
    }
    function kL(e, t) {
      {
        var i = Bs(e);
        if (i === void 0) {
          if (typeof e.render == "function")
            throw new Error("Unable to find node on an unmounted component.");
          var o = Object.keys(e).join(",");
          throw new Error("Argument appears to not be a ReactComponent. Keys: " + o);
        }
        var u = ii(i);
        if (u === null)
          return null;
        if (u.mode & Mn) {
          var d = lt(i) || "Component";
          if (!PC[d]) {
            PC[d] = !0;
            var v = dr;
            try {
              Xt(u), i.mode & Mn ? h("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, d) : h("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, d);
            } finally {
              v ? Xt(v) : pn();
            }
          }
        }
        return u.stateNode;
      }
    }
    function Cw(e, t, i, o, u, d, v, S) {
      var C = !1, k = null;
      return gw(e, t, C, k, i, o, u, d, v);
    }
    function Ew(e, t, i, o, u, d, v, S, C, k) {
      var _ = !0, F = gw(i, o, _, e, u, d, v, S, C);
      F.context = Sw(null);
      var z = F.current, $ = Di(), G = xu(z), Z = cs($, G);
      return Z.callback = t ?? null, vu(z, Z, G), NA(F, G, $), F;
    }
    function jh(e, t, i, o) {
      Hi(t, e);
      var u = t.current, d = Di(), v = xu(u);
      za(v);
      var S = Sw(i);
      t.context === null ? t.context = S : t.pendingContext = S, ka && dr !== null && !NC && (NC = !0, h(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, lt(dr) || "Unknown"));
      var C = cs(d, v);
      C.payload = {
        element: e
      }, o = o === void 0 ? null : o, o !== null && (typeof o != "function" && h("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", o), C.callback = o);
      var k = vu(u, C, v);
      return k !== null && (xr(k, u, v, d), cy(k, u, v)), v;
    }
    function tg(e) {
      var t = e.current;
      if (!t.child)
        return null;
      switch (t.child.tag) {
        case j:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function DL(e) {
      switch (e.tag) {
        case M: {
          var t = e.stateNode;
          if (Pf(t)) {
            var i = qm(t);
            UA(t, i);
          }
          break;
        }
        case ae: {
          hs(function() {
            var u = Xi(e, _e);
            if (u !== null) {
              var d = Di();
              xr(u, e, _e, d);
            }
          });
          var o = _e;
          VC(e, o);
          break;
        }
      }
    }
    function Tw(e, t) {
      var i = e.memoizedState;
      i !== null && i.dehydrated !== null && (i.retryLane = kp(i.retryLane, t));
    }
    function VC(e, t) {
      Tw(e, t);
      var i = e.alternate;
      i && Tw(i, t);
    }
    function _L(e) {
      if (e.tag === ae) {
        var t = Xs, i = Xi(e, t);
        if (i !== null) {
          var o = Di();
          xr(i, e, t, o);
        }
        VC(e, t);
      }
    }
    function ML(e) {
      if (e.tag === ae) {
        var t = xu(e), i = Xi(e, t);
        if (i !== null) {
          var o = Di();
          xr(i, e, t, o);
        }
        VC(e, t);
      }
    }
    function bw(e) {
      var t = vn(e);
      return t === null ? null : t.stateNode;
    }
    var xw = function(e) {
      return null;
    };
    function OL(e) {
      return xw(e);
    }
    var ww = function(e) {
      return !1;
    };
    function AL(e) {
      return ww(e);
    }
    var Rw = null, kw = null, Dw = null, _w = null, Mw = null, Ow = null, Aw = null, Lw = null, Nw = null;
    {
      var Pw = function(e, t, i) {
        var o = t[i], u = Tt(e) ? e.slice() : kt({}, e);
        return i + 1 === t.length ? (Tt(u) ? u.splice(o, 1) : delete u[o], u) : (u[o] = Pw(e[o], t, i + 1), u);
      }, Vw = function(e, t) {
        return Pw(e, t, 0);
      }, zw = function(e, t, i, o) {
        var u = t[o], d = Tt(e) ? e.slice() : kt({}, e);
        if (o + 1 === t.length) {
          var v = i[o];
          d[v] = d[u], Tt(d) ? d.splice(u, 1) : delete d[u];
        } else
          d[u] = zw(
            // $FlowFixMe number or string is fine here
            e[u],
            t,
            i,
            o + 1
          );
        return d;
      }, Uw = function(e, t, i) {
        if (t.length !== i.length) {
          E("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var o = 0; o < i.length - 1; o++)
            if (t[o] !== i[o]) {
              E("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return zw(e, t, i, 0);
      }, Fw = function(e, t, i, o) {
        if (i >= t.length)
          return o;
        var u = t[i], d = Tt(e) ? e.slice() : kt({}, e);
        return d[u] = Fw(e[u], t, i + 1, o), d;
      }, jw = function(e, t, i) {
        return Fw(e, t, 0, i);
      }, zC = function(e, t) {
        for (var i = e.memoizedState; i !== null && t > 0; )
          i = i.next, t--;
        return i;
      };
      Rw = function(e, t, i, o) {
        var u = zC(e, t);
        if (u !== null) {
          var d = jw(u.memoizedState, i, o);
          u.memoizedState = d, u.baseState = d, e.memoizedProps = kt({}, e.memoizedProps);
          var v = Xi(e, _e);
          v !== null && xr(v, e, _e, nn);
        }
      }, kw = function(e, t, i) {
        var o = zC(e, t);
        if (o !== null) {
          var u = Vw(o.memoizedState, i);
          o.memoizedState = u, o.baseState = u, e.memoizedProps = kt({}, e.memoizedProps);
          var d = Xi(e, _e);
          d !== null && xr(d, e, _e, nn);
        }
      }, Dw = function(e, t, i, o) {
        var u = zC(e, t);
        if (u !== null) {
          var d = Uw(u.memoizedState, i, o);
          u.memoizedState = d, u.baseState = d, e.memoizedProps = kt({}, e.memoizedProps);
          var v = Xi(e, _e);
          v !== null && xr(v, e, _e, nn);
        }
      }, _w = function(e, t, i) {
        e.pendingProps = jw(e.memoizedProps, t, i), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var o = Xi(e, _e);
        o !== null && xr(o, e, _e, nn);
      }, Mw = function(e, t) {
        e.pendingProps = Vw(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Xi(e, _e);
        i !== null && xr(i, e, _e, nn);
      }, Ow = function(e, t, i) {
        e.pendingProps = Uw(e.memoizedProps, t, i), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var o = Xi(e, _e);
        o !== null && xr(o, e, _e, nn);
      }, Aw = function(e) {
        var t = Xi(e, _e);
        t !== null && xr(t, e, _e, nn);
      }, Lw = function(e) {
        xw = e;
      }, Nw = function(e) {
        ww = e;
      };
    }
    function LL(e) {
      var t = ii(e);
      return t === null ? null : t.stateNode;
    }
    function NL(e) {
      return null;
    }
    function PL() {
      return dr;
    }
    function VL(e) {
      var t = e.findFiberByHostInstance, i = c.ReactCurrentDispatcher;
      return Ys({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: Rw,
        overrideHookStateDeletePath: kw,
        overrideHookStateRenamePath: Dw,
        overrideProps: _w,
        overridePropsDeletePath: Mw,
        overridePropsRenamePath: Ow,
        setErrorHandler: Lw,
        setSuspenseHandler: Nw,
        scheduleUpdate: Aw,
        currentDispatcherRef: i,
        findHostInstanceByFiber: LL,
        findFiberByHostInstance: t || NL,
        // React Refresh
        findHostInstancesForRefresh: dL,
        scheduleRefresh: cL,
        scheduleRoot: fL,
        setRefreshHandler: uL,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: PL,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: LC
      });
    }
    var Bw = typeof reportError == "function" ? (
      // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    ) : function(e) {
      console.error(e);
    };
    function UC(e) {
      this._internalRoot = e;
    }
    ng.prototype.render = UC.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null)
        throw new Error("Cannot update an unmounted root.");
      {
        typeof arguments[1] == "function" ? h("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : rg(arguments[1]) ? h("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : typeof arguments[1] < "u" && h("You passed a second argument to root.render(...) but it only accepts one argument.");
        var i = t.containerInfo;
        if (i.nodeType !== Un) {
          var o = bw(t.current);
          o && o.parentNode !== i && h("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
      }
      jh(e, t, null, null);
    }, ng.prototype.unmount = UC.prototype.unmount = function() {
      typeof arguments[0] == "function" && h("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        Jx() && h("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), hs(function() {
          jh(null, e, null, null);
        }), jT(t);
      }
    };
    function zL(e, t) {
      if (!rg(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      Hw(e);
      var i = !1, o = !1, u = "", d = Bw;
      t != null && (t.hydrate ? E("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === Ur && h(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (i = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onRecoverableError !== void 0 && (d = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var v = Cw(e, qv, null, i, o, u, d);
      Yv(v.current, e);
      var S = e.nodeType === Un ? e.parentNode : e;
      return Kp(S), new UC(v);
    }
    function ng(e) {
      this._internalRoot = e;
    }
    function UL(e) {
      e && uv(e);
    }
    ng.prototype.unstable_scheduleHydration = UL;
    function FL(e, t, i) {
      if (!rg(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      Hw(e), t === void 0 && h("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var o = i ?? null, u = i != null && i.hydratedSources || null, d = !1, v = !1, S = "", C = Bw;
      i != null && (i.unstable_strictMode === !0 && (d = !0), i.identifierPrefix !== void 0 && (S = i.identifierPrefix), i.onRecoverableError !== void 0 && (C = i.onRecoverableError));
      var k = Ew(t, null, e, qv, o, d, v, S, C);
      if (Yv(k.current, e), Kp(e), u)
        for (var _ = 0; _ < u.length; _++) {
          var F = u[_];
          GM(k, F);
        }
      return new ng(k);
    }
    function rg(e) {
      return !!(e && (e.nodeType === ti || e.nodeType === so || e.nodeType === Zd));
    }
    function Bh(e) {
      return !!(e && (e.nodeType === ti || e.nodeType === so || e.nodeType === Zd || e.nodeType === Un && e.nodeValue === " react-mount-point-unstable "));
    }
    function Hw(e) {
      e.nodeType === ti && e.tagName && e.tagName.toUpperCase() === "BODY" && h("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), ah(e) && (e._reactRootContainer ? h("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : h("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var jL = c.ReactCurrentOwner, Iw;
    Iw = function(e) {
      if (e._reactRootContainer && e.nodeType !== Un) {
        var t = bw(e._reactRootContainer.current);
        t && t.parentNode !== e && h("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var i = !!e._reactRootContainer, o = FC(e), u = !!(o && fu(o));
      u && !i && h("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === ti && e.tagName && e.tagName.toUpperCase() === "BODY" && h("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function FC(e) {
      return e ? e.nodeType === so ? e.documentElement : e.firstChild : null;
    }
    function Yw() {
    }
    function BL(e, t, i, o, u) {
      if (u) {
        if (typeof o == "function") {
          var d = o;
          o = function() {
            var z = tg(v);
            d.call(z);
          };
        }
        var v = Ew(
          t,
          o,
          e,
          pu,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          Yw
        );
        e._reactRootContainer = v, Yv(v.current, e);
        var S = e.nodeType === Un ? e.parentNode : e;
        return Kp(S), hs(), v;
      } else {
        for (var C; C = e.lastChild; )
          e.removeChild(C);
        if (typeof o == "function") {
          var k = o;
          o = function() {
            var z = tg(_);
            k.call(z);
          };
        }
        var _ = Cw(
          e,
          pu,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          Yw
        );
        e._reactRootContainer = _, Yv(_.current, e);
        var F = e.nodeType === Un ? e.parentNode : e;
        return Kp(F), hs(function() {
          jh(t, _, i, o);
        }), _;
      }
    }
    function HL(e, t) {
      e !== null && typeof e != "function" && h("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function ig(e, t, i, o, u) {
      Iw(i), HL(u === void 0 ? null : u, "render");
      var d = i._reactRootContainer, v;
      if (!d)
        v = BL(i, t, e, u, o);
      else {
        if (v = d, typeof u == "function") {
          var S = u;
          u = function() {
            var C = tg(v);
            S.call(C);
          };
        }
        jh(t, v, e, u);
      }
      return tg(v);
    }
    function IL(e) {
      {
        var t = jL.current;
        if (t !== null && t.stateNode !== null) {
          var i = t.stateNode._warnedAboutRefsInRender;
          i || h("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", jt(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === ti ? e : kL(e, "findDOMNode");
    }
    function YL(e, t, i) {
      if (h("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Bh(t))
        throw new Error("Target container is not a DOM element.");
      {
        var o = ah(t) && t._reactRootContainer === void 0;
        o && h("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return ig(null, e, t, !0, i);
    }
    function $L(e, t, i) {
      if (h("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Bh(t))
        throw new Error("Target container is not a DOM element.");
      {
        var o = ah(t) && t._reactRootContainer === void 0;
        o && h("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return ig(null, e, t, !1, i);
    }
    function WL(e, t, i, o) {
      if (h("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Bh(i))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !zg(e))
        throw new Error("parentComponent must be a valid React Component");
      return ig(e, t, i, !1, o);
    }
    function GL(e) {
      if (!Bh(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = ah(e) && e._reactRootContainer === void 0;
        t && h("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var i = FC(e), o = i && !fu(i);
          o && h("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return hs(function() {
          ig(null, null, e, !1, function() {
            e._reactRootContainer = null, jT(e);
          });
        }), !0;
      } else {
        {
          var u = FC(e), d = !!(u && fu(u)), v = e.nodeType === ti && Bh(e.parentNode) && !!e.parentNode._reactRootContainer;
          d && h("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", v ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    Vf(DL), Pe(_L), Ap(ML), Ig(ma), zf(Mp), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && h("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), rf(XD), Vg(vC, FA, hs);
    function KL(e, t) {
      var i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!rg(t))
        throw new Error("Target container is not a DOM element.");
      return RL(e, t, null, i);
    }
    function QL(e, t, i, o) {
      return WL(e, t, i, o);
    }
    var jC = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [fu, nd, $v, zs, af, vC]
    };
    function XL(e, t) {
      return jC.usingClientEntryPoint || h('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), zL(e, t);
    }
    function qL(e, t, i) {
      return jC.usingClientEntryPoint || h('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), FL(e, t, i);
    }
    function ZL(e) {
      return Jx() && h("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), hs(e);
    }
    var JL = VL({
      findFiberByHostInstance: Ec,
      bundleType: 1,
      version: LC,
      rendererPackageName: "react-dom"
    });
    if (!JL && mn && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var $w = window.location.protocol;
      /^(https?|file):$/.test($w) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + ($w === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    ta.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = jC, ta.createPortal = KL, ta.createRoot = XL, ta.findDOMNode = IL, ta.flushSync = ZL, ta.hydrate = YL, ta.hydrateRoot = qL, ta.render = $L, ta.unmountComponentAtNode = GL, ta.unstable_batchedUpdates = vC, ta.unstable_renderSubtreeIntoContainer = QL, ta.version = LC, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), ta;
}
function x1() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
    if (process.env.NODE_ENV !== "production")
      throw new Error("^_^");
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(x1);
    } catch (a) {
      console.error(a);
    }
  }
}
process.env.NODE_ENV === "production" ? (x1(), sE.exports = sN()) : sE.exports = uN();
var cN = sE.exports, uE, og = cN;
if (process.env.NODE_ENV === "production")
  uE = og.createRoot, og.hydrateRoot;
else {
  var tR = og.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  uE = function(a, l) {
    tR.usingClientEntryPoint = !0;
    try {
      return og.createRoot(a, l);
    } finally {
      tR.usingClientEntryPoint = !1;
    }
  };
}
const w1 = at.createContext({});
function R1(a) {
  const l = at.useRef(null);
  return l.current === null && (l.current = a()), l.current;
}
const PE = typeof window < "u", k1 = PE ? at.useLayoutEffect : at.useEffect, VE = /* @__PURE__ */ at.createContext(null);
function zE(a, l) {
  a.indexOf(l) === -1 && a.push(l);
}
function UE(a, l) {
  const c = a.indexOf(l);
  c > -1 && a.splice(c, 1);
}
const gs = (a, l, c) => c > l ? l : c < a ? a : c;
function cE(a, l) {
  return l ? `${a}. For more information and steps for solving, visit https://motion.dev/troubleshooting/${l}` : a;
}
let Vd = () => {
}, Ss = () => {
};
process.env.NODE_ENV !== "production" && (Vd = (a, l, c) => {
  !a && typeof console < "u" && console.warn(cE(l, c));
}, Ss = (a, l, c) => {
  if (!a)
    throw new Error(cE(l, c));
});
const Cs = {}, D1 = (a) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(a);
function _1(a) {
  return typeof a == "object" && a !== null;
}
const M1 = (a) => /^0[^.\s]+$/u.test(a);
// @__NO_SIDE_EFFECTS__
function FE(a) {
  let l;
  return () => (l === void 0 && (l = a()), l);
}
const Ja = /* @__NO_SIDE_EFFECTS__ */ (a) => a, fN = (a, l) => (c) => l(a(c)), rm = (...a) => a.reduce(fN), Zh = /* @__NO_SIDE_EFFECTS__ */ (a, l, c) => {
  const p = l - a;
  return p === 0 ? 1 : (c - a) / p;
};
class jE {
  constructor() {
    this.subscriptions = [];
  }
  add(l) {
    return zE(this.subscriptions, l), () => UE(this.subscriptions, l);
  }
  notify(l, c, p) {
    const g = this.subscriptions.length;
    if (g)
      if (g === 1)
        this.subscriptions[0](l, c, p);
      else
        for (let E = 0; E < g; E++) {
          const h = this.subscriptions[E];
          h && h(l, c, p);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const zo = /* @__NO_SIDE_EFFECTS__ */ (a) => a * 1e3, Za = /* @__NO_SIDE_EFFECTS__ */ (a) => a / 1e3;
function O1(a, l) {
  return l ? a * (1e3 / l) : 0;
}
const nR = /* @__PURE__ */ new Set();
function BE(a, l, c) {
  a || nR.has(l) || (console.warn(cE(l, c)), nR.add(l));
}
const A1 = (a, l, c) => (((1 - 3 * c + 3 * l) * a + (3 * c - 6 * l)) * a + 3 * l) * a, dN = 1e-7, pN = 12;
function hN(a, l, c, p, g) {
  let E, h, x = 0;
  do
    h = l + (c - l) / 2, E = A1(h, p, g) - a, E > 0 ? c = h : l = h;
  while (Math.abs(E) > dN && ++x < pN);
  return h;
}
function im(a, l, c, p) {
  if (a === l && c === p)
    return Ja;
  const g = (E) => hN(E, 0, 1, a, c);
  return (E) => E === 0 || E === 1 ? E : A1(g(E), l, p);
}
const L1 = (a) => (l) => l <= 0.5 ? a(2 * l) / 2 : (2 - a(2 * (1 - l))) / 2, N1 = (a) => (l) => 1 - a(1 - l), P1 = /* @__PURE__ */ im(0.33, 1.53, 0.69, 0.99), HE = /* @__PURE__ */ N1(P1), V1 = /* @__PURE__ */ L1(HE), z1 = (a) => (a *= 2) < 1 ? 0.5 * HE(a) : 0.5 * (2 - Math.pow(2, -10 * (a - 1))), IE = (a) => 1 - Math.sin(Math.acos(a)), U1 = N1(IE), F1 = L1(IE), mN = /* @__PURE__ */ im(0.42, 0, 1, 1), vN = /* @__PURE__ */ im(0, 0, 0.58, 1), j1 = /* @__PURE__ */ im(0.42, 0, 0.58, 1), yN = (a) => Array.isArray(a) && typeof a[0] != "number", B1 = (a) => Array.isArray(a) && typeof a[0] == "number", rR = {
  linear: Ja,
  easeIn: mN,
  easeInOut: j1,
  easeOut: vN,
  circIn: IE,
  circInOut: F1,
  circOut: U1,
  backIn: HE,
  backInOut: V1,
  backOut: P1,
  anticipate: z1
}, gN = (a) => typeof a == "string", iR = (a) => {
  if (B1(a)) {
    Ss(a.length === 4, "Cubic bezier arrays must contain four numerical values.", "cubic-bezier-length");
    const [l, c, p, g] = a;
    return im(l, c, p, g);
  } else if (gN(a))
    return Ss(rR[a] !== void 0, `Invalid easing type '${a}'`, "invalid-easing-type"), rR[a];
  return a;
}, lg = [
  "setup",
  // Compute
  "read",
  // Read
  "resolveKeyframes",
  // Write/Read/Write/Read
  "preUpdate",
  // Compute
  "update",
  // Compute
  "preRender",
  // Compute
  "render",
  // Write
  "postRender"
  // Compute
];
function SN(a, l) {
  let c = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set(), g = !1, E = !1;
  const h = /* @__PURE__ */ new WeakSet();
  let x = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  };
  function b(D) {
    h.has(D) && (R.schedule(D), a()), D(x);
  }
  const R = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (D, M = !1, A = !1) => {
      const q = A && g ? c : p;
      return M && h.add(D), q.has(D) || q.add(D), D;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (D) => {
      p.delete(D), h.delete(D);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (D) => {
      if (x = D, g) {
        E = !0;
        return;
      }
      g = !0, [c, p] = [p, c], c.forEach(b), c.clear(), g = !1, E && (E = !1, R.process(D));
    }
  };
  return R;
}
const CN = 40;
function H1(a, l) {
  let c = !1, p = !0;
  const g = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, E = () => c = !0, h = lg.reduce((ne, Se) => (ne[Se] = SN(E), ne), {}), { setup: x, read: b, resolveKeyframes: R, preUpdate: D, update: M, preRender: A, render: j, postRender: q } = h, re = () => {
    const ne = Cs.useManualTiming ? g.timestamp : performance.now();
    c = !1, Cs.useManualTiming || (g.delta = p ? 1e3 / 60 : Math.max(Math.min(ne - g.timestamp, CN), 1)), g.timestamp = ne, g.isProcessing = !0, x.process(g), b.process(g), R.process(g), D.process(g), M.process(g), A.process(g), j.process(g), q.process(g), g.isProcessing = !1, c && l && (p = !1, a(re));
  }, ie = () => {
    c = !0, p = !0, g.isProcessing || a(re);
  };
  return { schedule: lg.reduce((ne, Se) => {
    const ae = h[Se];
    return ne[Se] = (Re, xe = !1, le = !1) => (c || ie(), ae.schedule(Re, xe, le)), ne;
  }, {}), cancel: (ne) => {
    for (let Se = 0; Se < lg.length; Se++)
      h[lg[Se]].cancel(ne);
  }, state: g, steps: h };
}
const { schedule: xn, cancel: Es, state: Zr, steps: IC } = /* @__PURE__ */ H1(typeof requestAnimationFrame < "u" ? requestAnimationFrame : Ja, !0);
let dg;
function EN() {
  dg = void 0;
}
const na = {
  now: () => (dg === void 0 && na.set(Zr.isProcessing || Cs.useManualTiming ? Zr.timestamp : performance.now()), dg),
  set: (a) => {
    dg = a, queueMicrotask(EN);
  }
}, I1 = (a) => (l) => typeof l == "string" && l.startsWith(a), Y1 = /* @__PURE__ */ I1("--"), TN = /* @__PURE__ */ I1("var(--"), YE = (a) => TN(a) ? bN.test(a.split("/*")[0].trim()) : !1, bN = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu, zd = {
  test: (a) => typeof a == "number",
  parse: parseFloat,
  transform: (a) => a
}, Jh = {
  ...zd,
  transform: (a) => gs(0, 1, a)
}, sg = {
  ...zd,
  default: 1
}, Qh = (a) => Math.round(a * 1e5) / 1e5, $E = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function xN(a) {
  return a == null;
}
const wN = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, WE = (a, l) => (c) => !!(typeof c == "string" && wN.test(c) && c.startsWith(a) || l && !xN(c) && Object.prototype.hasOwnProperty.call(c, l)), $1 = (a, l, c) => (p) => {
  if (typeof p != "string")
    return p;
  const [g, E, h, x] = p.match($E);
  return {
    [a]: parseFloat(g),
    [l]: parseFloat(E),
    [c]: parseFloat(h),
    alpha: x !== void 0 ? parseFloat(x) : 1
  };
}, RN = (a) => gs(0, 255, a), YC = {
  ...zd,
  transform: (a) => Math.round(RN(a))
}, jc = {
  test: /* @__PURE__ */ WE("rgb", "red"),
  parse: /* @__PURE__ */ $1("red", "green", "blue"),
  transform: ({ red: a, green: l, blue: c, alpha: p = 1 }) => "rgba(" + YC.transform(a) + ", " + YC.transform(l) + ", " + YC.transform(c) + ", " + Qh(Jh.transform(p)) + ")"
};
function kN(a) {
  let l = "", c = "", p = "", g = "";
  return a.length > 5 ? (l = a.substring(1, 3), c = a.substring(3, 5), p = a.substring(5, 7), g = a.substring(7, 9)) : (l = a.substring(1, 2), c = a.substring(2, 3), p = a.substring(3, 4), g = a.substring(4, 5), l += l, c += c, p += p, g += g), {
    red: parseInt(l, 16),
    green: parseInt(c, 16),
    blue: parseInt(p, 16),
    alpha: g ? parseInt(g, 16) / 255 : 1
  };
}
const fE = {
  test: /* @__PURE__ */ WE("#"),
  parse: kN,
  transform: jc.transform
}, am = /* @__NO_SIDE_EFFECTS__ */ (a) => ({
  test: (l) => typeof l == "string" && l.endsWith(a) && l.split(" ").length === 1,
  parse: parseFloat,
  transform: (l) => `${l}${a}`
}), Du = /* @__PURE__ */ am("deg"), wl = /* @__PURE__ */ am("%"), ct = /* @__PURE__ */ am("px"), DN = /* @__PURE__ */ am("vh"), _N = /* @__PURE__ */ am("vw"), aR = {
  ...wl,
  parse: (a) => wl.parse(a) / 100,
  transform: (a) => wl.transform(a * 100)
}, Dd = {
  test: /* @__PURE__ */ WE("hsl", "hue"),
  parse: /* @__PURE__ */ $1("hue", "saturation", "lightness"),
  transform: ({ hue: a, saturation: l, lightness: c, alpha: p = 1 }) => "hsla(" + Math.round(a) + ", " + wl.transform(Qh(l)) + ", " + wl.transform(Qh(c)) + ", " + Qh(Jh.transform(p)) + ")"
}, ur = {
  test: (a) => jc.test(a) || fE.test(a) || Dd.test(a),
  parse: (a) => jc.test(a) ? jc.parse(a) : Dd.test(a) ? Dd.parse(a) : fE.parse(a),
  transform: (a) => typeof a == "string" ? a : a.hasOwnProperty("red") ? jc.transform(a) : Dd.transform(a),
  getAnimatableNone: (a) => {
    const l = ur.parse(a);
    return l.alpha = 0, ur.transform(l);
  }
}, MN = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function ON(a) {
  var l, c;
  return isNaN(a) && typeof a == "string" && (((l = a.match($E)) == null ? void 0 : l.length) || 0) + (((c = a.match(MN)) == null ? void 0 : c.length) || 0) > 0;
}
const W1 = "number", G1 = "color", AN = "var", LN = "var(", oR = "${}", NN = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function em(a) {
  const l = a.toString(), c = [], p = {
    color: [],
    number: [],
    var: []
  }, g = [];
  let E = 0;
  const x = l.replace(NN, (b) => (ur.test(b) ? (p.color.push(E), g.push(G1), c.push(ur.parse(b))) : b.startsWith(LN) ? (p.var.push(E), g.push(AN), c.push(b)) : (p.number.push(E), g.push(W1), c.push(parseFloat(b))), ++E, oR)).split(oR);
  return { values: c, split: x, indexes: p, types: g };
}
function K1(a) {
  return em(a).values;
}
function Q1(a) {
  const { split: l, types: c } = em(a), p = l.length;
  return (g) => {
    let E = "";
    for (let h = 0; h < p; h++)
      if (E += l[h], g[h] !== void 0) {
        const x = c[h];
        x === W1 ? E += Qh(g[h]) : x === G1 ? E += ur.transform(g[h]) : E += g[h];
      }
    return E;
  };
}
const PN = (a) => typeof a == "number" ? 0 : ur.test(a) ? ur.getAnimatableNone(a) : a;
function VN(a) {
  const l = K1(a);
  return Q1(a)(l.map(PN));
}
const _u = {
  test: ON,
  parse: K1,
  createTransformer: Q1,
  getAnimatableNone: VN
};
function $C(a, l, c) {
  return c < 0 && (c += 1), c > 1 && (c -= 1), c < 1 / 6 ? a + (l - a) * 6 * c : c < 1 / 2 ? l : c < 2 / 3 ? a + (l - a) * (2 / 3 - c) * 6 : a;
}
function zN({ hue: a, saturation: l, lightness: c, alpha: p }) {
  a /= 360, l /= 100, c /= 100;
  let g = 0, E = 0, h = 0;
  if (!l)
    g = E = h = c;
  else {
    const x = c < 0.5 ? c * (1 + l) : c + l - c * l, b = 2 * c - x;
    g = $C(b, x, a + 1 / 3), E = $C(b, x, a), h = $C(b, x, a - 1 / 3);
  }
  return {
    red: Math.round(g * 255),
    green: Math.round(E * 255),
    blue: Math.round(h * 255),
    alpha: p
  };
}
function vg(a, l) {
  return (c) => c > 0 ? l : a;
}
const Pn = (a, l, c) => a + (l - a) * c, WC = (a, l, c) => {
  const p = a * a, g = c * (l * l - p) + p;
  return g < 0 ? 0 : Math.sqrt(g);
}, UN = [fE, jc, Dd], FN = (a) => UN.find((l) => l.test(a));
function lR(a) {
  const l = FN(a);
  if (Vd(!!l, `'${a}' is not an animatable color. Use the equivalent color code instead.`, "color-not-animatable"), !l)
    return !1;
  let c = l.parse(a);
  return l === Dd && (c = zN(c)), c;
}
const sR = (a, l) => {
  const c = lR(a), p = lR(l);
  if (!c || !p)
    return vg(a, l);
  const g = { ...c };
  return (E) => (g.red = WC(c.red, p.red, E), g.green = WC(c.green, p.green, E), g.blue = WC(c.blue, p.blue, E), g.alpha = Pn(c.alpha, p.alpha, E), jc.transform(g));
}, dE = /* @__PURE__ */ new Set(["none", "hidden"]);
function jN(a, l) {
  return dE.has(a) ? (c) => c <= 0 ? a : l : (c) => c >= 1 ? l : a;
}
function BN(a, l) {
  return (c) => Pn(a, l, c);
}
function GE(a) {
  return typeof a == "number" ? BN : typeof a == "string" ? YE(a) ? vg : ur.test(a) ? sR : YN : Array.isArray(a) ? X1 : typeof a == "object" ? ur.test(a) ? sR : HN : vg;
}
function X1(a, l) {
  const c = [...a], p = c.length, g = a.map((E, h) => GE(E)(E, l[h]));
  return (E) => {
    for (let h = 0; h < p; h++)
      c[h] = g[h](E);
    return c;
  };
}
function HN(a, l) {
  const c = { ...a, ...l }, p = {};
  for (const g in c)
    a[g] !== void 0 && l[g] !== void 0 && (p[g] = GE(a[g])(a[g], l[g]));
  return (g) => {
    for (const E in p)
      c[E] = p[E](g);
    return c;
  };
}
function IN(a, l) {
  const c = [], p = { color: 0, var: 0, number: 0 };
  for (let g = 0; g < l.values.length; g++) {
    const E = l.types[g], h = a.indexes[E][p[E]], x = a.values[h] ?? 0;
    c[g] = x, p[E]++;
  }
  return c;
}
const YN = (a, l) => {
  const c = _u.createTransformer(l), p = em(a), g = em(l);
  return p.indexes.var.length === g.indexes.var.length && p.indexes.color.length === g.indexes.color.length && p.indexes.number.length >= g.indexes.number.length ? dE.has(a) && !g.values.length || dE.has(l) && !p.values.length ? jN(a, l) : rm(X1(IN(p, g), g.values), c) : (Vd(!0, `Complex values '${a}' and '${l}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`, "complex-values-different"), vg(a, l));
};
function q1(a, l, c) {
  return typeof a == "number" && typeof l == "number" && typeof c == "number" ? Pn(a, l, c) : GE(a)(a, l);
}
const $N = (a) => {
  const l = ({ timestamp: c }) => a(c);
  return {
    start: (c = !0) => xn.update(l, c),
    stop: () => Es(l),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => Zr.isProcessing ? Zr.timestamp : na.now()
  };
}, Z1 = (a, l, c = 10) => {
  let p = "";
  const g = Math.max(Math.round(l / c), 2);
  for (let E = 0; E < g; E++)
    p += Math.round(a(E / (g - 1)) * 1e4) / 1e4 + ", ";
  return `linear(${p.substring(0, p.length - 2)})`;
}, yg = 2e4;
function KE(a) {
  let l = 0;
  const c = 50;
  let p = a.next(l);
  for (; !p.done && l < yg; )
    l += c, p = a.next(l);
  return l >= yg ? 1 / 0 : l;
}
function WN(a, l = 100, c) {
  const p = c({ ...a, keyframes: [0, l] }), g = Math.min(KE(p), yg);
  return {
    type: "keyframes",
    ease: (E) => p.next(g * E).value / l,
    duration: /* @__PURE__ */ Za(g)
  };
}
const GN = 5;
function J1(a, l, c) {
  const p = Math.max(l - GN, 0);
  return O1(c - a(p), l - p);
}
const Nn = {
  // Default spring physics
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocity: 0,
  // Default duration/bounce-based options
  duration: 800,
  // in ms
  bounce: 0.3,
  visualDuration: 0.3,
  // in seconds
  // Rest thresholds
  restSpeed: {
    granular: 0.01,
    default: 2
  },
  restDelta: {
    granular: 5e-3,
    default: 0.5
  },
  // Limits
  minDuration: 0.01,
  // in seconds
  maxDuration: 10,
  // in seconds
  minDamping: 0.05,
  maxDamping: 1
}, GC = 1e-3;
function KN({ duration: a = Nn.duration, bounce: l = Nn.bounce, velocity: c = Nn.velocity, mass: p = Nn.mass }) {
  let g, E;
  Vd(a <= /* @__PURE__ */ zo(Nn.maxDuration), "Spring duration must be 10 seconds or less", "spring-duration-limit");
  let h = 1 - l;
  h = gs(Nn.minDamping, Nn.maxDamping, h), a = gs(Nn.minDuration, Nn.maxDuration, /* @__PURE__ */ Za(a)), h < 1 ? (g = (R) => {
    const D = R * h, M = D * a, A = D - c, j = pE(R, h), q = Math.exp(-M);
    return GC - A / j * q;
  }, E = (R) => {
    const M = R * h * a, A = M * c + c, j = Math.pow(h, 2) * Math.pow(R, 2) * a, q = Math.exp(-M), re = pE(Math.pow(R, 2), h);
    return (-g(R) + GC > 0 ? -1 : 1) * ((A - j) * q) / re;
  }) : (g = (R) => {
    const D = Math.exp(-R * a), M = (R - c) * a + 1;
    return -GC + D * M;
  }, E = (R) => {
    const D = Math.exp(-R * a), M = (c - R) * (a * a);
    return D * M;
  });
  const x = 5 / a, b = XN(g, E, x);
  if (a = /* @__PURE__ */ zo(a), isNaN(b))
    return {
      stiffness: Nn.stiffness,
      damping: Nn.damping,
      duration: a
    };
  {
    const R = Math.pow(b, 2) * p;
    return {
      stiffness: R,
      damping: h * 2 * Math.sqrt(p * R),
      duration: a
    };
  }
}
const QN = 12;
function XN(a, l, c) {
  let p = c;
  for (let g = 1; g < QN; g++)
    p = p - a(p) / l(p);
  return p;
}
function pE(a, l) {
  return a * Math.sqrt(1 - l * l);
}
const qN = ["duration", "bounce"], ZN = ["stiffness", "damping", "mass"];
function uR(a, l) {
  return l.some((c) => a[c] !== void 0);
}
function JN(a) {
  let l = {
    velocity: Nn.velocity,
    stiffness: Nn.stiffness,
    damping: Nn.damping,
    mass: Nn.mass,
    isResolvedFromDuration: !1,
    ...a
  };
  if (!uR(a, ZN) && uR(a, qN))
    if (a.visualDuration) {
      const c = a.visualDuration, p = 2 * Math.PI / (c * 1.2), g = p * p, E = 2 * gs(0.05, 1, 1 - (a.bounce || 0)) * Math.sqrt(g);
      l = {
        ...l,
        mass: Nn.mass,
        stiffness: g,
        damping: E
      };
    } else {
      const c = KN(a);
      l = {
        ...l,
        ...c,
        mass: Nn.mass
      }, l.isResolvedFromDuration = !0;
    }
  return l;
}
function gg(a = Nn.visualDuration, l = Nn.bounce) {
  const c = typeof a != "object" ? {
    visualDuration: a,
    keyframes: [0, 1],
    bounce: l
  } : a;
  let { restSpeed: p, restDelta: g } = c;
  const E = c.keyframes[0], h = c.keyframes[c.keyframes.length - 1], x = { done: !1, value: E }, { stiffness: b, damping: R, mass: D, duration: M, velocity: A, isResolvedFromDuration: j } = JN({
    ...c,
    velocity: -/* @__PURE__ */ Za(c.velocity || 0)
  }), q = A || 0, re = R / (2 * Math.sqrt(b * D)), ie = h - E, ue = /* @__PURE__ */ Za(Math.sqrt(b / D)), he = Math.abs(ie) < 5;
  p || (p = he ? Nn.restSpeed.granular : Nn.restSpeed.default), g || (g = he ? Nn.restDelta.granular : Nn.restDelta.default);
  let ne;
  if (re < 1) {
    const ae = pE(ue, re);
    ne = (Re) => {
      const xe = Math.exp(-re * ue * Re);
      return h - xe * ((q + re * ue * ie) / ae * Math.sin(ae * Re) + ie * Math.cos(ae * Re));
    };
  } else if (re === 1)
    ne = (ae) => h - Math.exp(-ue * ae) * (ie + (q + ue * ie) * ae);
  else {
    const ae = ue * Math.sqrt(re * re - 1);
    ne = (Re) => {
      const xe = Math.exp(-re * ue * Re), le = Math.min(ae * Re, 300);
      return h - xe * ((q + re * ue * ie) * Math.sinh(le) + ae * ie * Math.cosh(le)) / ae;
    };
  }
  const Se = {
    calculatedDuration: j && M || null,
    next: (ae) => {
      const Re = ne(ae);
      if (j)
        x.done = ae >= M;
      else {
        let xe = ae === 0 ? q : 0;
        re < 1 && (xe = ae === 0 ? /* @__PURE__ */ zo(q) : J1(ne, ae, Re));
        const le = Math.abs(xe) <= p, Xe = Math.abs(h - Re) <= g;
        x.done = le && Xe;
      }
      return x.value = x.done ? h : Re, x;
    },
    toString: () => {
      const ae = Math.min(KE(Se), yg), Re = Z1((xe) => Se.next(ae * xe).value, ae, 30);
      return ae + "ms " + Re;
    },
    toTransition: () => {
    }
  };
  return Se;
}
gg.applyToOptions = (a) => {
  const l = WN(a, 100, gg);
  return a.ease = l.ease, a.duration = /* @__PURE__ */ zo(l.duration), a.type = "keyframes", a;
};
function hE({ keyframes: a, velocity: l = 0, power: c = 0.8, timeConstant: p = 325, bounceDamping: g = 10, bounceStiffness: E = 500, modifyTarget: h, min: x, max: b, restDelta: R = 0.5, restSpeed: D }) {
  const M = a[0], A = {
    done: !1,
    value: M
  }, j = (le) => x !== void 0 && le < x || b !== void 0 && le > b, q = (le) => x === void 0 ? b : b === void 0 || Math.abs(x - le) < Math.abs(b - le) ? x : b;
  let re = c * l;
  const ie = M + re, ue = h === void 0 ? ie : h(ie);
  ue !== ie && (re = ue - M);
  const he = (le) => -re * Math.exp(-le / p), ne = (le) => ue + he(le), Se = (le) => {
    const Xe = he(le), yt = ne(le);
    A.done = Math.abs(Xe) <= R, A.value = A.done ? ue : yt;
  };
  let ae, Re;
  const xe = (le) => {
    j(A.value) && (ae = le, Re = gg({
      keyframes: [A.value, q(A.value)],
      velocity: J1(ne, le, A.value),
      // TODO: This should be passing * 1000
      damping: g,
      stiffness: E,
      restDelta: R,
      restSpeed: D
    }));
  };
  return xe(0), {
    calculatedDuration: null,
    next: (le) => {
      let Xe = !1;
      return !Re && ae === void 0 && (Xe = !0, Se(le), xe(le)), ae !== void 0 && le >= ae ? Re.next(le - ae) : (!Xe && Se(le), A);
    }
  };
}
function eP(a, l, c) {
  const p = [], g = c || Cs.mix || q1, E = a.length - 1;
  for (let h = 0; h < E; h++) {
    let x = g(a[h], a[h + 1]);
    if (l) {
      const b = Array.isArray(l) ? l[h] || Ja : l;
      x = rm(b, x);
    }
    p.push(x);
  }
  return p;
}
function tP(a, l, { clamp: c = !0, ease: p, mixer: g } = {}) {
  const E = a.length;
  if (Ss(E === l.length, "Both input and output ranges must be the same length", "range-length"), E === 1)
    return () => l[0];
  if (E === 2 && l[0] === l[1])
    return () => l[1];
  const h = a[0] === a[1];
  a[0] > a[E - 1] && (a = [...a].reverse(), l = [...l].reverse());
  const x = eP(l, p, g), b = x.length, R = (D) => {
    if (h && D < a[0])
      return l[0];
    let M = 0;
    if (b > 1)
      for (; M < a.length - 2 && !(D < a[M + 1]); M++)
        ;
    const A = /* @__PURE__ */ Zh(a[M], a[M + 1], D);
    return x[M](A);
  };
  return c ? (D) => R(gs(a[0], a[E - 1], D)) : R;
}
function nP(a, l) {
  const c = a[a.length - 1];
  for (let p = 1; p <= l; p++) {
    const g = /* @__PURE__ */ Zh(0, l, p);
    a.push(Pn(c, 1, g));
  }
}
function rP(a) {
  const l = [0];
  return nP(l, a.length - 1), l;
}
function iP(a, l) {
  return a.map((c) => c * l);
}
function aP(a, l) {
  return a.map(() => l || j1).splice(0, a.length - 1);
}
function _d({ duration: a = 300, keyframes: l, times: c, ease: p = "easeInOut" }) {
  const g = yN(p) ? p.map(iR) : iR(p), E = {
    done: !1,
    value: l[0]
  }, h = iP(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    c && c.length === l.length ? c : rP(l),
    a
  ), x = tP(h, l, {
    ease: Array.isArray(g) ? g : aP(l, g)
  });
  return {
    calculatedDuration: a,
    next: (b) => (E.value = x(b), E.done = b >= a, E)
  };
}
const oP = (a) => a !== null;
function QE(a, { repeat: l, repeatType: c = "loop" }, p, g = 1) {
  const E = a.filter(oP), x = g < 0 || l && c !== "loop" && l % 2 === 1 ? 0 : E.length - 1;
  return !x || p === void 0 ? E[x] : p;
}
const lP = {
  decay: hE,
  inertia: hE,
  tween: _d,
  keyframes: _d,
  spring: gg
};
function ek(a) {
  typeof a.type == "string" && (a.type = lP[a.type]);
}
class XE {
  constructor() {
    this.updateFinished();
  }
  get finished() {
    return this._finished;
  }
  updateFinished() {
    this._finished = new Promise((l) => {
      this.resolve = l;
    });
  }
  notifyFinished() {
    this.resolve();
  }
  /**
   * Allows the animation to be awaited.
   *
   * @deprecated Use `finished` instead.
   */
  then(l, c) {
    return this.finished.then(l, c);
  }
}
const sP = (a) => a / 100;
class qE extends XE {
  constructor(l) {
    super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.stop = () => {
      var p, g;
      const { motionValue: c } = this.options;
      c && c.updatedAt !== na.now() && this.tick(na.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), (g = (p = this.options).onStop) == null || g.call(p));
    }, this.options = l, this.initAnimation(), this.play(), l.autoplay === !1 && this.pause();
  }
  initAnimation() {
    const { options: l } = this;
    ek(l);
    const { type: c = _d, repeat: p = 0, repeatDelay: g = 0, repeatType: E, velocity: h = 0 } = l;
    let { keyframes: x } = l;
    const b = c || _d;
    process.env.NODE_ENV !== "production" && b !== _d && Ss(x.length <= 2, `Only two keyframes currently supported with spring and inertia animations. Trying to animate ${x}`, "spring-two-frames"), b !== _d && typeof x[0] != "number" && (this.mixKeyframes = rm(sP, q1(x[0], x[1])), x = [0, 100]);
    const R = b({ ...l, keyframes: x });
    E === "mirror" && (this.mirroredGenerator = b({
      ...l,
      keyframes: [...x].reverse(),
      velocity: -h
    })), R.calculatedDuration === null && (R.calculatedDuration = KE(R));
    const { calculatedDuration: D } = R;
    this.calculatedDuration = D, this.resolvedDuration = D + g, this.totalDuration = this.resolvedDuration * (p + 1) - g, this.generator = R;
  }
  updateTime(l) {
    const c = Math.round(l - this.startTime) * this.playbackSpeed;
    this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = c;
  }
  tick(l, c = !1) {
    const { generator: p, totalDuration: g, mixKeyframes: E, mirroredGenerator: h, resolvedDuration: x, calculatedDuration: b } = this;
    if (this.startTime === null)
      return p.next(0);
    const { delay: R = 0, keyframes: D, repeat: M, repeatType: A, repeatDelay: j, type: q, onUpdate: re, finalKeyframe: ie } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, l) : this.speed < 0 && (this.startTime = Math.min(l - g / this.speed, this.startTime)), c ? this.currentTime = l : this.updateTime(l);
    const ue = this.currentTime - R * (this.playbackSpeed >= 0 ? 1 : -1), he = this.playbackSpeed >= 0 ? ue < 0 : ue > g;
    this.currentTime = Math.max(ue, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = g);
    let ne = this.currentTime, Se = p;
    if (M) {
      const le = Math.min(this.currentTime, g) / x;
      let Xe = Math.floor(le), yt = le % 1;
      !yt && le >= 1 && (yt = 1), yt === 1 && Xe--, Xe = Math.min(Xe, M + 1), !!(Xe % 2) && (A === "reverse" ? (yt = 1 - yt, j && (yt -= j / x)) : A === "mirror" && (Se = h)), ne = gs(0, 1, yt) * x;
    }
    const ae = he ? { done: !1, value: D[0] } : Se.next(ne);
    E && (ae.value = E(ae.value));
    let { done: Re } = ae;
    !he && b !== null && (Re = this.playbackSpeed >= 0 ? this.currentTime >= g : this.currentTime <= 0);
    const xe = this.holdTime === null && (this.state === "finished" || this.state === "running" && Re);
    return xe && q !== hE && (ae.value = QE(D, this.options, ie, this.speed)), re && re(ae.value), xe && this.finish(), ae;
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(l, c) {
    return this.finished.then(l, c);
  }
  get duration() {
    return /* @__PURE__ */ Za(this.calculatedDuration);
  }
  get iterationDuration() {
    const { delay: l = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ Za(l);
  }
  get time() {
    return /* @__PURE__ */ Za(this.currentTime);
  }
  set time(l) {
    var c;
    l = /* @__PURE__ */ zo(l), this.currentTime = l, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = l : this.driver && (this.startTime = this.driver.now() - l / this.playbackSpeed), (c = this.driver) == null || c.start(!1);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(l) {
    this.updateTime(na.now());
    const c = this.playbackSpeed !== l;
    this.playbackSpeed = l, c && (this.time = /* @__PURE__ */ Za(this.currentTime));
  }
  play() {
    var g, E;
    if (this.isStopped)
      return;
    const { driver: l = $N, startTime: c } = this.options;
    this.driver || (this.driver = l((h) => this.tick(h))), (E = (g = this.options).onPlay) == null || E.call(g);
    const p = this.driver.now();
    this.state === "finished" ? (this.updateFinished(), this.startTime = p) : this.holdTime !== null ? this.startTime = p - this.holdTime : this.startTime || (this.startTime = c ?? p), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
  }
  pause() {
    this.state = "paused", this.updateTime(na.now()), this.holdTime = this.currentTime;
  }
  complete() {
    this.state !== "running" && this.play(), this.state = "finished", this.holdTime = null;
  }
  finish() {
    var l, c;
    this.notifyFinished(), this.teardown(), this.state = "finished", (c = (l = this.options).onComplete) == null || c.call(l);
  }
  cancel() {
    var l, c;
    this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), (c = (l = this.options).onCancel) == null || c.call(l);
  }
  teardown() {
    this.state = "idle", this.stopDriver(), this.startTime = this.holdTime = null;
  }
  stopDriver() {
    this.driver && (this.driver.stop(), this.driver = void 0);
  }
  sample(l) {
    return this.startTime = 0, this.tick(l, !0);
  }
  attachTimeline(l) {
    var c;
    return this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear", this.initAnimation()), (c = this.driver) == null || c.stop(), l.observe(this);
  }
}
function uP(a) {
  for (let l = 1; l < a.length; l++)
    a[l] ?? (a[l] = a[l - 1]);
}
const Bc = (a) => a * 180 / Math.PI, mE = (a) => {
  const l = Bc(Math.atan2(a[1], a[0]));
  return vE(l);
}, cP = {
  x: 4,
  y: 5,
  translateX: 4,
  translateY: 5,
  scaleX: 0,
  scaleY: 3,
  scale: (a) => (Math.abs(a[0]) + Math.abs(a[3])) / 2,
  rotate: mE,
  rotateZ: mE,
  skewX: (a) => Bc(Math.atan(a[1])),
  skewY: (a) => Bc(Math.atan(a[2])),
  skew: (a) => (Math.abs(a[1]) + Math.abs(a[2])) / 2
}, vE = (a) => (a = a % 360, a < 0 && (a += 360), a), cR = mE, fR = (a) => Math.sqrt(a[0] * a[0] + a[1] * a[1]), dR = (a) => Math.sqrt(a[4] * a[4] + a[5] * a[5]), fP = {
  x: 12,
  y: 13,
  z: 14,
  translateX: 12,
  translateY: 13,
  translateZ: 14,
  scaleX: fR,
  scaleY: dR,
  scale: (a) => (fR(a) + dR(a)) / 2,
  rotateX: (a) => vE(Bc(Math.atan2(a[6], a[5]))),
  rotateY: (a) => vE(Bc(Math.atan2(-a[2], a[0]))),
  rotateZ: cR,
  rotate: cR,
  skewX: (a) => Bc(Math.atan(a[4])),
  skewY: (a) => Bc(Math.atan(a[1])),
  skew: (a) => (Math.abs(a[1]) + Math.abs(a[4])) / 2
};
function yE(a) {
  return a.includes("scale") ? 1 : 0;
}
function gE(a, l) {
  if (!a || a === "none")
    return yE(l);
  const c = a.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let p, g;
  if (c)
    p = fP, g = c;
  else {
    const x = a.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    p = cP, g = x;
  }
  if (!g)
    return yE(l);
  const E = p[l], h = g[1].split(",").map(pP);
  return typeof E == "function" ? E(h) : h[E];
}
const dP = (a, l) => {
  const { transform: c = "none" } = getComputedStyle(a);
  return gE(c, l);
};
function pP(a) {
  return parseFloat(a.trim());
}
const Ud = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
], Fd = new Set(Ud), pR = (a) => a === zd || a === ct, hP = /* @__PURE__ */ new Set(["x", "y", "z"]), mP = Ud.filter((a) => !hP.has(a));
function vP(a) {
  const l = [];
  return mP.forEach((c) => {
    const p = a.getValue(c);
    p !== void 0 && (l.push([c, p.get()]), p.set(c.startsWith("scale") ? 1 : 0));
  }), l;
}
const Hc = {
  // Dimensions
  width: ({ x: a }, { paddingLeft: l = "0", paddingRight: c = "0" }) => a.max - a.min - parseFloat(l) - parseFloat(c),
  height: ({ y: a }, { paddingTop: l = "0", paddingBottom: c = "0" }) => a.max - a.min - parseFloat(l) - parseFloat(c),
  top: (a, { top: l }) => parseFloat(l),
  left: (a, { left: l }) => parseFloat(l),
  bottom: ({ y: a }, { top: l }) => parseFloat(l) + (a.max - a.min),
  right: ({ x: a }, { left: l }) => parseFloat(l) + (a.max - a.min),
  // Transform
  x: (a, { transform: l }) => gE(l, "x"),
  y: (a, { transform: l }) => gE(l, "y")
};
Hc.translateX = Hc.x;
Hc.translateY = Hc.y;
const Ic = /* @__PURE__ */ new Set();
let SE = !1, CE = !1, EE = !1;
function tk() {
  if (CE) {
    const a = Array.from(Ic).filter((p) => p.needsMeasurement), l = new Set(a.map((p) => p.element)), c = /* @__PURE__ */ new Map();
    l.forEach((p) => {
      const g = vP(p);
      g.length && (c.set(p, g), p.render());
    }), a.forEach((p) => p.measureInitialState()), l.forEach((p) => {
      p.render();
      const g = c.get(p);
      g && g.forEach(([E, h]) => {
        var x;
        (x = p.getValue(E)) == null || x.set(h);
      });
    }), a.forEach((p) => p.measureEndState()), a.forEach((p) => {
      p.suspendedScrollY !== void 0 && window.scrollTo(0, p.suspendedScrollY);
    });
  }
  CE = !1, SE = !1, Ic.forEach((a) => a.complete(EE)), Ic.clear();
}
function nk() {
  Ic.forEach((a) => {
    a.readKeyframes(), a.needsMeasurement && (CE = !0);
  });
}
function yP() {
  EE = !0, nk(), tk(), EE = !1;
}
class ZE {
  constructor(l, c, p, g, E, h = !1) {
    this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...l], this.onComplete = c, this.name = p, this.motionValue = g, this.element = E, this.isAsync = h;
  }
  scheduleResolve() {
    this.state = "scheduled", this.isAsync ? (Ic.add(this), SE || (SE = !0, xn.read(nk), xn.resolveKeyframes(tk))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes: l, name: c, element: p, motionValue: g } = this;
    if (l[0] === null) {
      const E = g == null ? void 0 : g.get(), h = l[l.length - 1];
      if (E !== void 0)
        l[0] = E;
      else if (p && c) {
        const x = p.readValue(c, h);
        x != null && (l[0] = x);
      }
      l[0] === void 0 && (l[0] = h), g && E === void 0 && g.set(l[0]);
    }
    uP(l);
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete(l = !1) {
    this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, l), Ic.delete(this);
  }
  cancel() {
    this.state === "scheduled" && (Ic.delete(this), this.state = "pending");
  }
  resume() {
    this.state === "pending" && this.scheduleResolve();
  }
}
const gP = (a) => a.startsWith("--");
function SP(a, l, c) {
  gP(l) ? a.style.setProperty(l, c) : a.style[l] = c;
}
const CP = /* @__PURE__ */ FE(() => window.ScrollTimeline !== void 0), EP = {};
function TP(a, l) {
  const c = /* @__PURE__ */ FE(a);
  return () => EP[l] ?? c();
}
const rk = /* @__PURE__ */ TP(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing"), Kh = ([a, l, c, p]) => `cubic-bezier(${a}, ${l}, ${c}, ${p})`, hR = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ Kh([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ Kh([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ Kh([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ Kh([0.33, 1.53, 0.69, 0.99])
};
function ik(a, l) {
  if (a)
    return typeof a == "function" ? rk() ? Z1(a, l) : "ease-out" : B1(a) ? Kh(a) : Array.isArray(a) ? a.map((c) => ik(c, l) || hR.easeOut) : hR[a];
}
function bP(a, l, c, { delay: p = 0, duration: g = 300, repeat: E = 0, repeatType: h = "loop", ease: x = "easeOut", times: b } = {}, R = void 0) {
  const D = {
    [l]: c
  };
  b && (D.offset = b);
  const M = ik(x, g);
  Array.isArray(M) && (D.easing = M);
  const A = {
    delay: p,
    duration: g,
    easing: Array.isArray(M) ? "linear" : M,
    fill: "both",
    iterations: E + 1,
    direction: h === "reverse" ? "alternate" : "normal"
  };
  return R && (A.pseudoElement = R), a.animate(D, A);
}
function ak(a) {
  return typeof a == "function" && "applyToOptions" in a;
}
function xP({ type: a, ...l }) {
  return ak(a) && rk() ? a.applyToOptions(l) : (l.duration ?? (l.duration = 300), l.ease ?? (l.ease = "easeOut"), l);
}
class wP extends XE {
  constructor(l) {
    if (super(), this.finishedTime = null, this.isStopped = !1, !l)
      return;
    const { element: c, name: p, keyframes: g, pseudoElement: E, allowFlatten: h = !1, finalKeyframe: x, onComplete: b } = l;
    this.isPseudoElement = !!E, this.allowFlatten = h, this.options = l, Ss(typeof l.type != "string", `Mini animate() doesn't support "type" as a string.`, "mini-spring");
    const R = xP(l);
    this.animation = bP(c, p, g, R, E), R.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
      if (this.finishedTime = this.time, !E) {
        const D = QE(g, this.options, x, this.speed);
        this.updateMotionValue ? this.updateMotionValue(D) : SP(c, p, D), this.animation.cancel();
      }
      b == null || b(), this.notifyFinished();
    };
  }
  play() {
    this.isStopped || (this.animation.play(), this.state === "finished" && this.updateFinished());
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    var l, c;
    (c = (l = this.animation).finish) == null || c.call(l);
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch {
    }
  }
  stop() {
    if (this.isStopped)
      return;
    this.isStopped = !0;
    const { state: l } = this;
    l === "idle" || l === "finished" || (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || this.cancel());
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * In this method, we commit styles back to the DOM before cancelling
   * the animation.
   *
   * This is designed to be overridden by NativeAnimationExtended, which
   * will create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to also correctly calculate velocity for any subsequent animation
   * while deferring the commit until the next animation frame.
   */
  commitStyles() {
    var l, c;
    this.isPseudoElement || (c = (l = this.animation).commitStyles) == null || c.call(l);
  }
  get duration() {
    var c, p;
    const l = ((p = (c = this.animation.effect) == null ? void 0 : c.getComputedTiming) == null ? void 0 : p.call(c).duration) || 0;
    return /* @__PURE__ */ Za(Number(l));
  }
  get iterationDuration() {
    const { delay: l = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ Za(l);
  }
  get time() {
    return /* @__PURE__ */ Za(Number(this.animation.currentTime) || 0);
  }
  set time(l) {
    this.finishedTime = null, this.animation.currentTime = /* @__PURE__ */ zo(l);
  }
  /**
   * The playback speed of the animation.
   * 1 = normal speed, 2 = double speed, 0.5 = half speed.
   */
  get speed() {
    return this.animation.playbackRate;
  }
  set speed(l) {
    l < 0 && (this.finishedTime = null), this.animation.playbackRate = l;
  }
  get state() {
    return this.finishedTime !== null ? "finished" : this.animation.playState;
  }
  get startTime() {
    return Number(this.animation.startTime);
  }
  set startTime(l) {
    this.animation.startTime = l;
  }
  /**
   * Attaches a timeline to the animation, for instance the `ScrollTimeline`.
   */
  attachTimeline({ timeline: l, observe: c }) {
    var p;
    return this.allowFlatten && ((p = this.animation.effect) == null || p.updateTiming({ easing: "linear" })), this.animation.onfinish = null, l && CP() ? (this.animation.timeline = l, Ja) : c(this);
  }
}
const ok = {
  anticipate: z1,
  backInOut: V1,
  circInOut: F1
};
function RP(a) {
  return a in ok;
}
function kP(a) {
  typeof a.ease == "string" && RP(a.ease) && (a.ease = ok[a.ease]);
}
const mR = 10;
class DP extends wP {
  constructor(l) {
    kP(l), ek(l), super(l), l.startTime && (this.startTime = l.startTime), this.options = l;
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * Rather than read commited styles back out of the DOM, we can
   * create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to calculate velocity for any subsequent animation.
   */
  updateMotionValue(l) {
    const { motionValue: c, onUpdate: p, onComplete: g, element: E, ...h } = this.options;
    if (!c)
      return;
    if (l !== void 0) {
      c.set(l);
      return;
    }
    const x = new qE({
      ...h,
      autoplay: !1
    }), b = /* @__PURE__ */ zo(this.finishedTime ?? this.time);
    c.setWithVelocity(x.sample(b - mR).value, x.sample(b).value, mR), x.stop();
  }
}
const vR = (a, l) => l === "zIndex" ? !1 : !!(typeof a == "number" || Array.isArray(a) || typeof a == "string" && // It's animatable if we have a string
(_u.test(a) || a === "0") && // And it contains numbers and/or colors
!a.startsWith("url("));
function _P(a) {
  const l = a[0];
  if (a.length === 1)
    return !0;
  for (let c = 0; c < a.length; c++)
    if (a[c] !== l)
      return !0;
}
function MP(a, l, c, p) {
  const g = a[0];
  if (g === null)
    return !1;
  if (l === "display" || l === "visibility")
    return !0;
  const E = a[a.length - 1], h = vR(g, l), x = vR(E, l);
  return Vd(h === x, `You are trying to animate ${l} from "${g}" to "${E}". "${h ? E : g}" is not an animatable value.`, "value-not-animatable"), !h || !x ? !1 : _P(a) || (c === "spring" || ak(c)) && p;
}
function TE(a) {
  a.duration = 0, a.type = "keyframes";
}
const OP = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Could be re-enabled now we have support for linear() easing
  // "background-color"
]), AP = /* @__PURE__ */ FE(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function LP(a) {
  var D;
  const { motionValue: l, name: c, repeatDelay: p, repeatType: g, damping: E, type: h } = a;
  if (!(((D = l == null ? void 0 : l.owner) == null ? void 0 : D.current) instanceof HTMLElement))
    return !1;
  const { onUpdate: b, transformTemplate: R } = l.owner.getProps();
  return AP() && c && OP.has(c) && (c !== "transform" || !R) && /**
   * If we're outputting values to onUpdate then we can't use WAAPI as there's
   * no way to read the value from WAAPI every frame.
   */
  !b && !p && g !== "mirror" && E !== 0 && h !== "inertia";
}
const NP = 40;
class PP extends XE {
  constructor({ autoplay: l = !0, delay: c = 0, type: p = "keyframes", repeat: g = 0, repeatDelay: E = 0, repeatType: h = "loop", keyframes: x, name: b, motionValue: R, element: D, ...M }) {
    var q;
    super(), this.stop = () => {
      var re, ie;
      this._animation && (this._animation.stop(), (re = this.stopTimeline) == null || re.call(this)), (ie = this.keyframeResolver) == null || ie.cancel();
    }, this.createdAt = na.now();
    const A = {
      autoplay: l,
      delay: c,
      type: p,
      repeat: g,
      repeatDelay: E,
      repeatType: h,
      name: b,
      motionValue: R,
      element: D,
      ...M
    }, j = (D == null ? void 0 : D.KeyframeResolver) || ZE;
    this.keyframeResolver = new j(x, (re, ie, ue) => this.onKeyframesResolved(re, ie, A, !ue), b, R, D), (q = this.keyframeResolver) == null || q.scheduleResolve();
  }
  onKeyframesResolved(l, c, p, g) {
    this.keyframeResolver = void 0;
    const { name: E, type: h, velocity: x, delay: b, isHandoff: R, onUpdate: D } = p;
    this.resolvedAt = na.now(), MP(l, E, h, x) || ((Cs.instantAnimations || !b) && (D == null || D(QE(l, p, c))), l[0] = l[l.length - 1], TE(p), p.repeat = 0);
    const A = {
      startTime: g ? this.resolvedAt ? this.resolvedAt - this.createdAt > NP ? this.resolvedAt : this.createdAt : this.createdAt : void 0,
      finalKeyframe: c,
      ...p,
      keyframes: l
    }, j = !R && LP(A) ? new DP({
      ...A,
      element: A.motionValue.owner.current
    }) : new qE(A);
    j.finished.then(() => this.notifyFinished()).catch(Ja), this.pendingTimeline && (this.stopTimeline = j.attachTimeline(this.pendingTimeline), this.pendingTimeline = void 0), this._animation = j;
  }
  get finished() {
    return this._animation ? this.animation.finished : this._finished;
  }
  then(l, c) {
    return this.finished.finally(l).then(() => {
    });
  }
  get animation() {
    var l;
    return this._animation || ((l = this.keyframeResolver) == null || l.resume(), yP()), this._animation;
  }
  get duration() {
    return this.animation.duration;
  }
  get iterationDuration() {
    return this.animation.iterationDuration;
  }
  get time() {
    return this.animation.time;
  }
  set time(l) {
    this.animation.time = l;
  }
  get speed() {
    return this.animation.speed;
  }
  get state() {
    return this.animation.state;
  }
  set speed(l) {
    this.animation.speed = l;
  }
  get startTime() {
    return this.animation.startTime;
  }
  attachTimeline(l) {
    return this._animation ? this.stopTimeline = this.animation.attachTimeline(l) : this.pendingTimeline = l, () => this.stop();
  }
  play() {
    this.animation.play();
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.complete();
  }
  cancel() {
    var l;
    this._animation && this.animation.cancel(), (l = this.keyframeResolver) == null || l.cancel();
  }
}
const VP = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function zP(a) {
  const l = VP.exec(a);
  if (!l)
    return [,];
  const [, c, p, g] = l;
  return [`--${c ?? p}`, g];
}
const UP = 4;
function lk(a, l, c = 1) {
  Ss(c <= UP, `Max CSS variable fallback depth detected in property "${a}". This may indicate a circular fallback dependency.`, "max-css-var-depth");
  const [p, g] = zP(a);
  if (!p)
    return;
  const E = window.getComputedStyle(l).getPropertyValue(p);
  if (E) {
    const h = E.trim();
    return D1(h) ? parseFloat(h) : h;
  }
  return YE(g) ? lk(g, l, c + 1) : g;
}
function JE(a, l) {
  return (a == null ? void 0 : a[l]) ?? (a == null ? void 0 : a.default) ?? a;
}
const sk = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...Ud
]), FP = {
  test: (a) => a === "auto",
  parse: (a) => a
}, uk = (a) => (l) => l.test(a), ck = [zd, ct, wl, Du, _N, DN, FP], yR = (a) => ck.find(uk(a));
function jP(a) {
  return typeof a == "number" ? a === 0 : a !== null ? a === "none" || a === "0" || M1(a) : !0;
}
const BP = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function HP(a) {
  const [l, c] = a.slice(0, -1).split("(");
  if (l === "drop-shadow")
    return a;
  const [p] = c.match($E) || [];
  if (!p)
    return a;
  const g = c.replace(p, "");
  let E = BP.has(l) ? 1 : 0;
  return p !== c && (E *= 100), l + "(" + E + g + ")";
}
const IP = /\b([a-z-]*)\(.*?\)/gu, bE = {
  ..._u,
  getAnimatableNone: (a) => {
    const l = a.match(IP);
    return l ? l.map(HP).join(" ") : a;
  }
}, gR = {
  ...zd,
  transform: Math.round
}, YP = {
  rotate: Du,
  rotateX: Du,
  rotateY: Du,
  rotateZ: Du,
  scale: sg,
  scaleX: sg,
  scaleY: sg,
  scaleZ: sg,
  skew: Du,
  skewX: Du,
  skewY: Du,
  distance: ct,
  translateX: ct,
  translateY: ct,
  translateZ: ct,
  x: ct,
  y: ct,
  z: ct,
  perspective: ct,
  transformPerspective: ct,
  opacity: Jh,
  originX: aR,
  originY: aR,
  originZ: ct
}, eT = {
  // Border props
  borderWidth: ct,
  borderTopWidth: ct,
  borderRightWidth: ct,
  borderBottomWidth: ct,
  borderLeftWidth: ct,
  borderRadius: ct,
  radius: ct,
  borderTopLeftRadius: ct,
  borderTopRightRadius: ct,
  borderBottomRightRadius: ct,
  borderBottomLeftRadius: ct,
  // Positioning props
  width: ct,
  maxWidth: ct,
  height: ct,
  maxHeight: ct,
  top: ct,
  right: ct,
  bottom: ct,
  left: ct,
  // Spacing props
  padding: ct,
  paddingTop: ct,
  paddingRight: ct,
  paddingBottom: ct,
  paddingLeft: ct,
  margin: ct,
  marginTop: ct,
  marginRight: ct,
  marginBottom: ct,
  marginLeft: ct,
  // Misc
  backgroundPositionX: ct,
  backgroundPositionY: ct,
  ...YP,
  zIndex: gR,
  // SVG
  fillOpacity: Jh,
  strokeOpacity: Jh,
  numOctaves: gR
}, $P = {
  ...eT,
  // Color props
  color: ur,
  backgroundColor: ur,
  outlineColor: ur,
  fill: ur,
  stroke: ur,
  // Border props
  borderColor: ur,
  borderTopColor: ur,
  borderRightColor: ur,
  borderBottomColor: ur,
  borderLeftColor: ur,
  filter: bE,
  WebkitFilter: bE
}, fk = (a) => $P[a];
function dk(a, l) {
  let c = fk(a);
  return c !== bE && (c = _u), c.getAnimatableNone ? c.getAnimatableNone(l) : void 0;
}
const WP = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function GP(a, l, c) {
  let p = 0, g;
  for (; p < a.length && !g; ) {
    const E = a[p];
    typeof E == "string" && !WP.has(E) && em(E).values.length && (g = a[p]), p++;
  }
  if (g && c)
    for (const E of l)
      a[E] = dk(c, g);
}
class KP extends ZE {
  constructor(l, c, p, g, E) {
    super(l, c, p, g, E, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: l, element: c, name: p } = this;
    if (!c || !c.current)
      return;
    super.readKeyframes();
    for (let b = 0; b < l.length; b++) {
      let R = l[b];
      if (typeof R == "string" && (R = R.trim(), YE(R))) {
        const D = lk(R, c.current);
        D !== void 0 && (l[b] = D), b === l.length - 1 && (this.finalKeyframe = R);
      }
    }
    if (this.resolveNoneKeyframes(), !sk.has(p) || l.length !== 2)
      return;
    const [g, E] = l, h = yR(g), x = yR(E);
    if (h !== x)
      if (pR(h) && pR(x))
        for (let b = 0; b < l.length; b++) {
          const R = l[b];
          typeof R == "string" && (l[b] = parseFloat(R));
        }
      else Hc[p] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: l, name: c } = this, p = [];
    for (let g = 0; g < l.length; g++)
      (l[g] === null || jP(l[g])) && p.push(g);
    p.length && GP(l, p, c);
  }
  measureInitialState() {
    const { element: l, unresolvedKeyframes: c, name: p } = this;
    if (!l || !l.current)
      return;
    p === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = Hc[p](l.measureViewportBox(), window.getComputedStyle(l.current)), c[0] = this.measuredOrigin;
    const g = c[c.length - 1];
    g !== void 0 && l.getValue(p, g).jump(g, !1);
  }
  measureEndState() {
    var x;
    const { element: l, name: c, unresolvedKeyframes: p } = this;
    if (!l || !l.current)
      return;
    const g = l.getValue(c);
    g && g.jump(this.measuredOrigin, !1);
    const E = p.length - 1, h = p[E];
    p[E] = Hc[c](l.measureViewportBox(), window.getComputedStyle(l.current)), h !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = h), (x = this.removedTransforms) != null && x.length && this.removedTransforms.forEach(([b, R]) => {
      l.getValue(b).set(R);
    }), this.resolveNoneKeyframes();
  }
}
function QP(a, l, c) {
  if (a instanceof EventTarget)
    return [a];
  if (typeof a == "string") {
    let p = document;
    const g = (c == null ? void 0 : c[a]) ?? p.querySelectorAll(a);
    return g ? Array.from(g) : [];
  }
  return Array.from(a);
}
const pk = (a, l) => l && typeof a == "number" ? l.transform(a) : a;
function XP(a) {
  return _1(a) && "offsetHeight" in a;
}
const SR = 30, qP = (a) => !isNaN(parseFloat(a));
class ZP {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(l, c = {}) {
    this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (p) => {
      var E;
      const g = na.now();
      if (this.updatedAt !== g && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(p), this.current !== this.prev && ((E = this.events.change) == null || E.notify(this.current), this.dependents))
        for (const h of this.dependents)
          h.dirty();
    }, this.hasAnimated = !1, this.setCurrent(l), this.owner = c.owner;
  }
  setCurrent(l) {
    this.current = l, this.updatedAt = na.now(), this.canTrackVelocity === null && l !== void 0 && (this.canTrackVelocity = qP(this.current));
  }
  setPrevFrameValue(l = this.current) {
    this.prevFrameValue = l, this.prevUpdatedAt = this.updatedAt;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(l) {
    return process.env.NODE_ENV !== "production" && BE(!1, 'value.onChange(callback) is deprecated. Switch to value.on("change", callback).'), this.on("change", l);
  }
  on(l, c) {
    this.events[l] || (this.events[l] = new jE());
    const p = this.events[l].add(c);
    return l === "change" ? () => {
      p(), xn.read(() => {
        this.events.change.getSize() || this.stop();
      });
    } : p;
  }
  clearListeners() {
    for (const l in this.events)
      this.events[l].clear();
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   */
  attach(l, c) {
    this.passiveEffect = l, this.stopPassiveEffect = c;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(l) {
    this.passiveEffect ? this.passiveEffect(l, this.updateAndNotify) : this.updateAndNotify(l);
  }
  setWithVelocity(l, c, p) {
    this.set(c), this.prev = void 0, this.prevFrameValue = l, this.prevUpdatedAt = this.updatedAt - p;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(l, c = !0) {
    this.updateAndNotify(l), this.prev = l, this.prevUpdatedAt = this.prevFrameValue = void 0, c && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
  dirty() {
    var l;
    (l = this.events.change) == null || l.notify(this.current);
  }
  addDependent(l) {
    this.dependents || (this.dependents = /* @__PURE__ */ new Set()), this.dependents.add(l);
  }
  removeDependent(l) {
    this.dependents && this.dependents.delete(l);
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    return this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    const l = na.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || l - this.updatedAt > SR)
      return 0;
    const c = Math.min(this.updatedAt - this.prevUpdatedAt, SR);
    return O1(parseFloat(this.current) - parseFloat(this.prevFrameValue), c);
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   */
  start(l) {
    return this.stop(), new Promise((c) => {
      this.hasAnimated = !0, this.animation = l(c), this.events.animationStart && this.events.animationStart.notify();
    }).then(() => {
      this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    var l, c;
    (l = this.dependents) == null || l.clear(), (c = this.events.destroy) == null || c.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
}
function Yc(a, l) {
  return new ZP(a, l);
}
const { schedule: tT } = /* @__PURE__ */ H1(queueMicrotask, !1), Vo = {
  x: !1,
  y: !1
};
function hk() {
  return Vo.x || Vo.y;
}
function JP(a) {
  return a === "x" || a === "y" ? Vo[a] ? null : (Vo[a] = !0, () => {
    Vo[a] = !1;
  }) : Vo.x || Vo.y ? null : (Vo.x = Vo.y = !0, () => {
    Vo.x = Vo.y = !1;
  });
}
function mk(a, l) {
  const c = QP(a), p = new AbortController(), g = {
    passive: !0,
    ...l,
    signal: p.signal
  };
  return [c, g, () => p.abort()];
}
function CR(a) {
  return !(a.pointerType === "touch" || hk());
}
function eV(a, l, c = {}) {
  const [p, g, E] = mk(a, c), h = (x) => {
    if (!CR(x))
      return;
    const { target: b } = x, R = l(b, x);
    if (typeof R != "function" || !b)
      return;
    const D = (M) => {
      CR(M) && (R(M), b.removeEventListener("pointerleave", D));
    };
    b.addEventListener("pointerleave", D, g);
  };
  return p.forEach((x) => {
    x.addEventListener("pointerenter", h, g);
  }), E;
}
const vk = (a, l) => l ? a === l ? !0 : vk(a, l.parentElement) : !1, nT = (a) => a.pointerType === "mouse" ? typeof a.button != "number" || a.button <= 0 : a.isPrimary !== !1, tV = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function nV(a) {
  return tV.has(a.tagName) || a.tabIndex !== -1;
}
const pg = /* @__PURE__ */ new WeakSet();
function ER(a) {
  return (l) => {
    l.key === "Enter" && a(l);
  };
}
function KC(a, l) {
  a.dispatchEvent(new PointerEvent("pointer" + l, { isPrimary: !0, bubbles: !0 }));
}
const rV = (a, l) => {
  const c = a.currentTarget;
  if (!c)
    return;
  const p = ER(() => {
    if (pg.has(c))
      return;
    KC(c, "down");
    const g = ER(() => {
      KC(c, "up");
    }), E = () => KC(c, "cancel");
    c.addEventListener("keyup", g, l), c.addEventListener("blur", E, l);
  });
  c.addEventListener("keydown", p, l), c.addEventListener("blur", () => c.removeEventListener("keydown", p), l);
};
function TR(a) {
  return nT(a) && !hk();
}
function iV(a, l, c = {}) {
  const [p, g, E] = mk(a, c), h = (x) => {
    const b = x.currentTarget;
    if (!TR(x))
      return;
    pg.add(b);
    const R = l(b, x), D = (j, q) => {
      window.removeEventListener("pointerup", M), window.removeEventListener("pointercancel", A), pg.has(b) && pg.delete(b), TR(j) && typeof R == "function" && R(j, { success: q });
    }, M = (j) => {
      D(j, b === window || b === document || c.useGlobalTarget || vk(b, j.target));
    }, A = (j) => {
      D(j, !1);
    };
    window.addEventListener("pointerup", M, g), window.addEventListener("pointercancel", A, g);
  };
  return p.forEach((x) => {
    (c.useGlobalTarget ? window : x).addEventListener("pointerdown", h, g), XP(x) && (x.addEventListener("focus", (R) => rV(R, g)), !nV(x) && !x.hasAttribute("tabindex") && (x.tabIndex = 0));
  }), E;
}
function yk(a) {
  return _1(a) && "ownerSVGElement" in a;
}
function aV(a) {
  return yk(a) && a.tagName === "svg";
}
const Vr = (a) => !!(a && a.getVelocity), oV = [...ck, ur, _u], lV = (a) => oV.find(uk(a)), rT = at.createContext({
  transformPagePoint: (a) => a,
  isStatic: !1,
  reducedMotion: "never"
});
function sV(a = !0) {
  const l = at.useContext(VE);
  if (l === null)
    return [!0, null];
  const { isPresent: c, onExitComplete: p, register: g } = l, E = at.useId();
  at.useEffect(() => {
    if (a)
      return g(E);
  }, [a]);
  const h = at.useCallback(() => a && p && p(E), [E, p, a]);
  return !c && p ? [!1, h] : [!0];
}
const gk = at.createContext({ strict: !1 }), bR = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
}, Pd = {};
for (const a in bR)
  Pd[a] = {
    isEnabled: (l) => bR[a].some((c) => !!l[c])
  };
function uV(a) {
  for (const l in a)
    Pd[l] = {
      ...Pd[l],
      ...a[l]
    };
}
const cV = /* @__PURE__ */ new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "ignoreStrict",
  "viewport"
]);
function Sg(a) {
  return a.startsWith("while") || a.startsWith("drag") && a !== "draggable" || a.startsWith("layout") || a.startsWith("onTap") || a.startsWith("onPan") || a.startsWith("onLayout") || cV.has(a);
}
let Sk = (a) => !Sg(a);
function fV(a) {
  typeof a == "function" && (Sk = (l) => l.startsWith("on") ? !Sg(l) : a(l));
}
try {
  fV(require("@emotion/is-prop-valid").default);
} catch {
}
function dV(a, l, c) {
  const p = {};
  for (const g in a)
    g === "values" && typeof a.values == "object" || (Sk(g) || c === !0 && Sg(g) || !l && !Sg(g) || // If trying to use native HTML drag events, forward drag listeners
    a.draggable && g.startsWith("onDrag")) && (p[g] = a[g]);
  return p;
}
const bg = /* @__PURE__ */ at.createContext({});
function xg(a) {
  return a !== null && typeof a == "object" && typeof a.start == "function";
}
function tm(a) {
  return typeof a == "string" || Array.isArray(a);
}
const iT = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], aT = ["initial", ...iT];
function wg(a) {
  return xg(a.animate) || aT.some((l) => tm(a[l]));
}
function Ck(a) {
  return !!(wg(a) || a.variants);
}
function pV(a, l) {
  if (wg(a)) {
    const { initial: c, animate: p } = a;
    return {
      initial: c === !1 || tm(c) ? c : void 0,
      animate: tm(p) ? p : void 0
    };
  }
  return a.inherit !== !1 ? l : {};
}
function hV(a) {
  const { initial: l, animate: c } = pV(a, at.useContext(bg));
  return at.useMemo(() => ({ initial: l, animate: c }), [xR(l), xR(c)]);
}
function xR(a) {
  return Array.isArray(a) ? a.join(" ") : a;
}
function wR(a, l) {
  return l.max === l.min ? 0 : a / (l.max - l.min) * 100;
}
const $h = {
  correct: (a, l) => {
    if (!l.target)
      return a;
    if (typeof a == "string")
      if (ct.test(a))
        a = parseFloat(a);
      else
        return a;
    const c = wR(a, l.target.x), p = wR(a, l.target.y);
    return `${c}% ${p}%`;
  }
}, mV = {
  correct: (a, { treeScale: l, projectionDelta: c }) => {
    const p = a, g = _u.parse(a);
    if (g.length > 5)
      return p;
    const E = _u.createTransformer(a), h = typeof g[0] != "number" ? 1 : 0, x = c.x.scale * l.x, b = c.y.scale * l.y;
    g[0 + h] /= x, g[1 + h] /= b;
    const R = Pn(x, b, 0.5);
    return typeof g[2 + h] == "number" && (g[2 + h] /= R), typeof g[3 + h] == "number" && (g[3 + h] /= R), E(g);
  }
}, xE = {
  borderRadius: {
    ...$h,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: $h,
  borderTopRightRadius: $h,
  borderBottomLeftRadius: $h,
  borderBottomRightRadius: $h,
  boxShadow: mV
};
function Ek(a, { layout: l, layoutId: c }) {
  return Fd.has(a) || a.startsWith("origin") || (l || c !== void 0) && (!!xE[a] || a === "opacity");
}
const vV = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, yV = Ud.length;
function gV(a, l, c) {
  let p = "", g = !0;
  for (let E = 0; E < yV; E++) {
    const h = Ud[E], x = a[h];
    if (x === void 0)
      continue;
    let b = !0;
    if (typeof x == "number" ? b = x === (h.startsWith("scale") ? 1 : 0) : b = parseFloat(x) === 0, !b || c) {
      const R = pk(x, eT[h]);
      if (!b) {
        g = !1;
        const D = vV[h] || h;
        p += `${D}(${R}) `;
      }
      c && (l[h] = R);
    }
  }
  return p = p.trim(), c ? p = c(l, g ? "" : p) : g && (p = "none"), p;
}
function oT(a, l, c) {
  const { style: p, vars: g, transformOrigin: E } = a;
  let h = !1, x = !1;
  for (const b in l) {
    const R = l[b];
    if (Fd.has(b)) {
      h = !0;
      continue;
    } else if (Y1(b)) {
      g[b] = R;
      continue;
    } else {
      const D = pk(R, eT[b]);
      b.startsWith("origin") ? (x = !0, E[b] = D) : p[b] = D;
    }
  }
  if (l.transform || (h || c ? p.transform = gV(l, a.transform, c) : p.transform && (p.transform = "none")), x) {
    const { originX: b = "50%", originY: R = "50%", originZ: D = 0 } = E;
    p.transformOrigin = `${b} ${R} ${D}`;
  }
}
const lT = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function Tk(a, l, c) {
  for (const p in l)
    !Vr(l[p]) && !Ek(p, c) && (a[p] = l[p]);
}
function SV({ transformTemplate: a }, l) {
  return at.useMemo(() => {
    const c = lT();
    return oT(c, l, a), Object.assign({}, c.vars, c.style);
  }, [l]);
}
function CV(a, l) {
  const c = a.style || {}, p = {};
  return Tk(p, c, a), Object.assign(p, SV(a, l)), p;
}
function EV(a, l) {
  const c = {}, p = CV(a, l);
  return a.drag && a.dragListener !== !1 && (c.draggable = !1, p.userSelect = p.WebkitUserSelect = p.WebkitTouchCallout = "none", p.touchAction = a.drag === !0 ? "none" : `pan-${a.drag === "x" ? "y" : "x"}`), a.tabIndex === void 0 && (a.onTap || a.onTapStart || a.whileTap) && (c.tabIndex = 0), c.style = p, c;
}
const TV = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, bV = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function xV(a, l, c = 1, p = 0, g = !0) {
  a.pathLength = 1;
  const E = g ? TV : bV;
  a[E.offset] = ct.transform(-p);
  const h = ct.transform(l), x = ct.transform(c);
  a[E.array] = `${h} ${x}`;
}
function bk(a, {
  attrX: l,
  attrY: c,
  attrScale: p,
  pathLength: g,
  pathSpacing: E = 1,
  pathOffset: h = 0,
  // This is object creation, which we try to avoid per-frame.
  ...x
}, b, R, D) {
  if (oT(a, x, R), b) {
    a.style.viewBox && (a.attrs.viewBox = a.style.viewBox);
    return;
  }
  a.attrs = a.style, a.style = {};
  const { attrs: M, style: A } = a;
  M.transform && (A.transform = M.transform, delete M.transform), (A.transform || M.transformOrigin) && (A.transformOrigin = M.transformOrigin ?? "50% 50%", delete M.transformOrigin), A.transform && (A.transformBox = (D == null ? void 0 : D.transformBox) ?? "fill-box", delete M.transformBox), l !== void 0 && (M.x = l), c !== void 0 && (M.y = c), p !== void 0 && (M.scale = p), g !== void 0 && xV(M, g, E, h, !1);
}
const xk = () => ({
  ...lT(),
  attrs: {}
}), wk = (a) => typeof a == "string" && a.toLowerCase() === "svg";
function wV(a, l, c, p) {
  const g = at.useMemo(() => {
    const E = xk();
    return bk(E, l, wk(p), a.transformTemplate, a.style), {
      ...E.attrs,
      style: { ...E.style }
    };
  }, [l]);
  if (a.style) {
    const E = {};
    Tk(E, a.style, a), g.style = { ...E, ...g.style };
  }
  return g;
}
const RV = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view"
];
function sT(a) {
  return (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof a != "string" || /**
     * If it contains a dash, the element is a custom HTML webcomponent.
     */
    a.includes("-") ? !1 : (
      /**
       * If it's in our list of lowercase SVG tags, it's an SVG component
       */
      !!(RV.indexOf(a) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/u.test(a))
    )
  );
}
function kV(a, l, c, { latestValues: p }, g, E = !1) {
  const x = (sT(a) ? wV : EV)(l, p, g, a), b = dV(l, typeof a == "string", E), R = a !== at.Fragment ? { ...b, ...x, ref: c } : {}, { children: D } = l, M = at.useMemo(() => Vr(D) ? D.get() : D, [D]);
  return at.createElement(a, {
    ...R,
    children: M
  });
}
function RR(a) {
  const l = [{}, {}];
  return a == null || a.values.forEach((c, p) => {
    l[0][p] = c.get(), l[1][p] = c.getVelocity();
  }), l;
}
function uT(a, l, c, p) {
  if (typeof l == "function") {
    const [g, E] = RR(p);
    l = l(c !== void 0 ? c : a.custom, g, E);
  }
  if (typeof l == "string" && (l = a.variants && a.variants[l]), typeof l == "function") {
    const [g, E] = RR(p);
    l = l(c !== void 0 ? c : a.custom, g, E);
  }
  return l;
}
function hg(a) {
  return Vr(a) ? a.get() : a;
}
function DV({ scrapeMotionValuesFromProps: a, createRenderState: l }, c, p, g) {
  return {
    latestValues: _V(c, p, g, a),
    renderState: l()
  };
}
function _V(a, l, c, p) {
  const g = {}, E = p(a, {});
  for (const A in E)
    g[A] = hg(E[A]);
  let { initial: h, animate: x } = a;
  const b = wg(a), R = Ck(a);
  l && R && !b && a.inherit !== !1 && (h === void 0 && (h = l.initial), x === void 0 && (x = l.animate));
  let D = c ? c.initial === !1 : !1;
  D = D || h === !1;
  const M = D ? x : h;
  if (M && typeof M != "boolean" && !xg(M)) {
    const A = Array.isArray(M) ? M : [M];
    for (let j = 0; j < A.length; j++) {
      const q = uT(a, A[j]);
      if (q) {
        const { transitionEnd: re, transition: ie, ...ue } = q;
        for (const he in ue) {
          let ne = ue[he];
          if (Array.isArray(ne)) {
            const Se = D ? ne.length - 1 : 0;
            ne = ne[Se];
          }
          ne !== null && (g[he] = ne);
        }
        for (const he in re)
          g[he] = re[he];
      }
    }
  }
  return g;
}
const Rk = (a) => (l, c) => {
  const p = at.useContext(bg), g = at.useContext(VE), E = () => DV(a, l, p, g);
  return c ? E() : R1(E);
};
function cT(a, l, c) {
  var E;
  const { style: p } = a, g = {};
  for (const h in p)
    (Vr(p[h]) || l.style && Vr(l.style[h]) || Ek(h, a) || ((E = c == null ? void 0 : c.getValue(h)) == null ? void 0 : E.liveStyle) !== void 0) && (g[h] = p[h]);
  return g;
}
const MV = /* @__PURE__ */ Rk({
  scrapeMotionValuesFromProps: cT,
  createRenderState: lT
});
function kk(a, l, c) {
  const p = cT(a, l, c);
  for (const g in a)
    if (Vr(a[g]) || Vr(l[g])) {
      const E = Ud.indexOf(g) !== -1 ? "attr" + g.charAt(0).toUpperCase() + g.substring(1) : g;
      p[E] = a[g];
    }
  return p;
}
const OV = /* @__PURE__ */ Rk({
  scrapeMotionValuesFromProps: kk,
  createRenderState: xk
}), AV = Symbol.for("motionComponentSymbol");
function Md(a) {
  return a && typeof a == "object" && Object.prototype.hasOwnProperty.call(a, "current");
}
function LV(a, l, c) {
  return at.useCallback(
    (p) => {
      p && a.onMount && a.onMount(p), l && (p ? l.mount(p) : l.unmount()), c && (typeof c == "function" ? c(p) : Md(c) && (c.current = p));
    },
    /**
     * Include externalRef in dependencies to ensure the callback updates
     * when the ref changes, allowing proper ref forwarding.
     */
    [l]
  );
}
const fT = (a) => a.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(), NV = "framerAppearId", Dk = "data-" + fT(NV), _k = at.createContext({});
function PV(a, l, c, p, g) {
  var re, ie;
  const { visualElement: E } = at.useContext(bg), h = at.useContext(gk), x = at.useContext(VE), b = at.useContext(rT).reducedMotion, R = at.useRef(null);
  p = p || h.renderer, !R.current && p && (R.current = p(a, {
    visualState: l,
    parent: E,
    props: c,
    presenceContext: x,
    blockInitialAnimation: x ? x.initial === !1 : !1,
    reducedMotionConfig: b
  }));
  const D = R.current, M = at.useContext(_k);
  D && !D.projection && g && (D.type === "html" || D.type === "svg") && VV(R.current, c, g, M);
  const A = at.useRef(!1);
  at.useInsertionEffect(() => {
    D && A.current && D.update(c, x);
  });
  const j = c[Dk], q = at.useRef(!!j && !((re = window.MotionHandoffIsComplete) != null && re.call(window, j)) && ((ie = window.MotionHasOptimisedAnimation) == null ? void 0 : ie.call(window, j)));
  return k1(() => {
    D && (A.current = !0, window.MotionIsMounted = !0, D.updateFeatures(), D.scheduleRenderMicrotask(), q.current && D.animationState && D.animationState.animateChanges());
  }), at.useEffect(() => {
    D && (!q.current && D.animationState && D.animationState.animateChanges(), q.current && (queueMicrotask(() => {
      var ue;
      (ue = window.MotionHandoffMarkAsComplete) == null || ue.call(window, j);
    }), q.current = !1), D.enteringChildren = void 0);
  }), D;
}
function VV(a, l, c, p) {
  const { layoutId: g, layout: E, drag: h, dragConstraints: x, layoutScroll: b, layoutRoot: R, layoutCrossfade: D } = l;
  a.projection = new c(a.latestValues, l["data-framer-portal-id"] ? void 0 : Mk(a.parent)), a.projection.setOptions({
    layoutId: g,
    layout: E,
    alwaysMeasureLayout: !!h || x && Md(x),
    visualElement: a,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof E == "string" ? E : "both",
    initialPromotionConfig: p,
    crossfade: D,
    layoutScroll: b,
    layoutRoot: R
  });
}
function Mk(a) {
  if (a)
    return a.options.allowProjection !== !1 ? a.projection : Mk(a.parent);
}
function QC(a, { forwardMotionProps: l = !1 } = {}, c, p) {
  c && uV(c);
  const g = sT(a) ? OV : MV;
  function E(x, b) {
    let R;
    const D = {
      ...at.useContext(rT),
      ...x,
      layoutId: zV(x)
    }, { isStatic: M } = D, A = hV(x), j = g(x, M);
    if (!M && PE) {
      UV(D, c);
      const q = FV(D);
      R = q.MeasureLayout, A.visualElement = PV(a, j, D, p, q.ProjectionNode);
    }
    return Jn.jsxs(bg.Provider, { value: A, children: [R && A.visualElement ? Jn.jsx(R, { visualElement: A.visualElement, ...D }) : null, kV(a, x, LV(j, A.visualElement, b), j, M, l)] });
  }
  E.displayName = `motion.${typeof a == "string" ? a : `create(${a.displayName ?? a.name ?? ""})`}`;
  const h = at.forwardRef(E);
  return h[AV] = a, h;
}
function zV({ layoutId: a }) {
  const l = at.useContext(w1).id;
  return l && a !== void 0 ? l + "-" + a : a;
}
function UV(a, l) {
  const c = at.useContext(gk).strict;
  if (process.env.NODE_ENV !== "production" && l && c) {
    const p = "You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.";
    a.ignoreStrict ? Vd(!1, p, "lazy-strict-mode") : Ss(!1, p, "lazy-strict-mode");
  }
}
function FV(a) {
  const { drag: l, layout: c } = Pd;
  if (!l && !c)
    return {};
  const p = { ...l, ...c };
  return {
    MeasureLayout: l != null && l.isEnabled(a) || c != null && c.isEnabled(a) ? p.MeasureLayout : void 0,
    ProjectionNode: p.ProjectionNode
  };
}
function jV(a, l) {
  if (typeof Proxy > "u")
    return QC;
  const c = /* @__PURE__ */ new Map(), p = (E, h) => QC(E, h, a, l), g = (E, h) => (process.env.NODE_ENV !== "production" && BE(!1, "motion() is deprecated. Use motion.create() instead."), p(E, h));
  return new Proxy(g, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (E, h) => h === "create" ? p : (c.has(h) || c.set(h, QC(h, void 0, a, l)), c.get(h))
  });
}
function Ok({ top: a, left: l, right: c, bottom: p }) {
  return {
    x: { min: l, max: c },
    y: { min: a, max: p }
  };
}
function BV({ x: a, y: l }) {
  return { top: l.min, right: a.max, bottom: l.max, left: a.min };
}
function HV(a, l) {
  if (!l)
    return a;
  const c = l({ x: a.left, y: a.top }), p = l({ x: a.right, y: a.bottom });
  return {
    top: c.y,
    left: c.x,
    bottom: p.y,
    right: p.x
  };
}
function XC(a) {
  return a === void 0 || a === 1;
}
function wE({ scale: a, scaleX: l, scaleY: c }) {
  return !XC(a) || !XC(l) || !XC(c);
}
function Fc(a) {
  return wE(a) || Ak(a) || a.z || a.rotate || a.rotateX || a.rotateY || a.skewX || a.skewY;
}
function Ak(a) {
  return kR(a.x) || kR(a.y);
}
function kR(a) {
  return a && a !== "0%";
}
function Cg(a, l, c) {
  const p = a - c, g = l * p;
  return c + g;
}
function DR(a, l, c, p, g) {
  return g !== void 0 && (a = Cg(a, g, p)), Cg(a, c, p) + l;
}
function RE(a, l = 0, c = 1, p, g) {
  a.min = DR(a.min, l, c, p, g), a.max = DR(a.max, l, c, p, g);
}
function Lk(a, { x: l, y: c }) {
  RE(a.x, l.translate, l.scale, l.originPoint), RE(a.y, c.translate, c.scale, c.originPoint);
}
const _R = 0.999999999999, MR = 1.0000000000001;
function IV(a, l, c, p = !1) {
  const g = c.length;
  if (!g)
    return;
  l.x = l.y = 1;
  let E, h;
  for (let x = 0; x < g; x++) {
    E = c[x], h = E.projectionDelta;
    const { visualElement: b } = E.options;
    b && b.props.style && b.props.style.display === "contents" || (p && E.options.layoutScroll && E.scroll && E !== E.root && Ad(a, {
      x: -E.scroll.offset.x,
      y: -E.scroll.offset.y
    }), h && (l.x *= h.x.scale, l.y *= h.y.scale, Lk(a, h)), p && Fc(E.latestValues) && Ad(a, E.latestValues));
  }
  l.x < MR && l.x > _R && (l.x = 1), l.y < MR && l.y > _R && (l.y = 1);
}
function Od(a, l) {
  a.min = a.min + l, a.max = a.max + l;
}
function OR(a, l, c, p, g = 0.5) {
  const E = Pn(a.min, a.max, g);
  RE(a, l, c, E, p);
}
function Ad(a, l) {
  OR(a.x, l.x, l.scaleX, l.scale, l.originX), OR(a.y, l.y, l.scaleY, l.scale, l.originY);
}
function Nk(a, l) {
  return Ok(HV(a.getBoundingClientRect(), l));
}
function YV(a, l, c) {
  const p = Nk(a, c), { scroll: g } = l;
  return g && (Od(p.x, g.offset.x), Od(p.y, g.offset.y)), p;
}
const AR = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), Ld = () => ({
  x: AR(),
  y: AR()
}), LR = () => ({ min: 0, max: 0 }), Rr = () => ({
  x: LR(),
  y: LR()
}), kE = { current: null }, Pk = { current: !1 };
function $V() {
  if (Pk.current = !0, !!PE)
    if (window.matchMedia) {
      const a = window.matchMedia("(prefers-reduced-motion)"), l = () => kE.current = a.matches;
      a.addEventListener("change", l), l();
    } else
      kE.current = !1;
}
const WV = /* @__PURE__ */ new WeakMap();
function GV(a, l, c) {
  for (const p in l) {
    const g = l[p], E = c[p];
    if (Vr(g))
      a.addValue(p, g);
    else if (Vr(E))
      a.addValue(p, Yc(g, { owner: a }));
    else if (E !== g)
      if (a.hasValue(p)) {
        const h = a.getValue(p);
        h.liveStyle === !0 ? h.jump(g) : h.hasAnimated || h.set(g);
      } else {
        const h = a.getStaticValue(p);
        a.addValue(p, Yc(h !== void 0 ? h : g, { owner: a }));
      }
  }
  for (const p in c)
    l[p] === void 0 && a.removeValue(p);
  return l;
}
const NR = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
class KV {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(l, c, p) {
    return {};
  }
  constructor({ parent: l, props: c, presenceContext: p, reducedMotionConfig: g, blockInitialAnimation: E, visualState: h }, x = {}) {
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = ZE, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const A = na.now();
      this.renderScheduledAt < A && (this.renderScheduledAt = A, xn.render(this.render, !1, !0));
    };
    const { latestValues: b, renderState: R } = h;
    this.latestValues = b, this.baseTarget = { ...b }, this.initialValues = c.initial ? { ...b } : {}, this.renderState = R, this.parent = l, this.props = c, this.presenceContext = p, this.depth = l ? l.depth + 1 : 0, this.reducedMotionConfig = g, this.options = x, this.blockInitialAnimation = !!E, this.isControllingVariants = wg(c), this.isVariantNode = Ck(c), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(l && l.current);
    const { willChange: D, ...M } = this.scrapeMotionValuesFromProps(c, {}, this);
    for (const A in M) {
      const j = M[A];
      b[A] !== void 0 && Vr(j) && j.set(b[A]);
    }
  }
  mount(l) {
    var c;
    this.current = l, WV.set(l, this), this.projection && !this.projection.instance && this.projection.mount(l), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((p, g) => this.bindToMotionValue(g, p)), Pk.current || $V(), this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : kE.current, process.env.NODE_ENV !== "production" && BE(this.shouldReduceMotion !== !0, "You have Reduced Motion enabled on your device. Animations may not appear as expected.", "reduced-motion-disabled"), (c = this.parent) == null || c.addChild(this), this.update(this.props, this.presenceContext);
  }
  unmount() {
    var l;
    this.projection && this.projection.unmount(), Es(this.notifyUpdate), Es(this.render), this.valueSubscriptions.forEach((c) => c()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), (l = this.parent) == null || l.removeChild(this);
    for (const c in this.events)
      this.events[c].clear();
    for (const c in this.features) {
      const p = this.features[c];
      p && (p.unmount(), p.isMounted = !1);
    }
    this.current = null;
  }
  addChild(l) {
    this.children.add(l), this.enteringChildren ?? (this.enteringChildren = /* @__PURE__ */ new Set()), this.enteringChildren.add(l);
  }
  removeChild(l) {
    this.children.delete(l), this.enteringChildren && this.enteringChildren.delete(l);
  }
  bindToMotionValue(l, c) {
    this.valueSubscriptions.has(l) && this.valueSubscriptions.get(l)();
    const p = Fd.has(l);
    p && this.onBindTransform && this.onBindTransform();
    const g = c.on("change", (h) => {
      this.latestValues[l] = h, this.props.onUpdate && xn.preRender(this.notifyUpdate), p && this.projection && (this.projection.isTransformDirty = !0), this.scheduleRender();
    });
    let E;
    window.MotionCheckAppearSync && (E = window.MotionCheckAppearSync(this, l, c)), this.valueSubscriptions.set(l, () => {
      g(), E && E(), c.owner && c.stop();
    });
  }
  sortNodePosition(l) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== l.type ? 0 : this.sortInstanceNodePosition(this.current, l.current);
  }
  updateFeatures() {
    let l = "animation";
    for (l in Pd) {
      const c = Pd[l];
      if (!c)
        continue;
      const { isEnabled: p, Feature: g } = c;
      if (!this.features[l] && g && p(this.props) && (this.features[l] = new g(this)), this.features[l]) {
        const E = this.features[l];
        E.isMounted ? E.update() : (E.mount(), E.isMounted = !0);
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : Rr();
  }
  getStaticValue(l) {
    return this.latestValues[l];
  }
  setStaticValue(l, c) {
    this.latestValues[l] = c;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(l, c) {
    (l.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = l, this.prevPresenceContext = this.presenceContext, this.presenceContext = c;
    for (let p = 0; p < NR.length; p++) {
      const g = NR[p];
      this.propEventSubscriptions[g] && (this.propEventSubscriptions[g](), delete this.propEventSubscriptions[g]);
      const E = "on" + g, h = l[E];
      h && (this.propEventSubscriptions[g] = this.on(g, h));
    }
    this.prevMotionValues = GV(this, this.scrapeMotionValuesFromProps(l, this.prevProps, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(l) {
    return this.props.variants ? this.props.variants[l] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(l) {
    const c = this.getClosestVariantNode();
    if (c)
      return c.variantChildren && c.variantChildren.add(l), () => c.variantChildren.delete(l);
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(l, c) {
    const p = this.values.get(l);
    c !== p && (p && this.removeValue(l), this.bindToMotionValue(l, c), this.values.set(l, c), this.latestValues[l] = c.get());
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(l) {
    this.values.delete(l);
    const c = this.valueSubscriptions.get(l);
    c && (c(), this.valueSubscriptions.delete(l)), delete this.latestValues[l], this.removeValueFromRenderState(l, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(l) {
    return this.values.has(l);
  }
  getValue(l, c) {
    if (this.props.values && this.props.values[l])
      return this.props.values[l];
    let p = this.values.get(l);
    return p === void 0 && c !== void 0 && (p = Yc(c === null ? void 0 : c, { owner: this }), this.addValue(l, p)), p;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(l, c) {
    let p = this.latestValues[l] !== void 0 || !this.current ? this.latestValues[l] : this.getBaseTargetFromProps(this.props, l) ?? this.readValueFromInstance(this.current, l, this.options);
    return p != null && (typeof p == "string" && (D1(p) || M1(p)) ? p = parseFloat(p) : !lV(p) && _u.test(c) && (p = dk(l, c)), this.setBaseTarget(l, Vr(p) ? p.get() : p)), Vr(p) ? p.get() : p;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(l, c) {
    this.baseTarget[l] = c;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(l) {
    var E;
    const { initial: c } = this.props;
    let p;
    if (typeof c == "string" || typeof c == "object") {
      const h = uT(this.props, c, (E = this.presenceContext) == null ? void 0 : E.custom);
      h && (p = h[l]);
    }
    if (c && p !== void 0)
      return p;
    const g = this.getBaseTargetFromProps(this.props, l);
    return g !== void 0 && !Vr(g) ? g : this.initialValues[l] !== void 0 && p === void 0 ? void 0 : this.baseTarget[l];
  }
  on(l, c) {
    return this.events[l] || (this.events[l] = new jE()), this.events[l].add(c);
  }
  notify(l, ...c) {
    this.events[l] && this.events[l].notify(...c);
  }
  scheduleRenderMicrotask() {
    tT.render(this.render);
  }
}
class Vk extends KV {
  constructor() {
    super(...arguments), this.KeyframeResolver = KP;
  }
  sortInstanceNodePosition(l, c) {
    return l.compareDocumentPosition(c) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(l, c) {
    return l.style ? l.style[c] : void 0;
  }
  removeValueFromRenderState(l, { vars: c, style: p }) {
    delete c[l], delete p[l];
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: l } = this.props;
    Vr(l) && (this.childSubscription = l.on("change", (c) => {
      this.current && (this.current.textContent = `${c}`);
    }));
  }
}
function zk(a, { style: l, vars: c }, p, g) {
  const E = a.style;
  let h;
  for (h in l)
    E[h] = l[h];
  g == null || g.applyProjectionStyles(E, p);
  for (h in c)
    E.setProperty(h, c[h]);
}
function QV(a) {
  return window.getComputedStyle(a);
}
class XV extends Vk {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = zk;
  }
  readValueFromInstance(l, c) {
    var p;
    if (Fd.has(c))
      return (p = this.projection) != null && p.isProjecting ? yE(c) : dP(l, c);
    {
      const g = QV(l), E = (Y1(c) ? g.getPropertyValue(c) : g[c]) || 0;
      return typeof E == "string" ? E.trim() : E;
    }
  }
  measureInstanceViewportBox(l, { transformPagePoint: c }) {
    return Nk(l, c);
  }
  build(l, c, p) {
    oT(l, c, p.transformTemplate);
  }
  scrapeMotionValuesFromProps(l, c, p) {
    return cT(l, c, p);
  }
}
const Uk = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]);
function qV(a, l, c, p) {
  zk(a, l, void 0, p);
  for (const g in l.attrs)
    a.setAttribute(Uk.has(g) ? g : fT(g), l.attrs[g]);
}
class ZV extends Vk {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = Rr;
  }
  getBaseTargetFromProps(l, c) {
    return l[c];
  }
  readValueFromInstance(l, c) {
    if (Fd.has(c)) {
      const p = fk(c);
      return p && p.default || 0;
    }
    return c = Uk.has(c) ? c : fT(c), l.getAttribute(c);
  }
  scrapeMotionValuesFromProps(l, c, p) {
    return kk(l, c, p);
  }
  build(l, c, p) {
    bk(l, c, this.isSVGTag, p.transformTemplate, p.style);
  }
  renderInstance(l, c, p, g) {
    qV(l, c, p, g);
  }
  mount(l) {
    this.isSVGTag = wk(l.tagName), super.mount(l);
  }
}
const JV = (a, l) => sT(a) ? new ZV(l) : new XV(l, {
  allowProjection: a !== at.Fragment
});
function Nd(a, l, c) {
  const p = a.getProps();
  return uT(p, l, c !== void 0 ? c : p.custom, a);
}
const DE = (a) => Array.isArray(a);
function ez(a, l, c) {
  a.hasValue(l) ? a.getValue(l).set(c) : a.addValue(l, Yc(c));
}
function tz(a) {
  return DE(a) ? a[a.length - 1] || 0 : a;
}
function nz(a, l) {
  const c = Nd(a, l);
  let { transitionEnd: p = {}, transition: g = {}, ...E } = c || {};
  E = { ...E, ...p };
  for (const h in E) {
    const x = tz(E[h]);
    ez(a, h, x);
  }
}
function rz(a) {
  return !!(Vr(a) && a.add);
}
function _E(a, l) {
  const c = a.getValue("willChange");
  if (rz(c))
    return c.add(l);
  if (!c && Cs.WillChange) {
    const p = new Cs.WillChange("auto");
    a.addValue("willChange", p), p.add(l);
  }
}
function Fk(a) {
  return a.props[Dk];
}
const iz = (a) => a !== null;
function az(a, { repeat: l, repeatType: c = "loop" }, p) {
  const g = a.filter(iz), E = l && c !== "loop" && l % 2 === 1 ? 0 : g.length - 1;
  return g[E];
}
const oz = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, lz = (a) => ({
  type: "spring",
  stiffness: 550,
  damping: a === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), sz = {
  type: "keyframes",
  duration: 0.8
}, uz = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, cz = (a, { keyframes: l }) => l.length > 2 ? sz : Fd.has(a) ? a.startsWith("scale") ? lz(l[1]) : oz : uz;
function fz({ when: a, delay: l, delayChildren: c, staggerChildren: p, staggerDirection: g, repeat: E, repeatType: h, repeatDelay: x, from: b, elapsed: R, ...D }) {
  return !!Object.keys(D).length;
}
const dT = (a, l, c, p = {}, g, E) => (h) => {
  const x = JE(p, a) || {}, b = x.delay || p.delay || 0;
  let { elapsed: R = 0 } = p;
  R = R - /* @__PURE__ */ zo(b);
  const D = {
    keyframes: Array.isArray(c) ? c : [null, c],
    ease: "easeOut",
    velocity: l.getVelocity(),
    ...x,
    delay: -R,
    onUpdate: (A) => {
      l.set(A), x.onUpdate && x.onUpdate(A);
    },
    onComplete: () => {
      h(), x.onComplete && x.onComplete();
    },
    name: a,
    motionValue: l,
    element: E ? void 0 : g
  };
  fz(x) || Object.assign(D, cz(a, D)), D.duration && (D.duration = /* @__PURE__ */ zo(D.duration)), D.repeatDelay && (D.repeatDelay = /* @__PURE__ */ zo(D.repeatDelay)), D.from !== void 0 && (D.keyframes[0] = D.from);
  let M = !1;
  if ((D.type === !1 || D.duration === 0 && !D.repeatDelay) && (TE(D), D.delay === 0 && (M = !0)), (Cs.instantAnimations || Cs.skipAnimations) && (M = !0, TE(D), D.delay = 0), D.allowFlatten = !x.type && !x.ease, M && !E && l.get() !== void 0) {
    const A = az(D.keyframes, x);
    if (A !== void 0) {
      xn.update(() => {
        D.onUpdate(A), D.onComplete();
      });
      return;
    }
  }
  return x.isSync ? new qE(D) : new PP(D);
};
function dz({ protectedKeys: a, needsAnimating: l }, c) {
  const p = a.hasOwnProperty(c) && l[c] !== !0;
  return l[c] = !1, p;
}
function jk(a, l, { delay: c = 0, transitionOverride: p, type: g } = {}) {
  let { transition: E = a.getDefaultTransition(), transitionEnd: h, ...x } = l;
  p && (E = p);
  const b = [], R = g && a.animationState && a.animationState.getState()[g];
  for (const D in x) {
    const M = a.getValue(D, a.latestValues[D] ?? null), A = x[D];
    if (A === void 0 || R && dz(R, D))
      continue;
    const j = {
      delay: c,
      ...JE(E || {}, D)
    }, q = M.get();
    if (q !== void 0 && !M.isAnimating && !Array.isArray(A) && A === q && !j.velocity)
      continue;
    let re = !1;
    if (window.MotionHandoffAnimation) {
      const ue = Fk(a);
      if (ue) {
        const he = window.MotionHandoffAnimation(ue, D, xn);
        he !== null && (j.startTime = he, re = !0);
      }
    }
    _E(a, D), M.start(dT(D, M, A, a.shouldReduceMotion && sk.has(D) ? { type: !1 } : j, a, re));
    const ie = M.animation;
    ie && b.push(ie);
  }
  return h && Promise.all(b).then(() => {
    xn.update(() => {
      h && nz(a, h);
    });
  }), b;
}
function Bk(a, l, c, p = 0, g = 1) {
  const E = Array.from(a).sort((R, D) => R.sortNodePosition(D)).indexOf(l), h = a.size, x = (h - 1) * p;
  return typeof c == "function" ? c(E, h) : g === 1 ? E * p : x - E * p;
}
function ME(a, l, c = {}) {
  var b;
  const p = Nd(a, l, c.type === "exit" ? (b = a.presenceContext) == null ? void 0 : b.custom : void 0);
  let { transition: g = a.getDefaultTransition() || {} } = p || {};
  c.transitionOverride && (g = c.transitionOverride);
  const E = p ? () => Promise.all(jk(a, p, c)) : () => Promise.resolve(), h = a.variantChildren && a.variantChildren.size ? (R = 0) => {
    const { delayChildren: D = 0, staggerChildren: M, staggerDirection: A } = g;
    return pz(a, l, R, D, M, A, c);
  } : () => Promise.resolve(), { when: x } = g;
  if (x) {
    const [R, D] = x === "beforeChildren" ? [E, h] : [h, E];
    return R().then(() => D());
  } else
    return Promise.all([E(), h(c.delay)]);
}
function pz(a, l, c = 0, p = 0, g = 0, E = 1, h) {
  const x = [];
  for (const b of a.variantChildren)
    b.notify("AnimationStart", l), x.push(ME(b, l, {
      ...h,
      delay: c + (typeof p == "function" ? 0 : p) + Bk(a.variantChildren, b, p, g, E)
    }).then(() => b.notify("AnimationComplete", l)));
  return Promise.all(x);
}
function hz(a, l, c = {}) {
  a.notify("AnimationStart", l);
  let p;
  if (Array.isArray(l)) {
    const g = l.map((E) => ME(a, E, c));
    p = Promise.all(g);
  } else if (typeof l == "string")
    p = ME(a, l, c);
  else {
    const g = typeof l == "function" ? Nd(a, l, c.custom) : l;
    p = Promise.all(jk(a, g, c));
  }
  return p.then(() => {
    a.notify("AnimationComplete", l);
  });
}
function Hk(a, l) {
  if (!Array.isArray(l))
    return !1;
  const c = l.length;
  if (c !== a.length)
    return !1;
  for (let p = 0; p < c; p++)
    if (l[p] !== a[p])
      return !1;
  return !0;
}
const mz = aT.length;
function Ik(a) {
  if (!a)
    return;
  if (!a.isControllingVariants) {
    const c = a.parent ? Ik(a.parent) || {} : {};
    return a.props.initial !== void 0 && (c.initial = a.props.initial), c;
  }
  const l = {};
  for (let c = 0; c < mz; c++) {
    const p = aT[c], g = a.props[p];
    (tm(g) || g === !1) && (l[p] = g);
  }
  return l;
}
const vz = [...iT].reverse(), yz = iT.length;
function gz(a) {
  return (l) => Promise.all(l.map(({ animation: c, options: p }) => hz(a, c, p)));
}
function Sz(a) {
  let l = gz(a), c = PR(), p = !0;
  const g = (b) => (R, D) => {
    var A;
    const M = Nd(a, D, b === "exit" ? (A = a.presenceContext) == null ? void 0 : A.custom : void 0);
    if (M) {
      const { transition: j, transitionEnd: q, ...re } = M;
      R = { ...R, ...re, ...q };
    }
    return R;
  };
  function E(b) {
    l = b(a);
  }
  function h(b) {
    const { props: R } = a, D = Ik(a.parent) || {}, M = [], A = /* @__PURE__ */ new Set();
    let j = {}, q = 1 / 0;
    for (let ie = 0; ie < yz; ie++) {
      const ue = vz[ie], he = c[ue], ne = R[ue] !== void 0 ? R[ue] : D[ue], Se = tm(ne), ae = ue === b ? he.isActive : null;
      ae === !1 && (q = ie);
      let Re = ne === D[ue] && ne !== R[ue] && Se;
      if (Re && p && a.manuallyAnimateOnMount && (Re = !1), he.protectedKeys = { ...j }, // If it isn't active and hasn't *just* been set as inactive
      !he.isActive && ae === null || // If we didn't and don't have any defined prop for this animation type
      !ne && !he.prevProp || // Or if the prop doesn't define an animation
      xg(ne) || typeof ne == "boolean")
        continue;
      const xe = Cz(he.prevProp, ne);
      let le = xe || // If we're making this variant active, we want to always make it active
      ue === b && he.isActive && !Re && Se || // If we removed a higher-priority variant (i is in reverse order)
      ie > q && Se, Xe = !1;
      const yt = Array.isArray(ne) ? ne : [ne];
      let Mt = yt.reduce(g(ue), {});
      ae === !1 && (Mt = {});
      const { prevResolvedValues: gt = {} } = he, We = {
        ...gt,
        ...Mt
      }, Rt = (ye) => {
        le = !0, A.has(ye) && (Xe = !0, A.delete(ye)), he.needsAnimating[ye] = !0;
        const K = a.getValue(ye);
        K && (K.liveStyle = !1);
      };
      for (const ye in We) {
        const K = Mt[ye], De = gt[ye];
        if (j.hasOwnProperty(ye))
          continue;
        let N = !1;
        DE(K) && DE(De) ? N = !Hk(K, De) : N = K !== De, N ? K != null ? Rt(ye) : A.add(ye) : K !== void 0 && A.has(ye) ? Rt(ye) : he.protectedKeys[ye] = !0;
      }
      he.prevProp = ne, he.prevResolvedValues = Mt, he.isActive && (j = { ...j, ...Mt }), p && a.blockInitialAnimation && (le = !1);
      const pt = Re && xe;
      le && (!pt || Xe) && M.push(...yt.map((ye) => {
        const K = { type: ue };
        if (typeof ye == "string" && p && !pt && a.manuallyAnimateOnMount && a.parent) {
          const { parent: De } = a, N = Nd(De, ye);
          if (De.enteringChildren && N) {
            const { delayChildren: ee } = N.transition || {};
            K.delay = Bk(De.enteringChildren, a, ee);
          }
        }
        return {
          animation: ye,
          options: K
        };
      }));
    }
    if (A.size) {
      const ie = {};
      if (typeof R.initial != "boolean") {
        const ue = Nd(a, Array.isArray(R.initial) ? R.initial[0] : R.initial);
        ue && ue.transition && (ie.transition = ue.transition);
      }
      A.forEach((ue) => {
        const he = a.getBaseTarget(ue), ne = a.getValue(ue);
        ne && (ne.liveStyle = !0), ie[ue] = he ?? null;
      }), M.push({ animation: ie });
    }
    let re = !!M.length;
    return p && (R.initial === !1 || R.initial === R.animate) && !a.manuallyAnimateOnMount && (re = !1), p = !1, re ? l(M) : Promise.resolve();
  }
  function x(b, R) {
    var M;
    if (c[b].isActive === R)
      return Promise.resolve();
    (M = a.variantChildren) == null || M.forEach((A) => {
      var j;
      return (j = A.animationState) == null ? void 0 : j.setActive(b, R);
    }), c[b].isActive = R;
    const D = h(b);
    for (const A in c)
      c[A].protectedKeys = {};
    return D;
  }
  return {
    animateChanges: h,
    setActive: x,
    setAnimateFunction: E,
    getState: () => c,
    reset: () => {
      c = PR();
    }
  };
}
function Cz(a, l) {
  return typeof l == "string" ? l !== a : Array.isArray(l) ? !Hk(l, a) : !1;
}
function zc(a = !1) {
  return {
    isActive: a,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function PR() {
  return {
    animate: zc(!0),
    whileInView: zc(),
    whileHover: zc(),
    whileTap: zc(),
    whileDrag: zc(),
    whileFocus: zc(),
    exit: zc()
  };
}
class Mu {
  constructor(l) {
    this.isMounted = !1, this.node = l;
  }
  update() {
  }
}
class Ez extends Mu {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(l) {
    super(l), l.animationState || (l.animationState = Sz(l));
  }
  updateAnimationControlsSubscription() {
    const { animate: l } = this.node.getProps();
    xg(l) && (this.unmountControls = l.subscribe(this.node));
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate: l } = this.node.getProps(), { animate: c } = this.node.prevProps || {};
    l !== c && this.updateAnimationControlsSubscription();
  }
  unmount() {
    var l;
    this.node.animationState.reset(), (l = this.unmountControls) == null || l.call(this);
  }
}
let Tz = 0;
class bz extends Mu {
  constructor() {
    super(...arguments), this.id = Tz++;
  }
  update() {
    if (!this.node.presenceContext)
      return;
    const { isPresent: l, onExitComplete: c } = this.node.presenceContext, { isPresent: p } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || l === p)
      return;
    const g = this.node.animationState.setActive("exit", !l);
    c && !l && g.then(() => {
      c(this.id);
    });
  }
  mount() {
    const { register: l, onExitComplete: c } = this.node.presenceContext || {};
    c && c(this.id), l && (this.unmount = l(this.id));
  }
  unmount() {
  }
}
const xz = {
  animation: {
    Feature: Ez
  },
  exit: {
    Feature: bz
  }
};
function nm(a, l, c, p = { passive: !0 }) {
  return a.addEventListener(l, c, p), () => a.removeEventListener(l, c);
}
function om(a) {
  return {
    point: {
      x: a.pageX,
      y: a.pageY
    }
  };
}
const wz = (a) => (l) => nT(l) && a(l, om(l));
function Xh(a, l, c, p) {
  return nm(a, l, wz(c), p);
}
const Yk = 1e-4, Rz = 1 - Yk, kz = 1 + Yk, $k = 0.01, Dz = 0 - $k, _z = 0 + $k;
function Oi(a) {
  return a.max - a.min;
}
function Mz(a, l, c) {
  return Math.abs(a - l) <= c;
}
function VR(a, l, c, p = 0.5) {
  a.origin = p, a.originPoint = Pn(l.min, l.max, a.origin), a.scale = Oi(c) / Oi(l), a.translate = Pn(c.min, c.max, a.origin) - a.originPoint, (a.scale >= Rz && a.scale <= kz || isNaN(a.scale)) && (a.scale = 1), (a.translate >= Dz && a.translate <= _z || isNaN(a.translate)) && (a.translate = 0);
}
function qh(a, l, c, p) {
  VR(a.x, l.x, c.x, p ? p.originX : void 0), VR(a.y, l.y, c.y, p ? p.originY : void 0);
}
function zR(a, l, c) {
  a.min = c.min + l.min, a.max = a.min + Oi(l);
}
function Oz(a, l, c) {
  zR(a.x, l.x, c.x), zR(a.y, l.y, c.y);
}
function UR(a, l, c) {
  a.min = l.min - c.min, a.max = a.min + Oi(l);
}
function Eg(a, l, c) {
  UR(a.x, l.x, c.x), UR(a.y, l.y, c.y);
}
function qa(a) {
  return [a("x"), a("y")];
}
const Wk = ({ current: a }) => a ? a.ownerDocument.defaultView : null, FR = (a, l) => Math.abs(a - l);
function Az(a, l) {
  const c = FR(a.x, l.x), p = FR(a.y, l.y);
  return Math.sqrt(c ** 2 + p ** 2);
}
class Gk {
  constructor(l, c, { transformPagePoint: p, contextWindow: g = window, dragSnapToOrigin: E = !1, distanceThreshold: h = 3 } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const A = ZC(this.lastMoveEventInfo, this.history), j = this.startEvent !== null, q = Az(A.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
      if (!j && !q)
        return;
      const { point: re } = A, { timestamp: ie } = Zr;
      this.history.push({ ...re, timestamp: ie });
      const { onStart: ue, onMove: he } = this.handlers;
      j || (ue && ue(this.lastMoveEvent, A), this.startEvent = this.lastMoveEvent), he && he(this.lastMoveEvent, A);
    }, this.handlePointerMove = (A, j) => {
      this.lastMoveEvent = A, this.lastMoveEventInfo = qC(j, this.transformPagePoint), xn.update(this.updatePoint, !0);
    }, this.handlePointerUp = (A, j) => {
      this.end();
      const { onEnd: q, onSessionEnd: re, resumeAnimation: ie } = this.handlers;
      if (this.dragSnapToOrigin && ie && ie(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const ue = ZC(A.type === "pointercancel" ? this.lastMoveEventInfo : qC(j, this.transformPagePoint), this.history);
      this.startEvent && q && q(A, ue), re && re(A, ue);
    }, !nT(l))
      return;
    this.dragSnapToOrigin = E, this.handlers = c, this.transformPagePoint = p, this.distanceThreshold = h, this.contextWindow = g || window;
    const x = om(l), b = qC(x, this.transformPagePoint), { point: R } = b, { timestamp: D } = Zr;
    this.history = [{ ...R, timestamp: D }];
    const { onSessionStart: M } = c;
    M && M(l, ZC(b, this.history)), this.removeListeners = rm(Xh(this.contextWindow, "pointermove", this.handlePointerMove), Xh(this.contextWindow, "pointerup", this.handlePointerUp), Xh(this.contextWindow, "pointercancel", this.handlePointerUp));
  }
  updateHandlers(l) {
    this.handlers = l;
  }
  end() {
    this.removeListeners && this.removeListeners(), Es(this.updatePoint);
  }
}
function qC(a, l) {
  return l ? { point: l(a.point) } : a;
}
function jR(a, l) {
  return { x: a.x - l.x, y: a.y - l.y };
}
function ZC({ point: a }, l) {
  return {
    point: a,
    delta: jR(a, Kk(l)),
    offset: jR(a, Lz(l)),
    velocity: Nz(l, 0.1)
  };
}
function Lz(a) {
  return a[0];
}
function Kk(a) {
  return a[a.length - 1];
}
function Nz(a, l) {
  if (a.length < 2)
    return { x: 0, y: 0 };
  let c = a.length - 1, p = null;
  const g = Kk(a);
  for (; c >= 0 && (p = a[c], !(g.timestamp - p.timestamp > /* @__PURE__ */ zo(l))); )
    c--;
  if (!p)
    return { x: 0, y: 0 };
  const E = /* @__PURE__ */ Za(g.timestamp - p.timestamp);
  if (E === 0)
    return { x: 0, y: 0 };
  const h = {
    x: (g.x - p.x) / E,
    y: (g.y - p.y) / E
  };
  return h.x === 1 / 0 && (h.x = 0), h.y === 1 / 0 && (h.y = 0), h;
}
function Pz(a, { min: l, max: c }, p) {
  return l !== void 0 && a < l ? a = p ? Pn(l, a, p.min) : Math.max(a, l) : c !== void 0 && a > c && (a = p ? Pn(c, a, p.max) : Math.min(a, c)), a;
}
function BR(a, l, c) {
  return {
    min: l !== void 0 ? a.min + l : void 0,
    max: c !== void 0 ? a.max + c - (a.max - a.min) : void 0
  };
}
function Vz(a, { top: l, left: c, bottom: p, right: g }) {
  return {
    x: BR(a.x, c, g),
    y: BR(a.y, l, p)
  };
}
function HR(a, l) {
  let c = l.min - a.min, p = l.max - a.max;
  return l.max - l.min < a.max - a.min && ([c, p] = [p, c]), { min: c, max: p };
}
function zz(a, l) {
  return {
    x: HR(a.x, l.x),
    y: HR(a.y, l.y)
  };
}
function Uz(a, l) {
  let c = 0.5;
  const p = Oi(a), g = Oi(l);
  return g > p ? c = /* @__PURE__ */ Zh(l.min, l.max - p, a.min) : p > g && (c = /* @__PURE__ */ Zh(a.min, a.max - g, l.min)), gs(0, 1, c);
}
function Fz(a, l) {
  const c = {};
  return l.min !== void 0 && (c.min = l.min - a.min), l.max !== void 0 && (c.max = l.max - a.min), c;
}
const OE = 0.35;
function jz(a = OE) {
  return a === !1 ? a = 0 : a === !0 && (a = OE), {
    x: IR(a, "left", "right"),
    y: IR(a, "top", "bottom")
  };
}
function IR(a, l, c) {
  return {
    min: YR(a, l),
    max: YR(a, c)
  };
}
function YR(a, l) {
  return typeof a == "number" ? a : a[l] || 0;
}
const Bz = /* @__PURE__ */ new WeakMap();
class Hz {
  constructor(l) {
    this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = Rr(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = l;
  }
  start(l, { snapToCursor: c = !1, distanceThreshold: p } = {}) {
    const { presenceContext: g } = this.visualElement;
    if (g && g.isPresent === !1)
      return;
    const E = (M) => {
      const { dragSnapToOrigin: A } = this.getProps();
      A ? this.pauseAnimation() : this.stopAnimation(), c && this.snapToCursor(om(M).point);
    }, h = (M, A) => {
      const { drag: j, dragPropagation: q, onDragStart: re } = this.getProps();
      if (j && !q && (this.openDragLock && this.openDragLock(), this.openDragLock = JP(j), !this.openDragLock))
        return;
      this.latestPointerEvent = M, this.latestPanInfo = A, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), qa((ue) => {
        let he = this.getAxisMotionValue(ue).get() || 0;
        if (wl.test(he)) {
          const { projection: ne } = this.visualElement;
          if (ne && ne.layout) {
            const Se = ne.layout.layoutBox[ue];
            Se && (he = Oi(Se) * (parseFloat(he) / 100));
          }
        }
        this.originPoint[ue] = he;
      }), re && xn.postRender(() => re(M, A)), _E(this.visualElement, "transform");
      const { animationState: ie } = this.visualElement;
      ie && ie.setActive("whileDrag", !0);
    }, x = (M, A) => {
      this.latestPointerEvent = M, this.latestPanInfo = A;
      const { dragPropagation: j, dragDirectionLock: q, onDirectionLock: re, onDrag: ie } = this.getProps();
      if (!j && !this.openDragLock)
        return;
      const { offset: ue } = A;
      if (q && this.currentDirection === null) {
        this.currentDirection = Iz(ue), this.currentDirection !== null && re && re(this.currentDirection);
        return;
      }
      this.updateAxis("x", A.point, ue), this.updateAxis("y", A.point, ue), this.visualElement.render(), ie && ie(M, A);
    }, b = (M, A) => {
      this.latestPointerEvent = M, this.latestPanInfo = A, this.stop(M, A), this.latestPointerEvent = null, this.latestPanInfo = null;
    }, R = () => qa((M) => {
      var A;
      return this.getAnimationState(M) === "paused" && ((A = this.getAxisMotionValue(M).animation) == null ? void 0 : A.play());
    }), { dragSnapToOrigin: D } = this.getProps();
    this.panSession = new Gk(l, {
      onSessionStart: E,
      onStart: h,
      onMove: x,
      onSessionEnd: b,
      resumeAnimation: R
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin: D,
      distanceThreshold: p,
      contextWindow: Wk(this.visualElement)
    });
  }
  /**
   * @internal
   */
  stop(l, c) {
    const p = l || this.latestPointerEvent, g = c || this.latestPanInfo, E = this.isDragging;
    if (this.cancel(), !E || !g || !p)
      return;
    const { velocity: h } = g;
    this.startAnimation(h);
    const { onDragEnd: x } = this.getProps();
    x && xn.postRender(() => x(p, g));
  }
  /**
   * @internal
   */
  cancel() {
    this.isDragging = !1;
    const { projection: l, animationState: c } = this.visualElement;
    l && (l.isAnimationBlocked = !1), this.panSession && this.panSession.end(), this.panSession = void 0;
    const { dragPropagation: p } = this.getProps();
    !p && this.openDragLock && (this.openDragLock(), this.openDragLock = null), c && c.setActive("whileDrag", !1);
  }
  updateAxis(l, c, p) {
    const { drag: g } = this.getProps();
    if (!p || !ug(l, g, this.currentDirection))
      return;
    const E = this.getAxisMotionValue(l);
    let h = this.originPoint[l] + p[l];
    this.constraints && this.constraints[l] && (h = Pz(h, this.constraints[l], this.elastic[l])), E.set(h);
  }
  resolveConstraints() {
    var E;
    const { dragConstraints: l, dragElastic: c } = this.getProps(), p = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : (E = this.visualElement.projection) == null ? void 0 : E.layout, g = this.constraints;
    l && Md(l) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : l && p ? this.constraints = Vz(p.layoutBox, l) : this.constraints = !1, this.elastic = jz(c), g !== this.constraints && p && this.constraints && !this.hasMutatedConstraints && qa((h) => {
      this.constraints !== !1 && this.getAxisMotionValue(h) && (this.constraints[h] = Fz(p.layoutBox[h], this.constraints[h]));
    });
  }
  resolveRefConstraints() {
    const { dragConstraints: l, onMeasureDragConstraints: c } = this.getProps();
    if (!l || !Md(l))
      return !1;
    const p = l.current;
    Ss(p !== null, "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop.", "drag-constraints-ref");
    const { projection: g } = this.visualElement;
    if (!g || !g.layout)
      return !1;
    const E = YV(p, g.root, this.visualElement.getTransformPagePoint());
    let h = zz(g.layout.layoutBox, E);
    if (c) {
      const x = c(BV(h));
      this.hasMutatedConstraints = !!x, x && (h = Ok(x));
    }
    return h;
  }
  startAnimation(l) {
    const { drag: c, dragMomentum: p, dragElastic: g, dragTransition: E, dragSnapToOrigin: h, onDragTransitionEnd: x } = this.getProps(), b = this.constraints || {}, R = qa((D) => {
      if (!ug(D, c, this.currentDirection))
        return;
      let M = b && b[D] || {};
      h && (M = { min: 0, max: 0 });
      const A = g ? 200 : 1e6, j = g ? 40 : 1e7, q = {
        type: "inertia",
        velocity: p ? l[D] : 0,
        bounceStiffness: A,
        bounceDamping: j,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...E,
        ...M
      };
      return this.startAxisValueAnimation(D, q);
    });
    return Promise.all(R).then(x);
  }
  startAxisValueAnimation(l, c) {
    const p = this.getAxisMotionValue(l);
    return _E(this.visualElement, l), p.start(dT(l, p, 0, c, this.visualElement, !1));
  }
  stopAnimation() {
    qa((l) => this.getAxisMotionValue(l).stop());
  }
  pauseAnimation() {
    qa((l) => {
      var c;
      return (c = this.getAxisMotionValue(l).animation) == null ? void 0 : c.pause();
    });
  }
  getAnimationState(l) {
    var c;
    return (c = this.getAxisMotionValue(l).animation) == null ? void 0 : c.state;
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(l) {
    const c = `_drag${l.toUpperCase()}`, p = this.visualElement.getProps(), g = p[c];
    return g || this.visualElement.getValue(l, (p.initial ? p.initial[l] : void 0) || 0);
  }
  snapToCursor(l) {
    qa((c) => {
      const { drag: p } = this.getProps();
      if (!ug(c, p, this.currentDirection))
        return;
      const { projection: g } = this.visualElement, E = this.getAxisMotionValue(c);
      if (g && g.layout) {
        const { min: h, max: x } = g.layout.layoutBox[c];
        E.set(l[c] - Pn(h, x, 0.5));
      }
    });
  }
  /**
   * When the viewport resizes we want to check if the measured constraints
   * have changed and, if so, reposition the element within those new constraints
   * relative to where it was before the resize.
   */
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag: l, dragConstraints: c } = this.getProps(), { projection: p } = this.visualElement;
    if (!Md(c) || !p || !this.constraints)
      return;
    this.stopAnimation();
    const g = { x: 0, y: 0 };
    qa((h) => {
      const x = this.getAxisMotionValue(h);
      if (x && this.constraints !== !1) {
        const b = x.get();
        g[h] = Uz({ min: b, max: b }, this.constraints[h]);
      }
    });
    const { transformTemplate: E } = this.visualElement.getProps();
    this.visualElement.current.style.transform = E ? E({}, "") : "none", p.root && p.root.updateScroll(), p.updateLayout(), this.resolveConstraints(), qa((h) => {
      if (!ug(h, l, null))
        return;
      const x = this.getAxisMotionValue(h), { min: b, max: R } = this.constraints[h];
      x.set(Pn(b, R, g[h]));
    });
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    Bz.set(this.visualElement, this);
    const l = this.visualElement.current, c = Xh(l, "pointerdown", (b) => {
      const { drag: R, dragListener: D = !0 } = this.getProps();
      R && D && this.start(b);
    }), p = () => {
      const { dragConstraints: b } = this.getProps();
      Md(b) && b.current && (this.constraints = this.resolveRefConstraints());
    }, { projection: g } = this.visualElement, E = g.addEventListener("measure", p);
    g && !g.layout && (g.root && g.root.updateScroll(), g.updateLayout()), xn.read(p);
    const h = nm(window, "resize", () => this.scalePositionWithinConstraints()), x = g.addEventListener("didUpdate", ({ delta: b, hasLayoutChanged: R }) => {
      this.isDragging && R && (qa((D) => {
        const M = this.getAxisMotionValue(D);
        M && (this.originPoint[D] += b[D].translate, M.set(M.get() + b[D].translate));
      }), this.visualElement.render());
    });
    return () => {
      h(), c(), E(), x && x();
    };
  }
  getProps() {
    const l = this.visualElement.getProps(), { drag: c = !1, dragDirectionLock: p = !1, dragPropagation: g = !1, dragConstraints: E = !1, dragElastic: h = OE, dragMomentum: x = !0 } = l;
    return {
      ...l,
      drag: c,
      dragDirectionLock: p,
      dragPropagation: g,
      dragConstraints: E,
      dragElastic: h,
      dragMomentum: x
    };
  }
}
function ug(a, l, c) {
  return (l === !0 || l === a) && (c === null || c === a);
}
function Iz(a, l = 10) {
  let c = null;
  return Math.abs(a.y) > l ? c = "y" : Math.abs(a.x) > l && (c = "x"), c;
}
class Yz extends Mu {
  constructor(l) {
    super(l), this.removeGroupControls = Ja, this.removeListeners = Ja, this.controls = new Hz(l);
  }
  mount() {
    const { dragControls: l } = this.node.getProps();
    l && (this.removeGroupControls = l.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || Ja;
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners();
  }
}
const $R = (a) => (l, c) => {
  a && xn.postRender(() => a(l, c));
};
class $z extends Mu {
  constructor() {
    super(...arguments), this.removePointerDownListener = Ja;
  }
  onPointerDown(l) {
    this.session = new Gk(l, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: Wk(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: l, onPanStart: c, onPan: p, onPanEnd: g } = this.node.getProps();
    return {
      onSessionStart: $R(l),
      onStart: $R(c),
      onMove: p,
      onEnd: (E, h) => {
        delete this.session, g && xn.postRender(() => g(E, h));
      }
    };
  }
  mount() {
    this.removePointerDownListener = Xh(this.node.current, "pointerdown", (l) => this.onPointerDown(l));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener(), this.session && this.session.end();
  }
}
const mg = {
  /**
   * Global flag as to whether the tree has animated since the last time
   * we resized the window
   */
  hasAnimatedSinceResize: !0,
  /**
   * We set this to true once, on the first update. Any nodes added to the tree beyond that
   * update will be given a `data-projection-id` attribute.
   */
  hasEverUpdated: !1
};
let JC = !1;
class Wz extends at.Component {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement: l, layoutGroup: c, switchLayoutGroup: p, layoutId: g } = this.props, { projection: E } = l;
    E && (c.group && c.group.add(E), p && p.register && g && p.register(E), JC && E.root.didUpdate(), E.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), E.setOptions({
      ...E.options,
      onExitComplete: () => this.safeToRemove()
    })), mg.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(l) {
    const { layoutDependency: c, visualElement: p, drag: g, isPresent: E } = this.props, { projection: h } = p;
    return h && (h.isPresent = E, JC = !0, g || l.layoutDependency !== c || c === void 0 || l.isPresent !== E ? h.willUpdate() : this.safeToRemove(), l.isPresent !== E && (E ? h.promote() : h.relegate() || xn.postRender(() => {
      const x = h.getStack();
      (!x || !x.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { projection: l } = this.props.visualElement;
    l && (l.root.didUpdate(), tT.postRender(() => {
      !l.currentAnimation && l.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement: l, layoutGroup: c, switchLayoutGroup: p } = this.props, { projection: g } = l;
    JC = !0, g && (g.scheduleCheckAfterUnmount(), c && c.group && c.group.remove(g), p && p.deregister && p.deregister(g));
  }
  safeToRemove() {
    const { safeToRemove: l } = this.props;
    l && l();
  }
  render() {
    return null;
  }
}
function Qk(a) {
  const [l, c] = sV(), p = at.useContext(w1);
  return Jn.jsx(Wz, { ...a, layoutGroup: p, switchLayoutGroup: at.useContext(_k), isPresent: l, safeToRemove: c });
}
function Gz(a, l, c) {
  const p = Vr(a) ? a : Yc(a);
  return p.start(dT("", p, l, c)), p.animation;
}
const Kz = (a, l) => a.depth - l.depth;
class Qz {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(l) {
    zE(this.children, l), this.isDirty = !0;
  }
  remove(l) {
    UE(this.children, l), this.isDirty = !0;
  }
  forEach(l) {
    this.isDirty && this.children.sort(Kz), this.isDirty = !1, this.children.forEach(l);
  }
}
function Xz(a, l) {
  const c = na.now(), p = ({ timestamp: g }) => {
    const E = g - c;
    E >= l && (Es(p), a(E - l));
  };
  return xn.setup(p, !0), () => Es(p);
}
const Xk = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"], qz = Xk.length, WR = (a) => typeof a == "string" ? parseFloat(a) : a, GR = (a) => typeof a == "number" || ct.test(a);
function Zz(a, l, c, p, g, E) {
  g ? (a.opacity = Pn(0, c.opacity ?? 1, Jz(p)), a.opacityExit = Pn(l.opacity ?? 1, 0, eU(p))) : E && (a.opacity = Pn(l.opacity ?? 1, c.opacity ?? 1, p));
  for (let h = 0; h < qz; h++) {
    const x = `border${Xk[h]}Radius`;
    let b = KR(l, x), R = KR(c, x);
    if (b === void 0 && R === void 0)
      continue;
    b || (b = 0), R || (R = 0), b === 0 || R === 0 || GR(b) === GR(R) ? (a[x] = Math.max(Pn(WR(b), WR(R), p), 0), (wl.test(R) || wl.test(b)) && (a[x] += "%")) : a[x] = R;
  }
  (l.rotate || c.rotate) && (a.rotate = Pn(l.rotate || 0, c.rotate || 0, p));
}
function KR(a, l) {
  return a[l] !== void 0 ? a[l] : a.borderRadius;
}
const Jz = /* @__PURE__ */ qk(0, 0.5, U1), eU = /* @__PURE__ */ qk(0.5, 0.95, Ja);
function qk(a, l, c) {
  return (p) => p < a ? 0 : p > l ? 1 : c(/* @__PURE__ */ Zh(a, l, p));
}
function QR(a, l) {
  a.min = l.min, a.max = l.max;
}
function Po(a, l) {
  QR(a.x, l.x), QR(a.y, l.y);
}
function XR(a, l) {
  a.translate = l.translate, a.scale = l.scale, a.originPoint = l.originPoint, a.origin = l.origin;
}
function qR(a, l, c, p, g) {
  return a -= l, a = Cg(a, 1 / c, p), g !== void 0 && (a = Cg(a, 1 / g, p)), a;
}
function tU(a, l = 0, c = 1, p = 0.5, g, E = a, h = a) {
  if (wl.test(l) && (l = parseFloat(l), l = Pn(h.min, h.max, l / 100) - h.min), typeof l != "number")
    return;
  let x = Pn(E.min, E.max, p);
  a === E && (x -= l), a.min = qR(a.min, l, c, x, g), a.max = qR(a.max, l, c, x, g);
}
function ZR(a, l, [c, p, g], E, h) {
  tU(a, l[c], l[p], l[g], l.scale, E, h);
}
const nU = ["x", "scaleX", "originX"], rU = ["y", "scaleY", "originY"];
function JR(a, l, c, p) {
  ZR(a.x, l, nU, c ? c.x : void 0, p ? p.x : void 0), ZR(a.y, l, rU, c ? c.y : void 0, p ? p.y : void 0);
}
function e1(a) {
  return a.translate === 0 && a.scale === 1;
}
function Zk(a) {
  return e1(a.x) && e1(a.y);
}
function t1(a, l) {
  return a.min === l.min && a.max === l.max;
}
function iU(a, l) {
  return t1(a.x, l.x) && t1(a.y, l.y);
}
function n1(a, l) {
  return Math.round(a.min) === Math.round(l.min) && Math.round(a.max) === Math.round(l.max);
}
function Jk(a, l) {
  return n1(a.x, l.x) && n1(a.y, l.y);
}
function r1(a) {
  return Oi(a.x) / Oi(a.y);
}
function i1(a, l) {
  return a.translate === l.translate && a.scale === l.scale && a.originPoint === l.originPoint;
}
class aU {
  constructor() {
    this.members = [];
  }
  add(l) {
    zE(this.members, l), l.scheduleRender();
  }
  remove(l) {
    if (UE(this.members, l), l === this.prevLead && (this.prevLead = void 0), l === this.lead) {
      const c = this.members[this.members.length - 1];
      c && this.promote(c);
    }
  }
  relegate(l) {
    const c = this.members.findIndex((g) => l === g);
    if (c === 0)
      return !1;
    let p;
    for (let g = c; g >= 0; g--) {
      const E = this.members[g];
      if (E.isPresent !== !1) {
        p = E;
        break;
      }
    }
    return p ? (this.promote(p), !0) : !1;
  }
  promote(l, c) {
    const p = this.lead;
    if (l !== p && (this.prevLead = p, this.lead = l, l.show(), p)) {
      p.instance && p.scheduleRender(), l.scheduleRender(), l.resumeFrom = p, c && (l.resumeFrom.preserveOpacity = !0), p.snapshot && (l.snapshot = p.snapshot, l.snapshot.latestValues = p.animationValues || p.latestValues), l.root && l.root.isUpdating && (l.isLayoutDirty = !0);
      const { crossfade: g } = l.options;
      g === !1 && p.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((l) => {
      const { options: c, resumingFrom: p } = l;
      c.onExitComplete && c.onExitComplete(), p && p.options.onExitComplete && p.options.onExitComplete();
    });
  }
  scheduleRender() {
    this.members.forEach((l) => {
      l.instance && l.scheduleRender(!1);
    });
  }
  /**
   * Clear any leads that have been removed this render to prevent them from being
   * used in future animations and to prevent memory leaks
   */
  removeLeadSnapshot() {
    this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
  }
}
function oU(a, l, c) {
  let p = "";
  const g = a.x.translate / l.x, E = a.y.translate / l.y, h = (c == null ? void 0 : c.z) || 0;
  if ((g || E || h) && (p = `translate3d(${g}px, ${E}px, ${h}px) `), (l.x !== 1 || l.y !== 1) && (p += `scale(${1 / l.x}, ${1 / l.y}) `), c) {
    const { transformPerspective: R, rotate: D, rotateX: M, rotateY: A, skewX: j, skewY: q } = c;
    R && (p = `perspective(${R}px) ${p}`), D && (p += `rotate(${D}deg) `), M && (p += `rotateX(${M}deg) `), A && (p += `rotateY(${A}deg) `), j && (p += `skewX(${j}deg) `), q && (p += `skewY(${q}deg) `);
  }
  const x = a.x.scale * l.x, b = a.y.scale * l.y;
  return (x !== 1 || b !== 1) && (p += `scale(${x}, ${b})`), p || "none";
}
const eE = ["", "X", "Y", "Z"], lU = 1e3;
let sU = 0;
function tE(a, l, c, p) {
  const { latestValues: g } = l;
  g[a] && (c[a] = g[a], l.setStaticValue(a, 0), p && (p[a] = 0));
}
function eD(a) {
  if (a.hasCheckedOptimisedAppear = !0, a.root === a)
    return;
  const { visualElement: l } = a.options;
  if (!l)
    return;
  const c = Fk(l);
  if (window.MotionHasOptimisedAnimation(c, "transform")) {
    const { layout: g, layoutId: E } = a.options;
    window.MotionCancelOptimisedAnimation(c, "transform", xn, !(g || E));
  }
  const { parent: p } = a;
  p && !p.hasCheckedOptimisedAppear && eD(p);
}
function tD({ attachResizeListener: a, defaultParent: l, measureScroll: c, checkIsScrollRoot: p, resetTransform: g }) {
  return class {
    constructor(h = {}, x = l == null ? void 0 : l()) {
      this.id = sU++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.layoutVersion = 0, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, this.nodes.forEach(fU), this.nodes.forEach(mU), this.nodes.forEach(vU), this.nodes.forEach(dU);
      }, this.resolvedRelativeTargetAt = 0, this.linkedParentVersion = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = h, this.root = x ? x.root || x : this, this.path = x ? [...x.path, x] : [], this.parent = x, this.depth = x ? x.depth + 1 : 0;
      for (let b = 0; b < this.path.length; b++)
        this.path[b].shouldResetTransform = !0;
      this.root === this && (this.nodes = new Qz());
    }
    addEventListener(h, x) {
      return this.eventHandlers.has(h) || this.eventHandlers.set(h, new jE()), this.eventHandlers.get(h).add(x);
    }
    notifyListeners(h, ...x) {
      const b = this.eventHandlers.get(h);
      b && b.notify(...x);
    }
    hasListeners(h) {
      return this.eventHandlers.has(h);
    }
    /**
     * Lifecycles
     */
    mount(h) {
      if (this.instance)
        return;
      this.isSVG = yk(h) && !aV(h), this.instance = h;
      const { layoutId: x, layout: b, visualElement: R } = this.options;
      if (R && !R.current && R.mount(h), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (b || x) && (this.isLayoutDirty = !0), a) {
        let D, M = 0;
        const A = () => this.root.updateBlockedByResize = !1;
        xn.read(() => {
          M = window.innerWidth;
        }), a(h, () => {
          const j = window.innerWidth;
          j !== M && (M = j, this.root.updateBlockedByResize = !0, D && D(), D = Xz(A, 250), mg.hasAnimatedSinceResize && (mg.hasAnimatedSinceResize = !1, this.nodes.forEach(l1)));
        });
      }
      x && this.root.registerSharedNode(x, this), this.options.animate !== !1 && R && (x || b) && this.addEventListener("didUpdate", ({ delta: D, hasLayoutChanged: M, hasRelativeLayoutChanged: A, layout: j }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const q = this.options.transition || R.getDefaultTransition() || EU, { onLayoutAnimationStart: re, onLayoutAnimationComplete: ie } = R.getProps(), ue = !this.targetLayout || !Jk(this.targetLayout, j), he = !M && A;
        if (this.options.layoutRoot || this.resumeFrom || he || M && (ue || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
          const ne = {
            ...JE(q, "layout"),
            onPlay: re,
            onComplete: ie
          };
          (R.shouldReduceMotion || this.options.layoutRoot) && (ne.delay = 0, ne.type = !1), this.startAnimation(ne), this.setAnimationOrigin(D, he);
        } else
          M || l1(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
        this.targetLayout = j;
      });
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const h = this.getStack();
      h && h.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), Es(this.updateProjection);
    }
    // only on the root
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1;
    }
    // Note: currently only running on root node
    startUpdate() {
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(yU), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: h } = this.options;
      return h && h.getProps().transformTemplate;
    }
    willUpdate(h = !0) {
      if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && eD(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
        return;
      this.isLayoutDirty = !0;
      for (let D = 0; D < this.path.length; D++) {
        const M = this.path[D];
        M.shouldResetTransform = !0, M.updateScroll("snapshot"), M.options.layoutRoot && M.willUpdate(!1);
      }
      const { layoutId: x, layout: b } = this.options;
      if (x === void 0 && !b)
        return;
      const R = this.getTransformTemplate();
      this.prevTransformTemplateValue = R ? R(this.latestValues, "") : void 0, this.updateSnapshot(), h && this.notifyListeners("willUpdate");
    }
    update() {
      if (this.updateScheduled = !1, this.isUpdateBlocked()) {
        this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(a1);
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(o1);
        return;
      }
      this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(hU), this.nodes.forEach(uU), this.nodes.forEach(cU)) : this.nodes.forEach(o1), this.clearAllSnapshots();
      const x = na.now();
      Zr.delta = gs(0, 1e3 / 60, x - Zr.timestamp), Zr.timestamp = x, Zr.isProcessing = !0, IC.update.process(Zr), IC.preRender.process(Zr), IC.render.process(Zr), Zr.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, tT.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach(pU), this.sharedNodes.forEach(gU);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, xn.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      xn.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure(), this.snapshot && !Oi(this.snapshot.measuredBox.x) && !Oi(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
    }
    updateLayout() {
      if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty))
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let b = 0; b < this.path.length; b++)
          this.path[b].updateScroll();
      const h = this.layout;
      this.layout = this.measure(!1), this.layoutVersion++, this.layoutCorrected = Rr(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement: x } = this.options;
      x && x.notify("LayoutMeasure", this.layout.layoutBox, h ? h.layoutBox : void 0);
    }
    updateScroll(h = "measure") {
      let x = !!(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === h && (x = !1), x && this.instance) {
        const b = p(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: h,
          isRoot: b,
          offset: c(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : b
        };
      }
    }
    resetTransform() {
      if (!g)
        return;
      const h = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, x = this.projectionDelta && !Zk(this.projectionDelta), b = this.getTransformTemplate(), R = b ? b(this.latestValues, "") : void 0, D = R !== this.prevTransformTemplateValue;
      h && this.instance && (x || Fc(this.latestValues) || D) && (g(this.instance, R), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(h = !0) {
      const x = this.measurePageBox();
      let b = this.removeElementScroll(x);
      return h && (b = this.removeTransform(b)), TU(b), {
        animationId: this.root.animationId,
        measuredBox: x,
        layoutBox: b,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      var R;
      const { visualElement: h } = this.options;
      if (!h)
        return Rr();
      const x = h.measureViewportBox();
      if (!(((R = this.scroll) == null ? void 0 : R.wasRoot) || this.path.some(bU))) {
        const { scroll: D } = this.root;
        D && (Od(x.x, D.offset.x), Od(x.y, D.offset.y));
      }
      return x;
    }
    removeElementScroll(h) {
      var b;
      const x = Rr();
      if (Po(x, h), (b = this.scroll) != null && b.wasRoot)
        return x;
      for (let R = 0; R < this.path.length; R++) {
        const D = this.path[R], { scroll: M, options: A } = D;
        D !== this.root && M && A.layoutScroll && (M.wasRoot && Po(x, h), Od(x.x, M.offset.x), Od(x.y, M.offset.y));
      }
      return x;
    }
    applyTransform(h, x = !1) {
      const b = Rr();
      Po(b, h);
      for (let R = 0; R < this.path.length; R++) {
        const D = this.path[R];
        !x && D.options.layoutScroll && D.scroll && D !== D.root && Ad(b, {
          x: -D.scroll.offset.x,
          y: -D.scroll.offset.y
        }), Fc(D.latestValues) && Ad(b, D.latestValues);
      }
      return Fc(this.latestValues) && Ad(b, this.latestValues), b;
    }
    removeTransform(h) {
      const x = Rr();
      Po(x, h);
      for (let b = 0; b < this.path.length; b++) {
        const R = this.path[b];
        if (!R.instance || !Fc(R.latestValues))
          continue;
        wE(R.latestValues) && R.updateSnapshot();
        const D = Rr(), M = R.measurePageBox();
        Po(D, M), JR(x, R.latestValues, R.snapshot ? R.snapshot.layoutBox : void 0, D);
      }
      return Fc(this.latestValues) && JR(x, this.latestValues), x;
    }
    setTargetDelta(h) {
      this.targetDelta = h, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
    }
    setOptions(h) {
      this.options = {
        ...this.options,
        ...h,
        crossfade: h.crossfade !== void 0 ? h.crossfade : !0
      };
    }
    clearMeasurements() {
      this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== Zr.timestamp && this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(h = !1) {
      var j;
      const x = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = x.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = x.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = x.isSharedProjectionDirty);
      const b = !!this.resumingFrom || this !== x;
      if (!(h || b && this.isSharedProjectionDirty || this.isProjectionDirty || (j = this.parent) != null && j.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
        return;
      const { layout: D, layoutId: M } = this.options;
      if (!this.layout || !(D || M))
        return;
      this.resolvedRelativeTargetAt = Zr.timestamp;
      const A = this.getClosestProjectingParent();
      A && this.linkedParentVersion !== A.layoutVersion && !A.options.layoutRoot && this.removeRelativeTarget(), !this.targetDelta && !this.relativeTarget && (A && A.layout ? this.createRelativeTarget(A, this.layout.layoutBox, A.layout.layoutBox) : this.removeRelativeTarget()), !(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = Rr(), this.targetWithTransforms = Rr()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), Oz(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : Po(this.target, this.layout.layoutBox), Lk(this.target, this.targetDelta)) : Po(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget && (this.attemptToResolveRelativeTarget = !1, A && !!A.resumingFrom == !!this.resumingFrom && !A.options.layoutScroll && A.target && this.animationProgress !== 1 ? this.createRelativeTarget(A, this.target, A.target) : this.relativeParent = this.relativeTarget = void 0));
    }
    getClosestProjectingParent() {
      if (!(!this.parent || wE(this.parent.latestValues) || Ak(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    createRelativeTarget(h, x, b) {
      this.relativeParent = h, this.linkedParentVersion = h.layoutVersion, this.forceRelativeParentToResolveTarget(), this.relativeTarget = Rr(), this.relativeTargetOrigin = Rr(), Eg(this.relativeTargetOrigin, x, b), Po(this.relativeTarget, this.relativeTargetOrigin);
    }
    removeRelativeTarget() {
      this.relativeParent = this.relativeTarget = void 0;
    }
    calcProjection() {
      var q;
      const h = this.getLead(), x = !!this.resumingFrom || this !== h;
      let b = !0;
      if ((this.isProjectionDirty || (q = this.parent) != null && q.isProjectionDirty) && (b = !1), x && (this.isSharedProjectionDirty || this.isTransformDirty) && (b = !1), this.resolvedRelativeTargetAt === Zr.timestamp && (b = !1), b)
        return;
      const { layout: R, layoutId: D } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(R || D))
        return;
      Po(this.layoutCorrected, this.layout.layoutBox);
      const M = this.treeScale.x, A = this.treeScale.y;
      IV(this.layoutCorrected, this.treeScale, this.path, x), h.layout && !h.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (h.target = h.layout.layoutBox, h.targetWithTransforms = Rr());
      const { target: j } = h;
      if (!j) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (XR(this.prevProjectionDelta.x, this.projectionDelta.x), XR(this.prevProjectionDelta.y, this.projectionDelta.y)), qh(this.projectionDelta, this.layoutCorrected, j, this.latestValues), (this.treeScale.x !== M || this.treeScale.y !== A || !i1(this.projectionDelta.x, this.prevProjectionDelta.x) || !i1(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", j));
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(h = !0) {
      var x;
      if ((x = this.options.visualElement) == null || x.scheduleRender(), h) {
        const b = this.getStack();
        b && b.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = Ld(), this.projectionDelta = Ld(), this.projectionDeltaWithTransform = Ld();
    }
    setAnimationOrigin(h, x = !1) {
      const b = this.snapshot, R = b ? b.latestValues : {}, D = { ...this.latestValues }, M = Ld();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !x;
      const A = Rr(), j = b ? b.source : void 0, q = this.layout ? this.layout.source : void 0, re = j !== q, ie = this.getStack(), ue = !ie || ie.members.length <= 1, he = !!(re && !ue && this.options.crossfade === !0 && !this.path.some(CU));
      this.animationProgress = 0;
      let ne;
      this.mixTargetDelta = (Se) => {
        const ae = Se / 1e3;
        s1(M.x, h.x, ae), s1(M.y, h.y, ae), this.setTargetDelta(M), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (Eg(A, this.layout.layoutBox, this.relativeParent.layout.layoutBox), SU(this.relativeTarget, this.relativeTargetOrigin, A, ae), ne && iU(this.relativeTarget, ne) && (this.isProjectionDirty = !1), ne || (ne = Rr()), Po(ne, this.relativeTarget)), re && (this.animationValues = D, Zz(D, R, this.latestValues, ae, he, ue)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = ae;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(h) {
      var x, b, R;
      this.notifyListeners("animationStart"), (x = this.currentAnimation) == null || x.stop(), (R = (b = this.resumingFrom) == null ? void 0 : b.currentAnimation) == null || R.stop(), this.pendingAnimation && (Es(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = xn.update(() => {
        mg.hasAnimatedSinceResize = !0, this.motionValue || (this.motionValue = Yc(0)), this.currentAnimation = Gz(this.motionValue, [0, 1e3], {
          ...h,
          velocity: 0,
          isSync: !0,
          onUpdate: (D) => {
            this.mixTargetDelta(D), h.onUpdate && h.onUpdate(D);
          },
          onStop: () => {
          },
          onComplete: () => {
            h.onComplete && h.onComplete(), this.completeAnimation();
          }
        }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
      const h = this.getStack();
      h && h.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(lU), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const h = this.getLead();
      let { targetWithTransforms: x, target: b, layout: R, latestValues: D } = h;
      if (!(!x || !b || !R)) {
        if (this !== h && this.layout && R && nD(this.options.animationType, this.layout.layoutBox, R.layoutBox)) {
          b = this.target || Rr();
          const M = Oi(this.layout.layoutBox.x);
          b.x.min = h.target.x.min, b.x.max = b.x.min + M;
          const A = Oi(this.layout.layoutBox.y);
          b.y.min = h.target.y.min, b.y.max = b.y.min + A;
        }
        Po(x, b), Ad(x, D), qh(this.projectionDeltaWithTransform, this.layoutCorrected, x, D);
      }
    }
    registerSharedNode(h, x) {
      this.sharedNodes.has(h) || this.sharedNodes.set(h, new aU()), this.sharedNodes.get(h).add(x);
      const R = x.options.initialPromotionConfig;
      x.promote({
        transition: R ? R.transition : void 0,
        preserveFollowOpacity: R && R.shouldPreserveFollowOpacity ? R.shouldPreserveFollowOpacity(x) : void 0
      });
    }
    isLead() {
      const h = this.getStack();
      return h ? h.lead === this : !0;
    }
    getLead() {
      var x;
      const { layoutId: h } = this.options;
      return h ? ((x = this.getStack()) == null ? void 0 : x.lead) || this : this;
    }
    getPrevLead() {
      var x;
      const { layoutId: h } = this.options;
      return h ? (x = this.getStack()) == null ? void 0 : x.prevLead : void 0;
    }
    getStack() {
      const { layoutId: h } = this.options;
      if (h)
        return this.root.sharedNodes.get(h);
    }
    promote({ needsReset: h, transition: x, preserveFollowOpacity: b } = {}) {
      const R = this.getStack();
      R && R.promote(this, b), h && (this.projectionDelta = void 0, this.needsReset = !0), x && this.setOptions({ transition: x });
    }
    relegate() {
      const h = this.getStack();
      return h ? h.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: h } = this.options;
      if (!h)
        return;
      let x = !1;
      const { latestValues: b } = h;
      if ((b.z || b.rotate || b.rotateX || b.rotateY || b.rotateZ || b.skewX || b.skewY) && (x = !0), !x)
        return;
      const R = {};
      b.z && tE("z", h, R, this.animationValues);
      for (let D = 0; D < eE.length; D++)
        tE(`rotate${eE[D]}`, h, R, this.animationValues), tE(`skew${eE[D]}`, h, R, this.animationValues);
      h.render();
      for (const D in R)
        h.setStaticValue(D, R[D]), this.animationValues && (this.animationValues[D] = R[D]);
      h.scheduleRender();
    }
    applyProjectionStyles(h, x) {
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible) {
        h.visibility = "hidden";
        return;
      }
      const b = this.getTransformTemplate();
      if (this.needsReset) {
        this.needsReset = !1, h.visibility = "", h.opacity = "", h.pointerEvents = hg(x == null ? void 0 : x.pointerEvents) || "", h.transform = b ? b(this.latestValues, "") : "none";
        return;
      }
      const R = this.getLead();
      if (!this.projectionDelta || !this.layout || !R.target) {
        this.options.layoutId && (h.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, h.pointerEvents = hg(x == null ? void 0 : x.pointerEvents) || ""), this.hasProjected && !Fc(this.latestValues) && (h.transform = b ? b({}, "") : "none", this.hasProjected = !1);
        return;
      }
      h.visibility = "";
      const D = R.animationValues || R.latestValues;
      this.applyTransformsToTarget();
      let M = oU(this.projectionDeltaWithTransform, this.treeScale, D);
      b && (M = b(D, M)), h.transform = M;
      const { x: A, y: j } = this.projectionDelta;
      h.transformOrigin = `${A.origin * 100}% ${j.origin * 100}% 0`, R.animationValues ? h.opacity = R === this ? D.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : D.opacityExit : h.opacity = R === this ? D.opacity !== void 0 ? D.opacity : "" : D.opacityExit !== void 0 ? D.opacityExit : 0;
      for (const q in xE) {
        if (D[q] === void 0)
          continue;
        const { correct: re, applyTo: ie, isCSSVariable: ue } = xE[q], he = M === "none" ? D[q] : re(D[q], R);
        if (ie) {
          const ne = ie.length;
          for (let Se = 0; Se < ne; Se++)
            h[ie[Se]] = he;
        } else
          ue ? this.options.visualElement.renderState.vars[q] = he : h[q] = he;
      }
      this.options.layoutId && (h.pointerEvents = R === this ? hg(x == null ? void 0 : x.pointerEvents) || "" : "none");
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((h) => {
        var x;
        return (x = h.currentAnimation) == null ? void 0 : x.stop();
      }), this.root.nodes.forEach(a1), this.root.sharedNodes.clear();
    }
  };
}
function uU(a) {
  a.updateLayout();
}
function cU(a) {
  var c;
  const l = ((c = a.resumeFrom) == null ? void 0 : c.snapshot) || a.snapshot;
  if (a.isLead() && a.layout && l && a.hasListeners("didUpdate")) {
    const { layoutBox: p, measuredBox: g } = a.layout, { animationType: E } = a.options, h = l.source !== a.layout.source;
    E === "size" ? qa((M) => {
      const A = h ? l.measuredBox[M] : l.layoutBox[M], j = Oi(A);
      A.min = p[M].min, A.max = A.min + j;
    }) : nD(E, l.layoutBox, p) && qa((M) => {
      const A = h ? l.measuredBox[M] : l.layoutBox[M], j = Oi(p[M]);
      A.max = A.min + j, a.relativeTarget && !a.currentAnimation && (a.isProjectionDirty = !0, a.relativeTarget[M].max = a.relativeTarget[M].min + j);
    });
    const x = Ld();
    qh(x, p, l.layoutBox);
    const b = Ld();
    h ? qh(b, a.applyTransform(g, !0), l.measuredBox) : qh(b, p, l.layoutBox);
    const R = !Zk(x);
    let D = !1;
    if (!a.resumeFrom) {
      const M = a.getClosestProjectingParent();
      if (M && !M.resumeFrom) {
        const { snapshot: A, layout: j } = M;
        if (A && j) {
          const q = Rr();
          Eg(q, l.layoutBox, A.layoutBox);
          const re = Rr();
          Eg(re, p, j.layoutBox), Jk(q, re) || (D = !0), M.options.layoutRoot && (a.relativeTarget = re, a.relativeTargetOrigin = q, a.relativeParent = M);
        }
      }
    }
    a.notifyListeners("didUpdate", {
      layout: p,
      snapshot: l,
      delta: b,
      layoutDelta: x,
      hasLayoutChanged: R,
      hasRelativeLayoutChanged: D
    });
  } else if (a.isLead()) {
    const { onExitComplete: p } = a.options;
    p && p();
  }
  a.options.transition = void 0;
}
function fU(a) {
  a.parent && (a.isProjecting() || (a.isProjectionDirty = a.parent.isProjectionDirty), a.isSharedProjectionDirty || (a.isSharedProjectionDirty = !!(a.isProjectionDirty || a.parent.isProjectionDirty || a.parent.isSharedProjectionDirty)), a.isTransformDirty || (a.isTransformDirty = a.parent.isTransformDirty));
}
function dU(a) {
  a.isProjectionDirty = a.isSharedProjectionDirty = a.isTransformDirty = !1;
}
function pU(a) {
  a.clearSnapshot();
}
function a1(a) {
  a.clearMeasurements();
}
function o1(a) {
  a.isLayoutDirty = !1;
}
function hU(a) {
  const { visualElement: l } = a.options;
  l && l.getProps().onBeforeLayoutMeasure && l.notify("BeforeLayoutMeasure"), a.resetTransform();
}
function l1(a) {
  a.finishAnimation(), a.targetDelta = a.relativeTarget = a.target = void 0, a.isProjectionDirty = !0;
}
function mU(a) {
  a.resolveTargetDelta();
}
function vU(a) {
  a.calcProjection();
}
function yU(a) {
  a.resetSkewAndRotation();
}
function gU(a) {
  a.removeLeadSnapshot();
}
function s1(a, l, c) {
  a.translate = Pn(l.translate, 0, c), a.scale = Pn(l.scale, 1, c), a.origin = l.origin, a.originPoint = l.originPoint;
}
function u1(a, l, c, p) {
  a.min = Pn(l.min, c.min, p), a.max = Pn(l.max, c.max, p);
}
function SU(a, l, c, p) {
  u1(a.x, l.x, c.x, p), u1(a.y, l.y, c.y, p);
}
function CU(a) {
  return a.animationValues && a.animationValues.opacityExit !== void 0;
}
const EU = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, c1 = (a) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(a), f1 = c1("applewebkit/") && !c1("chrome/") ? Math.round : Ja;
function d1(a) {
  a.min = f1(a.min), a.max = f1(a.max);
}
function TU(a) {
  d1(a.x), d1(a.y);
}
function nD(a, l, c) {
  return a === "position" || a === "preserve-aspect" && !Mz(r1(l), r1(c), 0.2);
}
function bU(a) {
  var l;
  return a !== a.root && ((l = a.scroll) == null ? void 0 : l.wasRoot);
}
const xU = tD({
  attachResizeListener: (a, l) => nm(a, "resize", l),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop
  }),
  checkIsScrollRoot: () => !0
}), nE = {
  current: void 0
}, rD = tD({
  measureScroll: (a) => ({
    x: a.scrollLeft,
    y: a.scrollTop
  }),
  defaultParent: () => {
    if (!nE.current) {
      const a = new xU({});
      a.mount(window), a.setOptions({ layoutScroll: !0 }), nE.current = a;
    }
    return nE.current;
  },
  resetTransform: (a, l) => {
    a.style.transform = l !== void 0 ? l : "none";
  },
  checkIsScrollRoot: (a) => window.getComputedStyle(a).position === "fixed"
}), wU = {
  pan: {
    Feature: $z
  },
  drag: {
    Feature: Yz,
    ProjectionNode: rD,
    MeasureLayout: Qk
  }
};
function p1(a, l, c) {
  const { props: p } = a;
  a.animationState && p.whileHover && a.animationState.setActive("whileHover", c === "Start");
  const g = "onHover" + c, E = p[g];
  E && xn.postRender(() => E(l, om(l)));
}
class RU extends Mu {
  mount() {
    const { current: l } = this.node;
    l && (this.unmount = eV(l, (c, p) => (p1(this.node, p, "Start"), (g) => p1(this.node, g, "End"))));
  }
  unmount() {
  }
}
class kU extends Mu {
  constructor() {
    super(...arguments), this.isActive = !1;
  }
  onFocus() {
    let l = !1;
    try {
      l = this.node.current.matches(":focus-visible");
    } catch {
      l = !0;
    }
    !l || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0);
  }
  onBlur() {
    !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1);
  }
  mount() {
    this.unmount = rm(nm(this.node.current, "focus", () => this.onFocus()), nm(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
function h1(a, l, c) {
  const { props: p } = a;
  if (a.current instanceof HTMLButtonElement && a.current.disabled)
    return;
  a.animationState && p.whileTap && a.animationState.setActive("whileTap", c === "Start");
  const g = "onTap" + (c === "End" ? "" : c), E = p[g];
  E && xn.postRender(() => E(l, om(l)));
}
class DU extends Mu {
  mount() {
    const { current: l } = this.node;
    l && (this.unmount = iV(l, (c, p) => (h1(this.node, p, "Start"), (g, { success: E }) => h1(this.node, g, E ? "End" : "Cancel")), { useGlobalTarget: this.node.props.globalTapTarget }));
  }
  unmount() {
  }
}
const AE = /* @__PURE__ */ new WeakMap(), rE = /* @__PURE__ */ new WeakMap(), _U = (a) => {
  const l = AE.get(a.target);
  l && l(a);
}, MU = (a) => {
  a.forEach(_U);
};
function OU({ root: a, ...l }) {
  const c = a || document;
  rE.has(c) || rE.set(c, {});
  const p = rE.get(c), g = JSON.stringify(l);
  return p[g] || (p[g] = new IntersectionObserver(MU, { root: a, ...l })), p[g];
}
function AU(a, l, c) {
  const p = OU(l);
  return AE.set(a, c), p.observe(a), () => {
    AE.delete(a), p.unobserve(a);
  };
}
const LU = {
  some: 0,
  all: 1
};
class NU extends Mu {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    this.unmount();
    const { viewport: l = {} } = this.node.getProps(), { root: c, margin: p, amount: g = "some", once: E } = l, h = {
      root: c ? c.current : void 0,
      rootMargin: p,
      threshold: typeof g == "number" ? g : LU[g]
    }, x = (b) => {
      const { isIntersecting: R } = b;
      if (this.isInView === R || (this.isInView = R, E && !R && this.hasEnteredView))
        return;
      R && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", R);
      const { onViewportEnter: D, onViewportLeave: M } = this.node.getProps(), A = R ? D : M;
      A && A(b);
    };
    return AU(this.node.current, h, x);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props: l, prevProps: c } = this.node;
    ["amount", "margin", "root"].some(PU(l, c)) && this.startObserver();
  }
  unmount() {
  }
}
function PU({ viewport: a = {} }, { viewport: l = {} } = {}) {
  return (c) => a[c] !== l[c];
}
const VU = {
  inView: {
    Feature: NU
  },
  tap: {
    Feature: DU
  },
  focus: {
    Feature: kU
  },
  hover: {
    Feature: RU
  }
}, zU = {
  layout: {
    ProjectionNode: rD,
    MeasureLayout: Qk
  }
}, UU = {
  ...xz,
  ...VU,
  ...wU,
  ...zU
}, m1 = /* @__PURE__ */ jV(UU, JV);
function LE(a) {
  const l = R1(() => Yc(a)), { isStatic: c } = at.useContext(rT);
  if (c) {
    const [, p] = at.useState(a);
    at.useEffect(() => l.on("change", p), []);
  }
  return l;
}
function FU(a, l) {
  const c = LE(l()), p = () => c.set(l());
  return p(), k1(() => {
    const g = () => xn.preRender(p, !1, !0), E = a.map((h) => h.on("change", g));
    return () => {
      E.forEach((h) => h()), Es(p);
    };
  }), c;
}
function v1(a, ...l) {
  const c = a.length;
  function p() {
    let g = "";
    for (let E = 0; E < c; E++) {
      g += a[E];
      const h = l[E];
      h && (g += Vr(h) ? h.get() : h);
    }
    return g;
  }
  return FU(l.filter(Vr), p);
}
function iD(a) {
  var l, c, p = "";
  if (typeof a == "string" || typeof a == "number") p += a;
  else if (typeof a == "object") if (Array.isArray(a)) {
    var g = a.length;
    for (l = 0; l < g; l++) a[l] && (c = iD(a[l])) && (p && (p += " "), p += c);
  } else for (c in a) a[c] && (p && (p += " "), p += c);
  return p;
}
function jU() {
  for (var a, l, c = 0, p = "", g = arguments.length; c < g; c++) (a = arguments[c]) && (l = iD(a)) && (p && (p += " "), p += l);
  return p;
}
const BU = (a, l) => {
  const c = new Array(a.length + l.length);
  for (let p = 0; p < a.length; p++)
    c[p] = a[p];
  for (let p = 0; p < l.length; p++)
    c[a.length + p] = l[p];
  return c;
}, HU = (a, l) => ({
  classGroupId: a,
  validator: l
}), aD = (a = /* @__PURE__ */ new Map(), l = null, c) => ({
  nextPart: a,
  validators: l,
  classGroupId: c
}), Tg = "-", y1 = [], IU = "arbitrary..", YU = (a) => {
  const l = WU(a), {
    conflictingClassGroups: c,
    conflictingClassGroupModifiers: p
  } = a;
  return {
    getClassGroupId: (h) => {
      if (h.startsWith("[") && h.endsWith("]"))
        return $U(h);
      const x = h.split(Tg), b = x[0] === "" && x.length > 1 ? 1 : 0;
      return oD(x, b, l);
    },
    getConflictingClassGroupIds: (h, x) => {
      if (x) {
        const b = p[h], R = c[h];
        return b ? R ? BU(R, b) : b : R || y1;
      }
      return c[h] || y1;
    }
  };
}, oD = (a, l, c) => {
  if (a.length - l === 0)
    return c.classGroupId;
  const g = a[l], E = c.nextPart.get(g);
  if (E) {
    const R = oD(a, l + 1, E);
    if (R) return R;
  }
  const h = c.validators;
  if (h === null)
    return;
  const x = l === 0 ? a.join(Tg) : a.slice(l).join(Tg), b = h.length;
  for (let R = 0; R < b; R++) {
    const D = h[R];
    if (D.validator(x))
      return D.classGroupId;
  }
}, $U = (a) => a.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const l = a.slice(1, -1), c = l.indexOf(":"), p = l.slice(0, c);
  return p ? IU + p : void 0;
})(), WU = (a) => {
  const {
    theme: l,
    classGroups: c
  } = a;
  return GU(c, l);
}, GU = (a, l) => {
  const c = aD();
  for (const p in a) {
    const g = a[p];
    pT(g, c, p, l);
  }
  return c;
}, pT = (a, l, c, p) => {
  const g = a.length;
  for (let E = 0; E < g; E++) {
    const h = a[E];
    KU(h, l, c, p);
  }
}, KU = (a, l, c, p) => {
  if (typeof a == "string") {
    QU(a, l, c);
    return;
  }
  if (typeof a == "function") {
    XU(a, l, c, p);
    return;
  }
  qU(a, l, c, p);
}, QU = (a, l, c) => {
  const p = a === "" ? l : lD(l, a);
  p.classGroupId = c;
}, XU = (a, l, c, p) => {
  if (ZU(a)) {
    pT(a(p), l, c, p);
    return;
  }
  l.validators === null && (l.validators = []), l.validators.push(HU(c, a));
}, qU = (a, l, c, p) => {
  const g = Object.entries(a), E = g.length;
  for (let h = 0; h < E; h++) {
    const [x, b] = g[h];
    pT(b, lD(l, x), c, p);
  }
}, lD = (a, l) => {
  let c = a;
  const p = l.split(Tg), g = p.length;
  for (let E = 0; E < g; E++) {
    const h = p[E];
    let x = c.nextPart.get(h);
    x || (x = aD(), c.nextPart.set(h, x)), c = x;
  }
  return c;
}, ZU = (a) => "isThemeGetter" in a && a.isThemeGetter === !0, JU = (a) => {
  if (a < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let l = 0, c = /* @__PURE__ */ Object.create(null), p = /* @__PURE__ */ Object.create(null);
  const g = (E, h) => {
    c[E] = h, l++, l > a && (l = 0, p = c, c = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(E) {
      let h = c[E];
      if (h !== void 0)
        return h;
      if ((h = p[E]) !== void 0)
        return g(E, h), h;
    },
    set(E, h) {
      E in c ? c[E] = h : g(E, h);
    }
  };
}, NE = "!", g1 = ":", eF = [], S1 = (a, l, c, p, g) => ({
  modifiers: a,
  hasImportantModifier: l,
  baseClassName: c,
  maybePostfixModifierPosition: p,
  isExternal: g
}), tF = (a) => {
  const {
    prefix: l,
    experimentalParseClassName: c
  } = a;
  let p = (g) => {
    const E = [];
    let h = 0, x = 0, b = 0, R;
    const D = g.length;
    for (let re = 0; re < D; re++) {
      const ie = g[re];
      if (h === 0 && x === 0) {
        if (ie === g1) {
          E.push(g.slice(b, re)), b = re + 1;
          continue;
        }
        if (ie === "/") {
          R = re;
          continue;
        }
      }
      ie === "[" ? h++ : ie === "]" ? h-- : ie === "(" ? x++ : ie === ")" && x--;
    }
    const M = E.length === 0 ? g : g.slice(b);
    let A = M, j = !1;
    M.endsWith(NE) ? (A = M.slice(0, -1), j = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      M.startsWith(NE) && (A = M.slice(1), j = !0)
    );
    const q = R && R > b ? R - b : void 0;
    return S1(E, j, A, q);
  };
  if (l) {
    const g = l + g1, E = p;
    p = (h) => h.startsWith(g) ? E(h.slice(g.length)) : S1(eF, !1, h, void 0, !0);
  }
  if (c) {
    const g = p;
    p = (E) => c({
      className: E,
      parseClassName: g
    });
  }
  return p;
}, nF = (a) => {
  const l = /* @__PURE__ */ new Map();
  return a.orderSensitiveModifiers.forEach((c, p) => {
    l.set(c, 1e6 + p);
  }), (c) => {
    const p = [];
    let g = [];
    for (let E = 0; E < c.length; E++) {
      const h = c[E], x = h[0] === "[", b = l.has(h);
      x || b ? (g.length > 0 && (g.sort(), p.push(...g), g = []), p.push(h)) : g.push(h);
    }
    return g.length > 0 && (g.sort(), p.push(...g)), p;
  };
}, rF = (a) => ({
  cache: JU(a.cacheSize),
  parseClassName: tF(a),
  sortModifiers: nF(a),
  ...YU(a)
}), iF = /\s+/, aF = (a, l) => {
  const {
    parseClassName: c,
    getClassGroupId: p,
    getConflictingClassGroupIds: g,
    sortModifiers: E
  } = l, h = [], x = a.trim().split(iF);
  let b = "";
  for (let R = x.length - 1; R >= 0; R -= 1) {
    const D = x[R], {
      isExternal: M,
      modifiers: A,
      hasImportantModifier: j,
      baseClassName: q,
      maybePostfixModifierPosition: re
    } = c(D);
    if (M) {
      b = D + (b.length > 0 ? " " + b : b);
      continue;
    }
    let ie = !!re, ue = p(ie ? q.substring(0, re) : q);
    if (!ue) {
      if (!ie) {
        b = D + (b.length > 0 ? " " + b : b);
        continue;
      }
      if (ue = p(q), !ue) {
        b = D + (b.length > 0 ? " " + b : b);
        continue;
      }
      ie = !1;
    }
    const he = A.length === 0 ? "" : A.length === 1 ? A[0] : E(A).join(":"), ne = j ? he + NE : he, Se = ne + ue;
    if (h.indexOf(Se) > -1)
      continue;
    h.push(Se);
    const ae = g(ue, ie);
    for (let Re = 0; Re < ae.length; ++Re) {
      const xe = ae[Re];
      h.push(ne + xe);
    }
    b = D + (b.length > 0 ? " " + b : b);
  }
  return b;
}, oF = (...a) => {
  let l = 0, c, p, g = "";
  for (; l < a.length; )
    (c = a[l++]) && (p = sD(c)) && (g && (g += " "), g += p);
  return g;
}, sD = (a) => {
  if (typeof a == "string")
    return a;
  let l, c = "";
  for (let p = 0; p < a.length; p++)
    a[p] && (l = sD(a[p])) && (c && (c += " "), c += l);
  return c;
}, lF = (a, ...l) => {
  let c, p, g, E;
  const h = (b) => {
    const R = l.reduce((D, M) => M(D), a());
    return c = rF(R), p = c.cache.get, g = c.cache.set, E = x, x(b);
  }, x = (b) => {
    const R = p(b);
    if (R)
      return R;
    const D = aF(b, c);
    return g(b, D), D;
  };
  return E = h, (...b) => E(oF(...b));
}, sF = [], wr = (a) => {
  const l = (c) => c[a] || sF;
  return l.isThemeGetter = !0, l;
}, uD = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, cD = /^\((?:(\w[\w-]*):)?(.+)\)$/i, uF = /^\d+\/\d+$/, cF = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, fF = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, dF = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, pF = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, hF = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, kd = (a) => uF.test(a), _t = (a) => !!a && !Number.isNaN(Number(a)), ku = (a) => !!a && Number.isInteger(Number(a)), iE = (a) => a.endsWith("%") && _t(a.slice(0, -1)), ys = (a) => cF.test(a), mF = () => !0, vF = (a) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  fF.test(a) && !dF.test(a)
), fD = () => !1, yF = (a) => pF.test(a), gF = (a) => hF.test(a), SF = (a) => !je(a) && !Be(a), CF = (a) => jd(a, hD, fD), je = (a) => uD.test(a), Uc = (a) => jd(a, mD, vF), aE = (a) => jd(a, wF, _t), C1 = (a) => jd(a, dD, fD), EF = (a) => jd(a, pD, gF), cg = (a) => jd(a, vD, yF), Be = (a) => cD.test(a), Wh = (a) => Bd(a, mD), TF = (a) => Bd(a, RF), E1 = (a) => Bd(a, dD), bF = (a) => Bd(a, hD), xF = (a) => Bd(a, pD), fg = (a) => Bd(a, vD, !0), jd = (a, l, c) => {
  const p = uD.exec(a);
  return p ? p[1] ? l(p[1]) : c(p[2]) : !1;
}, Bd = (a, l, c = !1) => {
  const p = cD.exec(a);
  return p ? p[1] ? l(p[1]) : c : !1;
}, dD = (a) => a === "position" || a === "percentage", pD = (a) => a === "image" || a === "url", hD = (a) => a === "length" || a === "size" || a === "bg-size", mD = (a) => a === "length", wF = (a) => a === "number", RF = (a) => a === "family-name", vD = (a) => a === "shadow", kF = () => {
  const a = wr("color"), l = wr("font"), c = wr("text"), p = wr("font-weight"), g = wr("tracking"), E = wr("leading"), h = wr("breakpoint"), x = wr("container"), b = wr("spacing"), R = wr("radius"), D = wr("shadow"), M = wr("inset-shadow"), A = wr("text-shadow"), j = wr("drop-shadow"), q = wr("blur"), re = wr("perspective"), ie = wr("aspect"), ue = wr("ease"), he = wr("animate"), ne = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], Se = () => [
    "center",
    "top",
    "bottom",
    "left",
    "right",
    "top-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-top",
    "top-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-top",
    "bottom-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-bottom",
    "bottom-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-bottom"
  ], ae = () => [...Se(), Be, je], Re = () => ["auto", "hidden", "clip", "visible", "scroll"], xe = () => ["auto", "contain", "none"], le = () => [Be, je, b], Xe = () => [kd, "full", "auto", ...le()], yt = () => [ku, "none", "subgrid", Be, je], Mt = () => ["auto", {
    span: ["full", ku, Be, je]
  }, ku, Be, je], gt = () => [ku, "auto", Be, je], We = () => ["auto", "min", "max", "fr", Be, je], Rt = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], pt = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], ht = () => ["auto", ...le()], ye = () => [kd, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...le()], K = () => [a, Be, je], De = () => [...Se(), E1, C1, {
    position: [Be, je]
  }], N = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], ee = () => ["auto", "cover", "contain", bF, CF, {
    size: [Be, je]
  }], be = () => [iE, Wh, Uc], Ie = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    R,
    Be,
    je
  ], Ne = () => ["", _t, Wh, Uc], bt = () => ["solid", "dashed", "dotted", "double"], mt = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], Ue = () => [_t, iE, E1, C1], ft = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    q,
    Be,
    je
  ], Ot = () => ["none", _t, Be, je], wn = () => ["none", _t, Be, je], mn = () => [_t, Be, je], Vn = () => [kd, "full", ...le()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [ys],
      breakpoint: [ys],
      color: [mF],
      container: [ys],
      "drop-shadow": [ys],
      ease: ["in", "out", "in-out"],
      font: [SF],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [ys],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [ys],
      shadow: [ys],
      spacing: ["px", _t],
      text: [ys],
      "text-shadow": [ys],
      tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
    },
    classGroups: {
      // --------------
      // --- Layout ---
      // --------------
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", kd, je, Be, ie]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [_t, je, Be, x]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": ne()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": ne()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: ae()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: Re()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": Re()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": Re()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: xe()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": xe()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": xe()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: Xe()
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": Xe()
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": Xe()
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: Xe()
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: Xe()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: Xe()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: Xe()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: Xe()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: Xe()
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: [ku, "auto", Be, je]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [kd, "full", "auto", x, ...le()]
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["nowrap", "wrap", "wrap-reverse"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: [_t, kd, "auto", "initial", "none", je]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", _t, Be, je]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", _t, Be, je]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [ku, "first", "last", "none", Be, je]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": yt()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: Mt()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": gt()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": gt()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": yt()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: Mt()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": gt()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": gt()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": We()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": We()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: le()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": le()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": le()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...Rt(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...pt(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...pt()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...Rt()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...pt(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...pt(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": Rt()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...pt(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...pt()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: le()
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: le()
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: le()
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: le()
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: le()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: le()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: le()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: le()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: le()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: ht()
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: ht()
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: ht()
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: ht()
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: ht()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: ht()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: ht()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: ht()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: ht()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": le()
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y": [{
        "space-y": le()
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y-reverse": ["space-y-reverse"],
      // --------------
      // --- Sizing ---
      // --------------
      /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */
      size: [{
        size: ye()
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [x, "screen", ...ye()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          x,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...ye()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          x,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [h]
          },
          ...ye()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...ye()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...ye()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", ...ye()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", c, Wh, Uc]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: [p, Be, aE]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", iE, je]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [TF, je, l]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: [g, Be, je]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [_t, "none", Be, aE]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          E,
          ...le()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", Be, je]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["disc", "decimal", "none", Be, je]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: K()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: K()
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...bt(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [_t, "from-font", "auto", Be, Uc]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: K()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [_t, "auto", Be, je]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: le()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", Be, je]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Overflow Wrap
       * @see https://tailwindcss.com/docs/overflow-wrap
       */
      wrap: [{
        wrap: ["break-word", "anywhere", "normal"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", Be, je]
      }],
      // -------------------
      // --- Backgrounds ---
      // -------------------
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: De()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: N()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: ee()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, ku, Be, je],
          radial: ["", Be, je],
          conic: [ku, Be, je]
        }, xF, EF]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: K()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: be()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: be()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: be()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: K()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: K()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: K()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: Ie()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": Ie()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": Ie()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": Ie()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": Ie()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": Ie()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": Ie()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": Ie()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": Ie()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": Ie()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": Ie()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": Ie()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": Ie()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": Ie()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": Ie()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: Ne()
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": Ne()
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": Ne()
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": Ne()
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": Ne()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": Ne()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": Ne()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": Ne()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": Ne()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": Ne()
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y": [{
        "divide-y": Ne()
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...bt(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...bt(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: K()
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": K()
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": K()
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": K()
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": K()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": K()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": K()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": K()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": K()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: K()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...bt(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [_t, Be, je]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", _t, Wh, Uc]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: K()
      }],
      // ---------------
      // --- Effects ---
      // ---------------
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          D,
          fg,
          cg
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: K()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", M, fg, cg]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": K()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: Ne()
      }],
      /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */
      "ring-color": [{
        ring: K()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [_t, Uc]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": K()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": Ne()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": K()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", A, fg, cg]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": K()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [_t, Be, je]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...mt(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": mt()
      }],
      /**
       * Mask Clip
       * @see https://tailwindcss.com/docs/mask-clip
       */
      "mask-clip": [{
        "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
      }, "mask-no-clip"],
      /**
       * Mask Composite
       * @see https://tailwindcss.com/docs/mask-composite
       */
      "mask-composite": [{
        mask: ["add", "subtract", "intersect", "exclude"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image-linear-pos": [{
        "mask-linear": [_t]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": Ue()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": Ue()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": K()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": K()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": Ue()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": Ue()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": K()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": K()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": Ue()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": Ue()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": K()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": K()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": Ue()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": Ue()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": K()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": K()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": Ue()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": Ue()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": K()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": K()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": Ue()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": Ue()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": K()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": K()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": Ue()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": Ue()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": K()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": K()
      }],
      "mask-image-radial": [{
        "mask-radial": [Be, je]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": Ue()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": Ue()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": K()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": K()
      }],
      "mask-image-radial-shape": [{
        "mask-radial": ["circle", "ellipse"]
      }],
      "mask-image-radial-size": [{
        "mask-radial": [{
          closest: ["side", "corner"],
          farthest: ["side", "corner"]
        }]
      }],
      "mask-image-radial-pos": [{
        "mask-radial-at": Se()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [_t]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": Ue()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": Ue()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": K()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": K()
      }],
      /**
       * Mask Mode
       * @see https://tailwindcss.com/docs/mask-mode
       */
      "mask-mode": [{
        mask: ["alpha", "luminance", "match"]
      }],
      /**
       * Mask Origin
       * @see https://tailwindcss.com/docs/mask-origin
       */
      "mask-origin": [{
        "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
      }],
      /**
       * Mask Position
       * @see https://tailwindcss.com/docs/mask-position
       */
      "mask-position": [{
        mask: De()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: N()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: ee()
      }],
      /**
       * Mask Type
       * @see https://tailwindcss.com/docs/mask-type
       */
      "mask-type": [{
        "mask-type": ["alpha", "luminance"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image": [{
        mask: ["none", Be, je]
      }],
      // ---------------
      // --- Filters ---
      // ---------------
      /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          Be,
          je
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: ft()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [_t, Be, je]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [_t, Be, je]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          j,
          fg,
          cg
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": K()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", _t, Be, je]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [_t, Be, je]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", _t, Be, je]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [_t, Be, je]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", _t, Be, je]
      }],
      /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          Be,
          je
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": ft()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [_t, Be, je]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [_t, Be, je]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", _t, Be, je]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [_t, Be, je]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", _t, Be, je]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [_t, Be, je]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [_t, Be, je]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", _t, Be, je]
      }],
      // --------------
      // --- Tables ---
      // --------------
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": le()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": le()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": le()
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // ---------------------------------
      // --- Transitions and Animation ---
      // ---------------------------------
      /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", Be, je]
      }],
      /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */
      "transition-behavior": [{
        transition: ["normal", "discrete"]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: [_t, "initial", Be, je]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", ue, Be, je]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [_t, Be, je]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", he, Be, je]
      }],
      // ------------------
      // --- Transforms ---
      // ------------------
      /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */
      backface: [{
        backface: ["hidden", "visible"]
      }],
      /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */
      perspective: [{
        perspective: [re, Be, je]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": ae()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: Ot()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": Ot()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": Ot()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": Ot()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: wn()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": wn()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": wn()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": wn()
      }],
      /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-3d": ["scale-3d"],
      /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */
      skew: [{
        skew: mn()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": mn()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": mn()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [Be, je, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ae()
      }],
      /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */
      "transform-style": [{
        transform: ["3d", "flat"]
      }],
      /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */
      translate: [{
        translate: Vn()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": Vn()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": Vn()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": Vn()
      }],
      /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-none": ["translate-none"],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: K()
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: K()
      }],
      /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */
      "color-scheme": [{
        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", Be, je]
      }],
      /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */
      "field-sizing": [{
        "field-sizing": ["fixed", "content"]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["auto", "none"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "", "y", "x"]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": le()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": le()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": le()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": le()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": le()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": le()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": le()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": le()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": le()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": le()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": le()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": le()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": le()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": le()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": le()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": le()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": le()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": le()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", Be, je]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...K()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [_t, Wh, Uc, aE]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...K()]
      }],
      // ---------------------
      // --- Accessibility ---
      // ---------------------
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      translate: ["translate-x", "translate-y", "translate-none"],
      "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    },
    orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
  };
}, DF = /* @__PURE__ */ lF(kF);
function _F(...a) {
  return DF(jU(a));
}
function MF({
  children: a,
  className: l,
  gradientSize: c = 220,
  gradientColor: p = "rgba(255,255,255,0.25)",
  gradientOpacity: g = 0.9,
  gradientFrom: E = "#9E7AFF",
  gradientTo: h = "#FE8BBB"
}) {
  const x = LE(-c), b = LE(-c), R = at.useCallback(() => {
    x.set(-c), b.set(-c);
  }, [c, x, b]), D = at.useCallback(
    (M) => {
      const A = M.currentTarget.getBoundingClientRect();
      x.set(M.clientX - A.left), b.set(M.clientY - A.top);
    },
    [x, b]
  );
  return at.useEffect(() => {
    R();
  }, [R]), at.useEffect(() => {
    const M = (j) => {
      j.relatedTarget || R();
    }, A = () => {
      document.visibilityState !== "visible" && R();
    };
    return window.addEventListener("pointerout", M), window.addEventListener("blur", R), document.addEventListener("visibilitychange", A), () => {
      window.removeEventListener("pointerout", M), window.removeEventListener("blur", R), document.removeEventListener("visibilitychange", A);
    };
  }, [R]), /* @__PURE__ */ Jn.jsxs(
    "div",
    {
      className: _F("magic-card", l),
      onPointerMove: D,
      onPointerLeave: R,
      onPointerEnter: R,
      children: [
        /* @__PURE__ */ Jn.jsx(
          m1.div,
          {
            className: "magic-card__border",
            style: {
              background: v1`
            radial-gradient(${c}px circle at ${x}px ${b}px,
              ${E},
              ${h},
              transparent 70%
            )`
            }
          }
        ),
        /* @__PURE__ */ Jn.jsx("div", { className: "magic-card__surface" }),
        /* @__PURE__ */ Jn.jsx(
          m1.div,
          {
            className: "magic-card__glow",
            style: {
              background: v1`
            radial-gradient(${c}px circle at ${x}px ${b}px, ${p}, transparent 100%)
          `,
              opacity: g
            }
          }
        ),
        /* @__PURE__ */ Jn.jsx("div", { className: "magic-card__body", children: a })
      ]
    }
  );
}
const OF = () => /* @__PURE__ */ Jn.jsx("div", { className: "magic-card-shell", children: /* @__PURE__ */ Jn.jsxs(MF, { className: "magic-card--login", children: [
  /* @__PURE__ */ Jn.jsxs("div", { className: "magic-card-header", children: [
    /* @__PURE__ */ Jn.jsx("h3", { children: "Login" }),
    /* @__PURE__ */ Jn.jsx("p", { children: "Enter your credentials to access your account" })
  ] }),
  /* @__PURE__ */ Jn.jsxs("div", { className: "magic-card-content", children: [
    /* @__PURE__ */ Jn.jsx("label", { className: "magic-card-label", htmlFor: "react-email", children: "Email" }),
    /* @__PURE__ */ Jn.jsx(
      "input",
      {
        id: "react-email",
        type: "email",
        placeholder: "name@example.com",
        className: "magic-card-input"
      }
    ),
    /* @__PURE__ */ Jn.jsx("label", { className: "magic-card-label", htmlFor: "react-password", children: "Password" }),
    /* @__PURE__ */ Jn.jsx(
      "input",
      {
        id: "react-password",
        type: "password",
        className: "magic-card-input"
      }
    )
  ] }),
  /* @__PURE__ */ Jn.jsx("div", { className: "magic-card-footer", children: /* @__PURE__ */ Jn.jsx("button", { type: "button", className: "magic-card-button", children: "Sign In" }) })
] }) }), T1 = document.getElementById("auth-react-root");
T1 && uE(T1).render(/* @__PURE__ */ Jn.jsx(OF, {}));
