$(document).ready(function () {
    // Retrieve the token from local storage
    var token = localStorage.getItem('token');
    var username = localStorage.getItem('username');
    $("#currentUser").html(username);

    if (!token) {
        window.location.href = '/login.html';
    }

    var table = $("#responsableTable").DataTable({

        ajax: "/api/responsable/getAll",
        columns: [
            { data: 'username' },
            { data: 'password' },
            {
                data: null,
                render: function (data, type, row) {
                    return '<button type="button" class="btn btn-success btn-sm modify-button">Modifier</button>';
                }
            },
            {
                data: null,
                render: function (data, type, row) {
                    return '<button type="button" class="btn btn-danger btn-sm delete-button">Supprimer</button>';
                }
            }
        ],
        "autoWidth": false,
        responsive: true,
        "order": [[1, 'asc']],
        buttons: [ 'copy', 'excel', 'pdf', 'print' ],
        dom: 'Bfrtip'

    });

    
    $('#responsableTable tbody').on('click', '.modify-button', function () {
        var dataTable = $(this).closest('table').DataTable();
        var data = dataTable.row($(this).closest('tr')).data();
        // Fill the input fields with the data from the clicked row
        $("#username").val(data.username);
        $("#password").val(data.password);
        $("#resp").val(data.id_res);
        $("#respmod").modal("show");
    });

    $('#responsableTable tbody').on('click', '.delete-button', function () {
        var dataTable = $(this).closest('table').DataTable();
        var data = dataTable.row($(this).closest('tr')).data();
        var id = data.id_res;

        $.ajax({
            url: "/api/responsable/delete/" + id,
            method: "delete",
            success: function (response) {
                console.log(response);
                table.ajax.reload();
            },
            error: function (error) {
                console.log(error);
                // Handle error
            }
        });
    });

    $("#clear").click(function () {
        $("#username").val("");
        $("#password").val("");
        $("#resp").val("0");
    });

    $("#save_responsable").click(function () {
        var username = $("#username").val();
        var password = $("#password").val();
        var id_res = $("#resp").val();
        var url = "";
        var method = "";

        if (id_res == 0) {
            method = "POST";
            url = "/api/auth/register";
        } else {
            url = "/api/auth/updates/"+id_res;
            method = "PUT";
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

        $.ajax({
            url: url,
            method: method,
            data: { username: username, password: password },
            success: function (response) {
                console.log(response);
                $("#username").val("");
                $("#password").val("");
                $("#resp").val("0");
                table.ajax.reload();
                $("#respmod").modal("hide");
            },
            error: function (error) {
                console.log(error);
                // Handle error
            }
        });
    });
});
