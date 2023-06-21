//retrieve the head
var head = document.getElementsByTagName('head')[0];
//add the meta tag to the head
var meta = document.createElement('meta');
meta.name = "viewport";
meta.content = "width=device-width, initial-scale=1.0";
head.appendChild(meta);

//retrieve the script
var script = document.querySelector(`script[src="${__JS_PACKAGE_HOST__}/LoginClient.js"]`); //TODO: make this dynamic

//add the buttons to the page
script.insertAdjacentHTML('afterend', /*html*/`
    <style>
      /* CSS styles for the buttons */
      .button {
        display: inline-block;
        padding: 10px 20px;
        font-size: 16px;
        border-radius: 5px;
        cursor: pointer;
        /* Remove the border and add a box-shadow */
        border: none;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        text-decoration: none;
        margin: 4px;
      }

      .button-login {
        /* Change the color to black */
        background-color: black;
        color: white;
      }

      .button-logout {
        /* Change the color to white */
        background-color: white;
        color: black;
      }

      /* CSS styles for the page layout */
      body {
        margin: 0;
        padding: 20px;
        font-family: sans-serif;
        text-align: center;
      }

      .button-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      }

    </style>

      <div class="button-container">
        <!-- Login button -->
        <a class="button button-login" id="login-script">Login</a>

        <!-- Logout button -->
        <a class="button button-logout" id="logout">Logout</a>
    </div>
`);


//set href of login-script, with redirect uri to current page
var loginLink = "https://edit-blog-content-from-site.azurewebsites.net/api/authorizeRequestHandler?redirect_uri=" + encodeURIComponent(window.location.href);
document.getElementById("login-script").href = loginLink;
document.getElementById("logout").href = window.location.origin;

//set onclick of logout to clear session cookies
document.getElementById("logout").onclick = () => {
    var editBlogContentFromSiteSession = localStorage.getItem("edit-blog-content-from-site-session");
    if (editBlogContentFromSiteSession) {
        localStorage.removeItem("edit-blog-content-from-site-session");
    }
}

//handle when redirect comes back, set session cookie
var params = (new URL(window.location.href)).searchParams;
var editBlogContentFromSiteSession = params.get('edit-blog-content-from-site');
if(editBlogContentFromSiteSession){ //if user just logged in, redirect
    localStorage.setItem("edit-blog-content-from-site-session", editBlogContentFromSiteSession);
    window.location.href = window.location.origin; //redirect to home
}