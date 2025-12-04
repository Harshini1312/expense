const React = require('react');

function BrowserRouter({ children }) {
  return React.createElement(React.Fragment, null, children);
}

function Routes({ children }) {
  return React.createElement(React.Fragment, null, children);
}

function Route({ element }) {
  return element || null;
}

function Link({ children, to }) {
  return React.createElement('a', { href: to }, children);
}

function useNavigate() {
  return () => {};
}

module.exports = {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
};
