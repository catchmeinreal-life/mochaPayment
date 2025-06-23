import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ children, isAuthenticated}) {

    return isAuthenticated ? children : <Navigate to={'/login'} replace />;

    // if (!isAuthenticated) {
    //     // Redirect them to the /login page, but save the current location they were
    //     // trying to go to when they were redirected.
    //     return <Navigate to="/login" replace />;
    // }
    
    // return children ? children : <Outlet />;
}

export default ProtectedRoute;


// function ProtectedRoute({ isAllowed, redirectPath = '/login' }) {
//   if (!isAllowed) {
//     // Redirect them to the /login page, but save the current location they were
//     // trying to go to when they were redirected.
//     return <Navigate to={redirectPath} replace />;
//   }

//   return <Outlet />;
// }

// ProtectedRoute.propTypes = {
//   isAllowed: PropTypes.bool.isRequired,
//     redirectPath: PropTypes.string,