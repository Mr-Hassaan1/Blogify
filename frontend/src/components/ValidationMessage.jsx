function ValidationMessage({ name, errors, children }) {
  const message = errors ? errors[name] : children;
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-500">{message}</p>;
}

export default ValidationMessage;
