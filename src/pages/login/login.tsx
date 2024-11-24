
const LoginPage
 = () => {
  return (
    <>
    <h1>Sign In</h1>
    <input type="text" placeholder="Username" />
    <input type="password" placeholder="Password" />
    <button>Log In</button>
    <label htmlFor="remember-me">Remember me</label>
    <input type="checkbox" name="" id="remember-me" />
    <a href="#">Forget password</a>
    </>
  )
}

export default LoginPage
