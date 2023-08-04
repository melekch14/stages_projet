$(document).ready(function () {

    var token = localStorage.getItem('token');
    var username = localStorage.getItem('username');
    $("#currentUser").html(username);

    if (!token) {
        window.location.href = '/login.html';
    }

    $('#disconnectBtn').click(function () {
        $.ajax({
          url: '/api/auth/disconnect',
          method: 'POST',
          success: function (response) {
            console.log(response);
            localStorage.removeItem('token'); // Remove the token from local storage
            window.location.href = '/login.html';
          },
          error: function (error) {
            console.log(error);
          }
        });
      });

    function alertSuccess()
    {
        var Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });

        Toast.fire({
            icon: 'success',
            title: 'success'
          })
    }

    function alertError()
    {
        var Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });

        Toast.fire({
            icon: 'error',
            title: 'error'
          })
    }

    $("#import").click(function () {

        const formData = new FormData();
        formData.append("excelFile", $("#fileInput")[0].files[0]);

        $.ajax({
            type: "POST",
            url: "api/import/insert-excel-data",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                $("#result").html(response.message);
                console.log(response.message);
                $("#modalResult").modal('show');
                $("#fileInput").val("");
                alertSuccess();
            },
            error: function (xhr, status, error) {
                alertError();
            }
        });
    });
});