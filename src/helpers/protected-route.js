import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, path, children }) => {
  if (user) {
    return children;
  } else if (!user) {
    return <Navigate to={path} />;
  } else {
    return null;
  }
};

export default ProtectedRoute;
