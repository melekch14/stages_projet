// JavaScript
$(document).ready(function () {
  $('#submit').click(function () {
    var username = $('#username').val();
    var password = $('#password').val();

    // Validate inputs
    if (!username || !password) {
      console.log('Username and password are required.');
      return;
    }

    // Disable the submit button during the AJAX request
    $('#submit').prop('disabled', true);

    $.ajax({
      url: '/api/auth/login',
      method: 'POST',
      data: { username, password },
      success: function (response) {
        var x = parseJwt(response.token);
        console.log(x.userId);
        localStorage.setItem('token', response.token);
        localStorage.setItem('userid', x.userId);
        localStorage.setItem('username', x.username);
        // Handle successful login
        window.location.href = '/index.html'; // Redirect to the home page
      },
      error: function (error) {
        console.log(error);
        // Handle login error
      },
      complete: function () {
        // Re-enable the submit button after the AJAX request is complete
        $('#submit').prop('disabled', false);
      }
    });
  });
  function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }
});
