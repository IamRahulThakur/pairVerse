const adminAuth = (req, res, next) =>  {
  // Middleware logic for admin authentication
  console.log('Admin authentication middleware triggered');
  const authenticationString = "xyz";
  const checkAuth = "xyz"
  if(checkAuth !== authenticationString) {
      return res.status(403).send('Forbidden: Admin access required');
  }
  else {
      console.log('Admin authenticated successfully');
      next();
  }  
}

export default adminAuth;