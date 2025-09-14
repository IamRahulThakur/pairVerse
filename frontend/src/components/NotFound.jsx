const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold text-red-500">404</h1>
      <p className="text-lg text-gray-600">Oops! Page not found.</p>
      <a href="/feed" className="btn btn-primary mt-4">Go Home</a>
    </div>
  );
};

export default NotFound;
